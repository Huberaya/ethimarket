// =============================================================
// EthiMarket Search V2 — Couche 3 : Filtrage strict + Scoring pondéré
// Filtres durs = éliminent. Priorités = classent. Chaque résultat
// est expliqué (matchReasons).
// =============================================================

import {
  ParsedQueryV2, ProductV2, StructuredFiltersV2, ScoredResult, SearchResponseV2, GeoPoint,
} from './types';
import { normalize } from './zeroApiParser';
import { COUNTRIES, CONTINENT_BY_REGION } from './dictionaries';

// ---------- Utilitaires ----------

export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)));
}

export function diceSimilarity(str1: string, str2: string): number {
  const s1 = normalize(str1);
  const s2 = normalize(str2);
  if (s1 === s2) return 1;
  if (s1.length < 2 || s2.length < 2) return s1.includes(s2) || s2.includes(s1) ? 0.6 : 0;
  const bigrams = (s: string) => {
    const set = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const bg = s.substring(i, i + 2);
      set.set(bg, (set.get(bg) ?? 0) + 1);
    }
    return set;
  };
  const b1 = bigrams(s1);
  const b2 = bigrams(s2);
  let inter = 0;
  b1.forEach((count, bg) => {
    if (b2.has(bg)) inter += Math.min(count, b2.get(bg)!);
  });
  let total1 = 0; b1.forEach(c => { total1 += c; });
  let total2 = 0; b2.forEach(c => { total2 += c; });
  return (2 * inter) / (total1 + total2);
}

function countryContinent(countryName: string): string | undefined {
  return COUNTRIES.find(c => normalize(c.canonical) === normalize(countryName))?.continent;
}

function productCountryInRegion(product: ProductV2, regionCanonical: string): boolean {
  if (regionCanonical === 'Local') return true; // géré par la distance
  const continent = CONTINENT_BY_REGION[regionCanonical] ?? regionCanonical;
  const origin = product.origin_country ?? '';
  const manuf = product.manufacturing_country ?? '';
  return [origin, manuf].some(c => c && countryContinent(c) === continent);
}

function matchesAnyCountry(value: string | undefined, wanted: string[]): boolean {
  if (!value) return false;
  const nv = normalize(value);
  return wanted.some(w => nv.includes(normalize(w)) || normalize(w).includes(nv));
}

// ---------- Filtres durs (17 facettes) ----------

export interface HardFilterOutcome {
  pass: boolean;
  failedOn?: string;
  distanceKm?: number;
}

