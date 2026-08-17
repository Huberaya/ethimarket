// @vitest-environment node
// =============================================================
// Tests de l'Assistant d'impact (impactEstimator.ts)
//
// Vérifie que la plateforme sait estimer les empreintes CO2/eau
// d'un produit sans donnée producteur, distingue honnêtement
// « ACV producteur » d'« estimation sectorielle », et juge la
// performance carbone RELATIVEMENT à la catégorie du produit.
// =============================================================

import { describe, it, expect } from 'vitest';
import {
  estimateFootprints,
  resolveCarbonFootprint,
  resolveWaterFootprint,
  carbonPerformance,
  waterPerformance,
  footprintSourceLabel,
} from '../lib/impactEstimator';
import { computeResponsibilityReport } from '../lib/responsibilityScore';
import type { Product } from '../lib/supabase';

const P = (over: Partial<Product>): Product => ({
  id: over.id ?? 'x', name: 'Produit', price: 10, certifications: [],
  ...over,
} as Product);

// ------------------------------------------------------------
// 1. Estimation sectorielle
// ------------------------------------------------------------
describe('estimateFootprints — moyennes sectorielles sourcées', () => {
  it('café conventionnel → facteur Poore & Nemecek (16,5 kg CO2e/kg)', () => {
    const est = estimateFootprints({ product_type: 'café' });
    expect(est.category).toBe('coffee');
    expect(est.isBio).toBe(false);
    expect(est.co2PerKg).toBe(16.5);
    expect(est.co2ConventionalPerKg).toBe(16.5);
  });

  it('café bio → réduction de 10% (Clark & Tilman 2017), jamais un ×3 marketing', () => {
    const est = estimateFootprints({ product_type: 'café', farming_method: 'Agriculture biologique' });
    expect(est.isBio).toBe(true);
    expect(est.co2PerKg).toBeCloseTo(16.5 * 0.9, 1);
    // la réduction bio reste modeste : > 80% du conventionnel
    expect(est.co2PerKg / est.co2ConventionalPerKg).toBeGreaterThan(0.8);
  });

  it('le bio réduit uniquement l\'eau GRISE (pas l\'eau de pluie)', () => {
    const conv = estimateFootprints({ product_type: 'thé' });
    const bio = estimateFootprints({ product_type: 'thé', certifications: ['Bio'] });
    expect(bio.waterPerKg).toBeLessThan(conv.waterPerKg);
    // thé : 10% d'eau grise, réduite de 60% → l'écart total reste < 10%
    expect((conv.waterPerKg - bio.waterPerKg) / conv.waterPerKg).toBeLessThan(0.1);
  });

  it('résout la catégorie via la catégorie du produit quand product_type est générique', () => {
    const est = estimateFootprints({ product_type: 'graines', category_name: 'Céréales & Graines' });
    expect(est.category).toBe('cereals');
  });

  it('catégorie inconnue → repli épices (jamais d\'erreur)', () => {
    const est = estimateFootprints({ name: 'Objet mystérieux' });
    expect(est.category).toBe('spices');
    expect(est.co2PerKg).toBeGreaterThan(0);
    expect(est.waterPerKg).toBeGreaterThan(0);
  });
});

// ------------------------------------------------------------
// 2. Résolution : ACV producteur > estimation
// ------------------------------------------------------------
describe('resolveCarbonFootprint / resolveWaterFootprint — hiérarchie GHG Protocol', () => {
  it('sans donnée en base → estimation sectorielle marquée estimated', () => {
    const r = resolveCarbonFootprint({ product_type: 'miel' });
    expect(r.source).toBe('estimated');
    expect(r.value).toBeGreaterThan(0);
  });

  it('valeur en base sans marqueur → traitée comme ACV producteur', () => {
    const r = resolveCarbonFootprint({ product_type: 'café', carbon_footprint_kg: 3.2 });
    expect(r.source).toBe('producer');
    expect(r.value).toBe(3.2);
  });

  it('valeur en base marquée estimated → jamais présentée comme ACV', () => {
    const r = resolveCarbonFootprint({
      product_type: 'café', carbon_footprint_kg: 14.9, carbon_footprint_source: 'estimated',
    });
    expect(r.source).toBe('estimated');
    expect(r.value).toBe(14.9);
  });

  it('eau : même hiérarchie', () => {
    expect(resolveWaterFootprint({ product_type: 'thé' }).source).toBe('estimated');
    expect(resolveWaterFootprint({ product_type: 'thé', water_footprint_liters: 5000 }).source).toBe('producer');
  });

  it('libellés de provenance distincts', () => {
    expect(footprintSourceLabel('producer')).toContain('ACV');
    expect(footprintSourceLabel('estimated')).toContain('Estimation');
  });
});

