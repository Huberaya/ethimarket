-- Qualification contacts, vague 4 — clôture de la phase 1 (sept. 2026).
-- Sources notées. Aucune donnée inventée. Rejouable.

update prospects set
  phone = '05 32 13 03 00',
  email = 'aide@auroremarket.fr',
  city = 'Bozouls (12, ZA Les Calsades)',
  notes = coalesce(notes, '') || ' Contact PRO documenté publiquement : camille@sunrise.team (CSE/entreprises/épiceries). Standard : 09 74 59 39 81.',
  source = coalesce(source, '') || ' | contact:site-officiel/service-client.org'
where name = 'Aurore Market' and phone is null;

update prospects set
  name = 'Omie (épicerie engagée en ligne)',
  email = 'hello@omie.fr',
  website = 'https://omie.fr',
  city = 'Paris',
  notes = coalesce(notes, '') || ' Marque d''épicerie bio « agriculture régénérative », 150 producteurs rémunérés au juste prix — alignement valeurs fort, interlocuteur sourcing direct.',
  source = coalesce(source, '') || ' | contact:facebook-officiel/challenges.fr'
where name = 'Épicerie en ligne bio — cible 5' and email is null;
