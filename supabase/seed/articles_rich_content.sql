-- Articles enrichis (contenu FR long + title/excerpt traduits mis à jour)
BEGIN;
UPDATE articles SET content = '## Ce que « bio » veut dire juridiquement

Le terme « biologique » est protégé par la loi. Dans l''Union européenne, c''est le **règlement (UE) 2018/848** qui fixe les règles : pas d''engrais ni de pesticides de synthèse, pas d''OGM, rotation des cultures, bien-être animal renforcé. Aux États-Unis, c''est le **National Organic Program (NOP)** de l''USDA ; au Japon, le **JAS** ; en Inde, le **NPOP**. Ces référentiels se ressemblent mais ne sont pas interchangeables : vendre « bio » en Europe exige une certification selon les règles européennes, même si vous êtes déjà certifié NOP.

## Qui certifie ? Le système en 3 étages

- **L''autorité publique** fixe les règles et agrée les certificateurs (en France : l''INAO ; en Europe : la Commission, qui publie la liste des organismes reconnus pays par pays).
- **L''organisme certificateur** (Ecocert, CERES, Naturland, Africert…) audite votre exploitation chaque année, réalise des prélèvements et délivre le certificat. C''est lui que vous payez.
- **Le registre public** permet à n''importe qui de vérifier votre certificat : annuaire de l''Agence Bio en France, base TRACES pour les importations, annuaires en ligne d''Ecocert ou de FLO-CERT. Un certificat introuvable au registre n''a aucune valeur.

## Les étapes concrètes de votre certification

**1. La conversion (2 à 3 ans).** Vos terres doivent être conduites en bio avant que la récolte puisse porter le label : 2 ans pour les cultures annuelles, 3 ans pour les cultures pérennes (café, cacao, arbres fruitiers). Pendant cette période, vous vendez en « conversion » — certains acheteurs paient déjà une prime.

**2. Le choix du certificateur.** Comparez les devis : pour une petite exploitation africaine ou asiatique, comptez de 400 à 1 500 € par an selon la taille, la distance et le nombre de référentiels (UE seul, ou UE + NOP). Les certificateurs locaux (Africert au Kenya, Indocert en Inde, BioLatina au Pérou) sont souvent moins chers que les européens en déplacement.

**3. La certification de groupe — la voie royale des coopératives.** Depuis le règlement 2018/848, un « groupement d''opérateurs » peut être certifié collectivement avec un **système de contrôle interne (SCI)** : la coopérative inspecte elle-même chaque membre chaque année, et le certificateur audite le système plus un échantillon de fermes (racine carrée du nombre de membres, typiquement). Le coût par ferme peut tomber sous 20 € par an. Conditions clés : membres de moins de 5 ha (ou moins de 25 000 € de chiffre bio), proximité géographique, règles internes écrites.

**4. L''audit annuel.** L''inspecteur vérifie vos parcelles, vos stocks, votre comptabilité (les volumes vendus doivent correspondre aux surfaces), vos intrants. Préparez : cahier de culture, factures d''intrants, plans des parcelles, contrats de vente.

**5. Les analyses.** Des prélèvements de feuilles, de sol ou de produit peuvent être analysés (multi-résidus de pesticides). Un résidu détecté déclenche une enquête : contamination du voisin ou fraude ? D''où l''importance des zones tampons.

## Ce qui fait perdre une certification

- résidus de pesticides non expliqués ;
- comptabilité incohérente (vendre plus de « bio » qu''on ne peut en produire — la fraude la plus surveillée) ;
- mélange bio/non-bio dans le stockage ou le transport ;
- absence de zone tampon avec un voisin conventionnel.

## Exporter vers l''Europe : le COI

Chaque lot bio importé dans l''UE doit voyager avec un **certificat d''inspection (COI)** émis dans le système TRACES par votre certificateur AVANT le départ. Sans COI, le lot peut entrer… mais pas comme bio. Anticipez : demandez le COI dès que le lot est prêt, pas quand le bateau est parti.

## Combien ça rapporte ?

La prime bio varie selon les filières : de l''ordre de +20 à +40 % pour un café ou un cacao certifiés (le différentiel organique Fairtrade pour le cacao est par exemple de 300 USD/tonne au-delà du prix minimum), davantage sur les épices et les produits transformés. La certification est un investissement qui se rembourse en général dès la première ou deuxième récolte vendue certifiée — à condition d''avoir des débouchés. C''est exactement le rôle d''une marketplace comme EthiMarket : le débouché d''abord, la certification rentabilisée ensuite.

## Les 5 erreurs des primo-certifiés

- attendre d''avoir un acheteur pour commencer la conversion (2-3 ans de perdus) ;
- choisir le certificateur le moins cher sans vérifier qu''il est reconnu pour la destination d''export (liste UE des organismes reconnus pays tiers) ;
- négliger le cahier de culture — c''est LA pièce demandée à chaque audit ;
- oublier de certifier aussi le transformateur/exportateur (la chaîne entière doit l''être) ;
- laisser expirer le certificat : les acheteurs sérieux vérifient la date au registre. Sur EthiMarket, un certificat expiré dégrade automatiquement votre niveau de confiance.', read_time = 12 WHERE slug = 'certification-bio-guide-producteurs';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{en,title}', to_jsonb('Organic certification: the complete guide for producers'::text)), '{en,excerpt}', to_jsonb('EU 2018/848, NOP, group certification with internal control systems, COI for exports, real costs and the 5 classic mistakes — everything a producer needs to get certified.'::text)) WHERE slug = 'certification-bio-guide-producteurs';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{es,title}', to_jsonb('Certificación ecológica: la guía completa para productores'::text)), '{es,excerpt}', to_jsonb('Reglamento UE 2018/848, NOP, certificación de grupo con sistema de control interno, COI para exportar, costes reales y los 5 errores clásicos.'::text)) WHERE slug = 'certification-bio-guide-producteurs';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{pt,title}', to_jsonb('Certificação biológica: o guia completo para produtores'::text)), '{pt,excerpt}', to_jsonb('Regulamento UE 2018/848, NOP, certificação de grupo com sistema de controlo interno, COI para exportação, custos reais e os 5 erros clássicos.'::text)) WHERE slug = 'certification-bio-guide-producteurs';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{ar,title}', to_jsonb('الشهادة العضوية: الدليل الكامل للمنتجين'::text)), '{ar,excerpt}', to_jsonb('لائحة الاتحاد الأوروبي 2018/848، NOP، شهادة المجموعات بنظام الرقابة الداخلية، شهادة COI للتصدير، التكاليف الحقيقية والأخطاء الخمسة الشائعة.'::text)) WHERE slug = 'certification-bio-guide-producteurs';
UPDATE articles SET content = '## Deux labels, deux philosophies

Fairtrade (Max Havelaar) et Rainforest Alliance sont les deux certifications les plus demandées par les acheteurs européens. Elles ne garantissent pas la même chose — et les chiffres le montrent.

