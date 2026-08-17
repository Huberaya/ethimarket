-- =============================================================
-- EthiMarket — Notifications in-app utilisateur
--
-- Une ligne = une notification pour UN utilisateur.
-- Les notifications sont créées par des TRIGGERS SQL sur les
-- événements métier (devis, commandes, messages) : elles sont
-- donc garanties quel que soit le client qui fait l'action.
--
-- i18n : on stocke un `kind` + un `payload` jsonb, JAMAIS de
-- texte : le libellé est rendu côté client dans la langue de
-- l'utilisateur au moment de l'affichage.
-- =============================================================

CREATE TABLE IF NOT EXISTS user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN (
    'quote_received',        -- producteur : nouvelle demande de devis
    'quote_offer',           -- acheteur : le producteur a répondu
    'quote_accepted',        -- producteur : l'acheteur a accepté l'offre
    'quote_declined',        -- l'autre partie a décliné
    'order_created',         -- producteur : nouvelle commande à confirmer
    'order_confirmed',       -- acheteur : commande confirmée
    'order_shipped',         -- acheteur : commande expédiée
    'order_delivered',       -- producteur : réception confirmée
    'order_disputed',        -- producteur : litige ouvert
    'order_cancelled',       -- l'autre partie a annulé
    'message_received'       -- nouveau message dans une conversation
  )),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,  -- { product_name, order_number, quantity, unit, counterpart_name, … }
  link text,                                    -- route interne cible (ex: /dashboard/commandes)
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_notif_user ON user_notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notif_unread ON user_notifications(user_id) WHERE read_at IS NULL;

ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notif_select_own" ON user_notifications;
CREATE POLICY "notif_select_own" ON user_notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notif_update_own" ON user_notifications;
CREATE POLICY "notif_update_own" ON user_notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- INSERT uniquement via les triggers (SECURITY DEFINER) — pas de policy INSERT.

-- Realtime : la cloche s'abonne aux INSERT
ALTER PUBLICATION supabase_realtime ADD TABLE user_notifications;

