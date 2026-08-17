-- =============================================================
-- EthiMarket — Préparation paiement (Stripe-ready, sans PSP actif)
--
-- Le circuit actuel est le virement direct (payment_method =
-- 'bank_transfer'). Ces colonnes préparent l'arrivée de Stripe
-- Connect SANS changement de schéma ultérieur :
--   payment_method   : bank_transfer | stripe
--   payment_status   : unpaid | invoiced | paid | refunded
--   payment_reference: référence virement OU PaymentIntent Stripe
--   paid_at          : horodatage du règlement
--
-- En attendant Stripe, le producteur peut marquer une commande
-- comme payée (virement reçu) — traçabilité du règlement dès
-- aujourd'hui.
-- =============================================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'bank_transfer'
    CHECK (payment_method IN ('bank_transfer', 'stripe')),
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'invoiced', 'paid', 'refunded')),
  ADD COLUMN IF NOT EXISTS payment_reference text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

-- Horodatage automatique du paiement
CREATE OR REPLACE FUNCTION trg_touch_paid_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.payment_status = 'paid' AND OLD.payment_status IS DISTINCT FROM 'paid' THEN
    NEW.paid_at := now();
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_order_paid_at ON orders;
CREATE TRIGGER trg_order_paid_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION trg_touch_paid_at();

COMMENT ON COLUMN orders.payment_status IS
  'unpaid → invoiced (facture émise) → paid (virement reçu / Stripe) → refunded. Stripe Connect branchable sans migration.';
