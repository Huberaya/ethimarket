-- Densification acheteurs vague 14 (sept. 2026) : Charente-Maritime (17) + Calvados (14).
-- Pépite : Céleste (Colombelles) — torréfaction de spécialité fondée par la championne
-- de France de Cup Tasting 2021, FOURNIT d'autres coffee shops (multiplicateur B2B).
-- Sources : annuaires pagesjaunes départementaux, sites officiels, registres. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ============================================================ CHARENTE-MARITIME (17)
('buyer', 1, 'torrefacteur', 'L''Atelier Café (Rochefort)', 'Rochefort (19 av. Charles de Gaulle)', 'France',
 'ateliercaferochefort@gmail.com', '05 46 87 28 58', NULL, 'seed:v14 | contact:facebook-officiel',
 'Torréfaction artisanale 16+ origines torréfiées sur place (moka Éthiopie, Pérou, Guatemala…) depuis 2016 (SASU 819713488). E-mail officiel vérifié.'),
('buyer', 1, 'torrefacteur', 'Les Cafés de Guillaumine (Breuillet)', 'Breuillet (13 r. du Centre)', 'France',
 NULL, '05 16 84 91 25', NULL, 'seed:v14 | contact:pagesjaunes',
 'Artisan torréfacteur depuis 2011, torréfaction sur place + « vente aux professionnels et revendeurs » affichée : circuit B2B déjà en place (4,6/5, 96 avis). 2e ligne : 09 66 92 91 25. Presqu''île d''Arvert, proche Royan.'),
('buyer', 1, 'torrefacteur', 'Torréfaction Saveur Café (La Rochelle)', 'La Rochelle (4 bis r. Thiers)', 'France',
 NULL, '05 46 41 52 98', NULL, 'seed:v14 | contact:pagesjaunes',
 'Torréfacteur du centre-ville rochelais — IMPORTATION café ET cacao affichée : profil importateur, pitch sourcing direct vérifié.'),
('buyer', 2, 'grossiste', 'Maison Merling (siège Périgny)', 'Périgny (40 av. Paul Langevin)', 'France',
 NULL, '05 46 41 49 47', 'https://www.maison-merling.fr', 'seed:v14 | contact:stade-rochelais/annuaire',
 'SIÈGE du Groupe Merling Torréfacteur (SAS 851727073, capital 36,7 M€) : acteur majeur distribution café Grand Ouest + Centre depuis 1979. Boutique historique : 25 r. Gambetta, La Rochelle. Site La Roche-sur-Yon déjà au CRM. Phase 2 : dossier gros volumes.'),
('buyer', 1, 'epicerie_bio', 'Au Marché de Léopold (Saintes)', 'Saintes (9 r. du Champ de Tir)', 'France',
 NULL, NULL, NULL, 'seed:v14 | contact:pagesjaunes-fiche',
 '2e magasin Léopold au CRM (après La Roche-sur-Yon) : confirme le maillage enseigne Grand Ouest — viser un référencement multi-magasins (4,4/5, 134 avis).'),
('buyer', 1, 'biocoop', 'Biocoop Regain (Lagord/La Rochelle)', 'Lagord (27 av. Lagord Vendôme)', 'France',
 NULL, NULL, NULL, 'seed:v14 | contact:pagesjaunes-fiche',
 'Biocoop de l''agglo rochelaise, 320 m², « nous favorisons le commerce équitable » affiché en présentation (4,3/5, 286 avis Google).'),
('buyer', 1, 'epicerie_bio', 'Le Beaupré - Accord Bio (Royan)', 'Royan (1 pl. de la Gare)', 'France',
 NULL, NULL, NULL, 'seed:v14 | contact:pagesjaunes-fiche',
 'Indépendant royannais, commerce équitable d''alimentation référencé, clientèle fidèle (avis 5 ans).'),
('buyer', 1, 'epicerie_bio', 'Colibri - Bio et Local (Puilboreau)', 'Puilboreau (13 r. du 14 Juillet)', 'France',
 NULL, NULL, NULL, 'seed:v14 | contact:pagesjaunes-fiche',
 'Indépendant agglo rochelaise — couplable avec Biocoop Regain (Lagord à 5 min).'),
('buyer', 1, 'torrefacteur', 'Chokaté (Oléron)', 'Dolus-d''Oléron (ZC La Bassée, RD 734)', 'France',
 NULL, NULL, NULL, 'seed:v14 | contact:pagesjaunes-fiche',
 'Torréfacteur + expert chocolat/thé sur l''île d''Oléron : double entrée café + cacao.'),
('buyer', 1, 'epicerie_bio', 'Chez Luly (Châtelaillon-Plage)', 'Châtelaillon-Plage (26 r. du Marché)', 'France',
 NULL, NULL, NULL, 'seed:v14 | contact:pagesjaunes-fiche',
 'Salon de thé + cave + torréfacteur + épicerie fine, café BIO référencé — profil hybride multi-produits.'),

-- ============================================================ CALVADOS (14)
('buyer', 1, 'torrefacteur', 'Céleste Torréfaction (Colombelles)', 'Colombelles (8 r. du Four à Chaux)', 'France',
 'celestetorrefaction@gmail.com', '02 59 16 52 03', 'https://celeste.coffee', 'seed:v14 | contact:site-officiel',
 'PÉPITE : torréfaction de SPÉCIALITÉ fondée 2024 par Clémentine Llompart, CHAMPIONNE DE FRANCE de Cup Tasting 2021 (mondiaux 2021). Lots saisonniers TRAÇABLES + FOURNIT plusieurs coffee shops en Normandie et en France = multiplicateur B2B. Offre pro affichée (cafés, restaurants, bureaux). Alignement traçabilité parfait.'),
('buyer', 1, 'torrefacteur', 'Arbuste (Caen)', 'Caen (4 r. Montoir Poissonnerie)', 'France',
 'info@arbustecafe.com', '02 61 92 11 67', 'https://arbustecafe.com', 'seed:v14 | contact:site-officiel',
 'Atelier de torréfaction + coffee shop, cafés BIO Asie/Afrique/Amérique, fondateur Jo barista diplômé SCA — élu Meilleur Coffee Shop de France 2024 (source Mapstr). Quartier Vaugueux.'),
('buyer', 1, 'torrefacteur', 'Café Dauré Frères (Bretteville-sur-Odon)', 'Bretteville-sur-Odon (1 av. de la Voie au Coq)', 'France',
 'maxime.daure@hotmail.fr', '02 31 75 05 90', 'https://www.cafe-daure.com', 'seed:v14 | contact:facebook-officiel',
 'Artisan torréfacteur depuis 1984 (SAS 812357077), interlocuteur identifié : Maxime Dauré (06 58 41 44 65). Agglo caennaise ouest.'),
('buyer', 1, 'torrefacteur', 'Bloomy (Caen)', 'Caen (8 r. Saint-Laurent)', 'France',
 NULL, NULL, NULL, 'seed:v14 | contact:pagesjaunes-fiche',
 'Nouvelle torréfaction du centre-ville caennais — à qualifier lors de la tournée Caen.'),
('buyer', 1, 'epicerie_bio', 'Jamard Cave et Épicerie Fine (Évrecy)', 'Évrecy (5 r. des Cerisiers)', 'France',
 NULL, NULL, NULL, 'seed:v14 | contact:pagesjaunes-fiche',
 'Cave + épicerie fine + torréfaction sud-ouest de Caen — profil revendeur multi-produits.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
