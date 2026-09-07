-- Élargissement du panel (sept. 2026) : nouveaux TYPES d'acheteurs par
-- produit (glaciers, biscuiteries, maisons de thé, bars, savonneries) et
-- nouveaux pays producteurs par filière. Sources notées. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ============ TRANSFORMATEURS (vanille, miel, safran, cacao)
('buyer', 1, 'transformateur', 'La Fraiseraie (glacier, 5+ boutiques)', 'Nantes (1 pl. de la Bourse)', 'France',
 NULL, '02 40 82 08 21', 'https://lafraiseraie.com', 'seed:v7 | contact:pagesjaunes',
 'Glacier emblématique nantais depuis 1977 (production artisanale, champs propres à Pornic). Angle : gousses de vanille Grade A pour la glace vanille — le 1er ingrédient noble d''un glacier. 2e n° : 02 28 08 98 36.'),
('buyer', 1, 'transformateur', 'Biscuiterie La Trinitaine', 'Saint-Philibert (Kerluesse, 56)', 'France',
 NULL, '02 97 55 02 04', 'https://www.latrinitaine.com', 'seed:v7 | contact:pagesjaunes/morbihan',
 'Biscuiterie bretonne majeure (1955, patrimoine culinaire). Angle : vanille naturelle + miel documentés lot par lot pour l''étiquette. Approche PME : appel direct au siège.'),
('buyer', 1, 'transformateur', 'Glaciers artisanaux Grand Ouest (vague)', 'Grand Ouest', 'France',
 NULL, NULL, NULL, 'seed:v7',
 'Vague à qualifier : 10-15 glaciers artisanaux (Nantes, Rennes, La Baule, Vannes, côte). Le glacier achète la vanille au prix pâtissier avec récurrence estivale forte.'),
('buyer', 1, 'transformateur', 'Biscuiteries bretonnes bio (vague)', 'Bretagne', 'France',
 NULL, NULL, NULL, 'seed:v7',
 'Vague à qualifier : biscuiteries artisanales/bio (miel, vanille). La Bretagne en compte des dizaines (galettes, kouign-amann premium).'),

-- ============ MAISONS DE THÉ (sencha, vanille, miel)
('buyer', 2, 'maison_the', 'Comptoir Français du Thé', 'Strasbourg (siège)', 'France',
 NULL, '03 90 40 31 00', 'https://comptoir-francais-du-the.fr', 'seed:v7 | contact:site-officiel',
 'Marque française de thé (30+ ans, importe et aromatise en France, réseau de revendeurs). Angle : sencha JAS vérifié au registre. Approche fournisseur : service achats.'),
('buyer', 1, 'maison_the', 'Salons & comptoirs de thé Grand Ouest (vague)', 'Grand Ouest', 'France',
 NULL, NULL, NULL, 'seed:v7',
 'Vague à qualifier : 10 comptoirs/salons de thé indépendants (Nantes, Rennes, Angers). ThéÔphil déjà au CRM (torréfacteur) fait aussi le thé.'),

-- ============ BARS & MIXOLOGIE (safran, vanille, miel)
('buyer', 2, 'bar_cocktail', 'Bars à cocktails signature Nantes/Rennes (vague)', 'Nantes/Rennes', 'France',
 NULL, NULL, NULL, 'seed:v7',
 'Vague à qualifier : 8-10 bars à cocktails créatifs + bars d''hôtels 4-5★. Angle : safran ISO 3632 et vanille Grade A en ingrédients signature. Prospection par visite en heures creuses (17h-19h).'),

-- ============ SAVONNERIES & HERBORISTERIES (argane cosmétique)
('buyer', 2, 'cosmetique', 'Savonneries artisanales SAF Grand Ouest (vague)', 'Bretagne/Pays de la Loire', 'France',
 NULL, NULL, NULL, 'seed:v7',
 'Vague à qualifier via annuaire Slow Cosmétique : savonneries saponification à froid (petits volumes d''argane/karité, récurrents). Ex. repéré : Savondou (Bretagne, mention Slow Cosmétique).'),
