import { parseQueryZeroApi as parseQueryV2Local } from './search/zeroApiParser';
import { parseQuerySmart, detectLlmConfig } from './search/llmParser';
// src/lib/naturalLanguageSearchService.ts
// Multi-layered Natural Language Search Parser for EthiMarket
// Layer 1: In-house Zero-API pure TypeScript parser (< 5 ms, 100% offline, multilingual FR/EN/ES)
// Layer 2: LLM JSON parser with 2500ms timeout & smart fusion (numerical priority preserved)

import {
  PRODUCT_TYPES_DICT,
  MATERIALS_DICT,
  CERTIFICATIONS_DICT,
  GENDERS_DICT,
  COUNTRIES_DICT,
  REGIONS_DICT,
  PACKAGING_TYPES_DICT,
  ETHICAL_FLAGS_DICT,
  INTENT_PATTERNS
} from './nlpSearchDictionaries';

export type SearchIntentType = 'standard_search' | 'alternative_search' | 'comparison_search';

export type PackagingType = 'plastic_free' | 'compostable' | 'recyclable' | 'deposit' | 'bulk';

export interface ParsedSearchQuery {
  rawQuery: string;
  normalizedQuery: string;
  intent: SearchIntentType;
  referenceTarget?: string;
  comparisonTarget?: string;
  supplierName?: string;
  
  // 17 Mandatory Search Facets
  // Facet 1: Certifications (Bio, GOTS, Fairtrade, OEKO-TEX, FSC, etc.)
  certifications: string[];
  
  // Facet 2: Product Origin Country
  countries: string[];
  
  // Facet 3: Manufacturing Country (distinct from origin)
  manufacturingCountry?: string;
  
  // Facet 4: Raw Materials Origin Country
  rawMaterialsOrigin?: string;
  
  // Facet 5: Max Distance in KM (Haversine geoloc)
  maxDistanceKm?: number;
  isNearby?: boolean;
  
  // Facet 6: Carbon Footprint (kg CO2)
  maxCo2Kg?: number;
  lowCarbonPriority?: boolean;
  
  // Facet 7: Social Conditions (safety, no child labor, social audit)
  socialConditions?: boolean;
  
  // Facet 8: Living Wage Guaranteed
  livingWage?: boolean;
  
  // Facet 9: Fair Trade
  fairTrade?: boolean;
  
  // Facet 10: Recycled (boolean + min percentage)
  isRecycled?: boolean;
  minRecycledPercent?: number;
  
  // Facet 11: Vegan
  isVegan?: boolean;
  
  // Facet 12: Packaging Types
  packaging: PackagingType[];
  
  // Facet 13: MOQ (Minimum Order Quantity)
  maxMoq?: number;
  
  // Facet 14: Pricing & Currency
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  
  // Facet 15: Delivery Time / Delay (days)
  maxDeliveryDays?: number;
  fastDelivery?: boolean;
  
  // Facet 16: Supplier / Producer Name
  supplierFilter?: string;
  
  // Facet 17: Confidence / Trust Score (0-100)
  minConfidenceScore?: number;
  
  // Supplementary Attributes
  productType?: string;
  productTypeCanonical?: string;
  materials: string[];
  gender?: 'homme' | 'femme' | 'unisexe' | 'enfant' | 'bebe';
  regions: string[];
  minPercentage?: number; // e.g., 70% cacao or 100% coton
  weightQuantity?: string;
  isCooperative?: boolean;
  glutenFree?: boolean;
  fullTraceability?: boolean;
  cheaperPriority?: boolean;
  lowerCarbonPriority?: boolean;
  
  // NLP Diagnostics & Diagnostics
  extractedKeywords: string[];
  residualKeywords: string[];
  confidence: number;
  layerUsed?: 'layer1_zero_api' | 'layer2_local_fused' | 'layer3_free_llm_fused';
}

/**
 * Clean & normalize a string (lowercase, trim accents for fast comparison)
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Haversine formula to compute great-circle distance between two GPS coordinates in km
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * LAYER 1: 100% In-house Zero-API Natural Language Search Parser
 * Executes in < 5 ms, covers all 17 facets with precision.
 */
