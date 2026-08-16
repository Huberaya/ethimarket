-- =============================================================
-- EthiMarket — Enrichissement des 13 produits existants avec les
-- données des 17 facettes du moteur intelligent + GPS producteurs.
-- Valeurs réalistes sourcées des ordres de grandeur sectoriels
-- (empreintes carbone/eau: FAO, Poore & Nemecek 2018).
-- Idempotent : UPDATE par slug, ré-exécutable sans danger.
-- =============================================================

-- ---------- 1. GPS des producteurs (centroïdes régions de production)
UPDATE producers SET latitude = 31.51, longitude = -8.77  WHERE slug = 'argan-atlas'       AND latitude IS NULL; -- Essaouira, Maroc
UPDATE producers SET latitude = 6.16,  longitude = 38.20  WHERE slug = 'yirgacheffe-union' AND latitude IS NULL; -- Yirgacheffe, Éthiopie
UPDATE producers SET latitude = 34.30, longitude = 47.06  WHERE slug = 'saffron-fields'    AND latitude IS NULL; -- Kermanshah, Iran
UPDATE producers SET latitude = -13.25,longitude = 50.00  WHERE slug LIKE 'vanille%'       AND latitude IS NULL; -- Sava, Madagascar
UPDATE producers SET latitude = -15.84,longitude = -70.02 WHERE slug LIKE 'quinoa%'        AND latitude IS NULL; -- Puno, Pérou
UPDATE producers SET latitude = 6.27,  longitude = -1.55  WHERE slug LIKE 'cacao-ghana%'   AND latitude IS NULL; -- Ashanti, Ghana

-- ---------- 2. Enrichissement produit par produit ----------

-- Café Éthiopien Yirgacheffe
UPDATE products SET
  product_type = 'café', target_gender = NULL,
  manufacturing_country = 'Éthiopie', raw_materials_origin = 'Éthiopie',
  carbon_footprint_kg = 1.6, water_footprint_liters = 140,
  is_vegan = true, is_recycled = false, recycled_percentage = 0,
  living_wage_guaranteed = true, fair_trade = false, social_audit_passed = true, is_cooperative = true,
  packaging_types = ARRAY['recyclable','compostable'],
  confidence_score = 88,
  batch_number = COALESCE(batch_number, 'LOT-2026-YIRG-014'),
  farming_method = COALESCE(farming_method, 'Agroforesterie sous ombrage'),
  gps_coordinates = COALESCE(gps_coordinates, '6.1620, 38.2005'),
  keywords = ARRAY['café','coffee','arabica','yirgacheffe','torréfaction','grains'],
  category_tags = ARRAY['café','épicerie','boisson'],
  attributes = attributes || '{"materials": [], "altitude_m": 1900, "variety": "Heirloom"}'::jsonb
WHERE slug = 'cafe-ethiopien-yirgacheffe';

-- Cacao Brut (Ghana)
UPDATE products SET
  product_type = 'cacao',
  manufacturing_country = 'Ghana', raw_materials_origin = 'Ghana',
  carbon_footprint_kg = 2.3, water_footprint_liters = 180,
  is_vegan = true, recycled_percentage = 0,
  living_wage_guaranteed = true, fair_trade = true, social_audit_passed = true, is_cooperative = true,
  packaging_types = ARRAY['compostable'],
  confidence_score = 84,
  batch_number = COALESCE(batch_number, 'LOT-2026-GH-CAC-07'),
  farming_method = COALESCE(farming_method, 'Culture traditionnelle sans intrants chimiques'),
  gps_coordinates = COALESCE(gps_coordinates, '6.2700, -1.5500'),
  keywords = ARRAY['cacao','chocolat','fèves','criollo','brut'],
  category_tags = ARRAY['cacao','épicerie'],
  attributes = attributes || '{"fermentation_days": 6, "variety": "Forastero"}'::jsonb
WHERE slug = 'cacao-brut';

