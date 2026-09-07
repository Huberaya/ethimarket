-- Densification acheteurs (sept. 2026) : couverture en profondeur des villes
-- des vagues A-D — torréfacteurs, épiceries vrac, restaurants étoile verte,
-- chocolatiers, groupements. Sources notées. Aucune donnée inventée. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ================= NANTES — densification (phase 1)
('buyer', 1, 'torrefacteur', 'Au Bon Café Clavreul', 'Nantes (1-3 r. St-Léonard)', 'France',
 NULL, '02 40 47 16 55', 'https://www.cafeclavreul.com', 'seed:v5 | contact:pagesjaunes/allnantes',
 'Torréfacteur nantais historique bien noté (4,8/5). Opposé au démarchage marketing : appel utile, direct, pas de séquence.'),
('buyer', 1, 'torrefacteur', 'Compagnie Nantaise des Antilles', 'Nantes (8 r. Rubens)', 'France',
 NULL, '02 40 48 24 07', NULL, 'seed:v5 | contact:pagesjaunes',
 'Torréfaction nantaise — nom historique du négoce nantais.'),
('buyer', 1, 'torrefacteur', 'Kawa Coffee', 'Nantes (75 bd Ernest Dalby)', 'France',
 NULL, '09 77 71 53 02', NULL, 'seed:v5 | contact:allnantes',
 'Coffee shop/torréfaction bien noté (5/5, 34 avis).'),
('buyer', 1, 'torrefacteur', 'Comptoir NanTHÉ du CAFÉ', 'Nantes (6 r. Guépin)', 'France',
 NULL, '09 83 00 32 72', NULL, 'seed:v5 | contact:allnantes',
 'Comptoir thé + café centre-ville (4,7/5, 100 avis).'),
('buyer', 1, 'torrefacteur', 'ThéÔphil', 'Nantes (2 r. Franklin)', 'France',
 NULL, '02 40 73 97 93', NULL, 'seed:v5 | contact:allnantes',
 'Boutique thé/café (4,9/5) — angle sencha JAS + vanille.'),
('buyer', 1, 'epicerie_bio', 'Ô Bocal (épicerie & droguerie vrac)', 'Nantes (10 bis allée des Tanneurs)', 'France',
 'contact@obocal.com', '02 28 29 74 86', 'https://www.obocal.com', 'seed:v5 | contact:pleincentre/site',
 '1re boutique indépendante nantaise dédiée au vrac/zéro déchet (2016) — 100 % bio, circuits courts : alignement total.'),

-- ================= ANGERS — densification (phase 1)
('buyer', 1, 'torrefacteur', 'La Brûlerie du Pilori', 'Angers (6 r. St-Étienne)', 'France',
 NULL, '02 41 87 64 58', NULL, 'seed:v5 | contact:pagesjaunes',
 '« La meilleure boutique sur le sujet d''Angers » selon les avis.'),
('buyer', 1, 'torrefacteur', 'La Fève d''Or', 'Angers (77 r. Plantagenêt)', 'France',
 'contact@lafevedor.fr', '02 41 87 48 57', 'https://www.lafevedor.fr', 'seed:v5 | contact:site-officiel',
 'Brûlerie angevine avec vente en ligne.'),
('buyer', 1, 'torrefacteur', 'David Pasquier (torréfacteur)', 'Angers (72 r. Baudrière)', 'France',
 NULL, '06 61 47 46 95', NULL, 'seed:v5 | contact:pagesjaunes',
 'Torréfacteur artisan récemment installé — sélection courte et soignée : profil micro-lots.'),
('buyer', 1, 'torrefacteur', 'Brûlerie de Pithecus', 'Angers (6 r. Louis Blériot)', 'France',
 NULL, '07 87 33 43 01', NULL, 'seed:v5 | contact:pagesjaunes',
 'Torréfacteur passionné, bons conseils thé/café.'),
('buyer', 1, 'epicerie_bio', 'Bocalie (épicerie vrac)', 'Angers (13-17 r. Saumuroise)', 'France',
 'madeleine@bocalie-epicerie.fr', '06 46 04 24 86', 'https://www.bocalie-epicerie.fr', 'seed:v5 | contact:site-officiel',
 'Épicerie vrac de proximité (pl. de la Madeleine) — local, bio, sans emballage. Contact direct : Madeleine.'),

