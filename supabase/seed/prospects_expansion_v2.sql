-- Expansion du CRM (sept. 2026) : nouvelles villes Grand Ouest + phase 2,
-- nouveaux acheteurs et producteurs RÉELS avec coordonnées publiques vérifiées.
-- Sources notées ligne par ligne. Aucune donnée inventée.
-- Rejouable : INSERT si le nom n'existe pas déjà.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ================= ACHETEURS — TORRÉFACTEURS (nouvelles villes Grand Ouest, phase 1)
('buyer', 1, 'torrefacteur', 'Café d''Oriant', 'Lorient (1 r. Louis Faidherbe)', 'France',
 NULL, '06 43 53 20 87', NULL, 'seed:v2 | contact:pagesjaunes',
 'Torréfacteur artisanal lorientais. 2e n° : 02 97 85 42 90.'),
('buyer', 1, 'torrefacteur', 'Cafés Laurent Coïc', 'Lorient (16 r. de la Patrie)', 'France',
 NULL, '02 97 64 60 77', NULL, 'seed:v2 | contact:pagesjaunes',
 'Torréfaction familiale, boutique thés + cafés centre-ville. Opposé au démarchage marketing : appel utile et court, pas de séquence agressive.'),
('buyer', 1, 'torrefacteur', 'Moka Lorient', 'Lorient (12 r. de Liège)', 'France',
 NULL, '02 56 54 82 86', NULL, 'seed:v2 | contact:pagesjaunes',
 'Boutique café/thé + consommation sur place.'),
('buyer', 1, 'torrefacteur', 'Brûlerie Saint-Patern', 'Vannes (4 r. St-Nicolas)', 'France',
 NULL, '02 97 29 68 69', NULL, 'seed:v2 | contact:pagesjaunes',
 'Brûlerie artisanale du quartier St-Patern.'),
('buyer', 1, 'torrefacteur', 'Sygetik', 'Vannes (15 pl. de la République)', 'France',
 NULL, '02 97 60 48 94', NULL, 'seed:v2 | contact:pagesjaunes',
 'Torréfacteur — bons avis sur la livraison.'),
('buyer', 1, 'torrefacteur', 'Etienne Coffee & Shop Vannes', 'Vannes (7 r. Porte Prison)', 'France',
 NULL, '02 97 42 81 07', NULL, 'seed:v2 | contact:pagesjaunes',
 'Franchise Etienne (Odyssée Breizh) — décision locale possible sur le café de spécialité.'),
('buyer', 1, 'torrefacteur', 'Brûlerie Jouénard', 'Rennes (7 r. Chateaurenault)', 'France',
 NULL, '02 99 79 14 25', NULL, 'seed:v2 | contact:yelp/le-site-de',
 'Brûlerie historique rennaise.'),
('buyer', 1, 'torrefacteur', 'Caffè Cataldi', 'Louargat (22, entre Guingamp et Morlaix)', 'France',
 NULL, '06 79 88 30 71', 'https://www.caffe-cataldi.fr', 'seed:v2 | contact:pagesjaunes',
 'Torréfaction italienne artisanale en Trégor.'),
('buyer', 1, 'torrefacteur', 'Cafés BOC (Brûlerie BOC)', 'Le Mans (6 r. Courthardy)', 'France',
 NULL, '02 43 24 19 06', 'https://www.brulerieboc.com', 'seed:v2 | contact:pagesjaunes',
 'Torréfacteur manceau — cafés de spécialité affichés.'),

-- ================= ACHETEURS — TORRÉFACTEURS phase 2 (hors Grand Ouest)
('buyer', 2, 'torrefacteur', 'Café Piha', 'Bordeaux (69 r. des Ayres)', 'France',
 'contact@cafepiha.com', '09 67 80 83 42', 'https://www.cafepiha.com', 'seed:v2 | contact:site-officiel',
 'Coffee shop + torréfacteur (fondé 2016, P. Guérin & C. Laffargue). Inspiration néo-zélandaise.'),
('buyer', 2, 'torrefacteur', 'L''Alchimiste', 'Bordeaux (87 quai de Queyries)', 'France',
 NULL, '06 65 05 25 91', 'https://alchimiste-cafes.com', 'seed:v2 | contact:yelp',
 'Torréfacteur bordelais réputé, atelier Bastide — cafés bio.'),
('buyer', 2, 'torrefacteur', 'Terres de Café', 'Paris (14 r. Rambuteau, 75003)', 'France',
 NULL, '01 42 78 49 79', 'https://www.terresdecafe.com', 'seed:v2 | contact:pagesjaunes',
 'Acteur majeur du café de spécialité FR (plusieurs boutiques Paris + Versailles). Gros compte : préparer un dossier, pas un cold call.'),

-- ================= ACHETEURS — ÉPICERIES (nouvelles villes, phase 1)
('buyer', 1, 'epicerie_bio', 'Scarabée Biocoop Papu', 'Rennes (18 r. Papu)', 'France',
 NULL, '02 23 22 29 09', 'https://scarabee-biocoop.fr', 'seed:v2 | contact:justacote',
 'Coopérative Scarabée (SCIC, 5+ magasins rennais) — la coop locale la plus militante de Bretagne. Entrer par un magasin, viser le référencement coop ensuite.'),
