# EthiMarket — Documentation d'exploitation

> Pour le fondateur et tout développeur qui reprendra le projet.
> Dernière mise à jour : 2026-08. Tout ce qui est décrit ici est
> **réellement en production**.

## 1. Vue d'ensemble

| Brique | Techno | Où |
|---|---|---|
| Front | React 18 + Vite + TypeScript + Tailwind | Vercel (auto-déploie `main`) |
| Base / Auth / Storage / Realtime | Supabase (projet `scqxbfwsuksoihjnukic`, région eu-central-1) | supabase.com |
| E-mails transactionnels | Triggers SQL → pg_net → API Resend | dans Postgres |
| Paiement en ligne | Stripe Checkout (mode test) via 2 Edge Functions | Supabase Functions |
| Dépôt | github.com/Huberaya/ethimarket (branche unique `main`) | GitHub |

- **Site prod** : https://ethimarket.vercel.app — déploiement ~80 s après push sur `main`.
- **Philosophie** : zéro coût de fonctionnement, moteurs 100 % locaux et
  déterministes (score, impact, recherche, traduction des noms produits),
  aucune API payante.

## 2. Lancer le projet en local

```bash
npm install
# .env (ne JAMAIS committer) :
#   VITE_SUPABASE_URL=https://scqxbfwsuksoihjnukic.supabase.co
#   VITE_SUPABASE_ANON_KEY=<clé anon, visible dans le dashboard Supabase>
npm run dev        # dev server
npx vitest run     # 462 tests (node env)
npx tsc -b         # 0 erreur attendu
npm run build      # build prod
```

⚠️ Ne pas committer `package-lock.json` (le repo utilise `bun.lock`).

## 3. Secrets — où vit quoi

| Secret | Emplacement | Utilisé par |
|---|---|---|
| Clé anon Supabase | Variables Vercel + `.env` local | Front |
| `resend_api_key`, `resend_from` | **Supabase Vault** (`vault.decrypted_secrets`) | Trigger e-mail (`trg_send_notification_email`) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SITE_URL` | **Secrets Edge Functions** (Dashboard → Edge Functions → Secrets) | `stripe-checkout`, `stripe-webhook` |
| Service role key | Injectée automatiquement dans les Edge Functions | jamais côté client |

Mettre à jour un secret Vault (SQL Editor) :
```sql
select vault.update_secret(
  (select id from vault.secrets where name='resend_api_key'),
  new_secret := 're_NOUVELLE_CLE');
```

## 4. Flux métier et automatismes SQL

### Devis → commande → paiement
- `quote_requests` : cycle `sent → responded → accepted/declined`
  (+ cancelled/expired). Transitions garanties par trigger
  `enforce_quote_transitions`.
- Devis accepté → l'acheteur convertit en `orders` (`new →
  processing → shipped → delivered`, + disputed/cancelled/refunded),
  trigger `enforce_order_transitions`, numéro `PO-AAAA-NNNN`
  (séquence `order_number_seq`), 1 devis = 1 commande (index unique).
- Paiement : `payment_status` `unpaid → invoiced → paid` (trigger
  `trg_order_paid_at` horodate). Virement (marquage manuel producteur)
  ou Stripe Checkout.

### Notifications & e-mails (créés PAR la base, pas par le client)
- Triggers sur `quote_requests`, `orders`, `messages` → insèrent dans
  `user_notifications` (kind + payload jsonb, jamais de texte).
- La cloche 🔔 du dashboard s'abonne en Realtime ; libellés rendus
  côté client dans la langue de l'utilisateur (clés `notif.*`).
- Trigger `trg_notification_email` sur `user_notifications` → gabarit
  `email_texts` (kind × locale) → HTML → `net.http_post` vers Resend.
  Journal dans `email_log` ; réponse HTTP dans `net._http_response`
  (joindre par `net_request_id`). Un échec e-mail ne bloque JAMAIS
  l'opération métier.
- Langue du destinataire : `profiles.preferred_locale`, synchronisée
  par le sélecteur de langue du site.

### Stripe (mode test actuellement)
- `stripe-checkout` (JWT requis) : vérifie que l'appelant est
  l'acheteur, commande confirmée et non payée → session Checkout →
  `payment_status='invoiced'` + référence session.
- `stripe-webhook` (déployé `--no-verify-jwt`) : vérifie la signature
  HMAC `Stripe-Signature`, anti-rejeu 5 min ;
  `checkout.session.completed` → `paid` + référence PaymentIntent.
- Webhook déclaré chez Stripe : événement `checkout.session.completed`
  vers `https://scqxbfwsuksoihjnukic.supabase.co/functions/v1/stripe-webhook`.
