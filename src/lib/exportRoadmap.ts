// =============================================================
// EthiMarket — Feuille de route export vers l'Europe
//
// Chantier 4 : vérification phytosanitaire et étapes pour que le
// produit atteigne l'Europe (réglementation UE réelle).
// Chantier 6 : logistique — comment le produit arrive à l'acheteur.
//
// Moteur local et déterministe : catégorie de produit + pays
// d'origine → liste d'étapes documentées avec les VRAIS documents
// exigés (certificat phytosanitaire, COI bio, EUR.1/SPG, DDS
// déforestation…). Sources : règlements UE 2016/2031 (santé des
// végétaux), 2018/848 (bio, certificat COI via TRACES),
// 2023/1115 (déforestation EUDR), 2017/625 (contrôles officiels).
//
// HONNÊTETÉ : ceci est une feuille de route d'orientation, pas un
// conseil réglementaire personnalisé — chaque étape cite qui la
// délivre et où se renseigner.
// =============================================================

export type ExportStage = 'origin' | 'transport' | 'eu_border' | 'delivery';

export interface ExportStep {
  stage: ExportStage;
  title: string;
  detail: string;
  /** Qui délivre / qui fait */
  actor: string;
  /** Obligatoire ou selon le cas */
  required: 'always' | 'conditional';
  condition?: string;
}

export interface LogisticsOption {
  mode: 'sea_fcl' | 'sea_lcl' | 'air' | 'road';
  label: string;
  bestFor: string;
  transitDays: [number, number];   // fourchette indicative
  co2Note: string;
  costNote: string;
}

export interface ExportRoadmap {
  productCategory: string;
  isPlantBased: boolean;
  needsPhyto: boolean;
  eudrConcerned: boolean;
  steps: ExportStep[];
  logistics: LogisticsOption[];
  incotermsHint: string;
}

/** Catégories végétales soumises au certificat phytosanitaire UE (régl. 2016/2031). */
const PHYTO_CATEGORIES = new Set([
  'coffee_green', 'cocoa', 'spices_raw', 'cereals', 'dried_fruits', 'fresh_produce', 'seeds', 'vanilla', 'tea_leaves',
]);

/** Produits concernés par le règlement déforestation EUDR 2023/1115. */
const EUDR_CATEGORIES = new Set(['coffee_green', 'coffee_roasted', 'cocoa']);

/** Mappe le type de produit plateforme vers une catégorie export. */
export function exportCategory(productType: string | null | undefined): string {
  const s = (productType ?? '').toLowerCase();
  if (/café vert|green coffee/.test(s)) return 'coffee_green';
  if (/café|coffee/.test(s)) return 'coffee_green'; // prudent : le vert domine le B2B
  if (/cacao|cocoa/.test(s)) return 'cocoa';
  if (/thé|tea/.test(s)) return 'tea_leaves';
  if (/vanille|vanilla/.test(s)) return 'vanilla';
  if (/épice|spice|poivre|curcuma|gingembre|safran|cannelle|cardamome/.test(s)) return 'spices_raw';
  if (/miel|honey/.test(s)) return 'honey';
  if (/huile|oil/.test(s)) return 'oils';
  if (/quinoa|riz|fonio|céréale|sésame|graine/.test(s)) return 'cereals';
  if (/frais|fruit|légume|mangue|ananas|banane/.test(s)) return 'fresh_produce';
  if (/spiruline|cosmétique|savon|beurre/.test(s)) return 'processed';
  return 'processed';
}

/**
 * Construit la feuille de route export UE. Fonction PURE.
 * @param productType type de produit (libellé plateforme)
 * @param isOrganic   le produit est-il vendu comme bio ?
 * @param isAnimal    produit d'origine animale (miel) ?
 */
