/** Contenus multilingues — sections détaillées de la fiche produit. */
import type { PerLocale } from './types';

export type ProductPageContent = {
  guarantees: {
    sectionTitle: string;
    certsTitle: string; certsText: string; noCerts: string; verify: string;
    traceTitle: string; traceText: string;
    gpsParcel: string; planting: string; harvest: string; packaging: string; batchNo: string; notProvided: string;
    qualityTitle: string; qualityText: string; lab: string; analysisDate: string;
    qualityChecks: string[]; downloadReport: string;
    euTitle: string; euText: string; euDocs: string[];
    oneClick: string; allCertsTitle: string; verifiedWithBody: string;
    labAnalysis: string; labReport: string; phytoCert: string; forEuExport: string;
    parcel: string;
  };
  traceability: {
    sectionTitle: string;
    steps: { title: string; detail: string }[];
    growthDuration: string; availableNow: string; volumeAvailable: string;
    journeyTitle: string; journeySubtitle: string;
    origin: string; destination: string; yourDestination: string; yourAddress: string;
    noGps: string;
    packagingLabels: Record<string, string>;
    euLabeling: string; lotNo: string; packagingWord: string;
    locationWord: string; methodWord: string;
  };
  delivery: {
    sectionTitle: string; calculatorTitle: string;
    destLabel: string; destPlaceholder: string;
    volumeLabel: string; modeLabel: string;
    summaryTitle: string; productPrice: string; freight: string; co2Footprint: string;
    commission: string; commissionSub: string;
    customs: string; vat: string; vatSub: string;
    total: string; noHiddenFees: string;
    acpTitle: string; acpText1: string; acpBold: string; acpText2: string;
    methodNote: string;
  };
  faq: {
    sectionTitle: string;
    items: { q: string; a: string }[];
  };
  reviews: {
    sectionTitle: string; recommended: string; noReviews: string; beFirst: string;
  };
  quote: {
    sent: string; deliveryTo: string; wishedDate: string; indicativePrice: string;
    estimatedTotal: string; detailsPlaceholder: string;
  };
  impact: {
    sectionTitle: string;
    measuredFor: string; of: string; realtime: string; auditBadge: string;
    climateTitle: string; climateSubtitle: string;
    carbonOrder: string; carbonSaved: string; waterFootprint: string; waterSaved: string;
    treesPreserved: string; trees: string; biodiversity: string; species: string;
    ecoTitle: string; ecoSubtitle: string;
    producerRevenue: string; directPayment: string; families: string; family: string;
    gainVsConv: string; guaranteedIncome: string; devPremium: string; coopFund: string;
    socialTitle: string; socialSubtitle: string;
    jobsSupported: string; persons: string; decentJobs: string;
    training: string; hours: string; trainingBudget: string;
    educationFund: string; supportsChildren: string; children: string;
    socialGuarantees: string; healthCoverage: string; basicGuarantees: string; healthInsurance: string;
    producerData: string; sectorEstimate: string; ethimarketModel: string;
    disclaimer: string; disclaimerLabel: string;
    basedOnFarm: string; basedOnDensities: string; basedOnImpact: string;
  };
  technical: {
    sectionTitle: string; characteristics: string;
    farmingMethod: string; notProvided: string; basePrice: string; minQty: string;
    monthlyCapacity: string; deliveryTime: string; days: string;
    tabPackaging: string; tabNutrition: string; tabStorage: string;
    country: string; stockAvailable: string; certifications: string; none: string;
    pkgType: string; pkgTypeVal: string; pkgMaterial: string; pkgMaterialVal: string;
    pkgLabeling: string; pkgLabelingVal: string; pkgUnitWeight: string;
    humidity: string; density: string; scaScore: string; fullReport: string; downloadPdf: string;
    temperature: string; shelfLife: string; months: string; awayFrom: string; awayFromVal: string;
  };
};

