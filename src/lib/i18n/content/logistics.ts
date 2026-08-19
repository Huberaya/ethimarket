/** Contenus multilingues — page Notre Logistique (politique publique). */
import type { PerLocale } from './types';

export type LogisticsContent = {
  heroLabel: string;
  heroTitle: string;
  heroText: string;
  principleLabel: string;
  principleTitle: string;
  principleText: string;
  compareSea: string;
  compareAir: string;
  compareCostLabel: string;
  compareCo2Label: string;
  compareSeaCost: string;
  compareAirCost: string;
  compareSeaCo2: string;
  compareAirCo2: string;
  compareCaption: string;
  journeyLabel: string;
  journeyTitle: string;
  journey: { emoji: string; title: string; desc: string }[];
  commitLabel: string;
  commitTitle: string;
  commitments: { emoji: string; title: string; desc: string }[];
  circuitsLabel: string;
  circuitsTitle: string;
  circuitB2cTitle: string;
  circuitB2cText: string;
  circuitB2bTitle: string;
  circuitB2bText: string;
  refusalTitle: string;
  refusals: string[];
  ctaTitle: string;
  ctaText: string;
  ctaCatalogue: string;
  ctaTrust: string;
};

const fr: LogisticsContent = {
  heroLabel: 'Notre politique logistique',
  heroTitle: 'Une logistique à la hauteur de nos valeurs',
  heroText: 'Des coopératives à votre porte, chaque kilomètre est pensé pour être juste, traçable et sobre en carbone. Voici comment vos produits voyagent — et pourquoi nous avons fait ces choix.',
  principleLabel: 'Le principe fondateur',
  principleTitle: 'Massifier la mer, jamais l\'avion',
  principleText: 'Un même kilo de café peut traverser le monde de deux façons. Nous avons choisi la nôtre une fois pour toutes : les produits franchissent les frontières en gros, par bateau, et ne sont fractionnés en colis qu\'une fois arrivés en Europe. C\'est plus lent de quelques semaines — c\'est aussi 40 fois moins de CO₂.',
  compareSea: '🚢 Par bateau, groupé (notre choix)',
  compareAir: '✈️ Par avion, colis par colis (refusé)',
  compareCostLabel: 'Coût transport / kg',
  compareCo2Label: 'Émissions CO₂ / kg',
  compareSeaCost: '~0,32 €',
  compareAirCost: '~25 €',
  compareSeaCo2: '~25 g',
  compareAirCo2: '~1 100 g',
  compareCaption: 'Trajet type Éthiopie → France. La différence de coût finance la juste rémunération du producteur, pas le kérosène.',
  journeyLabel: 'Le voyage de vos produits',
  journeyTitle: 'De la coopérative à votre porte, en 6 étapes vérifiées',
  journey: [
    { emoji: '🧑‍🌾', title: 'Chez le producteur vérifié', desc: 'Seuls les producteurs dont l\'identité, les certifications et l\'éthique ont été prouvées (protocole EthiMarket Verified) expédient sur la plateforme. Chaque lot part avec son dossier documentaire complet : certificat bio, certificat phytosanitaire, analyses de laboratoire quand la filière l\'exige.' },
    { emoji: '🚢', title: 'Le conteneur partagé', desc: 'Les lots de plusieurs producteurs d\'une même région voyagent ensemble dans un conteneur maritime groupé. Un seul dédouanement, un seul contrôle sanitaire, une empreinte carbone divisée.' },
    { emoji: '🛃', title: 'L\'entrée en Europe, en règle', desc: 'Contrôles officiels aux frontières de l\'UE : certificat d\'inspection bio (TRACES), limites de résidus, contrôles renforcés sur les filières sensibles. Nous préparons chaque lot pour qu\'il les passe — pas pour les éviter.' },
    { emoji: '🏬', title: 'Un entrepôt certifié bio', desc: 'Les produits sont stockés en France chez un prestataire logistique certifié agriculture biologique : la chaîne de traçabilité du label ne se rompt jamais. Le producteur reste propriétaire de sa marchandise jusqu\'à la vente — nous n\'achetons rien, nous ne spéculons sur rien.' },
    { emoji: '📦', title: 'Un emballage sobre', desc: 'Carton recyclé et recyclable, calage papier, zéro plastique, zéro suremballage. Le QR code de traçabilité sur le colis vous montre le parcours vérifiable de votre lot.' },
    { emoji: '🚲', title: 'Le dernier kilomètre décarboné', desc: 'Livraison en point relais par défaut (moins de kilomètres, moins de CO₂), transporteurs à faibles émissions, vélos-cargos en ville. L\'empreinte carbone réelle de votre livraison est affichée avant de payer.' },
  ],
  commitLabel: 'Nos engagements',
  commitTitle: 'Ce que nous garantissons',
  commitments: [
    { emoji: '✈️', title: 'Zéro fret aérien', desc: 'Aucun produit EthiMarket ne prend l\'avion. Jamais. Quelques semaines de mer valent mieux que 40 fois plus de CO₂.' },
    { emoji: '🌱', title: 'Chaîne bio ininterrompue', desc: 'Du champ certifié à l\'entrepôt certifié : la traçabilité du label bio est maintenue à chaque maillon, contrôles à l\'appui.' },
    { emoji: '🤝', title: 'Le producteur reste propriétaire', desc: 'Stock en consignation : le producteur est payé à la vente, au prix affiché. Nous ne prenons pas possession de la marchandise pour spéculer dessus.' },
    { emoji: '📊', title: 'CO₂ affiché, pas compensé', desc: 'Nous affichons l\'empreinte réelle de chaque livraison plutôt que d\'acheter des crédits pour la faire oublier. La sobriété d\'abord, la transparence toujours.' },
    { emoji: '🔍', title: 'Traçabilité de bout en bout', desc: 'Chaque lot expédié porte un QR code public : origine, documents, analyses, réception contrôlée. Rien n\'est modifiable a posteriori.' },
    { emoji: '📦', title: 'Réception contrôlée', desc: 'Chaque livraison professionnelle est vérifiée en 4 points à l\'arrivée. Une non-conformité ouvre automatiquement un dossier qualité traité par notre équipe.' },
  ],
  circuitsLabel: 'Deux circuits, une exigence',
  circuitsTitle: 'Particuliers et professionnels, chacun son chemin',
  circuitB2cTitle: '🛒 Vous êtes un particulier',
  circuitB2cText: 'Vos produits partent de notre entrepôt certifié bio en France, sous 48 h, en point relais par défaut. Une sélection des meilleurs produits de nos coopératives vérifiées, déjà dédouanés, déjà contrôlés.',
  circuitB2bTitle: '🏢 Vous êtes un professionnel',
  circuitB2bText: 'Petits volumes : expédiés depuis notre entrepôt comme un colis classique. Volumes moyens : palettes préparées au hub. Gros volumes : expédition directe de la coopérative avec dossier documentaire complet, feuille de route d\'import et accompagnement douanier.',
  refusalTitle: 'Ce que nous refusons, par principe',
  refusals: [
    'Le fret aérien — 40 fois plus de CO₂ pour gagner deux semaines.',
    'Les entrepôts géants à flux tendus qui pressurent les travailleurs et les prix.',
    'La propriété du stock — nous sommes un tiers de confiance, pas un négociant.',
    'La compensation carbone comme excuse — nous réduisons d\'abord, nous affichons tout.',
    'Le suremballage et le plastique à usage unique.',
  ],
  ctaTitle: 'Une logistique qui se prouve',
  ctaText: 'Chaque affirmation de cette page correspond à un mécanisme vérifiable de la plateforme : dossiers de lot, QR de traçabilité, analyses de laboratoire, empreinte affichée. C\'est notre définition de la confiance.',
  ctaCatalogue: 'Découvrir le catalogue',
  ctaTrust: 'Visiter le Trust Center',
};

