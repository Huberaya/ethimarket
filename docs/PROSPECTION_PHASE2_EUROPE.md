# Prospection — Phase 2 Europe

Mise à jour : 7 septembre 2026.

## Base intégrée

La phase 2 contient **13 000 acheteurs professionnels préqualifiés** dans six marchés prioritaires :

| Pays | Acheteurs |
|---|---:|
| Allemagne | 3 500 |
| Espagne | 2 500 |
| Italie | 2 500 |
| Belgique | 2 000 |
| Pays-Bas | 1 500 |
| Suisse | 1 000 |
| **Total** | **13 000** |

Les données sont visibles immédiatement dans `/admin/prospection` → **Acheteurs** → **Phase 2**, classées par pays puis par ville.

## Segments

- restaurants, traiteurs et hôtels ;
- magasins bio et épiceries ;
- concept stores et boutiques responsables ;
- beauté naturelle et bien-être ;
- mode et accessoires responsables ;
- grossistes, revendeurs et distributeurs ;
- entreprises, événementiel et associations.

## Données disponibles

Chaque fiche comporte, selon publication : nom commercial, pays, région, ville, adresse professionnelle, site, email, téléphone, LinkedIn, catégorie source, produits probables, score de qualité, URL source et date de collecte.

Le catalogue embarqué est `public/data/prospects-europe-phase2.json`. La migration idempotente `supabase/migrations/20260907170000_europe_phase2_buyers.sql` permet de rendre les fiches persistantes dans Supabase sans écraser le pipeline commercial existant.

## Qualification avant contact

Ce lot est **préqualifié**, mais ne doit pas être présenté comme légalement validé :

1. vérifier la raison sociale et l’état actif dans le registre national ;
2. contrôler le numéro de TVA dans VIES lorsqu’il est publié ;
3. confirmer que le contact appartient toujours à l’entreprise ;
4. prioriser les comptes dont le catalogue et le canal correspondent à l’offre réellement disponible ;
5. respecter les règles nationales de prospection et toute opposition.

La découverte repose sur Overture Maps Places 2026-08-19 et des coordonnées professionnelles rendues publiques. Les produits probables sont des hypothèses de qualification, pas une intention d’achat.
