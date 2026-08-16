/** Contenus multilingues — page Comment ça marche (étapes + FAQ). */
import type { PerLocale } from './types';

export type HowItWorksContent = {
  buyerSteps: { title: string; desc: string }[];
  producerSteps: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
};

const fr: HowItWorksContent = {
  buyerSteps: [
    { title: 'Inscription gratuite', desc: 'Créez votre compte acheteur en 2 minutes. Accès immédiat au catalogue complet.' },
    { title: 'Recherche avancée', desc: 'Filtrez par pays, certification, prix, volume. Notre IA vous recommande les meilleurs fournisseurs.' },
    { title: 'Contact direct producteur', desc: 'Discutez avec le producteur via notre messagerie sécurisée. Négociez prix, quantités, délais.' },
    { title: 'Commande sécurisée', desc: "Passez commande. Paiement protégé par escrow (argent bloqué jusqu'à réception)." },
    { title: 'Livraison et suivi', desc: 'Suivi en temps réel via nos partenaires logistiques (DHL, UPS, Maersk).' },
  ],
  producerSteps: [
    { title: 'Créer votre boutique', desc: 'Boutique en ligne professionnelle gratuite. Notre IA vous aide à rédiger votre présentation.' },
    { title: 'Ajouter vos produits', desc: "Uploadez photos et infos. L'IA génère automatiquement des descriptions optimisées et traduit en 12 langues." },
    { title: 'Recevoir des commandes', desc: 'Notifications en temps réel. Acceptez ou refusez selon votre capacité de production.' },
    { title: 'Expédier vos produits', desc: 'Génération automatique des étiquettes. Nos transporteurs partenaires viennent chercher vos colis chez vous.' },
    { title: 'Recevoir vos paiements', desc: 'Argent versé sous 7 jours après livraison confirmée. Virement direct sur votre compte bancaire.' },
  ],
  faq: [
    { q: "Combien coûte l'utilisation d'EthiMarket ?", a: 'Inscription gratuite. Commission de 5% uniquement sur les ventes réalisées. Pas de frais cachés.' },
    { q: 'Comment sont vérifiées les certifications ?', a: 'Chaque certificat est contrôlé physiquement par notre équipe et validé par les organismes certificateurs (Ecocert, Fairtrade, Rainforest Alliance).' },
    { q: 'Quels sont les délais de paiement ?', a: "Les producteurs reçoivent leur paiement 7 jours après confirmation de livraison par l'acheteur." },
    { q: "Puis-je vendre à l'international ?", a: 'Oui ! EthiMarket connecte des producteurs de 4 continents à des acheteurs internationaux, avec accompagnement logistique et douanier.' },
    { q: 'Comment sont sélectionnés les producteurs ?', a: 'Audit physique de la ferme, vérification des certifications, test de la qualité des produits.' },
    { q: 'Existe-t-il une commande minimum ?', a: 'Chaque producteur fixe son propre MOQ (Minimum Order Quantity), affiché clairement sur chaque produit.' },
    { q: "Comment fonctionne l'escrow ?", a: "L'argent de l'acheteur est bloqué chez notre partenaire Stripe jusqu'à confirmation de la livraison, protégeant les deux parties." },
    { q: "Puis-je essayer avant d'acheter en gros ?", a: 'Oui, la plupart des producteurs proposent des échantillons payants pour tester la qualité.' },
    { q: 'Quelles langues sont supportées ?', a: "L'interface est disponible en 5 langues (français, anglais, espagnol, portugais, arabe) et la messagerie traduit automatiquement." },
    { q: 'Comment contacter le support ?', a: 'Chat en direct, email (support@ethimarket.com) ou téléphone (+33 1 23 45 67 89), 7j/7.' },
  ],
};

