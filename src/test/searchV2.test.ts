// @vitest-environment node
// =============================================================
// EthiMarket Search V2 — Suite de tests (vitest)
// Couvre les 17 facettes + les 2 requêtes exemples du cahier des charges.
// =============================================================

import { describe, it, expect } from 'vitest';
import { parseQueryZeroApi } from '../lib/search/zeroApiParser';
import { haversineKm } from '../lib/search/searchEngine';
import { findAlternatives } from '../lib/search/alternativesEngine';
import { intelligentSearchSync } from '../lib/search/index';
import { ProductV2 } from '../lib/search/types';

// ---------- Catalogue de test ----------
const catalog: ProductV2[] = [
  {
    id: 'p1', name: 'T-shirt coton bio col rond', product_type: 't-shirt', target_gender: 'homme',
    price: 12.5, moq: 50, delivery_days: 10, stock_value: 500,
    supplier_id: 's1', supplier_name: 'EcoTex Portugal',
    origin_country: 'Portugal', manufacturing_country: 'Portugal', raw_material_countries: ['Inde'],
    gps: { lat: 41.15, lng: -8.6 },
    materials: ['coton'], certifications: ['Bio', 'GOTS'],
    carbon_footprint_kg: 1.2, recycled_percent: 0, is_vegan: true, fair_trade: true,
    living_wage_guaranteed: true, social_audit_passed: true, no_child_labor_verified: true,
    packaging: { plastic_free: true, recyclable: true },
    traceability_score: 92, trust_score: 88, product_score: 90, rating: 4.7, reviews_count: 43,
  },
  {
    id: 'p2', name: 'T-shirt classique polyester', product_type: 't-shirt', target_gender: 'homme',
    price: 8.9, moq: 200, delivery_days: 25, stock_value: 1000,
    supplier_id: 's2', supplier_name: 'FastWear Asia',
    origin_country: 'Bangladesh', manufacturing_country: 'Bangladesh',
    gps: { lat: 23.7, lng: 90.3 },
    materials: ['polyester'], certifications: [],
    carbon_footprint_kg: 6.5, is_vegan: true, fair_trade: false,
    living_wage_guaranteed: false,
    packaging: {},
    traceability_score: 20, trust_score: 45, product_score: 30, rating: 3.8, reviews_count: 12,
  },
  {
    id: 'p3', name: 'T-shirt coton bio femme', product_type: 't-shirt', target_gender: 'femme',
    price: 11.9, moq: 30, delivery_days: 7, stock_value: 200,
    supplier_id: 's3', supplier_name: 'BioWear France',
    origin_country: 'France', manufacturing_country: 'France', raw_material_countries: ['Inde'],
    gps: { lat: 45.75, lng: 4.85 },
    materials: ['coton'], certifications: ['Bio', 'GOTS', 'Commerce Équitable'],
    carbon_footprint_kg: 0.9, recycled_percent: 30, is_recycled: true, is_vegan: true, fair_trade: true,
    living_wage_guaranteed: true, social_audit_passed: true, cooperative: true,
    packaging: { plastic_free: true, compostable: true },
    traceability_score: 97, trust_score: 95, product_score: 95, rating: 4.9, reviews_count: 87,
  },
  {
    id: 'p4', name: 'T-shirt sport recyclé', product_type: 't-shirt', target_gender: 'unisexe',
    price: 18.0, moq: 100, delivery_days: 5, stock_value: 0,
    supplier_id: 's4', supplier_name: 'GreenSport Italia',
    origin_country: 'Italie', manufacturing_country: 'Italie',
    gps: { lat: 45.46, lng: 9.19 },
    materials: ['polyester recyclé'], certifications: ['GRS'],
    carbon_footprint_kg: 2.1, recycled_percent: 85, is_recycled: true, is_vegan: true,
    packaging: { recyclable: true },
    traceability_score: 75, trust_score: 80, product_score: 70, rating: 4.4, reviews_count: 21,
  },
  {
    id: 'p5', name: 'Miel de lavande bio', product_type: 'miel',
    price: 9.5, moq: 10, delivery_days: 4, stock_value: 80,
    supplier_id: 's5', supplier_name: 'Ruchers du Sud',
    origin_country: 'France', manufacturing_country: 'France',
    gps: { lat: 43.9, lng: 5.1 },
    certifications: ['Bio'],
    carbon_footprint_kg: 0.4, is_vegan: false, fair_trade: false,
    living_wage_guaranteed: true, cooperative: true,
    packaging: { plastic_free: true, deposit_system: true },
    traceability_score: 90, trust_score: 91, product_score: 88, rating: 4.8, reviews_count: 55,
  },
  {
    id: 'p6', name: 'T-shirt coton équitable homme', product_type: 't-shirt', target_gender: 'homme',
    price: 11.0, moq: 40, delivery_days: 12, stock_value: 300,
    supplier_id: 's6', supplier_name: 'FairCotton Spain',
    origin_country: 'Espagne', manufacturing_country: 'Espagne', raw_material_countries: ['Ghana'],
    gps: { lat: 40.4, lng: -3.7 },
    materials: ['coton'], certifications: ['Commerce Équitable', 'Bio'],
    carbon_footprint_kg: 1.5, is_vegan: true, fair_trade: true,
    living_wage_guaranteed: true, social_audit_passed: true,
    packaging: { plastic_free: true },
    traceability_score: 85, trust_score: 82, product_score: 84, rating: 4.5, reviews_count: 30,
  },
];

