-- Densification acheteurs vague 15 (sept. 2026) : Belgique RÉELLE (phase 2).
-- Remplace les slots génériques « vague à qualifier » par des cibles nommées
-- avec contacts officiels vérifiés. Zéro douane, zéro barrière de langue.
-- Sources : sites officiels, fédération KOFFIECAFE/Fevia, presse (La Libre). Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

('buyer', 2, 'torrefacteur', 'MOK Specialty Coffee Roastery', 'Bruxelles (r. Antoine Dansaert 196)', 'Belgique',
 'order@mokcoffee.be', '+32 472 058 224', 'https://mokcoffee.be', 'seed:v15 | contact:site-officiel',
 'Micro-torréfaction de spécialité depuis 2012 (batches 10-15 kg, Giesen W15), « tight relationships with our suppliers » = sourcing tracé revendiqué. 3 sites (Bruxelles ×2 + Leuven). E-mail WHOLESALE dédié vérifié.'),
('buyer', 2, 'torrefacteur', 'OR Coffee Roasters', 'Westrem (Dorpsstraat 31)', 'Belgique',
 NULL, '+32 9 336 37 36', 'https://www.orcoffee.be', 'seed:v15 | contact:site-officiel',
 'Torréfacteur de spécialité + centre de formation « a heart for DIRECT TRADE » — achète presque tout à l''origine : notre pitch sourcing vérifié est leur langage natal. 100% arabica, horeca/retail/office. Due diligence RFA publiée.'),
('buyer', 2, 'torrefacteur', 'Javry (café équitable PME)', 'Etterbeek (Cours Saint-Michel 30A)', 'Belgique',
 'support@javry.com', '+32 2 887 35 64', 'https://javry.com', 'seed:v15 | contact:site-officiel',
 'Fournisseur n°1 de café ÉQUITABLE+BIO (Certisys) auprès des PME belges (fondé 2015, croissance >120%/an, levée 400 k€ BNP/Sambrinvest). Sourcing direct producteurs, visites annuelles plantations, torréfaction artisanale Bièvre. Déjà implanté en France (Nantes, Brest, Bordeaux, Lyon…) : gros consommateur de vert équitable = prospect volume.'),
('buyer', 2, 'torrefacteur', 'Corica (torréfaction artisanale bio)', 'Bruxelles (r. du Marché aux Poulets 49)', 'Belgique',
 'info@corica.be', '+32 2 731 90 04', 'https://corica.be', 'seed:v15 | contact:site-officiel',
 'Artisan certifié + produits BIO certifiés Certisys (BE-BIO-01), torréfié en Belgique, boutique centre-ville. Label « Certified Artisan ».'),
('buyer', 2, 'torrefacteur', 'Santos Palace (torréfaction 1911)', 'Bruxelles (r. de Manchester 32-34, Molenbeek)', 'Belgique',
 NULL, '+32 2 410 44 75', 'https://santospalace.be', 'seed:v15 | contact:site-officiel',
 'Dernier torréfacteur industriel bruxellois actif, depuis 1911. Magasin : r. du Marché aux Poulets 3 (+32 2 512 39 53). Volume + histoire — approche dossier.'),
('buyer', 2, 'epicerie_en_ligne', 'MonTorréfacteur.be (e-shop des torréfacteurs belges)', 'Belgique (en ligne)', 'Belgique',
 'contact@montorrefacteur.be', '+32 472 56 10 13', 'https://montorrefacteur.be', 'seed:v15 | contact:facebook-officiel',
 'MULTIPLICATEUR : e-shop qui agrège les torréfacteurs artisanaux belges — un partenariat = visibilité sur tout l''écosystème torréfaction BE.'),
('buyer', 2, 'grossiste', 'KOFFIECAFE (fédération torréfacteurs belges)', 'Bruxelles (r. de la Science 14)', 'Belgique',
 'info@koffiecafe.be', '+32 2 657 18 09', 'https://koffiecafe.be', 'seed:v15 | contact:fevia-officiel',
 'FÉDÉRATION (75+ ans) des torréfacteurs et vendeurs de café du marché belge, membre de l''ECF européenne. Secrétaire générale : Petty De Sloovere (+32 476 40 06 42, pds@fevia.be), président Wim Claes (wim.claes@javacoffee.be). Une présentation à la fédération = accès au secteur entier. Approche institutionnelle (comme Collectif Café en France).'),
('buyer', 2, 'torrefacteur', 'Natural Caffè (av. Louise)', 'Bruxelles (av. Louise 196A)', 'Belgique',
 NULL, '+32 2 646 72 14', 'https://naturalcaffe.com', 'seed:v15 | contact:site-officiel',
 'Torréfaction sur place depuis 20 ans av. Louise (Colombie, Honduras, Éthiopie) + coffee shop/galerie. Clientèle premium.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);

-- ============================================================ NETTOYAGE SLOTS GÉNÉRIQUES
-- Les vagues « à qualifier » belges sont remplacées par les cibles réelles ci-dessus.
DELETE FROM prospects
WHERE name IN ('Torréfacteurs spécialité Bruxelles/Wallonie (vague)', 'Épiceries bio Bruxelles/Wallonie (vague)')
  AND status = 'a_contacter'
  AND NOT EXISTS (SELECT 1 FROM prospect_touches t WHERE t.prospect_id = prospects.id);
