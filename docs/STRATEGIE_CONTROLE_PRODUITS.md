# EthiMarket — Stratégie « Analyse & contrôle des produits »

*Étude comparative mondiale + feuille de route réaliste, automatisable et scalable*
*Version 1.0 — août 2026*

---

## PARTIE 1 — Ce qui se fait aujourd'hui en Europe et dans le monde

### 1.1 Le système européen de contrôle des denrées importées

L'UE opère le système de contrôle alimentaire le plus structuré au monde,
autour de quatre piliers :

**a) Les contrôles officiels aux frontières (règl. 2017/625)**
Tout lot alimentaire entrant passe par un contrôle documentaire ; les
contrôles d'identité et physiques (échantillonnage + analyses laboratoire)
sont déclenchés **par le risque**. Le préavis d'arrivée se fait
électroniquement via TRACES (document CHED).

**b) Les listes de contrôles renforcés (règl. 2019/1793)**
C'est la pièce maîtresse à comprendre pour nous : la Commission publie des
**listes couple produit × pays d'origine** soumises à des fréquences de
contrôle accrues (10 %, 20 %, 30 %, 50 % des lots analysés), **révisées tous
les 6 mois** selon les non-conformités constatées. Les dangers dominants :
**mycotoxines (aflatoxines)** — 77 % des cas sur certaines filières —,
**résidus de pesticides**, contamination microbiologique. Exemples typiques :
arachides d'Égypte, piments d'Inde, sésame du Nigéria… Ces listes sont
**publiques et gratuites**.

**c) Le RASFF (Rapid Alert System for Food and Feed)**
Réseau d'alerte rapide entre États membres : toute détection d'un risque
(rappel, rejet frontalier) est notifiée et **consultable publiquement**
(RASFF Window). Plus de 15 000 notifications historiques analysables par
produit, pays, danger. Les rejets frontaliers concernent massivement des
produits d'Asie et d'Afrique — nos origines.

**d) Les régimes spécifiques**
- **Bio (règl. 2018/848)** : chaque lot importé exige un COI (Certificate of
  Inspection) émis dans TRACES par le certificateur AVANT le départ, visé à
  l'entrée. Sans COI, le produit entre mais pas en tant que bio.
- **Phytosanitaire (règl. 2016/2031)** : certificat de l'ONPV du pays
  d'origine pour les végétaux non transformés.
- **EUDR (règl. 2023/1115)** : café et cacao exigent la géolocalisation des
  parcelles et une déclaration de diligence de l'importateur.
- **Limites réglementaires** : LMR pesticides (règl. 396/2005) et
  contaminants — bases de données **publiques** (EU Pesticides Database,
  EFSA OpenFoodTox, en open data).

### 1.2 Ce que font les grandes marketplaces

**Amazon (le standard de référence depuis le GPSR, déc. 2024)** : le
règlement général sur la sécurité des produits rend les places de marché
**co-responsables** de la conformité des vendeurs tiers. La réponse d'Amazon
est un modèle d'automatisation :
- collecte structurée de champs de conformité **par annonce** (fabricant,
  personne responsable UE, avertissements, attestations) via API ;
- upload de documents (déclarations de conformité, rapports de tests) ;
- tableau de bord « Account Health » montrant au vendeur ce qui manque ;
- **désactivation automatique** des annonces non conformes à échéance.

Leçon : la conformité ne se contrôle pas par des humains qui lisent des
PDF, mais par des **champs structurés obligatoires + blocage automatique +
échantillonnage ciblé**.

**Le secteur agroalimentaire B2B** (Tridge, Selina Wamucii, sourcing café/
cacao spécialisé) s'appuie sur : échantillon avant commande, **certificat
d'analyse (COA) par lot**, inspection pré-embarquement par tiers (SGS,
Bureau Veritas, Eurofins, Intertek — présents dans tous nos pays d'origine),
et arbitrage qualité à réception.

