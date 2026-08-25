-- =============================================================
-- EthiMarket — Annuaire mondial des organismes certificateurs
--
-- 1. Corrige les régions erronées des 26 organismes existants
--    (tous étaient marqués 'Europe', y compris USDA et JAS).
-- 2. Complète l'annuaire : ~57 organismes supplémentaires
--    couvrant les 7 régions (accréditeurs, certificateurs bio
--    nationaux et internationaux, labels équitables/textile).
--    Sources : registres publics des organismes, IFOAM, ITC
--    Standards Map. trust_level='pending' pour les nouveaux :
--    l'équipe contre-vérifie avant de passer 'verified'.
-- Idempotent : UPDATE ciblés + INSERT gardés par NOT EXISTS.
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. Corrections de régions/pays des organismes existants
-- ─────────────────────────────────────────────────────────────
UPDATE certification_bodies SET region = 'North America' WHERE name IN ('USDA Organic', 'Rainforest Alliance', 'Canada Organic');
UPDATE certification_bodies SET region = 'Asia' WHERE name IN ('India Organic (NPOP)', 'JAS Organic');
UPDATE certification_bodies SET region = 'Latin America' WHERE name = 'SPP Global';

-- ─────────────────────────────────────────────────────────────
-- 2. Nouveaux organismes (INSERT si absent, par nom)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION _add_cert_body(
  p_name text, p_short text, p_acronym text, p_country text,
  p_region certification_region_enum, p_website text,
  p_verif_url text, p_desc text, p_types text[]
) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM certification_bodies WHERE lower(name) = lower(p_name)) THEN
    INSERT INTO certification_bodies
      (name, short_name, acronym, country, headquarters_country, region, website, verification_url, description, certification_types, is_active, trust_level)
    VALUES
      (p_name, p_short, p_acronym, p_country, p_country, p_region, p_website, p_verif_url, p_desc, p_types, true, 'pending');
  END IF;
END; $$;

