/** Contenus multilingues — pages institutionnelles (Tarifs, Équipe, Certifications, Presse, Partenaires, Centre d'aide). */
import type { PerLocale } from './types';

export type InstitutionalContent = {
  pricing: {
    title: string; subtitle: string; seoTitle: string; seoDesc: string;
    mostChosen: string; footnote: string;
    plans: { name: string; price: string; period: string; desc: string; features: string[]; cta: string }[];
  };
  team: {
    title: string; subtitle: string; seoTitle: string; seoDesc: string;
    founderTitle: string; founderBio: string;
    guideTitle: string;
    values: { title: string; desc: string }[];
    hiringTitle: string; hiringText: string; hiringCta: string;
  };
  certifications: {
    title: string; subtitle: string; seoTitle: string; seoDesc: string;
    bodiesLabel: string; footnote: string;
    processTitle: string; processSteps: string[]; processLink: string;
    certs: { name: string; body: string; covers: string }[];
  };
  press: {
    title: string; subtitle: string; seoTitle: string; seoDesc: string;
    briefTitle: string; briefItems: string[];
    contactTitle: string; contactText: string; contactEmail: string; contactNote: string; angle: string;
  };
  partners: {
    title: string; subtitle: string; seoTitle: string; seoDesc: string;
    types: { title: string; desc: string; ctaLabel?: string; ctaTo?: string }[];
  };
  help: {
    title: string; subtitle: string; seoTitle: string; seoDesc: string;
    notFound: string; contactSupport: string;
    faqs: { q: string; a: string }[];
  };
};

const fr: InstitutionalContent = {
  pricing: {
    title: 'Tarifs simples et transparents',
    subtitle: "La consultation, la recherche et la vérification des preuves sont gratuites pour tous. EthiMarket se rémunère uniquement par une commission sur les ventes conclues.",
    seoTitle: 'Tarifs & abonnements',
    seoDesc: 'EthiMarket est gratuit pour les acheteurs et les producteurs. Commission transparente uniquement à la vente. Offre Entreprise sur devis.',
    mostChosen: 'Le plus choisi',
    footnote: 'Aucun frais caché. Le détail des commissions producteur est communiqué lors de la validation du dossier vendeur.',
    plans: [
      { name: 'Acheteur', price: '0 €', period: 'pour toujours', desc: 'Pour les acheteurs professionnels et particuliers.', features: ['Recherche multicritères illimitée (17 facettes)', 'Trust Center : preuves et certifications vérifiées', "Comparateur + fiche justificative d'achat", "Espace « Mes achats » : fournisseurs, produits, analytics", 'Alertes certifications, risques et opportunités', 'Coffre-fort documentaire avec analyse automatique'], cta: 'Créer un compte gratuit' },
      { name: 'Producteur', price: '0 €', period: 'commission uniquement à la vente', desc: 'Pour les coopératives et producteurs. Aucun frais fixe.', features: ['Boutique en ligne et fiches produits illimitées', 'Vérification du profil (processus Bureau Veritas)', 'Dépôt de certificats → statut « Vérifié » public', 'Messagerie directe avec les acheteurs', 'Score EthiMarket et badge de confiance', 'Commission transparente prélevée uniquement sur les ventes conclues'], cta: 'Devenir vendeur' },
      { name: 'Entreprise', price: 'Sur devis', period: 'selon vos volumes', desc: 'Pour les directions achats avec besoins avancés.', features: ['Tout le plan Acheteur, plus :', 'Comptes multi-utilisateurs et rôles', "Règles de pondération au niveau entreprise", 'Export des fiches justificatives et rapports CSRD', 'Accompagnement sourcing dédié', 'Intégration à vos outils achats (sur demande)'], cta: 'Nous contacter' },
    ],
  },
  team: {
    title: "L'équipe EthiMarket",
    subtitle: "Une équipe franco-africaine qui construit l'infrastructure de confiance du commerce responsable.",
    seoTitle: 'Notre équipe',
    seoDesc: "L'équipe EthiMarket construit la marketplace de confiance des achats responsables : traçabilité, certifications vérifiées et commerce direct producteur.",
    founderTitle: 'Hubert Baya — Fondateur',
    founderBio: "Expert en environnement, Hubert a fondé EthiMarket après un constat simple : les producteurs bio et équitables des pays du Sud restent invisibles pour les acheteurs européens, et les acheteurs n'ont aucun moyen fiable de vérifier les promesses éthiques. EthiMarket répond aux deux problèmes à la fois : une vitrine mondiale pour les coopératives, et un système de preuves vérifiées pour les acheteurs.",
    guideTitle: 'Ce qui nous guide',
    values: [
      { title: 'La preuve avant la promesse', desc: "Nous ne publions jamais une allégation éthique sans indiquer si elle est vérifiée, en cours de vérification ou simplement déclarée." },
      { title: 'Le direct producteur', desc: 'Chaque intermédiaire retiré est de la valeur rendue au producteur. Nous connectons les acheteurs aux coopératives sans couche superflue.' },
      { title: 'La transparence des scores', desc: "Notre Responsibility Score est décomposé critère par critère, point par point. Tout est explicable, rien n'est une boîte noire." },
    ],
    hiringTitle: 'Nous recrutons',
    hiringText: 'Développement, qualité & certifications, relations producteurs Afrique/Amérique latine : si la mission vous parle, écrivez-nous.',
    hiringCta: 'Candidature spontanée',
  },
  certifications: {
    title: 'Les certifications que nous vérifions',
    subtitle: 'Chaque label affiché sur EthiMarket est contrôlé auprès de son organisme émetteur. Voici les principaux référentiels couverts.',
    seoTitle: 'Certifications',
    seoDesc: 'Bio UE, Fairtrade, GOTS, Rainforest Alliance, Demeter, SA8000 : les certifications vérifiées par EthiMarket auprès des organismes émetteurs.',
    bodiesLabel: 'Organismes certificateurs :',
    footnote: 'Plus de 25 organismes certificateurs sont référencés dans notre annuaire interne avec leurs canaux de vérification officiels.',
    processTitle: 'Notre processus de vérification',
    processSteps: [
      'Le producteur dépose son certificat (numéro, organisme, dates de validité).',
      "EthiMarket contacte l'organisme émetteur (registres publics, API, e-mail) pour confirmer l'authenticité.",
      "L'allégation passe de « 🕓 Vérification en cours » à « ✅ Certifié » — ou est rejetée.",
      "À l'expiration du certificat, le statut est rétrogradé automatiquement.",
    ],
    processLink: 'Lire la méthodologie complète du Trust Center',
    certs: [
      { name: 'Agriculture Biologique (Bio UE / AB)', body: 'Ecocert, Bureau Veritas, Control Union…', covers: 'Production sans intrants chimiques de synthèse, OGM interdits, contrôles annuels.' },
      { name: 'Fairtrade / Commerce Équitable', body: 'FLO-CERT (Fairtrade International), WFTO', covers: 'Prix minimum garanti au producteur, prime de développement, interdiction du travail des enfants.' },
      { name: 'GOTS (Global Organic Textile Standard)', body: 'Ecocert Greenlife, Control Union', covers: 'Textiles biologiques : fibres, teintures, conditions sociales de toute la chaîne.' },
      { name: 'Rainforest Alliance', body: 'Rainforest Alliance Cert.', covers: 'Agriculture durable, protection des forêts et des travailleurs agricoles.' },
      { name: 'Demeter (biodynamie)', body: 'Demeter International', covers: 'Agriculture biodynamique, cycles naturels, biodiversité renforcée.' },
      { name: 'SA8000 / BSCI (audits sociaux)', body: 'SAI, Amfori', covers: 'Conditions de travail, santé-sécurité, absence de travail forcé ou infantile.' },
    ],
  },
  press: {
    title: 'Espace presse',
    subtitle: 'Ressources et informations pour les journalistes et médias.',
    seoTitle: 'Presse',
    seoDesc: 'Espace presse EthiMarket : notre histoire, nos chiffres clés vérifiables et le contact médias.',
    briefTitle: 'EthiMarket en bref',
    briefItems: [
      'Marketplace B2B/B2C de produits biologiques et équitables en direct producteur.',
      'Particularité : chaque allégation éthique affiche publiquement son statut de preuve — vérifiée, en cours, ou simple déclaration fournisseur.',
      'Moteur de recherche en langage naturel à 17 critères responsables (origine, CO2, salaire décent, emballage…).',
      'Score de responsabilité décomposé en 6 critères, entièrement explicable.',
      'Plateforme lancée en 2026, en phase pilote avec 6 coopératives sur 4 continents.',
    ],
    contactTitle: 'Contact médias',
    contactText: "Pour toute demande d'interview, de visuel ou d'information :",
    contactEmail: 'presse@ethimarket.com',
    contactNote: 'Réponse sous 48 h ouvrées.',
    angle: "Angle éditorial suggéré : « Comment prouver qu'un produit est vraiment éthique ? » — notre Trust Center répond en publiant les certificats, leurs numéros, organismes et dates de validité, et en signalant honnêtement ce qui n'est pas encore vérifié.",
  },
  partners: {
    title: 'Nos partenaires',
    subtitle: "EthiMarket s'appuie sur un écosystème d'organismes de certification, de coopératives et de référentiels publics.",
    seoTitle: 'Partenaires',
    seoDesc: "Organismes certificateurs, coopératives productrices et référentiels de données : l'écosystème EthiMarket.",
    types: [
      { title: 'Organismes certificateurs', desc: 'Ecocert, FLO-CERT, Control Union, Rainforest Alliance… 25+ organismes référencés dans notre annuaire de vérification avec leurs canaux officiels.' },
      { title: 'Coopératives productrices', desc: "6 coopératives pilotes au Maroc, en Éthiopie, au Ghana, à Madagascar, au Pérou et en Iran. Nous élargissons le réseau en continu.", ctaLabel: 'Devenir producteur partenaire', ctaTo: '/devenir-vendeur' },
      { title: 'Référentiels de données', desc: "Nos estimations d'impact s'appuient sur les ordres de grandeur publics (FAO, Poore & Nemecek 2018, Base Empreinte ADEME) et sont toujours étiquetées comme estimations." },
      { title: "Réseaux d'acheteurs responsables", desc: "Vous animez un réseau d'acheteurs, une fédération ou un collectif RSE ? Construisons un accès pilote pour vos membres.", ctaLabel: 'Proposer un partenariat', ctaTo: '/contact' },
    ],
  },
  help: {
    title: "Centre d'aide",
    subtitle: 'Les réponses aux questions les plus fréquentes des acheteurs et des producteurs.',
    seoTitle: "Centre d'aide & FAQ",
    seoDesc: 'FAQ EthiMarket : vérification des certifications, Responsibility Score, commandes, comparateur, règles de décision personnalisées.',
    notFound: "Vous n'avez pas trouvé votre réponse ?",
    contactSupport: 'Contacter le support',
    faqs: [
      { q: 'Comment savoir si une certification est authentique ?', a: "Chaque allégation d'un produit affiche son statut sur la fiche : ✅ Certifié (confirmé auprès de l'organisme émetteur, avec numéro, dates et lien source), 🕓 Vérification en cours, ou ⚠️ Déclaration fournisseur quand aucune preuve indépendante n'existe. La méthodologie complète est publiée dans le Trust Center." },
      { q: 'Que signifie le Responsibility Score ?', a: "C'est la moyenne pondérée de 6 critères (Environnement, Social, Traçabilité, Certifications, Logistique, Fournisseur), chacun décomposé point par point sur la fiche produit. Rien n'est une boîte noire : cliquez sur un critère pour voir exactement d'où viennent les points." },
      { q: 'Comment commander ou demander un devis ?', a: "Depuis une fiche produit, utilisez « Commander » pour une demande directe ou « Contacter le producteur » pour discuter quantités, échantillons et délais. La messagerie intégrée conserve l'historique de vos échanges." },
      { q: 'Comment fonctionne le comparateur ?', a: "Cochez jusqu'à 5 produits dans le catalogue puis cliquez « Comparer » : vous obtenez une matrice Prix / Responsabilité / Traçabilité / Certifications / Risque, une recommandation motivée et une fiche justificative imprimable pour votre direction." },
      { q: 'Puis-je définir mes propres critères de décision ?', a: "Oui. Dans votre espace acheteur (« Mes règles »), pondérez Prix / Environnement / Social / Traçabilité / Certifications selon votre politique achats. La plateforme peut aussi apprendre de vos décisions et affiner ces règles — c'est désactivable à tout moment." },
      { q: 'Comment les producteurs sont-ils vérifiés ?', a: "Chaque producteur constitue un dossier (identité, documents d'exploitation, certificats) examiné selon un processus inspiré des standards Bureau Veritas. Les certificats déposés sont confirmés directement auprès des organismes émetteurs avant d'afficher « Vérifié »." },
      { q: 'Les estimations CO2 et eau sont-elles des mesures réelles ?', a: "Non, et nous l'affichons clairement : ce sont des estimations basées sur des référentiels publics (FAO, littérature scientifique, Base Empreinte ADEME) tant qu'une analyse de cycle de vie spécifique n'a pas été fournie. Chaque chiffre porte son étiquette de source." },
      { q: 'Que faire si je repère une information douteuse ?', a: "Signalez-la via la page Contact. Chaque signalement déclenche un contrôle documenté ; si l'allégation est contredite, elle passe publiquement en « ❌ Non confirmé »." },
    ],
  },
};

