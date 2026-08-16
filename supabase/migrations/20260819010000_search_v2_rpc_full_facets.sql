-- =============================================================
-- EthiMarket Search V2 — Correctif RPC : application effective des
-- 4 facettes déclarées mais non filtrées dans la version initiale
-- (commerce équitable, conditions sociales, emballage, délai).
-- Recrée search_products_v2 avec le WHERE complet des 17 facettes.
-- =============================================================

CREATE OR REPLACE FUNCTION search_products_v2(
  p_query text DEFAULT NULL,
  p_category_id uuid DEFAULT NULL,
  p_product_types text[] DEFAULT NULL,
  p_materials text[] DEFAULT NULL,
  p_certifications text[] DEFAULT NULL,
  p_countries text[] DEFAULT NULL,
  p_manufacturing_countries text[] DEFAULT NULL,
  p_raw_materials_origins text[] DEFAULT NULL,
  p_user_lat double precision DEFAULT NULL,
  p_user_lng double precision DEFAULT NULL,
  p_max_distance_km numeric DEFAULT NULL,
  p_max_co2 numeric DEFAULT NULL,
  p_social_conditions boolean DEFAULT NULL,
  p_living_wage boolean DEFAULT NULL,
  p_fair_trade boolean DEFAULT NULL,
  p_is_recycled boolean DEFAULT NULL,
  p_min_recycled_percent numeric DEFAULT NULL,
  p_is_vegan boolean DEFAULT NULL,
  p_packaging_types text[] DEFAULT NULL,
  p_max_moq integer DEFAULT NULL,
  p_min_price numeric DEFAULT NULL,
  p_max_price numeric DEFAULT NULL,
  p_max_delivery_days integer DEFAULT NULL,
  p_supplier_name text DEFAULT NULL,
  p_producer_id uuid DEFAULT NULL,
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
  recycled_percentage numeric,
  producer_id uuid,
  category_id uuid,
  calculated_distance_km numeric,
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
      v_tsquery := to_tsquery('french', regexp_replace(v_unaccent_query, '\s+', ':* & ', 'g') || ':*');
    EXCEPTION WHEN OTHERS THEN
      v_tsquery := plainto_tsquery('french', v_unaccent_query);
    END;
  END IF;

  RETURN QUERY
  WITH filtered_candidates AS (
    SELECT 
      p.*,
      pr.name as producer_name,
      pr.latitude as producer_lat,
      pr.longitude as producer_lng,
      CASE 
        WHEN p_user_lat IS NOT NULL AND p_user_lng IS NOT NULL AND pr.latitude IS NOT NULL AND pr.longitude IS NOT NULL THEN
          round((6371 * acos(least(1.0, greatest(-1.0, 
            cos(radians(p_user_lat)) * cos(radians(pr.latitude)) * cos(radians(pr.longitude) - radians(p_user_lng)) + 
            sin(radians(p_user_lat)) * sin(radians(pr.latitude))
          ))))::numeric, 1)
        ELSE NULL
      END AS computed_distance
    FROM products p
    LEFT JOIN producers pr ON p.producer_id = pr.id
    WHERE 
      (p_category_id IS NULL OR p.category_id = p_category_id)
      AND (p_producer_id IS NULL OR p.producer_id = p_producer_id)
      AND (p_min_price IS NULL OR p.price >= p_min_price)
      AND (p_max_price IS NULL OR p.price <= p_max_price)
      AND (p_max_moq IS NULL OR coalesce(p.moq_value, 1) <= p_max_moq)
      AND (p_min_confidence IS NULL OR coalesce(p.confidence_score, p.product_score, 80) >= p_min_confidence)
      AND (p_min_rating IS NULL OR coalesce(p.rating, 0) >= p_min_rating)
      AND (NOT p_in_stock_only OR coalesce(p.stock_value, 0) > 0)
      AND (p_max_co2 IS NULL OR coalesce(p.carbon_footprint_kg, 2.5) <= p_max_co2)
      AND (p_is_vegan IS NULL OR p.is_vegan = p_is_vegan OR (p.attributes->>'is_vegan')::boolean = p_is_vegan)
      AND (p_is_recycled IS NULL OR p.is_recycled = p_is_recycled OR (p.attributes->>'is_recycled')::boolean = p_is_recycled)
      AND (p_min_recycled_percent IS NULL OR coalesce(p.recycled_percentage, (p.attributes->>'recycled_percentage')::numeric, 0) >= p_min_recycled_percent)
      AND (p_living_wage IS NULL OR p.living_wage_guaranteed = p_living_wage OR (p.attributes->>'living_wage_guaranteed')::boolean = p_living_wage)
      AND (p_certifications IS NULL OR p.certifications @> p_certifications)
      AND (p_countries IS NULL OR p.country = ANY(p_countries))
      AND (p_manufacturing_countries IS NULL OR coalesce(p.manufacturing_country, p.country) = ANY(p_manufacturing_countries))
      AND (p_raw_materials_origins IS NULL OR p.raw_materials_origin = ANY(p_raw_materials_origins))
      AND (p_supplier_name IS NULL OR lower(unaccent(pr.name)) LIKE '%' || lower(unaccent(p_supplier_name)) || '%')
      AND (p_fair_trade IS NULL OR NOT p_fair_trade
           OR coalesce(p.fair_trade, false) = true
           OR (p.attributes->>'fair_trade')::boolean = true
           OR EXISTS (SELECT 1 FROM unnest(p.certifications) c
                      WHERE lower(unaccent(c)) LIKE '%equitable%' OR lower(c) LIKE '%fairtrade%' OR lower(c) LIKE '%fair trade%' OR lower(c) LIKE '%havelaar%'))
      AND (p_social_conditions IS NULL OR NOT p_social_conditions
           OR coalesce(p.social_audit_passed, false) = true
           OR (p.attributes->>'social_audit_passed')::boolean = true
           OR (p.attributes->>'no_child_labor_verified')::boolean = true)
      AND (p_packaging_types IS NULL OR p.packaging_types @> p_packaging_types
           OR (SELECT bool_and((p.attributes->'packaging'->>pt)::boolean IS TRUE)
               FROM unnest(p_packaging_types) pt))
      AND (p_max_delivery_days IS NULL
           OR (p.delivery_days ~ '^[0-9]+' AND (regexp_match(p.delivery_days, '^[0-9]+'))[1]::integer <= p_max_delivery_days))
  ),
  scored AS (
    SELECT 
      fc.*,
      CASE 
        WHEN v_clean_query IS NOT NULL THEN similarity(lower(unaccent(fc.name)), v_unaccent_query)
        ELSE 0.0
      END AS sim_score,
      (
        CASE 
          WHEN v_clean_query IS NOT NULL AND lower(unaccent(fc.name)) = v_unaccent_query THEN 1000.0
          WHEN v_clean_query IS NOT NULL AND lower(unaccent(fc.name)) LIKE v_unaccent_query || '%' THEN 500.0
          WHEN v_clean_query IS NOT NULL AND lower(unaccent(fc.name)) LIKE '%' || v_unaccent_query || '%' THEN 100.0
          WHEN v_clean_query IS NOT NULL AND lower(unaccent(coalesce(fc.product_type, ''))) LIKE '%' || v_unaccent_query || '%' THEN 50.0
          WHEN v_tsquery IS NOT NULL AND fc.search_vector @@ v_tsquery THEN ts_rank_cd(fc.search_vector, v_tsquery) * 20.0
          ELSE 10.0
        END
        + (coalesce(cardinality(fc.certifications), 0) * 10.0)
        + (CASE WHEN coalesce(fc.carbon_footprint_kg, 2.5) <= 1.5 THEN 20.0 ELSE 0.0 END)
        + (CASE WHEN fc.living_wage_guaranteed THEN 15.0 ELSE 0.0 END)
        + (CASE WHEN fc.trace_qr_code IS NOT NULL THEN 15.0 ELSE 0.0 END)
      )::real AS calculated_rank
    FROM filtered_candidates fc
    WHERE (p_max_distance_km IS NULL OR fc.computed_distance IS NULL OR fc.computed_distance <= p_max_distance_km)
  )
  SELECT 
    s.id,
    s.name,
    s.slug,
    s.description,
    s.short_description,
    s.emoji,
    s.image_url,
    s.price,
    s.price_unit,
    s.currency,
    s.moq_value,
    s.moq_unit,
    s.stock_value,
    s.delivery_days,
    s.rating,
    s.review_count,
    s.product_score,
    s.confidence_score,
    s.country,
    s.country_flag,
    s.region,
    s.manufacturing_country,
    s.raw_materials_origin,
    s.product_type,
    s.target_gender,
    s.certifications,
    s.category_tags,
    s.attributes,
    s.carbon_footprint_kg,
    s.water_footprint_liters,
    s.living_wage_guaranteed,
    s.is_cooperative,
    s.is_vegan,
    s.is_recycled,
    s.recycled_percentage,
    s.producer_id,
    s.category_id,
    s.computed_distance AS calculated_distance_km,
    s.sim_score::real AS similarity_score,
    s.calculated_rank AS relevance_rank
  FROM scored s
  ORDER BY 
    CASE WHEN p_sort_by = 'price_asc' THEN s.price END ASC,
    CASE WHEN p_sort_by = 'price_desc' THEN s.price END DESC,
    CASE WHEN p_sort_by = 'carbon' THEN coalesce(s.carbon_footprint_kg, 99) END ASC,
    CASE WHEN p_sort_by = 'confidence' THEN coalesce(s.confidence_score, s.product_score, 0) END DESC,
    CASE WHEN p_sort_by = 'distance' THEN coalesce(s.computed_distance, 99999) END ASC,
    CASE WHEN p_sort_by = 'rating' THEN coalesce(s.rating, 0) END DESC,
    s.calculated_rank DESC,
    s.sim_score DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;
