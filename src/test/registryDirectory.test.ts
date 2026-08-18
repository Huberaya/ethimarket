// @vitest-environment node
// =============================================================
// Tests : registres par pays, concordance label × pays, WhatsApp.
// =============================================================

import { describe, it, expect } from 'vitest';
import {
  resolveBusinessRegistry, resolveLabelRegistry, classifyLabel,
  buildWhatsAppLink, BUSINESS_REGISTRIES,
} from '../lib/registryDirectory';
import { buildExportRoadmap, groupStepsByStage, exportCategory } from '../lib/exportRoadmap';

describe('resolveBusinessRegistry — registre du commerce par pays', () => {
  it('pays OHADA → portail fédéré unique', () => {
    for (const c of ['Sénégal', 'Côte d\'Ivoire', 'Togo', 'Cameroun', 'Mali']) {
      const r = resolveBusinessRegistry(c);
      expect(r?.url).toBe('https://rccm.ohada.org');
    }
  });
  it('pays des producteurs actuels de la plateforme tous couverts', () => {
    for (const c of ['Éthiopie', 'Ghana', 'Maroc', 'Madagascar', 'Inde', 'Iran', 'Japon', 'Mexique', 'Pérou', 'Sri Lanka', 'France', 'Grèce']) {
      expect(resolveBusinessRegistry(c), c).not.toBeNull();
    }
  });
  it('variantes anglaises et accents gérés', () => {
    expect(resolveBusinessRegistry('Ethiopia')?.name).toContain('eTrade');
    expect(resolveBusinessRegistry('CHILE')?.name).toContain('Registro de Empresas');
    expect(resolveBusinessRegistry('perou')?.name).toContain('SUNARP');
  });
  it('pays inconnu → null (plan B affiché par l\'UI)', () => {
    expect(resolveBusinessRegistry('Atlantide')).toBeNull();
    expect(resolveBusinessRegistry(null)).toBeNull();
  });
  it('chaque entrée a une URL https et des instructions', () => {
    for (const [country, e] of Object.entries(BUSINESS_REGISTRIES)) {
      expect(e.url, country).toMatch(/^https?:\/\//);
      expect(e.notes.length, country).toBeGreaterThan(20);
    }
  });
});

describe('classifyLabel / resolveLabelRegistry — concordance label × pays', () => {
  it('classe les libellés courants', () => {
    expect(classifyLabel('Bio')).toBe('organic');
    expect(classifyLabel('Agriculture Biologique')).toBe('organic');
    expect(classifyLabel('USDA Organic')).toBe('organic');
    expect(classifyLabel('Fairtrade')).toBe('fairtrade');
    expect(classifyLabel('Max Havelaar')).toBe('fairtrade');
    expect(classifyLabel('Rainforest Alliance')).toBe('rainforest');
    expect(classifyLabel('GlobalGAP')).toBe('globalgap');
    expect(classifyLabel('GOTS')).toBe('gots');
    expect(classifyLabel('ISO 9001')).toBe('other');
  });

  it('LE cas du cahier des charges : bio + Chili → SAG Chili', () => {
    const r = resolveLabelRegistry('Bio', 'Chili');
    expect(r.family).toBe('organic');
    expect(r.national?.name).toContain('SAG');
    expect(r.global.length).toBeGreaterThan(0); // fallbacks mondiaux toujours là
  });

  it('bio + autres pays producteurs → autorité nationale quand elle existe', () => {
    expect(resolveLabelRegistry('Bio', 'Pérou').national?.name).toContain('SENASA');
    expect(resolveLabelRegistry('organic', 'India').national?.name).toContain('APEDA');
    expect(resolveLabelRegistry('Bio', 'Maroc').national?.name).toContain('ONSSA');
    expect(resolveLabelRegistry('Bio', 'France').national?.name).toContain('Agence Bio');
  });

  it('bio + pays sans autorité référencée → national null, fallbacks mondiaux présents', () => {
    const r = resolveLabelRegistry('Bio', 'Éthiopie');
    expect(r.national).toBeNull();
    expect(r.global.some(g => g.name.includes('Ecocert'))).toBe(true);
  });

  it('fairtrade → FLOCERT quel que soit le pays (registre mondial unique)', () => {
    for (const c of ['Chili', 'Ghana', 'Inde', null]) {
      const r = resolveLabelRegistry('Fairtrade', c);
      expect(r.global[0].name).toContain('FLOCERT');
    }
  });
});

describe('buildWhatsAppLink — chantier 3', () => {
  it('numéro international propre → lien wa.me', () => {
    expect(buildWhatsAppLink('+233 24 123 4567')).toBe('https://wa.me/233241234567');
    expect(buildWhatsAppLink('00251 91 123 4567')).toBe('https://wa.me/251911234567');
  });
  it('format national + pays connu → indicatif substitué', () => {
    expect(buildWhatsAppLink('024 123 4567', 'Ghana')).toBe('https://wa.me/233241234567');
    expect(buildWhatsAppLink('0612345678', 'Maroc')).toBe('https://wa.me/212612345678');
  });
  it('format national + pays inconnu → null (pas de lien faux)', () => {
    expect(buildWhatsAppLink('0612345678', 'Atlantide')).toBeNull();
  });
  it('message pré-rempli encodé', () => {
    const link = buildWhatsAppLink('+233241234567', null, 'Bonjour, audit EthiMarket');
    expect(link).toContain('?text=Bonjour%2C%20audit%20EthiMarket');
  });
  it('numéros inexploitables → null', () => {
    expect(buildWhatsAppLink('abc')).toBeNull();
    expect(buildWhatsAppLink('123')).toBeNull();
    expect(buildWhatsAppLink(null)).toBeNull();
  });
});

describe('buildExportRoadmap — chantiers 4 & 6', () => {
  it('café : phytosanitaire + EUDR + COI bio', () => {
    const r = buildExportRoadmap('café', true);
    expect(r.needsPhyto).toBe(true);
    expect(r.eudrConcerned).toBe(true);
    const titles = r.steps.map(s => s.title).join(' | ');
    expect(titles).toContain('phytosanitaire');
    expect(titles).toContain('EUDR');
    expect(titles).toContain('COI');
  });
  it('miel : certificat sanitaire animal + PCF, pas de phyto végétal', () => {
    const r = buildExportRoadmap('miel', true);
    expect(r.needsPhyto).toBe(false);
    expect(r.steps.some(s => s.title.includes('produit animal'))).toBe(true);
  });
  it('non-bio : pas d\'étape COI', () => {
    const r = buildExportRoadmap('café', false);
    expect(r.steps.some(s => s.title.includes('COI'))).toBe(false);
  });
  it('4 phases toujours présentes et ordonnées', () => {
    const grouped = groupStepsByStage(buildExportRoadmap('quinoa', true));
    expect(grouped.map(g => g.stage)).toEqual(['origin', 'transport', 'eu_border', 'delivery']);
    for (const g of grouped) expect(g.steps.length).toBeGreaterThan(0);
  });
  it('4 options logistiques avec transit et notes CO2 cohérentes ADEME', () => {
    const r = buildExportRoadmap('cacao', false);
    expect(r.logistics).toHaveLength(4);
    const air = r.logistics.find(l => l.mode === 'air')!;
    expect(air.co2Note).toContain('37');
    const sea = r.logistics.find(l => l.mode === 'sea_fcl')!;
    expect(sea.transitDays[0]).toBeGreaterThanOrEqual(15);
  });
  it('exportCategory mappe les libellés plateforme', () => {
    expect(exportCategory('Thé vert')).toBe('tea_leaves');
    expect(exportCategory('Épices — safran')).toBe('spices_raw');
    expect(exportCategory('savon artisanal')).toBe('processed');
  });
});
