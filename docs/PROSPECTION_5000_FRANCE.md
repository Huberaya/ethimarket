# Base de prospection — 5 000 acheteurs France

Mise à jour : 7 septembre 2026.

## Intégration

La migration `supabase/migrations/20260907153000_france_5000_verified_buyers.sql` :

- étend `prospects` avec l’identité légale, SIREN/SIRET, région, adresse, fonction du décideur, LinkedIn, produits probables, URLs sources et date de vérification ;
- crée des index sur `external_id`, la région et le SIREN ;
- ajoute 5 000 acheteurs français actifs ;
- est idempotente et actualise les données publiques sans écraser le statut commercial, les prochaines actions ou l’historique des contacts.

Appliquer les migrations Supabase selon la procédure habituelle du projet (`supabase db push` sur l’environnement cible).

## Répartition

| Segment CRM | Nombre |
|---|---:|
| Restaurants et traiteurs | 1 600 |
| Magasins bio et épiceries | 1 500 |
| Concept stores et boutiques responsables | 750 |
| Beauté naturelle et bien-être | 500 |
| Mode et accessoires responsables | 400 |
| Grossistes, revendeurs et distributeurs | 250 |
| **Total** | **5 000** |

## Complétude

- Raison sociale : 4 993
- Site public : 4 623
- Email professionnel public : 3 591
- Téléphone professionnel public : 4 813
- Décideur/fonction publics : 544
- LinkedIn professionnel public : 985
- Établissement et unité légale actifs : 5 000

## Interface admin

L’onglet `/admin/prospection` comprend désormais :

- compteurs de couverture email, téléphone et LinkedIn ;
- filtres segment, région, ville et statut ;
- recherche par enseigne, raison sociale, SIREN, SIRET, contact ou email ;
- pagination de 100 lignes pour garder l’interface fluide ;
- fiche enrichie avec identité légale, territoire, décideur public, produits probables et liens vers les sources ;
- conservation du pipeline et du journal de contact existants.

## Sources et usage

Données commerciales issues de BANCO/OpenStreetMap (ODbL), identité et activité issues de SIRENE, compléments relevés sur les sites professionnels publics. Les produits probables sont des hypothèses de qualification et non une intention d’achat.

Avant prospection : vérifier la pertinence du contact, informer de la source, proposer une opposition simple et respecter toute demande `STOP` dans le CRM.
