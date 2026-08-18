// @vitest-environment node
// =============================================================
// Tests : Product Trust Pipeline Phase 1
//  - table de risque UE (annexes 2019/1793, rédaction 2026/1206)
//  - moteur de conformité produit (couche 1)
//  - dossier documentaire par lot + réception (couche 3)
// =============================================================

import { describe, it, expect } from 'vitest';
import {
  assessEuRisk, isEudrProduct, EU_RISK_ENTRIES, HAZARD_LABEL_FR,
  RISK_LEVEL_META, EU_RISK_LIST_REVISION,
} from '../lib/euRiskList';
import {
  requiredComplianceKeys, recommendedComplianceKeys,
  buildComplianceDossier, parseComplianceError, isDraftFilled,
  isItemSatisfied, COMPLIANCE_META, type ComplianceItem,
} from '../lib/productCompliance';
import {
  isDossierComplete, dossierProgress, parseLotDossierError,
  isReceptionClean, LOT_DOC_META, LOT_DOC_ORDER,
} from '../lib/lotDossier';

// -------------------- Couche 2 : risque UE --------------------

describe('assessEuRisk — réplication locale des annexes 2019/1793', () => {
  it('sésame éthiopien → contrôles renforcés (annexe I, salmonelles, 50 %)', () => {
    const r = assessEuRisk('Graines de sésame', 'Sésame blanc Humera', 'Éthiopie');
    expect(r.level).toBe('reinforced');
    expect(r.matches.some(m => m.hazard === 'salmonella')).toBe(true);
    expect(r.maxCheckFrequency).toBe(50);
  });

  it('arachides du Ghana → annexe I aflatoxines 50 %', () => {
    const r = assessEuRisk('Arachides', 'Cacahuètes grillées', 'Ghana');
    expect(r.level).toBe('reinforced');
    expect(r.matches[0].hazard).toBe('aflatoxins');
  });

  it('sésame indien → conditions spéciales (annexe II)', () => {
    const r = assessEuRisk('Sésame', 'Graines de sésame bio', 'Inde');
    expect(r.level).toBe('special_conditions');
    expect(r.matches.some(m => m.annex === 'II')).toBe(true);
  });

  it('normalise les pays EN/sans accents (Ethiopia → Éthiopie)', () => {
    expect(assessEuRisk('sésame', null, 'Ethiopia').level).toBe('reinforced');
    expect(assessEuRisk('sésame', null, 'ethiopie').level).toBe('reinforced');
    expect(assessEuRisk('palm oil', 'Huile de palme brute', 'Ivory Coast').level).toBe('reinforced');
  });

  it('café du Ghana / cacao du Ghana → standard (non listés 2019/1793)', () => {
    expect(assessEuRisk('Cacao', 'Fèves de cacao', 'Ghana').level).toBe('standard');
    expect(assessEuRisk('Café vert', 'Yirgacheffe', 'Éthiopie').level).toBe('standard');
  });

  it('pays inconnu ou absent → standard, zéro match', () => {
    expect(assessEuRisk('sésame', null, null).level).toBe('standard');
    expect(assessEuRisk('sésame', null, 'France').matches).toHaveLength(0);
  });

  it('toutes les entrées sont valides (fréquence 1-100, libellés hazard couverts)', () => {
    for (const e of EU_RISK_ENTRIES) {
      expect(e.checkFrequency).toBeGreaterThan(0);
      expect(e.checkFrequency).toBeLessThanOrEqual(100);
      expect(HAZARD_LABEL_FR[e.hazard]).toBeTruthy();
      expect(['I', 'II']).toContain(e.annex);
    }
    expect(EU_RISK_LIST_REVISION.amendedBy).toContain('2026/1206');
  });

  it('méta de niveau de risque complète', () => {
    for (const lvl of ['standard', 'reinforced', 'special_conditions'] as const) {
      expect(RISK_LEVEL_META[lvl].labelFr).toBeTruthy();
    }
  });
});

