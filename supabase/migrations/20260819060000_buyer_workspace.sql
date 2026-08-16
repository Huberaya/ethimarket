-- =============================================================
-- EthiMarket — Espace Acheteur ("Mes achats")
--  * Suivi fournisseurs : actifs / en évaluation / à risque / suspendus
--  * Suivi produits    : approuvés / en analyse / rejetés (+ alternatives)
--  * Achats            : économies, impact, évolution du score, dépenses responsables
--  * Préférences       : pondérations personnalisées (prix/env/social/traça/certifs)
--  * Apprentissage     : événements comportementaux → profil appris
-- RLS : chaque acheteur ne voit que SES données.
-- =============================================================

-- 1. ENUMS ------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE buyer_supplier_status_enum AS ENUM ('active','evaluating','at_risk','suspended');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE buyer_product_status_enum AS ENUM ('approved','analyzing','rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABLES -----------------------------------------------------

-- Suivi des fournisseurs par l'acheteur
CREATE TABLE IF NOT EXISTS buyer_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  producer_id UUID NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
  status buyer_supplier_status_enum NOT NULL DEFAULT 'evaluating',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, producer_id)
);

-- Suivi des produits par l'acheteur
CREATE TABLE IF NOT EXISTS buyer_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  status buyer_product_status_enum NOT NULL DEFAULT 'analyzing',
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- Journal d'achats (déclaratif ou issu des commandes)
CREATE TABLE IF NOT EXISTS buyer_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EUR',
  -- prix de référence du marché conventionnel : sert au calcul d'économies
  baseline_unit_price NUMERIC,
  -- métriques d'impact au moment de l'achat
  carbon_footprint_kg NUMERIC,
  ethical_score INTEGER,           -- score global EthiMarket du produit acheté
  traceability_score INTEGER,
  is_responsible BOOLEAN DEFAULT true,  -- compte dans les "dépenses responsables"
  purchased_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Préférences & règles de pondération de l'acheteur
CREATE TABLE IF NOT EXISTS buyer_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_price INTEGER NOT NULL DEFAULT 30 CHECK (weight_price BETWEEN 0 AND 100),
  weight_environment INTEGER NOT NULL DEFAULT 25 CHECK (weight_environment BETWEEN 0 AND 100),
  weight_social INTEGER NOT NULL DEFAULT 20 CHECK (weight_social BETWEEN 0 AND 100),
  weight_traceability INTEGER NOT NULL DEFAULT 15 CHECK (weight_traceability BETWEEN 0 AND 100),
  weight_certifications INTEGER NOT NULL DEFAULT 10 CHECK (weight_certifications BETWEEN 0 AND 100),
  -- profil appris automatiquement (jamais écrasé par l'acheteur)
  learned_profile JSONB DEFAULT '{}'::jsonb,
  use_learned_adjustments BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT weights_sum_100 CHECK (
    weight_price + weight_environment + weight_social + weight_traceability + weight_certifications = 100
  )
);

-- Événements comportementaux (matière première de l'apprentissage)
CREATE TABLE IF NOT EXISTS buyer_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'product_view','comparison_run','recommendation_followed','recommendation_ignored',
    'product_approved','product_rejected','purchase','supplier_status_change','filter_used'
  )),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  producer_id UUID REFERENCES producers(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_buyer_suppliers_user ON buyer_suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_buyer_products_user ON buyer_products(user_id);
CREATE INDEX IF NOT EXISTS idx_buyer_purchases_user ON buyer_purchases(user_id, purchased_at);
CREATE INDEX IF NOT EXISTS idx_buyer_events_user ON buyer_events(user_id, created_at);

-- 3. updated_at triggers ---------------------------------------
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS
$$ BEGIN NEW.updated_at := now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS trg_touch_buyer_suppliers ON buyer_suppliers;
CREATE TRIGGER trg_touch_buyer_suppliers BEFORE UPDATE ON buyer_suppliers
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
DROP TRIGGER IF EXISTS trg_touch_buyer_products ON buyer_products;
CREATE TRIGGER trg_touch_buyer_products BEFORE UPDATE ON buyer_products
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- 4. RLS : chaque acheteur chez lui ----------------------------
ALTER TABLE buyer_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_events ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['buyer_suppliers','buyer_products','buyer_purchases','buyer_preferences','buyer_events']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_owner_all" ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY "%s_owner_all" ON %I FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)',
      t, t
    );
  END LOOP;
END $$;