-- =============================================================
-- Fonction utilitaire (SECURITY DEFINER pour contourner la RLS
-- puisque l'émetteur n'est jamais le destinataire)
-- =============================================================
CREATE OR REPLACE FUNCTION notify_user(p_user uuid, p_kind text, p_payload jsonb, p_link text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF p_user IS NOT NULL THEN
    INSERT INTO user_notifications (user_id, kind, payload, link)
    VALUES (p_user, p_kind, p_payload, p_link);
  END IF;
END;
$$;

-- =============================================================
-- Triggers DEVIS
-- =============================================================
CREATE OR REPLACE FUNCTION trg_notify_quote_events()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  buyer_name text;
  producer_name text;
BEGIN
  SELECT coalesce(full_name, email) INTO buyer_name FROM profiles WHERE id = NEW.buyer_id;
  SELECT name INTO producer_name FROM producers WHERE id = NEW.producer_id;

  IF TG_OP = 'INSERT' THEN
    PERFORM notify_user(
      NEW.producer_user_id, 'quote_received',
      jsonb_build_object('product_name', NEW.product_name, 'quantity', NEW.quantity,
                         'unit', NEW.unit, 'counterpart_name', buyer_name),
      '/dashboard/devis');
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'responded' THEN
      PERFORM notify_user(
        NEW.buyer_id, 'quote_offer',
        jsonb_build_object('product_name', NEW.product_name, 'counterpart_name', producer_name,
                           'unit_price', NEW.quoted_unit_price, 'currency', NEW.currency),
        '/dashboard/devis');
    ELSIF NEW.status = 'accepted' THEN
      PERFORM notify_user(
        NEW.producer_user_id, 'quote_accepted',
        jsonb_build_object('product_name', NEW.product_name, 'counterpart_name', buyer_name),
        '/dashboard/devis');
    ELSIF NEW.status = 'declined' THEN
      -- notifie la partie qui n'a PAS décliné : si decided_at est posé
      -- c'est l'acheteur qui a refusé l'offre → notifier producteur ;
      -- sinon le producteur a décliné la demande → notifier acheteur.
      IF OLD.status = 'responded' THEN
        PERFORM notify_user(NEW.producer_user_id, 'quote_declined',
          jsonb_build_object('product_name', NEW.product_name, 'counterpart_name', buyer_name),
          '/dashboard/devis');
      ELSE
        PERFORM notify_user(NEW.buyer_id, 'quote_declined',
          jsonb_build_object('product_name', NEW.product_name, 'counterpart_name', producer_name),
          '/dashboard/devis');
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_quote_notifications ON quote_requests;
CREATE TRIGGER trg_quote_notifications AFTER INSERT OR UPDATE ON quote_requests
  FOR EACH ROW EXECUTE FUNCTION trg_notify_quote_events();

-- =============================================================
-- Triggers COMMANDES
-- =============================================================
CREATE OR REPLACE FUNCTION trg_notify_order_events()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  producer_user uuid;
  buyer_name text;
  producer_name text;
  pl jsonb;
BEGIN
  SELECT user_id, name INTO producer_user, producer_name FROM producers WHERE id = NEW.producer_id;
  SELECT coalesce(full_name, email) INTO buyer_name FROM profiles WHERE id = NEW.buyer_id;
  pl := jsonb_build_object('product_name', NEW.product_name, 'order_number', NEW.order_number,
                           'quantity', NEW.quantity, 'unit', NEW.unit,
                           'total_amount', NEW.total_amount, 'currency', NEW.currency);

  IF TG_OP = 'INSERT' THEN
    PERFORM notify_user(producer_user, 'order_created',
      pl || jsonb_build_object('counterpart_name', buyer_name), '/dashboard/commandes');
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'processing' THEN
      PERFORM notify_user(NEW.buyer_id, 'order_confirmed',
        pl || jsonb_build_object('counterpart_name', producer_name), '/dashboard/commandes');
    ELSIF NEW.status = 'shipped' THEN
      PERFORM notify_user(NEW.buyer_id, 'order_shipped',
        pl || jsonb_build_object('counterpart_name', producer_name, 'tracking_number', NEW.tracking_number),
        '/dashboard/commandes');
    ELSIF NEW.status = 'delivered' THEN
      PERFORM notify_user(producer_user, 'order_delivered',
        pl || jsonb_build_object('counterpart_name', buyer_name), '/dashboard/commandes');
    ELSIF NEW.status = 'disputed' THEN
      PERFORM notify_user(producer_user, 'order_disputed',
        pl || jsonb_build_object('counterpart_name', buyer_name), '/dashboard/commandes');
    ELSIF NEW.status = 'cancelled' THEN
      -- Les deux parties peuvent annuler : on notifie les deux sauf
      -- l'impossibilité de savoir qui a agi côté SQL — les deux sont
      -- informées (l'acteur verra simplement la confirmation de son acte).
      PERFORM notify_user(NEW.buyer_id, 'order_cancelled',
        pl || jsonb_build_object('counterpart_name', producer_name, 'reason', NEW.cancel_reason), '/dashboard/commandes');
      PERFORM notify_user(producer_user, 'order_cancelled',
        pl || jsonb_build_object('counterpart_name', buyer_name, 'reason', NEW.cancel_reason), '/dashboard/commandes');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_notifications ON orders;
CREATE TRIGGER trg_order_notifications AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION trg_notify_order_events();

-- =============================================================
-- Trigger MESSAGES (anti-spam : pas de doublon si une
-- notification non lue existe déjà pour la même conversation)
-- =============================================================
CREATE OR REPLACE FUNCTION trg_notify_message_events()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  recipient uuid;
  sender_name text;
BEGIN
  SELECT CASE WHEN c.participant_1 = NEW.sender_id THEN c.participant_2 ELSE c.participant_1 END
    INTO recipient
  FROM conversations c WHERE c.id = NEW.conversation_id;

  IF recipient IS NULL THEN RETURN NEW; END IF;

  -- Anti-spam : une seule notification non lue par conversation
  IF EXISTS (
    SELECT 1 FROM user_notifications
    WHERE user_id = recipient AND kind = 'message_received' AND read_at IS NULL
      AND payload->>'conversation_id' = NEW.conversation_id::text
  ) THEN
    RETURN NEW;
  END IF;

  SELECT coalesce(p.full_name, pr.name, p.email) INTO sender_name
  FROM profiles p LEFT JOIN producers pr ON pr.user_id = p.id
  WHERE p.id = NEW.sender_id;

  PERFORM notify_user(recipient, 'message_received',
    jsonb_build_object('counterpart_name', sender_name, 'conversation_id', NEW.conversation_id,
                       'preview', left(NEW.content, 80)),
    '/dashboard/messages?conversation=' || NEW.conversation_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_message_notifications ON messages;
CREATE TRIGGER trg_message_notifications AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION trg_notify_message_events();

COMMENT ON TABLE user_notifications IS
  'Notifications in-app par utilisateur, créées par triggers SQL (devis, commandes, messages). kind+payload jsonb, libellés rendus côté client dans la langue de l''utilisateur.';