('buyer', 2, 'cosmetique', 'Herboristeries indépendantes (vague)', 'France', 'France',
 NULL, NULL, NULL, 'seed:v7',
 'Vague à qualifier : herboristeries et parapharmacies indépendantes — argane cosmétique pure au détail.'),

-- ============ POISSONNERIES/TRAITEURS MER (safran — spécificité côte atlantique)
('buyer', 2, 'food_service', 'Poissonneries-traiteurs côte atlantique (vague)', 'Littoral 44/85/56', 'France',
 NULL, NULL, NULL, 'seed:v7',
 'Vague à qualifier : poissonneries-traiteurs haut de gamme (rouille, soupe de poisson = safran). Un débouché safran unique à notre géographie.'),

-- ============ PRODUCTEURS — nouveaux pays par filière
('producer', 2, 'vanille', 'Filière vanille Ouganda (vague à recruter)', 'Ouganda', 'Ouganda',
 NULL, NULL, NULL, 'seed:v7 | source:latoque/snpe',
 '2 % de la production mondiale, méthodes de préparation similaires à Madagascar, déficit de notoriété = prix attractifs [La Toque/SNPE]. Recruter via Fairtrade Africa. Diversifie le risque cyclone malgache.'),
('producer', 2, 'vanille', 'Filière vanille Papouasie-N-Guinée (vague)', 'Papouasie-Nouvelle-Guinée', 'Papouasie-Nouvelle-Guinée',
 NULL, NULL, NULL, 'seed:v7 | source:latoque/snpe',
 '9 % de la production mondiale (2e pays), « commence à être appréciée des professionnels » [La Toque]. Recruter via NAPP — Y2.'),
('producer', 2, 'safran', 'Coopérative safran de Kozani (Grèce)', 'Kozani (Macédoine occidentale)', 'Grèce',
 NULL, NULL, NULL, 'seed:v7 | source:pdo-ue-a-qualifier',
 'LA coopérative historique du safran grec (PDO « Krokos Kozanis »). Intérêt majeur : UE = zéro douane, zéro COI — le safran le plus simple à importer. Contact à qualifier via le site de la coopérative.'),
('producer', 2, 'miel', 'Coopératives miel de Crète/Péloponnèse (vague)', 'Grèce', 'Grèce',
 NULL, NULL, NULL, 'seed:v7',
 'Miel de thym grec : recruter 2-3 coopératives apicoles (Crète, Péloponnèse). UE = circuit simple. À qualifier via fédérations apicoles grecques.'),
('producer', 3, 'miel', 'Miel blanc de Tigray (Éthiopie — vague)', 'Tigray', 'Éthiopie',
 NULL, NULL, NULL, 'seed:v7',
 'Miel blanc d''altitude réputé — SYNERGIE logistique avec la filière café éthiopienne (mêmes corridors). Y2, via Fairtrade Africa.'),
('producer', 2, 'quinoa', 'ANAPQUI (quinoa real, Bolivie — vague)', 'Altiplano Sud', 'Bolivie',
 NULL, NULL, NULL, 'seed:v7',
 'Association nationale des producteurs de quinoa (quinoa real de l''Altiplano). Recruter via CLAC. Complète COOPAIN Cabana (Pérou).'),
('producer', 2, 'cacao', 'Coopératives cacao Sambirano (Madagascar — vague)', 'Vallée du Sambirano', 'Madagascar',
 NULL, NULL, NULL, 'seed:v7',
 'Cacao fin d''arôme malgache — SYNERGIE totale avec la filière vanille (mêmes corridors SAVA/Diana). Y2.'),
('producer', 3, 'cafe', 'Coopératives Gayo (Sumatra, Indonésie — vague)', 'Aceh (Gayo)', 'Indonésie',
 NULL, NULL, NULL, 'seed:v7',
 'Arabica Gayo bio-FT — diversification Asie de la filière café. Y2-Y3, via NAPP.'),
('producer', 2, 'cafe', 'Coopératives Rwanda/Burundi (vague)', 'Rwanda/Burundi', 'Rwanda',
 NULL, NULL, NULL, 'seed:v7',
 'Montée en gamme rapide (Kopakama, Dukunde Kawa…), anglophone, sacs 60 kg. Recruter via Fairtrade Africa — complète l''Éthiopie sur l''Afrique de l''Est.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