## Fairtrade : le prix d''abord

Le cœur du système Fairtrade est économique, avec des montants publics et vérifiables :

- **Prix minimum garanti.** Pour le cacao, il est de **3 500 USD/tonne FOB** depuis octobre 2025 (relevé de 2 390 USD auparavant) : si le cours mondial passe en dessous, l''acheteur Fairtrade doit quand même payer ce plancher.
- **Prime de développement.** S''y ajoute une prime versée à la coopérative pour des projets collectifs : **240 USD/tonne** pour le cacao du Ghana, écoles, forages, équipements — l''assemblée des membres décide de son usage.
- **Différentiel bio.** Un cacao à la fois Fairtrade et bio touche encore **+300 USD/tonne**.
- Pour le café arabica lavé : prix minimum de 1,80 USD/livre, prime de 0,20 USD/livre (dont 0,05 fléché sur la productivité et la qualité).

Le standard impose aussi l''interdiction du travail des enfants et une gouvernance démocratique des coopératives. La certification est portée par **FLO-CERT**, dont le registre public (customer search) permet de vérifier n''importe quel certificat en ligne — c''est ce que fait notre équipe pour chaque producteur qui déclare ce label.

## Rainforest Alliance : l''écosystème d''abord

Rainforest Alliance (fusionnée avec UTZ en 2018) met l''accent sur l''**agriculture durable** : protection des forêts (zéro déforestation après une date de coupure, vérifiée par géolocalisation des parcelles), préservation de la biodiversité, gestion de l''eau et des sols, conditions de travail décentes avec un mécanisme « évaluer et traiter » sur le travail des enfants.

Côté argent : pas de prix minimum garanti, mais un **différentiel de durabilité** (sustainability differential) obligatoire payé au producteur en plus du prix du marché, et des **investissements de durabilité** payés par l''acheteur pour financer la mise en conformité. Les montants sont négociés, pas fixés — c''est la grande différence philosophique avec Fairtrade.

## Le match en 6 lignes

- **Sécurité de revenu** : Fairtrade (plancher garanti) > RA (différentiel variable).
- **Déforestation** : RA (géolocalisation systématique) > Fairtrade.
- **Gouvernance coopérative** : Fairtrade (démocratie obligatoire) > RA.
- **Volume mondial** : RA certifie davantage de café/cacao en tonnage ; Fairtrade compte ~2 millions de producteurs.
- **Coût pour la coopérative** : comparable (audit annuel par un tiers).
- **Reconnaissance consommateur Europe** : Fairtrade légèrement devant en notoriété.

## Comment choisir (en tant que producteur) ?

- Vos acheteurs sont des torréfacteurs/chocolatiers engagés → **Fairtrade**, ils recherchent le prix minimum.
- Vos acheteurs sont des industriels avec engagements « zéro déforestation » (obligation EUDR européenne) → **Rainforest Alliance**, leur conformité s''appuie sur votre géolocalisation.
- Les deux se cumulent : de nombreuses coopératives portent les deux labels et arbitrent lot par lot selon l''acheteur.

## Et le règlement européen déforestation (EUDR) ?

Depuis fin 2025, tout café ou cacao importé dans l''UE doit être géolocalisé et « zéro déforestation post-2020 » — label ou pas. Rainforest Alliance facilite cette conformité (les coordonnées existent déjà), mais aucun label ne dispense l''importateur de sa propre diligence raisonnée. Sur EthiMarket, les coordonnées GPS des parcelles font partie du dossier de conformité produit pour le café et le cacao.

## Vérifier, toujours

Quel que soit le label, exigez le certificat en cours de validité et vérifiez-le au registre : FLO-CERT customer search pour Fairtrade, annuaire public Rainforest Alliance pour RA. Sur EthiMarket, l''état de chaque certification (vérifiée auprès de l''organisme, en cours, ou simple déclaration) est public sur la fiche producteur.', read_time = 10 WHERE slug = 'fairtrade-vs-rainforest-alliance';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{en,title}', to_jsonb('Fairtrade vs Rainforest Alliance: the real differences, with figures'::text)), '{en,excerpt}', to_jsonb('Minimum price of 3,500 USD/t for cocoa, 240 USD/t premium, sustainability differential, EUDR geolocation: what each label really guarantees.'::text)) WHERE slug = 'fairtrade-vs-rainforest-alliance';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{es,title}', to_jsonb('Fairtrade vs Rainforest Alliance: las diferencias reales, con cifras'::text)), '{es,excerpt}', to_jsonb('Precio mínimo de 3 500 USD/t para el cacao, prima de 240 USD/t, diferencial de sostenibilidad, geolocalización EUDR: lo que garantiza realmente cada sello.'::text)) WHERE slug = 'fairtrade-vs-rainforest-alliance';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{pt,title}', to_jsonb('Fairtrade vs Rainforest Alliance: as diferenças reais, com números'::text)), '{pt,excerpt}', to_jsonb('Preço mínimo de 3 500 USD/t para o cacau, prémio de 240 USD/t, diferencial de sustentabilidade, geolocalização EUDR: o que cada selo garante realmente.'::text)) WHERE slug = 'fairtrade-vs-rainforest-alliance';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{ar,title}', to_jsonb('فيرتريد مقابل تحالف الغابات المطيرة: الفروقات الحقيقية بالأرقام'::text)), '{ar,excerpt}', to_jsonb('سعر أدنى 3500 دولار/طن للكاكاو، علاوة 240 دولار/طن، فارق الاستدامة، تحديد المواقع EUDR: ما يضمنه كل ملصق فعلياً.'::text)) WHERE slug = 'fairtrade-vs-rainforest-alliance';
UPDATE articles SET content = '## Pourquoi votre méthode de sourcing compte plus que votre flair

Les acheteurs professionnels qui se font piéger (certificat expiré, qualité en dents de scie, lot bloqué en douane) ne manquent pas de flair : ils manquent de méthode. Voici celle que nous recommandons, en 5 étapes vérifiables.

## Étape 1 — Vérifiez l''existence légale et la certification À LA SOURCE

Un beau site web et un PDF de certificat ne prouvent rien : un certificat se falsifie en cinq minutes.

- **Certification bio** : vérifiez le numéro au registre public de l''organisme (annuaire en ligne d''Ecocert, customer search de FLO-CERT, Organic Integrity Database de l''USDA). Le nom, le produit et la validité doivent correspondre exactement.
- **Existence de l''entreprise** : registre du commerce du pays (RCCM via OHADA pour 17 pays d''Afrique, ORC au Ghana, MCA en Inde…).
- Sur EthiMarket, ce travail est fait avant vous : chaque producteur passe par une vérification à preuves (identité, registre, certification, exploitation) et le détail des contrôles est public sur sa boutique.

## Étape 2 — Testez avec un échantillon AVANT la première commande

Jamais de première commande sans échantillon avec **numéro de lot**. Ce que vous évaluez :

