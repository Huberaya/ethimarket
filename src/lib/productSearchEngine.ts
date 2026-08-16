// src/lib/productSearchEngine.ts
// High-Precision Product Search Engine with Strict Hierarchical Priority & Zero-Noise Filtering

import { supabase, Product } from './supabase';
import { parseNaturalLanguageQuery, ParsedSearchQuery, normalizeText } from './naturalLanguageSearchService';
import { SYNONYMS } from './nlpSearchDictionaries';

export interface StructuredFilters {
  categories?: string[];
  productTypes?: string[];
  materials?: string[];
  certifications?: string[];
  countries?: string[];
  regions?: string[];
  gender?: 'homme' | 'femme' | 'unisexe' | 'enfant' | 'bebe' | 'all';
  minPrice?: number;
  maxPrice?: number;
  maxCo2?: number;
  maxWater?: number;
  isVegan?: boolean;
  isRecycled?: boolean;
  minRecycledPercent?: number;
  livingWage?: boolean;
  isCooperative?: boolean;
  socialProtection?: boolean;
  plasticFree?: boolean;
  fullTraceability?: boolean;
  minConfidenceScore?: number;
  minRating?: number;
  minReviewsCount?: number;
  inStockOnly?: boolean;
  maxDeliveryDays?: number;
  producerId?: string;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'confidence' | 'carbon' | 'rating' | 'newest' | 'distance';
  limit?: number;
  offset?: number;
}

export interface SearchResultItem extends Product {
  searchScore: number;
  matchReasons: string[];
  matchType?: 'exact' | 'prefix' | 'name' | 'category' | 'description' | 'fuzzy';
  highlights?: {
    name?: string;
    description?: string;
  };
}

export interface SearchExecutionResponse {
  results: SearchResultItem[];
  totalCount: number;
  parsedQuery: ParsedSearchQuery;
  executionTimeMs: number;
  didYouMean?: string;
  suggestedAlternatives?: string[];
  suggestedFilters?: {
    certifications: { label: string; count: number }[];
    countries: { label: string; count: number }[];
    materials: { label: string; count: number }[];
  };
}

// Popular alternative suggestions when zero results are found
export const POPULAR_SUGGESTIONS = [
  'Café bio équitable',
  'Chocolat noir 70%',
  'Huile d\'argan pure',
  'T-shirt coton bio',
  'Miel de thym bio',
  'Vanille Bourbon de Madagascar'
];

/**
 * Fast Levenshtein distance for typo detection
 */
export function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;

  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (b.charAt(j - 1) === a.charAt(i - 1)) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // substitution
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Finds spelling correction suggestions (e.g. "cafee" -> "café")
 */
export function findSpellingCorrection(query: string, availableTerms: string[] = []): string | undefined {
  const normQuery = normalizeText(query);
  if (!normQuery || normQuery.length < 3) return undefined;

  const targetVocab = new Set<string>([
    ...Object.keys(SYNONYMS),
    'café', 'chocolat', 'miel', 'the', 'thé', 'huile', 'argan', 'savon', 'coton', 'vanille',
    'safran', 'quinoa', 'cacao', 'spiruline', 'curcuma', 't-shirt', 'chemise', 'pantalon',
    ...availableTerms.map(t => normalizeText(t))
  ]);

  let bestMatch: string | undefined;
  let minDistance = 999;

  for (const term of targetVocab) {
    const normTerm = normalizeText(term);
    if (normTerm === normQuery) return undefined; // Already exact

    const dist = levenshteinDistance(normQuery, normTerm);
    // Allow max 1 edit distance for short words, max 2 for words >= 5 chars
    const maxAllowedDist = normTerm.length <= 4 ? 1 : 2;
    if (dist <= maxAllowedDist && dist < minDistance) {
      minDistance = dist;
      bestMatch = term;
    }
  }

  return bestMatch;
}

/**
 * Expand query tokens with synonyms
 */
