/**
 * Contenus multilingues — page Comment ça marche (étapes + FAQ).
 * RÈGLE ÉDITORIALE (audit août 2026) : chaque affirmation correspond à
 * une capacité RÉELLE de la plateforme. Supprimés : escrow (nous
 * n'encaissons pas les paiements), étiquettes auto/enlèvement DHL-UPS,
 * IA de rédaction/photos, « 12 langues », paiement « sous 7 jours ».
 */
import type { PerLocale } from './types';

export type HowItWorksContent = {
  buyerSteps: { title: string; desc: string }[];
  producerSteps: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
};

const fr: HowItWorksContent = {
  buyerSteps: [
    { title: 'Inscription gratuite', desc: 'Créez votre compte acheteur en 2 minutes. Accès immédiat au catalogue complet.' },
    { title: 'Recherche avancée', desc: 'Filtrez par pays, certification, prix, volume. Comparez les produits et leur score responsable, preuves à l\'appui.' },
    { title: 'Contact direct producteur', desc: 'Discutez avec le producteur via notre messagerie. Demandez un devis, négociez prix, quantités, délais — et un échantillon avant la première commande.' },
    { title: 'Commande tracée', desc: 'Passez commande. Chaque lot part avec son dossier documentaire (bio, phytosanitaire, analyses selon la filière) et son QR de traçabilité publique.' },
    { title: 'Réception contrôlée', desc: 'À la livraison, un contrôle guidé en 4 points. Une non-conformité ouvre automatiquement un dossier qualité arbitré par notre équipe.' },
  ],
  producerSteps: [
    { title: 'Créer votre boutique', desc: 'Boutique en ligne professionnelle gratuite, traduite automatiquement en 5 langues.' },
    { title: 'Faire vérifier votre dossier', desc: 'Identité, entreprise, certifications contrôlées aux registres officiels. Les preuves sont publiées sur votre boutique : c\'est votre meilleur argument de vente.' },
    { title: 'Ajouter vos produits', desc: 'Photos et infos. Traduction automatique en 5 langues, empreinte carbone et eau calculées pour vous à partir de références scientifiques.' },
    { title: 'Recevoir des commandes', desc: 'Notifications en temps réel. Acceptez ou refusez selon votre capacité de production.' },
    { title: 'Expédier et être payé en direct', desc: 'La plateforme liste les documents exigés pour votre lot et votre destination. L\'acheteur vous paie directement : votre argent ne transite jamais par nous.' },
  ],
  faq: [
    { q: "Combien coûte l'utilisation d'EthiMarket ?", a: 'Inscription gratuite. Commission de 5% uniquement sur les ventes réalisées. Pas de frais cachés.' },
    { q: 'Comment sont vérifiées les certifications ?', a: 'Jamais sur la seule foi d\'un PDF : chaque certificat est contrôlé dans le registre public de l\'organisme émetteur (Ecocert, FLOCERT, USDA…). Le détail des contrôles est publié sur la boutique du producteur.' },
    { q: 'Comment les producteurs sont-ils payés ?', a: "Directement par l'acheteur, par virement ou carte selon la commande. EthiMarket n'encaisse aucun paiement : notre commission de 5% est facturée séparément." },
    { q: "Puis-je vendre à l'international ?", a: 'Oui ! EthiMarket connecte des producteurs de 4 continents à des acheteurs internationaux, avec feuille de route douanière par destination et check-list des documents d\'export.' },
    { q: 'Comment sont sélectionnés les producteurs ?', a: 'Protocole de vérification à preuves : identité, registre du commerce, certifications aux registres officiels, défi photo géolocalisé de l\'exploitation, appel vidéo. Rien n\'est validé sans preuve enregistrée.' },
    { q: 'Existe-t-il une commande minimum ?', a: 'Chaque producteur fixe son propre MOQ (Minimum Order Quantity), affiché clairement sur chaque produit.' },
    { q: 'Que se passe-t-il en cas de litige ?', a: "L'acheteur ouvre un litige sur sa commande ; notre équipe instruit un dossier qualité tracé et arbitre. Un incident confirmé dégrade publiquement le niveau de confiance du producteur — et un producteur honnête est protégé des réclamations abusives par les mêmes preuves." },
    { q: "Puis-je essayer avant d'acheter en gros ?", a: 'Oui : la demande de devis propose une case « échantillon avant première commande » — le producteur vous envoie un échantillon avec son numéro de lot.' },
    { q: 'Quelles langues sont supportées ?', a: "L'interface et les fiches produits sont disponibles en 5 langues : français, anglais, espagnol, portugais, arabe." },
    { q: 'Comment contacter le support ?', a: 'Par e-mail ou via la page Contact. Nous répondons sous 24 h ouvrées.' },
  ],
};