-- ---------- EUROPE ----------
SELECT _add_cert_body('Certipaq Bio', 'Certipaq', 'CERTIPAQ', 'France', 'Europe', 'https://www.certipaq.com', 'https://annuaire.agencebio.org', 'Organisme certificateur bio français agréé INAO (FR-BIO-09).', ARRAY['organic']);
SELECT _add_cert_body('Qualisud', 'Qualisud', 'QUALISUD', 'France', 'Europe', 'https://www.qualisud.fr', 'https://annuaire.agencebio.org', 'Certificateur français bio et signes officiels de qualité (FR-BIO-16).', ARRAY['organic']);
SELECT _add_cert_body('Bio Cohérence', 'Bio Cohérence', 'BC', 'France', 'Europe', 'https://www.biocoherence.fr', NULL, 'Marque privée française plus exigeante que le règlement bio UE (fermes 100% bio, lien au sol).', ARRAY['organic']);
SELECT _add_cert_body('Naturland', 'Naturland', 'NATURLAND', 'Allemagne', 'Europe', 'https://www.naturland.de', 'https://www.naturland.de/en/naturland/where-to-find-naturland.html', 'Association bio allemande parmi les plus grandes au monde (~140 000 fermes), cahier des charges renforcé + volet équitable Naturland Fair.', ARRAY['organic','fair_trade']);
SELECT _add_cert_body('Bioland', 'Bioland', 'BIOLAND', 'Allemagne', 'Europe', 'https://www.bioland.de', NULL, 'Première association bio allemande (~10 000 fermes), cahier des charges plus strict que le bio UE.', ARRAY['organic']);
SELECT _add_cert_body('CERES Certification', 'CERES', 'CERES', 'Allemagne', 'Europe', 'https://www.ceres-cert.de', 'https://www.ceres-cert.de/en/customer-search', 'Certificateur allemand actif dans plus de 60 pays (bio UE, NOP, JAS, GlobalG.A.P.), très présent en Afrique de l''Est.', ARRAY['organic','sustainable']);
SELECT _add_cert_body('Kiwa BCS Öko-Garantie', 'Kiwa BCS', 'BCS', 'Allemagne', 'Europe', 'https://www.kiwa.com/de', NULL, 'Un des premiers certificateurs bio allemands (DE-ÖKO-001), réseau mondial via le groupe Kiwa.', ARRAY['organic']);
SELECT _add_cert_body('ABCERT', 'ABCERT', 'ABCERT', 'Allemagne', 'Europe', 'https://www.abcert.de', NULL, 'Certificateur bio allemand (DE-ÖKO-006) actif en Europe centrale et du Sud.', ARRAY['organic']);
SELECT _add_cert_body('Lacon GmbH', 'Lacon', 'LACON', 'Allemagne', 'Europe', 'https://www.lacon-institut.com', NULL, 'Certificateur bio allemand (DE-ÖKO-003) avec filiales en Inde et en Afrique.', ARRAY['organic']);
SELECT _add_cert_body('Skal Biocontrole', 'Skal', 'SKAL', 'Pays-Bas', 'Europe', 'https://www.skal.nl', 'https://webgate.ec.europa.eu/tracesnt/directory/publication/organic-operator/index', 'Autorité de contrôle bio unique des Pays-Bas (NL-BIO-01).', ARRAY['organic']);
SELECT _add_cert_body('Soil Association Certification', 'Soil Association', 'SA', 'Royaume-Uni', 'Europe', 'https://www.soilassociation.org', 'https://www.soilassociation.org/certification/check-a-certificate/', 'Principal certificateur bio britannique, standards souvent plus stricts que la base réglementaire.', ARRAY['organic']);
SELECT _add_cert_body('Organic Farmers & Growers', 'OF&G', 'OFG', 'Royaume-Uni', 'Europe', 'https://ofgorganic.org', NULL, 'Premier organisme bio agréé du Royaume-Uni (GB-ORG-02).', ARRAY['organic']);
SELECT _add_cert_body('ICEA', 'ICEA', 'ICEA', 'Italie', 'Europe', 'https://icea.bio', NULL, 'Institut italien de certification éthique et environnementale : bio, cosmétique, textile (IT-BIO-006).', ARRAY['organic','ethical']);
SELECT _add_cert_body('CCPB', 'CCPB', 'CCPB', 'Italie', 'Europe', 'https://www.ccpb.it', 'https://www.ccpb.it/en/certified-operators/', 'Certificateur bio italien (IT-BIO-009) très actif en Méditerranée et au Maghreb.', ARRAY['organic']);
SELECT _add_cert_body('Bioagricert', 'Bioagricert', 'BAC', 'Italie', 'Europe', 'https://www.bioagricert.org', NULL, 'Certificateur bio italien (IT-BIO-007), présent en Asie du Sud-Est et en Amérique latine.', ARRAY['organic']);
SELECT _add_cert_body('Suolo e Salute', 'Suolo e Salute', 'SES', 'Italie', 'Europe', 'https://www.suoloesalute.it', NULL, 'Plus ancien organisme de contrôle bio italien (IT-BIO-004).', ARRAY['organic']);
SELECT _add_cert_body('CAAE', 'CAAE', 'CAAE', 'Espagne', 'Europe', 'https://www.caae.es', NULL, 'Principal certificateur bio d''Andalousie et de Castille-La Manche, leader espagnol en surface certifiée.', ARRAY['organic']);
SELECT _add_cert_body('Sohiscert', 'Sohiscert', 'SOHIS', 'Espagne', 'Europe', 'https://www.sohiscert.com', NULL, 'Certificateur espagnol bio et production intégrée, actif aussi au Maghreb.', ARRAY['organic']);
SELECT _add_cert_body('Austria Bio Garantie', 'ABG', 'ABG', 'Autriche', 'Europe', 'https://www.abg.at', NULL, 'Premier certificateur bio autrichien (AT-BIO-301).', ARRAY['organic']);
SELECT _add_cert_body('KRAV', 'KRAV', 'KRAV', 'Suède', 'Europe', 'https://www.krav.se', NULL, 'Label bio suédois de référence, exigences renforcées (climat, bien-être animal).', ARRAY['organic','sustainable']);
SELECT _add_cert_body('Debio', 'Debio', 'DEBIO', 'Norvège', 'Europe', 'https://debio.no', NULL, 'Organisme de contrôle bio unique de Norvège (marque Ø).', ARRAY['organic']);
SELECT _add_cert_body('DIO Certification', 'DIO', 'DIO', 'Grèce', 'Europe', 'https://www.dionet.gr', NULL, 'Principal certificateur bio grec (GR-BIO-01), référence pour huile d''olive et miel.', ARRAY['organic']);

