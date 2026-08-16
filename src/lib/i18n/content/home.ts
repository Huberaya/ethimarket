/** Contenus éditoriaux multilingues — page d'accueil. */
import type { PerLocale } from './types';

export type HomeContent = {
  videoBadges: { icon: string; text: string }[];
  videoDuration: string;
  videoCardTitle: string;
  videoCardDesc: string;
  videoModalTitle: string;
  videoModalDesc: string;
  manifesto: [string, string, string];
  demarcheCards: { emoji: string; title: string; subtitle: string; points: string[] }[];
  finalBanner: string;
  impactMetrics: { emoji: string; value: string; label: string }[];
  carbonComparison: { label: string; co2: string }[];
  commitments2025: string[];
  testimonialQuote: string;
  testimonialName: string;
  testimonialRole: string;
  popular: string[];
};

const fr: HomeContent = {
  videoBadges: [
    { icon: '⏱️', text: '2 minutes pour comprendre' },
    { icon: '🎯', text: 'Notre mission expliquée' },
    { icon: '🌍', text: 'Disponible en 5 langues' },
  ],
  videoDuration: 'Vidéo · 2 min 14',
  videoCardTitle: 'Le commerce équitable, simplement',
  videoCardDesc: "Suivez le parcours d'une huile d'argan du Maroc jusqu'à un magasin bio à Paris.",
  videoModalTitle: 'Vidéo de présentation EthiMarket',
  videoModalDesc: "2 min 14 · Le parcours d'un produit équitable",
  manifesto: [
    'Le commerce mondial actuel appauvrit les producteurs, pollue notre planète et déshumanise les échanges commerciaux.',
    "EthiMarket redonne le pouvoir aux producteurs bio, assure une juste rémunération, réduit l'empreinte carbone et rebâtit la confiance entre tous les acteurs du commerce responsable.",
    "Nous croyons profondément qu'un monde meilleur commence par des échanges plus justes et plus transparents.",
  ],
  demarcheCards: [
    { emoji: '🌾', title: 'POUR LES PRODUCTEURS', subtitle: 'Reprendre le pouvoir sur son travail', points: ['+40% de marges en moyenne', 'Accès direct aux marchés mondiaux', 'Outils digitaux gratuits (IA, traduction)', 'Zéro intermédiaire, prix justes', 'Visibilité internationale'] },
    { emoji: '🏪', title: 'POUR LES ACHETEURS', subtitle: 'Sourcer bio, éthique et responsable', points: ["-35% sur les coûts d'approvisionnement", "Traçabilité totale de la ferme à l'assiette", 'Qualité garantie et certifiée', 'Gain de temps considérable (-80%)', 'Fournisseurs vérifiés physiquement'] },
    { emoji: '👥', title: 'POUR LES CONSOMMATEURS FINAUX', subtitle: 'Consommer en conscience', points: ['Produits authentiques et vérifiés', 'Origine traçable en 1 clic', 'Impact positif sur les producteurs', 'Prix reflétant la vraie valeur', "Soutien direct à l'agriculture familiale"] },
    { emoji: '🌍', title: 'POUR NOTRE PLANÈTE', subtitle: 'Un monde plus vivable pour demain', points: ["-60% d'émissions CO2 vs commerce classique", 'Biodiversité préservée', 'Sols vivants et fertiles', 'Océans protégés', 'Circuits courts optimisés'] },
  ],
  finalBanner: 'Ensemble, construisons le monde de demain : plus juste, plus vert, plus humain.',
  impactMetrics: [
    { emoji: '🌳', value: '15 000', label: 'arbres préservés' },
    { emoji: '💧', value: '2,3 M', label: "litres d'eau économisés" },
    { emoji: '♻️', value: '60%', label: 'de déchets plastique évités' },
    { emoji: '🌱', value: '850 t', label: 'de CO2 évitées' },
    { emoji: '🐝', value: '+45%', label: 'plus de pollinisateurs protégés' },
    { emoji: '👨‍🌾', value: '6', label: 'coopératives partenaires en direct' },
  ],
  carbonComparison: [
    { label: 'Commerce conventionnel', co2: '100 kg CO₂' },
    { label: 'Circuit court bio classique', co2: '40 kg CO₂' },
    { label: 'EthiMarket direct', co2: '20 kg CO₂' },
  ],
  commitments2025: [
    'Neutralité carbone sur toutes nos opérations',
    '100% emballages recyclables ou compostables',
    'Élargir le réseau de coopératives productrices vérifiées',
    'Programme de reforestation en Afrique et Amérique du Sud',
  ],
  testimonialQuote: "Grâce à EthiMarket, nous avons réduit nos coûts d'approvisionnement de 35% tout en améliorant la traçabilité de nos produits.",
  testimonialName: 'Marie Valentin',
  testimonialRole: 'Directrice achats, Bio Planet (500 magasins)',
  popular: ["Huile d'argan", 'Café éthiopien', 'Safran', 'Vanille', 'Quinoa', 'Spiruline'],
};

