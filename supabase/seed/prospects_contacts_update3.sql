-- Qualification contacts, vague 3 (recherches publiques sept. 2026).
-- Remplace les slots génériques « cible N » par de vraies organisations,
-- avec coordonnées publiques vérifiées. Sources notées. Aucune donnée inventée.
-- Rejouable : conditions sur nom + champ vide.

-- ===================== TORRÉFACTEURS / COFFEE SHOPS (phase 1)

update prospects set
  city = 'Nantes (4 r. de Budapest)',
  notes = coalesce(notes, '') || ' SAS Alaia Café et Boutique (RCS Nantes 883 171 472), dirigeants F. Cluzel & A. Even. Pas de tél. public — passage boutique conseillé (à 50 m de Grain de Café).',
  source = coalesce(source, '') || ' | contact:societe.com/pagesjaunes'
where name = 'Alaia Café' and phone is null;

update prospects set
  email = 'curieuxcoffee@gmail.com',
  city = 'Nantes (3 allée Jean Bart)',
  notes = coalesce(notes, '') || ' Repris par deux associées, Claire et Ariane. Un des premiers coffee shops de France (10+ ans).',
  source = coalesce(source, '') || ' | contact:facebook-officiel'
where name = 'Curieux Café' and email is null;

update prospects set
  phone = '09 79 28 65 29',
  city = 'Nantes (19 r. Voltaire)',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'Izi Café' and phone is null;

update prospects set
  name = 'Grain de Café (r. de Budapest)',
  phone = '02 40 89 27 30',
  city = 'Nantes (10 r. de Budapest)',
  notes = coalesce(notes, '') || ' Adresse corrigée : 10 r. de Budapest (annuaire), pas Tour de Bretagne.',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'Grain de Café (Tour de Bretagne)' and phone is null;

-- ===================== RESTAURANTS / PÂTISSERIE / TRAITEUR (phase 1)

update prospects set
  name = 'L''Atlantide 1874 — Maison Guého',
  phone = '02 40 73 23 23',
  website = 'https://www.atlantide1874.fr',
  city = 'Nantes (5 r. de l''Hermitage)',
  notes = coalesce(notes, '') || ' Table gastronomique de référence (chef J.-Y. Guého). Angle : vanille + safran authentifiés lot par lot.',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Restaurants gastronomiques Nantes — cible 1' and phone is null;

update prospects set
  name = 'Le Manoir de la Régate',
  phone = '02 40 18 02 97',
  website = 'https://www.manoirdelaregate.com',
  city = 'Nantes (155 rte de Gachet)',
  notes = coalesce(notes, '') || ' Table gastronomique engagée produits locaux/durables — réceptive à la traçabilité.',
  source = coalesce(source, '') || ' | contact:lestablesdenantes'
where name = 'Restaurants gastronomiques Nantes — cible 2' and phone is null;

update prospects set
  name = 'L''éthiquête (vegan + épicerie)',
  phone = '02 40 48 20 02',
  website = 'https://www.ethiquete.fr',
  city = 'Nantes (14 r. Armand Brossard)',
  notes = coalesce(notes, '') || ' Restaurant vegan + épicerie intégrée = double débouché (cuisine + revente).',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Restaurants bio/végé Nantes — cible 3' and phone is null;

update prospects set
  name = 'Vincent Guerlais (pâtissier-chocolatier)',
  phone = '02 40 48 02 59',
  website = 'https://www.vincentguerlais.com',
  city = 'Nantes (labo : La Chapelle-sur-Erdre)',
  notes = coalesce(notes, '') || ' Référence pâtisserie nantaise, plusieurs boutiques (Relais Desserts). Angle : vanille Bourbon Grade A + cacao tracé EUDR.',
  source = coalesce(source, '') || ' | contact:pagesjaunes'
where name = 'Pâtisseries haut de gamme Nantes — cible 4' and phone is null;

update prospects set
  name = 'IMA (Julien Lemarié)',
  phone = '02 23 47 82 74',
  city = 'Rennes (20 bd de la Tour d''Auvergne)',
  notes = coalesce(notes, '') || ' 1 étoile Michelin + étoile verte (gastronomie durable) — l''étoile verte = notre angle exact.',
  source = coalesce(source, '') || ' | contact:eau-a-la-bouche'
where name = 'Restaurants Rennes — cible 5' and phone is null;

update prospects set
  name = 'Le Favre d''Anne',
  phone = '02 41 36 12 12',
  website = 'https://lefavredanne.fr',
  city = 'Angers (18 quai des Carmes)',
  notes = coalesce(notes, '') || ' Table gastronomique angevine réputée.',
  source = coalesce(source, '') || ' | contact:lacarte.menu'
where name = 'Restaurants Angers — cible 6' and phone is null;

update prospects set
  name = 'CK Traiteur (ISO 20121)',
  phone = '02 40 08 24 62',
  email = 'contact@cktraiteur.com',
  website = 'https://cktraiteur.com',
  city = 'Vigneux-de-Bretagne (agglo Nantes)',
  notes = coalesce(notes, '') || ' Traiteur événementiel certifié ISO 20121 (événementiel responsable) — la certification est leur langage.',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Traiteur événementiel engagé — cible 7' and phone is null;