const en: HowItWorksContent = {
  buyerSteps: [
    { title: 'Free sign-up', desc: 'Create your buyer account in 2 minutes. Immediate access to the full catalogue.' },
    { title: 'Advanced search', desc: 'Filter by country, certification, price, volume. Compare products and their responsibility score, evidence included.' },
    { title: 'Direct producer contact', desc: 'Chat with the producer through our messaging. Request a quote, negotiate prices, quantities, lead times — and a sample before the first order.' },
    { title: 'Traced order', desc: 'Place your order. Every batch ships with its documentary file (organic, phytosanitary, analyses depending on the supply chain) and its public traceability QR.' },
    { title: 'Checked reception', desc: 'On delivery, a guided 4-point check. A non-conformity automatically opens a quality case arbitrated by our team.' },
  ],
  producerSteps: [
    { title: 'Create your shop', desc: 'Free professional online shop, automatically translated into 5 languages.' },
    { title: 'Get your file verified', desc: 'Identity, business, certifications checked at official registries. The evidence is published on your shop: it is your best sales argument.' },
    { title: 'Add your products', desc: 'Photos and info. Automatic translation into 5 languages, carbon and water footprints calculated for you from scientific references.' },
    { title: 'Receive orders', desc: 'Real-time notifications. Accept or decline based on your production capacity.' },
    { title: 'Ship and get paid directly', desc: 'The platform lists the documents required for your batch and destination. The buyer pays you directly: your money never passes through us.' },
  ],
  faq: [
    { q: 'How much does EthiMarket cost?', a: 'Free sign-up. 5% commission only on completed sales. No hidden fees.' },
    { q: 'How are certifications verified?', a: 'Never on the sole basis of a PDF: every certificate is checked in the public registry of the issuing body (Ecocert, FLOCERT, USDA…). The details of the checks are published on the producer\'s shop.' },
    { q: 'How do producers get paid?', a: 'Directly by the buyer, by bank transfer or card depending on the order. EthiMarket collects no payments: our 5% commission is invoiced separately.' },
    { q: 'Can I sell internationally?', a: 'Yes! EthiMarket connects producers from 4 continents with international buyers, with a customs roadmap per destination and an export documents checklist.' },
    { q: 'How are producers selected?', a: 'Evidence-based verification protocol: identity, business registry, certifications at official registries, geolocated photo challenge of the farm, video call. Nothing is validated without recorded evidence.' },
    { q: 'Is there a minimum order?', a: 'Each producer sets their own MOQ (Minimum Order Quantity), clearly displayed on every product.' },
    { q: 'What happens in case of a dispute?', a: 'The buyer opens a dispute on their order; our team builds a traced quality case and arbitrates. A confirmed incident publicly degrades the producer\'s trust level — and an honest producer is protected from abusive claims by the same evidence.' },
    { q: 'Can I try before buying in bulk?', a: 'Yes: the quote request offers a "sample before first order" option — the producer sends you a sample with its batch number.' },
    { q: 'Which languages are supported?', a: 'The interface and product pages are available in 5 languages: French, English, Spanish, Portuguese, Arabic.' },
    { q: 'How do I contact support?', a: 'By e-mail or through the Contact page. We reply within 24 business hours.' },
  ],
};

