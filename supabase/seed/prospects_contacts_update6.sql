-- Qualification vague 20 (sept. 2026) : Otsokop et GRAP complétés
-- avec les coordonnées officielles vérifiées sur leurs sites. Rejouable.

UPDATE prospects SET
  city = 'Bayonne (haut de la r. Maubec)',
  source = 'seed:v20 | contact:site-officiel',
  notes = 'Supermarché coopératif et participatif de BAYONNE (pas Anglet — le magasin est en haut de la rue Maubec) : SCIC agréée ESUS, but non lucratif, 630 coopérateurs, 1700+ références, 250 m². Projet de relocalisation place des Gascons (~2028, réaménagement en cours). Coopérateurs sensibles au « juste prix producteurs » (témoignages du site). Formulaire contact sur otsokop.org. Vague Sud-Ouest phase 2, couplable Supercoop Bordeaux.'
WHERE name = 'Otsokop (coopératif, Pays Basque)' AND email IS NULL AND phone IS NULL;

UPDATE prospects SET
  city = 'Lyon 1er (3 Grande r. des Feuillants)',
  email = 'contact@grap.coop',
  source = 'seed:v20 | contact:site-officiel',
  notes = 'MULTIPLICATEUR : SCIC fédérant des dizaines d''activités alimentaires bio/locales en Rhône-Alpes (dont Demain Supermarché) — mutualise LOGISTIQUE et APPROVISIONNEMENTS entre membres. Réunions d''information mensuelles OUVERTES AUX ACTEURS ÉCONOMIQUES (prochaines : 15 oct., 19 nov., 17 déc. 2026, visio possible — s''inscrire par mail 2 jours avant) : porte d''entrée gratuite et balisée vers tout le réseau AURA. Antenne Valence (Technosite, 26 r. B. de Laffemas).'
WHERE name = 'GRAP — Groupement Régional Alimentaire de Proximité' AND email IS NULL;