describe('isEudrProduct — périmètre déforestation 2023/1115', () => {
  it('café et cacao concernés, sésame et miel non', () => {
    expect(isEudrProduct('Café vert')).toBe(true);
    expect(isEudrProduct('Cacao')).toBe(true);
    expect(isEudrProduct('Sésame')).toBe(false);
    expect(isEudrProduct('Miel')).toBe(false);
  });
});

// -------------------- Couche 1 : conformité produit --------------------

describe('requiredComplianceKeys — socle bloquant (miroir SQL)', () => {
  it('socle universel : 5 exigences', () => {
    const keys = requiredComplianceKeys({ product_type: 'Miel', name: 'Miel doré', country: 'Éthiopie', certifications: [] });
    expect(keys).toEqual(['hs_code', 'batch_dluo', 'technical_sheet', 'coa_recent', 'labeling_check']);
  });

  it('produit bio → + certificat bio', () => {
    const keys = requiredComplianceKeys({ product_type: 'Sésame', name: '', country: 'Éthiopie', certifications: ['Bio'] });
    expect(keys).toContain('organic_certificate');
  });

  it('café/cacao → + GPS parcelles (EUDR), même via le nom', () => {
    expect(requiredComplianceKeys({ product_type: 'Café vert', certifications: [] })).toContain('gps_parcels');
    expect(requiredComplianceKeys({ product_type: null, name: 'Fèves de cacao Ashanti', certifications: [] })).toContain('gps_parcels');
  });

  it('Ecocert compte comme bio (même regex que le SQL)', () => {
    expect(requiredComplianceKeys({ certifications: ['Ecocert'] })).toContain('organic_certificate');
    expect(requiredComplianceKeys({ certifications: ['Fairtrade'] })).not.toContain('organic_certificate');
  });
});

describe('recommendedComplianceKeys — non bloquant', () => {
  it('produit transformé → allergènes recommandés', () => {
    expect(recommendedComplianceKeys({ product_type: 'Beurre de karité', name: '' })).toContain('allergens');
    expect(recommendedComplianceKeys({ product_type: 'Café vert', name: '' })).toHaveLength(0);
  });
});

describe('buildComplianceDossier — état du dossier', () => {
  const cafe = { product_type: 'Café vert', name: 'Yirgacheffe', country: 'Éthiopie', certifications: ['Bio'] };
  const item = (key: string, status: string): ComplianceItem => ({
    requirement_key: key as ComplianceItem['requirement_key'],
    required: true,
    status: status as ComplianceItem['status'],
  });

  it('dossier vide → toutes les exigences manquantes, incomplete', () => {
    const d = buildComplianceDossier(cafe, []);
    expect(d.complete).toBe(false);
    expect(d.missing).toHaveLength(7); // 5 socle + bio + gps
  });

  it('provided ET verified satisfont ; rejected/missing non', () => {
    expect(isItemSatisfied(item('hs_code', 'provided'))).toBe(true);
    expect(isItemSatisfied(item('hs_code', 'verified'))).toBe(true);
    expect(isItemSatisfied(item('hs_code', 'rejected'))).toBe(false);
    expect(isItemSatisfied(item('hs_code', 'missing'))).toBe(false);
    expect(isItemSatisfied(undefined)).toBe(false);
  });

  it('dossier complet quand chaque exigence est provided/verified', () => {
    const items = ['hs_code', 'batch_dluo', 'technical_sheet', 'coa_recent', 'labeling_check', 'organic_certificate', 'gps_parcels']
      .map(k => item(k, 'provided'));
    const d = buildComplianceDossier(cafe, items);
    expect(d.complete).toBe(true);
    expect(d.missing).toHaveLength(0);
  });

  it('embarque l\'évaluation de risque UE', () => {
    const d = buildComplianceDossier({ product_type: 'Sésame', name: '', country: 'Éthiopie', certifications: [] }, []);
    expect(d.risk.level).toBe('reinforced');
  });
});