// ============================================================
// 1. PARSER — Requête vedette n°1
// ============================================================
describe('Parser zéro-API — "T-shirt coton bio homme, moins de 15 €, Europe"', () => {
  const parsed = parseQueryZeroApi('T-shirt coton bio homme, moins de 15 €, Europe');

  it('détecte le type de produit', () => expect(parsed.productType).toBe('t-shirt'));
  it('détecte la matière', () => expect(parsed.materials).toContain('coton'));
  it('détecte la certification bio', () => {
    expect(parsed.certifications).toContain('Bio');
    expect(parsed.flags.organicOnly).toBe(true);
  });
  it('détecte le genre', () => expect(parsed.gender).toBe('homme'));
  it('détecte le prix max 15 €', () => {
    expect(parsed.maxPrice).toBe(15);
    expect(parsed.currency).toBe('EUR');
  });
  it('détecte la région Europe', () => expect(parsed.regions).toContain('Europe'));
  it('intention = recherche standard', () => expect(parsed.intent).toBe('standard_search'));
});

// ============================================================
// 2. PARSER — Requête vedette n°2 (alternative fournisseur)
// ============================================================
describe('Parser — "Trouve-moi une alternative au fournisseur X moins cher, meilleure traçabilité"', () => {
  const parsed = parseQueryZeroApi(
    'Trouve-moi une alternative au fournisseur FastWear Asia qui coûte moins cher mais avec une meilleure traçabilité.',
  );

  it('intention = alternative', () => expect(parsed.intent).toBe('alternative_search'));
  it('extrait le nom du fournisseur', () => expect(parsed.referenceSupplier).toMatch(/FastWear Asia/i));
  it('priorité prix', () => expect(parsed.priorities.cheaper).toBe(true));
  it('priorité traçabilité (pas un filtre dur)', () => {
    expect(parsed.priorities.betterTraceability).toBe(true);
    expect(parsed.flags.fullTraceability).toBe(false);
  });
});

