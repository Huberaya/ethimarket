/** Contenus multilingues — page Devenir Vendeur. */
import type { PerLocale } from './types';

export type VendorContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  stats: { emoji: string; value: string; label: string }[];
  benefitsLabel: string;
  benefitsTitle: string;
  benefits: { emoji: string; title: string; desc: string }[];
  stepsLabel: string;
  stepsTitle: string;
  steps: { title: string; desc: string }[];
  pricingTitle: string;
  pricingPoints: string[];
  pricingExampleLabel: string;
  pricingExample: string;
  pricingExampleNote: string;
  testimonialsLabel: string;
  testimonialsTitle: string;
  testimonials: { name: string; role: string; text: string; initials: string; color: string }[];
  faqLabel: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
};

const fr: VendorContent = {
  heroTitle: 'Vendez vos produits bio dans le monde entier',
  heroSubtitle: 'Rejoignez les coopératives pionnières qui vendent en direct, sans intermédiaire',
  heroCta: 'Créer ma boutique gratuitement',
  stats: [
    { emoji: '💰', value: '+40%', label: 'de marges en moyenne' },
    { emoji: '🌍', value: '45', label: "pays d'acheteurs" },
    { emoji: '📈', value: '8 250€', label: 'CA mensuel moyen' },
    { emoji: '⭐', value: '4.9/5', label: 'satisfaction producteurs' },
  ],
  benefitsLabel: 'Avantages',
  benefitsTitle: 'Pourquoi rejoindre EthiMarket ?',
  benefits: [
    { emoji: '💰', title: 'Marges décuplées', desc: 'Vendez directement, sans les 3-5 intermédiaires habituels. Gardez la valeur de votre travail.' },
    { emoji: '🌍', title: 'Marchés internationaux', desc: 'Accédez à des acheteurs professionnels internationaux. Notre équipe vous accompagne sur la logistique et les douanes.' },
    { emoji: '🤖', title: 'Outils IA gratuits', desc: "L'IA rédige vos descriptions, améliore vos photos, traduit en 12 langues automatiquement." },
    { emoji: '📸', title: 'Photos professionnelles', desc: 'Améliorez vos photos avec notre outil IA gratuit. Fond neutre, lumière parfaite en 1 clic.' },
    { emoji: '📊', title: 'Statistiques détaillées', desc: 'Suivez vos ventes, vos vues, votre trafic. Optimisez votre boutique avec les données.' },
    { emoji: '💳', title: 'Paiements sécurisés', desc: 'Escrow sur toutes les transactions. Argent versé sous 7 jours après livraison confirmée.' },
  ],
  stepsLabel: 'Démarrage',
  stepsTitle: 'Comment ça marche',
  steps: [
    { title: 'Créer votre boutique', desc: '2 minutes, gratuit' },
    { title: 'Ajouter vos produits', desc: "Avec l'IA" },
    { title: 'Recevoir des commandes', desc: 'Notifications temps réel' },
    { title: 'Expédier facilement', desc: 'Étiquettes auto' },
    { title: 'Recevoir vos paiements', desc: 'Sous 7 jours' },
  ],
  pricingTitle: 'Une tarification simple et juste',
  pricingPoints: [
    'Inscription : 100% gratuite',
    'Création boutique : gratuite',
    'Ajout de produits : illimité',
    'Commission : 5% uniquement sur les ventes',
    'Pas de frais cachés',
    "Pas d'engagement",
  ],
  pricingExampleLabel: 'Exemple concret :',
  pricingExample: 'Vous vendez 1 000€ → Vous recevez 950€',
  pricingExampleNote: 'Nous prélevons 50€ (5%) pour maintenir la plateforme',
  testimonialsLabel: 'Témoignages',
  testimonialsTitle: 'Ils ont transformé leur commerce',
  testimonials: [
    { name: 'Fatima Benali', role: 'Coopérative Argan Atlas', text: 'En 6 mois sur EthiMarket, mes ventes ont triplé. Je peux enfin payer mes 80 employées un salaire décent.', initials: 'FB', color: '#22c55e' },
    { name: 'Karim Hosseini', role: 'Saffron Fields Iran', text: 'Fini les intermédiaires qui prenaient 60% de ma marge. Je vends directement à des chefs étoilés en France.', initials: 'KH', color: '#f59e0b' },
    { name: 'Ana Rodriguez', role: 'Café Colombia Coop', text: "L'outil IA est incroyable. Il a traduit mes 25 produits en anglais, espagnol, allemand en 5 minutes.", initials: 'AR', color: '#3b82f6' },
  ],
  faqLabel: 'FAQ',
  faqTitle: 'Questions fréquentes vendeurs',
  faq: [
    { q: 'Combien de temps pour créer ma boutique ?', a: 'Moins de 2 minutes. Notre IA vous aide à rédiger votre présentation et génère votre boutique automatiquement.' },
    { q: 'Quand vais-je recevoir mon premier paiement ?', a: "Sous 7 jours après confirmation de livraison par l'acheteur. Le virement est direct sur votre compte bancaire." },
    { q: 'Comment envoyer mes produits ?', a: "Génération automatique des étiquettes d'expédition. Nos transporteurs partenaires (DHL, UPS) viennent chercher vos colis." },
    { q: 'Que faire en cas de litige ?', a: 'Contactez le support. EthiMarket retient les fonds en escrow et arbitre le litige dans les 14 jours.' },
    { q: 'Puis-je fixer mes propres prix ?', a: 'Oui, vous êtes libre de fixer vos prix et votre MOQ (commande minimum) pour chaque produit.' },
  ],
  ctaTitle: 'Prêt à révolutionner votre commerce ?',
  ctaSubtitle: 'Créez votre boutique en 2 minutes, gratuitement',
  ctaButton: 'Créer ma boutique maintenant',
};

