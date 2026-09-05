/**
 * Contenus multilingues — page « Pour les professionnels »
 * (landing d'acquisition B2B : épiceries bio, restaurants, torréfacteurs,
 * grossistes). Règle éditoriale : chaque affirmation est prouvable.
 */
import type { PerLocale } from './types';

export type ProfessionalsContent = {
  heroLabel: string;
  heroTitle: string;
  heroText: string;
  heroCta: string;
  heroCta2: string;
  painsLabel: string;
  painsTitle: string;
  pains: { emoji: string; pain: string; answer: string }[];
  proofLabel: string;
  proofTitle: string;
  proofs: { emoji: string; title: string; desc: string }[];
  stepsLabel: string;
  stepsTitle: string;
  steps: { title: string; desc: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
};

const fr: ProfessionalsContent = {
  heroLabel: 'Pour les professionnels',
  heroTitle: 'Sourcez en direct des producteurs bio vérifiés',
  heroText: 'Épiceries, restaurants, torréfacteurs, grossistes : achetez café, cacao, épices, huiles et miels directement aux coopératives — avec les preuves, les documents d\'import et la traçabilité que votre métier exige.',
  heroCta: 'Créer mon compte acheteur',
  heroCta2: 'Parcourir le catalogue',
  painsLabel: 'Vos problèmes, nos réponses',
  painsTitle: 'Le sourcing direct, sans les risques du sourcing direct',
  pains: [
    { emoji: '🕵️', pain: '« Comment savoir si ce fournisseur est fiable ? »', answer: 'Chaque producteur est vérifié avant publication : identité, registre du commerce, certifications contrôlées dans les registres officiels (Ecocert, FLO-CERT, USDA…). Le détail des contrôles est public sur sa boutique.' },
    { emoji: '📄', pain: '« Les documents d\'import, c\'est l\'enfer »', answer: 'La plateforme génère la liste exacte des documents exigés pour chaque lot selon le produit et l\'origine (certificat bio COI, phytosanitaire, analyses) — et bloque l\'expédition tant qu\'ils ne sont pas fournis.' },
    { emoji: '🧪', pain: '« Et si la qualité n\'est pas au rendez-vous ? »', answer: 'Échantillon avec numéro de lot avant première commande, analyses de laboratoire commandables sur le lot, réception contrôlée en 4 points — une non-conformité ouvre automatiquement un dossier arbitré.' },
    { emoji: '💸', pain: '« Les intermédiaires mangent la marge »', answer: 'Vous payez le producteur en direct, au prix qu\'il a fixé. EthiMarket prélève 5 % au producteur, rien de plus, et votre argent ne transite jamais par nous.' },
  ],
  proofLabel: 'Ce qui nous distingue',
  proofTitle: 'De la preuve, pas des promesses',
  proofs: [
    { emoji: '🛡️', title: 'Producteurs vérifiés à la source', desc: 'Six critères prouvés un par un — jamais sur la seule foi d\'un PDF. Les preuves (méthode, date, registre consulté) sont publiées.' },
    { emoji: '🔍', title: 'Traçabilité publique par lot', desc: 'Chaque expédition porte un QR code : origine, documents, analyses, réception. Montrez-le à vos propres clients.' },
    { emoji: '🇪🇺', title: 'Conformité UE intégrée', desc: 'Filières sous contrôles renforcés signalées (règl. 2019/1793), veille sanitaire RASFF quotidienne, exigences EUDR (géolocalisation café/cacao) intégrées aux dossiers produits.' },
    { emoji: '🌱', title: 'Impact chiffré, jamais inventé', desc: 'Empreintes CO2 et eau calculées sur références scientifiques (ADEME, Poore & Nemecek), affichées avec leur source. Zéro fret aérien, par principe.' },
  ],
  stepsLabel: 'Démarrer',
  stepsTitle: 'Votre première commande en 4 étapes',
  steps: [
    { title: 'Créez votre compte gratuit', desc: 'Accès immédiat au catalogue et aux fiches producteurs complètes.' },
    { title: 'Demandez un devis — avec échantillon', desc: 'Quantité, destination, et l\'option « échantillon avant première commande » en un clic.' },
    { title: 'Commandez en connaissance de cause', desc: 'Prix dégressifs affichés, documents du lot listés d\'avance, paiement direct au producteur (virement ou carte).' },
    { title: 'Réceptionnez, contrôlez, recommandez', desc: 'Contrôle guidé en 4 points à la livraison. Un problème ? Dossier qualité arbitré par notre équipe.' },
  ],
  faqTitle: 'Questions des acheteurs professionnels',
  faq: [
    { q: 'Y a-t-il un abonnement ou des frais acheteur ?', a: 'Non. La création de compte, la consultation, les devis et les commandes sont gratuits pour l\'acheteur. La commission de 5 % est à la charge du producteur.' },
    { q: 'Quels volumes puis-je commander ?', a: 'Chaque producteur affiche son MOQ (commande minimum) et ses paliers de prix. Du colis de 5 kg à la palette — et au-delà en direct avec accompagnement documentaire.' },
    { q: 'Qui est l\'importateur si j\'achète hors UE ?', a: 'Pour les achats directs, vous êtes l\'importateur : la plateforme vous fournit la feuille de route douanière par pays d\'origine (documents, régimes, points de contrôle) et les documents du lot voyagent avec la commande.' },
    { q: 'Comment se passe un litige ?', a: 'Vous ouvrez le litige sur la commande ; notre équipe instruit un dossier tracé (photos, documents, historique du lot) et arbitre. Les constats sont enregistrés de façon permanente.' },
    { q: 'Puis-je payer par virement classique ?', a: 'Oui — c\'est même le circuit principal : virement direct au producteur à réception de facture. Le paiement par carte est disponible en option.' },
  ],
  ctaTitle: 'Votre prochain fournisseur est déjà vérifié',
  ctaText: 'Créez votre compte en 2 minutes et demandez votre premier devis avec échantillon aujourd\'hui.',
  ctaButton: 'Créer mon compte acheteur',
};

const en: ProfessionalsContent = {
  heroLabel: 'For professionals',
  heroTitle: 'Source directly from verified organic producers',
  heroText: 'Grocers, restaurants, roasters, wholesalers: buy coffee, cocoa, spices, oils and honeys directly from cooperatives — with the evidence, import documents and traceability your trade demands.',
  heroCta: 'Create my buyer account',
  heroCta2: 'Browse the catalogue',
  painsLabel: 'Your problems, our answers',
  painsTitle: 'Direct sourcing, without the risks of direct sourcing',
  pains: [
    { emoji: '🕵️', pain: '"How do I know this supplier is reliable?"', answer: 'Every producer is verified before publication: identity, business registry, certifications checked in official registries (Ecocert, FLO-CERT, USDA…). The details of the checks are public on their shop.' },
    { emoji: '📄', pain: '"Import documents are hell"', answer: 'The platform generates the exact list of documents required for each batch based on product and origin (organic COI, phytosanitary, analyses) — and blocks shipment until they are provided.' },
    { emoji: '🧪', pain: '"What if the quality isn\'t there?"', answer: 'Batch-numbered sample before the first order, lab analyses orderable on the batch, 4-point checked reception — a non-conformity automatically opens an arbitrated case.' },
    { emoji: '💸', pain: '"Middlemen eat the margin"', answer: 'You pay the producer directly, at the price they set. EthiMarket charges the producer 5%, nothing more, and your money never passes through us.' },
  ],
  proofLabel: 'What sets us apart',
  proofTitle: 'Evidence, not promises',
  proofs: [
    { emoji: '🛡️', title: 'Producers verified at the source', desc: 'Six criteria proven one by one — never on the sole faith of a PDF. The evidence (method, date, registry consulted) is published.' },
    { emoji: '🔍', title: 'Public per-batch traceability', desc: 'Every shipment carries a QR code: origin, documents, analyses, reception. Show it to your own customers.' },
    { emoji: '🇪🇺', title: 'Built-in EU compliance', desc: 'Reinforced-control supply chains flagged (Reg. 2019/1793), daily RASFF health watch, EUDR requirements (coffee/cocoa geolocation) built into product files.' },
    { emoji: '🌱', title: 'Impact quantified, never invented', desc: 'CO2 and water footprints computed from scientific references (ADEME, Poore & Nemecek), displayed with their source. Zero air freight, on principle.' },
  ],
  stepsLabel: 'Getting started',
  stepsTitle: 'Your first order in 4 steps',
  steps: [
    { title: 'Create your free account', desc: 'Immediate access to the catalogue and full producer files.' },
    { title: 'Request a quote — with a sample', desc: 'Quantity, destination, and the "sample before first order" option in one click.' },
    { title: 'Order with full knowledge', desc: 'Volume pricing displayed, batch documents listed upfront, direct payment to the producer (transfer or card).' },
    { title: 'Receive, check, reorder', desc: 'Guided 4-point check on delivery. A problem? Quality case arbitrated by our team.' },
  ],
  faqTitle: 'Professional buyers\' questions',
  faq: [
    { q: 'Is there a subscription or buyer fee?', a: 'No. Account creation, browsing, quotes and orders are free for buyers. The 5% commission is borne by the producer.' },
    { q: 'What volumes can I order?', a: 'Each producer displays their MOQ and price tiers. From a 5 kg parcel to a pallet — and beyond, with documentary support.' },
    { q: 'Who is the importer if I buy from outside the EU?', a: 'For direct purchases you are the importer: the platform provides the customs roadmap per origin country and the batch documents travel with the order.' },
    { q: 'How does a dispute work?', a: 'You open the dispute on the order; our team builds a traced case (photos, documents, batch history) and arbitrates. Findings are recorded permanently.' },
    { q: 'Can I pay by regular bank transfer?', a: 'Yes — it is the primary circuit: direct transfer to the producer upon invoice. Card payment is available as an option.' },
  ],
  ctaTitle: 'Your next supplier is already verified',
  ctaText: 'Create your account in 2 minutes and request your first quote with a sample today.',
  ctaButton: 'Create my buyer account',
};

const es: ProfessionalsContent = {
  heroLabel: 'Para profesionales',
  heroTitle: 'Compre directamente a productores ecológicos verificados',
  heroText: 'Tiendas, restaurantes, tostadores, mayoristas: compre café, cacao, especias, aceites y mieles directamente a las cooperativas — con las pruebas, los documentos de importación y la trazabilidad que su oficio exige.',
  heroCta: 'Crear mi cuenta de comprador',
  heroCta2: 'Ver el catálogo',
  painsLabel: 'Sus problemas, nuestras respuestas',
  painsTitle: 'Compra directa, sin los riesgos de la compra directa',
  pains: [
    { emoji: '🕵️', pain: '«¿Cómo sé si este proveedor es fiable?»', answer: 'Cada productor se verifica antes de publicar: identidad, registro mercantil, certificaciones controladas en los registros oficiales (Ecocert, FLO-CERT, USDA…). El detalle de los controles es público en su tienda.' },
    { emoji: '📄', pain: '«Los documentos de importación son un infierno»', answer: 'La plataforma genera la lista exacta de documentos exigidos para cada lote según producto y origen (COI ecológico, fitosanitario, análisis) — y bloquea el envío hasta que se aporten.' },
    { emoji: '🧪', pain: '«¿Y si la calidad no llega?»', answer: 'Muestra con número de lote antes del primer pedido, análisis de laboratorio sobre el lote, recepción controlada en 4 puntos — una no conformidad abre automáticamente un expediente arbitrado.' },
    { emoji: '💸', pain: '«Los intermediarios se comen el margen»', answer: 'Usted paga al productor directamente, al precio que él fija. EthiMarket cobra al productor un 5 %, nada más, y su dinero nunca pasa por nosotros.' },
  ],
  proofLabel: 'Lo que nos distingue',
  proofTitle: 'Pruebas, no promesas',
  proofs: [
    { emoji: '🛡️', title: 'Productores verificados en la fuente', desc: 'Seis criterios probados uno a uno — nunca sobre la sola fe de un PDF. Las pruebas (método, fecha, registro consultado) se publican.' },
    { emoji: '🔍', title: 'Trazabilidad pública por lote', desc: 'Cada envío lleva un código QR: origen, documentos, análisis, recepción. Muéstrelo a sus propios clientes.' },
    { emoji: '🇪🇺', title: 'Conformidad UE integrada', desc: 'Cadenas bajo controles reforzados señaladas (Regl. 2019/1793), vigilancia sanitaria RASFF diaria, exigencias EUDR (geolocalización café/cacao) integradas.' },
    { emoji: '🌱', title: 'Impacto cuantificado, nunca inventado', desc: 'Huellas de CO2 y agua calculadas con referencias científicas (ADEME, Poore & Nemecek), mostradas con su fuente. Cero flete aéreo, por principio.' },
  ],
  stepsLabel: 'Empezar',
  stepsTitle: 'Su primer pedido en 4 etapas',
  steps: [
    { title: 'Cree su cuenta gratuita', desc: 'Acceso inmediato al catálogo y a las fichas completas de productores.' },
    { title: 'Pida un presupuesto — con muestra', desc: 'Cantidad, destino y la opción «muestra antes del primer pedido» en un clic.' },
    { title: 'Pida con conocimiento de causa', desc: 'Precios por volumen a la vista, documentos del lote listados de antemano, pago directo al productor.' },
    { title: 'Reciba, controle, repita', desc: 'Control guiado en 4 puntos a la entrega. ¿Un problema? Expediente de calidad arbitrado por nuestro equipo.' },
  ],
  faqTitle: 'Preguntas de compradores profesionales',
  faq: [
    { q: '¿Hay suscripción o comisión para el comprador?', a: 'No. La cuenta, la consulta, los presupuestos y los pedidos son gratuitos para el comprador. La comisión del 5 % corre a cargo del productor.' },
    { q: '¿Qué volúmenes puedo pedir?', a: 'Cada productor muestra su MOQ y sus tramos de precio. Desde el paquete de 5 kg hasta el palé — y más allá, con acompañamiento documental.' },
    { q: '¿Quién es el importador si compro fuera de la UE?', a: 'En las compras directas usted es el importador: la plataforma le da la hoja de ruta aduanera por país de origen y los documentos del lote viajan con el pedido.' },
    { q: '¿Cómo funciona un litigio?', a: 'Usted abre el litigio sobre el pedido; nuestro equipo instruye un expediente trazado y arbitra. Las constataciones quedan registradas de forma permanente.' },
    { q: '¿Puedo pagar por transferencia normal?', a: 'Sí — es el circuito principal: transferencia directa al productor contra factura. El pago con tarjeta está disponible como opción.' },
  ],
  ctaTitle: 'Su próximo proveedor ya está verificado',
  ctaText: 'Cree su cuenta en 2 minutos y pida hoy su primer presupuesto con muestra.',
  ctaButton: 'Crear mi cuenta de comprador',
};

const pt: ProfessionalsContent = {
  heroLabel: 'Para profissionais',
  heroTitle: 'Compre diretamente a produtores biológicos verificados',
  heroText: 'Mercearias, restaurantes, torrefadores, grossistas: compre café, cacau, especiarias, óleos e méis diretamente às cooperativas — com as provas, os documentos de importação e a rastreabilidade que o seu ofício exige.',
  heroCta: 'Criar a minha conta de comprador',
  heroCta2: 'Ver o catálogo',
  painsLabel: 'Os seus problemas, as nossas respostas',
  painsTitle: 'Compra direta, sem os riscos da compra direta',
  pains: [
    { emoji: '🕵️', pain: '«Como sei se este fornecedor é fiável?»', answer: 'Cada produtor é verificado antes da publicação: identidade, registo comercial, certificações controladas nos registos oficiais (Ecocert, FLO-CERT, USDA…). O detalhe dos controlos é público na sua loja.' },
    { emoji: '📄', pain: '«Os documentos de importação são um inferno»', answer: 'A plataforma gera a lista exata de documentos exigidos para cada lote segundo produto e origem (COI bio, fitossanitário, análises) — e bloqueia a expedição até serem fornecidos.' },
    { emoji: '🧪', pain: '«E se a qualidade não corresponder?»', answer: 'Amostra com número de lote antes da primeira encomenda, análises laboratoriais sobre o lote, receção controlada em 4 pontos — uma não conformidade abre automaticamente um processo arbitrado.' },
    { emoji: '💸', pain: '«Os intermediários comem a margem»', answer: 'Paga diretamente ao produtor, ao preço que ele fixou. A EthiMarket cobra 5 % ao produtor, nada mais, e o seu dinheiro nunca passa por nós.' },
  ],
  proofLabel: 'O que nos distingue',
  proofTitle: 'Provas, não promessas',
  proofs: [
    { emoji: '🛡️', title: 'Produtores verificados na fonte', desc: 'Seis critérios provados um a um — nunca com base apenas num PDF. As provas (método, data, registo consultado) são publicadas.' },
    { emoji: '🔍', title: 'Rastreabilidade pública por lote', desc: 'Cada expedição leva um código QR: origem, documentos, análises, receção. Mostre-o aos seus próprios clientes.' },
    { emoji: '🇪🇺', title: 'Conformidade UE integrada', desc: 'Cadeias sob controlos reforçados assinaladas (Regl. 2019/1793), vigilância sanitária RASFF diária, exigências EUDR (geolocalização café/cacau) integradas.' },
    { emoji: '🌱', title: 'Impacto quantificado, nunca inventado', desc: 'Pegadas de CO2 e água calculadas com referências científicas (ADEME, Poore & Nemecek), mostradas com a sua fonte. Zero frete aéreo, por princípio.' },
  ],
  stepsLabel: 'Começar',
  stepsTitle: 'A sua primeira encomenda em 4 etapas',
  steps: [
    { title: 'Crie a sua conta gratuita', desc: 'Acesso imediato ao catálogo e às fichas completas de produtores.' },
    { title: 'Peça um orçamento — com amostra', desc: 'Quantidade, destino e a opção «amostra antes da primeira encomenda» num clique.' },
    { title: 'Encomende com conhecimento de causa', desc: 'Preços por volume à vista, documentos do lote listados de antemão, pagamento direto ao produtor.' },
    { title: 'Receba, controle, repita', desc: 'Controlo guiado em 4 pontos na entrega. Um problema? Processo de qualidade arbitrado pela nossa equipa.' },
  ],
  faqTitle: 'Perguntas de compradores profissionais',
  faq: [
    { q: 'Há subscrição ou comissão para o comprador?', a: 'Não. A conta, a consulta, os orçamentos e as encomendas são gratuitos para o comprador. A comissão de 5 % é suportada pelo produtor.' },
    { q: 'Que volumes posso encomendar?', a: 'Cada produtor mostra o seu MOQ e os seus escalões de preço. Da encomenda de 5 kg à palete — e além, com acompanhamento documental.' },
    { q: 'Quem é o importador se comprar fora da UE?', a: 'Nas compras diretas é o importador: a plataforma dá-lhe o roteiro aduaneiro por país de origem e os documentos do lote viajam com a encomenda.' },
    { q: 'Como funciona um litígio?', a: 'Abre o litígio sobre a encomenda; a nossa equipa instrui um processo rastreado e arbitra. As constatações ficam registadas de forma permanente.' },
    { q: 'Posso pagar por transferência normal?', a: 'Sim — é o circuito principal: transferência direta ao produtor contra fatura. O pagamento por cartão está disponível como opção.' },
  ],
  ctaTitle: 'O seu próximo fornecedor já está verificado',
  ctaText: 'Crie a sua conta em 2 minutos e peça hoje o seu primeiro orçamento com amostra.',
  ctaButton: 'Criar a minha conta de comprador',
};

const ar: ProfessionalsContent = {
  heroLabel: 'للمهنيين',
  heroTitle: 'اشترِ مباشرة من منتجين عضويين موثّقين',
  heroText: 'متاجر، مطاعم، محامص، تجار جملة: اشتروا القهوة والكاكاو والتوابل والزيوت والعسل مباشرة من التعاونيات — مع الأدلة ووثائق الاستيراد والتتبّع التي تتطلبها مهنتكم.',
  heroCta: 'إنشاء حساب مشترٍ',
  heroCta2: 'تصفح الكتالوج',
  painsLabel: 'مشاكلكم، إجاباتنا',
  painsTitle: 'شراء مباشر، بدون مخاطر الشراء المباشر',
  pains: [
    { emoji: '🕵️', pain: '«كيف أعرف أن هذا المورد موثوق؟»', answer: 'كل منتِج يُوثَّق قبل النشر: الهوية، السجل التجاري، الشهادات تُراقَب في السجلات الرسمية (إيكوسيرت، فلوسيرت، USDA…). تفاصيل الرقابات علنية على متجره.' },
    { emoji: '📄', pain: '«وثائق الاستيراد جحيم»', answer: 'تولّد المنصة القائمة الدقيقة للوثائق المطلوبة لكل دفعة حسب المنتج والمنشأ (COI بيو، صحة نباتية، تحاليل) — وتمنع الشحن حتى تُقدَّم.' },
    { emoji: '🧪', pain: '«وماذا لو لم تكن الجودة بالمستوى؟»', answer: 'عينة برقم الدفعة قبل الطلب الأول، تحاليل مخبرية على الدفعة، استلام مراقب في 4 نقاط — عدم المطابقة يفتح تلقائياً ملفاً يُحكَّم فيه.' },
    { emoji: '💸', pain: '«الوسطاء يأكلون الهامش»', answer: 'تدفع للمنتِج مباشرة، بالسعر الذي حدده. تتقاضى إيثي ماركت 5% من المنتِج، لا أكثر، وأموالك لا تمر عبرنا أبداً.' },
  ],
  proofLabel: 'ما يميّزنا',
  proofTitle: 'أدلة، لا وعود',
  proofs: [
    { emoji: '🛡️', title: 'منتِجون موثّقون من المصدر', desc: 'ستة معايير تُثبَت واحداً واحداً — أبداً على أساس PDF وحده. الأدلة (الطريقة، التاريخ، السجل المستشار) منشورة.' },
    { emoji: '🔍', title: 'تتبّع علني لكل دفعة', desc: 'كل شحنة تحمل رمز QR: المنشأ، الوثائق، التحاليل، الاستلام. اعرضه على عملائك.' },
    { emoji: '🇪🇺', title: 'امتثال أوروبي مدمج', desc: 'السلاسل الخاضعة لرقابة معزّزة مُشار إليها (لائحة 2019/1793)، مراقبة صحية RASFF يومية، متطلبات EUDR مدمجة.' },
    { emoji: '🌱', title: 'أثر مُقاس، لا مُختلَق', desc: 'بصمتا CO2 والماء محسوبتان بمراجع علمية (ADEME، Poore & Nemecek) وتُعرضان مع مصدرهما. صفر شحن جوي، مبدئياً.' },
  ],
  stepsLabel: 'البداية',
  stepsTitle: 'طلبك الأول في 4 خطوات',
  steps: [
    { title: 'أنشئ حسابك المجاني', desc: 'وصول فوري إلى الكتالوج وملفات المنتِجين الكاملة.' },
    { title: 'اطلب عرض سعر — مع عينة', desc: 'الكمية والوجهة وخيار «عينة قبل الطلب الأول» بنقرة واحدة.' },
    { title: 'اطلب عن دراية', desc: 'أسعار متدرجة معروضة، وثائق الدفعة مسرودة مسبقاً، دفع مباشر للمنتِج.' },
    { title: 'استلم، راقب، أعد الطلب', desc: 'فحص مُرشَد في 4 نقاط عند التسليم. مشكلة؟ ملف جودة يحكّم فيه فريقنا.' },
  ],
  faqTitle: 'أسئلة المشترين المهنيين',
  faq: [
    { q: 'هل هناك اشتراك أو رسوم على المشتري؟', a: 'لا. الحساب والاطلاع وعروض الأسعار والطلبات مجانية للمشتري. عمولة 5% يتحملها المنتِج.' },
    { q: 'ما الأحجام التي يمكنني طلبها؟', a: 'كل منتِج يعرض حده الأدنى للطلب وشرائح أسعاره. من طرد 5 كغ إلى المنصة النقالة — وأبعد، بمرافقة وثائقية.' },
    { q: 'من هو المستورد إذا اشتريت من خارج الاتحاد الأوروبي؟', a: 'في الشراء المباشر أنت المستورد: تمنحك المنصة خارطة الطريق الجمركية حسب بلد المنشأ وتسافر وثائق الدفعة مع الطلب.' },
    { q: 'كيف يجري النزاع؟', a: 'تفتح النزاع على الطلب؛ يفتح فريقنا ملفاً متتبَّعاً ويحكّم. المعاينات تُسجَّل بشكل دائم.' },
    { q: 'هل يمكنني الدفع بتحويل عادي؟', a: 'نعم — إنه المسار الرئيسي: تحويل مباشر للمنتِج مقابل الفاتورة. الدفع بالبطاقة متاح كخيار.' },
  ],
  ctaTitle: 'موردك القادم موثّق سلفاً',
  ctaText: 'أنشئ حسابك في دقيقتين واطلب اليوم أول عرض سعر مع عينة.',
  ctaButton: 'إنشاء حساب مشترٍ',
};

export const PROFESSIONALS_CONTENT: PerLocale<ProfessionalsContent> = { fr, en, es, pt, ar };
