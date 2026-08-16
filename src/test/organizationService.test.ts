// @vitest-environment node
// =============================================================
// Tests multi-utilisateurs entreprise : résolution des
// pondérations (entreprise imposée > personnelle > entreprise
// par défaut > plateforme).
// =============================================================

import { describe, it, expect } from 'vitest';
import { resolveUserWeights, orgWeights, Organization } from '../lib/organizationService';
import { DEFAULT_WEIGHTS, BuyerPreferences } from '../lib/buyerWorkspace';

const ORG: Organization = {
  id: 'org1', name: 'Acme', invite_code: 'ABCD1234',
  weight_price: 10, weight_environment: 35, weight_social: 25,
  weight_traceability: 20, weight_certifications: 10,
  weights_enforced: false, created_at: '2026-01-01',
};

const PERSONAL: BuyerPreferences = {
  weights: { price: 50, environment: 20, social: 10, traceability: 10, certifications: 10 },
  learned: null,
  useLearnedAdjustments: true,
};

describe('resolveUserWeights — hiérarchie des règles', () => {
  it('règles entreprise IMPOSÉES → priment sur tout', () => {
    const r = resolveUserWeights(PERSONAL, { ...ORG, weights_enforced: true });
    expect(r.source).toBe('organization_enforced');
    expect(r.weights.environment).toBe(35);
    expect(r.weights.price).toBe(10);
  });

  it('non imposées + règles personnelles configurées → personnelles', () => {
    const r = resolveUserWeights(PERSONAL, ORG);
    expect(r.source).toBe('personal');
    expect(r.weights.price).toBe(50);
  });

  it('non imposées + utilisateur sans réglage → entreprise par défaut', () => {
    const vanilla: BuyerPreferences = { weights: { ...DEFAULT_WEIGHTS }, learned: null, useLearnedAdjustments: true };
    const r = resolveUserWeights(vanilla, ORG);
    expect(r.source).toBe('organization_default');
    expect(r.weights.environment).toBe(35);
  });

  it('sans organisation → règles personnelles ou plateforme', () => {
    expect(resolveUserWeights(PERSONAL, null).weights.price).toBe(50);
    const r = resolveUserWeights(null, null);
    expect(r.source).toBe('platform_default');
    expect(r.weights).toEqual(DEFAULT_WEIGHTS);
  });

  it('l\'apprentissage personnel reste actif quand les règles ne sont pas imposées', () => {
    const withLearning: BuyerPreferences = {
      weights: { ...DEFAULT_WEIGHTS },
      learned: { adjustments: { traceability: 10 }, insights: [], eventsAnalyzed: 10, updatedAt: '' },
      useLearnedAdjustments: true,
    };
    const r = resolveUserWeights(withLearning, ORG);
    expect(r.source).toBe('personal');   // le profil appris = configuration personnelle
    expect(r.weights.traceability).toBeGreaterThan(DEFAULT_WEIGHTS.traceability);
    const sum = Object.values(r.weights).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });

  it('orgWeights extrait proprement les 5 pondérations', () => {
    const w = orgWeights(ORG);
    expect(Object.values(w).reduce((a, b) => a + b, 0)).toBe(100);
  });
});
