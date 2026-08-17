// =============================================================
// EthiMarket — Assistant d'impact : estimateur CO2 / eau
//
// PROBLÈME RÉSOLU : les agriculteurs ne connaissent pas leur
// empreinte carbone ou eau (une ACV coûte plusieurs milliers
// d'euros). Plutôt que de les pénaliser ou de les pousser à
// inventer un chiffre, la plateforme ESTIME l'empreinte à partir
// des moyennes sectorielles sourcées (Agribalyse 3.1, Poore &
// Nemecek 2018, Water Footprint Network) selon la catégorie du
// produit et la méthode agricole (bio → réduction documentée).
//
// RÈGLES D'HONNÊTETÉ :
//  1. Une estimation est TOUJOURS affichée comme telle
//     (source = 'estimated'), jamais confondue avec une ACV.
//  2. La performance carbone/eau est jugée RELATIVEMENT à la
//     référence conventionnelle de la même catégorie — comparer
//     le CO2 absolu d'un café (≈16 kg/kg) à celui d'un miel
//     (≈1,8 kg/kg) n'a aucun sens.
//  3. Moteur 100% local et déterministe — zéro API, zéro coût.
// =============================================================

import {
  PRODUCTION_FACTORS_SOURCED,
  WATER_FACTORS_SOURCED,
} from './impactFactors';
import { mapProductToCategory, checkIfBio, round } from './calculations';

type DataRecord = Record<string, unknown> | null | undefined;

/** Provenance d'une valeur d'empreinte. */
export type FootprintSource = 'producer' | 'estimated';

export interface FootprintEstimate {
  /** Catégorie sectorielle résolue (coffee, cocoa, tea, …) */
  category: string;
  /** Le produit est-il considéré bio (certif ou méthode) ? */
  isBio: boolean;
  /** kg CO2e / kg — estimation (réduction bio appliquée si applicable) */
  co2PerKg: number;
  /** kg CO2e / kg — référence conventionnelle de la catégorie */
  co2ConventionalPerKg: number;
  co2SourceLabel: string;
  co2UncertaintyPct: number;
  /** L / kg — estimation (réduction eau grise appliquée si bio) */
  waterPerKg: number;
  /** L / kg — référence conventionnelle de la catégorie */
  waterConventionalPerKg: number;
  waterSourceLabel: string;
  waterUncertaintyPct: number;
}

/**
 * Estime les empreintes CO2 et eau d'un produit à partir des
 * moyennes sectorielles sourcées. Fonction PURE.
 */
export function estimateFootprints(product: DataRecord, producer: DataRecord = null): FootprintEstimate {
  const p = (product ?? {}) as Record<string, unknown>;
  const categories = p.categories as Record<string, unknown> | undefined;
  // Essaie chaque indice dans l'ordre et retient la première
  // correspondance NON générique ('spices' est la valeur par défaut
  // de mapProductToCategory) — sinon retombe sur 'spices'.
  const hints = [
    p.product_type as string,
    categories?.name as string,
    p.category_name as string,
    p.name as string,
  ].filter(Boolean) as string[];
  let category = 'spices';
  for (const hint of hints) {
    const mapped = mapProductToCategory(hint);
    if (mapped !== 'spices' || /épice|spice|poivre|curcuma|gingembre|cannelle|safran/i.test(hint)) {
      category = mapped;
      break;
    }
  }
  const isBio = checkIfBio(producer as Record<string, unknown>, p);

  const co2Entry = PRODUCTION_FACTORS_SOURCED[category] || PRODUCTION_FACTORS_SOURCED['spices'];
  const co2Conv = co2Entry.conv.value;
  const co2Est = isBio ? co2Conv * (1 - co2Entry.organicReductionPct / 100) : co2Conv;

  const waterEntry = WATER_FACTORS_SOURCED[category] || WATER_FACTORS_SOURCED['spices'];
  const waterConv = waterEntry.total.value;
  const greyConv = waterConv * waterEntry.greyPct / 100;
  const greyBio = greyConv * (1 - waterEntry.organicGreyReductionPct / 100);
  const waterEst = isBio
    ? waterConv - greyConv + greyBio
    : waterConv;

  return {
    category,
    isBio,
    co2PerKg: round(co2Est, 2),
    co2ConventionalPerKg: round(co2Conv, 2),
    co2SourceLabel: co2Entry.conv.source,
    co2UncertaintyPct: co2Entry.conv.uncertaintyPct,
    waterPerKg: Math.round(waterEst),
    waterConventionalPerKg: Math.round(waterConv),
    waterSourceLabel: waterEntry.total.source,
    waterUncertaintyPct: waterEntry.total.uncertaintyPct,
  };
}

