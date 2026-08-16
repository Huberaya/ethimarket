// @vitest-environment node
// =============================================================
// Tests du parcours de devis : transitions autorisées,
// statistiques, métadonnées de statut.
// =============================================================

import { describe, it, expect } from 'vitest';
import {
  computeQuoteStats, allowedTransitions, QUOTE_STATUS_META, QuoteRequest, QuoteStatus,
} from '../lib/quoteService';

const Q = (over: Partial<QuoteRequest>): QuoteRequest => ({
  id: Math.random().toString(36).slice(2),
  buyer_id: 'b1', producer_id: 'p1', product_name: 'Café',
  quantity: 100, unit: 'kg', currency: 'EUR', status: 'sent',
  created_at: '2026-08-01T00:00:00Z',
  ...over,
});

describe('Cycle de vie du devis — transitions autorisées', () => {
  it('producteur : sent → responded ou declined, rien d\'autre', () => {
    expect(allowedTransitions('sent', 'producer')).toEqual(['responded', 'declined']);
    expect(allowedTransitions('responded', 'producer')).toEqual([]);
    expect(allowedTransitions('accepted', 'producer')).toEqual([]);
  });

  it('acheteur : responded → accepted/declined/cancelled ; sent → cancelled seulement', () => {
    expect(allowedTransitions('responded', 'buyer')).toEqual(['accepted', 'declined', 'cancelled']);
    expect(allowedTransitions('sent', 'buyer')).toEqual(['cancelled']);
    expect(allowedTransitions('accepted', 'buyer')).toEqual([]);
    expect(allowedTransitions('declined', 'buyer')).toEqual([]);
    expect(allowedTransitions('expired', 'buyer')).toEqual([]);
  });

  it('chaque statut a un libellé français, un emoji et des classes', () => {
    (Object.keys(QUOTE_STATUS_META) as QuoteStatus[]).forEach(s => {
      expect(QUOTE_STATUS_META[s].label.length).toBeGreaterThan(2);
      expect(QUOTE_STATUS_META[s].emoji.length).toBeGreaterThan(0);
      expect(QUOTE_STATUS_META[s].cls).toContain('bg-');
    });
  });
});

describe('Statistiques de devis', () => {
  const quotes: QuoteRequest[] = [
    Q({ status: 'sent' }),
    Q({ status: 'sent' }),
    Q({ status: 'responded', quoted_unit_price: 15 }),
    Q({ status: 'accepted', quoted_unit_price: 18, quantity: 200 }),   // 3 600 €
    Q({ status: 'accepted', quoted_unit_price: 10, quantity: 50 }),    //   500 €
    Q({ status: 'declined' }),
    Q({ status: 'cancelled' }),
    Q({ status: 'expired' }),
  ];
  const stats = computeQuoteStats(quotes);

  it('compte par statut', () => {
    expect(stats.total).toBe(8);
    expect(stats.awaitingResponse).toBe(2);
    expect(stats.offersToDecide).toBe(1);
    expect(stats.accepted).toBe(2);
  });

  it('taux d\'acceptation = acceptées / (acceptées + refusées) = 2/3', () => {
    expect(stats.acceptanceRatePct).toBe(67);
  });

  it('valeur acceptée = Σ prix offert × quantité (3 600 + 500)', () => {
    expect(stats.totalAcceptedValue).toBe(4100);
  });

  it('zéro devis → tout à zéro sans crash', () => {
    const empty = computeQuoteStats([]);
    expect(empty.total).toBe(0);
    expect(empty.acceptanceRatePct).toBe(0);
    expect(empty.totalAcceptedValue).toBe(0);
  });

  it('devis accepté sans prix offert → replie sur le prix à la demande', () => {
    const s = computeQuoteStats([Q({ status: 'accepted', unit_price_at_request: 5, quantity: 10 })]);
    expect(s.totalAcceptedValue).toBe(50);
  });
});
