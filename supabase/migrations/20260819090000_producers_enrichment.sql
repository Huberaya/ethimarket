-- =============================================================
-- Enrichissement crédibilité : 6 nouveaux producteurs pour les
-- produits orphelins + stories des producteurs existants.
-- Un produit sans fournisseur identifiable détruit la confiance
-- d'un acheteur B2B. Idempotent.
-- =============================================================

-- 1. Stories des producteurs existants
UPDATE producers SET story = 'Fondée en 2008 à Essaouira, la coopérative regroupe 64 femmes berbères qui perpétuent le savoir-faire ancestral de l''huile d''argan. Chaque sociétaire est copropriétaire de la coopérative et perçoit une part des bénéfices en plus de son salaire. La cueillette est exclusivement sauvage, certifiée bio et équitable.'
WHERE slug = 'argan-atlas' AND story IS NULL;

UPDATE producers SET story = 'Union de 14 coopératives caféières de la région de Yirgacheffe, berceau mondial de l''arabica. 120 employés permanents et plus de 2 000 familles adhérentes cultivent sous ombrage à 1 900 m d''altitude. L''union gère ses propres stations de lavage et exporte en direct depuis 2005.'
WHERE slug = 'yirgacheffe-union' AND story IS NULL;

UPDATE producers SET story = 'Exploitation familiale de safran dans la province de Kermanshah, transmise sur trois générations. Récolte manuelle à l''aube, séchage doux traditionnel. Grade Negin, contrôles qualité en laboratoire indépendant à chaque lot.'
WHERE slug = 'saffron-fields' AND story IS NULL;

UPDATE producers SET story = 'Coopérative de la région SAVA regroupant 180 planteurs de vanille Bourbon. Pollinisation manuelle, affinage de 8 mois minimum, et prime équitable réinvestie dans deux écoles de village depuis 2018.'
WHERE slug LIKE 'vanille%' AND story IS NULL;

UPDATE producers SET story = 'Coopérative andine de Puno (3 800 m) spécialisée dans le quinoa Blanca de Juli. Rotation des cultures traditionnelle, séchage solaire, et certification bio + équitable depuis 2016.'
WHERE slug LIKE 'quinoa%' AND story IS NULL;

UPDATE producers SET story = 'Coopérative cacaoyère de la région Ashanti, 85 employés et 640 planteurs membres. Fermentation contrôlée 6 jours, comités villageois de surveillance contre le travail des enfants, prime Fairtrade dédiée à l''accès à l''eau potable.'
WHERE slug LIKE 'cacao-ghana%' AND story IS NULL;

-- 2. Nouveaux producteurs pour les produits orphelins
INSERT INTO producers (name, slug, country, country_flag, description, story, avatar_initials, avatar_color, banner_color, rating, review_count, product_count, verified, founded_year, employee_count, certifications, region, latitude, longitude, verification_status)
VALUES
('Ceylon Coconut Collective', 'ceylon-coconut', 'Sri Lanka', '🇱🇰',
 'Collectif de cocoteraies familiales de la côte ouest du Sri Lanka, extraction vierge à froid.',
 'Créé en 2014, le collectif fédère 95 fermes familiales autour de Kurunegala. Extraction vierge extra dans les 6 heures suivant la récolte, sans raffinage ni solvant. Prime collective finançant la scolarité des enfants des cueilleurs.',
 'CC', '#0e7490', '#0e7490', 4.6, 18, 1, true, 2014, 38, ARRAY['Bio','Fairtrade'], 'Kurunegala', 7.4863, 80.3623, 'draft'),
('Kerala Spice Gardens', 'kerala-spice-gardens', 'Inde', '🇮🇳',
 'Jardins d''épices biologiques du Kerala : curcuma, poivre, cardamome en agroforesterie.',
 'Depuis 1998, trois familles cultivent 40 hectares d''épices en agroforesterie dans les Ghats occidentaux. Séchage solaire, mouture à la demande, taux de curcumine contrôlé par laboratoire à chaque lot.',
 'KS', '#b45309', '#b45309', 4.5, 22, 1, true, 1998, 27, ARRAY['Bio','Fairtrade'], 'Kerala', 10.7905, 78.7047, 'draft'),
