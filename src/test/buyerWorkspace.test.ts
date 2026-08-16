// @vitest-environment node
// =============================================================
// Tests Espace Acheteur : apprentissage des préférences,
// pondérations personnalisées, analytics d'achats.
// =============================================================

import { describe, it, expect } from 'vitest';
import {
  computeLearnedProfile, effectiveWeights, validateWeights,
  computePurchaseAnalytics, productSignal, DEFAULT_WEIGHTS,
  BuyerWeights, PurchaseRecord,
} from '../lib/buyerWorkspace';
import type { Product } from '../lib/supabase';

// ---------- Apprentissage ----------
describe('Apprentissage des préférences', () => {
  it('moins de 3 décisions → pas d\'ajustement, message explicite', () => {
    const learned = computeLearnedProfile([
      { event_type: 'purchase', metadata: { signal: { priceScore: 90, traceabilityScore: 20 } } },
    ]);
    expect(learned.adjustments).toEqual({});
    expect(learned.insights[0]).toContain('Pas encore assez');
  });

  it('acheteur qui achète toujours du très traçable et cher → « privilégie la traçabilité plutôt que le prix »', () => {
    // Achats répétés : traçabilité élevée, prix défavorable (priceScore bas = cher)
    const events = Array.from({ length: 6 }, () => ({
      event_type: 'purchase' as const,
      metadata: { signal: { priceScore: 20, environmentScore: 55, socialScore: 55, traceabilityScore: 95, certificationScore: 60 } },
    }));
    const learned = computeLearnedProfile(events);
    expect(learned.adjustments.traceability ?? 0).toBeGreaterThan(0);
    expect(learned.adjustments.price ?? 0).toBeLessThan(0);
    expect(learned.insights.join(' ')).toMatch(/privilégiez la traçabilité plutôt que le prix/);
  });

  it('les rejets enseignent en NÉGATIF : rejeter du pas-cher peu traçable renforce la traçabilité', () => {
    const events = [
      // achète du traçable
      ...Array.from({ length: 3 }, () => ({
        event_type: 'purchase' as const,
        metadata: { signal: { priceScore: 30, traceabilityScore: 90, environmentScore: 50, socialScore: 50, certificationScore: 50 } },
      })),
      // rejette du très bon marché mais opaque
      ...Array.from({ length: 3 }, () => ({
        event_type: 'product_rejected' as const,
        metadata: { signal: { priceScore: 95, traceabilityScore: 15, environmentScore: 50, socialScore: 50, certificationScore: 50 } },
      })),
    ];
    const learned = computeLearnedProfile(events);
    expect(learned.adjustments.traceability ?? 0).toBeGreaterThan(0);
    expect(learned.adjustments.price ?? 0).toBeLessThanOrEqual(0);
  });

  it('décisions équilibrées → insight neutre, ajustements bornés à ±15', () => {
    const events = Array.from({ length: 8 }, () => ({
      event_type: 'purchase' as const,
      metadata: { signal: { priceScore: 60, environmentScore: 60, socialScore: 60, traceabilityScore: 60, certificationScore: 60 } },
    }));
    const learned = computeLearnedProfile(events);
    expect(learned.insights.join(' ')).toContain('équilibrées');
    Object.values(learned.adjustments).forEach(a => {
      expect(Math.abs(a as number)).toBeLessThanOrEqual(15);
    });
  });
});

// ---------- Pondérations ----------
describe('Règles de pondération personnalisées', () => {
  it('exemple du cahier des charges : 30/25/20/15/10 valide', () => {
    const w: BuyerWeights = { price: 30, environment: 25, social: 20, traceability: 15, certifications: 10 };
    expect(validateWeights(w)).toBeNull();
  });
  it('somme ≠ 100 → message d\'erreur explicite', () => {
    const w: BuyerWeights = { price: 50, environment: 25, social: 20, traceability: 15, certifications: 10 };
    expect(validateWeights(w)).toContain('100%');
    expect(validateWeights(w)).toContain('120');
  });
  it('valeurs négatives ou >100 refusées', () => {
    expect(validateWeights({ price: -5, environment: 45, social: 25, traceability: 20, certifications: 15 })).not.toBeNull();
  });

  it('pondérations effectives = règles + apprentissage, re-normalisées à 100', () => {
    const eff = effectiveWeights({
      weights: { ...DEFAULT_WEIGHTS },
      learned: {
        adjustments: { traceability: 10, price: -8 },
        insights: [], eventsAnalyzed: 10, updatedAt: '',
      },
      useLearnedAdjustments: true,
    });
    const sum = Object.values(eff).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
    expect(eff.traceability).toBeGreaterThan(DEFAULT_WEIGHTS.traceability);
    expect(eff.price).toBeLessThan(DEFAULT_WEIGHTS.price);
  });

  it('apprentissage désactivé → règles de l\'acheteur inchangées', () => {
    const eff = effectiveWeights({
      weights: { ...DEFAULT_WEIGHTS },
      learned: { adjustments: { traceability: 15 }, insights: [], eventsAnalyzed: 10, updatedAt: '' },
      useLearnedAdjustments: false,
    });
    expect(eff).toEqual(DEFAULT_WEIGHTS);
  });
});