- l''aspect, l''odeur, le goût, l''humidité (un café à plus de 12 % d''humidité moisira en conteneur) ;
- la cohérence entre l''échantillon et la fiche technique ;
- si l''enjeu le justifie, une analyse : comptez 30-80 € pour une microbiologie (Salmonella), 150-350 € pour un multi-résidus pesticides — c''est le prix d''une nuit d''hôtel, pas celui d''un conteneur refusé.

Piège classique : l''échantillon « doré » qui ne ressemble pas au lot livré. Parade : exiger que le numéro de lot de l''échantillon corresponde au lot expédié, et contrôler à réception.

## Étape 3 — Auditez la capacité réelle de production

Beaucoup de litiges naissent d''une coopérative qui accepte plus qu''elle ne peut livrer.

- Demandez les volumes des 2 dernières campagnes et le nombre de membres.
- Rapprochez : 300 tonnes annoncées pour 50 producteurs de café, c''est 6 t/producteur — plausible au Brésil mécanisé, suspect en Éthiopie de jardin.
- Un appel vidéo dans l''entrepôt vaut tous les questionnaires.

## Étape 4 — Verrouillez les conditions AVANT la commande

- **Incoterm** : FOB (vous maîtrisez le fret) ou CIF (le vendeur livre au port d''arrivée) pour un premier achat ; évitez EXW (tout repose sur vous, y compris l''export local) et DDP (peu de producteurs savent dédouaner chez vous).
- **Documents exigés au contrat** : certificat bio + COI (TRACES) pour l''UE, certificat phytosanitaire, certificat d''analyse (COA) sur les filières sensibles — sur EthiMarket, cette liste est générée automatiquement par lot selon le produit et l''origine.
- **Paiement** : 30 % à la commande / 70 % contre documents d''expédition est un standard sain pour débuter.
- **Plan B qualité** : que se passe-t-il si le lot est non conforme ? Décote négociée, remplacement, ou refus — écrivez-le avant, pas pendant la crise.

## Étape 5 — Contrôlez la première livraison comme un rituel

À réception : quantité, emballage, aspect, étiquetage (les 4 points de notre réception structurée). Photographiez tout, immédiatement — les réserves émises après 48 h ne valent plus rien face à un transporteur ou un assureur. Puis donnez du feedback au producteur : les meilleures relations d''approvisionnement se construisent sur la deuxième commande, pas la première.

## La check-list récapitulative

- Certificat vérifié AU REGISTRE (pas le PDF)
- Entreprise trouvée au registre du commerce
- Échantillon avec numéro de lot évalué (et analysé si enjeu)
- Capacité de production recoupée
- Incoterm + documents + paiement + plan B écrits au contrat
- Contrôle 4 points à réception, photos horodatées

Six lignes qui évitent 90 % des mauvaises surprises du commerce international de produits bio.', read_time = 11 WHERE slug = 'choisir-fournisseurs-bio-5-etapes';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{en,title}', to_jsonb('How to choose your organic suppliers: the 5-step method'::text)), '{en,excerpt}', to_jsonb('Registry checks, batch-numbered samples, capacity cross-checks, Incoterms and documents, structured reception: the checklist that avoids 90% of sourcing disasters.'::text)) WHERE slug = 'choisir-fournisseurs-bio-5-etapes';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{es,title}', to_jsonb('Cómo elegir a sus proveedores ecológicos: el método en 5 etapas'::text)), '{es,excerpt}', to_jsonb('Verificación en registros, muestras con número de lote, contraste de capacidad, Incoterms y documentos, recepción estructurada: la lista que evita el 90% de los problemas.'::text)) WHERE slug = 'choisir-fournisseurs-bio-5-etapes';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{pt,title}', to_jsonb('Como escolher os seus fornecedores biológicos: o método em 5 etapas'::text)), '{pt,excerpt}', to_jsonb('Verificação nos registos, amostras com número de lote, cruzamento de capacidade, Incoterms e documentos, receção estruturada: a lista que evita 90% dos problemas.'::text)) WHERE slug = 'choisir-fournisseurs-bio-5-etapes';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{ar,title}', to_jsonb('كيف تختار مورديك العضويين: منهجية من 5 خطوات'::text)), '{ar,excerpt}', to_jsonb('التحقق من السجلات، عينات برقم الدفعة، مطابقة القدرة الإنتاجية، الإنكوتيرمز والوثائق، الاستلام المنظم: القائمة التي تجنبك 90% من المشاكل.'::text)) WHERE slug = 'choisir-fournisseurs-bio-5-etapes';
UPDATE articles SET content = '## Négocier du bio équitable n''est pas négocier du conventionnel

Sur une marketplace éthique, l''objectif n''est pas d''écraser le prix : un producteur payé sous ses coûts disparaît, et votre approvisionnement avec lui. L''objectif est un prix **juste et prévisible** pour les deux parties. Voici comment y arriver, chiffres en main.

## 1. Connaissez la structure du prix avant de parler

Pour un café ou un cacao, le prix se décompose en couches publiques :

- le **cours mondial** (bourse de New York/Londres) — consultable en temps réel ;
- le **différentiel d''origine** (qualité, réputation : un Yirgacheffe grade 1 se paie bien au-dessus du cours) ;
- les **primes de certification** : différentiel bio Fairtrade cacao +300 USD/t, prime de développement 240 USD/t, prix minimum 3 500 USD/t FOB si le cours s''effondre ;
- la **logistique** selon l''Incoterm (un prix FOB Mombasa et un prix rendu Rotterdam diffèrent de 150-250 USD/t).

Un acheteur qui arrive en connaissant ces quatre couches négocie sur des faits. Le producteur le respecte immédiatement — et les discussions raccourcissent.

## 2. Le volume et l''engagement valent mieux qu''un rabais

Les vraies économies ne sont pas dans le marchandage :

- **Engagement sur la campagne** : réserver 3 expéditions sur l''année vaut au producteur une visibilité qui justifie un meilleur prix unitaire (5-8 % typiquement) — bien plus qu''un rabais arraché sur un lot unique.
- **Paliers de volume** : la plupart des producteurs EthiMarket affichent des prix dégressifs par quantité. Grouper deux commandes trimestrielles en une semestrielle fait souvent gagner un palier.
- **Groupage logistique** : partager un conteneur (LCL organisé) réduit le coût au m³ de 40-60 % par rapport à des colis — négociez le produit, mutualisez le transport.

## 3. Payez vite, gagnez sur le prix

Le nerf de la guerre d''une coopérative, c''est la trésorerie pendant la récolte : elle paie ses membres comptant. Un acompte de 30 % à la commande (standard) peut se négocier contre un avantage prix ; un paiement à réception rapide vaut de l''or. À l''inverse, exiger 90 jours de délai s''appelle simplement transférer votre besoin de trésorerie sur plus fragile que vous — et cela se paie en qualité l''année suivante.

## 4. Négociez la qualité, pas seulement le prix

Le levier le plus rentable est souvent ailleurs que sur l''étiquette prix :

