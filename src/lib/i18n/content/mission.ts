/** Contenus multilingues — page Notre Mission. */
import type { PerLocale } from './types';

export type MissionContent = {
  heroLabel: string;
  heroTitle: string;
  heroText: string;
  historyLabel: string;
  historyTitle: string;
  timeline: { period: string; title: string; desc: string }[];
  valuesLabel: string;
  valuesTitle: string;
  values: { emoji: string; title: string; desc: string }[];
  impactLabel: string;
  impactTitle: string;
  commitments: { value: string; label: string }[];
  partnersLabel: string;
  partnersTitle: string;
  ctaTitle: string;
  ctaProducer: string;
  ctaBuyer: string;
  ctaContact: string;
};

const fr: MissionContent = {
  heroLabel: "Notre raison d'être",
  heroTitle: 'Notre mission',
  heroText: 'Redonner sa juste valeur au travail des producteurs bio, transformer le commerce mondial en outil de justice sociale et environnementale, et construire ensemble le monde de demain.',
  historyLabel: 'Parcours',
  historyTitle: 'Notre histoire',
  timeline: [
    { period: '2023', title: "L'idée", desc: "Face au constat des inégalités dans le commerce bio, un expert en environnement décide d'agir." },
    { period: 'Début 2024', title: 'La conception', desc: '6 mois de recherche, rencontres avec 200 producteurs et 100 acheteurs pour comprendre les besoins.' },
    { period: 'Mi-2024', title: 'Le prototypage', desc: 'Conception de la plateforme avec des coopératives pilotes au Maroc, en Éthiopie et au Ghana.' },
    { period: 'Fin 2025', title: 'La construction', desc: 'Développement du Trust Center, du moteur de recherche responsable et du système de vérification des certifications.' },
    { period: '2026', title: 'Le lancement', desc: 'Ouverture publique : 12 coopératives vérifiées, preuves de certification publiées, score responsable explicable.' },
  ],
  valuesLabel: 'Ce qui nous anime',
  valuesTitle: 'Nos 5 valeurs',
  values: [
    { emoji: '🌱', title: 'Respect de la nature', desc: "L'agriculture bio n'est pas une mode, c'est la seule voie viable pour l'avenir de notre planète." },
    { emoji: '⚖️', title: 'Justice économique', desc: "Chaque producteur mérite un revenu digne pour son travail. Zéro intermédiaire qui s'enrichit sur son dos." },
    { emoji: '🤝', title: 'Transparence totale', desc: "De la ferme à l'assiette, chaque étape est traçable. Nous n'avons rien à cacher." },
    { emoji: '🌍', title: 'Impact positif', desc: 'Chaque commande passée soutient une famille, préserve un sol, réduit une empreinte carbone.' },
    { emoji: '💡', title: 'Innovation responsable', desc: "L'IA et la technologie au service de l'humain et de la planète, jamais l'inverse." },
  ],
  impactLabel: 'Notre impact',
  impactTitle: 'Nos engagements chiffrés',
  commitments: [
    { value: '15 000', label: 'arbres préservés' },
    { value: '850 t', label: 'CO2 évitées' },
    { value: '6', label: 'coopératives pilotes sur 4 continents' },
    { value: '2,3 M', label: "litres d'eau économisés" },
    { value: '45', label: 'pays impactés' },
    { value: '100%', label: 'certifications vérifiées' },
  ],
  partnersLabel: 'Confiance',
  partnersTitle: 'Nos partenaires',
  ctaTitle: 'Vous partagez notre vision ?',
  ctaProducer: 'Devenir producteur',
  ctaBuyer: 'Devenir acheteur',
  ctaContact: 'Nous contacter',
};

