-- Densification acheteurs vague 18 (sept. 2026) : Normandie est — Seine-Maritime (76) + Eure (27).
-- Bassin Rouen/Le Havre/Dieppe/Évreux, quasi vierge au CRM (seule Brûlerie Duchossoy).
-- Multiplicateurs : Couleur Café (boutique + école de café + coffee shop = 3 entités),
-- Biocoop du Rouennais (réseau), Fuzco (importateur-négociant cacao).
-- Sources : annuaire pagesjaunes 76/27, sites officiels, Gault&Millau. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ============================================================ ROUEN & AGGLO
('buyer', 1, 'torrefacteur', 'Couleur Café / École Maë (Rouen)', 'Rouen (130 r. Eau de Robec)', 'France',
 'boutique@couleur-cafe.net', '09 81 85 12 07', 'https://www.couleur-cafe.net', 'seed:v18 | contact:site-officiel',
 'MINI-RÉSEAU 3 entités : boutique de torréfaction + École Maë (organisme de FORMATION café) + coffee shop Café Addict (138 r. Eau de Robec, 09 87 48 41 43). 5/5 sur les avis, ateliers grand public. L''école forme des baristas = prescripteur local. E-mail officiel vérifié.'),
('buyer', 1, 'torrefacteur', 'Les Torréfacteurs Normands (Rouen)', 'Rouen (21 pl. Saint-Marc)', 'France',
 NULL, '02 27 08 80 21', 'https://www.lestorrefacteursnormands.fr', 'seed:v18 | contact:pagesjaunes/visiterouen',
 'Torréfaction artisanale de cafés d''exception (SARL 821231594, gérant identifié : Grégoire Meurice, 06 15 36 69 08), 5/5 (4 avis). Place Saint-Marc = cœur de Rouen.'),
('buyer', 1, 'torrefacteur', 'Anne Caron — le café de spécialité (Rouen)', 'Rouen (5 r. Rollon)', 'France',
 'rouen@caroncoffeeandshops.com', '02 35 07 03 40', 'https://cafeannecaron.com', 'seed:v18 | contact:gaultmillau',
 'Boutique rouennaise de la maison CARON (Anne Caron : Meilleure Torréfactrice de France Gault&Millau 2019 — sélection G&M 2020). Enseigne multi-boutiques avec e-shop : un référencement = visibilité nationale. E-mail boutique vérifié.'),
('buyer', 1, 'torrefacteur', 'Au Bonkawa (Buchy/Rouen)', 'Buchy (1553 parc des Cateliers)', 'France',
 'contact@aubonkawa.fr', '02 78 77 07 36', 'https://aubonkawa.fr', 'seed:v18 | contact:site-officiel',
 'Torréfacteur depuis 1996, FOURNISSEUR ENTREPRISES revendiqué (solutions bureau/CHR) + coffee shop + e-shop : canal B2B déjà structuré. E-mail officiel vérifié.'),
('buyer', 1, 'torrefacteur', 'Secret des Arômes (Isneauville)', 'Isneauville (170 allée du Manoir)', 'France',
 NULL, NULL, NULL, 'seed:v18 | contact:pagesjaunes-fiche',
 'Torréfaction artisanale nord de Rouen, vente magasin + en ligne (4,8/5 Facebook).'),
('buyer', 1, 'biocoop', 'Biocoop du Rouennais (réseau)', 'Amfreville-la-Mi-Voie (161 rte de Paris)', 'France',
 'contact@biocoop-rouen.fr', '02 32 10 05 31', NULL, 'seed:v18 | contact:annuaire-biocoop',
 'RÉSEAU Biocoop de l''agglo rouennaise (entité BIOCOOP DU ROUENNAIS) — magasin historique Jeanne d''Arc (88 r. Jeanne d''Arc, 02 35 71 29 78) + Amfreville. Un accord = l''agglo.'),

-- ============================================================ LE HAVRE
('buyer', 1, 'torrefacteur', 'Brûlerie Normande du Havre', 'Le Havre (62 r. Mont Joly)', 'France',
 NULL, NULL, NULL, 'seed:v18 | contact:pagesjaunes-fiche',
 'Brûlerie historique havraise — à qualifier lors de la tournée (couplable avec Duchossoy déjà au CRM).'),
('buyer', 1, 'torrefacteur', 'Caféocéane (Le Havre)', 'Le Havre (29 r. Pierre Brossolette)', 'France',
 NULL, NULL, NULL, 'seed:v18 | contact:pagesjaunes-fiche',
 'Torréfaction supérieure + thés Dammann + paniers garnis, livraison pro référencée.'),
('buyer', 1, 'torrefacteur', 'Maison Lemétais (Le Havre)', 'Le Havre (69 r. François Mazeline)', 'France',
 NULL, NULL, NULL, 'seed:v18 | contact:pagesjaunes-fiche',
 'Torréfacteur havrais réputé (avis : « le meilleur que j''ai goûté »).'),

-- ============================================================ DIEPPE & CÔTE
('buyer', 1, 'torrefacteur', 'Torréfaction Dieppoise', 'Dieppe (18 pl. Nationale)', 'France',
 NULL, NULL, NULL, 'seed:v18 | contact:pagesjaunes-fiche',
 'Atelier artisanal + épicerie fine + salon dégustation au cœur de Dieppe.'),
('buyer', 1, 'epicerie_bio', 'Olivier l''Épicier (Dieppe)', 'Dieppe (16 r. Saint-Jacques)', 'France',
 NULL, NULL, NULL, 'seed:v18 | contact:pagesjaunes-fiche',
 'Épicerie fine + torréfaction + thés de qualité — centre de Dieppe.'),
('buyer', 1, 'epicerie_bio', 'Délicatessen (Fécamp)', 'Fécamp (14 r. Jacques Huet)', 'France',
 NULL, NULL, NULL, 'seed:v18 | contact:pagesjaunes-fiche',
 'Épicerie fine + torréfaction en boutique + épices — clientèle fidèle multi-sociale (avis).'),

-- ============================================================ EURE (27)
('buyer', 1, 'torrefacteur', 'Brûlerie Moderne (Évreux)', 'Évreux (9 r. des Lombards)', 'France',
 NULL, '02 32 33 03 26', NULL, 'seed:v18 | contact:pagesjaunes',
 'Boutique HISTORIQUE d''Évreux, torréfaction sur place, couple identifié Stéphanie & Philippe (06 45 56 45 16). Institution locale.'),
('buyer', 2, 'transformateur', 'Fuzco (Évreux)', 'Évreux (215 rte de Paris)', 'France',
 NULL, NULL, NULL, 'seed:v18 | contact:pagesjaunes-fiche',
 'Torréfacteur + IMPORTATEUR-NÉGOCIANT de CACAO revendiqué : double filière café+cacao, profil phase 2 (volumes). À qualifier en priorité.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
