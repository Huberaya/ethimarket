-- =============================================================
-- EthiMarket — Analyses de laboratoire par lot
-- (couche 4 du Product Trust Pipeline — Phase 2)
--
-- Circuit : requested → sample_sent → report_received →
--           verified | rejected (verdict admin uniquement)
--
-- Automatismes :
--  • verified + commande liée → le document coa_lot du dossier
--    de lot passe à 'provided' avec la référence du rapport
--    (le producteur n'a rien à re-saisir) ;
--  • rejected → incident qualité ouvert (source 'analysis'),
--    traitable dans /admin/incidents avec la boucle de
--    dégradation existante.
--
-- Zéro coût plateforme : l'analyse (100-400 €) est payée par le
-- lot ; EthiMarket orchestre et vérifie. Les labos se choisissent
-- via l'annuaire local labDirectory.ts (réseaux mondiaux +
-- registres d'accréditation ILAC/COFRAC publics).
-- =============================================================

CREATE TABLE IF NOT EXISTS lot_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  producer_id uuid REFERENCES producers(id) ON DELETE SET NULL,
  requested_by uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  -- Quelle analyse (libellé issu de ANALYSIS_FOR_HAZARD ou libre)
  analysis_label text NOT NULL CHECK (length(trim(analysis_label)) >= 3),
  hazard text,                               -- clé EuHazard si issue du moteur de risque
  status text NOT NULL DEFAULT 'requested' CHECK (status IN (
    'requested', 'sample_sent', 'report_received', 'verified', 'rejected'
  )),
  -- Renseigné au fil du circuit
  lab_name text,
  lab_country text,
  report_number text,
  report_url text,
  -- Verdict admin
  admin_note text,
  verified_by uuid REFERENCES profiles(id),
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lot_analyses_order ON lot_analyses(order_id);
CREATE INDEX IF NOT EXISTS idx_lot_analyses_status ON lot_analyses(status, created_at DESC);

ALTER TABLE lot_analyses ENABLE ROW LEVEL SECURITY;

-- Participants de la commande + admin : lecture
DROP POLICY IF EXISTS "la_select" ON lot_analyses;
CREATE POLICY "la_select" ON lot_analyses FOR SELECT TO authenticated
  USING (
    requested_by = auth.uid()
    OR EXISTS (SELECT 1 FROM orders o WHERE o.id = lot_analyses.order_id AND o.buyer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM producers pr WHERE pr.id = lot_analyses.producer_id AND pr.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- Création : acheteur ou producteur de la commande (ou admin), en son nom
DROP POLICY IF EXISTS "la_insert" ON lot_analyses;
CREATE POLICY "la_insert" ON lot_analyses FOR INSERT TO authenticated
  WITH CHECK (
    requested_by = auth.uid()
    AND (
      EXISTS (SELECT 1 FROM orders o WHERE o.id = lot_analyses.order_id AND o.buyer_id = auth.uid())
      OR EXISTS (SELECT 1 FROM producers pr WHERE pr.id = lot_analyses.producer_id AND pr.user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
    )
  );

-- Avancement : participants + admin (la légalité des transitions
-- est portée par le trigger ci-dessous, pas par la policy)
DROP POLICY IF EXISTS "la_update" ON lot_analyses;
CREATE POLICY "la_update" ON lot_analyses FOR UPDATE TO authenticated
  USING (
    requested_by = auth.uid()
    OR EXISTS (SELECT 1 FROM orders o WHERE o.id = lot_analyses.order_id AND o.buyer_id = auth.uid())
    OR EXISTS (SELECT 1 FROM producers pr WHERE pr.id = lot_analyses.producer_id AND pr.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- ─────────────────────────────────────────────────────────────
-- Garde des transitions (miroir SQL de canTransitionAnalysis)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION enforce_analysis_transitions()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_is_admin boolean := false;
BEGIN
  NEW.updated_at := now();
  IF NEW.status = OLD.status THEN RETURN NEW; END IF;

  -- États finaux intouchables
  IF OLD.status IN ('verified', 'rejected') THEN
    RAISE EXCEPTION 'ANALYSIS_FINAL_STATE';
  END IF;

  SELECT p.is_admin INTO v_is_admin FROM profiles p WHERE p.id = auth.uid();
  v_is_admin := coalesce(v_is_admin, false);

  IF NEW.status IN ('verified', 'rejected') THEN
    -- Verdict : admin uniquement, rapport en main, note obligatoire
    IF NOT v_is_admin THEN RAISE EXCEPTION 'ANALYSIS_VERDICT_ADMIN_ONLY'; END IF;
    IF OLD.status <> 'report_received' THEN RAISE EXCEPTION 'ANALYSIS_REPORT_REQUIRED_FIRST'; END IF;
    IF NEW.admin_note IS NULL OR length(trim(NEW.admin_note)) < 10 THEN
      RAISE EXCEPTION 'ANALYSIS_NOTE_TOO_SHORT';
    END IF;
    NEW.verified_by := auth.uid();
    NEW.verified_at := now();
  ELSE
    -- Avancée pas à pas : requested → sample_sent → report_received
    IF NOT (
      (OLD.status = 'requested' AND NEW.status = 'sample_sent')
      OR (OLD.status = 'sample_sent' AND NEW.status = 'report_received')
    ) THEN
      RAISE EXCEPTION 'ANALYSIS_ILLEGAL_TRANSITION:%->%', OLD.status, NEW.status;
    END IF;
    -- Un rapport déclaré reçu doit exister (référence ou fichier)
    IF NEW.status = 'report_received'
       AND (NEW.report_number IS NULL OR trim(NEW.report_number) = '')
       AND (NEW.report_url IS NULL OR trim(NEW.report_url) = '') THEN
      RAISE EXCEPTION 'ANALYSIS_REPORT_REF_REQUIRED';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_analysis_transitions ON lot_analyses;
CREATE TRIGGER trg_analysis_transitions BEFORE UPDATE ON lot_analyses
  FOR EACH ROW EXECUTE FUNCTION enforce_analysis_transitions();

-- ─────────────────────────────────────────────────────────────
-- Automatismes post-verdict
-- ─────────────────────────────────────────────────────────────

-- La source 'analysis' rejoint les incidents qualité
ALTER TABLE product_incidents DROP CONSTRAINT IF EXISTS product_incidents_source_check;
ALTER TABLE product_incidents ADD CONSTRAINT product_incidents_source_check
  CHECK (source IN ('dispute', 'reception', 'admin', 'analysis'));

CREATE OR REPLACE FUNCTION apply_analysis_verdict()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'verified' AND OLD.status IS DISTINCT FROM 'verified' THEN
    -- COA vérifié → remplit le document coa_lot du dossier de lot
    IF NEW.order_id IS NOT NULL THEN
      UPDATE order_lot_documents
      SET status = 'provided',
          value_text = 'COA vérifié — rapport ' || coalesce(NEW.report_number, '(fichier)')
            || coalesce(' — ' || NEW.lab_name, ''),
          file_url = coalesce(NEW.report_url, file_url),
          updated_at = now()
      WHERE order_id = NEW.order_id
        AND requirement_key = 'coa_lot'
        AND status = 'missing';
    END IF;
  ELSIF NEW.status = 'rejected' AND OLD.status IS DISTINCT FROM 'rejected' THEN
    -- COA rejeté → incident qualité (boucle existante)
    INSERT INTO product_incidents (producer_id, product_id, order_id, source, note)
    VALUES (
      NEW.producer_id, NEW.product_id, NEW.order_id, 'analysis',
      'COA rejeté — ' || NEW.analysis_label
        || coalesce(' (labo : ' || NEW.lab_name || ')', '')
        || coalesce(' — rapport ' || NEW.report_number, '')
        || ' : ' || coalesce(NEW.admin_note, 'sans détail')
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_analysis_verdict ON lot_analyses;
CREATE TRIGGER trg_analysis_verdict AFTER UPDATE ON lot_analyses
  FOR EACH ROW EXECUTE FUNCTION apply_analysis_verdict();

-- Le libellé de la source 'analysis' rejoint la boucle de dégradation
-- (confirm_product_incident écrit la preuve avec un libellé lisible)
CREATE OR REPLACE FUNCTION confirm_product_incident(p_incident uuid, p_note text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_admin uuid := auth.uid();
  v_is_admin boolean := false;
  r RECORD;
  v_evidence_id uuid;
BEGIN
  IF v_admin IS NULL THEN
    RAISE EXCEPTION 'NOT_AUTHENTICATED';
  END IF;
  SELECT p.is_admin INTO v_is_admin FROM profiles p WHERE p.id = v_admin;
  IF NOT coalesce(v_is_admin, false) THEN
    RAISE EXCEPTION 'ADMIN_ONLY';
  END IF;

  IF p_note IS NULL OR length(trim(p_note)) < 10 THEN
    RAISE EXCEPTION 'NOTE_TOO_SHORT';
  END IF;

  SELECT * INTO r FROM product_incidents WHERE id = p_incident;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'INCIDENT_NOT_FOUND';
  END IF;
  IF r.status = 'resolved' THEN
    RAISE EXCEPTION 'INCIDENT_ALREADY_RESOLVED';
  END IF;

  IF r.producer_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM verification_evidences e
    WHERE e.producer_id = r.producer_id
      AND e.reference = 'incident:' || r.id::text
  ) THEN
    INSERT INTO verification_evidences
      (producer_id, criterion, evidence_type, reference, note, outcome, checked_by)
    VALUES (
      r.producer_id, 'ethicalEngagementSatisfactory', 'other',
      'incident:' || r.id::text,
      'Incident qualité confirmé par l''équipe (' ||
        CASE r.source WHEN 'dispute' THEN 'litige acheteur'
                      WHEN 'reception' THEN 'réception non conforme'
                      WHEN 'analysis' THEN 'certificat d''analyse rejeté'
                      ELSE 'signalement interne' END
        || ') — ' || trim(p_note)
        || ' | Constat d''origine : ' || coalesce(r.note, '—')
        || '. Réhabilitation possible par contre-preuve après action corrective.',
      'fail', v_admin
    )
    RETURNING id INTO v_evidence_id;
  END IF;

  UPDATE product_incidents
  SET status = 'resolved', resolved_at = now(), resolved_by = v_admin,
      note = coalesce(note, '') || E'\n[Confirmé] ' || trim(p_note)
  WHERE id = p_incident;

  RETURN jsonb_build_object(
    'incident_id', p_incident,
    'evidence_id', v_evidence_id,
    'degraded', v_evidence_id IS NOT NULL
  );
END;
$$;