const fr: ProductPageContent = {
  guarantees: {
    sectionTitle: 'Nos garanties pour ce produit',
    certsTitle: 'Certifications vérifiées',
    certsText: 'Toutes les certifications sont vérifiées auprès des organismes émetteurs.',
    noCerts: 'Aucune certification enregistrée.',
    verify: 'Vérifier',
    traceTitle: 'Traçabilité complète',
    traceText: "Vous savez exactement d'où vient votre produit.",
    gpsParcel: 'GPS parcelle', planting: 'Plantation', harvest: 'Récolte', packaging: 'Emballage', batchNo: 'N° de lot', notProvided: 'Non renseigné',
    qualityTitle: 'Qualité contrôlée',
    qualityText: 'Analyses laboratoire indépendantes.',
    lab: 'Laboratoire', analysisDate: 'Date analyse',
    qualityChecks: ['Absence de pesticides', 'Absence de métaux lourds', 'Absence de mycotoxines', 'Tests microbiologiques OK'],
    downloadReport: 'Télécharger le rapport complet',
    euTitle: 'Conformité UE',
    euText: 'Prêt pour importation en Europe.',
    euDocs: ['Facture commerciale', "Certificat d'origine (ACP)", 'Certificat phytosanitaire', 'Liste de colisage', 'Certificat bio EU', 'Documents douaniers'],
    oneClick: 'Vérification en 1 clic — voir tous les certificats',
    allCertsTitle: 'Tous les certificats',
    verifiedWithBody: "Vérifié auprès de l'organisme émetteur",
    labAnalysis: 'Analyse laboratoire', labReport: 'Bureau Veritas — rapport complet',
    phytoCert: 'Certificat phytosanitaire', forEuExport: 'Pour export UE',
    parcel: 'Parcelle',
  },
  traceability: {
    sectionTitle: 'Voyage de votre produit',
    steps: [
      { title: 'Plantation', detail: '' },
      { title: 'Croissance', detail: 'Méthode bio, ombragé. Sans pesticides ni engrais chimiques.' },
      { title: 'Récolte', detail: 'Cueillette manuelle. Photos de la récolte disponibles.' },
      { title: 'Traitement', detail: 'Méthode lavée. Séchage solaire. Durée 12 jours.' },
      { title: 'Emballage', detail: '' },
      { title: 'Prêt pour expédition', detail: '' },
    ],
    growthDuration: '30 mois', availableNow: 'Disponible maintenant', volumeAvailable: 'Volume disponible',
    journeyTitle: 'Trajet du produit', journeySubtitle: "De l'exploitation à votre destination",
    origin: 'Origine', destination: 'Destination', yourDestination: 'Votre destination (Paris)', yourAddress: 'Votre adresse',
    noGps: 'Coordonnées GPS non renseignées',
    packagingLabels: { plastic_free: 'sans plastique', compostable: 'compostable', recyclable: 'recyclable', bulk: 'vrac disponible', deposit: 'consigné' },
    euLabeling: 'Étiquetage conforme UE.', lotNo: 'N° de lot', packagingWord: 'Emballage',
    locationWord: 'Lieu', methodWord: 'Méthode',
  },
  delivery: {
    sectionTitle: 'Livraison & Transparence Tarifaire',
    calculatorTitle: 'Calculateur Fret & Bilan Carbone Transport',
    destLabel: 'Destination de livraison (UE)', destPlaceholder: 'Adresse ou code postal...',
    volumeLabel: 'Volume calculé :', modeLabel: 'Mode de transport au choix :',
    summaryTitle: 'Récapitulatif transparent',
    productPrice: 'Prix produit', freight: 'Fret transport', co2Footprint: 'Empreinte CO2 transport',
    commission: 'Commission EthiMarket (5%)', commissionSub: 'Frais de fonctionnement de la plateforme directe',
    customs: 'Droits de douane UE', vat: "TVA à l'importation", vatSub: 'Taux réduit sur les denrées alimentaires bio en',
    total: 'TOTAL TTC TOUT INCLUS', noHiddenFees: '✓ Tarification certifiée sans frais cachés ni intermédiaire secondaire',
    acpTitle: 'Confort douanier & Accord UE-ACP',
    acpText1: 'En vertu des accords UE-ACP (Cotonou / EBA), les produits certifiés originaires de pays partenaires bénéficient de',
    acpBold: '0% de droits de douane',
    acpText2: '. Tous les documents Phytosanitaires (EUR.1, Certificat Bio UE) sont automatiquement générés.',
    methodNote: 'Calculs basés sur GHG Protocol, ADEME, Water Footprint Network, FAO, et UN SDG Framework.',
  },
  faq: {
    sectionTitle: 'Questions fréquentes',
    items: [
      { q: "Comment vérifier l'authenticité du certificat bio ?", a: 'Notre équipe contacte directement Ecocert pour vérifier chaque certificat. Vous pouvez aussi vérifier vous-même sur ecocert.com avec le numéro fourni.' },
      { q: "Que se passe-t-il si le produit reçu n'est pas conforme ?", a: 'Vous avez 7 jours pour signaler un problème. Le paiement reste bloqué. Nous investiguons sous 48h. Vous êtes intégralement remboursé si non-conformité prouvée.' },
      { q: 'Combien de temps entre la commande et la livraison ?', a: "Selon l'option choisie : DHL Express (5-7 jours), UPS (10-14 jours), Maritime (30-45 jours)." },
      { q: 'Puis-je commander un échantillon avant ?', a: 'Oui, pour la plupart des producteurs. Contactez-les directement via la messagerie.' },
      { q: 'Comment sont calculés les frais de douane ?', a: 'Automatiquement selon le pays destination et le type de produit. Détails transparents avant paiement.' },
    ],
  },
  reviews: {
    sectionTitle: 'Avis vérifiés', recommended: '(recommandé)',
    noReviews: "Aucun avis pour l'instant", beFirst: 'Soyez le premier à évaluer ce produit.',
  },
  quote: {
    sent: 'Demande envoyée ✓', deliveryTo: 'Livraison vers', wishedDate: 'Date souhaitée (optionnel)',
    indicativePrice: 'Prix indicatif au palier actuel', estimatedTotal: 'Total estimé (hors livraison)',
    detailsPlaceholder: 'Précisions : conditionnement souhaité, échantillon préalable, fréquence de commande…',
  },
  impact: {
    sectionTitle: 'Votre impact positif certifié',
    measuredFor: 'Impact mesuré pour', of: 'de', realtime: '⚡ Calculs mis à jour en temps réel selon le GHG Protocol, ADEME Base Carbone® et Water Footprint Network.', auditBadge: 'Transparent & Auditabilité Expert',
    climateTitle: 'Impact Climat & Eau', climateSubtitle: 'Méthodes : GHG Protocol + ADEME + Water Footprint',
    carbonOrder: 'Empreinte carbone de la commande', carbonSaved: 'CO2 évité vs conventionnel', waterFootprint: 'Empreinte eau (verte + bleue + grise)', waterSaved: 'Eau grise évitée (bio)',
    treesPreserved: 'Arbres préservés / plantés', trees: 'arbres', biodiversity: 'Biodiversité préservée', species: 'espèces',
    ecoTitle: 'Impact Économique Direct', ecoSubtitle: 'Méthode : Fairtrade Impact Assessment',
    producerRevenue: 'Revenu producteur (87%)', directPayment: 'Paiement direct sans intermédiaire commercial', families: 'Familles bénéficiaires', family: 'famille(s)',
    gainVsConv: 'Gain vs conventionnel', guaranteedIncome: 'Revenu net garanti supérieur au prix du marché', devPremium: 'Prime développement', coopFund: 'Fonds géré directement par la coopérative',
    socialTitle: 'Impact Social & Emploi', socialSubtitle: 'Méthode : UN SDG Framework 2030',
    jobsSupported: 'Emplois soutenus', persons: 'personne(s)', decentJobs: 'Emplois agricoles décents et locaux',
    training: 'Formation technique', hours: 'heure(s)', trainingBudget: 'Budget dédié aux bonnes pratiques',
    educationFund: 'Fonds Éducation', supportsChildren: 'Soutient ~', children: 'enfant(s)',
    socialGuarantees: 'Garanties sociales', healthCoverage: 'Couverture Santé', basicGuarantees: 'Garanties de base', healthInsurance: 'Assurance maladie & congés payés',
    producerData: '📊 Données producteur', sectorEstimate: '📈 Estimation sectorielle', ethimarketModel: '📊 Modèle EthiMarket',
    disclaimerLabel: 'Avertissement de transparence :', disclaimer: "Les impacts sont calculés sur la base des données déclarées par le producteur et des facteurs d'émission reconnus internationalement (ADEME Base Carbone®, GHG Protocol, Water Footprint Network, IBAT & FAO). Les résultats sont des estimations indicatives auditables.",
    basedOnFarm: "Sur la surface d'exploitation associée", basedOnDensities: 'Basé sur les densités régionales (IBAT)', basedOnImpact: "Basé sur l'impact d'exploitation calculé",
  },
  technical: {
    sectionTitle: 'Détails techniques', characteristics: 'Caractéristiques',
    farmingMethod: 'Méthode de culture', notProvided: 'Non renseigné', basePrice: 'Prix de base',
    minQty: 'Quantité minimale', monthlyCapacity: 'Capacité mensuelle', deliveryTime: 'Délai de livraison', days: 'jours',
    tabPackaging: 'Emballage', tabNutrition: 'Analyse nutritionnelle', tabStorage: 'Conservation',
    country: "Pays d'origine", stockAvailable: 'Stock disponible', certifications: 'Certifications', none: 'Aucune',
    pkgType: 'Type', pkgTypeVal: 'Sacs jute 60 kg', pkgMaterial: 'Emballage', pkgMaterialVal: 'Recyclable et biodégradable',
    pkgLabeling: 'Étiquetage', pkgLabelingVal: 'Multilingue (FR, EN, AR)', pkgUnitWeight: 'Poids unitaire',
    humidity: 'Humidité', density: 'Densité', scaScore: 'Score SCA', fullReport: 'Rapport complet', downloadPdf: 'Télécharger PDF',
    temperature: 'Température', shelfLife: 'Durée de conservation', months: 'mois', awayFrom: "À l'abri de", awayFromVal: 'Lumière directe, chaleur',
  },
};

