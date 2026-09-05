-- Articles SEO B2B (chantier #3 — canal SEO « à planter tôt », plan §9.1).
-- 6 articles ciblant les requêtes des segments prioritaires : torréfacteurs,
-- chocolatiers (EUDR), épiceries bio, restaurateurs, acheteurs vanille/argane.
-- Politique d'honnêteté : faits sourcés dans le texte, pas de stat inventée,
-- aucune promesse de fonctionnalité inexistante. Auteur unique Équipe EthiMarket.
-- Rejouable : INSERT ... ON CONFLICT (slug) DO NOTHING.

INSERT INTO articles (title, slug, excerpt, category, image_url, author_name, published_at, read_time, featured, content, translations)
VALUES

-- ============================================================ 1. Café vert direct
(
  'Acheter du café vert en direct d''une coopérative : le guide du torréfacteur',
  'acheter-cafe-vert-direct-cooperative-guide-torrefacteur',
  'FOB, unions de coopératives, documents d''import, EUDR : les étapes concrètes pour sécuriser un approvisionnement direct en café vert d''Éthiopie.',
  'Guides pratiques',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
  'Équipe EthiMarket',
  now() - interval '6 days', 11, true,
  $md$## Pourquoi acheter en direct maintenant

Les cours de l'arabica ont atteint des niveaux historiquement élevés. Pour un torréfacteur artisanal, dépendre d'un seul négociant devient un risque : prix subis, origines interchangeables, traçabilité déclarative. L'achat en direct auprès d'une union de coopératives permet de sécuriser un volume annuel, de connaître la prime réellement versée au producteur et de raconter une histoire vraie à ses clients.

## Comprendre le prix FOB

Le prix FOB (Free On Board) est le prix du café rendu au port d'embarquement, avant fret maritime, assurance, douane et transport intérieur européen. À titre d'exemple documenté, les prix FOB annoncés par les unions du sud de l'Éthiopie pour un Yirgacheffe G1 lavé se situaient entre 8 et 11 $/kg sur la campagne 2025/26. Il faut y ajouter environ 1,5 à 3 €/kg de logistique selon le volume et le mode d'expédition pour obtenir un coût rendu Europe.

## Les unions éthiopiennes, un bon point d'entrée

En Éthiopie, les petits producteurs sont organisés en coopératives primaires, elles-mêmes regroupées en unions exportatrices : Yirgacheffe (YCFCU), Sidama (SCFCU), Oromia (OCFCU). Ces unions détiennent leurs licences d'export, publient leurs certifications (bio UE, Fairtrade avec identifiant FLO vérifiable dans le registre public FLO-CERT) et vendent par sacs de 60 kg, souvent à partir d'une palette.

## Les documents à exiger

- **Certificat bio UE** (règlement 2018/848) couvrant le lot, avec certificat d'inspection COI à l'import.
- **Certificat phytosanitaire** émis au départ.
- **Géolocalisation des parcelles** : le règlement européen déforestation (EUDR, 2023/1115) impose la diligence raisonnée sur le café — un fournisseur qui ne peut pas fournir les coordonnées GPS de ses parcelles est un signal d'alerte.
- **Rapport qualité** (grade, tri, humidité) et idéalement un échantillon type avant contrat.

## Les étapes concrètes

1. Demander 2-3 échantillons de 250 g (green sample) et les cupper.
2. Négocier volume annuel, calendrier d'expédition, incoterm.
3. Vérifier les certifications AUX REGISTRES, pas sur PDF.
4. Premier ordre modeste (1-5 sacs via groupage) pour tester le circuit complet.
5. Documenter chaque lot : c'est votre argument commercial en boutique.

Sur EthiMarket, chaque coopérative est vérifiée aux registres officiels avant d'être visible, et chaque lot voyage avec son dossier documentaire consultable par QR code.$md$,
  jsonb_build_object(
    'en', jsonb_build_object(
      'title', 'Buying green coffee directly from a cooperative: the roaster''s guide',
      'excerpt', 'FOB, cooperative unions, import documents, EUDR: the concrete steps to secure a direct green coffee supply from Ethiopia.',
      'category', 'Practical guides',
      'content', $md$## Why buy direct now

Arabica prices have reached historically high levels. For an artisan roaster, depending on a single trader is a risk: imposed prices, interchangeable origins, declarative traceability. Buying directly from a cooperative union secures an annual volume, reveals the premium actually paid to the producer, and gives you a true story to tell customers.

## Understanding the FOB price

FOB (Free On Board) is the price of coffee delivered to the port of shipment, before sea freight, insurance, customs and inland transport. As a documented example, FOB prices announced by southern Ethiopian unions for a washed Yirgacheffe G1 ranged between 8 and 11 $/kg for the 2025/26 season. Add roughly 1.5-3 €/kg of logistics depending on volume to get a landed-Europe cost.

## Ethiopian unions: a good entry point

Ethiopian smallholders are organised in primary cooperatives grouped into exporting unions: Yirgacheffe (YCFCU), Sidama (SCFCU), Oromia (OCFCU). These unions hold export licences, publish their certifications (EU organic, Fairtrade with a FLO ID verifiable in the public FLO-CERT registry) and sell by 60 kg bags, often from one pallet.

## Documents to demand

- **EU organic certificate** (Regulation 2018/848) covering the lot, with a COI inspection certificate at import.
- **Phytosanitary certificate** issued at departure.
- **Plot geolocation**: the EU Deforestation Regulation (EUDR, 2023/1115) imposes due diligence on coffee — a supplier who cannot provide GPS coordinates is a red flag.
- **Quality report** (grade, sorting, moisture) and ideally a type sample before contract.

## The concrete steps

1. Request 2-3 green samples of 250 g and cup them.
2. Negotiate annual volume, shipping calendar, incoterm.
3. Verify certifications AGAINST REGISTRIES, not PDFs.
4. Start with a modest order (1-5 bags via consolidation) to test the full circuit.
5. Document every lot: it is your sales argument in the shop.

On EthiMarket, every cooperative is registry-verified before becoming visible, and every lot travels with its documentary file accessible by QR code.$md$),
    'es', jsonb_build_object(
      'title', 'Comprar café verde directamente a una cooperativa: guía del tostador',
      'excerpt', 'FOB, uniones de cooperativas, documentos de importación, EUDR: los pasos concretos para asegurar un suministro directo de café verde de Etiopía.',
      'category', 'Guías prácticas',
      'content', $md$## Por qué comprar en directo

Los precios del arábica están en niveles históricamente altos. Comprar directamente a una unión de cooperativas permite asegurar volumen anual, conocer la prima realmente pagada al productor y contar una historia verdadera.

## El precio FOB

El FOB es el precio en el puerto de embarque, antes de flete, seguro y aduana. Ejemplo documentado: los FOB anunciados por las uniones etíopes para un Yirgacheffe G1 lavado se situaron entre 8 y 11 $/kg en la campaña 2025/26. Añada 1,5-3 €/kg de logística según el volumen.

## Las uniones etíopes

Los pequeños productores se agrupan en uniones exportadoras: Yirgacheffe (YCFCU), Sidama (SCFCU), Oromia (OCFCU), con licencias de exportación y certificaciones verificables (bio UE, Fairtrade con ID FLO en el registro público FLO-CERT).

## Documentos a exigir

Certificado bio UE (2018/848) con COI, certificado fitosanitario, geolocalización de parcelas (reglamento EUDR 2023/1115) e informe de calidad con muestra previa.

## Los pasos

1. Pedir 2-3 muestras y catarlas. 2. Negociar volumen y calendario. 3. Verificar certificaciones EN LOS REGISTROS. 4. Primer pedido modesto en grupaje. 5. Documentar cada lote.

En EthiMarket, cada cooperativa se verifica en los registros oficiales y cada lote viaja con su expediente consultable por QR.$md$),
    'pt', jsonb_build_object(
      'title', 'Comprar café verde diretamente de uma cooperativa: o guia do torrefador',
      'excerpt', 'FOB, uniões de cooperativas, documentos de importação, EUDR: os passos concretos para garantir um fornecimento direto de café verde da Etiópia.',
      'category', 'Guias práticos',
      'content', $md$## Porquê comprar direto

Os preços do arábica atingiram níveis historicamente altos. Comprar diretamente a uma união de cooperativas garante volume anual, revela o prémio realmente pago ao produtor e dá uma história verdadeira para contar.

## O preço FOB

O FOB é o preço no porto de embarque, antes do frete, seguro e alfândega. Exemplo documentado: os FOB anunciados pelas uniões etíopes para um Yirgacheffe G1 lavado situaram-se entre 8 e 11 $/kg na campanha 2025/26. Acrescente 1,5-3 €/kg de logística.

## As uniões etíopes

Os pequenos produtores organizam-se em uniões exportadoras: Yirgacheffe (YCFCU), Sidama (SCFCU), Oromia (OCFCU), com licenças de exportação e certificações verificáveis (bio UE, Fairtrade com ID FLO no registo público FLO-CERT).

## Documentos a exigir

Certificado bio UE (2018/848) com COI, certificado fitossanitário, geolocalização das parcelas (regulamento EUDR 2023/1115), relatório de qualidade e amostra prévia.

## Os passos

1. Pedir 2-3 amostras e prová-las. 2. Negociar volume e calendário. 3. Verificar certificações NOS REGISTOS. 4. Primeira encomenda modesta em grupagem. 5. Documentar cada lote.

Na EthiMarket, cada cooperativa é verificada nos registos oficiais e cada lote viaja com o seu dossiê consultável por QR.$md$),
    'ar', jsonb_build_object(
      'title', 'شراء البن الأخضر مباشرة من تعاونية: دليل المحمّص',
      'excerpt', 'سعر FOB، اتحادات التعاونيات، وثائق الاستيراد، لائحة EUDR: خطوات عملية لتأمين توريد مباشر للبن الأخضر من إثيوبيا.',
      'category', 'أدلة عملية',
      'content', $md$## لماذا الشراء المباشر الآن

بلغت أسعار الأرابيكا مستويات قياسية. الشراء المباشر من اتحاد تعاونيات يؤمّن حجماً سنوياً ويكشف العلاوة المدفوعة فعلاً للمنتج ويمنحك قصة حقيقية ترويها لعملائك.

## فهم سعر FOB

سعر FOB هو سعر البن عند ميناء الشحن قبل الشحن البحري والتأمين والجمارك. مثال موثّق: تراوحت أسعار FOB المعلنة من الاتحادات الإثيوبية ليرغاتشيف G1 المغسول بين 8 و11 دولاراً للكيلوغرام في موسم 2025/26.

## الاتحادات الإثيوبية

ينتظم صغار المنتجين في اتحادات مصدّرة: يرغاتشيف (YCFCU) وسيداما (SCFCU) وأوروميا (OCFCU)، وتملك تراخيص التصدير وشهادات يمكن التحقق منها في السجلات العامة (بيو الاتحاد الأوروبي، التجارة العادلة بمعرّف FLO).

## الوثائق المطلوبة

شهادة بيو الاتحاد الأوروبي (اللائحة 2018/848) مع شهادة COI، شهادة صحة نباتية، إحداثيات GPS للمزارع (لائحة إزالة الغابات EUDR 2023/1115)، وتقرير جودة مع عيّنة قبل التعاقد.

## الخطوات العملية

اطلب عينات وقيّمها، فاوض على الحجم والجدول، تحقق من الشهادات في السجلات لا في ملفات PDF، ابدأ بطلب صغير عبر الشحن المجمّع، ووثّق كل دفعة.

في إيثي ماركت، يتم التحقق من كل تعاونية في السجلات الرسمية قبل ظهورها، وتسافر كل دفعة مع ملفها الوثائقي القابل للاطلاع عبر رمز QR.$md$)
  )
),

-- ============================================================ 2. EUDR
(
  'EUDR : ce que le règlement déforestation change pour le café et le cacao',
  'reglement-eudr-cafe-cacao-guide-2026',
  'Géolocalisation des parcelles, diligence raisonnée, sanctions jusqu''à 4 % du chiffre d''affaires UE : le guide pratique du règlement 2023/1115 pour torréfacteurs et chocolatiers.',
  'Commerce équitable',
  'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?auto=format&fit=crop&w=800&q=80',
  'Équipe EthiMarket',
  now() - interval '5 days', 10, false,
  $md$## De quoi parle-t-on

Le règlement UE 2023/1115, dit EUDR (EU Deforestation Regulation), interdit de mettre sur le marché européen du café, du cacao (et cinq autres matières premières) issus de terres déboisées après le 31 décembre 2020. Son application a été fixée au 30 décembre 2025 pour les grandes entreprises et au 30 juin 2026 pour les micro et petites entreprises.

## Qui est concerné

Tout opérateur qui met le produit sur le marché UE pour la première fois. Un torréfacteur ou un chocolatier bean-to-bar qui importe directement son café vert ou ses fèves est un opérateur au sens du règlement : la diligence raisonnée lui incombe. Celui qui achète à un importateur français reste soumis à des obligations allégées de traçabilité (conserver les références des déclarations amont).

## Les trois obligations de la diligence raisonnée

1. **Collecte d'informations** : géolocalisation de toutes les parcelles de production (coordonnées GPS, polygones au-delà de 4 hectares), date de production, pays, fournisseur.
2. **Évaluation du risque** : le pays est-il classé à risque standard ou faible ? La chaîne est-elle documentée ?
3. **Déclaration de diligence raisonnée** déposée dans le système d'information européen (TRACES) avant la mise sur le marché, avec numéro de référence à conserver.

## Les sanctions

Le règlement prévoit des amendes dont le maximum est d'au moins 4 % du chiffre d'affaires UE de l'opérateur, la confiscation des produits et l'exclusion temporaire des marchés publics.

## Comment se préparer concrètement

- Exiger dès maintenant les coordonnées GPS des parcelles à vos fournisseurs — les coopératives structurées (Éthiopie, Ghana) savent les fournir.
- Archiver chaque dossier lot (GPS, contrats, certificats) pendant 5 ans.
- Privilégier les fournisseurs capables de prouver leur chaîne plutôt que de la déclarer.

C'est exactement le travail qu'EthiMarket fait en amont : les producteurs vérifiés fournissent leurs données de parcelles, et chaque lot conserve son dossier documentaire consultable.$md$,
  jsonb_build_object(
    'en', jsonb_build_object(
      'title', 'EUDR: what the deforestation regulation changes for coffee and cocoa',
      'excerpt', 'Plot geolocation, due diligence, fines of at least 4% of EU turnover: the practical guide to Regulation 2023/1115 for roasters and chocolate makers.',
      'category', 'Fair trade',
      'content', $md$## What it is

EU Regulation 2023/1115 (EUDR) prohibits placing coffee, cocoa and five other commodities on the European market if they come from land deforested after 31 December 2020. Application was set at 30 December 2025 for large companies and 30 June 2026 for micro and small enterprises.

## Who is concerned

Any operator placing the product on the EU market for the first time. A roaster or bean-to-bar chocolate maker importing green coffee or beans directly is an operator under the regulation: due diligence falls on them. Buying from a French importer leaves you with lighter traceability duties (keep upstream declaration references).

## The three due-diligence obligations

1. **Information collection**: geolocation of all production plots (GPS points, polygons above 4 hectares), production date, country, supplier.
2. **Risk assessment**: is the country standard or low risk? Is the chain documented?
3. **Due diligence statement** filed in the EU information system before placing on the market, with a reference number to keep.

## Penalties

Fines with a maximum of at least 4% of the operator's EU turnover, product confiscation, temporary exclusion from public procurement.

## How to prepare

- Demand GPS coordinates from your suppliers now — structured cooperatives (Ethiopia, Ghana) can provide them.
- Archive each lot file (GPS, contracts, certificates) for 5 years.
- Prefer suppliers who can prove their chain rather than declare it.

This is exactly the upstream work EthiMarket does: verified producers provide plot data, and every lot keeps its consultable documentary file.$md$),
    'es', jsonb_build_object(
      'title', 'EUDR: lo que el reglamento de deforestación cambia para el café y el cacao',
      'excerpt', 'Geolocalización de parcelas, diligencia debida, multas de al menos el 4 % de la facturación UE: guía práctica del reglamento 2023/1115.',
      'category', 'Comercio justo',
      'content', $md$## De qué se trata

El reglamento UE 2023/1115 (EUDR) prohíbe comercializar en Europa café y cacao procedentes de tierras deforestadas después del 31 de diciembre de 2020. Aplicación: 30 de diciembre de 2025 para grandes empresas, 30 de junio de 2026 para micro y pequeñas.

## Quién está afectado

Quien coloca el producto por primera vez en el mercado UE. Un tostador o chocolatero bean-to-bar que importa directamente es un operador: la diligencia debida le corresponde.

## Las tres obligaciones

1. Geolocalización de todas las parcelas (GPS, polígonos por encima de 4 ha), fecha, país, proveedor. 2. Evaluación del riesgo. 3. Declaración de diligencia debida en el sistema europeo antes de la comercialización.

## Sanciones

Multas de al menos el 4 % de la facturación UE, confiscación de productos, exclusión temporal de contratos públicos.

## Cómo prepararse

Exigir ya las coordenadas GPS a los proveedores, archivar cada expediente de lote durante 5 años, preferir proveedores que PRUEBAN su cadena. Es el trabajo que EthiMarket hace en origen: los productores verificados aportan sus datos de parcelas.$md$),
    'pt', jsonb_build_object(
      'title', 'EUDR: o que o regulamento do desmatamento muda para o café e o cacau',
      'excerpt', 'Geolocalização das parcelas, devida diligência, multas de pelo menos 4 % do volume de negócios UE: guia prático do regulamento 2023/1115.',
      'category', 'Comércio justo',
      'content', $md$## Do que se trata

O regulamento UE 2023/1115 (EUDR) proíbe colocar no mercado europeu café e cacau provenientes de terras desmatadas após 31 de dezembro de 2020. Aplicação: 30 de dezembro de 2025 para grandes empresas, 30 de junho de 2026 para micro e pequenas.

## Quem é abrangido

Quem coloca o produto pela primeira vez no mercado UE. Um torrefador ou chocolateiro bean-to-bar que importa diretamente é um operador: a devida diligência cabe-lhe.

## As três obrigações

1. Geolocalização de todas as parcelas (GPS, polígonos acima de 4 ha), data, país, fornecedor. 2. Avaliação do risco. 3. Declaração de devida diligência no sistema europeu antes da colocação no mercado.

## Sanções

Multas de pelo menos 4 % do volume de negócios UE, confisco dos produtos, exclusão temporária dos contratos públicos.

## Como preparar-se

Exigir desde já as coordenadas GPS aos fornecedores, arquivar cada dossiê de lote durante 5 anos, preferir fornecedores que PROVAM a sua cadeia. É o trabalho que a EthiMarket faz a montante: os produtores verificados fornecem os dados das parcelas.$md$),
    'ar', jsonb_build_object(
      'title', 'لائحة EUDR: ما الذي تغيّره لائحة إزالة الغابات للبن والكاكاو',
      'excerpt', 'إحداثيات المزارع، العناية الواجبة، وغرامات لا تقل عن 4٪ من رقم الأعمال الأوروبي: الدليل العملي للائحة 2023/1115.',
      'category', 'التجارة العادلة',
      'content', $md$## ما هي اللائحة

تحظر لائحة الاتحاد الأوروبي 2023/1115 (EUDR) طرح البن والكاكاو في السوق الأوروبية إذا كانا من أراضٍ أزيلت غاباتها بعد 31 ديسمبر 2020. التطبيق: 30 ديسمبر 2025 للشركات الكبرى و30 يونيو 2026 للشركات الصغرى.

## من المعني

كل من يطرح المنتج لأول مرة في سوق الاتحاد. المحمّص أو صانع الشوكولاتة الذي يستورد مباشرة يُعد مشغّلاً وتقع عليه العناية الواجبة.

## الالتزامات الثلاثة

جمع المعلومات (إحداثيات GPS لكل المزارع، مضلعات فوق 4 هكتارات، التاريخ والبلد والمورد)، تقييم المخاطر، ثم إيداع إقرار العناية الواجبة في النظام الأوروبي قبل الطرح في السوق.

## العقوبات

غرامات لا يقل حدها الأقصى عن 4٪ من رقم الأعمال الأوروبي، ومصادرة المنتجات، والاستبعاد المؤقت من الصفقات العامة.

## كيف تستعد

اطلب الآن إحداثيات GPS من مورديك، واحتفظ بملف كل دفعة لمدة 5 سنوات، وفضّل الموردين القادرين على إثبات سلسلتهم. هذا بالضبط ما تقوم به إيثي ماركت: المنتجون الموثّقون يقدّمون بيانات مزارعهم مسبقاً.$md$)
  )
),

-- ============================================================ 3. Vanille anti-fraude
(
  'Vanille de Madagascar : le guide de l''acheteur pour éviter la fraude',
  'vanille-madagascar-eviter-fraude-guide-acheteur',
  'Gousses réhydratées, mélanges d''origines, taux de vanilline : comment un pâtissier ou une épicerie fine vérifie ce qu''il achète vraiment.',
  'Guides pratiques',
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
  'Équipe EthiMarket',
  now() - interval '4 days', 9, false,
  $md$## Un produit à très forte valeur… et très fraudé

La vanille naturelle est l'une des épices les plus chères du monde. Mécaniquement, elle attire les pratiques trompeuses : gousses de grade inférieur réhydratées pour paraître « gourmet », mélanges d'origines revendus comme pur Madagascar, et arôme de synthèse vendu comme extrait naturel. Pour un professionnel, la parade n'est pas la méfiance généralisée : c'est la vérification documentaire.

## Les critères objectifs d'une gousse Grade A

- **Longueur** : typiquement 14 cm et plus pour le grade A (gourmet/noire).
- **Humidité** : une gousse gourmet se situe généralement autour de 30-35 % ; en dessous de 25 %, on parle de vanille rouge (grade B), destinée à l'extraction.
- **Taux de vanilline** : généralement compris entre 1,5 et 2 % pour une bonne gousse de Madagascar — c'est le chiffre à demander sur le certificat d'analyse.
- **Aspect** : souple, huileuse, sans moisissure ; le givre de vanilline est un bon signe, pas un défaut.

## Les trois questions qui démasquent

1. **« Quel est le numéro de lot et sa région de collecte ? »** Une vraie filière sait répondre (SAVA : Sambava, Antalaha, Vohémar, Andapa).
2. **« Pouvez-vous fournir un certificat d'analyse récent du lot ? »** Humidité et vanilline mesurées, pas déclarées.
3. **« Qui a préparé la vanille ? »** Le nom du groupement de préparateurs figure sur les documents d'export d'une filière propre.

## Le prix, indicateur imparfait mais utile

Une vanille gourmet sérieusement tracée ne peut pas coûter le prix d'une vanille d'extraction. Un écart de prix spectaculaire par rapport au marché cache presque toujours un grade inférieur, un stock ancien ou une origine différente.

## Ce que change une traçabilité par lot

Sur EthiMarket, chaque lot de vanille conserve son dossier : origine, préparateur, certificats, analyses. Le QR code du lot permet à votre client final de vérifier lui-même — l'argument de vente devient une preuve.$md$,
  jsonb_build_object(
    'en', jsonb_build_object(
      'title', 'Madagascar vanilla: the buyer''s guide to avoiding fraud',
      'excerpt', 'Rehydrated pods, origin blending, vanillin content: how a pastry chef or fine grocer verifies what they are really buying.',
      'category', 'Practical guides',
      'content', $md$## A very high-value — and much-defrauded — product

Natural vanilla is one of the world's most expensive spices, which mechanically attracts deceptive practices: lower-grade pods rehydrated to look "gourmet", blended origins sold as pure Madagascar, synthetic flavour sold as natural extract. The professional's defence is not generalised distrust: it is documentary verification.

## Objective criteria for a Grade A pod

- **Length**: typically 14 cm and above for grade A (gourmet/black).
- **Moisture**: a gourmet pod generally sits around 30-35%; below 25% it is red vanilla (grade B), meant for extraction.
- **Vanillin content**: generally between 1.5 and 2% for a good Madagascar pod — the figure to request on the certificate of analysis.
- **Appearance**: supple, oily, mould-free; vanillin frost is a good sign, not a defect.

## The three unmasking questions

1. **"What is the lot number and collection region?"** A real supply chain can answer (SAVA: Sambava, Antalaha, Vohémar, Andapa).
2. **"Can you provide a recent certificate of analysis for the lot?"** Moisture and vanillin measured, not declared.
3. **"Who cured the vanilla?"** The preparer group's name appears on export documents of a clean chain.

## Price: imperfect but useful

Seriously traced gourmet vanilla cannot cost extraction-grade prices. A spectacular discount almost always hides a lower grade, old stock or a different origin.

## What per-lot traceability changes

On EthiMarket, each vanilla lot keeps its file: origin, preparer, certificates, analyses. The lot's QR code lets your end customer verify it themselves — the sales pitch becomes proof.$md$),
    'es', jsonb_build_object(
      'title', 'Vainilla de Madagascar: guía del comprador para evitar el fraude',
      'excerpt', 'Vainas rehidratadas, mezclas de orígenes, contenido de vainillina: cómo verificar lo que realmente compra.',
      'category', 'Guías prácticas',
      'content', $md$## Un producto muy fraudado

La vainilla natural es una de las especias más caras del mundo y atrae prácticas engañosas: vainas de grado inferior rehidratadas, mezclas vendidas como puro Madagascar, aroma sintético vendido como natural. La defensa es la verificación documental.

## Criterios de una vaina Grado A

Longitud típica de 14 cm o más; humedad en torno al 30-35 % (por debajo del 25 % es vainilla roja de extracción); vainillina generalmente entre 1,5 y 2 %; vaina flexible y aceitosa, sin moho.

## Las tres preguntas clave

1. ¿Número de lote y región de recolección? (SAVA: Sambava, Antalaha, Vohémar, Andapa). 2. ¿Certificado de análisis reciente del lote? 3. ¿Quién preparó la vainilla?

## El precio como indicador

Una vainilla gourmet trazada no puede costar como la de extracción: un descuento espectacular esconde casi siempre un grado inferior o un stock antiguo.

## La trazabilidad por lote

En EthiMarket cada lote conserva su expediente y su código QR: el argumento de venta se convierte en prueba.$md$),
    'pt', jsonb_build_object(
      'title', 'Baunilha de Madagáscar: o guia do comprador para evitar a fraude',
      'excerpt', 'Favas reidratadas, misturas de origens, teor de vanilina: como verificar o que realmente compra.',
      'category', 'Guias práticos',
      'content', $md$## Um produto muito fraudado

A baunilha natural é uma das especiarias mais caras do mundo e atrai práticas enganosas: favas de grau inferior reidratadas, misturas vendidas como puro Madagáscar, aroma sintético vendido como natural. A defesa é a verificação documental.

## Critérios de uma fava Grau A

Comprimento típico de 14 cm ou mais; humidade à volta de 30-35 % (abaixo de 25 % é baunilha vermelha de extração); vanilina geralmente entre 1,5 e 2 %; fava flexível e oleosa, sem bolor.

## As três perguntas-chave

1. Número de lote e região de colheita? (SAVA: Sambava, Antalaha, Vohémar, Andapa). 2. Certificado de análise recente do lote? 3. Quem preparou a baunilha?

## O preço como indicador

Uma baunilha gourmet rastreada não pode custar como a de extração: um desconto espetacular esconde quase sempre um grau inferior ou stock antigo.

## A rastreabilidade por lote

Na EthiMarket cada lote conserva o seu dossiê e o seu código QR: o argumento de venda torna-se prova.$md$),
    'ar', jsonb_build_object(
      'title', 'فانيليا مدغشقر: دليل المشتري لتجنّب الغش',
      'excerpt', 'قرون معاد ترطيبها، خلط الأصول، نسبة الفانيلين: كيف يتحقق المحترف مما يشتريه فعلاً.',
      'category', 'أدلة عملية',
      'content', $md$## منتج ثمين وكثير الغش

الفانيليا الطبيعية من أغلى التوابل في العالم، ما يجذب ممارسات مضللة: قرون من درجة أدنى يُعاد ترطيبها لتبدو فاخرة، وخلط أصول يُباع على أنه مدغشقري صافٍ. دفاع المحترف هو التحقق الوثائقي.

## معايير القرن من الدرجة الأولى

الطول عادة 14 سم فأكثر؛ الرطوبة حوالي 30-35٪ (تحت 25٪ تعتبر فانيليا حمراء للاستخلاص)؛ نسبة الفانيلين عادة بين 1.5 و2٪ وهي الرقم الذي يجب طلبه في شهادة التحليل؛ قرن مرن زيتي بلا عفن.

## الأسئلة الثلاثة الكاشفة

ما رقم الدفعة ومنطقة الجمع؟ (سافا: سامبافا، أنتالاها، فوهيمار، أندابا). هل تتوفر شهادة تحليل حديثة للدفعة؟ من قام بتحضير الفانيليا؟

## السعر مؤشر مفيد

فانيليا فاخرة موثّقة لا يمكن أن تُباع بسعر فانيليا الاستخلاص: الخصم المذهل يخفي غالباً درجة أدنى أو مخزوناً قديماً.

## ما تغيّره التتبعية

في إيثي ماركت يحتفظ كل قرن بدفعته وملفه ورمز QR الخاص به: حجة البيع تصبح دليلاً.$md$)
  )
),

-- ============================================================ 4. Épicerie sourcing direct
(
  'Épiceries bio : pourquoi (et comment) sourcer en direct des coopératives',
  'epicerie-bio-sourcing-direct-cooperatives',
  'Le circuit spécialisé bio a progressé de 8,5 % en 2025. La différenciation se joue sur l''histoire vraie des produits — voici comment construire un approvisionnement direct sans y passer ses semaines.',
  'Guides pratiques',
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80',
  'Équipe EthiMarket',
  now() - interval '3 days', 9, false,
  $md$## Le contexte : le spécialisé repart, la différenciation devient vitale

Selon l'Agence Bio, le marché bio français a atteint 12,6 milliards d'euros en 2025 (+3,6 %), et c'est le circuit spécialisé qui tire la reprise avec +8,5 % — pendant que la grande distribution stagne. Ce que le client d'une épicerie bio vient chercher, c'est précisément ce que la GMS ne sait pas offrir : la sélection, le conseil et l'histoire vraie des produits.

## Ce que le direct change pour une épicerie

- **La marge** : moins d'intermédiaires sur des produits secs à DLC longue (café, vanille, huiles, épices, miel) — la catégorie idéale pour débuter.
- **L'histoire** : « cette huile d'argane vient de la coopérative féminine X, voici sa certification et son lot » est un argument de vente qu'aucune centrale ne fournit.
- **L'exclusivité locale** : un micro-lot que le supermarché d'à côté n'aura jamais.

## Les obstacles réels (et comment les contourner)

1. **Les volumes** : une coopérative exporte par palettes, une épicerie achète par cartons. Solution : le groupage — plusieurs boutiques partagent une palette, ou passent par une plateforme qui consolide.
2. **La conformité documentaire** : certificat bio UE, COI, étiquetage. C'est le vrai coût caché du direct — d'où l'intérêt de fournisseurs dont les documents sont déjà vérifiés et archivés par lot.
3. **La confiance à 6 000 km** : impossible d'auditer soi-même une coopérative à Madagascar. Exiger des certifications vérifiées aux registres officiels (pas des PDF transmis par e-mail).

## Par où commencer

Choisissez une catégorie signature (la vanille et le safran font d'excellents produits d'appel : forte valeur, faible encombrement, forte histoire), testez un premier carton, mesurez la rotation, puis élargissez. Les produits d'épicerie sèche pardonnent les erreurs : pas de chaîne du froid, DLC de 12 à 36 mois.

Sur EthiMarket, les producteurs sont vérifiés aux registres avant d'être visibles, les documents de chaque lot sont archivés, et les commandes par carton sont possibles sur les produits à forte valeur.$md$,
  jsonb_build_object(
    'en', jsonb_build_object(
      'title', 'Organic grocery stores: why (and how) to source directly from cooperatives',
      'excerpt', 'The French specialist organic channel grew 8.5% in 2025. Differentiation now hinges on true product stories — here is how to build direct sourcing without losing your weeks.',
      'category', 'Practical guides',
      'content', $md$## The context

According to Agence Bio, the French organic market reached €12.6 billion in 2025 (+3.6%), with the specialist channel driving the recovery at +8.5% while supermarkets stagnate. What customers seek in an organic grocery is exactly what supermarkets cannot offer: curation, advice and true product stories.

## What direct sourcing changes

- **Margin**: fewer intermediaries on long-shelf-life dry goods (coffee, vanilla, oils, spices, honey) — the ideal starter category.
- **The story**: "this argan oil comes from women's cooperative X, here is its certification and lot" is a sales argument no wholesaler provides.
- **Local exclusivity**: a micro-lot the supermarket next door will never have.

## The real obstacles (and workarounds)

1. **Volumes**: cooperatives export by pallets, groceries buy by cartons. Solution: consolidation — several shops share a pallet, or use a platform that consolidates.
2. **Documentary compliance**: EU organic certificate, COI, labelling. This is the hidden cost of direct — hence the value of suppliers whose documents are already verified and archived per lot.
3. **Trust at 6,000 km**: you cannot audit a Malagasy cooperative yourself. Demand registry-verified certifications (not e-mailed PDFs).

## Where to start

Pick a signature category (vanilla and saffron make excellent entry products: high value, small footprint, strong story), test a first carton, measure rotation, then widen. Dry goods forgive mistakes: no cold chain, 12-36 months shelf life.

On EthiMarket, producers are registry-verified before becoming visible, each lot's documents are archived, and carton-level orders are possible on high-value products.$md$),
    'es', jsonb_build_object(
      'title', 'Tiendas bio: por qué (y cómo) abastecerse directamente de cooperativas',
      'excerpt', 'El canal especializado bio francés creció un 8,5 % en 2025. La diferenciación se juega en la historia verdadera de los productos.',
      'category', 'Guías prácticas',
      'content', $md$## El contexto

Según la Agence Bio, el mercado bio francés alcanzó 12 600 millones de euros en 2025 (+3,6 %), con el canal especializado creciendo un 8,5 %. Lo que el cliente busca es lo que el supermercado no ofrece: selección, consejo e historias verdaderas.

## Lo que cambia el directo

Más margen en productos secos de larga vida (café, vainilla, aceites, especias, miel); una historia verificable como argumento de venta; exclusividad local con micro-lotes.

## Los obstáculos reales

1. Volúmenes: las cooperativas exportan por palés — solución: el grupaje. 2. Conformidad documental: certificado bio UE, COI, etiquetado — el coste oculto del directo. 3. Confianza a 6 000 km: exigir certificaciones verificadas en los registros oficiales.

## Por dónde empezar

Elija una categoría insignia (vainilla y azafrán: alto valor, poco volumen, mucha historia), pruebe una primera caja, mida la rotación y amplíe. En EthiMarket, los productores se verifican en los registros y los documentos de cada lote quedan archivados.$md$),
    'pt', jsonb_build_object(
      'title', 'Mercearias bio: porquê (e como) abastecer-se diretamente de cooperativas',
      'excerpt', 'O canal especializado bio francês cresceu 8,5 % em 2025. A diferenciação joga-se na história verdadeira dos produtos.',
      'category', 'Guias práticos',
      'content', $md$## O contexto

Segundo a Agence Bio, o mercado bio francês atingiu 12,6 mil milhões de euros em 2025 (+3,6 %), com o canal especializado a crescer 8,5 %. O que o cliente procura é o que o supermercado não oferece: seleção, conselho e histórias verdadeiras.

## O que muda o direto

Mais margem em produtos secos de longa validade (café, baunilha, óleos, especiarias, mel); uma história verificável como argumento de venda; exclusividade local com micro-lotes.

## Os obstáculos reais

1. Volumes: as cooperativas exportam por paletes — solução: a grupagem. 2. Conformidade documental: certificado bio UE, COI, rotulagem — o custo oculto do direto. 3. Confiança a 6 000 km: exigir certificações verificadas nos registos oficiais.

## Por onde começar

Escolha uma categoria emblemática (baunilha e açafrão: alto valor, pouco volume, muita história), teste uma primeira caixa, meça a rotação e alargue. Na EthiMarket, os produtores são verificados nos registos e os documentos de cada lote ficam arquivados.$md$),
    'ar', jsonb_build_object(
      'title', 'متاجر البقالة العضوية: لماذا وكيف تشتري مباشرة من التعاونيات',
      'excerpt', 'نما قطاع المتاجر العضوية المتخصصة في فرنسا 8.5٪ في 2025. التمايز يُبنى على القصة الحقيقية للمنتجات.',
      'category', 'أدلة عملية',
      'content', $md$## السياق

وفق وكالة Agence Bio بلغ السوق العضوي الفرنسي 12.6 مليار يورو في 2025 (+3.6٪)، ويقود القطاع المتخصص الانتعاش بنمو 8.5٪. ما يبحث عنه زبون المتجر العضوي هو ما لا تقدمه المتاجر الكبرى: الانتقاء والنصيحة والقصص الحقيقية.

## ما يغيّره الشراء المباشر

هامش أفضل في المنتجات الجافة طويلة الصلاحية (بن، فانيليا، زيوت، توابل، عسل)؛ قصة موثّقة كحجة بيع؛ وحصرية محلية عبر الدفعات الصغيرة.

## العقبات الحقيقية

الأحجام: التعاونيات تصدّر بالمنصات والحل هو التجميع بين عدة متاجر؛ المطابقة الوثائقية (شهادة بيو الاتحاد الأوروبي وCOI والملصقات) وهي التكلفة الخفية؛ والثقة عن بعد 6000 كم بطلب شهادات موثّقة في السجلات الرسمية لا ملفات PDF.

## من أين تبدأ

اختر فئة مميزة (الفانيليا والزعفران: قيمة عالية وحجم صغير وقصة قوية)، جرّب أول صندوق وقس الدوران ثم وسّع. في إيثي ماركت يتم التحقق من المنتجين في السجلات وتُؤرشف وثائق كل دفعة.$md$)
  )
),

-- ============================================================ 5. Argane IGP
(
  'Huile d''argane IGP : alimentaire ou cosmétique, ce qu''un acheteur doit vérifier',
  'huile-argane-igp-alimentaire-cosmetique-verifier',
  'IGP Argane, coopératives féminines, torréfaction, analyses : les vérifications concrètes avant d''acheter de l''huile d''argane en professionnel.',
  'Guides pratiques',
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
  'Équipe EthiMarket',
  now() - interval '2 days', 8, false,
  $md$## Une filière unique au monde

L'arganier ne pousse qu'au Maroc (et marginalement en Algérie). Sa forêt, l'arganeraie, est réserve de biosphère UNESCO depuis 1998, et les savoir-faire liés à l'arganier sont inscrits au patrimoine culturel immatériel de l'UNESCO depuis 2014. L'huile d'argane a par ailleurs été le premier produit marocain protégé par une Indication Géographique Protégée (IGP Argane).

## Alimentaire ou cosmétique : deux produits différents

- **L'huile alimentaire** est pressée à partir d'amandons **torréfiés** : goût de noisette, usage culinaire (elle ne se cuit pas, elle assaisonne).
- **L'huile cosmétique** est pressée à partir d'amandons **crus** : quasi inodore, usage peau et cheveux.

Un fournisseur qui vend « la même huile pour les deux usages » révèle un problème de process — ou de sincérité.

## Pourquoi les coopératives féminines

L'extraction traditionnelle est un savoir-faire féminin. Les coopératives féminines structurées (régions d'Agadir, Taroudant, Essaouira) offrent une double garantie : un produit authentique et une valeur qui reste aux femmes qui font le travail. Beaucoup sont certifiées bio (Ecocert/ONSSA) et certaines cumulent IGP et labels équitables comme Fair for Life.

## Les vérifications de l'acheteur professionnel

1. **Certificat bio UE en cours de validité**, vérifié auprès de l'organisme (pas un PDF).
2. **IGP Argane** sur les documents du lot.
3. **Analyses physico-chimiques du lot** : indice d'acidité et indice de peroxyde — les deux marqueurs d'une huile fraîche et bien stockée.
4. **Conditionnement** : verre foncé ou bidon opaque ; l'huile d'argane craint la lumière.
5. **Prix cohérent** : l'argane demande environ 30 kg de fruits pour un litre d'huile ; un prix anormalement bas signale une coupe avec d'autres huiles.

Sur EthiMarket, les coopératives d'argane sont vérifiées aux registres, et chaque lot arrive avec ses certificats et analyses consultables par QR code.$md$,
  jsonb_build_object(
    'en', jsonb_build_object(
      'title', 'PGI argan oil: food-grade or cosmetic, what a buyer must check',
      'excerpt', 'Argane PGI, women''s cooperatives, roasting, analyses: the concrete checks before buying argan oil professionally.',
      'category', 'Practical guides',
      'content', $md$## A one-of-a-kind supply chain

The argan tree grows only in Morocco (marginally in Algeria). Its forest has been a UNESCO biosphere reserve since 1998, and argan-related know-how joined UNESCO's intangible cultural heritage in 2014. Argan oil was also the first Moroccan product protected by a Protected Geographical Indication (Argane PGI).

## Food-grade vs cosmetic: two different products

- **Food-grade oil** is pressed from **roasted** kernels: hazelnut taste, culinary use (season, don't cook).
- **Cosmetic oil** is pressed from **raw** kernels: nearly odourless, for skin and hair.

A supplier selling "the same oil for both uses" reveals a process — or sincerity — problem.

## Why women's cooperatives

Traditional extraction is women's know-how. Structured women's cooperatives (Agadir, Taroudant, Essaouira regions) offer a double guarantee: an authentic product and value that stays with the women doing the work. Many are organic-certified (Ecocert/ONSSA) and some combine PGI with fair-trade labels such as Fair for Life.

## The professional buyer's checks

1. **Valid EU organic certificate**, verified with the body (not a PDF).
2. **Argane PGI** on the lot's documents.
3. **Lot physico-chemical analyses**: acidity and peroxide values — the two markers of a fresh, well-stored oil.
4. **Packaging**: dark glass or opaque drum; argan oil fears light.
5. **Coherent price**: about 30 kg of fruit go into one litre; an abnormally low price signals blending with other oils.

On EthiMarket, argan cooperatives are registry-verified and each lot arrives with its certificates and analyses accessible by QR code.$md$),
    'es', jsonb_build_object(
      'title', 'Aceite de argán IGP: alimentario o cosmético, qué debe verificar un comprador',
      'excerpt', 'IGP Argane, cooperativas femeninas, tostado, análisis: las verificaciones concretas antes de comprar aceite de argán.',
      'category', 'Guías prácticas',
      'content', $md$## Una cadena única

El argán solo crece en Marruecos. Su bosque es reserva de la biosfera UNESCO desde 1998 y los saberes del argán son patrimonio inmaterial UNESCO desde 2014. Fue el primer producto marroquí con Indicación Geográfica Protegida (IGP Argane).

## Alimentario o cosmético

El aceite alimentario se prensa con almendras TOSTADAS (sabor a avellana); el cosmético con almendras CRUDAS (casi inodoro). Un proveedor que vende «el mismo aceite para ambos usos» revela un problema.

## Las cooperativas femeninas

La extracción tradicional es un saber femenino. Las cooperativas estructuradas (Agadir, Taroudant, Essaouira) garantizan producto auténtico y valor que queda en manos de quienes trabajan. Muchas están certificadas bio (Ecocert/ONSSA), algunas con IGP y Fair for Life.

## Las verificaciones

1. Certificado bio UE vigente, verificado ante el organismo. 2. IGP en los documentos del lote. 3. Análisis del lote: índices de acidez y de peróxidos. 4. Envase opaco (teme la luz). 5. Precio coherente: unos 30 kg de fruto por litro — un precio anormalmente bajo señala mezcla.

En EthiMarket, las cooperativas se verifican en los registros y cada lote llega con sus certificados consultables por QR.$md$),
    'pt', jsonb_build_object(
      'title', 'Óleo de argão IGP: alimentar ou cosmético, o que um comprador deve verificar',
      'excerpt', 'IGP Argane, cooperativas femininas, torrefação, análises: as verificações concretas antes de comprar óleo de argão.',
      'category', 'Guias práticos',
      'content', $md$## Uma fileira única

A argânia só cresce em Marrocos. A sua floresta é reserva da biosfera UNESCO desde 1998 e os saberes do argão são património imaterial UNESCO desde 2014. Foi o primeiro produto marroquino com Indicação Geográfica Protegida (IGP Argane).

## Alimentar ou cosmético

O óleo alimentar é prensado com amêndoas TORRADAS (sabor a avelã); o cosmético com amêndoas CRUAS (quase inodoro). Um fornecedor que vende «o mesmo óleo para os dois usos» revela um problema.

## As cooperativas femininas

A extração tradicional é um saber feminino. As cooperativas estruturadas (Agadir, Taroudant, Essaouira) garantem produto autêntico e valor que fica com quem trabalha. Muitas são certificadas bio (Ecocert/ONSSA), algumas com IGP e Fair for Life.

## As verificações

1. Certificado bio UE válido, verificado junto do organismo. 2. IGP nos documentos do lote. 3. Análises do lote: índices de acidez e de peróxidos. 4. Embalagem opaca (teme a luz). 5. Preço coerente: cerca de 30 kg de fruto por litro — um preço anormalmente baixo indica mistura.

Na EthiMarket, as cooperativas são verificadas nos registos e cada lote chega com os seus certificados consultáveis por QR.$md$),
    'ar', jsonb_build_object(
      'title', 'زيت الأرغان IGP: غذائي أم تجميلي، ما الذي يجب على المشتري التحقق منه',
      'excerpt', 'العلامة الجغرافية المحمية، التعاونيات النسائية، التحميص، التحاليل: الفحوص العملية قبل شراء زيت الأرغان.',
      'category', 'أدلة عملية',
      'content', $md$## سلسلة فريدة في العالم

لا تنمو شجرة الأرغان إلا في المغرب. غابتها محمية محيط حيوي لليونسكو منذ 1998، والمهارات المرتبطة بها مسجلة في التراث الثقافي غير المادي لليونسكو منذ 2014. وكان زيت الأرغان أول منتج مغربي يحمل علامة جغرافية محمية (IGP Argane).

## غذائي أم تجميلي

الزيت الغذائي يُعصر من لوز محمّص (نكهة البندق)، والتجميلي من لوز نيّئ (بلا رائحة تقريباً). المورد الذي يبيع «الزيت نفسه للاستخدامين» يكشف مشكلة في العملية أو في الصدق.

## لماذا التعاونيات النسائية

الاستخراج التقليدي مهارة نسائية. التعاونيات المنظمة (أكادير، تارودانت، الصويرة) تضمن منتجاً أصيلاً وقيمة تبقى للنساء العاملات. كثير منها معتمد بيو (إيكوسيرت/ONSSA) وبعضها يجمع IGP وFair for Life.

## فحوص المشتري المحترف

شهادة بيو أوروبية سارية موثّقة لدى الهيئة؛ علامة IGP على وثائق الدفعة؛ تحاليل الدفعة (مؤشر الحموضة ومؤشر البيروكسيد)؛ عبوة معتمة لأن الزيت يخاف الضوء؛ وسعر منطقي إذ يتطلب اللتر نحو 30 كغ من الثمار — السعر المنخفض بشكل غير طبيعي يعني الخلط.

في إيثي ماركت يتم التحقق من تعاونيات الأرغان في السجلات وتصل كل دفعة بشهاداتها وتحاليلها عبر رمز QR.$md$)
  )
),

-- ============================================================ 6. Safran ISO 3632
(
  'Safran : savoir lire un certificat ISO 3632 avant d''acheter',
  'safran-iso-3632-guide-acheteur-professionnel',
  'Crocine, picrocrocine, safranal, catégories I à III : le mode d''emploi du certificat d''analyse qui sépare le vrai safran du safran coupé.',
  'Guides pratiques',
  'https://images.unsplash.com/photo-1600841867003-e6f27f77129e?auto=format&fit=crop&w=800&q=80',
  'Équipe EthiMarket',
  now() - interval '1 day', 8, false,
  $md$## L'épice la plus chère du monde, donc la plus coupée

Il faut environ 150 fleurs de Crocus sativus pour un gramme de safran sec, récoltées et émondées à la main. Cette rareté attire toutes les fraudes connues : mélange avec du carthame (« safran bâtard »), coloration au curcuma, stigmates déjà épuisés par une première infusion, sur-humidification pour vendre de l'eau au prix du safran.

## ISO 3632 : la norme qui objective la qualité

La norme ISO 3632 mesure trois marqueurs par spectrophotométrie :

- **La crocine** (pouvoir colorant, lecture à 440 nm) : c'est le critère principal. Catégorie I : ≥ 200. En dessous de 120 (catégorie III), le safran est faible ou vieux.
- **La picrocrocine** (pouvoir amérisant, 257 nm) : catégorie I ≥ 70.
- **Le safranal** (pouvoir aromatique, 330 nm) : la norme demande une valeur comprise entre 20 et 50.

Un très bon safran de récolte récente dépasse souvent 230-250 de crocine. Le certificat doit mentionner le laboratoire, la date d'analyse et le numéro de lot.

## Les questions à poser au fournisseur

1. **« Le certificat ISO 3632 correspond-il à CE lot, ou à un lot ancien ? »** L'analyse doit dater de la campagne en cours.
2. **« Filaments entiers ou poudre ? »** La poudre est infalsifiable à l'œil : n'en achetez qu'avec un certificat, ou préférez les filaments.
3. **« Quelle origine précise ? »** Taliouine (Maroc) bénéficie d'une AOP ; l'origine doit figurer sur les documents, pas seulement sur l'argumentaire.

## Le réflexe prix

Comptez l'ordre de grandeur : avec ~150 fleurs par gramme et une récolte manuelle, le vrai safran de qualité ne descend pas en dessous de plusieurs euros le gramme en vrac. Un « safran » à prix cassé est soit coupé, soit épuisé, soit autre chose que du safran.

Sur EthiMarket, les lots de safran sont accompagnés de leur certificat d'analyse consultable, et l'origine est vérifiée documentairement.$md$,
  jsonb_build_object(
    'en', jsonb_build_object(
      'title', 'Saffron: how to read an ISO 3632 certificate before buying',
      'excerpt', 'Crocin, picrocrocin, safranal, categories I to III: the user manual for the certificate of analysis that separates real saffron from cut saffron.',
      'category', 'Practical guides',
      'content', $md$## The world's most expensive spice — hence the most adulterated

About 150 Crocus sativus flowers are needed for one gram of dry saffron, hand-picked and hand-trimmed. That rarity attracts every known fraud: blending with safflower ("bastard saffron"), turmeric colouring, stigmas already exhausted by a first infusion, over-humidification.

## ISO 3632: the standard that objectifies quality

ISO 3632 measures three markers by spectrophotometry:

- **Crocin** (colouring strength, read at 440 nm): the main criterion. Category I: ≥ 200. Below 120 (category III), saffron is weak or old.
- **Picrocrocin** (bittering strength, 257 nm): category I ≥ 70.
- **Safranal** (aromatic strength, 330 nm): the standard requires a value between 20 and 50.

A very good fresh-harvest saffron often exceeds 230-250 crocin. The certificate must state the laboratory, analysis date and lot number.

## Questions for the supplier

1. **"Does the ISO 3632 certificate match THIS lot?"** The analysis must be from the current campaign.
2. **"Whole filaments or powder?"** Powder cannot be eye-checked: only buy it with a certificate, or prefer filaments.
3. **"Which precise origin?"** Taliouine (Morocco) holds a PDO; origin must appear on documents, not just in the pitch.

## The price reflex

With ~150 flowers per gram and manual harvest, real quality saffron does not drop below several euros per gram in bulk. Discount "saffron" is cut, exhausted, or not saffron.

On EthiMarket, saffron lots come with their consultable certificate of analysis, and origin is documentarily verified.$md$),
    'es', jsonb_build_object(
      'title', 'Azafrán: cómo leer un certificado ISO 3632 antes de comprar',
      'excerpt', 'Crocina, picrocrocina, safranal, categorías I a III: el manual del certificado de análisis que separa el azafrán real del cortado.',
      'category', 'Guías prácticas',
      'content', $md$## La especia más cara del mundo

Se necesitan unas 150 flores de Crocus sativus por gramo de azafrán seco. Esa rareza atrae todos los fraudes: mezcla con cártamo, coloración con cúrcuma, estigmas agotados, sobre-humidificación.

## ISO 3632

La norma mide tres marcadores: crocina (poder colorante, 440 nm; categoría I ≥ 200, por debajo de 120 es categoría III), picrocrocina (amargor, 257 nm; cat. I ≥ 70) y safranal (aroma, 330 nm; entre 20 y 50). Un gran azafrán reciente supera a menudo 230-250 de crocina. El certificado debe indicar laboratorio, fecha y número de lote.

## Preguntas al proveedor

1. ¿El certificado corresponde a ESTE lote? 2. ¿Filamentos o polvo? (el polvo, solo con certificado). 3. ¿Origen preciso? Taliouine (Marruecos) tiene DOP.

## El reflejo del precio

Con ~150 flores por gramo, el azafrán de calidad no baja de varios euros el gramo a granel. Un «azafrán» a precio de saldo está cortado, agotado o no es azafrán. En EthiMarket, los lotes llegan con su certificado consultable.$md$),
    'pt', jsonb_build_object(
      'title', 'Açafrão: como ler um certificado ISO 3632 antes de comprar',
      'excerpt', 'Crocina, picrocrocina, safranal, categorias I a III: o manual do certificado de análise que separa o açafrão verdadeiro do adulterado.',
      'category', 'Guias práticos',
      'content', $md$## A especiaria mais cara do mundo

São precisas cerca de 150 flores de Crocus sativus por grama de açafrão seco. Essa raridade atrai todas as fraudes: mistura com cártamo, coloração com curcuma, estigmas esgotados, sobre-humidificação.

## ISO 3632

A norma mede três marcadores: crocina (poder corante, 440 nm; categoria I ≥ 200, abaixo de 120 é categoria III), picrocrocina (amargor, 257 nm; cat. I ≥ 70) e safranal (aroma, 330 nm; entre 20 e 50). Um grande açafrão recente ultrapassa muitas vezes 230-250 de crocina. O certificado deve indicar laboratório, data e número de lote.

## Perguntas ao fornecedor

1. O certificado corresponde a ESTE lote? 2. Filamentos ou pó? (o pó, só com certificado). 3. Origem precisa? Taliouine (Marrocos) tem DOP.

## O reflexo do preço

Com ~150 flores por grama, o açafrão de qualidade não desce abaixo de vários euros por grama a granel. Um «açafrão» a preço de saldo está adulterado, esgotado ou não é açafrão. Na EthiMarket, os lotes chegam com o seu certificado consultável.$md$),
    'ar', jsonb_build_object(
      'title', 'الزعفران: كيف تقرأ شهادة ISO 3632 قبل الشراء',
      'excerpt', 'الكروسين والبيكروكروسين والسافرانال والفئات من I إلى III: دليل شهادة التحليل التي تفصل الزعفران الحقيقي عن المغشوش.',
      'category', 'أدلة عملية',
      'content', $md$## أغلى التوابل وأكثرها غشاً

يلزم نحو 150 زهرة من نبات الزعفران لغرام واحد جاف، تُقطف وتُشذّب يدوياً. هذه الندرة تجذب كل أنواع الغش: الخلط بالعصفر، التلوين بالكركم، مياسم مستنفدة، أو رطوبة زائدة.

## معيار ISO 3632

يقيس المعيار ثلاثة مؤشرات بالمطيافية: الكروسين (قوة التلوين عند 440 نانومتر؛ الفئة الأولى ≥ 200 وتحت 120 تكون الفئة الثالثة)، والبيكروكروسين (المرارة عند 257؛ الفئة الأولى ≥ 70)، والسافرانال (العطر عند 330؛ بين 20 و50). الزعفران الممتاز حديث القطف يتجاوز غالباً 230-250 كروسين. يجب أن تذكر الشهادة المختبر وتاريخ التحليل ورقم الدفعة.

## أسئلة للمورد

هل تعود الشهادة لهذه الدفعة تحديداً؟ خيوط كاملة أم مسحوق؟ (المسحوق لا يُشترى إلا بشهادة). ما الأصل الدقيق؟ تاليوين بالمغرب تحمل تسمية منشأ محمية.

## حسّ السعر

بنحو 150 زهرة للغرام وقطف يدوي، لا ينزل الزعفران الجيد عن عدة يوروهات للغرام بالجملة. «الزعفران» الرخيص إما مغشوش أو مستنفد أو ليس زعفراناً. في إيثي ماركت تصل دفعات الزعفران مع شهادة تحليلها القابلة للاطلاع.$md$)
  )
)
ON CONFLICT (slug) DO NOTHING;