// ============================================================
// 3. PARSER — les 17 facettes une à une
// ============================================================
describe('Parser — couverture des 17 facettes', () => {
  it('1. certification bio + GOTS', () => {
    const p = parseQueryZeroApi('t-shirt certifié GOTS et bio');
    expect(p.certifications).toEqual(expect.arrayContaining(['Bio', 'GOTS']));
  });
  it('2. origine (pays cité)', () => {
    const p = parseQueryZeroApi('café de Colombie');
    expect(p.originCountries).toContain('Colombie');
  });
  it('3. pays de fabrication distinct', () => {
    const p = parseQueryZeroApi('t-shirt fabriqué au Portugal');
    expect(p.manufacturingCountries).toContain('Portugal');
    expect(p.originCountries).not.toContain('Portugal');
  });
  it('4. pays des matières premières', () => {
    const p = parseQueryZeroApi("t-shirt en coton d'Inde fabriqué en France");
    expect(p.rawMaterialCountries).toContain('Inde');
    expect(p.manufacturingCountries).toContain('France');
  });
  it('5. distance en km', () => {
    const p = parseQueryZeroApi('miel dans un rayon de 200 km');
    expect(p.maxDistanceKm).toBe(200);
  });
  it("5bis. 'près de chez moi' → rayon par défaut", () => {
    const p = parseQueryZeroApi('savon près de chez moi');
    expect(p.maxDistanceKm).toBe(300);
  });
  it('6. empreinte carbone chiffrée', () => {
    const p = parseQueryZeroApi('t-shirt moins de 2 kg de CO2');
    expect(p.maxCarbonKg).toBe(2);
  });
  it('7. conditions sociales', () => {
    const p = parseQueryZeroApi('vêtements sans travail des enfants');
    expect(p.flags.socialConditions).toBe(true);
  });
  it('8. salaire décent', () => {
    const p = parseQueryZeroApi('café salaire décent garanti');
    expect(p.flags.livingWage).toBe(true);
  });
  it('9. commerce équitable', () => {
    const p = parseQueryZeroApi('chocolat commerce équitable');
    expect(p.flags.fairTrade).toBe(true);
    expect(p.certifications).toContain('Commerce Équitable');
  });
  it('10. recyclé avec pourcentage', () => {
    const p = parseQueryZeroApi('t-shirt 70% recyclé');
    expect(p.flags.recycled).toBe(true);
    expect(p.minRecycledPercent).toBe(70);
  });
  it('11. vegan', () => {
    const p = parseQueryZeroApi('crème vegan');
    expect(p.flags.vegan).toBe(true);
  });
  it('12. emballage sans plastique', () => {
    const p = parseQueryZeroApi('savon emballage sans plastique');
    expect(p.flags.plasticFreePackaging).toBe(true);
  });
  it('12bis. emballage compostable + vrac', () => {
    const p = parseQueryZeroApi('thé en vrac emballage compostable');
    expect(p.flags.bulkPackaging).toBe(true);
    expect(p.flags.compostablePackaging).toBe(true);
  });
  it('13. MOQ', () => {
    const p = parseQueryZeroApi('t-shirts MOQ maximum 100');
    expect(p.maxMoq).toBe(100);
  });
  it('14. fourchette de prix', () => {
    const p = parseQueryZeroApi('miel entre 5 et 12 €');
    expect(p.minPrice).toBe(5);
    expect(p.maxPrice).toBe(12);
  });
  it('15. délai de livraison', () => {
    const p = parseQueryZeroApi('bougie livraison sous 7 jours');
    expect(p.maxDeliveryDays).toBe(7);
  });
  it('16. fournisseur nommé', () => {
    const p = parseQueryZeroApi('produits du fournisseur EcoTex');
    expect(p.referenceSupplier).toMatch(/EcoTex/i);
  });
  it('17. score de confiance', () => {
    const p = parseQueryZeroApi('café score de confiance supérieur à 80');
    expect(p.minTrustScore).toBe(80);
  });
});

// ============================================================
// 4. MOTEUR — filtrage + classement de bout en bout
// ============================================================
describe('Moteur — "T-shirt coton bio homme, moins de 15 €, Europe" sur le catalogue', () => {
  const res = intelligentSearchSync('T-shirt coton bio homme, moins de 15 €, Europe', catalog);

  it('retourne uniquement les produits conformes', () => {
    const ids = res.results.map(r => r.id);
    expect(ids).toContain('p1'); // 12.50 €, bio, coton, Portugal (Europe), homme
    expect(ids).toContain('p6'); // 11 €, bio, coton, Espagne, homme
    expect(ids).not.toContain('p2'); // pas bio, Bangladesh
    expect(ids).not.toContain('p3'); // femme (11,90 € mais genre exclu)
    expect(ids).not.toContain('p4'); // 18 € > 15 €
    expect(ids).not.toContain('p5'); // miel
  });
  it('chaque résultat est expliqué', () => {
    res.results.forEach(r => {
      expect(r.searchScore).toBeGreaterThan(0);
      expect(r.matchReasons.length).toBeGreaterThan(0);
    });
  });
});

describe('Moteur — filtres facettes individuels', () => {
  it('empreinte carbone max 2 kg', () => {
    const res = intelligentSearchSync('t-shirt moins de 2 kg de CO2', catalog);
    expect(res.results.every(r => (r.carbon_footprint_kg ?? 99) <= 2)).toBe(true);
  });
  it('% recyclé minimal', () => {
    const res = intelligentSearchSync('t-shirt 70% recyclé', catalog);
    expect(res.results.map(r => r.id)).toEqual(['p4']);
  });
  it('MOQ max 50', () => {
    const res = intelligentSearchSync('t-shirt MOQ max 50', catalog);
    expect(res.results.every(r => (r.moq ?? 1) <= 50)).toBe(true);
  });
  it('délai sous 8 jours', () => {
    const res = intelligentSearchSync('t-shirt livraison sous 8 jours', catalog);
    expect(res.results.every(r => (r.delivery_days ?? 99) <= 8)).toBe(true);
  });
  it('score de confiance > 85', () => {
    const res = intelligentSearchSync('t-shirt score de confiance supérieur à 85', catalog);
    expect(res.results.every(r => (r.trust_score ?? 0) >= 85)).toBe(true);
  });
  it('pays des matières premières (coton du Ghana)', () => {
    const res = intelligentSearchSync('t-shirt en coton du Ghana', catalog);
    expect(res.results.map(r => r.id)).toEqual(['p6']);
  });
  it('salaire décent + conditions sociales', () => {
    const res = intelligentSearchSync('t-shirt salaire décent audit social', catalog);
    expect(res.results.every(r => r.living_wage_guaranteed)).toBe(true);
  });
  it('distance : miel à moins de 250 km de Lyon', () => {
    const res = intelligentSearchSync('miel dans un rayon de 250 km', catalog, {
      userLocation: { lat: 45.75, lng: 4.85 },
    });
    expect(res.results.map(r => r.id)).toEqual(['p5']); // Lavande ~ 140 km de Lyon
    expect(res.results[0].distanceKm).toBeLessThan(250);
  });
});

