# Activer Stripe Connect sur EthiMarket — guide d'activation

> ✅ **ACTIVÉ EN MODE TEST** (2026-08-17) : Edge Functions déployées,
> secrets posés (STRIPE_SECRET_KEY test, STRIPE_WEBHOOK_SECRET,
> SITE_URL), webhook créé (we_1U5X9FAGDn4bArVweBOQoUIV,
> checkout.session.completed). Circuit vérifié de bout en bout :
> session Checkout → carte test 4242 → webhook signé → commande
> 'paid' + PaymentIntent + paid_at automatique.
>
> ## Passage en mode LIVE (quand le KYC Stripe sera finalisé)
> 1. Dashboard Stripe → basculer en mode live → copier `sk_live_...`
> 2. Mettre à jour le secret : API management ou
>    `supabase secrets set STRIPE_SECRET_KEY=sk_live_...`
> 3. Recréer le webhook en mode live (même URL) et mettre à jour
>    `STRIPE_WEBHOOK_SECRET` avec le nouveau `whsec_...`
> 4. Aucun changement de code.

## Prérequis (côté fondateur — bloquants)

1. **Entité juridique** : société immatriculée (SIRET/RC) — Stripe l'exige au KYC.
2. **Compte Stripe** : https://dashboard.stripe.com/register, activation
   avec pièces d'identité + IBAN de la société.
3. **Stripe Connect** (marketplace) : Dashboard → Connect → Get started →
   type **Express accounts** (les producteurs auront leur propre onboarding
   allégé géré par Stripe, y compris hors UE — vérifier la liste des pays
   supportés pour l'Éthiopie/Madagascar : sinon, mode « destination charges »
   sur le compte plateforme + reversements manuels).

## Architecture prévue (déjà anticipée dans le code)

- `orders.payment_method = 'stripe'` pour les commandes payées en ligne.
- Une **Supabase Edge Function** `create-checkout` créera la session
  Stripe Checkout : montant = `total_amount`, `application_fee_amount` =
  `commission_amount` (les 5 % déjà calculés par `computeOrderAmounts`).
- Le **webhook Stripe** (`checkout.session.completed` /
  `payment_intent.succeeded`) mettra à jour `payment_status='paid'` +
  `payment_reference=<payment_intent_id>` — le trigger `trg_order_paid_at`
  horodate automatiquement.
- Clés à stocker dans **Supabase Vault** (comme `resend_api_key`) :
  `stripe_secret_key`, `stripe_webhook_secret`.

## Ce qui est DÉJÀ codé (ce repo)

- [x] Edge Function `supabase/functions/stripe-checkout` (session
      Checkout via API REST, vérif. propriétaire/statuts, trace la
      référence de session, 503 propre sans clé).
- [x] Edge Function `supabase/functions/stripe-webhook`
      (signature HMAC vérifiée manuellement, anti-rejeu 5 min,
      `checkout.session.completed` → payment_status='paid').
- [x] Bouton « Payer en ligne » (OrdersPage, visible seulement si
      `payment_method='stripe'` et non payée) + URLs de retour
      succès/annulation sur /dashboard/commandes.

## Il ne reste à faire QUE (une fois le compte Stripe créé)

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook --no-verify-jwt
```
puis déclarer l'endpoint webhook dans le Dashboard Stripe
(événement `checkout.session.completed`) et passer les commandes
concernées en `payment_method='stripe'`.

- [ ] (plus tard) Onboarding Connect Express des producteurs pour
      le versement direct — le circuit actuel encaisse sur le compte
      plateforme.

## Ce qu'il ne faudra PAS refaire

- Schéma `orders` : prêt.
- Commission : calculée et stockée à la création de commande.
- Notifications/e-mails : l'événement `paid` peut être branché sur le
  trigger existant en 5 lignes.
