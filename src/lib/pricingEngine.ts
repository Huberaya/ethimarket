// =============================================================
// EthiMarket — Moteur de tarification & conditions commerciales
//
// TOUT ce qui s'affiche sur la fiche produit (grille dégressive,
// stock, livraison, capacité, total commande) est DÉRIVÉ des
// données transmises par le producteur — jamais codé en dur.
//
//  * Grille dégressive : soit les paliers définis par le producteur
//    (volume_tiers), soit une grille générée à partir de son MOQ
//    et de sa remise maximale consentie.
//  * Prix appliqué : celui du palier atteint par la quantité.
//  * Capacité/délais : produit, sinon repli sur le profil producteur.
// =============================================================

import { Product, Producer } from './supabase';

/** Palier défini par le producteur (stocké en JSONB `volume_tiers`) */
export interface ProducerTier {
  /** Quantité minimale du palier (dans l'unité du produit) */
  min_qty: number;
  /** Remise en % par rapport au prix de base (0 = prix standard) */
  discount_pct: number;
}

export interface ResolvedTier {
  min: number;
  max: number | null;          // null = "et plus" (sur devis si quote_above)
  price: number | null;        // null = sur devis
  discount: number | null;     // % ; null = sur devis
  label: string;
  isQuote: boolean;
}

export interface PricingSchedule {
  tiers: ResolvedTier[];
  /** Quantité au-delà de laquelle on passe "sur devis" */
  quoteAboveQty: number | null;
  source: 'producer_tiers' | 'generated_from_moq';
}

export interface QuantityPricing {
  unitPrice: number | null;    // null = sur devis
  tier: ResolvedTier | null;
  totalAmount: number | null;
  isQuote: boolean;
  savingsVsBase: number;       // € économisés vs prix de base
}

const round2 = (v: number) => Math.round(v * 100) / 100;

/**
 * Construit la grille tarifaire d'un produit.
 * Priorité aux paliers SAISIS par le producteur ; sinon génération
 * déterministe à partir du MOQ et de la remise max consentie.
 */
export function buildPricingSchedule(product: {
  price: number;
  moq_value?: number | null;
  volume_tiers?: ProducerTier[] | null;
  max_volume_discount_pct?: number | null;
  quote_threshold_qty?: number | null;
  stock_value?: number | null;
}): PricingSchedule {
  const basePrice = Number(product.price) || 0;
  const moq = Math.max(1, Number(product.moq_value) || 1);

  // ---- Cas 1 : paliers définis par le producteur ----
  const raw = (product.volume_tiers ?? [])
    .filter(t => t && Number(t.min_qty) > 0 && Number(t.discount_pct) >= 0 && Number(t.discount_pct) <= 90)
    .map(t => ({ min_qty: Number(t.min_qty), discount_pct: Number(t.discount_pct) }))
    .sort((a, b) => a.min_qty - b.min_qty);

  const quoteAbove = product.quote_threshold_qty && product.quote_threshold_qty > moq
    ? Number(product.quote_threshold_qty)
    : null;

  // Les paliers sous le MOQ sont incohérents (inatteignables) : ignorés.
  const aboveMoq = raw.filter(t => t.min_qty > moq);

  if (aboveMoq.length > 0) {
    // Palier de base TOUJOURS présent : du MOQ au premier palier producteur
    const points: ProducerTier[] = [{ min_qty: moq, discount_pct: 0 }, ...aboveMoq];

    const tiers: ResolvedTier[] = points.map((t, i) => {
      const nextMin = points[i + 1]?.min_qty ?? quoteAbove;
      const price = round2(basePrice * (1 - t.discount_pct / 100));
      return {
        min: t.min_qty,
        max: nextMin ? nextMin - 1 : null,
        price,
        discount: t.discount_pct,
        label: `${price.toFixed(2)} €`,
        isQuote: false,
      };
    });
    if (quoteAbove) {
      tiers.push({ min: quoteAbove, max: null, price: null, discount: null, label: 'Sur devis', isQuote: true });
    }
    return { tiers, quoteAboveQty: quoteAbove, source: 'producer_tiers' };
  }

  // ---- Cas 2 : génération à partir du MOQ + remise max consentie ----
  // Progression standard B2B : MOQ → 5×MOQ → 25×MOQ → 50×MOQ (devis).
  // La remise max consentie par le producteur (défaut 20%) est répartie
  // ~55% au palier 2 et 100% au palier 3.
  const maxDiscount = Math.min(60, Math.max(0, Number(product.max_volume_discount_pct ?? 20)));
  const t2 = Math.round(maxDiscount * 0.55);
  const t3 = maxDiscount;
  const p2 = moq * 5;
  const p3 = moq * 25;
  const pQuote = quoteAbove ?? moq * 50;

  const tiers: ResolvedTier[] = [
    { min: moq, max: p2 - 1, price: round2(basePrice), discount: 0, label: `${basePrice.toFixed(2)} €`, isQuote: false },
    { min: p2, max: p3 - 1, price: round2(basePrice * (1 - t2 / 100)), discount: t2, label: `${round2(basePrice * (1 - t2 / 100)).toFixed(2)} €`, isQuote: false },
    { min: p3, max: pQuote - 1, price: round2(basePrice * (1 - t3 / 100)), discount: t3, label: `${round2(basePrice * (1 - t3 / 100)).toFixed(2)} €`, isQuote: false },
    { min: pQuote, max: null, price: null, discount: null, label: 'Sur devis', isQuote: true },
  ];
  // Si la remise max est 0, une seule ligne + devis
  const deduped = maxDiscount === 0
    ? [
        { ...tiers[0], max: pQuote - 1 },
        tiers[3],
      ]
    : tiers;

  return { tiers: deduped, quoteAboveQty: pQuote, source: 'generated_from_moq' };
}

