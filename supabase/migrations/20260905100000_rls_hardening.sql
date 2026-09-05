-- =============================================================
-- EthiMarket — DURCISSEMENT RLS (audit sécurité pré-lancement)
--
-- Constat (tests d'attaque du 2026-08-26, section 5.3 du plan de
-- tests) : les policies héritées de la maquette laissaient tout
-- utilisateur AUTHENTIFIÉ modifier/supprimer les données des
-- autres :
--   ✗ products  : UPDATE/DELETE/INSERT en `true` → un producteur
--                 pouvait mettre le prix d'un concurrent à 0,01 €
--                 ou supprimer son produit (attaques 1-2 réussies)
--   ✗ producers : DELETE en `true`
--   ✗ articles / categories : écriture en `true` (défiguration
--                 du blog possible par n'importe quel compte)
--   ✗ reviews   : écriture en `true` (faux avis)
--
-- Ce qui a TENU : orders (B n'a ni lu ni modifié la commande
-- d'autrui), product_compliance_items (auto-vérification
-- refusée), verification_evidences (fabrication de preuve
-- refusée).
--
-- Règles après durcissement :
--   products   : propriétaire (user_id) ou admin
--   producers  : DELETE admin uniquement (l'UPDATE propriétaire
--                existait déjà correctement)
--   articles / categories : écriture admin uniquement
--   reviews    : écriture admin uniquement (pas d'UI publique
--                d'avis à ce jour ; à rouvrir avec une vraie
--                policy acheteur-vérifié le moment venu)
-- =============================================================

CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce((SELECT p.is_admin FROM profiles p WHERE p.id = auth.uid()), false);
$$;

-- ───────────── products : propriétaire ou admin ─────────────
DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR is_admin_user());

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR is_admin_user())
  WITH CHECK (user_id = auth.uid() OR is_admin_user());

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR is_admin_user());

-- ───────────── producers : DELETE admin uniquement ─────────────
DROP POLICY IF EXISTS "auth_delete_producers" ON producers;
CREATE POLICY "auth_delete_producers" ON producers FOR DELETE TO authenticated
  USING (is_admin_user());

-- ───────────── articles : écriture admin uniquement ─────────────
DROP POLICY IF EXISTS "auth_insert_articles" ON articles;
CREATE POLICY "auth_insert_articles" ON articles FOR INSERT TO authenticated
  WITH CHECK (is_admin_user());
DROP POLICY IF EXISTS "auth_update_articles" ON articles;
CREATE POLICY "auth_update_articles" ON articles FOR UPDATE TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());
DROP POLICY IF EXISTS "auth_delete_articles" ON articles;
CREATE POLICY "auth_delete_articles" ON articles FOR DELETE TO authenticated
  USING (is_admin_user());

-- ───────────── categories : écriture admin uniquement ─────────────
DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT TO authenticated
  WITH CHECK (is_admin_user());
DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());
DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE TO authenticated
  USING (is_admin_user());

-- ───────────── reviews : écriture admin uniquement (provisoire) ─────────────
DROP POLICY IF EXISTS "auth_insert_reviews" ON reviews;
CREATE POLICY "auth_insert_reviews" ON reviews FOR INSERT TO authenticated
  WITH CHECK (is_admin_user());
DROP POLICY IF EXISTS "auth_update_reviews" ON reviews;
CREATE POLICY "auth_update_reviews" ON reviews FOR UPDATE TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());
DROP POLICY IF EXISTS "auth_delete_reviews" ON reviews;
CREATE POLICY "auth_delete_reviews" ON reviews FOR DELETE TO authenticated
  USING (is_admin_user());
