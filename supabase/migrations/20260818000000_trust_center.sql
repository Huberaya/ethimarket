-- =============================================================
-- EthiMarket Trust Center — allégations sourcées par produit
-- S'appuie sur le module existant : producer_certifications,
-- certification_bodies (20260814000000_...).
--
-- Garanties d'intégrité :
--  * verification_status TOUJOURS calculé (trigger + RPC), jamais
--    accepté tel quel d'un client non-admin.
--  * Les fournisseurs ne peuvent créer que des preuves niveau <= 2.
--  * claim_status_log immuable (ni UPDATE ni DELETE).
-- =============================================================

-- 1. ENUMS ------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE claim_type_enum AS ENUM (
    'organic_material','fair_trade','living_wage','social_conditions',
    'no_child_labor','vegan','recycled_content','carbon_footprint',
    'origin','manufacturing_location','raw_material_origin','packaging',
    'animal_welfare','water_usage','other'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE claim_verification_status_enum AS ENUM (
    'verified','pending_verification','declared_only','expired','contradicted'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE evidence_type_enum AS ENUM (
    'certificate_verified','certificate_on_file','audit_report',
    'platform_check','supplier_document','supplier_declaration'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE evidence_check_result_enum AS ENUM (
    'confirmed','pending','not_checked','rejected'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABLES -----------------------------------------------------

CREATE TABLE IF NOT EXISTS product_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  claim_type claim_type_enum NOT NULL,
  claim_label TEXT NOT NULL,
  claim_value TEXT,
  declared_by TEXT NOT NULL DEFAULT 'supplier' CHECK (declared_by IN ('supplier','platform')),
  verification_status claim_verification_status_enum NOT NULL DEFAULT 'declared_only',
  evaluated_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (product_id, claim_type, claim_label)
);

CREATE TABLE IF NOT EXISTS claim_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES product_claims(id) ON DELETE CASCADE,
  evidence_type evidence_type_enum NOT NULL,
  reference_number TEXT,
  issuing_body_id UUID REFERENCES certification_bodies(id) ON DELETE SET NULL,
  source_url TEXT,
  document_path TEXT,
  valid_from DATE,
  valid_until DATE,
  check_result evidence_check_result_enum NOT NULL DEFAULT 'not_checked',
  checked_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  checked_by_name TEXT,
  checked_at TIMESTAMPTZ,
  producer_certification_id UUID REFERENCES producer_certifications(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS claim_status_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES product_claims(id) ON DELETE CASCADE,
  previous_status claim_verification_status_enum,
  new_status claim_verification_status_enum NOT NULL,
  reason TEXT NOT NULL,
  triggered_by TEXT NOT NULL DEFAULT 'evaluation_engine'
    CHECK (triggered_by IN ('evaluation_engine','admin_action','scheduled_review','certificate_update')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_claims_product ON product_claims(product_id);
CREATE INDEX IF NOT EXISTS idx_product_claims_review ON product_claims(next_review_at)
  WHERE next_review_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_claim_evidence_claim ON claim_evidence(claim_id);
CREATE INDEX IF NOT EXISTS idx_claim_evidence_cert ON claim_evidence(producer_certification_id)
  WHERE producer_certification_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_claim_status_log_claim ON claim_status_log(claim_id);

-- 3. NIVEAUX DE PREUVE (fonction utilitaire) --------------------
CREATE OR REPLACE FUNCTION evidence_level(t evidence_type_enum)
RETURNS integer LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE t
    WHEN 'certificate_verified' THEN 5
    WHEN 'certificate_on_file'  THEN 4
    WHEN 'audit_report'         THEN 4
    WHEN 'platform_check'       THEN 3
    WHEN 'supplier_document'    THEN 2
    WHEN 'supplier_declaration' THEN 1
  END;
$$;

-- 4. MOTEUR D'ÉVALUATION SQL (miroir strict d'evaluateClaim TS) --
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

  -- Règle 1 : contradiction domine tout
  IF EXISTS (
    SELECT 1 FROM claim_evidence e
    LEFT JOIN producer_certifications pc ON pc.id = e.producer_certification_id
    WHERE e.claim_id = p_claim_id
      AND (e.check_result = 'rejected' OR pc.status = 'rejected')
  ) THEN
    v_new := 'contradicted';
    v_reason := 'Preuve rejetée lors du contrôle';

  -- Règle 2 : preuve forte confirmée et valide
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

  -- Règle 3 : preuve forte confirmée mais expirée
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

  -- Règle 4 : preuve niveau >= 3 en cours de contrôle
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

  -- Règle 5 : déclaratif uniquement
  ELSE
    v_new := 'declared_only';
    v_reason := 'Aucune preuve indépendante';
  END IF;

  UPDATE product_claims
  SET verification_status = v_new,
      evaluated_at = now(),
      next_review_at = v_next_review,
      updated_at = now()
  WHERE id = p_claim_id;

  IF v_old IS DISTINCT FROM v_new THEN
    INSERT INTO claim_status_log (claim_id, previous_status, new_status, reason, triggered_by)
    VALUES (p_claim_id, v_old, v_new, v_reason, 'evaluation_engine');
  END IF;

  RETURN v_new;
END;
$$;

-- Ré-évaluation en lot des claims arrivées à échéance (cron quotidien)
CREATE OR REPLACE FUNCTION evaluate_due_claims()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_count integer := 0;
  r RECORD;
BEGIN
  FOR r IN
    SELECT id FROM product_claims
    WHERE next_review_at IS NOT NULL AND next_review_at <= now()
  LOOP
    PERFORM evaluate_claim_status(r.id);
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;

-- 5. TRIGGERS D'INTÉGRITÉ --------------------------------------

-- 5a. Un non-admin ne peut JAMAIS fixer verification_status lui-même.
CREATE OR REPLACE FUNCTION enforce_claim_status_integrity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_uid uuid;
  v_is_admin boolean;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN RETURN NEW; END IF;  -- session infra de confiance (service_role, SQL editor, cron)

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

DROP TRIGGER IF EXISTS trg_claim_status_integrity ON product_claims;
CREATE TRIGGER trg_claim_status_integrity
  BEFORE INSERT OR UPDATE ON product_claims
  FOR EACH ROW EXECUTE FUNCTION enforce_claim_status_integrity();

-- 5b. Un non-admin ne peut créer que des preuves de niveau <= 2, jamais "confirmed".
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
    IF evidence_level(NEW.evidence_type) > 2 THEN
      RAISE EXCEPTION 'Seuls les administrateurs peuvent enregistrer des preuves de niveau supérieur à 2';
    END IF;
    NEW.check_result := 'not_checked';
    NEW.checked_by := NULL;
    NEW.checked_by_name := NULL;
    NEW.checked_at := NULL;
    NEW.producer_certification_id := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_evidence_level_integrity ON claim_evidence;
CREATE TRIGGER trg_evidence_level_integrity
  BEFORE INSERT OR UPDATE ON claim_evidence
  FOR EACH ROW EXECUTE FUNCTION enforce_evidence_level_integrity();

-- 5c. Ré-évaluer la claim à chaque modification de preuve.
CREATE OR REPLACE FUNCTION reevaluate_claim_on_evidence_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM evaluate_claim_status(COALESCE(NEW.claim_id, OLD.claim_id));
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_reevaluate_on_evidence ON claim_evidence;
CREATE TRIGGER trg_reevaluate_on_evidence
  AFTER INSERT OR UPDATE OR DELETE ON claim_evidence
  FOR EACH ROW EXECUTE FUNCTION reevaluate_claim_on_evidence_change();

-- 5d. Quand un certificat producteur change de statut, ré-évaluer les claims liées.
CREATE OR REPLACE FUNCTION reevaluate_claims_on_cert_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE r RECORD;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status OR NEW.expires_at IS DISTINCT FROM OLD.expires_at THEN
    FOR r IN SELECT DISTINCT claim_id FROM claim_evidence WHERE producer_certification_id = NEW.id
    LOOP
      PERFORM evaluate_claim_status(r.claim_id);
      INSERT INTO claim_status_log (claim_id, previous_status, new_status, reason, triggered_by)
      SELECT r.claim_id, NULL, verification_status,
             'Mise à jour du certificat ' || COALESCE(NEW.certificate_number,''), 'certificate_update'
      FROM product_claims WHERE id = r.claim_id;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reevaluate_claims_on_cert ON producer_certifications;
CREATE TRIGGER trg_reevaluate_claims_on_cert
  AFTER UPDATE ON producer_certifications
  FOR EACH ROW EXECUTE FUNCTION reevaluate_claims_on_cert_change();

-- 6. VUE AGRÉGÉE ------------------------------------------------
CREATE OR REPLACE VIEW product_trust_summary AS
SELECT
  product_id,
  COUNT(*)                                                         AS total_claims,
  COUNT(*) FILTER (WHERE verification_status = 'verified')          AS verified_claims,
  COUNT(*) FILTER (WHERE verification_status = 'pending_verification') AS pending_claims,
  COUNT(*) FILTER (WHERE verification_status = 'declared_only')     AS declared_only_claims,
  COUNT(*) FILTER (WHERE verification_status = 'expired')           AS expired_claims,
  COUNT(*) FILTER (WHERE verification_status = 'contradicted')      AS contradicted_claims,
  ROUND(
    COUNT(*) FILTER (WHERE verification_status = 'verified')::numeric
    / NULLIF(COUNT(*), 0), 2
  ) AS trust_ratio
FROM product_claims
GROUP BY product_id;

-- 7. RLS --------------------------------------------------------
ALTER TABLE product_claims  ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_evidence  ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_status_log ENABLE ROW LEVEL SECURITY;

-- Lecture publique : le Trust Center est PUBLIC par définition.
CREATE POLICY "claims_public_read" ON product_claims
  FOR SELECT USING (true);
CREATE POLICY "evidence_public_read" ON claim_evidence
  FOR SELECT USING (true);
CREATE POLICY "status_log_public_read" ON claim_status_log
  FOR SELECT USING (true);

-- Fournisseur : ne gère que les claims de SES produits.
CREATE POLICY "claims_supplier_insert" ON product_claims
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM products p
      JOIN producers pr ON pr.id = p.producer_id
      WHERE p.id = product_claims.product_id AND pr.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin)
  );

CREATE POLICY "claims_owner_or_admin_update" ON product_claims
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM products p
      JOIN producers pr ON pr.id = p.producer_id
      WHERE p.id = product_claims.product_id AND pr.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin)
  );

CREATE POLICY "evidence_supplier_or_admin_insert" ON claim_evidence
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM product_claims c
      JOIN products p ON p.id = c.product_id
      JOIN producers pr ON pr.id = p.producer_id
      WHERE c.id = claim_evidence.claim_id AND pr.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin)
  );

-- Seuls les admins modifient / suppriment des preuves.
CREATE POLICY "evidence_admin_update" ON claim_evidence
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin));
CREATE POLICY "evidence_admin_delete" ON claim_evidence
  FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin));

-- Journal immuable : INSERT via fonctions SECURITY DEFINER uniquement,
-- aucune policy UPDATE/DELETE => impossibles.
CREATE POLICY "status_log_no_direct_insert" ON claim_status_log
  FOR INSERT WITH CHECK (false);

GRANT EXECUTE ON FUNCTION evaluate_claim_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION evaluate_due_claims() TO authenticated;
