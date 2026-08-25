# Cahier des charges — Prestation logistique externalisée (3PL)

**Appel d'offres EthiMarket — Consultation de prestataires logistiques**

| | |
|---|---|
| Émetteur | EthiMarket — marketplace de produits biologiques et équitables |
| Objet | Externalisation complète de la logistique B2C et B2B légère : réception, stockage, préparation, expédition, retours |
| Périmètre initial | ~20 références, ~20-25 palettes, produits alimentaires secs certifiés bio |
| Date d'émission | Août 2026 |
| Réponses attendues | Sous 3 semaines, par e-mail, grille tarifaire de l'annexe A complétée obligatoirement |
| Contact | [contact@ethimarket.com] |

---

## 1. Qui nous sommes et ce que nous cherchons

EthiMarket est une marketplace B2B/B2C qui met en relation des coopératives
productrices certifiées bio/équitables (Afrique, Asie, Amérique latine) avec
des acheteurs européens, professionnels et particuliers.

Notre différenciation est la **preuve** : chaque producteur est vérifié
(identité, certifications contrôlées aux registres), chaque lot voyage avec
son dossier documentaire (certificat bio COI, phytosanitaire, analyses de
laboratoire), et chaque colis expédié porte un QR code de traçabilité
publique. **Le prestataire retenu devient un maillon de cette chaîne de
preuve** — c'est ce qui distingue cette consultation d'un appel d'offres
logistique classique.

Nous cherchons un partenaire capable de :
- démarrer **petit** (20 palettes, quelques centaines de commandes/mois)
  sans nous pénaliser par des minimums dissuasifs ;
- **grandir avec nous** (objectif : plusieurs milliers de commandes/mois à
  24-36 mois, extension européenne) ;
- respecter des exigences **bio et environnementales strictes**, qui sont
  notre fonds de commerce.

## 2. Périmètre de la prestation

