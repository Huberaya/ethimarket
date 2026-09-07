-- Densification acheteurs vague 11 (sept. 2026) : réseau bio Morbihan (56).
-- Multiplicateur clé : Les 7 Épis (réseau lorientais, 6 magasins).
-- Sources annuaires. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

('buyer', 1, 'biocoop', 'Biocoop Les 7 Épis Centre-Ville (Lorient)', 'Lorient (7 r. Vauban)', 'France',
 NULL, NULL, NULL, 'seed:v11 | contact:pagesjaunes-fiche',
 'RÉSEAU LES 7 ÉPIS : 6 magasins (Lorient centre + Keryado, Lanester, Guidel, Riantec) — coopérative lorientaise historique (4,5/5, 102 avis). Le centre-ville = point d''entrée. Un accord = 6 magasins. Standard réseau repéré : 02 97 76 77 00.'),
('buyer', 1, 'biocoop', 'Biocoop Les 7 Épis Keryado', 'Lorient (ZI Keryado)', 'France',
 NULL, '02 97 76 77 00', NULL, 'seed:v11 | contact:pagesjaunes', 'Réseau 7 Épis.'),
('buyer', 1, 'biocoop', 'Biocoop Les 7 Épis Lanester', 'Lanester (PA Manébos)', 'France',
 NULL, NULL, NULL, 'seed:v11 | contact:pagesjaunes-fiche', 'Réseau 7 Épis.'),
('buyer', 1, 'biocoop', 'Biocoop Les 7 Épis Guidel', 'Guidel (Les Cinq Chemins)', 'France',
 NULL, NULL, NULL, 'seed:v11 | contact:pagesjaunes-fiche', 'Réseau 7 Épis.'),
('buyer', 1, 'biocoop', 'Biocoop Les 7 Épis Riantec', 'Riantec (31 r. de Kerdurand)', 'France',
 NULL, NULL, NULL, 'seed:v11 | contact:pagesjaunes-fiche', 'Réseau 7 Épis.'),
('buyer', 1, 'epicerie_bio', 'Bio Golfe', 'Vannes (6 r. Joseph Le Brix)', 'France',
 NULL, NULL, NULL, 'seed:v11 | contact:pagesjaunes-fiche', 'Indépendant vannetais centre-ville.'),
('buyer', 1, 'biocoop', 'Biocoop Carnac', 'Carnac (4 bis r. du Rahic)', 'France',
 NULL, NULL, NULL, 'seed:v11 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'biocoop', 'Biocoop La Belz Saison', 'Belz (ZA Suroit)', 'France',
 NULL, NULL, NULL, 'seed:v11 | contact:pagesjaunes-fiche', 'Ria d''Étel.'),
('buyer', 1, 'biocoop', 'Biocoop Le Panier Bio', 'Muzillac (Espace Littoral)', 'France',
 NULL, NULL, NULL, 'seed:v11 | contact:pagesjaunes-fiche', 'Sud Morbihan — même ville qu''Ar Tizan (torréfacteur).'),
('buyer', 1, 'biocoop', 'Biocoop Callune Pontivy', 'Pontivy (2 r. Colette Besson)', 'France',
 NULL, NULL, NULL, 'seed:v11 | contact:pagesjaunes-fiche', 'Centre Bretagne.'),
('buyer', 1, 'epicerie_bio', 'Alré Bio', 'Auray (8 r. d''Irlande)', 'France',
 NULL, NULL, NULL, 'seed:v11 | contact:pagesjaunes-fiche', 'Indépendant alréen.'),
('buyer', 1, 'epicerie_bio', 'L''Halle Terre Native', 'Questembert (r. Cadoudal)', 'France',
 NULL, NULL, NULL, 'seed:v11 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'transformateur', 'Biscuiterie de Kerlann (Vannes)', 'Vannes (ZA Kerlann)', 'France',
 NULL, NULL, NULL, 'seed:v11 | contact:pagesjaunes-fiche',
 '2e site de la biscuiterie (déjà au CRM à Savenay) — confirme le profil multi-sites : interlocuteur achats centralisé.'),
('buyer', 1, 'torrefacteur', 'Ar Tizan', 'Muzillac (33 r. René Bazin)', 'France',
 NULL, NULL, NULL, 'seed:v11 | contact:pagesjaunes-fiche', 'Torréfacteur artisanal du sud Morbihan.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
