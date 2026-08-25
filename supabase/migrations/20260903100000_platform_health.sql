-- =============================================================
-- EthiMarket — Santé de la plateforme (vue admin)
--
-- get_platform_health() : agrégat pour la page /admin/sante —
-- e-mails transactionnels (email_log), exécutions du cron
-- quotidien (cron.job_run_details, inaccessible en RLS => exposé
-- ici en SECURITY DEFINER, admin only), veille RASFF, volumes
-- métier. Zéro coût : lecture seule sur des tables existantes.
-- =============================================================

CREATE OR REPLACE FUNCTION get_platform_health()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  SELECT p.is_admin INTO v_is_admin FROM profiles p WHERE p.id = auth.uid();
  IF NOT coalesce(v_is_admin, false) THEN
    RAISE EXCEPTION 'ADMIN_ONLY';
  END IF;

  RETURN jsonb_build_object(
    -- E-mails : 30 derniers jours par statut + 20 derniers envois
    'emails', jsonb_build_object(
      'by_status', coalesce((
        SELECT jsonb_object_agg(status, cnt) FROM (
          SELECT status, count(*) AS cnt FROM email_log
          WHERE created_at > now() - interval '30 days' GROUP BY status
        ) s
      ), '{}'::jsonb),
      'recent', coalesce((
        SELECT jsonb_agg(jsonb_build_object(
          'recipient', e.recipient, 'kind', e.kind, 'subject', e.subject,
          'status', e.status, 'error', e.error, 'created_at', e.created_at
        ) ORDER BY e.created_at DESC)
        FROM (SELECT * FROM email_log ORDER BY created_at DESC LIMIT 20) e
      ), '[]'::jsonb)
    ),
    -- Cron quotidien : 7 dernières exécutions
    'cron', coalesce((
      SELECT jsonb_agg(jsonb_build_object(
        'status', d.status, 'started_at', d.start_time,
        'message', left(coalesce(d.return_message, ''), 200)
      ) ORDER BY d.start_time DESC)
      FROM (
        SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 7
      ) d
    ), '[]'::jsonb),
    -- Veille RASFF : dernières requêtes + alertes retenues
    'rasff', jsonb_build_object(
      'alerts_total', (SELECT count(*) FROM rasff_alerts),
      'last_alert_at', (SELECT max(created_at) FROM rasff_alerts),
      'polls_pending', (SELECT count(*) FROM rasff_poll_log WHERE processed = false)
    ),
    -- Volumes métier du moment
    'business', jsonb_build_object(
      'producers', (SELECT count(*) FROM producers),
      'products_active', (SELECT count(*) FROM products WHERE status = 'active'),
      'orders_30d', (SELECT count(*) FROM orders WHERE created_at > now() - interval '30 days'),
      'quotes_30d', (SELECT count(*) FROM quote_requests WHERE created_at > now() - interval '30 days'),
      'incidents_open', (SELECT count(*) FROM product_incidents WHERE status = 'open'),
      'analyses_awaiting', (SELECT count(*) FROM lot_analyses WHERE status = 'report_received'),
      'labs_pending', (SELECT count(*) FROM laboratories WHERE trust_level = 'pending' AND is_active = true)
    ),
    'generated_at', now()
  );
END;
$$;

REVOKE ALL ON FUNCTION get_platform_health() FROM public, anon;
GRANT EXECUTE ON FUNCTION get_platform_health() TO authenticated;