const en: HowItWorksContent = {
  buyerSteps: [
    { title: 'Free registration', desc: 'Create your buyer account in 2 minutes. Immediate access to the full catalog.' },
    { title: 'Advanced search', desc: 'Filter by country, certification, price, volume. Our AI recommends the best suppliers.' },
    { title: 'Direct producer contact', desc: 'Chat with the producer through our secure messaging. Negotiate prices, quantities, lead times.' },
    { title: 'Secure order', desc: 'Place your order. Payment protected by escrow (money held until reception).' },
    { title: 'Delivery and tracking', desc: 'Real-time tracking through our logistics partners (DHL, UPS, Maersk).' },
  ],
  producerSteps: [
    { title: 'Create your shop', desc: 'Free professional online shop. Our AI helps you write your presentation.' },
    { title: 'Add your products', desc: 'Upload photos and info. AI automatically generates optimized descriptions and translates into 12 languages.' },
    { title: 'Receive orders', desc: 'Real-time notifications. Accept or decline based on your production capacity.' },
    { title: 'Ship your products', desc: 'Automatic label generation. Our partner carriers pick up your parcels at your place.' },
    { title: 'Get paid', desc: 'Money paid within 7 days after confirmed delivery. Direct transfer to your bank account.' },
  ],
  faq: [
    { q: 'How much does EthiMarket cost?', a: 'Free registration. 5% commission only on completed sales. No hidden fees.' },
    { q: 'How are certifications verified?', a: 'Each certificate is physically checked by our team and validated by the certification bodies (Ecocert, Fairtrade, Rainforest Alliance).' },
    { q: 'What are the payment terms?', a: 'Producers receive their payment 7 days after delivery confirmation by the buyer.' },
    { q: 'Can I sell internationally?', a: 'Yes! EthiMarket connects producers from 4 continents with international buyers, with logistics and customs support.' },
    { q: 'How are producers selected?', a: 'Physical farm audit, certification verification, product quality testing.' },
    { q: 'Is there a minimum order?', a: 'Each producer sets their own MOQ (Minimum Order Quantity), clearly displayed on each product.' },
    { q: 'How does escrow work?', a: "The buyer's money is held by our partner Stripe until delivery confirmation, protecting both parties." },
    { q: 'Can I try before buying in bulk?', a: 'Yes, most producers offer paid samples to test quality.' },
    { q: 'Which languages are supported?', a: 'The interface is available in 5 languages (French, English, Spanish, Portuguese, Arabic) and messaging translates automatically.' },
    { q: 'How do I contact support?', a: 'Live chat, email (support@ethimarket.com) or phone (+33 1 23 45 67 89), 7 days a week.' },
  ],
};

const es: HowItWorksContent = {
  buyerSteps: [
    { title: 'Inscripción gratuita', desc: 'Cree su cuenta de comprador en 2 minutos. Acceso inmediato al catálogo completo.' },
    { title: 'Búsqueda avanzada', desc: 'Filtre por país, certificación, precio, volumen. Nuestra IA le recomienda los mejores proveedores.' },
    { title: 'Contacto directo con el productor', desc: 'Converse con el productor a través de nuestra mensajería segura. Negocie precios, cantidades, plazos.' },
    { title: 'Pedido seguro', desc: 'Realice su pedido. Pago protegido por escrow (dinero retenido hasta la recepción).' },
    { title: 'Entrega y seguimiento', desc: 'Seguimiento en tiempo real a través de nuestros socios logísticos (DHL, UPS, Maersk).' },
  ],
  producerSteps: [
    { title: 'Crear su tienda', desc: 'Tienda en línea profesional gratuita. Nuestra IA le ayuda a redactar su presentación.' },
    { title: 'Añadir sus productos', desc: 'Suba fotos e información. La IA genera automáticamente descripciones optimizadas y traduce a 12 idiomas.' },
    { title: 'Recibir pedidos', desc: 'Notificaciones en tiempo real. Acepte o rechace según su capacidad de producción.' },
    { title: 'Enviar sus productos', desc: 'Generación automática de etiquetas. Nuestros transportistas socios recogen sus paquetes en su casa.' },
    { title: 'Recibir sus pagos', desc: 'Dinero abonado en 7 días tras la entrega confirmada. Transferencia directa a su cuenta bancaria.' },
  ],
  faq: [
    { q: '¿Cuánto cuesta usar EthiMarket?', a: 'Inscripción gratuita. Comisión del 5% solo sobre las ventas realizadas. Sin costos ocultos.' },
    { q: '¿Cómo se verifican las certificaciones?', a: 'Cada certificado es controlado físicamente por nuestro equipo y validado por los organismos certificadores (Ecocert, Fairtrade, Rainforest Alliance).' },
    { q: '¿Cuáles son los plazos de pago?', a: 'Los productores reciben su pago 7 días después de la confirmación de entrega por el comprador.' },
    { q: '¿Puedo vender internacionalmente?', a: '¡Sí! EthiMarket conecta productores de 4 continentes con compradores internacionales, con acompañamiento logístico y aduanero.' },
    { q: '¿Cómo se seleccionan los productores?', a: 'Auditoría física de la granja, verificación de las certificaciones, prueba de la calidad de los productos.' },
    { q: '¿Existe un pedido mínimo?', a: 'Cada productor fija su propio MOQ (cantidad mínima de pedido), mostrado claramente en cada producto.' },
    { q: '¿Cómo funciona el escrow?', a: 'El dinero del comprador queda retenido con nuestro socio Stripe hasta la confirmación de la entrega, protegiendo a ambas partes.' },
    { q: '¿Puedo probar antes de comprar al por mayor?', a: 'Sí, la mayoría de los productores ofrecen muestras pagadas para probar la calidad.' },
    { q: '¿Qué idiomas son compatibles?', a: 'La interfaz está disponible en 5 idiomas (francés, inglés, español, portugués, árabe) y la mensajería traduce automáticamente.' },
    { q: '¿Cómo contactar al soporte?', a: 'Chat en vivo, correo (support@ethimarket.com) o teléfono (+33 1 23 45 67 89), 7 días a la semana.' },
  ],
};

