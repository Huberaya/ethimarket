-- Densification acheteurs vague 6 (sept. 2026) : couverture départementale
-- 44 côte / 35 / 85 via annuaires professionnels. Sources notées. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ============ LOIRE-ATLANTIQUE — côte & périphérie (phase 1)
('buyer', 1, 'torrefacteur', 'La Brûlerie de Pornic', 'Pornic (3 r. Général Buat)', 'France',
 NULL, NULL, NULL, 'seed:v6 | contact:pagesjaunes-a-qualifier',
 'Brûlerie certifiée AB au cœur de Pornic — tél. à qualifier (fiche PJ sans numéro affiché).'),
('buyer', 1, 'torrefacteur', 'The Caramel & Chocolat', 'Pornic (17 r. Mar. Foch)', 'France',
 NULL, '02 40 19 11 82', NULL, 'seed:v6 | contact:pagesjaunes',
 'Torréfaction + chocolat à Pornic (5/5) — double angle café + cacao.'),
('buyer', 1, 'torrefacteur', 'La Route des Comptoirs', 'Le Landreau (1 la Bossardière)', 'France',
 NULL, NULL, NULL, 'seed:v6 | contact:pagesjaunes-a-qualifier',
 'Torréfacteur ET importateur de cacao (vignoble nantais) — profil B2B rare : à qualifier en priorité.'),
('buyer', 1, 'torrefacteur', 'Etienne Coffee & Shop La Baule', 'La Baule (1 pl. de la Victoire)', 'France',
 NULL, NULL, NULL, 'seed:v6 | contact:pagesjaunes-a-qualifier',
 'Franchise Etienne côte d''amour — même angle que Vannes.'),

-- ============ ILLE-ET-VILAINE — au-delà de Rennes (phase 1)
('buyer', 1, 'grossiste', 'Lobodis', 'Bain-de-Bretagne (r. Sabin)', 'France',
 NULL, '02 99 44 11 42', 'https://www.lobodis.com', 'seed:v6 | contact:pagesbreizh',
 'PIONNIER français du café équitable (torréfacteur breton engagé, pur arabica, partenariats coopératives depuis 30 ans, distribution GMS/spécialisé). Cible majeure : leur sourcing EST notre métier. Approche partenariat, pas cold call.'),
('buyer', 1, 'torrefacteur', 'Les Cafés Félix', 'Pacé (Village des Artisans, bd Odet)', 'France',
 NULL, '02 99 67 50 57', NULL, 'seed:v6 | contact:pagesbreizh',
 'Brûlerie + NÉGOCE : importation de café ET de cacao — profil importateur régional, angle approvisionnement direct documenté.'),
('buyer', 1, 'torrefacteur', 'Cafés Manifeste', 'Melesse (2 r. Xavier Grall)', 'France',
 NULL, NULL, NULL, 'seed:v6 | contact:pagesjaunes-a-qualifier',
 'Cafés de spécialité « respectueux de l''environnement et de l''humain » — alignement valeurs total, à qualifier.'),
('buyer', 1, 'torrefacteur', 'Les Cafés Mauri', 'Vern-sur-Seiche (9 r. Croix Pilonnière)', 'France',
 NULL, NULL, NULL, 'seed:v6 | contact:pagesjaunes-a-qualifier',
 'Torréfacteur périphérie rennaise (4,9/5 Google, 27 avis) — gamme complète café + machines (CHR).'),
('buyer', 1, 'torrefacteur', 'Brin de Café', 'Vitré (1 r. Duguesclin)', 'France',
 NULL, '02 23 55 59 54', 'https://www.brindecafe.eu', 'seed:v6 | contact:pagesjaunes',
 'Torréfaction labellisée AB + épicerie fine à Vitré.'),
('buyer', 1, 'torrefacteur', 'Embruns & Saveurs', 'Mordelles (4 r. Doct. Dordain)', 'France',
 NULL, '09 81 27 57 32', NULL, 'seed:v6 | contact:pagesbreizh', NULL),
('buyer', 1, 'torrefacteur', 'Lindfield & Company', 'Dinard (48 r. Levavasseur)', 'France',
 NULL, '02 99 16 96 77', NULL, 'seed:v6 | contact:pagesbreizh',
 'Torréfacteur de la côte d''émeraude.'),
('buyer', 1, 'torrefacteur', 'Atelier des Comptoirs', 'Dol-de-Bretagne (7 r. Rouelle)', 'France',
 NULL, '06 83 91 95 76', NULL, 'seed:v6 | contact:pagesjaunes',
 'Torréfaction artisanale certifiée AB, démarche éthique affichée.'),
('buyer', 1, 'torrefacteur', 'La Brûlerie du Castel', 'Domloup (3 ch. de Launay)', 'France',
 NULL, '06 78 65 11 09', NULL, 'seed:v6 | contact:pagesjaunes', NULL),
('buyer', 1, 'torrefacteur', 'La Brûlerie du Marché Harel', 'La Bouëxière (2 la Petite Mesendais)', 'France',
 NULL, '06 44 30 77 25', NULL, 'seed:v6 | contact:pagesjaunes', NULL),
('buyer', 1, 'torrefacteur', 'Les Cafés Breizhiliens', 'La Bouëxière (Chêne à la Vierge)', 'France',
 NULL, NULL, NULL, 'seed:v6 | contact:pagesjaunes-a-qualifier',
 'Café AB + épicerie fine bretonne — à qualifier.'),

-- ============ NORMANDIE SUD (phase 1 étendue)
('buyer', 1, 'torrefacteur', 'Montcafé', 'Avranches (5 pl. St-Aubert)', 'France',
 NULL, '02 33 60 37 99', NULL, 'seed:v6 | contact:pagesjaunes',
 'Torréfacteur de la baie du Mont-St-Michel — sur la route Rennes↔Caen.'),

-- ============ VENDÉE (phase 1)
('buyer', 1, 'torrefacteur', 'Cafés Albert (atelier)', 'La Roche-sur-Yon (39 imp. Paul Renaud)', 'France',
 NULL, '02 51 37 06 16', NULL, 'seed:v6 | contact:pagesjaunes',
 'Torréfaction artisanale vendéenne — boutiques « Maison Albert » (pl. Napoléon + Ylium Sables : 02 51 01 93 95). L''atelier décide.'),
('buyer', 1, 'torrefacteur', 'The Cordier', 'La Roche-sur-Yon (9 r. des Halles)', 'France',
 NULL, NULL, NULL, 'seed:v6 | contact:pagesjaunes-a-qualifier',
 'Thés + cafés aux Halles — fin connaisseur selon les avis, à qualifier.'),
('buyer', 1, 'torrefacteur', 'La Brûlerie des Olonnes', 'Olonne-sur-Mer (269 ter av. F. Mitterrand)', 'France',
 NULL, NULL, NULL, 'seed:v6 | contact:pagesjaunes-a-qualifier', NULL)

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
