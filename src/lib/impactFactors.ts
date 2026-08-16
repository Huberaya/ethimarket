// =============================================================
// EthiMarket — Référentiel de facteurs d'impact SOURCÉS
//
// Chaque facteur porte sa source, son année et son incertitude.
// Références utilisées :
//  * GHG Protocol — Product Life Cycle Accounting & Reporting
//    Standard (structure du calcul : production → transport →
//    emballage, périmètre "cradle-to-customer").
//  * ADEME Base Carbone® / Agribalyse 3.1 (facteurs transport,
//    emballages, produits agricoles).
//  * Poore & Nemecek 2018, "Reducing food's environmental impacts
//    through producers and consumers", Science 360:987-992
//    (moyennes mondiales par denrée, ACV multi-fermes).
//  * Water Footprint Network — Mekonnen & Hoekstra 2011,
//    "The green, blue and grey water footprint of crops and
//    derived crop products" (L/kg, moyennes mondiales).
//  * Clark & Tilman 2017, Environ. Res. Lett. (méta-analyse
//    bio vs conventionnel : écart GES par kg modeste, ~±10%).
//
// RÈGLE D'HONNÊTETÉ : ces facteurs sont des moyennes sectorielles.
// Ils sont TOUJOURS présentés comme des estimations tant qu'une
// ACV spécifique au produit n'a pas été fournie par le producteur.
// =============================================================

export interface SourcedFactor {
  value: number;
  unit: string;
  source: string;
  year: number;
  /** Incertitude indicative (± %) des moyennes sectorielles */
  uncertaintyPct: number;
  note?: string;
}

export interface ProductionFactorEntry {
  /** kg CO2e / kg produit, du champ au produit transformé (moyenne mondiale) */
  conv: SourcedFactor;
  /**
   * Réduction appliquée si certifié bio. Les méta-analyses (Clark &
   * Tilman 2017 ; Mondelaers et al. 2009) montrent un écart PAR KG
   * modeste (±10%) — pas les ×3-4 du marketing.
   */
  organicReductionPct: number;
  organicReductionSource: string;
}

export interface WaterFactorEntry {
  /** L / kg produit — empreinte totale (verte + bleue + grise), moyenne mondiale */
  total: SourcedFactor;
  /** Répartition WFN (somme = 100) */
  greenPct: number;
  bluePct: number;
  greyPct: number;
  /**
   * Le bio réduit surtout l'eau GRISE (volume nécessaire pour diluer
   * les polluants — engrais/pesticides de synthèse interdits en bio).
   * Réduction appliquée à la seule composante grise.
   */
  organicGreyReductionPct: number;
}

// -------------------------------------------------------------
// 1. PRODUCTION — kg CO2e / kg (cradle-to-processed)
// -------------------------------------------------------------
export const PRODUCTION_FACTORS_SOURCED: Record<string, ProductionFactorEntry> = {
  coffee: {
    conv: { value: 16.5, unit: 'kg CO2e/kg', source: 'Poore & Nemecek 2018, Science (moyenne mondiale café torréfié)', year: 2018, uncertaintyPct: 40 },
    organicReductionPct: 10,
    organicReductionSource: 'Clark & Tilman 2017 (méta-analyse ACV bio/conventionnel)',
  },
  cocoa: {
    conv: { value: 6.5, unit: 'kg CO2e/kg', source: 'Agribalyse 3.1 / Poore & Nemecek 2018 (fèves de cacao hors changement d\'affectation des sols)', year: 2018, uncertaintyPct: 50, note: 'Peut dépasser 20 kg CO2e/kg si déforestation (LUC) — non applicable aux coopératives agroforestières vérifiées.' },
    organicReductionPct: 10,
    organicReductionSource: 'Clark & Tilman 2017',
  },
  tea: {
    conv: { value: 8.0, unit: 'kg CO2e/kg', source: 'Agribalyse 3.1 (thé sec, moyenne)', year: 2023, uncertaintyPct: 40 },
    organicReductionPct: 10,
    organicReductionSource: 'Clark & Tilman 2017',
  },
  spices: {
    conv: { value: 4.0, unit: 'kg CO2e/kg', source: 'Agribalyse 3.1 (épices, moyenne de catégorie)', year: 2023, uncertaintyPct: 50 },
    organicReductionPct: 10,
    organicReductionSource: 'Clark & Tilman 2017',
  },
  vanilla: {
    conv: { value: 12.0, unit: 'kg CO2e/kg', source: 'Estimation sectorielle (culture intensive en main-d\'œuvre, peu de données ACV publiques)', year: 2023, uncertaintyPct: 60, note: 'Donnée publique limitée — estimation prudente.' },
    organicReductionPct: 10,
    organicReductionSource: 'Clark & Tilman 2017',
  },
  oils: {
    conv: { value: 5.0, unit: 'kg CO2e/kg', source: 'Agribalyse 3.1 (huiles végétales : olive ~4,5 ; coco ~3,5 ; argan est.)', year: 2023, uncertaintyPct: 40 },
    organicReductionPct: 10,
    organicReductionSource: 'Clark & Tilman 2017',
  },
  dried_fruits: {
    conv: { value: 4.0, unit: 'kg CO2e/kg', source: 'Agribalyse 3.1 (fruits séchés, moyenne)', year: 2023, uncertaintyPct: 40 },
    organicReductionPct: 10,
    organicReductionSource: 'Clark & Tilman 2017',
  },
  honey: {
    conv: { value: 1.8, unit: 'kg CO2e/kg', source: 'Agribalyse 3.1 (miel)', year: 2023, uncertaintyPct: 40 },
    organicReductionPct: 5,
    organicReductionSource: 'Écart faible en apiculture (Clark & Tilman 2017)',
  },
  cereals: {
    conv: { value: 3.0, unit: 'kg CO2e/kg', source: 'Agribalyse 3.1 (quinoa ~5 ; céréales ~1,5 ; moyenne catégorie)', year: 2023, uncertaintyPct: 50 },
    organicReductionPct: 10,
    organicReductionSource: 'Clark & Tilman 2017',
  },
  cosmetics: {
    conv: { value: 5.0, unit: 'kg CO2e/kg', source: 'Base Carbone® ADEME (produits cosmétiques, ordre de grandeur)', year: 2023, uncertaintyPct: 60 },
    organicReductionPct: 10,
    organicReductionSource: 'Clark & Tilman 2017',
  },
};

