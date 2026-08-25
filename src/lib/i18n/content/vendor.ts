/**
 * Contenus multilingues — page Devenir Vendeur.
 * RÈGLE ÉDITORIALE (audit août 2026) : chaque affirmation de cette page
 * correspond à une capacité RÉELLE et vérifiable de la plateforme.
 * Pas de stats inventées, pas de témoignages fictifs, pas de promesses
 * de fonctionnalités inexistantes (étiquettes auto, escrow, IA photo…).
 * Les témoignages sont vides tant qu'il n'y a pas de vrais témoignages
 * (la section est masquée automatiquement).
 */
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
  heroSubtitle: 'Rejoignez une marketplace qui prouve ce qu\'elle affirme : producteurs vérifiés, paiements directs, traçabilité publique',
  heroCta: 'Créer ma boutique gratuitement',
  stats: [
    { emoji: '💶', value: '0%', label: 'prélevé sur vos paiements — l\'acheteur vous paie en direct' },
    { emoji: '🛡️', value: '6', label: 'critères vérifiés avec preuves : votre badge convainc les acheteurs' },
    { emoji: '🌍', value: '5', label: 'langues : vos produits traduits automatiquement' },
    { emoji: '📊', value: '5%', label: 'de commission, uniquement quand vous vendez' },
  ],
  benefitsLabel: 'Avantages',
  benefitsTitle: 'Pourquoi rejoindre EthiMarket ?',
  benefits: [
    { emoji: '💰', title: 'Vente directe, sans intermédiaires', desc: 'Vous fixez vos prix, vous vendez directement aux acheteurs. La valeur de votre travail reste chez vous.' },
    { emoji: '🛡️', title: 'Un badge vérifié qui vaut de l\'or', desc: 'Identité, entreprise, certifications, exploitation : chaque critère est contrôlé aux registres officiels et les preuves sont publiées sur votre boutique. Les acheteurs voient ce qui a été vérifié.' },
    { emoji: '🌍', title: 'Traduits en 5 langues, automatiquement', desc: 'Vos produits et votre boutique s\'affichent en français, anglais, espagnol, portugais et arabe sans effort de votre part.' },
    { emoji: '🌱', title: 'Bilan carbone calculé pour vous', desc: 'Empreinte CO2 et eau estimées à partir de références scientifiques (ADEME, Water Footprint Network) selon votre produit et votre méthode agricole. Rien à mesurer vous-même.' },
    { emoji: '📦', title: 'Export guidé pas à pas', desc: 'Feuille de route douanière par pays, documents exigés par lot (bio, phytosanitaire, analyses), annuaire de laboratoires accrédités : nous transformons la paperasse export en check-list.' },
    { emoji: '🔍', title: 'Traçabilité qui vous met en valeur', desc: 'Chaque lot expédié porte un QR code public : origine, documents, contrôles. Vos acheteurs peuvent le montrer à leurs propres clients.' },
  ],
  stepsLabel: 'Démarrage',
  stepsTitle: 'Comment ça marche',
  steps: [
    { title: 'Créer votre compte', desc: 'Gratuit, en quelques minutes' },
    { title: 'Faire vérifier votre dossier', desc: 'Identité, certifications — contrôlées aux registres' },
    { title: 'Publier vos produits', desc: 'Traduction et bilan carbone automatiques' },
    { title: 'Recevoir devis et commandes', desc: 'Notifications temps réel' },
    { title: 'Expédier et être payé en direct', desc: 'Documents de lot guidés, paiement sans intermédiaire' },
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
  pricingExampleNote: 'Nous prélevons 50€ (5%) pour maintenir la plateforme. L\'acheteur vous règle directement : votre argent ne transite jamais par nous.',
  testimonialsLabel: 'Témoignages',
  testimonialsTitle: 'Ils ont transformé leur commerce',
  testimonials: [],
  faqLabel: 'FAQ',
  faqTitle: 'Questions fréquentes vendeurs',
  faq: [
    { q: 'Combien de temps pour créer ma boutique ?', a: 'Le compte et la boutique se créent en quelques minutes, gratuitement. Votre boutique devient publique une fois votre dossier vérifié par notre équipe (identité, entreprise, certifications) — c\'est cette vérification qui donne sa valeur à votre badge auprès des acheteurs.' },
    { q: 'Comment suis-je payé ?', a: 'Directement par l\'acheteur, par virement bancaire ou carte selon la commande. EthiMarket n\'encaisse jamais votre argent et ne prélève rien sur vos paiements : la commission de 5% est facturée séparément.' },
    { q: 'Comment envoyer mes produits ?', a: 'Vous expédiez avec le transporteur de votre choix. La plateforme vous guide : liste des documents exigés pour votre lot (certificat bio, phytosanitaire, analyses selon la filière), feuille de route douanière par destination, et QR de traçabilité à joindre au colis.' },
    { q: 'Que faire en cas de litige ?', a: 'L\'acheteur peut ouvrir un litige sur sa commande ; notre équipe instruit un dossier qualité tracé et arbitre entre les parties. Chaque constat est enregistré de façon permanente — pour vous protéger aussi des réclamations abusives.' },
    { q: 'Puis-je fixer mes propres prix ?', a: 'Oui, vous êtes libre de fixer vos prix et votre MOQ (commande minimum) pour chaque produit, avec des paliers dégressifs si vous le souhaitez.' },
    { q: 'La vérification est-elle payante ?', a: 'Non. La vérification de votre dossier (registres officiels, défi photo, appel vidéo) est gratuite et incluse. Elle protège les producteurs honnêtes : c\'est elle qui fait la différence entre EthiMarket et une marketplace classique.' },
  ],
  ctaTitle: 'Prêt à vendre en direct, preuves à l\'appui ?',
  ctaSubtitle: 'Créez votre compte gratuitement — la vérification fait le reste',
  ctaButton: 'Créer ma boutique maintenant',
};