-- ================= BRETAGNE — densification (phase 1)
('buyer', 1, 'grossiste', 'Kafeta (union de torréfactions bretonnes)', 'Brest (2 av. de Provence)', 'France',
 'contact@kafeta.fr', '02 98 55 10 92', 'https://kafeta.fr', 'seed:v5 | contact:site-officiel/produitenbretagne',
 'LE multiplicateur breton : fédère Cafés Coïc, Brûlerie Menez Bré, 44 Café, Écume, Hermine Gourmande, Chocolat Gamin, Tea Coz, Théra. Intervient en CHR/GMS/entreprise. UN accord = 7+ torréfactions.'),
('buyer', 1, 'torrefacteur', 'Cafés Coïc', 'Quimper/Plomelin (63 Hent Penhoat Braz)', 'France',
 'cafes-coic@cafes-coic.com', '02 98 55 10 92', 'https://www.cafes-coic.com', 'seed:v5 | contact:petitfute/produitenbretagne',
 'Torréfacteur quimpérois (membre Kafeta), boutique allée de Kernenez : 02 98 10 67 15.'),
('buyer', 1, 'torrefacteur', 'Brûlerie d''Alré', 'Quimper (12 quai Stéïr)', 'France',
 NULL, NULL, NULL, 'seed:v5 | contact:pagesjaunes-a-qualifier',
 'Torréfaction 100 % arabica depuis 1971 (également présente à Auray). Tél. à qualifier.'),
('buyer', 1, 'restaurant', 'Racines (Virginie Giboire) ⭐', 'Rennes (4 pass. Antoinette-Caillot)', 'France',
 NULL, '02 99 65 64 21', 'https://www.racines-restaurant.fr', 'seed:v5 | contact:michelin/site-officiel',
 'Étoile Michelin (2019), cheffe Virginie Giboire — carte courte, produits choisis : angle vanille/safran authentifiés.'),
('buyer', 1, 'restaurant', 'Holen ⭐🌿', 'Rennes', 'France',
 NULL, NULL, NULL, 'seed:v5 | contact:michelin-a-qualifier',
 'Étoile + étoile VERTE Michelin (gastronomie durable) — notre angle exact. Coordonnées à qualifier.'),
('buyer', 1, 'restaurant', 'Empreinte 🌿 (Baptiste & Marine Fournier)', 'Vannes (15 pl. Valencia)', 'France',
 NULL, '02 97 46 06 42', 'https://empreinte-restaurant.fr', 'seed:v5 | contact:letelegramme',
 'Étoile verte Michelin, trophée Gault&Millau « Terroir d''Exception » — cuisine du marché, démarche locale/environnementale.'),

-- ================= GRAND OUEST ÉLARGI (phase 1)
('buyer', 1, 'epicerie_bio', 'Au Vrac Gourmand', 'La Rochelle (155 av. Denfert-Rochereau)', 'France',
 NULL, '06 19 19 66 26', 'https://auvracgourmand.fr', 'seed:v5 | contact:epicerieinfo',
 'Épicerie vrac rochelaise indépendante.'),
('buyer', 1, 'epicerie_bio', 'Merci Louis ! (épicerie fine)', 'La Rochelle (18 r. St-Nicolas)', 'France',
 NULL, '09 86 40 76 52', NULL, 'seed:v5 | contact:epicerieinfo',
 'Épicerie fine du quartier St-Nicolas (le quartier des indépendants rochelais).'),

-- ================= RENNES/VANNES — pâtisserie-chocolat (phase 1)
('buyer', 1, 'chocolatier', 'Maison Georges Larnicol (Rennes)', 'Rennes (13 r. Le Bastard)', 'France',
 NULL, '02 99 79 18 75', 'https://www.larnicol.com', 'seed:v5 | contact:yelp',
 'MOF chocolatier, plusieurs boutiques bretonnes (Vannes : 02 97 61 93 05) — angle cacao tracé + vanille.'),

-- ================= MONTPELLIER (phase 2, fond de pipeline sud)
('buyer', 2, 'torrefacteur', 'Torréfacteurs Montpellier (vague à qualifier)', 'Montpellier', 'France',
 NULL, NULL, NULL, 'seed:v5',
 'Vague sud : qualifier 5-8 torréfacteurs de spécialité montpelliérains (scène café dynamique) lors de la vague Lyon/Toulouse/Sud.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