export function applyHardFilters(
  p: ProductV2,
  q: ParsedQueryV2,
  f: StructuredFiltersV2,
): HardFilterOutcome {
  // 14. PRIX
  const maxPrice = f.maxPrice ?? q.maxPrice;
  if (maxPrice !== undefined && p.price > maxPrice) return { pass: false, failedOn: 'prix max' };
  const minPrice = f.minPrice ?? q.minPrice;
  if (minPrice !== undefined && p.price < minPrice) return { pass: false, failedOn: 'prix min' };

  // 1. CERTIFICATIONS (bio & autres)
  const wantedCerts = Array.from(new Set([...(f.certifications ?? []), ...q.certifications]));
  if (wantedCerts.length > 0) {
    const prodCerts = (p.certifications ?? []).map(normalize);
    const okAll = wantedCerts.every(c =>
      prodCerts.some(pc => pc.includes(normalize(c)) || normalize(c).includes(pc)),
    );
    if (!okAll) return { pass: false, failedOn: `certification ${wantedCerts.join(', ')}` };
  }

  // 2. ORIGINE
  const wantedOrigin = Array.from(new Set([...(f.originCountries ?? []), ...q.originCountries]));
  if (wantedOrigin.length > 0 && !matchesAnyCountry(p.origin_country, wantedOrigin)
      && !matchesAnyCountry(p.manufacturing_country, wantedOrigin)) {
    return { pass: false, failedOn: 'origine' };
  }

  // 3. PAYS DE FABRICATION
  const wantedManuf = Array.from(new Set([...(f.manufacturingCountries ?? []), ...q.manufacturingCountries]));
  if (wantedManuf.length > 0 && !matchesAnyCountry(p.manufacturing_country, wantedManuf)) {
    return { pass: false, failedOn: 'pays de fabrication' };
  }

  // 4. PAYS DES MATIÈRES PREMIÈRES
  const wantedRaw = Array.from(new Set([...(f.rawMaterialCountries ?? []), ...q.rawMaterialCountries]));
  if (wantedRaw.length > 0) {
    const prodRaw = (p.raw_material_countries ?? []).map(normalize);
    const ok = wantedRaw.some(w => prodRaw.some(pr => pr.includes(normalize(w))));
    if (!ok) return { pass: false, failedOn: 'pays des matières premières' };
  }

  // RÉGIONS (Europe, Afrique…)
  const wantedRegions = Array.from(new Set([...(f.regions ?? []), ...q.regions]));
  const geoRegions = wantedRegions.filter(r => r !== 'Local');
  if (geoRegions.length > 0 && !geoRegions.some(r => productCountryInRegion(p, r))) {
    return { pass: false, failedOn: `région ${geoRegions.join('/')}` };
  }

  // 5. DISTANCE
  const maxDist = f.maxDistanceKm ?? q.maxDistanceKm;
  let distanceKm: number | undefined;
  if (f.userLocation && p.gps) {
    distanceKm = haversineKm(f.userLocation, p.gps);
  }
  if (maxDist !== undefined && f.userLocation) {
    if (distanceKm === undefined) return { pass: false, failedOn: 'distance (GPS produit inconnu)' };
    if (distanceKm > maxDist) return { pass: false, failedOn: `distance > ${maxDist} km` };
  }

  // 6. EMPREINTE CARBONE
  const maxCo2 = f.maxCarbonKg ?? q.maxCarbonKg;
  if (maxCo2 !== undefined && (p.carbon_footprint_kg === undefined || p.carbon_footprint_kg > maxCo2)) {
    return { pass: false, failedOn: `CO2 > ${maxCo2} kg` };
  }

  // 7. CONDITIONS SOCIALES
  if ((f.socialConditions ?? q.flags.socialConditions) &&
      !(p.social_audit_passed || p.no_child_labor_verified)) {
    return { pass: false, failedOn: 'conditions sociales' };
  }

  // 8. SALAIRE DÉCENT
  if ((f.livingWage ?? q.flags.livingWage) && !p.living_wage_guaranteed) {
    return { pass: false, failedOn: 'salaire décent' };
  }

  // 9. COMMERCE ÉQUITABLE
  if ((f.fairTrade ?? q.flags.fairTrade) && !p.fair_trade &&
      !(p.certifications ?? []).some(c => /equitable|fairtrade|fair trade|havelaar/i.test(normalize(c)))) {
    return { pass: false, failedOn: 'commerce équitable' };
  }

  // 10. RECYCLÉ (+ % minimal)
  if ((f.recycled ?? q.flags.recycled) && !p.is_recycled && !(p.recycled_percent && p.recycled_percent > 0)) {
    return { pass: false, failedOn: 'recyclé' };
  }
  const minRecycled = f.minRecycledPercent ?? q.minRecycledPercent;
  if (minRecycled !== undefined && (p.recycled_percent ?? 0) < minRecycled) {
    return { pass: false, failedOn: `recyclé < ${minRecycled}%` };
  }

  // 11. VEGAN
  if ((f.vegan ?? q.flags.vegan) && !p.is_vegan) {
    return { pass: false, failedOn: 'vegan' };
  }

  // 12. EMBALLAGE
  const pkgWanted: string[] = [...(f.packaging ?? [])];
  if (q.flags.plasticFreePackaging) pkgWanted.push('plastic_free');
  if (q.flags.compostablePackaging) pkgWanted.push('compostable');
  if (q.flags.recyclablePackaging) pkgWanted.push('recyclable');
  if (q.flags.bulkPackaging) pkgWanted.push('bulk');
  for (const pk of new Set(pkgWanted)) {
    const pkg = p.packaging ?? {};
    const ok =
      (pk === 'plastic_free' && pkg.plastic_free) ||
      (pk === 'compostable' && pkg.compostable) ||
      (pk === 'recyclable' && pkg.recyclable) ||
      (pk === 'bulk' && pkg.bulk_available) ||
      (pk === 'deposit' && pkg.deposit_system);
    if (!ok) return { pass: false, failedOn: `emballage ${pk}` };
  }

  // 13. MOQ
  const maxMoq = f.maxMoq ?? q.maxMoq;
  if (maxMoq !== undefined && (p.moq ?? 1) > maxMoq) {
    return { pass: false, failedOn: `MOQ > ${maxMoq}` };
  }

  // 15. DÉLAI
  const maxDelay = f.maxDeliveryDays ?? q.maxDeliveryDays;
  if (maxDelay !== undefined && (p.delivery_days === undefined || p.delivery_days > maxDelay)) {
    return { pass: false, failedOn: `délai > ${maxDelay} jours` };
  }

  // 16. FOURNISSEUR (filtre positif "du fournisseur X")
  const supplier = f.supplierName ?? (q.intent !== 'alternative_search' ? q.referenceSupplier : undefined);
  if (supplier && !normalize(p.supplier_name ?? '').includes(normalize(supplier))) {
    return { pass: false, failedOn: `fournisseur ${supplier}` };
  }

  // 17. SCORE DE CONFIANCE
  const minTrust = f.minTrustScore ?? q.minTrustScore;
  if (minTrust !== undefined && (p.trust_score ?? 0) < minTrust) {
    return { pass: false, failedOn: `score confiance < ${minTrust}` };
  }

  // TYPE DE PRODUIT (filtre dur quand explicitement détecté)
  if (q.productType) {
    const nt = normalize(q.productType);
    const inType = normalize(p.product_type ?? '').includes(nt);
    const inName = normalize(p.name).includes(nt);
    if (!inType && !inName) return { pass: false, failedOn: `type ${q.productType}` };
  }

  // Divers
  if ((f.gender && f.gender !== 'all') || q.gender) {
    const target = (f.gender && f.gender !== 'all' ? f.gender : q.gender)!;
    const pg = p.target_gender ?? 'unisexe';
    if (pg !== target && pg !== 'unisexe') return { pass: false, failedOn: 'genre' };
  }
  const wantedMaterials = Array.from(new Set([...(f.materials ?? []), ...q.materials]));
  if (wantedMaterials.length > 0) {
    const pm = (p.materials ?? []).map(normalize);
    const inText = normalize(`${p.name} ${p.description ?? ''}`);
    const ok = wantedMaterials.every(m => pm.some(x => x.includes(normalize(m))) || inText.includes(normalize(m)));
    if (!ok) return { pass: false, failedOn: `matière ${wantedMaterials.join(', ')}` };
  }
  if (f.inStockOnly && (p.stock_value ?? 0) <= 0) return { pass: false, failedOn: 'stock' };

  return { pass: true, distanceKm };
}

