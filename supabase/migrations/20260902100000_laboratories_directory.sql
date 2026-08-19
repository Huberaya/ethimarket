-- =============================================================
-- EthiMarket — Annuaire des laboratoires d'analyses
-- (extension Phase 2/couche 4 : contre-vérification des tests)
--
-- Même modèle que certification_bodies : une base interne,
-- éditable par les admins, avec pour CHAQUE labo :
--   • son accréditation ISO/IEC 17025 : organisme (COFRAC, NABL…),
--     numéro, et LIEN DIRECT vers le registre public où la vérifier
--   • ses domaines d'analyses (pesticides, mycotoxines, micro…)
--   • ses contacts OFFICIELS (ceux qu'on utilise pour confirmer un
--     rapport — jamais ceux imprimés sur un COA)
--   • un niveau de confiance interne (verified = accréditation
--     contre-vérifiée par notre équipe au registre)
--
-- Lecture : tous les authentifiés (les producteurs choisissent
-- leur labo dedans). Écriture : admins.
-- Zéro coût : données publiques des registres d'accréditation.
-- =============================================================

CREATE TABLE IF NOT EXISTS laboratories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  network text,                       -- Eurofins / SGS / Bureau Veritas / Intertek / indépendant
  country text NOT NULL,              -- pays FR normalisé (comme producers.country)
  city text,
  region text,                        -- Afrique / Asie / Europe / Amériques / Moyen-Orient
  website text,
  email_contact text,                 -- canal OFFICIEL pour confirmer un rapport
  phone text,
  languages text[] DEFAULT '{}',
  -- Accréditation ISO/IEC 17025 (le cœur de la contre-vérification)
  iso17025 boolean NOT NULL DEFAULT false,
  accreditation_body text,            -- COFRAC, NABL, KENAS, EGAC…
  accreditation_number text,          -- n° au registre
  accreditation_url text,             -- lien DIRECT registre/annexe technique
  -- Domaines couverts
  analysis_scopes text[] DEFAULT '{}',  -- pesticide_residues, aflatoxins, salmonella, heavy_metals, gmo, sudan_dyes, ethylene_oxide, pyrrolizidine_alkaloids, ochratoxin_a, water_activity, npop_organic
  -- Confiance interne
  trust_level text NOT NULL DEFAULT 'pending' CHECK (trust_level IN ('verified', 'pending', 'caution', 'blacklisted')),
  is_active boolean NOT NULL DEFAULT true,
  internal_notes text,
  price_note text,                    -- fourchettes constatées / convention tarifaire
  last_verified_at timestamptz,       -- dernière contre-vérification de l'accréditation
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_laboratories_country ON laboratories(country, is_active);

ALTER TABLE laboratories ENABLE ROW LEVEL SECURITY;

-- Lecture : tout utilisateur authentifié (producteurs incluent leur choix de labo)
DROP POLICY IF EXISTS "labs_read" ON laboratories;
CREATE POLICY "labs_read" ON laboratories FOR SELECT TO authenticated USING (true);

-- Écriture : admins uniquement
DROP POLICY IF EXISTS "labs_admin_write" ON laboratories;
CREATE POLICY "labs_admin_write" ON laboratories FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

-- updated_at automatique
CREATE OR REPLACE FUNCTION touch_laboratories()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END; $$;
DROP TRIGGER IF EXISTS trg_touch_laboratories ON laboratories;
CREATE TRIGGER trg_touch_laboratories BEFORE UPDATE ON laboratories
  FOR EACH ROW EXECUTE FUNCTION touch_laboratories();

-- ─────────────────────────────────────────────────────────────
-- Semis : laboratoires agroalimentaires réels dans nos origines.
-- trust_level='pending' partout : notre équipe contre-vérifie
-- l'accréditation au registre avant de passer à 'verified'.
-- Idempotent (delete + insert par nom).
-- ─────────────────────────────────────────────────────────────
DELETE FROM laboratories;
INSERT INTO laboratories
  (name, network, country, city, region, website, iso17025, accreditation_body, accreditation_url, analysis_scopes, languages, internal_notes) VALUES