describe('parseComplianceError — décodage du verrou SQL', () => {
  it('extrait les clés manquantes', () => {
    expect(parseComplianceError('COMPLIANCE_INCOMPLETE:hs_code,coa_recent'))
      .toEqual(['hs_code', 'coa_recent']);
  });
  it('null pour les autres erreurs', () => {
    expect(parseComplianceError('duplicate key value')).toBeNull();
  });
});

describe('isDraftFilled — validation formulaire par type de saisie', () => {
  it('confirm exige la case cochée', () => {
    expect(isDraftFilled(COMPLIANCE_META.labeling_check, { key: 'labeling_check', confirmed: true })).toBe(true);
    expect(isDraftFilled(COMPLIANCE_META.labeling_check, { key: 'labeling_check', confirmed: false })).toBe(false);
  });
  it('file exige une URL, text un texte non vide', () => {
    expect(isDraftFilled(COMPLIANCE_META.technical_sheet, { key: 'technical_sheet', file_url: 'https://x/f.pdf' })).toBe(true);
    expect(isDraftFilled(COMPLIANCE_META.technical_sheet, { key: 'technical_sheet', value_text: 'zzz' })).toBe(false);
    expect(isDraftFilled(COMPLIANCE_META.hs_code, { key: 'hs_code', value_text: ' 090111 ' })).toBe(true);
    expect(isDraftFilled(COMPLIANCE_META.hs_code, { key: 'hs_code', value_text: '  ' })).toBe(false);
    expect(isDraftFilled(COMPLIANCE_META.hs_code, undefined)).toBe(false);
  });
});

// -------------------- Couche 3 : dossier de lot --------------------

describe('isDossierComplete / dossierProgress — paquet documentaire par lot', () => {
  const doc = (required: boolean, status: 'missing' | 'provided') => ({ required, status });

  it('complet ssi toutes les lignes required sont provided', () => {
    expect(isDossierComplete([doc(true, 'provided'), doc(true, 'provided')])).toBe(true);
    expect(isDossierComplete([doc(true, 'provided'), doc(true, 'missing')])).toBe(false);
  });

  it('les lignes non requises n\'entrent pas dans le verrou', () => {
    expect(isDossierComplete([doc(true, 'provided'), doc(false, 'missing')])).toBe(true);
  });

  it('paquet vide (commandes pré-migration) → complet, pas de blocage rétroactif', () => {
    expect(isDossierComplete([])).toBe(true);
  });

  it('progression correcte', () => {
    expect(dossierProgress([doc(true, 'provided'), doc(true, 'missing'), doc(false, 'missing')]))
      .toEqual({ done: 1, total: 2 });
  });
});

describe('parseLotDossierError — décodage du verrou d\'expédition', () => {
  it('extrait les clés manquantes', () => {
    expect(parseLotDossierError('erreur: LOT_DOSSIER_INCOMPLETE:coi_reference,coa_lot'))
      .toEqual(['coi_reference', 'coa_lot']);
  });
  it('null sinon', () => {
    expect(parseLotDossierError('Transition de commande invalide')).toBeNull();
  });
});

describe('métadonnées des documents de lot', () => {
  it('chaque clé a un libellé, une aide et figure dans l\'ordre d\'affichage', () => {
    for (const key of LOT_DOC_ORDER) {
      expect(LOT_DOC_META[key].label).toBeTruthy();
      expect(LOT_DOC_META[key].help.length).toBeGreaterThan(20);
    }
    expect(new Set(LOT_DOC_ORDER).size).toBe(6);
  });
});

describe('isReceptionClean — réception structurée', () => {
  it('conforme ssi les 4 contrôles passent', () => {
    expect(isReceptionClean({ quantity_ok: true, packaging_ok: true, aspect_ok: true, labeling_ok: true })).toBe(true);
    expect(isReceptionClean({ quantity_ok: true, packaging_ok: false, aspect_ok: true, labeling_ok: true })).toBe(false);
  });
});
