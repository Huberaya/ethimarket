// @vitest-environment node
// =============================================================
// Tests des calculs d'impact fondés sur les référentiels fiables :
// GHG Protocol (structure), ADEME Base Carbone®/Agribalyse
// (transport, emballage, produits), Poore & Nemecek 2018,
// Water Footprint Network (Mekonnen & Hoekstra 2011),
// Clark & Tilman 2017 (écart bio/conventionnel honnête).
// =============================================================

import { describe, it, expect } from 'vitest';
import {
  PRODUCTION_FACTORS_SOURCED, TRANSPORT_FACTORS_SOURCED, WATER_FACTORS_SOURCED,
  PACKAGING_FACTORS_SOURCED, IMPACT_METHODOLOGY,
} from '../lib/impactFactors';
import { calculateCarbonFootprint, calculateWaterFootprint } from '../lib/calculations';

// ------------------------------------------------------------
// 1. Le référentiel : chaque facteur est sourcé et daté
// ------------------------------------------------------------
describe('Référentiel de facteurs sourcés', () => {
  it('chaque facteur de production porte source, année et incertitude', () => {
    Object.entries(PRODUCTION_FACTORS_SOURCED).forEach(([, entry]) => {
      expect(entry.conv.source.length).toBeGreaterThan(10);
      expect(entry.conv.year).toBeGreaterThanOrEqual(2011);
      expect(entry.conv.uncertaintyPct).toBeGreaterThan(0);
      expect(entry.organicReductionSource).toContain('Clark');
    });
  });

  it('facteurs transport = valeurs ADEME Base Carbone® connues', () => {
    expect(TRANSPORT_FACTORS_SOURCED.sea.value).toBe(0.016);   // porte-conteneurs
    expect(TRANSPORT_FACTORS_SOURCED.air.value).toBe(0.602);   // aérien cargo
    expect(TRANSPORT_FACTORS_SOURCED.rail.value).toBe(0.023);  // ferroviaire
    Object.values(TRANSPORT_FACTORS_SOURCED).forEach(f => {
      expect(f.source).toContain('ADEME Base Carbone®');
    });
  });

  it('facteurs eau = ordres de grandeur Mekonnen & Hoekstra 2011', () => {
    expect(WATER_FACTORS_SOURCED.coffee.total.value).toBe(18900);   // café torréfié
    expect(WATER_FACTORS_SOURCED.cocoa.total.value).toBe(19928);    // fèves cacao
    expect(WATER_FACTORS_SOURCED.vanilla.total.value).toBe(126505); // vanille
    // Répartition verte/bleue/grise = 100%
    Object.values(WATER_FACTORS_SOURCED).forEach(w => {
      expect(w.greenPct + w.bluePct + w.greyPct).toBe(100);
    });
  });

  it('écart bio/conventionnel honnête : ≤ 10% par kg (pas de ×3 marketing)', () => {
    Object.values(PRODUCTION_FACTORS_SOURCED).forEach(entry => {
      expect(entry.organicReductionPct).toBeLessThanOrEqual(10);
    });
  });
});