// ---------- Analytics achats ----------
describe('Analytics des achats', () => {
  const P = (over: Partial<PurchaseRecord>): PurchaseRecord => ({
    id: Math.random().toString(36).slice(2), product_name: 'X', quantity: 1,
    unit_price: 10, currency: 'EUR', is_responsible: true,
    purchased_at: '2026-08-01T00:00:00Z', ...over,
  });

  it('économies vs prix marché (baseline > payé)', () => {
    const a = computePurchaseAnalytics([
      P({ unit_price: 10, baseline_unit_price: 14, quantity: 5 }), // 20 € économisés
      P({ unit_price: 13, baseline_unit_price: 11, quantity: 2 }), // 4 € de prime payée
    ]);
    expect(a.savings).toBe(20);
    expect(a.premiumPaid).toBe(4);
  });

  it('part des dépenses responsables', () => {
    const a = computePurchaseAnalytics([
      P({ unit_price: 30, is_responsible: true }),
      P({ unit_price: 70, is_responsible: false }),
    ]);
    expect(a.totalSpent).toBe(100);
    expect(a.responsibleSharePct).toBe(30);
  });

  it('impact carbone cumulé et score moyen', () => {
    const a = computePurchaseAnalytics([
      P({ carbon_footprint_kg: 1.5, quantity: 2, ethical_score: 80 }),
      P({ carbon_footprint_kg: 0.5, quantity: 4, ethical_score: 90 }),
    ]);
    expect(a.totalCarbonKg).toBe(5);
    expect(a.avgEthicalScore).toBe(85);
  });

  it('évolution du score par mois, triée chronologiquement', () => {
    const a = computePurchaseAnalytics([
      P({ purchased_at: '2026-06-10T00:00:00Z', ethical_score: 60 }),
      P({ purchased_at: '2026-07-10T00:00:00Z', ethical_score: 75 }),
      P({ purchased_at: '2026-08-10T00:00:00Z', ethical_score: 90 }),
    ]);
    expect(a.scoreTrend.map(t => t.month)).toEqual(['2026-06', '2026-07', '2026-08']);
    expect(a.scoreTrend.map(t => t.avgScore)).toEqual([60, 75, 90]);
  });

  it('zéro achat → tout à zéro sans crash', () => {
    const a = computePurchaseAnalytics([]);
    expect(a.totalSpent).toBe(0);
    expect(a.responsibleSharePct).toBe(0);
    expect(a.scoreTrend).toEqual([]);
  });
});

// ---------- Signal produit ----------
describe('Signal produit (traçage des décisions)', () => {
  it('produit très traçable et social → signaux élevés correspondants', () => {
    const p = {
      id: 'x', name: 'T', price: 12, certifications: ['Bio', 'Fairtrade'],
      batch_number: 'L1', gps_coordinates: '1,1', manufacturing_country: 'France',
      raw_materials_origin: 'France', trace_qr_code: 'qr',
      fair_trade: true, living_wage_guaranteed: true, social_audit_passed: true,
      carbon_footprint_kg: 0.8,
    } as unknown as Product;
    const s = productSignal(p, 10);
    expect(s.traceabilityScore).toBeGreaterThanOrEqual(90);
    expect(s.socialScore).toBeGreaterThanOrEqual(80);
    expect(s.environmentScore).toBeGreaterThanOrEqual(60);
    expect(s.priceScore).toBeLessThan(100); // 12 € vs 10 € min
  });
});