const en: VendorContent = {
  heroTitle: 'Sell your organic products worldwide',
  heroSubtitle: 'Join the pioneering cooperatives selling directly, with no middlemen',
  heroCta: 'Create my shop for free',
  stats: [
    { emoji: '💰', value: '+40%', label: 'margins on average' },
    { emoji: '🌍', value: '45', label: 'buyer countries' },
    { emoji: '📈', value: '€8,250', label: 'average monthly revenue' },
    { emoji: '⭐', value: '4.9/5', label: 'producer satisfaction' },
  ],
  benefitsLabel: 'Benefits',
  benefitsTitle: 'Why join EthiMarket?',
  benefits: [
    { emoji: '💰', title: 'Multiplied margins', desc: 'Sell directly, without the usual 3-5 middlemen. Keep the value of your work.' },
    { emoji: '🌍', title: 'International markets', desc: 'Reach international professional buyers. Our team supports you with logistics and customs.' },
    { emoji: '🤖', title: 'Free AI tools', desc: 'AI writes your descriptions, enhances your photos, translates into 12 languages automatically.' },
    { emoji: '📸', title: 'Professional photos', desc: 'Enhance your photos with our free AI tool. Neutral background, perfect lighting in 1 click.' },
    { emoji: '📊', title: 'Detailed statistics', desc: 'Track your sales, views and traffic. Optimize your shop with data.' },
    { emoji: '💳', title: 'Secure payments', desc: 'Escrow on all transactions. Money paid within 7 days after confirmed delivery.' },
  ],
  stepsLabel: 'Getting started',
  stepsTitle: 'How it works',
  steps: [
    { title: 'Create your shop', desc: '2 minutes, free' },
    { title: 'Add your products', desc: 'With AI' },
    { title: 'Receive orders', desc: 'Real-time notifications' },
    { title: 'Ship easily', desc: 'Auto labels' },
    { title: 'Get paid', desc: 'Within 7 days' },
  ],
  pricingTitle: 'Simple and fair pricing',
  pricingPoints: [
    'Registration: 100% free',
    'Shop creation: free',
    'Product listings: unlimited',
    'Commission: 5% only on sales',
    'No hidden fees',
    'No commitment',
  ],
  pricingExampleLabel: 'Concrete example:',
  pricingExample: 'You sell €1,000 → You receive €950',
  pricingExampleNote: 'We take €50 (5%) to maintain the platform',
  testimonialsLabel: 'Testimonials',
  testimonialsTitle: 'They transformed their trade',
  testimonials: [
    { name: 'Fatima Benali', role: 'Argan Atlas Cooperative', text: 'In 6 months on EthiMarket, my sales tripled. I can finally pay my 80 employees a decent wage.', initials: 'FB', color: '#22c55e' },
    { name: 'Karim Hosseini', role: 'Saffron Fields Iran', text: 'No more middlemen taking 60% of my margin. I sell directly to Michelin-starred chefs in France.', initials: 'KH', color: '#f59e0b' },
    { name: 'Ana Rodriguez', role: 'Café Colombia Coop', text: 'The AI tool is incredible. It translated my 25 products into English, Spanish and German in 5 minutes.', initials: 'AR', color: '#3b82f6' },
  ],
  faqLabel: 'FAQ',
  faqTitle: 'Frequent seller questions',
  faq: [
    { q: 'How long to create my shop?', a: 'Less than 2 minutes. Our AI helps you write your presentation and generates your shop automatically.' },
    { q: 'When will I receive my first payment?', a: 'Within 7 days after delivery confirmation by the buyer. The transfer goes directly to your bank account.' },
    { q: 'How do I ship my products?', a: 'Automatic generation of shipping labels. Our partner carriers (DHL, UPS) pick up your parcels.' },
    { q: 'What if there is a dispute?', a: 'Contact support. EthiMarket holds the funds in escrow and arbitrates the dispute within 14 days.' },
    { q: 'Can I set my own prices?', a: 'Yes, you are free to set your prices and your MOQ (minimum order quantity) for each product.' },
  ],
  ctaTitle: 'Ready to revolutionize your trade?',
  ctaSubtitle: 'Create your shop in 2 minutes, for free',
  ctaButton: 'Create my shop now',
};