-- ---------- AMÉRIQUE DU NORD ----------
SELECT _add_cert_body('Quality Assurance International', 'QAI', 'QAI', 'États-Unis', 'North America', 'https://www.qai-inc.com', 'https://organic.ams.usda.gov/integrity/', 'Un des plus grands certificateurs USDA Organic, filiale de NSF.', ARRAY['organic']);
SELECT _add_cert_body('California Certified Organic Farmers', 'CCOF', 'CCOF', 'États-Unis', 'North America', 'https://www.ccof.org', 'https://www.ccof.org/directory-search', 'Certificateur historique californien (fondé 1973), plus de 4 000 opérateurs certifiés USDA.', ARRAY['organic']);
SELECT _add_cert_body('Oregon Tilth', 'Oregon Tilth', 'OTCO', 'États-Unis', 'North America', 'https://tilth.org', 'https://organic.ams.usda.gov/integrity/', 'Certificateur bio américain de référence (OTCO), pionnier depuis 1974.', ARRAY['organic']);
SELECT _add_cert_body('Fair Trade USA', 'Fair Trade USA', 'FTUSA', 'États-Unis', 'North America', 'https://www.fairtradecertified.org', NULL, 'Label équitable américain (séparé de Fairtrade International depuis 2012), certifie fermes et usines.', ARRAY['fair_trade']);
SELECT _add_cert_body('Non-GMO Project', 'Non-GMO Project', 'NGP', 'États-Unis', 'North America', 'https://www.nongmoproject.org', 'https://www.nongmoproject.org/find-non-gmo/', 'Standard nord-américain de vérification sans OGM (papillon orange).', ARRAY['other']);
SELECT _add_cert_body('Pro-Cert Organic Systems', 'Pro-Cert', 'PROCERT', 'Canada', 'North America', 'https://pro-cert.org', NULL, 'Un des principaux certificateurs bio canadiens (COR/USDA).', ARRAY['organic']);
SELECT _add_cert_body('Ecocert Canada', 'Ecocert CA', 'ECOCERT-CA', 'Canada', 'North America', 'https://www.ecocert.com/fr-CA', 'https://www.ecocert.com/en/business-directory', 'Filiale canadienne d''Ecocert, certification COR et NOP.', ARRAY['organic']);

