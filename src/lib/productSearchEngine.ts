// src/lib/productSearchEngine.ts
// Multi-criteria 17-facet Search & Hybrid Scoring Engine for EthiMarket
// Client-side fallback (< 50 ms over 5,000 items) + Supabase RPC integration

import { supabase, Product } from './supabase';
import { PRODUCT_TYPES_DICT } from './nlpSearchDictionaries';
import {
  parseNaturalLanguageQuery,
  ParsedSearchQuery,
  normalizeText,
  calculateHaversineDistanceKm,
  PackagingType
} from './naturalLanguageSearchService';

export interface StructuredFilters {
  query?: string;
  category_id?: string;
  product_types?: string[];
  materials?: string[];
  
  // 17 Mandatory Facets
  certifications?: string[];           // Facet 1
  countries?: string[];                // Facet 2 (origin)
  manufacturingCountries?: string[];   // Facet 3 (manufacturing)
  rawMaterialsOrigins?: string[];      // Facet 4 (raw materials)
  maxDistanceKm?: number;              // Facet 5 (distance)
  userLatitude?: number;
  userLongitude?: number;
  maxCo2Kg?: number;                   // Facet 6 (carbon)
  socialConditionsRequired?: boolean;  // Facet 7 (social conditions)
  livingWageRequired?: boolean;        // Facet 8 (living wage)
  fairTradeRequired?: boolean;         // Facet 9 (fair trade)
  isRecycled?: boolean;                // Facet 10 (recycled)
  minRecycledPercent?: number;
  isVegan?: boolean;                   // Facet 11 (vegan)
  packagingTypes?: PackagingType[];    // Facet 12 (packaging)
  maxMoq?: number;                     // Facet 13 (MOQ)
  minPrice?: number;                   // Facet 14 (min price)
  maxPrice?: number;                   // Facet 14 (max price)
  currency?: string;
  maxDeliveryDays?: number;            // Facet 15 (delivery delay)
  fastDeliveryOnly?: boolean;
  supplierName?: string;               // Facet 16 (supplier)
  producerId?: string;
  minConfidenceScore?: number;         // Facet 17 (trust score)
  
  // Supplementary filters
  gender?: 'homme' | 'femme' | 'unisexe' | 'enfant' | 'bebe';
  regions?: string[];
  inStockOnly?: boolean;
  minRating?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'distance' | 'carbon' | 'confidence' | 'delivery' | 'rating' | 'newest';
}

export type SearchResultItem = Product & {
  searchScore: number;
  rawScore?: number;
  matchReasons?: string[];
  matchType?: 'exact' | 'prefix' | 'substring' | 'category' | 'description';
  calculatedDistanceKm?: number;
};

export const POPULAR_SUGGESTIONS = [
  'Café bio équitable d\'Éthiopie',
  'Chocolat noir 70% bio',
  'T-shirt coton bio homme moins de 25€',
  'Miel de thym pur récolté à la main',
  'Huile d\'argan bio pure'
];

/**
 * Calculates Sørensen-Dice coefficient between two strings (0.0 to 1.0)
 */
export function diceSimilarity(str1: string, str2: string): number {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  if (s1 === s2) return 1.0;
  if (s1.length < 2 || s2.length < 2) return 0.0;

  const getBigrams = (str: string) => {
    const bigrams = new Map<string, number>();
    for (let i = 0; i < str.length - 1; i++) {
      const bigram = str.substring(i, i + 2);
      bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1);
    }
    return bigrams;
  };

  const b1 = getBigrams(s1);
  const b2 = getBigrams(s2);
  let intersection = 0;

  b1.forEach((count, bigram) => {
    if (b2.has(bigram)) {
      intersection += Math.min(count, b2.get(bigram)!);
    }
  });

  const total = (s1.length - 1) + (s2.length - 1);
  return (2.0 * intersection) / total;
}

/**
 * Finds best matching spelling correction from a list of product names or dictionary terms
 */