// ------------------------------------------------------------
// 2. Calcul carbone (GHG Protocol cradle-to-customer)
// ------------------------------------------------------------
describe('calculateCarbonFootprint — GHG Protocol', () => {
  const bioCoffee = { name: 'Café Éthiopien', country: 'Éthiopie', certifications: ['Bio'] };
  const producer = { country: 'Éthiopie', certifications: ['Bio'] };

  it('décompose production + transport + emballage (périmètre GHG Protocol)', () => {
    const r = calculateCarbonFootprint(bioCoffee, producer, 100, 'France', 'maritime');
    expect(r.production.value).toBeGreaterThan(0);
    expect(r.transport.value).toBeGreaterThan(0);
    expect(r.packaging.value).toBeGreaterThan(0);
    expect(r.total.value).toBeCloseTo(
      r.production.value + r.transport.value + r.packaging.value, 0);
    expect(r.methodology).toContain('GHG Protocol');
  });

  it('production café bio 100 kg ≈ 16,5 × 0,9 × 100 = 1 485 kg CO2e (Poore & Nemecek − Clark & Tilman)', () => {
    const r = calculateCarbonFootprint(bioCoffee, producer, 100, 'France', 'maritime');
    expect(r.production.value).toBeCloseTo(1485, -1);
    expect(r.production.source).toContain('Poore & Nemecek');
  });

  it('le transport aérien émet ~37× plus que le maritime (0,602 vs 0,016 t.km)', () => {
    const sea = calculateCarbonFootprint(bioCoffee, producer, 100, 'France', 'maritime');
    const air = calculateCarbonFootprint(bioCoffee, producer, 100, 'France', 'air');
    expect(air.transport.value / sea.transport.value).toBeCloseTo(0.602 / 0.016, 0);
    expect(air.transport.source).toContain('ADEME');
  });

  it('hiérarchie GHG Protocol : la donnée primaire du producteur PRIME sur la moyenne sectorielle', () => {
    const withAcv = { ...bioCoffee, carbon_footprint_kg: 1.6 }; // ACV produit fournie
    const r = calculateCarbonFootprint(withAcv, producer, 100, 'France', 'maritime');
    expect(r.production.value).toBeCloseTo(160, 0); // 1,6 × 100
    expect(r.production.source).toContain('Donnée primaire');
    expect(r.inputs.usesPrimaryData).toBe(true);
  });

  it('l\'économie bio vs conventionnel est plausible (< 15%), plus jamais 60-70% fictifs', () => {
    const r = calculateCarbonFootprint(bioCoffee, producer, 100, 'France', 'maritime');
    expect(r.savedPercentage).toBeGreaterThan(0);
    expect(r.savedPercentage).toBeLessThan(15);
  });

  it('les sources et incertitudes sont exposées dans le résultat', () => {
    const r = calculateCarbonFootprint(bioCoffee, producer, 10, 'France', 'maritime');
    expect(r.production.source).toMatch(/±\d+%/);
    expect(r.transport.source).toContain('ADEME Base Carbone®');
    expect(r.factorSources.join(' ')).toContain('Agribalyse');
    expect(r.disclaimer).toContain('moyennes sectorielles');
  });
});

// ------------------------------------------------------------
// 3. Calcul eau (Water Footprint Network)
// ------------------------------------------------------------
describe('calculateWaterFootprint — Water Footprint Network', () => {
  const bioCoffee = { name: 'Café', certifications: ['Bio'] };
  const convCoffee = { name: 'Café' };

  it('café conventionnel 10 kg = 189 000 L (18 900 L/kg, Mekonnen & Hoekstra)', () => {
    const r = calculateWaterFootprint(convCoffee, {}, 10);
    expect(r.conventionalWater).toBe(189000);
    expect(r.methodology).toContain('Water Footprint');
  });

  it('décomposition verte/bleue/grise cohérente avec le WFN (café : 96/1/3)', () => {
    const r = calculateWaterFootprint(convCoffee, {}, 10);
    expect(r.breakdown.greenL).toBeCloseTo(189000 * 0.96, -2);
    expect(r.breakdown.blueL).toBeCloseTo(189000 * 0.01, -2);
  });

  it('le bio ne réduit QUE l\'eau grise (≈2% du total café), pas l\'eau de pluie', () => {
    const r = calculateWaterFootprint(bioCoffee, { certifications: ['Bio'] }, 10);
    // grise conv = 3% × 189 000 = 5 670 L ; réduction 60% → économie 3 402 L ≈ 1,8%
    expect(r.savedPercentage).toBeGreaterThan(0);
    expect(r.savedPercentage).toBeLessThan(5);
    expect(r.disclaimer).toContain('eau grise');
  });

  it('donnée producteur (L/kg) prime sur la moyenne WFN', () => {
    const withData = { name: 'Café', water_footprint_liters: 140 };
    const r = calculateWaterFootprint(withData, {}, 10);
    expect(r.bioWater).toBe(1400);
    expect(r.inputs.usesPrimaryData).toBe(true);
  });
});

// ------------------------------------------------------------
// 4. Cohérence de la méthodologie publiée
// ------------------------------------------------------------
describe('Méthodologie publiée', () => {
  it('les trois référentiels demandés sont cités', () => {
    expect(IMPACT_METHODOLOGY.carbon.standard).toContain('GHG Protocol');
    expect(IMPACT_METHODOLOGY.carbon.factorSources.join(' ')).toContain('ADEME Base Carbone®');
    expect(IMPACT_METHODOLOGY.water.standard).toContain('Water Footprint');
  });
  it('le périmètre (scope) est explicite', () => {
    expect(IMPACT_METHODOLOGY.carbon.scope).toContain('Cradle-to-customer');
  });
  it('facteur emballage plastique > carton recyclé (cohérence ADEME)', () => {
    expect(PACKAGING_FACTORS_SOURCED.plastic.value).toBeGreaterThan(PACKAGING_FACTORS_SOURCED.cardboard_recycled.value);
  });
});