- **spécifications précises** (calibre, taux d''humidité, taux de défauts au tri) écrites au contrat ;
- **décote barémisée** si la spécification n''est pas atteinte (ex. -2 % par point de défaut au-delà du seuil) plutôt qu''un refus binaire qui pénalise tout le monde ;
- **bonus qualité** l''année suivante si les lots sont constants — vous fidélisez les meilleurs.

## 5. Ce qui ne se négocie pas

Sur EthiMarket, certains éléments sont hors négociation, et c''est votre protection autant que celle du producteur :

- les documents du lot (certificat bio/COI, phytosanitaire, analyses sur filières sensibles) — la plateforme bloque l''expédition sans eux ;
- la réception contrôlée en 4 points ;
- la traçabilité publique du lot.

Un fournisseur qui accepterait de « s''arranger » sur ces points est précisément celui qu''il faut fuir.

## Le script en 5 questions pour votre premier appel

1. « Quel volume avez-vous réellement disponible sur cette récolte, et déjà engagé ? »
2. « Quel est votre prix FOB pour X tonnes, et pour 3 expéditions dans l''année ? »
3. « Quelles spécifications garantissez-vous par écrit (humidité, défauts) ? »
4. « Quel acompte facilite votre campagne, contre quel geste sur le prix ? »
5. « Puis-je recevoir un échantillon du lot précis, avec son numéro ? »

Cinq questions, dix minutes, et vous savez si vous tenez un partenaire ou un problème.', read_time = 10 WHERE slug = 'negociation-obtenir-meilleurs-prix-bio';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{en,title}', to_jsonb('Negotiating fair organic prices: the buyer''s playbook'::text)), '{en,excerpt}', to_jsonb('Price structure (world market, differentials, certification premiums), volume commitments vs discounts, payment terms, quality specs: negotiate on facts.'::text)) WHERE slug = 'negociation-obtenir-meilleurs-prix-bio';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{es,title}', to_jsonb('Negociar precios justos en bio: el manual del comprador'::text)), '{es,excerpt}', to_jsonb('Estructura del precio (cotización, diferenciales, primas de certificación), compromisos de volumen, plazos de pago, especificaciones de calidad: negociar con hechos.'::text)) WHERE slug = 'negociation-obtenir-meilleurs-prix-bio';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{pt,title}', to_jsonb('Negociar preços justos no biológico: o manual do comprador'::text)), '{pt,excerpt}', to_jsonb('Estrutura do preço (cotação, diferenciais, prémios de certificação), compromissos de volume, prazos de pagamento, especificações de qualidade: negociar com factos.'::text)) WHERE slug = 'negociation-obtenir-meilleurs-prix-bio';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{ar,title}', to_jsonb('التفاوض على أسعار عادلة في المنتجات العضوية: دليل المشتري'::text)), '{ar,excerpt}', to_jsonb('بنية السعر (البورصة، الفروقات، علاوات الشهادات)، التزامات الحجم، آجال الدفع، مواصفات الجودة: تفاوض على أساس الوقائع.'::text)) WHERE slug = 'negociation-obtenir-meilleurs-prix-bio';
UPDATE articles SET content = '## La question qui fâche

« Le bio ne pourra jamais nourrir la planète. » L''argument revient à chaque débat. Que disent réellement les études — pas les slogans ?

## Ce que dit la science des rendements

La méta-analyse de référence (Ponisio et al., Université de Berkeley, 2015, portant sur 115 études et plus de 1 000 comparaisons) mesure un écart de rendement moyen de **-19 %** pour le bio par rapport au conventionnel. Mais ce chiffre global cache l''essentiel :

- l''écart tombe à **-8 à -9 %** avec de bonnes rotations et cultures associées ;
- il varie énormément selon les cultures : faible sur les légumineuses et les fourrages, plus marqué sur le blé ;
- dans les systèmes tropicaux à faibles intrants — la réalité de la majorité des petits producteurs du Sud — le passage à des pratiques agroécologiques **augmente** souvent les rendements, car le point de départ n''est pas l''agriculture intensive mais des sols dégradés et pas d''accès aux engrais.

## Le vrai problème n''est pas la production

Le monde produit déjà de quoi nourrir plus de 10 milliards d''humains en calories brutes. Mais :

- environ **un tiers de la nourriture est perdue ou gaspillée** (FAO) — pertes post-récolte au Sud, gaspillage domestique au Nord ;
- **plus d''un tiers des céréales mondiales nourrit du bétail**, avec un rendement calorique de conversion très défavorable ;
- une part croissante part en agrocarburants.

Autrement dit : la question « le bio peut-il nourrir le monde ? » est mal posée. La bonne question est « quel système alimentaire global rend une agriculture à -10 % de rendement mais sans intrants de synthèse viable ? » — et la réponse passe par moins de gaspillage et moins de calories animales, pas par plus de pesticides.

## L''étude qui a fait bouger le débat

Les scénarios de l''institut de recherche FiBL publiés dans Nature Communications (Muller et al., 2017) montrent qu''un passage à 100 % bio est possible **si** il s''accompagne d''une réduction de moitié du gaspillage et des surfaces fourragères en concurrence avec l''alimentation humaine — sans augmenter les terres cultivées. À 60 % de bio, la contrainte est encore plus faible.

## Ce que le bio apporte que le rendement ne mesure pas

- **Sols** : +12 à +15 % de carbone organique dans les sols bio en moyenne (méta-analyses long terme) — la fertilité de demain ;
- **Biodiversité** : ~30 % d''espèces en plus dans les parcelles bio ;
- **Eau** : pas de résidus de pesticides de synthèse à traiter (le traitement de l''eau potable coûte des milliards par an aux collectivités) ;
- **Revenu** : pour un petit producteur du Sud, la prime bio (+20 à 40 % sur café/cacao) change la rentabilité d''une ferme davantage que 10 % de rendement.

## Notre position, assumée