const en: HomeContent = {
  videoBadges: [
    { icon: '⏱️', text: '2 minutes to understand' },
    { icon: '🎯', text: 'Our mission explained' },
    { icon: '🌍', text: 'Available in 5 languages' },
  ],
  videoDuration: 'Video · 2 min 14',
  videoCardTitle: 'Fair trade, made simple',
  videoCardDesc: 'Follow the journey of an argan oil from Morocco to an organic store in Paris.',
  videoModalTitle: 'EthiMarket presentation video',
  videoModalDesc: '2 min 14 · The journey of a fair trade product',
  manifesto: [
    'Today\'s global trade impoverishes producers, pollutes our planet and dehumanizes commercial exchange.',
    'EthiMarket gives power back to organic producers, ensures fair pay, reduces the carbon footprint and rebuilds trust between all actors of responsible trade.',
    'We deeply believe that a better world starts with fairer and more transparent trade.',
  ],
  demarcheCards: [
    { emoji: '🌾', title: 'FOR PRODUCERS', subtitle: 'Take back control of your work', points: ['+40% margins on average', 'Direct access to global markets', 'Free digital tools (AI, translation)', 'Zero middlemen, fair prices', 'International visibility'] },
    { emoji: '🏪', title: 'FOR BUYERS', subtitle: 'Source organic, ethical and responsible', points: ['-35% on sourcing costs', 'Full traceability from farm to plate', 'Guaranteed and certified quality', 'Considerable time savings (-80%)', 'Physically verified suppliers'] },
    { emoji: '👥', title: 'FOR END CONSUMERS', subtitle: 'Consume consciously', points: ['Authentic, verified products', 'Origin traceable in 1 click', 'Positive impact on producers', 'Prices reflecting true value', 'Direct support to family farming'] },
    { emoji: '🌍', title: 'FOR OUR PLANET', subtitle: 'A more livable world for tomorrow', points: ['-60% CO2 emissions vs conventional trade', 'Preserved biodiversity', 'Living, fertile soils', 'Protected oceans', 'Optimized short supply chains'] },
  ],
  finalBanner: 'Together, let\'s build the world of tomorrow: fairer, greener, more human.',
  impactMetrics: [
    { emoji: '🌳', value: '15,000', label: 'trees preserved' },
    { emoji: '💧', value: '2.3 M', label: 'liters of water saved' },
    { emoji: '♻️', value: '60%', label: 'of plastic waste avoided' },
    { emoji: '🌱', value: '850 t', label: 'of CO2 avoided' },
    { emoji: '🐝', value: '+45%', label: 'more pollinators protected' },
    { emoji: '👨‍🌾', value: '6', label: 'direct partner cooperatives' },
  ],
  carbonComparison: [
    { label: 'Conventional trade', co2: '100 kg CO₂' },
    { label: 'Classic organic short chain', co2: '40 kg CO₂' },
    { label: 'EthiMarket direct', co2: '20 kg CO₂' },
  ],
  commitments2025: [
    'Carbon neutrality across all our operations',
    '100% recyclable or compostable packaging',
    'Expand the network of verified producer cooperatives',
    'Reforestation program in Africa and South America',
  ],
  testimonialQuote: 'Thanks to EthiMarket, we reduced our sourcing costs by 35% while improving the traceability of our products.',
  testimonialName: 'Marie Valentin',
  testimonialRole: 'Head of Purchasing, Bio Planet (500 stores)',
  popular: ['Argan oil', 'Ethiopian coffee', 'Saffron', 'Vanilla', 'Quinoa', 'Spirulina'],
};

