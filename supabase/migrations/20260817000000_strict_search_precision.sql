-- Migration: 20260817000000_strict_search_precision.sql
-- Description: High-precision PostgreSQL Full-Text & Trigram search with strict hierarchical scoring

-- 1. Ensure required native PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- 2. Enhanced search_vector generation trigger with strict weights:
-- Weight A (Maximum Priority): Product name, Product type
-- Weight B (High Priority): Category name, Producer company name
-- Weight C (Medium Priority): Short description, Keywords, Tags, Country
-- Weight D (Low Priority): Full description, Technical attributes
CREATE OR REPLACE FUNCTION generate_product_search_vector_v2()
RETURNS trigger AS $$
DECLARE
  v_producer_name text := '';
  v_category_name text := '';
  v_tags_text text := '';
  v_cert_text text := '';
BEGIN
  -- Extract producer company name if available
  IF NEW.producer_id IS NOT NULL THEN
    SELECT COALESCE(name, '') INTO v_producer_name 
    FROM producers 
    WHERE id = NEW.producer_id 
    LIMIT 1;
  END IF;

  -- Extract category name if available
  IF NEW.category_id IS NOT NULL THEN
    SELECT COALESCE(name, '') INTO v_category_name 
    FROM categories 
    WHERE id = NEW.category_id 
    LIMIT 1;
  END IF;

  IF NEW.category_tags IS NOT NULL THEN
    v_tags_text := array_to_string(NEW.category_tags, ' ');
  END IF;

  IF NEW.certifications IS NOT NULL THEN
    v_cert_text := array_to_string(NEW.certifications, ' ');
  END IF;

  NEW.search_vector := 
    setweight(to_tsvector('french', unaccent(coalesce(NEW.name, '') || ' ' || coalesce(NEW.product_type, ''))), 'A') ||
    setweight(to_tsvector('french', unaccent(coalesce(v_category_name, '') || ' ' || coalesce(v_producer_name, ''))), 'B') ||
    setweight(to_tsvector('french', unaccent(coalesce(NEW.short_description, '') || ' ' || coalesce(NEW.country, '') || ' ' || coalesce(NEW.manufacturing_country, '') || ' ' || v_tags_text || ' ' || v_cert_text)), 'C') ||
    setweight(to_tsvector('french', unaccent(coalesce(NEW.description, '') || ' ' || coalesce(NEW.attributes::text, ''))), 'D');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_search_vector ON products;
DROP TRIGGER IF EXISTS trg_products_search_vector_v2 ON products;

CREATE TRIGGER trg_products_search_vector_v2
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION generate_product_search_vector_v2();

-- 3. Dedicated High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_search_vector_gin ON products USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm_gin ON products USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_category_trgm_gin ON products USING GIN(product_type gin_trgm_ops);

-- 4. High-Precision Search Procedure with Strict Priority Ranking:
-- Priority 1 (1000 pts): Exact name match
-- Priority 2 (500 pts): Name starts with search query
-- Priority 3 (100 pts): Query exists as word/substring in name
-- Priority 4 (50 pts): Query matches category
-- Priority 5 (10 pts): Query matches description or attributes
CREATE OR REPLACE FUNCTION search_products_advanced(
  p_query text DEFAULT NULL,
  p_category_id uuid DEFAULT NULL,
  p_product_types text[] DEFAULT NULL,
  p_materials text[] DEFAULT NULL,
  p_certifications text[] DEFAULT NULL,
  p_countries text[] DEFAULT NULL,
  p_regions text[] DEFAULT NULL,
  p_gender text DEFAULT NULL,
  p_min_price numeric DEFAULT NULL,
  p_max_price numeric DEFAULT NULL,
  p_max_co2 numeric DEFAULT NULL,
  p_is_vegan boolean DEFAULT NULL,
  p_is_recycled boolean DEFAULT NULL,
  p_living_wage boolean DEFAULT NULL,
  p_is_cooperative boolean DEFAULT NULL,
  p_packaging_types text[] DEFAULT NULL,
  p_min_confidence integer DEFAULT NULL,
  p_min_rating numeric DEFAULT NULL,
  p_in_stock_only boolean DEFAULT false,
  p_sort_by text DEFAULT 'relevance',
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  description text,
  short_description text,
  emoji text,
  image_url text,
  price numeric,
  price_unit text,
  currency text,
  moq_value integer,
  moq_unit text,
  stock_value integer,
  delivery_days text,
  rating numeric,
  review_count integer,
  product_score integer,
  confidence_score integer,
  country text,
  country_flag text,
  region text,
  manufacturing_country text,
  raw_materials_origin text,
  product_type text,
  target_gender text,
  certifications text[],
  category_tags text[],
  attributes jsonb,
  carbon_footprint_kg numeric,
  water_footprint_liters numeric,
  living_wage_guaranteed boolean,
  is_cooperative boolean,
  is_vegan boolean,
  is_recycled boolean,
  producer_id uuid,
  category_id uuid,
  similarity_score real,
  relevance_rank real
) AS $$
DECLARE
  v_tsquery tsquery;
  v_clean_query text;
  v_unaccent_query text;
