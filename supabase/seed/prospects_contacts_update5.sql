-- Qualification vague 19 (sept. 2026) : coordonnées officielles trouvées
-- pour les fiches « à qualifier » des supermarchés coopératifs. Rejouable.

UPDATE prospects SET
  city = 'Rennes (15 av. de Pologne, CC Ste-Élisabeth)',
  email = 'achats@breizhicoop.fr',
  phone = '02 23 35 01 22',
  website = 'https://www.breizhicoop.fr',
  source = 'seed:v19 | contact:site-officiel',
  notes = 'Supermarché coopératif rennais (SCA 844193847). PÉPITE : COMMISSION ACHATS dédiée avec e-mail direct (achats@breizhicoop.fr) + formulaire producteurs en ligne demandant les LABELS — circuit d''entrée fournisseur balisé. Contact général : contact@breizhicoop.fr. Tournée Rennes semaine 2.'
WHERE name = 'Breizhicoop (supermarché coopératif, Rennes)' AND email IS NULL;

UPDATE prospects SET
  city = 'Toulouse (5 r. René Leduc)',
  email = 'contact@lachouettecoop.fr',
  website = 'https://lachouettecoop.fr',
  source = 'seed:v19 | contact:site-officiel',
  notes = 'Supermarché coopératif et participatif toulousain (SCA capital variable 829870765, ouvert été 2020). Vague Sud phase 2 (avec Bacquié et Criollo). E-mail officiel vérifié.'
WHERE name = 'La Chouette Coop (supermarché coopératif, Toulouse)' AND email IS NULL;

UPDATE prospects SET
  city = 'Sainte-Hélène-sur-Isère (100 allée des Frênes)',
  phone = '04 76 40 42 34',
  source = 'seed:v19 | contact:registre/detax',
  notes = 'Enseigne bio indépendante historique du quart sud-est (~40 magasins, Holding Groupe Satoriz SAS 377505524, capital 3 M€, créée 1990). Logistique SatoDistri au siège. Tél service client vérifié — demander le service référencement/achats. Approche dossier phase 2.'
WHERE name = 'Satoriz (~40 magasins Rhône-Alpes)' AND phone IS NULL;