export function findSpellingCorrection(
  query: string,
  candidateNames: string[],
  threshold = 0.45
): string | undefined {
  if (!query || query.trim().length < 3) return undefined;
  const normQuery = normalizeText(query);

  let bestMatch: string | undefined;
  let highestScore = 0;

  for (const name of candidateNames) {
    const normName = normalizeText(name);
    // Exact word or name
    if (normName === normQuery) return undefined;

    const score = diceSimilarity(normQuery, normName);
    if (score > highestScore && score >= threshold) {
      highestScore = score;
      bestMatch = name;
    }
  }

  if (bestMatch && query === query.toLowerCase()) {
    return bestMatch.toLowerCase();
  }

  return bestMatch;
}


export interface EnrichedProductSearchResult {
  product: Product;
  searchScore: number;
  rawScore: number;
  matchReasons: string[];
  calculatedDistanceKm?: number;
}

export interface SearchExecutionResult {
  items: EnrichedProductSearchResult[];
  results: SearchResultItem[];
  totalCount: number;
  executionTimeMs: number;
  engineUsed: 'postgres_rpc' | 'client_fallback';
  parsedQuery: ParsedSearchQuery;
  didYouMean?: string;
  suggestedAlternatives?: string[];
}

/**
 * Maps NLP parsed query to StructuredFilters
 */
export function parsedQueryToFilters(
  parsed: ParsedSearchQuery,
  userLocation?: { lat: number; lng: number }
): StructuredFilters {
  // Le type de produit détecté ("café", "t-shirt"…) est un FILTRE DUR :
  // "je cherche du café bio" ne doit JAMAIS renvoyer d'huile de coco bio.
  const GENERIC_NOISE = new Set([
    'produit', 'produits', 'article', 'articles', 'product', 'products',
    'euro', 'euros', 'eur', 'dollar', 'dollars', 'usd', 'gbp',
    'cherche', 'recherche', 'veux', 'voudrais', 'besoin', 'acheter', 'trouver',
    'want', 'need', 'looking', 'buy', 'busco', 'quiero'
  ]);
  const usefulKeywords = parsed.residualKeywords.filter(
    k => k.length > 2 && !GENERIC_NOISE.has(k.toLowerCase())
  );
  const filters: StructuredFilters = {
    product_types: parsed.productTypeCanonical ? [parsed.productTypeCanonical] : undefined,
    query: parsed.productTypeCanonical
      ? [parsed.productTypeCanonical, ...usefulKeywords].join(' ').trim()
      : (usefulKeywords.length > 0 ? usefulKeywords.join(' ') : ''),
    certifications: parsed.certifications.length > 0 ? parsed.certifications : undefined,
    countries: parsed.countries.length > 0 ? parsed.countries : undefined,
    manufacturingCountries: parsed.manufacturingCountry ? [parsed.manufacturingCountry] : undefined,
    rawMaterialsOrigins: parsed.rawMaterialsOrigin ? [parsed.rawMaterialsOrigin] : undefined,
    maxDistanceKm: parsed.maxDistanceKm,
    userLatitude: userLocation?.lat,
    userLongitude: userLocation?.lng,
    maxCo2Kg: parsed.maxCo2Kg,
    socialConditionsRequired: parsed.socialConditions || undefined,
    livingWageRequired: parsed.livingWage || undefined,
    fairTradeRequired: parsed.fairTrade || undefined,
    isRecycled: parsed.isRecycled || undefined,
    minRecycledPercent: parsed.minRecycledPercent,
    isVegan: parsed.isVegan || undefined,
    packagingTypes: parsed.packaging.length > 0 ? parsed.packaging : undefined,
    maxMoq: parsed.maxMoq,
    minPrice: parsed.minPrice,
    maxPrice: parsed.maxPrice,
    currency: parsed.currency,
    maxDeliveryDays: parsed.maxDeliveryDays,
    fastDeliveryOnly: parsed.fastDelivery || undefined,
    supplierName: parsed.supplierName || parsed.supplierFilter,
    minConfidenceScore: parsed.minConfidenceScore,
    gender: parsed.gender,
    regions: parsed.regions.length > 0 ? parsed.regions : undefined,
    materials: parsed.materials.length > 0 ? parsed.materials : undefined
  };

  return filters;
}

