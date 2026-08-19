# Stratégie logistique EthiMarket — du producteur au client, de A à Z

*Version 1.0 — août 2026. Étude et recommandation ferme. Sources : grilles
tarifaires 3PL France 2025-2026, données Colissimo/ADEME, règlement bio (UE)
2018/848, pratique des marketplaces comparables (Faire, Amazon, ManoMano).*

---

## 0. Résumé de la position (pour décider en 2 minutes)

**Le modèle recommandé : « Hub de consolidation léger », en 3 étages
progressifs. Jamais d'entrepôt en propre. Jamais de stock possédé par
EthiMarket.**

1. **Aujourd'hui → ~30 commandes/jour** : expédition directe producteur →
   acheteur pour le B2B (ce qu'on fait déjà, outillé par le dossier de lot).
   Pour le B2C : **stock avancé en consignation** chez UN prestataire
   logistique (3PL) français **certifié bio**, limité aux 20 meilleures
   références. Coût fixe quasi nul (~200-400 €/mois), coût variable
   ~6-8 €/colis tout compris.
2. **~30 → 500 commandes/jour** : le même 3PL devient **hub de
   consolidation** : groupage maritime (LCL) par corridor d'origine,
   cross-dock B2B (la palette repart sans être stockée), fulfillment B2C,
   emballage éco, livraison verte par défaut (point relais + cyclologistique
   Colissimo).
3. **500 → plusieurs milliers/jour** : duplication du modèle avec un **2e hub
   Benelux/Rhénanie** (la « banane dorée » : 170 M de consommateurs à 24 h de
   camion), TVA locale via l'OSS, multi-transporteurs, report modal
   (rail/barge). Toujours en 3PL, toujours sans actif immobilier.

**Ce qu'on refuse explicitement** : construire ou louer un entrepôt en propre
(bail 3-6-9, 10-20 k€/mois de coûts fixes, rentable seulement au-delà de
5 000 colis/mois ET avec un volume prévisible — nous n'avons ni l'un ni
l'autre au lancement) ; le dropshipping international par colis unitaire
pour le B2C (un colis Éthiopie→Paris en express coûte 40-80 €, délai 5-15
jours, expérience client désastreuse, bilan carbone aérien indéfendable pour
une marketplace « éthique »).

---

## 1. Le point de départ : ce que nous sommes vraiment

Toute la stratégie découle de 5 réalités de notre marketplace :

| Réalité | Conséquence logistique |
|---|---|
| Producteurs en Afrique/Asie/Amérique latine (12 pays) | L'international est AMONT (producteur→UE), pas aval. Le maritime groupé est la seule voie rentable et écologique |
| Produits secs, non périssables, à forte valeur/kg (café, cacao, épices, vanille, huiles) | Pas de chaîne du froid = 3PL standard suffit ; la vanille (14 000 €/kg pour la Bourbon) supporte n'importe quel coût logistique |
| Deux clientèles : B2B (restaurants, épiceries — palettes/cartons) et B2C (particuliers — colis <2 kg) | Deux circuits distincts qui partagent le même hub, PAS le même transport aval |
| Positionnement bio/éthique vérifié | L'entrepôt DOIT être certifié bio (règl. 2018/848 : le stockage hors point de vente casse la chaîne de traçabilité sans certification) ; la livraison doit être décarbonée par défaut |
| Zéro capitaux lourds, croissance imprévisible | 100 % variable : on paie au colis et à la palette, on ne s'engage sur rien |

**Le principe directeur : masser l'international, localiser le dernier
kilomètre.** Un conteneur 20' transporte ~10 tonnes de café pour ~3 200 €
(0,32 €/kg) et ~25 g CO₂/kg. Le même kilo en colis aérien : ~25 €/kg et
~1 100 g CO₂. Le ratio est de 1 à 80 sur le coût et de 1 à 40 sur le
carbone. Toute la logistique se résume à : **faire franchir la frontière aux
produits en gros, et ne fractionner qu'une fois en Europe.**

---

## 2. Les 4 modèles possibles — et pourquoi trois sont éliminés

### ❌ Modèle A : dropshipping international (le producteur expédie chaque commande)
- B2C : 40-80 €/colis express, 5-15 jours, dédouanement par colis (le client
  reçoit une facture de TVA surprise de DHL = conversion tuée), aérien
  quasi-obligatoire. **Éliminé pour le B2C.**
- B2B : c'est différent — une palette ou un lot complet producteur→acheteur
  professionnel est légitime (l'acheteur est importateur, notre feuille de
  route export l'outille déjà). **Conservé pour le B2B, c'est notre modèle
  actuel.**

### ❌ Modèle B : entrepôt en propre
15 000-50 000 € d'investissement initial, 10-20 k€/mois de coûts fixes, bail
3-6-9, un préparateur = 3 600 €/mois chargé. Point mort ≈ 5 000 colis/mois
CONSTANTS. Le taux d'erreur d'une équipe débutante (2-5 %) est 4 à 10 fois
celui d'un 3PL professionnel (<0,5 %). **Éliminé — c'est le piège classique
de la marketplace qui se prend pour un distributeur.**

### ❌ Modèle C : full marketplace à la Amazon FBA (nous devenons opérateur logistique pour compte de tiers, multi-entrepôts, propriété du stock)
C'est le modèle cible… dans 5 ans. Le construire maintenant, c'est
immobiliser du capital dans du stock (nous ne voulons PAS acheter la
marchandise : notre neutralité de tiers de confiance est notre fonds de
commerce) et de l'infrastructure avant d'avoir le volume. **Éliminé à ce
stade, mais le modèle retenu y mène par paliers sans rien jeter.**

### ✅ Modèle D (RETENU) : hub de consolidation léger en 3PL certifié bio, stock en consignation
Le producteur **reste propriétaire** de sa marchandise jusqu'à la vente
(consignation). EthiMarket orchestre : groupage amont, entrepôt mutualisé,
fulfillment, transport aval — et refacture au réel avec une marge de
service. Nous restons une marketplace : **nous vendons de la confiance et de
l'orchestration, pas des produits.**

---

## 3. Le modèle retenu, étage par étage

### ÉTAGE 1 — Lancement (maintenant → ~30 commandes/jour, ~900/mois)

**B2B (déjà en production)** : expédition directe producteur → acheteur.
- L'acheteur est importateur (Incoterm FOB/CIF recommandé par notre feuille
  de route export existante).
- Le dossier documentaire par lot (phyto, COI bio, COA…) est déjà verrouillé
  dans l'app ; le QR de traçabilité suit le lot.
- Rôle d'EthiMarket : zéro manutention, 100 % information. C'est déjà notre
  force et ça ne coûte rien.

**B2C (à lancer)** : stock avancé en consignation chez UN 3PL français
certifié bio (FR-BIO).
- **Sélection** : 15-20 références « best-sellers » (café Yirgacheffe, cacao,
  vanille, huile d'argan…), 1 à 2 palettes chacune. Critère d'entrée d'un
  produit au hub : niveau de confiance ≥ Argent du producteur + dossier de
  conformité complet (nos exigences existantes deviennent le ticket
  d'entrée physique).
- **Approvisionnement** : le producteur groupe son envoi avec ses commandes
  B2B existantes ou expédie 1-2 palettes en LCL (90 €/m³, 35-40 jours). Le
  dédouanement se fait UNE fois par lot (transitaire + représentation
  fiscale, TVA à l'import autoliquidée en France — pas d'avance de
  trésorerie).
- **Propriété** : consignation. Le producteur est payé à la vente, au même
  rythme que le circuit actuel. EthiMarket ne possède jamais le stock.
- **Contrat 3PL type (grilles France 2025-2026)** :
  - stockage : 12-18 €/palette/mois → 20 palettes ≈ **300 €/mois**
  - réception : 3-5 €/palette
  - pick & pack : 1,5-2,5 €/commande
  - emballage éco (carton recyclé, calage papier) : 0,3-0,5 €
  - expédition France <2 kg : 4,5-6,5 € (tarifs négociés 3PL, point relais
    moins cher que domicile)
  - **coût logistique complet par colis B2C : 6,5-9 €** → sur un panier
    moyen cible de 45 €, c'est 14-20 %, absorbable par des frais de port
    facturés 4,90-6,90 € + franco à 59 €.
- **Prestataire** : un 3PL alimentaire certifié bio (obligatoire — règl.
  2018/848 art. 34/35 : l'entreposage hors point de vente exige la
  certification de l'opérateur de stockage). Candidats français à consulter :
  les 3PL e-commerce alimentaires certifiés Ecocert/Bureau Veritas (XPO,
  Brangeon et une dizaine de 3PL indépendants le sont ; le sourcing précis =
  action n°1 du plan, section 6). Localisation cible : axe Lille-Paris-Lyon,
  près d'un hub Colissimo.
- **EthiMarket doit aussi se notifier à l'Agence Bio et se certifier**
  (opérateur « distributeur » stockant hors point de vente) : ~400-800 €/an.
  C'est cohérent avec notre discours : nous exigeons des preuves des
  producteurs, nous nous appliquons la même règle.

**Coûts fixes totaux de l'étage 1 : < 700 €/mois** (stockage + notre
certification bio + abonnement WMS du 3PL). Point mort : ~5 commandes
B2C/jour. Risque : quasi nul, réversible en 30 jours (pas d'engagement).

### ÉTAGE 2 — Croissance (~30 → 500 commandes/jour)

Le même 3PL, trois mécanismes en plus :

1. **Groupage amont organisé par corridors** : au lieu que chaque producteur
   se débrouille, EthiMarket affrète un conteneur partagé par corridor et
   par cadence : Mombasa (Kenya/Éthiopie via Addis-Djibouti) mensuel,
   Tema (Ghana/Côte d'Ivoire) mensuel, Cochin (Inde/Sri Lanka) mensuel,
   Callao (Pérou) bimestriel. Les producteurs livrent l'entrepôt du
   transitaire au port (notre annuaire l'indiquera). Gain : 90 €/m³ (LCL
   mutualisé) au lieu de 150-250 €/m³ (LCL au détail), et surtout UN SEUL
   dédouanement, UN SEUL contrôle SPS, UN SEUL COI bio par conteneur —
   nos exigences documentaires par lot (déjà dans l'app) deviennent la
   check-list d'embarquement.
2. **Cross-dock B2B** : les commandes B2B des acheteurs européens qui ne
   veulent pas importer eux-mêmes transitent par le hub SANS stockage
   (déchargées, re-étiquetées, réexpédiées en 24-48 h en palette ou
   demi-palette par affrètement). Le hub débloque ainsi le segment des
   acheteurs B2B « moyens » (5-50 kg) trop petits pour importer, trop gros
   pour des colis — aujourd'hui notre angle mort commercial.
3. **Aval vert par défaut** :
   - **Point relais par défaut** au checkout (moins cher ET -30 % de CO₂ vs
     domicile) ; domicile en option payante.
   - **Colissimo** comme transporteur principal : 357 g CO₂/colis (meilleur
     du marché), 80 % de livraison électrique/douce dans 22 métropoles fin
     2025, 1 000 vélos-cargos — la cyclologistique sans la gérer nous-mêmes.
   - **Affichage CO₂ réel au checkout** : nous avons déjà le moteur d'impact
     (ADEME) ; on affiche « ce colis : ~400 g CO₂, l'équivalent de 2 km en
     voiture » — transparence = différenciation.
   - Zéro plastique, cartons FSC recyclés, pas de suremballage (clause
     contractuelle 3PL).

**Économie unitaire cible à 200 commandes/jour** (mix 70 % B2C / 30 % B2B) :
coût logistique complet ~19 % du GMV B2C, ~6 % du GMV B2B, financé par
frais de port + une « part logistique » de 3-5 points intégrée à la
commission sur les produits servis par le hub (le producteur économise
symétriquement ses coûts d'expédition unitaires : l'opération est neutre ou
positive pour lui).

### ÉTAGE 3 — Échelle européenne (500 → plusieurs milliers de commandes/jour)

1. **2e hub Benelux/Rhénanie** (Venlo, Liège ou la Ruhr) : 170 M de
   consommateurs à 24 h. Les conteneurs Asie/Afrique de l'Est arrivent à
   Rotterdam/Anvers → hub Nord ; Amérique latine/Afrique de l'Ouest au
   Havre → hub France. Chaque hub sert sa moitié de l'Europe.
   Conséquence fiscale assumée : immatriculation TVA locale (NL ou BE/DE)
   dès qu'on y stocke + guichet OSS pour les ventes intra-UE (déjà
   documenté dans nos gabarits légaux).
2. **Répartition intelligente du stock** : les données de vente par pays
   (déjà en base) décident quel SKU dort dans quel hub. Règle simple au
   départ : un SKU est dupliqué quand un pays hors-France dépasse 30 % de
   ses ventes.
3. **Transport inter-hubs et B2B lourd en rail/barge** (Rotterdam→Lyon en
   barge = -80 % CO₂ vs camion), transporteurs verts nationaux en aval
   (DHL GoGreen en Allemagne, PostNL véhicules électriques aux Pays-Bas…).
4. **Le 3PL reste un 3PL.** À ce stade on négocie des tarifs dégressifs
   (à 3 000 colis/jour, le pick & pack descend sous 1,2 € et l'expédition
   sous 4 €), on ne construit toujours rien. L'option « entrepôt dédié
   opéré par le 3PL » (bâtiment à notre nom, exploitation externalisée)
   ne se discute qu'au-delà de ~10 000 colis/jour.

---

## 4. Les flux, concrètement (qui fait quoi)

```
AMONT (mensuel, massifié, maritime)
Producteur ──lot + dossier documentaire (app)──► Entrepôt transitaire au port
   └─ notre app vérifie : COI bio, phyto, COA si filière renforcée (DÉJÀ FAIT)
Transitaire ──conteneur groupé, 1 dédouanement──► Hub 3PL certifié bio (France)
   └─ réception structurée au hub : contrôle poids/étiquetage/DLUO,
      photos, saisie dans l'app (module « stock consigné » à construire)

AVAL B2C (quotidien, local, décarboné)
Commande client ──► API 3PL ──► pick/pack éco ──► Colissimo point relais (défaut)
   └─ QR de traçabilité du lot déjà imprimable ; e-mail « votre colis a
      voyagé en bateau, pas en avion : X g CO₂ » (moteur existant)

AVAL B2B (à la demande)
< 30 kg  : colis via hub (même circuit que B2C)
30-300 kg : demi-palette/palette, affrètement depuis le hub (cross-dock)
> 300 kg : direct producteur→acheteur (circuit actuel, dossier de lot)

RETOURS (B2C, produits secs)
Point relais → hub → contrôle → remise en stock si intact (3-5 €/retour)
   └─ alimentaire entamé non revendable : politique « remboursé sans
      retour » sous 30 € (le retour coûterait plus cher que le produit)
```

---

## 5. Ce que ça coûte, ce que ça rapporte (synthèse chiffrée)

| Poste | Étage 1 (900 cmd/mois) | Étage 2 (6 000 cmd/mois) | Étage 3 (60 000 cmd/mois) |
|---|---|---|---|
| Coûts fixes mensuels | < 700 € | ~2 500 € (2 corridors actifs) | ~15 000 € (2 hubs, équipe ops 2 pers.) |
| Coût variable/colis B2C | 6,5-9 € | 5,5-7,5 € | 4,5-6 € |
| Financement | Frais de port 4,90-6,90 € + franco 59 € | + part logistique 3-5 pts sur commission produits hub | idem, tarifs dégressifs |
| Investissement | 0 € (certification bio ~600 €) | ~10 k€ (dépôt garantie corridors, intégration API) | ~60 k€ (2e hub, TVA, intégrations) |
| Réversibilité | 30 jours | 90 jours | contrats annuels |

**La logistique s'autofinance à chaque étage** : c'est la conception même du
modèle (coût 100 % variable + frais de port + part logistique). Aucun étage
ne demande de lever du capital pour des murs ou du stock.

---

## 6. Plan de mise en œuvre de A à Z

### Trimestre 1 — poser l'étage 1
1. **Semaine 1-2 : appel d'offres 3PL** (l'action décisive). Cahier des
   charges : certification bio FR-BIO du site (éliminatoire), alimentaire
   sec, API/WMS ouvert, pas de minimum mensuel >300 €, colis ET palettes,
   emballage carton recyclé, proximité hub Colissimo. Consulter 5-6
   prestataires, exiger la grille complète (les frais cachés classiques :
   intégration 0-500 €, surcharge carburant, stockage longue durée).
2. **Semaine 2-3 : notification Agence Bio + engagement certification**
   d'EthiMarket (Ecocert ou Bureau Veritas, ~400-800 €/an).
3. **Semaine 3-6 : premier approvisionnement pilote** : 5 SKU, 5 palettes,
   un seul corridor (le plus mûr : Inde ou Éthiopie via transitaire LCL),
   représentation fiscale par le transitaire, TVA import autoliquidée.
4. **En parallèle, développement app (nos patterns existants suffisent)** :
   - module **« stock consigné »** : table stock par producteur×SKU au hub,
     décrément à la commande, seuil de réassort, relevé de consignation
     mensuel pour le producteur (= son paiement) ;
   - **réception structurée au hub** (notre réception 4 points existe déjà —
     on l'applique à l'entrée d'entrepôt) ;
   - checkout B2C : choix point relais (API Colissimo), affichage CO₂
     (moteur existant), frais de port par zone.
5. **Semaine 6-8 : ouverture B2C réelle** sur les SKU du hub, badge
   « Expédié sous 48 h depuis notre entrepôt bio certifié 🇫🇷 » sur les
   fiches produits concernées (différenciation immédiate vs les 3 semaines
   du dropshipping concurrent).

### Trimestre 2-3 — muscler (étage 2)
6. Corridor de groupage n°2 et n°3 (cadence mensuelle publiée dans l'app :
   « prochain départ Mombasa : 15 du mois » — le producteur réserve son
   volume comme on réserve un train).
7. Cross-dock B2B (offre « livré Europe » pour les acheteurs 5-50 kg).
8. Renégociation transport aval (à 100 colis/jour on obtient -15-20 % chez
   Colissimo/DPD ; introduire un 2e transporteur pour la pression
   concurrentielle).
9. Tableau de bord logistique admin : taux de service, coût/colis, CO₂/colis,
   rotation des stocks, alertes DLUO (droit chemin de notre page admin santé).

### Année 2+ — l'Europe (étage 3)
10. Étude 2e hub quand >25 % des ventes B2C sont hors France ET >300
    colis/jour : Venlo/Liège, immatriculation TVA, duplication du contrat 3PL.
11. OSS pour la TVA intra-UE, transporteurs verts locaux par pays.
12. Rail/barge inter-hubs ; objectif public : « zéro aérien, jamais ».

### Ce qu'on mesure (les 5 KPI qui décident des paliers)
- coût logistique complet / GMV (cible <15 % B2C, <7 % B2B)
- délai commande→livraison (cible : 3 j point relais France)
- taux de service du hub (>99,5 % commandes sans erreur)
- CO₂/colis aval (cible <400 g, publié)
- rotation du stock consigné (>6/an ; un SKU <3/an sort du hub)

---

## 7. Les risques et comment le modèle les absorbe

| Risque | Parade intégrée |
|---|---|
| Volume B2C ne décolle pas | Coûts 100 % variables, sortie en 30 j, le stock retourne au circuit B2B |
| Producteur ne réassortit pas à temps (35-40 j de mer) | Seuils de réassort dans l'app calés sur la cadence corridor + stock de sécurité 6 semaines sur les 5 top SKU |
| Rupture de la chaîne bio | 3PL certifié + notre certification + traçabilité par lot déjà en place (nous sommes MIEUX outillés que la plupart des distributeurs bio) |
| Litige qualité sur stock consigné | Réception structurée à l'entrée du hub + nos incidents/dégradation existants s'appliquent |
| Dépendance au 3PL unique | Contrat sans exclusivité, données de stock chez nous (module app), WMS standard → migration possible en 6-8 semaines ; le 2e hub (étage 3) supprime le point unique |
| TVA/douane | Représentation fiscale transitaire (étage 1-2), OSS (étage 3) — jamais d'improvisation : c'est le métier du transitaire, pas le nôtre |

---

## 8. Pourquoi ce modèle est le bon POUR NOUS (et pas un autre)

1. **Il prolonge ce qu'on a déjà construit.** Dossier de conformité, dossier
   documentaire par lot, réception structurée, analyses labo, traçabilité
   QR : tout le « système de confiance » développé ces derniers mois devient
   le **système d'exploitation du hub**. Aucune marketplace concurrente ne
   peut brancher un entrepôt sur un socle pareil.
2. **Il respecte notre neutralité.** Consignation = nous ne possédons rien,
   nous n'achetons rien, nous ne concurrençons pas nos producteurs. Nous
   restons le tiers de confiance.
3. **Il est écologique par construction, pas par compensation.** Maritime
   massifié (25 g CO₂/kg), zéro aérien, point relais par défaut,
   cyclologistique du dernier kilomètre via Colissimo, CO₂ affiché au réel.
4. **Il échoue à bas prix.** Si le B2C ne prend pas, on a perdu 3 mois et
   ~2 000 €. S'il prend, chaque palier s'autofinance et le chemin jusqu'à
   « plusieurs milliers de commandes/jour » est déjà tracé — sans jamais
   avoir signé un bail.

---

*Prochaine étape proposée : lancer l'action n°1 (cahier des charges + appel
d'offres 3PL certifié bio) et développer le module « stock consigné » dans
l'app — les deux peuvent avancer en parallèle.*
