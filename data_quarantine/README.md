# Quarantaine — migrations SQL non appliquées (7 sept. 2026)

## Historique
Le 7 sept. 2026, un agent a ajouté 31 000 prospects en 3 catalogues JSON + 3
migrations SQL. Après audit, les catalogues **Europe** et **Monde** avaient été
mis en quarantaine ici ; **sur décision de Hubert**, ils ont été **réintégrés**
le jour même comme viviers en consultation (`public/data/`), après nettoyage
des fiches hors-sujet (tattoo, ongleries, auto, banques… : 202 retirées côté
Europe, 467 côté Monde) et avec un **avertissement affiché dans l'admin** :
les e-mails de ces deux viviers sont déduits des domaines des sites (source
Overture Maps) et doivent être vérifiés avant tout envoi. À la promotion d'une
fiche vers le pipeline, cette mention est recopiée dans les notes.

## Contenu restant en quarantaine

| Fichier | Raison |
|---|---|
| `20260907153000_france_5000_verified_buyers.sql` | Migration jamais appliquée. Les viviers JSON suffisent en consultation ; import massif en base = décision explicite requise. |
| `20260907170000_europe_phase2_buyers.sql` | Idem — retirée de `supabase/migrations/` pour éviter une exécution accidentelle par `db push` (et son contenu n'est pas nettoyé des hors-sujet). |
| `20260907190000_north_america_phase3_buyers.sql` | Idem. |

Le circuit officiel pour rendre une fiche actionnable est le bouton
« Ajouter au pipeline » de `/admin/prospection` (traçabilité SIREN/external_id
dans `source`, avertissement e-mail dans `notes`).
