-- =============================================================
-- EthiMarket — Circuit de commande B2B (devis accepté → commande)
--
-- Cycle de vie :
--   new (créée depuis un devis accepté par l'acheteur)
--   → confirmed  (producteur confirme : conditions verrouillées)
--   → shipped    (producteur expédie : n° de suivi)
--   → delivered  (acheteur confirme réception)
--   (+ cancelled tant que non expédiée, disputed après expédition)
--
-- Réconciliation : la table orders existante (total_price,
-- statuts pending/…) divergeait du type TS Order et des pages
-- admin (total_amount, commission_amount, statuts new/…).
-- Cette migration aligne tout sur le contrat TS/admin.
--
-- Correction sécurité : les policies existantes comparaient
-- auth.uid() = producer_id alors que producer_id référence
-- producers.id — un producteur ne voyait JAMAIS ses commandes.
-- =============================================================

-- ── 1. Colonnes manquantes (contrat TS Order + circuit B2B) ──
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS order_number text,
  ADD COLUMN IF NOT EXISTS quote_id uuid REFERENCES quote_requests(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS product_name text,
  ADD COLUMN IF NOT EXISTS unit_price numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'EUR',
  ADD COLUMN IF NOT EXISTS total_amount numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS commission_rate numeric(5,4) NOT NULL DEFAULT 0.05,
  ADD COLUMN IF NOT EXISTS commission_amount numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS escrow_amount numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_method text,
  ADD COLUMN IF NOT EXISTS shipping_cost numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS customs_cost numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_country text,
  ADD COLUMN IF NOT EXISTS expected_delivery_days text,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS shipped_at timestamptz,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancel_reason text;

-- Migre l'ancienne colonne total_price vers total_amount si présente
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'orders' AND column_name = 'total_price') THEN
    UPDATE orders SET total_amount = total_price
    WHERE total_amount = 0 AND total_price IS NOT NULL AND total_price > 0;
  END IF;
END $$;

-- ── 2. Statuts : aligne l'ancien vocabulaire sur le contrat TS ──
UPDATE orders SET status = 'new'        WHERE status = 'pending';
UPDATE orders SET status = 'processing' WHERE status = 'confirmed';

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('new', 'processing', 'shipped', 'delivered', 'disputed', 'cancelled', 'refunded'));
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'new';

-- L'ancienne colonne total_price (NOT NULL sans default) bloquerait
-- tout nouvel insert : on la neutralise (total_amount fait foi).
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'orders' AND column_name = 'total_price') THEN
    ALTER TABLE orders ALTER COLUMN total_price DROP NOT NULL;
    ALTER TABLE orders ALTER COLUMN total_price SET DEFAULT 0;
  END IF;
END $$;

-- ── 3. Numéro de commande lisible PO-YYYY-NNNN ──
CREATE SEQUENCE IF NOT EXISTS order_number_seq;

CREATE OR REPLACE FUNCTION assign_order_number()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'PO-' || to_char(now(), 'YYYY') || '-' ||
                        lpad(nextval('order_number_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_number ON orders;
CREATE TRIGGER trg_order_number BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION assign_order_number();

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_producer ON orders(producer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_quote ON orders(quote_id);

-- ── 4. Garde-fou : transitions de statut légales + horodatage ──
CREATE OR REPLACE FUNCTION enforce_order_transitions()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    IF NOT (
      (OLD.status = 'new'        AND NEW.status IN ('processing', 'cancelled')) OR
      (OLD.status = 'processing' AND NEW.status IN ('shipped', 'cancelled')) OR
      (OLD.status = 'shipped'    AND NEW.status IN ('delivered', 'disputed')) OR
      (OLD.status = 'delivered'  AND NEW.status IN ('disputed')) OR
      (OLD.status = 'disputed'   AND NEW.status IN ('delivered', 'refunded', 'cancelled'))
    ) THEN
      RAISE EXCEPTION 'Transition de commande invalide : % → %', OLD.status, NEW.status;
    END IF;
    IF NEW.status = 'processing' THEN NEW.confirmed_at := now(); END IF;
    IF NEW.status = 'shipped'    THEN NEW.shipped_at   := now(); END IF;
    IF NEW.status = 'delivered'  THEN NEW.delivered_at := now(); END IF;
    IF NEW.status = 'cancelled'  THEN NEW.cancelled_at := now(); END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_transitions ON orders;
CREATE TRIGGER trg_order_transitions BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION enforce_order_transitions();

-- updated_at automatique
DROP TRIGGER IF EXISTS trg_touch_orders ON orders;
CREATE TRIGGER trg_touch_orders BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ── 5. RLS corrigée : le producteur est identifié via producers.user_id ──
DROP POLICY IF EXISTS "public_read_orders"  ON orders;
DROP POLICY IF EXISTS "read_own_orders"     ON orders;
DROP POLICY IF EXISTS "insert_own_orders"   ON orders;
DROP POLICY IF EXISTS "update_own_orders"   ON orders;
DROP POLICY IF EXISTS "delete_own_orders"   ON orders;

CREATE POLICY "orders_select_parties" ON orders FOR SELECT TO authenticated
  USING (
    auth.uid() = buyer_id
    OR EXISTS (SELECT 1 FROM producers p WHERE p.id = orders.producer_id AND p.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true)
  );

CREATE POLICY "orders_insert_buyer" ON orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "orders_update_parties" ON orders FOR UPDATE TO authenticated
  USING (
    auth.uid() = buyer_id
    OR EXISTS (SELECT 1 FROM producers p WHERE p.id = orders.producer_id AND p.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true)
  )
  WITH CHECK (
    auth.uid() = buyer_id
    OR EXISTS (SELECT 1 FROM producers p WHERE p.id = orders.producer_id AND p.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles pr WHERE pr.id = auth.uid() AND pr.is_admin = true)
  );

-- Pas de DELETE : une commande s'annule (traçabilité), ne s'efface pas.

-- ── 6. Un devis accepté ne produit qu'UNE commande ──
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_unique_quote
  ON orders(quote_id) WHERE quote_id IS NOT NULL;

COMMENT ON TABLE orders IS
  'Commandes B2B issues des devis acceptés. Cycle : new → processing → shipped → delivered (+ disputed/cancelled/refunded). Transitions garanties par trigger.';