-- ÉTHIOPIE (café, sésame, épices)
('Bless Agri Food Laboratory Services', NULL, 'Éthiopie', 'Addis-Abeba', 'Afrique',
 'https://blessagrifoodlab.com', true, 'ENAO (Ethiopian National Accreditation Office)', 'https://enao-eth.org',
 ARRAY['pesticide_residues','aflatoxins','salmonella','heavy_metals'], ARRAY['EN','AM'],
 'Labo privé agroalimentaire de référence à Addis. Utilisé par les exportateurs de café/sésame.'),
('JIJE Analytical Testing Service Laboratory', NULL, 'Éthiopie', 'Addis-Abeba', 'Afrique',
 'https://jijelaboratory.com', true, 'ENAO (Ethiopian National Accreditation Office)', 'https://enao-eth.org',
 ARRAY['aflatoxins','salmonella','heavy_metals','water_activity'], ARRAY['EN','AM'],
 'Historique sur les exportations agricoles éthiopiennes.'),
('SGS Ethiopia', 'SGS', 'Éthiopie', 'Addis-Abeba', 'Afrique',
 'https://www.sgs.com', true, 'via réseau SGS (accréditations locales/régionales)', 'https://www.sgs.com/en/office-directory',
 ARRAY['pesticide_residues','aflatoxins','salmonella'], ARRAY['EN','FR'],
 'Bureau local du réseau mondial — échantillons parfois routés vers les labos SGS régionaux.'),

-- GHANA (cacao, arachide, karité)
('Ghana Standards Authority — Testing Division', NULL, 'Ghana', 'Accra', 'Afrique',
 'https://www.gsa.gov.gh', true, 'GhaNAS (Ghana National Accreditation Service)', 'https://ghanas.gov.gh',
 ARRAY['aflatoxins','pesticide_residues','salmonella','heavy_metals'], ARRAY['EN'],
 'Labo public national — référence pour les certificats officiels d''exportation.'),
('SGS Ghana', 'SGS', 'Ghana', 'Tema', 'Afrique',
 'https://www.sgs.com', true, 'via réseau SGS', 'https://www.sgs.com/en/office-directory',
 ARRAY['aflatoxins','pesticide_residues','sudan_dyes'], ARRAY['EN'],
 'Présence forte sur le cacao (port de Tema).'),
('Intertek Ghana', 'Intertek', 'Ghana', 'Accra', 'Afrique',
 'https://www.intertek.com', true, 'via réseau Intertek', 'https://www.intertek.com/contact/worldwide/',
 ARRAY['aflatoxins','pesticide_residues'], ARRAY['EN'],
 'Actif sur cacao et karité.'),

-- KENYA (haricots, thé, café — hub Afrique de l''Est)
('Crop Nutrition Laboratory Services (Cropnuts)', NULL, 'Kenya', 'Nairobi', 'Afrique',
 'https://cropnuts.com', true, 'KENAS (Kenya Accreditation Service)', 'https://kenas.go.ke',
 ARRAY['pesticide_residues','aflatoxins','heavy_metals'], ARRAY['EN'],
 'Labo indépendant ISO 17025 réputé, sert toute l''Afrique de l''Est.'),
('Polucon Services Kenya', NULL, 'Kenya', 'Mombasa', 'Afrique',
 'https://polucon.com', true, 'KENAS (Kenya Accreditation Service)', 'https://kenas.go.ke',
 ARRAY['pesticide_residues','aflatoxins','salmonella','ochratoxin_a'], ARRAY['EN'],
 'Bien placé pour les lots au départ du port de Mombasa (café, thé).'),
('SGS Kenya', 'SGS', 'Kenya', 'Mombasa', 'Afrique',
 'https://www.sgs.com', true, 'via réseau SGS', 'https://www.sgs.com/en/office-directory',
 ARRAY['pesticide_residues','aflatoxins','salmonella'], ARRAY['EN'],
 NULL),