const es: VendorContent = {
  heroTitle: 'Venda sus productos orgánicos en todo el mundo',
  heroSubtitle: 'Únase a las cooperativas pioneras que venden en directo, sin intermediarios',
  heroCta: 'Crear mi tienda gratis',
  stats: [
    { emoji: '💰', value: '+40%', label: 'de márgenes en promedio' },
    { emoji: '🌍', value: '45', label: 'países de compradores' },
    { emoji: '📈', value: '8 250€', label: 'facturación mensual media' },
    { emoji: '⭐', value: '4.9/5', label: 'satisfacción de productores' },
  ],
  benefitsLabel: 'Ventajas',
  benefitsTitle: '¿Por qué unirse a EthiMarket?',
  benefits: [
    { emoji: '💰', title: 'Márgenes multiplicados', desc: 'Venda directamente, sin los 3-5 intermediarios habituales. Conserve el valor de su trabajo.' },
    { emoji: '🌍', title: 'Mercados internacionales', desc: 'Acceda a compradores profesionales internacionales. Nuestro equipo le acompaña en logística y aduanas.' },
    { emoji: '🤖', title: 'Herramientas de IA gratuitas', desc: 'La IA redacta sus descripciones, mejora sus fotos, traduce a 12 idiomas automáticamente.' },
    { emoji: '📸', title: 'Fotos profesionales', desc: 'Mejore sus fotos con nuestra herramienta de IA gratuita. Fondo neutro, luz perfecta en 1 clic.' },
    { emoji: '📊', title: 'Estadísticas detalladas', desc: 'Siga sus ventas, vistas y tráfico. Optimice su tienda con los datos.' },
    { emoji: '💳', title: 'Pagos seguros', desc: 'Escrow en todas las transacciones. Dinero abonado en 7 días tras la entrega confirmada.' },
  ],
  stepsLabel: 'Inicio',
  stepsTitle: 'Cómo funciona',
  steps: [
    { title: 'Crear su tienda', desc: '2 minutos, gratis' },
    { title: 'Añadir sus productos', desc: 'Con IA' },
    { title: 'Recibir pedidos', desc: 'Notificaciones en tiempo real' },
    { title: 'Enviar fácilmente', desc: 'Etiquetas automáticas' },
    { title: 'Recibir sus pagos', desc: 'En 7 días' },
  ],
  pricingTitle: 'Una tarificación simple y justa',
  pricingPoints: [
    'Inscripción: 100% gratuita',
    'Creación de tienda: gratuita',
    'Añadir productos: ilimitado',
    'Comisión: 5% solo sobre las ventas',
    'Sin costos ocultos',
    'Sin compromiso',
  ],
  pricingExampleLabel: 'Ejemplo concreto:',
  pricingExample: 'Usted vende 1 000€ → Recibe 950€',
  pricingExampleNote: 'Retenemos 50€ (5%) para mantener la plataforma',
  testimonialsLabel: 'Testimonios',
  testimonialsTitle: 'Ellos transformaron su comercio',
  testimonials: [
    { name: 'Fatima Benali', role: 'Cooperativa Argan Atlas', text: 'En 6 meses en EthiMarket, mis ventas se triplicaron. Por fin puedo pagar a mis 80 empleadas un salario digno.', initials: 'FB', color: '#22c55e' },
    { name: 'Karim Hosseini', role: 'Saffron Fields Irán', text: 'Se acabaron los intermediarios que tomaban el 60% de mi margen. Vendo directamente a chefs con estrellas en Francia.', initials: 'KH', color: '#f59e0b' },
    { name: 'Ana Rodríguez', role: 'Café Colombia Coop', text: 'La herramienta de IA es increíble. Tradujo mis 25 productos al inglés, español y alemán en 5 minutos.', initials: 'AR', color: '#3b82f6' },
  ],
  faqLabel: 'FAQ',
  faqTitle: 'Preguntas frecuentes de vendedores',
  faq: [
    { q: '¿Cuánto tiempo para crear mi tienda?', a: 'Menos de 2 minutos. Nuestra IA le ayuda a redactar su presentación y genera su tienda automáticamente.' },
    { q: '¿Cuándo recibiré mi primer pago?', a: 'En 7 días tras la confirmación de entrega por el comprador. La transferencia va directa a su cuenta bancaria.' },
    { q: '¿Cómo envío mis productos?', a: 'Generación automática de etiquetas de envío. Nuestros transportistas socios (DHL, UPS) recogen sus paquetes.' },
    { q: '¿Qué hacer en caso de disputa?', a: 'Contacte al soporte. EthiMarket retiene los fondos en escrow y arbitra la disputa en 14 días.' },
    { q: '¿Puedo fijar mis propios precios?', a: 'Sí, usted es libre de fijar sus precios y su MOQ (pedido mínimo) para cada producto.' },
  ],
  ctaTitle: '¿Listo para revolucionar su comercio?',
  ctaSubtitle: 'Cree su tienda en 2 minutos, gratis',
  ctaButton: 'Crear mi tienda ahora',
};

