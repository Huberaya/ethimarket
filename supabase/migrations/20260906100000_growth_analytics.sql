-- =============================================================
-- EthiMarket — Analytics de croissance (RGPD-first, zéro coût)
--
-- Philosophie : PAS de tracker tiers, PAS de cookie, PAS de
-- donnée personnelle. On enregistre des ÉVÉNEMENTS anonymes
-- (page vue par type, inscription, devis, commande) avec un
-- identifiant de session éphémère (généré côté client, jamais
-- relié à l'utilisateur), la source d'acquisition (utm/referrer
-- tronqué au domaine) et la locale. Pas de bandeau cookies requis.
--
-- get_growth_stats() agrège pour la page admin « Croissance » :
-- funnel, GMV, conversions, sources — jamais de données brutes.
-- =============================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id bigserial PRIMARY KEY,
  event text NOT NULL CHECK (event IN (
    'page_view', 'signup', 'quote_requested', 'order_created', 'product_view'
  )),
  -- session anonyme éphémère (uuid généré côté client, stocké en sessionStorage)
  session_id uuid,
  -- catégorie de page (home, catalogue, product, shop, blog, pro, vendor, other)
  page_kind text,
  -- source d'acquisition : utm_source ou domaine du referrer (jamais l'URL complète)
  source text,
  locale text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics_events(event, created_at DESC);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Écriture : tout le monde (anonyme inclus) — c'est le principe d'un compteur
-- de passage. Aucune lecture publique.
DROP POLICY IF EXISTS "analytics_insert" ON analytics_events;
CREATE POLICY "analytics_insert" ON analytics_events FOR INSERT TO anon, authenticated
  WITH CHECK (true);
-- Lecture : admin uniquement (via la fonction agrégée de préférence)
DROP POLICY IF EXISTS "analytics_admin_read" ON analytics_events;
CREATE POLICY "analytics_admin_read" ON analytics_events FOR SELECT TO authenticated
  USING (is_admin_user());

-- Purge automatique à 13 mois (durée CNIL pour mesures d'audience)
CREATE OR REPLACE FUNCTION purge_old_analytics()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer;
BEGIN
  DELETE FROM analytics_events WHERE created_at < now() - interval '13 months';
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END; $$;

-- Branchée sur le cron quotidien existant
CREATE OR REPLACE FUNCTION trust_daily_review()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
  RETURN jsonb_build_object(
    'claims_evaluated', claims_count,
    'certs_degraded', degraded_count,
    'rasff_matched', rasff_matched,
    'analytics_purged', purged
  );
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- Agrégats pour la page admin « Croissance »
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_growth_stats(p_days integer DEFAULT 30)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_since timestamptz := now() - make_interval(days => p_days);
BEGIN
  IF NOT is_admin_user() THEN RAISE EXCEPTION 'ADMIN_ONLY'; END IF;

  RETURN jsonb_build_object(
    -- Funnel période
    'funnel', jsonb_build_object(
      'sessions', (SELECT count(DISTINCT session_id) FROM analytics_events WHERE created_at > v_since AND session_id IS NOT NULL),
      'page_views', (SELECT count(*) FROM analytics_events WHERE event = 'page_view' AND created_at > v_since),
      'product_views', (SELECT count(*) FROM analytics_events WHERE event = 'product_view' AND created_at > v_since),
      'signups', (SELECT count(*) FROM profiles WHERE created_at > v_since),
      'quotes', (SELECT count(*) FROM quote_requests WHERE created_at > v_since),
      'orders', (SELECT count(*) FROM orders WHERE created_at > v_since)
    ),
    -- Business
    'business', jsonb_build_object(
      'gmv', coalesce((SELECT sum(total_amount) FROM orders WHERE created_at > v_since AND status NOT IN ('cancelled', 'refunded')), 0),
      'commission', coalesce((SELECT sum(commission_amount) FROM orders WHERE created_at > v_since AND status NOT IN ('cancelled', 'refunded')), 0),
      'aov', coalesce((SELECT round(avg(total_amount), 2) FROM orders WHERE created_at > v_since AND status NOT IN ('cancelled', 'refunded')), 0),
      'quote_to_order_pct', (
        SELECT CASE WHEN count(*) = 0 THEN 0
          ELSE round(100.0 * count(*) FILTER (WHERE status = 'accepted') / count(*), 1) END
        FROM quote_requests WHERE created_at > v_since
      )
    ),
    -- Sources de trafic (top 10)
    'sources', coalesce((
      SELECT jsonb_agg(jsonb_build_object('source', s.source, 'sessions', s.cnt) ORDER BY s.cnt DESC)
      FROM (
        SELECT coalesce(nullif(source, ''), 'direct') AS source, count(DISTINCT session_id) AS cnt
        FROM analytics_events WHERE created_at > v_since
        GROUP BY 1 ORDER BY cnt DESC LIMIT 10
      ) s
    ), '[]'::jsonb),
    -- Série hebdo (8 semaines) : inscriptions, devis, commandes
    'weekly', coalesce((
      SELECT jsonb_agg(jsonb_build_object(
        'week', w.week, 'signups', w.signups, 'quotes', w.quotes, 'orders', w.orders
      ) ORDER BY w.week)
      FROM (
        SELECT to_char(d, 'IYYY-IW') AS week,
          (SELECT count(*) FROM profiles p WHERE date_trunc('week', p.created_at) = d) AS signups,
          (SELECT count(*) FROM quote_requests q WHERE date_trunc('week', q.created_at) = d) AS quotes,
          (SELECT count(*) FROM orders o WHERE date_trunc('week', o.created_at) = d) AS orders
        FROM generate_series(date_trunc('week', now()) - interval '7 weeks', date_trunc('week', now()), interval '1 week') d
      ) w
    ), '[]'::jsonb),
    'period_days', p_days,
    'generated_at', now()
  );
END;
$$;

REVOKE ALL ON FUNCTION get_growth_stats(integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION get_growth_stats(integer) TO authenticated;
