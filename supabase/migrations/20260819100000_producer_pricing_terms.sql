-- =============================================================
-- Conditions commerciales SAISIES par le producteur :
-- paliers de remise volume, remise max consentie, seuil de devis.
-- La fiche produit dérive tout de ces champs (pricingEngine.ts).
-- =============================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS volume_tiers JSONB DEFAULT NULL;
  -- ex: [{"min_qty":100,"discount_pct":11},{"min_qty":500,"discount_pct":21}]
ALTER TABLE products ADD COLUMN IF NOT EXISTS max_volume_discount_pct NUMERIC
  CHECK (max_volume_discount_pct IS NULL OR (max_volume_discount_pct >= 0 AND max_volume_discount_pct <= 60));
ALTER TABLE products ADD COLUMN IF NOT EXISTS quote_threshold_qty INTEGER
  CHECK (quote_threshold_qty IS NULL OR quote_threshold_qty > 0);

-- Seed réaliste : paliers producteurs pour les produits existants,
-- dérivés de leur MOQ réel (idempotent, ne touche pas ce qui est saisi).
UPDATE products SET
  volume_tiers = CASE slug
    WHEN 'the-vert-sencha' THEN '[{"min_qty":100,"discount_pct":11},{"min_qty":500,"discount_pct":21}]'::jsonb
    WHEN 'cafe-ethiopien-yirgacheffe' THEN '[{"min_qty":50,"discount_pct":8},{"min_qty":200,"discount_pct":15}]'::jsonb
    WHEN 'huile-argan-bio' THEN '[{"min_qty":100,"discount_pct":10},{"min_qty":500,"discount_pct":18}]'::jsonb
    WHEN 'cacao-brut' THEN '[{"min_qty":100,"discount_pct":9},{"min_qty":500,"discount_pct":17}]'::jsonb
    WHEN 'quinoa-bio' THEN '[{"min_qty":125,"discount_pct":10},{"min_qty":600,"discount_pct":18}]'::jsonb
    WHEN 'vanille-bourbon' THEN '[{"min_qty":2500,"discount_pct":12},{"min_qty":10000,"discount_pct":20}]'::jsonb
    WHEN 'safran-premium' THEN '[{"min_qty":500,"discount_pct":8},{"min_qty":2000,"discount_pct":15}]'::jsonb
    ELSE volume_tiers
  END,
  quote_threshold_qty = CASE slug
    WHEN 'the-vert-sencha' THEN 1000
    WHEN 'cafe-ethiopien-yirgacheffe' THEN 500
    WHEN 'huile-argan-bio' THEN 1000
    WHEN 'cacao-brut' THEN 1500
    WHEN 'quinoa-bio' THEN 2500
    WHEN 'vanille-bourbon' THEN 20000
    WHEN 'safran-premium' THEN 5000
    ELSE quote_threshold_qty
  END,
  max_volume_discount_pct = COALESCE(max_volume_discount_pct, 20)
WHERE volume_tiers IS NULL;

-- Capacité mensuelle du sésame (produit de test) : dériver du stock
UPDATE products SET monthly_capacity = GREATEST(stock_value * 3, 30)
WHERE monthly_capacity = 0 OR monthly_capacity IS NULL;
