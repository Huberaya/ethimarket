-- Densification acheteurs vague 17 (sept. 2026) : Allemagne + Suisse RÉELLES (phase 3).
-- Remplace les slots génériques « vague » par des cibles nommées avec contacts vérifiés.
-- Cible prioritaire : Quijote (Hambourg) — n'achète QUE du café de coopératives en
-- import direct = notre profil de client parfait.
-- Sources : sites officiels, annuaires pro DE/CH. Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

-- ============================================================ ALLEMAGNE (phase 3)
('buyer', 3, 'torrefacteur', 'Quijote Kaffee (Hambourg)', 'Hambourg (Marckmannstraße 30)', 'Allemagne',
 'info@quijote-kaffee.de', '+49 40 380 732 30', 'https://www.quijote-kaffee.de', 'seed:v17 | contact:site-officiel',
 'CIBLE N°1 DE : « la seule torréfaction d''Allemagne qui ne torréfie QUE des cafés de coopératives importés en DIRECT » (auto-description) + école de café. Post-checkout transparent, pas de labels marketing — culture radicalement alignée avec notre modèle. Approche en anglais/allemand.'),
('buyer', 3, 'torrefacteur', 'THE BARN Coffee Roasters (Berlin)', 'Berlin (Wattstraße 10-13)', 'Allemagne',
 'webshop@thebarn.de', '+49 30 55 27 82 29', 'https://thebarn.de', 'seed:v17 | contact:site-officiel',
 'Un des torréfacteurs de spécialité LEADERS en Europe (auto-positionnement), sourcing single-farm tracé. Gros volumes, exigence qualité maximale : viser micro-lots Yirgacheffe scorés. E-mail service client vérifié — demander le contact green buying.'),
('buyer', 3, 'torrefacteur', 'Bonanza Coffee Roasters (Berlin)', 'Berlin (Adalbertstraße 70, Kreuzberg)', 'Allemagne',
 NULL, '+49 30 208 488 020', 'https://bonanzacoffee.de', 'seed:v17 | contact:site-officiel',
 'Pionnier de la 3e vague berlinoise (2006), torréfaction Oderberger Str. 35 (Prenzlauer Berg) + e-shop. Référence de scène — un référencement crédibilise auprès de tous les indépendants DE.'),

-- ============================================================ SUISSE ROMANDE (phase 3)
('buyer', 3, 'torrefacteur', 'Chronic. / Bean2me SA (Genève)', 'Chêne-Bourg (ch. de la Mousse 50B)', 'Suisse',
 'hello@chronic.ch', '+41 22 900 05 20', 'https://chronic.ch', 'seed:v17 | contact:site-officiel',
 'Torréfacteur genevois 100% BIO + FAIRTRADE depuis 2017, certifié B CORP, membre 1% for the Planet, ~10 salariés, boutique r. Argand 2 (Genève) + livraison Europe entière. Alignement valeurs total — notre interlocuteur romand naturel.'),
('buyer', 3, 'torrefacteur', 'Torpedo — L''Art du Café (Fribourg)', 'La Verrerie (14 pl. Jean Tinguely)', 'Suisse',
 'info@torpedocoffee.org', '+41 26 918 50 01', 'https://www.torpedocoffee.org', 'seed:v17 | contact:site-officiel',
 'Brûlerie artisanale bio/éthique en petits lots (30 min de Lausanne/Fribourg/Vevey), filières certifiées bio traçées « de la récolte à la tasse » + formations pro + CONSEIL AUX TORRÉFACTEURS (sélection cafés verts) : peut prescrire nos producteurs à ses clients torréfacteurs = multiplicateur.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);

-- ============================================================ NETTOYAGE SLOTS GÉNÉRIQUES
DELETE FROM prospects
WHERE name IN (
  'Torréfacteurs spécialité Berlin/Munich/Hambourg (vague)',
  'Bioläden indépendants Berlin/Munich (vague)',
  'Allemagne : indépendants + denn''s (vague)',
  'Épiceries fines Genève/Lausanne (vague)'
)
  AND status = 'a_contacter'
  AND NOT EXISTS (SELECT 1 FROM prospect_touches t WHERE t.prospect_id = prospects.id);