const en: InstitutionalContent = {
  pricing: {
    title: 'Simple, transparent pricing',
    subtitle: 'Browsing, searching and evidence verification are free for everyone. EthiMarket earns money only through a commission on completed sales.',
    seoTitle: 'Pricing & plans',
    seoDesc: 'EthiMarket is free for buyers and producers. Transparent commission only on sales. Enterprise offer on quote.',
    mostChosen: 'Most chosen',
    footnote: 'No hidden fees. Producer commission details are shared during seller onboarding validation.',
    plans: [
      { name: 'Buyer', price: '€0', period: 'forever', desc: 'For professional and individual buyers.', features: ['Unlimited multi-criteria search (17 facets)', 'Trust Center: verified evidence and certifications', 'Comparator + purchase justification sheet', '"My purchases" workspace: suppliers, products, analytics', 'Certification, risk and opportunity alerts', 'Document vault with automatic analysis'], cta: 'Create a free account' },
      { name: 'Producer', price: '€0', period: 'commission only on sales', desc: 'For cooperatives and producers. No fixed fees.', features: ['Unlimited online shop and product pages', 'Profile verification (Bureau Veritas-inspired process)', 'Certificate filing → public "Verified" status', 'Direct messaging with buyers', 'EthiMarket Score and trust badge', 'Transparent commission charged only on completed sales'], cta: 'Become a seller' },
      { name: 'Enterprise', price: 'On quote', period: 'based on your volumes', desc: 'For procurement teams with advanced needs.', features: ['Everything in the Buyer plan, plus:', 'Multi-user accounts and roles', 'Company-level weighting rules', 'Justification sheet exports and CSRD reports', 'Dedicated sourcing support', 'Integration with your procurement tools (on request)'], cta: 'Contact us' },
    ],
  },
  team: {
    title: 'The EthiMarket team',
    subtitle: 'A Franco-African team building the trust infrastructure of responsible trade.',
    seoTitle: 'Our team',
    seoDesc: 'The EthiMarket team builds the trusted marketplace for responsible sourcing: traceability, verified certifications and direct producer trade.',
    founderTitle: 'Hubert Baya — Founder',
    founderBio: 'An environmental expert, Hubert founded EthiMarket after a simple observation: organic and fair trade producers of the Global South remain invisible to European buyers, and buyers have no reliable way to verify ethical promises. EthiMarket solves both problems at once: a global showcase for cooperatives, and a verified evidence system for buyers.',
    guideTitle: 'What guides us',
    values: [
      { title: 'Proof before promise', desc: 'We never publish an ethical claim without stating whether it is verified, being verified, or merely declared.' },
      { title: 'Direct from producer', desc: 'Every middleman removed is value returned to the producer. We connect buyers to cooperatives without superfluous layers.' },
      { title: 'Score transparency', desc: 'Our Responsibility Score is broken down criterion by criterion, point by point. Everything is explainable, nothing is a black box.' },
    ],
    hiringTitle: 'We are hiring',
    hiringText: 'Development, quality & certifications, producer relations Africa/Latin America: if the mission speaks to you, write to us.',
    hiringCta: 'Spontaneous application',
  },
  certifications: {
    title: 'The certifications we verify',
    subtitle: 'Every label displayed on EthiMarket is checked with its issuing body. Here are the main standards covered.',
    seoTitle: 'Certifications',
    seoDesc: 'EU Organic, Fairtrade, GOTS, Rainforest Alliance, Demeter, SA8000: the certifications EthiMarket verifies with the issuing bodies.',
    bodiesLabel: 'Certification bodies:',
    footnote: 'More than 25 certification bodies are referenced in our internal directory with their official verification channels.',
    processTitle: 'Our verification process',
    processSteps: [
      'The producer files their certificate (number, body, validity dates).',
      'EthiMarket contacts the issuing body (public registers, API, email) to confirm authenticity.',
      'The claim moves from "🕓 Verification in progress" to "✅ Certified" — or is rejected.',
      'When the certificate expires, the status is automatically downgraded.',
    ],
    processLink: 'Read the full Trust Center methodology',
    certs: [
      { name: 'Organic Farming (EU Organic / AB)', body: 'Ecocert, Bureau Veritas, Control Union…', covers: 'Production without synthetic chemical inputs, GMOs prohibited, annual controls.' },
      { name: 'Fairtrade / Fair Trade', body: 'FLO-CERT (Fairtrade International), WFTO', covers: 'Guaranteed minimum price for the producer, development premium, prohibition of child labor.' },
      { name: 'GOTS (Global Organic Textile Standard)', body: 'Ecocert Greenlife, Control Union', covers: 'Organic textiles: fibers, dyes, social conditions across the whole chain.' },
      { name: 'Rainforest Alliance', body: 'Rainforest Alliance Cert.', covers: 'Sustainable agriculture, protection of forests and farm workers.' },
      { name: 'Demeter (biodynamics)', body: 'Demeter International', covers: 'Biodynamic agriculture, natural cycles, enhanced biodiversity.' },
      { name: 'SA8000 / BSCI (social audits)', body: 'SAI, Amfori', covers: 'Working conditions, health & safety, absence of forced or child labor.' },
    ],
  },
  press: {
    title: 'Press room',
    subtitle: 'Resources and information for journalists and media.',
    seoTitle: 'Press',
    seoDesc: 'EthiMarket press room: our story, our verifiable key figures and the media contact.',
    briefTitle: 'EthiMarket in brief',
    briefItems: [
      'B2B/B2C marketplace of organic and fair trade products direct from producers.',
      'Distinctive feature: every ethical claim publicly displays its evidence status — verified, in progress, or mere supplier declaration.',
      'Natural language search engine with 17 responsible criteria (origin, CO2, living wage, packaging…).',
      'Responsibility score broken down into 6 fully explainable criteria.',
      'Platform launched in 2026, in pilot phase with 6 cooperatives on 4 continents.',
    ],
    contactTitle: 'Media contact',
    contactText: 'For any interview, visual or information request:',
    contactEmail: 'presse@ethimarket.com',
    contactNote: 'Response within 48 business hours.',
    angle: 'Suggested editorial angle: "How do you prove a product is truly ethical?" — our Trust Center answers by publishing certificates, their numbers, bodies and validity dates, and by honestly flagging what is not yet verified.',
  },
  partners: {
    title: 'Our partners',
    subtitle: 'EthiMarket relies on an ecosystem of certification bodies, cooperatives and public data references.',
    seoTitle: 'Partners',
    seoDesc: 'Certification bodies, producer cooperatives and data references: the EthiMarket ecosystem.',
    types: [
      { title: 'Certification bodies', desc: 'Ecocert, FLO-CERT, Control Union, Rainforest Alliance… 25+ bodies referenced in our verification directory with their official channels.' },
      { title: 'Producer cooperatives', desc: '6 pilot cooperatives in Morocco, Ethiopia, Ghana, Madagascar, Peru and Iran. We are continuously expanding the network.', ctaLabel: 'Become a partner producer', ctaTo: '/devenir-vendeur' },
      { title: 'Data references', desc: 'Our impact estimates rely on public orders of magnitude (FAO, Poore & Nemecek 2018, ADEME Base Empreinte) and are always labeled as estimates.' },
      { title: 'Responsible buyer networks', desc: 'Do you run a buyer network, a federation or a CSR collective? Let\'s build pilot access for your members.', ctaLabel: 'Propose a partnership', ctaTo: '/contact' },
    ],
  },
  help: {
    title: 'Help center',
    subtitle: 'Answers to the most frequent questions from buyers and producers.',
    seoTitle: 'Help center & FAQ',
    seoDesc: 'EthiMarket FAQ: certification verification, Responsibility Score, orders, comparator, custom decision rules.',
    notFound: 'Didn\'t find your answer?',
    contactSupport: 'Contact support',
    faqs: [
      { q: 'How do I know if a certification is authentic?', a: 'Each product claim displays its status on the page: ✅ Certified (confirmed with the issuing body, with number, dates and source link), 🕓 Verification in progress, or ⚠️ Supplier declaration when no independent evidence exists. The full methodology is published in the Trust Center.' },
      { q: 'What does the Responsibility Score mean?', a: 'It is the weighted average of 6 criteria (Environment, Social, Traceability, Certifications, Logistics, Supplier), each broken down point by point on the product page. Nothing is a black box: click a criterion to see exactly where the points come from.' },
      { q: 'How do I order or request a quote?', a: 'From a product page, use "Order" for a direct request or "Contact the producer" to discuss quantities, samples and lead times. The built-in messaging keeps the history of your exchanges.' },
      { q: 'How does the comparator work?', a: 'Check up to 5 products in the catalog then click "Compare": you get a Price / Responsibility / Traceability / Certifications / Risk matrix, a motivated recommendation and a printable justification sheet for your management.' },
      { q: 'Can I define my own decision criteria?', a: 'Yes. In your buyer workspace ("My rules"), weight Price / Environment / Social / Traceability / Certifications according to your procurement policy. The platform can also learn from your decisions and refine these rules — this can be disabled at any time.' },
      { q: 'How are producers verified?', a: 'Each producer builds a file (identity, farm documents, certificates) reviewed through a process inspired by Bureau Veritas standards. Filed certificates are confirmed directly with the issuing bodies before displaying "Verified".' },
      { q: 'Are the CO2 and water estimates real measurements?', a: 'No, and we display it clearly: they are estimates based on public references (FAO, scientific literature, ADEME Base Empreinte) until a specific life-cycle analysis is provided. Every figure carries its source label.' },
      { q: 'What if I spot dubious information?', a: 'Report it through the Contact page. Every report triggers a documented review; if the claim is contradicted, it publicly becomes "❌ Not confirmed".' },
    ],
  },
};