const en: VendorContent = {
  heroTitle: 'Sell your organic products worldwide',
  heroSubtitle: 'Join a marketplace that proves what it claims: verified producers, direct payments, public traceability',
  heroCta: 'Create my shop for free',
  stats: [
    { emoji: '💶', value: '0%', label: 'taken from your payments — buyers pay you directly' },
    { emoji: '🛡️', value: '6', label: 'criteria verified with evidence: your badge convinces buyers' },
    { emoji: '🌍', value: '5', label: 'languages: your products translated automatically' },
    { emoji: '📊', value: '5%', label: 'commission, only when you sell' },
  ],
  benefitsLabel: 'Benefits',
  benefitsTitle: 'Why join EthiMarket?',
  benefits: [
    { emoji: '💰', title: 'Direct sales, no middlemen', desc: 'You set your prices, you sell directly to buyers. The value of your work stays with you.' },
    { emoji: '🛡️', title: 'A verified badge worth gold', desc: 'Identity, business, certifications, farm: every criterion is checked against official registries and the evidence is published on your shop. Buyers see what was verified.' },
    { emoji: '🌍', title: 'Translated into 5 languages, automatically', desc: 'Your products and shop appear in French, English, Spanish, Portuguese and Arabic with no effort on your side.' },
    { emoji: '🌱', title: 'Carbon footprint calculated for you', desc: 'CO2 and water footprints estimated from scientific references (ADEME, Water Footprint Network) based on your product and farming method. Nothing to measure yourself.' },
    { emoji: '📦', title: 'Step-by-step export guidance', desc: 'Customs roadmap per country, required documents per batch (organic, phytosanitary, analyses), directory of accredited laboratories: we turn export paperwork into a checklist.' },
    { emoji: '🔍', title: 'Traceability that showcases you', desc: 'Every shipped batch carries a public QR code: origin, documents, controls. Your buyers can show it to their own customers.' },
  ],
  stepsLabel: 'Getting started',
  stepsTitle: 'How it works',
  steps: [
    { title: 'Create your account', desc: 'Free, in a few minutes' },
    { title: 'Get your file verified', desc: 'Identity, certifications — checked at the registries' },
    { title: 'Publish your products', desc: 'Automatic translation and carbon footprint' },
    { title: 'Receive quotes and orders', desc: 'Real-time notifications' },
    { title: 'Ship and get paid directly', desc: 'Guided batch documents, payment without middleman' },
  ],
  pricingTitle: 'Simple, fair pricing',
  pricingPoints: [
    'Sign-up: 100% free',
    'Shop creation: free',
    'Product listings: unlimited',
    'Commission: 5% only on sales',
    'No hidden fees',
    'No commitment',
  ],
  pricingExampleLabel: 'Concrete example:',
  pricingExample: 'You sell €1,000 → You receive €950',
  pricingExampleNote: 'We charge €50 (5%) to maintain the platform. The buyer pays you directly: your money never passes through us.',
  testimonialsLabel: 'Testimonials',
  testimonialsTitle: 'They transformed their trade',
  testimonials: [],
  faqLabel: 'FAQ',
  faqTitle: 'Frequent seller questions',
  faq: [
    { q: 'How long to create my shop?', a: 'The account and shop are created in a few minutes, for free. Your shop goes public once your file has been verified by our team (identity, business, certifications) — that verification is what gives your badge its value with buyers.' },
    { q: 'How do I get paid?', a: 'Directly by the buyer, by bank transfer or card depending on the order. EthiMarket never collects your money and takes nothing from your payments: the 5% commission is invoiced separately.' },
    { q: 'How do I ship my products?', a: 'You ship with the carrier of your choice. The platform guides you: list of documents required for your batch (organic certificate, phytosanitary, analyses depending on the supply chain), customs roadmap per destination, and a traceability QR to attach to the parcel.' },
    { q: 'What about disputes?', a: 'The buyer can open a dispute on their order; our team builds a traced quality case and arbitrates between the parties. Every finding is recorded permanently — which also protects you from abusive claims.' },
    { q: 'Can I set my own prices?', a: 'Yes, you are free to set your prices and your MOQ (minimum order) for each product, with volume tiers if you wish.' },
    { q: 'Is verification paid?', a: 'No. The verification of your file (official registries, photo challenge, video call) is free and included. It protects honest producers: it is what sets EthiMarket apart from a classic marketplace.' },
  ],
  ctaTitle: 'Ready to sell directly, evidence included?',
  ctaSubtitle: 'Create your account for free — verification does the rest',
  ctaButton: 'Create my shop now',
};

