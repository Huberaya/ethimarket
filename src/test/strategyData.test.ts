// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  WAVE1_PRODUCTS, SEGMENT_PITCHES, productMatch,
  BUYER_SEGMENTS, PRODUCER_SEGMENTS, scenarioCurve, GMV_SCENARIOS,
} from '../lib/strategyData';

describe('WAVE1_PRODUCTS', () => {
  it('contient les 12 produits du plan, triés par score décroissant', () => {
    expect(WAVE1_PRODUCTS).toHaveLength(12);
    for (let i = 1; i < WAVE1_PRODUCTS.length; i++) {
      expect(WAVE1_PRODUCTS[i - 1].score).toBeGreaterThanOrEqual(WAVE1_PRODUCTS[i].score);
    }
  });
  it('le trio de tête correspond au plan (Yirgacheffe 92, Sidama 90, Vanille 88)', () => {
    expect(WAVE1_PRODUCTS[0]).toMatchObject({ short: 'Yirgacheffe', score: 92, active: true });
    expect(WAVE1_PRODUCTS[1]).toMatchObject({ short: 'Sidama', score: 90 });
    expect(WAVE1_PRODUCTS[2]).toMatchObject({ short: 'Vanille Bourbon', score: 88 });
  });
  it('exactement 6 produits sont poussés activement', () => {
    expect(WAVE1_PRODUCTS.filter(p => p.active)).toHaveLength(6);
  });
});

describe('SEGMENT_PITCHES', () => {
  it('couvre tous les segments acheteurs et producteurs', () => {
    for (const s of [...BUYER_SEGMENTS, ...PRODUCER_SEGMENTS]) {
      expect(SEGMENT_PITCHES[s], `segment ${s}`).toBeDefined();
      expect(SEGMENT_PITCHES[s].products.length).toBeGreaterThan(0);
      expect(SEGMENT_PITCHES[s].angle.length).toBeGreaterThan(10);
      expect(SEGMENT_PITCHES[s].hook.length).toBeGreaterThan(10);
    }
  });
  it('ne référence que des produits existants de la vague 1', () => {
    const shorts = new Set(WAVE1_PRODUCTS.map(p => p.short));
    for (const [seg, pitch] of Object.entries(SEGMENT_PITCHES)) {
      for (const pr of pitch.products) {
        expect(shorts.has(pr), `${seg} → ${pr}`).toBe(true);
      }
    }
  });
});

describe('productMatch', () => {
  it('café Yirgacheffe : offert par les producteurs café, demandé par les torréfacteurs', () => {
    const m = productMatch('Yirgacheffe');
    expect(m.producerSegments).toContain('cafe');
    expect(m.buyerSegments).toContain('torrefacteur');
  });
  it('cacao Ghana : matche producteurs cacao ↔ chocolatiers', () => {
    const m = productMatch('Cacao Ghana');
    expect(m.producerSegments).toContain('cacao');
    expect(m.buyerSegments).toContain('chocolatier');
  });
  it('chaque produit de la vague 1 a au moins un segment acheteur', () => {
    for (const p of WAVE1_PRODUCTS) {
      const m = productMatch(p.short);
      expect(m.buyerSegments.length, `${p.short} sans acheteur`).toBeGreaterThan(0);
    }
  });
  it('les 6 produits poussés ont aussi un segment producteur (filière sourçable)', () => {
    for (const p of WAVE1_PRODUCTS.filter(w => w.active)) {
      const m = productMatch(p.short);
      expect(m.producerSegments.length, `${p.short} sans filière`).toBeGreaterThan(0);
    }
  });
  it('produit inconnu → aucun match', () => {
    const m = productMatch('N\u2019existe pas');
    expect(m.buyerSegments).toHaveLength(0);
    expect(m.producerSegments).toHaveLength(0);
  });
});

describe('scenarioCurve', () => {
  it('atteint la cible M12 et croît de façon monotone', () => {
    for (const s of GMV_SCENARIOS) {
      const c = scenarioCurve(s.m12);
      expect(c).toHaveLength(12);
      expect(c[11]).toBeCloseTo(s.m12, 6);
      for (let i = 1; i < c.length; i++) expect(c[i]).toBeGreaterThan(c[i - 1]);
    }
  });
});