-- Huile d'Argan Bio (Maroc)
UPDATE products SET
  product_type = 'huile',
  manufacturing_country = 'Maroc', raw_materials_origin = 'Maroc',
  carbon_footprint_kg = 1.1, water_footprint_liters = 90,
  is_vegan = true, recycled_percentage = 0,
  living_wage_guaranteed = true, fair_trade = true, social_audit_passed = true, is_cooperative = true,
  packaging_types = ARRAY['recyclable','deposit'],
  confidence_score = 90,
  batch_number = COALESCE(batch_number, 'LOT-2026-ARG-112'),
  farming_method = COALESCE(farming_method, 'Cueillette sauvage certifiée, pressage à froid'),
  gps_coordinates = COALESCE(gps_coordinates, '31.5085, -8.7710'),
  keywords = ARRAY['argan','huile','cosmétique','alimentaire','pressée à froid'],
  category_tags = ARRAY['huile','cosmétique','épicerie'],
  attributes = attributes || '{"extraction": "première pression à froid", "coop_femmes": true}'::jsonb
WHERE slug = 'huile-argan-bio';

-- Huile de Coco Bio (Sri Lanka)
UPDATE products SET
  product_type = 'huile',
  manufacturing_country = 'Sri Lanka', raw_materials_origin = 'Sri Lanka',
  carbon_footprint_kg = 1.4, water_footprint_liters = 250,
  is_vegan = true, recycled_percentage = 0,
  living_wage_guaranteed = true, fair_trade = true, social_audit_passed = false, is_cooperative = false,
  packaging_types = ARRAY['recyclable'],
  confidence_score = 76,
  batch_number = COALESCE(batch_number, 'LOT-2026-LK-COCO-31'),
  farming_method = COALESCE(farming_method, 'Cocoteraies familiales, extraction vierge'),
  gps_coordinates = COALESCE(gps_coordinates, '7.4863, 80.3623'),
  keywords = ARRAY['coco','huile','vierge','cuisine','cosmétique'],
  category_tags = ARRAY['huile','épicerie'],
  attributes = attributes || '{"extraction": "vierge extra"}'::jsonb
WHERE slug = 'huile-coco-bio';

-- Quinoa Bio (Pérou)
UPDATE products SET
  product_type = 'quinoa',
  manufacturing_country = 'Pérou', raw_materials_origin = 'Pérou',
  carbon_footprint_kg = 0.9, water_footprint_liters = 350,
  is_vegan = true, recycled_percentage = 0,
  living_wage_guaranteed = true, fair_trade = true, social_audit_passed = true, is_cooperative = true,
  packaging_types = ARRAY['compostable','bulk'],
  confidence_score = 86,
  batch_number = COALESCE(batch_number, 'LOT-2026-PE-QUI-09'),
  farming_method = COALESCE(farming_method, 'Culture andine traditionnelle, rotation des sols'),
  gps_coordinates = COALESCE(gps_coordinates, '-15.8402, -70.0219'),
  keywords = ARRAY['quinoa','céréale','graine','andes','protéine'],
  category_tags = ARRAY['céréales','épicerie'],
  attributes = attributes || '{"altitude_m": 3800, "variety": "Blanca de Juli"}'::jsonb
WHERE slug = 'quinoa-bio';

-- Safran Premium (Iran)
UPDATE products SET
  product_type = 'épices',
  manufacturing_country = 'Iran', raw_materials_origin = 'Iran',
  carbon_footprint_kg = 0.5, water_footprint_liters = 120,
  is_vegan = true, recycled_percentage = 0,
  living_wage_guaranteed = false, fair_trade = false, social_audit_passed = false, is_cooperative = false,
  packaging_types = ARRAY['recyclable'],
  confidence_score = 71,
  batch_number = COALESCE(batch_number, 'LOT-2026-IR-SAF-03'),
  farming_method = COALESCE(farming_method, 'Récolte manuelle à l''aube, séchage doux'),
  gps_coordinates = COALESCE(gps_coordinates, '34.3142, 47.0650'),
  keywords = ARRAY['safran','épice','stigmates','premium'],
  category_tags = ARRAY['épices','épicerie'],
  attributes = attributes || '{"grade": "Negin", "harvest": "manuelle"}'::jsonb
