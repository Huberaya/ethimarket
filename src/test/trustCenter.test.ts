// @vitest-environment node
// =============================================================
// EthiMarket Trust Center — Tests (vitest)
// Matrice complète du moteur d'évaluation : statuts × niveaux ×
// expiration × contradiction, agrégat produit, formatage FR.
// =============================================================

import { describe, it, expect } from 'vitest';
import {
  evaluateClaim, summarizeProductTrust, formatDateFr, DECLARED_ONLY_MESSAGE,
} from '../lib/trust/evaluateClaim';
import { ClaimEvidence, ProductClaim, EvidenceType, EvidenceCheckResult } from '../lib/trust/types';

// Date d'évaluation fixe pour des tests déterministes
const NOW = new Date('2026-08-16T12:00:00Z');

let seq = 0;
function ev(partial: Partial<ClaimEvidence> & { evidence_type: EvidenceType }): ClaimEvidence {
  seq += 1;
  return {
    id: `ev-${seq}`,
    claim_id: 'claim-1',
    check_result: 'not_checked' as EvidenceCheckResult,
    created_at: '2026-01-01T00:00:00Z',
    ...partial,
  };
}

function claim(partial: Partial<ProductClaim>): ProductClaim {
  seq += 1;
  return {
    id: `claim-${seq}`,
    product_id: 'prod-1',
    claim_type: 'organic_material',
    claim_label: 'Coton biologique',
    declared_by: 'supplier',
    verification_status: 'declared_only',
    evidence: [],
    created_at: '2026-01-01T00:00:00Z',
    ...partial,
  };
}

// ============================================================
// 1. LA MAQUETTE EXACTE : certificat GOTS vérifié
// ============================================================
describe('Cas maquette — "Coton biologique" certifié GOTS', () => {
  const gots = ev({
    evidence_type: 'certificate_verified',
    reference_number: 'GOTS-2024-08-1234',
    issuing_body_name: 'Ecocert Greenlife',
    valid_until: '2027-03-12',
    source_url: 'https://www.ecocert.com/verify/GOTS-2024-08-1234',
    check_result: 'confirmed',
    checked_at: '2026-08-14T09:00:00Z',
    checked_by_name: 'EthiMarket',
  });
  const result = evaluateClaim([gots], NOW);

  it('✅ statut = verified', () => expect(result.status).toBe('verified'));
  it('📄 la preuve décisive porte le n° de certification', () =>
    expect(result.decidingEvidence?.reference_number).toBe('GOTS-2024-08-1234'));
  it('📅 valide jusqu\'au 12/03/2027 (format FR)', () =>
    expect(formatDateFr(result.decidingEvidence?.valid_until)).toBe('12/03/2027'));
  it('🏢 organisme présent', () =>
    expect(result.decidingEvidence?.issuing_body_name).toBe('Ecocert Greenlife'));
  it('🔗 source officielle présente', () =>
    expect(result.decidingEvidence?.source_url).toContain('ecocert.com'));
  it('explication publique datée et attribuée', () => {
    expect(result.publicExplanation).toContain('14/08/2026');
    expect(result.publicExplanation).toContain('Ecocert Greenlife');
  });
  it('prochaine ré-évaluation = expiration du certificat', () =>
    expect(result.nextReviewAt).toBe('2027-03-12'));
});

// ============================================================
// 2. LE CAS AVERTISSEMENT : déclaration sans preuve
// ============================================================
describe('Cas avertissement — déclaration fournisseur seule', () => {
  it('aucune preuve → declared_only avec le message exact', () => {
    const r = evaluateClaim([], NOW);
    expect(r.status).toBe('declared_only');
    expect(r.publicExplanation).toBe(DECLARED_ONLY_MESSAGE);
    expect(r.publicExplanation).toBe('Déclaration fournisseur — preuve indépendante non trouvée.');
  });
  it('simple déclaration (niveau 1) → declared_only', () => {
    const r = evaluateClaim([ev({ evidence_type: 'supplier_declaration' })], NOW);
    expect(r.status).toBe('declared_only');
    expect(r.publicExplanation).toBe(DECLARED_ONLY_MESSAGE);
  });
  it('document fournisseur non contrôlé (niveau 2) → declared_only quand même', () => {
    const r = evaluateClaim([ev({ evidence_type: 'supplier_document', document_path: '/docs/facture.pdf' })], NOW);
    expect(r.status).toBe('declared_only');
  });
  it('un document fournisseur "confirmed" ne suffit PAS (niveau 2 < 4)', () => {
    // même si quelqu'un marquait un doc fournisseur comme confirmé, ça ne vérifie pas
    const r = evaluateClaim([ev({ evidence_type: 'supplier_document', check_result: 'confirmed' })], NOW);
    expect(r.status).toBe('declared_only');
  });
});

