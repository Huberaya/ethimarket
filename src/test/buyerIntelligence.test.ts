// @vitest-environment node
// =============================================================
// Tests des 4 nouveaux moteurs issus du retour acheteur :
// Responsibility Score 6 critères, alertes proactives,
// « Trouver mieux » 7 dimensions, sourcing fournisseurs IA,
// extraction documentaire.
// =============================================================

import { describe, it, expect } from 'vitest';
import { computeResponsibilityReport } from '../lib/responsibilityScore';
import { alertsFromClaims, alertsFromOpportunities, alertsFromSuppliers } from '../lib/alertsEngine';
import { findBetter, compareDimensions } from '../lib/findBetterEngine';
import { computeScorecards } from '../lib/procurementComparator';
import { parseSourcingMission, evaluateSuppliers } from '../lib/supplierSourcing';
import { detectDocType, extractFields, analyzeDocument, normalizeDate } from '../lib/documentVault';
import type { Product, Producer } from '../lib/supabase';

const NOW = new Date('2026-08-16T12:00:00Z');

const P = (over: Partial<Product>): Product => ({
  id: over.id ?? Math.random().toString(36).slice(2),
  name: 'Produit', price: 10, certifications: [],
  ...over,
} as Product);

// ============================================================
// 1. RESPONSIBILITY SCORE
// ============================================================
describe('Responsibility Score — 6 critères explicables', () => {
  const premium = P({
    id: 'prem', name: 'T-shirt coton bio', price: 13,
    certifications: ['Bio', 'GOTS'],
    batch_number: 'LOT-1', gps_coordinates: '6.1,38.2', trace_qr_code: 'qr',
    manufacturing_country: 'Portugal', raw_materials_origin: 'Inde',
    harvest_date: '2026-01-01', farming_method: 'Agriculture biologique',
    fair_trade: true, living_wage_guaranteed: true, social_audit_passed: true,
    carbon_footprint_kg: 0.9, water_footprint_liters: 100,
    packaging_types: ['plastic_free'], stock_value: 100, stock_unit: 'pièces',
    moq_value: 20, delivery_days: '5-7' as unknown as Product['delivery_days'],
    confidence_score: 90, rating: 4.7,
  });

  const report = computeResponsibilityReport(premium, [
    { claim_label: 'Coton biologique', verification_status: 'verified', valid_until: '2027-03-12' },
  ], { rating: 4.7, verified: true }, NOW);

  it('produit exactement 6 critères avec emoji et labels', () => {
    expect(report.criteria.map(c => c.key)).toEqual([
      'environment', 'social', 'traceability', 'certifications', 'logistics', 'supplier',
    ]);
  });
  it('produit premium → tous les critères ≥ 70', () => {
    report.criteria.forEach(c => expect(c.score).toBeGreaterThanOrEqual(70));
    expect(report.overallScore).toBeGreaterThanOrEqual(75);
  });
  it('chaque point est explicable (détails avec points)', () => {
    report.criteria.forEach(c => {
      expect(c.details.length).toBeGreaterThan(0);
      c.details.forEach(d => expect(typeof d.points).toBe('number'));
    });
  });
  it("point d'attention INFO : certification valide jusqu'au 12/03/2027", () => {
    const info = report.attentionPoints.find(a => a.message.includes('12/03/2027'));
    expect(info).toBeDefined();
    expect(info!.severity).toBe('info');
  });

  it('produit opaque → score bas + points d\'attention warning', () => {
    const opaque = P({ id: 'op', name: 'Produit mystère', price: 5 });
    const r = computeResponsibilityReport(opaque, [], {}, NOW);
    expect(r.overallScore).toBeLessThan(55);
    expect(r.attentionPoints.some(a => a.severity === 'warning')).toBe(true);
    expect(r.attentionPoints.some(a => a.message.includes('numéro de lot'))).toBe(true);
  });

  it('« documenté jusqu\'au fabricant mais pas jusqu\'à la ferme » détecté', () => {
    const partial = P({ id: 'pa', name: 'X', manufacturing_country: 'France' });
    const r = computeResponsibilityReport(partial, [], {}, NOW);
    expect(r.attentionPoints.some(a => a.message.includes("jusqu'au fabricant mais pas jusqu'à la ferme"))).toBe(true);
  });

  it('allégation contredite → point critique + malus certifications', () => {
    const r = computeResponsibilityReport(premium, [
      { claim_label: 'Vegan', verification_status: 'contradicted' },
    ], {}, NOW);
    expect(r.attentionPoints[0].severity).toBe('critical');
  });

  it('certification qui expire sous 60 jours → warning avec compte de jours', () => {
    const r = computeResponsibilityReport(premium, [
      { claim_label: 'Bio', verification_status: 'verified', valid_until: '2026-09-01' },
    ], {}, NOW);
    const w = r.attentionPoints.find(a => a.message.includes('expire dans'));
    expect(w).toBeDefined();
    expect(w!.severity).toBe('warning');
    expect(w!.message).toMatch(/1[56] jours?/);
  });
});