EthiMarket ne prétend pas que le bio va « nourrir le monde » à lui seul. Nous constatons trois choses vérifiables : les primes bio et équitables augmentent le revenu des producteurs que nous vérifions ; les pratiques agroécologiques régénèrent les sols dont dépend toute production future ; et le levier le plus puissant est entre les mains des acheteurs — ce qu''ils achètent, à qui, et à quel prix. C''est ce levier que la plateforme équipe.', read_time = 9 WHERE slug = 'agriculture-bio-nourrir-10-milliards';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{en,title}', to_jsonb('Can organic farming feed 10 billion people?'::text)), '{en,excerpt}', to_jsonb('What the science actually says: the -19% yield gap and its nuances, the FiBL/Nature scenarios, food waste, and why the question itself is badly framed.'::text)) WHERE slug = 'agriculture-bio-nourrir-10-milliards';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{es,title}', to_jsonb('¿Puede la agricultura ecológica alimentar a 10 000 millones de personas?'::text)), '{es,excerpt}', to_jsonb('Lo que dice la ciencia: la brecha de rendimiento del -19% y sus matices, los escenarios FiBL/Nature, el desperdicio alimentario y por qué la pregunta está mal planteada.'::text)) WHERE slug = 'agriculture-bio-nourrir-10-milliards';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{pt,title}', to_jsonb('Pode a agricultura biológica alimentar 10 mil milhões de pessoas?'::text)), '{pt,excerpt}', to_jsonb('O que diz a ciência: a diferença de rendimento de -19% e as suas nuances, os cenários FiBL/Nature, o desperdício alimentar e porque a própria pergunta está mal colocada.'::text)) WHERE slug = 'agriculture-bio-nourrir-10-milliards';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{ar,title}', to_jsonb('هل تستطيع الزراعة العضوية إطعام 10 مليارات إنسان؟'::text)), '{ar,excerpt}', to_jsonb('ما تقوله العلوم فعلاً: فجوة الغلة -19% وتفاصيلها، سيناريوهات FiBL/Nature، هدر الغذاء، ولماذا السؤال نفسه مطروح بشكل خاطئ.'::text)) WHERE slug = 'agriculture-bio-nourrir-10-milliards';
UPDATE articles SET content = '## Au-delà du mot à la mode

La permaculture souffre de son succès : le mot évoque tantôt des buttes de potager, tantôt une philosophie de vie. À l''origine (Bill Mollison et David Holmgren, Australie, 1978), c''est une **méthode de conception** : concevoir des systèmes agricoles qui imitent les écosystèmes naturels — diversité, étages de végétation, recyclage de la matière, absence d''intrants extérieurs.

## Les principes qui marchent à l''échelle d''une ferme

- **Cultures étagées (agroforesterie)** : le modèle du café ou du cacao sous ombrage — grands arbres, arbres fruitiers, caféiers, cultures vivrières au sol. Quatre récoltes sur la même parcelle, un microclimat tamponné, moins d''évaporation.
- **Associations** : le trio maïs-haricot-courge des Amériques (le haricot fixe l''azote, la courge couvre le sol), le poivrier grimpant sur l''arbre d''ombrage en Inde.
- **Couverture permanente du sol** : mulch, engrais verts — un sol jamais nu, c''est moins d''érosion, moins d''arrosage, plus de vie microbienne.
- **Eau ralentie** : baissières (swales), demi-lunes sahéliennes, petites retenues — récolter l''eau de pluie dans le sol plutôt que la regarder ruisseler.

## Ce que disent les données

L''agroforesterie est l''un des systèmes les mieux documentés : les cafés sous ombrage montrent une biodiversité proche de la forêt secondaire, des températures de canopée réduites de plusieurs degrés (assurance-climat pour l''arabica, très sensible aux vagues de chaleur), et des rendements totaux par hectare (toutes productions confondues) souvent supérieurs à la monoculture — c''est le concept de **Land Equivalent Ratio** : produire sur 1 ha en association ce qui demanderait 1,3 à 1,8 ha en cultures séparées.

Le retour d''expérience des producteurs de notre plateforme va dans le même sens : les coopératives café d''Éthiopie travaillent traditionnellement sous ombrage (le café y est né en forêt), et les producteurs de vanille de Madagascar cultivent par définition en système agroforestier — la vanille est une liane qui a besoin d''un tuteur vivant.

## Les limites honnêtes

- La transition demande 3-5 ans avant que le système s''équilibre — un producteur endetté ne peut pas toujours attendre ;
- La récolte mécanisée est incompatible avec les étages : c''est un modèle à main-d''œuvre, économiquement viable là où la main-d''œuvre est disponible et le produit valorisé (bio, équitable, spécialité) ;
- La conception initiale exige de la formation — les échecs de permaculture sont presque toujours des échecs de conception, pas de principe.

## Par où commencer (producteur)

1. Une parcelle pilote, jamais toute la ferme.
2. D''abord l''eau (baissières, paillage), ensuite les arbres, enfin les associations.
3. Des espèces locales éprouvées — le voisin qui réussit est un meilleur guide qu''un manuel australien.
4. Documentez : photos datées, rendements par étage. Sur EthiMarket, ces pratiques alimentent directement votre score responsable et votre histoire de producteur — les acheteurs paient pour de la réalité documentée, pas pour le mot « permaculture ».', read_time = 9 WHERE slug = 'permaculture-revolution-douce-champs';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{en,title}', to_jsonb('Permaculture: the quiet revolution in our fields'::text)), '{en,excerpt}', to_jsonb('From shade-grown coffee to the maize-bean-squash trio: what actually works at farm scale, Land Equivalent Ratio data, honest limits, and how to start.'::text)) WHERE slug = 'permaculture-revolution-douce-champs';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{es,title}', to_jsonb('Permacultura: la revolución silenciosa en nuestros campos'::text)), '{es,excerpt}', to_jsonb('Del café bajo sombra al trío maíz-frijol-calabaza: lo que funciona a escala de finca, datos de Land Equivalent Ratio, límites honestos y cómo empezar.'::text)) WHERE slug = 'permaculture-revolution-douce-champs';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{pt,title}', to_jsonb('Permacultura: a revolução silenciosa nos nossos campos'::text)), '{pt,excerpt}', to_jsonb('Do café sob sombra ao trio milho-feijão-abóbora: o que funciona à escala da exploração, dados de Land Equivalent Ratio, limites honestos e como começar.'::text)) WHERE slug = 'permaculture-revolution-douce-champs';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{ar,title}', to_jsonb('الزراعة المعمّرة: الثورة الهادئة في حقولنا'::text)), '{ar,excerpt}', to_jsonb('من القهوة تحت الظل إلى ثلاثي الذرة والفاصولياء والقرع: ما ينجح فعلاً على مستوى المزرعة، بيانات نسبة المكافئ الأرضي، الحدود الصادقة وكيف تبدأ.'::text)) WHERE slug = 'permaculture-revolution-douce-champs';
UPDATE articles SET content = '## L''assiette pèse plus lourd que le transport

Idée reçue tenace : « manger local » serait LE geste climat. Les données ADEME et l''étude de référence Poore & Nemecek (Science, 2018, 38 000 fermes analysées) racontent autre chose : pour la plupart des aliments, **le transport ne représente que 5 à 10 % de l''empreinte carbone** — ce qui domine, c''est le mode de production. Voici les 5 gestes classés par impact réel.

## 1. Rééquilibrer l''assiette (l''impact n° 1, de très loin)

Un kilo de bœuf émet 25 à 60 kg CO₂e selon le système d''élevage ; un kilo de légumineuses, environ 1 kg. Remplacer un repas de viande rouge par semaine par des légumineuses économise ~150 kg CO₂e par an et par personne — davantage que d''acheter 100 % local toute l''année. Pas besoin de devenir végétarien : la baisse des portions et de la fréquence fait l''essentiel.

## 2. Traquer le gaspillage (l''impact invisible)