const en: LogisticsContent = {
  heroLabel: 'Our logistics policy',
  heroTitle: 'Logistics that live up to our values',
  heroText: 'From the cooperatives to your door, every kilometre is designed to be fair, traceable and low-carbon. Here is how your products travel — and why we made these choices.',
  principleLabel: 'The founding principle',
  principleTitle: 'Consolidate by sea, never by air',
  principleText: 'The same kilo of coffee can cross the world in two ways. We chose ours once and for all: products cross borders in bulk, by ship, and are only split into parcels once they arrive in Europe. It is a few weeks slower — it is also 40 times less CO₂.',
  compareSea: '🚢 By ship, consolidated (our choice)',
  compareAir: '✈️ By air, parcel by parcel (refused)',
  compareCostLabel: 'Transport cost / kg',
  compareCo2Label: 'CO₂ emissions / kg',
  compareSeaCost: '~€0.32',
  compareAirCost: '~€25',
  compareSeaCo2: '~25 g',
  compareAirCo2: '~1,100 g',
  compareCaption: 'Typical Ethiopia → France journey. The cost difference funds fair pay for the producer, not jet fuel.',
  journeyLabel: 'Your products\' journey',
  journeyTitle: 'From the cooperative to your door, in 6 verified steps',
  journey: [
    { emoji: '🧑‍🌾', title: 'At the verified producer', desc: 'Only producers whose identity, certifications and ethics have been proven (EthiMarket Verified protocol) ship on the platform. Every batch leaves with its complete documentary file: organic certificate, phytosanitary certificate, lab analyses where the supply chain requires them.' },
    { emoji: '🚢', title: 'The shared container', desc: 'Batches from several producers of the same region travel together in a consolidated sea container. One customs clearance, one sanitary control, a divided carbon footprint.' },
    { emoji: '🛃', title: 'Entering Europe, by the book', desc: 'Official controls at EU borders: organic inspection certificate (TRACES), residue limits, reinforced controls on sensitive supply chains. We prepare every batch to pass them — not to dodge them.' },
    { emoji: '🏬', title: 'A certified organic warehouse', desc: 'Products are stored in France with a logistics provider certified for organic agriculture: the label\'s chain of traceability is never broken. The producer remains the owner of the goods until the sale — we buy nothing, we speculate on nothing.' },
    { emoji: '📦', title: 'Sober packaging', desc: 'Recycled and recyclable cardboard, paper padding, zero plastic, zero overpackaging. The traceability QR code on the parcel shows you your batch\'s verifiable journey.' },
    { emoji: '🚲', title: 'A decarbonised last mile', desc: 'Pickup-point delivery by default (fewer kilometres, less CO₂), low-emission carriers, cargo bikes in cities. Your delivery\'s real carbon footprint is displayed before you pay.' },
  ],
  commitLabel: 'Our commitments',
  commitTitle: 'What we guarantee',
  commitments: [
    { emoji: '✈️', title: 'Zero air freight', desc: 'No EthiMarket product ever flies. A few weeks at sea beat 40 times more CO₂.' },
    { emoji: '🌱', title: 'Unbroken organic chain', desc: 'From certified field to certified warehouse: the organic label\'s traceability is maintained at every link, controls included.' },
    { emoji: '🤝', title: 'The producer stays the owner', desc: 'Consignment stock: the producer is paid on sale, at the displayed price. We do not take possession of the goods to speculate on them.' },
    { emoji: '📊', title: 'CO₂ displayed, not offset', desc: 'We display each delivery\'s real footprint rather than buying credits to make it forgotten. Sobriety first, transparency always.' },
    { emoji: '🔍', title: 'End-to-end traceability', desc: 'Every shipped batch carries a public QR code: origin, documents, analyses, checked reception. Nothing can be modified after the fact.' },
    { emoji: '📦', title: 'Checked reception', desc: 'Every professional delivery is verified on 4 points on arrival. A non-conformity automatically opens a quality case handled by our team.' },
  ],
  circuitsLabel: 'Two circuits, one standard',
  circuitsTitle: 'Consumers and professionals, each their own path',
  circuitB2cTitle: '🛒 You are a consumer',
  circuitB2cText: 'Your products leave our certified organic warehouse in France within 48 h, to a pickup point by default. A selection of the best products from our verified cooperatives, already cleared, already controlled.',
  circuitB2bTitle: '🏢 You are a professional',
  circuitB2bText: 'Small volumes: shipped from our warehouse like a standard parcel. Medium volumes: pallets prepared at the hub. Large volumes: direct shipment from the cooperative with a complete documentary file, import roadmap and customs guidance.',
  refusalTitle: 'What we refuse, on principle',
  refusals: [
    'Air freight — 40 times more CO₂ to save two weeks.',
    'Giant just-in-time warehouses that squeeze workers and prices.',
    'Owning the stock — we are a trusted third party, not a trader.',
    'Carbon offsetting as an excuse — we reduce first, we display everything.',
    'Overpackaging and single-use plastic.',
  ],
  ctaTitle: 'Logistics that can be proven',
  ctaText: 'Every claim on this page maps to a verifiable mechanism of the platform: batch files, traceability QR, lab analyses, displayed footprint. That is our definition of trust.',
  ctaCatalogue: 'Browse the catalogue',
  ctaTrust: 'Visit the Trust Center',
};

