# Activer Stripe Connect sur EthiMarket — guide d'activation

> État actuel : le schéma est **Stripe-ready** (colonnes `payment_method`,
> `payment_status`, `payment_reference`, `paid_at` sur `orders`) et le
> circuit virement fonctionne (suivi non payée → facturée → payée).
> Ce guide décrit les étapes pour activer le paiement en ligne quand
> le volume le justifiera.

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

## Ce qu'il restera à coder (≈ 1 chantier)

- [ ] Edge Function `create-checkout` + `stripe-webhook` (Deno).
- [ ] Bouton « Payer en ligne » côté acheteur sur les commandes
      `processing` (visible si `payment_method='stripe'`).
- [ ] Onboarding Express des producteurs (lien généré depuis leur dashboard).
- [ ] Page de retour succès/annulation.
- [ ] Tests + bascule progressive (le virement reste disponible).

## Ce qu'il ne faudra PAS refaire

- Schéma `orders` : prêt.
- Commission : calculée et stockée à la création de commande.
- Notifications/e-mails : l'événement `paid` peut être branché sur le
  trigger existant en 5 lignes.
