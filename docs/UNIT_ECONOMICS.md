# ETHIMARKET — UNIT ECONOMICS DÉTAILLÉE

## v1.0, septembre 2026 — le modèle chiffré, hypothèse par hypothèse

*Approfondit le §8 du plan stratégique. Chaque nombre est soit sourcé, soit
une HYPOTHÈSE marquée avec sa plage et son jalon de validation. Ce document
existe pour être CORRIGÉ par les données réelles de la phase 1 — pas pour
avoir raison. Les KPI correspondants sont suivis dans /admin/croissance et
/admin (Cockpit).*

---

# 1. LE PANIER — ce qu'un acheteur dépense

## 1.1 Panier moyen par segment (hypothèses, plan §8.2)

| Segment | Panier type | Fréquence/an | Volume annuel/client | Confiance |
|---|---|---|---|---|
| Torréfacteur artisanal | 1 500 € (2-5 sacs de vert) | 8-12 | 12 000-18 000 € | moyenne — à valider M3 |
| Épicerie bio indépendante | 250 € (carton mixte) | 6-8 | 1 500-2 000 € | moyenne |
| Restaurant/pâtissier | 180 € (vanille/safran/huiles) | 4-6 | 700-1 100 € | basse |
| Chocolatier bean-to-bar | 800 € (fèves 100-125 kg) | 5-6 | 4 000-5 000 € | basse |
| Grossiste (M8+) | 5 000 €+ (palette) | 6-12 | 30 000 €+ | basse — 1 seul suffit à tout changer |

**Panier moyen pondéré retenu : 600 €** (mix cible M12 : ~30 % torréfacteurs,
~45 % épiceries, ~25 % autres). Jalon : recalculer à M6 avec les paniers réels.

## 1.2 Sensibilité — pourquoi le mix client est LA variable

À commission 5 %, une commande rapporte : torréfacteur 75 €, épicerie
12,50 €, restaurant 9 €. **Décision confirmée : les torréfacteurs sont
le segment tête de pont** — un seul torréfacteur actif ≈ 8 épiceries en
revenu commission. Les épiceries restent stratégiques pour la marque
propre (M12+) où la marge est 7 à 10 fois supérieure.

---

# 2. LES REVENUS PAR CLIENT — LTV par étage

## 2.1 Étage 1 : commission seule (M1-M6)

- LTV brute annuelle = 600 € × 8 commandes × 5 % = **240 €/an**
- Rétention espérée 2,5 ans → **LTV ≈ 600 €** *(hypothèse : la rétention
  B2B fournisseur est structurellement élevée SI la qualité suit — mesurée
  dès M4 par la rétention M2 ≥40 %)*

## 2.2 Étage 2 : + services (M6+)

- Logistique groupée : marge 8-12 % sur le fret refacturé — sur un client
  torréfacteur (~1 200 €/an de fret), +100-150 €/an. *Hypothèse.*
- Dossiers conformité premium (EUDR pack, COI express) : 25-60 €/dossier.
- **LTV étage 2 ≈ 750-800 €/an-client torréfacteur.**

## 2.3 Étage 3 : + abonnement producteur Verified+ (M9+)

- 19-39 €/mois côté PRODUCTEUR (mise en avant, analytics, badge enrichi).
- Hypothèse de conversion : 25-35 % des producteurs actifs à M18.
- 20 producteurs abonnés × 29 € = **580 €/mois de MRR** — petit mais à
  marge ~100 %, et c'est le revenu le plus prévisible du modèle.

## 2.4 Étage 4 : marque propre « Ethimarket Origine » (M12+)

- MB 35-50 % sur le prix de vente épicerie (vs 5 % de commission).
- Un carton de 12 pots de safran (PV 300 €) = 105-150 € de marge brute —
  l'équivalent de 8-12 commandes d'épicerie en commission.
- C'est l'étage qui change le point mort (voir §5).

---

# 3. LE COÛT D'ACQUISITION — CAC par canal

| Canal | Coût/client estimé | Base de calcul | Statut |
|---|---|---|---|
| Outbound fondateur (e-mail+appel) | 30-60 € | 4-8 h de travail à coût d'opportunité ~8 €/h utile ; conversion contacts→client 5-10 % (kit §A) | ACTIF — le canal P0 |
| Visites terrain Nantes/Ouest | 40-80 € | essence + temps ; conversion élevée en face-à-face | ACTIF |
| SEO (16 articles, 5 langues) | ~0 € marginal → tend vers 10-20 € | coût déjà payé ; trafic composé à 12 mois | PLANTÉ — mesure M9 |
| Badges producteurs (growth loop) | ~0 € | backlinks + referral mesuré utm_source=badge | ACTIF depuis #4 |
| Referral B2B (M6+) | ~75 € | 1 mois de commission offerte au parrain (240/12×~3) | À LANCER M6 |
| Salons en visiteur | 10-25 € | 0 € d'entrée, ~30 contacts qualifiés/salon, conversion ~10 % | 4 salons sept.-oct. 2026 |
| Publicité payante | ≥300 € (inconnu réel) | benchmarks B2B food ; AUCUNE donnée propre | ÉCARTÉ avant M9 (plan §9.1) |