// ---------- Scoring pondéré ----------

export function scoreProduct(
  p: ProductV2,
  q: ParsedQueryV2,
  _f: StructuredFiltersV2,
  distanceKm?: number,
): { score: number; reasons: string[] } {
  let score = 50;
  const reasons: string[] = [];
  const nName = normalize(p.name);
  const nDesc = normalize(p.description ?? '');

  // Texte / sémantique
  if (q.rawQuery) {
    const sim = diceSimilarity(nName, q.rawQuery);
    if (sim > 0.3) { score += sim * 40; reasons.push('Correspondance titre'); }
  }
  if (q.productType) {
    const nt = normalize(q.productType);
    if (nName.includes(nt) || normalize(p.product_type ?? '').includes(nt)) {
      score += 35; reasons.push(`Type : ${q.productType}`);
    } else {
      score -= 25;
    }
  }
  q.freeTextKeywords.forEach(kw => {
    if (nName.includes(kw)) { score += 12; reasons.push(`Mot-clé « ${kw} »`); }
    else if (nDesc.includes(kw)) score += 6;
  });

  // Certifications & éthique (bonus lisibles)
  const prodCerts = (p.certifications ?? []);
  q.certifications.forEach(c => {
    if (prodCerts.some(pc => normalize(pc).includes(normalize(c)))) {
      score += 15; reasons.push(`Certifié ${c}`);
    }
  });
  if (p.fair_trade) { score += 6; if (q.flags.fairTrade) reasons.push('Commerce équitable'); }
  if (p.living_wage_guaranteed) { score += 6; if (q.flags.livingWage) reasons.push('Salaire décent garanti'); }
  if (p.is_vegan && q.flags.vegan) { score += 6; reasons.push('100% vegan'); }
  if (p.cooperative && q.flags.cooperative) { score += 6; reasons.push('Coopérative'); }
  if ((p.social_audit_passed || p.no_child_labor_verified) && q.flags.socialConditions) {
    score += 8; reasons.push('Audit social validé');
  }

  // Scores intrinsèques
  score += ((p.product_score ?? 50) / 100) * 15;
  score += ((p.trust_score ?? 50) / 100) * 12;
  if ((p.carbon_footprint_kg ?? 99) <= 2) { score += 8; reasons.push('Faible empreinte carbone'); }
  if ((p.traceability_score ?? 0) >= 80) { score += 8; reasons.push('Traçabilité élevée'); }

  // Distance
  if (distanceKm !== undefined) {
    if (distanceKm < 100) { score += 12; reasons.push(`À ${distanceKm} km`); }
    else if (distanceKm < 500) score += 6;
  }

  // ---- PRIORITÉS DE CLASSEMENT (le cœur du "moins cher mais mieux tracé") ----
  const pri = q.priorities;
  if (pri.cheaper) {
    // moins le prix est élevé au sein de sa gamme, plus le bonus est grand
    score += Math.max(0, 25 - p.price * 0.5);
  }
  if (pri.lowerCarbon) {
    score += Math.max(0, 20 - (p.carbon_footprint_kg ?? 10) * 4);
    if ((p.carbon_footprint_kg ?? 99) <= 1.5) reasons.push('Priorité bas carbone');
  }
  if (pri.betterTraceability) {
    score += ((p.traceability_score ?? 0) / 100) * 30;
    if ((p.traceability_score ?? 0) >= 70) reasons.push('Priorité traçabilité');
  }
  if (pri.fasterDelivery) {
    score += Math.max(0, 20 - (p.delivery_days ?? 30));
  }
  if (pri.higherTrust) {
    score += ((p.trust_score ?? 0) / 100) * 25;
  }

  // Notes clients
  if ((p.rating ?? 0) >= 4.5 && (p.reviews_count ?? 0) >= 5) {
    score += 6; reasons.push(`${p.rating}★ (${p.reviews_count} avis)`);
  }

  return { score: Math.round(score), reasons: Array.from(new Set(reasons)) };
}

