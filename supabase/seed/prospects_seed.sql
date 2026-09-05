-- =============================================================
-- EthiMarket — Semis du pipeline de prospection
-- Sources : annuaires professionnels publics (PagesJaunes/118712,
-- annuaire Agence Bio), sites des organisations, recherches
-- publiques août 2026. RÈGLE : coordonnées et interlocuteur à
-- QUALIFIER avant tout contact (l'outil fournit la cible et la
-- source, l'humain vérifie). Idempotent (delete du semis + insert).
-- =============================================================

BEGIN;
DELETE FROM prospect_touches WHERE prospect_id IN (SELECT id FROM prospects WHERE source LIKE 'seed:%');
DELETE FROM prospects WHERE source LIKE 'seed:%';

-- ─────────────────────────────────────────────────────────────
-- ACHETEURS — PHASE 1 : les 20 épiceries bio (Nantes & agglo)
-- ─────────────────────────────────────────────────────────────
INSERT INTO prospects (kind, phase, segment, name, city, country, website, source, notes) VALUES
('buyer', 1, 'epicerie_bio', 'Voile de Brume', 'Nantes (Hauts-Pavés)', 'France', NULL, 'seed:pagesjaunes', 'Indépendant, produits naturels — 1 r. des Hauts Pavés. Qualifier gérant + e-mail.'),
('buyer', 1, 'epicerie_bio', 'Un Brin Différent', 'Nantes (Jules Verne)', 'France', NULL, 'seed:118712', 'Épicerie bio & éco-responsable — 46 bd Jules Verne. Positionnement très proche du nôtre.'),
('buyer', 1, 'epicerie_bio', 'Mani', 'Nantes (Mayence)', 'France', NULL, 'seed:pagesjaunes', 'Indépendant — 18 r. de Mayence.'),
('buyer', 1, 'epicerie_bio', 'BIO Schuman', 'Nantes (Schuman)', 'France', NULL, 'seed:pagesjaunes', 'Indépendant — 160 rte Robert Schuman.'),
('buyer', 1, 'epicerie_bio', 'Grains d''Ailleurs', 'Nantes (Madeleine)', 'France', NULL, 'seed:pagesjaunes', 'Épicerie vrac — 27 chaussée de la Madeleine. Le vrac = nos produits secs.'),
('buyer', 1, 'epicerie_bio', 'ABC Terroirs', 'Nantes (St-Pierre)', 'France', NULL, 'seed:pagesjaunes', 'Épicerie fine terroirs — 5 pl. St-Pierre. Angle : vanille/safran/argane.'),
('buyer', 1, 'epicerie_bio', 'Chlorophylle Beaujoire', 'Nantes (Beaujoire)', 'France', NULL, 'seed:pagesjaunes', 'Réseau local Chlorophylle (4 magasins agglo) — 20 r. Eugénie Cotton. Si celui-ci marche, les 3 autres suivent.'),
('buyer', 1, 'epicerie_bio', 'Chlorophylle St-Herblain Beauséjour', 'Saint-Herblain', 'France', NULL, 'seed:pagesjaunes', '34 r. des Plantes — même groupe local que Beaujoire.'),
('buyer', 1, 'epicerie_bio', 'Chlorophylle Rezé Atout Sud', 'Rezé', 'France', NULL, 'seed:pagesjaunes', '18 r. Ordronneau.'),
('buyer', 1, 'epicerie_bio', 'Chlorophylle Rezé Océane', 'Rezé', 'France', NULL, 'seed:pagesjaunes', '147 rte des Sorinières.'),
('buyer', 1, 'epicerie_bio', 'Les Hameaux Bio (Marché Commun)', 'Nantes', 'France', NULL, 'seed:pagesjaunes', 'Réseau Biocoop local Les Hameaux — 19 r. du Marché Commun. Décision magasin possible.'),
('buyer', 1, 'epicerie_bio', 'Biocoop Horizon Vert', 'Nantes (Gustave Roch)', 'France', NULL, 'seed:pagesjaunes', '17 bd Gustave Roch — gros rayon vrac (avis clients).'),
('buyer', 1, 'epicerie_bio', 'Biocoop Barbara', 'Nantes (Barbara)', 'France', NULL, 'seed:pagesjaunes', '22 r. Barbara — se présente comme « lieu de vie » : sensible à l''histoire producteur.'),
('buyer', 1, 'epicerie_bio', 'Biocoop Lamoricière', 'Nantes', 'France', NULL, 'seed:pagesjaunes', '1 r. Lamoricière.'),
('buyer', 1, 'epicerie_bio', 'Biocoop Orvault (rte de Rennes)', 'Nantes/Orvault', 'France', NULL, 'seed:pagesjaunes', '188 rte de Rennes.'),
('buyer', 1, 'epicerie_bio', 'La Vie Claire Pitre-Chevalier', 'Nantes', 'France', NULL, 'seed:118712', '14 r. Pitre Chevalier — franchisé : décision locale partielle.'),
('buyer', 1, 'epicerie_bio', 'Naturalia Orléans', 'Nantes (centre)', 'France', NULL, 'seed:pagesjaunes', '23 allée d''Orléans — intégré : plus dur, tester le gérant.'),
('buyer', 1, 'epicerie_bio', 'Bionel', 'Nantes (Crucy)', 'France', NULL, 'seed:pagesjaunes', '2 r. Crucy.'),
('buyer', 1, 'epicerie_bio', 'BIORGANIS', 'Nantes (Jeanne d''Arc)', 'France', NULL, 'seed:pagesjaunes', '23 r. Jeanne d''Arc.'),
('buyer', 1, 'epicerie_bio', 'Granum', 'Nantes (Carcouët)', 'France', NULL, 'seed:pagesjaunes', '3 r. du Carcouët.');

-- ACHETEURS — PHASE 1 : torréfacteurs (10)
INSERT INTO prospects (kind, phase, segment, name, city, country, website, source, notes) VALUES
('buyer', 1, 'torrefacteur', 'Kultivar Café', 'Nantes', 'France', NULL, 'seed:reddit-nantes', 'Réputé meilleur torréfacteur de la ville (avis locaux). Café de spécialité — cible idéale Yirgacheffe.'),
('buyer', 1, 'torrefacteur', 'Cime Café', 'Nantes', 'France', NULL, 'seed:reddit-nantes', 'Torréfacteur de spécialité.'),
('buyer', 1, 'torrefacteur', 'TINTO', 'Nantes/Angers', 'France', 'https://www.tintonantes.fr', 'seed:site', 'Torréfacteur B2B (fournit épiceries, CHR) — un client = un canal de distribution.'),
('buyer', 1, 'torrefacteur', 'Un Grain Une Feuille', 'Carquefou', 'France', 'https://www.ungrainunefeuille.com', 'seed:site', 'Torréfaction artisanale certifiée BIO (Certipaq) — alignement parfait. Tél. public : 02 28 16 85 70.'),
('buyer', 1, 'torrefacteur', 'La Brûlerie (r. de la Marne)', 'Nantes', 'France', NULL, 'seed:reddit-nantes', '24 r. de la Marne — brûlerie historique.'),
('buyer', 1, 'torrefacteur', 'Grain de Café (Tour de Bretagne)', 'Nantes', 'France', NULL, 'seed:reddit-nantes', 'Torréfacteur boutique centre-ville.'),
('buyer', 1, 'torrefacteur', 'Café 1802', 'Rennes', 'France', NULL, 'seed:reddit-nantes', 'Torréfacteur de spécialité rennais réputé.'),
('buyer', 1, 'torrefacteur', 'Curieux Café', 'Nantes', 'France', NULL, 'seed:reddit-nantes', 'Coffee shop — petit volume mais prescripteur.'),
('buyer', 1, 'torrefacteur', 'Alaia Café', 'Nantes', 'France', NULL, 'seed:reddit-nantes', 'Coffee shop de spécialité.'),
('buyer', 1, 'torrefacteur', 'Izi Café', 'Nantes', 'France', NULL, 'seed:reddit-nantes', 'Coffee shop de spécialité.');

-- ACHETEURS — PHASE 1 : restaurants engagés (8) + épiceries en ligne (5)
INSERT INTO prospects (kind, phase, segment, name, city, country, source, notes) VALUES
('buyer', 1, 'restaurant', 'Restaurants gastronomiques Nantes — cible 1', 'Nantes', 'France', 'seed:a-qualifier', 'À identifier : tables « fait maison »/locavores du guide local. Angle : vanille Bourbon, safran, argane alimentaire. Remplacer cette ligne par le nom réel après repérage.'),
('buyer', 1, 'restaurant', 'Restaurants gastronomiques Nantes — cible 2', 'Nantes', 'France', 'seed:a-qualifier', 'Idem — viser les chefs présents sur les marchés (Talensac).'),
('buyer', 1, 'restaurant', 'Restaurants bio/végé Nantes — cible 3', 'Nantes', 'France', 'seed:a-qualifier', 'Restaurants certifiés bio (annuaire Agence Bio, catégorie restauration).'),
('buyer', 1, 'restaurant', 'Pâtisseries haut de gamme Nantes — cible 4', 'Nantes', 'France', 'seed:a-qualifier', 'Vanille + cacao : les pâtissiers paient la qualité.'),
('buyer', 1, 'restaurant', 'Restaurants Rennes — cible 5', 'Rennes', 'France', 'seed:a-qualifier', 'Étendre à Rennes après les 4 premiers nantais.'),
('buyer', 1, 'restaurant', 'Restaurants Angers — cible 6', 'Angers', 'France', 'seed:a-qualifier', ''),
('buyer', 1, 'restaurant', 'Traiteur événementiel engagé — cible 7', 'Nantes', 'France', 'seed:a-qualifier', ''),
('buyer', 1, 'restaurant', 'Salon de thé/brunch — cible 8', 'Nantes', 'France', 'seed:a-qualifier', 'Thé Sencha, miel, vanille.'),
('buyer', 1, 'epicerie_en_ligne', 'Épicerie en ligne bio — cible 1', NULL, 'France', 'seed:a-qualifier', 'Pure players épicerie fine/bio (hors géants) : chercher « épicerie fine bio en ligne » et qualifier 5 indépendants.'),
('buyer', 1, 'epicerie_en_ligne', 'Épicerie en ligne bio — cible 2', NULL, 'France', 'seed:a-qualifier', ''),
('buyer', 1, 'epicerie_en_ligne', 'Épicerie en ligne bio — cible 3', NULL, 'France', 'seed:a-qualifier', ''),
('buyer', 1, 'epicerie_en_ligne', 'Épicerie en ligne bio — cible 4', NULL, 'France', 'seed:a-qualifier', ''),
('buyer', 1, 'epicerie_en_ligne', 'Épicerie en ligne bio — cible 5', NULL, 'France', 'seed:a-qualifier', '');

-- ACHETEURS — PHASE 2 (échantillon structurant : à étoffer en fin de phase 1)
INSERT INTO prospects (kind, phase, segment, name, city, country, source, notes) VALUES
('buyer', 2, 'grossiste', 'Relais Vert', 'Carpentras', 'France', 'seed:secteur', 'Grossiste bio historique (spécialisé magasins bio). Argument : dossiers de lot prêts pour leur aval.'),
('buyer', 2, 'grossiste', 'Vitafrais', 'Île-de-France', 'France', 'seed:secteur', 'Grossiste distribution spécialisée bio.'),
('buyer', 2, 'biocoop', 'Magasins Biocoop Ouest (vague 30)', 'Grand Ouest', 'France', 'seed:strategie', 'Liste des 30 magasins à construire depuis les réussites phase 1 — entrer par le magasin, référencer la centrale en phase 3.'),
('buyer', 2, 'chocolatier', 'Chocolatiers bean-to-bar France (vague 15)', NULL, 'France', 'seed:strategie', 'Annuaire des bean-to-bar français. Argument massue : cacao Ghana géolocalisé EUDR = leur obligation légale.'),
('buyer', 2, 'epicerie_bio', 'Épiceries bio Bruxelles/Wallonie (vague)', 'Bruxelles', 'Belgique', 'seed:strategie', 'Même playbook qu''en France, prix acceptés plus hauts.'),
('buyer', 2, 'cosmetique', 'Marques cosmétiques indie (argane/karité)', NULL, 'France', 'seed:strategie', 'Test de diversification : 8 marques clean beauty françaises.');

-- ACHETEURS — PHASE 3 (les references à conquérir avec nos preuves)
INSERT INTO prospects (kind, phase, segment, name, city, country, source, notes) VALUES
('buyer', 3, 'centrale', 'Biocoop (centrale nationale)', 'Paris', 'France', 'seed:strategie', 'Dossier référencement avec taux de service + traçabilité phase 1-2. Ne PAS approcher avant.'),
('buyer', 3, 'centrale', 'La Vie Claire (centrale)', 'Lyon', 'France', 'seed:strategie', ''),
('buyer', 3, 'centrale', 'Naturalia (centrale)', 'Paris', 'France', 'seed:strategie', ''),
('buyer', 3, 'epicerie_bio', 'Allemagne : indépendants + denn''s (vague)', 'Berlin/Munich', 'Allemagne', 'seed:strategie', '1er marché bio d''Europe (~16 Mds€). Via hub Benelux/Rhénanie. Interface DE à ajouter le moment venu.'),
('buyer', 3, 'industriel', 'Torréfacteurs moyens / marques chocolat éthiques', NULL, 'France', 'seed:strategie', 'Contrats de campagne, conteneurs dédiés.'),
('buyer', 3, 'food_service', 'Food-service / traiteurs événementiel', NULL, 'France', 'seed:strategie', '');

-- ─────────────────────────────────────────────────────────────
-- PRODUCTEURS — PHASE 1 : les 8 coopératives d'ancrage
-- ─────────────────────────────────────────────────────────────
INSERT INTO prospects (kind, phase, segment, name, city, country, website, source, notes) VALUES
('producer', 1, 'cafe', 'Yirgacheffe Coffee Farmers Cooperative Union (YCFCU)', 'Yirgacheffe', 'Éthiopie', 'https://yirgacheffeunion.com', 'seed:union-publique', 'Union historique, coopératives membres certifiées Fairtrade (certification de groupe). Contact via le site + FLO-ID vérifiable sur flocert.net. Cible : 2-3 coopératives membres.'),
('producer', 1, 'cafe', 'Sidama Coffee Farmers Cooperative Union (SCFCU)', 'Sidama', 'Éthiopie', NULL, 'seed:union-publique', '51 coopératives, 76 000 familles, certifiée FLO depuis 2003, ~10 000 t arabica bio/an, 95% lavé. FOB coopératif Sidamo G2 : 6-8 $/kg (saison 25/26).'),
('producer', 1, 'cafe', 'Oromia Coffee Farmers Cooperative Union (OCFCU)', 'Addis-Abeba', 'Éthiopie', NULL, 'seed:union-publique', '405 coopératives, 370 000+ familles. Couvre Limu, Yirgacheffe, Jimma, Harrar. La plus grande union — commencer par 1-2 coopératives membres.'),
('producer', 1, 'vanille', 'Groupements vanille SAVA — cible 1 (certifié bio)', 'Sambava/Antalaha', 'Madagascar', NULL, 'seed:a-qualifier', 'Identifier via le registre public Ecocert (business directory, filtre Madagascar/vanille) + fédérations locales. Vérifier le certificat AVANT contact — notre méthode standard.'),
('producer', 1, 'vanille', 'Groupements vanille SAVA — cible 2', 'Région SAVA', 'Madagascar', NULL, 'seed:a-qualifier', 'Deuxième groupement pour sécuriser l''offre vanille (récolte/qualité variables).'),
('producer', 1, 'argane', 'Coopérative féminine argane — cible 1 (IGP + bio)', 'Région Agadir', 'Maroc', NULL, 'seed:a-qualifier', 'Identifier via GIE/ANDZOA et registre Ecocert Maroc. Privilégier coopérative vendant huile FINIE (pas amandons).'),
('producer', 1, 'argane', 'Coopérative féminine argane — cible 2', 'Région Essaouira', 'Maroc', NULL, 'seed:a-qualifier', ''),
('producer', 1, 'safran', 'Coopérative safran Taliouine (alternative Iran)', 'Taliouine', 'Maroc', NULL, 'seed:a-qualifier', 'Le safran iranien est compliqué (sanctions/paiements) : Taliouine (Maroc, AOP) est l''alternative sourçable. ISO 3632 exigée.');

-- PRODUCTEURS — PHASE 2
INSERT INTO prospects (kind, phase, segment, name, city, country, source, notes) VALUES
('producer', 2, 'cacao', 'Coopératives cacao Ghana certifiées FT (vague 3-4)', 'Kumasi/Takoradi', 'Ghana', 'seed:strategie', 'Via Fairtrade Africa + registre FLOCERT. GPS parcelles = notre pipeline EUDR déjà prêt. Attention filière régulée COCOBOD : export via licences.'),
('producer', 2, 'epices', 'Coopératives épices Kerala/Sri Lanka (vague 3-4)', 'Kerala/Colombo', 'Inde/Sri Lanka', 'seed:strategie', 'Certifiées NPOP + bio UE (via Indocert/OneCert — dans notre annuaire). COA oxyde d''éthylène systématique (notre pipeline le gère).'),
('producer', 2, 'miel', 'Coopératives miel Grèce/Éthiopie (vague 2)', NULL, 'Grèce/Éthiopie', 'seed:strategie', 'Certificat sanitaire animal requis (notre dossier de lot le prévoit).'),
('producer', 2, 'quinoa', 'Coopératives quinoa Pérou (vague 2)', 'Puno/Arequipa', 'Pérou', 'seed:strategie', 'Via BioLatina/IMOcert (notre annuaire). Volume B2B.');

-- PRODUCTEURS — PHASE 3
INSERT INTO prospects (kind, phase, segment, name, city, country, source, notes) VALUES
('producer', 3, 'cacao', 'Cacao fin Pérou/Équateur (vague)', NULL, 'Pérou/Équateur', 'seed:strategie', 'Cacao fin d''arôme pour les bean-to-bar conquis en phase 2.'),
('producer', 3, 'cafe', 'Café Colombie/Amérique centrale (vague)', NULL, 'Colombie', 'seed:strategie', 'Élargissement origine café une fois les corridors Afrique de l''Est rodés.'),
('producer', 3, 'karite', 'Karité/hibiscus/moringa Afrique de l''Ouest (vague)', NULL, 'Burkina/Sénégal', 'seed:strategie', 'Portés par le corridor Afrique de l''Ouest (cacao Ghana). Débouché cosmétique phase 2.');

COMMIT;
SELECT kind, phase, count(*) FROM prospects GROUP BY kind, phase ORDER BY kind, phase;