const es: VendorContent = {
  heroTitle: 'Venda sus productos bio en todo el mundo',
  heroSubtitle: 'Únase a un marketplace que demuestra lo que afirma: productores verificados, pagos directos, trazabilidad pública',
  heroCta: 'Crear mi tienda gratis',
  stats: [
    { emoji: '💶', value: '0%', label: 'retenido de sus pagos — el comprador le paga directamente' },
    { emoji: '🛡️', value: '6', label: 'criterios verificados con pruebas: su insignia convence a los compradores' },
    { emoji: '🌍', value: '5', label: 'idiomas: sus productos traducidos automáticamente' },
    { emoji: '📊', value: '5%', label: 'de comisión, solo cuando vende' },
  ],
  benefitsLabel: 'Ventajas',
  benefitsTitle: '¿Por qué unirse a EthiMarket?',
  benefits: [
    { emoji: '💰', title: 'Venta directa, sin intermediarios', desc: 'Usted fija sus precios, vende directamente a los compradores. El valor de su trabajo se queda con usted.' },
    { emoji: '🛡️', title: 'Una insignia verificada que vale oro', desc: 'Identidad, empresa, certificaciones, explotación: cada criterio se controla en los registros oficiales y las pruebas se publican en su tienda. Los compradores ven lo que se verificó.' },
    { emoji: '🌍', title: 'Traducidos a 5 idiomas, automáticamente', desc: 'Sus productos y su tienda se muestran en francés, inglés, español, portugués y árabe sin esfuerzo por su parte.' },
    { emoji: '🌱', title: 'Huella de carbono calculada por usted', desc: 'Huellas de CO2 y agua estimadas a partir de referencias científicas (ADEME, Water Footprint Network) según su producto y método agrícola. Nada que medir usted mismo.' },
    { emoji: '📦', title: 'Exportación guiada paso a paso', desc: 'Hoja de ruta aduanera por país, documentos exigidos por lote (bio, fitosanitario, análisis), directorio de laboratorios acreditados: convertimos el papeleo de exportación en una lista de verificación.' },
    { emoji: '🔍', title: 'Trazabilidad que le pone en valor', desc: 'Cada lote expedido lleva un código QR público: origen, documentos, controles. Sus compradores pueden mostrarlo a sus propios clientes.' },
  ],
  stepsLabel: 'Inicio',
  stepsTitle: 'Cómo funciona',
  steps: [
    { title: 'Crear su cuenta', desc: 'Gratis, en unos minutos' },
    { title: 'Verificar su expediente', desc: 'Identidad, certificaciones — controladas en los registros' },
    { title: 'Publicar sus productos', desc: 'Traducción y huella de carbono automáticas' },
    { title: 'Recibir presupuestos y pedidos', desc: 'Notificaciones en tiempo real' },
    { title: 'Expedir y cobrar directamente', desc: 'Documentos de lote guiados, pago sin intermediario' },
  ],
  pricingTitle: 'Una tarificación simple y justa',
  pricingPoints: [
    'Inscripción: 100% gratuita',
    'Creación de tienda: gratuita',
    'Añadir productos: ilimitado',
    'Comisión: 5% solo sobre las ventas',
    'Sin costes ocultos',
    'Sin compromiso',
  ],
  pricingExampleLabel: 'Ejemplo concreto:',
  pricingExample: 'Vende 1 000€ → Recibe 950€',
  pricingExampleNote: 'Cobramos 50€ (5%) para mantener la plataforma. El comprador le paga directamente: su dinero nunca pasa por nosotros.',
  testimonialsLabel: 'Testimonios',
  testimonialsTitle: 'Transformaron su comercio',
  testimonials: [],
  faqLabel: 'FAQ',
  faqTitle: 'Preguntas frecuentes de vendedores',
  faq: [
    { q: '¿Cuánto tiempo para crear mi tienda?', a: 'La cuenta y la tienda se crean en unos minutos, gratis. Su tienda se hace pública una vez que nuestro equipo verifica su expediente (identidad, empresa, certificaciones) — esa verificación es lo que da valor a su insignia ante los compradores.' },
    { q: '¿Cómo cobro?', a: 'Directamente del comprador, por transferencia bancaria o tarjeta según el pedido. EthiMarket nunca cobra su dinero y no retiene nada de sus pagos: la comisión del 5% se factura por separado.' },
    { q: '¿Cómo envío mis productos?', a: 'Usted expide con el transportista de su elección. La plataforma le guía: lista de documentos exigidos para su lote (certificado bio, fitosanitario, análisis según la cadena), hoja de ruta aduanera por destino, y QR de trazabilidad para adjuntar al paquete.' },
    { q: '¿Qué hacer en caso de litigio?', a: 'El comprador puede abrir un litigio sobre su pedido; nuestro equipo instruye un expediente de calidad trazado y arbitra entre las partes. Cada constatación se registra de forma permanente — lo que también le protege de reclamaciones abusivas.' },
    { q: '¿Puedo fijar mis propios precios?', a: 'Sí, es libre de fijar sus precios y su MOQ (pedido mínimo) para cada producto, con escalones decrecientes si lo desea.' },
    { q: '¿La verificación es de pago?', a: 'No. La verificación de su expediente (registros oficiales, desafío foto, videollamada) es gratuita e incluida. Protege a los productores honestos: es lo que diferencia a EthiMarket de un marketplace clásico.' },
  ],
  ctaTitle: '¿Listo para vender en directo, con pruebas?',
  ctaSubtitle: 'Cree su cuenta gratis — la verificación hace el resto',
  ctaButton: 'Crear mi tienda ahora',
};

