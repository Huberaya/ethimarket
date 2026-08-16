// =============================================================
// EthiMarket — Espace Acheteur : données, préférences & APPRENTISSAGE
//
// L'acheteur définit ses pondérations (Prix 30% / Environnement 25% /
// Social 20% / Traçabilité 15% / Certifications 10%…) et la plateforme
// APPREND de ses décisions : chaque événement (produit approuvé/rejeté,
// achat, recommandation suivie/ignorée) alimente un profil appris —
// « Cet acheteur privilégie la traçabilité plutôt que le prix » — qui
// ajuste les recommandations. Moteur 100% local, zéro API payante.
// =============================================================

import { supabase, Product } from './supabase';

// -------------------- Types --------------------

export type SupplierTrackStatus = 'active' | 'evaluating' | 'at_risk' | 'suspended';
export type ProductTrackStatus = 'approved' | 'analyzing' | 'rejected';

export interface BuyerWeights {
  price: number;
  environment: number;
  social: number;
  traceability: number;
  certifications: number;
}

export const DEFAULT_WEIGHTS: BuyerWeights = {
  price: 30, environment: 25, social: 20, traceability: 15, certifications: 10,
};

export interface LearnedProfile {
  /** Dérive apprise par critère, en points (-15 … +15) */
  adjustments: Partial<BuyerWeights>;
  /** Phrase d'explication : « Vous privilégiez la traçabilité plutôt que le prix » */
  insights: string[];
  eventsAnalyzed: number;
  updatedAt: string;
}

export interface BuyerPreferences {
  weights: BuyerWeights;
  learned: LearnedProfile | null;
  useLearnedAdjustments: boolean;
}

export interface TrackedSupplier {
  id: string;
  producer_id: string;
  status: SupplierTrackStatus;
  notes?: string;
  producer?: { id: string; name: string; country: string; country_flag: string; slug: string; rating: number };
}

export interface TrackedProduct {
  id: string;
  product_id: string;
  status: ProductTrackStatus;
  rejection_reason?: string;
  product?: Product;
}

export interface PurchaseRecord {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  currency: string;
  baseline_unit_price?: number;
  carbon_footprint_kg?: number;
  ethical_score?: number;
  traceability_score?: number;
  is_responsible: boolean;
  purchased_at: string;
}

export interface PurchaseAnalytics {
  totalSpent: number;
  responsibleSpent: number;
  responsibleSharePct: number;
  savings: number;                 // Σ (baseline - payé) quand baseline > payé
  premiumPaid: number;             // Σ (payé - baseline) quand payé > baseline
  totalCarbonKg: number;
  avgEthicalScore: number;
  scoreTrend: { month: string; avgScore: number; spent: number }[];
  purchaseCount: number;
}

// -------------------- Préférences --------------------

export async function getBuyerPreferences(userId: string): Promise<BuyerPreferences> {
  const { data } = await supabase.from('buyer_preferences').select('*').eq('user_id', userId).maybeSingle();
  if (!data) {
    return { weights: { ...DEFAULT_WEIGHTS }, learned: null, useLearnedAdjustments: true };
  }
  return {
    weights: {
      price: data.weight_price,
      environment: data.weight_environment,
      social: data.weight_social,
      traceability: data.weight_traceability,
      certifications: data.weight_certifications,
    },
    learned: (data.learned_profile && Object.keys(data.learned_profile).length > 0)
      ? data.learned_profile as LearnedProfile
      : null,
    useLearnedAdjustments: data.use_learned_adjustments ?? true,
  };
}

export function validateWeights(w: BuyerWeights): string | null {
  const vals = Object.values(w);
  if (vals.some(v => v < 0 || v > 100 || !Number.isInteger(v))) {
    return 'Chaque pondération doit être un entier entre 0 et 100.';
  }
  const sum = vals.reduce((a, b) => a + b, 0);
  if (sum !== 100) return `La somme des pondérations doit faire 100% (actuellement ${sum}%).`;
  return null;
}

