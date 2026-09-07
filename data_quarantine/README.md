# Quarantaine — données de prospection générées par agent (7 sept. 2026)

Contenu mis en quarantaine après audit qualité (décision CSO) :

| Fichier | Problème |
|---|---|
| `prospects-europe-phase2.json` (13 000) | E-mails **déduits** des domaines des sites (info@…), non vérifiés — contraire à la politique d'honnêteté. ~3-5% de fiches hors-sujet (Mercedes-AMG Motorsport, Sparkasse, chauffagistes…). Hors périmètre du PLAN_CONQUETE (garde-fou : pas d'extension sans jalon). |
| `prospects-north-america-phase3.json` (13 000) | Idem + le plan valide l'Allemagne comme cible phase 3, pas l'Amérique du Nord. |
| `20260907153000_france_5000_verified_buyers.sql` | Migration jamais appliquée. Le catalogue JSON nettoyé (public/data) suffit en consultation ; import en base = décision explicite requise. |
| `20260907170000_europe_phase2_buyers.sql` | Jamais appliquée — retirée de migrations/ pour éviter une exécution accidentelle par `db push`. |
| `20260907190000_north_america_phase3_buyers.sql` | Idem. |

Le catalogue **France** (public/data/prospects-france-5000.json, 4 946 fiches après
nettoyage de 54 hors-sujet/mauvais appariements SIRENE) reste actif en
consultation seule dans /admin/prospection : sources traçables ligne à ligne
(BANCO/OSM ODbL + SIRENE + sites officiels).

Réhabilitation possible : re-vérification des e-mails EU par lots + décision
d'extension géographique actée dans PLAN_STRATEGIQUE_ETHIMARKET.md.