/** Prix unitaire et total pour une quantité donnée, selon la grille. */
export function priceForQuantity(schedule: PricingSchedule, basePrice: number, qty: number): QuantityPricing {
  const tier = schedule.tiers.find(t => qty >= t.min && (t.max === null || qty <= t.max)) ?? null;
  if (!tier || tier.isQuote || tier.price === null) {
    return { unitPrice: null, tier, totalAmount: null, isQuote: true, savingsVsBase: 0 };
  }
  const total = round2(tier.price * qty);
  const savings = round2(Math.max(0, (basePrice - tier.price) * qty));
  return { unitPrice: tier.price, tier, totalAmount: total, isQuote: false, savingsVsBase: savings };
}

// -------------------------------------------------------------
// Conditions logistiques dérivées producteur → produit
// -------------------------------------------------------------

export interface LogisticsInfo {
  stockValue: number;
  stockUnit: string;
  deliveryDaysLabel: string;    // "7-10"
  deliverySource: 'product' | 'producer' | 'default';
  monthlyCapacity: number;
  capacitySource: 'product' | 'producer_annual' | 'unknown';
}

/**
 * Résout stock / délai / capacité : données produit d'abord,
 * repli sur le profil producteur, jamais de zéro mensonger.
 */
export function resolveLogistics(
  product: Partial<Product>,
  producer?: Partial<Producer> | null,
): LogisticsInfo {
  // Délai : produit → moyenne producteur → défaut affiché comme estimation
  let deliveryDaysLabel = String(product.delivery_days ?? '').trim();
  let deliverySource: LogisticsInfo['deliverySource'] = 'product';
  if (!deliveryDaysLabel || deliveryDaysLabel === '0') {
    const avg = producer?.delivery_days_avg;
    if (avg) {
      deliveryDaysLabel = String(avg);
      deliverySource = 'producer';
    } else {
      deliveryDaysLabel = '7-14';
      deliverySource = 'default';
    }
  }

  // Capacité : produit → annuel producteur / 12
  let monthlyCapacity = Number(product.monthly_capacity) || 0;
  let capacitySource: LogisticsInfo['capacitySource'] = 'product';
  if (monthlyCapacity <= 0) {
    const annual = Number((producer as Record<string, unknown> | undefined)?.annual_capacity) || 0;
    if (annual > 0) {
      monthlyCapacity = Math.round(annual / 12);
      capacitySource = 'producer_annual';
    } else {
      capacitySource = 'unknown';
    }
  }

  return {
    stockValue: Number(product.stock_value) || 0,
    stockUnit: product.stock_unit || product.moq_unit || 'unités',
    deliveryDaysLabel,
    deliverySource,
    monthlyCapacity,
    capacitySource,
  };
}