const en: ProductPageContent = {
  guarantees: {
    sectionTitle: 'Our guarantees for this product',
    certsTitle: 'Verified certifications',
    certsText: 'All certifications are verified with the issuing bodies.',
    noCerts: 'No certification on record.',
    verify: 'Verify',
    traceTitle: 'Full traceability',
    traceText: 'You know exactly where your product comes from.',
    gpsParcel: 'Plot GPS', planting: 'Planting', harvest: 'Harvest', packaging: 'Packaging', batchNo: 'Batch no.', notProvided: 'Not provided',
    qualityTitle: 'Quality controlled',
    qualityText: 'Independent laboratory analyses.',
    lab: 'Laboratory', analysisDate: 'Analysis date',
    qualityChecks: ['No pesticides', 'No heavy metals', 'No mycotoxins', 'Microbiological tests OK'],
    downloadReport: 'Download the full report',
    euTitle: 'EU compliance',
    euText: 'Ready for import into Europe.',
    euDocs: ['Commercial invoice', 'Certificate of origin (ACP)', 'Phytosanitary certificate', 'Packing list', 'EU organic certificate', 'Customs documents'],
    oneClick: '1-click verification — see all certificates',
    allCertsTitle: 'All certificates',
    verifiedWithBody: 'Verified with the issuing body',
    labAnalysis: 'Laboratory analysis', labReport: 'Bureau Veritas — full report',
    phytoCert: 'Phytosanitary certificate', forEuExport: 'For EU export',
    parcel: 'Plot',
  },
  traceability: {
    sectionTitle: "Your product's journey",
    steps: [
      { title: 'Planting', detail: '' },
      { title: 'Growth', detail: 'Organic method, shade-grown. No pesticides or chemical fertilizers.' },
      { title: 'Harvest', detail: 'Hand-picked. Harvest photos available.' },
      { title: 'Processing', detail: 'Washed method. Solar drying. Duration 12 days.' },
      { title: 'Packaging', detail: '' },
      { title: 'Ready for shipment', detail: '' },
    ],
    growthDuration: '30 months', availableNow: 'Available now', volumeAvailable: 'Available volume',
    journeyTitle: 'Product route', journeySubtitle: 'From the farm to your destination',
    origin: 'Origin', destination: 'Destination', yourDestination: 'Your destination (Paris)', yourAddress: 'Your address',
    noGps: 'GPS coordinates not provided',
    packagingLabels: { plastic_free: 'plastic-free', compostable: 'compostable', recyclable: 'recyclable', bulk: 'bulk available', deposit: 'returnable' },
    euLabeling: 'EU-compliant labeling.', lotNo: 'Batch no.', packagingWord: 'Packaging',
    locationWord: 'Location', methodWord: 'Method',
  },
  delivery: {
    sectionTitle: 'Delivery & Price Transparency',
    calculatorTitle: 'Freight & Transport Carbon Calculator',
    destLabel: 'Delivery destination (EU)', destPlaceholder: 'Address or postal code...',
    volumeLabel: 'Calculated volume:', modeLabel: 'Choose your transport mode:',
    summaryTitle: 'Transparent summary',
    productPrice: 'Product price', freight: 'Freight', co2Footprint: 'Transport CO2 footprint',
    commission: 'EthiMarket commission (5%)', commissionSub: 'Operating fee of the direct platform',
    customs: 'EU customs duties', vat: 'Import VAT', vatSub: 'Reduced rate on organic foodstuffs in',
    total: 'ALL-INCLUSIVE TOTAL', noHiddenFees: '✓ Certified pricing with no hidden fees or secondary middlemen',
    acpTitle: 'Customs ease & EU-ACP Agreement',
    acpText1: 'Under the EU-ACP agreements (Cotonou / EBA), certified products originating from partner countries benefit from',
    acpBold: '0% customs duties',
    acpText2: '. All phytosanitary documents (EUR.1, EU Organic Certificate) are generated automatically.',
    methodNote: 'Calculations based on GHG Protocol, ADEME, Water Footprint Network, FAO, and the UN SDG Framework.',
  },
  faq: {
    sectionTitle: 'Frequently asked questions',
    items: [
      { q: 'How can I verify the authenticity of the organic certificate?', a: 'Our team contacts Ecocert directly to verify each certificate. You can also check it yourself on ecocert.com with the provided number.' },
      { q: 'What happens if the received product is not compliant?', a: 'You have 7 days to report an issue. The payment stays on hold. We investigate within 48h. You are fully refunded if non-compliance is proven.' },
      { q: 'How long between order and delivery?', a: 'Depending on the chosen option: DHL Express (5-7 days), UPS (10-14 days), Sea freight (30-45 days).' },
      { q: 'Can I order a sample first?', a: 'Yes, for most producers. Contact them directly through the messaging system.' },
      { q: 'How are customs fees calculated?', a: 'Automatically based on the destination country and product type. Transparent details before payment.' },
    ],
  },
  reviews: {
    sectionTitle: 'Verified reviews', recommended: '(recommended)',
    noReviews: 'No reviews yet', beFirst: 'Be the first to review this product.',
  },
  quote: {
    sent: 'Request sent ✓', deliveryTo: 'Delivery to', wishedDate: 'Desired date (optional)',
    indicativePrice: 'Indicative price at current tier', estimatedTotal: 'Estimated total (excl. shipping)',
    detailsPlaceholder: 'Details: desired packaging, prior sample, order frequency…',
  },
  impact: {
    sectionTitle: 'Your certified positive impact',
    measuredFor: 'Impact measured for', of: 'of', realtime: '⚡ Calculations updated in real time following the GHG Protocol, ADEME Base Carbone® and Water Footprint Network.', auditBadge: 'Transparent & Expert-Auditable',
    climateTitle: 'Climate & Water Impact', climateSubtitle: 'Methods: GHG Protocol + ADEME + Water Footprint',
    carbonOrder: 'Carbon footprint of the order', carbonSaved: 'CO2 avoided vs conventional', waterFootprint: 'Water footprint (green + blue + grey)', waterSaved: 'Grey water avoided (organic)',
    treesPreserved: 'Trees preserved / planted', trees: 'trees', biodiversity: 'Biodiversity preserved', species: 'species',
    ecoTitle: 'Direct Economic Impact', ecoSubtitle: 'Method: Fairtrade Impact Assessment',
    producerRevenue: 'Producer revenue (87%)', directPayment: 'Direct payment with no commercial middleman', families: 'Beneficiary families', family: 'family(ies)',
    gainVsConv: 'Gain vs conventional', guaranteedIncome: 'Guaranteed net income above market price', devPremium: 'Development premium', coopFund: 'Fund managed directly by the cooperative',
    socialTitle: 'Social & Employment Impact', socialSubtitle: 'Method: UN SDG Framework 2030',
    jobsSupported: 'Jobs supported', persons: 'person(s)', decentJobs: 'Decent, local agricultural jobs',
    training: 'Technical training', hours: 'hour(s)', trainingBudget: 'Budget dedicated to good practices',
    educationFund: 'Education Fund', supportsChildren: 'Supports ~', children: 'child(ren)',
    socialGuarantees: 'Social guarantees', healthCoverage: 'Health Coverage', basicGuarantees: 'Basic guarantees', healthInsurance: 'Health insurance & paid leave',
    producerData: '📊 Producer data', sectorEstimate: '📈 Sector estimate', ethimarketModel: '📊 EthiMarket model',
    disclaimerLabel: 'Transparency notice:', disclaimer: 'Impacts are computed from producer-declared data and internationally recognized emission factors (ADEME Base Carbone®, GHG Protocol, Water Footprint Network, IBAT & FAO). Results are auditable indicative estimates.',
    basedOnFarm: 'Over the associated farm area', basedOnDensities: 'Based on regional densities (IBAT)', basedOnImpact: 'Based on the computed farm impact',
  },
  technical: {
    sectionTitle: 'Technical details', characteristics: 'Characteristics',
    farmingMethod: 'Farming method', notProvided: 'Not provided', basePrice: 'Base price',
    minQty: 'Minimum quantity', monthlyCapacity: 'Monthly capacity', deliveryTime: 'Delivery time', days: 'days',
    tabPackaging: 'Packaging', tabNutrition: 'Nutritional analysis', tabStorage: 'Storage',
    country: 'Country of origin', stockAvailable: 'Available stock', certifications: 'Certifications', none: 'None',
    pkgType: 'Type', pkgTypeVal: '60 kg jute bags', pkgMaterial: 'Packaging', pkgMaterialVal: 'Recyclable and biodegradable',
    pkgLabeling: 'Labeling', pkgLabelingVal: 'Multilingual (FR, EN, AR)', pkgUnitWeight: 'Unit weight',
    humidity: 'Humidity', density: 'Density', scaScore: 'SCA score', fullReport: 'Full report', downloadPdf: 'Download PDF',
    temperature: 'Temperature', shelfLife: 'Shelf life', months: 'months', awayFrom: 'Keep away from', awayFromVal: 'Direct light, heat',
  },
};

