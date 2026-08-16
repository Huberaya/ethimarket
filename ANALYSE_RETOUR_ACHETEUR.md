# 📋 Analyse du retour du premier acheteur — État vs Demandes

Audit réalisé le 16/08/2026 contre `main` (commit 95bdbd2).

## ✅ Déjà construit (7 points sur 11)

| # | Demande | État | Où |
|---|---------|------|-----|
| 2 | Moteur de recherche 17 facettes + langage naturel + alternatives | ✅ Complet | `productSearchEngine`, `search/`, RPC `search_products_v2` |
| 4 | Trust Center sourcé (✅ Certifié / ⚠️ Déclaration fournisseur) | ✅ Complet | `trust/`, `product_claims`, moteur SQL + triggers anti-fraude |
| 7 | Comparateur visuel + Recommandation IA + fiche justificative | ✅ Complet | `procurementComparator`, `ProcurementComparisonModal` |
| 10 | Espace « Mes achats » (fournisseurs/produits/achats) | ✅ Complet | `BuyerWorkspace`, 5 tables `buyer_*` |
| 11 | Apprentissage des décisions + pondérations personnalisées | ✅ Complet | `computeLearnedProfile`, `effectiveWeights` |
| 3 | Fiche produit avec scores | ⚠️ Partiel | Score global + sections existent, mais **pas de Responsibility Score décomposé en 6 critères ni de « Points d'attention »** |
| 6 | Alertes | ⚠️ Partiel | Alertes email de recherches sauvegardées seulement — **pas d'alertes fournisseur/certification/risque/opportunité** |

## ❌ Manquant (l'objet de ce chantier)

| # | Demande | Manque |
|---|---------|--------|
| 1 | **Cockpit acheteur** « Aujourd'hui » | Aucun : le dashboard acheteur est une page d'accueil statique. Il faut les compteurs temps réel : fournisseurs à risque, certifications qui expirent sous 30 j, documents à vérifier, achats en cours, score portefeuille, nouvelles alternatives, réévaluations dues |
| 3 | **Responsibility Score décomposé** (Environnement/Social/Traçabilité/Certifications/Logistique/Fournisseur) + **Points d'attention** | Moteur de scoring 6 critères explicable + affichage fiche produit |
| 5 | **IA acheteur** : « Trouve-moi 10 fournisseurs européens, 5000 u/mois, score > 80, < 8 € » → « 23 trouvés, 8 conformes, voici les 5 meilleurs » | Le parser comprend les critères produits mais il n'y a **pas de moteur de sourcing fournisseurs** avec entonnoir trouvés → conformes → shortlist |
| 6 | **Alertes proactives** 🔴 fournisseur / 🟠 risque / 🟢 opportunité | Moteur de génération d'alertes + affichage cockpit |
| 8 | **Bouton « Trouver mieux »** (moins cher, plus responsable, plus local, mieux certifié, mieux traçable, moins risqué, plus dispo) | Le moteur d'alternatives existe mais pas le bouton 7-dimensions avec verdict « 3 alternatives supérieures trouvées » |
| 9 | **Coffre-fort documentaire intelligent** | Rien côté acheteur : dépôt de documents + extraction automatique (certification → date → organisme → périmètre → expiration) + détection « information manquante » |

## 🔧 Plan de ce chantier (dans l'ordre de valeur)

1. **Responsibility Score 6 critères + Points d'attention** (`responsibilityScore.ts` + section fiche produit) — la brique 4 du MVP, réutilisée partout ensuite.
2. **Moteur d'alertes** (`alertsEngine.ts` + table `buyer_alerts`) : expiration certifications, risques Trust Center, opportunités d'alternatives, réévaluations fournisseurs dues.
3. **Cockpit « Aujourd'hui »** : remplace l'accueil acheteur, agrège alertes + compteurs.
4. **Bouton « Trouver mieux »** (`findBetterEngine.ts` + intégration fiche produit) : 7 dimensions, verdict chiffré.
5. **IA acheteur — sourcing fournisseurs** (`supplierSourcing.ts` + parsing des missions) : entonnoir trouvés → conformes → top 5, avec raisons d'exclusion.
6. **Coffre-fort documentaire** (`documentVault.ts` + table + page) : extraction locale par règles (zéro API), champs manquants signalés.

Tout en local/gratuit (règles + dictionnaires), IA gratuite optionnelle comme pour le reste.
