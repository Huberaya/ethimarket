-- =============================================================
-- EthiMarket — PURGE DES DONNÉES DE DÉMONSTRATION
--
-- ⚠️ À exécuter UNE SEULE FOIS, juste avant le lancement réel.
-- ⚠️ IRRÉVERSIBLE. Faire un backup avant :
--    Dashboard Supabase → Database → Backups (ou pg_dump).
--
-- Ce que le script SUPPRIME :
--   • les 13 producteurs de démonstration (ceux SANS compte
--     utilisateur : user_id IS NULL) et tout ce qui s'y rattache
--     en cascade (produits, certifications, preuves, défis photo,
--     avis, devis, commandes, incidents, analyses)
--   • les avis (reviews) restants liés aux produits démo
--   • les 10 articles de blog de démonstration
--   • les devis/quotes de test restants
--
-- Ce que le script PRÉSERVE :
--   • tous les comptes réels (profiles avec auth.users)
--   • le producteur relié à un compte réel (jean-dupont / bayahubert)
--   • l'annuaire des laboratoires, la table de risque UE,
--     les alertes RASFF (données de production légitimes)
--   • les gabarits e-mails, catégories, organismes certificateurs
--
-- Usage :
--   PGPASSWORD='...' psql "host=... dbname=postgres user=..." \
--     -f scripts/purge_demo_data.sql
-- =============================================================

BEGIN;

-- Garde-fou : vérifier qu'on est bien sur la base attendue
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'producers') THEN
    RAISE EXCEPTION 'Base inattendue : table producers absente. Abandon.';
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- 0. État avant purge (affiché pour le procès-verbal)
-- ─────────────────────────────────────────────────────────────
SELECT 'AVANT PURGE' AS etape,
  (SELECT count(*) FROM producers)                          AS producteurs,
  (SELECT count(*) FROM producers WHERE user_id IS NULL)    AS producteurs_demo,
  (SELECT count(*) FROM products)                           AS produits,
  (SELECT count(*) FROM reviews)                            AS avis,
  (SELECT count(*) FROM articles)                           AS articles,
  (SELECT count(*) FROM quote_requests)                     AS devis;

-- ─────────────────────────────────────────────────────────────
-- 1. Tout ce qui référence les producteurs démo (user_id IS NULL)
--    L'ordre respecte les contraintes FK sans ON DELETE CASCADE.
-- ─────────────────────────────────────────────────────────────

-- Analyses labo rattachées aux producteurs démo
DELETE FROM lot_analyses
WHERE producer_id IN (SELECT id FROM producers WHERE user_id IS NULL);

-- Incidents qualité
DELETE FROM product_incidents
WHERE producer_id IN (SELECT id FROM producers WHERE user_id IS NULL)
   OR product_id IN (SELECT p.id FROM products p JOIN producers pr ON pr.id = p.producer_id WHERE pr.user_id IS NULL);

-- Réceptions et documents de lot des commandes liées aux producteurs démo
DELETE FROM order_receptions
WHERE order_id IN (SELECT o.id FROM orders o JOIN producers pr ON pr.id = o.producer_id WHERE pr.user_id IS NULL);
DELETE FROM order_lot_documents
WHERE order_id IN (SELECT o.id FROM orders o JOIN producers pr ON pr.id = o.producer_id WHERE pr.user_id IS NULL);

-- Commandes et devis
DELETE FROM orders
WHERE producer_id IN (SELECT id FROM producers WHERE user_id IS NULL);
DELETE FROM quote_requests
WHERE producer_id IN (SELECT id FROM producers WHERE user_id IS NULL);

-- Avis sur les produits démo
DELETE FROM reviews
WHERE product_id IN (SELECT p.id FROM products p JOIN producers pr ON pr.id = p.producer_id WHERE pr.user_id IS NULL);

-- Réclamations produit : supprimer d'abord les preuves et le journal
-- (le trigger de réévaluation sur claim_evidence écrit dans
-- claim_status_log — l'ordre inverse casserait la FK)
DELETE FROM claim_evidence
WHERE claim_id IN (
  SELECT c.id FROM product_claims c
  JOIN products p ON p.id = c.product_id
  JOIN producers pr ON pr.id = p.producer_id WHERE pr.user_id IS NULL);
DELETE FROM claim_status_log
WHERE claim_id IN (
  SELECT c.id FROM product_claims c
  JOIN products p ON p.id = c.product_id
  JOIN producers pr ON pr.id = p.producer_id WHERE pr.user_id IS NULL);
DELETE FROM product_claims
WHERE product_id IN (SELECT p.id FROM products p JOIN producers pr ON pr.id = p.producer_id WHERE pr.user_id IS NULL);
DELETE FROM product_compliance_items
WHERE product_id IN (SELECT p.id FROM products p JOIN producers pr ON pr.id = p.producer_id WHERE pr.user_id IS NULL);
DELETE FROM verification_evidences
WHERE producer_id IN (SELECT id FROM producers WHERE user_id IS NULL);
DELETE FROM photo_challenges
WHERE producer_id IN (SELECT id FROM producers WHERE user_id IS NULL);
DELETE FROM verification_history
WHERE producer_id IN (SELECT id FROM producers WHERE user_id IS NULL);
DELETE FROM certification_verification_requests
WHERE producer_certification_id IN (
  SELECT pc.id FROM producer_certifications pc
  JOIN producers pr ON pr.id = pc.producer_id WHERE pr.user_id IS NULL);
DELETE FROM certification_verification_logs
WHERE producer_certification_id IN (
  SELECT pc.id FROM producer_certifications pc
  JOIN producers pr ON pr.id = pc.producer_id WHERE pr.user_id IS NULL);
DELETE FROM producer_certifications
WHERE producer_id IN (SELECT id FROM producers WHERE user_id IS NULL);

-- Produits puis producteurs démo
DELETE FROM products
WHERE producer_id IN (SELECT id FROM producers WHERE user_id IS NULL);
DELETE FROM producers WHERE user_id IS NULL;

-- ─────────────────────────────────────────────────────────────
-- 2. Contenus éditoriaux de démonstration
-- ─────────────────────────────────────────────────────────────
DELETE FROM articles;          -- 10 articles de blog fictifs
DELETE FROM reviews;           -- avis restants (tous fictifs)
DELETE FROM quote_requests;    -- devis de test restants

-- ─────────────────────────────────────────────────────────────
-- 3. État après purge
-- ─────────────────────────────────────────────────────────────
SELECT 'APRÈS PURGE' AS etape,
  (SELECT count(*) FROM producers)       AS producteurs,
  (SELECT count(*) FROM products)        AS produits,
  (SELECT count(*) FROM reviews)         AS avis,
  (SELECT count(*) FROM articles)        AS articles,
  (SELECT count(*) FROM quote_requests)  AS devis,
  (SELECT count(*) FROM profiles)        AS comptes_reels_preserves,
  (SELECT count(*) FROM laboratories)    AS labos_preserves,
  (SELECT count(*) FROM eu_risk_rules)   AS regles_ue_preservees;

-- NOTE : exécuté via `psql -f`, le script valide (COMMIT) automatiquement.
-- Pour un essai à blanc, remplacer COMMIT par ROLLBACK ci-dessous :
-- les compteurs « APRÈS PURGE » s'affichent quand même.
COMMIT;