/**
 * Evaluates whether a product strictly satisfies all hard filter criteria
 */
/**
 * Vérifie qu'un produit correspond au TYPE demandé ("café", "t-shirt"…)
 * via le dictionnaire de synonymes : nom, product_type, tags ou mots-clés.
 */
export function productMatchesType(product: Product, canonicalType: string): boolean {
  const dictEntry = PRODUCT_TYPES_DICT.find(
    d => normalizeText(d.canonical) === normalizeText(canonicalType) || d.id === canonicalType
  );
  const synonyms = dictEntry ? dictEntry.synonyms.map(normalizeText) : [normalizeText(canonicalType)];
  const haystacks = [
    normalizeText(product.name || ''),
    normalizeText(product.product_type || ''),
    ...(product.category_tags || []).map(t => normalizeText(t)),
    ...(product.keywords || []).map(k => normalizeText(k)),
  ];
  return synonyms.some(syn =>
    haystacks.some(h => h === syn || h.includes(syn) || new RegExp(`(^|[^a-z0-9])${syn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`).test(h))
  );
}

export function passesStrictFilters(
  product: Product,
  filters: StructuredFilters
): boolean {
  // 0. TYPE DE PRODUIT — filtre dur : "café bio" ne renvoie jamais du quinoa bio
  if (filters.product_types && filters.product_types.length > 0) {
    if (!filters.product_types.some(t => productMatchesType(product, t))) return false;
  }

  // 0bis. MATIÈRES — si demandées explicitement ("coton"), le produit doit matcher
  if (filters.materials && filters.materials.length > 0) {
    const inText = normalizeText(`${product.name || ''} ${product.description || ''} ${product.short_description || ''}`);
    const prodMaterials = ((product.attributes as Record<string, unknown> | null | undefined)?.materials as string[] | undefined || []).map(m => normalizeText(m));
    const allMatch = filters.materials.every(m => {
      const nm = normalizeText(m);
      return inText.includes(nm) || prodMaterials.some(pm => pm.includes(nm));
    });
    if (!allMatch) return false;
  }

  // 1. Price bounds
  if (filters.minPrice !== undefined && product.price < filters.minPrice) return false;
  if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false;

  // 2. MOQ constraint
  if (filters.maxMoq !== undefined) {
    const pMoq = product.moq_value || 1;
    if (pMoq > filters.maxMoq) return false;
  }

  // 3. In stock only
  if (filters.inStockOnly && (product.stock_value || 0) <= 0) return false;

  // 4. Rating constraint
  if (filters.minRating !== undefined && (product.rating || 0) < filters.minRating) return false;

  // 5. Confidence score constraint
  if (filters.minConfidenceScore !== undefined) {
    const score = product.confidence_score || product.product_score || 80;
    if (score < filters.minConfidenceScore) return false;
  }

  // 6. Carbon footprint constraint
  if (filters.maxCo2Kg !== undefined) {
    const co2 = product.carbon_footprint_kg ?? (parseFloat(product.co2_estimate || '0') || 2.5);
    if (co2 > filters.maxCo2Kg) return false;
  }

  // 7. Certifications (all required must match)
  if (filters.certifications && filters.certifications.length > 0) {
    const pCerts = (product.certifications || []).map(c => normalizeText(c));
    const hasAll = filters.certifications.every(reqCert => {
      const normReq = normalizeText(reqCert);
      return pCerts.some(pc => pc.includes(normReq) || normReq.includes(pc));
    });
    if (!hasAll) return false;
  }

  // 8. Origin Country
  if (filters.countries && filters.countries.length > 0) {
    const pCountry = normalizeText(product.country || '');
    const matchesCountry = filters.countries.some(c => {
      const normC = normalizeText(c);
      return pCountry.includes(normC) || normC.includes(pCountry);
    });
    if (!matchesCountry) return false;
  }

  // 9. Manufacturing Country
  if (filters.manufacturingCountries && filters.manufacturingCountries.length > 0) {
    const pMfg = normalizeText(product.manufacturing_country || product.attributes?.manufacturing_country || product.country || '');
    const matchesMfg = filters.manufacturingCountries.some(c => {
      const normC = normalizeText(c);
      return pMfg.includes(normC) || normC.includes(pMfg);
    });
    if (!matchesMfg) return false;
  }

  // 10. Raw Materials Origin
  if (filters.rawMaterialsOrigins && filters.rawMaterialsOrigins.length > 0) {
    const pRaw = normalizeText(product.raw_materials_origin || product.attributes?.raw_materials_origin || '');
    const matchesRaw = filters.rawMaterialsOrigins.some(c => {
      const normC = normalizeText(c);
      return pRaw.includes(normC) || normC.includes(pRaw);
    });
    if (!matchesRaw) return false;
  }

  // 11. Distance constraint (Haversine)
  if (
    filters.maxDistanceKm !== undefined &&
    filters.userLatitude !== undefined &&
    filters.userLongitude !== undefined
  ) {
    let pLat = product.producers?.latitude;
    let pLon = product.producers?.longitude;
    if ((!pLat || !pLon) && product.gps_coordinates) {
      const parts = product.gps_coordinates.split(',');
      if (parts.length === 2) {
        pLat = parseFloat(parts[0]);
        pLon = parseFloat(parts[1]);
      }
    }
    if (pLat && pLon) {
      const dist = calculateHaversineDistanceKm(filters.userLatitude, filters.userLongitude, pLat, pLon);
      if (dist > filters.maxDistanceKm) return false;
    }
  }

  // 12. Vegan
  if (filters.isVegan && !(product.is_vegan || product.attributes?.is_vegan)) {
    return false;
  }

  // 13. Recycled & Recycled percentage
  if (filters.isRecycled && !(product.is_recycled || product.attributes?.is_recycled)) {
    return false;
  }
  if (filters.minRecycledPercent !== undefined) {
    const recPct = product.recycled_percentage ?? product.attributes?.recycled_percentage ?? (product.is_recycled ? 50 : 0);
    if (recPct < filters.minRecycledPercent) return false;
  }

  // 14. Living Wage
  if (filters.livingWageRequired && !(product.living_wage_guaranteed || product.attributes?.living_wage_guaranteed)) {
    return false;
  }

  // 15. Social Conditions (social protection or child labor audit)
  if (filters.socialConditionsRequired) {
    const hasSocial = product.social_protection || product.attributes?.social_protection || product.producers?.has_insurance;
    if (!hasSocial && !product.certifications?.includes('Commerce Équitable')) return false;
  }

  // 16. Packaging types
  if (filters.packagingTypes && filters.packagingTypes.length > 0) {
    const pPack = normalizeText(product.packaging_type || product.attributes?.packaging_type || '');
    const matchesPack = filters.packagingTypes.some(pack => {
      if (pack === 'plastic_free' && (pPack.includes('sans plastique') || pPack.includes('plastic_free'))) return true;
      if (pack === 'compostable' && (pPack.includes('compostable') || pPack.includes('biodegradable'))) return true;
      if (pack === 'recyclable' && (pPack.includes('recyclable') || pPack.includes('carton'))) return true;
      if (pack === 'deposit' && (pPack.includes('consign') || pPack.includes('deposit'))) return true;
      if (pack === 'bulk' && (pPack.includes('vrac') || pPack.includes('bulk'))) return true;
      return false;
    });
    if (!matchesPack && pPack !== '') return false;
  }

  // 17. Delivery days
  if (filters.maxDeliveryDays !== undefined) {
    const daysMatch = (product.delivery_days || '').match(/(\d+)/);
    const pDays = daysMatch ? parseInt(daysMatch[1], 10) : 5;
    if (pDays > filters.maxDeliveryDays) return false;
  }

  // 18. Supplier name
  if (filters.supplierName) {
    const normSupplier = normalizeText(filters.supplierName);
    const prodName = normalizeText(product.producers?.name || '');
    if (!prodName.includes(normSupplier) && !normSupplier.includes(prodName)) return false;
  }

  // 19. Gender
  if (filters.gender) {
    const pGender = normalizeText(product.target_gender || product.attributes?.gender || 'unisexe');
    if (pGender !== 'unisexe' && pGender !== normalizeText(filters.gender)) return false;
  }

  return true;
}