**CAC max acceptable : 150 €** (LTV/CAC ≥ 4 sur l'étage 1 seul).
**CAC cible blended M12 : ≤60 €** tant que le mix reste outbound+terrain.

## 3.1 Le coût caché n°1 : la vérification producteur

- 2-4 h/dossier (registres, appel vidéo, défi photo) ≈ **80-150 €/producteur**.
- Amortie si le producteur génère ≥3 k€ GMV/an (150 € ÷ 5 %).
- KPI Cockpit dès M3 : GMV/producteur vérifié. Un producteur vérifié qui ne
  vend pas est une perte sèche → la vérification suit la demande (on vérifie
  les filières que les acheteurs demandent), jamais l'inverse.

---

# 4. LES COÛTS FIXES — la structure ultra-légère

| Poste | Aujourd'hui | M12 (scénario réaliste) |
|---|---|---|
| Infrastructure (Supabase/Vercel/Resend) | 0 € (tiers gratuits) | 100-200 €/mois |
| Outils (domaine, e-mail pro, compta) | ~0 € | 150-300 €/mois |
| Fondateur | 0 € (non salarié) | 0-1 500 €/mois selon trésorerie |
| Déplacements/échantillons/dégustations | ~0 € | 300-500 €/mois |
| **Total burn** | **~0 €** | **~800-2 500 €/mois** |

C'est LE choix structurant : à ~800 €/mois de coûts, la survie ne dépend
d'aucun investisseur. Le plan §8.2 retient ~800 €/mois d'outils/infra
comme base année 1.

---

# 5. LE POINT MORT — trois façons de l'atteindre

## 5.1 Commission seule (étage 1)
800 €/mois ÷ 5 % = **16 k€ GMV/mois** pour couvrir les outils ;
~45-60 k€ GMV/mois pour couvrir outils + un fondateur payé (plan §8.2).

## 5.2 Avec services + abonnements (étages 2-3, M9+)
Si 20 producteurs Verified+ (580 €/mois) + services (~300 €/mois),
le GMV de point mort « outils » descend à **~0-5 k€/mois** : les revenus
récurrents couvrent la base. C'est le scénario visé fin d'année 1.

## 5.3 Avec marque propre (étage 4, M12+)
Chaque 1 000 € de CA marque propre ≈ 400 € de MB ≈ l'équivalent de 8 000 €
de GMV marketplace. 3-4 k€/mois de CA marque propre suffisent à payer un
fondateur — d'où sa place dans le plan malgré le stock qu'elle exige.

## 5.4 Les scénarios M12 relus à cette lumière (plan §8.3)

| Scénario | GMV/mois M12 | Revenu estimé/mois | Lecture |
|---|---|---|---|
| Conservateur | 15 k€ | ~1 k€ (commission + petits services) | survie : pivot pricing obligatoire, les étages 2-3 deviennent urgents |
| **Réaliste** | **40 k€** | **~3-4 k€** (commission 2 k€ + services + premiers abonnements) | le seed se raconte, le fondateur se paie partiellement |
| Ambitieux | 90 k€ | ~8-10 k€ | pré-seed sursouscrit, recrutement n°1 |

---

# 6. LA COHORTE TYPE — un torréfacteur sur 30 mois (modèle)

| Mois | Événement | Cash EthiMarket |
|---|---|---|
| M0 | acquisition (outbound) | -45 € (CAC) |
| M1 | échantillon puis 1re commande 900 € | +45 € |
| M2-M12 | 7 commandes (moy. 1 400 €) | +490 € |
| M6+ | logistique groupée sur 5 envois | +60 € |
| M13-M30 | 12 commandes + services | +900 € |
| **Total 30 mois** | | **≈ +1 450 € net** (LTV/CAC ≈ 33 sur la durée si la rétention tient) |

*Modèle illustratif — les deux hypothèses fragiles sont la fréquence (8+/an)
et la rétention (2,5 ans). Les jalons M4 (rétention M2) et M6 (fréquence
réelle) les corrigeront.*

---

# 7. TABLEAU DE BORD DES HYPOTHÈSES — quoi valider, quand

| # | Hypothèse | Valeur retenue | Jalon | Où c'est mesuré |
|---|---|---|---|---|
| H1 | Panier moyen blended | 600 € | M6 | /admin/croissance (AOV) |
| H2 | Fréquence torréfacteur | 8-12/an | M6-M9 | commandes/acheteur |
| H3 | Rétention M2 | ≥40 % | M4 | cohortes croissance |
| H4 | Conversion outbound | 5-10 % contacts→client | M3 | CRM (inscrit/contacté) |
| H5 | CAC blended | ≤60 € | M6 | temps passé / clients |
| H6 | GMV/producteur vérifié | ≥3 k€/an | M6 | Cockpit |
| H7 | Conversion Verified+ | 25-35 % | M18 | abonnements |
| H8 | Marge logistique groupée | 8-12 % | M8 | 1res consolidations |

**Règle de gouvernance : toute hypothèse invalidée à son jalon déclenche
une révision du plan au Cockpit — pas à la fin de l'année.**