// -------------------------------------------------------------
// 2. TRANSPORT — kg CO2e / tonne.km (ADEME Base Carbone®)
// -------------------------------------------------------------
export const TRANSPORT_FACTORS_SOURCED: Record<string, SourcedFactor> = {
  air: { value: 0.602, unit: 'kg CO2e/t.km', source: 'ADEME Base Carbone® — avion cargo long-courrier (hors trainées)', year: 2023, uncertaintyPct: 30 },
  sea: { value: 0.016, unit: 'kg CO2e/t.km', source: 'ADEME Base Carbone® — porte-conteneurs transocéanique', year: 2023, uncertaintyPct: 30 },
  road: { value: 0.08, unit: 'kg CO2e/t.km', source: 'ADEME Base Carbone® — poids lourd articulé 40t, charge moyenne', year: 2023, uncertaintyPct: 30 },
  rail: { value: 0.023, unit: 'kg CO2e/t.km', source: 'ADEME Base Carbone® — fret ferroviaire (mix diesel/électrique)', year: 2023, uncertaintyPct: 40 },
};
// Alias pratiques
export const TRANSPORT_ALIASES: Record<string, keyof typeof TRANSPORT_FACTORS_SOURCED> = {
  air: 'air', dhl: 'air', ups: 'air', avion: 'air',
  sea: 'sea', maritime: 'sea', bateau: 'sea',
  road: 'road', routier: 'road', camion: 'road',
  rail: 'rail', train: 'rail', ferroviaire: 'rail',
};

// -------------------------------------------------------------
// 3. EMBALLAGE — kg CO2e / kg de matériau (ADEME Base Carbone®)
// -------------------------------------------------------------
export const PACKAGING_FACTORS_SOURCED: Record<string, SourcedFactor> = {
  jute: { value: 0.55, unit: 'kg CO2e/kg', source: 'ADEME Base Carbone® — fibres naturelles (ordre de grandeur)', year: 2023, uncertaintyPct: 50 },
  cardboard_recycled: { value: 0.7, unit: 'kg CO2e/kg', source: 'ADEME Base Carbone® — carton recyclé', year: 2023, uncertaintyPct: 30 },
  paper: { value: 0.9, unit: 'kg CO2e/kg', source: 'ADEME Base Carbone® — papier kraft', year: 2023, uncertaintyPct: 30 },
  plastic: { value: 2.5, unit: 'kg CO2e/kg', source: 'ADEME Base Carbone® — plastique vierge (PET/PEHD moyen)', year: 2023, uncertaintyPct: 30 },
  plastic_recycled: { value: 1.4, unit: 'kg CO2e/kg', source: 'ADEME Base Carbone® — plastique recyclé', year: 2023, uncertaintyPct: 35 },
  glass: { value: 1.0, unit: 'kg CO2e/kg', source: 'ADEME Base Carbone® — verre d\'emballage', year: 2023, uncertaintyPct: 25 },
  other: { value: 1.0, unit: 'kg CO2e/kg', source: 'Valeur conservatrice par défaut', year: 2023, uncertaintyPct: 60 },
};
export const PACKAGING_ALIASES: Record<string, keyof typeof PACKAGING_FACTORS_SOURCED> = {
  'jute biodégradable': 'jute', jute: 'jute',
  'carton recyclé': 'cardboard_recycled', cardboard: 'cardboard_recycled',
  'sac papier': 'paper', paper: 'paper',
  'plastique recyclable': 'plastic_recycled', plastic: 'plastic',
  verre: 'glass', glass: 'glass',
  autre: 'other', other: 'other',
};
/** Hypothèse de masse d'emballage : 5% du poids produit (GHG Protocol : à documenter) */
export const PACKAGING_MASS_RATIO = 0.05;