const en: MissionContent = {
  heroLabel: 'Our purpose',
  heroTitle: 'Our mission',
  heroText: 'Restore fair value to the work of organic producers, transform global trade into a tool for social and environmental justice, and build tomorrow\'s world together.',
  historyLabel: 'Journey',
  historyTitle: 'Our story',
  timeline: [
    { period: '2023', title: 'The idea', desc: 'Confronted with the inequalities of organic trade, an environmental expert decides to act.' },
    { period: 'Early 2024', title: 'The design', desc: '6 months of research, meetings with 200 producers and 100 buyers to understand the needs.' },
    { period: 'Mid-2024', title: 'The prototyping', desc: 'Designing the platform with pilot cooperatives in Morocco, Ethiopia and Ghana.' },
    { period: 'Late 2025', title: 'The build', desc: 'Development of the Trust Center, the responsible search engine and the certification verification system.' },
    { period: '2026', title: 'The launch', desc: 'Public opening: 12 verified cooperatives, published certification evidence, explainable responsibility score.' },
  ],
  valuesLabel: 'What drives us',
  valuesTitle: 'Our 5 values',
  values: [
    { emoji: '🌱', title: 'Respect for nature', desc: 'Organic farming is not a trend, it is the only viable path for the future of our planet.' },
    { emoji: '⚖️', title: 'Economic justice', desc: 'Every producer deserves a decent income for their work. Zero middlemen getting rich on their backs.' },
    { emoji: '🤝', title: 'Total transparency', desc: 'From farm to plate, every step is traceable. We have nothing to hide.' },
    { emoji: '🌍', title: 'Positive impact', desc: 'Every order placed supports a family, preserves a soil, reduces a carbon footprint.' },
    { emoji: '💡', title: 'Responsible innovation', desc: 'AI and technology serving people and the planet, never the other way around.' },
  ],
  impactLabel: 'Our impact',
  impactTitle: 'Our commitments in numbers',
  commitments: [
    { value: '15,000', label: 'trees preserved' },
    { value: '850 t', label: 'CO2 avoided' },
    { value: '6', label: 'pilot cooperatives on 4 continents' },
    { value: '2.3 M', label: 'liters of water saved' },
    { value: '45', label: 'countries impacted' },
    { value: '100%', label: 'verified certifications' },
  ],
  partnersLabel: 'Trust',
  partnersTitle: 'Our partners',
  ctaTitle: 'Do you share our vision?',
  ctaProducer: 'Become a producer',
  ctaBuyer: 'Become a buyer',
  ctaContact: 'Contact us',
};

const es: MissionContent = {
  heroLabel: 'Nuestra razón de ser',
  heroTitle: 'Nuestra misión',
  heroText: 'Devolver su justo valor al trabajo de los productores orgánicos, transformar el comercio mundial en una herramienta de justicia social y ambiental, y construir juntos el mundo del mañana.',
  historyLabel: 'Trayectoria',
  historyTitle: 'Nuestra historia',
  timeline: [
    { period: '2023', title: 'La idea', desc: 'Ante las desigualdades del comercio orgánico, un experto en medio ambiente decide actuar.' },
    { period: 'Inicios de 2024', title: 'El diseño', desc: '6 meses de investigación, encuentros con 200 productores y 100 compradores para entender las necesidades.' },
    { period: 'Mediados de 2024', title: 'El prototipo', desc: 'Diseño de la plataforma con cooperativas piloto en Marruecos, Etiopía y Ghana.' },
    { period: 'Finales de 2025', title: 'La construcción', desc: 'Desarrollo del Trust Center, del motor de búsqueda responsable y del sistema de verificación de certificaciones.' },
    { period: '2026', title: 'El lanzamiento', desc: 'Apertura pública: 12 cooperativas verificadas, pruebas de certificación publicadas, puntuación responsable explicable.' },
  ],
  valuesLabel: 'Lo que nos mueve',
  valuesTitle: 'Nuestros 5 valores',
  values: [
    { emoji: '🌱', title: 'Respeto por la naturaleza', desc: 'La agricultura orgánica no es una moda, es el único camino viable para el futuro de nuestro planeta.' },
    { emoji: '⚖️', title: 'Justicia económica', desc: 'Cada productor merece un ingreso digno por su trabajo. Cero intermediarios enriqueciéndose a su costa.' },
    { emoji: '🤝', title: 'Transparencia total', desc: 'De la granja al plato, cada etapa es trazable. No tenemos nada que ocultar.' },
    { emoji: '🌍', title: 'Impacto positivo', desc: 'Cada pedido realizado apoya a una familia, preserva un suelo, reduce una huella de carbono.' },
    { emoji: '💡', title: 'Innovación responsable', desc: 'La IA y la tecnología al servicio del ser humano y del planeta, nunca al revés.' },
  ],
  impactLabel: 'Nuestro impacto',
  impactTitle: 'Nuestros compromisos en cifras',
  commitments: [
    { value: '15 000', label: 'árboles preservados' },
    { value: '850 t', label: 'CO2 evitadas' },
    { value: '6', label: 'cooperativas piloto en 4 continentes' },
    { value: '2,3 M', label: 'litros de agua ahorrados' },
    { value: '45', label: 'países impactados' },
    { value: '100%', label: 'certificaciones verificadas' },
  ],
  partnersLabel: 'Confianza',
  partnersTitle: 'Nuestros socios',
  ctaTitle: '¿Comparte nuestra visión?',
  ctaProducer: 'Convertirse en productor',
  ctaBuyer: 'Convertirse en comprador',
  ctaContact: 'Contáctenos',
};