('buyer', 1, 'epicerie_bio', 'Scarabée Biocoop Jacques Cartier', 'Rennes (11 pl. Thérèse Pierre)', 'France',
 NULL, '02 21 65 00 30', 'https://scarabee-biocoop.fr', 'seed:v2 | contact:pagesjaunes', NULL),
('buyer', 1, 'epicerie_bio', 'Scarabée Biocoop Vasselot', 'Rennes (10 r. Vasselot)', 'France',
 NULL, '02 90 22 69 79', 'https://scarabee-biocoop.fr', 'seed:v2 | contact:pagesjaunes',
 'Centre-ville — vrac important.'),
('buyer', 1, 'epicerie_bio', 'Des Halles et des Gourmets', 'Angers (26 bis rte de Bouchemaine)', 'France',
 NULL, '02 41 44 02 58', 'http://www.deshallesetdesgourmets.com', 'seed:v2 | contact:epicerieinfo',
 'Épicerie fine angevine — angle vanille/safran/argane.'),

-- ================= ACHETEURS — CHOCOLATIER (phase 2)
('buyer', 2, 'chocolatier', 'Grain de Sail (chocolaterie)', 'Morlaix (7 r. du Cosquer)', 'France',
 NULL, '02 98 62 40 91', 'https://graindesail.com', 'seed:v2 | contact:tourismebretagne',
 'Chocolaterie + torréfaction, importe cacao/café à la voile — l''acteur le plus aligné valeurs du Grand Ouest. Angle : cacao Ghana géolocalisé EUDR + logistique bas-carbone.'),

-- ================= PRODUCTEURS — CAFÉ/CACAO Amérique latine (vague 2)
('producer', 2, 'cafe', 'Cooperativa Norandino (Piura, Pérou)', 'Piura (zone industrielle II)', 'Pérou',
 'coopnorandino@coopnorandino.com.pe', '+51 947 006 792', 'https://coopnorandino.com.pe', 'seed:v2 | contact:site-officiel',
 'Coopérative faîtière (~7 000 membres, café + cacao + panela), FLO ID 21943, bio+équitable. E-mail export public : exportaciones@coopnorandino.com.pe. La référence nord-Pérou.'),
('producer', 2, 'cafe', 'Cenfrocafé (Cajamarca, Pérou)', 'Jaén, Cajamarca', 'Pérou',
 NULL, NULL, 'https://www.cenfrocafe.com.pe', 'seed:v2 | contact:site-officiel-a-qualifier',
 '~3 000 membres, exporte sous sa propre licence depuis 2011, arabicas lavés 1 600-1 700 m. Contact à qualifier via formulaire du site officiel.'),

-- ================= PRODUCTEURS — QUINOA (vague 2)
('producer', 2, 'quinoa', 'COOPAIN Cabana (Puno, Pérou)', 'Cabana, Puno', 'Pérou',
 'administracion@coopaincabana.com.pe', '+51 922 706 461', 'https://www.coopaincabana.com.pe', 'seed:v2 | contact:site-officiel',
 'Coopérative quinoa bio perlé (601 membres, 73 % de femmes), exporte en direct depuis 2012 vers USA/Allemagne/France/Pays-Bas. Direction : gerencia@coopaincabana.com.'),

-- ================= PRODUCTEURS — ÉPICES (vague 2)
('producer', 2, 'epices', 'PDS Organic Spices (Kerala, Inde)', 'Peermade, Idukki (Kerala)', 'Inde',
 'pds@pdspeermade.com', '+91 4869 232 197', 'https://pdspeermade.com', 'seed:v2 | contact:site-officiel',
 'Peermade Development Society : cardamome, poivre, muscade des Ghâts occidentaux. Certifiée bio (Control Union) UE/USA/Japon + Fairtrade FLOCert + Demeter partiel. E-mail 2 : pdsngo1980@gmail.com.'),
('producer', 2, 'epices', 'Union Fanohana (Madagascar)', 'Côte Est (Tamatave)', 'Madagascar',
 NULL, NULL, NULL, 'seed:v2 | source:ethiquable-a-qualifier',
 '542 producteurs — litchi, vanille, poivre, cannelle, baies roses, gingembre. Première coop malgache à exporter épices en direct. Contact direct à qualifier (partenaire historique d''Ethiquable).'),

-- ================= PRODUCTEURS — THÉ (vague 1 étendue)
('producer', 2, 'epices', 'SOFA — Small Organic Farmers Association (Sri Lanka)', 'Kandy / Uva', 'Sri Lanka',
 NULL, '+94 81 220 2302', 'https://www.biofoodslk.com', 'seed:v2 | contact:biofoods',
 'Coopérative fondée 1993, 2 600+ producteurs : thé, épices, coco, riz — bio + Fairtrade. Point d''entrée commercial : Bio Foods Ltd (Kandy), partenaire historique de SOFA.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
