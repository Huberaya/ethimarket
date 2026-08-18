# EthiMarket — Dossier de robustesse & fiabilité

*Document de référence — version 1.0, août 2026*
*Destiné aux acheteurs professionnels, partenaires, institutions et investisseurs.*

> **Notre principe fondateur : ne jamais demander qu'on nous croie sur parole.**
> Chaque affirmation de ce document correspond à un mécanisme réellement
> implémenté et vérifiable dans la plateforme. Rien ici n'est une intention :
> tout est en production.

---

## 1. Le problème que nous résolvons

Le commerce B2B de produits bio et équitables souffre d'un déficit structurel
de confiance : certificats falsifiés ou expirés, photos d'exploitation volées
sur internet, allégations sociales invérifiables, intermédiaires opaques.
L'acheteur professionnel porte seul le risque : rappel produit, atteinte
réputationnelle, non-conformité réglementaire (CSRD, EUDR).

EthiMarket a été conçue autour d'une conviction : **la confiance ne se déclare
pas, elle se prouve**. Toute l'architecture de la plateforme découle de ce
principe.

---

## 2. Le protocole « EthiMarket Verified » : la vérification à preuves

### 2.1 Une checklist qui ne se coche pas — elle se prouve

Contrairement aux places de marché qui apposent un badge « vérifié » sur simple
examen déclaratif, notre audit producteur repose sur **6 critères qui ne
peuvent être validés que par des preuves enregistrées** :

1. Identité vérifiée (pièce officielle en cours de validité)
2. Documents d'entreprise conformes (registre du commerce / statuts)
3. Au moins une certification valide (Bio / Fairtrade / Rainforest)
4. Exploitation réelle confirmée (photos et GPS cohérents)
5. Engagements éthiques évalués (salaire minimum, absence de travail des enfants)
6. Charte éthique EthiMarket signée

Chaque preuve enregistre **la méthode employée, une référence vérifiable, le
constat de l'auditeur, son verdict, son auteur et son horodatage**. Le bouton
d'approbation est **techniquement verrouillé** tant que les 6 critères n'ont
pas chacun au moins une preuve conforme : il est impossible d'approuver un
dossier non vérifié, même par négligence.

### 2.2 Douze méthodes de vérification, guidées

L'auditeur dispose de 12 méthodes documentées, avec les méthodes recommandées
par critère :

