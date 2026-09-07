-- Approfondissement national du CRM (sept. 2026) : cibles réelles vérifiées
-- dans les villes des vagues B/C/D du plan de conquête (§2.1).
-- Sources notées ligne par ligne (pagesjaunes, sites officiels, annuaires).
-- Aucune donnée inventée. Rejouable (INSERT si absent).

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ================= VAGUE C — BREST / OUEST BRETON (phase 1 étendue)
('buyer', 1, 'torrefacteur', 'Brûlerie du Léon — Cafés Bozec', 'Brest (88 r. Jean Jaurès)', 'France',
 NULL, '02 98 44 62 85', 'https://www.brulerieduleon.com', 'seed:fr-v4 | contact:pagesjaunes/emeraude',
 'Torréfacteur breton historique, 3 points de vente (Jean Jaurès, Halles St-Louis, Capucins), clientèle CHR — membre du groupement Émeraude « torréfacteurs de valeurs ». Boutique Halles : 02 98 28 46 02.'),

-- ================= VAGUE C — TOURS / VAL DE LOIRE
('buyer', 1, 'torrefacteur', 'El Cafecito (La Brûlerie d''El Cafecito)', 'Tours (41-43 r. du Grand Marché)', 'France',
 NULL, '06 44 28 58 10', NULL, 'seed:fr-v4 | contact:shop-in-touraine',
 'Torréfaction artisanale de cafés de spécialité en plein Vieux-Tours — micro-lots Guatemala/Colombie/Salvador.'),
('buyer', 1, 'epicerie_bio', 'Au Tour du Vrac', 'Tours (43 r. des Abeilles, pl. Velpeau)', 'France',
 NULL, '02 47 63 98 02', 'https://autourduvrac.fr', 'seed:fr-v4 | contact:site-officiel',
 'Épicerie vrac indépendante — le vrac = nos produits secs (quinoa, épices, miel).'),

-- ================= VAGUE C — CAEN / NORMANDIE
('buyer', 1, 'torrefacteur', 'Le Torréfacteur (Epron/Caen)', 'Epron (2 r. Hubertine Auclert)', 'France',
 'contact@letorrefacteur.fr', '02 61 53 57 30', 'https://www.letorrefacteur.fr', 'seed:fr-v4 | contact:site-officiel',
 'Atelier normand de cafés de spécialité et grands crus, au nord de Caen.'),
('buyer', 2, 'torrefacteur', 'Brûlerie Duchossoy', 'Le Havre (23 pl. des Halles)', 'France',
 NULL, NULL, NULL, 'seed:fr-v4 | source:collectifcafe.fr',
 'Membre du Collectif Café (annuaire public des adhérents) — contact à qualifier via l''annuaire.'),

-- ================= VAGUE D — PARIS (phase 2)
('buyer', 2, 'torrefacteur', 'Belleville Brûlerie', 'Paris 19e (14 bis r. Lally Tollendal)', 'France',
 NULL, '01 42 85 79 37', 'https://www.cafesbelleville.com', 'seed:fr-v4 | contact:mapstr/lefigaro',
 'Pionnier du café de spécialité parisien (2013), fournit de nombreux cafés/CHR — un référencement = une vitrine nationale.'),
('buyer', 2, 'torrefacteur', 'Café Lomi', 'Paris 18e (3 ter r. Marcadet)', 'France',
 NULL, '09 51 27 46 31', 'https://www.lomi.paris', 'seed:fr-v4 | contact:lefigaro',
 'Torréfacteur + école de formation réputée — prescripteur majeur de la scène café FR.'),
('buyer', 2, 'torrefacteur', 'Café Coutume', 'Paris 7e (47 r. de Babylone)', 'France',
 NULL, '01 45 51 50 47', 'https://coutumecafe.com', 'seed:fr-v4 | contact:lefigaro',
 'Torréfacteur de spécialité multi-boutiques, fournit hôtels et restaurants.'),
('buyer', 2, 'chocolatier', 'Plaq (manufacture bean-to-bar)', 'Paris 2e (4 r. du Nil)', 'France',
 'contact@plaqchocolat.com', '01 40 39 09 54', 'https://plaqchocolat.com', 'seed:fr-v4 | contact:site-officiel',
 'Pionnier bean-to-bar parisien, rue du Nil (écosystème Terroirs d''Avenir/Frenchie) — fèves rares, radicalité assumée. Angle : cacao Ghana EUDR + micro-lots.'),