// ------------------------------------------------------------
// 3. Performance RELATIVE à la catégorie
// ------------------------------------------------------------
describe('carbonPerformance — jugement relatif à la catégorie', () => {
  it('un café bio estimé n\'est PAS pénalisé pour son CO2 absolu élevé', () => {
    // ~14,9 kg CO2e/kg est énorme dans l\'absolu mais NORMAL pour du café
    const perf = carbonPerformance({ product_type: 'café', farming_method: 'Agriculture biologique' });
    expect(perf.tier).not.toBe('high');
  });

  it('une ACV très basse vs sa catégorie → excellent', () => {
    const perf = carbonPerformance({ product_type: 'café', carbon_footprint_kg: 5 });
    expect(perf.source).toBe('producer');
    expect(perf.tier).toBe('excellent');
  });

  it('une ACV pire que la référence conventionnelle → high', () => {
    const perf = carbonPerformance({ product_type: 'miel', carbon_footprint_kg: 4 });
    expect(perf.tier).toBe('high');
  });

  it('eau : miel avec ACV basse → excellent', () => {
    const perf = waterPerformance({ product_type: 'miel', water_footprint_liters: 20 });
    expect(perf.tier).toBe('excellent');
  });
});

// ------------------------------------------------------------
// 4. Intégration Responsibility Score
// ------------------------------------------------------------
describe('Responsibility Score — plus de pénalité pour empreinte non renseignée', () => {
  const NOW = new Date('2026-08-16T12:00:00Z');

  it('produit sans empreinte → aucune alerte warning CO2, seulement une info estimation', () => {
    const r = computeResponsibilityReport(P({ product_type: 'miel', name: 'Miel' }), [], {}, NOW);
    expect(r.attentionPoints.some(a => a.message.includes("empreinte carbone n'est pas renseignée"))).toBe(false);
    const info = r.attentionPoints.find(a => a.message.includes('estimées à partir de moyennes sectorielles'));
    expect(info).toBeDefined();
    expect(info!.severity).toBe('info');
  });

  it('ACV producteur rapporte plus de points d\'environnement que l\'estimation équivalente', () => {
    const base = { product_type: 'café', name: 'Café', farming_method: 'Agriculture biologique' };
    const est = computeResponsibilityReport(P(base), [], {}, NOW);
    const acv = computeResponsibilityReport(
      P({ ...base, carbon_footprint_kg: 8, carbon_footprint_source: 'producer' as const }),
      [], {}, NOW,
    );
    const envEst = est.criteria.find(c => c.key === 'environment')!.score;
    const envAcv = acv.criteria.find(c => c.key === 'environment')!.score;
    expect(envAcv).toBeGreaterThan(envEst);
  });

  it('un chiffre inventé très bas marqué estimated ne bat PAS une vraie ACV moyenne', () => {
    // Anti-triche : nos propres estimations écrites en base (marquées
    // estimated) rapportent moins de points qu'une donnée primaire.
    const invented = computeResponsibilityReport(
      P({ product_type: 'café', name: 'C', carbon_footprint_kg: 0.1, carbon_footprint_source: 'estimated' as const }),
      [], {}, NOW,
    );
    const honest = computeResponsibilityReport(
      P({ product_type: 'café', name: 'C', carbon_footprint_kg: 8, carbon_footprint_source: 'producer' as const }),
      [], {}, NOW,
    );
    const envI = invented.criteria.find(c => c.key === 'environment')!.score;
    const envH = honest.criteria.find(c => c.key === 'environment')!.score;
    expect(envH).toBeGreaterThanOrEqual(envI);
  });
});