const pt: VendorContent = {
  heroTitle: 'Venda seus produtos orgânicos no mundo inteiro',
  heroSubtitle: 'Junte-se às cooperativas pioneiras que vendem direto, sem intermediários',
  heroCta: 'Criar minha loja gratuitamente',
  stats: [
    { emoji: '💰', value: '+40%', label: 'de margens em média' },
    { emoji: '🌍', value: '45', label: 'países de compradores' },
    { emoji: '📈', value: '8 250€', label: 'faturamento mensal médio' },
    { emoji: '⭐', value: '4.9/5', label: 'satisfação dos produtores' },
  ],
  benefitsLabel: 'Vantagens',
  benefitsTitle: 'Por que se juntar à EthiMarket?',
  benefits: [
    { emoji: '💰', title: 'Margens multiplicadas', desc: 'Venda diretamente, sem os 3-5 intermediários habituais. Mantenha o valor do seu trabalho.' },
    { emoji: '🌍', title: 'Mercados internacionais', desc: 'Acesse compradores profissionais internacionais. Nossa equipe acompanha você na logística e alfândega.' },
    { emoji: '🤖', title: 'Ferramentas de IA gratuitas', desc: 'A IA redige suas descrições, melhora suas fotos, traduz para 12 idiomas automaticamente.' },
    { emoji: '📸', title: 'Fotos profissionais', desc: 'Melhore suas fotos com nossa ferramenta de IA gratuita. Fundo neutro, luz perfeita em 1 clique.' },
    { emoji: '📊', title: 'Estatísticas detalhadas', desc: 'Acompanhe suas vendas, visualizações e tráfego. Otimize sua loja com os dados.' },
    { emoji: '💳', title: 'Pagamentos seguros', desc: 'Escrow em todas as transações. Dinheiro pago em 7 dias após entrega confirmada.' },
  ],
  stepsLabel: 'Início',
  stepsTitle: 'Como funciona',
  steps: [
    { title: 'Criar sua loja', desc: '2 minutos, grátis' },
    { title: 'Adicionar seus produtos', desc: 'Com IA' },
    { title: 'Receber pedidos', desc: 'Notificações em tempo real' },
    { title: 'Enviar facilmente', desc: 'Etiquetas automáticas' },
    { title: 'Receber seus pagamentos', desc: 'Em 7 dias' },
  ],
  pricingTitle: 'Uma precificação simples e justa',
  pricingPoints: [
    'Inscrição: 100% gratuita',
    'Criação da loja: gratuita',
    'Adição de produtos: ilimitada',
    'Comissão: 5% apenas sobre as vendas',
    'Sem taxas ocultas',
    'Sem compromisso',
  ],
  pricingExampleLabel: 'Exemplo concreto:',
  pricingExample: 'Você vende 1 000€ → Você recebe 950€',
  pricingExampleNote: 'Retemos 50€ (5%) para manter a plataforma',
  testimonialsLabel: 'Depoimentos',
  testimonialsTitle: 'Eles transformaram seu comércio',
  testimonials: [
    { name: 'Fatima Benali', role: 'Cooperativa Argan Atlas', text: 'Em 6 meses na EthiMarket, minhas vendas triplicaram. Finalmente posso pagar às minhas 80 funcionárias um salário digno.', initials: 'FB', color: '#22c55e' },
    { name: 'Karim Hosseini', role: 'Saffron Fields Irã', text: 'Chega de intermediários que ficavam com 60% da minha margem. Vendo diretamente para chefs estrelados na França.', initials: 'KH', color: '#f59e0b' },
    { name: 'Ana Rodriguez', role: 'Café Colombia Coop', text: 'A ferramenta de IA é incrível. Traduziu meus 25 produtos para inglês, espanhol e alemão em 5 minutos.', initials: 'AR', color: '#3b82f6' },
  ],
  faqLabel: 'FAQ',
  faqTitle: 'Perguntas frequentes de vendedores',
  faq: [
    { q: 'Quanto tempo para criar minha loja?', a: 'Menos de 2 minutos. Nossa IA ajuda você a redigir sua apresentação e gera sua loja automaticamente.' },
    { q: 'Quando receberei meu primeiro pagamento?', a: 'Em 7 dias após a confirmação de entrega pelo comprador. A transferência vai direto para sua conta bancária.' },
    { q: 'Como envio meus produtos?', a: 'Geração automática de etiquetas de envio. Nossas transportadoras parceiras (DHL, UPS) coletam seus pacotes.' },
    { q: 'O que fazer em caso de disputa?', a: 'Contate o suporte. A EthiMarket retém os fundos em escrow e arbitra a disputa em 14 dias.' },
    { q: 'Posso definir meus próprios preços?', a: 'Sim, você é livre para definir seus preços e seu MOQ (pedido mínimo) para cada produto.' },
  ],
  ctaTitle: 'Pronto para revolucionar seu comércio?',
  ctaSubtitle: 'Crie sua loja em 2 minutos, gratuitamente',
  ctaButton: 'Criar minha loja agora',
};