// ============================================================
// 3. MATRICE DES NIVEAUX
// ============================================================
describe('Hiérarchie des preuves', () => {
  it('niveau 5 confirmé valide → verified', () => {
    const r = evaluateClaim([ev({ evidence_type: 'certificate_verified', check_result: 'confirmed', valid_until: '2027-01-01' })], NOW);
    expect(r.status).toBe('verified');
  });
  it('niveau 4 (audit indépendant) confirmé → verified', () => {
    const r = evaluateClaim([ev({ evidence_type: 'audit_report', check_result: 'confirmed', valid_until: '2027-01-01' })], NOW);
    expect(r.status).toBe('verified');
  });
  it('niveau 4 (certificat déposé) en attente → pending_verification', () => {
    const r = evaluateClaim([ev({ evidence_type: 'certificate_on_file', check_result: 'pending' })], NOW);
    expect(r.status).toBe('pending_verification');
  });
  it('niveau 3 (contrôle EthiMarket) confirmé → PAS verified (reste pending au mieux)', () => {
    const r = evaluateClaim([ev({ evidence_type: 'platform_check', check_result: 'confirmed' })], NOW);
    expect(r.status).not.toBe('verified');
  });
  it('niveau 3 en attente → pending_verification', () => {
    const r = evaluateClaim([ev({ evidence_type: 'platform_check', check_result: 'pending' })], NOW);
    expect(r.status).toBe('pending_verification');
  });
  it('preuve sans date de validité → pas d\'expiration, verified permanent', () => {
    const r = evaluateClaim([ev({ evidence_type: 'certificate_verified', check_result: 'confirmed' })], NOW);
    expect(r.status).toBe('verified');
    expect(r.nextReviewAt).toBeUndefined();
  });
});

// ============================================================
// 4. EXPIRATION
// ============================================================
describe('Expiration — un certificat périmé ne vérifie plus rien', () => {
  it('certificat expiré hier → expired', () => {
    const r = evaluateClaim([ev({
      evidence_type: 'certificate_verified', check_result: 'confirmed',
      reference_number: 'BIO-999', valid_until: '2026-08-14',
    })], NOW);
    expect(r.status).toBe('expired');
    expect(r.publicExplanation).toContain('14/08/2026');
    expect(r.publicExplanation).toContain('expiré');
  });
  it('certificat valide jusqu\'à AUJOURD\'HUI → encore verified (inclusif)', () => {
    const r = evaluateClaim([ev({
      evidence_type: 'certificate_verified', check_result: 'confirmed', valid_until: '2026-08-16',
    })], NOW);
    expect(r.status).toBe('verified');
  });
  it('certificat pas encore entré en vigueur → pas verified', () => {
    const r = evaluateClaim([ev({
      evidence_type: 'certificate_verified', check_result: 'confirmed',
      valid_from: '2026-12-01', valid_until: '2028-12-01',
    })], NOW);
    expect(r.status).not.toBe('verified');
  });
  it('un certificat expiré + un valide → verified (le valide gagne)', () => {
    const r = evaluateClaim([
      ev({ evidence_type: 'certificate_verified', check_result: 'confirmed', valid_until: '2025-01-01' }),
      ev({ evidence_type: 'certificate_verified', check_result: 'confirmed', valid_until: '2027-06-30', reference_number: 'NEW-1' }),
    ], NOW);
    expect(r.status).toBe('verified');
    expect(r.decidingEvidence?.reference_number).toBe('NEW-1');
  });
  it('expiré + simple déclaration → expired (pas declared_only : on dit la vérité)', () => {
    const r = evaluateClaim([
      ev({ evidence_type: 'certificate_verified', check_result: 'confirmed', valid_until: '2026-01-01' }),
      ev({ evidence_type: 'supplier_declaration' }),
    ], NOW);
    expect(r.status).toBe('expired');
  });
});

// ============================================================
// 5. CONTRADICTION — domine tout
// ============================================================
describe('Contradiction', () => {
  it('preuve rejetée seule → contradicted', () => {
    const r = evaluateClaim([ev({ evidence_type: 'platform_check', check_result: 'rejected' })], NOW);
    expect(r.status).toBe('contradicted');
  });
  it('rejet + certificat valide → contradicted (le rejet domine)', () => {
    const r = evaluateClaim([
      ev({ evidence_type: 'certificate_verified', check_result: 'confirmed', valid_until: '2027-01-01' }),
      ev({ evidence_type: 'platform_check', check_result: 'rejected', checked_at: '2026-08-01T00:00:00Z' }),
    ], NOW);
    expect(r.status).toBe('contradicted');
    expect(r.publicExplanation).toContain('contredite');
  });
  it('l\'explication mentionne la date du contrôle négatif', () => {
    const r = evaluateClaim([
      ev({ evidence_type: 'certificate_on_file', check_result: 'rejected', checked_at: '2026-07-10T00:00:00Z' }),
    ], NOW);
    expect(r.publicExplanation).toContain('10/07/2026');
  });
});

