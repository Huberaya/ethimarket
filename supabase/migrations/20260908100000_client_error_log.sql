-- Monitoring d'erreurs front (chantier #7) — zéro coût, zéro tracker tiers.
-- Le front enregistre ses erreurs JS non interceptées dans client_errors ;
-- la page /admin/sante les remonte. Rate-limité côté client, dédupliqué
-- côté serveur (fingerprint), purgé automatiquement à 90 jours par le cron.

CREATE TABLE IF NOT EXISTS client_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint text NOT NULL,          -- hash message+source, pour dédupliquer
  message text NOT NULL,
  source text,                        -- fichier:ligne:col ou 'unhandledrejection'
  page text,                          -- pathname (jamais de query string : pas de PII)
  user_agent text,
  count integer NOT NULL DEFAULT 1,   -- occurrences agrégées sur le fingerprint
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS client_errors_fingerprint_idx ON client_errors (fingerprint);
CREATE INDEX IF NOT EXISTS client_errors_last_seen_idx ON client_errors (last_seen_at DESC);

ALTER TABLE client_errors ENABLE ROW LEVEL SECURITY;

-- Lecture : admin uniquement.
DROP POLICY IF EXISTS client_errors_admin_read ON client_errors;
CREATE POLICY client_errors_admin_read ON client_errors
  FOR SELECT USING (is_admin_user());

-- Pas d'INSERT direct : tout passe par la fonction (contrôle + upsert).
CREATE OR REPLACE FUNCTION log_client_error(
  p_message text,
  p_source text DEFAULT NULL,
  p_page text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_msg text;
  v_fp text;
BEGIN
  -- garde-fous : tronquer, refuser le vide
  v_msg := left(coalesce(trim(p_message), ''), 500);
  IF v_msg = '' THEN RETURN; END IF;

  v_fp := md5(v_msg || '|' || left(coalesce(p_source, ''), 300));

  INSERT INTO client_errors (fingerprint, message, source, page, user_agent)
  VALUES (v_fp, v_msg, left(p_source, 300), left(p_page, 200), left(p_user_agent, 300))
  ON CONFLICT (fingerprint) DO UPDATE SET
    count = client_errors.count + 1,
    last_seen_at = now(),
    page = coalesce(excluded.page, client_errors.page);
END;
$$;

-- accessible aux anonymes (les erreurs arrivent avant login aussi),
-- mais uniquement via la fonction — la table reste fermée.
GRANT EXECUTE ON FUNCTION log_client_error(text, text, text, text) TO anon, authenticated;

-- Purge 90 jours, greffée sur la routine quotidienne existante.
CREATE OR REPLACE FUNCTION purge_old_client_errors() RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  DELETE FROM client_errors WHERE last_seen_at < now() - interval '90 days';
$$;

-- Intégration à get_platform_health() : bloc "client_errors".
CREATE OR REPLACE FUNCTION get_platform_health_client_errors()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'total_7d', coalesce((SELECT sum(count) FROM client_errors WHERE last_seen_at > now() - interval '7 days'), 0),
    'distinct_7d', (SELECT count(*) FROM client_errors WHERE last_seen_at > now() - interval '7 days'),
    'recent', coalesce((
      SELECT jsonb_agg(jsonb_build_object(
        'message', message, 'source', source, 'page', page,
        'count', count, 'last_seen_at', last_seen_at
      ) ORDER BY last_seen_at DESC)
      FROM (SELECT * FROM client_errors ORDER BY last_seen_at DESC LIMIT 10) recent
    ), '[]'::jsonb)
  );
$$;

REVOKE ALL ON FUNCTION get_platform_health_client_errors() FROM public, anon;
GRANT EXECUTE ON FUNCTION get_platform_health_client_errors() TO authenticated;

-- Greffe de la purge dans la routine quotidienne trust_daily_review().
CREATE OR REPLACE FUNCTION public.trust_daily_review()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  claims_count integer;
  degraded_count integer;
  rasff_matched integer;
  purged integer;
BEGIN
  claims_count := evaluate_due_claims();
  degraded_count := degrade_expired_certifications();
  rasff_matched := rasff_process_responses();
  PERFORM rasff_poll_request();
  purged := purge_old_analytics();
  PERFORM purge_old_client_errors();
  RETURN jsonb_build_object(
    'claims_evaluated', claims_count,
    'certs_degraded', degraded_count,
    'rasff_matched', rasff_matched,
    'analytics_purged', purged
  );
END;
$function$;
