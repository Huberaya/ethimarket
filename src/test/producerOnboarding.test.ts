// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  computeProducerSteps, onboardingProgress, nextStep,
  isProfileComplete, isVerificationSubmitted, isVerified, hasShopIdentity,
  type ProducerFacts,
} from '../lib/producerOnboarding';

const emptyProducer = {
  name: '', description: null, country: '', logo_url: null, story: null,
  verification_status: 'draft' as const, verified: false,
};

const base: ProducerFacts = { producer: emptyProducer, productCount: 0, activeProductCount: 0 };

const fullProducer = {
  name: 'Coopérative Test', country: 'Éthiopie',
  description: 'Une coopérative de café de montagne fondée en 1998, certifiée bio et Fairtrade.',
  logo_url: 'https://x/logo.png', story: null,
  verification_status: 'approved' as const, verified: true,
};

describe('prédicats', () => {
  it('isProfileComplete exige nom (≥3), description (≥40) et pays', () => {
    expect(isProfileComplete(emptyProducer)).toBe(false);
    expect(isProfileComplete({ ...emptyProducer, name: 'Coop', country: 'Maroc', description: 'court' })).toBe(false);
    expect(isProfileComplete(fullProducer)).toBe(true);
    expect(isProfileComplete(null)).toBe(false);
  });

  it('isVerificationSubmitted couvre submitted/under_review/approved et le flag verified', () => {
    expect(isVerificationSubmitted({ ...emptyProducer, verification_status: 'draft' })).toBe(false);
    expect(isVerificationSubmitted({ ...emptyProducer, verification_status: 'submitted' })).toBe(true);
    expect(isVerificationSubmitted({ ...emptyProducer, verification_status: 'under_review' })).toBe(true);
    expect(isVerificationSubmitted({ ...emptyProducer, verified: true })).toBe(true);
    expect(isVerificationSubmitted({ ...emptyProducer, verification_status: 'rejected' })).toBe(false);
  });

  it('isVerified : approved ou flag', () => {
    expect(isVerified({ ...emptyProducer, verification_status: 'approved' })).toBe(true);
    expect(isVerified({ ...emptyProducer, verification_status: 'submitted' })).toBe(false);
  });

  it('hasShopIdentity : logo OU histoire (≥60 caractères)', () => {
    expect(hasShopIdentity(emptyProducer)).toBe(false);
    expect(hasShopIdentity({ ...emptyProducer, logo_url: 'x.png' })).toBe(true);
    expect(hasShopIdentity({ ...emptyProducer, story: 'a'.repeat(60) })).toBe(true);
    expect(hasShopIdentity({ ...emptyProducer, story: 'trop court' })).toBe(false);
  });
});

describe('computeProducerSteps', () => {
  it('5 étapes, toutes non faites pour un compte neuf', () => {
    const steps = computeProducerSteps(base);
    expect(steps).toHaveLength(5);
    expect(steps.every(s => !s.done)).toBe(true);
  });

  it('ordre = chemin critique : profil → vérification → produit → identité → badge', () => {
    expect(computeProducerSteps(base).map(s => s.id)).toEqual(['profile', 'verification', 'product', 'identity', 'badge']);
  });

  it('les étapes se cochent sur les faits', () => {
    const steps = computeProducerSteps({ producer: fullProducer, productCount: 2, activeProductCount: 1 });
    expect(steps.every(s => s.done)).toBe(true);
  });

  it('chaque étape pointe vers une page du dashboard', () => {
    for (const s of computeProducerSteps(base)) expect(s.to).toMatch(/^\/dashboard/);
  });
});

describe('progress & next', () => {
  it('progression arrondie et bornée', () => {
    expect(onboardingProgress(computeProducerSteps(base))).toBe(0);
    const done = computeProducerSteps({ producer: fullProducer, productCount: 1, activeProductCount: 1 });
    expect(onboardingProgress(done)).toBe(100);
    const partial = computeProducerSteps({ ...base, productCount: 3 });
    expect(onboardingProgress(partial)).toBe(20);
  });

  it('nextStep = première étape non faite ; null quand tout est fait', () => {
    expect(nextStep(computeProducerSteps(base))?.id).toBe('profile');
    const afterProfile = computeProducerSteps({ producer: { ...fullProducer, verification_status: 'draft', verified: false }, productCount: 0, activeProductCount: 0 });
    expect(nextStep(afterProfile)?.id).toBe('verification');
    const done = computeProducerSteps({ producer: fullProducer, productCount: 1, activeProductCount: 1 });
    expect(nextStep(done)).toBeNull();
  });
});