const es: HomeContent = {
  videoBadges: [
    { icon: '⏱️', text: '2 minutos para entender' },
    { icon: '🎯', text: 'Nuestra misión explicada' },
    { icon: '🌍', text: 'Disponible en 5 idiomas' },
  ],
  videoDuration: 'Video · 2 min 14',
  videoCardTitle: 'El comercio justo, simplemente',
  videoCardDesc: 'Siga el recorrido de un aceite de argán desde Marruecos hasta una tienda orgánica en París.',
  videoModalTitle: 'Video de presentación de EthiMarket',
  videoModalDesc: '2 min 14 · El recorrido de un producto de comercio justo',
  manifesto: [
    'El comercio mundial actual empobrece a los productores, contamina nuestro planeta y deshumaniza los intercambios comerciales.',
    'EthiMarket devuelve el poder a los productores orgánicos, garantiza una remuneración justa, reduce la huella de carbono y reconstruye la confianza entre todos los actores del comercio responsable.',
    'Creemos profundamente que un mundo mejor comienza con intercambios más justos y transparentes.',
  ],
  demarcheCards: [
    { emoji: '🌾', title: 'PARA LOS PRODUCTORES', subtitle: 'Recuperar el poder sobre su trabajo', points: ['+40% de márgenes en promedio', 'Acceso directo a los mercados mundiales', 'Herramientas digitales gratuitas (IA, traducción)', 'Cero intermediarios, precios justos', 'Visibilidad internacional'] },
    { emoji: '🏪', title: 'PARA LOS COMPRADORES', subtitle: 'Abastecerse orgánico, ético y responsable', points: ['-35% en costos de abastecimiento', 'Trazabilidad total de la granja al plato', 'Calidad garantizada y certificada', 'Ahorro de tiempo considerable (-80%)', 'Proveedores verificados físicamente'] },
    { emoji: '👥', title: 'PARA LOS CONSUMIDORES FINALES', subtitle: 'Consumir con conciencia', points: ['Productos auténticos y verificados', 'Origen trazable en 1 clic', 'Impacto positivo en los productores', 'Precios que reflejan el valor real', 'Apoyo directo a la agricultura familiar'] },
    { emoji: '🌍', title: 'PARA NUESTRO PLANETA', subtitle: 'Un mundo más habitable para mañana', points: ['-60% de emisiones de CO2 vs comercio clásico', 'Biodiversidad preservada', 'Suelos vivos y fértiles', 'Océanos protegidos', 'Circuitos cortos optimizados'] },
  ],
  finalBanner: 'Juntos, construyamos el mundo del mañana: más justo, más verde, más humano.',
  impactMetrics: [
    { emoji: '🌳', value: '15 000', label: 'árboles preservados' },
    { emoji: '💧', value: '2,3 M', label: 'litros de agua ahorrados' },
    { emoji: '♻️', value: '60%', label: 'de residuos plásticos evitados' },
    { emoji: '🌱', value: '850 t', label: 'de CO2 evitadas' },
    { emoji: '🐝', value: '+45%', label: 'más polinizadores protegidos' },
    { emoji: '👨‍🌾', value: '6', label: 'cooperativas socias directas' },
  ],
  carbonComparison: [
    { label: 'Comercio convencional', co2: '100 kg CO₂' },
    { label: 'Circuito corto orgánico clásico', co2: '40 kg CO₂' },
    { label: 'EthiMarket directo', co2: '20 kg CO₂' },
  ],
  commitments2025: [
    'Neutralidad de carbono en todas nuestras operaciones',
    '100% envases reciclables o compostables',
    'Ampliar la red de cooperativas productoras verificadas',
    'Programa de reforestación en África y América del Sur',
  ],
  testimonialQuote: 'Gracias a EthiMarket, redujimos nuestros costos de abastecimiento en un 35% mejorando la trazabilidad de nuestros productos.',
  testimonialName: 'Marie Valentin',
  testimonialRole: 'Directora de compras, Bio Planet (500 tiendas)',
  popular: ['Aceite de argán', 'Café etíope', 'Azafrán', 'Vainilla', 'Quinua', 'Espirulina'],
};