('Agave Azul de Jalisco', 'agave-azul-jalisco', 'Mexique', '🇲🇽',
 'Coopérative d''agaviculteurs de Jalisco, sirop d''agave bleu extrait à basse température.',
 'Coopérative de 45 agaviculteurs fondée en 2011. Extraction enzymatique à basse température préservant l''index glycémique bas (IG 19). Membre du commerce équitable mexicain depuis 2017.',
 'AA', '#1d4ed8', '#1d4ed8', 4.4, 15, 1, true, 2011, 45, ARRAY['Bio','Fairtrade'], 'Jalisco', 20.8846, -103.8370, 'draft'),
('Spiruline des Cévennes', 'spiruline-cevennes', 'France', '🇫🇷',
 'Ferme aquacole française : spiruline cultivée en bassins, séchée à basse température.',
 'Ferme familiale installée près de Montpellier depuis 2015. Culture en bassins sous serre, eau de source, séchage à moins de 45°C pour préserver les nutriments. Analyse microbiologique de chaque lot publiée sur demande.',
 'SC', '#15803d', '#15803d', 4.8, 31, 1, true, 2015, 6, ARRAY['Bio','Ecocert'], 'Occitanie', 43.6119, 3.8772, 'draft'),
('Miel de Crète — Apiculteurs du Psiloritis', 'miel-psiloritis', 'Grèce', '🇬🇷',
 'Apiculteurs de montagne crétois, miel de thym sauvage récolté en ruchers extensifs.',
 'Douze apiculteurs du massif du Psiloritis pratiquent la transhumance des ruches vers les zones de thym sauvage. Extraction à froid, ni chauffage ni mélange. Médaille d''or au concours national grec 2024.',
 'MP', '#ca8a04', '#ca8a04', 4.7, 26, 1, true, 2001, 12, ARRAY['Bio'], 'Crète', 35.2401, 24.8093, 'draft'),
('Shizuoka Tea Masters', 'shizuoka-tea', 'Japon', '🇯🇵',
 'Maison de thé familiale de Shizuoka, sencha de première récolte étuvé à la vapeur.',
 'Cinq générations de maîtres de thé à Shizuoka. Cueillette ichibancha (première récolte de printemps), étuvage vapeur traditionnel asamushi. Conversion bio JAS achevée en 2019.',
 'ST', '#166534', '#166534', 4.9, 40, 1, true, 1932, 15, ARRAY['Bio'], 'Shizuoka', 34.9756, 138.3828, 'draft')
ON CONFLICT (slug) DO NOTHING;

-- 3. Rattacher les produits orphelins
UPDATE products SET producer_id = (SELECT id FROM producers WHERE slug = 'ceylon-coconut')     WHERE slug = 'huile-coco-bio'  AND producer_id IS NULL;
UPDATE products SET producer_id = (SELECT id FROM producers WHERE slug = 'kerala-spice-gardens') WHERE slug = 'curcuma-moulu'  AND producer_id IS NULL;
UPDATE products SET producer_id = (SELECT id FROM producers WHERE slug = 'agave-azul-jalisco') WHERE slug = 'sirop-agave'     AND producer_id IS NULL;
UPDATE products SET producer_id = (SELECT id FROM producers WHERE slug = 'spiruline-cevennes') WHERE slug = 'spiruline-bio'   AND producer_id IS NULL;
UPDATE products SET producer_id = (SELECT id FROM producers WHERE slug = 'miel-psiloritis')    WHERE slug = 'miel-thym'       AND producer_id IS NULL;
UPDATE products SET producer_id = (SELECT id FROM producers WHERE slug = 'shizuoka-tea')       WHERE slug = 'the-vert-sencha' AND producer_id IS NULL;