const pt: MissionContent = {
  heroLabel: 'Nossa razão de ser',
  heroTitle: 'Nossa missão',
  heroText: 'Devolver o justo valor ao trabalho dos produtores orgânicos, transformar o comércio mundial em ferramenta de justiça social e ambiental, e construir juntos o mundo de amanhã.',
  historyLabel: 'Trajetória',
  historyTitle: 'Nossa história',
  timeline: [
    { period: '2023', title: 'A ideia', desc: 'Diante das desigualdades do comércio orgânico, um especialista em meio ambiente decide agir.' },
    { period: 'Início de 2024', title: 'A concepção', desc: '6 meses de pesquisa, encontros com 200 produtores e 100 compradores para entender as necessidades.' },
    { period: 'Meados de 2024', title: 'O protótipo', desc: 'Concepção da plataforma com cooperativas piloto no Marrocos, na Etiópia e em Gana.' },
    { period: 'Final de 2025', title: 'A construção', desc: 'Desenvolvimento do Trust Center, do motor de busca responsável e do sistema de verificação de certificações.' },
    { period: '2026', title: 'O lançamento', desc: 'Abertura pública: 12 cooperativas verificadas, provas de certificação publicadas, pontuação responsável explicável.' },
  ],
  valuesLabel: 'O que nos move',
  valuesTitle: 'Nossos 5 valores',
  values: [
    { emoji: '🌱', title: 'Respeito pela natureza', desc: 'A agricultura orgânica não é moda, é o único caminho viável para o futuro do nosso planeta.' },
    { emoji: '⚖️', title: 'Justiça econômica', desc: 'Cada produtor merece uma renda digna pelo seu trabalho. Zero intermediários enriquecendo às suas custas.' },
    { emoji: '🤝', title: 'Transparência total', desc: 'Da fazenda ao prato, cada etapa é rastreável. Não temos nada a esconder.' },
    { emoji: '🌍', title: 'Impacto positivo', desc: 'Cada pedido realizado apoia uma família, preserva um solo, reduz uma pegada de carbono.' },
    { emoji: '💡', title: 'Inovação responsável', desc: 'IA e tecnologia a serviço do ser humano e do planeta, nunca o contrário.' },
  ],
  impactLabel: 'Nosso impacto',
  impactTitle: 'Nossos compromissos em números',
  commitments: [
    { value: '15 000', label: 'árvores preservadas' },
    { value: '850 t', label: 'CO2 evitadas' },
    { value: '6', label: 'cooperativas piloto em 4 continentes' },
    { value: '2,3 M', label: 'litros de água economizados' },
    { value: '45', label: 'países impactados' },
    { value: '100%', label: 'certificações verificadas' },
  ],
  partnersLabel: 'Confiança',
  partnersTitle: 'Nossos parceiros',
  ctaTitle: 'Compartilha nossa visão?',
  ctaProducer: 'Tornar-se produtor',
  ctaBuyer: 'Tornar-se comprador',
  ctaContact: 'Fale conosco',
};

