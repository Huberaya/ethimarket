// @vitest-environment node
// =============================================================
// Tests du Comparateur Achats Responsables
// Scénario du cahier des charges : A (12€), B (13€, meilleur
// partout), C (11€) → B recommandé malgré ~8% de surcoût,
// justification chiffrée pour la direction.
// =============================================================

import { describe, it, expect } from 'vitest';
import {
  computeScorecards, buildRecommendation, buildJustificationSheetHtml,
  TrustSnapshot,
} from '../lib/procurementComparator';
import type { Product } from '../lib/supabase';

const P = (over: Partial<Product>): Product => ({
  id: over.id ?? Math.random().toString(36).slice(2),
  name: 'Produit', price: 10, certifications: [],
  ...over,
} as Product);

// --- Le panel A / B / C du cahier des charges ---
const productA = P({
  id: 'A', name: 'Café Standard', price: 12,
  certifications: ['Bio'],
  batch_number: 'LOT-A', manufacturing_country: 'Brésil',
  carbon_footprint_kg: 2.8, confidence_score: 70, rating: 4.2,
});
const productB = P({
  id: 'B', name: 'Café Premium Traçable', price: 13,
  certifications: ['Bio', 'Rainforest Alliance'],
  batch_number: 'LOT-B', gps_coordinates: '6.16, 38.20', trace_qr_code: 'qr',
  manufacturing_country: 'Éthiopie', raw_materials_origin: 'Éthiopie',
  harvest_date: '2026-01-10', farming_method: 'Agroforesterie',
  fair_trade: true, living_wage_guaranteed: true, social_audit_passed: true,
  is_cooperative: true, carbon_footprint_kg: 0.9, confidence_score: 92, rating: 4.8,
  packaging_types: ['compostable'],
});
const productC = P({
  id: 'C', name: 'Café Éco', price: 11,
  certifications: ['Bio'],
  batch_number: 'LOT-C', manufacturing_country: 'Vietnam',
  raw_materials_origin: 'Vietnam', fair_trade: true,
  carbon_footprint_kg: 1.8, confidence_score: 78, rating: 4.0,
});

const trustB: Record<string, TrustSnapshot> = {
  B: {
    productId: 'B', totalClaims: 3, verifiedClaims: 2, pendingClaims: 1,
    declaredOnlyClaims: 0, expiredClaims: 0, contradictedClaims: 0,
    verifiedCertificates: [
      { label: 'Café biologique', referenceNumber: 'EC-BIO-777', issuingBody: 'Ecocert SA', validUntil: '2027-06-01' },
      { label: 'Commerce équitable', referenceNumber: 'FLO-123', issuingBody: 'FLO-CERT', validUntil: '2027-01-15' },
    ],
  },
  A: {
    productId: 'A', totalClaims: 1, verifiedClaims: 0, pendingClaims: 0,
    declaredOnlyClaims: 1, expiredClaims: 0, contradictedClaims: 0, verifiedCertificates: [],
  },
  C: {
    productId: 'C', totalClaims: 2, verifiedClaims: 0, pendingClaims: 1,
    declaredOnlyClaims: 1, expiredClaims: 0, contradictedClaims: 0, verifiedCertificates: [],
  },
};

describe('Scoring A/B/C', () => {
  const cards = computeScorecards([productA, productB, productC], trustB);
  const byId = Object.fromEntries(cards.map(c => [c.product.id, c]));

  it('C a le meilleur score prix (le moins cher)', () => {
    expect(byId.C.priceScore).toBe(100);
    expect(byId.B.priceScore).toBeLessThan(byId.C.priceScore);
  });
  it('B domine responsabilité, traçabilité et certifications', () => {
    expect(byId.B.responsibilityScore).toBeGreaterThan(byId.A.responsibilityScore);
    expect(byId.B.responsibilityScore).toBeGreaterThan(byId.C.responsibilityScore);
    expect(byId.B.traceabilityScore).toBeGreaterThan(byId.A.traceabilityScore);
    expect(byId.B.traceabilityScore).toBeGreaterThan(byId.C.traceabilityScore);
    expect(byId.B.certificationScore).toBeGreaterThan(byId.A.certificationScore);
    expect(byId.B.certificationScore).toBeGreaterThan(byId.C.certificationScore);
  });
  it('risques : B faible (🟢), A élevé ou modéré', () => {
    expect(byId.B.riskLevel).toBe('low');
    expect(['medium', 'high']).toContain(byId.A.riskLevel);
  });
  it('chaque carte a des forces/faiblesses et facteurs de risque expliqués', () => {
    cards.forEach(c => {
      expect(c.riskFactors.length).toBeGreaterThan(0);
    });
    expect(byId.B.strengths.length).toBeGreaterThan(2);
    expect(byId.A.weaknesses.length).toBeGreaterThan(0);
  });
});

describe('Recommandation', () => {
  const cards = computeScorecards([productA, productB, productC], trustB);
  const reco = buildRecommendation(cards, trustB);

  it('B est recommandé malgré son prix supérieur', () => {
    expect(reco).not.toBeNull();
    expect(reco!.recommended.product.id).toBe('B');
    expect(reco!.headline).toContain('Café Premium Traçable');
  });
  it('la justification chiffre le surcoût vs le moins cher (18% vs C à 11€)', () => {
    const text = reco!.justification.join(' ');
    expect(text).toMatch(/18\s?%/);
    expect(text).toContain('Café Éco');
  });
  it('la justification cite les preuves vérifiées opposables', () => {
    const text = reco!.justification.join(' ');
    expect(text).toContain('EC-BIO-777');
    expect(text).toContain('Ecocert SA');
  });
  it('la note direction présente le surcoût comme prime d\'assurance conformité', () => {
    expect(reco!.buyerNote).toMatch(/prime d'assurance|surcoût/i);
    expect(reco!.buyerNote).toContain('2.00'); // 13€ - 11€ vs le moins cher
  });
  it('moins de 2 produits → pas de recommandation', () => {
    expect(buildRecommendation(computeScorecards([productB], trustB), trustB)).toBeNull();
  });
  it('si le recommandé est aussi le moins cher → message "aucun surcoût"', () => {
    const cheapB = { ...productB, id: 'B2', price: 9 } as Product;
    const cards2 = computeScorecards([productA, cheapB], { ...trustB, B2: { ...trustB.B, productId: 'B2' } });
    const reco2 = buildRecommendation(cards2, { ...trustB, B2: { ...trustB.B, productId: 'B2' } });
    expect(reco2!.recommended.product.id).toBe('B2');
    expect(reco2!.justification[0]).toContain('aucun surcoût');
  });
});

describe('Fiche justificative', () => {
  const cards = computeScorecards([productA, productB, productC], trustB);
  const reco = buildRecommendation(cards, trustB);
  const html = buildJustificationSheetHtml({ scorecards: cards, recommendation: reco }, trustB);

  it('document HTML complet avec titres réglementaires', () => {
    expect(html).toContain('Fiche justificative de décision d\'achat');
    expect(html).toContain('CSRD');
    expect(html).toContain('Note pour la direction');
  });
  it('contient la matrice avec les 3 produits et les niveaux de risque', () => {
    ['Café Standard', 'Café Premium Traçable', 'Café Éco'].forEach(n => expect(html).toContain(n));
    expect(html).toContain('🟢 Faible');
  });
  it('liste les certificats vérifiés avec n° et organisme', () => {
    expect(html).toContain('EC-BIO-777');
    expect(html).toContain('Ecocert SA');
  });
  it('emplacements de signature responsable achats + direction', () => {
    expect(html).toContain('Responsable achats');
    expect(html).toContain('signature');
  });
});