const es: LogisticsContent = {
  heroLabel: 'Nuestra política logística',
  heroTitle: 'Una logística a la altura de nuestros valores',
  heroText: 'De las cooperativas a su puerta, cada kilómetro está pensado para ser justo, trazable y sobrio en carbono. Así viajan sus productos — y por qué tomamos estas decisiones.',
  principleLabel: 'El principio fundador',
  principleTitle: 'Masificar por mar, nunca por avión',
  principleText: 'Un mismo kilo de café puede cruzar el mundo de dos maneras. Elegimos la nuestra de una vez por todas: los productos cruzan las fronteras a granel, en barco, y solo se fraccionan en paquetes una vez llegados a Europa. Es unas semanas más lento — también es 40 veces menos CO₂.',
  compareSea: '🚢 En barco, agrupado (nuestra elección)',
  compareAir: '✈️ En avión, paquete a paquete (rechazado)',
  compareCostLabel: 'Coste transporte / kg',
  compareCo2Label: 'Emisiones CO₂ / kg',
  compareSeaCost: '~0,32 €',
  compareAirCost: '~25 €',
  compareSeaCo2: '~25 g',
  compareAirCo2: '~1 100 g',
  compareCaption: 'Trayecto típico Etiopía → Francia. La diferencia de coste financia la justa remuneración del productor, no el queroseno.',
  journeyLabel: 'El viaje de sus productos',
  journeyTitle: 'De la cooperativa a su puerta, en 6 etapas verificadas',
  journey: [
    { emoji: '🧑‍🌾', title: 'En el productor verificado', desc: 'Solo los productores cuya identidad, certificaciones y ética han sido probadas (protocolo EthiMarket Verified) expiden en la plataforma. Cada lote parte con su expediente documental completo: certificado bio, certificado fitosanitario, análisis de laboratorio cuando la cadena lo exige.' },
    { emoji: '🚢', title: 'El contenedor compartido', desc: 'Los lotes de varios productores de una misma región viajan juntos en un contenedor marítimo agrupado. Un solo despacho de aduana, un solo control sanitario, una huella de carbono dividida.' },
    { emoji: '🛃', title: 'La entrada en Europa, en regla', desc: 'Controles oficiales en las fronteras de la UE: certificado de inspección bio (TRACES), límites de residuos, controles reforzados en las cadenas sensibles. Preparamos cada lote para pasarlos — no para evitarlos.' },
    { emoji: '🏬', title: 'Un almacén certificado bio', desc: 'Los productos se almacenan en Francia con un operador logístico certificado en agricultura ecológica: la cadena de trazabilidad del sello nunca se rompe. El productor sigue siendo propietario de su mercancía hasta la venta — no compramos nada, no especulamos con nada.' },
    { emoji: '📦', title: 'Un embalaje sobrio', desc: 'Cartón reciclado y reciclable, relleno de papel, cero plástico, cero sobreembalaje. El código QR de trazabilidad en el paquete le muestra el recorrido verificable de su lote.' },
    { emoji: '🚲', title: 'El último kilómetro descarbonizado', desc: 'Entrega en punto de recogida por defecto (menos kilómetros, menos CO₂), transportistas de bajas emisiones, bicicletas de carga en las ciudades. La huella de carbono real de su entrega se muestra antes de pagar.' },
  ],
  commitLabel: 'Nuestros compromisos',
  commitTitle: 'Lo que garantizamos',
  commitments: [
    { emoji: '✈️', title: 'Cero flete aéreo', desc: 'Ningún producto EthiMarket toma el avión. Nunca. Unas semanas de mar valen más que 40 veces más CO₂.' },
    { emoji: '🌱', title: 'Cadena bio ininterrumpida', desc: 'Del campo certificado al almacén certificado: la trazabilidad del sello bio se mantiene en cada eslabón, con controles.' },
    { emoji: '🤝', title: 'El productor sigue siendo propietario', desc: 'Stock en consignación: el productor cobra en la venta, al precio mostrado. No tomamos posesión de la mercancía para especular con ella.' },
    { emoji: '📊', title: 'CO₂ mostrado, no compensado', desc: 'Mostramos la huella real de cada entrega en lugar de comprar créditos para hacerla olvidar. Sobriedad primero, transparencia siempre.' },
    { emoji: '🔍', title: 'Trazabilidad de extremo a extremo', desc: 'Cada lote expedido lleva un código QR público: origen, documentos, análisis, recepción controlada. Nada es modificable a posteriori.' },
    { emoji: '📦', title: 'Recepción controlada', desc: 'Cada entrega profesional se verifica en 4 puntos a la llegada. Una no conformidad abre automáticamente un expediente de calidad tratado por nuestro equipo.' },
  ],
  circuitsLabel: 'Dos circuitos, una exigencia',
  circuitsTitle: 'Particulares y profesionales, cada uno su camino',
  circuitB2cTitle: '🛒 Usted es un particular',
  circuitB2cText: 'Sus productos salen de nuestro almacén certificado bio en Francia, en 48 h, a un punto de recogida por defecto. Una selección de los mejores productos de nuestras cooperativas verificadas, ya despachados, ya controlados.',
  circuitB2bTitle: '🏢 Usted es un profesional',
  circuitB2bText: 'Pequeños volúmenes: expedidos desde nuestro almacén como un paquete clásico. Volúmenes medianos: palés preparados en el hub. Grandes volúmenes: expedición directa de la cooperativa con expediente documental completo, hoja de ruta de importación y acompañamiento aduanero.',
  refusalTitle: 'Lo que rechazamos, por principio',
  refusals: [
    'El flete aéreo — 40 veces más CO₂ para ganar dos semanas.',
    'Los almacenes gigantes de flujo tenso que presionan a los trabajadores y los precios.',
    'La propiedad del stock — somos un tercero de confianza, no un negociante.',
    'La compensación de carbono como excusa — primero reducimos, lo mostramos todo.',
    'El sobreembalaje y el plástico de un solo uso.',
  ],
  ctaTitle: 'Una logística que se demuestra',
  ctaText: 'Cada afirmación de esta página corresponde a un mecanismo verificable de la plataforma: expedientes de lote, QR de trazabilidad, análisis de laboratorio, huella mostrada. Es nuestra definición de la confianza.',
  ctaCatalogue: 'Descubrir el catálogo',
  ctaTrust: 'Visitar el Trust Center',
};