const es: HowItWorksContent = {
  buyerSteps: [
    { title: 'Inscripción gratuita', desc: 'Cree su cuenta de comprador en 2 minutos. Acceso inmediato al catálogo completo.' },
    { title: 'Búsqueda avanzada', desc: 'Filtre por país, certificación, precio, volumen. Compare los productos y su puntuación responsable, con pruebas.' },
    { title: 'Contacto directo con el productor', desc: 'Hable con el productor por nuestra mensajería. Pida un presupuesto, negocie precios, cantidades, plazos — y una muestra antes del primer pedido.' },
    { title: 'Pedido trazado', desc: 'Haga su pedido. Cada lote parte con su expediente documental (bio, fitosanitario, análisis según la cadena) y su QR de trazabilidad pública.' },
    { title: 'Recepción controlada', desc: 'A la entrega, un control guiado en 4 puntos. Una no conformidad abre automáticamente un expediente de calidad arbitrado por nuestro equipo.' },
  ],
  producerSteps: [
    { title: 'Crear su tienda', desc: 'Tienda en línea profesional gratuita, traducida automáticamente a 5 idiomas.' },
    { title: 'Verificar su expediente', desc: 'Identidad, empresa, certificaciones controladas en los registros oficiales. Las pruebas se publican en su tienda: es su mejor argumento de venta.' },
    { title: 'Añadir sus productos', desc: 'Fotos e información. Traducción automática a 5 idiomas, huellas de carbono y agua calculadas por usted a partir de referencias científicas.' },
    { title: 'Recibir pedidos', desc: 'Notificaciones en tiempo real. Acepte o rechace según su capacidad de producción.' },
    { title: 'Expedir y cobrar directamente', desc: 'La plataforma lista los documentos exigidos para su lote y su destino. El comprador le paga directamente: su dinero nunca pasa por nosotros.' },
  ],
  faq: [
    { q: '¿Cuánto cuesta usar EthiMarket?', a: 'Inscripción gratuita. Comisión del 5% solo sobre las ventas realizadas. Sin costes ocultos.' },
    { q: '¿Cómo se verifican las certificaciones?', a: 'Nunca sobre la sola fe de un PDF: cada certificado se controla en el registro público del organismo emisor (Ecocert, FLOCERT, USDA…). El detalle de los controles se publica en la tienda del productor.' },
    { q: '¿Cómo cobran los productores?', a: 'Directamente del comprador, por transferencia o tarjeta según el pedido. EthiMarket no cobra ningún pago: nuestra comisión del 5% se factura por separado.' },
    { q: '¿Puedo vender internacionalmente?', a: '¡Sí! EthiMarket conecta productores de 4 continentes con compradores internacionales, con hoja de ruta aduanera por destino y lista de documentos de exportación.' },
    { q: '¿Cómo se seleccionan los productores?', a: 'Protocolo de verificación con pruebas: identidad, registro mercantil, certificaciones en los registros oficiales, desafío foto geolocalizado de la explotación, videollamada. Nada se valida sin prueba registrada.' },
    { q: '¿Existe un pedido mínimo?', a: 'Cada productor fija su propio MOQ (cantidad mínima de pedido), mostrado claramente en cada producto.' },
    { q: '¿Qué pasa en caso de litigio?', a: 'El comprador abre un litigio sobre su pedido; nuestro equipo instruye un expediente de calidad trazado y arbitra. Un incidente confirmado degrada públicamente el nivel de confianza del productor — y un productor honesto queda protegido de reclamaciones abusivas por las mismas pruebas.' },
    { q: '¿Puedo probar antes de comprar al por mayor?', a: 'Sí: la solicitud de presupuesto ofrece una casilla « muestra antes del primer pedido » — el productor le envía una muestra con su número de lote.' },
    { q: '¿Qué idiomas están soportados?', a: 'La interfaz y las fichas de producto están disponibles en 5 idiomas: francés, inglés, español, portugués, árabe.' },
    { q: '¿Cómo contactar con el soporte?', a: 'Por correo electrónico o por la página Contacto. Respondemos en 24 h laborables.' },
  ],
};