-- ================= VAGUE D — LYON
('buyer', 2, 'torrefacteur', 'Café Mokxa', 'Lyon 8e (13 bd Edmond Michelet)', 'France',
 NULL, '04 69 84 68 50', 'https://www.cafemokxa.com', 'seed:fr-v4 | contact:pagesjaunes',
 'Atelier de torréfaction de spécialité lyonnais + boutiques (Bellecordière, Abbé Rozier) — acteur de référence de la scène lyonnaise.'),

-- ================= VAGUE D — LILLE
('buyer', 2, 'torrefacteur', 'Cafés Méo (boutique Grand Place)', 'Lille (3-5 pl. Général de Gaulle)', 'France',
 NULL, '03 20 57 34 54', 'https://www.meo.fr', 'seed:fr-v4 | contact:pagesjaunes',
 'Torréfacteur nordiste historique (groupe Méo-Fichaux, gammes bio/équitables déjà installées). Gros compte : approche dossier plutôt que cold call.'),

-- ================= VAGUE D — STRASBOURG
('buyer', 2, 'torrefacteur', 'Cafés Reck', 'Strasbourg (8 r. de la Mésange)', 'France',
 NULL, '03 88 32 37 22', 'https://www.reck.fr', 'seed:fr-v4 | contact:pagesjaunes',
 'Maison de torréfaction alsacienne historique (1884), boutique centre-ville + CHR.'),

-- ================= VAGUE D — MARSEILLE
('buyer', 2, 'torrefacteur', 'Café Luciani', 'Marseille 13e (6 bd Alphonse Moutte)', 'France',
 'cafe.luciani@wanadoo.fr', '04 91 66 17 17', 'https://cafe-luciani.fr', 'seed:fr-v4 | contact:facebook-officiel/pagesjaunes',
 'Artisan torréfacteur marseillais depuis 1863 (Société Phocéenne de Torréfaction).'),

-- ================= VAGUE D — TOULOUSE
('buyer', 2, 'torrefacteur', 'Cafés Bacquié', 'Toulouse (5 pl. Victor Hugo)', 'France',
 NULL, '05 61 23 39 87', 'https://www.cafe-bacquie.com', 'seed:fr-v4 | contact:pagesjaunes',
 'Épicerie-brûlerie toulousaine historique, sélectionnée Gault&Millau.'),
('buyer', 2, 'chocolatier', 'Criollo Chocolatier', 'Toulouse (12 r. du Rempart Matabiau)', 'France',
 NULL, '05 62 18 31 72', 'https://www.criollo-chocolatier.com', 'seed:fr-v4 | contact:site-officiel',
 'Chocolaterie artisanale (2002), atelier dans le Lauragais + 3 boutiques Toulouse — Award du chocolat 2011.'),

-- ================= VAGUE D — BORDEAUX (complément)
('buyer', 2, 'chocolatier', 'Hasnaâ Chocolats Grands Crus', 'Bordeaux (4 r. de la Vieille Tour)', 'France',
 'contact@hasnaa-chocolats.fr', '09 71 34 61 06', 'https://hasnaa-chocolats.fr', 'seed:fr-v4 | contact:site-officiel',
 'Chocolaterie bean-to-bar primée (SASU La Fèverie), boutique Bordeaux + atelier Canéjan — offre pro existante. Angle : cacao Ghana EUDR + fèves tracées.'),
('buyer', 2, 'epicerie_bio', 'Supercoop (supermarché coopératif)', 'Bordeaux (19 r. Oscar et Jean Auriac)', 'France',
 NULL, '05 57 04 73 79', 'https://supercoop.fr', 'seed:fr-v4 | contact:pagesjaunes',
 '1er supermarché coopératif et participatif de Bordeaux Métropole (2017) — gouvernance militante, sensible au direct producteur.'),

-- ================= AUTRES MÉTROPOLES (phase 2, fond de pipeline)
('buyer', 2, 'torrefacteur', 'Cafés Indien', 'Nice (2 bis r. Ste-Réparate)', 'France',
 NULL, NULL, NULL, 'seed:fr-v4 | contact:pagesjaunes-a-qualifier',
 'Torréfacteur du Vieux-Nice (cafés et cacaos d''origine). Téléphone à qualifier (fiche PJ sans numéro affiché).'),
('buyer', 2, 'torrefacteur', 'La Brûlerie des Alpes', 'Grenoble (56 cours Jean Jaurès)', 'France',
 'contact@labruleriedesalpes.fr', '04 76 46 29 80', 'https://labruleriedesalpes.fr', 'seed:fr-v4 | contact:site-officiel',
 'Maître artisan torréfacteur depuis 1926, 2 boutiques (Grenoble + Montbonnot 04 57 13 30 88).')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