const pt: LogisticsContent = {
  heroLabel: 'A nossa política logística',
  heroTitle: 'Uma logística à altura dos nossos valores',
  heroText: 'Das cooperativas à sua porta, cada quilómetro é pensado para ser justo, rastreável e sóbrio em carbono. Eis como os seus produtos viajam — e porque fizemos estas escolhas.',
  principleLabel: 'O princípio fundador',
  principleTitle: 'Massificar pelo mar, nunca pelo avião',
  principleText: 'O mesmo quilo de café pode atravessar o mundo de duas formas. Escolhemos a nossa de uma vez por todas: os produtos atravessam as fronteiras a granel, de navio, e só são fracionados em encomendas depois de chegarem à Europa. É algumas semanas mais lento — também é 40 vezes menos CO₂.',
  compareSea: '🚢 De navio, agrupado (a nossa escolha)',
  compareAir: '✈️ De avião, encomenda a encomenda (recusado)',
  compareCostLabel: 'Custo transporte / kg',
  compareCo2Label: 'Emissões CO₂ / kg',
  compareSeaCost: '~0,32 €',
  compareAirCost: '~25 €',
  compareSeaCo2: '~25 g',
  compareAirCo2: '~1 100 g',
  compareCaption: 'Trajeto típico Etiópia → França. A diferença de custo financia a justa remuneração do produtor, não o querosene.',
  journeyLabel: 'A viagem dos seus produtos',
  journeyTitle: 'Da cooperativa à sua porta, em 6 etapas verificadas',
  journey: [
    { emoji: '🧑‍🌾', title: 'No produtor verificado', desc: 'Só os produtores cuja identidade, certificações e ética foram provadas (protocolo EthiMarket Verified) expedem na plataforma. Cada lote parte com o seu dossiê documental completo: certificado bio, certificado fitossanitário, análises de laboratório quando a cadeia o exige.' },
    { emoji: '🚢', title: 'O contentor partilhado', desc: 'Os lotes de vários produtores da mesma região viajam juntos num contentor marítimo agrupado. Um só desalfandegamento, um só controlo sanitário, uma pegada de carbono dividida.' },
    { emoji: '🛃', title: 'A entrada na Europa, em regra', desc: 'Controlos oficiais nas fronteiras da UE: certificado de inspeção bio (TRACES), limites de resíduos, controlos reforçados nas cadeias sensíveis. Preparamos cada lote para os passar — não para os evitar.' },
    { emoji: '🏬', title: 'Um armazém certificado bio', desc: 'Os produtos são armazenados em França num operador logístico certificado em agricultura biológica: a cadeia de rastreabilidade do rótulo nunca se rompe. O produtor continua proprietário da sua mercadoria até à venda — não compramos nada, não especulamos sobre nada.' },
    { emoji: '📦', title: 'Uma embalagem sóbria', desc: 'Cartão reciclado e reciclável, enchimento de papel, zero plástico, zero sobre-embalagem. O código QR de rastreabilidade na encomenda mostra-lhe o percurso verificável do seu lote.' },
    { emoji: '🚲', title: 'O último quilómetro descarbonizado', desc: 'Entrega em ponto de recolha por defeito (menos quilómetros, menos CO₂), transportadoras de baixas emissões, bicicletas de carga nas cidades. A pegada de carbono real da sua entrega é mostrada antes de pagar.' },
  ],
  commitLabel: 'Os nossos compromissos',
  commitTitle: 'O que garantimos',
  commitments: [
    { emoji: '✈️', title: 'Zero frete aéreo', desc: 'Nenhum produto EthiMarket apanha o avião. Nunca. Algumas semanas de mar valem mais do que 40 vezes mais CO₂.' },
    { emoji: '🌱', title: 'Cadeia bio ininterrupta', desc: 'Do campo certificado ao armazém certificado: a rastreabilidade do rótulo bio é mantida em cada elo, com controlos.' },
    { emoji: '🤝', title: 'O produtor continua proprietário', desc: 'Stock à consignação: o produtor é pago na venda, ao preço mostrado. Não tomamos posse da mercadoria para especular sobre ela.' },
    { emoji: '📊', title: 'CO₂ mostrado, não compensado', desc: 'Mostramos a pegada real de cada entrega em vez de comprar créditos para a fazer esquecer. Sobriedade primeiro, transparência sempre.' },
    { emoji: '🔍', title: 'Rastreabilidade de ponta a ponta', desc: 'Cada lote expedido leva um código QR público: origem, documentos, análises, receção controlada. Nada é modificável a posteriori.' },
    { emoji: '📦', title: 'Receção controlada', desc: 'Cada entrega profissional é verificada em 4 pontos à chegada. Uma não conformidade abre automaticamente um processo de qualidade tratado pela nossa equipa.' },
  ],
  circuitsLabel: 'Dois circuitos, uma exigência',
  circuitsTitle: 'Particulares e profissionais, cada um o seu caminho',
  circuitB2cTitle: '🛒 É um particular',
  circuitB2cText: 'Os seus produtos partem do nosso armazém certificado bio em França, em 48 h, para um ponto de recolha por defeito. Uma seleção dos melhores produtos das nossas cooperativas verificadas, já desalfandegados, já controlados.',
  circuitB2bTitle: '🏢 É um profissional',
  circuitB2bText: 'Pequenos volumes: expedidos do nosso armazém como uma encomenda clássica. Volumes médios: paletes preparadas no hub. Grandes volumes: expedição direta da cooperativa com dossiê documental completo, roteiro de importação e acompanhamento aduaneiro.',
  refusalTitle: 'O que recusamos, por princípio',
  refusals: [
    'O frete aéreo — 40 vezes mais CO₂ para ganhar duas semanas.',
    'Os armazéns gigantes de fluxo tenso que pressionam trabalhadores e preços.',
    'A propriedade do stock — somos um terceiro de confiança, não um negociante.',
    'A compensação de carbono como desculpa — primeiro reduzimos, mostramos tudo.',
    'A sobre-embalagem e o plástico descartável.',
  ],
  ctaTitle: 'Uma logística que se prova',
  ctaText: 'Cada afirmação desta página corresponde a um mecanismo verificável da plataforma: dossiês de lote, QR de rastreabilidade, análises de laboratório, pegada mostrada. É a nossa definição de confiança.',
  ctaCatalogue: 'Descobrir o catálogo',
  ctaTrust: 'Visitar o Trust Center',
};

