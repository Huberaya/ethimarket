-- Densification acheteurs vague 8 (sept. 2026) : balayage annuaire complet
-- Loire-Atlantique — réseau magasins bio hors Nantes + chocolatiers/pâtissiers/
-- biscuiteries (acheteurs cacao/vanille/miel). Adresses réelles issues des
-- annuaires ; téléphones à qualifier via la fiche PJ quand non publiés.
-- Sources notées. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ============ RÉSEAU BIO 44 — hors Nantes (phase 1, tournées côte/vignoble)
('buyer', 1, 'biocoop', 'Les Hameaux Bio 4 (Biocoop)', 'Saint-Nazaire (89 r. Jean Jaurès)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche',
 'Face au marché couvert — même réseau Les Hameaux que le Marché Commun (02 52 59 58 46) : demander le référent achats réseau.'),
('buyer', 1, 'biocoop', 'Les Hameaux Bio 2 (Guérande)', 'Guérande (3 r. de la Briquerie)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Réseau Les Hameaux.'),
('buyer', 1, 'biocoop', 'Les Hameaux Bio 3 (Pornic)', 'Pornic (r. du Traité de Lisbonne)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Réseau Les Hameaux.'),
('buyer', 1, 'biocoop', 'Biocoop Les Hameaux Bio (Trignac)', 'Trignac (ZAC de Savine)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Réseau Les Hameaux — 5 magasins au total : un seul accord réseau possible.'),
('buyer', 1, 'epicerie_bio', 'Vivre Sain', 'Saint-Nazaire (69 av. Albert de Mun)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Indépendant nazairien.'),
('buyer', 1, 'epicerie_bio', 'Biomonde Saint-Brevin', 'Saint-Brevin-les-Pins (r. des Frères Lumière)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Réseau Biomonde (coopérative d''indépendants).'),
('buyer', 1, 'epicerie_bio', 'Le Chemin Bio', 'Pornic (19 r. Jean Monnet)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'biocoop', 'Biocoop des 3 Provinces', 'Clisson (5 r. des Malifestes)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Porte du vignoble.'),
('buyer', 1, 'biocoop', 'Biocoop La Sangueze', 'Vallet (24 r. d''Italie)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'biocoop', 'Biocoop Carquefou', 'Carquefou (28 r. du 9 Août 1944)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Même commune qu''Un Grain Une Feuille : tournée commune.'),
('buyer', 1, 'biocoop', 'Biocoop Nantes Sud', 'Saint-Sébastien-sur-Loire (1 r. Louis Blanc)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'biocoop', 'Biocoop Mauges Val de Loire', 'Divatte-sur-Loire (r. Pasteur)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'epicerie_bio', 'Biocinelle', 'Blain (39 r. de Nantes)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'epicerie_bio', 'NaturéO La Chapelle-sur-Erdre', 'La Chapelle-sur-Erdre (CC Viv''Erdre)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Enseigne NaturéO (chaîne spécialisée) — décision magasin possible sur le local.'),
('buyer', 1, 'biocoop', 'Biocoop Rezé (Aristide Briand)', 'Rezé (22-24 r. Aristide Briand)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'epicerie_bio', 'La Vie Claire Le Pouliguen', 'Le Pouliguen (18 r. de Cornen)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Bien noté (5/5) — presqu''île guérandaise.'),

-- ============ CHOCOLATIERS / PÂTISSIERS / BISCUITERIES 44 (cacao, vanille, miel, safran)
('buyer', 1, 'chocolatier', 'La Route du Cacao', 'Le Croisic (4 r. de Boston)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche',
 'Chocolaterie artisanale du Croisic + boutique La Baule (33 av. Louis Lajarrige). LE nom cacao de la presqu''île — angle fèves Ghana EUDR + vanille.'),
('buyer', 1, 'chocolatier', 'Coutant Chocolatier', 'Nantes (5 r. Copernic)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Chocolatier nantais historique, centre-ville.'),
('buyer', 1, 'transformateur', 'Pâtisserie Stéphane Pasco (laboratoire)', 'Vertou (ZI de la Vertonne)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche',
 'Pâtissier nantais réputé, 3 adresses (Nantes Mayence, Vertou) — le LABORATOIRE achète (vanille, cacao). Relais Desserts potentiel.'),
('buyer', 1, 'transformateur', 'Biscuiterie de Kerlann', 'Savenay (la Colleraye)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Biscuiterie artisanale 44 — angle vanille/miel étiquette.'),
('buyer', 1, 'transformateur', 'Maison Clérault', 'La Baule (14 av. du Marché)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Pâtisserie-chocolaterie du marché de La Baule.'),
('buyer', 1, 'transformateur', 'Pâtisserie Gavet', 'Pornic (64 r. de Leray)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Pâtisserie pornicaise (5/5) — tournée côte de Jade avec les Hameaux Bio 3 et Le Chemin Bio.'),
('buyer', 1, 'transformateur', 'Au Bec Fin', 'Ancenis (135 r. du Doct. Moutel)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Pâtisserie-confiserie d''Ancenis — axe Nantes-Angers.'),
('buyer', 1, 'transformateur', 'Les Rigolettes Nantaises', 'Nantes (18 r. de Verdun)', 'France',
 NULL, NULL, NULL, 'seed:v8 | contact:pagesjaunes-fiche', 'Confiserie emblématique nantaise (berlingots) — image locale forte.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
