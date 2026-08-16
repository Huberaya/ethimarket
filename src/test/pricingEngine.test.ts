// @vitest-environment node
// =============================================================
// Tests du moteur de tarification & conditions commerciales.
// Reproduit la fiche de la capture d'écran (Thé Vert Sencha) :
// 20-99 → 22,00 € · 100-499 → 19,58 € (−11%) · 500-999 →
// 17,38 € (−21%) · 1000+ → Sur devis. Tout dérivé du producteur.
// =============================================================

import { describe, it, expect } from 'vitest';
import { buildPricingSchedule, priceForQuantity, resolveLogistics } from '../lib/pricingEngine';
import type { Product, Producer } from '../lib/supabase';

describe('Grille dérivée des paliers PRODUCTEUR (cas Thé Sencha)', () => {
  // Le producteur a saisi : prix 22 €, MOQ 20, paliers 100→−11% et 500→−21%, devis dès 1000
  const sencha = {
    price: 22,
    moq_value: 20,
    volume_tiers: [
      { min_qty: 100, discount_pct: 11 },
      { min_qty: 500, discount_pct: 21 },
    ],
    quote_threshold_qty: 1000,
  };
  const schedule = buildPricingSchedule(sencha);

  it('reproduit exactement la grille de la maquette', () => {
    expect(schedule.source).toBe('producer_tiers');
    expect(schedule.tiers).toHaveLength(4);
    // 20 – 99 : prix standard
    expect(schedule.tiers[0]).toMatchObject({ min: 20, max: 99, price: 22, discount: 0 });
    // 100 – 499 : 19,58 € (−11%)
    expect(schedule.tiers[1]).toMatchObject({ min: 100, max: 499, price: 19.58, discount: 11 });
    // 500 – 999 : 17,38 € (−21%)
    expect(schedule.tiers[2]).toMatchObject({ min: 500, max: 999, price: 17.38, discount: 21 });
    // 1000+ : sur devis
    expect(schedule.tiers[3]).toMatchObject({ min: 1000, max: null, price: null, isQuote: true });
  });

  it('applique le prix du palier à la quantité saisie', () => {
    // 200 unités → palier 2 → 19,58 €/u
    const p200 = priceForQuantity(schedule, 22, 200);
    expect(p200.unitPrice).toBe(19.58);
    expect(p200.totalAmount).toBe(3916);
    expect(p200.savingsVsBase).toBe(484); // (22 − 19,58) × 200
    // 50 unités → prix standard
    expect(priceForQuantity(schedule, 22, 50).unitPrice).toBe(22);
    // 750 → palier 3
    expect(priceForQuantity(schedule, 22, 750).unitPrice).toBe(17.38);
    // 1500 → sur devis
    const quote = priceForQuantity(schedule, 22, 1500);
    expect(quote.isQuote).toBe(true);
    expect(quote.totalAmount).toBeNull();
  });
});

describe('Grille GÉNÉRÉE quand le producteur n\'a pas saisi de paliers', () => {
  it('dérive les paliers du MOQ et de la remise max consentie', () => {
    const schedule = buildPricingSchedule({ price: 10, moq_value: 10, max_volume_discount_pct: 20 });
    expect(schedule.source).toBe('generated_from_moq');
    // MOQ → 5×MOQ → 25×MOQ → 50×MOQ (devis)
    expect(schedule.tiers[0]).toMatchObject({ min: 10, max: 49, price: 10, discount: 0 });
    expect(schedule.tiers[1]).toMatchObject({ min: 50, max: 249, discount: 11 }); // 55% de 20
    expect(schedule.tiers[2]).toMatchObject({ min: 250, max: 499, discount: 20 });
    expect(schedule.tiers[3]).toMatchObject({ min: 500, isQuote: true });
  });

  it('remise max 0% → une seule ligne + devis (producteur qui ne fait pas de remise)', () => {
    const schedule = buildPricingSchedule({ price: 8, moq_value: 5, max_volume_discount_pct: 0 });
    expect(schedule.tiers).toHaveLength(2);
    expect(schedule.tiers[0].discount).toBe(0);
    expect(schedule.tiers[1].isQuote).toBe(true);
  });

  it('paliers invalides (remise > 90%) ignorés → grille générée', () => {
    const schedule = buildPricingSchedule({
      price: 10, moq_value: 10,
      volume_tiers: [{ min_qty: 100, discount_pct: 95 }],
    });
    expect(schedule.source).toBe('generated_from_moq');
  });
});

describe('Logistique dérivée producteur → produit', () => {
  it('produit complet → données produit', () => {
    const log = resolveLogistics(
      { stock_value: 1000, stock_unit: 'g', delivery_days: '7-10', monthly_capacity: 3000 } as Partial<Product>,
    );
    expect(log).toMatchObject({
      stockValue: 1000, stockUnit: 'g', deliveryDaysLabel: '7-10',
      deliverySource: 'product', monthlyCapacity: 3000, capacitySource: 'product',
    });
  });

  it('produit sans délai → repli sur la moyenne du producteur (marqué estimation)', () => {
    const log = resolveLogistics(
      { stock_value: 100, stock_unit: 'kg' } as Partial<Product>,
      { delivery_days_avg: '6-8' } as unknown as Partial<Producer>,
    );
    expect(log.deliveryDaysLabel).toBe('6-8');
    expect(log.deliverySource).toBe('producer');
  });

  it('produit sans capacité → annuel producteur / 12', () => {
    const log = resolveLogistics(
      { stock_value: 100, stock_unit: 'kg', monthly_capacity: 0 } as Partial<Product>,
      { annual_capacity: 24000 } as unknown as Partial<Producer>,
    );
    expect(log.monthlyCapacity).toBe(2000);
    expect(log.capacitySource).toBe('producer_annual');
  });

  it('aucune capacité connue → "Sur demande" (jamais 0 mensonger)', () => {
    const log = resolveLogistics({ stock_value: 10, stock_unit: 'kg', monthly_capacity: 0 } as Partial<Product>);
    expect(log.monthlyCapacity).toBe(0);
    expect(log.capacitySource).toBe('unknown');
  });
});
