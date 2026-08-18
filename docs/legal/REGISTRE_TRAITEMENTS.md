# Registre des activités de traitement (RGPD art. 30) — GABARIT

> ⚠️ À compléter avec l'identité du responsable de traitement dès
> l'immatriculation, puis à tenir à jour. Ce registre reflète les
> traitements **réellement implémentés** dans la plateforme à ce jour.

**Responsable de traitement** : `[À COMPLÉTER — société éditrice]`
**Contact** : `[À COMPLÉTER]`

## T1 — Gestion des comptes utilisateurs

| Champ | Valeur |
|---|---|
| Finalité | Création, authentification et gestion des comptes acheteurs/producteurs |
| Base légale | Exécution du contrat (CGU) |
| Données | Email, nom, prénom, téléphone, WhatsApp, pays, ville, rôle, langue préférée |
| Personnes concernées | Utilisateurs inscrits |
| Destinataires | Personnel autorisé ; sous-traitant : Supabase (hébergement UE) |
| Durée de conservation | Durée de vie du compte ; suppression en self-service (Paramètres) |
| Sécurité | Authentification Supabase Auth, RLS par utilisateur, chiffrement transit/repos |

## T2 — Profils producteurs et vérification

| Champ | Valeur |
|---|---|
| Finalité | Vérification d'identité et de conformité des vendeurs (KYC plateforme, Trust Center) |
| Base légale | Exécution du contrat + intérêt légitime (confiance de place de marché) |
| Données | Pièces d'identité, documents d'entreprise, certificats, photos d'exploitation, données sociales déclarées |
| Durée | Durée du compte + `[À VALIDER : durée de conservation post-suppression pour les documents de vérification]` |
| Sécurité | Buckets de stockage privés (identity-documents, certifications, business-documents), accès admin uniquement |

## T3 — Transactions (devis, commandes, paiements)

| Champ | Valeur |
|---|---|
| Finalité | Gestion du cycle devis → commande → livraison → règlement |
| Base légale | Exécution du contrat ; obligation légale (conservation comptable) |
| Données | Contenu des devis/commandes, montants, références de paiement (référence virement ou identifiant PaymentIntent Stripe — **jamais de numéro de carte**, traité exclusivement par Stripe) |
| Destinataires | Parties à la transaction ; Stripe (paiement en ligne) |
| Durée | 10 ans (obligation comptable) ; anonymisation du lien utilisateur à la suppression du compte |

## T4 — Messagerie interne

| Finalité | Communication acheteur ↔ producteur |
| Base légale | Exécution du contrat |
| Données | Contenu des messages, fichiers joints |
| Durée | Durée du compte ; contenus émis supprimés avec le compte |

## T5 — Notifications et e-mails transactionnels

| Finalité | Information des utilisateurs sur l'activité de leur compte (devis, commandes, messages) |
| Base légale | Exécution du contrat |
| Données | Email, langue, événement, contenu de la notification ; journal d'envoi (email_log) |
| Destinataires | Resend (routage e-mail, USA — `[À VALIDER : clauses contractuelles types / DPF]`) |
| Durée | Journal d'envoi : `[À DÉFINIR — proposition 12 mois]` |

## T6 — Données de navigation

| Finalité | Fonctionnement technique (session, langue) |
| Base légale | Intérêt légitime (strictement nécessaire) |
| Données | Jeton de session (stockage local), préférence de langue. **Aucun cookie publicitaire ou analytics tiers à ce jour.** |
| Durée | Session / jusqu'à suppression par l'utilisateur |

## Droits des personnes (implémentés)

- **Accès / portabilité** : export JSON en self-service (Paramètres → Confidentialité)
- **Effacement** : suppression de compte en self-service
- **Rectification** : édition du profil en self-service
- Autres demandes : formulaire de contact

## Sous-traitants

| Sous-traitant | Rôle | Localisation | Garanties |
|---|---|---|---|
| Supabase | Hébergement BDD/auth/stockage | UE (AWS eu-central-1) | DPA Supabase `[À ANNEXER]` |
| Vercel | Hébergement front | USA/CDN mondial | DPA Vercel `[À ANNEXER]` |
| Resend | E-mails transactionnels | USA | DPA Resend `[À ANNEXER]` |
| Stripe | Paiement en ligne | Irlande (UE) | DPA Stripe `[À ANNEXER]` |
