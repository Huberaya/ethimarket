-- Qualification contacts phase 1, vague 2 (recherches publiques sept. 2026).
-- Acheteurs Nantes/agglo + producteurs des filières héros. Sources notées.
-- Rejouable : UPDATE par nom, uniquement si le champ est encore vide.

-- ===================== ACHETEURS (épiceries bio / enseignes)

update prospects set
  phone = '02 40 89 43 61', website = 'https://www.voiledebrume.com',
  city = 'Nantes (1 r. des Hauts Pavés)',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'Voile de Brume' and phone is null;

update prospects set
  phone = '06 64 31 11 48', email = 'unbrindifferent@gmail.com',
  city = 'Nantes (46 bd Jules Verne)',
  source = coalesce(source, '') || ' | contact:annuairevert'
where name = 'Un Brin Différent' and phone is null;

update prospects set
  phone = '02 28 43 48 62', website = 'https://www.biocoop-nantesschuman.fr',
  city = 'Nantes (160 bd Schuman)',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'BIO Schuman' and phone is null;

update prospects set
  phone = '02 28 16 41 65',
  city = 'Nantes (22-26 r. Barbara)',
  source = coalesce(source, '') || ' | contact:bible-marques/118712'
where name = 'Biocoop Barbara' and phone is null;

update prospects set
  phone = '07 77 75 72 02',
  city = 'Nantes (1 r. Lamoricière)',
  source = coalesce(source, '') || ' | contact:bible-marques/118712'
where name = 'Biocoop Lamoricière' and phone is null;

update prospects set
  phone = '02 40 89 13 90',
  city = 'Nantes (188 rte de Rennes)',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'Biocoop Orvault (rte de Rennes)' and phone is null;

update prospects set
  phone = '06 61 21 17 17',
  city = 'Nantes (2 r. Crucy)', website = 'https://bionarel.com',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'Bionel' and phone is null;

update prospects set
  phone = '06 31 24 13 73',
  city = 'Nantes (23 r. Jeanne d''Arc)',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'BIORGANIS' and phone is null;

update prospects set
  phone = '06 31 61 30 32',
  city = 'Nantes (3 r. du Carcouët)',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'Granum' and phone is null;

update prospects set
  phone = '02 40 76 76 00', website = 'https://www.chlorophylle-coop.com',
  city = 'Rezé (147 rte des Sorinières)',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Chlorophylle Rezé Océane' and phone is null;

update prospects set
  phone = '02 51 82 00 82', website = 'https://www.chlorophylle-coop.com',
  city = 'Rezé (18 r. Ordronneau, Atout Sud)',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Chlorophylle Rezé Atout Sud' and phone is null;

update prospects set
  phone = '02 40 40 10 10', website = 'https://www.chlorophylle-coop.com',
  city = 'Saint-Herblain (Beauséjour)',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Chlorophylle St-Herblain Beauséjour' and phone is null;

update prospects set
  phone = '02 51 84 57 61',
  city = 'Nantes (14 r. Pitre Chevalier)',
  source = coalesce(source, '') || ' | contact:lavieclaire.com'
where name = 'La Vie Claire Pitre-Chevalier' and phone is null;

update prospects set
  phone = '02 40 35 75 40', website = 'https://naturalia.fr',
  city = 'Nantes (23 allée d''Orléans)',
  source = coalesce(source, '') || ' | contact:trouver-ouvert/vitamont'
where name = 'Naturalia Orléans' and phone is null;

-- ===================== PRODUCTEURS (filières héros)

update prospects set
  email = 'info@yirgacheffeunion.com', phone = '+251 949 393939',
  website = 'https://yirgacheffeunion.com',
  city = 'Addis-Abeba (Akaki Kaliti)',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Yirgacheffe Coffee Farmers Cooperative Union (YCFCU)' and email is null;

update prospects set
  email = 'info@sidamacoffee.com', phone = '+251 11 440 7165',
  website = 'https://sidamacoffee.com',
  city = 'Addis-Abeba (Dawi Bldg, Debre Zeit Rd)',
  notes = coalesce(notes, '') || ' GM Tsegaye Anebo (+251 911 247326). Autres e-mails publics : sidamacoffee22@gmail.com, sidacoop@yahoo.com.',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Sidama Coffee Farmers Cooperative Union (SCFCU)' and email is null;

update prospects set
  email = 'info@oromiacoffeeunion.com', phone = '+251 911 226744',
  website = 'https://oromiacoffeeunion.com',
  city = 'Addis-Abeba (Gelan, Debre Zeit Rd)',
  notes = coalesce(notes, '') || ' 407 coopératives, 562 000 fermiers. Contacts direction publics : dejenedadi@, mitikubekele@, anumagetachew@oromiacoffeeunion.com.',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Oromia Coffee Farmers Cooperative Union (OCFCU)' and email is null;

update prospects set
  name = 'Coopérative Souktana du Safran (Taliouine)',
  email = 'souktanadusafran@yahoo.fr', phone = '+212 528 534 452',
  website = 'https://souktana.org',
  city = 'Taliouine (RN10)',
  notes = coalesce(notes, '') || ' Coopérative historique du safran de Taliouine, production + commercialisation.',
  source = coalesce(source, '') || ' | contact:facebook-officiel/mindtrip'
where name = 'Coopérative safran Taliouine (alternative Iran)' and email is null;

update prospects set
  name = 'Coopérative Taitmatine (argane, Tiout)',
  email = 'cooptaitmatine@gmail.com', phone = '+212 528 852 551',
  website = 'https://cooptaitmatine.com',
  city = 'Tiout, prov. Taroudant',
  notes = coalesce(notes, '') || ' Coopérative féminine certifiée Ecocert/ONSSA/IGP/Fair for Life — cible idéale filière argane. Mobiles : +212 661 063 913 / +212 662 130 340.',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Coopérative féminine argane — cible 1 (IGP + bio)' and email is null;

update prospects set
  name = 'Sahanala Vanille (fédération, SAVA)',
  email = 'info@sahanala.net', phone = '+261 20 22 258 30',
  website = 'https://sahanala.net',
  city = 'Antananarivo (siège) / SAVA',
  notes = coalesce(notes, '') || ' Fédération de 4 200 producteurs (18 associations), vanille bio certifiée sur 5 régions dont SAVA. Structure exportatrice détenue par les producteurs.',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Groupements vanille SAVA — cible 1 (certifié bio)' and email is null;