-- MAROC (huile d''argan, olives)
('LOARC — Laboratoire Officiel d''Analyses et de Recherches Chimiques', NULL, 'Maroc', 'Casablanca', 'Afrique',
 'http://www.loarc.ma', true, 'SEMAC', 'https://www.mcinet.gov.ma',
 ARRAY['pesticide_residues','aflatoxins','heavy_metals','salmonella'], ARRAY['FR','AR'],
 'Labo officiel historique du Maroc — certificats reconnus par l''ONSSA.'),
('Bureau Veritas Maroc', 'Bureau Veritas', 'Maroc', 'Casablanca', 'Afrique',
 'https://www.bureauveritas.ma', true, 'via réseau Bureau Veritas', 'https://group.bureauveritas.com/group/our-presence',
 ARRAY['pesticide_residues','salmonella'], ARRAY['FR','AR','EN'],
 NULL),

-- MADAGASCAR (vanille)
('SGS Madagascar', 'SGS', 'Madagascar', 'Antananarivo', 'Afrique',
 'https://www.sgs.com', true, 'via réseau SGS', 'https://www.sgs.com/en/office-directory',
 ARRAY['pesticide_residues','water_activity'], ARRAY['FR','MG'],
 'Incontournable sur la vanille (humidité, vanilline, résidus).'),
('Institut Pasteur de Madagascar — Laboratoire d''Hygiène des Aliments', NULL, 'Madagascar', 'Antananarivo', 'Afrique',
 'https://www.pasteur.mg', true, 'COFRAC (portée via convention)', 'https://www.cofrac.fr/annuaire',
 ARRAY['salmonella','heavy_metals'], ARRAY['FR'],
 'Référence microbiologie sur la Grande Île.'),

-- INDE (épices, sésame, riz)
('Eurofins Analytical Services India', 'Eurofins', 'Inde', 'Bangalore', 'Asie',
 'https://www.eurofins.in', true, 'NABL', 'https://nabl-india.org/directory-of-accredited-bodies/',
 ARRAY['pesticide_residues','aflatoxins','salmonella','ethylene_oxide','sudan_dyes','heavy_metals'], ARRAY['EN','HI'],
 'Très gros plateau analytique — panel oxyde d''éthylène rodé depuis la crise sésame 2020.'),
('Vimta Labs', NULL, 'Inde', 'Hyderabad', 'Asie',
 'https://www.vimta.com', true, 'NABL', 'https://nabl-india.org/directory-of-accredited-bodies/',
 ARRAY['pesticide_residues','aflatoxins','salmonella','heavy_metals'], ARRAY['EN','HI'],
 'Grand labo indépendant indien, coté en bourse, NABL historique.'),
('SGS India', 'SGS', 'Inde', 'Gurugram', 'Asie',
 'https://www.sgs.com', true, 'NABL', 'https://nabl-india.org/directory-of-accredited-bodies/',
 ARRAY['pesticide_residues','aflatoxins','ethylene_oxide'], ARRAY['EN','HI'],
 NULL),
('Spices Board of India — Quality Evaluation Laboratory', NULL, 'Inde', 'Cochin', 'Asie',
 'https://www.indianspices.com', true, 'NABL', 'https://nabl-india.org/directory-of-accredited-bodies/',
 ARRAY['pesticide_residues','aflatoxins','sudan_dyes'], ARRAY['EN'],
 'Labo public du Spices Board — obligatoire pour certains certificats d''export épices.'),

-- SRI LANKA (huile de coco, épices)
('Industrial Technology Institute (ITI)', NULL, 'Sri Lanka', 'Colombo', 'Asie',
 'https://www.iti.lk', true, 'SLAB (Sri Lanka Accreditation Board)', 'https://slab.lk',
 ARRAY['pesticide_residues','aflatoxins','salmonella','heavy_metals'], ARRAY['EN','SI'],
 'Institut public de référence, ISO 17025 SLAB.'),
('SGS Lanka', 'SGS', 'Sri Lanka', 'Colombo', 'Asie',
 'https://www.sgs.com', true, 'SLAB', 'https://slab.lk',
 ARRAY['pesticide_residues','aflatoxins'], ARRAY['EN'],
 NULL),

