-- Densification acheteurs vague 13 (sept. 2026) : Mayenne (53) + Côtes-d'Armor (22).
-- Multiplicateurs clés : Mayenne Bio Soleil (coopérative, 6 magasins) et
-- La Gambille (coopérative briochine 1983, 5 magasins + 2 boucheries, 50-99 salariés).
-- Sources : annuaires pagesjaunes départementaux, sites Biocoop officiels, presse. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ============================================================ MAYENNE (53)
('buyer', 1, 'biocoop', 'Biocoop Mayenne Bio Soleil (réseau 6 magasins)', 'Laval (8 r. Bir Hakeim)', 'France',
 NULL, '02 43 66 98 88', 'https://mayennebiosoleil.biocoop.net', 'seed:v13 | contact:civambio53/pagesjaunes',
 'RÉSEAU MAYENNE BIO SOLEIL : coopérative de consommateurs fondée en 1989, 6 magasins en Mayenne (Laval Ouest/Est, Mayenne 6 bd Anatole France, Château-Gontier rte de Sablé…). Priorité affichée aux producteurs locaux ET à l''équitable. Un accord = tout le département.'),
('buyer', 1, 'biocoop', 'Biocoop Laval Est', 'Laval (28 bd de l''Industrie)', 'France',
 NULL, NULL, NULL, 'seed:v13 | contact:pagesjaunes-fiche', 'Réseau Mayenne Bio Soleil — passer par le siège (8 r. Bir Hakeim).'),
('buyer', 1, 'torrefacteur', 'Le Caféier (Laval)', 'Laval (37 allée du Vieux Saint-Louis)', 'France',
 NULL, '02 43 56 67 71', 'http://lecafeier.e-monsite.com', 'seed:v13 | contact:pagesjaunes',
 'Torréfaction artisanale + IMPORTATION et négoce de café, café bio au catalogue : profil importateur-torréfacteur, pitch sourcing direct pertinent.'),
('buyer', 1, 'torrefacteur', 'Thé & Café (Laval)', 'Laval (25 pl. de la Trémoille)', 'France',
 NULL, '02 43 53 07 24', 'https://thecafe53.wordpress.com', 'seed:v13 | contact:pagesjaunes',
 'Torréfacteur-boutique du centre-ville lavallois. Couplable avec Le Caféier et Mayenne Bio Soleil (même tournée).'),
('buyer', 1, 'epicerie_bio', 'CBio Alimentation (Saint-Fort)', 'Saint-Fort (23 av. de Saint-Fort)', 'France',
 NULL, NULL, NULL, 'seed:v13 | contact:pagesjaunes-fiche',
 'Épicerie bio/locale sud-Mayenne (commerce équitable d''alimentation référencé) — proche Château-Gontier.'),

-- ============================================================ CÔTES-D'ARMOR (22)
('buyer', 1, 'biocoop', 'Biocoop La Gambille (réseau 5 magasins + 2 boucheries)', 'Saint-Brieuc (2 r. Michelet)', 'France',
 NULL, '02 96 70 00 74', 'https://stbrieuc-centre.biocoop.net', 'seed:v13 | contact:site-officiel',
 'RÉSEAU LA GAMBILLE : coopérative de consommateurs créée en 1983, 5 magasins + 2 boucheries (siège 13 imp. Lavoisier, Trégueux — 50-99 salariés), 150+ producteurs locaux. Magasin Robien : 02 96 75 12 85. Un accord = le bassin briochin entier.'),
('buyer', 1, 'torrefacteur', 'La Fumisterie (Saint-Cast-le-Guildo)', 'Saint-Cast-le-Guildo (5 r. de la Noé)', 'France',
 NULL, '06 89 37 10 54', 'https://www.la-fumisterie.com', 'seed:v13 | contact:pagesjaunes',
 'Torréfaction artisanale de cafés de SPÉCIALITÉ affichant « rémunérant mieux leurs producteurs » + offres pros dédiées (SARL 2022, SIRET 912414513) : alignement valeurs quasi parfait. Standby mairie : 02 96 41 80 18.'),
('buyer', 1, 'torrefacteur', 'Brûlerie du Ménez Bré', 'Pédernec (ZA Miquès)', 'France',
 NULL, '02 96 45 20 51', 'https://www.bruleriedumenezbre.com', 'seed:v13 | contact:pagesjaunes',
 'Brûlerie historique du Trégor (ex-Café André, fusion 2014), cafés certifiés AB, sourcing durable revendiqué. Sur l''axe Guingamp-Lannion, proche Caffè Cataldi (Louargat) : même tournée.'),
('buyer', 1, 'torrefacteur', 'Maison Reux — Les Passionnés du Café', 'Plérin (1 av. du Général de Gaulle)', 'France',
 NULL, '02 56 44 51 75', NULL, 'seed:v13 | contact:pagesjaunes',
 '20+ ans de torréfaction multi-origines + thés + matériel CHR (Rancilio) — repreneur 2023 « Les Passionnés du Café » (SAS 953840485) : dynamique de relance, ouvert aux nouveautés. Atelier ZA : 13 r. Brindejonc des Moulinais.'),
('buyer', 1, 'chocolatier', 'Chocolaterie le Duo (Guingamp)', 'Guingamp (46 r. Notre-Dame)', 'France',
 NULL, NULL, NULL, 'seed:v13 | contact:pagesjaunes-fiche',
 'Chocolaterie-salon depuis 2007 qui TORRÉFIE aussi son café (grains, vrac, grands crus) : double entrée cacao + café.'),
('buyer', 1, 'torrefacteur', 'Café du Commerce (Plouha)', 'Plouha (36 pl. du Maréchal Foch)', 'France',
 NULL, NULL, NULL, 'seed:v13 | contact:pagesjaunes-fiche',
 'Torréfaction sur place de cafés verts sélectionnés — entre Saint-Brieuc et Paimpol.'),
('buyer', 1, 'torrefacteur', 'Cafés d''Armor (Fréhel)', 'Fréhel (r. du Gué de l''An)', 'France',
 NULL, NULL, NULL, 'seed:v13 | contact:pagesjaunes-fiche',
 'Torréfaction AB tradition/innovation — côte d''Émeraude ouest, couplable avec La Fumisterie (Saint-Cast à 10 min).')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