const es: InstitutionalContent = {
  pricing: {
    title: 'Tarifas simples y transparentes',
    subtitle: 'La consulta, la búsqueda y la verificación de pruebas son gratuitas para todos. EthiMarket se remunera únicamente con una comisión sobre las ventas concluidas.',
    seoTitle: 'Tarifas y planes',
    seoDesc: 'EthiMarket es gratuito para compradores y productores. Comisión transparente solo en la venta. Oferta Empresa bajo presupuesto.',
    mostChosen: 'El más elegido',
    footnote: 'Sin costos ocultos. El detalle de las comisiones del productor se comunica durante la validación del expediente de vendedor.',
    plans: [
      { name: 'Comprador', price: '0 €', period: 'para siempre', desc: 'Para compradores profesionales y particulares.', features: ['Búsqueda multicriterio ilimitada (17 facetas)', 'Trust Center: pruebas y certificaciones verificadas', 'Comparador + ficha justificativa de compra', 'Espacio «Mis compras»: proveedores, productos, analytics', 'Alertas de certificaciones, riesgos y oportunidades', 'Caja fuerte documental con análisis automático'], cta: 'Crear una cuenta gratuita' },
      { name: 'Productor', price: '0 €', period: 'comisión solo en la venta', desc: 'Para cooperativas y productores. Sin costos fijos.', features: ['Tienda en línea y fichas de producto ilimitadas', 'Verificación del perfil (proceso Bureau Veritas)', 'Depósito de certificados → estado «Verificado» público', 'Mensajería directa con los compradores', 'Score EthiMarket e insignia de confianza', 'Comisión transparente cobrada solo sobre las ventas concluidas'], cta: 'Convertirse en vendedor' },
      { name: 'Empresa', price: 'Bajo presupuesto', period: 'según sus volúmenes', desc: 'Para direcciones de compras con necesidades avanzadas.', features: ['Todo el plan Comprador, más:', 'Cuentas multiusuario y roles', 'Reglas de ponderación a nivel empresa', 'Exportación de fichas justificativas e informes CSRD', 'Acompañamiento de sourcing dedicado', 'Integración con sus herramientas de compras (bajo pedido)'], cta: 'Contáctenos' },
    ],
  },
  team: {
    title: 'El equipo EthiMarket',
    subtitle: 'Un equipo franco-africano que construye la infraestructura de confianza del comercio responsable.',
    seoTitle: 'Nuestro equipo',
    seoDesc: 'El equipo EthiMarket construye el marketplace de confianza de las compras responsables: trazabilidad, certificaciones verificadas y comercio directo con el productor.',
    founderTitle: 'Hubert Baya — Fundador',
    founderBio: 'Experto en medio ambiente, Hubert fundó EthiMarket tras una constatación simple: los productores orgánicos y de comercio justo de los países del Sur permanecen invisibles para los compradores europeos, y los compradores no tienen ningún medio fiable de verificar las promesas éticas. EthiMarket responde a ambos problemas a la vez: una vitrina mundial para las cooperativas y un sistema de pruebas verificadas para los compradores.',
    guideTitle: 'Lo que nos guía',
    values: [
      { title: 'La prueba antes que la promesa', desc: 'Nunca publicamos una alegación ética sin indicar si está verificada, en curso de verificación o simplemente declarada.' },
      { title: 'El directo del productor', desc: 'Cada intermediario eliminado es valor devuelto al productor. Conectamos a los compradores con las cooperativas sin capas superfluas.' },
      { title: 'La transparencia de los puntajes', desc: 'Nuestro Responsibility Score está descompuesto criterio por criterio, punto por punto. Todo es explicable, nada es una caja negra.' },
    ],
    hiringTitle: 'Estamos contratando',
    hiringText: 'Desarrollo, calidad y certificaciones, relaciones con productores África/América Latina: si la misión le habla, escríbanos.',
    hiringCta: 'Candidatura espontánea',
  },
  certifications: {
    title: 'Las certificaciones que verificamos',
    subtitle: 'Cada sello mostrado en EthiMarket se controla con su organismo emisor. Estos son los principales referenciales cubiertos.',
    seoTitle: 'Certificaciones',
    seoDesc: 'Bio UE, Fairtrade, GOTS, Rainforest Alliance, Demeter, SA8000: las certificaciones verificadas por EthiMarket con los organismos emisores.',
    bodiesLabel: 'Organismos certificadores:',
    footnote: 'Más de 25 organismos certificadores están referenciados en nuestro directorio interno con sus canales de verificación oficiales.',
    processTitle: 'Nuestro proceso de verificación',
    processSteps: [
      'El productor deposita su certificado (número, organismo, fechas de validez).',
      'EthiMarket contacta al organismo emisor (registros públicos, API, correo) para confirmar la autenticidad.',
      'La alegación pasa de «🕓 Verificación en curso» a «✅ Certificado» — o es rechazada.',
      'Al vencer el certificado, el estado se degrada automáticamente.',
    ],
    processLink: 'Leer la metodología completa del Trust Center',
    certs: [
      { name: 'Agricultura Ecológica (Bio UE / AB)', body: 'Ecocert, Bureau Veritas, Control Union…', covers: 'Producción sin insumos químicos de síntesis, OGM prohibidos, controles anuales.' },
      { name: 'Fairtrade / Comercio Justo', body: 'FLO-CERT (Fairtrade International), WFTO', covers: 'Precio mínimo garantizado al productor, prima de desarrollo, prohibición del trabajo infantil.' },
      { name: 'GOTS (Global Organic Textile Standard)', body: 'Ecocert Greenlife, Control Union', covers: 'Textiles orgánicos: fibras, tintes, condiciones sociales de toda la cadena.' },
      { name: 'Rainforest Alliance', body: 'Rainforest Alliance Cert.', covers: 'Agricultura sostenible, protección de los bosques y de los trabajadores agrícolas.' },
      { name: 'Demeter (biodinámica)', body: 'Demeter International', covers: 'Agricultura biodinámica, ciclos naturales, biodiversidad reforzada.' },
      { name: 'SA8000 / BSCI (auditorías sociales)', body: 'SAI, Amfori', covers: 'Condiciones de trabajo, salud y seguridad, ausencia de trabajo forzado o infantil.' },
    ],
  },
  press: {
    title: 'Sala de prensa',
    subtitle: 'Recursos e información para periodistas y medios.',
    seoTitle: 'Prensa',
    seoDesc: 'Sala de prensa EthiMarket: nuestra historia, nuestras cifras clave verificables y el contacto de medios.',
    briefTitle: 'EthiMarket en breve',
    briefItems: [
      'Marketplace B2B/B2C de productos orgánicos y de comercio justo directo del productor.',
      'Particularidad: cada alegación ética muestra públicamente su estado de prueba — verificada, en curso, o simple declaración del proveedor.',
      'Motor de búsqueda en lenguaje natural con 17 criterios responsables (origen, CO2, salario digno, embalaje…).',
      'Puntaje de responsabilidad descompuesto en 6 criterios, totalmente explicable.',
      'Plataforma lanzada en 2026, en fase piloto con 6 cooperativas en 4 continentes.',
    ],
    contactTitle: 'Contacto de medios',
    contactText: 'Para cualquier solicitud de entrevista, visual o información:',
    contactEmail: 'presse@ethimarket.com',
    contactNote: 'Respuesta en 48 h laborables.',
    angle: 'Ángulo editorial sugerido: «¿Cómo probar que un producto es realmente ético?» — nuestro Trust Center responde publicando los certificados, sus números, organismos y fechas de validez, y señalando honestamente lo que aún no está verificado.',
  },
  partners: {
    title: 'Nuestros socios',
    subtitle: 'EthiMarket se apoya en un ecosistema de organismos de certificación, cooperativas y referenciales públicos.',
    seoTitle: 'Socios',
    seoDesc: 'Organismos certificadores, cooperativas productoras y referenciales de datos: el ecosistema EthiMarket.',
    types: [
      { title: 'Organismos certificadores', desc: 'Ecocert, FLO-CERT, Control Union, Rainforest Alliance… Más de 25 organismos referenciados en nuestro directorio de verificación con sus canales oficiales.' },
      { title: 'Cooperativas productoras', desc: '6 cooperativas piloto en Marruecos, Etiopía, Ghana, Madagascar, Perú e Irán. Ampliamos la red continuamente.', ctaLabel: 'Convertirse en productor socio', ctaTo: '/devenir-vendeur' },
      { title: 'Referenciales de datos', desc: 'Nuestras estimaciones de impacto se apoyan en órdenes de magnitud públicos (FAO, Poore & Nemecek 2018, Base Empreinte ADEME) y siempre están etiquetadas como estimaciones.' },
      { title: 'Redes de compradores responsables', desc: '¿Anima una red de compradores, una federación o un colectivo RSE? Construyamos un acceso piloto para sus miembros.', ctaLabel: 'Proponer una asociación', ctaTo: '/contact' },
    ],
  },
  help: {
    title: 'Centro de ayuda',
    subtitle: 'Las respuestas a las preguntas más frecuentes de compradores y productores.',
    seoTitle: 'Centro de ayuda y FAQ',
    seoDesc: 'FAQ EthiMarket: verificación de certificaciones, Responsibility Score, pedidos, comparador, reglas de decisión personalizadas.',
    notFound: '¿No encontró su respuesta?',
    contactSupport: 'Contactar al soporte',
    faqs: [
      { q: '¿Cómo saber si una certificación es auténtica?', a: 'Cada alegación de un producto muestra su estado en la ficha: ✅ Certificado (confirmado con el organismo emisor, con número, fechas y enlace fuente), 🕓 Verificación en curso, o ⚠️ Declaración del proveedor cuando no existe prueba independiente. La metodología completa está publicada en el Trust Center.' },
      { q: '¿Qué significa el Responsibility Score?', a: 'Es la media ponderada de 6 criterios (Medio ambiente, Social, Trazabilidad, Certificaciones, Logística, Proveedor), cada uno descompuesto punto por punto en la ficha del producto. Nada es una caja negra: haga clic en un criterio para ver exactamente de dónde vienen los puntos.' },
      { q: '¿Cómo pedir o solicitar un presupuesto?', a: 'Desde una ficha de producto, use «Pedir» para una solicitud directa o «Contactar al productor» para discutir cantidades, muestras y plazos. La mensajería integrada conserva el historial de sus intercambios.' },
      { q: '¿Cómo funciona el comparador?', a: 'Marque hasta 5 productos en el catálogo y haga clic en «Comparar»: obtiene una matriz Precio / Responsabilidad / Trazabilidad / Certificaciones / Riesgo, una recomendación motivada y una ficha justificativa imprimible para su dirección.' },
      { q: '¿Puedo definir mis propios criterios de decisión?', a: 'Sí. En su espacio de comprador («Mis reglas»), pondere Precio / Medio ambiente / Social / Trazabilidad / Certificaciones según su política de compras. La plataforma también puede aprender de sus decisiones y afinar estas reglas — se puede desactivar en cualquier momento.' },
      { q: '¿Cómo se verifican los productores?', a: 'Cada productor constituye un expediente (identidad, documentos de explotación, certificados) examinado según un proceso inspirado en los estándares Bureau Veritas. Los certificados depositados se confirman directamente con los organismos emisores antes de mostrar «Verificado».' },
      { q: '¿Las estimaciones de CO2 y agua son mediciones reales?', a: 'No, y lo mostramos claramente: son estimaciones basadas en referenciales públicos (FAO, literatura científica, Base Empreinte ADEME) mientras no se haya proporcionado un análisis de ciclo de vida específico. Cada cifra lleva su etiqueta de fuente.' },
      { q: '¿Qué hacer si detecto información dudosa?', a: 'Repórtela a través de la página Contacto. Cada reporte desencadena un control documentado; si la alegación es contradicha, pasa públicamente a «❌ No confirmado».' },
    ],
  },
};