-- JAPON (thé)
('Japan Food Research Laboratories (JFRL)', NULL, 'Japon', 'Tokyo', 'Asie',
 'https://www.jfrl.or.jp', true, 'via registre japonais (MHLW)', 'https://www.mhlw.go.jp',
 ARRAY['pesticide_residues','heavy_metals'], ARRAY['JA','EN'],
 'Fondation historique de l''analyse alimentaire japonaise.'),

-- PÉROU (quinoa, café, cacao)
('La Molina Calidad Total Laboratorios (UNALM)', NULL, 'Pérou', 'Lima', 'Amériques',
 'https://www.lamolina.edu.pe/labs', true, 'INACAL', 'https://www.gob.pe/inacal',
 ARRAY['pesticide_residues','aflatoxins','salmonella','heavy_metals'], ARRAY['ES','EN'],
 'Labo de l''université agraire La Molina — référence quinoa/cacao.'),
('SGS del Perú', 'SGS', 'Pérou', 'Callao', 'Amériques',
 'https://www.sgs.com', true, 'INACAL', 'https://www.gob.pe/inacal',
 ARRAY['pesticide_residues','aflatoxins','ochratoxin_a'], ARRAY['ES','EN'],
 'Au port du Callao — pratique pour les lots export.'),

-- MEXIQUE (agave, avocat)
('SGS de México', 'SGS', 'Mexique', 'Mexico', 'Amériques',
 'https://www.sgs.com', true, 'EMA (Entidad Mexicana de Acreditación)', 'https://www.ema.org.mx',
 ARRAY['pesticide_residues','salmonella','heavy_metals'], ARRAY['ES','EN'],
 NULL),
('Intertek México', 'Intertek', 'Mexique', 'Mexico', 'Amériques',
 'https://www.intertek.com', true, 'EMA', 'https://www.ema.org.mx',
 ARRAY['pesticide_residues','salmonella'], ARRAY['ES','EN'],
 NULL),

-- GRÈCE (miel, huile d''olive)
('Eurofins Athens Analysis Laboratories', 'Eurofins', 'Grèce', 'Athènes', 'Europe',
 'https://www.eurofins.gr', true, 'ESYD (Hellenic Accreditation System)', 'https://www.esyd.gr',
 ARRAY['pesticide_residues','salmonella','heavy_metals'], ARRAY['EL','EN'],
 'Panel miel (HMF, diastase, adultération sucres) disponible.'),

-- FRANCE (spiruline, transformation, contre-analyses UE)
('Eurofins Analytics France', 'Eurofins', 'France', 'Nantes', 'Europe',
 'https://www.eurofins.fr', true, 'COFRAC', 'https://tools.cofrac.fr/fr/easysearch/',
 ARRAY['pesticide_residues','aflatoxins','salmonella','heavy_metals','ethylene_oxide','pyrrolizidine_alkaloids','gmo'], ARRAY['FR','EN'],
 'Notre labo de CONTRE-ANALYSE par défaut : tout panel, accrédité COFRAC, résultats opposables en UE.'),
('Phytocontrol', NULL, 'France', 'Nîmes', 'Europe',
 'https://www.phytocontrol.com', true, 'COFRAC', 'https://tools.cofrac.fr/fr/easysearch/',
 ARRAY['pesticide_residues','aflatoxins','heavy_metals','ethylene_oxide'], ARRAY['FR','EN'],
 'Spécialiste résidus/contaminants, très utilisé par le bio français. Bonne réactivité.'),
('SGS France — Laboratoire de Rouen', 'SGS', 'France', 'Rouen', 'Europe',
 'https://www.sgs.fr', true, 'COFRAC', 'https://tools.cofrac.fr/fr/easysearch/',
 ARRAY['pesticide_residues','aflatoxins','salmonella','heavy_metals'], ARRAY['FR','EN'],
 NULL);

-- La fiche labo rejoint le circuit d'analyses : lien optionnel
ALTER TABLE lot_analyses ADD COLUMN IF NOT EXISTS laboratory_id uuid REFERENCES laboratories(id) ON DELETE SET NULL;