const ar: MissionContent = {
  heroLabel: 'سبب وجودنا',
  heroTitle: 'مهمتنا',
  heroText: 'إعادة القيمة العادلة لعمل المنتجين العضويين، وتحويل التجارة العالمية إلى أداة للعدالة الاجتماعية والبيئية، وبناء عالم الغد معاً.',
  historyLabel: 'المسيرة',
  historyTitle: 'قصتنا',
  timeline: [
    { period: '2023', title: 'الفكرة', desc: 'أمام واقع اللامساواة في التجارة العضوية، قرر خبير في البيئة أن يتحرك.' },
    { period: 'بداية 2024', title: 'التصميم', desc: '6 أشهر من البحث، ولقاءات مع 200 منتج و100 مشترٍ لفهم الاحتياجات.' },
    { period: 'منتصف 2024', title: 'النموذج الأولي', desc: 'تصميم المنصة مع تعاونيات رائدة في المغرب وإثيوبيا وغانا.' },
    { period: 'نهاية 2025', title: 'البناء', desc: 'تطوير مركز الثقة، ومحرك البحث المسؤول، ونظام التحقق من الشهادات.' },
    { period: '2026', title: 'الإطلاق', desc: 'الافتتاح العام: 12 تعاونية موثّقة، أدلة شهادات منشورة، نقاط مسؤولية قابلة للتفسير.' },
  ],
  valuesLabel: 'ما يحركنا',
  valuesTitle: 'قيمنا الخمس',
  values: [
    { emoji: '🌱', title: 'احترام الطبيعة', desc: 'الزراعة العضوية ليست موضة، بل هي الطريق الوحيد القابل للاستمرار لمستقبل كوكبنا.' },
    { emoji: '⚖️', title: 'العدالة الاقتصادية', desc: 'كل منتج يستحق دخلاً كريماً مقابل عمله. صفر وسطاء يثرون على حسابه.' },
    { emoji: '🤝', title: 'شفافية كاملة', desc: 'من المزرعة إلى الطبق، كل مرحلة قابلة للتتبع. ليس لدينا ما نخفيه.' },
    { emoji: '🌍', title: 'أثر إيجابي', desc: 'كل طلب يدعم عائلة، ويحافظ على تربة، ويقلل بصمة كربونية.' },
    { emoji: '💡', title: 'ابتكار مسؤول', desc: 'الذكاء الاصطناعي والتكنولوجيا في خدمة الإنسان والكوكب، وليس العكس أبداً.' },
  ],
  impactLabel: 'أثرنا',
  impactTitle: 'التزاماتنا بالأرقام',
  commitments: [
    { value: '15 000', label: 'شجرة تم الحفاظ عليها' },
    { value: '850 طن', label: 'CO2 تم تجنبها' },
    { value: '6', label: 'تعاونيات رائدة في 4 قارات' },
    { value: '2,3 مليون', label: 'لتر ماء تم توفيره' },
    { value: '45', label: 'دولة تأثرت إيجابياً' },
    { value: '100%', label: 'شهادات موثّقة' },
  ],
  partnersLabel: 'الثقة',
  partnersTitle: 'شركاؤنا',
  ctaTitle: 'هل تشاركنا رؤيتنا؟',
  ctaProducer: 'كن منتجاً',
  ctaBuyer: 'كن مشترياً',
  ctaContact: 'اتصل بنا',
};

export const MISSION_CONTENT: PerLocale<MissionContent> = { fr, en, es, pt, ar };