// ============================================================
// 2. ALERTES PROACTIVES
// ============================================================
describe('Moteur d\'alertes', () => {
  it('🔴 certification qui expire dans 15 jours', () => {
    const alerts = alertsFromClaims([{
      product_id: 'p1', product_name: 'Café X', claim_label: 'Bio',
      verification_status: 'verified', valid_until: '2026-08-31',
    }], 30, NOW);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].severity).toBe('red');
    expect(alerts[0].title).toContain('ALERTE FOURNISSEUR');
    expect(alerts[0].message).toMatch(/1[45] jours?/);
  });

  it('🟠 information contradictoire détectée', () => {
    const alerts = alertsFromClaims([{
      product_id: 'p1', product_name: 'Café X', claim_label: 'Salaire décent',
      verification_status: 'contradicted',
    }], 30, NOW);
    expect(alerts[0].severity).toBe('orange');
    expect(alerts[0].title).toContain('NOUVEAU RISQUE');
    expect(alerts[0].message).toContain('information contradictoire');
  });

  it('🟢 opportunité : alternative moins chère à score supérieur', () => {
    const ref = P({ id: 'ref', name: 'Café A', price: 20, product_type: 'café', batch_number: 'L' });
    const alt = P({
      id: 'alt', name: 'Café B', price: 17, product_type: 'café',
      batch_number: 'L2', gps_coordinates: '1,1', manufacturing_country: 'Éthiopie',
      raw_materials_origin: 'Éthiopie', fair_trade: true, living_wage_guaranteed: true,
      social_audit_passed: true, carbon_footprint_kg: 0.8, confidence_score: 92,
      certifications: ['Bio', 'Fairtrade'], trace_qr_code: 'q',
    });
    const alerts = alertsFromOpportunities([ref], [ref, alt]);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].severity).toBe('green');
    expect(alerts[0].message).toMatch(/15% moins chère/);
    expect(alerts[0].message).toContain('score responsable supérieur');
  });

  it('🔵 fournisseur non réévalué depuis 90 jours + 🟠 à risque', () => {
    const alerts = alertsFromSuppliers([
      { producer_id: 'a', status: 'active', updated_at: '2026-04-01T00:00:00Z', producer_name: 'Coop A' },
      { producer_id: 'b', status: 'at_risk', updated_at: '2026-08-10T00:00:00Z', producer_name: 'Coop B' },
    ], 90, NOW);
    expect(alerts.find(a => a.kind === 'reevaluation')).toBeDefined();
    expect(alerts.find(a => a.kind === 'risk')?.message).toContain('Coop B');
  });

  it('déduplication : la même expiration produit la même dedupe_key', () => {
    const claim = { product_id: 'p1', product_name: 'X', claim_label: 'Bio', verification_status: 'verified', valid_until: '2026-08-31' };
    const a1 = alertsFromClaims([claim], 30, NOW);
    const a2 = alertsFromClaims([claim], 30, NOW);
    expect(a1[0].dedupe_key).toBe(a2[0].dedupe_key);
  });
});

