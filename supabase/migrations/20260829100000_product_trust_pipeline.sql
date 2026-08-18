-- =============================================================
-- EthiMarket — Product Trust Pipeline, Phase 1
--
--  Couche 1 : dossier de conformité produit → la publication
--             (status='active') est BLOQUÉE tant que le socle
--             d'exigences n'est pas fourni (modèle Amazon/GPSR).
--  Couche 2 : table de risque UE locale (annexes 2019/1793,
--             rédaction 2026/1206) → pilote les exigences par lot.
--  Couche 3 : paquet documentaire par lot semé à la confirmation
--             de commande et VERROUILLANT la transition
--             processing → shipped ; réception structurée ;
--             boucle d'incident sur litige.
--
-- Patterns réutilisés : transitions verrouillées par trigger
-- (comme enforce_order_transitions), données immuables ou
-- gardées par trigger, RLS producteur/acheteur/admin.
-- Zéro coût : aucune API externe, données publiques embarquées.
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. Table de risque UE (annexes I & II du règl. 2019/1793,
--    rédaction règl. (UE) 2026/1206 du 9 juin 2026).
--    Révision semestrielle : mettre à jour ces lignes ET
--    src/lib/euRiskList.ts (source : EUR-Lex, gratuit).
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eu_risk_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,                -- nom FR normalisé
  product_regex text NOT NULL,          -- testé sur product_type + name (insensible casse)
  product_label text NOT NULL,          -- libellé du règlement
  annex text NOT NULL CHECK (annex IN ('I', 'II')),
  hazard text NOT NULL,
  check_frequency integer NOT NULL CHECK (check_frequency BETWEEN 1 AND 100),
  revision text NOT NULL DEFAULT 'Règlement (UE) 2026/1206',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE eu_risk_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "eu_risk_rules_read" ON eu_risk_rules;
CREATE POLICY "eu_risk_rules_read" ON eu_risk_rules FOR SELECT USING (true);
DROP POLICY IF EXISTS "eu_risk_rules_admin_write" ON eu_risk_rules;
CREATE POLICY "eu_risk_rules_admin_write" ON eu_risk_rules FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