export function buildExportRoadmap(productType: string, isOrganic: boolean): ExportRoadmap {
  const cat = exportCategory(productType);
  const isHoney = cat === 'honey';
  const needsPhyto = PHYTO_CATEGORIES.has(cat);
  const eudr = EUDR_CATEGORIES.has(cat);
  const steps: ExportStep[] = [];

  // ---------- ÉTAPE PAYS D'ORIGINE ----------
  steps.push({
    stage: 'origin', required: 'always',
    title: 'Enregistrement exportateur',
    detail: 'L\'entreprise doit être enregistrée comme exportateur auprès des autorités de son pays (licence export, numéro d\'exportateur). Souvent via le ministère du commerce ou l\'agence des exportations.',
    actor: 'Autorité nationale du commerce extérieur',
  });

  if (needsPhyto) {
    steps.push({
      stage: 'origin', required: 'always',
      title: 'Certificat phytosanitaire',
      detail: 'Obligatoire pour les végétaux et produits végétaux non transformés entrant dans l\'UE (règlement 2016/2031). Délivré par l\'Organisation Nationale de Protection des Végétaux (ONPV) du pays d\'origine après inspection du lot : absence d\'organismes nuisibles, conformité au traitement éventuel. À demander AVANT l\'expédition, valable pour un envoi précis.',
      actor: 'ONPV du pays d\'origine (service phytosanitaire du ministère de l\'agriculture)',
    });
  }
  if (isHoney) {
    steps.push({
      stage: 'origin', required: 'always',
      title: 'Certificat sanitaire (produit animal) + pays listé',
      detail: 'Le miel est un produit d\'origine animale : le pays d\'origine doit figurer sur la liste UE des pays tiers autorisés pour le miel (avec plan de surveillance des résidus approuvé), et chaque lot doit être accompagné d\'un certificat sanitaire officiel. Entrée dans l\'UE uniquement par un poste de contrôle frontalier (PCF) avec préavis CHED-P dans TRACES.',
      actor: 'Autorité vétérinaire du pays d\'origine',
    });
  }
  if (isOrganic) {
    steps.push({
      stage: 'origin', required: 'always',
      title: 'Certificat d\'inspection bio (COI) dans TRACES',
      detail: 'Pour vendre en bio dans l\'UE (règlement 2018/848) : le producteur doit être certifié par un organisme reconnu par l\'UE pour son pays, et CHAQUE lot importé doit être couvert par un COI (Certificate of Inspection) émis électroniquement dans TRACES par l\'organisme certificateur AVANT le départ, puis visé au point d\'entrée. Sans COI : le produit entre, mais PAS en bio.',
      actor: 'Organisme certificateur bio (via TRACES NT)',
    });
  }
  if (eudr) {
    steps.push({
      stage: 'origin', required: 'always',
      title: 'Diligence déforestation (EUDR) — géolocalisation des parcelles',
      detail: 'Café et cacao sont couverts par le règlement UE 2023/1115 : l\'importateur doit déposer une déclaration de diligence raisonnée (DDS) prouvant que la marchandise n\'est pas issue de terres déboisées après le 31/12/2020 — avec les coordonnées GPS de CHAQUE parcelle de production. Les coordonnées GPS déjà collectées par EthiMarket (défis photo, dossier producteur) alimentent directement cette exigence.',
      actor: 'Importateur UE (données fournies par le producteur)',
    });
  }
  steps.push({
    stage: 'origin', required: 'always',
    title: 'Facture commerciale + liste de colisage + certificat d\'origine',
    detail: 'Facture (valeur, Incoterm), packing list (poids, colis), et certificat d\'origine. Pour de nombreux pays en développement, le formulaire d\'origine préférentielle (SPG/REX ou EUR.1 selon l\'accord) réduit ou annule les droits de douane UE — souvent 0 % pour café vert, cacao et épices.',
    actor: 'Exportateur + chambre de commerce locale',
  });

  // ---------- TRANSPORT ----------
  steps.push({
    stage: 'transport', required: 'always',
    title: 'Réservation du fret + document de transport',
    detail: 'Maritime : connaissement (Bill of Lading). Aérien : lettre de transport aérien (AWB). Le transitaire (freight forwarder) gère la réservation, l\'empotage et les formalités portuaires. Pour un premier export, passer par un transitaire est fortement recommandé.',
    actor: 'Transitaire / compagnie',
  });
  steps.push({
    stage: 'transport', required: 'always',
    title: 'Assurance transport',
    detail: 'Assurance de la marchandise (tous risques ou FPA selon la valeur). Si l\'Incoterm est CIF/CIP, elle est à la charge du vendeur ; en FOB/FCA, à celle de l\'acheteur.',
    actor: 'Assureur (via le transitaire généralement)',
  });

  // ---------- FRONTIÈRE UE ----------
  steps.push({
    stage: 'eu_border', required: 'always',
    title: 'Déclaration en douane (importateur avec n° EORI)',
    detail: 'L\'importateur UE (l\'acheteur ou son représentant) doit disposer d\'un numéro EORI et déposer la déclaration d\'importation. Droits de douane selon le code SH et l\'origine préférentielle + TVA du pays d\'entrée.',
    actor: 'Importateur / représentant en douane',
  });
  if (needsPhyto || isHoney) {
    steps.push({
      stage: 'eu_border', required: 'always',
      title: 'Contrôle officiel au point d\'entrée (CHED dans TRACES)',
      detail: needsPhyto
        ? 'Préavis d\'arrivée via un document sanitaire commun d\'entrée (CHED-PP) dans TRACES ; contrôle documentaire systématique, contrôles physiques/identité par sondage. Certains produits à risque (selon origine) subissent des contrôles renforcés avec analyses (pesticides, aflatoxines pour épices et arachides…).'
        : 'Entrée par poste de contrôle frontalier (PCF) uniquement, préavis CHED-P dans TRACES, contrôle vétérinaire.',
      actor: 'Poste de contrôle frontalier de l\'État membre d\'entrée',
    });
  }
  if (isOrganic) {
    steps.push({
      stage: 'eu_border', required: 'always',
      title: 'Visa du COI bio à l\'entrée',
      detail: 'L\'autorité compétente du point d\'entrée vise le COI dans TRACES avant la mise en libre pratique en tant que produit biologique.',
      actor: 'Autorité de contrôle bio du point d\'entrée',
    });
  }
  steps.push({
    stage: 'eu_border', required: 'conditional',
    condition: 'Denrées alimentaires (toutes)',
    title: 'Conformité sécurité alimentaire UE',
    detail: 'L\'importateur est responsable de la conformité : limites de résidus de pesticides (règl. 396/2005), contaminants (aflatoxines, ochratoxine A — critiques pour épices, café, fruits secs), étiquetage UE (règl. 1169/2011). Recommandé : analyse laboratoire du lot AVANT expédition (bulletin d\'analyse joint au dossier).',
    actor: 'Importateur (analyses : laboratoire accrédité)',
  });

  // ---------- LIVRAISON FINALE ----------
  steps.push({
    stage: 'delivery', required: 'always',
    title: 'Post-acheminement jusqu\'à l\'acheteur',
    detail: 'Du port/aéroport d\'arrivée à l\'entrepôt de l\'acheteur : camion (route) organisé par le transitaire ou l\'acheteur selon l\'Incoterm. Réception : l\'acheteur contrôle la marchandise et confirme la réception sur EthiMarket (déclenche la clôture de la commande).',
    actor: 'Transitaire / transporteur routier',
  });

  // ---------- OPTIONS LOGISTIQUES ----------
  const logistics: LogisticsOption[] = [
    {
      mode: 'sea_fcl', label: 'Maritime — conteneur complet (FCL)',
      bestFor: 'Volumes ≥ 10 tonnes (café, cacao, céréales). Le standard du B2B agroalimentaire.',
      transitDays: [20, 45],
      co2Note: 'Le plus sobre : ~0,016 kg CO2e/t.km (ADEME) — cohérent avec le calcul d\'impact EthiMarket.',
      costNote: 'Coût/kg le plus bas à volume. Conteneur 20\' ventilé recommandé pour le café vert.',
    },
    {
      mode: 'sea_lcl', label: 'Maritime — groupage (LCL)',
      bestFor: 'Volumes 0,5 à 10 tonnes : on partage un conteneur. Idéal pour les premières commandes.',
      transitDays: [25, 55],
      co2Note: 'Sobre (maritime), léger surcoût de manutention.',
      costNote: 'Facturé au m³/tonne. Attention aux frais fixes de dégroupage à l\'arrivée.',
    },
    {
      mode: 'air', label: 'Aérien',
      bestFor: 'Produits à très forte valeur/kg (safran, vanille) ou échantillons — jamais pour le vrac.',
      transitDays: [2, 7],
      co2Note: '~37× plus émetteur que le maritime (0,602 vs 0,016 kg CO2e/t.km) — impact affiché sur la fiche produit.',
      costNote: 'Coût élevé au kg ; pertinent quand la valeur au kg dépasse largement le fret.',
    },
    {
      mode: 'road', label: 'Routier (origines proches : Maroc, Tunisie, Turquie)',
      bestFor: 'Origines méditerranéennes vers l\'Europe : camion complet ou groupage.',
      transitDays: [3, 10],
      co2Note: '~0,08 kg CO2e/t.km — intermédiaire.',
      costNote: 'Compétitif sur les courtes distances ; formalités de transit (TIR) gérées par le transporteur.',
    },
  ];

  return {
    productCategory: cat,
    isPlantBased: needsPhyto,
    needsPhyto,
    eudrConcerned: eudr,
    steps,
    logistics,
    incotermsHint:
      'Incoterms conseillés pour débuter : FOB (port d\'origine) — le producteur gère jusqu\'au navire, l\'acheteur maîtrise fret et assurance ; ou CIF (port UE) si le producteur a un bon transitaire. Éviter EXW (tout repose sur l\'acheteur dans un pays qu\'il ne connaît pas) et DDP (trop lourd pour le producteur).',
  };
}

/** Étapes groupées par phase, pour l'affichage. Fonction pure. */
export function groupStepsByStage(roadmap: ExportRoadmap): { stage: ExportStage; label: string; emoji: string; steps: ExportStep[] }[] {
  const stages: { stage: ExportStage; label: string; emoji: string }[] = [
    { stage: 'origin', label: 'Au pays d\'origine', emoji: '🌍' },
    { stage: 'transport', label: 'Transport international', emoji: '🚢' },
    { stage: 'eu_border', label: 'Entrée dans l\'Union européenne', emoji: '🇪🇺' },
    { stage: 'delivery', label: 'Livraison à l\'acheteur', emoji: '📦' },
  ];
  return stages.map(s => ({ ...s, steps: roadmap.steps.filter(st => st.stage === s.stage) }));
}