const pt: InstitutionalContent = {
  pricing: {
    title: 'Preços simples e transparentes',
    subtitle: 'A consulta, a pesquisa e a verificação de provas são gratuitas para todos. A EthiMarket se remunera apenas com uma comissão sobre as vendas concluídas.',
    seoTitle: 'Preços e planos',
    seoDesc: 'A EthiMarket é gratuita para compradores e produtores. Comissão transparente apenas na venda. Oferta Empresa sob orçamento.',
    mostChosen: 'O mais escolhido',
    footnote: 'Sem taxas ocultas. O detalhe das comissões do produtor é comunicado durante a validação do dossiê de vendedor.',
    plans: [
      { name: 'Comprador', price: '0 €', period: 'para sempre', desc: 'Para compradores profissionais e particulares.', features: ['Pesquisa multicritério ilimitada (17 facetas)', 'Trust Center: provas e certificações verificadas', 'Comparador + ficha justificativa de compra', 'Espaço «Minhas compras»: fornecedores, produtos, analytics', 'Alertas de certificações, riscos e oportunidades', 'Cofre documental com análise automática'], cta: 'Criar uma conta gratuita' },
      { name: 'Produtor', price: '0 €', period: 'comissão apenas na venda', desc: 'Para cooperativas e produtores. Sem custos fixos.', features: ['Loja online e fichas de produto ilimitadas', 'Verificação do perfil (processo Bureau Veritas)', 'Depósito de certificados → status «Verificado» público', 'Mensageria direta com os compradores', 'Score EthiMarket e selo de confiança', 'Comissão transparente cobrada apenas sobre as vendas concluídas'], cta: 'Tornar-se vendedor' },
      { name: 'Empresa', price: 'Sob orçamento', period: 'conforme seus volumes', desc: 'Para direções de compras com necessidades avançadas.', features: ['Todo o plano Comprador, mais:', 'Contas multiusuário e papéis', 'Regras de ponderação em nível de empresa', 'Exportação de fichas justificativas e relatórios CSRD', 'Acompanhamento de sourcing dedicado', 'Integração com suas ferramentas de compras (sob demanda)'], cta: 'Fale conosco' },
    ],
  },
  team: {
    title: 'A equipe EthiMarket',
    subtitle: 'Uma equipe franco-africana que constrói a infraestrutura de confiança do comércio responsável.',
    seoTitle: 'Nossa equipe',
    seoDesc: 'A equipe EthiMarket constrói o marketplace de confiança das compras responsáveis: rastreabilidade, certificações verificadas e comércio direto com o produtor.',
    founderTitle: 'Hubert Baya — Fundador',
    founderBio: 'Especialista em meio ambiente, Hubert fundou a EthiMarket após uma constatação simples: os produtores orgânicos e de comércio justo dos países do Sul permanecem invisíveis para os compradores europeus, e os compradores não têm nenhum meio confiável de verificar as promessas éticas. A EthiMarket responde aos dois problemas ao mesmo tempo: uma vitrine mundial para as cooperativas e um sistema de provas verificadas para os compradores.',
    guideTitle: 'O que nos guia',
    values: [
      { title: 'A prova antes da promessa', desc: 'Nunca publicamos uma alegação ética sem indicar se está verificada, em verificação ou simplesmente declarada.' },
      { title: 'O direto do produtor', desc: 'Cada intermediário removido é valor devolvido ao produtor. Conectamos os compradores às cooperativas sem camadas supérfluas.' },
      { title: 'A transparência das pontuações', desc: 'Nosso Responsibility Score é decomposto critério por critério, ponto por ponto. Tudo é explicável, nada é uma caixa preta.' },
    ],
    hiringTitle: 'Estamos contratando',
    hiringText: 'Desenvolvimento, qualidade e certificações, relações com produtores África/América Latina: se a missão fala com você, escreva-nos.',
    hiringCta: 'Candidatura espontânea',
  },
  certifications: {
    title: 'As certificações que verificamos',
    subtitle: 'Cada selo exibido na EthiMarket é controlado junto ao seu organismo emissor. Aqui estão os principais referenciais cobertos.',
    seoTitle: 'Certificações',
    seoDesc: 'Bio UE, Fairtrade, GOTS, Rainforest Alliance, Demeter, SA8000: as certificações verificadas pela EthiMarket junto aos organismos emissores.',
    bodiesLabel: 'Organismos certificadores:',
    footnote: 'Mais de 25 organismos certificadores estão referenciados em nosso diretório interno com seus canais de verificação oficiais.',
    processTitle: 'Nosso processo de verificação',
    processSteps: [
      'O produtor deposita seu certificado (número, organismo, datas de validade).',
      'A EthiMarket contata o organismo emissor (registros públicos, API, e-mail) para confirmar a autenticidade.',
      'A alegação passa de «🕓 Verificação em andamento» a «✅ Certificado» — ou é rejeitada.',
      'Quando o certificado expira, o status é rebaixado automaticamente.',
    ],
    processLink: 'Ler a metodologia completa do Trust Center',
    certs: [
      { name: 'Agricultura Biológica (Bio UE / AB)', body: 'Ecocert, Bureau Veritas, Control Union…', covers: 'Produção sem insumos químicos sintéticos, OGM proibidos, controles anuais.' },
      { name: 'Fairtrade / Comércio Justo', body: 'FLO-CERT (Fairtrade International), WFTO', covers: 'Preço mínimo garantido ao produtor, prêmio de desenvolvimento, proibição do trabalho infantil.' },
      { name: 'GOTS (Global Organic Textile Standard)', body: 'Ecocert Greenlife, Control Union', covers: 'Têxteis orgânicos: fibras, tinturas, condições sociais de toda a cadeia.' },
      { name: 'Rainforest Alliance', body: 'Rainforest Alliance Cert.', covers: 'Agricultura sustentável, proteção das florestas e dos trabalhadores agrícolas.' },
      { name: 'Demeter (biodinâmica)', body: 'Demeter International', covers: 'Agricultura biodinâmica, ciclos naturais, biodiversidade reforçada.' },
      { name: 'SA8000 / BSCI (auditorias sociais)', body: 'SAI, Amfori', covers: 'Condições de trabalho, saúde e segurança, ausência de trabalho forçado ou infantil.' },
    ],
  },
  press: {
    title: 'Sala de imprensa',
    subtitle: 'Recursos e informações para jornalistas e mídia.',
    seoTitle: 'Imprensa',
    seoDesc: 'Sala de imprensa EthiMarket: nossa história, nossos números-chave verificáveis e o contato de mídia.',
    briefTitle: 'EthiMarket em resumo',
    briefItems: [
      'Marketplace B2B/B2C de produtos orgânicos e de comércio justo direto do produtor.',
      'Particularidade: cada alegação ética exibe publicamente seu status de prova — verificada, em andamento, ou simples declaração do fornecedor.',
      'Motor de busca em linguagem natural com 17 critérios responsáveis (origem, CO2, salário digno, embalagem…).',
      'Pontuação de responsabilidade decomposta em 6 critérios, totalmente explicável.',
      'Plataforma lançada em 2026, em fase piloto com 6 cooperativas em 4 continentes.',
    ],
    contactTitle: 'Contato de mídia',
    contactText: 'Para qualquer pedido de entrevista, imagem ou informação:',
    contactEmail: 'presse@ethimarket.com',
    contactNote: 'Resposta em 48 h úteis.',
    angle: 'Ângulo editorial sugerido: «Como provar que um produto é realmente ético?» — nosso Trust Center responde publicando os certificados, seus números, organismos e datas de validade, e sinalizando honestamente o que ainda não está verificado.',
  },
  partners: {
    title: 'Nossos parceiros',
    subtitle: 'A EthiMarket se apoia em um ecossistema de organismos de certificação, cooperativas e referenciais públicos.',
    seoTitle: 'Parceiros',
    seoDesc: 'Organismos certificadores, cooperativas produtoras e referenciais de dados: o ecossistema EthiMarket.',
    types: [
      { title: 'Organismos certificadores', desc: 'Ecocert, FLO-CERT, Control Union, Rainforest Alliance… Mais de 25 organismos referenciados em nosso diretório de verificação com seus canais oficiais.' },
      { title: 'Cooperativas produtoras', desc: '6 cooperativas piloto no Marrocos, Etiópia, Gana, Madagascar, Peru e Irã. Ampliamos a rede continuamente.', ctaLabel: 'Tornar-se produtor parceiro', ctaTo: '/devenir-vendeur' },
      { title: 'Referenciais de dados', desc: 'Nossas estimativas de impacto se apoiam em ordens de grandeza públicas (FAO, Poore & Nemecek 2018, Base Empreinte ADEME) e são sempre rotuladas como estimativas.' },
      { title: 'Redes de compradores responsáveis', desc: 'Você anima uma rede de compradores, uma federação ou um coletivo RSE? Construamos um acesso piloto para seus membros.', ctaLabel: 'Propor uma parceria', ctaTo: '/contact' },
    ],
  },
  help: {
    title: 'Central de ajuda',
    subtitle: 'As respostas às perguntas mais frequentes de compradores e produtores.',
    seoTitle: 'Central de ajuda e FAQ',
    seoDesc: 'FAQ EthiMarket: verificação de certificações, Responsibility Score, pedidos, comparador, regras de decisão personalizadas.',
    notFound: 'Não encontrou sua resposta?',
    contactSupport: 'Contatar o suporte',
    faqs: [
      { q: 'Como saber se uma certificação é autêntica?', a: 'Cada alegação de um produto exibe seu status na ficha: ✅ Certificado (confirmado junto ao organismo emissor, com número, datas e link fonte), 🕓 Verificação em andamento, ou ⚠️ Declaração do fornecedor quando não existe prova independente. A metodologia completa está publicada no Trust Center.' },
      { q: 'O que significa o Responsibility Score?', a: 'É a média ponderada de 6 critérios (Meio ambiente, Social, Rastreabilidade, Certificações, Logística, Fornecedor), cada um decomposto ponto por ponto na ficha do produto. Nada é uma caixa preta: clique em um critério para ver exatamente de onde vêm os pontos.' },
      { q: 'Como pedir ou solicitar um orçamento?', a: 'A partir de uma ficha de produto, use «Pedir» para uma solicitação direta ou «Contatar o produtor» para discutir quantidades, amostras e prazos. A mensageria integrada mantém o histórico de suas trocas.' },
      { q: 'Como funciona o comparador?', a: 'Marque até 5 produtos no catálogo e clique em «Comparar»: você obtém uma matriz Preço / Responsabilidade / Rastreabilidade / Certificações / Risco, uma recomendação motivada e uma ficha justificativa imprimível para sua diretoria.' },
      { q: 'Posso definir meus próprios critérios de decisão?', a: 'Sim. No seu espaço de comprador («Minhas regras»), pondere Preço / Meio ambiente / Social / Rastreabilidade / Certificações conforme sua política de compras. A plataforma também pode aprender com suas decisões e refinar essas regras — é desativável a qualquer momento.' },
      { q: 'Como os produtores são verificados?', a: 'Cada produtor constitui um dossiê (identidade, documentos da propriedade, certificados) examinado segundo um processo inspirado nos padrões Bureau Veritas. Os certificados depositados são confirmados diretamente junto aos organismos emissores antes de exibir «Verificado».' },
      { q: 'As estimativas de CO2 e água são medições reais?', a: 'Não, e exibimos isso claramente: são estimativas baseadas em referenciais públicos (FAO, literatura científica, Base Empreinte ADEME) enquanto uma análise de ciclo de vida específica não for fornecida. Cada número carrega sua etiqueta de fonte.' },
      { q: 'O que fazer se eu identificar uma informação duvidosa?', a: 'Denuncie pela página Contato. Cada denúncia aciona um controle documentado; se a alegação for contradita, ela passa publicamente a «❌ Não confirmado».' },
    ],
  },
};