const es: ProductPageContent = {
  guarantees: {
    sectionTitle: 'Nuestras garantías para este producto',
    certsTitle: 'Certificaciones verificadas',
    certsText: 'Todas las certificaciones se verifican con los organismos emisores.',
    noCerts: 'Ninguna certificación registrada.',
    verify: 'Verificar',
    traceTitle: 'Trazabilidad completa',
    traceText: 'Usted sabe exactamente de dónde viene su producto.',
    gpsParcel: 'GPS parcela', planting: 'Plantación', harvest: 'Cosecha', packaging: 'Envasado', batchNo: 'N° de lote', notProvided: 'No indicado',
    qualityTitle: 'Calidad controlada',
    qualityText: 'Análisis de laboratorio independientes.',
    lab: 'Laboratorio', analysisDate: 'Fecha de análisis',
    qualityChecks: ['Sin pesticidas', 'Sin metales pesados', 'Sin micotoxinas', 'Pruebas microbiológicas OK'],
    downloadReport: 'Descargar el informe completo',
    euTitle: 'Conformidad UE',
    euText: 'Listo para importación en Europa.',
    euDocs: ['Factura comercial', 'Certificado de origen (ACP)', 'Certificado fitosanitario', 'Lista de embalaje', 'Certificado orgánico UE', 'Documentos aduaneros'],
    oneClick: 'Verificación en 1 clic — ver todos los certificados',
    allCertsTitle: 'Todos los certificados',
    verifiedWithBody: 'Verificado con el organismo emisor',
    labAnalysis: 'Análisis de laboratorio', labReport: 'Bureau Veritas — informe completo',
    phytoCert: 'Certificado fitosanitario', forEuExport: 'Para exportación UE',
    parcel: 'Parcela',
  },
  traceability: {
    sectionTitle: 'El viaje de su producto',
    steps: [
      { title: 'Plantación', detail: '' },
      { title: 'Crecimiento', detail: 'Método orgánico, bajo sombra. Sin pesticidas ni fertilizantes químicos.' },
      { title: 'Cosecha', detail: 'Recolección manual. Fotos de la cosecha disponibles.' },
      { title: 'Procesamiento', detail: 'Método lavado. Secado solar. Duración 12 días.' },
      { title: 'Envasado', detail: '' },
      { title: 'Listo para envío', detail: '' },
    ],
    growthDuration: '30 meses', availableNow: 'Disponible ahora', volumeAvailable: 'Volumen disponible',
    journeyTitle: 'Ruta del producto', journeySubtitle: 'De la explotación a su destino',
    origin: 'Origen', destination: 'Destino', yourDestination: 'Su destino (París)', yourAddress: 'Su dirección',
    noGps: 'Coordenadas GPS no indicadas',
    packagingLabels: { plastic_free: 'sin plástico', compostable: 'compostable', recyclable: 'reciclable', bulk: 'a granel disponible', deposit: 'retornable' },
    euLabeling: 'Etiquetado conforme UE.', lotNo: 'N° de lote', packagingWord: 'Envase',
    locationWord: 'Lugar', methodWord: 'Método',
  },
  delivery: {
    sectionTitle: 'Entrega y Transparencia de Precios',
    calculatorTitle: 'Calculadora de Flete y Huella de Carbono del Transporte',
    destLabel: 'Destino de entrega (UE)', destPlaceholder: 'Dirección o código postal...',
    volumeLabel: 'Volumen calculado:', modeLabel: 'Modo de transporte a elegir:',
    summaryTitle: 'Resumen transparente',
    productPrice: 'Precio del producto', freight: 'Flete', co2Footprint: 'Huella CO2 del transporte',
    commission: 'Comisión EthiMarket (5%)', commissionSub: 'Gastos de funcionamiento de la plataforma directa',
    customs: 'Derechos de aduana UE', vat: 'IVA a la importación', vatSub: 'Tasa reducida en alimentos orgánicos en',
    total: 'TOTAL TODO INCLUIDO', noHiddenFees: '✓ Tarificación certificada sin costos ocultos ni intermediarios secundarios',
    acpTitle: 'Facilidad aduanera y Acuerdo UE-ACP',
    acpText1: 'En virtud de los acuerdos UE-ACP (Cotonú / EBA), los productos certificados originarios de países socios se benefician de',
    acpBold: '0% de derechos de aduana',
    acpText2: '. Todos los documentos fitosanitarios (EUR.1, Certificado Orgánico UE) se generan automáticamente.',
    methodNote: 'Cálculos basados en GHG Protocol, ADEME, Water Footprint Network, FAO y el Marco ODS de la ONU.',
  },
  faq: {
    sectionTitle: 'Preguntas frecuentes',
    items: [
      { q: '¿Cómo verificar la autenticidad del certificado orgánico?', a: 'Nuestro equipo contacta directamente a Ecocert para verificar cada certificado. También puede verificarlo usted mismo en ecocert.com con el número proporcionado.' },
      { q: '¿Qué pasa si el producto recibido no es conforme?', a: 'Tiene 7 días para reportar un problema. El pago queda retenido. Investigamos en 48h. Se le reembolsa íntegramente si se prueba la no conformidad.' },
      { q: '¿Cuánto tiempo entre el pedido y la entrega?', a: 'Según la opción elegida: DHL Express (5-7 días), UPS (10-14 días), Marítimo (30-45 días).' },
      { q: '¿Puedo pedir una muestra antes?', a: 'Sí, para la mayoría de los productores. Contáctelos directamente por la mensajería.' },
      { q: '¿Cómo se calculan los gastos de aduana?', a: 'Automáticamente según el país de destino y el tipo de producto. Detalles transparentes antes del pago.' },
    ],
  },
  reviews: {
    sectionTitle: 'Reseñas verificadas', recommended: '(recomendado)',
    noReviews: 'Sin reseñas por el momento', beFirst: 'Sea el primero en evaluar este producto.',
  },
  quote: {
    sent: 'Solicitud enviada ✓', deliveryTo: 'Entrega hacia', wishedDate: 'Fecha deseada (opcional)',
    indicativePrice: 'Precio indicativo en el nivel actual', estimatedTotal: 'Total estimado (sin envío)',
    detailsPlaceholder: 'Precisiones: envasado deseado, muestra previa, frecuencia de pedido…',
  },
  impact: {
    sectionTitle: 'Su impacto positivo certificado',
    measuredFor: 'Impacto medido para', of: 'de', realtime: '⚡ Cálculos actualizados en tiempo real según el GHG Protocol, ADEME Base Carbone® y Water Footprint Network.', auditBadge: 'Transparente y Auditable por Expertos',
    climateTitle: 'Impacto Clima y Agua', climateSubtitle: 'Métodos: GHG Protocol + ADEME + Water Footprint',
    carbonOrder: 'Huella de carbono del pedido', carbonSaved: 'CO2 evitado vs convencional', waterFootprint: 'Huella hídrica (verde + azul + gris)', waterSaved: 'Agua gris evitada (orgánico)',
    treesPreserved: 'Árboles preservados / plantados', trees: 'árboles', biodiversity: 'Biodiversidad preservada', species: 'especies',
    ecoTitle: 'Impacto Económico Directo', ecoSubtitle: 'Método: Fairtrade Impact Assessment',
    producerRevenue: 'Ingreso del productor (87%)', directPayment: 'Pago directo sin intermediario comercial', families: 'Familias beneficiarias', family: 'familia(s)',
    gainVsConv: 'Ganancia vs convencional', guaranteedIncome: 'Ingreso neto garantizado superior al precio de mercado', devPremium: 'Prima de desarrollo', coopFund: 'Fondo gestionado directamente por la cooperativa',
    socialTitle: 'Impacto Social y Empleo', socialSubtitle: 'Método: UN SDG Framework 2030',
    jobsSupported: 'Empleos apoyados', persons: 'persona(s)', decentJobs: 'Empleos agrícolas dignos y locales',
    training: 'Formación técnica', hours: 'hora(s)', trainingBudget: 'Presupuesto dedicado a las buenas prácticas',
    educationFund: 'Fondo de Educación', supportsChildren: 'Apoya a ~', children: 'niño(s)',
    socialGuarantees: 'Garantías sociales', healthCoverage: 'Cobertura de Salud', basicGuarantees: 'Garantías básicas', healthInsurance: 'Seguro médico y vacaciones pagadas',
    producerData: '📊 Datos del productor', sectorEstimate: '📈 Estimación sectorial', ethimarketModel: '📊 Modelo EthiMarket',
    disclaimerLabel: 'Aviso de transparencia:', disclaimer: 'Los impactos se calculan a partir de los datos declarados por el productor y de factores de emisión reconocidos internacionalmente (ADEME Base Carbone®, GHG Protocol, Water Footprint Network, IBAT y FAO). Los resultados son estimaciones indicativas auditables.',
    basedOnFarm: 'Sobre la superficie de explotación asociada', basedOnDensities: 'Basado en densidades regionales (IBAT)', basedOnImpact: 'Basado en el impacto de explotación calculado',
  },
  technical: {
    sectionTitle: 'Detalles técnicos', characteristics: 'Características',
    farmingMethod: 'Método de cultivo', notProvided: 'No indicado', basePrice: 'Precio base',
    minQty: 'Cantidad mínima', monthlyCapacity: 'Capacidad mensual', deliveryTime: 'Plazo de entrega', days: 'días',
    tabPackaging: 'Envase', tabNutrition: 'Análisis nutricional', tabStorage: 'Conservación',
    country: 'País de origen', stockAvailable: 'Stock disponible', certifications: 'Certificaciones', none: 'Ninguna',
    pkgType: 'Tipo', pkgTypeVal: 'Sacos de yute 60 kg', pkgMaterial: 'Envase', pkgMaterialVal: 'Reciclable y biodegradable',
    pkgLabeling: 'Etiquetado', pkgLabelingVal: 'Multilingüe (FR, EN, AR)', pkgUnitWeight: 'Peso unitario',
    humidity: 'Humedad', density: 'Densidad', scaScore: 'Puntuación SCA', fullReport: 'Informe completo', downloadPdf: 'Descargar PDF',
    temperature: 'Temperatura', shelfLife: 'Vida útil', months: 'meses', awayFrom: 'Proteger de', awayFromVal: 'Luz directa, calor',
  },
};