const ar: VendorContent = {
  heroTitle: 'بِع منتجاتك العضوية في جميع أنحاء العالم',
  heroSubtitle: 'انضم إلى التعاونيات الرائدة التي تبيع مباشرة، بدون وسطاء',
  heroCta: 'إنشاء متجري مجاناً',
  stats: [
    { emoji: '💰', value: '+40%', label: 'هوامش ربح في المتوسط' },
    { emoji: '🌍', value: '45', label: 'دولة من المشترين' },
    { emoji: '📈', value: '8 250€', label: 'متوسط الإيرادات الشهرية' },
    { emoji: '⭐', value: '4.9/5', label: 'رضا المنتجين' },
  ],
  benefitsLabel: 'المزايا',
  benefitsTitle: 'لماذا الانضمام إلى EthiMarket؟',
  benefits: [
    { emoji: '💰', title: 'هوامش مضاعفة', desc: 'بِع مباشرة، بدون الوسطاء الثلاثة إلى الخمسة المعتادين. احتفظ بقيمة عملك.' },
    { emoji: '🌍', title: 'أسواق دولية', desc: 'اصل إلى مشترين محترفين دوليين. فريقنا يرافقك في اللوجستيات والجمارك.' },
    { emoji: '🤖', title: 'أدوات ذكاء اصطناعي مجانية', desc: 'الذكاء الاصطناعي يكتب أوصافك، ويحسّن صورك، ويترجم إلى 12 لغة تلقائياً.' },
    { emoji: '📸', title: 'صور احترافية', desc: 'حسّن صورك بأداتنا المجانية بالذكاء الاصطناعي. خلفية محايدة، إضاءة مثالية بنقرة واحدة.' },
    { emoji: '📊', title: 'إحصائيات مفصلة', desc: 'تابع مبيعاتك ومشاهداتك وحركة زوارك. حسّن متجرك بالبيانات.' },
    { emoji: '💳', title: 'مدفوعات آمنة', desc: 'ضمان (Escrow) على جميع المعاملات. المال يُدفع خلال 7 أيام بعد تأكيد التسليم.' },
  ],
  stepsLabel: 'البداية',
  stepsTitle: 'كيف يعمل',
  steps: [
    { title: 'أنشئ متجرك', desc: 'دقيقتان، مجاناً' },
    { title: 'أضف منتجاتك', desc: 'بالذكاء الاصطناعي' },
    { title: 'استقبل الطلبات', desc: 'إشعارات فورية' },
    { title: 'اشحن بسهولة', desc: 'ملصقات تلقائية' },
    { title: 'استلم مدفوعاتك', desc: 'خلال 7 أيام' },
  ],
  pricingTitle: 'تسعير بسيط وعادل',
  pricingPoints: [
    'التسجيل: مجاني 100%',
    'إنشاء المتجر: مجاني',
    'إضافة المنتجات: غير محدودة',
    'العمولة: 5% على المبيعات فقط',
    'لا رسوم خفية',
    'لا التزام',
  ],
  pricingExampleLabel: 'مثال ملموس:',
  pricingExample: 'تبيع بـ 1000€ ← تستلم 950€',
  pricingExampleNote: 'نقتطع 50€ (5%) لصيانة المنصة',
  testimonialsLabel: 'شهادات',
  testimonialsTitle: 'لقد حوّلوا تجارتهم',
  testimonials: [
    { name: 'فاطمة بنعلي', role: 'تعاونية أركان أطلس', text: 'في 6 أشهر على EthiMarket، تضاعفت مبيعاتي ثلاث مرات. أستطيع أخيراً دفع أجر كريم لموظفاتي الثمانين.', initials: 'FB', color: '#22c55e' },
    { name: 'كريم حسيني', role: 'حقول الزعفران إيران', text: 'انتهى زمن الوسطاء الذين كانوا يأخذون 60% من هامشي. أبيع مباشرة لطهاة حاصلين على نجوم في فرنسا.', initials: 'KH', color: '#f59e0b' },
    { name: 'آنا رودريغيز', role: 'تعاونية قهوة كولومبيا', text: 'أداة الذكاء الاصطناعي مذهلة. ترجمت منتجاتي الـ 25 إلى الإنجليزية والإسبانية والألمانية في 5 دقائق.', initials: 'AR', color: '#3b82f6' },
  ],
  faqLabel: 'الأسئلة الشائعة',
  faqTitle: 'الأسئلة الشائعة للبائعين',
  faq: [
    { q: 'كم من الوقت لإنشاء متجري؟', a: 'أقل من دقيقتين. ذكاؤنا الاصطناعي يساعدك في كتابة عرضك وينشئ متجرك تلقائياً.' },
    { q: 'متى سأستلم أول دفعة؟', a: 'خلال 7 أيام بعد تأكيد التسليم من المشتري. التحويل مباشر إلى حسابك البنكي.' },
    { q: 'كيف أرسل منتجاتي؟', a: 'إنشاء تلقائي لملصقات الشحن. شركاؤنا الناقلون (DHL، UPS) يأتون لاستلام طرودك.' },
    { q: 'ماذا أفعل في حالة نزاع؟', a: 'اتصل بالدعم. تحتفظ EthiMarket بالأموال في الضمان وتفصل في النزاع خلال 14 يوماً.' },
    { q: 'هل يمكنني تحديد أسعاري بنفسي؟', a: 'نعم، أنت حر في تحديد أسعارك وحد الطلب الأدنى (MOQ) لكل منتج.' },
  ],
  ctaTitle: 'هل أنت مستعد لإحداث ثورة في تجارتك؟',
  ctaSubtitle: 'أنشئ متجرك في دقيقتين، مجاناً',
  ctaButton: 'إنشاء متجري الآن',
};

export const VENDOR_CONTENT: PerLocale<VendorContent> = { fr, en, es, pt, ar };