-- Semis idempotent (delete + insert : la révision remplace la précédente)
DELETE FROM eu_risk_rules;
INSERT INTO eu_risk_rules (country, product_regex, product_label, annex, hazard, check_frequency) VALUES
  ('Éthiopie',      's[ée]same',                                   'Graines de sésame',                          'I',  'salmonella',              50),
  ('Éthiopie',      'poivre|piment|capsicum|paprika',              'Poivres et piments séchés',                  'I',  'aflatoxins',              30),
  ('Éthiopie',      'gingembre|safran|curcuma|thym|laurier|curry|[ée]pice', 'Épices séchées',                    'I',  'aflatoxins',              30),
  ('Ghana',         'arachide|cacahu[èe]te|peanut',                'Arachides et produits dérivés',              'I',  'aflatoxins',              50),
  ('Géorgie',       'noisette',                                    'Noisettes et produits dérivés',              'I',  'aflatoxins',              20),
  ('Chine',         'arachide|cacahu[èe]te|peanut',                'Arachides et produits dérivés',              'I',  'aflatoxins',              10),
  ('Chine',         'th[ée]',                                      'Thé, même aromatisé',                        'I',  'pesticide_residues',      20),
  ('Argentine',     'arachide|cacahu[èe]te|peanut',                'Arachides et produits dérivés',              'I',  'aflatoxins',              20),
  ('Inde',          'cumin',                                       'Graines de cumin',                           'I',  'pesticide_residues',      50),
  ('Inde',          'riz',                                         'Riz',                                        'I',  'pesticide_residues',      10),
  ('Inde',          'cannelle',                                    'Cannelle et fleurs de cannelier',            'I',  'ethylene_oxide',          20),
  ('Inde',          'gombo|okra',                                  'Gombos frais/surgelés',                      'I',  'pesticide_residues',      30),
  ('Inde',          'goyave',                                      'Goyaves',                                    'I',  'pesticide_residues',      30),
  ('Inde',          'poivre|piment|capsicum|pimenta',              'Poivres et piments séchés/broyés',           'I',  'pesticide_residues',      20),
  ('Kenya',         'haricot',                                     'Haricots frais ou réfrigérés',               'I',  'pesticide_residues',      10),
  ('Kenya',         'piment|capsicum',                             'Piments Capsicum (autres que doux)',         'I',  'pesticide_residues',      20),
  ('Sri Lanka',     'haricot.?kilom[èe]tre|yardlong|d[oô]lique',   'Haricots-kilomètres',                        'I',  'pesticide_residues',      50),
  ('Sri Lanka',     'piment|capsicum|paprika',                     'Piments séchés/broyés',                      'I',  'aflatoxins',              50),
  ('Madagascar',    'haricot|ni[ée]b[ée]|black.?eyed',             'Haricots à œil noir (Vigna unguiculata)',    'I',  'pesticide_residues',      50),
  ('Mexique',       'papaye',                                      'Papaye verte fraîche',                       'I',  'pesticide_residues',      20),
  ('Pakistan',      'riz',                                         'Riz',                                        'I',  'aflatoxins',              10),
  ('Pakistan',      'm[ée]lange.*[ée]pice|[ée]pice.*m[ée]lange',   'Mélanges d''épices',                         'I',  'aflatoxins',              30),
  ('Rwanda',        'piment|capsicum',                             'Piments Capsicum (autres que doux)',         'I',  'pesticide_residues',      50),
  ('Thaïlande',     'piment|capsicum',                             'Piments frais/surgelés',                     'I',  'pesticide_residues',      50),
  ('Turquie',       'citron',                                      'Citrons',                                    'I',  'pesticide_residues',      20),
  ('Turquie',       'grenade',                                     'Grenades',                                   'I',  'pesticide_residues',      30),
  ('Turquie',       'origan',                                      'Origan séché',                               'I',  'pyrrolizidine_alkaloids', 30),
  ('Turquie',       's[ée]same',                                   'Graines de sésame',                          'I',  'salmonella',              20),
  ('Égypte',        'orange',                                      'Oranges',                                    'I',  'pesticide_residues',      10),
  ('Égypte',        'mangue',                                      'Mangues',                                    'I',  'pesticide_residues',      20),
  ('Égypte',        'fraise',                                      'Fraises',                                    'I',  'pesticide_residues',      20),
  ('Égypte',        'poivron|piment|capsicum',                     'Poivrons et piments',                        'I',  'pesticide_residues',      30),
  ('Burkina Faso',  'aubergine',                                   'Aubergines africaines (Solanum aethiopicum)','I',  'pesticide_residues',      30),
  ('Côte d''Ivoire','huile de palme|palme',                        'Huile de palme',                             'I',  'sudan_dyes',              30),
  ('Brésil',        'poivre noir|poivre',                          'Poivre noir (Piper nigrum) non broyé',       'II', 'salmonella',              30),
  ('Ghana',         'huile de palme|palme',                        'Huile de palme',                             'II', 'sudan_dyes',              50),
  ('Indonésie',     'muscade',                                     'Noix de muscade',                            'II', 'aflatoxins',              30),
  ('Inde',          's[ée]same',                                   'Graines de sésame',                          'II', 'salmonella',              30),
  ('Inde',          'arachide|cacahu[èe]te|peanut',                'Arachides et produits dérivés',              'II', 'aflatoxins',              50),
  ('Inde',          'feuilles? de curry',                          'Feuilles de curry',                          'II', 'pesticide_residues',      50),
  ('Inde',          'muscade|macis|cardamome|coriandre|cumin|gingembre|safran|curcuma|curry|fenugrec|thym|anis|badiane|fenouil', 'Épices séchées (liste étendue)', 'II', 'pesticide_residues', 20),
  ('Égypte',        'arachide|cacahu[èe]te|peanut',                'Arachides et produits dérivés',              'II', 'aflatoxins',              30);