-- ---------- AMÉRIQUE LATINE ----------
SELECT _add_cert_body('Argencert', 'Argencert', 'ARGENCERT', 'Argentine', 'Latin America', 'https://www.argencert.com.ar', NULL, 'Certificateur argentin historique (bio UE, NOP), agréé SENASA.', ARRAY['organic']);
SELECT _add_cert_body('Letis', 'Letis', 'LETIS', 'Argentine', 'Latin America', 'https://www.letis.org', NULL, 'Certificateur argentin multi-référentiels (bio, GlobalG.A.P.) actif dans toute l''Amérique latine.', ARRAY['organic','sustainable']);
SELECT _add_cert_body('OIA — Organización Internacional Agropecuaria', 'OIA', 'OIA', 'Argentine', 'Latin America', 'https://www.oia.com.ar', NULL, 'Certificateur argentin bio et durable, agréé UE/NOP/JAS.', ARRAY['organic']);
SELECT _add_cert_body('IBD Certificações', 'IBD', 'IBD', 'Brésil', 'Latin America', 'https://www.ibd.com.br', 'https://www.ibd.com.br/clientes-certificados/', 'Plus grand certificateur bio d''Amérique latine (Brésil), également Demeter et équitable IBD Fair.', ARRAY['organic','fair_trade']);
SELECT _add_cert_body('Certimex', 'Certimex', 'CERTIMEX', 'Mexique', 'Latin America', 'https://www.certimexsc.com', NULL, 'Certificateur mexicain issu du mouvement des petits producteurs de café, agréé LPO/NOP/UE.', ARRAY['organic','fair_trade']);
SELECT _add_cert_body('Mayacert', 'Mayacert', 'MAYACERT', 'Guatemala', 'Latin America', 'https://www.mayacert.com', NULL, 'Certificateur guatémaltèque (bio, SPP) couvrant l''Amérique centrale et le Mexique.', ARRAY['organic','fair_trade']);
SELECT _add_cert_body('BioLatina', 'BioLatina', 'BIOLATINA', 'Pérou', 'Latin America', 'https://www.biolatina.com', NULL, 'Certificateur bio latino-américain (siège Lima), présent dans 6 pays andins et centraméricains.', ARRAY['organic']);
SELECT _add_cert_body('Bolicert', 'Bolicert', 'BOLICERT', 'Bolivie', 'Latin America', 'https://www.bolicert.org', NULL, 'Certificateur bio bolivien historique (quinoa, cacao, café).', ARRAY['organic']);
SELECT _add_cert_body('IMOcert Latinoamérica', 'IMOcert', 'IMOCERT', 'Bolivie', 'Latin America', 'https://imocert.bio', NULL, 'Certificateur bio latino-américain issu du groupe IMO, très présent sur quinoa/cacao/café andins.', ARRAY['organic']);

-- ---------- AFRIQUE ----------
SELECT _add_cert_body('Africert', 'Africert', 'AFRICERT', 'Kenya', 'Africa', 'https://africertlimited.co.ke', NULL, 'Certificateur kényan (bio UE, GlobalG.A.P., Rainforest) couvrant l''Afrique de l''Est.', ARRAY['organic','sustainable']);
SELECT _add_cert_body('UgoCert', 'UgoCert', 'UGOCERT', 'Ouganda', 'Africa', 'https://www.ugocert.org', NULL, 'Certificateur ougandais, pays comptant le plus de producteurs bio d''Afrique.', ARRAY['organic']);
SELECT _add_cert_body('TanCert', 'TanCert', 'TANCERT', 'Tanzanie', 'Africa', 'https://www.tancert.or.tz', NULL, 'Certificateur bio tanzanien (standard local et East African Organic Products Standard).', ARRAY['organic']);
SELECT _add_cert_body('Center of Organic Agriculture in Egypt', 'COAE', 'COAE', 'Égypte', 'Africa', 'https://www.coae-eg.com', NULL, 'Certificateur égyptien historique (herbes, coton, dattes), agréé bio UE/NOP.', ARRAY['organic']);
SELECT _add_cert_body('Ecocert Maroc', 'Ecocert MA', 'ECOCERT-MA', 'Maroc', 'Africa', 'https://www.ecocert.com', 'https://www.ecocert.com/en/business-directory', 'Filiale marocaine d''Ecocert : bio UE/NOP, argane IGP, cosmétique COSMOS.', ARRAY['organic']);
SELECT _add_cert_body('Ecocert Afrique de l''Ouest', 'Ecocert AO', 'ECOCERT-AO', 'Sénégal', 'Africa', 'https://www.ecocert.com', 'https://www.ecocert.com/en/business-directory', 'Bureau régional Ecocert (Dakar) couvrant l''Afrique de l''Ouest : cacao, karité, mangue, anacarde.', ARRAY['organic','fair_trade']);