const pt: HomeContent = {
  videoBadges: [
    { icon: '⏱️', text: '2 minutos para entender' },
    { icon: '🎯', text: 'Nossa missão explicada' },
    { icon: '🌍', text: 'Disponível em 5 idiomas' },
  ],
  videoDuration: 'Vídeo · 2 min 14',
  videoCardTitle: 'O comércio justo, simplesmente',
  videoCardDesc: 'Acompanhe o percurso de um óleo de argan do Marrocos até uma loja orgânica em Paris.',
  videoModalTitle: 'Vídeo de apresentação da EthiMarket',
  videoModalDesc: '2 min 14 · O percurso de um produto de comércio justo',
  manifesto: [
    'O comércio mundial atual empobrece os produtores, polui nosso planeta e desumaniza as trocas comerciais.',
    'A EthiMarket devolve o poder aos produtores orgânicos, garante uma remuneração justa, reduz a pegada de carbono e reconstrói a confiança entre todos os atores do comércio responsável.',
    'Acreditamos profundamente que um mundo melhor começa com trocas mais justas e transparentes.',
  ],
  demarcheCards: [
    { emoji: '🌾', title: 'PARA OS PRODUTORES', subtitle: 'Retomar o poder sobre seu trabalho', points: ['+40% de margens em média', 'Acesso direto aos mercados mundiais', 'Ferramentas digitais gratuitas (IA, tradução)', 'Zero intermediários, preços justos', 'Visibilidade internacional'] },
    { emoji: '🏪', title: 'PARA OS COMPRADORES', subtitle: 'Comprar orgânico, ético e responsável', points: ['-35% nos custos de abastecimento', 'Rastreabilidade total da fazenda ao prato', 'Qualidade garantida e certificada', 'Economia de tempo considerável (-80%)', 'Fornecedores verificados fisicamente'] },
    { emoji: '👥', title: 'PARA OS CONSUMIDORES FINAIS', subtitle: 'Consumir com consciência', points: ['Produtos autênticos e verificados', 'Origem rastreável em 1 clique', 'Impacto positivo nos produtores', 'Preços que refletem o valor real', 'Apoio direto à agricultura familiar'] },
    { emoji: '🌍', title: 'PARA O NOSSO PLANETA', subtitle: 'Um mundo mais habitável para amanhã', points: ['-60% de emissões de CO2 vs comércio clássico', 'Biodiversidade preservada', 'Solos vivos e férteis', 'Oceanos protegidos', 'Circuitos curtos otimizados'] },
  ],
  finalBanner: 'Juntos, construamos o mundo de amanhã: mais justo, mais verde, mais humano.',
  impactMetrics: [
    { emoji: '🌳', value: '15 000', label: 'árvores preservadas' },
    { emoji: '💧', value: '2,3 M', label: 'litros de água economizados' },
    { emoji: '♻️', value: '60%', label: 'de resíduos plásticos evitados' },
    { emoji: '🌱', value: '850 t', label: 'de CO2 evitadas' },
    { emoji: '🐝', value: '+45%', label: 'mais polinizadores protegidos' },
    { emoji: '👨‍🌾', value: '6', label: 'cooperativas parceiras diretas' },
  ],
  carbonComparison: [
    { label: 'Comércio convencional', co2: '100 kg CO₂' },
    { label: 'Circuito curto orgânico clássico', co2: '40 kg CO₂' },
    { label: 'EthiMarket direto', co2: '20 kg CO₂' },
  ],
  commitments2025: [
    'Neutralidade de carbono em todas as nossas operações',
    '100% embalagens recicláveis ou compostáveis',
    'Ampliar a rede de cooperativas produtoras verificadas',
    'Programa de reflorestamento na África e América do Sul',
  ],
  testimonialQuote: 'Graças à EthiMarket, reduzimos nossos custos de abastecimento em 35% melhorando a rastreabilidade de nossos produtos.',
  testimonialName: 'Marie Valentin',
  testimonialRole: 'Diretora de compras, Bio Planet (500 lojas)',
  popular: ['Óleo de argan', 'Café etíope', 'Açafrão', 'Baunilha', 'Quinoa', 'Espirulina'],
};