-- ─────────────────────────────────────────────────────────────
-- 2. Couche 1 : dossier de conformité produit
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_compliance_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  requirement_key text NOT NULL CHECK (requirement_key IN (
    'hs_code', 'batch_dluo', 'technical_sheet', 'coa_recent',
    'labeling_check', 'organic_certificate', 'gps_parcels', 'allergens'
  )),
  required boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'missing' CHECK (status IN ('missing', 'provided', 'verified', 'rejected')),
  value_text text,
  file_url text,
  note text,
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, requirement_key)
);

CREATE INDEX IF NOT EXISTS idx_pci_product ON product_compliance_items(product_id);

ALTER TABLE product_compliance_items ENABLE ROW LEVEL SECURITY;

-- Producteur : gère les items de SES produits
DROP POLICY IF EXISTS "pci_owner_select" ON product_compliance_items;
CREATE POLICY "pci_owner_select" ON product_compliance_items FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM products pr WHERE pr.id = product_compliance_items.product_id AND pr.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
DROP POLICY IF EXISTS "pci_owner_insert" ON product_compliance_items;
CREATE POLICY "pci_owner_insert" ON product_compliance_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM products pr WHERE pr.id = product_compliance_items.product_id AND pr.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
DROP POLICY IF EXISTS "pci_owner_update" ON product_compliance_items;
CREATE POLICY "pci_owner_update" ON product_compliance_items FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM products pr WHERE pr.id = product_compliance_items.product_id AND pr.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
DROP POLICY IF EXISTS "pci_owner_delete" ON product_compliance_items;
CREATE POLICY "pci_owner_delete" ON product_compliance_items FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM products pr WHERE pr.id = product_compliance_items.product_id AND pr.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- Garde-fou : seul un admin peut vérifier/rejeter ou changer `required`
CREATE OR REPLACE FUNCTION guard_compliance_item()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_is_admin boolean := false;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;  -- service role / maintenance
  SELECT p.is_admin INTO v_is_admin FROM profiles p WHERE p.id = auth.uid();
  IF coalesce(v_is_admin, false) THEN
    IF NEW.status IN ('verified', 'rejected') THEN
      NEW.reviewed_by := auth.uid();
      NEW.reviewed_at := now();
    END IF;
    RETURN NEW;
  END IF;
  -- Producteur : peut seulement fournir (missing/provided), jamais s'auto-vérifier
  IF NEW.status NOT IN ('missing', 'provided') THEN
    RAISE EXCEPTION 'Seul un administrateur peut vérifier ou rejeter un élément de conformité.';
  END IF;
  NEW.reviewed_by := NULL;
  NEW.reviewed_at := NULL;
  IF TG_OP = 'UPDATE' THEN
    NEW.required := OLD.required;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_pci ON product_compliance_items;
CREATE TRIGGER trg_guard_pci BEFORE INSERT OR UPDATE ON product_compliance_items
  FOR EACH ROW EXECUTE FUNCTION guard_compliance_item();

DROP TRIGGER IF EXISTS trg_touch_pci ON product_compliance_items;
CREATE TRIGGER trg_touch_pci BEFORE UPDATE ON product_compliance_items
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Socle SQL des exigences (source de vérité côté serveur ; le moteur
-- TS src/lib/productCompliance.ts est son miroir UI, avec des
-- recommandations supplémentaires non bloquantes).
CREATE OR REPLACE FUNCTION product_required_compliance_keys(p products)
RETURNS text[] LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  keys text[] := ARRAY['hs_code', 'batch_dluo', 'technical_sheet', 'coa_recent', 'labeling_check'];
  haystack text := lower(coalesce(p.product_type, '') || ' ' || coalesce(p.name, ''));
BEGIN
  IF EXISTS (
    SELECT 1 FROM unnest(coalesce(p.certifications, '{}'::text[])) c
    WHERE c ~* 'bio|organic|ecocert'
  ) THEN
    keys := array_append(keys, 'organic_certificate');
  END IF;
  -- EUDR 2023/1115 : café et cacao → géolocalisation des parcelles
  IF haystack ~* 'caf[eé]|coffee|cacao|cocoa' THEN
    keys := array_append(keys, 'gps_parcels');
  END IF;
  RETURN keys;