// ============================================================
// 5. ALTERNATIVES — la requête vedette n°2 de bout en bout
// ============================================================
describe('Alternatives — "alternative au fournisseur EcoTex Portugal moins chère, meilleure traçabilité"', () => {
  const parsed = parseQueryZeroApi(
    'Trouve-moi une alternative au fournisseur EcoTex Portugal qui coûte moins cher mais avec une meilleure traçabilité.',
  );
  const alts = findAlternatives(catalog, parsed);

  it('trouve au moins une alternative', () => expect(alts.length).toBeGreaterThan(0));
  it('toutes moins chères que la référence (12,50 €)', () => {
    alts.forEach(a => expect(a.priceDiffPct).toBeLessThan(0));
  });
  it('toutes avec meilleure traçabilité que la référence (92)', () => {
    alts.forEach(a => expect(a.traceabilityDiff).toBeGreaterThan(0));
  });
  it('exclut le fournisseur de référence', () => {
    alts.forEach(a => expect(a.product.supplier_name).not.toMatch(/EcoTex/i));
  });
  it('fournit avantages + raison en français', () => {
    expect(alts[0].advantages.length).toBeGreaterThan(0);
    expect(alts[0].reason).toMatch(/économie|traçabilité/i);
  });
  it('cohérence stricte : moins cher ET mieux tracé que la référence', () => {
    // Référence p1 : 12,50 € / traçabilité 92.
    // p3 (11,90 €, traçabilité 97) doit être la seule alternative valide :
    // p6 (11 €) a une traçabilité de 85 < 92 → exclu ; p2/p4 également.
    alts.forEach(a => {
      expect(a.product.price).toBeLessThan(12.5);
      expect(a.product.traceability_score ?? 0).toBeGreaterThan(92);
    });
  });
});

describe('Alternatives — priorité unique (moins cher seulement)', () => {
  const parsed = parseQueryZeroApi('alternative au fournisseur GreenSport Italia moins chère');
  const alts = findAlternatives(catalog, parsed);
  it('toutes les alternatives sont moins chères que 18 €', () => {
    expect(alts.length).toBeGreaterThan(0);
    alts.forEach(a => expect(a.product.price).toBeLessThan(18));
  });
});

// ============================================================
// 6. UTILITAIRES & ROBUSTESSE
// ============================================================
describe('Robustesse', () => {
  it('haversine Paris-Lyon ≈ 390 km', () => {
    const d = haversineKm({ lat: 48.86, lng: 2.35 }, { lat: 45.75, lng: 4.85 });
    expect(d).toBeGreaterThan(350);
    expect(d).toBeLessThan(430);
  });
  it('requête vide → aucun crash, tout le catalogue scoré', () => {
    const res = intelligentSearchSync('', catalog);
    expect(res.totalCount).toBe(catalog.length);
  });
  it('requête sans accent comprise ("cafe equitable du Perou")', () => {
    const p = parseQueryZeroApi('cafe equitable du Perou');
    expect(p.productType).toBe('café');
    expect(p.flags.fairTrade).toBe(true);
    expect(p.originCountries).toContain('Pérou');
  });
  it('requête anglaise ("organic cotton t-shirt made in Portugal under 15€")', () => {
    const p = parseQueryZeroApi('organic cotton t-shirt for men made in Portugal under 15€');
    expect(p.productType).toBe('t-shirt');
    expect(p.materials).toContain('coton');
    expect(p.certifications).toContain('Bio');
    expect(p.manufacturingCountries).toContain('Portugal');
  });
  it('performance : 5 000 produits < 200 ms', () => {
    const big: ProductV2[] = Array.from({ length: 5000 }, (_, i) => ({
      ...catalog[i % catalog.length],
      id: `big-${i}`,
    }));
    const t0 = performance.now();
    intelligentSearchSync('T-shirt coton bio homme, moins de 15 €, Europe', big);
    expect(performance.now() - t0).toBeLessThan(200);
  });
  it('parsing < 5 ms', () => {
    const t0 = performance.now();
    for (let i = 0; i < 20; i++) parseQueryZeroApi('T-shirt coton bio homme, moins de 15 €, Europe');
    expect((performance.now() - t0) / 20).toBeLessThan(5);
  });
});