**Traçabilité** : les standards GS1 (GTIN/GLN, codes lot) dominent ;
les solutions blockchain (IBM Food Trust, TraceX) apportent surtout la
**traçabilité par lot avec QR code** — fonctionnalité utile, la blockchain
elle-même étant accessoire (une base immuable classique — ce que nous avons
déjà — rend le même service à notre échelle).

### 1.3 Synthèse : les 5 mécanismes universels

1. **Risque, pas exhaustivité** : personne ne teste tout ; on cible par
   couple produit × origine × historique (le modèle 2019/1793).
2. **Documents structurés par produit et par LOT**, pas par vendeur.
3. **Analyses laboratoire par des tiers accrédités**, à des moments clés
   (premier référencement, pré-embarquement, aléatoire).
4. **Boucle de retour** : chaque incident (rejet, litige) resserre le
   contrôle sur la filière concernée.
5. **Blocage automatique** : sans conformité documentée, l'annonce ne se
   publie pas / le lot ne s'expédie pas.

---

## PARTIE 2 — Ce qui relève de la LOI vs ce que NOUS imposons

Distinction fondamentale pour ne pas nous tromper de rôle :

### 2.1 Obligations légales UE — qui les porte ?

| Obligation | Responsable légal | Rôle d'EthiMarket |
|---|---|---|
| Certificat phytosanitaire | Exportateur (via ONPV) | Vérifier présence avant expédition |
| COI bio dans TRACES | Certificateur + importateur | Exiger la référence COI par lot bio |
| Conformité LMR/contaminants | **Importateur** (l'acheteur) | Réduire son risque en amont (COA) |
| Déclaration EUDR (café/cacao) | Importateur | Fournir le paquet GPS parcelles (on l'a !) |
| Étiquetage UE (règl. 1169/2011) | Metteur en marché UE | Checklist d'aide |
| GPSR (non-alimentaire : cosmétiques, textile) | Vendeur + **marketplace co-responsable** | Champs obligatoires + blocage (comme Amazon) |

**Point clé** : en B2B alimentaire, EthiMarket n'est ni l'importateur ni le
metteur en marché — la responsabilité légale première est chez l'acheteur
importateur et l'exportateur. **Mais** notre promesse commerciale est
précisément de dé-risquer l'acheteur : chaque exigence que nous ajoutons
contractuellement (CGU vendeur) est notre valeur ajoutée. Et pour les
produits non alimentaires (cosmétiques, textile), le GPSR nous rend
directement co-responsables : là, le blocage automatique est une obligation.

### 2.2 Les critères EthiMarket (au-delà de la loi)

C'est notre différenciation : COA par lot même quand la loi ne l'exige pas,
défis photo, vérification à la source des certificats, score de risque par
expédition, échantillonnage aléatoire — détaillés en partie 3.

---

## PARTIE 3 — La solution EthiMarket : « Product Trust Pipeline »

Architecture en **4 couches**, construite sur l'existant (preuves immuables,
moteur d'allégations, feuille de route export, défis photo) :

```
Couche 1  DOSSIER DE CONFORMITÉ PRODUIT   (au référencement)   → automatique
Couche 2  SCORE DE RISQUE                 (permanent)          → automatique
Couche 3  CONTRÔLE PAR LOT                (à chaque commande)  → semi-auto
Couche 4  ANALYSES & INSPECTIONS TIERCES  (ciblées)            → partenaires
```

### Couche 1 — Le dossier de conformité produit (automatisable à 100 %)

À la création/modification d'un produit, le système détermine **les
exigences applicables** selon catégorie × origine × destination (moteur
local, comme notre `exportRoadmap`) et bloque la publication tant que le
dossier est incomplet — le modèle Amazon :

| Donnée exigée | Source de vérification |
|---|---|
| Catégorie douanière (code SH 6 chiffres) | Table locale de correspondance |
| N° de lot + DLUO/DDM | Déclaratif structuré (déjà en base) |
| Certificat bio + n° + certificateur | **Déjà vérifié à la source** (protocole Verified) |
| Fiche technique produit (spécifications) | Upload + checklist |
| COA (certificat d'analyse) de moins de 12 mois | Upload + vérification labo émetteur |
| Allergènes / composition (produits transformés) | Déclaratif structuré |
| GPS parcelles (café/cacao — EUDR) | **Déjà collecté** (défis photo, dossier) |
| Étiquetage : checklist 1169/2011 | Auto-checklist par catégorie |

**Technologie** : extension de nos moteurs locaux existants (zéro API
payante). Table `product_compliance_requirements` (règles par catégorie ×
origine) + `product_compliance_items` (état par produit) ; publication
conditionnée comme l'approbation producteur l'est déjà aux preuves.

### Couche 2 — Le score de risque produit-origine (données publiques UE)

Réplication locale de la logique 2019/1793 :

1. **Table de risque réglementaire** : les annexes 2019/1793 (produit ×
   pays × danger × fréquence de contrôle UE) intégrées comme données
   locales versionnées, mises à jour semestriellement (elles sont
   publiques). Un producteur de piment indien ou de sésame nigérian est
   automatiquement classé « filière sous contrôle renforcé UE » →
   exigences EthiMarket relevées (COA obligatoire par lot, pas annuel).
2. **Veille RASFF** : consultation périodique de la base publique RASFF
   sur nos couples produit/origine actifs → alerte interne si une filière
   monte en risque (notre moteur d'alertes existe déjà).
3. **Référentiels EFSA/LMR en open data** pour documenter les seuils
   applicables par produit (aflatoxines, ochratoxine A, pesticides).

**Résultat** : chaque produit porte un niveau de risque (faible/moyen/
renforcé) qui pilote l'intensité des couches 3 et 4 — exactement comme
les douanes européennes. Affiché à l'acheteur : transparence, pas de
boîte noire.

### Couche 3 — Le contrôle par lot, intégré au circuit de commande

Notre circuit devis → commande → expédition s'enrichit de jalons qualité :

1. **Pré-expédition** : le producteur charge le paquet documentaire du lot
   (n° lot, phyto, COI bio le cas échéant, COA si filière renforcée). La
   commande ne peut passer en « expédiée » qu'avec le paquet complet
   (même mécanisme SQL que nos transitions verrouillées).
2. **Échantillon avant première commande** (option acheteur, recommandée
   par défaut) : jalon « échantillon approuvé » tracé sur la commande.
3. **Réception structurée** : au lieu du simple « confirmer la réception »,
   un mini-contrôle guidé (poids conforme ? emballage intact ? aspect ?)
   → données qui alimentent le score fournisseur.
4. **Boucle d'incident** : un litige qualité dégrade automatiquement le
   niveau du producteur (notre mécanisme de preuves fail existe) et élève
   le niveau de contrôle de sa filière.

### Couche 4 — Analyses laboratoire et inspections tierces (partenaires)

Là où l'automatisation s'arrête, on orchestre des tiers accrédités :

| Partenaire type | Service | Quand | Coût indicatif |
|---|---|---|---|
| **SGS / Bureau Veritas / Intertek** (présents dans tous nos pays d'origine) | Inspection pré-embarquement (quantité, qualité, empotage) | Filières renforcées + premières expéditions d'un producteur | 200–500 € / inspection |
| **Eurofins / labos accrédités ISO 17025 locaux** | Analyses : pesticides multi-résidus, aflatoxines, micro | COA initial + par lot si filière renforcée + aléatoire | 100–400 € / échantillon |
| Certificateurs (déjà intégrés) | COI bio TRACES | Chaque lot bio | inclus dans la certification |

**Modèle économique** : le coût des analyses est porté par le producteur
(comme le veut l'usage export) ou partagé, MAIS EthiMarket négocie des
tarifs de groupe et **orchestre** (commande d'inspection en 1 clic depuis
la commande, résultats archivés comme preuves immuables). À terme :
programme d'échantillonnage aléatoire financé par la commission (1 lot
sur N testé aux frais de la plateforme — argument commercial majeur).

**Vérification des COA eux-mêmes** : le même principe que les certificats
bio — un COA se vérifie auprès du laboratoire émetteur (numéro de rapport),
et un labo inconnu se vérifie dans les registres d'accréditation nationaux
(COFRAC, DAkkS, listes ILAC — publics).

---

## PARTIE 4 — Construction progressive (réaliste et budgétée)

### Phase 1 — Maintenant, coût 0 € (moteurs locaux, 2-3 chantiers)
- Dossier de conformité produit avec blocage de publication (couche 1)
- Table de risque 2019/1793 locale + niveaux de risque affichés (couche 2)
- Jalon documentaire par lot dans le circuit de commande (couche 3.1)
- Réception structurée + boucle d'incident (couche 3.3, 3.4)
- Upload COA + vérification manuelle guidée (notre pattern « preuve »)

### Phase 2 — Aux premières commandes réelles (coût variable, porté par les lots)
- Convention tarifaire avec 1 labo accrédité par grande origine (Eurofins/
  SGS locaux) ; bouton « commander une analyse » sur la commande
- Échantillon avant première commande systématisé
- COA obligatoire par lot sur filières renforcées
- Suivi de la référence COI TRACES pour chaque lot bio

### Phase 3 — À l'échelle (quand le volume le justifie)
- Veille RASFF automatisée (la base est publique) branchée sur notre
  moteur d'alertes
- QR code de traçabilité par lot (parcelle → acheteur) — nos données GPS
  et lots existent déjà, c'est une vue publique à construire
- Programme d'échantillonnage aléatoire financé par la commission
- Score de risque dynamique nourri par l'historique réceptions/litiges
- Pour le non-alimentaire (cosmétiques, textile) : module GPSR complet
  (personne responsable UE, DoC, avertissements multilingues, blocage)

### Ce que nous ne ferons PAS (lucidité)
- Pas de laboratoire interne, pas de blockchain propriétaire (notre base
  immuable suffit), pas de prétention à « certifier » nous-mêmes la
  sécurité sanitaire : nous **orchestrons des preuves de tiers accrédités**
  et nous rendons le risque visible — c'est le rôle honnête et défendable
  d'une place de marché.

---

## PARTIE 5 — Récapitulatif décisionnel

| Question | Réponse |
|---|---|
| Technologies | Extension de nos moteurs locaux (règles par catégorie×origine), tables versionnées de données publiques UE (2019/1793, LMR, RASFF), notre système de preuves immuables, jalons SQL sur le circuit de commande. Zéro dépendance payante en phase 1. |
| Données vérifiées | Code SH, lot/DLUO, certificat bio (source), COI TRACES, phyto, COA (labo accrédité), GPS parcelles (EUDR), composition/allergènes, étiquetage, historique RASFF de la filière |
| Partenaires | SGS / Bureau Veritas / Intertek (inspection), Eurofins + labos ISO 17025 locaux (analyses), certificateurs déjà intégrés, registres d'accréditation publics |
| Légal vs EthiMarket | Légal : phyto, COI bio, LMR (importateur), EUDR, GPSR non-alimentaire. EthiMarket : COA par lot, échantillon, score de risque, réception structurée, échantillonnage aléatoire |
| Scalabilité | Le contrôle est piloté par le risque (comme l'UE) : l'effort humain ne croît pas linéairement avec le volume ; les documents sont structurés et bloquants (comme Amazon) ; les analyses sont déléguées à des tiers |

---

*Prochaine étape proposée : implémentation Phase 1 (dossier de conformité
produit + table de risque + jalon lot sur les commandes).*
