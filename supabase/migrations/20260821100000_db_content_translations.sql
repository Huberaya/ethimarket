-- =============================================================
-- Traduction des contenus en base (produits, articles,
-- catégories, producteurs) — 4 langues : en, es, pt, ar.
--
-- Architecture : une colonne JSONB `translations` par table,
-- structure { "en": { "champ": "texte" }, "es": {...}, ... }.
-- Le français reste la langue source dans les colonnes
-- d'origine (name, description, title…) — fallback naturel.
-- Zéro rupture : aucune colonne existante modifiée.
-- =============================================================

ALTER TABLE products   ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE articles   ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE producers  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN products.translations IS
  'Traductions { locale: { name, description, short_description } } — fr = colonnes sources';
COMMENT ON COLUMN articles.translations IS
  'Traductions { locale: { title, excerpt, category, content } } — fr = colonnes sources';
COMMENT ON COLUMN categories.translations IS
  'Traductions { locale: { name } } — fr = colonne source';
COMMENT ON COLUMN producers.translations IS
  'Traductions { locale: { description } } — fr = colonne source';