export async function saveBuyerWeights(userId: string, weights: BuyerWeights, useLearned: boolean): Promise<string | null> {
  const invalid = validateWeights(weights);
  if (invalid) return invalid;
  const { error } = await supabase.from('buyer_preferences').upsert({
    user_id: userId,
    weight_price: weights.price,
    weight_environment: weights.environment,
    weight_social: weights.social,
    weight_traceability: weights.traceability,
    weight_certifications: weights.certifications,
    use_learned_adjustments: useLearned,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  return error?.message ?? null;
}

// -------------------- Événements & apprentissage --------------------

export type BuyerEventType =
  | 'product_view' | 'comparison_run' | 'recommendation_followed' | 'recommendation_ignored'
  | 'product_approved' | 'product_rejected' | 'purchase' | 'supplier_status_change' | 'filter_used';

/** Signature d'un événement : quelles caractéristiques du produit ont motivé la décision. */
export interface EventSignal {
  priceScore?: number;          // 100 = pas cher
  environmentScore?: number;
  socialScore?: number;
  traceabilityScore?: number;
  certificationScore?: number;
}

export async function recordBuyerEvent(
  userId: string,
  eventType: BuyerEventType,
  options: { productId?: string; producerId?: string; signal?: EventSignal; extra?: Record<string, unknown> } = {},
): Promise<void> {
  try {
    await supabase.from('buyer_events').insert({
      user_id: userId,
      event_type: eventType,
      product_id: options.productId ?? null,
      producer_id: options.producerId ?? null,
      metadata: { signal: options.signal ?? {}, ...options.extra },
    });
  } catch { /* jamais bloquant */ }
}

/** Extrait le signal d'un produit (pour tracer les décisions). */
export function productSignal(p: Product, panelMinPrice?: number): EventSignal {
  const price = panelMinPrice && p.price
    ? Math.max(0, Math.min(100, Math.round(100 - ((p.price - panelMinPrice) / panelMinPrice) * 100)))
    : 50;
  let env = 30;
  if ((p.carbon_footprint_kg ?? 99) <= 1) env += 40; else if ((p.carbon_footprint_kg ?? 99) <= 2) env += 25;
  if ((p.packaging_types ?? []).some(t => ['plastic_free', 'compostable'].includes(t))) env += 15;
  if (p.is_recycled) env += 10;
  let soc = 20;
  if (p.fair_trade) soc += 25;
  if (p.living_wage_guaranteed) soc += 25;
  if (p.social_audit_passed) soc += 20;
  if (p.is_cooperative) soc += 10;
  let tra = 10;
  if (p.batch_number) tra += 25;
  if (p.gps_coordinates) tra += 20;
  if (p.manufacturing_country) tra += 15;
  if (p.raw_materials_origin) tra += 15;
  if (p.trace_qr_code) tra += 15;
  const cert = Math.min(100, 20 + (p.certifications?.length ?? 0) * 25);
  return {
    priceScore: price,
    environmentScore: Math.min(100, env),
    socialScore: Math.min(100, soc),
    traceabilityScore: Math.min(100, tra),
    certificationScore: cert,
  };
}

const CRITERIA: (keyof BuyerWeights)[] = ['price', 'environment', 'social', 'traceability', 'certifications'];
const SIGNAL_KEYS: Record<keyof BuyerWeights, keyof EventSignal> = {
  price: 'priceScore', environment: 'environmentScore', social: 'socialScore',
  traceability: 'traceabilityScore', certifications: 'certificationScore',
};
const CRITERIA_LABELS: Record<keyof BuyerWeights, string> = {
  price: 'le prix', environment: "l'environnement", social: 'le social',
  traceability: 'la traçabilité', certifications: 'les certifications',
};

/** Poids des événements dans l'apprentissage (décision forte = poids fort). */
const EVENT_LEARNING_WEIGHT: Partial<Record<BuyerEventType, number>> = {
  purchase: 3,
  product_approved: 2,
  recommendation_followed: 2,
  product_rejected: -2,          // signal inversé : ce qu'il rejette révèle ce qu'il ne valorise PAS
  recommendation_ignored: -1,
  product_view: 0.3,
  comparison_run: 0.5,
};

interface RawEvent { event_type: BuyerEventType; metadata: { signal?: EventSignal } | null }

/**
 * Cœur de l'apprentissage (fonction PURE, testable) :
 * moyenne pondérée des signaux des décisions positives vs négatives,
 * convertie en ajustements de pondérations (-15 … +15 points) et en
 * phrases d'insight lisibles.
 */
export function computeLearnedProfile(events: RawEvent[]): LearnedProfile {
  const positive: Record<string, { sum: number; w: number }> = {};
  CRITERIA.forEach(c => { positive[c] = { sum: 0, w: 0 }; });

  let analyzed = 0;
  for (const ev of events) {
    const lw = EVENT_LEARNING_WEIGHT[ev.event_type];
    const signal = ev.metadata?.signal;
    if (!lw || !signal) continue;
    analyzed++;
    for (const c of CRITERIA) {
      const v = signal[SIGNAL_KEYS[c]];
      if (v === undefined) continue;
      // Décision positive : le signal compte tel quel.
      // Décision négative (rejet) : un signal FORT rejeté = critère non déterminant → contribution inverse.
      const contribution = lw > 0 ? v * lw : (100 - v) * Math.abs(lw);
      positive[c].sum += contribution;
      positive[c].w += Math.abs(lw);
    }
  }

  if (analyzed < 3) {
    return { adjustments: {}, insights: ['Pas encore assez de décisions pour apprendre vos préférences (minimum 3).'], eventsAnalyzed: analyzed, updatedAt: new Date().toISOString() };
  }

  // Moyennes 0-100 par critère → écart à la moyenne globale → ajustements
  const means: Record<string, number> = {};
  let globalMean = 0;
  for (const c of CRITERIA) {
    means[c] = positive[c].w > 0 ? positive[c].sum / positive[c].w : 50;
    globalMean += means[c];
  }
  globalMean /= CRITERIA.length;

  const adjustments: Partial<BuyerWeights> = {};
  for (const c of CRITERIA) {
    const deviation = means[c] - globalMean;              // -100 … +100 en théorie
    const adj = Math.max(-15, Math.min(15, Math.round(deviation / 4)));
    if (Math.abs(adj) >= 2) adjustments[c] = adj;
  }

  // Insights lisibles : critère le plus valorisé vs le moins valorisé
  const ranked = [...CRITERIA].sort((a, b) => means[b] - means[a]);
  const top = ranked[0];
  const bottom = ranked[ranked.length - 1];
  const insights: string[] = [];
  if (means[top] - means[bottom] >= 12) {
    insights.push(`Vos décisions montrent que vous privilégiez ${CRITERIA_LABELS[top]} plutôt que ${CRITERIA_LABELS[bottom]}.`);
  }
  const second = ranked[1];
  if (means[second] - globalMean >= 8) {
    insights.push(`${CRITERIA_LABELS[second].charAt(0).toUpperCase() + CRITERIA_LABELS[second].slice(1)} pèse aussi fortement dans vos choix.`);
  }
  if (insights.length === 0) insights.push('Vos décisions sont équilibrées entre tous les critères.');

  return { adjustments, insights, eventsAnalyzed: analyzed, updatedAt: new Date().toISOString() };
}

/** Recalcule et persiste le profil appris à partir des 200 derniers événements. */
export async function refreshLearnedProfile(userId: string): Promise<LearnedProfile> {
  const { data } = await supabase
    .from('buyer_events')
    .select('event_type, metadata')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200);
  const learned = computeLearnedProfile((data ?? []) as RawEvent[]);
  await supabase.from('buyer_preferences').upsert({
    user_id: userId,
    learned_profile: learned,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  return learned;
}

/**
 * Pondérations EFFECTIVES = règles de l'acheteur + ajustements appris
 * (si activés), re-normalisées à 100. C'est ce que consomment le
 * comparateur et les recommandations.
 */
export function effectiveWeights(prefs: BuyerPreferences): BuyerWeights {
  const base = { ...prefs.weights };
  if (prefs.useLearnedAdjustments && prefs.learned) {
    for (const c of CRITERIA) {
      base[c] = Math.max(0, base[c] + (prefs.learned.adjustments[c] ?? 0));
    }
  }
  const sum = CRITERIA.reduce((s, c) => s + base[c], 0) || 1;
  const normalized = {} as BuyerWeights;
  let acc = 0;
  CRITERIA.forEach((c, i) => {
    if (i === CRITERIA.length - 1) normalized[c] = 100 - acc;
    else { normalized[c] = Math.round((base[c] / sum) * 100); acc += normalized[c]; }
  });
  return normalized;
}

// -------------------- Suivi fournisseurs / produits --------------------

export async function getTrackedSuppliers(userId: string): Promise<TrackedSupplier[]> {
  const { data } = await supabase
    .from('buyer_suppliers')
    .select('id, producer_id, status, notes, producers(id, name, country, country_flag, slug, rating)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return ((data ?? []) as unknown as (TrackedSupplier & { producers: TrackedSupplier['producer'] })[])
    .map(r => ({ ...r, producer: r.producers }));
}

export async function setSupplierStatus(
  userId: string, producerId: string, status: SupplierTrackStatus, notes?: string,
): Promise<string | null> {
  const { error } = await supabase.from('buyer_suppliers').upsert({
    user_id: userId, producer_id: producerId, status, notes: notes ?? null,
  }, { onConflict: 'user_id,producer_id' });
  if (!error) void recordBuyerEvent(userId, 'supplier_status_change', { producerId, extra: { status } });
  return error?.message ?? null;
}

export async function getTrackedProducts(userId: string): Promise<TrackedProduct[]> {
  const { data } = await supabase
    .from('buyer_products')
    .select('id, product_id, status, rejection_reason, products(*)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return ((data ?? []) as unknown as (TrackedProduct & { products: Product })[])
    .map(r => ({ ...r, product: r.products }));
}

export async function setProductStatus(
  userId: string, product: Product, status: ProductTrackStatus, rejectionReason?: string,
): Promise<string | null> {
  const { error } = await supabase.from('buyer_products').upsert({
    user_id: userId, product_id: product.id, status, rejection_reason: rejectionReason ?? null,
  }, { onConflict: 'user_id,product_id' });
  if (!error) {
    void recordBuyerEvent(
      userId,
      status === 'approved' ? 'product_approved' : status === 'rejected' ? 'product_rejected' : 'product_view',
      { productId: product.id, signal: productSignal(product) },
    );
  }
  return error?.message ?? null;
}

// -------------------- Achats & analytics --------------------

export async function getPurchases(userId: string): Promise<PurchaseRecord[]> {
  const { data } = await supabase
    .from('buyer_purchases')
    .select('*')
    .eq('user_id', userId)
    .order('purchased_at', { ascending: false });
  return (data ?? []) as PurchaseRecord[];
}

export async function addPurchase(
  userId: string,
  input: {
    product?: Product; productName: string; quantity: number; unitPrice: number;
    baselineUnitPrice?: number; purchasedAt?: string;
  },
): Promise<string | null> {
  const p = input.product;
  const { error } = await supabase.from('buyer_purchases').insert({
    user_id: userId,
    product_id: p?.id ?? null,
    product_name: input.productName,
    quantity: input.quantity,
    unit_price: input.unitPrice,
    baseline_unit_price: input.baselineUnitPrice ?? null,
    carbon_footprint_kg: p?.carbon_footprint_kg ?? null,
    ethical_score: p?.product_score || p?.confidence_score || null,
    traceability_score: p ? Math.round(
      (p.batch_number ? 25 : 0) + (p.gps_coordinates ? 20 : 0) + (p.manufacturing_country ? 15 : 0) +
      (p.raw_materials_origin ? 15 : 0) + (p.trace_qr_code ? 15 : 0) + 10,
    ) : null,
    is_responsible: p ? Boolean(p.certifications?.length || p.fair_trade || p.living_wage_guaranteed) : true,
    purchased_at: input.purchasedAt ?? new Date().toISOString(),
  });
  if (!error && p) {
    void recordBuyerEvent(userId, 'purchase', { productId: p.id, signal: productSignal(p) });
  }
  return error?.message ?? null;
}

/** Analytics achats (fonction PURE, testable). */
export function computePurchaseAnalytics(purchases: PurchaseRecord[]): PurchaseAnalytics {
  let totalSpent = 0, responsibleSpent = 0, savings = 0, premiumPaid = 0, totalCarbonKg = 0;
  let scoreSum = 0, scoreCount = 0;
  const byMonth: Record<string, { scoreSum: number; scoreCount: number; spent: number }> = {};

  for (const p of purchases) {
    const line = p.unit_price * p.quantity;
    totalSpent += line;
    if (p.is_responsible) responsibleSpent += line;
    if (p.baseline_unit_price !== undefined && p.baseline_unit_price !== null) {
      const diff = (p.baseline_unit_price - p.unit_price) * p.quantity;
      if (diff > 0) savings += diff; else premiumPaid += -diff;
    }
    if (p.carbon_footprint_kg) totalCarbonKg += p.carbon_footprint_kg * p.quantity;
    if (p.ethical_score) { scoreSum += p.ethical_score; scoreCount++; }
    const month = p.purchased_at.slice(0, 7);
    byMonth[month] ??= { scoreSum: 0, scoreCount: 0, spent: 0 };
    byMonth[month].spent += line;
    if (p.ethical_score) { byMonth[month].scoreSum += p.ethical_score; byMonth[month].scoreCount++; }
  }

  return {
    totalSpent: Math.round(totalSpent * 100) / 100,
    responsibleSpent: Math.round(responsibleSpent * 100) / 100,
    responsibleSharePct: totalSpent > 0 ? Math.round((responsibleSpent / totalSpent) * 100) : 0,
    savings: Math.round(savings * 100) / 100,
    premiumPaid: Math.round(premiumPaid * 100) / 100,
    totalCarbonKg: Math.round(totalCarbonKg * 10) / 10,
    avgEthicalScore: scoreCount > 0 ? Math.round(scoreSum / scoreCount) : 0,
    scoreTrend: Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({
        month,
        avgScore: v.scoreCount > 0 ? Math.round(v.scoreSum / v.scoreCount) : 0,
        spent: Math.round(v.spent * 100) / 100,
      })),
    purchaseCount: purchases.length,
  };
}