// ---------- Recherche complète ----------

export function runSearch(
  products: ProductV2[],
  parsed: ParsedQueryV2,
  filters: StructuredFiltersV2 = {},
): SearchResponseV2 {
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const appliedHardFilters = new Set<string>();
  const results: ScoredResult[] = [];

  for (const p of products) {
    const outcome = applyHardFilters(p, parsed, filters);
    if (!outcome.pass) {
      if (outcome.failedOn) appliedHardFilters.add(outcome.failedOn);
      continue;
    }
    const { score, reasons } = scoreProduct(p, parsed, filters, outcome.distanceKm);
    results.push({ ...p, searchScore: score, matchReasons: reasons, distanceKm: outcome.distanceKm });
  }

  // Tri
  const sortBy = filters.sortBy ?? 'relevance';
  results.sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'carbon': return (a.carbon_footprint_kg ?? 99) - (b.carbon_footprint_kg ?? 99);
      case 'trust': return (b.trust_score ?? 0) - (a.trust_score ?? 0);
      case 'traceability': return (b.traceability_score ?? 0) - (a.traceability_score ?? 0);
      case 'delivery': return (a.delivery_days ?? 99) - (b.delivery_days ?? 99);
      case 'distance': return (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9);
      case 'rating': return (b.rating ?? 0) - (a.rating ?? 0);
      default: return b.searchScore - a.searchScore;
    }
  });

  // Facettes agrégées
  const facet = (extract: (p: ScoredResult) => string[]) => {
    const counts: Record<string, number> = {};
    results.forEach(p => extract(p).forEach(v => { if (v) counts[v] = (counts[v] ?? 0) + 1; }));
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  };

  const facetCounts = {
    certifications: facet(p => p.certifications ?? []),
    originCountries: facet(p => [p.origin_country ?? '']),
    manufacturingCountries: facet(p => [p.manufacturing_country ?? '']),
    materials: facet(p => p.materials ?? []),
    suppliers: facet(p => [p.supplier_name ?? '']),
  };

  const limit = filters.limit ?? 50;
  const offset = filters.offset ?? 0;
  const t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();

  return {
    results: results.slice(offset, offset + limit),
    totalCount: results.length,
    parsedQuery: parsed,
    executionTimeMs: Math.round(t1 - t0),
    appliedHardFilters: Array.from(appliedHardFilters),
    facetCounts,
  };
}