const ar: HomeContent = {
  videoBadges: [
    { icon: '⏱️', text: 'دقيقتان للفهم' },
    { icon: '🎯', text: 'مهمتنا موضحة' },
    { icon: '🌍', text: 'متاح بخمس لغات' },
  ],
  videoDuration: 'فيديو · 2 د 14',
  videoCardTitle: 'التجارة العادلة، ببساطة',
  videoCardDesc: 'تابع رحلة زيت الأركان من المغرب إلى متجر عضوي في باريس.',
  videoModalTitle: 'فيديو تقديمي عن EthiMarket',
  videoModalDesc: '2 د 14 · رحلة منتج من التجارة العادلة',
  manifesto: [
    'التجارة العالمية الحالية تُفقر المنتجين وتلوث كوكبنا وتجرد التبادلات التجارية من إنسانيتها.',
    'تعيد EthiMarket القوة للمنتجين العضويين، وتضمن أجراً عادلاً، وتقلل البصمة الكربونية، وتعيد بناء الثقة بين جميع أطراف التجارة المسؤولة.',
    'نؤمن إيماناً عميقاً بأن عالماً أفضل يبدأ بتبادلات أكثر عدلاً وشفافية.',
  ],
  demarcheCards: [
    { emoji: '🌾', title: 'للمنتجين', subtitle: 'استعادة السيطرة على عملهم', points: ['+40% هوامش ربح في المتوسط', 'وصول مباشر إلى الأسواق العالمية', 'أدوات رقمية مجانية (ذكاء اصطناعي، ترجمة)', 'صفر وسطاء، أسعار عادلة', 'حضور دولي'] },
    { emoji: '🏪', title: 'للمشترين', subtitle: 'توريد عضوي وأخلاقي ومسؤول', points: ['-35% من تكاليف التوريد', 'تتبع كامل من المزرعة إلى الطبق', 'جودة مضمونة ومعتمدة', 'توفير كبير في الوقت (-80%)', 'موردون تم التحقق منهم ميدانياً'] },
    { emoji: '👥', title: 'للمستهلكين النهائيين', subtitle: 'استهلاك واعٍ', points: ['منتجات أصيلة وموثّقة', 'منشأ قابل للتتبع بنقرة واحدة', 'أثر إيجابي على المنتجين', 'أسعار تعكس القيمة الحقيقية', 'دعم مباشر للزراعة العائلية'] },
    { emoji: '🌍', title: 'لكوكبنا', subtitle: 'عالم أكثر ملاءمة للعيش غداً', points: ['-60% انبعاثات CO2 مقارنة بالتجارة التقليدية', 'تنوع بيولوجي محمي', 'تربة حية وخصبة', 'محيطات محمية', 'سلاسل توريد قصيرة محسّنة'] },
  ],
  finalBanner: 'معاً، لنبنِ عالم الغد: أكثر عدلاً، أكثر خضرة، أكثر إنسانية.',
  impactMetrics: [
    { emoji: '🌳', value: '15 000', label: 'شجرة تم الحفاظ عليها' },
    { emoji: '💧', value: '2,3 مليون', label: 'لتر ماء تم توفيره' },
    { emoji: '♻️', value: '60%', label: 'من النفايات البلاستيكية تم تجنبها' },
    { emoji: '🌱', value: '850 طن', label: 'من CO2 تم تجنبها' },
    { emoji: '🐝', value: '+45%', label: 'ملقحات محمية إضافية' },
    { emoji: '👨‍🌾', value: '6', label: 'تعاونيات شريكة مباشرة' },
  ],
  carbonComparison: [
    { label: 'التجارة التقليدية', co2: '100 كغ CO₂' },
    { label: 'سلسلة قصيرة عضوية كلاسيكية', co2: '40 كغ CO₂' },
    { label: 'EthiMarket مباشر', co2: '20 كغ CO₂' },
  ],
  commitments2025: [
    'حياد كربوني في جميع عملياتنا',
    '100% عبوات قابلة لإعادة التدوير أو التسميد',
    'توسيع شبكة التعاونيات المنتجة الموثّقة',
    'برنامج إعادة تشجير في إفريقيا وأمريكا الجنوبية',
  ],
  testimonialQuote: 'بفضل EthiMarket، خفضنا تكاليف التوريد بنسبة 35% مع تحسين تتبع منتجاتنا.',
  testimonialName: 'ماري فالنتين',
  testimonialRole: 'مديرة المشتريات، Bio Planet (500 متجر)',
  popular: ['زيت الأركان', 'قهوة إثيوبية', 'زعفران', 'فانيليا', 'كينوا', 'سبيرولينا'],
};

export const HOME_CONTENT: PerLocale<HomeContent> = { fr, en, es, pt, ar };