export function expandWithSynonyms(term: string): string[] {
  const norm = normalizeText(term);
  const result = new Set<string>([norm]);

  // Check direct synonym keys
  Object.entries(SYNONYMS).forEach(([key, syns]) => {
    const normKey = normalizeText(key);
    const normSyns = syns.map(s => normalizeText(s));
    if (normKey === norm || normSyns.includes(norm)) {
      result.add(normKey);
      normSyns.forEach(s => result.add(s));
    }
  });

  return Array.from(result);
}

/**
 * Core Scoring Function with Strict Hierarchical Priority
 * 
 * Priority 1 (1000 pts): Exact Name Match
 * Priority 2 (500 pts): Prefix Name Match (starts with query)
 * Priority 3 (100 pts): Substring/Word in Name Match
 * Priority 4 (50 pts): Category / Product Type Match
 * Priority 5 (10 pts): Description / Attributes Match
 * 
 * STRICT RULE: Zero match on relevant criteria results in score = 0 (Excluded completely).
 */
export function scoreProductClientSide(
  product: Product,
  parsed: ParsedSearchQuery,
  filters?: StructuredFilters
): { score: number; matchReasons: string[]; matchType: SearchResultItem['matchType'] } {
  let score = 0;
  const matchReasons: string[] = [];
  let matchType: SearchResultItem['matchType'] = undefined;

  const rawQ = parsed.rawQuery ? parsed.rawQuery.trim() : '';
  const normQuery = normalizeText(rawQ);

  const normName = normalizeText(product.name || '');
  const normDesc = normalizeText(product.description || '');
  const normShortDesc = normalizeText(product.short_description || '');
  const normCategory = normalizeText(product.category_id || product.product_type || '');
  const normProducer = normalizeText(product.producers?.company_name || product.producers?.name || '');
  const normCountry = normalizeText(product.country || '');
  const normGender = normalizeText(product.target_gender || product.attributes?.gender || 'unisexe');
  const prodCerts = (product.certifications || []).map(c => normalizeText(c));

  // If query is provided, verify match strictly
  if (normQuery.length > 0) {
    const queryTokens = normQuery.split(/\s+/).filter(t => t.length > 0);
    const allSynonymsForQuery = expandWithSynonyms(normQuery);

    // PRIORITY 1 — EXACT NAME MATCH
    if (normName === normQuery || allSynonymsForQuery.includes(normName)) {
      score += 1000;
      matchType = 'exact';
      matchReasons.push('Correspondance exacte du nom');
    }
    // PRIORITY 2 — PREFIX NAME MATCH (Starts with query)
    else if (normName.startsWith(normQuery) || allSynonymsForQuery.some(syn => normName.startsWith(syn))) {
      score += 500;
      matchType = 'prefix';
      matchReasons.push('Le nom commence par la recherche');
    }
    // PRIORITY 3 — CONTAINS IN NAME
    else if (normName.includes(normQuery) || allSynonymsForQuery.some(syn => normName.includes(syn))) {
      score += 100;
      matchType = 'name';
      matchReasons.push('Nom du produit correspondant');
    }
    // Multi-term token matching for queries like "chocolat noir" or "t-shirt bio homme"
    else if (queryTokens.length > 1) {
      let tokensMatchedCount = 0;
      let hasDiscriminantMissing = false;

      for (const token of queryTokens) {
        const tokenSynonyms = expandWithSynonyms(token);
        const inName = tokenSynonyms.some(syn => normName.includes(syn));
        const inCategory = tokenSynonyms.some(syn => normCategory.includes(syn));
        const inDesc = tokenSynonyms.some(syn => normDesc.includes(syn) || normShortDesc.includes(syn));
        const inCerts = tokenSynonyms.some(syn => prodCerts.some(c => c.includes(syn)));
        const inGender = tokenSynonyms.some(syn => normGender.includes(syn));
        const inCountry = tokenSynonyms.some(syn => normCountry.includes(syn));

        if (inName || inCategory || inDesc || inCerts || inGender || inCountry) {
          tokensMatchedCount++;
          if (inName) score += 60;
          else if (inCategory) score += 30;
          else if (inCerts) score += 25;
          else if (inGender) score += 20;
          else score += 10;
        } else {
          // Check if it's a strict discriminant like 'noir', 'homme', 'femme', 'bio'
          if (['noir', 'blanc', 'lait', 'homme', 'femme', 'enfant', 'bio', 'grain', 'moulu'].includes(token)) {
            hasDiscriminantMissing = true;
          }
        }
      }

      // If key discriminant is missing or less than half tokens match, strictly exclude
      if (hasDiscriminantMissing || tokensMatchedCount < queryTokens.length) {
        score = 0;
        return { score: 0, matchReasons: [], matchType: undefined };
      } else {
        matchType = 'name';
        matchReasons.push(`Tous les termes correspondent (${tokensMatchedCount}/${queryTokens.length})`);
      }
    }
    // PRIORITY 4 — CATEGORY / PRODUCT TYPE MATCH
    else if (normCategory.includes(normQuery) || allSynonymsForQuery.some(syn => normCategory.includes(syn))) {
      score += 50;
      matchType = 'category';
      matchReasons.push('Catégorie correspondante');
    }
    // PRIORITY 5 — DESCRIPTION MATCH
    else if (normDesc.includes(normQuery) || normShortDesc.includes(normQuery) || allSynonymsForQuery.some(syn => normDesc.includes(syn))) {
      score += 10;
      matchType = 'description';
      matchReasons.push('Trouvé dans la description');
    }
    // Producer match
    else if (normProducer.includes(normQuery)) {
      score += 30;
      matchType = 'name';
      matchReasons.push(`Producteur : ${product.producers?.company_name || product.producers?.name}`);
    }
    // Trigram / fuzzy fallback ONLY if high similarity
    else {
      const dist = levenshteinDistance(normName, normQuery);
      if (dist <= 2 && normQuery.length >= 4) {
        score += 40;
        matchType = 'fuzzy';
        matchReasons.push('Correspondance proche (tolérance orthographe)');
      } else {
        // Zero match -> EXCLUDED
        return { score: 0, matchReasons: [], matchType: undefined };
      }
    }
  } else {
    // If no text query, base score for filtering
    score = 100;
  }

  // Mandatory Attribute Filters (Exclusions)
  // Gender Filter
  if (parsed.gender || (filters?.gender && filters.gender !== 'all')) {
    const targetG = parsed.gender || (filters?.gender as string);
    if (targetG && targetG !== 'all') {
      const prodG = product.target_gender || product.attributes?.gender || 'unisexe';
      if (prodG !== targetG && prodG !== 'unisexe') {
        return { score: 0, matchReasons: [], matchType: undefined };
      }
    }
  }

  // Price Filters
  const targetMaxPrice = filters?.maxPrice ?? parsed.maxPrice;
  const targetMinPrice = filters?.minPrice ?? parsed.minPrice;
  if (targetMaxPrice !== undefined && product.price > targetMaxPrice) {
    return { score: 0, matchReasons: [], matchType: undefined };
  }
  if (targetMinPrice !== undefined && product.price < targetMinPrice) {
    return { score: 0, matchReasons: [], matchType: undefined };
  }

  // Certification Filters
  const requiredCerts = [...(filters?.certifications || []), ...parsed.certifications];
  if (requiredCerts.length > 0) {
    const hasAll = requiredCerts.every(rc => {
      const nrc = normalizeText(rc);
      return prodCerts.some(pc => pc.includes(nrc) || nrc.includes(pc));
    });
    if (!hasAll) {
      return { score: 0, matchReasons: [], matchType: undefined };
    }
  }

  // Quality & Ethical Minor Boosts (to break ties without overriding search relevance)
  if (product.product_score) {
    score += (product.product_score / 100) * 5;
  }
  if (product.confidence_score) {
    score += (product.confidence_score / 100) * 5;
  }

  return {
    score: Math.round(score),
    matchReasons: Array.from(new Set(matchReasons)),
    matchType
  };
}