/**
 * Scores a product against query and filters, generating detailed human-readable matchReasons
 */
export function scoreProductClientSide(
  product: Product,
  filters: StructuredFilters,
  userLocation?: { lat: number; lng: number }
): { rawScore: number; searchScore: number; matchReasons: string[]; calculatedDistanceKm?: number } {
  let score = 0;
  const matchReasons: string[] = [];

  const rawQuery = filters.query ? filters.query.trim() : '';
  const normQuery = normalizeText(rawQuery);
  const normName = normalizeText(product.name);
  const normCategory = normalizeText(product.categories?.name || product.product_type || '');
  const normDesc = normalizeText(product.description || '');
  const normShortDesc = normalizeText(product.short_description || '');
  const normProducer = normalizeText(product.producers?.name || '');

  // 1. Text & Hierarchical Relevance Scoring
  if (normQuery && normQuery.length > 0) {
    let textScore = 0;

    if (normName === normQuery) {
      textScore += 1000;
      matchReasons.push('Correspondance exacte du nom de produit (+1000)');
    } else if (normName.startsWith(normQuery)) {
      textScore += 500;
      matchReasons.push('Le nom commence par les termes recherchés (+500)');
    } else if (normName.includes(normQuery)) {
      textScore += 200;
      matchReasons.push('Mots clés présents dans le titre (+200)');
    } else if (normCategory && (normCategory === normQuery || normCategory.includes(normQuery))) {
      textScore += 150;
      matchReasons.push('Correspondance exacte du type de produit (+150)');
    } else {
      // Individual words matching
      const queryWords = normQuery.split(/\s+/).filter(w => w.length > 1);
      let matchedCount = 0;

      queryWords.forEach(w => {
        const inName = normName.includes(w);
        const inCat = normCategory.includes(w);
        const inCerts = (product.certifications || []).some(c => normalizeText(c).includes(w));
        const inGender = product.target_gender ? normalizeText(product.target_gender).includes(w) : false;
        const inDesc = normShortDesc.includes(w) || normDesc.includes(w);

        if (inName || inCat || inCerts || inGender) {
          matchedCount++;
          textScore += inName ? 80 : 50;
        } else if (inDesc) {
          matchedCount++;
          textScore += 15;
        }
      });

      // Require all words for compound queries (e.g. "chocolat noir", "t-shirt bio homme")
      if (queryWords.length > 1 && matchedCount < queryWords.length) {
        textScore = 0;
      } else if (matchedCount > 0) {
        matchReasons.push(`${matchedCount}/${queryWords.length} critère(s) textuel(s) validé(s)`);
      }
    }

    if (normProducer && normProducer.includes(normQuery)) {
      textScore += 50;
      matchReasons.push(`Produit par le producteur ${product.producers?.name || ''}`);
    }

    // Add Sørensen-Dice lexical proximity bonus to reward shorter/more precise title matches
    if (textScore > 0) {
      const dice = diceSimilarity(normQuery, normName);
      textScore += Math.round(dice * 200);
    }

    // If query was specified and NO text matched, product is not a match
    if (textScore === 0) {
      return {
        rawScore: 0,
        searchScore: 0,
        matchReasons: [],
        calculatedDistanceKm: undefined
      };
    }

    score += textScore;
  } else {
    // Base score when browsing without specific text query
    score += 50;
  }

  // 2. Ethical Facet Bonuses
  // Certifications
  if (product.certifications && product.certifications.length > 0) {
    const certCount = product.certifications.length;
    score += Math.min(60, certCount * 15);
    matchReasons.push(`${certCount} label(s) éthique(s) (${product.certifications.slice(0, 3).join(', ')})`);
  }

  // Carbon Footprint (< 2 kg CO2)
  const co2 = product.carbon_footprint_kg ?? (parseFloat(product.co2_estimate || '0') || 2.2);
  if (co2 <= 1.5) {
    score += 30;
    matchReasons.push(`Empreinte carbone très basse (${co2.toFixed(1)} kg CO2)`);
  } else if (co2 <= 2.5) {
    score += 15;
    matchReasons.push(`Faible empreinte carbone (${co2.toFixed(1)} kg CO2)`);
  }

  // Traceability & GPS
  if (product.trace_qr_code || product.gps_coordinates) {
    score += 20;
    matchReasons.push('Traçabilité certifiée par QR Code / GPS');
  }

  // Living Wage
  if (product.living_wage_guaranteed || product.attributes?.living_wage_guaranteed) {
    score += 20;
    matchReasons.push('Garantie Salaire Décent aux producteurs');
  }

  // Recycled
  if (product.is_recycled || product.attributes?.is_recycled) {
    const pct = product.recycled_percentage ?? product.attributes?.recycled_percentage ?? 50;
    score += 20;
    matchReasons.push(`${pct}% de matières recyclées`);
  }

  // Vegan
  if (product.is_vegan || product.attributes?.is_vegan) {
    score += 15;
    matchReasons.push('Produit 100% végétal & végane');
  }

  // Trust / Confidence Score
  const trustScore = product.confidence_score || product.product_score || 80;
  if (trustScore >= 90) {
    score += 25;
    matchReasons.push(`Score de confiance d'excellence (${trustScore}/100)`);
  } else if (trustScore >= 80) {
    score += 10;
    matchReasons.push(`Score de confiance élevé (${trustScore}/100)`);
  }

  // Distance computation if user coordinates provided
  let calculatedDistanceKm: number | undefined;
  const userLat = userLocation?.lat ?? filters.userLatitude;
  const userLng = userLocation?.lng ?? filters.userLongitude;
  if (userLat !== undefined && userLng !== undefined) {
    let pLat = product.producers?.latitude;
    let pLon = product.producers?.longitude;
    if ((!pLat || !pLon) && product.gps_coordinates) {
      const parts = product.gps_coordinates.split(',');
      if (parts.length === 2) {
        pLat = parseFloat(parts[0]);
        pLon = parseFloat(parts[1]);
      }
    }
    if (pLat && pLon) {
      calculatedDistanceKm = calculateHaversineDistanceKm(userLat, userLng, pLat, pLon);
      if (calculatedDistanceKm <= 100) {
        score += 35;
        matchReasons.push(`Production ultra-locale (${calculatedDistanceKm} km)`);
      } else if (calculatedDistanceKm <= 300) {
        score += 20;
        matchReasons.push(`Production régionale (${calculatedDistanceKm} km)`);
      }
    }
  }

  return {
    rawScore: score,
    searchScore: score,
    matchReasons,
    calculatedDistanceKm
  };
}