const pt: ProductPageContent = {
  guarantees: {
    sectionTitle: 'Nossas garantias para este produto',
    certsTitle: 'Certificações verificadas',
    certsText: 'Todas as certificações são verificadas junto aos organismos emissores.',
    noCerts: 'Nenhuma certificação registrada.',
    verify: 'Verificar',
    traceTitle: 'Rastreabilidade completa',
    traceText: 'Você sabe exatamente de onde vem o seu produto.',
    gpsParcel: 'GPS da parcela', planting: 'Plantio', harvest: 'Colheita', packaging: 'Embalagem', batchNo: 'N° do lote', notProvided: 'Não informado',
    qualityTitle: 'Qualidade controlada',
    qualityText: 'Análises laboratoriais independentes.',
    lab: 'Laboratório', analysisDate: 'Data da análise',
    qualityChecks: ['Sem pesticidas', 'Sem metais pesados', 'Sem micotoxinas', 'Testes microbiológicos OK'],
    downloadReport: 'Baixar o relatório completo',
    euTitle: 'Conformidade UE',
    euText: 'Pronto para importação na Europa.',
    euDocs: ['Fatura comercial', 'Certificado de origem (ACP)', 'Certificado fitossanitário', 'Lista de embalagem', 'Certificado orgânico UE', 'Documentos aduaneiros'],
    oneClick: 'Verificação em 1 clique — ver todos os certificados',
    allCertsTitle: 'Todos os certificados',
    verifiedWithBody: 'Verificado junto ao organismo emissor',
    labAnalysis: 'Análise laboratorial', labReport: 'Bureau Veritas — relatório completo',
    phytoCert: 'Certificado fitossanitário', forEuExport: 'Para exportação UE',
    parcel: 'Parcela',
  },
  traceability: {
    sectionTitle: 'A viagem do seu produto',
    steps: [
      { title: 'Plantio', detail: '' },
      { title: 'Crescimento', detail: 'Método orgânico, sombreado. Sem pesticidas nem fertilizantes químicos.' },
      { title: 'Colheita', detail: 'Colheita manual. Fotos da colheita disponíveis.' },
      { title: 'Processamento', detail: 'Método lavado. Secagem solar. Duração 12 dias.' },
      { title: 'Embalagem', detail: '' },
      { title: 'Pronto para envio', detail: '' },
    ],
    growthDuration: '30 meses', availableNow: 'Disponível agora', volumeAvailable: 'Volume disponível',
    journeyTitle: 'Rota do produto', journeySubtitle: 'Da fazenda ao seu destino',
    origin: 'Origem', destination: 'Destino', yourDestination: 'Seu destino (Paris)', yourAddress: 'Seu endereço',
    noGps: 'Coordenadas GPS não informadas',
    packagingLabels: { plastic_free: 'sem plástico', compostable: 'compostável', recyclable: 'reciclável', bulk: 'granel disponível', deposit: 'retornável' },
    euLabeling: 'Rotulagem conforme UE.', lotNo: 'N° do lote', packagingWord: 'Embalagem',
    locationWord: 'Local', methodWord: 'Método',
  },
  delivery: {
    sectionTitle: 'Entrega e Transparência de Preços',
    calculatorTitle: 'Calculadora de Frete e Pegada de Carbono do Transporte',
    destLabel: 'Destino de entrega (UE)', destPlaceholder: 'Endereço ou código postal...',
    volumeLabel: 'Volume calculado:', modeLabel: 'Modo de transporte à escolha:',
    summaryTitle: 'Resumo transparente',
    productPrice: 'Preço do produto', freight: 'Frete', co2Footprint: 'Pegada CO2 do transporte',
    commission: 'Comissão EthiMarket (5%)', commissionSub: 'Custos de funcionamento da plataforma direta',
    customs: 'Direitos aduaneiros UE', vat: 'IVA na importação', vatSub: 'Taxa reduzida sobre alimentos orgânicos em',
    total: 'TOTAL TUDO INCLUÍDO', noHiddenFees: '✓ Precificação certificada sem taxas ocultas nem intermediários secundários',
    acpTitle: 'Facilidade aduaneira e Acordo UE-ACP',
    acpText1: 'Em virtude dos acordos UE-ACP (Cotonou / EBA), os produtos certificados originários de países parceiros beneficiam de',
    acpBold: '0% de direitos aduaneiros',
    acpText2: '. Todos os documentos fitossanitários (EUR.1, Certificado Orgânico UE) são gerados automaticamente.',
    methodNote: 'Cálculos baseados em GHG Protocol, ADEME, Water Footprint Network, FAO e no Quadro ODS da ONU.',
  },
  faq: {
    sectionTitle: 'Perguntas frequentes',
    items: [
      { q: 'Como verificar a autenticidade do certificado orgânico?', a: 'Nossa equipe contata diretamente a Ecocert para verificar cada certificado. Você também pode verificar em ecocert.com com o número fornecido.' },
      { q: 'O que acontece se o produto recebido não estiver conforme?', a: 'Você tem 7 dias para relatar um problema. O pagamento fica retido. Investigamos em 48h. Você é totalmente reembolsado se a não conformidade for comprovada.' },
      { q: 'Quanto tempo entre o pedido e a entrega?', a: 'Conforme a opção escolhida: DHL Express (5-7 dias), UPS (10-14 dias), Marítimo (30-45 dias).' },
      { q: 'Posso pedir uma amostra antes?', a: 'Sim, para a maioria dos produtores. Contate-os diretamente pela mensageria.' },
      { q: 'Como são calculadas as taxas alfandegárias?', a: 'Automaticamente conforme o país de destino e o tipo de produto. Detalhes transparentes antes do pagamento.' },
    ],
  },
  reviews: {
    sectionTitle: 'Avaliações verificadas', recommended: '(recomendado)',
    noReviews: 'Nenhuma avaliação no momento', beFirst: 'Seja o primeiro a avaliar este produto.',
  },
  quote: {
    sent: 'Solicitação enviada ✓', deliveryTo: 'Entrega para', wishedDate: 'Data desejada (opcional)',
    indicativePrice: 'Preço indicativo no nível atual', estimatedTotal: 'Total estimado (sem frete)',
    detailsPlaceholder: 'Detalhes: embalagem desejada, amostra prévia, frequência de pedido…',
  },
  impact: {
    sectionTitle: 'Seu impacto positivo certificado',
    measuredFor: 'Impacto medido para', of: 'de', realtime: '⚡ Cálculos atualizados em tempo real segundo o GHG Protocol, ADEME Base Carbone® e Water Footprint Network.', auditBadge: 'Transparente e Auditável por Especialistas',
    climateTitle: 'Impacto Clima e Água', climateSubtitle: 'Métodos: GHG Protocol + ADEME + Water Footprint',
    carbonOrder: 'Pegada de carbono do pedido', carbonSaved: 'CO2 evitado vs convencional', waterFootprint: 'Pegada hídrica (verde + azul + cinza)', waterSaved: 'Água cinza evitada (orgânico)',
    treesPreserved: 'Árvores preservadas / plantadas', trees: 'árvores', biodiversity: 'Biodiversidade preservada', species: 'espécies',
    ecoTitle: 'Impacto Econômico Direto', ecoSubtitle: 'Método: Fairtrade Impact Assessment',
    producerRevenue: 'Receita do produtor (87%)', directPayment: 'Pagamento direto sem intermediário comercial', families: 'Famílias beneficiárias', family: 'família(s)',
    gainVsConv: 'Ganho vs convencional', guaranteedIncome: 'Renda líquida garantida acima do preço de mercado', devPremium: 'Prêmio de desenvolvimento', coopFund: 'Fundo gerido diretamente pela cooperativa',
    socialTitle: 'Impacto Social e Emprego', socialSubtitle: 'Método: UN SDG Framework 2030',
    jobsSupported: 'Empregos apoiados', persons: 'pessoa(s)', decentJobs: 'Empregos agrícolas dignos e locais',
    training: 'Formação técnica', hours: 'hora(s)', trainingBudget: 'Orçamento dedicado às boas práticas',
    educationFund: 'Fundo de Educação', supportsChildren: 'Apoia ~', children: 'criança(s)',
    socialGuarantees: 'Garantias sociais', healthCoverage: 'Cobertura de Saúde', basicGuarantees: 'Garantias básicas', healthInsurance: 'Seguro saúde e férias pagas',
    producerData: '📊 Dados do produtor', sectorEstimate: '📈 Estimativa setorial', ethimarketModel: '📊 Modelo EthiMarket',
    disclaimerLabel: 'Aviso de transparência:', disclaimer: 'Os impactos são calculados com base nos dados declarados pelo produtor e em fatores de emissão reconhecidos internacionalmente (ADEME Base Carbone®, GHG Protocol, Water Footprint Network, IBAT e FAO). Os resultados são estimativas indicativas auditáveis.',
    basedOnFarm: 'Sobre a área de cultivo associada', basedOnDensities: 'Baseado nas densidades regionais (IBAT)', basedOnImpact: 'Baseado no impacto de cultivo calculado',
  },
  technical: {
    sectionTitle: 'Detalhes técnicos', characteristics: 'Características',
    farmingMethod: 'Método de cultivo', notProvided: 'Não informado', basePrice: 'Preço base',
    minQty: 'Quantidade mínima', monthlyCapacity: 'Capacidade mensal', deliveryTime: 'Prazo de entrega', days: 'dias',
    tabPackaging: 'Embalagem', tabNutrition: 'Análise nutricional', tabStorage: 'Conservação',
    country: 'País de origem', stockAvailable: 'Estoque disponível', certifications: 'Certificações', none: 'Nenhuma',
    pkgType: 'Tipo', pkgTypeVal: 'Sacos de juta 60 kg', pkgMaterial: 'Embalagem', pkgMaterialVal: 'Reciclável e biodegradável',
    pkgLabeling: 'Rotulagem', pkgLabelingVal: 'Multilíngue (FR, EN, AR)', pkgUnitWeight: 'Peso unitário',
    humidity: 'Umidade', density: 'Densidade', scaScore: 'Pontuação SCA', fullReport: 'Relatório completo', downloadPdf: 'Baixar PDF',
    temperature: 'Temperatura', shelfLife: 'Prazo de validade', months: 'meses', awayFrom: 'Proteger de', awayFromVal: 'Luz direta, calor',
  },
};

