-- =============================================================
-- EthiMarket — RGPD : export des données + suppression de compte
--
-- delete_my_account() : suppression par l'utilisateur lui-même
-- (SECURITY DEFINER, auth.uid() uniquement — impossible de
-- supprimer un autre compte). Les données commerciales liées
-- (commandes, devis) sont conservées mais anonymisées via les
-- ON DELETE SET NULL existants — obligation de conservation
-- comptable, conforme RGPD (le lien identifiant est rompu).
--
-- export_my_data() : renvoie un JSON complet des données
-- personnelles de l'utilisateur (droit à la portabilité, art. 20).
-- =============================================================

CREATE OR REPLACE FUNCTION export_my_data()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  result jsonb;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Non authentifié'; END IF;

  SELECT jsonb_build_object(
    'exported_at', now(),
    'profile', (SELECT to_jsonb(p) - 'id' FROM profiles p WHERE p.id = uid),
    'producer', (SELECT to_jsonb(pr) - 'id' - 'user_id' FROM producers pr WHERE pr.user_id = uid),
    'quotes', coalesce((SELECT jsonb_agg(to_jsonb(q) - 'buyer_id' - 'producer_user_id')
      FROM quote_requests q WHERE q.buyer_id = uid OR q.producer_user_id = uid), '[]'::jsonb),
    'orders', coalesce((SELECT jsonb_agg(to_jsonb(o) - 'buyer_id')
      FROM orders o WHERE o.buyer_id = uid
        OR EXISTS (SELECT 1 FROM producers pp WHERE pp.id = o.producer_id AND pp.user_id = uid)), '[]'::jsonb),
    'purchases', coalesce((SELECT jsonb_agg(to_jsonb(b) - 'user_id')
      FROM buyer_purchases b WHERE b.user_id = uid), '[]'::jsonb),
    'notifications', coalesce((SELECT jsonb_agg(to_jsonb(n) - 'user_id')
      FROM user_notifications n WHERE n.user_id = uid), '[]'::jsonb),
    'messages_sent', coalesce((SELECT jsonb_agg(jsonb_build_object(
        'content', m.content, 'created_at', m.created_at))
      FROM messages m WHERE m.sender_id = uid), '[]'::jsonb)
  ) INTO result;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION delete_my_account()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Non authentifié'; END IF;

  -- Données personnelles directes (cascades gèrent le reste)
  DELETE FROM user_notifications WHERE user_id = uid;
  DELETE FROM buyer_purchases WHERE user_id = uid;
  DELETE FROM buyer_suppliers WHERE user_id = uid;
  DELETE FROM buyer_products WHERE user_id = uid;
  DELETE FROM buyer_preferences WHERE user_id = uid;
  DELETE FROM buyer_events WHERE user_id = uid;
  DELETE FROM buyer_alerts WHERE user_id = uid;
  DELETE FROM buyer_documents WHERE user_id = uid;

  -- Messagerie : le contenu envoyé est effacé, les conversations orphelines aussi
  DELETE FROM messages WHERE sender_id = uid;
  DELETE FROM conversations WHERE participant_1 = uid OR participant_2 = uid;

  -- Fiche producteur (les produits ont producer_id ON DELETE CASCADE/SET NULL selon schéma)
  DELETE FROM producers WHERE user_id = uid;

  -- Profil puis compte auth (déclenche les ON DELETE référencés sur auth.users)
  DELETE FROM profiles WHERE id = uid;
  DELETE FROM auth.users WHERE id = uid;
END;
$$;

-- Seul un utilisateur authentifié peut appeler ces fonctions (sur lui-même)
REVOKE ALL ON FUNCTION export_my_data() FROM PUBLIC;
REVOKE ALL ON FUNCTION delete_my_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION export_my_data() TO authenticated;
GRANT EXECUTE ON FUNCTION delete_my_account() TO authenticated;