const ar: LogisticsContent = {
  heroLabel: 'سياستنا اللوجستية',
  heroTitle: 'لوجستيات بمستوى قيمنا',
  heroText: 'من التعاونيات إلى باب منزلك، كل كيلومتر مصمم ليكون عادلاً وقابلاً للتتبع ومنخفض الكربون. إليك كيف تسافر منتجاتك — ولماذا اتخذنا هذه الخيارات.',
  principleLabel: 'المبدأ المؤسِّس',
  principleTitle: 'التجميع بحراً، وليس جواً أبداً',
  principleText: 'يمكن لنفس الكيلوغرام من القهوة أن يعبر العالم بطريقتين. اخترنا طريقتنا مرة واحدة وإلى الأبد: تعبر المنتجات الحدود بالجملة، بالسفينة، ولا تُقسَّم إلى طرود إلا بعد وصولها إلى أوروبا. أبطأ ببضعة أسابيع — لكنه أيضاً أقل بأربعين مرة من CO₂.',
  compareSea: '🚢 بالسفينة، مجمَّع (خيارنا)',
  compareAir: '✈️ بالطائرة، طرداً طرداً (مرفوض)',
  compareCostLabel: 'تكلفة النقل / كغ',
  compareCo2Label: 'انبعاثات CO₂ / كغ',
  compareSeaCost: '~0,32 €',
  compareAirCost: '~25 €',
  compareSeaCo2: '~25 غ',
  compareAirCo2: '~1 100 غ',
  compareCaption: 'رحلة نموذجية إثيوبيا ← فرنسا. فرق التكلفة يموّل الأجر العادل للمنتِج، لا وقود الطائرات.',
  journeyLabel: 'رحلة منتجاتك',
  journeyTitle: 'من التعاونية إلى باب منزلك، في 6 مراحل موثّقة',
  journey: [
    { emoji: '🧑‍🌾', title: 'عند المنتِج الموثّق', desc: 'فقط المنتِجون الذين ثبتت هويتهم وشهاداتهم وأخلاقياتهم (بروتوكول EthiMarket Verified) يشحنون على المنصة. كل دفعة تغادر بملفها الوثائقي الكامل: شهادة بيو، شهادة صحة نباتية، تحاليل مخبرية عندما تقتضيها السلسلة.' },
    { emoji: '🚢', title: 'الحاوية المشتركة', desc: 'دفعات عدة منتجين من نفس المنطقة تسافر معاً في حاوية بحرية مجمَّعة. تخليص جمركي واحد، مراقبة صحية واحدة، بصمة كربونية مقسومة.' },
    { emoji: '🛃', title: 'دخول أوروبا وفق القواعد', desc: 'مراقبات رسمية على حدود الاتحاد الأوروبي: شهادة تفتيش بيو (TRACES)، حدود المتبقيات، مراقبات معزّزة على السلاسل الحساسة. نجهّز كل دفعة لاجتيازها — لا للتهرب منها.' },
    { emoji: '🏬', title: 'مستودع معتمد بيو', desc: 'تُخزَّن المنتجات في فرنسا لدى مشغّل لوجستي معتمد في الزراعة العضوية: سلسلة تتبّع العلامة لا تنقطع أبداً. يبقى المنتِج مالكاً لبضاعته حتى البيع — لا نشتري شيئاً ولا نضارب على شيء.' },
    { emoji: '📦', title: 'تغليف رصين', desc: 'كرتون معاد التدوير وقابل لإعادة التدوير، حشو ورقي، صفر بلاستيك، صفر تغليف زائد. رمز QR للتتبّع على الطرد يريك المسار الموثّق لدفعتك.' },
    { emoji: '🚲', title: 'الكيلومتر الأخير منزوع الكربون', desc: 'التسليم في نقطة استلام افتراضياً (كيلومترات أقل، CO₂ أقل)، ناقلون منخفضو الانبعاثات، دراجات شحن في المدن. البصمة الكربونية الحقيقية لتسليمك تُعرض قبل الدفع.' },
  ],
  commitLabel: 'التزاماتنا',
  commitTitle: 'ما نضمنه',
  commitments: [
    { emoji: '✈️', title: 'صفر شحن جوي', desc: 'لا يستقل أي منتج من EthiMarket الطائرة. أبداً. بضعة أسابيع في البحر خير من أربعين ضعفاً من CO₂.' },
    { emoji: '🌱', title: 'سلسلة بيو غير منقطعة', desc: 'من الحقل المعتمد إلى المستودع المعتمد: تتبّع علامة البيو محفوظ في كل حلقة، بمراقبات.' },
    { emoji: '🤝', title: 'المنتِج يبقى المالك', desc: 'مخزون بالأمانة: يُدفع للمنتِج عند البيع، بالسعر المعروض. لا نستحوذ على البضاعة للمضاربة عليها.' },
    { emoji: '📊', title: 'CO₂ معروض، لا معوَّض', desc: 'نعرض البصمة الحقيقية لكل تسليم بدل شراء أرصدة لإنسائها. الرصانة أولاً، الشفافية دائماً.' },
    { emoji: '🔍', title: 'تتبّع من البداية إلى النهاية', desc: 'كل دفعة مشحونة تحمل رمز QR علنياً: المنشأ، الوثائق، التحاليل، الاستلام المراقب. لا شيء قابل للتعديل لاحقاً.' },
    { emoji: '📦', title: 'استلام مراقب', desc: 'كل تسليم مهني يُتحقق منه في 4 نقاط عند الوصول. عدم المطابقة يفتح تلقائياً ملف جودة يعالجه فريقنا.' },
  ],
  circuitsLabel: 'مساران، معيار واحد',
  circuitsTitle: 'الأفراد والمهنيون، لكلٍّ طريقه',
  circuitB2cTitle: '🛒 أنت فرد',
  circuitB2cText: 'تغادر منتجاتك مستودعنا المعتمد بيو في فرنسا خلال 48 ساعة، إلى نقطة استلام افتراضياً. تشكيلة من أفضل منتجات تعاونياتنا الموثّقة، مخلّصة جمركياً ومراقبة سلفاً.',
  circuitB2bTitle: '🏢 أنت مهني',
  circuitB2bText: 'الأحجام الصغيرة: تُشحن من مستودعنا كطرد عادي. الأحجام المتوسطة: منصات نقالة تُجهَّز في المركز. الأحجام الكبيرة: شحن مباشر من التعاونية مع ملف وثائقي كامل وخارطة طريق استيراد ومرافقة جمركية.',
  refusalTitle: 'ما نرفضه، من حيث المبدأ',
  refusals: [
    'الشحن الجوي — أربعون ضعفاً من CO₂ لكسب أسبوعين.',
    'المستودعات العملاقة ذات التدفق المشدود التي تضغط على العمال والأسعار.',
    'ملكية المخزون — نحن طرف ثالث موثوق، لا تاجر.',
    'تعويض الكربون كذريعة — نخفّض أولاً، ونعرض كل شيء.',
    'التغليف الزائد والبلاستيك أحادي الاستعمال.',
  ],
  ctaTitle: 'لوجستيات تُثبَت',
  ctaText: 'كل تأكيد في هذه الصفحة يقابله آلية قابلة للتحقق في المنصة: ملفات الدفعات، رمز QR للتتبّع، التحاليل المخبرية، البصمة المعروضة. هذا تعريفنا للثقة.',
  ctaCatalogue: 'اكتشف الكتالوج',
  ctaTrust: 'زر مركز الثقة',
};

export const LOGISTICS_CONTENT: PerLocale<LogisticsContent> = { fr, en, es, pt, ar };
