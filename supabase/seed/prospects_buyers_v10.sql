-- Densification acheteurs vague 10 (sept. 2026) : réseaux bio 35 + 49
-- via annuaires (pagesjaunes, petitbio). Deux TRÈS gros multiplicateurs :
-- Scarabée complet (7 magasins Rennes) et CABA (coopérative angevine
-- multi-magasins). Sources notées. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ============ ILLE-ET-VILAINE (35) — Scarabée complet + indépendants
('buyer', 1, 'biocoop', 'Biocoop Scarabée Cleunay', 'Rennes (132 r. Eugène Pottier — SIÈGE)', 'France',
 NULL, NULL, 'https://scarabee-biocoop.fr', 'seed:v10 | contact:pagesjaunes-fiche',
 'LE SIÈGE de la SCIC Scarabée (7 magasins : Papu, Vasselot, J. Cartier, Cleunay, Cesson, St-Grégoire, Bruz, Vern) — l''interlocuteur achats réseau est ICI. Un accord = 7+ magasins.'),
('buyer', 1, 'biocoop', 'Biocoop Scarabée Cesson-Sévigné', 'Cesson-Sévigné (8 r. des Peupliers)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Réseau Scarabée.'),
('buyer', 1, 'biocoop', 'Biocoop Scarabée St-Grégoire', 'Saint-Grégoire (8 r. de la Cerisaie)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Réseau Scarabée.'),
('buyer', 1, 'biocoop', 'Biocoop Scarabée Bruz', 'Bruz (ZAC du Vert Buisson)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Réseau Scarabée.'),
('buyer', 1, 'biocoop', 'Biocoop Scarabée Vern-sur-Seiche', 'Vern-sur-Seiche (CC du Val)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Réseau Scarabée — même commune que Les Cafés Mauri : tournée commune.'),
('buyer', 1, 'biocoop', 'Biocoop Saint-Malo Aquarium', 'Saint-Malo (44 av. Général Patton)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Tournée côte d''émeraude avec Dinard/Dol.'),
('buyer', 1, 'biocoop', 'Biocoop Le Cormoran', 'La Richardais (33 r. de la Ville Biais)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Face à Dinard.'),
('buyer', 1, 'biocoop', 'Biocoop Fougères Bio Lune', 'Fougères (32 r. de Groslay)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'biocoop', 'Biocoop Pays de Vitré', 'Vitré (17 r. des Artisans)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Même ville que Brin de Café : tournée commune.'),
('buyer', 1, 'biocoop', 'Biocoop Breizh Nature', 'Montfort-sur-Meu (Les Tardivières)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Bien noté (5/5, 10 avis).'),
('buyer', 1, 'epicerie_bio', 'Le Carré Biologique', 'Janzé (25 r. Paul Painlevé)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Indépendant.'),
('buyer', 1, 'epicerie_bio', 'La Vie Claire Rennes', 'Rennes (7 r. Poullain Duparc)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'epicerie_bio', 'La Vie Claire Saint-Malo', 'Saint-Malo (53 r. Ville Pépin)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'epicerie_bio', 'Les Halles Biomonde Fougères', 'Fougères (5 r. St-Germain)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'epicerie_bio', 'L''Effet Papillon', 'Saint-Malo (13 r. Ange Fontan)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Indépendant malouin.'),
('buyer', 1, 'epicerie_bio', 'Avenir Bio Rennes', 'Rennes (4 r. Ferdinand Pelloutier)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'epicerie_bio', 'Naturalia Rennes St-Hélier', 'Rennes (27-29 r. St-Hélier)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', NULL),

-- ============ MAINE-ET-LOIRE (49) — réseau CABA + Cholet/Saumur
('buyer', 1, 'biocoop', 'Biocoop CABA (siège Chalouère)', 'Angers (122 r. de la Chalouère)', 'France',
 NULL, '02 41 60 01 61', NULL, 'seed:v10 | contact:petitbio',
 'LA COOPÉRATIVE ANGEVINE : réseau CABA multi-magasins (Doyenné, Foch, Imbach, Avrillé, Mûrs-Érigné…). Le siège = l''interlocuteur achats. Un accord = 5+ magasins angevins.'),
('buyer', 1, 'biocoop', 'Biocoop CABA Doyenné', 'Angers (50 r. du Doyenné)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Réseau CABA.'),
('buyer', 1, 'biocoop', 'Biocoop CABA Foch', 'Angers (59 bd Mar. Foch)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Réseau CABA — centre-ville.'),
('buyer', 1, 'biocoop', 'Biocoop Angers Imbach', 'Angers (22 r. Louis Imbach)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Réseau CABA.'),
('buyer', 1, 'biocoop', 'Biocoop CABA Avrillé', 'Avrillé (44 r. Simone Veil)', 'France',
 NULL, '02 41 05 04 02', NULL, 'seed:v10 | contact:petitbio', 'Réseau CABA.'),
('buyer', 1, 'epicerie_bio', 'Rayons Verts', 'Angers (15 r. de Létanduère)', 'France',
 NULL, '02 41 87 33 89', NULL, 'seed:v10 | contact:petitbio', 'Indépendant angevin historique (2 adresses avec Beaucouzé).'),
('buyer', 1, 'epicerie_bio', 'M''Angers Bio', 'Angers (15 r. de Létanduère)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'biocoop', 'Biocoop Cholet (Edmond Michelet)', 'Cholet (35 r. Edmond Michelet)', 'France',
 NULL, '02 41 64 37 80', NULL, 'seed:v10 | contact:petitbio', 'Cholet : 2e ville du 49.'),
('buyer', 1, 'biocoop', 'Biocoop Soleil Nord Cholet', 'Cholet (2 r. de la Baie d''Hudson)', 'France',
 NULL, '02 41 70 74 14', NULL, 'seed:v10 | contact:petitbio', NULL),
('buyer', 1, 'epicerie_bio', 'Cholet Bio Nature', 'Cholet (161 r. Nationale)', 'France',
 NULL, '02 41 62 26 36', NULL, 'seed:v10 | contact:petitbio', 'Indépendant choletais.'),
('buyer', 1, 'biocoop', 'Biocoop Saumur', 'Saumur/Bagneux (80 av. des Peupleraies)', 'France',
 NULL, '02 41 51 39 98', NULL, 'seed:v10 | contact:petitbio', NULL),
('buyer', 1, 'epicerie_bio', 'Aux Produits Naturels', 'Saumur (10 r. St-Jean)', 'France',
 NULL, '02 41 51 24 96', NULL, 'seed:v10 | contact:petitbio', 'Indépendant saumurois, centre historique.'),
('buyer', 1, 'biocoop', 'Biocoop Mauges', 'Beaupréau (4 r. Nicolas Appert)', 'France',
 NULL, '02 41 63 51 36', NULL, 'seed:v10 | contact:petitbio', NULL),
('buyer', 1, 'biocoop', 'Biocoop La Pyramide', 'Les Ponts-de-Cé (216 r. de la Pyramide)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', 'Sud d''Angers.'),
('buyer', 1, 'epicerie_bio', 'Tendance Bio', 'Tiercé (37 r. d''Anjou)', 'France',
 NULL, NULL, NULL, 'seed:v10 | contact:pagesjaunes-fiche', NULL),

-- ============ MIEL — acheteur-transformateur majeur repéré (49)
('buyer', 1, 'transformateur', 'Famille Mary (miel — Sèvremoine)', 'Sèvremoine (St-André-de-la-Marche)', 'France',
 NULL, NULL, 'https://www.famillemary.fr', 'seed:v10 | contact:pagesjaunes-fiche',
 'Maison apicole majeure de l''Ouest (depuis 1921, boutiques dans toute la France). Achète du miel en volume : angle miel de thym grec documenté + vanille pour pains d''épices. Approche PME structurée.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