// ============================================================
// 6. AGRÉGAT PRODUIT
// ============================================================
describe('Résumé de confiance produit', () => {
  const verifiedEv = () => [ev({ evidence_type: 'certificate_verified', check_result: 'confirmed', valid_until: '2027-01-01' })];

  it('0 claim → no_claims, ratio 0', () => {
    const s = summarizeProductTrust('p1', [], NOW);
    expect(s.overall_badge).toBe('no_claims');
    expect(s.trust_ratio).toBe(0);
  });
  it('toutes vérifiées → verified_majority, ratio 1', () => {
    const s = summarizeProductTrust('p1', [
      claim({ claim_type: 'organic_material', evidence: verifiedEv() }),
      claim({ claim_type: 'fair_trade', claim_label: 'Commerce équitable', evidence: verifiedEv() }),
    ], NOW);
    expect(s.overall_badge).toBe('verified_majority');
    expect(s.trust_ratio).toBe(1);
    expect(s.verified_claims).toBe(2);
  });
  it('que du déclaratif → declarations_only', () => {
    const s = summarizeProductTrust('p1', [
      claim({ evidence: [ev({ evidence_type: 'supplier_declaration' })] }),
      claim({ claim_type: 'living_wage', claim_label: 'Salaire décent', evidence: [] }),
    ], NOW);
    expect(s.overall_badge).toBe('declarations_only');
    expect(s.verified_claims).toBe(0);
  });
  it('une contradiction → issues_found même si le reste est vérifié', () => {
    const s = summarizeProductTrust('p1', [
      claim({ evidence: verifiedEv() }),
      claim({ claim_type: 'living_wage', claim_label: 'Salaire décent', evidence: [ev({ evidence_type: 'platform_check', check_result: 'rejected' })] }),
    ], NOW);
    expect(s.overall_badge).toBe('issues_found');
    expect(s.contradicted_claims).toBe(1);
  });
  it('minorité de claims MAJEURES vérifiées → partially_verified', () => {
    const s = summarizeProductTrust('p1', [
      claim({ claim_type: 'organic_material', evidence: verifiedEv() }),           // majeure, vérifiée
      claim({ claim_type: 'living_wage', claim_label: 'Salaire décent', evidence: [] }),   // majeure, non
      claim({ claim_type: 'no_child_labor', claim_label: 'Sans travail des enfants', evidence: [] }), // majeure, non
    ], NOW);
    expect(s.overall_badge).toBe('partially_verified');
  });
  it('compteurs exhaustifs', () => {
    const s = summarizeProductTrust('p1', [
      claim({ evidence: verifiedEv() }),
      claim({ claim_label: 'B', evidence: [ev({ evidence_type: 'certificate_on_file', check_result: 'pending' })] }),
      claim({ claim_label: 'C', evidence: [] }),
      claim({ claim_label: 'D', evidence: [ev({ evidence_type: 'certificate_verified', check_result: 'confirmed', valid_until: '2025-01-01' })] }),
      claim({ claim_label: 'E', evidence: [ev({ evidence_type: 'platform_check', check_result: 'rejected' })] }),
    ], NOW);
    expect(s.total_claims).toBe(5);
    expect(s.verified_claims).toBe(1);
    expect(s.pending_claims).toBe(1);
    expect(s.declared_only_claims).toBe(1);
    expect(s.expired_claims).toBe(1);
    expect(s.contradicted_claims).toBe(1);
    expect(s.trust_ratio).toBe(0.2);
  });
});

// ============================================================
// 7. ROBUSTESSE & DÉTERMINISME
// ============================================================
describe('Robustesse', () => {
  it('formatDateFr : ISO → JJ/MM/AAAA', () => {
    expect(formatDateFr('2027-03-12')).toBe('12/03/2027');
    expect(formatDateFr(undefined)).toBe('—');
    expect(formatDateFr('invalid')).toBe('—');
  });
  it('fonction pure : mêmes entrées → mêmes sorties', () => {
    const evidence = [ev({ evidence_type: 'certificate_verified', check_result: 'confirmed', valid_until: '2027-01-01' })];
    const r1 = evaluateClaim(evidence, NOW);
    const r2 = evaluateClaim(evidence, NOW);
    expect(r1).toEqual(r2);
  });
  it('le raisonnement est toujours tracé', () => {
    const r = evaluateClaim([ev({ evidence_type: 'supplier_declaration' })], NOW);
    expect(r.reasoning.length).toBeGreaterThan(0);
  });
  it('le même certificat bascule verified → expired quand le temps passe', () => {
    const evidence = [ev({ evidence_type: 'certificate_verified', check_result: 'confirmed', valid_until: '2027-03-12' })];
    expect(evaluateClaim(evidence, new Date('2027-03-12T10:00:00Z')).status).toBe('verified');
    expect(evaluateClaim(evidence, new Date('2027-03-14T10:00:00Z')).status).toBe('expired');
  });
  it('dates invalides dans les preuves → pas de crash', () => {
    const r = evaluateClaim([ev({ evidence_type: 'certificate_verified', check_result: 'confirmed', valid_until: 'n/a' })], NOW);
    expect(r.status).toBe('verified'); // date illisible = pas d'expiration démontrée
  });
});