WHERE slug = 'safran-premium';

-- Curcuma Moulu (Inde)
UPDATE products SET
  product_type = 'épices',
  manufacturing_country = 'Inde', raw_materials_origin = 'Inde',
  carbon_footprint_kg = 0.8, water_footprint_liters = 200,
  is_vegan = true, recycled_percentage = 0,
  living_wage_guaranteed = false, fair_trade = true, social_audit_passed = false, is_cooperative = false,
  packaging_types = ARRAY['recyclable','bulk'],
  confidence_score = 72,
  batch_number = COALESCE(batch_number, 'LOT-2026-IN-CUR-22'),
  farming_method = COALESCE(farming_method, 'Agriculture biologique, séchage solaire'),
  gps_coordinates = COALESCE(gps_coordinates, '10.7905, 78.7047'),
  keywords = ARRAY['curcuma','turmeric','épice','moulu','curcumine'],
  category_tags = ARRAY['épices','épicerie'],
  attributes = attributes || '{"curcumine_pct": 4.2}'::jsonb
WHERE slug = 'curcuma-moulu';

-- Miel de Thym (Grèce)
UPDATE products SET
  product_type = 'miel',
  manufacturing_country = 'Grèce', raw_materials_origin = 'Grèce',
  carbon_footprint_kg = 0.4, water_footprint_liters = 30,
  is_vegan = false, recycled_percentage = 0,
  living_wage_guaranteed = true, fair_trade = false, social_audit_passed = false, is_cooperative = false,
  packaging_types = ARRAY['recyclable','deposit'],
  confidence_score = 79,
  batch_number = COALESCE(batch_number, 'LOT-2026-GR-MIEL-05'),
  farming_method = COALESCE(farming_method, 'Apiculture extensive, ruchers de montagne'),
  gps_coordinates = COALESCE(gps_coordinates, '35.2401, 24.8093'),
  keywords = ARRAY['miel','thym','apiculture','crète'],
  category_tags = ARRAY['miel','épicerie'],
  attributes = attributes || '{"floraison": "thym sauvage"}'::jsonb
WHERE slug = 'miel-thym';

-- Sirop d'Agave (Mexique)
UPDATE products SET
  product_type = 'sirop',
  manufacturing_country = 'Mexique', raw_materials_origin = 'Mexique',
  carbon_footprint_kg = 1.0, water_footprint_liters = 110,
  is_vegan = true, recycled_percentage = 0,
  living_wage_guaranteed = false, fair_trade = true, social_audit_passed = false, is_cooperative = true,
  packaging_types = ARRAY['recyclable'],
  confidence_score = 74,
  batch_number = COALESCE(batch_number, 'LOT-2026-MX-AGA-18'),
  farming_method = COALESCE(farming_method, 'Agave bleu, extraction basse température'),
  gps_coordinates = COALESCE(gps_coordinates, '20.8846, -103.8370'),
  keywords = ARRAY['agave','sirop','sucrant','naturel'],
  category_tags = ARRAY['sucrants','épicerie'],
  attributes = attributes || '{"index_glycemique": 19}'::jsonb
WHERE slug = 'sirop-agave';

-- Spiruline Bio (France)
UPDATE products SET
  product_type = 'spiruline',
  manufacturing_country = 'France', raw_materials_origin = 'France',
  carbon_footprint_kg = 0.6, water_footprint_liters = 45,
  is_vegan = true, recycled_percentage = 0,
  living_wage_guaranteed = true, fair_trade = false, social_audit_passed = true, is_cooperative = false,
  packaging_types = ARRAY['recyclable','plastic_free'],
  confidence_score = 91,
  batch_number = COALESCE(batch_number, 'LOT-2026-FR-SPI-02'),
  farming_method = COALESCE(farming_method, 'Culture en bassins, séchage basse température'),
  gps_coordinates = COALESCE(gps_coordinates, '43.6119, 3.8772'),
  keywords = ARRAY['spiruline','superaliment','protéine','algue'],
  category_tags = ARRAY['compléments','superaliments'],
  attributes = attributes || '{"proteines_pct": 65, "culture": "France"}'::jsonb
