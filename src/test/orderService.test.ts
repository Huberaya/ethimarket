// @vitest-environment node
// =============================================================
// Tests du circuit de commande B2B (orderService.ts +
// purchaseOrderGenerator.ts) — fonctions pures uniquement.
// =============================================================

import { describe, it, expect } from 'vitest';
import {
  computeOrderAmounts,
  isQuoteConvertible,
  allowedOrderTransitions,
  computeOrderStats,
  PLATFORM_COMMISSION_RATE,
  ORDER_STATUS_META,
  type B2BOrder,
  type B2BOrderStatus,
} from '../lib/orderService';
import { buildPurchaseOrderHtml } from '../lib/purchaseOrderGenerator';

const O = (over: Partial<B2BOrder>): B2BOrder => ({
  id: over.id ?? Math.random().toString(36).slice(2),
  order_number: 'PO-2026-0001',
  buyer_id: 'b1', producer_id: 'p1', product_id: 'pr1',
  product_name: 'Café Yirgacheffe', quantity: 100, unit: 'kg',
  unit_price: 12.5, currency: 'EUR', total_amount: 1250,
  commission_rate: 0.05, commission_amount: 62.5,
  status: 'new', shipping_method: null, shipping_cost: 0,
  delivery_country: 'France', expected_delivery_days: '10-15',
  tracking_number: null, notes: null,
  created_at: '2026-08-01T10:00:00Z', updated_at: '2026-08-01T10:00:00Z',
  ...over,
} as B2BOrder);

// ------------------------------------------------------------
// 1. Montants
// ------------------------------------------------------------
describe('computeOrderAmounts — le prix de l\'offre fait foi', () => {
  it('utilise le prix de l\'offre du producteur, pas le prix indicatif', () => {
    const r = computeOrderAmounts({ quantity: 100, quoted_unit_price: 12.5, unit_price_at_request: 15 });
    expect(r.unitPrice).toBe(12.5);
    expect(r.totalAmount).toBe(1250);
  });

  it('repli sur le prix à la demande si pas d\'offre chiffrée', () => {
    const r = computeOrderAmounts({ quantity: 10, quoted_unit_price: null, unit_price_at_request: 8 });
    expect(r.unitPrice).toBe(8);
    expect(r.totalAmount).toBe(80);
  });

  it('commission plateforme 5% arrondie au centime', () => {
    const r = computeOrderAmounts({ quantity: 3, quoted_unit_price: 9.99, unit_price_at_request: null });
    expect(r.totalAmount).toBe(29.97);
    expect(r.commissionAmount).toBe(Math.round(29.97 * PLATFORM_COMMISSION_RATE * 100) / 100);
  });

  it('centimes : pas d\'erreur de flottant', () => {
    const r = computeOrderAmounts({ quantity: 3, quoted_unit_price: 0.1, unit_price_at_request: null });
    expect(r.totalAmount).toBe(0.3);
  });
});

// ------------------------------------------------------------
// 2. Convertibilité
// ------------------------------------------------------------
describe('isQuoteConvertible', () => {
  it('accepté + prix → convertible', () => {
    expect(isQuoteConvertible({ status: 'accepted', quoted_unit_price: 10, unit_price_at_request: null })).toBe(true);
  });
  it('non accepté → jamais convertible', () => {
    for (const status of ['sent', 'responded', 'declined', 'cancelled', 'expired'] as const) {
      expect(isQuoteConvertible({ status, quoted_unit_price: 10, unit_price_at_request: null })).toBe(false);
    }
  });
  it('accepté sans aucun prix → non convertible', () => {
    expect(isQuoteConvertible({ status: 'accepted', quoted_unit_price: null, unit_price_at_request: null })).toBe(false);
  });
});

