-- Qualification des coordonnées des cibles P1 (recherches annuaires publics,
-- septembre 2026). Sources en champ source ; aucune donnée inventée.
-- Rejouable : UPDATE par nom, ne touche que les colonnes de contact.

-- Torréfacteurs
update prospects set
  phone = '06 71 34 51 16',
  city = 'Nantes (2 r. Sylvain Paris)',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'Kultivar Café' and phone is null;

update prospects set
  phone = '06 40 17 04 57',
  website = 'https://www.cime-cafe.fr',
  city = 'Nantes (20 r. des Hauts Pavés)',
  source = coalesce(source, '') || ' | contact:mapstr/initiative-nantes'
where name = 'Cime Café' and phone is null;

update prospects set
  phone = '02 40 47 59 68',
  website = 'https://www.la-brulerie-nantes.fr',
  city = 'Nantes (24 r. de la Marne)',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'La Brûlerie (r. de la Marne)' and phone is null;

update prospects set
  phone = '09 83 03 65 33',
  city = 'Orvault (10 pl. Jeanne d''Arc) + Île de Nantes',
  notes = coalesce(notes, '') || ' Boutique Orvault 10 pl. Jeanne d''Arc + comptoir Marché des Arts, Île de Nantes (6 bd de la Prairie au Duc).',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'TINTO' and phone is null;

update prospects set
  phone = '02 23 24 86 18',
  website = 'https://www.cafe1802.fr',
  city = 'Rennes (34 r. d''Antrain)',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'Café 1802' and phone is null;

-- Épiceries bio / fines
update prospects set
  phone = '02 40 89 76 26',
  email = 'contact@abcterroirs.com',
  website = 'https://abcterroirs.com',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'ABC Terroirs' and phone is null;

update prospects set
  phone = '06 69 95 65 76',
  website = 'https://grainsdailleurs.hiboutik.com/shop',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'Grains d''Ailleurs' and phone is null;

update prospects set
  phone = '02 40 25 11 11',
  website = 'https://chlorophylle-coop.com',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'Chlorophylle Beaujoire' and phone is null;

update prospects set
  phone = '02 52 59 58 46',
  website = 'https://leshameauxbio.fr',
  source = coalesce(source, '') || ' | contact:biocoop.fr'
where name = 'Les Hameaux Bio (Marché Commun)' and phone is null;

update prospects set
  phone = '02 40 48 55 67',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'Biocoop Horizon Vert' and phone is null;

update prospects set
  phone = '02 28 29 10 38',
  source = coalesce(source, '') || ' | contact:118712'
where name = 'Mani' and phone is null;

-- Un Grain Une Feuille : le tél. public était déjà en note → le structurer
update prospects set
  phone = '02 28 16 85 70',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Un Grain Une Feuille' and phone is null;