/**
 * Execute intelligent search with automatic NLP parsing, RPC call & fallback
 */
export async function executeIntelligentSearch(
  rawQuery: string,
  filters: StructuredFilters = {},
  catalogProducts: Product[] = []
): Promise<SearchExecutionResponse> {
  const startTime = performance.now();
  const parsed = parseNaturalLanguageQuery(rawQuery);
  const trimmedQuery = rawQuery ? rawQuery.trim() : '';

  let searchResults: SearchResultItem[] = [];

  // Check for potential spelling correction if query exists
  const didYouMean = trimmedQuery.length >= 3
    ? findSpellingCorrection(trimmedQuery, catalogProducts.map(p => p.name))
    : undefined;

  try {
    // 1. Try PostgreSQL RPC search first
    if (trimmedQuery.length > 0) {
      const { data: rpcData, error: rpcError } = await supabase.rpc('search_products_advanced', {
        p_query: trimmedQuery,
        p_category_id: filters.categories && filters.categories.length === 1 ? filters.categories[0] : null,
        p_min_price: filters.minPrice ?? parsed.minPrice,
        p_max_price: filters.maxPrice ?? parsed.maxPrice,
        p_max_co2: filters.maxCo2,
        p_is_vegan: filters.isVegan ?? (parsed.isVegan ? true : null),
        p_is_recycled: filters.isRecycled ?? (parsed.isRecycled ? true : null),
        p_living_wage: filters.livingWage ?? (parsed.livingWage ? true : null),
        p_is_cooperative: filters.isCooperative ?? (parsed.isCooperative ? true : null),
        p_sort_by: filters.sortBy || 'relevance',
        p_limit: filters.limit || 50,
        p_offset: filters.offset || 0
      });

      if (!rpcError && rpcData && Array.isArray(rpcData) && rpcData.length > 0) {
        searchResults = (rpcData as unknown as Product[]).map((item) => {
          const { score, matchReasons, matchType } = scoreProductClientSide(item, parsed, filters);
          return {
            ...item,
            searchScore: score,
            matchReasons,
            matchType
          };
        }).filter(p => p.searchScore > 0);
      }
    }
  } catch (err) {
    console.warn('PostgreSQL search RPC unavailable, falling back to strict client search engine', err);
  }

  // 2. High-Precision Client-Side Search Engine (Fallback & In-Memory Verification)
  if (searchResults.length === 0 && catalogProducts.length > 0) {
    const scoredList: SearchResultItem[] = [];

    for (const p of catalogProducts) {
      const { score, matchReasons, matchType } = scoreProductClientSide(p, parsed, filters);
      if (score > 0) {
        scoredList.push({
          ...p,
          searchScore: score,
          matchReasons,
          matchType
        });
      }
    }

    // Apply strict sorting
    scoredList.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'confidence': return (b.confidence_score || 0) - (a.confidence_score || 0);
        case 'carbon': return (a.carbon_footprint_kg || 99) - (b.carbon_footprint_kg || 99);
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        default: return b.searchScore - a.searchScore; // Relevance first
      }
    });

    searchResults = scoredList;
  }

  const executionTimeMs = Math.max(1, Math.round(performance.now() - startTime));

  // Build aggregate suggested filters
  const certCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};
  const materialCounts: Record<string, number> = {};

  searchResults.forEach(p => {
    (p.certifications || []).forEach(c => {
      certCounts[c] = (certCounts[c] || 0) + 1;
    });
    if (p.country) {
      countryCounts[p.country] = (countryCounts[p.country] || 0) + 1;
    }
    (p.attributes?.materials || []).forEach(m => {
      materialCounts[m] = (materialCounts[m] || 0) + 1;
    });
  });

  return {
    results: searchResults,
    totalCount: searchResults.length,
    parsedQuery: parsed,
    executionTimeMs,
    didYouMean,
    suggestedAlternatives: searchResults.length === 0 ? POPULAR_SUGGESTIONS : undefined,
    suggestedFilters: {
      certifications: Object.entries(certCounts).map(([label, count]) => ({ label, count })),
      countries: Object.entries(countryCounts).map(([label, count]) => ({ label, count })),
      materials: Object.entries(materialCounts).map(([label, count]) => ({ label, count }))
    }
  };
}