const pt: VendorContent = {
  heroTitle: 'Venda os seus produtos bio no mundo inteiro',
  heroSubtitle: 'Junte-se a um marketplace que prova o que afirma: produtores verificados, pagamentos diretos, rastreabilidade pública',
  heroCta: 'Criar a minha loja gratuitamente',
  stats: [
    { emoji: '💶', value: '0%', label: 'retido dos seus pagamentos — o comprador paga-lhe diretamente' },
    { emoji: '🛡️', value: '6', label: 'critérios verificados com provas: o seu selo convence os compradores' },
    { emoji: '🌍', value: '5', label: 'línguas: os seus produtos traduzidos automaticamente' },
    { emoji: '📊', value: '5%', label: 'de comissão, apenas quando vende' },
  ],
  benefitsLabel: 'Vantagens',
  benefitsTitle: 'Porquê juntar-se à EthiMarket?',
  benefits: [
    { emoji: '💰', title: 'Venda direta, sem intermediários', desc: 'Fixa os seus preços, vende diretamente aos compradores. O valor do seu trabalho fica consigo.' },
    { emoji: '🛡️', title: 'Um selo verificado que vale ouro', desc: 'Identidade, empresa, certificações, exploração: cada critério é controlado nos registos oficiais e as provas são publicadas na sua loja. Os compradores veem o que foi verificado.' },
    { emoji: '🌍', title: 'Traduzidos em 5 línguas, automaticamente', desc: 'Os seus produtos e a sua loja aparecem em francês, inglês, espanhol, português e árabe sem esforço da sua parte.' },
    { emoji: '🌱', title: 'Pegada de carbono calculada por si', desc: 'Pegadas de CO2 e água estimadas a partir de referências científicas (ADEME, Water Footprint Network) segundo o seu produto e método agrícola. Nada a medir por si próprio.' },
    { emoji: '📦', title: 'Exportação guiada passo a passo', desc: 'Roteiro aduaneiro por país, documentos exigidos por lote (bio, fitossanitário, análises), diretório de laboratórios acreditados: transformamos a papelada de exportação numa lista de verificação.' },
    { emoji: '🔍', title: 'Rastreabilidade que o valoriza', desc: 'Cada lote expedido leva um código QR público: origem, documentos, controlos. Os seus compradores podem mostrá-lo aos seus próprios clientes.' },
  ],
  stepsLabel: 'Começar',
  stepsTitle: 'Como funciona',
  steps: [
    { title: 'Criar a sua conta', desc: 'Grátis, em alguns minutos' },
    { title: 'Verificar o seu dossiê', desc: 'Identidade, certificações — controladas nos registos' },
    { title: 'Publicar os seus produtos', desc: 'Tradução e pegada de carbono automáticas' },
    { title: 'Receber orçamentos e encomendas', desc: 'Notificações em tempo real' },
    { title: 'Expedir e ser pago diretamente', desc: 'Documentos de lote guiados, pagamento sem intermediário' },
  ],
  pricingTitle: 'Uma tarifação simples e justa',
  pricingPoints: [
    'Inscrição: 100% gratuita',
    'Criação de loja: gratuita',
    'Adição de produtos: ilimitada',
    'Comissão: 5% apenas sobre as vendas',
    'Sem custos escondidos',
    'Sem compromisso',
  ],
  pricingExampleLabel: 'Exemplo concreto:',
  pricingExample: 'Vende 1 000€ → Recebe 950€',
  pricingExampleNote: 'Cobramos 50€ (5%) para manter a plataforma. O comprador paga-lhe diretamente: o seu dinheiro nunca passa por nós.',
  testimonialsLabel: 'Testemunhos',
  testimonialsTitle: 'Transformaram o seu comércio',
  testimonials: [],
  faqLabel: 'FAQ',
  faqTitle: 'Perguntas frequentes de vendedores',
  faq: [
    { q: 'Quanto tempo para criar a minha loja?', a: 'A conta e a loja criam-se em alguns minutos, gratuitamente. A sua loja torna-se pública depois de o seu dossiê ser verificado pela nossa equipa (identidade, empresa, certificações) — é essa verificação que dá valor ao seu selo junto dos compradores.' },
    { q: 'Como sou pago?', a: 'Diretamente pelo comprador, por transferência bancária ou cartão consoante a encomenda. A EthiMarket nunca cobra o seu dinheiro e não retém nada dos seus pagamentos: a comissão de 5% é faturada separadamente.' },
    { q: 'Como envio os meus produtos?', a: 'Expede com a transportadora da sua escolha. A plataforma guia-o: lista dos documentos exigidos para o seu lote (certificado bio, fitossanitário, análises conforme a cadeia), roteiro aduaneiro por destino, e QR de rastreabilidade para juntar à encomenda.' },
    { q: 'O que fazer em caso de litígio?', a: 'O comprador pode abrir um litígio sobre a sua encomenda; a nossa equipa instrui um processo de qualidade rastreado e arbitra entre as partes. Cada constatação é registada de forma permanente — o que também o protege de reclamações abusivas.' },
    { q: 'Posso fixar os meus próprios preços?', a: 'Sim, é livre de fixar os seus preços e o seu MOQ (encomenda mínima) para cada produto, com escalões decrescentes se desejar.' },
    { q: 'A verificação é paga?', a: 'Não. A verificação do seu dossiê (registos oficiais, desafio foto, videochamada) é gratuita e incluída. Protege os produtores honestos: é o que distingue a EthiMarket de um marketplace clássico.' },
  ],
  ctaTitle: 'Pronto a vender em direto, com provas?',
  ctaSubtitle: 'Crie a sua conta gratuitamente — a verificação faz o resto',
  ctaButton: 'Criar a minha loja agora',
};