// ------------------------------------------------------------
// 3. Transitions (miroir du trigger SQL)
// ------------------------------------------------------------
describe('allowedOrderTransitions — miroir du trigger SQL', () => {
  it('producteur : new → processing/cancelled ; processing → shipped/cancelled', () => {
    expect(allowedOrderTransitions('new', 'producer')).toEqual(['processing', 'cancelled']);
    expect(allowedOrderTransitions('processing', 'producer')).toEqual(['shipped', 'cancelled']);
    expect(allowedOrderTransitions('shipped', 'producer')).toEqual([]);
  });
  it('acheteur : new → cancelled ; shipped → delivered/disputed ; delivered → disputed', () => {
    expect(allowedOrderTransitions('new', 'buyer')).toEqual(['cancelled']);
    expect(allowedOrderTransitions('shipped', 'buyer')).toEqual(['delivered', 'disputed']);
    expect(allowedOrderTransitions('delivered', 'buyer')).toEqual(['disputed']);
  });
  it('états terminaux : aucune transition utilisateur', () => {
    for (const role of ['buyer', 'producer'] as const) {
      expect(allowedOrderTransitions('cancelled', role)).toEqual([]);
      expect(allowedOrderTransitions('refunded', role)).toEqual([]);
    }
  });
  it('chaque statut a des métadonnées d\'affichage', () => {
    const statuses: B2BOrderStatus[] = ['new', 'processing', 'shipped', 'delivered', 'disputed', 'cancelled', 'refunded'];
    for (const s of statuses) {
      expect(ORDER_STATUS_META[s].labelKey).toMatch(/^ord\.st/);
      expect(ORDER_STATUS_META[s].emoji).toBeTruthy();
    }
  });
});

// ------------------------------------------------------------
// 4. Statistiques
// ------------------------------------------------------------
describe('computeOrderStats', () => {
  const orders = [
    O({ status: 'new', total_amount: 100 }),
    O({ status: 'processing', total_amount: 200 }),
    O({ status: 'shipped', total_amount: 300 }),
    O({ status: 'delivered', total_amount: 400 }),
    O({ status: 'delivered', total_amount: 600 }),
    O({ status: 'cancelled', total_amount: 999 }),
  ];

  it('producteur : awaitingAction = new', () => {
    const s = computeOrderStats(orders, 'producer');
    expect(s.awaitingAction).toBe(1);
    expect(s.inProgress).toBe(3);
    expect(s.delivered).toBe(2);
  });
  it('acheteur : awaitingAction = shipped (à réceptionner)', () => {
    const s = computeOrderStats(orders, 'buyer');
    expect(s.awaitingAction).toBe(1);
  });
  it('valeurs : livrée 1000, pipeline 600, annulées exclues', () => {
    const s = computeOrderStats(orders, 'buyer');
    expect(s.totalDeliveredValue).toBe(1000);
    expect(s.totalPipelineValue).toBe(600);
  });
  it('liste vide → zéros partout', () => {
    const s = computeOrderStats([], 'buyer');
    expect(s.total).toBe(0);
    expect(s.totalDeliveredValue).toBe(0);
  });
});

// ------------------------------------------------------------
// 5. Bon de commande HTML
// ------------------------------------------------------------
describe('buildPurchaseOrderHtml — document contractuel', () => {
  const order = O({
    order_number: 'PO-2026-0042',
    producers: { name: 'Yirgacheffe Union', slug: 'yirgacheffe-union', country: 'Éthiopie', country_flag: '🇪🇹' },
  });
  const html = buildPurchaseOrderHtml(order, { buyerCompany: 'Diambo Resto', buyerEmail: 'diamboresto@gmail.com' });

  it('document HTML complet et autonome (styles inline)', () => {
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<style>');
    expect(html).not.toContain('http://');
    expect(html).not.toContain('https://cdn');
  });
  it('porte le numéro de commande, les parties et les montants', () => {
    expect(html).toContain('PO-2026-0042');
    expect(html).toContain('Diambo Resto');
    expect(html).toContain('Yirgacheffe Union');
    expect(html).toContain('Café Yirgacheffe');
    // toLocaleString('fr-FR') utilise l'espace fine insécable (U+202F)
    expect(html.replace(/[\u00A0\u202F]/g, ' ')).toContain('1 250,00 €');
  });
  it('mentionne le règlement par virement hors plateforme', () => {
    expect(html).toContain('virement bancaire');
    expect(html).toContain('aucun paiement ne transite par EthiMarket');
  });
  it('échappe le HTML injecté dans les champs libres', () => {
    const evil = O({ product_name: '<script>alert(1)</script>' });
    const h = buildPurchaseOrderHtml(evil);
    expect(h).not.toContain('<script>alert(1)</script>');
    expect(h).toContain('&lt;script&gt;');
  });
  it('statut : en attente vs confirmée', () => {
    expect(html).toContain('En attente de confirmation');
    const confirmed = buildPurchaseOrderHtml(O({ confirmed_at: '2026-08-02T08:00:00Z' }));
    expect(confirmed).toContain('Confirmée par le producteur');
  });
});