/**
 * Execute client-side search across catalog with high performance (< 50 ms for 5,000 items)
 */
export function executeClientSideSearch(
  products: Product[],
  filters: StructuredFilters,
  userLocation?: { lat: number; lng: number }
): EnrichedProductSearchResult[] {
  const startTime = performance.now();

  const results: EnrichedProductSearchResult[] = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    if (passesStrictFilters(product, filters)) {
      const { rawScore, searchScore, matchReasons, calculatedDistanceKm } = scoreProductClientSide(
        product,
        filters,
        userLocation
      );

      const hasQuery = Boolean(filters.query && filters.query.trim().length > 0);
      if (!hasQuery || rawScore > 0) {
        results.push({
          product,
          searchScore,
          rawScore,
          matchReasons,
          calculatedDistanceKm
        });
      }
    }
  }

  // Sorting
  const sortBy = filters.sortBy || 'relevance';
  results.sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.product.price - b.product.price;
      case 'price_desc':
        return b.product.price - a.product.price;
      case 'carbon': {
        const co2A = a.product.carbon_footprint_kg ?? (parseFloat(a.product.co2_estimate || '0') || 2.0);
        const co2B = b.product.carbon_footprint_kg ?? (parseFloat(b.product.co2_estimate || '0') || 2.0);
        return co2A - co2B;
      }
      case 'confidence': {
        const sA = a.product.confidence_score || a.product.product_score || 80;
        const sB = b.product.confidence_score || b.product.product_score || 80;
        return sB - sA;
      }
      case 'distance': {
        const dA = a.calculatedDistanceKm ?? 99999;
        const dB = b.calculatedDistanceKm ?? 99999;
        return dA - dB;
      }
      case 'rating':
        return (b.product.rating || 0) - (a.product.rating || 0);
      case 'delivery': {
        const daysA = parseInt((a.product.delivery_days || '5').match(/\d+/)?.[0] || '5', 10);
        const daysB = parseInt((b.product.delivery_days || '5').match(/\d+/)?.[0] || '5', 10);
        return daysA - daysB;
      }
      case 'relevance':
      default:
        return b.rawScore - a.rawScore;
    }
  });

  const duration = performance.now() - startTime;
  if (duration > 50) {
    console.warn(`[SearchEngine] Client-side search took ${duration.toFixed(1)} ms for ${products.length} products`);
  }

  return results;
}