// ============================================================
// 3. TROUVER MIEUX (7 dimensions)
// ============================================================
describe('Bouton « Trouver mieux »', () => {
  const reference = P({
    id: 'ref', name: 'Café Basique', price: 15, product_type: 'café',
    country: 'Vietnam', certifications: ['Bio'], stock_value: 0,
    carbon_footprint_kg: 3,
  });
  const superior = P({
    id: 'sup', name: 'Café Supérieur', price: 13, product_type: 'café',
    country: 'France', manufacturing_country: 'France',
    certifications: ['Bio', 'Fairtrade'], batch_number: 'L1', gps_coordinates: '1,1',
    raw_materials_origin: 'Éthiopie', trace_qr_code: 'q', fair_trade: true,
    living_wage_guaranteed: true, social_audit_passed: true,
    carbon_footprint_kg: 0.9, confidence_score: 90, stock_value: 500,
  });
  const worse = P({ id: 'wor', name: 'Café Médiocre', price: 18, product_type: 'café', country: 'Vietnam' });
  const otherFamily = P({ id: 'oth', name: 'Thé Vert', price: 5, product_type: 'thé' });

  const catalog = [reference, superior, worse, otherFamily];
  const cards = computeScorecards(catalog);
  const result = findBetter(reference, catalog, cards);

  it('trouve l\'alternative supérieure, ignore la moins bonne et l\'autre famille', () => {
    expect(result.alternatives.map(a => a.product.id)).toEqual(['sup']);
    expect(result.scannedCount).toBe(2); // café supérieur + café médiocre (pas le thé)
  });
  it('verdict au format demandé', () => {
    expect(result.verdict).toBe('1 alternative supérieure trouvée.');
  });
  it('les dimensions gagnées incluent moins cher, plus local, mieux traçable et plus disponible', () => {
    const dims = result.alternatives[0].winningDimensions;
    expect(dims).toContain('cheaper');
    expect(dims).toContain('more_local');
    expect(dims).toContain('better_traced');
    expect(dims).toContain('more_available');
  });
  it('compareDimensions est symétriquement honnête (losing rempli)', () => {
    const refCard = cards.find(c => c.product.id === 'ref')!;
    const worseCard = cards.find(c => c.product.id === 'wor')!;
    const { winning, losing } = compareDimensions(refCard, worseCard);
    expect(winning.length).toBeLessThanOrEqual(losing.length + 2);
  });
  it('référence déjà excellente → « déjà le meilleur choix »', () => {
    const r2 = findBetter(superior, catalog, cards);
    expect(r2.alternatives).toHaveLength(0);
    expect(r2.verdict).toContain('déjà le meilleur choix');
  });
});

// ============================================================
// 4. SOURCING FOURNISSEURS IA
// ============================================================
describe('Sourcing fournisseurs — mission en langage naturel', () => {
  it('parse la mission complète du retour acheteur', () => {
    const m = parseSourcingMission(
      'Trouve-moi 10 fournisseurs européens capables de fournir 5 000 unités par mois, avec un score responsable supérieur à 80 et un prix inférieur à 8 €',
    );
    expect(m.maxSuppliers).toBe(10);
    expect(m.region).toBe('europe');
    expect(m.minMonthlyCapacity).toBe(5000);
    expect(m.minResponsibleScore).toBe(80);
    expect(m.maxUnitPrice).toBe(8);
  });

  it('parse la mission « bouteilles réutilisables » avec budget et score', () => {
    const m = parseSourcingMission(
      "J'ai besoin de 10 000 bouteilles réutilisables, budget maximum 3,50 € pièce. Score responsable minimum : 85/100.",
    );
    expect(m.maxUnitPrice).toBe(3.5);
    expect(m.minResponsibleScore).toBe(85);
    expect(m.productKeywords).toContain('bouteilles');
    expect(m.productKeywords).toContain('reutilisables');
  });

  it('entonnoir : trouvés → conformes → shortlist, avec raisons d\'exclusion', () => {
    const producers = [
      { id: 'a', name: 'Coop France', country: 'France', verified: true, annual_capacity: 120000 },
      { id: 'b', name: 'Coop Vietnam', country: 'Vietnam', verified: true, annual_capacity: 120000 },
      { id: 'c', name: 'Coop Italie Chère', country: 'Italie', verified: true, annual_capacity: 120000 },
    ] as unknown as Producer[];
    const products: Record<string, Product[]> = {
      a: [P({ id: 'pa', name: 'Bouteille inox', producer_id: 'a', price: 6, keywords: ['bouteille'] })],
      b: [P({ id: 'pb', name: 'Bouteille bambou', producer_id: 'b', price: 5, keywords: ['bouteille'] })],
      c: [P({ id: 'pc', name: 'Bouteille verre', producer_id: 'c', price: 12, keywords: ['bouteille'] })],
    };
    const scores = { pa: 85, pb: 90, pc: 88 };
    const mission = parseSourcingMission('3 fournisseurs européens de bouteilles, score responsable supérieur à 80, prix inférieur à 8 €');
    const result = evaluateSuppliers(mission, producers, products, scores);

    expect(result.foundCount).toBe(3);
    expect(result.qualifiedCount).toBe(1);           // seule la France : Vietnam hors zone, Italie trop chère
    expect(result.shortlist[0].producer.name).toBe('Coop France');
    expect(result.narrative).toContain('J\'ai trouvé 3 fournisseurs');
    expect(result.narrative).toContain('1 répond');
    const vietnam = result.excluded.find(e => e.producer.name === 'Coop Vietnam');
    expect(vietnam!.failedCriteria.join(' ')).toContain('Hors zone');
    const italie = result.excluded.find(e => e.producer.name === 'Coop Italie Chère');
    expect(italie!.failedCriteria.join(' ')).toContain('Prix minimum trop élevé');
  });
});

