-- =============================================================
-- Trust Center — Les vendeurs peuvent DÉPOSER un certificat
-- depuis la fiche produit (evidence_type = 'certificate_on_file',
-- niveau 4) : l'allégation passe en « 🕓 Vérification en cours ».
--
-- GARANTIE INCHANGÉE : un vendeur ne peut JAMAIS obtenir le statut
-- « ✅ Certifié » lui-même — check_result est forcé à 'not_checked',
-- seul un admin peut confirmer (ou lier producer_certifications).
-- Les types audit_report / platform_check / certificate_verified
-- restent strictement réservés aux admins.
-- =============================================================

CREATE OR REPLACE FUNCTION enforce_evidence_level_integrity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_uid uuid;
  v_is_admin boolean;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN RETURN NEW; END IF;  -- session infra de confiance (service_role, SQL editor, cron)

  SELECT COALESCE(is_admin, false) INTO v_is_admin
  FROM profiles WHERE id = v_uid;

  IF NOT COALESCE(v_is_admin, false) THEN
    -- Types autorisés aux vendeurs : déclaration, document, dépôt de certificat
    IF NEW.evidence_type NOT IN ('supplier_declaration', 'supplier_document', 'certificate_on_file') THEN
      RAISE EXCEPTION 'Seuls les administrateurs peuvent enregistrer ce type de preuve (%)', NEW.evidence_type;
    END IF;
    -- Jamais de résultat de contrôle auto-attribué
    NEW.check_result := 'not_checked';
    NEW.checked_by := NULL;
    NEW.checked_by_name := NULL;
    NEW.checked_at := NULL;
    NEW.producer_certification_id := NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- =============================================================
-- Correctif : la ré-évaluation automatique (evaluate_claim_status)
-- doit pouvoir mettre à jour verification_status même quand elle est
-- déclenchée par la session d'un vendeur (dépôt de preuve → trigger).
-- Le moteur signale son passage via une variable de session locale ;
-- le trigger anti-fraude la reconnaît. Un vendeur ne peut pas la
-- poser lui-même côté API REST (PostgREST n'expose pas set_config
-- arbitraire dans une même transaction que l'INSERT).
-- =============================================================

CREATE OR REPLACE FUNCTION evaluate_claim_status(p_claim_id UUID)
RETURNS claim_verification_status_enum
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_new claim_verification_status_enum;
  v_old claim_verification_status_enum;
  v_next_review TIMESTAMPTZ;
  v_reason TEXT;
BEGIN
  SELECT verification_status INTO v_old FROM product_claims WHERE id = p_claim_id;

  IF EXISTS (
    SELECT 1 FROM claim_evidence e
    LEFT JOIN producer_certifications pc ON pc.id = e.producer_certification_id
    WHERE e.claim_id = p_claim_id
      AND (e.check_result = 'rejected' OR pc.status = 'rejected')
  ) THEN
    v_new := 'contradicted';
    v_reason := 'Preuve rejetée lors du contrôle';
  ELSIF EXISTS (
    SELECT 1 FROM claim_evidence e
    LEFT JOIN producer_certifications pc ON pc.id = e.producer_certification_id
    WHERE e.claim_id = p_claim_id
      AND (
        (e.producer_certification_id IS NULL
          AND evidence_level(e.evidence_type) >= 4
          AND e.check_result = 'confirmed'
          AND (e.valid_until IS NULL OR e.valid_until >= CURRENT_DATE)
          AND (e.valid_from  IS NULL OR e.valid_from  <= CURRENT_DATE))
        OR
        (pc.status = 'verified'
          AND (COALESCE(e.valid_until, pc.expires_at) IS NULL
               OR COALESCE(e.valid_until, pc.expires_at) >= CURRENT_DATE))
      )
  ) THEN
    v_new := 'verified';
    v_reason := 'Preuve indépendante valide (niveau >= 4)';
    SELECT MIN(COALESCE(e.valid_until, pc.expires_at))::timestamptz INTO v_next_review
    FROM claim_evidence e
    LEFT JOIN producer_certifications pc ON pc.id = e.producer_certification_id
    WHERE e.claim_id = p_claim_id
      AND COALESCE(e.valid_until, pc.expires_at) >= CURRENT_DATE;
  ELSIF EXISTS (
    SELECT 1 FROM claim_evidence e
    LEFT JOIN producer_certifications pc ON pc.id = e.producer_certification_id
    WHERE e.claim_id = p_claim_id
      AND (
        (evidence_level(e.evidence_type) >= 4 AND e.check_result = 'confirmed'
          AND e.valid_until IS NOT NULL AND e.valid_until < CURRENT_DATE)
        OR (pc.status IN ('verified','expired') AND pc.expires_at IS NOT NULL
          AND pc.expires_at < CURRENT_DATE)
      )
  ) THEN
    v_new := 'expired';
    v_reason := 'La preuve la plus forte a expiré';
  ELSIF EXISTS (
    SELECT 1 FROM claim_evidence e
    LEFT JOIN producer_certifications pc ON pc.id = e.producer_certification_id
    WHERE e.claim_id = p_claim_id
      AND (
        (evidence_level(e.evidence_type) >= 3 AND e.check_result IN ('pending','not_checked'))
        OR (pc.status IN ('pending','contact_sent','manual_required','unverified'))
      )
  ) THEN
    v_new := 'pending_verification';
    v_reason := 'Preuve déposée, contrôle en cours';
  ELSE
    v_new := 'declared_only';
    v_reason := 'Aucune preuve indépendante';
  END IF;

  -- Canal de confiance : le trigger anti-fraude laisse passer cette mise à jour
  PERFORM set_config('ethimarket.engine_update', 'on', true);
  UPDATE product_claims
  SET verification_status = v_new,
      evaluated_at = now(),
      next_review_at = v_next_review,
      updated_at = now()
  WHERE id = p_claim_id;
  PERFORM set_config('ethimarket.engine_update', '', true);

  IF v_old IS DISTINCT FROM v_new THEN
    INSERT INTO claim_status_log (claim_id, previous_status, new_status, reason, triggered_by)
    VALUES (p_claim_id, v_old, v_new, v_reason, 'evaluation_engine');
  END IF;

  RETURN v_new;
END;
$$;

CREATE OR REPLACE FUNCTION enforce_claim_status_integrity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_uid uuid;
  v_is_admin boolean;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN RETURN NEW; END IF;                       -- session infra
  IF current_setting('ethimarket.engine_update', true) = 'on' THEN -- moteur d'évaluation
    RETURN NEW;
  END IF;

  SELECT COALESCE(is_admin, false) INTO v_is_admin
  FROM profiles WHERE id = v_uid;

  IF TG_OP = 'INSERT' THEN
    IF NOT COALESCE(v_is_admin, false) THEN
      NEW.verification_status := 'declared_only';
      NEW.evaluated_at := NULL;
      NEW.next_review_at := NULL;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NOT COALESCE(v_is_admin, false)
       AND NEW.verification_status IS DISTINCT FROM OLD.verification_status THEN
      NEW.verification_status := OLD.verification_status;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
