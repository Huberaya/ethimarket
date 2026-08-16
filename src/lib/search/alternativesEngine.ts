// =============================================================
// EthiMarket Search V2 — Couche 4 : Moteur d'alternatives
// "Trouve-moi une alternative au fournisseur X qui coûte moins cher
//  mais avec une meilleure traçabilité."
// =============================================================

import { ParsedQueryV2, ProductV2, AlternativeResult, ScoredResult, StructuredFiltersV2 } from './types';
import { normalize } from './zeroApiParser';
import { scoreProduct, applyHardFilters, diceSimilarity } from './searchEngine';

/** Trouve le(s) produit(s) de référence à partir du nom de fournisseur ou produit. */
export function resolveReference(
  catalog: ProductV2[],
  parsed: ParsedQueryV2,
): { referenceProducts: ProductV2[]; referenceSupplier?: string } {
  if (parsed.referenceSupplier) {
    const ns = normalize(parsed.referenceSupplier);
    const products = catalog.filter(p => {
      const sup = normalize(p.supplier_name ?? '');
      return sup !== '' && (sup.includes(ns) || ns.includes(sup) || diceSimilarity(sup, ns) > 0.55);
    });
    return { referenceProducts: products, referenceSupplier: parsed.referenceSupplier };
  }
  if (parsed.referenceProduct) {
    const np = normalize(parsed.referenceProduct);
    const scored = catalog
      .map(p => ({ p, sim: diceSimilarity(normalize(p.name), np) }))
      .filter(x => x.sim > 0.35)
      .sort((a, b) => b.sim - a.sim);
    return { referenceProducts: scored.slice(0, 3).map(x => x.p) };
  }
  return { referenceProducts: [] };
}

function sameFamily(a: ProductV2, b: ProductV2): boolean {
  if (a.category_id && b.category_id && a.category_id === b.category_id) return true;
  if (a.product_type && b.product_type && normalize(a.product_type) === normalize(b.product_type)) return true;
  return diceSimilarity(normalize(a.name), normalize(b.name)) > 0.4;
}

/**
 * Génère des recommandations d'alternatives ordonnées, avec avantages,
 * compromis et raison de recommandation en français.
 */