/**
 * Intelligent Hybrid Search executing PostgreSQL RPC with instant client-side fallback
 */
export async function executeIntelligentSearch(
  queryOrFilters: string | StructuredFilters,
  filtersOrFallback: StructuredFilters | Product[] = {},
  catalogProductsFallback: Product[] = [],
  userLocation?: { lat: number; lng: number }
): Promise<SearchExecutionResult> {
  const startTime = performance.now();

  let query = '';
  let filters: StructuredFilters = {};
  let fallbackList: Product[] = [];

  if (typeof queryOrFilters === 'string') {
    query = queryOrFilters;
    if (Array.isArray(filtersOrFallback)) {
      fallbackList = filtersOrFallback;
      filters = { query };
    } else {
      filters = { ...filtersOrFallback, query: query || filtersOrFallback.query };
      fallbackList = catalogProductsFallback;
    }
  } else {
    filters = queryOrFilters;
    query = filters.query || '';
    if (Array.isArray(filtersOrFallback)) {
      fallbackList = filtersOrFallback;
    } else {
      fallbackList = catalogProductsFallback;
    }
  }

  // Parse query
  const parsedQuery = parseNaturalLanguageQuery(query);
  const nlpFilters = parsedQueryToFilters(parsedQuery, userLocation);
  const mergedFilters: StructuredFilters = {
    ...nlpFilters,
    ...filters,
    query: query || filters.query
  };

  let enrichedItems: EnrichedProductSearchResult[] = [];
  let engineUsed: 'postgres_rpc' | 'client_fallback' = 'client_fallback';

  try {
    // Attempt Supabase PostgreSQL RPC search_products_advanced or search_products_v2
    // Les 17 facettes, transmises à la RPC search_products_v2 (PostgreSQL natif, gratuit)
    const rpcParams: Record<string, unknown> = {
      p_query: mergedFilters.query || null,
      p_category_id: mergedFilters.category_id || null,
      p_product_types: mergedFilters.product_types?.length ? mergedFilters.product_types : null,
      p_materials: mergedFilters.materials?.length ? mergedFilters.materials : null,
      p_certifications: mergedFilters.certifications?.length ? mergedFilters.certifications : null,      // Facette 1
      p_countries: mergedFilters.countries?.length ? mergedFilters.countries : null,                     // Facette 2
      p_manufacturing_countries: mergedFilters.manufacturingCountries?.length ? mergedFilters.manufacturingCountries : null, // Facette 3
      p_raw_materials_origins: mergedFilters.rawMaterialsOrigins?.length ? mergedFilters.rawMaterialsOrigins : null,         // Facette 4
      p_user_lat: userLocation?.lat ?? mergedFilters.userLatitude ?? null,                               // Facette 5
      p_user_lng: userLocation?.lng ?? mergedFilters.userLongitude ?? null,
      p_max_distance_km: mergedFilters.maxDistanceKm ?? null,
      p_max_co2: mergedFilters.maxCo2Kg ?? null,                                                         // Facette 6
      p_social_conditions: mergedFilters.socialConditionsRequired ?? null,                               // Facette 7
      p_living_wage: mergedFilters.livingWageRequired ?? null,                                           // Facette 8
      p_fair_trade: mergedFilters.fairTradeRequired ?? null,                                             // Facette 9
      p_is_recycled: mergedFilters.isRecycled ?? null,                                                   // Facette 10
      p_min_recycled_percent: mergedFilters.minRecycledPercent ?? null,
      p_is_vegan: mergedFilters.isVegan ?? null,                                                         // Facette 11
      p_packaging_types: mergedFilters.packagingTypes?.length ? mergedFilters.packagingTypes : null,     // Facette 12
      p_max_moq: mergedFilters.maxMoq ?? null,                                                           // Facette 13
      p_min_price: mergedFilters.minPrice ?? null,                                                       // Facette 14
      p_max_price: mergedFilters.maxPrice ?? null,
      p_max_delivery_days: mergedFilters.maxDeliveryDays ?? null,                                        // Facette 15
      p_supplier_name: mergedFilters.supplierName || null,                                               // Facette 16
      p_producer_id: mergedFilters.producerId || null,
      p_min_confidence: mergedFilters.minConfidenceScore ?? null,                                        // Facette 17
      p_min_rating: mergedFilters.minRating ?? null,
      p_in_stock_only: mergedFilters.inStockOnly || false,
      p_sort_by: mergedFilters.sortBy || 'relevance',
      p_limit: 50,
      p_offset: 0
    };

    const { data, error } = await supabase.rpc('search_products_v2', rpcParams);

    if (!error && Array.isArray(data) && data.length > 0) {
      enrichedItems = data.map(item => {
        const prod = item as Product;
        const { searchScore, rawScore, matchReasons, calculatedDistanceKm } = scoreProductClientSide(
          prod,
          mergedFilters,
          userLocation
        );
        return {
          product: prod,
          searchScore: prod.similarity_score ? Math.round(prod.similarity_score * 100) : searchScore,
          rawScore: prod.relevance_rank || rawScore,
          matchReasons,
          calculatedDistanceKm
        };
      });
      engineUsed = 'postgres_rpc';
    }
  } catch (err) {
    console.warn('[SearchEngine] Supabase RPC search error, using client engine fallback:', err);
  }

  // Instant High-Precision Client-Side Engine Fallback if DB RPC empty or failed
  if (enrichedItems.length === 0 && fallbackList.length > 0) {
    enrichedItems = executeClientSideSearch(fallbackList, mergedFilters, userLocation);
    engineUsed = 'client_fallback';
  }

  const results: SearchResultItem[] = enrichedItems.map(item => ({
    ...item.product,
    searchScore: item.searchScore,
    rawScore: item.rawScore,
    matchReasons: item.matchReasons,
    calculatedDistanceKm: item.calculatedDistanceKm
  }));

  // Spelling suggestions & Zero results handling
  let didYouMean: string | undefined;
  let suggestedAlternatives: string[] | undefined;

  if (results.length === 0 && query.trim().length >= 3) {
    didYouMean = findSpellingCorrection(query, fallbackList.map(p => p.name));
    suggestedAlternatives = POPULAR_SUGGESTIONS;
  }

  return {
    items: enrichedItems,
    results,
    totalCount: results.length,
    executionTimeMs: Math.round(performance.now() - startTime),
    engineUsed,
    parsedQuery,
    didYouMean,
    suggestedAlternatives
  };
}