END;
$$;

-- Verrou de publication : un produit ne passe à 'active' que si
-- chaque exigence du socle a un item 'provided' ou 'verified'.
-- Bypass : admins (modération/démo) et rôle service (maintenance).
CREATE OR REPLACE FUNCTION enforce_product_compliance_gate()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  req text[];
  missing text[];
  v_is_admin boolean := false;
BEGIN
  IF NEW.status = 'active' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'active') THEN
    IF auth.uid() IS NULL THEN RETURN NEW; END IF;
    SELECT p.is_admin INTO v_is_admin FROM profiles p WHERE p.id = auth.uid();
    IF coalesce(v_is_admin, false) THEN RETURN NEW; END IF;

    req := product_required_compliance_keys(NEW);
    SELECT array_agg(k) INTO missing
    FROM unnest(req) k
    WHERE NOT EXISTS (
      SELECT 1 FROM product_compliance_items i
      WHERE i.product_id = NEW.id
        AND i.requirement_key = k
        AND i.status IN ('provided', 'verified')
    );
    IF missing IS NOT NULL THEN
      RAISE EXCEPTION 'COMPLIANCE_INCOMPLETE:%', array_to_string(missing, ',');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_product_compliance_gate ON products;
CREATE TRIGGER trg_product_compliance_gate BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION enforce_product_compliance_gate();

-- ─────────────────────────────────────────────────────────────
-- 3. Couche 3.1 : paquet documentaire par lot (commandes)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_lot_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  requirement_key text NOT NULL CHECK (requirement_key IN (
    'lot_number', 'phyto_certificate', 'coi_reference',
    'sanitary_certificate', 'coa_lot', 'official_certificate'
  )),
  required boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'missing' CHECK (status IN ('missing', 'provided')),
  value_text text,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_id, requirement_key)
);

CREATE INDEX IF NOT EXISTS idx_old_order ON order_lot_documents(order_id);

ALTER TABLE order_lot_documents ENABLE ROW LEVEL SECURITY;

-- Lecture : acheteur (transparence sur son lot), producteur, admin
DROP POLICY IF EXISTS "old_select" ON order_lot_documents;
CREATE POLICY "old_select" ON order_lot_documents FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_lot_documents.order_id AND o.buyer_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM orders o JOIN producers pr ON pr.id = o.producer_id
      WHERE o.id = order_lot_documents.order_id AND pr.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- Écriture : le producteur de la commande fournit les documents
DROP POLICY IF EXISTS "old_producer_update" ON order_lot_documents;
CREATE POLICY "old_producer_update" ON order_lot_documents FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o JOIN producers pr ON pr.id = o.producer_id
      WHERE o.id = order_lot_documents.order_id AND pr.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
DROP POLICY IF EXISTS "old_producer_insert" ON order_lot_documents;
CREATE POLICY "old_producer_insert" ON order_lot_documents FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o JOIN producers pr ON pr.id = o.producer_id
      WHERE o.id = order_lot_documents.order_id AND pr.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- Garde-fou : `required` n'est modifiable que par un admin
CREATE OR REPLACE FUNCTION guard_lot_document()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_is_admin boolean := false;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;
  SELECT p.is_admin INTO v_is_admin FROM profiles p WHERE p.id = auth.uid();
  IF NOT coalesce(v_is_admin, false) AND TG_OP = 'UPDATE' THEN
    NEW.required := OLD.required;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_old ON order_lot_documents;
CREATE TRIGGER trg_guard_old BEFORE INSERT OR UPDATE ON order_lot_documents
  FOR EACH ROW EXECUTE FUNCTION guard_lot_document();