const pt: HowItWorksContent = {
  buyerSteps: [
    { title: 'Inscrição gratuita', desc: 'Crie sua conta de comprador em 2 minutos. Acesso imediato ao catálogo completo.' },
    { title: 'Pesquisa avançada', desc: 'Filtre por país, certificação, preço, volume. Nossa IA recomenda os melhores fornecedores.' },
    { title: 'Contato direto com o produtor', desc: 'Converse com o produtor pela nossa mensageria segura. Negocie preços, quantidades, prazos.' },
    { title: 'Pedido seguro', desc: 'Faça seu pedido. Pagamento protegido por escrow (dinheiro retido até o recebimento).' },
    { title: 'Entrega e rastreamento', desc: 'Rastreamento em tempo real através de nossos parceiros logísticos (DHL, UPS, Maersk).' },
  ],
  producerSteps: [
    { title: 'Criar sua loja', desc: 'Loja online profissional gratuita. Nossa IA ajuda você a redigir sua apresentação.' },
    { title: 'Adicionar seus produtos', desc: 'Envie fotos e informações. A IA gera automaticamente descrições otimizadas e traduz para 12 idiomas.' },
    { title: 'Receber pedidos', desc: 'Notificações em tempo real. Aceite ou recuse conforme sua capacidade de produção.' },
    { title: 'Enviar seus produtos', desc: 'Geração automática de etiquetas. Nossas transportadoras parceiras coletam seus pacotes na sua casa.' },
    { title: 'Receber seus pagamentos', desc: 'Dinheiro pago em 7 dias após entrega confirmada. Transferência direta para sua conta bancária.' },
  ],
  faq: [
    { q: 'Quanto custa usar a EthiMarket?', a: 'Inscrição gratuita. Comissão de 5% apenas sobre as vendas realizadas. Sem taxas ocultas.' },
    { q: 'Como as certificações são verificadas?', a: 'Cada certificado é controlado fisicamente pela nossa equipe e validado pelos organismos certificadores (Ecocert, Fairtrade, Rainforest Alliance).' },
    { q: 'Quais são os prazos de pagamento?', a: 'Os produtores recebem seu pagamento 7 dias após a confirmação de entrega pelo comprador.' },
    { q: 'Posso vender internacionalmente?', a: 'Sim! A EthiMarket conecta produtores de 4 continentes a compradores internacionais, com acompanhamento logístico e aduaneiro.' },
    { q: 'Como os produtores são selecionados?', a: 'Auditoria física da fazenda, verificação das certificações, teste da qualidade dos produtos.' },
    { q: 'Existe um pedido mínimo?', a: 'Cada produtor define seu próprio MOQ (quantidade mínima de pedido), exibido claramente em cada produto.' },
    { q: 'Como funciona o escrow?', a: 'O dinheiro do comprador fica retido com nosso parceiro Stripe até a confirmação da entrega, protegendo ambas as partes.' },
    { q: 'Posso experimentar antes de comprar no atacado?', a: 'Sim, a maioria dos produtores oferece amostras pagas para testar a qualidade.' },
    { q: 'Quais idiomas são suportados?', a: 'A interface está disponível em 5 idiomas (francês, inglês, espanhol, português, árabe) e a mensageria traduz automaticamente.' },
    { q: 'Como contatar o suporte?', a: 'Chat ao vivo, e-mail (support@ethimarket.com) ou telefone (+33 1 23 45 67 89), 7 dias por semana.' },
  ],
};

