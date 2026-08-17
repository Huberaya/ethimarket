-- =============================================================
-- Assistant d'impact : provenance des empreintes CO2 / eau
--
-- Les agriculteurs ne peuvent pas mesurer leur empreinte (une ACV
-- coûte des milliers d'euros). La plateforme les estime désormais
-- automatiquement à partir de moyennes sectorielles sourcées
-- (Agribalyse 3.1, Poore & Nemecek 2018, Water Footprint Network).
-- Ces colonnes tracent l'origine de chaque valeur :
--   'producer'  = ACV fournie par le producteur (donnée primaire)
--   'estimated' = estimation sectorielle calculée par EthiMarket
-- =============================================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS carbon_footprint_source text
    CHECK (carbon_footprint_source IN ('producer', 'estimated')),
  ADD COLUMN IF NOT EXISTS water_footprint_source text
    CHECK (water_footprint_source IN ('producer', 'estimated'));

COMMENT ON COLUMN products.carbon_footprint_source IS
  'Provenance de carbon_footprint_kg : producer (ACV) ou estimated (moyenne sectorielle EthiMarket)';
COMMENT ON COLUMN products.water_footprint_source IS
  'Provenance de water_footprint_liters : producer (ACV) ou estimated (moyenne sectorielle EthiMarket)';

-- Les valeurs historiques ont été pré-remplies par la plateforme à
-- titre indicatif, sans ACV produit : elles sont marquées 'estimated'.
UPDATE products
SET carbon_footprint_source = 'estimated'
WHERE carbon_footprint_kg IS NOT NULL AND carbon_footprint_source IS NULL;

UPDATE products
SET water_footprint_source = 'estimated'
WHERE water_footprint_liters IS NOT NULL AND water_footprint_source IS NULL;