const pt: HowItWorksContent = {
  buyerSteps: [
    { title: 'Inscrição gratuita', desc: 'Crie a sua conta de comprador em 2 minutos. Acesso imediato ao catálogo completo.' },
    { title: 'Pesquisa avançada', desc: 'Filtre por país, certificação, preço, volume. Compare os produtos e a sua pontuação responsável, com provas.' },
    { title: 'Contacto direto com o produtor', desc: 'Fale com o produtor pela nossa mensagería. Peça um orçamento, negocie preços, quantidades, prazos — e uma amostra antes da primeira encomenda.' },
    { title: 'Encomenda rastreada', desc: 'Faça a sua encomenda. Cada lote parte com o seu dossiê documental (bio, fitossanitário, análises conforme a cadeia) e o seu QR de rastreabilidade pública.' },
    { title: 'Receção controlada', desc: 'Na entrega, um controlo guiado em 4 pontos. Uma não conformidade abre automaticamente um processo de qualidade arbitrado pela nossa equipa.' },
  ],
  producerSteps: [
    { title: 'Criar a sua loja', desc: 'Loja online profissional gratuita, traduzida automaticamente em 5 línguas.' },
    { title: 'Verificar o seu dossiê', desc: 'Identidade, empresa, certificações controladas nos registos oficiais. As provas são publicadas na sua loja: é o seu melhor argumento de venda.' },
    { title: 'Adicionar os seus produtos', desc: 'Fotos e informações. Tradução automática em 5 línguas, pegadas de carbono e água calculadas por si a partir de referências científicas.' },
    { title: 'Receber encomendas', desc: 'Notificações em tempo real. Aceite ou recuse conforme a sua capacidade de produção.' },
    { title: 'Expedir e ser pago diretamente', desc: 'A plataforma lista os documentos exigidos para o seu lote e o seu destino. O comprador paga-lhe diretamente: o seu dinheiro nunca passa por nós.' },
  ],
  faq: [
    { q: 'Quanto custa usar a EthiMarket?', a: 'Inscrição gratuita. Comissão de 5% apenas sobre as vendas realizadas. Sem custos escondidos.' },
    { q: 'Como são verificadas as certificações?', a: 'Nunca com base apenas num PDF: cada certificado é controlado no registo público do organismo emissor (Ecocert, FLOCERT, USDA…). O detalhe dos controlos é publicado na loja do produtor.' },
    { q: 'Como são pagos os produtores?', a: 'Diretamente pelo comprador, por transferência ou cartão consoante a encomenda. A EthiMarket não cobra nenhum pagamento: a nossa comissão de 5% é faturada separadamente.' },
    { q: 'Posso vender internacionalmente?', a: 'Sim! A EthiMarket liga produtores de 4 continentes a compradores internacionais, com roteiro aduaneiro por destino e lista de documentos de exportação.' },
    { q: 'Como são selecionados os produtores?', a: 'Protocolo de verificação com provas: identidade, registo comercial, certificações nos registos oficiais, desafio foto geolocalizado da exploração, videochamada. Nada é validado sem prova registada.' },
    { q: 'Existe uma encomenda mínima?', a: 'Cada produtor fixa o seu próprio MOQ (quantidade mínima de encomenda), mostrado claramente em cada produto.' },
    { q: 'O que acontece em caso de litígio?', a: 'O comprador abre um litígio sobre a sua encomenda; a nossa equipa instrui um processo de qualidade rastreado e arbitra. Um incidente confirmado degrada publicamente o nível de confiança do produtor — e um produtor honesto fica protegido de reclamações abusivas pelas mesmas provas.' },
    { q: 'Posso experimentar antes de comprar por grosso?', a: 'Sim: o pedido de orçamento oferece uma opção « amostra antes da primeira encomenda » — o produtor envia-lhe uma amostra com o seu número de lote.' },
    { q: 'Que línguas são suportadas?', a: 'A interface e as fichas de produto estão disponíveis em 5 línguas: francês, inglês, espanhol, português, árabe.' },
    { q: 'Como contactar o suporte?', a: 'Por e-mail ou pela página Contacto. Respondemos em 24 h úteis.' },
  ],
};