DROP TRIGGER IF EXISTS trg_touch_old ON order_lot_documents;
CREATE TRIGGER trg_touch_old BEFORE UPDATE ON order_lot_documents
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Semis automatique du paquet documentaire à la confirmation
-- (new → processing). SECURITY DEFINER : le semis est un acte
-- système, pas un droit du producteur.
CREATE OR REPLACE FUNCTION seed_order_lot_documents()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  prod RECORD;
  haystack text;
  keys text[] := ARRAY['lot_number'];
  k text;
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status = 'new' AND NEW.status = 'processing' THEN
    IF NEW.product_id IS NOT NULL THEN
      SELECT p.product_type, p.name, p.country, p.certifications INTO prod
      FROM products p WHERE p.id = NEW.product_id;
      IF FOUND THEN
        haystack := lower(coalesce(prod.product_type, '') || ' ' || coalesce(prod.name, ''));
        -- COI bio par lot (règl. 2018/848) si le produit est vendu bio
        IF EXISTS (
          SELECT 1 FROM unnest(coalesce(prod.certifications, '{}'::text[])) c
          WHERE c ~* 'bio|organic|ecocert'
        ) THEN
          keys := array_append(keys, 'coi_reference');
        END IF;
        -- Certificat phytosanitaire (règl. 2016/2031) : végétaux non transformés
        IF haystack ~* 'caf[eé]|coffee|cacao|cocoa|th[eé]|tea|vanille|vanilla|[eé]pice|spice|poivre|piment|curcuma|gingembre|s[eé]same|riz|quinoa|fonio|c[eé]r[eé]ale|graine|noix|arachide|fruit|l[eé]gume|mangue|karit[eé]' THEN
          keys := array_append(keys, 'phyto_certificate');
        END IF;
        -- Certificat sanitaire produit animal : miel
        IF haystack ~* 'miel|honey' THEN
          keys := array_append(keys, 'sanitary_certificate');
        END IF;
        -- Filière listée 2019/1793 : COA par lot (annexe I)
        -- + certificat officiel (annexe II)
        IF EXISTS (
          SELECT 1 FROM eu_risk_rules r
          WHERE r.country = coalesce(prod.country, '') AND haystack ~* r.product_regex
        ) THEN
          keys := array_append(keys, 'coa_lot');
        END IF;
        IF EXISTS (
          SELECT 1 FROM eu_risk_rules r
          WHERE r.country = coalesce(prod.country, '') AND r.annex = 'II' AND haystack ~* r.product_regex
        ) THEN
          keys := array_append(keys, 'official_certificate');
        END IF;
      END IF;
    END IF;
    FOREACH k IN ARRAY keys LOOP
      INSERT INTO order_lot_documents (order_id, requirement_key, required)
      VALUES (NEW.id, k, true)
      ON CONFLICT (order_id, requirement_key) DO NOTHING;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_seed_lot_docs ON orders;
CREATE TRIGGER trg_seed_lot_docs BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION seed_order_lot_documents();

-- Verrou d'expédition : processing → shipped exige le paquet complet.
-- Les commandes confirmées AVANT cette migration (aucune ligne semée)
-- ne sont pas bloquées — le verrou ne s'applique qu'aux dossiers semés.
CREATE OR REPLACE FUNCTION enforce_lot_dossier_gate()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  missing text[];
  v_is_admin boolean := false;
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status = 'processing' AND NEW.status = 'shipped' THEN
    IF auth.uid() IS NULL THEN RETURN NEW; END IF;
    SELECT p.is_admin INTO v_is_admin FROM profiles p WHERE p.id = auth.uid();
    IF coalesce(v_is_admin, false) THEN RETURN NEW; END IF;

    IF EXISTS (SELECT 1 FROM order_lot_documents d WHERE d.order_id = NEW.id) THEN
      SELECT array_agg(d.requirement_key) INTO missing
      FROM order_lot_documents d
      WHERE d.order_id = NEW.id AND d.required = true AND d.status <> 'provided';
      IF missing IS NOT NULL THEN
        RAISE EXCEPTION 'LOT_DOSSIER_INCOMPLETE:%', array_to_string(missing, ',');
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lot_dossier_gate ON orders;
CREATE TRIGGER trg_lot_dossier_gate BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION enforce_lot_dossier_gate();

