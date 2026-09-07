-- Densification acheteurs vague 12 (sept. 2026) : Sarthe (72) + Vendée (85).
-- Multiplicateurs clés : Le Fenouil Biocoop (coopérative mancelle, 6 magasins,
-- siège + e-mail officiel) et Léopold (enseigne bio Grand Ouest).
-- Sources : annuaires pagesjaunes départementaux + sites officiels. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ============================================================ SARTHE (72)
('buyer', 1, 'biocoop', 'Le Fenouil Biocoop (siège, réseau 6 magasins)', 'Le Mans (6 r. Cornet)', 'France',
 'contact@lefenouil-biocoop.fr', '02 43 82 22 38', 'https://lefenouil-biocoop.fr', 'seed:v12 | contact:site-officiel',
 'RÉSEAU LE FENOUIL : coopérative de consommateurs depuis 1981, 6 magasins (Sargé 02 43 81 87 71, Université 02 43 88 36 70, République 02 85 29 15 80, Atlantides 02 85 29 29 69, Antarès 02 43 78 93 82, Allonnes 02 85 29 18 00). Un accord siège = 6 magasins. Responsable publication : Solène Gaudin.'),
('buyer', 1, 'torrefacteur', 'Le Palais du Café (Le Mans)', 'Le Mans (15 r. Nationale)', 'France',
 NULL, '02 43 24 66 66', 'https://www.palaisducafe.fr', 'seed:v12 | contact:pagesjaunes',
 'Torréfaction sur place méthode traditionnelle, cafés grains/moulus + thés. 2e torréfacteur manceau au CRM après Cafés BOC.'),
('buyer', 1, 'torrefacteur', 'Café Ravane', 'La Ferté-Bernard (31 bis r. de l''Huisne)', 'France',
 NULL, '07 82 71 88 74', NULL, 'seed:v12 | contact:pagesjaunes',
 'Torréfaction artisanale + IMPORTATION café ET cacao en direct (SIRET 838483121) : profil importateur = pitch sourcing vérifié très pertinent.'),
('buyer', 1, 'epicerie_bio', 'Délices et Casteloir', 'Montval-sur-Loir (12 r. de Verdun, Château-du-Loir)', 'France',
 NULL, '02 43 79 11 60', 'https://ttsd.pro', 'seed:v12 | contact:pagesjaunes',
 'Épicerie fine depuis 2004 + atelier de torréfaction artisanale arabicas grands crus, paniers gourmands. Citée Petit Futé/Routard depuis 2008.'),
('buyer', 1, 'biocoop', 'Biocoop Les Iris (La Ferté-Bernard)', 'La Ferté-Bernard (47 av. Gén. de Gaulle)', 'France',
 NULL, NULL, NULL, 'seed:v12 | contact:pagesjaunes-fiche',
 'Indépendant, avis clients soulignent l''offre équitable. Tournée couplable avec Café Ravane (même ville).'),
('buyer', 1, 'biocoop', 'Biocoop Sablé-sur-Sarthe', 'Sablé-sur-Sarthe (rte du Mans)', 'France',
 NULL, NULL, NULL, 'seed:v12 | contact:pagesjaunes-fiche',
 'Magasin militant (produits locaux, vrac, thés Jardins de Gaïa) : sensibilité équitable affichée.'),
('buyer', 1, 'epicerie_bio', 'La Vie Claire Le Mans', 'Le Mans (17 r. Galère)', 'France',
 NULL, NULL, NULL, 'seed:v12 | contact:pagesjaunes-fiche',
 'Franchise du réseau La Vie Claire (centrale déjà au CRM à Lyon) : point local pour préparer le dossier centrale.'),
('buyer', 1, 'epicerie_bio', 'Annagram (épicerie vrac Le Mans)', 'Le Mans (188 r. Nationale)', 'France',
 NULL, NULL, NULL, 'seed:v12 | contact:pagesjaunes-fiche',
 'Épicerie vrac indépendante : profil identique à Ô Bocal/Bocalie (Nantes) qui matchent bien nos formats vrac.'),

-- ============================================================ VENDÉE (85)
('buyer', 1, 'epicerie_bio', 'Au Marché de Léopold (La Roche-sur-Yon)', 'La Roche-sur-Yon (85 av. Aliénor d''Aquitaine)', 'France',
 NULL, '02 51 37 69 46', 'https://magasin.leopold.fr', 'seed:v12 | contact:pagesjaunes',
 'ENSEIGNE LÉOPOLD : réseau de magasins bio du Grand Ouest (Gambetta & fils). Le magasin yonnais = point d''entrée pour tester l''enseigne.'),
('buyer', 1, 'torrefacteur', 'Café ôm''ri', 'Challans (passage Carnot)', 'France',
 'j.brossard@cafe-omri.com', '02 51 49 29 77', 'https://cafe-omri.com', 'seed:v12 | contact:facebook-officiel',
 'Torréfaction de cafés de SPÉCIALITÉ + e-shop (J. Brossard, 06 72 66 39 12). Cœur de cible micro-lots Yirgacheffe/Sidama.'),
