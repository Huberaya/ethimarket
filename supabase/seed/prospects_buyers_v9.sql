-- Densification acheteurs vague 9 (sept. 2026) : chocolatiers/pâtissiers
-- artisanaux d'Angers (49) — acheteurs cacao/vanille. Sources annuaires.
-- Rejouable.

INSERT INTO prospects (kind, phase, segment, name, city, country, email, phone, website, source, notes)
SELECT * FROM (VALUES

('buyer', 1, 'chocolatier', 'La Petite Marquise (Quernon d''Ardoise)', 'Angers (22 r. des Lices + Grand Launay)', 'France',
 NULL, '02 41 88 83 49', 'https://www.quernon.com', 'seed:v9 | contact:pagesjaunes',
 'Maison angevine emblématique (1966), créatrice du Quernon d''Ardoise® — chocolat + nougatine. Vrai transformateur artisanal : angle cacao tracé + vanille. 2e n° : 02 41 36 03 53.'),
('buyer', 1, 'chocolatier', 'Benoit Chocolats', 'Angers (1 r. des Lices)', 'France',
 NULL, NULL, NULL, 'seed:v9 | contact:pagesjaunes-fiche',
 'Chocolatier artisanal angevin centre-ville.'),
('buyer', 1, 'chocolatier', 'Chocolaterie Levesque', 'Angers (55 r. Beaurepaire)', 'France',
 NULL, NULL, NULL, 'seed:v9 | contact:pagesjaunes-fiche',
 'Chocolaterie de la Doutre.'),
('buyer', 1, 'transformateur', 'Laurent Petit (pâtissier-chocolatier)', 'Angers (4 r. St-Aubin)', 'France',
 NULL, NULL, NULL, 'seed:v9 | contact:pagesjaunes-fiche', NULL),
('buyer', 1, 'transformateur', 'Colette Pâtisseries', 'Angers (r. La Fayette)', 'France',
 NULL, NULL, NULL, 'seed:v9 | contact:pagesjaunes-fiche', 'Pâtisserie créative angevine.')

) AS v(kind, phase, segment, name, city, country, email, phone, website, source, notes)
WHERE NOT EXISTS (SELECT 1 FROM prospects p WHERE p.name = v.name);