Un tiers de la nourriture produite est perdue ou gaspillée (FAO) ; en France, environ 30 kg par personne et par an partent à la poubelle dont 7 kg encore emballés. Chaque kilo jeté cumule TOUTES les émissions d''amont. Gestes concrets : congeler le pain, cuisiner les restes, comprendre la différence entre DLC (« à consommer jusqu''au », sanitaire) et DDM (« de préférence avant », purement indicative — un paquet de café ou de lentilles reste bon des mois après).

## 3. Choisir les bons produits d''import (et non « zéro import »)

C''est le point le plus contre-intuitif : un café, un cacao ou des épices voyagent par **bateau**, à ~25 g CO₂e par kilo transporté — négligeable dans leur bilan. Un fruit exotique par **avion** (mangue mûre, fruits rouges hors saison), c''est 40 fois plus que la mer. La règle : les produits secs importés par voie maritime (café, cacao, épices, légumineuses) sont climatiquement raisonnables ; le frais aérien ne l''est pas. Sur EthiMarket, l''empreinte affichée sur chaque produit intègre ce calcul — et notre logistique refuse le fret aérien par principe.

## 4. La saison avant les kilomètres

Une tomate locale sous serre chauffée en hiver émet plus qu''une tomate espagnole de plein champ transportée en camion. Le classement gagnant : de saison ET local > de saison importé (mer/route) > hors saison sous serre chauffée > n''importe quoi par avion.

## 5. La cuisson et le froid, les oubliés

- couvrir les casseroles : -25 % d''énergie de cuisson ;
- dégivrer le congélateur (3 mm de givre = +30 % de consommation) ;
- régler le réfrigérateur à 4-5 °C, pas moins ;
- bouilloire plutôt que casserole pour l''eau.

C''est modeste par geste, mais c''est quotidien — et cumulé sur une année, comparable à un aller-retour Paris-Lyon en voiture.

## Le récapitulatif honnête

- Moins de viande rouge : impact fort
- Zéro gaspillage : impact fort
- Pas d''aérien alimentaire : impact fort sur les produits concernés
- Saisonnalité : impact moyen
- Cuisson/froid : impact modeste mais gratuit

Et le bio dans tout ça ? Son bénéfice climatique direct par kilo est débattu (rendements inférieurs mais pas d''engrais azotés de synthèse, gros poste d''émissions) ; ses bénéfices sols, eau et biodiversité, eux, ne le sont pas. Manger bio ET équilibré ET sans gaspillage : c''est la combinaison, pas la compétition.', read_time = 8 WHERE slug = '5-gestes-reduire-empreinte-carbone-cuisine';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{en,title}', to_jsonb('5 kitchen habits that actually cut your carbon footprint'::text)), '{en,excerpt}', to_jsonb('Transport is only 5-10% of food''s footprint (Poore & Nemecek, Science 2018). What really matters: plate balance, waste, no air-freighted food, seasonality.'::text)) WHERE slug = '5-gestes-reduire-empreinte-carbone-cuisine';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{es,title}', to_jsonb('5 gestos en la cocina que reducen de verdad su huella de carbono'::text)), '{es,excerpt}', to_jsonb('El transporte es solo el 5-10% de la huella alimentaria (Poore & Nemecek, Science 2018). Lo que cuenta: equilibrio del plato, desperdicio, nada de avión, temporada.'::text)) WHERE slug = '5-gestes-reduire-empreinte-carbone-cuisine';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{pt,title}', to_jsonb('5 gestos na cozinha que reduzem realmente a sua pegada de carbono'::text)), '{pt,excerpt}', to_jsonb('O transporte é apenas 5-10% da pegada alimentar (Poore & Nemecek, Science 2018). O que conta: equilíbrio do prato, desperdício, nada de avião, sazonalidade.'::text)) WHERE slug = '5-gestes-reduire-empreinte-carbone-cuisine';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{ar,title}', to_jsonb('5 عادات في المطبخ تخفض بصمتك الكربونية فعلاً'::text)), '{ar,excerpt}', to_jsonb('النقل ليس سوى 5-10% من البصمة الغذائية (Poore & Nemecek, Science 2018). المهم فعلاً: توازن الطبق، الهدر، لا للشحن الجوي، الموسمية.'::text)) WHERE slug = '5-gestes-reduire-empreinte-carbone-cuisine';
UPDATE articles SET content = '## Là où le café est né

Le caféier arabica est originaire des forêts d''altitude du sud-ouest de l''Éthiopie — le seul endroit au monde où le café pousse encore à l''état sauvage. La zone de Yirgacheffe, dans la région de Gedeo, entre 1 700 et 2 200 mètres d''altitude, produit l''un des cafés les plus recherchés de la planète : floral, citronné, d''une finesse que les torréfacteurs de spécialité décrivent comme « thé-like ».

## Une union de coopératives, pas une plantation

Contrairement au modèle latino-américain de la finca, le café éthiopien est un café de **jardins** : des parcelles familiales de moins d''un hectare, souvent quelques centaines de caféiers sous l''ombrage d''ensète (la « fausse banane » vivrière) et d''arbres natifs. Les familles apportent leurs cerises au poste de lavage de leur coopérative locale ; les coopératives se fédèrent en unions qui assurent l''usinage final, le contrôle qualité et l''export.

Ce modèle a une conséquence directe pour l''acheteur : la qualité se joue au **poste de lavage** (tri des cerises, fermentation contrôlée 24-48 h, séchage lent sur lits africains surélevés pendant 10-15 jours pour les naturels). Deux coopératives voisines peuvent produire des lots très différents.

## Les chiffres qui comptent

- L''Éthiopie est le **1er producteur africain** de café et environ le 5e mondial ;
- Le café fait vivre, directement ou indirectement, **environ un quart de la population** éthiopienne ;
- Une partie significative de la récolte (souvent estimée autour de la moitié) est consommée dans le pays — la cérémonie du café, trois services (abol, tona, baraka), reste un pilier social ;
- Les grades éthiopiens vont de G1 (spécialité, moins de 3 défauts pour 300 g) à G5 ; le Yirgacheffe lavé G1-G2 se négocie très au-dessus du cours de bourse, avec des différentiels d''origine parmi les plus élevés du continent.

## Ce que change le commerce direct

Dans le circuit long, un producteur de Yirgacheffe touche une fraction du prix FOB. Le commerce direct via les unions — celui que permet une marketplace — déplace trois curseurs :

- **le prix** : moins d''intermédiaires entre le poste de lavage et le torréfacteur ;
- **la traçabilité** : un lot identifié par coopérative et par jour de récolte, vérifiable (c''est exactement ce que notre QR de traçabilité rend public) ;
- **la prévisibilité** : des engagements de campagne qui permettent à l''union de financer la récolte suivante.

## Pour l''acheteur : comment lire une offre Yirgacheffe