update prospects set
  name = 'SAIN — Café Cantine Épicerie',
  phone = '02 40 72 82 48',
  email = 'contact@sain-nantes.com',
  website = 'https://sain-nantes.com',
  city = 'Nantes',
  notes = coalesce(notes, '') || ' Café-cantine-épicerie : triple débouché (brunch + revente épicerie).',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Salon de thé/brunch — cible 8' and phone is null;

-- ===================== ÉPICERIES EN LIGNE (phase 1)

update prospects set
  name = 'La Fourche (lafourche.fr)',
  email = 'contact@lafourche.fr',
  website = 'https://lafourche.fr',
  city = 'Mitry-Mory (77)',
  notes = coalesce(notes, '') || ' Leader FR de l''épicerie bio en ligne par abonnement. Entrée : e-mail générique puis LinkedIn équipe achats.',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Épicerie en ligne bio — cible 1' and email is null;

update prospects set
  name = 'Kazidomi',
  phone = '+33 7 57 91 87 48',
  website = 'https://www.kazidomi.com',
  city = 'Bruxelles (livre 19 pays UE)',
  notes = coalesce(notes, '') || ' E-commerce bio par abonnement, fondatrice Emna Everard. Numéro FR public (service client) — demander le category manager épicerie.',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Épicerie en ligne bio — cible 2' and phone is null;

update prospects set
  name = 'Greenweez (groupe Carrefour)',
  phone = '+33 4 86 13 91 10',
  website = 'https://www.greenweez.com',
  city = 'Saint-Jorioz (74)',
  notes = coalesce(notes, '') || ' N°1 FR du bio en ligne. Gros volume = phase 2-3 plutôt : préparer un dossier référencement.',
  source = coalesce(source, '') || ' | contact:fiche-editeur'
where name = 'Épicerie en ligne bio — cible 3' and phone is null;

update prospects set
  name = 'Aurore Market',
  website = 'https://auroremarket.fr',
  city = 'Aveyron (12)',
  notes = coalesce(notes, '') || ' Épicerie bio en ligne par abonnement (entrepôt Aveyron). Contact via formulaire site — coordonnées directes à qualifier.',
  source = coalesce(source, '') || ' | contact:presse-dna'
where name = 'Épicerie en ligne bio — cible 4' and website is null;

-- ===================== GROSSISTES (phase 2, contacts prêts)

update prospects set
  phone = '04 90 67 23 72',
  email = 'contact84@relais-vert.com',
  website = 'https://www.relais-vert.com',
  city = 'Carpentras (ZA Bellecour 3)',
  notes = coalesce(notes, '') || ' Grossiste bio historique (1986), 400 collaborateurs, 4 plateformes (Carpentras, Bordeaux, Montpellier, Rungis).',
  source = coalesce(source, '') || ' | contact:annuairevert/organic-bio'
where name = 'Relais Vert' and phone is null;

update prospects set
  phone = '03 26 87 86 86',
  website = 'https://www.vitafrais.fr',
  notes = coalesce(notes, '') || ' Groupe Organic Alliance (ProNatura & Vitafrais). Distributeur-importateur bio frais + ambiant.',
  source = coalesce(source, '') || ' | contact:annuairevert'
where name = 'Vitafrais' and phone is null;

-- ===================== PRODUCTEURS (filières)

update prospects set
  name = 'Coopérative Marjana (argane, Essaouira)',
  email = 'coopmarjana@gmail.com',
  phone = '+212 669 063 627',
  city = 'Ounara, Essaouira (douar Aït Sraidi)',
  notes = coalesce(notes, '') || ' Coopérative 100 % féminine fondée en 2005 (programme national femme rurale). Alimentaire + cosmétique. 2e e-mail public : marjanacoop@gmail.com.',
  source = coalesce(source, '') || ' | contact:marocannuaire/mackoo'
where name = 'Coopérative féminine argane — cible 2' and email is null;

update prospects set
  name = 'Biovanilla (Sambava, SAVA)',
  email = 'contact@biovanilla.fr',
  phone = '+261 32 04 027 72',
  website = 'https://www.biovanilla.fr',
  city = 'Sambava Centre (r. de Commerce)',
  notes = coalesce(notes, '') || ' Acteur vanille bio/durable basé à Sambava, site FR = interlocuteur francophone direct.',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Groupements vanille SAVA — cible 2' and email is null;

update prospects set
  name = 'Kuapa Kokoo Farmers Union (Ghana)',
  email = 'kkfu@kuapkokoo.com',
  phone = '+233 59 414 4739',
  website = 'https://kuapakokoo.com',
  city = 'Kumasi (Asokwa, J.O. Amoo Goltfried Rd)',
  notes = coalesce(notes, '') || ' LA référence cacao équitable Ghana : union détenue par les fermiers, Fairtrade depuis 1995 (co-fondatrice de Divine Chocolate). Hotline : +233 32 220 810 10.',
  source = coalesce(source, '') || ' | contact:site-officiel'
where name = 'Coopératives cacao Ghana certifiées FT (vague 3-4)' and email is null;
