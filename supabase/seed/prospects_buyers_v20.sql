-- Densification acheteurs vague 20 (sept. 2026) : suite du pivot DISTRIBUTION —
-- supermarchés coopératifs des grandes villes (Lyon, Lille, Montpellier, Grenoble,
-- Pays Basque) + enseigne Marcel & Fils (Sud-Est) + groupement GRAP (Rhône-Alpes).
-- Le mouvement coopératif se connaît et se parle : chaque coop convaincue est
-- une référence pour les suivantes (La Louve et Scopéli déjà au CRM, v19).
-- Sources : sites officiels, registres (pappers), presse locale. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ============================================================ COOPS PARTICIPATIVES GRANDES VILLES
('buyer', 2, 'epicerie_bio', 'Demain Supermarché (coopératif, Lyon)', 'Lyon 7e (2 pl. des Pavillons)', 'France',
 'demainsupermarche@gmail.com', '09 86 65 70 90', 'https://demainsupermarche.org', 'seed:v20 | contact:grap.coop',
 'Supermarché coopératif et participatif lyonnais (SAS capital variable 852471093), membre du groupement GRAP depuis 2019. Vague Lyon phase 2 (avec Mokxa). E-mail + tél officiels via fiche GRAP.'),
('buyer', 2, 'epicerie_bio', 'SuperQuinquin (coopératif, Lille — 3 magasins)', 'Lille-Fives (55 r. Pierre Legrand)', 'France',
 'superquinquin.lille@gmail.com', '09 72 60 18 06', 'https://www.superquinquin.fr', 'seed:v20 | contact:site-officiel',
 'RÉSEAU coopératif lillois : 3 magasins (Fives + Villeneuve-d''Ascq « Val de Marque » + Lomme), SAS coopérative 821415031, dirigeant identifié Nicolas Philippe, 6 salariés + coopérateurs (2h45/mois). Vague Nord phase 2 (avec Méo). Un accord = 3 magasins militants.'),
('buyer', 2, 'epicerie_bio', 'La Cagette (coopératif, Montpellier)', 'Montpellier (19 av. Georges Clemenceau)', 'France',
 NULL, '09 83 34 66 91', 'https://lacagette-coop.fr', 'seed:v20 | contact:annuaire/presse-ici',
 'Supermarché coopératif montpelliérain à but non lucratif — EN CROISSANCE : déménage début 2027 de 350 m² (r. Clemenceau) vers 700 m² (cours Gambetta, source ici/France Bleu juil. 2025) = doublement de surface, besoins d''assortiment neufs : timing idéal pour entrer au référencement. Vague Sud phase 2.'),
('buyer', 2, 'epicerie_bio', 'L''éléfàn (coopératif, Grenoble)', 'Grenoble (30 bis av. Marcelin Berthelot)', 'France',
 NULL, '09 72 64 91 14', 'https://lelefan.org', 'seed:v20 | contact:helloasso/pappers',
 'Supermarché coopératif et participatif grenoblois (association 823874151 créée 2016, 3-5 salariés, nouveau local 2024). Vague Lyon/Grenoble phase 2 (avec Brûlerie des Alpes).'),
('buyer', 2, 'epicerie_bio', 'Otsokop (coopératif, Pays Basque)', 'Anglet', 'France',
 NULL, NULL, 'https://www.otsokop.org', 'seed:v20 | contact:site-a-qualifier',
 'Coopérative alimentaire du Pays Basque (Anglet/Bayonne, président fondateur identifié Franck Laharrague). Adresse précise et e-mail à qualifier avant la vague Sud-Ouest (couplable Bordeaux : Supercoop déjà au CRM).'),

-- ============================================================ ENSEIGNES & GROUPEMENTS
('buyer', 2, 'centrale', 'Marcel & Fils (enseigne bio Sud-Est, ~20 magasins)', 'Venelles (102 av. des Logissons)', 'France',
 NULL, '04 42 27 21 38', 'https://www.marceletfils.com', 'seed:v20 | contact:pagesjaunes-siege',
 'Enseigne bio du Sud-Est (SAS 508801305, SIÈGE à Venelles 50-99 salariés, magasins vérifiés : Fréjus, Valence, Istres, St-Mitre, Publier/Évian, Annemasse…, ~20 points de vente). Tél siège vérifié — demander le service achats. Dossier phase 2 avec Satoriz et L''Eau Vive (même zone).'),
('buyer', 2, 'centrale', 'GRAP — Groupement Régional Alimentaire de Proximité', 'Lyon', 'France',
 NULL, NULL, 'https://www.grap.coop', 'seed:v20 | contact:site-a-qualifier',
 'MULTIPLICATEUR : SCIC fédérant des dizaines d''activités alimentaires bio/locales en Rhône-Alpes (dont Demain Supermarché) — mutualise achats, logistique et services. Une présentation au groupement = accès à tout le réseau AURA. Coordonnées précises à qualifier sur grap.coop.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