- **Passage en live** : voir `docs/STRIPE_ACTIVATION.md` (échange de
  clés uniquement, zéro code).

### RGPD
- `export_my_data()` / `delete_my_account()` : fonctions SECURITY
  DEFINER limitées à `auth.uid()`, exposées en self-service dans
  Paramètres. Les commandes/devis survivent anonymisés (obligation
  comptable).

## 5. i18n (5 langues : fr, en, es, pt, ar — RTL)

- UI : `src/lib/i18n/` — `t(clé)` dictionnaires, `tx(français)`
  gettext, contenus éditoriaux par page dans `content/`.
- Données en base : colonne jsonb `translations` sur products/
  articles/categories/producers ; helpers `dbLocalized.ts`
  (fallback locale → fr, jamais vide) ; seeds versionnés dans
  `supabase/seed/translations/`.
- Noms de produits vendeurs : auto-traduits à la sauvegarde
  (`productAutoTranslate.ts`, dictionnaire ~90 termes, couverture
  ≥ 50 % sinon fallback) ; descriptions : panneau optionnel dans le
  formulaire produit.
- E-mails : gabarits `email_texts` en base, seed
  `supabase/seed/email_texts.sql` **généré depuis les clés `notif.*`**
  — un test vitest garantit la parité cloche/e-mail.
- Admin (`/admin`) volontairement FR ; contenu juridique fait foi en
  FR avec bannière pour les autres langues.

## 6. Migrations & base

- Fichiers dans `supabase/migrations/` (ordre chronologique par nom).
- Application : `psql "host=aws-0-eu-central-1.pooler.supabase.com
  port=5432 dbname=postgres user=postgres.scqxbfwsuksoihjnukic
  sslmode=require" -f <fichier>` (⚠️ seul le pooler eu-central-1
  fonctionne en IPv4 ; `db.*.supabase.co` est IPv6-only).
- RLS activée partout ; règle clé : le producteur est identifié via
  `producers.user_id` (PAS `producers.id = auth.uid()` — bug
  historique corrigé dans `20260822100000`).

## 7. Tests & qualité

- 462 tests vitest (`src/test/`), tous en `// @vitest-environment node`
  (jsdom cassé dans cet environnement).
- Avant chaque push : `npx vitest run && npx tsc -b && npm run build`.
- Smoke tests navigateur : playwright-core headless, injecter la
  langue via `page.addInitScript(l => localStorage.setItem('ethimarket_locale', l))`.
- CI : fichier prêt dans `.github/workflows-to-install/ci.yml` — à
  copier dans `.github/workflows/` via l'interface GitHub.

## 8. Comptes & données

- Comptes réels : `bayahubert@yahoo.com` (producteur, admin —
  `profiles.is_admin=true`), `diamboresto@gmail.com` (acheteur).
- Données de démonstration : 13 produits, ~13 producteurs, 10 articles
  de blog, 20 avis. À purger avant le lancement réel (les traductions
  et images sont versionnées dans le repo).
- Convention de test : comptes jetables `*@ethimarket-test.dev`,
  toujours supprimés après usage.

## 9. Limitations connues / dettes assumées

- E-mails Resend limités à l'adresse du compte tant qu'aucun domaine
  n'est vérifié (resend.com/domains).
- Stripe en mode test ; encaissement plateforme (pas encore Connect
  producteurs).
- Certificats et photos des coopératives : données de démonstration.
- Documents légaux : gabarits à trous dans `docs/legal/`, à faire
  valider par un juriste.
