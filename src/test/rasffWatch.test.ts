// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  productKeywordsEn, rasffMatches, qualityScore,
  RASFF_COUNTRY_FR, QUALITY_GRADE_META, type QualityHistory,
} from '../lib/rasffWatch';

const H = (over: Partial<QualityHistory> = {}): QualityHistory => ({
  receptionsTotal: 0, receptionsClean: 0,
  incidentsConfirmed: 0, incidentsDismissed: 0,
  analysesVerified: 0, analysesRejected: 0, ...over,
});

describe('rasffWatch — mots-clés produit', () => {
  it('café → coffee', () => {
    expect(productKeywordsEn('café')).toContain('coffee');
  });
  it('insensible aux accents et à la casse', () => {
    expect(productKeywordsEn('CAFE')).toContain('coffee');
    expect(productKeywordsEn('Sésame')).toContain('sesame');
  });
  it('épices → large famille de mots-clés', () => {
    const kw = productKeywordsEn('épices');
    expect(kw).toContain('turmeric');
    expect(kw).toContain('pepper');
    expect(kw.length).toBeGreaterThan(10);
  });
  it('type inconnu → vide', () => {
    expect(productKeywordsEn('meubles')).toHaveLength(0);
    expect(productKeywordsEn(null)).toHaveLength(0);
  });
});

describe('rasffWatch — matching de notification', () => {
  const ourCountries = ['Inde', 'Éthiopie', 'Madagascar'];
  const ourTypes = ['épices', 'café', 'vanille'];

  it('curcuma indien avec pesticides → match', () => {
    const m = rasffMatches(
      { subject: 'Chlorpyrifos in turmeric powder from India', originCountries: ['India'] },
      ourCountries, ourTypes,
    );
    expect(m).toEqual({ country: 'Inde', keyword: 'turmeric' });
  });

  it('tomates belges → aucun match (pays hors filières)', () => {
    const m = rasffMatches(
      { subject: 'Flonicamid in fresh tomatoes from Belgium', originCountries: ['Belgium'] },
      ourCountries, ourTypes,
    );
    expect(m).toBeNull();
  });

  it('bon pays mais mauvais produit → aucun match', () => {
    const m = rasffMatches(
      { subject: 'Salmonella in chicken meat from India', originCountries: ['India'] },
      ourCountries, ourTypes,
    );
    expect(m).toBeNull();
  });

  it('Türkiye normalisé comme Turkey', () => {
    expect(RASFF_COUNTRY_FR['Türkiye']).toBe('Turquie');
    expect(RASFF_COUNTRY_FR['Turkey']).toBe('Turquie');
  });

  it('multi-origines : match si UNE origine est chez nous', () => {
    const m = rasffMatches(
      { subject: 'Aflatoxins in vanilla pods', originCountries: ['China', 'Madagascar'] },
      ourCountries, ourTypes,
    );
    expect(m?.country).toBe('Madagascar');
  });
});

describe('rasffWatch — score qualité dynamique', () => {
  it('aucun historique → pas de note (no_data, score null)', () => {
    const q = qualityScore(H());
    expect(q.score).toBeNull();
    expect(q.grade).toBe('no_data');
  });

  it('historique parfait → 100 excellent', () => {
    const q = qualityScore(H({ receptionsTotal: 5, receptionsClean: 5 }));
    expect(q.score).toBe(100);
    expect(q.grade).toBe('excellent');
  });

  it('COA vérifiés → bonus plafonné à +15 (score max 100)', () => {
    const q = qualityScore(H({ receptionsTotal: 2, receptionsClean: 2, analysesVerified: 10 }));
    expect(q.score).toBe(100); // 100 + 15 plafonné à 100
    expect(q.breakdown.some(l => l.includes('+ 15'))).toBe(true);
  });

  it('COA rejeté = −25 (plus grave qu\'un incident −15)', () => {
    expect(qualityScore(H({ analysesRejected: 1 })).score).toBe(75);
    expect(qualityScore(H({ incidentsConfirmed: 1 })).score).toBe(85);
  });

  it('incident classé sans suite → ne coûte rien', () => {
    const q = qualityScore(H({ incidentsDismissed: 3, receptionsTotal: 1, receptionsClean: 1 }));
    expect(q.score).toBe(100);
  });

  it('réceptions non conformes → pénalité proportionnelle', () => {
    // 2/4 non conformes = 50% × 30 = −15
    const q = qualityScore(H({ receptionsTotal: 4, receptionsClean: 2 }));
    expect(q.score).toBe(85);
    expect(q.grade).toBe('good');
  });

  it('cumul catastrophique → plancher 0, grade alert', () => {
    const q = qualityScore(H({ analysesRejected: 3, incidentsConfirmed: 4, receptionsTotal: 2, receptionsClean: 0 }));
    expect(q.score).toBe(0);
    expect(q.grade).toBe('alert');
  });

  it('seuils de grade : 90/70/50', () => {
    expect(qualityScore(H({ receptionsTotal: 10, receptionsClean: 9 })).grade).toBe('excellent'); // -3 → 97
    expect(qualityScore(H({ incidentsConfirmed: 2 })).grade).toBe('good');   // 70
    expect(qualityScore(H({ incidentsConfirmed: 3 })).grade).toBe('watch');  // 55
    expect(qualityScore(H({ incidentsConfirmed: 4 })).grade).toBe('alert');  // 40
  });

  it('le breakdown explique chaque ligne du calcul', () => {
    const q = qualityScore(H({ analysesRejected: 1, incidentsConfirmed: 1, receptionsTotal: 2, receptionsClean: 1, analysesVerified: 1 }));
    expect(q.breakdown[0]).toBe('Base : 100');
    expect(q.breakdown.some(l => l.includes('rejeté'))).toBe(true);
    expect(q.breakdown.some(l => l.includes('confirmé'))).toBe(true);
    expect(q.breakdown.some(l => l.includes('non conformes'))).toBe(true);
    expect(q.breakdown.some(l => l.includes('COA vérifié'))).toBe(true);
  });

  it('chaque grade a des métadonnées d\'affichage', () => {
    (['excellent', 'good', 'watch', 'alert', 'no_data'] as const).forEach(g => {
      expect(QUALITY_GRADE_META[g].labelFr.length).toBeGreaterThan(3);
      expect(QUALITY_GRADE_META[g].cls).toMatch(/bg-/);
    });
  });
});
