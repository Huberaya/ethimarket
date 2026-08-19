// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  recommendedAnalyses, resolveLabs, canTransitionAnalysis,
  coaVerificationSteps, ANALYSIS_FOR_HAZARD, ACCREDITATION_BODIES,
  GLOBAL_LAB_NETWORKS, ANALYSIS_STATUS_META,
} from '../lib/labDirectory';
import { explainAnalysisError } from '../lib/lotAnalyses';
import type { EuHazard } from '../lib/euRiskList';

describe('labDirectory — recommandations d\'analyses', () => {
  it('sésame Éthiopie (annexe I salmonelles) → analyse Salmonella conseillée', () => {
    const r = recommendedAnalyses('sésame', 'Sésame blanc', 'Éthiopie');
    expect(r.length).toBeGreaterThan(0);
    expect(r.some(a => /Salmonella/i.test(a.label))).toBe(true);
    // annexe I = conseillé, pas obligatoire
    expect(r.find(a => /Salmonella/i.test(a.label))?.mandatory).toBe(false);
  });

  it('sésame Inde (annexe II) → analyse OBLIGATOIRE', () => {
    const r = recommendedAnalyses('sésame', 'Graines de sésame', 'Inde');
    expect(r.some(a => a.mandatory)).toBe(true);
  });

  it('arachide Ghana → aflatoxines', () => {
    const r = recommendedAnalyses('arachide', 'Arachides grillées', 'Ghana');
    expect(r.some(a => /aflatoxines/i.test(a.label))).toBe(true);
  });

  it('filière standard non bio → aucune analyse', () => {
    expect(recommendedAnalyses('miel', 'Miel de Thym', 'Grèce')).toHaveLength(0);
  });

  it('filière standard MAIS bio → multi-résidus conseillé (jamais obligatoire)', () => {
    const r = recommendedAnalyses('miel', 'Miel de Thym', 'Grèce', true);
    expect(r).toHaveLength(1);
    expect(r[0].label).toMatch(/pesticides/i);
    expect(r[0].mandatory).toBe(false);
  });

  it('bio + filière pesticides déjà couverte → pas de doublon multi-résidus', () => {
    const r = recommendedAnalyses('cumin', 'Cumin', 'Inde', true);
    const pesticides = r.filter(a => /pesticides/i.test(a.label));
    expect(pesticides).toHaveLength(1);
  });

  it('dédoublonne les hazards multiples (Inde épices : plusieurs entrées pesticides)', () => {
    const r = recommendedAnalyses('épices', 'Poivre séché', 'Inde');
    const labels = r.map(a => a.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('chaque hazard UE a une analyse avec méthode et fourchette de prix cohérente', () => {
    (Object.keys(ANALYSIS_FOR_HAZARD) as EuHazard[]).forEach(h => {
      const a = ANALYSIS_FOR_HAZARD[h];
      expect(a.label.length).toBeGreaterThan(5);
      expect(a.method.length).toBeGreaterThan(2);
      expect(a.priceRange[0]).toBeGreaterThan(0);
      expect(a.priceRange[1]).toBeGreaterThan(a.priceRange[0]);
      expect(a.priceRange[1]).toBeLessThanOrEqual(400); // promesse « 100-400 € »
    });
  });
});

describe('labDirectory — labos et accréditation', () => {
  it('4 réseaux mondiaux avec annuaires', () => {
    expect(GLOBAL_LAB_NETWORKS).toHaveLength(4);
    GLOBAL_LAB_NETWORKS.forEach(n => expect(n.directoryUrl).toMatch(/^https:\/\//));
  });

  it('pays couvert (Inde) → organisme national NABL', () => {
    const r = resolveLabs('Inde');
    expect(r.nationalBodyKnown).toBe(true);
    expect(r.accreditation.name).toMatch(/NABL/);
  });

  it('alias anglais (Ethiopia) → EAS via normalizeCountry', () => {
    const r = resolveLabs('Ethiopia');
    expect(r.nationalBodyKnown).toBe(true);
    expect(r.accreditation.name).toMatch(/EAS/);
  });

  it('pays inconnu → fallback recherche ILAC', () => {
    const r = resolveLabs('Atlantide');
    expect(r.nationalBodyKnown).toBe(false);
    expect(r.accreditation.url).toMatch(/ilac\.org/);
  });

  it('toutes les URLs d\'accréditation sont en https', () => {
    Object.values(ACCREDITATION_BODIES).forEach(b => expect(b.url).toMatch(/^https:\/\//));
  });
});

describe('labDirectory — transitions du circuit d\'analyse', () => {
  it('avancée pas à pas autorisée', () => {
    expect(canTransitionAnalysis('requested', 'sample_sent', false)).toBe(true);
    expect(canTransitionAnalysis('sample_sent', 'report_received', false)).toBe(true);
  });

  it('saut d\'étape interdit', () => {
    expect(canTransitionAnalysis('requested', 'report_received', false)).toBe(false);
    expect(canTransitionAnalysis('requested', 'verified', true)).toBe(false);
  });

  it('verdict réservé à l\'admin, rapport en main', () => {
    expect(canTransitionAnalysis('report_received', 'verified', true)).toBe(true);
    expect(canTransitionAnalysis('report_received', 'rejected', true)).toBe(true);
    expect(canTransitionAnalysis('report_received', 'verified', false)).toBe(false);
    expect(canTransitionAnalysis('sample_sent', 'verified', true)).toBe(false);
  });

  it('états finaux immuables', () => {
    expect(canTransitionAnalysis('verified', 'rejected', true)).toBe(false);
    expect(canTransitionAnalysis('rejected', 'requested', true)).toBe(false);
  });

  it('retour en arrière interdit', () => {
    expect(canTransitionAnalysis('report_received', 'sample_sent', true)).toBe(false);
    expect(canTransitionAnalysis('sample_sent', 'requested', false)).toBe(false);
  });

  it('chaque statut a des métadonnées d\'affichage', () => {
    (['requested', 'sample_sent', 'report_received', 'verified', 'rejected'] as const)
      .forEach(s => {
        expect(ANALYSIS_STATUS_META[s].labelFr.length).toBeGreaterThan(3);
        expect(ANALYSIS_STATUS_META[s].cls).toMatch(/bg-/);
      });
  });
});

describe('labDirectory — étapes de vérification COA', () => {
  it('4 étapes, avec le registre du bon pays', () => {
    const steps = coaVerificationSteps('Eurofins Inde', 'Inde', 'RPT-2026-889');
    expect(steps).toHaveLength(4);
    expect(steps[0]).toMatch(/NABL/);
    expect(steps[1]).toMatch(/RPT-2026-889/);
    expect(steps[1]).toMatch(/jamais les coordonnées imprimées/i);
  });

  it('labo/rapport manquants → placeholders lisibles', () => {
    const steps = coaVerificationSteps(null, null, null);
    expect(steps[1]).toMatch(/le laboratoire émetteur/);
    expect(steps[1]).toMatch(/\(à renseigner\)/);
  });

  it('mentionne les limites réglementaires UE', () => {
    const steps = coaVerificationSteps('SGS', 'Ghana', 'X');
    expect(steps[3]).toMatch(/396\/2005/);
    expect(steps[3]).toMatch(/2023\/915/);
  });
});

describe('lotAnalyses — traduction des erreurs SQL', () => {
  it('traduit chaque code du garde en message pédagogique', () => {
    expect(explainAnalysisError('ANALYSIS_FINAL_STATE')).toMatch(/déjà jugée/);
    expect(explainAnalysisError('ANALYSIS_VERDICT_ADMIN_ONLY')).toMatch(/équipe EthiMarket/);
    expect(explainAnalysisError('ANALYSIS_REPORT_REQUIRED_FIRST')).toMatch(/rapport/);
    expect(explainAnalysisError('ANALYSIS_NOTE_TOO_SHORT')).toMatch(/10 caractères/);
    expect(explainAnalysisError('ANALYSIS_REPORT_REF_REQUIRED')).toMatch(/n° de rapport/);
    expect(explainAnalysisError('ANALYSIS_ILLEGAL_TRANSITION:requested->verified')).toMatch(/circuit/);
  });

  it('erreur inconnue → renvoyée telle quelle', () => {
    expect(explainAnalysisError('duplicate key')).toBe('duplicate key');
  });
});

describe('lotAnalyses — annuaire des laboratoires (tri)', () => {
  it('les labos contre-vérifiés passent avant pending puis caution', async () => {
    // tri pur répliqué depuis getDirectoryLabs (rank verified<pending<caution)
    const rank = { verified: 0, pending: 1, caution: 2, blacklisted: 3 } as const;
    const labs = [
      { name: 'B Lab', trust_level: 'pending' as const },
      { name: 'C Lab', trust_level: 'caution' as const },
      { name: 'A Lab', trust_level: 'verified' as const },
      { name: 'D Lab', trust_level: 'verified' as const },
    ];
    const sorted = labs.sort((a, b) => rank[a.trust_level] - rank[b.trust_level] || a.name.localeCompare(b.name));
    expect(sorted.map(l => l.name)).toEqual(['A Lab', 'D Lab', 'B Lab', 'C Lab']);
  });
});
