// @vitest-environment node
// =============================================================
// Tests du protocole « EthiMarket Verified » (fonctions pures) :
// preuves immuables → checklist dérivée → niveaux de confiance.
// =============================================================

import { describe, it, expect } from 'vitest';
import {
  isCriterionProven, checklistFromEvidences, allCriteriaProven,
  trustLevel, generateChallengeCode, isChallengeExpired,
  CRITERIA_KEYS, RECOMMENDED_EVIDENCE, EVIDENCE_TYPE_META, PUBLIC_REGISTRIES,
  type VerificationEvidence, type EvidenceCriterion, type EvidenceType,
} from '../lib/verificationEvidence';

let seq = 0;
const E = (over: Partial<VerificationEvidence>): VerificationEvidence => ({
  id: `e${++seq}`,
  producer_id: 'p1',
  criterion: 'identityVerified',
  evidence_type: 'document_review',
  reference: null,
  note: 'Contrôle effectué en détail.',
  outcome: 'pass',
  checked_by: 'admin1',
  created_at: `2026-08-17T10:00:${String(seq).padStart(2, '0')}Z`,
  ...over,
});

/** Jeu complet : une preuve pass par critère. */
const fullSet = (types: Partial<Record<EvidenceCriterion, EvidenceType>> = {}): VerificationEvidence[] =>
  CRITERIA_KEYS.map(c => E({ criterion: c, evidence_type: types[c] ?? 'document_review' }));

describe('isCriterionProven — une case = une preuve', () => {
  it('aucune preuve → non prouvé', () => {
    expect(isCriterionProven([], 'identityVerified')).toBe(false);
  });
  it('une preuve pass → prouvé', () => {
    expect(isCriterionProven([E({})], 'identityVerified')).toBe(true);
  });
  it('preuve fail seule → non prouvé', () => {
    expect(isCriterionProven([E({ outcome: 'fail' })], 'identityVerified')).toBe(false);
  });
  it('inconclusive ne prouve rien', () => {
    expect(isCriterionProven([E({ outcome: 'inconclusive' })], 'identityVerified')).toBe(false);
  });
  it('un fail POSTÉRIEUR au pass invalide le critère (fraude découverte après coup)', () => {
    const evidences = [
      E({ outcome: 'pass', created_at: '2026-08-01T10:00:00Z' }),
      E({ outcome: 'fail', created_at: '2026-08-10T10:00:00Z' }),
    ];
    expect(isCriterionProven(evidences, 'identityVerified')).toBe(false);
  });
  it('un pass POSTÉRIEUR au fail réhabilite (contre-preuve)', () => {
    const evidences = [
      E({ outcome: 'fail', created_at: '2026-08-01T10:00:00Z' }),
      E({ outcome: 'pass', created_at: '2026-08-10T10:00:00Z' }),
    ];
    expect(isCriterionProven(evidences, 'identityVerified')).toBe(true);
  });
  it('les preuves d\'un critère n\'affectent pas les autres', () => {
    expect(isCriterionProven([E({ criterion: 'charterSigned' })], 'identityVerified')).toBe(false);
  });
});

describe('checklistFromEvidences / allCriteriaProven', () => {
  it('checklist entièrement dérivée des preuves', () => {
    const evidences = fullSet();
    const cl = checklistFromEvidences(evidences);
    expect(Object.values(cl).every(Boolean)).toBe(true);
    expect(allCriteriaProven(evidences)).toBe(true);
  });
  it('un critère manquant → approbation impossible', () => {
    const partial = fullSet().slice(0, 5); // 5/6
    expect(allCriteriaProven(partial)).toBe(false);
  });
});

describe('trustLevel — Bronze / Argent / Or', () => {
  it('critères incomplets → none', () => {
    expect(trustLevel([])).toBe('none');
  });
  it('tout prouvé par examen documentaire → bronze', () => {
    expect(trustLevel(fullSet())).toBe('bronze');
  });
  it('+ preuve de terrain (photo_challenge) → silver', () => {
    expect(trustLevel(fullSet({ farmPhotosCoherent: 'photo_challenge' }))).toBe('silver');
  });
  it('+ triangulation humaine (issuer_confirmation) → gold', () => {
    expect(trustLevel(fullSet({
      farmPhotosCoherent: 'satellite_check',
      certificationValid: 'issuer_confirmation',
    }))).toBe('gold');
  });
  it('triangulation sans preuve de terrain → bronze (pas gold)', () => {
    expect(trustLevel(fullSet({ certificationValid: 'issuer_confirmation' }))).toBe('bronze');
  });
});

describe('generateChallengeCode', () => {
  it('format EM-XXXX sans caractères ambigus', () => {
    for (let i = 0; i < 50; i++) {
      const code = generateChallengeCode();
      expect(code).toMatch(/^EM-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/);
    }
  });
  it('déterministe avec un rand injecté', () => {
    expect(generateChallengeCode(() => 0)).toBe('EM-AAAA');
  });
});

describe('isChallengeExpired', () => {
  const now = new Date('2026-08-17T12:00:00Z');
  it('pending après expiration → expiré', () => {
    expect(isChallengeExpired({ status: 'pending', expires_at: '2026-08-16T12:00:00Z' }, now)).toBe(true);
  });
  it('pending avant expiration → actif', () => {
    expect(isChallengeExpired({ status: 'pending', expires_at: '2026-08-18T12:00:00Z' }, now)).toBe(false);
  });
  it('déjà soumis → jamais "expiré" (le jugement suit son cours)', () => {
    expect(isChallengeExpired({ status: 'submitted', expires_at: '2026-08-16T12:00:00Z' }, now)).toBe(false);
  });
});

describe('Référentiels de guidage', () => {
  it('chaque critère a des méthodes recommandées', () => {
    for (const c of CRITERIA_KEYS) {
      expect(RECOMMENDED_EVIDENCE[c].length).toBeGreaterThan(0);
    }
  });
  it('chaque type de preuve a un libellé et un conseil', () => {
    for (const meta of Object.values(EVIDENCE_TYPE_META)) {
      expect(meta.label).toBeTruthy();
      expect(meta.hint.length).toBeGreaterThan(10);
    }
  });
  it('les registres publics couvrent bio, fairtrade et registre du commerce', () => {
    const scopes = PUBLIC_REGISTRIES.map(r => r.scope.toLowerCase()).join(' ');
    expect(scopes).toContain('bio');
    expect(scopes).toContain('fairtrade');
    expect(scopes).toContain('commerce');
    for (const r of PUBLIC_REGISTRIES) expect(r.url).toMatch(/^https:\/\//);
  });
});