const ar: ProductPageContent = {
  guarantees: {
    sectionTitle: 'ضماناتنا لهذا المنتج',
    certsTitle: 'شهادات موثّقة',
    certsText: 'جميع الشهادات موثّقة لدى الهيئات المصدرة.',
    noCerts: 'لا شهادات مسجلة.',
    verify: 'تحقق',
    traceTitle: 'تتبع كامل',
    traceText: 'تعرف بالضبط من أين يأتي منتجك.',
    gpsParcel: 'GPS القطعة', planting: 'الزراعة', harvest: 'الحصاد', packaging: 'التعبئة', batchNo: 'رقم الدفعة', notProvided: 'غير مذكور',
    qualityTitle: 'جودة مراقبة',
    qualityText: 'تحاليل مخبرية مستقلة.',
    lab: 'المختبر', analysisDate: 'تاريخ التحليل',
    qualityChecks: ['خالٍ من المبيدات', 'خالٍ من المعادن الثقيلة', 'خالٍ من السموم الفطرية', 'اختبارات ميكروبيولوجية سليمة'],
    downloadReport: 'تحميل التقرير الكامل',
    euTitle: 'مطابقة الاتحاد الأوروبي',
    euText: 'جاهز للاستيراد إلى أوروبا.',
    euDocs: ['فاتورة تجارية', 'شهادة المنشأ (ACP)', 'شهادة الصحة النباتية', 'قائمة التعبئة', 'شهادة عضوية أوروبية', 'وثائق جمركية'],
    oneClick: 'تحقق بنقرة واحدة — عرض جميع الشهادات',
    allCertsTitle: 'جميع الشهادات',
    verifiedWithBody: 'موثّق لدى الهيئة المصدرة',
    labAnalysis: 'تحليل مخبري', labReport: 'Bureau Veritas — تقرير كامل',
    phytoCert: 'شهادة الصحة النباتية', forEuExport: 'للتصدير إلى الاتحاد الأوروبي',
    parcel: 'القطعة',
  },
  traceability: {
    sectionTitle: 'رحلة منتجك',
    steps: [
      { title: 'الزراعة', detail: '' },
      { title: 'النمو', detail: 'طريقة عضوية، تحت الظل. بدون مبيدات أو أسمدة كيميائية.' },
      { title: 'الحصاد', detail: 'قطف يدوي. صور الحصاد متاحة.' },
      { title: 'المعالجة', detail: 'طريقة مغسولة. تجفيف شمسي. المدة 12 يوماً.' },
      { title: 'التعبئة', detail: '' },
      { title: 'جاهز للشحن', detail: '' },
    ],
    growthDuration: '30 شهراً', availableNow: 'متاح الآن', volumeAvailable: 'الحجم المتاح',
    journeyTitle: 'مسار المنتج', journeySubtitle: 'من المزرعة إلى وجهتك',
    origin: 'المنشأ', destination: 'الوجهة', yourDestination: 'وجهتك (باريس)', yourAddress: 'عنوانك',
    noGps: 'إحداثيات GPS غير مذكورة',
    packagingLabels: { plastic_free: 'بدون بلاستيك', compostable: 'قابل للتسميد', recyclable: 'قابل لإعادة التدوير', bulk: 'متاح بالجملة', deposit: 'قابل للإرجاع' },
    euLabeling: 'وسم مطابق للاتحاد الأوروبي.', lotNo: 'رقم الدفعة', packagingWord: 'التعبئة',
    locationWord: 'المكان', methodWord: 'الطريقة',
  },
  delivery: {
    sectionTitle: 'التسليم وشفافية الأسعار',
    calculatorTitle: 'حاسبة الشحن والبصمة الكربونية للنقل',
    destLabel: 'وجهة التسليم (الاتحاد الأوروبي)', destPlaceholder: 'العنوان أو الرمز البريدي...',
    volumeLabel: 'الحجم المحسوب:', modeLabel: 'اختر وسيلة النقل:',
    summaryTitle: 'ملخص شفاف',
    productPrice: 'سعر المنتج', freight: 'أجرة الشحن', co2Footprint: 'البصمة الكربونية للنقل',
    commission: 'عمولة EthiMarket (5%)', commissionSub: 'رسوم تشغيل المنصة المباشرة',
    customs: 'الرسوم الجمركية الأوروبية', vat: 'ضريبة القيمة المضافة عند الاستيراد', vatSub: 'معدل مخفض على المواد الغذائية العضوية في',
    total: 'الإجمالي شامل كل شيء', noHiddenFees: '✓ تسعير معتمد بدون رسوم خفية أو وسطاء ثانويين',
    acpTitle: 'تسهيل جمركي واتفاقية الاتحاد الأوروبي-ACP',
    acpText1: 'بموجب اتفاقيات الاتحاد الأوروبي-ACP (كوتونو / EBA)، تستفيد المنتجات المعتمدة من البلدان الشريكة من',
    acpBold: '0% رسوم جمركية',
    acpText2: '. جميع وثائق الصحة النباتية (EUR.1، الشهادة العضوية الأوروبية) تُنشأ تلقائياً.',
    methodNote: 'حسابات مبنية على GHG Protocol وADEME وWater Footprint Network وFAO وإطار أهداف التنمية المستدامة للأمم المتحدة.',
  },
  faq: {
    sectionTitle: 'الأسئلة الشائعة',
    items: [
      { q: 'كيف أتحقق من أصالة الشهادة العضوية؟', a: 'فريقنا يتصل مباشرة بـ Ecocert للتحقق من كل شهادة. يمكنك أيضاً التحقق بنفسك على ecocert.com بالرقم المقدم.' },
      { q: 'ماذا يحدث إذا كان المنتج المستلم غير مطابق؟', a: 'لديك 7 أيام للإبلاغ عن مشكلة. يبقى الدفع محجوزاً. نحقق خلال 48 ساعة. تُسترد أموالك بالكامل إذا ثبت عدم المطابقة.' },
      { q: 'كم من الوقت بين الطلب والتسليم؟', a: 'حسب الخيار المختار: DHL Express (5-7 أيام)، UPS (10-14 يوماً)، بحري (30-45 يوماً).' },
      { q: 'هل يمكنني طلب عينة أولاً؟', a: 'نعم، لدى معظم المنتجين. اتصل بهم مباشرة عبر المراسلة.' },
      { q: 'كيف تُحسب الرسوم الجمركية؟', a: 'تلقائياً حسب بلد الوجهة ونوع المنتج. تفاصيل شفافة قبل الدفع.' },
    ],
  },
  reviews: {
    sectionTitle: 'تقييمات موثّقة', recommended: '(موصى به)',
    noReviews: 'لا تقييمات حالياً', beFirst: 'كن أول من يقيّم هذا المنتج.',
  },
  quote: {
    sent: 'تم إرسال الطلب ✓', deliveryTo: 'التسليم إلى', wishedDate: 'التاريخ المرغوب (اختياري)',
    indicativePrice: 'السعر الإرشادي عند المستوى الحالي', estimatedTotal: 'الإجمالي المقدر (بدون الشحن)',
    detailsPlaceholder: 'تفاصيل: التغليف المطلوب، عينة مسبقة، وتيرة الطلب…',
  },
  impact: {
    sectionTitle: 'أثرك الإيجابي المعتمد',
    measuredFor: 'الأثر المقاس لـ', of: 'من', realtime: '⚡ حسابات محدثة فورياً وفق GHG Protocol وADEME Base Carbone® وWater Footprint Network.', auditBadge: 'شفاف وقابل للتدقيق من الخبراء',
    climateTitle: 'أثر المناخ والماء', climateSubtitle: 'الطرق: GHG Protocol + ADEME + Water Footprint',
    carbonOrder: 'البصمة الكربونية للطلب', carbonSaved: 'CO2 المتجنب مقارنة بالتقليدي', waterFootprint: 'البصمة المائية (خضراء + زرقاء + رمادية)', waterSaved: 'الماء الرمادي المتجنب (عضوي)',
    treesPreserved: 'أشجار محفوظة / مزروعة', trees: 'شجرة', biodiversity: 'تنوع بيولوجي محفوظ', species: 'نوعاً',
    ecoTitle: 'الأثر الاقتصادي المباشر', ecoSubtitle: 'الطريقة: Fairtrade Impact Assessment',
    producerRevenue: 'دخل المنتج (87%)', directPayment: 'دفع مباشر بدون وسيط تجاري', families: 'العائلات المستفيدة', family: 'عائلة (عائلات)',
    gainVsConv: 'المكسب مقارنة بالتقليدي', guaranteedIncome: 'دخل صافٍ مضمون أعلى من سعر السوق', devPremium: 'علاوة التنمية', coopFund: 'صندوق تديره التعاونية مباشرة',
    socialTitle: 'الأثر الاجتماعي والتوظيف', socialSubtitle: 'الطريقة: UN SDG Framework 2030',
    jobsSupported: 'وظائف مدعومة', persons: 'شخص (أشخاص)', decentJobs: 'وظائف زراعية كريمة ومحلية',
    training: 'تدريب تقني', hours: 'ساعة (ساعات)', trainingBudget: 'ميزانية مخصصة للممارسات الجيدة',
    educationFund: 'صندوق التعليم', supportsChildren: 'يدعم ~', children: 'طفلاً (أطفال)',
    socialGuarantees: 'ضمانات اجتماعية', healthCoverage: 'تغطية صحية', basicGuarantees: 'ضمانات أساسية', healthInsurance: 'تأمين صحي وإجازات مدفوعة',
    producerData: '📊 بيانات المنتج', sectorEstimate: '📈 تقدير قطاعي', ethimarketModel: '📊 نموذج EthiMarket',
    disclaimerLabel: 'إشعار الشفافية:', disclaimer: 'تُحسب الآثار على أساس البيانات المعلنة من المنتج وعوامل الانبعاث المعترف بها دولياً (ADEME Base Carbone®، GHG Protocol، Water Footprint Network، IBAT وFAO). النتائج تقديرات إرشادية قابلة للتدقيق.',
    basedOnFarm: 'على مساحة المزرعة المرتبطة', basedOnDensities: 'بناءً على الكثافات الإقليمية (IBAT)', basedOnImpact: 'بناءً على أثر المزرعة المحسوب',
  },
  technical: {
    sectionTitle: 'تفاصيل تقنية', characteristics: 'الخصائص',
    farmingMethod: 'طريقة الزراعة', notProvided: 'غير مذكور', basePrice: 'السعر الأساسي',
    minQty: 'الكمية الدنيا', monthlyCapacity: 'الطاقة الشهرية', deliveryTime: 'مدة التسليم', days: 'أيام',
    tabPackaging: 'التعبئة', tabNutrition: 'التحليل الغذائي', tabStorage: 'التخزين',
    country: 'بلد المنشأ', stockAvailable: 'المخزون المتاح', certifications: 'الشهادات', none: 'لا شيء',
    pkgType: 'النوع', pkgTypeVal: 'أكياس جوت 60 كغ', pkgMaterial: 'التعبئة', pkgMaterialVal: 'قابلة لإعادة التدوير والتحلل',
    pkgLabeling: 'الوسم', pkgLabelingVal: 'متعدد اللغات (FR، EN، AR)', pkgUnitWeight: 'الوزن للوحدة',
    humidity: 'الرطوبة', density: 'الكثافة', scaScore: 'نقاط SCA', fullReport: 'التقرير الكامل', downloadPdf: 'تحميل PDF',
    temperature: 'درجة الحرارة', shelfLife: 'مدة الصلاحية', months: 'شهراً', awayFrom: 'يُحفظ بعيداً عن', awayFromVal: 'الضوء المباشر، الحرارة',
  },
};

export const PRODUCT_PAGE_CONTENT: PerLocale<ProductPageContent> = { fr, en, es, pt, ar };