const ar: HowItWorksContent = {
  buyerSteps: [
    { title: 'تسجيل مجاني', desc: 'أنشئ حساب المشتري في دقيقتين. وصول فوري إلى الكتالوج الكامل.' },
    { title: 'بحث متقدم', desc: 'رشّح حسب البلد والشهادة والسعر والحجم. قارن المنتجات ودرجتها المسؤولة، بالأدلة.' },
    { title: 'اتصال مباشر بالمنتِج', desc: 'تحدث مع المنتِج عبر مراسلتنا. اطلب عرض سعر، فاوض على الأسعار والكميات والآجال — وعينة قبل الطلب الأول.' },
    { title: 'طلب متتبَّع', desc: 'قدّم طلبك. كل دفعة تغادر بملفها الوثائقي (بيو، صحة نباتية، تحاليل حسب السلسلة) ورمز QR للتتبّع العلني.' },
    { title: 'استلام مراقب', desc: 'عند التسليم، فحص مُرشَد في 4 نقاط. عدم المطابقة يفتح تلقائياً ملف جودة يحكّم فيه فريقنا.' },
  ],
  producerSteps: [
    { title: 'أنشئ متجرك', desc: 'متجر إلكتروني احترافي مجاني، مترجم تلقائياً إلى 5 لغات.' },
    { title: 'وثّق ملفك', desc: 'الهوية والشركة والشهادات تُراقب في السجلات الرسمية. تُنشر الأدلة على متجرك: إنها أفضل حجة بيع لديك.' },
    { title: 'أضف منتجاتك', desc: 'صور ومعلومات. ترجمة تلقائية إلى 5 لغات، بصمتا الكربون والماء محسوبتان لك من مراجع علمية.' },
    { title: 'استقبل الطلبات', desc: 'إشعارات فورية. اقبل أو ارفض حسب طاقتك الإنتاجية.' },
    { title: 'اشحن واقبض مباشرة', desc: 'المنصة تسرد الوثائق المطلوبة لدفعتك ووجهتك. المشتري يدفع لك مباشرة: أموالك لا تمر عبرنا أبداً.' },
  ],
  faq: [
    { q: 'كم تكلف إيثي ماركت؟', a: 'التسجيل مجاني. عمولة 5% فقط على المبيعات المنجزة. لا رسوم خفية.' },
    { q: 'كيف تُوثَّق الشهادات؟', a: 'أبداً على أساس PDF وحده: كل شهادة تُراقب في السجل العلني للهيئة المُصدرة (إيكوسيرت، فلوسيرت، USDA…). تفاصيل الرقابات تُنشر على متجر المنتِج.' },
    { q: 'كيف يُدفع للمنتِجين؟', a: 'مباشرة من المشتري، بتحويل أو بطاقة حسب الطلب. إيثي ماركت لا تقبض أي مدفوعات: عمولتنا 5% تُفوتر على حدة.' },
    { q: 'هل يمكنني البيع دولياً؟', a: 'نعم! تربط إيثي ماركت منتِجين من 4 قارات بمشترين دوليين، مع خارطة طريق جمركية لكل وجهة وقائمة وثائق التصدير.' },
    { q: 'كيف يُختار المنتِجون؟', a: 'بروتوكول تحقق بالأدلة: الهوية، السجل التجاري، الشهادات في السجلات الرسمية، تحدي صورة جغرافي للمزرعة، مكالمة فيديو. لا شيء يُعتمد دون دليل مسجَّل.' },
    { q: 'هل يوجد حد أدنى للطلب؟', a: 'كل منتِج يحدد حده الأدنى للطلب (MOQ)، معروضاً بوضوح على كل منتج.' },
    { q: 'ماذا يحدث في حالة نزاع؟', a: 'يفتح المشتري نزاعاً على طلبه؛ يفتح فريقنا ملف جودة متتبَّعاً ويحكّم. الحادث المؤكد يخفّض علنياً مستوى ثقة المنتِج — والمنتِج الصادق محمي من المطالبات التعسفية بنفس الأدلة.' },
    { q: 'هل يمكنني التجربة قبل الشراء بالجملة؟', a: 'نعم: طلب عرض السعر يقدم خيار « عينة قبل الطلب الأول » — يرسل لك المنتِج عينة برقم دفعتها.' },
    { q: 'ما اللغات المدعومة؟', a: 'الواجهة وبطاقات المنتجات متاحة بـ5 لغات: الفرنسية والإنجليزية والإسبانية والبرتغالية والعربية.' },
    { q: 'كيف أتواصل مع الدعم؟', a: 'بالبريد الإلكتروني أو عبر صفحة الاتصال. نرد خلال 24 ساعة عمل.' },
  ],
};

export const HOW_IT_WORKS_CONTENT: PerLocale<HowItWorksContent> = { fr, en, es, pt, ar };
