-- =============================================================
-- Blog : contenu complet des articles (la page de lecture
-- n'existait pas — cartes non cliquables signalées dans l'audit).
-- Contenu en markdown léger (## titres, paragraphes, listes).
-- =============================================================
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content TEXT;

UPDATE articles SET content = '## Pourquoi vérifier ses fournisseurs change tout

Choisir un fournisseur bio ne se résume pas à comparer des prix. Un certificat expiré, une chaîne d''approvisionnement opaque ou des conditions sociales douteuses peuvent coûter bien plus cher qu''un écart de quelques centimes au kilo : rappels produits, atteinte à la réputation, non-conformité CSRD.

## Étape 1 — Exiger les preuves, pas les promesses

Demandez systématiquement le numéro de certificat, l''organisme émetteur et la date de validité. Un fournisseur sérieux les fournit en quelques minutes. Sur EthiMarket, ces informations sont publiées sur chaque fiche produit et vérifiées auprès des organismes.

## Étape 2 — Évaluer la traçabilité réelle

Numéro de lot, coordonnées GPS de production, dates de récolte : sans ces éléments, impossible de remonter la chaîne en cas de problème. Méfiez-vous des fournisseurs qui documentent jusqu''au transformateur mais pas jusqu''à la ferme.

## Étape 3 — Auditer les conditions sociales

Salaire décent, absence de travail des enfants, audit social récent (SA8000, BSCI). Une coopérative structurée est souvent un meilleur signal qu''un négociant anonyme.

## Étape 4 — Tester avec un échantillon puis un petit lot

Commandez un échantillon, puis un premier lot au MOQ. Évaluez la qualité, le respect des délais et la communication avant d''engager des volumes.

## Étape 5 — Formaliser par écrit

Prix, délais, validité de l''offre, conditions de renouvellement des certificats : tout doit être tracé. Le module de devis d''EthiMarket horodate chaque étape pour vous.

**En résumé** : la preuve avant la promesse. Un bon fournisseur bio n''a rien à cacher — et tout à documenter.'
WHERE slug = 'choisir-fournisseurs-bio-5-etapes' AND content IS NULL;

UPDATE articles SET content = '## Deux labels, deux philosophies

Fairtrade (Max Havelaar) et Rainforest Alliance sont les deux certifications les plus demandées par les acheteurs européens. Elles ne garantissent pas la même chose.

## Fairtrade : le prix d''abord

Le cœur du système Fairtrade est économique : un **prix minimum garanti** au producteur, quelle que soit la volatilité des cours, plus une **prime de développement** versée à la coopérative pour des projets collectifs (écoles, accès à l''eau, équipement). Le référentiel impose aussi l''interdiction du travail des enfants et des critères de gouvernance démocratique des coopératives. La certification est portée par FLO-CERT, qui audite les organisations de producteurs.

## Rainforest Alliance : l''écosystème d''abord

Rainforest Alliance (fusionné avec UTZ en 2018) met l''accent sur l''**agriculture durable** : protection des forêts, préservation de la biodiversité, gestion de l''eau et des sols, conditions de travail décentes. Il n''y a pas de prix minimum garanti, mais un « différentiel de durabilité » versé au producteur.

## Comment choisir en tant qu''acheteur ?

- Votre priorité est la **sécurité économique des producteurs** → Fairtrade.
- Votre priorité est l''**impact environnemental et la déforestation** (cacao, café) → Rainforest Alliance.
- Les deux se cumulent : de nombreuses coopératives portent les deux certifications.

## Vérifier, toujours

Quel que soit le label, exigez le certificat en cours de validité. Sur EthiMarket, le statut de chaque certification (vérifiée auprès de l''organisme, en cours, ou simple déclaration) est public sur la fiche produit.'
WHERE slug = 'fairtrade-vs-rainforest-alliance' AND content IS NULL;

UPDATE articles SET content = '## Le parcours de certification en clair

Obtenir une certification biologique est un investissement : comptez 12 à 36 mois de conversion et un audit annuel. Voici le parcours type pour un producteur.

## 1. Choisir son référentiel et son organisme

Bio UE (règlement 2018/848) pour vendre en Europe, USDA Organic pour les États-Unis, JAS pour le Japon. Les organismes certificateurs accrédités (Ecocert, Control Union, Kiwa BCS, Africert…) opèrent dans la plupart des pays producteurs.

## 2. La période de conversion

2 à 3 ans pendant lesquels les pratiques doivent être 100% bio mais la production ne peut pas encore être vendue comme telle. C''est la période la plus difficile financièrement — certains acheteurs (dont plusieurs sur EthiMarket) valorisent les produits « en conversion ».

## 3. L''audit initial

Inspection des parcelles, des stocks, de la comptabilité matière. L''auditeur vérifie l''absence d''intrants interdits et la séparation stricte bio/non-bio.

## 4. Le certificat et son périmètre

Le certificat précise les produits couverts, les surfaces, et sa date de validité (généralement 12 mois). **Le numéro de certificat est public** : tout acheteur peut le vérifier auprès de l''organisme.

## 5. Le renouvellement annuel

Audit de suivi chaque année, plus des contrôles inopinés. Un certificat expiré = plus de vente en bio, immédiatement.

## Le conseil EthiMarket

Déposez votre certificat dès la mise en ligne de vos produits : l''équipe le vérifie auprès de votre organisme et votre fiche affiche « ✅ Certifié » — l''argument de vente le plus puissant auprès des acheteurs professionnels.'
WHERE slug = 'certification-bio-guide-producteurs' AND content IS NULL;

UPDATE articles SET content = '## Une présidente, 64 sociétaires

À Essaouira, Fatima Benali préside la coopérative Argan Atlas depuis 2015. « Quand nous avons commencé, nous vendions notre huile à des intermédiaires qui la payaient au tiers de sa valeur. Aujourd''hui, nous exportons en direct et chaque femme de la coopérative est copropriétaire. »

## Le savoir-faire, de mère en fille

L''huile d''argan de la coopérative est issue de cueillette sauvage certifiée bio. Le concassage des noix reste manuel — un savoir-faire transmis de génération en génération. « La mécanisation totale casserait l''amandon et dégraderait l''huile. Notre méthode est plus lente, mais c''est elle qui fait la qualité. »

## Ce que le commerce direct a changé

Depuis le passage à la vente directe : les revenus des sociétaires ont augmenté de 60%, la coopérative a financé une garderie et des cours d''alphabétisation, et la prime équitable a permis d''acheter un véhicule de collecte.

« Les acheteurs qui viennent nous voir posent toujours les mêmes questions : vos certificats sont-ils valides ? Qui contrôle vos conditions de travail ? C''est exactement ce qu''il faut demander. Une coopérative sérieuse a les réponses. »

## Vérifiable, comme toujours

Les certifications Bio (Ecocert) et Commerce Équitable (FLO-CERT) d''Argan Atlas sont vérifiées et publiées sur la boutique de la coopérative, avec numéros de certificat et dates de validité.'
WHERE slug = 'portrait-fatima-benali-argan-atlas' AND content IS NULL;

UPDATE articles SET content = '## 187 familles, 14 coopératives, un terroir d''exception

La Yirgacheffe Coffee Union fédère depuis 2005 les coopératives caféières de la région de Yirgacheffe, en Éthiopie — le berceau historique de l''arabica. Altitude : 1 900 mètres. Variétés : heirloom locales, cultivées sous ombrage.

## L''agroforesterie comme héritage

Ici, le café pousse sous la canopée, mêlé aux ensets et aux acacias. Ce système agroforestier préserve la biodiversité, protège les sols et donne au café ses notes florales caractéristiques. Il capte aussi du carbone — l''empreinte du café d''ombrage est parmi les plus basses de la filière.

## Des stations de lavage aux mains des producteurs

L''union gère ses propres stations de lavage et de séchage, ce qui lui permet de contrôler la qualité de bout en bout et de capter la valeur ajoutée de la transformation. L''export en direct, sans négociant, a augmenté le revenu des familles adhérentes de plus de 40% depuis 2018.

## Traçabilité complète

Chaque lot exporté porte un numéro, la station de lavage d''origine et les coordonnées GPS de la zone de collecte. Les certifications Bio et Rainforest Alliance sont auditées chaque année.

Sur EthiMarket, le café Yirgacheffe de l''union est l''un des produits les mieux documentés : certificats vérifiés, lot tracé, GPS publié.'
WHERE slug = 'yirgacheffe-coffee-union-ethiopie' AND content IS NULL;

UPDATE articles SET content = '## Le safran, or rouge de Kermanshah

Trois générations de la même famille cultivent le safran sur les plateaux de Kermanshah, en Iran. Saffron Fields perpétue une méthode exigeante : récolte des fleurs à l''aube, émondage à la main le jour même, séchage doux traditionnel.

## Pourquoi l''aube ?

Le crocus sativus s''ouvre au lever du soleil. Récoltées avant l''ouverture complète, les fleurs protègent les stigmates de l''oxydation — c''est ce qui préserve la puissance aromatique. Il faut environ 150 000 fleurs pour un kilo de safran sec.

## Le grade Negin

Saffron Fields ne commercialise que du grade Negin : stigmates entiers, rouge profond, sans style jaune. Chaque lot est contrôlé en laboratoire indépendant (crocine, picrocrocine, safranal — norme ISO 3632).

## Les défis d''un producteur iranien

Entre les contraintes logistiques et les fluctuations monétaires, exporter depuis l''Iran demande de la résilience. Le commerce direct via des plateformes transparentes permet à la famille de valoriser la qualité plutôt que de subir les cours des intermédiaires.

« Notre safran raconte cent cinquante ans d''histoire familiale. Ce que nous demandons aux acheteurs, c''est de juger sur les analyses et la qualité — elles parlent d''elles-mêmes. »'
WHERE slug = 'saffron-fields-iran-renaissance-safran' AND content IS NULL;

UPDATE articles SET content = '## La question qui fâche

L''agriculture biologique a des rendements inférieurs de 8 à 25% selon les cultures (méta-analyses Seufert et al. 2012, Ponisio et al. 2015). Alors, peut-elle nourrir une humanité qui approche les 10 milliards ?

## Ce que dit la recherche

L''étude de référence (Muller et al. 2017, Nature Communications) répond : **oui, à trois conditions**. Un passage au bio à grande échelle pourrait nourrir la planète si l''on réduit simultanément le gaspillage alimentaire (un tiers de la production mondiale), la part des cultures dédiées à l''alimentation animale, et la consommation de produits animaux.

## Le vrai problème n''est pas le rendement

Nous produisons déjà de quoi nourrir 10 milliards d''humains. La faim est un problème de répartition, de gaspillage et d''accès économique — pas de volume global. Le bio, avec des rendements légèrement inférieurs mais des sols vivants et une biodiversité préservée, s''inscrit dans une équation systémique.

## Et pour les producteurs du Sud ?

Pour les petits producteurs, le bio offre souvent de meilleurs revenus (prime de prix, moindre dépendance aux intrants importés) et une meilleure résilience climatique. Les coopératives partenaires d''EthiMarket en témoignent : la certification est un levier économique autant qu''écologique.

## Conclusion honnête

Le bio seul ne « sauvera » pas l''alimentation mondiale. Combiné à la réduction du gaspillage et à l''évolution des régimes, il en est un pilier crédible — et le plus solide pour la santé des sols à long terme.'
WHERE slug = 'agriculture-bio-nourrir-10-milliards' AND content IS NULL;

UPDATE articles SET content = '## La permaculture sort des jardins

Longtemps cantonnée aux potagers militants, la permaculture inspire désormais des exploitations commerciales entières. Son principe : concevoir des systèmes agricoles qui imitent les écosystèmes naturels — diversité, étagement, recyclage de la matière.

## Trois principes qui changent la production

**1. Ne jamais laisser un sol nu.** Couverts végétaux et paillage permanents : le sol se régénère au lieu de s''éroder.

**2. Associer plutôt que séparer.** Cultures étagées (arbres + arbustes + couvre-sol), associations bénéfiques. C''est le principe de l''agroforesterie que pratiquent les caféiculteurs de Yirgacheffe.

**3. Boucler les cycles.** Compost, rétention d''eau, haies : l''exploitation produit sa propre fertilité.

## Les résultats mesurés

Les fermes en permaculture bien conduites atteignent des productivités à l''hectare remarquables sur les petites surfaces (étude de l''INRAE sur la ferme du Bec Hellouin), avec une biodiversité 3 à 5 fois supérieure aux parcelles conventionnelles voisines.

## Ce que ça change pour les acheteurs

Un produit issu de systèmes agroforestiers ou permacoles porte généralement une empreinte carbone plus faible et une traçabilité parcellaire précise. Sur EthiMarket, la méthode de production est documentée sur chaque fiche — cherchez « agroforesterie » ou « permaculture » dans le moteur.'
WHERE slug = 'permaculture-revolution-douce-champs' AND content IS NULL;

UPDATE articles SET content = '## L''empreinte carbone se joue aussi en cuisine

L''alimentation représente environ 25% de l''empreinte carbone d''un ménage français (source : ADEME). Voici cinq gestes à fort impact, classés par ordre d''efficacité réelle.

## 1. Rééquilibrer les protéines

Le levier n°1, de loin. Remplacer un repas de bœuf par des légumineuses économise environ 25 kg CO2e par kilo de protéine. Pois chiches, lentilles, quinoa : les protéines végétales bio sont aussi les moins chères au kilo de protéine.

## 2. Traquer le gaspillage

30 kg d''aliments jetés par personne et par an en France, dont 7 kg encore emballés. Planifier ses menus et cuisiner les restes économise plus de CO2 que tous les autres gestes cumulés — et de l''argent.

## 3. Privilégier le transport maritime au fret aérien

Un kilo de produit importé par avion émet ~37 fois plus que par bateau (facteurs ADEME : 0,602 vs 0,016 kg CO2e/t.km). Café, cacao, épices voyagent très bien par mer. Méfiez-vous des produits frais exotiques ultra-périssables : eux voyagent souvent par avion.

## 4. Choisir des produits de saison

Une tomate sous serre chauffée en janvier émet jusqu''à 10 fois plus que la même tomate en été. Le calendrier des saisons reste l''outil le plus simple.

## 5. Réduire les emballages

Vrac et grands conditionnements : sur EthiMarket, les produits proposant du vrac ou des emballages compostables sont filtrables (facette « emballage » du moteur de recherche).

**L''essentiel** : ce sont les choix structurants (protéines, gaspillage, mode de transport) qui pèsent — pas la perfection sur les détails.'
WHERE slug = '5-gestes-reduire-empreinte-carbone-cuisine' AND content IS NULL;

UPDATE articles SET content = '## Négocier en B2B bio : le prix n''est pas le seul levier

Obtenir un bon prix sans étrangler son fournisseur, c''est possible — et c''est même la seule stratégie durable. Voici les leviers qui fonctionnent.

## Levier 1 : le volume et la régularité

Les grilles dégressives récompensent le volume, mais la **régularité** vaut souvent plus qu''un gros volume ponctuel : un producteur qui peut planifier sa production accorde de meilleures conditions. Proposez un engagement trimestriel ou annuel.

## Levier 2 : la saisonnalité

Commander en période de récolte (quand les stocks sont pleins) plutôt qu''en fin de saison. Les dates de récolte sont affichées sur les fiches produits EthiMarket.

## Levier 3 : le paiement rapide

Pour une coopérative, la trésorerie est vitale. Un paiement à réception (plutôt qu''à 60 jours) justifie une remise de 2 à 5% — tout le monde y gagne.

## Levier 4 : les paliers « sur devis »

Au-delà du dernier palier public, tout se négocie : logistique groupée, conditionnement simplifié, enlèvement direct. C''est là que les vraies économies se font.

## Ce qu''il ne faut PAS négocier

Le prix en dessous du coût de production durable. Un fournisseur pressuré compense toujours quelque part : qualité, conditions sociales, ou il disparaît — et vous recommencez votre sourcing à zéro. Le taux d''acceptation de vos devis et la santé de vos fournisseurs font partie de votre performance achats.

**Le réflexe EthiMarket** : utilisez la fiche justificative du comparateur pour argumenter un choix fournisseur auprès de votre direction — y compris quand il n''est pas le moins cher.'
WHERE slug = 'negociation-obtenir-meilleurs-prix-bio' AND content IS NULL;