const ar: VendorContent = {
  heroTitle: 'بِع منتجاتك العضوية في العالم أجمع',
  heroSubtitle: 'انضم إلى سوق يُثبت ما يدّعيه: منتِجون موثّقون، مدفوعات مباشرة، تتبّع علني',
  heroCta: 'أنشئ متجري مجاناً',
  stats: [
    { emoji: '💶', value: '0%', label: 'يُقتطع من مدفوعاتك — المشتري يدفع لك مباشرة' },
    { emoji: '🛡️', value: '6', label: 'معايير موثّقة بالأدلة: شارتك تقنع المشترين' },
    { emoji: '🌍', value: '5', label: 'لغات: منتجاتك تُترجم تلقائياً' },
    { emoji: '📊', value: '5%', label: 'عمولة، فقط عندما تبيع' },
  ],
  benefitsLabel: 'المزايا',
  benefitsTitle: 'لماذا تنضم إلى إيثي ماركت؟',
  benefits: [
    { emoji: '💰', title: 'بيع مباشر، بلا وسطاء', desc: 'أنت تحدد أسعارك وتبيع مباشرة للمشترين. قيمة عملك تبقى لك.' },
    { emoji: '🛡️', title: 'شارة موثّقة تساوي ذهباً', desc: 'الهوية، الشركة، الشهادات، المزرعة: كل معيار يُراقب في السجلات الرسمية وتُنشر الأدلة على متجرك. المشترون يرون ما تم التحقق منه.' },
    { emoji: '🌍', title: 'مترجمة إلى 5 لغات تلقائياً', desc: 'منتجاتك ومتجرك يظهران بالفرنسية والإنجليزية والإسبانية والبرتغالية والعربية دون جهد منك.' },
    { emoji: '🌱', title: 'بصمة كربونية محسوبة لك', desc: 'بصمتا CO2 والماء مقدّرتان من مراجع علمية (ADEME، شبكة البصمة المائية) حسب منتجك وطريقتك الزراعية. لا شيء تقيسه بنفسك.' },
    { emoji: '📦', title: 'تصدير مُرشَد خطوة بخطوة', desc: 'خارطة طريق جمركية لكل بلد، وثائق مطلوبة لكل دفعة (بيو، صحة نباتية، تحاليل)، دليل مختبرات معتمدة: نحوّل أوراق التصدير إلى قائمة تحقق.' },
    { emoji: '🔍', title: 'تتبّع يُبرز قيمتك', desc: 'كل دفعة مشحونة تحمل رمز QR علنياً: المنشأ، الوثائق، الرقابات. يمكن لمشتريك عرضه على عملائه.' },
  ],
  stepsLabel: 'البداية',
  stepsTitle: 'كيف يعمل',
  steps: [
    { title: 'أنشئ حسابك', desc: 'مجاناً، في دقائق' },
    { title: 'وثّق ملفك', desc: 'الهوية والشهادات — تُراقب في السجلات' },
    { title: 'انشر منتجاتك', desc: 'ترجمة وبصمة كربونية تلقائيتان' },
    { title: 'استقبل عروض الأسعار والطلبات', desc: 'إشعارات فورية' },
    { title: 'اشحن واقبض مباشرة', desc: 'وثائق دفعة مُرشَدة، دفع بلا وسيط' },
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
  pricingExample: 'تبيع 1000€ ← تستلم 950€',
  pricingExampleNote: 'نقتطع 50€ (5%) لصيانة المنصة. المشتري يدفع لك مباشرة: أموالك لا تمر عبرنا أبداً.',
  testimonialsLabel: 'شهادات',
  testimonialsTitle: 'غيّروا تجارتهم',
  testimonials: [],
  faqLabel: 'الأسئلة الشائعة',
  faqTitle: 'أسئلة البائعين المتكررة',
  faq: [
    { q: 'كم يستغرق إنشاء متجري؟', a: 'يُنشأ الحساب والمتجر في دقائق، مجاناً. يصبح متجرك علنياً بعد تحقق فريقنا من ملفك (الهوية، الشركة، الشهادات) — هذا التحقق هو ما يعطي شارتك قيمتها لدى المشترين.' },
    { q: 'كيف أُدفَع؟', a: 'مباشرة من المشتري، بتحويل بنكي أو بطاقة حسب الطلب. إيثي ماركت لا تقبض أموالك أبداً ولا تقتطع شيئاً من مدفوعاتك: عمولة 5% تُفوتر على حدة.' },
    { q: 'كيف أرسل منتجاتي؟', a: 'تشحن مع الناقل الذي تختاره. المنصة ترشدك: قائمة الوثائق المطلوبة لدفعتك (شهادة بيو، صحة نباتية، تحاليل حسب السلسلة)، خارطة طريق جمركية لكل وجهة، ورمز QR للتتبّع يُرفق بالطرد.' },
    { q: 'ماذا أفعل في حالة نزاع؟', a: 'يمكن للمشتري فتح نزاع على طلبه؛ يفتح فريقنا ملف جودة متتبَّعاً ويحكّم بين الطرفين. كل معاينة تُسجَّل بشكل دائم — مما يحميك أيضاً من المطالبات التعسفية.' },
    { q: 'هل يمكنني تحديد أسعاري؟', a: 'نعم، أنت حر في تحديد أسعارك وحدك الأدنى للطلب لكل منتج، مع شرائح تنازلية إذا رغبت.' },
    { q: 'هل التحقق مدفوع؟', a: 'لا. التحقق من ملفك (السجلات الرسمية، تحدي الصورة، مكالمة الفيديو) مجاني ومشمول. يحمي المنتِجين الصادقين: هو ما يميّز إيثي ماركت عن سوق كلاسيكي.' },
  ],
  ctaTitle: 'مستعد للبيع مباشرة، بالأدلة؟',
  ctaSubtitle: 'أنشئ حسابك مجاناً — التحقق يتكفل بالباقي',
  ctaButton: 'أنشئ متجري الآن',
};

export const VENDOR_CONTENT: PerLocale<VendorContent> = { fr, en, es, pt, ar };
