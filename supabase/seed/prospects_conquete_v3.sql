-- Cibles du plan de conquête France/Europe/Monde (sept. 2026).
-- Multiplicateurs institutionnels + distribution européenne, coordonnées
-- publiques vérifiées, sources notées. Rejouable (INSERT si absent).

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ============ FRANCE — multiplicateurs filière & réseaux
('buyer', 2, 'grossiste', 'Collectif Café (fédération filière)', 'France', 'France',
 'communication.collectifcafe@gmail.com', '06 22 14 85 51', NULL,
 'seed:conquete | contact:monde-epicerie-fine',
 'Fédération des torréfacteurs/importateurs FR (président D. Serruys). PAS un acheteur : adhésion/partenariat M4 pour crédibilité filière + accès adhérents. Co-organise le championnat de France de torréfaction avec SCA France au Paris Coffee Show.'),
('buyer', 2, 'grossiste', 'SCA France (Specialty Coffee Association)', 'Clichy (129 r. Henri Barbusse)', 'France',
 NULL, NULL, 'https://www.scafrance.coffee',
 'seed:conquete | contact:helloasso',
 'Chapitre FR de la SCA. Adhésion M4 : accès communauté torréfacteurs + championnats (Paris Coffee Show sept. 2026). Contact via formulaire/helloasso.'),

-- ============ BELGIQUE (phase 2 avancée M6-M9)
('buyer', 2, 'grossiste', 'Interbio (plateforme bio Wallonie)', 'Sombreffe (r. de la Basse Sambre 24)', 'Belgique',
 'henry@interbio.be', '+32 71 82 28 80', 'https://www.interbio.be',
 'seed:conquete | contact:site-officiel/biowallonie',
 'Plateforme de distribution bio DÉTENUE PAR LES PRODUCTEURS (philosophie sœur). Dessert épiceries + horeca Bruxelles/Wallonie (via Restofrais). Contact clients : Henry Dumont de Chassart (0475 81 97 25). Référencement = tout le canal wallon d''un coup.'),
('buyer', 2, 'epicerie_bio', 'Épiceries bio Bruxelles (vague à qualifier)', 'Bruxelles', 'Belgique',
 NULL, NULL, NULL, 'seed:conquete',
 'Vague M6-M9 : mêmes e-mails J0/J+4/J+10 qu''en France (francophone, zéro douane). Qualifier 15 indépendants via Biowallonie + annuaires.'),
('buyer', 2, 'torrefacteur', 'Torréfacteurs spécialité Bruxelles/Wallonie (vague)', 'Bruxelles/Liège/Namur', 'Belgique',
 NULL, NULL, NULL, 'seed:conquete',
 'Marché café BE : 1,2 Md $ (2024), premiumisation rapide. Qualifier 10 torréfacteurs artisanaux — même playbook café que FR.'),

-- ============ ALLEMAGNE (phase 3 M10-M18)
('buyer', 3, 'centrale', 'Alnatura', 'Darmstadt', 'Allemagne',
 NULL, NULL, 'https://www.alnatura.de',
 'seed:conquete | source:biolineaires-2026',
 'Leader bio DE : 1,27 Md € CA 2024/25 (+6,6 %), >140 magasins. NE PAS approcher avant preuve FR+BE (M18+, dossier avec taux de service). L''Allemagne importe par nécessité : la demande croît plus vite que l''offre domestique.'),
('buyer', 3, 'centrale', 'dennree / Denn''s Biomarkt', 'Töpen (Bavière)', 'Allemagne',
 NULL, NULL, 'https://www.dennree.de',
 'seed:conquete | source:natexbio',
 'Grossiste bio n°1 DE (~920 M€, 2/3 gros + 1/3 magasins Denn''s). Dossier M18+ seulement. Rencontre possible à Biofach.'),
('buyer', 3, 'torrefacteur', 'Torréfacteurs spécialité Berlin/Munich/Hambourg (vague)', 'Berlin/Munich/Hambourg', 'Allemagne',
 NULL, NULL, NULL, 'seed:conquete',
 '1er marché café de spécialité UE (1,73 Md $ en 2025). M10+ : e-mails EN (playbook café), 15 cibles à qualifier (The Barn, Bonanza…). Interface allemande SEULEMENT après 10 clients DE.'),