export function parseNaturalLanguageQuery(query: string): ParsedSearchQuery {
  if (!query || query.trim() === '') {
    return {
      rawQuery: '',
      normalizedQuery: '',
      intent: 'standard_search',
      certifications: [],
      countries: [],
      materials: [],
      regions: [],
      packaging: [],
      extractedKeywords: [],
      residualKeywords: [],
      confidence: 0,
      layerUsed: 'layer1_zero_api'
    };
  }

  const rawQuery = query.trim();
  const lowerQuery = query.toLowerCase();
  const normalized = normalizeText(query);
  let workingQuery = lowerQuery;

  let intent: SearchIntentType = 'standard_search';
  let referenceTarget: string | undefined;
  let comparisonTarget: string | undefined;
  let supplierName: string | undefined;

  // 1. Detect Intent: Alternative / Comparison / Standard
  for (const pattern of INTENT_PATTERNS.alternative) {
    const match = query.match(pattern);
    if (match && match[1]) {
      intent = 'alternative_search';
      referenceTarget = match[1].replace(/(?:qui|avec|mais|et).*$/i, '').trim();
      break;
    }
  }

  if (intent === 'standard_search') {
    for (const pattern of INTENT_PATTERNS.comparison) {
      const match = query.match(pattern);
      if (match && match[1]) {
        intent = 'comparison_search';
        comparisonTarget = match[1].trim();
        break;
      }
    }
  }

  // Detect explicit supplier name
  for (const pattern of INTENT_PATTERNS.supplier) {
    const match = query.match(pattern);
    if (match && match[1]) {
      supplierName = match[1].replace(/(?:qui|avec|mais|et|pour).*$/i, '').trim();
      break;
    }
  }

  const extractedKeywords: string[] = [];

  // 2. Facet 14: Extract Prices & Currency
  let minPrice: number | undefined;
  let maxPrice: number | undefined;
  let currency: string | undefined = 'EUR';

  if (/([$]|dollar|dollars|usd)/i.test(query)) currency = 'USD';
  if (/([£]|livre|gbp)/i.test(query)) currency = 'GBP';

  // Pattern: "moins de 15 €", "< 15€", "max 15€", "maximum 30€", "jusqu'à 50€", "inférieur à 20€"
  const maxPriceMatch = query.match(/(?:moins\s+de|<|max(?:imum)?|inf[ée]rieur\s+à|jusqu['\s]à)\s*(\d+(?:[.,]\d+)?)\s*(?:€|eur|euros|\$|[£]|usd|gbp)?/i);
  if (maxPriceMatch) {
    maxPrice = parseFloat(maxPriceMatch[1].replace(',', '.'));
    extractedKeywords.push(maxPriceMatch[0]);
    workingQuery = workingQuery.replace(maxPriceMatch[0], ' ');
  }

  // Pattern: "plus de 20 €", "> 20€", "min 20€", "minimum 20€", "à partir de 20€", "supérieur à 50€"
  const minPriceMatch = query.match(/(?:plus\s+de|>|min(?:imum)?|sup[ée]rieur\s+à|[àa]\s+partir\s+de)\s*(\d+(?:[.,]\d+)?)\s*(?:€|eur|euros|\$|[£]|usd|gbp)?/i);
  if (minPriceMatch) {
    minPrice = parseFloat(minPriceMatch[1].replace(',', '.'));
    extractedKeywords.push(minPriceMatch[0]);
    workingQuery = workingQuery.replace(minPriceMatch[0], ' ');
  }

  // Pattern: "entre 10 et 50 €" or "10 - 50 €"
  const rangePriceMatch = query.match(/(?:entre\s+)?(\d+(?:[.,]\d+)?)\s*(?:€|eur)?\s*(?:et|-|à)\s*(\d+(?:[.,]\d+)?)\s*(?:€|eur|euros|\$|[£])/i);
  if (rangePriceMatch && !maxPriceMatch && !minPriceMatch) {
    minPrice = parseFloat(rangePriceMatch[1].replace(',', '.'));
    maxPrice = parseFloat(rangePriceMatch[2].replace(',', '.'));
    extractedKeywords.push(rangePriceMatch[0]);
    workingQuery = workingQuery.replace(rangePriceMatch[0], ' ');
  }

  // Standalone price with currency: "15 €" or "15€"
  if (maxPrice === undefined && minPrice === undefined) {
    const standalonePriceMatch = query.match(/(\d+(?:[.,]\d+)?)\s*(?:€|eur|euros)/i);
    if (standalonePriceMatch) {
      maxPrice = parseFloat(standalonePriceMatch[1].replace(',', '.'));
      extractedKeywords.push(standalonePriceMatch[0]);
      workingQuery = workingQuery.replace(standalonePriceMatch[0], ' ');
    }
  }

  // 3. Facet 13: Extract MOQ (Minimum Order Quantity)
  let maxMoq: number | undefined;
  const moqMatch = query.match(/(?:moq|quantit[ée]\s+minimale?|minimum\s+de\s+commande)\s*(?:inf[ée]rieur\s*[àa]|<|max(?:imum)?|de\s*moins\s*de|de|:)?\s*(\d+)/i);
  if (moqMatch) {
    maxMoq = parseInt(moqMatch[1], 10);
    extractedKeywords.push(moqMatch[0]);
    workingQuery = workingQuery.replace(moqMatch[0], ' ');
  } else if (/petites?\s+quantit[ée]s?|faible\s+moq|small\s+quantities/i.test(query)) {
    maxMoq = 50;
    extractedKeywords.push('petites quantités');
  }

  // 4. Facet 10 & Percentages: Recycled % & Composition %
  let minPercentage: number | undefined;
  let minRecycledPercent: number | undefined;
  let isRecycled = ETHICAL_FLAGS_DICT.recycled.some(s => new RegExp(`\\b${normalizeText(s)}\\b`, 'i').test(normalized));

  const recycledPercentMatch = query.match(/(\d+)\s*%\s*(?:recycl[ée]|de\s+mati[èe]res?\s+recycl[ée]es?|upcycl[ée])/i);
  if (recycledPercentMatch) {
    isRecycled = true;
    minRecycledPercent = parseInt(recycledPercentMatch[1], 10);
    extractedKeywords.push(recycledPercentMatch[0]);
    workingQuery = workingQuery.replace(recycledPercentMatch[0], ' ');
  }

  const genericPercentMatch = query.match(/(\d+)\s*%/);
  if (genericPercentMatch && !recycledPercentMatch) {
    minPercentage = parseInt(genericPercentMatch[1], 10);
    extractedKeywords.push(genericPercentMatch[0]);
    workingQuery = workingQuery.replace(genericPercentMatch[0], ' ');
  }

  // 5. Facet 5: Distance ("moins de 500 km", "près de moi", "< 200 km")
  let maxDistanceKm: number | undefined;
  let isNearby = false;
  const distanceMatch = query.match(/(?:moins\s+de|<|inf[ée]rieur\s+à|dans\s+un\s+rayon\s+de|[àa]\s+moins\s+de)?\s*(\d+)\s*(?:km|kilom[èe]tres?)/i);
  if (distanceMatch) {
    maxDistanceKm = parseInt(distanceMatch[1], 10);
    extractedKeywords.push(distanceMatch[0]);
    workingQuery = workingQuery.replace(distanceMatch[0], ' ');
  } else if (/pr[èe]s\s+de\s+moi|proche\s+de\s+moi|autour\s+de\s+moi|local|circuit\s+court|nearby/i.test(query)) {
    maxDistanceKm = 200;
    isNearby = true;
    extractedKeywords.push('près de moi');
  }

  // 6. Facet 6: Carbon Footprint ("moins de 2 kg CO2", "bas carbone")
  let maxCo2Kg: number | undefined;
  const co2Match = query.match(/(?:moins\s+de|<|inf[ée]rieur\s+à|max(?:imum)?)\s*(\d+(?:[.,]\d+)?)\s*(?:kg\s*co2|kg\s*de\s*co2|co2)/i);
  if (co2Match) {
    maxCo2Kg = parseFloat(co2Match[1].replace(',', '.'));
    extractedKeywords.push(co2Match[0]);
    workingQuery = workingQuery.replace(co2Match[0], ' ');
  } else if (/bas\s+carbone|faible\s+empreinte\s+carbone|low\s+carbon|neutre\s+en\s+carbone/i.test(query)) {
    maxCo2Kg = 2.0;
    extractedKeywords.push('bas carbone');
  }

  // 7. Facet 15: Delivery Time ("livraison sous 7 jours", "express", "< 5 jours")
  let maxDeliveryDays: number | undefined;
  let fastDelivery = false;
  const deliveryDaysMatch = query.match(/(?:livraison\s+(?:sous|en|dans)|d[ée]lai\s*(?:de|inf[ée]rieur\s*[àa]|<)?)\s*(\d+)\s*jours?/i);
  if (deliveryDaysMatch) {
    maxDeliveryDays = parseInt(deliveryDaysMatch[1], 10);
    extractedKeywords.push(deliveryDaysMatch[0]);
    workingQuery = workingQuery.replace(deliveryDaysMatch[0], ' ');
  } else if (/express|rapide|livraison\s+rapide|urgent|fast\s+delivery/i.test(query)) {
    maxDeliveryDays = 4;
    fastDelivery = true;
    extractedKeywords.push('livraison rapide');
  }

  // 8. Facet 17: Confidence / Trust Score ("score de confiance > 80", "score > 85")
  let minConfidenceScore: number | undefined;
  const scoreMatch = query.match(/(?:score(?:\s+de\s+confiance|\s+[ée]thique)?)\s*(?:>|sup[ée]rieur\s*[àa]|au\s+moins|min(?:imum)?|de\s*plus\s*de)?\s*(\d+)(?:\s*\/|\s*pts|\s*points)?/i);
  if (scoreMatch) {
    minConfidenceScore = parseInt(scoreMatch[1], 10);
    extractedKeywords.push(scoreMatch[0]);
    workingQuery = workingQuery.replace(scoreMatch[0], ' ');
  }

  // 9. Facet 1: Certifications (Bio + 20 other labels)
  const certifications: string[] = [];
  for (const item of CERTIFICATIONS_DICT) {
    for (const syn of item.synonyms) {
      const regex = new RegExp(`\\b${normalizeText(syn)}\\b`, 'i');
      if (regex.test(normalizeText(workingQuery))) {
        if (!certifications.includes(item.canonical)) {
          certifications.push(item.canonical);
          extractedKeywords.push(syn);
        }
        break;
      }
    }
  }

  // 10. Facet 3: Manufacturing Country (Distinct: "fabriqué au Portugal", "made in France")
  let manufacturingCountry: string | undefined;
  const madeInMatch = query.match(/(?:fabriqu[ée]\s+(?:au|en|aux|à)|made\s+in|confectionn[ée]\s+(?:au|en))\s+([a-zA-Z\u00C0-\u017F\s-]+)/i);
  if (madeInMatch) {
    const rawTarget = normalizeText(madeInMatch[1].trim());
    for (const c of COUNTRIES_DICT) {
      if (c.synonyms.some(s => normalizeText(s) === rawTarget || rawTarget.startsWith(normalizeText(s)))) {
        manufacturingCountry = c.canonical;
        extractedKeywords.push(madeInMatch[0]);
        break;
      }
    }
  }

  // 11. Facet 4: Raw Materials Origin Country ("coton d'Inde", "cacao du Ghana", "laine de Nouvelle-Zélande")
  let rawMaterialsOrigin: string | undefined;
  const rawMaterialMatch = query.match(/(?:coton|cacao|laine|lin|soie|caf[ée]|th[ée]|vanille|sucre|mati[èe]res?\s+premi[èe]res?)\s+(?:d['’]|du|de|des)\s*([a-zA-Z\u00C0-\u017F\s-]+)/i);
  if (rawMaterialMatch) {
    const rawTarget = normalizeText(rawMaterialMatch[1].trim());
    for (const c of COUNTRIES_DICT) {
      if (c.synonyms.some(s => normalizeText(s) === rawTarget || rawTarget.startsWith(normalizeText(s)))) {
        rawMaterialsOrigin = c.canonical;
        extractedKeywords.push(rawMaterialMatch[0]);
        break;
      }
    }
  }

  // 12. Facet 2: Product Origin Countries
  const countries: string[] = [];
  for (const item of COUNTRIES_DICT) {
    for (const syn of item.synonyms) {
      const regex = new RegExp(`\\b${normalizeText(syn)}\\b`, 'i');
      if (regex.test(normalizeText(workingQuery)) && !countries.includes(item.canonical)) {
        countries.push(item.canonical);
        extractedKeywords.push(syn);
        break;
      }
    }
  }

  // 13. Facet 12: Packaging Types
  const packaging: PackagingType[] = [];
  for (const pack of PACKAGING_TYPES_DICT) {
    for (const syn of pack.synonyms) {
      const regex = new RegExp(`\\b${normalizeText(syn)}\\b`, 'i');
      if (regex.test(normalized)) {
        if (!packaging.includes(pack.id as PackagingType)) {
          packaging.push(pack.id as PackagingType);
          extractedKeywords.push(syn);
        }
        break;
      }
    }
  }

  // 14. Facet 7, 8, 9, 11: Ethical Flags
  const isVegan = ETHICAL_FLAGS_DICT.vegan.some(s => new RegExp(`\\b${normalizeText(s)}\\b`, 'i').test(normalized));
  const livingWage = ETHICAL_FLAGS_DICT.living_wage.some(s => new RegExp(`\\b${normalizeText(s)}\\b`, 'i').test(normalized));
  const socialConditions = ETHICAL_FLAGS_DICT.social_conditions.some(s => new RegExp(`\\b${normalizeText(s)}\\b`, 'i').test(normalized));
  const fairTrade = ETHICAL_FLAGS_DICT.fair_trade.some(s => new RegExp(`\\b${normalizeText(s)}\\b`, 'i').test(normalized));
  const isCooperative = ETHICAL_FLAGS_DICT.cooperative.some(s => new RegExp(`\\b${normalizeText(s)}\\b`, 'i').test(normalized));
  const glutenFree = /sans\s+gluten|gluten\s+free/i.test(normalized);

  // Intent priorities
  const fullTraceability = INTENT_PATTERNS.better_traceability.some(p => p.test(query));
  const cheaperPriority = INTENT_PATTERNS.cheaper.some(p => p.test(query));
  const lowerCarbonPriority = INTENT_PATTERNS.lower_carbon.some(p => p.test(query));

  // Product Type Extraction
  let productType: string | undefined;
  let productTypeCanonical: string | undefined;
  for (const item of PRODUCT_TYPES_DICT) {
    for (const syn of item.synonyms) {
      const regex = new RegExp(`\\b${normalizeText(syn)}\\b`, 'i');
      if (regex.test(normalizeText(workingQuery))) {
        productType = item.id;
        productTypeCanonical = item.canonical;
        extractedKeywords.push(syn);
        break;
      }
    }
    if (productType) break;
  }

  // Materials Extraction
  const materials: string[] = [];
  for (const item of MATERIALS_DICT) {
    for (const syn of item.synonyms) {
      const regex = new RegExp(`\\b${normalizeText(syn)}\\b`, 'i');
      if (regex.test(normalizeText(workingQuery))) {
        if (!materials.includes(item.canonical)) {
          materials.push(item.canonical);
          extractedKeywords.push(syn);
        }
        break;
      }
    }
  }

  // Gender Extraction
  let gender: 'homme' | 'femme' | 'unisexe' | 'enfant' | 'bebe' | undefined;
  for (const item of GENDERS_DICT) {
    for (const syn of item.synonyms) {
      const regex = new RegExp(`\\b${normalizeText(syn)}\\b`, 'i');
      if (regex.test(normalizeText(workingQuery))) {
        gender = item.id as 'homme' | 'femme' | 'unisexe' | 'enfant' | 'bebe';
        extractedKeywords.push(syn);
        break;
      }
    }
    if (gender) break;
  }

  // Regions Extraction
  const regions: string[] = [];
  for (const item of REGIONS_DICT) {
    for (const syn of item.synonyms) {
      const regex = new RegExp(`\\b${normalizeText(syn)}\\b`, 'i');
      if (regex.test(normalizeText(workingQuery))) {
        if (!regions.includes(item.canonical)) {
          regions.push(item.canonical);
          extractedKeywords.push(syn);
        }
        break;
      }
    }
  }

  // Weight / Volume / Format
  let weightQuantity: string | undefined;
  const weightMatch = query.match(/(\d+(?:[.,]\d+)?\s*(?:kg|kilo|g|grammes|l|litres|ml))/i);
  if (weightMatch) {
    weightQuantity = weightMatch[1].toLowerCase();
    extractedKeywords.push(weightMatch[0]);
  }

  // Residual keywords calculation
  const stopWords = new Set([
    'de', 'du', 'des', 'le', 'la', 'les', 'un', 'une', 'en', 'pour', 'avec', 'sans', 
    'et', 'ou', 'au', 'aux', 'ce', 'cette', 'ces', 'par', 'dans', 'sur', 'qui', 'que',
    'moins', 'plus', 'environ', 'maximum', 'minimum', 'trouve', 'moi', 'cherche', 'est',
    'a', 'an', 'the', 'in', 'on', 'with', 'without', 'and', 'or', 'for', 'to', 'from',
    'qui', 'coute', 'coutent', 'cher', 'mais', 'fournisseur', 'marque', 'alternative'
  ]);

  const allWords = normalizeText(query)
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !stopWords.has(w));

  const residualKeywords = allWords.filter(w => 
    !extractedKeywords.some(ek => normalizeText(ek).includes(w))
  );

  // Confidence calculation
  let matchedCount = 0;
  if (productType) matchedCount += 2;
  if (materials.length > 0) matchedCount += 1;
  if (certifications.length > 0) matchedCount += 1.5;
  if (gender) matchedCount += 1;
  if (countries.length > 0 || regions.length > 0 || manufacturingCountry) matchedCount += 1.5;
  if (maxPrice !== undefined || minPrice !== undefined) matchedCount += 1.5;
  if (maxMoq !== undefined) matchedCount += 1.2;
  if (maxDistanceKm !== undefined) matchedCount += 1.2;
  if (maxCo2Kg !== undefined) matchedCount += 1.2;
  if (isVegan || isRecycled || livingWage || fairTrade || socialConditions) matchedCount += 1;
  if (intent !== 'standard_search') matchedCount += 2;

  const confidence = Math.min(0.99, Math.max(0.45, 0.45 + (matchedCount * 0.07)));

  return {
    rawQuery,
    normalizedQuery: normalized,
    intent,
    referenceTarget,
    comparisonTarget,
    supplierName,
    certifications,
    countries,
    manufacturingCountry,
    rawMaterialsOrigin,
    maxDistanceKm,
    isNearby,
    maxCo2Kg,
    lowCarbonPriority: lowerCarbonPriority || (maxCo2Kg !== undefined && maxCo2Kg <= 2.0),
    socialConditions,
    livingWage,
    fairTrade,
    isRecycled,
    minRecycledPercent,
    isVegan,
    packaging,
    maxMoq,
    minPrice,
    maxPrice,
    currency,
    maxDeliveryDays,
    fastDelivery,
    supplierFilter: supplierName,
    minConfidenceScore,
    productType,
    productTypeCanonical,
    materials,
    gender,
    regions,
    minPercentage,
    weightQuantity,
    isCooperative,
    glutenFree,
    fullTraceability,
    cheaperPriority,
    lowerCarbonPriority,
    extractedKeywords: Array.from(new Set(extractedKeywords)),
    residualKeywords,
    confidence: Number(confidence.toFixed(2)),
    layerUsed: 'layer1_zero_api'
  };
}

/**
 * LAYER 2: Server-side or Free LLM Enhancement with strict Timeout & Numerical Fusion
 * Falls back gracefully to Layer 1 on timeout or failure.
 */
export async function parseNaturalLanguageQueryWithFallback(
  rawQuery: string,
  _options: { timeoutMs?: number; userLocation?: { lat: number; lng: number } } = {}
): Promise<ParsedSearchQuery> {
  // Couche 1 : parser zero-API historique (< 2 ms)
  const layer1Result = parseNaturalLanguageQuery(rawQuery);

  if (!rawQuery || rawQuery.trim().length < 5) {
    return layer1Result;
  }

  // Couche 3 (optionnelle, IA GRATUITE) : Groq / Gemini free tier / Ollama local.
  // Active uniquement si une cle gratuite est configuree (VITE_GROQ_API_KEY,
  // VITE_GEMINI_API_KEY ou VITE_OLLAMA_URL). Timeout 2,5 s puis degradation
  // transparente : sans cle ou en cas d'echec, les couches 1+2 locales suffisent.
  let llmParsed: import('./search/types').ParsedQueryV2 | null = null;
  try {
    if (detectLlmConfig().provider !== 'none') {
      llmParsed = await parseQuerySmart(rawQuery);
    }
  } catch { /* degradation silencieuse */ }

  // Couche 2 : moteur semantique LOCAL (src/lib/search/zeroApiParser) — 100% gratuit,
  // zero reseau, zero LLM. Il complete les facettes que la couche 1 ne couvre pas
  // (fournisseur, delai, emballage, score de confiance, priorites de classement,
  // pays matieres premieres) et fusionne. Les valeurs numeriques de la couche 1
  // gardent strictement la priorite (determinisme).
  try {
    const v2Base = parseQueryV2Local(rawQuery);
    // Si l'IA gratuite a repondu, ses resultats sont deja fusionnes avec le
    // parse local par parseQuerySmart (le local garde priorite numerique).
    const v2 = llmParsed ?? v2Base;

    const packagingFromV2: PackagingType[] = [];
    if (v2.flags.plasticFreePackaging) packagingFromV2.push('plastic_free');
    if (v2.flags.compostablePackaging) packagingFromV2.push('compostable');
    if (v2.flags.recyclablePackaging) packagingFromV2.push('recyclable');
    if (v2.flags.bulkPackaging) packagingFromV2.push('bulk');

    const fused: ParsedSearchQuery = {
      ...layer1Result,
      intent: layer1Result.intent !== 'standard_search' ? layer1Result.intent : v2.intent,
      referenceTarget: layer1Result.referenceTarget || v2.referenceSupplier || v2.referenceProduct,
      supplierName: layer1Result.supplierName || v2.referenceSupplier,
      supplierFilter: layer1Result.supplierFilter || (v2.intent !== 'alternative_search' ? v2.referenceSupplier : undefined),

      certifications: Array.from(new Set([...layer1Result.certifications, ...v2.certifications])),
      countries: Array.from(new Set([...layer1Result.countries, ...v2.originCountries])),
      manufacturingCountry: layer1Result.manufacturingCountry || v2.manufacturingCountries[0],
      rawMaterialsOrigin: layer1Result.rawMaterialsOrigin || v2.rawMaterialCountries[0],
      materials: Array.from(new Set([...layer1Result.materials, ...v2.materials])),
      regions: Array.from(new Set([...layer1Result.regions, ...v2.regions])),
      packaging: Array.from(new Set([...layer1Result.packaging, ...packagingFromV2])) as PackagingType[],

      // Numerique : couche 1 prioritaire, V2 en complement
      minPrice: layer1Result.minPrice ?? v2.minPrice,
      maxPrice: layer1Result.maxPrice ?? v2.maxPrice,
      currency: layer1Result.currency || v2.currency || 'EUR',
      maxMoq: layer1Result.maxMoq ?? v2.maxMoq,
      minRecycledPercent: layer1Result.minRecycledPercent ?? v2.minRecycledPercent,
      maxDistanceKm: layer1Result.maxDistanceKm ?? v2.maxDistanceKm,
      maxCo2Kg: layer1Result.maxCo2Kg ?? v2.maxCarbonKg,
      maxDeliveryDays: layer1Result.maxDeliveryDays ?? v2.maxDeliveryDays,
      minConfidenceScore: layer1Result.minConfidenceScore ?? v2.minTrustScore,

      isVegan: layer1Result.isVegan || v2.flags.vegan,
      isRecycled: layer1Result.isRecycled || v2.flags.recycled,
      livingWage: layer1Result.livingWage || v2.flags.livingWage,
      socialConditions: layer1Result.socialConditions || v2.flags.socialConditions,
      fairTrade: layer1Result.fairTrade || v2.flags.fairTrade,
      isCooperative: layer1Result.isCooperative || v2.flags.cooperative,
      fullTraceability: layer1Result.fullTraceability || v2.flags.fullTraceability,
      cheaperPriority: layer1Result.cheaperPriority || v2.priorities.cheaper,
      lowerCarbonPriority: layer1Result.lowerCarbonPriority || v2.priorities.lowerCarbon,
      lowCarbonPriority: layer1Result.lowCarbonPriority || v2.priorities.lowerCarbon,
      fastDelivery: layer1Result.fastDelivery || v2.priorities.fasterDelivery,

      gender: layer1Result.gender || v2.gender,
      productType: layer1Result.productType || v2.productType,
      productTypeCanonical: layer1Result.productTypeCanonical || v2.productType,
      confidence: Math.max(layer1Result.confidence, v2.confidence),
      layerUsed: llmParsed ? 'layer3_free_llm_fused' : 'layer2_local_fused'
    };

    return fused;
  } catch {
    // Toute erreur -> degradation silencieuse vers la couche 1
  }

  return layer1Result;
}
