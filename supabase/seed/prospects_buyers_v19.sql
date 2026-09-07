-- Densification acheteurs vague 19 (sept. 2026) : DISTRIBUTION BIO — têtes de réseau,
-- groupements coopératifs et supermarchés participatifs.
-- Logique : 1 accord de référencement = des dizaines de magasins. Complète les
-- centrales déjà au CRM (Biocoop nationale, Naturalia, La Vie Claire, La Fourche…).
-- Sources : sites officiels, annuaires réseaux (best-of-bio), registres. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ============================================================ TÊTES DE RÉSEAU FRANCE
('buyer', 2, 'centrale', 'Biomonde (groupement coopératif, ~150 magasins)', 'Paris (32 r. de Cambrai, 19e)', 'France',
 'communication@biomonde.fr', '01 44 65 14 30', 'https://www.biomonde.fr', 'seed:v19 | contact:site-officiel',
 'GROUPEMENT COOPÉRATIF de magasins bio INDÉPENDANTS depuis 1992 (501-1000 salariés réseau). Gouvernance coopérative = notre langage ; les adhérents gardent leur liberté d''achat → double entrée : référencement centrale ET démarchage magasin par magasin (Saint-Brevin et Fougères déjà au CRM). E-mail com'' vérifié — demander le contact achats/référencement.'),
('buyer', 2, 'centrale', 'Les Comptoirs de la Bio (~75 magasins)', 'Bressols (18 imp. de la Colombière)', 'France',
 NULL, '05 63 24 10 00', 'https://www.lescomptoirsdelabio.fr', 'seed:v19 | contact:annuaire-reseau',
 'Groupement de magasins indépendants, CENTRALE D''ACHAT ALIMENTAIRE déclarée (NAF 4617A, SAS 788803443). ~75 magasins France + DOM. Dossier de référencement phase 2.'),
('buyer', 2, 'centrale', 'L''Eau Vive (29 magasins)', 'Brié-et-Angonnes (rte Napoléon, Champs et Bruyères)', 'France',
 'contact@eau-vive.fr', '04 76 73 70 01', 'https://entreprise.eau-vive.com', 'seed:v19 | contact:site-officiel',
 'Enseigne bio historique (1979), 29 magasins intégrés+franchisés (Rhône-Alpes, Lyon ×3, Grenoble ×2, Clermont, Toulouse…). SAS Eau Vive RCS Grenoble 348706714. E-mail officiel vérifié. Sensibilité produits propres (fournil intégré) = ouverture aux filières différenciantes.'),
('buyer', 2, 'centrale', 'day by day — Mon épicerie en vrac (réseau ~50 magasins)', 'Versailles (siège DO Consulting)', 'France',
 NULL, NULL, 'https://daybyday-shop.com', 'seed:v19 | contact:site-a-qualifier',
 'PREMIER RÉSEAU FRANÇAIS d''épiceries 100% VRAC (franchise, ~50 villes : Nantes, Rennes, Rouen, Bordeaux, Lyon, Paris ×3…). Le vrac = notre format naturel (café grain, cacao, épices, quinoa sans emballage). Contact siège à qualifier — entrer aussi par le magasin de Nantes.'),
('buyer', 2, 'centrale', 'Satoriz (~40 magasins Rhône-Alpes)', 'Rhône-Alpes (siège à qualifier)', 'France',
 NULL, NULL, 'https://www.satoriz.fr', 'seed:v19 | contact:a-qualifier',
 'Enseigne bio indépendante historique du quart sud-est (~40 magasins). Coordonnées siège à qualifier avant approche dossier.'),

-- ============================================================ SUPERMARCHÉS COOPÉRATIFS & PARTICIPATIFS
('buyer', 1, 'epicerie_bio', 'Scopéli (supermarché coopératif de Nantes)', 'Rezé (20 r. de l''Abbé Grégoire)', 'France',
 'contact@scopeli.fr', '02 85 52 92 07', 'https://www.scopeli.fr', 'seed:v19 | contact:site-officiel',
 'LE supermarché COOPÉRATIF ET PARTICIPATIF nantais (certifié bio, zone Atout Sud) : des milliers de coopérateurs-consommateurs militants, décisions d''achat par les membres → un produit équitable tracé avec histoire producteur = exactement leur ADN. SEMAINE 1 de tournée (agglo nantaise). E-mail + tél officiels.'),
('buyer', 2, 'epicerie_bio', 'La Louve (supermarché coopératif, Paris 18e)', 'Paris (116 r. des Poissonniers)', 'France',
 'info@cooplalouve.fr', '01 42 64 41 23', 'https://cooplalouve.fr', 'seed:v19 | contact:site-officiel',
 'LE PIONNIER des supermarchés coopératifs français (inspiré de Park Slope Food Coop NYC), milliers de coopérateurs parisiens. Groupe achats interne sensible au direct producteur. Référence du mouvement : convaincre La Louve = argument pour toutes les coops de France. E-mail officiel vérifié.'),
('buyer', 1, 'epicerie_bio', 'Breizhicoop (supermarché coopératif, Rennes)', 'Rennes (à qualifier)', 'France',
 NULL, NULL, NULL, 'seed:v19 | contact:a-qualifier',
 'Supermarché coopératif rennais — même modèle que Scopéli. À qualifier pour la tournée Rennes semaine 2.'),
('buyer', 2, 'epicerie_bio', 'La Chouette Coop (supermarché coopératif, Toulouse)', 'Toulouse (à qualifier)', 'France',
 NULL, NULL, NULL, 'seed:v19 | contact:a-qualifier',
 'Supermarché coopératif toulousain — vague Sud phase 2 (avec Bacquié et Criollo déjà au CRM).'),

-- ============================================================ BELGIQUE — RÉSEAU FÄRM
('buyer', 2, 'centrale', 'Färm / Biotope Group (~35 magasins BE)', 'Bruxelles (r. Gray 10, Etterbeek)', 'Belgique',
 'info@farmstore.be', NULL, 'https://farm.coop', 'seed:v19 | contact:site-officiel',
 'RÉSEAU bio bruxellois-wallon : 25 magasins Färm + ~10 Sequoia absorbés (juill. 2025, Biotope Group) = ~35 points de vente. Modèle COOPÉRATIF, 200+ références vrac par magasin. Complète Interbio (grossiste wallon) déjà au CRM : deux portes belges parallèles. E-mail officiel vérifié (BE0639799033).')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