// -------------------------------------------------------------
// 4. EAU — Water Footprint Network (Mekonnen & Hoekstra 2011)
//    L / kg, moyennes mondiales verte+bleue+grise
// -------------------------------------------------------------
const WFN = 'Water Footprint Network — Mekonnen & Hoekstra 2011';
export const WATER_FACTORS_SOURCED: Record<string, WaterFactorEntry> = {
  coffee: {
    total: { value: 18900, unit: 'L/kg', source: `${WFN} (café torréfié)`, year: 2011, uncertaintyPct: 30 },
    greenPct: 96, bluePct: 1, greyPct: 3,
    organicGreyReductionPct: 60,
  },
  cocoa: {
    total: { value: 19928, unit: 'L/kg', source: `${WFN} (fèves de cacao)`, year: 2011, uncertaintyPct: 30 },
    greenPct: 98, bluePct: 1, greyPct: 1,
    organicGreyReductionPct: 60,
  },
  tea: {
    total: { value: 8860, unit: 'L/kg', source: `${WFN} (thé noir/vert sec)`, year: 2011, uncertaintyPct: 30 },
    greenPct: 82, bluePct: 8, greyPct: 10,
    organicGreyReductionPct: 60,
  },
  spices: {
    total: { value: 7600, unit: 'L/kg', source: `${WFN} (poivre 7 611 L/kg, proxy catégorie épices)`, year: 2011, uncertaintyPct: 40 },
    greenPct: 85, bluePct: 5, greyPct: 10,
    organicGreyReductionPct: 60,
  },
  vanilla: {
    total: { value: 126505, unit: 'L/kg', source: `${WFN} (gousses de vanille — culture la plus intensive en eau du référentiel)`, year: 2011, uncertaintyPct: 40 },
    greenPct: 87, bluePct: 5, greyPct: 8,
    organicGreyReductionPct: 60,
  },
  oils: {
    total: { value: 14400, unit: 'L/kg', source: `${WFN} (huile d'olive 14 431 L/kg ; coco 4 490 L/kg — moyenne catégorie)`, year: 2011, uncertaintyPct: 45 },
    greenPct: 83, bluePct: 7, greyPct: 10,
    organicGreyReductionPct: 60,
  },
  dried_fruits: {
    total: { value: 5000, unit: 'L/kg', source: `${WFN} (fruits séchés, ordre de grandeur : dattes 2 277, figues sèches +)` , year: 2011, uncertaintyPct: 50 },
    greenPct: 80, bluePct: 12, greyPct: 8,
    organicGreyReductionPct: 60,
  },
  honey: {
    total: { value: 50, unit: 'L/kg', source: 'Non couvert par le WFN (consommation d\'eau directe négligeable en apiculture) — estimation', year: 2023, uncertaintyPct: 80, },
    greenPct: 60, bluePct: 30, greyPct: 10,
    organicGreyReductionPct: 30,
  },
  cereals: {
    total: { value: 2500, unit: 'L/kg', source: `${WFN} (blé 1 827 L/kg ; quinoa supérieur — moyenne catégorie)`, year: 2011, uncertaintyPct: 40 },
    greenPct: 84, bluePct: 6, greyPct: 10,
    organicGreyReductionPct: 60,
  },
  cosmetics: {
    total: { value: 3000, unit: 'L/kg', source: 'Hors périmètre WFN — estimation matières premières végétales', year: 2023, uncertaintyPct: 70 },
    greenPct: 75, bluePct: 10, greyPct: 15,
    organicGreyReductionPct: 60,
  },
};

// -------------------------------------------------------------
// 5. Métadonnées de méthodologie (affichées à l'utilisateur)
// -------------------------------------------------------------
export const IMPACT_METHODOLOGY = {
  carbon: {
    standard: 'GHG Protocol — Product Life Cycle Accounting & Reporting Standard',
    scope: 'Cradle-to-customer : production agricole + transformation, transport international, emballage. Hors distribution finale et fin de vie.',
    factorSources: ['ADEME Base Carbone® / Agribalyse 3.1', 'Poore & Nemecek 2018 (Science)', 'Clark & Tilman 2017 (écart bio/conventionnel)'],
    disclaimer: 'Estimations basées sur des moyennes sectorielles mondiales (incertitude ±30-60% selon les catégories). Remplacées par les données d\'ACV spécifiques dès que le producteur les fournit.',
  },
  water: {
    standard: 'Water Footprint Assessment (Hoekstra et al. 2011)',
    scope: 'Empreinte eau totale = verte (pluie) + bleue (irrigation) + grise (dilution des polluants).',
    factorSources: ['Mekonnen & Hoekstra 2011 — moyennes mondiales par culture'],
    disclaimer: 'L\'agriculture biologique réduit principalement l\'eau grise (pas d\'intrants de synthèse à diluer) — l\'eau verte, majoritaire, dépend du climat, pas du mode de culture.',
  },
} as const;