const ar: InstitutionalContent = {
  pricing: {
    title: 'أسعار بسيطة وشفافة',
    subtitle: 'التصفح والبحث والتحقق من الأدلة مجانية للجميع. تتقاضى EthiMarket عمولة على المبيعات المنجزة فقط.',
    seoTitle: 'الأسعار والاشتراكات',
    seoDesc: 'EthiMarket مجانية للمشترين والمنتجين. عمولة شفافة عند البيع فقط. عرض الشركات حسب الطلب.',
    mostChosen: 'الأكثر اختياراً',
    footnote: 'لا رسوم خفية. تفاصيل عمولات المنتجين تُبلغ عند التحقق من ملف البائع.',
    plans: [
      { name: 'مشترٍ', price: '0 €', period: 'للأبد', desc: 'للمشترين المحترفين والأفراد.', features: ['بحث متعدد المعايير غير محدود (17 معياراً)', 'مركز الثقة: أدلة وشهادات موثّقة', 'المقارن + ورقة تبرير الشراء', 'مساحة «مشترياتي»: موردون، منتجات، تحليلات', 'تنبيهات الشهادات والمخاطر والفرص', 'خزنة وثائق مع تحليل تلقائي'], cta: 'إنشاء حساب مجاني' },
      { name: 'منتج', price: '0 €', period: 'عمولة عند البيع فقط', desc: 'للتعاونيات والمنتجين. لا رسوم ثابتة.', features: ['متجر إلكتروني وصفحات منتجات غير محدودة', 'التحقق من الملف (عملية Bureau Veritas)', 'إيداع الشهادات ← حالة «موثّق» علنية', 'مراسلة مباشرة مع المشترين', 'نقاط EthiMarket وشارة الثقة', 'عمولة شفافة تُقتطع فقط من المبيعات المنجزة'], cta: 'كن بائعاً' },
      { name: 'شركة', price: 'حسب الطلب', period: 'حسب أحجامكم', desc: 'لإدارات المشتريات ذات الاحتياجات المتقدمة.', features: ['كل خطة المشتري، بالإضافة إلى:', 'حسابات متعددة المستخدمين وأدوار', 'قواعد ترجيح على مستوى الشركة', 'تصدير أوراق التبرير وتقارير CSRD', 'مرافقة توريد مخصصة', 'تكامل مع أدوات مشترياتكم (عند الطلب)'], cta: 'اتصل بنا' },
    ],
  },
  team: {
    title: 'فريق EthiMarket',
    subtitle: 'فريق فرنسي-إفريقي يبني بنية الثقة التحتية للتجارة المسؤولة.',
    seoTitle: 'فريقنا',
    seoDesc: 'فريق EthiMarket يبني سوق الثقة للمشتريات المسؤولة: تتبع، شهادات موثّقة وتجارة مباشرة مع المنتج.',
    founderTitle: 'هوبير بايا — المؤسس',
    founderBio: 'خبير في البيئة، أسس هوبير EthiMarket بعد ملاحظة بسيطة: المنتجون العضويون والعادلون في بلدان الجنوب يبقون غير مرئيين للمشترين الأوروبيين، والمشترون لا يملكون وسيلة موثوقة للتحقق من الوعود الأخلاقية. تجيب EthiMarket على المشكلتين معاً: واجهة عالمية للتعاونيات، ونظام أدلة موثّقة للمشترين.',
    guideTitle: 'ما يوجهنا',
    values: [
      { title: 'الدليل قبل الوعد', desc: 'لا ننشر أبداً ادعاءً أخلاقياً دون بيان ما إذا كان موثّقاً أو قيد التحقق أو مجرد إعلان.' },
      { title: 'مباشرة من المنتج', desc: 'كل وسيط يُزال هو قيمة تعود للمنتج. نربط المشترين بالتعاونيات دون طبقات زائدة.' },
      { title: 'شفافية النقاط', desc: 'نقاط المسؤولية لدينا مفصلة معياراً بمعيار، نقطة بنقطة. كل شيء قابل للتفسير، لا شيء صندوق أسود.' },
    ],
    hiringTitle: 'نحن نوظف',
    hiringText: 'التطوير، الجودة والشهادات، علاقات المنتجين إفريقيا/أمريكا اللاتينية: إذا كانت المهمة تخاطبك، راسلنا.',
    hiringCta: 'ترشح تلقائي',
  },
  certifications: {
    title: 'الشهادات التي نتحقق منها',
    subtitle: 'كل علامة معروضة على EthiMarket تُراقب لدى هيئتها المصدرة. إليك المعايير الرئيسية المغطاة.',
    seoTitle: 'الشهادات',
    seoDesc: 'العضوية الأوروبية، التجارة العادلة، GOTS، Rainforest Alliance، Demeter، SA8000: الشهادات التي تتحقق منها EthiMarket لدى الهيئات المصدرة.',
    bodiesLabel: 'هيئات التصديق:',
    footnote: 'أكثر من 25 هيئة تصديق مسجلة في دليلنا الداخلي مع قنوات التحقق الرسمية الخاصة بها.',
    processTitle: 'عملية التحقق لدينا',
    processSteps: [
      'يودع المنتج شهادته (الرقم، الهيئة، تواريخ الصلاحية).',
      'تتصل EthiMarket بالهيئة المصدرة (سجلات عامة، API، بريد إلكتروني) لتأكيد الأصالة.',
      'ينتقل الادعاء من «🕓 التحقق جارٍ» إلى «✅ معتمد» — أو يُرفض.',
      'عند انتهاء صلاحية الشهادة، تُخفض الحالة تلقائياً.',
    ],
    processLink: 'اقرأ منهجية مركز الثقة الكاملة',
    certs: [
      { name: 'الزراعة العضوية (عضوي الاتحاد الأوروبي / AB)', body: 'Ecocert، Bureau Veritas، Control Union…', covers: 'إنتاج بدون مدخلات كيميائية اصطناعية، الكائنات المعدلة وراثياً محظورة، مراقبات سنوية.' },
      { name: 'التجارة العادلة / Fairtrade', body: 'FLO-CERT (Fairtrade International)، WFTO', covers: 'سعر أدنى مضمون للمنتج، علاوة تنمية، حظر عمل الأطفال.' },
      { name: 'GOTS (المعيار العالمي للنسيج العضوي)', body: 'Ecocert Greenlife، Control Union', covers: 'منسوجات عضوية: ألياف، أصباغ، ظروف اجتماعية لكامل السلسلة.' },
      { name: 'Rainforest Alliance', body: 'Rainforest Alliance Cert.', covers: 'زراعة مستدامة، حماية الغابات والعمال الزراعيين.' },
      { name: 'Demeter (الزراعة الحيوية)', body: 'Demeter International', covers: 'زراعة حيوية ديناميكية، دورات طبيعية، تنوع بيولوجي معزز.' },
      { name: 'SA8000 / BSCI (تدقيقات اجتماعية)', body: 'SAI، Amfori', covers: 'ظروف العمل، الصحة والسلامة، غياب العمل القسري أو عمل الأطفال.' },
    ],
  },
  press: {
    title: 'الفضاء الصحفي',
    subtitle: 'موارد ومعلومات للصحفيين ووسائل الإعلام.',
    seoTitle: 'الصحافة',
    seoDesc: 'الفضاء الصحفي لـ EthiMarket: قصتنا، أرقامنا الرئيسية القابلة للتحقق وجهة الاتصال الإعلامية.',
    briefTitle: 'EthiMarket باختصار',
    briefItems: [
      'سوق B2B/B2C للمنتجات العضوية والعادلة مباشرة من المنتج.',
      'الخصوصية: كل ادعاء أخلاقي يعرض علناً حالة دليله — موثّق، قيد التحقق، أو مجرد إعلان مورد.',
      'محرك بحث بلغة طبيعية بـ 17 معياراً مسؤولاً (المنشأ، CO2، الأجر اللائق، التغليف…).',
      'نقاط مسؤولية مفصلة في 6 معايير، قابلة للتفسير بالكامل.',
      'منصة أُطلقت في 2026، في مرحلة تجريبية مع 6 تعاونيات في 4 قارات.',
    ],
    contactTitle: 'جهة الاتصال الإعلامية',
    contactText: 'لأي طلب مقابلة أو صور أو معلومات:',
    contactEmail: 'presse@ethimarket.com',
    contactNote: 'رد خلال 48 ساعة عمل.',
    angle: 'زاوية تحريرية مقترحة: «كيف تثبت أن منتجاً ما أخلاقي حقاً؟» — يجيب مركز الثقة لدينا بنشر الشهادات وأرقامها وهيئاتها وتواريخ صلاحيتها، وبالإشارة بصدق إلى ما لم يتم التحقق منه بعد.',
  },
  partners: {
    title: 'شركاؤنا',
    subtitle: 'تعتمد EthiMarket على منظومة من هيئات التصديق والتعاونيات والمراجع العامة.',
    seoTitle: 'الشركاء',
    seoDesc: 'هيئات تصديق، تعاونيات منتجة ومراجع بيانات: منظومة EthiMarket.',
    types: [
      { title: 'هيئات التصديق', desc: 'Ecocert، FLO-CERT، Control Union، Rainforest Alliance… أكثر من 25 هيئة مسجلة في دليل التحقق لدينا مع قنواتها الرسمية.' },
      { title: 'التعاونيات المنتجة', desc: '6 تعاونيات رائدة في المغرب وإثيوبيا وغانا ومدغشقر وبيرو وإيران. نوسع الشبكة باستمرار.', ctaLabel: 'كن منتجاً شريكاً', ctaTo: '/devenir-vendeur' },
      { title: 'مراجع البيانات', desc: 'تعتمد تقديرات الأثر لدينا على المقادير العامة (FAO، Poore & Nemecek 2018، قاعدة ADEME) وتُوسم دائماً كتقديرات.' },
      { title: 'شبكات المشترين المسؤولين', desc: 'هل تدير شبكة مشترين أو اتحاداً أو مجموعة مسؤولية اجتماعية؟ لنبنِ وصولاً تجريبياً لأعضائكم.', ctaLabel: 'اقتراح شراكة', ctaTo: '/contact' },
    ],
  },
  help: {
    title: 'مركز المساعدة',
    subtitle: 'إجابات على الأسئلة الأكثر شيوعاً من المشترين والمنتجين.',
    seoTitle: 'مركز المساعدة والأسئلة الشائعة',
    seoDesc: 'الأسئلة الشائعة لـ EthiMarket: التحقق من الشهادات، نقاط المسؤولية، الطلبات، المقارن، قواعد القرار المخصصة.',
    notFound: 'لم تجد إجابتك؟',
    contactSupport: 'اتصل بالدعم',
    faqs: [
      { q: 'كيف أعرف أن شهادة ما أصلية؟', a: 'كل ادعاء لمنتج يعرض حالته على الصفحة: ✅ معتمد (مؤكد لدى الهيئة المصدرة، مع الرقم والتواريخ ورابط المصدر)، 🕓 التحقق جارٍ، أو ⚠️ إعلان المورد عندما لا يوجد دليل مستقل. المنهجية الكاملة منشورة في مركز الثقة.' },
      { q: 'ماذا تعني نقاط المسؤولية؟', a: 'هي المتوسط المرجح لستة معايير (البيئة، الاجتماعي، التتبع، الشهادات، اللوجستيات، المورد)، كل منها مفصل نقطة بنقطة على صفحة المنتج. لا شيء صندوق أسود: انقر على معيار لترى بالضبط من أين تأتي النقاط.' },
      { q: 'كيف أطلب أو أطلب عرض سعر؟', a: 'من صفحة المنتج، استخدم «اطلب» لطلب مباشر أو «اتصل بالمنتج» لمناقشة الكميات والعينات والآجال. المراسلة المدمجة تحفظ تاريخ تبادلاتكم.' },
      { q: 'كيف يعمل المقارن؟', a: 'حدد حتى 5 منتجات في الكتالوج ثم انقر «قارن»: تحصل على مصفوفة السعر / المسؤولية / التتبع / الشهادات / المخاطر، وتوصية مبررة وورقة تبرير قابلة للطباعة لإدارتك.' },
      { q: 'هل يمكنني تحديد معايير قراري الخاصة؟', a: 'نعم. في مساحة المشتري («قواعدي»)، رجّح السعر / البيئة / الاجتماعي / التتبع / الشهادات حسب سياسة مشترياتك. يمكن للمنصة أيضاً التعلم من قراراتك وصقل هذه القواعد — ويمكن تعطيل ذلك في أي وقت.' },
      { q: 'كيف يتم التحقق من المنتجين؟', a: 'كل منتج يكوّن ملفاً (الهوية، وثائق المزرعة، الشهادات) يُفحص وفق عملية مستوحاة من معايير Bureau Veritas. الشهادات المودعة تُؤكد مباشرة لدى الهيئات المصدرة قبل عرض «موثّق».' },
      { q: 'هل تقديرات CO2 والماء قياسات حقيقية؟', a: 'لا، ونعرض ذلك بوضوح: إنها تقديرات مبنية على مراجع عامة (FAO، الأدبيات العلمية، قاعدة ADEME) ما لم يُقدم تحليل دورة حياة محدد. كل رقم يحمل وسم مصدره.' },
      { q: 'ماذا أفعل إذا لاحظت معلومة مشكوكاً فيها؟', a: 'أبلغ عنها عبر صفحة الاتصال. كل بلاغ يطلق مراجعة موثقة؛ إذا تم دحض الادعاء، ينتقل علناً إلى «❌ غير مؤكد».' },
    ],
  },
};

export const INSTITUTIONAL_CONTENT: PerLocale<InstitutionalContent> = { fr, en, es, pt, ar };