- **Lavé ou naturel ?** Le lavé donne le profil floral-citronné classique ; le naturel (séché en cerise) donne plus de fruit et de corps.
- **Le grade** (G1/G2) et l''altitude figurent sur l''offre sérieuse.
- **La récolte** : la campagne principale s''étale d''octobre à janvier ; un « fresh crop » arrive en Europe entre janvier et avril.
- **Les documents** : certificat bio le cas échéant, et depuis la réglementation européenne anti-déforestation, la géolocalisation des parcelles — les jardins forestiers éthiopiens, précisément parce qu''ils sont sous ombrage natif, sont bien placés pour y répondre.

Sur EthiMarket, les producteurs éthiopiens passent la même vérification à preuves que tous les autres : identité, coopérative au registre, certificats contrôlés à la source. Le café le plus ancien du monde mérite la traçabilité la plus moderne.', read_time = 8 WHERE slug = 'yirgacheffe-coffee-union-ethiopie';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{en,title}', to_jsonb('Yirgacheffe: garden coffee from where coffee was born'::text)), '{en,excerpt}', to_jsonb('Family plots under native shade at 2,000 m, washing-station quality, Ethiopian grades, and what direct trade changes for the cooperatives'' unions.'::text)) WHERE slug = 'yirgacheffe-coffee-union-ethiopie';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{es,title}', to_jsonb('Yirgacheffe: el café de jardín de donde nació el café'::text)), '{es,excerpt}', to_jsonb('Parcelas familiares bajo sombra nativa a 2 000 m, calidad de estación de lavado, grados etíopes y lo que el comercio directo cambia para las uniones de cooperativas.'::text)) WHERE slug = 'yirgacheffe-coffee-union-ethiopie';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{pt,title}', to_jsonb('Yirgacheffe: o café de jardim de onde o café nasceu'::text)), '{pt,excerpt}', to_jsonb('Parcelas familiares sob sombra nativa a 2 000 m, qualidade da estação de lavagem, graus etíopes e o que o comércio direto muda para as uniões de cooperativas.'::text)) WHERE slug = 'yirgacheffe-coffee-union-ethiopie';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{ar,title}', to_jsonb('يرغاتشيف: قهوة الحدائق من مهد القهوة'::text)), '{ar,excerpt}', to_jsonb('قطع عائلية تحت الظل الأصلي على ارتفاع 2000 متر، جودة محطة الغسل، الدرجات الإثيوبية، وما يغيّره التبادل المباشر لاتحادات التعاونيات.'::text)) WHERE slug = 'yirgacheffe-coffee-union-ethiopie';
UPDATE articles SET content = '## L''épice la plus chère du monde, et pourquoi

Il faut environ **150 000 fleurs de Crocus sativus pour produire un kilo de safran sec** — chaque fleur donne trois stigmates, cueillis à la main à l''aube, avant que le soleil n''ouvre la fleur, puis émondés et séchés le jour même. Cette arithmétique implacable explique un prix au kilo qui se compte en milliers d''euros et un marché où la fraude prospère.

## L''Iran, géant discret

L''Iran produit selon les années **85 à 90 % du safran mondial**, principalement dans les provinces du Khorasan (Torbat-e Heydarieh, Gonabad — ce dernier classé au patrimoine agricole mondial de la FAO pour son système d''irrigation par qanats millénaires). Le crocus y est remarquablement adapté : il fleurit en octobre-novembre, se contente de très peu d''eau (une culture précieuse dans un pays en stress hydrique) et valorise des terres où peu d''autres cultures sont rentables.

## Lire une fiche technique safran comme un pro

La norme **ISO 3632** classe le safran selon trois mesures en laboratoire :

- **crocine** (pouvoir colorant) : catégorie I exige plus de 200 unités — les meilleurs Negin iraniens dépassent 250-270 ;
- **picrocrocine** (amertume) et **safranal** (arôme) complètent le profil ;
- les appellations commerciales iraniennes décrivent la coupe : **Negin** (stigmates entiers, rouge profond, le plus cher), **Sargol** (pointes rouges seules), **Pushal** (stigmate + un peu de style jaune).

Exigez toujours le certificat d''analyse ISO 3632 du lot — pas une moyenne de la maison.

## La fraude, fléau n° 1 de la filière

Le safran est l''un des produits alimentaires les plus falsifiés au monde : fils de maïs teintés, carthame (« safran bâtard »), curcuma en poudre, safran véritable mais « chargé » au sirop pour augmenter le poids, ou vieux stock recoloré. Les parades de l''acheteur professionnel :

- acheter en **stigmates entiers**, jamais en poudre (la poudre est invérifiable à l''œil) ;
- test rapide : un vrai stigmate infusé colore l''eau en jaune d''or **lentement** (15-20 minutes) sans se décolorer lui-même ; une teinture relâche sa couleur immédiatement ;
- COA ISO 3632 par lot + fournisseur vérifiable — exactement le type de contrôle documentaire que notre plateforme impose par conception.

## Une renaissance par la qualité

Longtemps vendu en vrac anonyme aux négociants, le safran iranien vit une mutation : jeunes coopératives, traçabilité par lot, conditionnement d''origine, certification bio (le crocus reçoit traditionnellement très peu d''intrants — la conversion est souvent simple). Pour les familles productrices, vendre un safran identifié et analysé au lieu d''un vrac anonyme multiplie le revenu — le même mouvement que le café de spécialité a connu il y a vingt ans.

## À la cuisine comme au laboratoire

Un bon safran s''utilise infusé (eau tiède, 20 minutes minimum, idéalement quelques heures) et se dose en pistils par personne, pas en pincées : 0,1 g parfume un plat pour six. À ce dosage, un kilo de Negin représente des milliers d''assiettes — l''épice la plus chère du monde est, à l''usage, moins coûteuse qu''elle n''en a l''air.', read_time = 8 WHERE slug = 'saffron-fields-iran-renaissance-safran';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{en,title}', to_jsonb('Iranian saffron: inside the world''s most precious spice'::text)), '{en,excerpt}', to_jsonb('150,000 flowers per kilo, ISO 3632 grades, Negin vs Sargol, fraud detection tests, and the quality renaissance in Khorasan''s cooperatives.'::text)) WHERE slug = 'saffron-fields-iran-renaissance-safran';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{es,title}', to_jsonb('Azafrán iraní: dentro de la especia más preciada del mundo'::text)), '{es,excerpt}', to_jsonb('150 000 flores por kilo, grados ISO 3632, Negin vs Sargol, pruebas contra el fraude y el renacimiento por la calidad en las cooperativas del Jorasán.'::text)) WHERE slug = 'saffron-fields-iran-renaissance-safran';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{pt,title}', to_jsonb('Açafrão iraniano: por dentro da especiaria mais preciosa do mundo'::text)), '{pt,excerpt}', to_jsonb('150 000 flores por quilo, graus ISO 3632, Negin vs Sargol, testes contra a fraude e o renascimento pela qualidade nas cooperativas do Coração.'::text)) WHERE slug = 'saffron-fields-iran-renaissance-safran';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{ar,title}', to_jsonb('الزعفران الإيراني: في قلب أغلى توابل العالم'::text)), '{ar,excerpt}', to_jsonb('150 ألف زهرة للكيلوغرام، درجات ISO 3632، نجين مقابل سرگل، اختبارات كشف الغش، ونهضة الجودة في تعاونيات خراسان.'::text)) WHERE slug = 'saffron-fields-iran-renaissance-safran';
UPDATE articles SET content = '## L''arbre qui ne pousse (presque) que là

