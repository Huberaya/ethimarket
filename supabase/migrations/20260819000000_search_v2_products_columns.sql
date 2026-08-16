-- =============================================================
-- EthiMarket Search V2 — Alignement du schéma products
-- Ajoute les colonnes requises par la RPC search_products_v2
-- (17 facettes) qui n'existaient pas encore en production, ainsi
-- que le vecteur de recherche plein-texte et ses index.
-- 100% PostgreSQL natif — aucune dépendance externe ni service payant.
-- =============================================================

-- 1. Colonnes facettes manquantes ------------------------------
ALTER TABLE products ADD COLUMN IF NOT EXISTS manufacturing_country text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS raw_materials_origin text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS target_gender text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_tags text[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS keywords text[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS attributes jsonb DEFAULT '{}'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS carbon_footprint_kg numeric;
ALTER TABLE products ADD COLUMN IF NOT EXISTS water_footprint_liters numeric;
ALTER TABLE products ADD COLUMN IF NOT EXISTS living_wage_guaranteed boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_cooperative boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_vegan boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_recycled boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS recycled_percentage numeric
  CHECK (recycled_percentage IS NULL OR (recycled_percentage >= 0 AND recycled_percentage <= 100));
ALTER TABLE products ADD COLUMN IF NOT EXISTS confidence_score integer
  CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 100));
ALTER TABLE products ADD COLUMN IF NOT EXISTS packaging_types text[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS fair_trade boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS social_audit_passed boolean DEFAULT false;

-- delivery_days existe en text ; la RPC le renvoie tel quel (pas de cast destructif).

-- 2. Vecteur de recherche plein-texte (français + unaccent) ----
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Configuration immutable-safe : wrapper unaccent pour index
CREATE OR REPLACE FUNCTION immutable_unaccent(text)
RETURNS text LANGUAGE sql IMMUTABLE PARALLEL SAFE AS
$$ SELECT public.unaccent('public.unaccent', $1) $$;

ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION products_search_vector_update()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('french', immutable_unaccent(coalesce(NEW.name, ''))), 'A') ||
    setweight(to_tsvector('french', immutable_unaccent(coalesce(NEW.product_type, ''))), 'A') ||
    setweight(to_tsvector('french', immutable_unaccent(coalesce(NEW.short_description, ''))), 'B') ||
    setweight(to_tsvector('french', immutable_unaccent(coalesce(NEW.description, ''))), 'C') ||
    setweight(to_tsvector('french', immutable_unaccent(coalesce(array_to_string(NEW.keywords, ' '), ''))), 'B') ||
    setweight(to_tsvector('french', immutable_unaccent(coalesce(array_to_string(NEW.category_tags, ' '), ''))), 'B');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_products_search_vector ON products;
CREATE TRIGGER trg_products_search_vector
  BEFORE INSERT OR UPDATE OF name, product_type, short_description, description, keywords, category_tags
  ON products
  FOR EACH ROW EXECUTE FUNCTION products_search_vector_update();

-- Remplissage initial pour les lignes existantes
UPDATE products SET search_vector =
  setweight(to_tsvector('french', immutable_unaccent(coalesce(name, ''))), 'A') ||
  setweight(to_tsvector('french', immutable_unaccent(coalesce(product_type, ''))), 'A') ||
  setweight(to_tsvector('french', immutable_unaccent(coalesce(short_description, ''))), 'B') ||
  setweight(to_tsvector('french', immutable_unaccent(coalesce(description, ''))), 'C') ||
  setweight(to_tsvector('french', immutable_unaccent(coalesce(array_to_string(keywords, ' '), ''))), 'B') ||
  setweight(to_tsvector('french', immutable_unaccent(coalesce(array_to_string(category_tags, ' '), ''))), 'B')
WHERE search_vector IS NULL;

-- 3. Index ------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_search_vector ON products USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_certifications_gin ON products USING GIN (certifications);
CREATE INDEX IF NOT EXISTS idx_products_category_tags_gin ON products USING GIN (category_tags);
CREATE INDEX IF NOT EXISTS idx_products_keywords_gin ON products USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);
CREATE INDEX IF NOT EXISTS idx_products_moq ON products (moq_value);
CREATE INDEX IF NOT EXISTS idx_products_carbon ON products (carbon_footprint_kg);
CREATE INDEX IF NOT EXISTS idx_products_confidence ON products (confidence_score);
CREATE INDEX IF NOT EXISTS idx_products_manufacturing_country ON products (manufacturing_country);
CREATE INDEX IF NOT EXISTS idx_producers_geo ON producers (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