const ar: HowItWorksContent = {
  buyerSteps: [
    { title: 'تسجيل مجاني', desc: 'أنشئ حساب المشتري في دقيقتين. وصول فوري إلى الكتالوج الكامل.' },
    { title: 'بحث متقدم', desc: 'صفِّ حسب البلد، الشهادة، السعر، الحجم. ذكاؤنا الاصطناعي يوصيك بأفضل الموردين.' },
    { title: 'اتصال مباشر بالمنتج', desc: 'تحدث مع المنتج عبر مراسلتنا الآمنة. تفاوض على الأسعار والكميات والآجال.' },
    { title: 'طلب آمن', desc: 'قدّم طلبك. الدفع محمي بالضمان (المال محجوز حتى الاستلام).' },
    { title: 'التسليم والتتبع', desc: 'تتبع فوري عبر شركائنا اللوجستيين (DHL، UPS، Maersk).' },
  ],
  producerSteps: [
    { title: 'أنشئ متجرك', desc: 'متجر إلكتروني احترافي مجاني. ذكاؤنا الاصطناعي يساعدك في كتابة عرضك.' },
    { title: 'أضف منتجاتك', desc: 'ارفع الصور والمعلومات. الذكاء الاصطناعي ينشئ أوصافاً محسّنة ويترجم إلى 12 لغة تلقائياً.' },
    { title: 'استقبل الطلبات', desc: 'إشعارات فورية. اقبل أو ارفض حسب قدرتك الإنتاجية.' },
    { title: 'اشحن منتجاتك', desc: 'إنشاء تلقائي للملصقات. ناقلونا الشركاء يأتون لاستلام طرودك من عندك.' },
    { title: 'استلم مدفوعاتك', desc: 'المال يُدفع خلال 7 أيام بعد تأكيد التسليم. تحويل مباشر إلى حسابك البنكي.' },
  ],
  faq: [
    { q: 'كم تكلف EthiMarket؟', a: 'التسجيل مجاني. عمولة 5% على المبيعات المنجزة فقط. لا رسوم خفية.' },
    { q: 'كيف يتم التحقق من الشهادات؟', a: 'كل شهادة تُراجع فعلياً من فريقنا وتُصادق عليها هيئات التصديق (Ecocert، Fairtrade، Rainforest Alliance).' },
    { q: 'ما هي آجال الدفع؟', a: 'يستلم المنتجون مدفوعاتهم بعد 7 أيام من تأكيد التسليم من المشتري.' },
    { q: 'هل يمكنني البيع دولياً؟', a: 'نعم! تربط EthiMarket منتجين من 4 قارات بمشترين دوليين، مع مرافقة لوجستية وجمركية.' },
    { q: 'كيف يتم اختيار المنتجين؟', a: 'تدقيق ميداني للمزرعة، التحقق من الشهادات، اختبار جودة المنتجات.' },
    { q: 'هل يوجد حد أدنى للطلب؟', a: 'كل منتج يحدد الحد الأدنى للطلب الخاص به (MOQ)، معروضاً بوضوح على كل منتج.' },
    { q: 'كيف يعمل الضمان (Escrow)؟', a: 'مال المشتري محجوز لدى شريكنا Stripe حتى تأكيد التسليم، مما يحمي الطرفين.' },
    { q: 'هل يمكنني التجربة قبل الشراء بالجملة؟', a: 'نعم، يقدم معظم المنتجين عينات مدفوعة لاختبار الجودة.' },
    { q: 'ما هي اللغات المدعومة؟', a: 'الواجهة متاحة بخمس لغات (الفرنسية، الإنجليزية، الإسبانية، البرتغالية، العربية) والمراسلة تترجم تلقائياً.' },
    { q: 'كيف أتصل بالدعم؟', a: 'دردشة مباشرة، بريد إلكتروني (support@ethimarket.com) أو هاتف (+33 1 23 45 67 89)، 7 أيام في الأسبوع.' },
  ],
};

export const HOW_IT_WORKS_CONTENT: PerLocale<HowItWorksContent> = { fr, en, es, pt, ar };
