-- =============================================================
-- EthiMarket — Parcours de demande de devis formalisé
-- Cycle de vie : sent → responded → accepted / declined
--                (+ cancelled par l'acheteur, expired auto)
-- Chaque transition est horodatée et journalisée. RLS stricte :
-- seuls l'acheteur et le producteur concernés voient le devis.
-- =============================================================

DO $$ BEGIN
  CREATE TYPE quote_status_enum AS ENUM (
    'sent', 'responded', 'accepted', 'declined', 'cancelled', 'expired'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Parties
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  producer_id UUID NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
  producer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Demande (photographie au moment T : le prix peut changer ensuite)
  product_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL DEFAULT 'kg',
  unit_price_at_request NUMERIC,          -- prix du palier au moment de la demande (null = sur devis)
  currency TEXT DEFAULT 'EUR',
  buyer_message TEXT,
  delivery_country TEXT,
  needed_by DATE,

  -- Réponse du producteur
  status quote_status_enum NOT NULL DEFAULT 'sent',
  quoted_unit_price NUMERIC,
  quoted_delivery_days TEXT,
  quoted_valid_until DATE,
  producer_message TEXT,
  responded_at TIMESTAMPTZ,

  -- Décision de l'acheteur
  decided_at TIMESTAMPTZ,
  decline_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quotes_buyer ON quote_requests(buyer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_producer ON quote_requests(producer_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quote_requests(status);

-- updated_at automatique
DROP TRIGGER IF EXISTS trg_touch_quotes ON quote_requests;
CREATE TRIGGER trg_touch_quotes BEFORE UPDATE ON quote_requests
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Garde-fou : transitions de statut légales uniquement
CREATE OR REPLACE FUNCTION enforce_quote_transitions()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    IF NOT (
      (OLD.status = 'sent'      AND NEW.status IN ('responded', 'declined', 'cancelled', 'expired')) OR
      (OLD.status = 'responded' AND NEW.status IN ('accepted', 'declined', 'cancelled', 'expired'))
    ) THEN
      RAISE EXCEPTION 'Transition de devis invalide : % → %', OLD.status, NEW.status;
    END IF;
    -- Horodatage automatique
    IF NEW.status = 'responded' THEN NEW.responded_at := now(); END IF;
    IF NEW.status IN ('accepted', 'declined', 'cancelled') THEN NEW.decided_at := now(); END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_quote_transitions ON quote_requests;
CREATE TRIGGER trg_quote_transitions BEFORE UPDATE ON quote_requests
  FOR EACH ROW EXECUTE FUNCTION enforce_quote_transitions();

-- RLS : chaque partie ne voit que ses devis
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quotes_buyer_all" ON quote_requests;
CREATE POLICY "quotes_buyer_all" ON quote_requests
  FOR ALL USING (auth.uid() = buyer_id) WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "quotes_producer_read" ON quote_requests;
CREATE POLICY "quotes_producer_read" ON quote_requests
  FOR SELECT USING (auth.uid() = producer_user_id);

DROP POLICY IF EXISTS "quotes_producer_update" ON quote_requests;
CREATE POLICY "quotes_producer_update" ON quote_requests
  FOR UPDATE USING (auth.uid() = producer_user_id);