### 2.1 Flux entrants (amont)
- Réception de **palettes et cartons** en provenance de transitaires
  (conteneurs maritimes dégroupés — ports du Havre, de Marseille ou
  d'Anvers) et ponctuellement de producteurs européens.
- Fréquence initiale : 1 à 3 réceptions par mois. À terme : hebdomadaire.
- **Contrôle d'entrée contradictoire** (voir § 4.3) avec photos et saisie
  dans notre outil (ou export API).

### 2.2 Stockage
- Produits alimentaires **secs** exclusivement au démarrage : café (grain/
  moulu), cacao, épices, vanille, huiles végétales conditionnées, miel
  conditionné, quinoa, thé, spiruline. Pas de frais, pas de surgelé.
- Conditions : température ambiante maîtrisée (15-25 °C), hygrométrie
  contrôlée, absence de nuisibles (plan de lutte documenté), séparation
  physique ou logique certifiée des produits conventionnels éventuels.
- Volume initial : **20-25 palettes EUR** (80×120). Prévoir la possibilité
  de monter à 100+ palettes sans renégociation du contrat.
- Gestion par **numéro de lot et DLUO/DDM obligatoire**, sortie en
  **FEFO** (First Expired, First Out) strict.

### 2.3 Préparation et expédition B2C
- Commandes transmises par API en temps réel (voir § 5).
- Colis type : 1 à 4 articles, 0,3 à 3 kg.
- **Délai de préparation : J+1 ouvré maximum** (commande avant 12h =
  expédition le jour même souhaitée).
- Transporteurs : Colissimo (point relais ET domicile) obligatoire ;
  Mondial Relay et/ou un expressiste en option. Le prestataire indiquera
  ses tarifs négociés par tranche de poids (annexe A).
- Zones : France métropolitaine au lancement ; Belgique, Luxembourg,
  Allemagne, Espagne, Italie, Pays-Bas à activer sans avenant.

### 2.4 Préparation B2B légère
- Colis multi-références jusqu'à 30 kg et **demi-palettes/palettes**
  re-préparées (cross-dock ou picking carton).
- Expédition par messagerie palette (le prestataire indiquera ses
  partenaires et tarifs indicatifs France + UE).

### 2.5 Retours
- Réception des retours B2C, contrôle visuel selon notre procédure
  (produit scellé/non scellé), remise en stock si intact, photo si litige,
  saisie du motif.
- Volume attendu faible (alimentaire : < 2 %).

### 2.6 Fournitures et emballage
- Cartons **recyclés et recyclables** (certification FSC ou équivalent),
  calage **papier**, **zéro plastique** (ni film, ni coussins d'air, ni
  adhésif plastifié — adhésif kraft exigé).
- Pas de suremballage : le prestataire proposera une gamme de formats
  adaptée à nos produits.
- Insertion d'un document A6/A5 fourni par nos soins dans chaque colis
  (option à chiffrer).

## 3. Exigence éliminatoire n° 1 : certification agriculture biologique

**Le site de stockage proposé doit être certifié pour les activités de
réception, stockage, préparation de commandes et expédition de produits
issus de l'agriculture biologique**, conformément au règlement (UE)
2018/848, par un organisme agréé (Ecocert, Bureau Veritas Certification,
Certipaq, etc.).

À fournir avec la réponse :
- copie du **certificat en cours de validité** mentionnant le site concerné
  et les activités couvertes ;
- numéro d'opérateur bio et lien de vérification au registre public
  (annuaire Agence Bio pour la France) ;
- date du dernier audit de l'organisme certificateur.

> Toute réponse sans cette certification (ou sans engagement ferme de
> certification du site sous 90 jours, preuve d'engagement contractuel avec
> un organisme à l'appui) sera écartée sans examen.

## 4. Exigences opérationnelles

### 4.1 Agréments et hygiène
- Enregistrement/agrément sanitaire pour l'entreposage de denrées
  alimentaires ; plan HACCP documenté ; plan de maîtrise des nuisibles.
- Assurance RC professionnelle et assurance marchandises stockées
  (« ad valorem » ou équivalent) — attestations à joindre, plafonds précisés.

### 4.2 Traçabilité par lot (cœur de notre modèle)
- Le WMS du prestataire doit gérer : n° de lot fournisseur, DLUO/DDM,
  **affectation du lot à chaque commande expédiée** (quel client a reçu
  quel lot), et le restituer par API ou export.
- Capacité de **blocage de lot** en cas d'alerte (rappel/retrait) sous 4 h
  ouvrées, avec extraction immédiate de la liste des commandes concernées.
- Simulation à décrire dans la réponse : « comment traitez-vous un rappel
  de lot chez vos clients actuels ? » (procédure réelle, délais constatés).

### 4.3 Contrôle d'entrée contradictoire
À chaque réception : comptage, pesée, contrôle visuel de l'état, contrôle
étiquetage (mention bio, n° de lot, DLUO), photos horodatées, réserves
transporteur le cas échéant. Compte rendu sous 24 h (API, portail ou
e-mail structuré). C'est notre « réception structurée » côté entrepôt :
elle conditionne le paiement des producteurs, sa fiabilité est critique.

### 4.4 Qualité de service (SLA attendus, à confirmer ou amender)
| Indicateur | Cible | Mesure |
|---|---|---|
| Commandes B2C expédiées à J+1 ouvré | ≥ 98 % | mensuelle |
| Exactitude de préparation (bon produit, bon lot, bonne quantité) | ≥ 99,5 % | mensuelle |
| Exactitude de stock (inventaires tournants) | ≥ 99,8 % | trimestrielle |
| Compte rendu de réception sous 24 h | 100 % | par réception |
| Blocage de lot sous 4 h ouvrées | 100 % | par événement |

Le prestataire précisera ses pénalités/avoirs contractuels en cas de
non-atteinte, et ses propres statistiques 2024-2025 sur ces indicateurs.

## 5. Intégration informatique

- **API REST documentée** (ou EDI standard) couvrant : création/annulation
  de commande, statuts d'expédition + n° de suivi en retour, niveaux de
  stock par référence ET par lot, avis de réception attendue (ASN),
  comptes rendus de réception, retours.
- Webhooks ou polling : préciser. Environnement de test (sandbox) : exigé.
- Notre plateforme est développée en interne et s'intégrera directement :
  **pas besoin de connecteur e-commerce du commerce** (Shopify etc.), mais
  la documentation API doit être complète et l'assistance technique
  identifiée (contact, délais de réponse).
- Frais d'intégration éventuels : à chiffrer en annexe A. Un forfait
  d'accompagnement au démarrage est accepté ; un abonnement mensuel
  « accès WMS » devra être justifié.

## 6. Engagements RSE (pondérés dans la notation)

- Emballages : cf. § 2.6 (contractuel).
- Énergie du site : origine de l'électricité, éclairage LED, toute
  certification environnementale du bâtiment (BREEAM, HQE…) est un plus.
- Transport aval : part des flux confiés à des transporteurs à programme
  de décarbonation mesurable (Colissimo : 357 g CO₂/colis en moyenne,
  cyclologistique urbaine) ; capacité à fournir les **données CO₂ par
  envoi** (nous les affichons publiquement à nos clients).
- Conditions sociales : le prestataire décrira sa politique (CDI/intérim,
  accidents du travail, travail de nuit). Cohérence exigée avec notre
  positionnement éthique — ce critère est réellement noté (10 %).

## 7. Cadre contractuel demandé

- **Sans exclusivité.** Nous restons libres d'ouvrir un second site.
- **Sans minimum mensuel supérieur à 300 € HT** la première année.
- Préavis de résiliation : 2 mois maximum la première année.
- Réversibilité : en fin de contrat, restitution du stock et des données
  (stocks, lots, historique) sous 30 jours, à coûts de manutention
  standard — clause à confirmer.
- Propriété de la marchandise : les produits appartiennent **aux
  producteurs** (stock en consignation orchestré par EthiMarket). Le
  contrat le mentionnera ; les assurances devront le couvrir.
- Revalorisation tarifaire : indexée et plafonnée, pas de révision
  unilatérale en cours d'année.

## 8. Localisation et visite

- Site souhaité en France métropolitaine, idéalement axe Lille-Paris-Lyon
  ou proximité d'un port d'entrée (Le Havre/Rouen), et à moins de 30 min
  d'une plateforme Colissimo.
- Une **visite du site** est un préalable à toute contractualisation.

## 9. Calendrier de la consultation

| Étape | Échéance |
|---|---|
| Envoi du cahier des charges | S |
| Questions des candidats (par e-mail) | S+1 |
| Remise des offres (annexe A complétée + pièces) | S+3 |
| Présélection (2-3 candidats) + visites de sites | S+4 à S+5 |
| Choix final et contractualisation | S+6 |
| Premier flux entrant (pilote 5 palettes) | S+8 à S+10 |

## 10. Pièces à joindre à la réponse

1. Annexe A complétée (grille tarifaire — **obligatoire**, les réponses
   « sur devis » généralisées seront écartées).
2. Certificat bio du site (§ 3) + lien registre.
3. Attestations d'assurance (RC pro + marchandises).
4. Documentation API (ou synthèse + accès sandbox).
5. Trois références clients dont au moins une en alimentaire sec
   (contactables).
6. Statistiques de service 2024-2025 (§ 4.4).
7. Description du site : surface, capacité, effectifs, horaires, sûreté.
8. Note RSE (§ 6).

---

## Annexe A — Grille tarifaire à compléter (HT)

*Merci de chiffrer CHAQUE ligne. Indiquer « inclus » ou « 0 » le cas
échéant. Ajouter toute ligne de frais non listée ici : les frais découverts
après signature sont le premier motif de rupture de confiance.*

### A.1 Frais fixes et de démarrage
| Poste | Tarif | Commentaire |
|---|---|---|
| Frais de dossier / setup | ______ € | one-shot |
| Intégration API / accompagnement technique | ______ € | one-shot |
| Abonnement mensuel (WMS, portail, compte) | ______ €/mois | |
| Minimum de facturation mensuel | ______ €/mois | |

### A.2 Flux entrants
| Poste | Tarif | Unité |
|---|---|---|
| Réception palette homogène | ______ € | /palette |
| Réception palette hétérogène / carton | ______ € | /palette ou /carton |
| Contrôle d'entrée contradictoire avec photos (§ 4.3) | ______ € | /réception ou /palette |
| Saisie lot + DLUO à l'entrée | ______ € | /référence ou inclus |

### A.3 Stockage
| Poste | Tarif | Unité |
|---|---|---|
| Palette EUR / mois | ______ € | /palette/mois |
| Demi-palette ou emplacement étagère / mois | ______ € | /mois |
| Facturation : à l'emplacement ou au réel ? | — | préciser |

### A.4 Préparation B2C
| Poste | Tarif | Unité |
|---|---|---|
| Commande 1 article | ______ € | /commande |
| Article supplémentaire | ______ € | /article |
| Emballage (carton recyclé + calage papier) | ______ € | /commande |
| Insertion document fourni | ______ € | /commande |
| Gestion DLUO/FEFO | ______ € | inclus ? |

### A.5 Transport aval (tarifs négociés, France métropolitaine)
| Poste | 0-250 g | 250 g-1 kg | 1-2 kg | 2-5 kg |
|---|---|---|---|---|
| Colissimo point relais | ___ € | ___ € | ___ € | ___ € |
| Colissimo domicile | ___ € | ___ € | ___ € | ___ € |
| Mondial Relay (option) | ___ € | ___ € | ___ € | ___ € |

| Poste | Tarif | Commentaire |
|---|---|---|
| Surcharge carburant actuelle | ______ % | mécanisme de révision ? |
| Belgique / Allemagne / Espagne / Italie (colis 1-2 kg, relais) | ______ € | par pays |
| Messagerie palette France (1 palette, 300 kg) | ______ € | indicatif |

### A.6 B2B et retours
| Poste | Tarif | Unité |
|---|---|---|
| Préparation colis B2B multi-références (jusqu'à 30 kg) | ______ € | /colis |
| Préparation demi-palette / palette | ______ € | /unité |
| Traitement retour B2C (contrôle + remise en stock) | ______ € | /retour |

### A.7 Dégressivité
Merci d'indiquer vos paliers de remise :
- à 1 000 commandes/mois : ______
- à 3 000 commandes/mois : ______
- à 6 000 commandes/mois : ______

---

## Annexe B — Grille de notation (communiquée par transparence)

| Critère | Poids |
|---|---|
| Certification bio du site (§ 3) | **éliminatoire** |
| Coût complet simulé (scénarios annexe C) | 30 % |
| Traçabilité lot/DLUO + procédure de rappel (§ 4.2) | 20 % |
| Qualité API + sandbox (§ 5) | 15 % |
| SLA proposés et pénalités associées (§ 4.4) | 10 % |
| RSE : emballage, CO₂ par envoi, social (§ 6) | 10 % |
| Souplesse contractuelle (§ 7) | 10 % |
| Références alimentaires + visite de site | 5 % |

## Annexe C — Scénarios pour la simulation de coût complet

Chaque candidat appliquera sa grille A aux trois scénarios ; nous ferons le
même calcul de notre côté (les écarts seront discutés en soutenance).

**Scénario 1 — Lancement (mois type)**
20 palettes stockées ; 2 réceptions de 5 palettes ; 300 commandes B2C
(70 % point relais, moyenne 1,6 article, 900 g) ; 10 colis B2B de 12 kg ;
5 retours.

**Scénario 2 — Croissance (mois type)**
45 palettes ; 4 réceptions ; 1 500 commandes B2C (75 % relais, 1,8 article,
1,1 kg) ; 60 colis B2B ; 3 palettes B2B ; 20 retours ; 10 % des commandes
B2C vers Belgique/Allemagne.

**Scénario 3 — Échelle (mois type)**
90 palettes ; réceptions hebdomadaires ; 6 000 commandes B2C (75 % relais) ;
250 colis B2B ; 12 palettes B2B ; 80 retours ; 20 % des commandes vers
Belgique/Allemagne/Espagne/Italie.

Restituer pour chaque scénario : **coût total mensuel** et **coût moyen par
commande B2C** (hors transport et transport inclus).

---

*EthiMarket — cahier des charges logistique v1.0. Les informations
contenues dans ce document sont confidentielles et destinées aux seuls
prestataires consultés.*