WHERE slug = 'spiruline-bio';

-- Thé Vert Sencha (Japon)
UPDATE products SET
  product_type = 'thé',
  manufacturing_country = 'Japon', raw_materials_origin = 'Japon',
  carbon_footprint_kg = 1.2, water_footprint_liters = 100,
  is_vegan = true, recycled_percentage = 0,
  living_wage_guaranteed = true, fair_trade = false, social_audit_passed = false, is_cooperative = false,
  packaging_types = ARRAY['recyclable','bulk'],
  confidence_score = 80,
  batch_number = COALESCE(batch_number, 'LOT-2026-JP-SEN-11'),
  farming_method = COALESCE(farming_method, 'Cueillette de printemps, étuvage vapeur'),
  gps_coordinates = COALESCE(gps_coordinates, '34.9756, 138.3828'),
  keywords = ARRAY['thé','vert','sencha','japon','infusion'],
  category_tags = ARRAY['thé','boisson'],
  attributes = attributes || '{"recolte": "ichibancha (première)"}'::jsonb
WHERE slug = 'the-vert-sencha';

-- Vanille Bourbon (Madagascar)
UPDATE products SET
  product_type = 'vanille',
  manufacturing_country = 'Madagascar', raw_materials_origin = 'Madagascar',
  carbon_footprint_kg = 0.7, water_footprint_liters = 60,
  is_vegan = true, recycled_percentage = 0,
  living_wage_guaranteed = true, fair_trade = true, social_audit_passed = true, is_cooperative = true,
  packaging_types = ARRAY['recyclable'],
  confidence_score = 87,
  batch_number = COALESCE(batch_number, 'LOT-2026-MG-VAN-08'),
  farming_method = COALESCE(farming_method, 'Pollinisation manuelle, affinage 8 mois'),
  gps_coordinates = COALESCE(gps_coordinates, '-13.2500, 50.0000'),
  keywords = ARRAY['vanille','bourbon','gousse','madagascar'],
  category_tags = ARRAY['épices','épicerie'],
  attributes = attributes || '{"taux_vanilline_pct": 1.8, "longueur_cm": 16}'::jsonb
WHERE slug = 'vanille-bourbon';

-- Sésame (France) — produit de test du vendeur Jean Dupont
UPDATE products SET
  product_type = 'graines',
  manufacturing_country = 'France', raw_materials_origin = 'France',
  carbon_footprint_kg = 0.9, water_footprint_liters = 95,
  is_vegan = true, recycled_percentage = 0,
  living_wage_guaranteed = false, fair_trade = false, social_audit_passed = false, is_cooperative = false,
  packaging_types = ARRAY['bulk'],
  confidence_score = 55,
  keywords = ARRAY['sésame','graines'],
  category_tags = ARRAY['graines','épicerie']
WHERE slug = 'ssame-7092';

-- ---------- 3. Recalcul des vecteurs de recherche ----------
UPDATE products SET search_vector =
  setweight(to_tsvector('french', immutable_unaccent(coalesce(name, ''))), 'A') ||
  setweight(to_tsvector('french', immutable_unaccent(coalesce(product_type, ''))), 'A') ||
  setweight(to_tsvector('french', immutable_unaccent(coalesce(short_description, ''))), 'B') ||
  setweight(to_tsvector('french', immutable_unaccent(coalesce(description, ''))), 'C') ||
  setweight(to_tsvector('french', immutable_unaccent(coalesce(array_to_string(keywords, ' '), ''))), 'B') ||
  setweight(to_tsvector('french', immutable_unaccent(coalesce(array_to_string(category_tags, ' '), ''))), 'B');
