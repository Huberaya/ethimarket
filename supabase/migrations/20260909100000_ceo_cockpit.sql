-- Cockpit CEO (plan stratégique §12) — « Que dois-je faire maintenant ? »
-- Un seul appel SQL agrège tout ce qui exige une action ou mesure le cap.
-- Les PRIORITÉS sont calculées côté front par un moteur de RÈGLES
-- déterministe (pas d'IA) ; cette fonction ne fait que fournir les faits.

CREATE OR REPLACE FUNCTION get_ceo_cockpit()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  SELECT p.is_admin INTO v_is_admin FROM profiles p WHERE p.id = auth.uid();
  IF NOT coalesce(v_is_admin, false) THEN
    RAISE EXCEPTION 'ADMIN_ONLY';
  END IF;

  RETURN jsonb_build_object(
    -- ============ SIGNAUX D'ACTION ============
    'incidents_open', (SELECT count(*) FROM product_incidents WHERE status = 'open'),
    'emails_failed_7d', (SELECT count(*) FROM email_log WHERE status = 'failed' AND created_at > now() - interval '7 days'),
    'client_errors_7d', coalesce((SELECT sum(count) FROM client_errors WHERE last_seen_at > now() - interval '7 days'), 0),
    'cron_last_failed', coalesce((
      SELECT d.status <> 'succeeded' FROM cron.job_run_details d
      ORDER BY d.start_time DESC LIMIT 1
    ), false),

    -- Prospection : relances dues (aujourd'hui ou en retard)
    'prospect_actions_due', (
      SELECT count(*) FROM prospects
      WHERE next_action_date IS NOT NULL AND next_action_date <= current_date
        AND status NOT IN ('refus', 'stop', 'actif')
    ),
    'prospect_due_list', coalesce((
      SELECT jsonb_agg(jsonb_build_object(
        'name', name, 'kind', kind, 'next_action', next_action,
        'next_action_date', next_action_date, 'phone', phone, 'status', status
      ) ORDER BY next_action_date ASC)
      FROM (
        SELECT * FROM prospects
        WHERE next_action_date IS NOT NULL AND next_action_date <= current_date
          AND status NOT IN ('refus', 'stop', 'actif')
        ORDER BY next_action_date ASC LIMIT 8
      ) p
    ), '[]'::jsonb),

    -- Prospection : pipeline au point mort (aucune action planifiée)
    'prospects_no_next_action', (
      SELECT count(*) FROM prospects
      WHERE phase = 1 AND status IN ('contacte', 'relance', 'en_discussion')
        AND next_action_date IS NULL
    ),

    -- Files opérationnelles
    'coa_awaiting', (SELECT count(*) FROM lot_analyses WHERE status = 'report_received'),
    'verifications_pending', (
      SELECT count(*) FROM certification_verification_requests WHERE status::text IN ('pending', 'sent', 'in_progress')
    ),
    'producer_verifs_pending', (SELECT count(*) FROM producers WHERE verification_status = 'pending'),
    'quotes_unanswered_48h', (
      SELECT count(*) FROM quote_requests
      WHERE status::text = 'sent' AND responded_at IS NULL
        AND created_at < now() - interval '48 hours'
    ),
    'labs_pending', (SELECT count(*) FROM laboratories WHERE trust_level = 'pending' AND is_active = true),

    -- ============ CAP (KPI vs plan phase 1) ============
    'orders_delivered_total', (SELECT count(*) FROM orders WHERE status = 'delivered'),
    'orders_30d', (SELECT count(*) FROM orders WHERE created_at > now() - interval '30 days'),
    'gmv_30d', coalesce((
      SELECT sum(coalesce(total_amount, total_price, 0)) FROM orders
      WHERE created_at > now() - interval '30 days'
        AND status NOT IN ('cancelled')
    ), 0),
    'active_buyers_90d', (
      SELECT count(DISTINCT buyer_id) FROM orders WHERE created_at > now() - interval '90 days'
    ),
    'repeat_buyers', (
      SELECT count(*) FROM (
        SELECT buyer_id FROM orders GROUP BY buyer_id HAVING count(*) >= 2
      ) r
    ),
    'producers_verified', (SELECT count(*) FROM producers WHERE verification_status = 'verified'),
    'prospects_signed', (SELECT count(*) FROM prospects WHERE status IN ('inscrit', 'actif')),
    'prospects_contacted', (SELECT count(*) FROM prospects WHERE status NOT IN ('a_contacter')),
    'prospects_total', (SELECT count(*) FROM prospects),
    'signups_7d', (
      SELECT count(*) FROM analytics_events WHERE event = 'signup' AND created_at > now() - interval '7 days'
    ),
    'quotes_7d', (
      SELECT count(*) FROM quote_requests WHERE created_at > now() - interval '7 days'
    ),

    'generated_at', now()
  );
END;
$$;

REVOKE ALL ON FUNCTION get_ceo_cockpit() FROM public, anon;
GRANT EXECUTE ON FUNCTION get_ceo_cockpit() TO authenticated;