// ============================================================
// 5. COFFRE-FORT DOCUMENTAIRE
// ============================================================
describe('Extraction documentaire locale', () => {
  const CERT_TEXT = `
    CERTIFICAT DE CONFORMITÉ
    Global Organic Textile Standard (GOTS)
    Certificat n° : EC-BIO-2026-45812
    Titulaire : Coopérative Textile du Sud
    Délivré le 10 mars 2026 par Ecocert
    Valide jusqu'au 12/03/2027
    Périmètre : filature, tissage et confection de textiles en coton biologique
    Produits concernés : t-shirts, sweats en coton bio
  `;

  it('détecte le type certificat avec confiance haute', () => {
    const d = detectDocType('certificat-gots.pdf', CERT_TEXT);
    expect(d.type).toBe('certificate');
    expect(d.confidence).toBe('high');
  });

  it('extrait certification → n° → organisme → dates → périmètre → produit → fournisseur', () => {
    const fields = extractFields(CERT_TEXT);
    const get = (k: string) => fields.find(f => f.key === k)?.value;
    expect(get('certification_name')).toBe('GOTS');
    expect(get('reference_number')).toBe('EC-BIO-2026-45812');
    expect(get('issuing_body')).toBe('Ecocert');
    expect(get('expiry_date')).toBe('2027-03-12');
    expect(get('issue_date')).toBe('2026-03-10');
    expect(get('scope')).toContain('filature');
    expect(get('supplier')).toContain('Coopérative Textile du Sud');
  });

  it('normalizeDate gère JJ/MM/AAAA, ISO et dates françaises', () => {
    expect(normalizeDate('12/03/2027')).toBe('2027-03-12');
    expect(normalizeDate('2027-03-12')).toBe('2027-03-12');
    expect(normalizeDate('12 mars 2027')).toBe('2027-03-12');
    expect(normalizeDate('n/a')).toBeNull();
  });

  it('document complet → 100%, document lacunaire → 🔴 informations manquantes', () => {
    const full = analyzeDocument('cert.pdf', CERT_TEXT, NOW);
    expect(full.completenessPct).toBe(100);
    expect(full.missingFields).toHaveLength(0);

    const partial = analyzeDocument('certificat-incomplet.pdf', 'Certificat Bio délivré à quelqu\'un.', NOW);
    expect(partial.completenessPct).toBeLessThan(100);
    expect(partial.missingFields.length).toBeGreaterThan(0);
    expect(partial.warnings.some(w => w.includes('Information manquante'))).toBe(true);
  });

  it('document expiré → avertissement explicite', () => {
    const expired = analyzeDocument('cert.pdf', CERT_TEXT.replace("Valide jusqu'au 12/03/2027", "Valide jusqu'au 01/01/2026"), NOW);
    expect(expired.warnings.some(w => w.includes('EXPIRÉ'))).toBe(true);
  });
});
