// =============================================================
// EthiMarket Search Engine V2 — Types
// 17 facettes : bio, origine, fabrication, matières premières,
// distance, carbone, social, salaire décent, équitable, recyclé,
// vegan, emballage, MOQ, prix, délai, fournisseur, score confiance
// =============================================================

export type SearchIntent = 'standard_search' | 'alternative_search' | 'comparison_search';

export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Résultat du parsing d'une requête en langage naturel (couche 1 + 2 fusionnées) */
export interface ParsedQueryV2 {
  rawQuery: string;
  intent: SearchIntent;

  // Références (pour alternatives / comparaisons)
  referenceSupplier?: string;
  referenceProduct?: string;
  comparisonTargets?: string[];

  // Produit
  productType?: string;
  gender?: 'homme' | 'femme' | 'enfant' | 'bebe' | 'unisexe';
  materials: string[];

  // Certifications & éthique
  certifications: string[];

  // Géographie — 3 niveaux distincts
  originCountries: string[];          // pays du produit
  manufacturingCountries: string[];   // "fabriqué en X"
  rawMaterialCountries: string[];     // "coton d'Inde"
  regions: string[];                  // Europe, Afrique, Local…
  maxDistanceKm?: number;             // "moins de 500 km"

  // Commercial
  minPrice?: number;
  maxPrice?: number;
  currency: 'EUR' | 'USD' | 'GBP';
  maxMoq?: number;
  maxDeliveryDays?: number;

  // Environnement & social (filtres durs)
  maxCarbonKg?: number;
  minRecycledPercent?: number;
  minTrustScore?: number;
  flags: {
    vegan: boolean;
    recycled: boolean;
    fairTrade: boolean;
    livingWage: boolean;
    socialConditions: boolean;
    organicOnly: boolean;
    fullTraceability: boolean;
    plasticFreePackaging: boolean;
    compostablePackaging: boolean;
    recyclablePackaging: boolean;
    bulkPackaging: boolean;
    cooperative: boolean;
  };

  // Priorités de CLASSEMENT (pas des filtres)
  priorities: {
    cheaper: boolean;
    lowerCarbon: boolean;
    betterTraceability: boolean;
    fasterDelivery: boolean;
    higherTrust: boolean;
  };

  freeTextKeywords: string[];
  confidence: number;     // 0..1
  parserSource: 'zero-api' | 'llm' | 'merged';
}

/** Modèle produit V2 (superset du Product Supabase existant) */
export interface ProductV2 {
  id: string;
  name: string;
  description?: string;
  product_type?: string;
  category_id?: string;
  target_gender?: string;

  price: number;
  currency?: string;
  moq?: number;
  delivery_days?: number;
  stock_value?: number;

  supplier_id?: string;
  supplier_name?: string;

  origin_country?: string;
  manufacturing_country?: string;
  raw_material_countries?: string[];
  region?: string;
  gps?: GeoPoint;

  materials?: string[];
  certifications?: string[];

  carbon_footprint_kg?: number;
  recycled_percent?: number;
  is_vegan?: boolean;
  is_recycled?: boolean;
  fair_trade?: boolean;
  living_wage_guaranteed?: boolean;
  social_audit_passed?: boolean;
  no_child_labor_verified?: boolean;
  cooperative?: boolean;

  packaging?: {
    plastic_free?: boolean;
    compostable?: boolean;
    recyclable?: boolean;
    bulk_available?: boolean;
    deposit_system?: boolean;
  };

  traceability_score?: number;   // 0-100
  trust_score?: number;          // 0-100 (score de confiance EthiMarket)
  product_score?: number;        // 0-100 (score éthique global)
  rating?: number;               // 0-5
  reviews_count?: number;
}

/** Filtres structurés de la sidebar (mêmes 17 facettes, pilotées par l'UI) */
export interface StructuredFiltersV2 {
  certifications?: string[];
  originCountries?: string[];
  manufacturingCountries?: string[];
  rawMaterialCountries?: string[];
  regions?: string[];
  maxDistanceKm?: number;
  userLocation?: GeoPoint;
  maxCarbonKg?: number;
  socialConditions?: boolean;
  livingWage?: boolean;
  fairTrade?: boolean;
  recycled?: boolean;
  minRecycledPercent?: number;
  vegan?: boolean;
  packaging?: ('plastic_free' | 'compostable' | 'recyclable' | 'bulk' | 'deposit')[];
  maxMoq?: number;
  minPrice?: number;
  maxPrice?: number;
  maxDeliveryDays?: number;
  supplierName?: string;
  minTrustScore?: number;
  gender?: ParsedQueryV2['gender'] | 'all';
  materials?: string[];
  inStockOnly?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'carbon' | 'trust' | 'traceability' | 'delivery' | 'distance' | 'rating';
  limit?: number;
  offset?: number;
}

export interface ScoredResult extends ProductV2 {
  searchScore: number;
  matchReasons: string[];
  distanceKm?: number;
}

export interface AlternativeResult {
  product: ScoredResult;
  reference?: ProductV2;
  priceDiffPct: number;
  carbonDiffPct: number;
  traceabilityDiff: number;
  trustDiff: number;
  advantages: string[];
  tradeoffs: string[];
  reason: string;
}

export interface SearchResponseV2 {
  results: ScoredResult[];
  alternatives?: AlternativeResult[];
  totalCount: number;
  parsedQuery: ParsedQueryV2;
  executionTimeMs: number;
  appliedHardFilters: string[];
  facetCounts: Record<string, { label: string; count: number }[]>;
}
