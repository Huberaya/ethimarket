-- Densification acheteurs vague 16 (sept. 2026) : Finistère (29) en profondeur.
-- Complète Brest (Brûlerie du Léon, Kafeta) et Quimper (Coïc, Alré) déjà au CRM :
-- pays Bigouden, Cornouaille, Centre-Bretagne.
-- Sources : annuaire pagesjaunes départemental, sites officiels, Gault&Millau. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

('buyer', 1, 'torrefacteur', 'Comptoir et Traditions (Concarneau)', 'Concarneau (6 r. des Écoles)', 'France',
 NULL, '02 98 97 16 94', NULL, 'seed:v16 | contact:gaultmillau/tourisme',
 'Artisan torréfacteur 20+ ans, référencé GAULT&MILLAU (rigueur équipements/origines soulignée) : moka éthiopien, Colombie, Brésil + services pros et location percolateurs. Café bio au catalogue.'),
('buyer', 1, 'torrefacteur', 'Brûlerie du Poher (Carhaix)', 'Carhaix-Plouguer (29 r. Général Lambert)', 'France',
 'bruleriedupoher@orange.fr', '02 98 93 34 91', 'https://www.bruleriedupoher.fr', 'seed:v16 | contact:site-officiel',
 'Torréfaction lente sur place (Amérique + Afrique) + coffee shop, gérant identifié : David Marzin (SARL 751753203). Seul torréfacteur du Centre-Bretagne — zone blanche concurrentielle.'),
('buyer', 1, 'torrefacteur', 'Brûlerie de Lambour (Pont-l''Abbé)', 'Pont-l''Abbé (3-5 r. Carnot)', 'France',
 NULL, '02 98 87 16 24', 'https://www.brulerie-de-lambour.fr', 'seed:v16 | contact:site-officiel',
 'Artisan torréfacteur depuis 1975, arabicas moulus à la demande + épicerie fine + salon de thé. Capitale du pays Bigouden.'),
('buyer', 1, 'torrefacteur', 'Brûlerie de Plozévet', 'Plozévet (rte de Pennengoat)', 'France',
 'contact@brulerie-plozevet.fr', '02 98 91 35 90', 'https://www.brulerie-plozevet.fr', 'seed:v16 | contact:site-officiel',
 'Torréfaction sur place + e-shop actif (livraison France entière, offerte dès 69€) : double canal boutique+en ligne. Portable : 06 70 00 01 52.'),
('buyer', 1, 'torrefacteur', 'Les Brûleries du Léon (Halles St-Louis)', 'Brest (r. Halles Saint-Louis)', 'France',
 NULL, NULL, NULL, 'seed:v16 | contact:pagesjaunes-fiche',
 '2e point de vente Brûlerie du Léon (le 88 r. Jean Jaurès est déjà au CRM) — confirme le réseau multi-boutiques brestois.'),
('buyer', 1, 'torrefacteur', 'Cote et Biscuits (Douarnenez)', 'Douarnenez (2 r. Eugène Kerivel)', 'France',
 NULL, NULL, NULL, 'seed:v16 | contact:pagesjaunes-fiche',
 'Torréfaction artisanale + grands crus + vrac + produits locaux — port de Douarnenez.'),
('buyer', 1, 'epicerie_bio', 'Graines de Gaïa (Fouesnant)', 'Fouesnant (1 pl. de l''Église)', 'France',
 NULL, NULL, NULL, 'seed:v16 | contact:pagesjaunes-fiche',
 'Épicerie bio VRAC + herboristerie + e-shop (4,7/5, 35 avis), travaille déjà en direct avec artisans/producteurs : culture circuit court = notre langage.'),
('buyer', 1, 'epicerie_bio', 'Délices du Kae (Landerneau)', 'Landerneau (50 quai Léon)', 'France',
 NULL, NULL, NULL, 'seed:v16 | contact:pagesjaunes-fiche',
 'Boutique café/chocolat/thé (revend Brûlerie du Léon + Fabrikathé), 2e boutique à Saint-Renan (4 r. St-Mathieu) : mini-réseau 2 magasins, café bio référencé.'),
('buyer', 1, 'epicerie_bio', 'Le Cellier du Faou', 'Le Faou (56 r. Général de Gaulle)', 'France',
 NULL, NULL, NULL, 'seed:v16 | contact:pagesjaunes-fiche',
 'Cave + torréfaction café arabica — carrefour Crozon/Monts d''Arrée.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