export interface ResolvedFootprint {
  /** Valeur retenue (kg CO2e/kg ou L/kg) */
  value: number;
  /** 'producer' = ACV fournie ; 'estimated' = moyenne sectorielle */
  source: FootprintSource;
  /** Référence conventionnelle de la catégorie (même unité) */
  conventional: number;
  /** value / conventional — < 1 = mieux que la référence */
  ratio: number;
}

/**
 * Résout l'empreinte carbone effective d'un produit :
 *  - valeur stockée marquée 'producer' (ACV) → prioritaire ;
 *  - valeur stockée marquée 'estimated' → réutilisée telle quelle ;
 *  - rien en base → estimation sectorielle calculée à la volée.
 */
export function resolveCarbonFootprint(product: DataRecord, producer: DataRecord = null): ResolvedFootprint {
  const p = (product ?? {}) as Record<string, unknown>;
  const est = estimateFootprints(product, producer);
  const stored = Number(p.carbon_footprint_kg);
  const storedSource = p.carbon_footprint_source as string | undefined;
  if (Number.isFinite(stored) && stored > 0) {
    const source: FootprintSource = storedSource === 'estimated' ? 'estimated' : 'producer';
    return {
      value: stored,
      source,
      conventional: est.co2ConventionalPerKg,
      ratio: round(stored / est.co2ConventionalPerKg, 3),
    };
  }
  return {
    value: est.co2PerKg,
    source: 'estimated',
    conventional: est.co2ConventionalPerKg,
    ratio: round(est.co2PerKg / est.co2ConventionalPerKg, 3),
  };
}

/** Idem pour l'empreinte eau (L/kg). */
export function resolveWaterFootprint(product: DataRecord, producer: DataRecord = null): ResolvedFootprint {
  const p = (product ?? {}) as Record<string, unknown>;
  const est = estimateFootprints(product, producer);
  const stored = Number(p.water_footprint_liters);
  const storedSource = p.water_footprint_source as string | undefined;
  if (Number.isFinite(stored) && stored > 0) {
    const source: FootprintSource = storedSource === 'estimated' ? 'estimated' : 'producer';
    return {
      value: stored,
      source,
      conventional: est.waterConventionalPerKg,
      ratio: round(stored / est.waterConventionalPerKg, 3),
    };
  }
  return {
    value: est.waterPerKg,
    source: 'estimated',
    conventional: est.waterConventionalPerKg,
    ratio: round(est.waterPerKg / est.waterConventionalPerKg, 3),
  };
}

/** Palier de performance carbone RELATIF à la catégorie. */
export type CarbonTier = 'excellent' | 'good' | 'neutral' | 'high';

export interface CarbonPerformance extends ResolvedFootprint {
  tier: CarbonTier;
}

/**
 * Juge la performance carbone d'un produit par rapport à la
 * référence conventionnelle de SA catégorie :
 *  - ratio ≤ 0,60 → 'excellent' (très inférieure à la référence)
 *  - ratio ≤ 0,95 → 'good'      (inférieure à la référence)
 *  - ratio ≤ 1,15 → 'neutral'   (dans la moyenne)
 *  - au-delà      → 'high'      (supérieure à la référence)
 */
export function carbonPerformance(product: DataRecord, producer: DataRecord = null): CarbonPerformance {
  const resolved = resolveCarbonFootprint(product, producer);
  const tier: CarbonTier =
    resolved.ratio <= 0.6 ? 'excellent'
    : resolved.ratio <= 0.95 ? 'good'
    : resolved.ratio <= 1.15 ? 'neutral'
    : 'high';
  return { ...resolved, tier };
}

/** Idem pour l'eau. */
export function waterPerformance(product: DataRecord, producer: DataRecord = null): CarbonPerformance {
  const resolved = resolveWaterFootprint(product, producer);
  const tier: CarbonTier =
    resolved.ratio <= 0.6 ? 'excellent'
    : resolved.ratio <= 0.95 ? 'good'
    : resolved.ratio <= 1.15 ? 'neutral'
    : 'high';
  return { ...resolved, tier };
}

/** Libellé court de provenance (badges UI). */
export function footprintSourceLabel(source: FootprintSource): string {
  return source === 'producer' ? '📄 ACV producteur' : '📊 Estimation sectorielle sourcée';
}
