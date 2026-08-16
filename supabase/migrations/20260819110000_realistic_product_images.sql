-- =============================================================
-- Images réalistes correspondant aux produits (servies depuis
-- /public/images du site — plus de photos Unsplash hors-sujet
-- type "soupe" sur une fiche de thé).
-- =============================================================
UPDATE products SET image_url = '/images/products/the-vert-sencha.jpg'            WHERE slug = 'the-vert-sencha';
UPDATE products SET image_url = '/images/products/cafe-ethiopien-yirgacheffe.jpg' WHERE slug = 'cafe-ethiopien-yirgacheffe';
UPDATE products SET image_url = '/images/products/cacao-brut.jpg'                 WHERE slug = 'cacao-brut';
UPDATE products SET image_url = '/images/products/huile-argan-bio.jpg'            WHERE slug = 'huile-argan-bio';
UPDATE products SET image_url = '/images/products/huile-coco-bio.jpg'             WHERE slug = 'huile-coco-bio';
UPDATE products SET image_url = '/images/products/quinoa-bio.jpg'                 WHERE slug = 'quinoa-bio';
UPDATE products SET image_url = '/images/products/safran-premium.jpg'             WHERE slug = 'safran-premium';
UPDATE products SET image_url = '/images/products/curcuma-moulu.jpg'              WHERE slug = 'curcuma-moulu';
UPDATE products SET image_url = '/images/products/miel-thym.jpg'                  WHERE slug = 'miel-thym';
UPDATE products SET image_url = '/images/products/sirop-agave.jpg'                WHERE slug = 'sirop-agave';
UPDATE products SET image_url = '/images/products/spiruline-bio.jpg'              WHERE slug = 'spiruline-bio';
UPDATE products SET image_url = '/images/products/vanille-bourbon.jpg'            WHERE slug = 'vanille-bourbon';
UPDATE products SET image_url = '/images/products/sesame.jpg'                     WHERE slug = 'ssame-7092';

-- Catégories : remplacer les visuels hors-sujet, garder ceux qui collent
UPDATE categories SET image_url = '/images/products/cafe-ethiopien-yirgacheffe.jpg' WHERE slug = 'cafe-the-cacao';
UPDATE categories SET image_url = '/images/products/quinoa-bio.jpg'                 WHERE slug = 'cereales-graines';
UPDATE categories SET image_url = '/images/categories/cosmetiques.jpg'              WHERE slug = 'cosmetiques';
UPDATE categories SET image_url = '/images/products/curcuma-moulu.jpg'              WHERE slug = 'epices-herbes';
UPDATE categories SET image_url = '/images/categories/fruits-legumes.jpg'           WHERE slug = 'fruits-legumes';
UPDATE categories SET image_url = '/images/products/huile-argan-bio.jpg'            WHERE slug = 'huiles-graisses';
UPDATE categories SET image_url = '/images/products/miel-thym.jpg'                  WHERE slug = 'miel-sucres';
UPDATE categories SET image_url = '/images/categories/textile.jpg'                  WHERE slug = 'textile';