('buyer', 3, 'epicerie_bio', 'Bioläden indépendants Berlin/Munich (vague)', 'Berlin/Munich', 'Allemagne',
 NULL, NULL, NULL, 'seed:conquete',
 'Segment spécialisé = 19 % d''un marché de 18,2 Mds € (2025). Entrer par les indépendants (décision rapide), pas par les chaînes.'),

-- ============ PAYS-BAS (phase 3 — UN mouvement)
('buyer', 3, 'centrale', 'Udea / Ekoplaza', 'Veghel', 'Pays-Bas',
 NULL, NULL, 'https://www.ekoplaza.nl',
 'seed:conquete | source:biolineaires/natexbio',
 'LE verrou du spécialisé NL (~70-84 magasins Ekoplaza, a absorbé Natudis, Biofresh Belgium, Origin''O). Marché NL : +11,3 % (plus forte croissance UE). Stratégie = UN dossier de référencement préparé M12, présenté à Biofach 2027. Pas de porte-à-porte NL.'),

-- ============ SUISSE (phase 3 — niche valeur)
('buyer', 3, 'epicerie_bio', 'Épiceries fines Genève/Lausanne (vague)', 'Genève/Lausanne', 'Suisse',
 NULL, NULL, NULL, 'seed:conquete',
 'Record mondial : 481 €/hab/an de bio, 12,3 % de part de marché [FiBL]. Hors UE = douane : uniquement produits haute valeur/kg (safran, vanille, micro-lots). Via revendeurs locaux d''abord. M14-M20.'),

-- ============ RÉSEAUX PRODUCTEURS MONDIAUX (recrutement OFFRE)
('producer', 3, 'cafe', 'CLAC (réseau producteurs Fairtrade AmLat)', 'San Salvador', 'El Salvador',
 'info@clac-comerciojusto.org', '+503 2521 7200', 'https://clac-comerciojusto.org',
 'seed:conquete | contact:fairtrade.net',
 'Coordination latino-américaine des petits producteurs Fairtrade : accès à des CENTAINES de coopératives café/cacao/quinoa. Approche M10 : proposer un webinaire « vendre en direct en Europe avec vos preuves ». PAS un producteur unique : un réseau.'),
('producer', 3, 'cafe', 'Fairtrade Africa (réseau producteurs)', 'Nairobi', 'Kenya',
 NULL, NULL, 'https://fairtradeafrica.net',
 'seed:conquete | contact:fairtrade.net',
 'Réseau des producteurs Fairtrade d''Afrique (café, cacao, karité, épices). Même approche webinaire M10. Contact via le site.'),
('producer', 3, 'epices', 'NAPP (réseau producteurs Asie-Pacifique)', 'Asie-Pacifique', 'Inde',
 NULL, NULL, 'https://www.fairtrade.net/napp-en',
 'seed:conquete | contact:fairtrade.net',
 'Réseau Fairtrade Asie-Pacifique (épices, thé, coco). Approche M10 via formulaire.'),
('producer', 3, 'cafe', 'CBI — Centre for the Promotion of Imports (NL)', 'La Haye', 'Pays-Bas',
 NULL, NULL, 'https://www.cbi.eu',
 'seed:conquete | contact:site-officiel',
 'Agence du ministère NL des Affaires étrangères : coache des exportateurs du Sud « market-ready » pour l''UE (café, épices, huiles). Partenariat M10 : leurs cohortes diplômées = vivier de vendeurs ayant déjà certifs et process.'),
('producer', 2, 'cafe', 'Trade for Development Centre (Enabel, BE)', 'Bruxelles', 'Belgique',
 NULL, NULL, 'https://www.tdc-enabel.be',
 'seed:conquete | contact:site-officiel',
 'Agence belge de promotion du commerce équitable, accompagne des producteurs du Sud (surtout Afrique). Approche M6-M9 avec le dossier Belgique : leurs producteurs accompagnés cherchent des débouchés UE.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