| Famille | Méthodes |
|---|---|
| **Vérification à la source** | Consultation des registres publics officiels (annuaire Ecocert, FLOCERT Customer Search, USDA Organic Integrity Database, Rainforest Alliance, RCCM/OHADA pour 16 pays d'Afrique) ; confirmation écrite de l'organisme émetteur |
| **Preuve de terrain** | Défi photo géolocalisé ; analyse des métadonnées EXIF ; contrôle satellite de la parcelle ; appel vidéo en direct |
| **Identité** | Correspondance selfie / pièce d'identité ; vérification téléphonique |
| **Triangulation humaine** | Parrainage par un producteur déjà vérifié ; référence d'un acheteur existant ; examen documentaire approfondi |

**Le principe d'or : un PDF n'est jamais une preuve.** Seul le registre public
de l'organisme émetteur fait foi — nos formulaires d'audit intègrent les liens
directs vers ces registres et exigent l'URL exacte de la fiche consultée.

### 2.3 Le défi photo géolocalisé : l'anti-fraude de terrain

Pour prouver qu'une exploitation existe réellement, la plateforme génère un
**code imprévisible** (ex. `EM-X7K4`) que le producteur doit photographier sur
son site **sous 72 heures**. Une photo fraîche contenant un code secret ne peut
pas être volée sur internet.

Chaque photo soumise passe ensuite par notre **analyseur EXIF intégré**
(développé en interne, aucune donnée n'est envoyée à des tiers) :

- 🚨 photo datée *avant* le lancement du défi → alerte (le code ne peut pas y figurer légitimement) ;
- 🚨 coordonnées GPS à plus de 10 km de l'exploitation déclarée → alerte ;
- 🚨 passage par un logiciel de retouche → alerte ;
- ✅ date, GPS et appareil cohérents → signaux positifs.

**Honnêteté par design** : l'absence de métadonnées est traitée comme un signal
neutre (les applications de messagerie les suppriment couramment), jamais comme
une accusation. La décision finale reste humaine.

### 2.4 Un journal immuable — rien ne s'efface jamais

Les preuves sont **immuables par construction** : la base de données n'autorise
ni modification ni suppression. Si une fraude est découverte après coup, une
contre-preuve négative est ajoutée — elle invalide le critère jusqu'à
réhabilitation documentée. L'historique complet reste consultable : qui a
vérifié quoi, quand, comment. En cas d'égalité d'horodatage, la règle
conservatrice s'applique : le constat négatif l'emporte.

### 2.5 Niveaux de confiance gradués

Le binaire « vérifié / non vérifié » est trompeur. Nous affichons trois
niveaux, dérivés mécaniquement des **types** de preuves enregistrées :

- 🥉 **Bronze** — documents et identité vérifiés à la source ;
- 🥈 **Argent** — Bronze + preuve de terrain (défi photo, EXIF, satellite ou visite vidéo) ;
- 🥇 **Or** — Argent + triangulation humaine (confirmation d'organisme, parrainage).

### 2.6 La confiance expire : dégradation automatique

Un certificat a une date de validité. Chaque nuit, un traitement automatique
détecte les certifications expirées et **dégrade le statut du producteur**
(preuve négative système, idempotente, traçable) jusqu'à enregistrement d'un
certificat renouvelé. Le badge « vérifié » ne peut pas survivre à la réalité.

### 2.7 Transparence totale vis-à-vis des acheteurs

Sur chaque boutique producteur, la vitrine publique « Producteur vérifié »
montre **exactement quels contrôles ont été passés** : méthode et date de
chaque vérification. Les notes internes et références d'audit ne sont jamais
exposées (anonymisation garantie par la base de données elle-même, pas par
l'interface). Un producteur sans contrôle n'affiche aucun badge : **pas de
fausse confiance**.

---

## 3. Des moteurs honnêtes, déterministes et sourcés

### 3.1 Scores explicables, jamais de boîte noire

Le **Responsibility Score** de chaque produit se décompose en 6 critères
(environnement, social, traçabilité, certifications, logistique, fournisseur),
et **chaque point est explicable** : l'acheteur peut déplier le détail de
chaque critère et voir précisément ce qui a rapporté ou coûté des points.
Les moteurs sont 100 % locaux et déterministes : même produit, même score,
vérifiable par quiconque.

### 3.2 Empreintes environnementales : la science, pas le marketing

Nos calculs CO2 et eau reposent exclusivement sur des référentiels publics
reconnus : **GHG Protocol** (méthodologie), **ADEME Base Carbone® /
Agribalyse 3.1**, **Poore & Nemecek 2018 (Science)**, **Water Footprint
Network (Mekonnen & Hoekstra)**, **Clark & Tilman 2017** pour l'écart
bio/conventionnel.

Règles d'honnêteté implémentées :

- une estimation sectorielle est **toujours affichée comme estimation**
  (badge « 📊 Estimation sectorielle sourcée »), distincte d'une ACV fournie
  par le producteur (« 📄 ACV producteur ») ;
- l'écart bio/conventionnel affiché est le **±10 % des méta-analyses
  scientifiques**, pas les ×3-4 du marketing ;
- la performance carbone est jugée **relativement à la catégorie du produit**
  (comparer les kg CO2e absolus d'un café et d'un miel n'a pas de sens) ;
- anti-triche : une valeur estimée par la plateforme ne peut jamais rapporter
  plus de points qu'une donnée mesurée ;
- les incertitudes (±30-60 % selon les catégories) sont documentées.

### 3.3 Allégations : le statut de chaque promesse est public

Toute allégation produit (« bio », « salaire décent »…) porte publiquement son
statut : **vérifiée par organisme / en cours / simple déclaration du
fournisseur / contredite / expirée**. Les déclarations non prouvées sont
affichées comme telles — y compris lorsque cela dessert le vendeur.

---

## 4. Un circuit commercial verrouillé de bout en bout

- **Devis → commande** : transitions d'état garanties par la base de données
  elle-même (il est impossible de sauter une étape, même par un bug du client) ;
  prix de l'offre acceptée **verrouillé** à la conversion ; un devis = une
  commande (contrainte d'unicité).
- **Bon de commande** numéroté (PO-AAAA-NNNN) généré comme pièce contractuelle.
- **Paiement** : virement direct producteur-acheteur (la plateforme ne détient
  jamais de fonds) ou carte via Stripe, prestataire agréé — la vérification de
  signature des webhooks est cryptographique, avec protection anti-rejeu.
- **Litiges** : statut dédié, horodaté, visible des deux parties.
- **Notifications** : créées par la base de données à chaque événement métier —
  elles ne peuvent pas être omises ou forgées par un client.

---

## 5. Sécurité & protection des données

| Domaine | Mécanisme en production |
|---|---|
| **Isolation des données** | Row Level Security PostgreSQL sur toutes les tables : chaque utilisateur ne peut lire/écrire que ce qui le concerne, appliqué par la base elle-même |
| **Secrets** | Clés d'API stockées chiffrées (Supabase Vault / secrets serveur) — jamais dans le code, jamais exposées au navigateur ; rotation régulière pratiquée |
| **Hébergement** | Données en Union européenne (AWS eu-central-1, Francfort) ; chiffrement en transit (TLS) et au repos |
| **RGPD** | Export complet des données personnelles (art. 20) et suppression de compte **en self-service** ; données commerciales conservées anonymisées (obligation comptable) ; registre des traitements tenu |
| **Immuabilité d'audit** | Preuves de vérification et journaux d'audit sans droit de modification/suppression |
| **Robustesse applicative** | Garde-fou global contre les crashs (aucun écran blanc), fonctionnant même en cas de défaillance des couches internes |

---

## 6. Qualité logicielle mesurable

- **495 tests automatisés** couvrant les moteurs de score, les transitions
  devis/commande, le protocole de vérification, l'analyse EXIF (testée contre
  des fichiers binaires synthétiques), la parité des 5 langues, les calculs
  d'impact ;
- **0 erreur TypeScript** en compilation stricte ;
- chaque fonctionnalité vérifiée **en conditions réelles** (navigateur
  automatisé sur l'environnement de production) avant mise en ligne ;
- migrations de base de données testées en transactions annulées avant
  application ;
- comptes et données de test systématiquement purgés après chaque vérification.

---

## 7. Accessibilité mondiale

- **5 langues** (français, anglais, espagnol, portugais, arabe) couvrant
  l'interface, les contenus, les fiches produits, les notifications et les
  e-mails — avec support complet droite-à-gauche pour l'arabe ;
- e-mails transactionnels envoyés **dans la langue du destinataire** ;
- pensée pour les réalités du terrain : les producteurs n'ont pas à fournir de
  données qu'ils ne peuvent pas mesurer (les empreintes sont estimées pour eux,
  honnêtement étiquetées) ; le défi photo fonctionne avec un simple téléphone.

---

## 8. Ce que nous ne prétendons pas (limites assumées)

La fiabilité passe aussi par l'honnêteté sur nos limites actuelles :

- la plateforme est en phase de lancement : les premiers dossiers producteurs
  réels sont en cours de constitution ; les données de démonstration sont
  identifiées comme telles et seront purgées ;
- le paiement en ligne opère en mode test (bascule en production planifiée) ;
- l'analyse EXIF est un faisceau d'indices, pas une preuve absolue — c'est
  pourquoi la décision d'audit reste humaine et documentée ;
- aucun système ne rend la fraude impossible : notre engagement est qu'elle
  soit **coûteuse, détectable et traçable** — et que sa découverte dégrade
  immédiatement et publiquement le statut du fraudeur.

---

## 9. Synthèse : pourquoi nous faire confiance

1. **Parce qu'on ne vous demande pas de nous croire** : chaque badge est adossé
   à un journal de contrôles consultable, méthode par méthode, date par date.
2. **Parce que la vérification est structurelle, pas procédurale** : c'est la
   base de données qui interdit d'approuver sans preuves, d'antidater, de
   supprimer un historique ou de sauter une étape de commande.
3. **Parce que nos chiffres citent leurs sources** : ADEME, Science, Water
   Footprint Network — avec leurs incertitudes.
4. **Parce que la confiance expire chez nous aussi** : un certificat périmé
   dégrade automatiquement le statut, la nuit même.
5. **Parce que tout est testé** : 495 tests automatisés, vérifications en
   conditions réelles, zéro dette de typage.

---

*Document rédigé par l'équipe EthiMarket. Pour toute question ou demande
d'audit externe : formulaire de contact de la plateforme.*