BEGIN
  IF p_query IS NOT NULL AND trim(p_query) <> '' THEN
    v_clean_query := lower(trim(p_query));
    v_unaccent_query := unaccent(v_clean_query);
    
    BEGIN
      -- Format tsquery for prefix and phrase matching: term1:* & term2:*
      v_tsquery := to_tsquery('french', regexp_replace(v_unaccent_query, '\s+', ':* & ', 'g') || ':*');
    EXCEPTION WHEN OTHERS THEN
      v_tsquery := plainto_tsquery('french', v_unaccent_query);
    END;
  END IF;

  RETURN QUERY
  WITH scored_products AS (
    SELECT 
      p.*,
      CASE 
        WHEN v_clean_query IS NOT NULL THEN similarity(lower(unaccent(p.name)), v_unaccent_query)
        ELSE 0.0::real
      END AS calc_similarity,
      CASE 
        WHEN v_tsquery IS NOT NULL THEN ts_rank_cd(p.search_vector, v_tsquery)
        ELSE 0.0::real
      END AS calc_rank,
      CASE
        -- Priority 1: Exact match on name
        WHEN v_clean_query IS NOT NULL AND lower(unaccent(p.name)) = v_unaccent_query THEN 1000.0
        -- Priority 2: Starts with query
        WHEN v_clean_query IS NOT NULL AND lower(unaccent(p.name)) LIKE (v_unaccent_query || '%') THEN 500.0
        -- Priority 3: Contains query in name
        WHEN v_clean_query IS NOT NULL AND lower(unaccent(p.name)) LIKE ('%' || v_unaccent_query || '%') THEN 100.0
        -- Priority 4: Matches category or product type
        WHEN v_clean_query IS NOT NULL AND (lower(unaccent(coalesce(p.product_type, ''))) LIKE ('%' || v_unaccent_query || '%')) THEN 50.0
        -- Priority 5: Full-Text search rank or high trigram similarity (>= 0.35)
        WHEN v_tsquery IS NOT NULL AND p.search_vector @@ v_tsquery THEN 25.0 + (ts_rank_cd(p.search_vector, v_tsquery) * 10.0)
        WHEN v_clean_query IS NOT NULL AND similarity(lower(unaccent(p.name)), v_unaccent_query) >= 0.35 THEN (similarity(lower(unaccent(p.name)), v_unaccent_query) * 40.0)
        ELSE 0.0
      END AS priority_score
    FROM products p
    WHERE (p.status = 'published' OR p.status IS NULL)
      -- Strict text match condition: only keep items with positive priority score when query is specified
      AND (
        v_clean_query IS NULL 
        OR lower(unaccent(p.name)) LIKE ('%' || v_unaccent_query || '%')
        OR (v_tsquery IS NOT NULL AND p.search_vector @@ v_tsquery)
        OR similarity(lower(unaccent(p.name)), v_unaccent_query) >= 0.35
      )
      AND (p_category_id IS NULL OR p.category_id = p_category_id)
      AND (p_product_types IS NULL OR p.product_type = ANY(p_product_types) OR p.name ILIKE ANY(SELECT '%' || x || '%' FROM unnest(p_product_types) x))
      AND (p_certifications IS NULL OR p.certifications && p_certifications)
      AND (p_countries IS NULL OR p.country = ANY(p_countries) OR p.manufacturing_country = ANY(p_countries))
      AND (p_gender IS NULL OR p.target_gender = p_gender OR p.target_gender = 'unisex')
      AND (p_min_price IS NULL OR p.price >= p_min_price)
      AND (p_max_price IS NULL OR p.price <= p_max_price)
      AND (p_max_co2 IS NULL OR p.carbon_footprint_kg <= p_max_co2)
      AND (p_is_vegan IS NULL OR p.is_vegan = p_is_vegan)
      AND (p_is_recycled IS NULL OR p.is_recycled = p_is_recycled)
      AND (p_living_wage IS NULL OR p.living_wage_guaranteed = p_living_wage)
      AND (p_is_cooperative IS NULL OR p.is_cooperative = p_is_cooperative)
      AND (p_min_confidence IS NULL OR p.confidence_score >= p_min_confidence)
      AND (p_min_rating IS NULL OR p.rating >= p_min_rating)
      AND (NOT p_in_stock_only OR p.stock_value > 0)
  )
  SELECT 
    sp.id,
    sp.name,
    sp.slug,
    sp.description,
    sp.short_description,
    sp.emoji,
    sp.image_url,
    sp.price,
    sp.price_unit,
    sp.currency,
    sp.moq_value,
    sp.moq_unit,
    sp.stock_value,
    sp.delivery_days,
    sp.rating,
    sp.review_count,
    sp.product_score,
    sp.confidence_score,
    sp.country,
    sp.country_flag,
    sp.region,
    sp.manufacturing_country,
    sp.raw_materials_origin,
    sp.product_type,
    sp.target_gender,
    sp.certifications,
    sp.category_tags,
    sp.attributes,
    sp.carbon_footprint_kg,
    sp.water_footprint_liters,
    sp.living_wage_guaranteed,
    sp.is_cooperative,
    sp.is_vegan,
    sp.is_recycled,
    sp.producer_id,
    sp.category_id,
    sp.calc_similarity::real AS similarity_score,
    sp.calc_rank::real AS relevance_rank
  FROM scored_products sp
  WHERE v_clean_query IS NULL OR sp.priority_score > 0
  ORDER BY 
    CASE WHEN p_sort_by = 'price_asc' THEN sp.price END ASC,
    CASE WHEN p_sort_by = 'price_desc' THEN sp.price END DESC,
    CASE WHEN p_sort_by = 'confidence' THEN sp.confidence_score END DESC,
    CASE WHEN p_sort_by = 'carbon' THEN sp.carbon_footprint_kg END ASC,
    CASE WHEN p_sort_by = 'rating' THEN sp.rating END DESC,
    CASE WHEN p_sort_by = 'newest' THEN sp.created_at END DESC,
    -- Strict relevance ordering
    sp.priority_score DESC,
    sp.calc_rank DESC,
    sp.calc_similarity DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;
