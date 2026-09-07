# Prospection — Phase 3 Amérique du Nord

Mise à jour : 7 septembre 2026.

## Base intégrée

La phase 3 contient **13 000 acheteurs professionnels préqualifiés** :

| Pays | Acheteurs |
|---|---:|
| États-Unis | 10 000 |
| Canada | 3 000 |
| **Total** | **13 000** |

Les données sont accessibles dans `/admin/prospection` → **Acheteurs** → **Phase 3**, classées par pays puis par ville.

## Bassins urbains couverts

### États-Unis

New York, Los Angeles, Chicago, San Francisco et la Bay Area, Boston, Seattle et leurs zones métropolitaines.

### Canada

Toronto, Montréal, Vancouver, Calgary et Ottawa, ainsi que leurs zones métropolitaines.

## Segments

- restaurants, traiteurs et hôtels ;
- magasins bio et épiceries ;
- concept stores et boutiques responsables ;
- beauté naturelle et bien-être ;
- mode et accessoires responsables ;
- grossistes, importateurs, revendeurs et distributeurs ;
- entreprises, événementiel et associations.

## Données et intégration

Chaque fiche comporte selon publication : nom commercial, pays, État/province, ville, adresse professionnelle, site, email, téléphone, LinkedIn, segment, produits probables, score de qualité, URL source et date de collecte.

- Catalogue visible sans migration : `public/data/prospects-north-america-phase3.json`
- Migration Supabase idempotente : `supabase/migrations/20260907190000_north_america_phase3_buyers.sql`

L’interface charge désormais le catalogue de chaque phase à la demande afin de ne pas télécharger simultanément les 31 000 fiches des trois phases.

## Contrôles avant campagne

Le lot est préqualifié mais l’entité légale n’est pas encore validée individuellement. Avant contact :

1. vérifier l’entité et l’activité dans le registre de l’État américain ou de la province canadienne ;
2. confirmer que le domaine, l’email et le téléphone sont toujours utilisés par l’établissement ;
3. identifier le rôle d’achat pertinent sans deviner de données personnelles ;
4. appliquer CAN-SPAM aux États-Unis et CASL au Canada ;
5. conserver les oppositions et désinscriptions dans le statut `STOP` du CRM.

Source de découverte : Overture Maps Places, version 2026-08-19. Les produits probables sont des hypothèses de qualification et ne prouvent aucune intention d’achat.