export function findAlternatives(
  catalog: ProductV2[],
  parsed: ParsedQueryV2,
  filters: StructuredFiltersV2 = {},
  maxResults = 10,
): AlternativeResult[] {
  const { referenceProducts, referenceSupplier } = resolveReference(catalog, parsed);
  if (referenceProducts.length === 0) return [];

  // Références moyennes (si le fournisseur a plusieurs produits)
  const avg = (xs: (number | undefined)[]) => {
    const v = xs.filter((x): x is number => x !== undefined);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : undefined;
  };
  const refPrice = avg(referenceProducts.map(p => p.price)) ?? 0;
  const refCarbon = avg(referenceProducts.map(p => p.carbon_footprint_kg));
  const refTrace = avg(referenceProducts.map(p => p.traceability_score)) ?? 0;
  const refTrust = avg(referenceProducts.map(p => p.trust_score)) ?? 0;
  const mainRef = referenceProducts[0];

  // Candidats : même famille, fournisseur différent
  const excludedSupplier = referenceSupplier ? normalize(referenceSupplier) : normalize(mainRef.supplier_name ?? '');
  const candidates = catalog.filter(p => {
    if (referenceProducts.some(r => r.id === p.id)) return false;
    if (excludedSupplier && normalize(p.supplier_name ?? '').includes(excludedSupplier)) return false;
    return referenceProducts.some(r => sameFamily(r, p));
  });

  const out: AlternativeResult[] = [];
  for (const cand of candidates) {
    // Les filtres durs de la requête restent applicables
    const outcome = applyHardFilters(cand, { ...parsed, referenceSupplier: undefined }, filters);
    if (!outcome.pass) continue;

    const priceDiffPct = refPrice > 0 ? ((cand.price - refPrice) / refPrice) * 100 : 0;
    const candCarbon = cand.carbon_footprint_kg;
    const carbonDiffPct = refCarbon && candCarbon !== undefined
      ? ((candCarbon - refCarbon) / refCarbon) * 100 : 0;
    const traceDiff = (cand.traceability_score ?? 0) - refTrace;
    const trustDiff = (cand.trust_score ?? 0) - refTrust;

    // Respect strict des priorités demandées
    if (parsed.priorities.cheaper && priceDiffPct >= 0) continue;
    if (parsed.priorities.betterTraceability && traceDiff <= 0) continue;
    if (parsed.priorities.lowerCarbon && carbonDiffPct >= 0) continue;
    if (parsed.priorities.higherTrust && trustDiff <= 0) continue;

    const advantages: string[] = [];
    const tradeoffs: string[] = [];

    if (priceDiffPct < -1) advantages.push(`${Math.abs(Math.round(priceDiffPct))}% moins cher (${(refPrice - cand.price).toFixed(2)} € d'économie)`);
    else if (priceDiffPct > 1) tradeoffs.push(`+${Math.round(priceDiffPct)}% plus cher`);

    if (traceDiff > 5) advantages.push(`Traçabilité supérieure (+${Math.round(traceDiff)} pts)`);
    else if (traceDiff < -5) tradeoffs.push(`Traçabilité inférieure (${Math.round(traceDiff)} pts)`);

    if (carbonDiffPct < -5) advantages.push(`${Math.abs(Math.round(carbonDiffPct))}% de CO2 en moins`);
    else if (carbonDiffPct > 5) tradeoffs.push(`+${Math.round(carbonDiffPct)}% de CO2`);

    if (trustDiff > 5) advantages.push(`Score de confiance supérieur (+${Math.round(trustDiff)} pts)`);
    else if (trustDiff < -5) tradeoffs.push(`Score de confiance inférieur (${Math.round(trustDiff)} pts)`);

    if (cand.living_wage_guaranteed && !mainRef.living_wage_guaranteed) advantages.push('Salaire décent garanti');
    if (cand.fair_trade && !mainRef.fair_trade) advantages.push('Commerce équitable');
    const candCerts = new Set((cand.certifications ?? []).map(normalize));
    const refCerts = new Set((mainRef.certifications ?? []).map(normalize));
    const extraCerts = (cand.certifications ?? []).filter(c => !refCerts.has(normalize(c)));
    if (extraCerts.length) advantages.push(`Certifications en plus : ${extraCerts.join(', ')}`);
    const lostCerts = (mainRef.certifications ?? []).filter(c => !candCerts.has(normalize(c)));
    if (lostCerts.length) tradeoffs.push(`Certifications absentes : ${lostCerts.join(', ')}`);

    if ((cand.delivery_days ?? 99) < (mainRef.delivery_days ?? 99)) {
      advantages.push(`Livraison plus rapide (${cand.delivery_days} j)`);
    }

    const { score, reasons } = scoreProduct(cand, parsed, filters, outcome.distanceKm);
    const scored: ScoredResult = { ...cand, searchScore: score, matchReasons: reasons, distanceKm: outcome.distanceKm };

    // Raison de recommandation synthétique
    const reasonParts: string[] = [];
    if (parsed.priorities.cheaper) reasonParts.push(`${Math.abs(Math.round(priceDiffPct))}% d'économie`);
    if (parsed.priorities.betterTraceability) reasonParts.push(`traçabilité +${Math.round(traceDiff)} pts`);
    if (parsed.priorities.lowerCarbon && carbonDiffPct < 0) reasonParts.push(`${Math.abs(Math.round(carbonDiffPct))}% de CO2 en moins`);
    if (parsed.priorities.higherTrust) reasonParts.push(`confiance +${Math.round(trustDiff)} pts`);
    const reason = reasonParts.length
      ? `Répond à vos critères : ${reasonParts.join(', ')} par rapport à ${referenceSupplier ?? mainRef.name}.`
      : `Alternative pertinente à ${referenceSupplier ?? mainRef.name} (${advantages[0] ?? 'profil comparable'}).`;

    out.push({
      product: scored,
      reference: mainRef,
      priceDiffPct: Math.round(priceDiffPct * 10) / 10,
      carbonDiffPct: Math.round(carbonDiffPct * 10) / 10,
      traceabilityDiff: Math.round(traceDiff),
      trustDiff: Math.round(trustDiff),
      advantages,
      tradeoffs,
      reason,
    });
  }

  // Classement : priorités demandées d'abord, puis score global
  out.sort((a, b) => {
    let sa = a.product.searchScore;
    let sb = b.product.searchScore;
    if (parsed.priorities.cheaper) { sa += -a.priceDiffPct; sb += -b.priceDiffPct; }
    if (parsed.priorities.betterTraceability) { sa += a.traceabilityDiff; sb += b.traceabilityDiff; }
    if (parsed.priorities.lowerCarbon) { sa += -a.carbonDiffPct; sb += -b.carbonDiffPct; }
    if (parsed.priorities.higherTrust) { sa += a.trustDiff; sb += b.trustDiff; }
    return sb - sa;
  });

  return out.slice(0, maxResults);
}
