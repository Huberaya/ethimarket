-- =============================================================
-- EthiMarket — Transparence des vérifications + dégradation auto
--
-- 1. get_producer_trust_summary(producer_id) : vue PUBLIQUE et
--    ANONYMISÉE des vérifications d'un producteur — les acheteurs
--    voient QUELS contrôles ont été passés (méthode + date + n°
--    de critère), jamais les notes internes ni les références
--    complètes. C'est la vitrine du protocole EthiMarket Verified.
--
-- 2. Dégradation automatique : chaque nuit (cron existant
--    trust-daily-review), les certifications producteur expirées
--    invalident le critère certificationValid par une preuve
--    'fail' système — le producteur perd son niveau de confiance
--    jusqu'à contre-preuve (certificat renouvelé).
-- =============================================================

-- ── 1. Résumé public des vérifications ──
CREATE OR REPLACE FUNCTION get_producer_trust_summary(p_producer_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'producer_id', p_producer_id,
    'generated_at', now(),
    -- critères prouvés (état courant, même logique que l'admin :
    -- dernier pass non suivi d'un fail)
    'criteria', (
      SELECT coalesce(jsonb_object_agg(c.criterion, c.proven), '{}'::jsonb)
      FROM (
        SELECT
          e.criterion,
          (
            -- Conservateur : à horodatage égal, le fail l'emporte
            SELECT e2.outcome = 'pass'
            FROM verification_evidences e2
            WHERE e2.producer_id = p_producer_id AND e2.criterion = e.criterion
            ORDER BY e2.created_at DESC, (e2.outcome = 'fail') DESC
            LIMIT 1
          ) AS proven
        FROM verification_evidences e
        WHERE e.producer_id = p_producer_id
        GROUP BY e.criterion
      ) c
    ),
    -- contrôles passés : méthode + date, SANS notes ni références
    'checks', (
      SELECT coalesce(jsonb_agg(jsonb_build_object(
        'criterion', e.criterion,
        'method', e.evidence_type,
        'checked_on', to_char(e.created_at, 'YYYY-MM-DD')
      ) ORDER BY e.created_at), '[]'::jsonb)
      FROM verification_evidences e
      WHERE e.producer_id = p_producer_id AND e.outcome = 'pass'
    ),
    'checks_count', (
      SELECT count(*) FROM verification_evidences e
      WHERE e.producer_id = p_producer_id AND e.outcome = 'pass'
    ),
    'last_check_at', (
      SELECT max(e.created_at) FROM verification_evidences e
      WHERE e.producer_id = p_producer_id
    )
  );
$$;

-- Lisible par tous (anon inclus) : c'est le principe de transparence.
GRANT EXECUTE ON FUNCTION get_producer_trust_summary(uuid) TO anon, authenticated;

-- ── 2. Dégradation automatique sur certification expirée ──
-- NB : la logique « dernier pass non suivi de fail » fait qu'une
-- preuve fail système postérieure invalide le critère ; quand le
-- producteur fournit un certificat renouvelé, l'admin ajoute une
-- preuve pass qui réhabilite. Rien n'est jamais effacé.
CREATE OR REPLACE FUNCTION degrade_expired_certifications()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_count integer := 0;
  r RECORD;
  sys_user uuid;
BEGIN
  -- Compte système : le premier admin (créateur de la plateforme)
  SELECT id INTO sys_user FROM profiles WHERE is_admin = true ORDER BY created_at LIMIT 1;
  IF sys_user IS NULL THEN RETURN 0; END IF;

  FOR r IN
    SELECT DISTINCT pc.producer_id, pc.certificate_number, pc.certification_type, pc.expires_at
    FROM producer_certifications pc
    WHERE pc.expires_at IS NOT NULL
      AND pc.expires_at < now()
      AND pc.status NOT IN ('expired', 'revoked')
      -- le critère est actuellement prouvé (sinon rien à dégrader)
      AND (
        SELECT e.outcome = 'pass'
        FROM verification_evidences e
        WHERE e.producer_id = pc.producer_id AND e.criterion = 'certificationValid'
        ORDER BY e.created_at DESC, (e.outcome = 'fail') DESC LIMIT 1
      )
      -- pas déjà dégradé pour CE certificat
      AND NOT EXISTS (
        SELECT 1 FROM verification_evidences e
        WHERE e.producer_id = pc.producer_id
          AND e.criterion = 'certificationValid'
          AND e.outcome = 'fail'
          AND e.reference = 'auto-expiry:' || coalesce(pc.certificate_number, pc.id::text)
      )
  LOOP
    INSERT INTO verification_evidences
      (producer_id, criterion, evidence_type, reference, note, outcome, checked_by)
    VALUES (
      r.producer_id, 'certificationValid', 'other',
      'auto-expiry:' || coalesce(r.certificate_number, 'sans-numero'),
      'Dégradation automatique : la certification ' || coalesce(r.certification_type, '')
        || ' (n° ' || coalesce(r.certificate_number, '—') || ') a expiré le '
        || to_char(r.expires_at, 'DD/MM/YYYY') || '. Fournir un certificat renouvelé pour réhabilitation.',
      'fail', sys_user
    );
    -- Marque la certification expirée
    UPDATE producer_certifications SET status = 'expired'
    WHERE producer_id = r.producer_id
      AND coalesce(certificate_number, id::text) = coalesce(r.certificate_number, certificate_number, id::text)
      AND expires_at = r.expires_at;
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;

-- Branche la dégradation sur le cron quotidien existant
CREATE OR REPLACE FUNCTION trust_daily_review()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  claims_count integer;
  degraded_count integer;
BEGIN
  claims_count := evaluate_due_claims();
  degraded_count := degrade_expired_certifications();
  RETURN jsonb_build_object('claims_evaluated', claims_count, 'certs_degraded', degraded_count);
END;
$$;

SELECT cron.unschedule('trust-daily-review');
SELECT cron.schedule('trust-daily-review', '0 3 * * *', 'SELECT trust_daily_review()');