L''arganier ne pousse à l''état naturel que dans le sud-ouest marocain — la réserve de biosphère de l''arganeraie, classée par l''UNESCO en 1998, couvre environ 2,5 millions d''hectares entre Essaouira, Agadir et Taroudant. L''arbre survit avec 100 à 300 mm de pluie par an, ses racines profondes fixent les sols et freinent l''avancée du désert. En 2014, les « pratiques et savoir-faire liés à l''arganier » sont entrés au patrimoine culturel immatériel de l''UNESCO ; l''ONU a même institué une Journée internationale de l''arganier (10 mai).

## Le travail derrière un litre d''huile

Il faut environ **30 à 40 kg de fruits frais — et 8 à 10 heures de travail, dont le concassage manuel des noix entre deux pierres — pour produire un litre d''huile d''argane**. C''est ce concassage, jamais mécanisé de façon satisfaisante pour l''alimentaire torréfié, qui fait de l''argane une économie de main-d''œuvre féminine : le savoir-faire s''est transmis de mère en fille depuis des siècles.

## La révolution des coopératives féminines

À partir des années 1990-2000, des centaines de coopératives féminines se sont créées dans la région d''Agadir et d''Essaouira. Le principe : les femmes qui concassaient à domicile pour des intermédiaires deviennent sociétaires, vendent une huile finie (et non des amandons bruts), et captent une part bien supérieure de la valeur. Les meilleures coopératives y ont ajouté l''alphabétisation, la certification bio et IGP (l''« Argane » bénéficie d''une indication géographique protégée), et des contrats directs avec les acheteurs européens de cosmétique et d''épicerie fine.

Les effets documentés dans la région : un revenu monétaire propre pour des femmes rurales qui n''en avaient souvent aucun, la scolarisation des filles en hausse, et un intérêt économique direct à préserver l''arganeraie — chaque arbre productif compte.

## Alimentaire ou cosmétique : deux huiles différentes

- **Huile alimentaire** : amandons **torréfiés** avant pression — goût de noisette, réservée à l''assaisonnement (amlou, couscous, salades). Point important : elle ne se cuit pas à haute température.
- **Huile cosmétique** : amandons crus, pressés à froid — riche en vitamine E et en acides gras insaturés, c''est l''ingrédient star des soins capillaires et anti-âge.

Pour l''acheteur : la mention IGP Argane, la certification bio (Ecocert est très présent dans la filière) et l''origine coopérative se vérifient — demandez les numéros et contrôlez aux registres, comme pour toute certification.

## Les défis, sans les cacher

La filière fait face à trois tensions : la sécheresse récurrente qui réduit les récoltes, la pression de la demande cosmétique mondiale qui fait grimper le prix des amandons (et attire les fraudes au mélange avec des huiles moins chères), et le risque que la valeur reparte vers des intermédiaires industriels. La réponse passe par ce que les meilleures coopératives font déjà : vendre fini, certifié, traçable, en direct.

C''est exactement le modèle qu''EthiMarket outille — pour l''argane comme pour le café ou le cacao : des coopératives vérifiées, des certificats contrôlés à la source, et un circuit court international qui laisse la valeur là où le travail est fait.', read_time = 8 WHERE slug = 'portrait-fatima-benali-argan-atlas';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{en,title}', to_jsonb('Argan oil: the Moroccan women''s cooperatives behind liquid gold'::text)), '{en,excerpt}', to_jsonb('30-40 kg of fruit and 8-10 hours of hand-cracking per litre, UNESCO-listed argan groves, PGI certification, and how cooperatives changed rural women''s income.'::text)) WHERE slug = 'portrait-fatima-benali-argan-atlas';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{es,title}', to_jsonb('Aceite de argán: las cooperativas femeninas marroquíes detrás del oro líquido'::text)), '{es,excerpt}', to_jsonb('30-40 kg de fruto y 8-10 horas de trabajo por litro, el arganeral UNESCO, la IGP y cómo las cooperativas cambiaron el ingreso de las mujeres rurales.'::text)) WHERE slug = 'portrait-fatima-benali-argan-atlas';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{pt,title}', to_jsonb('Óleo de argão: as cooperativas femininas marroquinas por trás do ouro líquido'::text)), '{pt,excerpt}', to_jsonb('30-40 kg de fruto e 8-10 horas de trabalho por litro, o arganal UNESCO, a IGP e como as cooperativas mudaram o rendimento das mulheres rurais.'::text)) WHERE slug = 'portrait-fatima-benali-argan-atlas';
UPDATE articles SET translations = jsonb_set(jsonb_set(translations, '{ar,title}', to_jsonb('زيت الأركان: التعاونيات النسائية المغربية وراء الذهب السائل'::text)), '{ar,excerpt}', to_jsonb('30-40 كغ من الثمار و8-10 ساعات عمل لكل لتر، غابات الأركان المصنفة يونسكو، البيان الجغرافي المحمي، وكيف غيّرت التعاونيات دخل نساء الأرياف.'::text)) WHERE slug = 'portrait-fatima-benali-argan-atlas';
COMMIT;
SELECT slug, length(content) AS len, read_time FROM articles ORDER BY published_at;

-- Titres FR des portraits : filières réelles, plus de personnes fictives
BEGIN;
UPDATE articles SET
  title = 'Yirgacheffe : le café de jardin, là où le café est né',
  excerpt = 'Parcelles familiales sous ombrage natif à 2 000 m, qualité de poste de lavage, grades éthiopiens : comprendre le café le plus floral du monde.'
WHERE slug = 'yirgacheffe-coffee-union-ethiopie';
UPDATE articles SET
  title = 'Safran d''Iran : au cœur de l''épice la plus précieuse du monde',
  excerpt = '150 000 fleurs par kilo, normes ISO 3632, Negin vs Sargol, tests anti-fraude : le guide de l''acheteur exigeant.'
WHERE slug = 'saffron-fields-iran-renaissance-safran';
UPDATE articles SET
  title = 'Huile d''argane : les coopératives féminines derrière l''or liquide du Maroc',
  excerpt = '30 à 40 kg de fruits et 8 à 10 heures de travail par litre, arganeraie UNESCO, IGP Argane : comment les coopératives ont changé le revenu des femmes rurales.',
  author_name = 'Équipe EthiMarket'
WHERE slug = 'portrait-fatima-benali-argan-atlas';
UPDATE articles SET author_name = 'Équipe EthiMarket';
COMMIT;
SELECT slug, left(title, 60) AS title FROM articles ORDER BY published_at;