-- ---------- ASIE ----------
SELECT _add_cert_body('OneCert International', 'OneCert', 'ONECERT', 'Inde', 'Asia', 'https://www.onecertinternational.com', NULL, 'Certificateur indien multi-agréments (NPOP, NOP, bio UE), actif en Asie et en Afrique.', ARRAY['organic']);
SELECT _add_cert_body('Indocert', 'Indocert', 'INDOCERT', 'Inde', 'Asia', 'https://www.indocert.org', NULL, 'Certificateur indien à but non lucratif (Kerala), référence épices et plantations du Sud.', ARRAY['organic','fair_trade']);
SELECT _add_cert_body('Japan Organic & Natural Foods Association', 'JONA', 'JONA', 'Japon', 'Asia', 'https://www.jona-japan.org', NULL, 'Principal certificateur JAS bio privé du Japon, agréé aussi NOP/UE.', ARRAY['organic']);
SELECT _add_cert_body('China Organic Food Certification Center', 'COFCC', 'COFCC', 'Chine', 'Asia', 'http://www.ofcc.org.cn', NULL, 'Centre national chinois de certification bio (rattaché au ministère de l''Agriculture).', ARRAY['organic']);
SELECT _add_cert_body('Organic Agriculture Certification Thailand', 'ACT', 'ACT', 'Thaïlande', 'Asia', 'https://actorganic-cert.or.th', NULL, 'Certificateur thaïlandais de référence en Asie du Sud-Est (riz, noix de coco), agréé IFOAM.', ARRAY['organic']);
SELECT _add_cert_body('BIOCert Indonesia', 'BIOCert', 'BIOCERT', 'Indonésie', 'Asia', 'https://www.biocert.co.id', NULL, 'Certificateur bio indonésien (épices, noix de coco, café).', ARRAY['organic']);
SELECT _add_cert_body('Organic Certification Center of the Philippines', 'OCCP', 'OCCP', 'Philippines', 'Asia', 'https://occpphils.org', NULL, 'Organisme de certification bio philippin de référence.', ARRAY['organic']);

-- ---------- OCÉANIE ----------
SELECT _add_cert_body('ACO Certification', 'ACO', 'ACO', 'Australie', 'Oceania', 'https://aco.net.au', 'https://aco.net.au/find-certified-operators/', 'Plus grand certificateur bio d''Australie (Australian Certified Organic Standard).', ARRAY['organic']);
SELECT _add_cert_body('NASAA Certified Organic', 'NASAA', 'NASAA', 'Australie', 'Oceania', 'https://nasaacertifiedorganic.org.au', NULL, 'Certificateur bio australien historique, actif aussi dans le Pacifique et en Asie.', ARRAY['organic']);
SELECT _add_cert_body('BioGro New Zealand', 'BioGro', 'BIOGRO', 'Nouvelle-Zélande', 'Oceania', 'https://www.biogro.co.nz', 'https://www.biogro.co.nz/organic-directory', 'Principal label et certificateur bio néo-zélandais.', ARRAY['organic']);
SELECT _add_cert_body('AsureQuality', 'AsureQuality', 'AQ', 'Nouvelle-Zélande', 'Oceania', 'https://www.asurequality.com', NULL, 'Organisme public néo-zélandais : bio, sécurité alimentaire, export.', ARRAY['organic','sustainable']);

-- ---------- MOYEN-ORIENT ----------
SELECT _add_cert_body('ETKO', 'ETKO', 'ETKO', 'Turquie', 'Middle East', 'https://www.etko.com.tr', NULL, 'Premier certificateur bio turc (agréé UE/NOP/JAS), référence pour fruits secs et coton.', ARRAY['organic','ethical']);
SELECT _add_cert_body('Agrior', 'Agrior', 'AGRIOR', 'Israël', 'Middle East', 'https://www.agrior.co.il', NULL, 'Certificateur bio israélien agréé UE/NOP (herbes, dattes, agrumes).', ARRAY['organic']);

DROP FUNCTION _add_cert_body(text, text, text, text, certification_region_enum, text, text, text, text[]);

-- Bilan
SELECT region, count(*) FROM certification_bodies GROUP BY region ORDER BY region;