-- ─────────────────────────────────────────────────────────────
-- 4. Couche 3.3 : réception structurée
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_receptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES profiles(id),
  quantity_ok boolean NOT NULL,
  packaging_ok boolean NOT NULL,
  aspect_ok boolean NOT NULL,
  labeling_ok boolean NOT NULL,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_receptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rec_select" ON order_receptions;
CREATE POLICY "rec_select" ON order_receptions FOR SELECT TO authenticated
  USING (
    buyer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM orders o JOIN producers pr ON pr.id = o.producer_id
      WHERE o.id = order_receptions.order_id AND pr.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

DROP POLICY IF EXISTS "rec_buyer_insert" ON order_receptions;
CREATE POLICY "rec_buyer_insert" ON order_receptions FOR INSERT TO authenticated
  WITH CHECK (
    buyer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_receptions.order_id
        AND o.buyer_id = auth.uid()
        AND o.status IN ('shipped', 'delivered', 'disputed')
    )
  );
-- Pas de policy UPDATE/DELETE : une réception est un constat immuable.

-- ─────────────────────────────────────────────────────────────
-- 5. Couche 3.4 : boucle d'incident
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id uuid REFERENCES producers(id) ON DELETE SET NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  source text NOT NULL CHECK (source IN ('dispute', 'reception', 'admin')),
  note text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_incidents_producer ON product_incidents(producer_id, status);

ALTER TABLE product_incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "incidents_select" ON product_incidents;
CREATE POLICY "incidents_select" ON product_incidents FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM producers pr WHERE pr.id = product_incidents.producer_id AND pr.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
DROP POLICY IF EXISTS "incidents_admin_write" ON product_incidents;
CREATE POLICY "incidents_admin_write" ON product_incidents FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

-- Litige → incident automatique (SECURITY DEFINER : acte système)
CREATE OR REPLACE FUNCTION open_incident_on_dispute()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status = 'disputed' AND OLD.status IS DISTINCT FROM 'disputed' THEN
    INSERT INTO product_incidents (producer_id, product_id, order_id, source, note)
    VALUES (
      NEW.producer_id, NEW.product_id, NEW.id, 'dispute',
      'Litige ouvert sur la commande ' || coalesce(NEW.order_number, NEW.id::text)
        || coalesce(' — ' || NEW.notes, '')
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_incident_on_dispute ON orders;
CREATE TRIGGER trg_incident_on_dispute AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION open_incident_on_dispute();

-- Réception non conforme → incident automatique
CREATE OR REPLACE FUNCTION open_incident_on_bad_reception()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE o RECORD;
BEGIN
  IF NOT (NEW.quantity_ok AND NEW.packaging_ok AND NEW.aspect_ok AND NEW.labeling_ok) THEN
    SELECT producer_id, product_id, order_number INTO o FROM orders WHERE id = NEW.order_id;
    INSERT INTO product_incidents (producer_id, product_id, order_id, source, note)
    VALUES (
      o.producer_id, o.product_id, NEW.order_id, 'reception',
      'Réception non conforme sur la commande ' || coalesce(o.order_number, NEW.order_id::text)
        || ' — quantité:' || (CASE WHEN NEW.quantity_ok THEN 'ok' ELSE 'NON' END)
        || ' emballage:' || (CASE WHEN NEW.packaging_ok THEN 'ok' ELSE 'NON' END)
        || ' aspect:'    || (CASE WHEN NEW.aspect_ok THEN 'ok' ELSE 'NON' END)
        || ' étiquetage:' || (CASE WHEN NEW.labeling_ok THEN 'ok' ELSE 'NON' END)
        || coalesce(' — ' || NEW.comment, '')
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_incident_on_reception ON order_receptions;
CREATE TRIGGER trg_incident_on_reception AFTER INSERT ON order_receptions
  FOR EACH ROW EXECUTE FUNCTION open_incident_on_bad_reception();