('buyer', 1, 'epicerie_bio', 'Chez Nini et Ferdi', 'Les Achards (31 av. Georges Clemenceau)', 'France',
 NULL, '02 28 15 77 57', NULL, 'seed:v12 | contact:guide-vendee',
 'Épicerie bio zéro déchet/vrac (café, thé, épices en vrac — revend La Route des Comptoirs). Entre La Roche et Les Sables : sur la tournée côte. Portable : 06 82 87 39 10.'),
('buyer', 1, 'epicerie_bio', 'Naturellement (Challans)', 'Challans (8 r. du Général Leclerc)', 'France',
 'naturellemnt@orange.fr', '02 51 68 30 06', 'https://www.naturellement-bio.fr', 'seed:v12 | contact:annuaire-challans',
 'Indépendant challandais historique (4,4/5, 128 avis) : vrac + épicerie. Couplable avec Café ôm''ri (même ville).'),
('buyer', 2, 'grossiste', 'Groupe Merling (site La Roche-sur-Yon)', 'La Roche-sur-Yon (29 r. Charles Bourseul)', 'France',
 NULL, '02 51 46 16 12', 'https://www.groupemerling.fr', 'seed:v12 | contact:pagesjaunes',
 'Torréfacteur-distributeur majeur du Grand Ouest (siège Périgny 17, torréfaction lente depuis 1979, distribution automatique + CHR). Site yonnais 20-49 salariés. Phase 2 : gros volumes, approche dossier.'),
('buyer', 1, 'biocoop', 'Biocoop Croq''bio Nord (La Roche-sur-Yon)', 'La Roche-sur-Yon (34 bis av. Yitzhak Rabin)', 'France',
 NULL, '02 51 40 27 69', NULL, 'seed:v12 | contact:pagesjaunes',
 'Coopérative de consommateurs yonnaise, 2 magasins (Nord + Sud) + de 120 producteurs locaux : culture coopérative = notre langage.'),
('buyer', 1, 'biocoop', 'Biocoop Croq''bio Sud (La Roche-sur-Yon)', 'La Roche-sur-Yon (74 r. de Montréal)', 'France',
 NULL, NULL, NULL, 'seed:v12 | contact:pagesjaunes-fiche',
 'Second magasin de la coopérative Croq''bio — passer par le Nord (standard connu).'),
('buyer', 1, 'biocoop', 'Biocoop Saint-Hilaire-de-Riez', 'Saint-Hilaire-de-Riez (12 chem. de la Petite Croix)', 'France',
 NULL, NULL, NULL, 'seed:v12 | contact:pagesjaunes-fiche',
 'Grand magasin côte vendéenne (avis : produits locaux valorisés).'),
('buyer', 1, 'biocoop', 'Biocoop Les Dunes (Brem-sur-Mer)', 'Brem-sur-Mer (21 r. de l''Océan)', 'France',
 NULL, NULL, NULL, 'seed:v12 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'biocoop', 'Biocoop Alternative Bio (Noirmoutier)', 'La Guérinière (5 rte de Noirmoutier)', 'France',
 NULL, NULL, NULL, 'seed:v12 | contact:pagesjaunes-fiche', 'Île de Noirmoutier — indépendant du réseau Biocoop.'),
('buyer', 1, 'epicerie_bio', 'Nature Verte (Chantonnay)', 'Chantonnay (49 av. Georges Clemenceau)', 'France',
 NULL, NULL, NULL, 'seed:v12 | contact:pagesjaunes-fiche', 'Indépendant du bocage vendéen, gérante réputée à l''écoute.'),
('buyer', 1, 'torrefacteur', 'Café La Galerie des Thés', 'Saint-Gilles-Croix-de-Vie (24 pl. du Marché aux Herbes)', 'France',
 NULL, NULL, NULL, 'seed:v12 | contact:pagesjaunes-fiche',
 'Entreprise familiale, torréfaction sur place, grains entiers/moulus + salon.'),
('buyer', 1, 'torrefacteur', 'Bezirard (Fontenay-le-Comte)', 'Fontenay-le-Comte (72 r. de la République)', 'France',
 NULL, NULL, NULL, 'seed:v12 | contact:pagesjaunes-fiche', 'Torréfaction maîtrisée, grains/moulu/capsules — sud Vendée.'),
('buyer', 1, 'epicerie_bio', 'Le Palet Gourmand (Aizenay)', 'Aizenay (7 r. de la Monnaie)', 'France',
 NULL, NULL, NULL, 'seed:v12 | contact:pagesjaunes-fiche',
 'Épicerie fine + torréfaction dédiée, 100+ thés Dammann, chocolats Cluizel : profil revendeur premium multi-produits.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);

-- ============================================================ QUALIFICATIONS
-- La Brûlerie des Olonnes : fiche « à qualifier » (v6) → coordonnées officielles trouvées.
UPDATE prospects SET
  phone = '09 84 23 21 09',
  email = 'contact@labruleriedesolonnes.fr',
  website = 'https://labruleriedesolonnes.fr',
  source = 'seed:v6 | contact:site-officiel',
  notes = 'Torréfacteur artisanal 100% sur place (Arnaud Gouellain, ouvert 2021), cafés de spécialité BIO (Pérou El Palomar, Robusta Inde…) + thés/miels/chocolats. Cœur de cible.'
WHERE name = 'La Brûlerie des Olonnes' AND (email IS NULL OR phone IS NULL);
