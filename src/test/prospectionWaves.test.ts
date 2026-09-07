// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  normalizeCity, getWaves, isInWave, waveOf, waveStats, distinctCities,
  type ProspectLite,
} from '../lib/prospectionWaves';

const mk = (over: Partial<ProspectLite>): ProspectLite => ({
  kind: 'buyer', phase: 1, city: null, country: 'France', status: 'a_contacter', ...over,
});

describe('normalizeCity', () => {
  it('extrait la métropole d\u2019un champ libre avec adresse', () => {
    expect(normalizeCity('Nantes (2 r. Sylvain Paris)')).toBe('Nantes & agglo');
    expect(normalizeCity('Rennes (18 r. Papu)')).toBe('Rennes');
    expect(normalizeCity('Lorient (1 r. Louis Faidherbe)')).toBe('Lorient');
  });

  it('regroupe l\u2019agglomération nantaise', () => {
    for (const c of ['Rezé (147 rte des Sorinières)', 'Orvault (10 pl. Jeanne d\u2019Arc) + Île de Nantes', 'Saint-Herblain (Beauséjour)', 'Carquefou', 'Vigneux-de-Bretagne (agglo Nantes)', 'Nantes/Orvault']) {
      expect(normalizeCity(c), c).toBe('Nantes & agglo');
    }
  });

  it('gère null et vide', () => {
    expect(normalizeCity(null)).toBe('Non renseignée');
    expect(normalizeCity('  ')).toBe('Non renseignée');
  });

  it('normalise les arrondissements parisiens/marseillais/lyonnais', () => {
    expect(normalizeCity('Paris 19e (14 bis r. Lally Tollendal)')).toBe('Paris');
    expect(normalizeCity('Marseille 13e (6 bd Alphonse Moutte)')).toBe('Marseille');
    expect(normalizeCity('Lyon 8e (13 bd Edmond Michelet)')).toBe('Lyon');
  });

  it('rattache Epron à Caen', () => {
    expect(normalizeCity('Epron (2 r. Hubertine Auclert)')).toBe('Caen');
  });
});

describe('getWaves — structure', () => {
  it('chaque pipeline × phase a des vagues, terminées par un fourre-tout', () => {
    for (const kind of ['buyer', 'producer'] as const) {
      for (const phase of [1, 2, 3]) {
        const waves = getWaves(kind, phase);
        expect(waves.length, `${kind} p${phase}`).toBeGreaterThanOrEqual(3);
        expect(waves[waves.length - 1].rest, `${kind} p${phase} rest`).toBe(true);
        for (const w of waves) {
          expect(w.week.length).toBeGreaterThan(0);
          expect(w.rationale.length).toBeGreaterThan(20);
        }
      }
    }
  });

  it('phase 1 acheteurs : Nantes en semaine 1, Rennes en semaine 2', () => {
    const waves = getWaves('buyer', 1);
    expect(waves[0].label).toBe('Nantes & agglo');
    expect(waves[0].week).toBe('Semaine 1');
    expect(waves[1].label).toBe('Rennes');
  });

  it('phase 1 producteurs : Éthiopie d\u2019abord (filière n°1)', () => {
    expect(getWaves('producer', 1)[0].label).toContain('Éthiopie');
  });
});

describe('affectation aux vagues', () => {
  const waves = getWaves('buyer', 1);

  it('un torréfacteur nantais est en semaine 1', () => {
    const p = mk({ city: 'Nantes (2 r. Sylvain Paris)' });
    expect(waveOf(p, waves)?.label).toBe('Nantes & agglo');
  });

  it('Rezé compte comme Nantes & agglo', () => {
    expect(waveOf(mk({ city: 'Rezé (147 rte des Sorinières)' }), waves)?.label).toBe('Nantes & agglo');
  });

  it('Lorient et Vannes tombent en Bretagne Sud (semaine 3)', () => {
    expect(waveOf(mk({ city: 'Lorient (12 r. de Liège)' }), waves)?.label).toBe('Bretagne Sud');
    expect(waveOf(mk({ city: 'Vannes (15 pl. de la République)' }), waves)?.label).toBe('Bretagne Sud');
  });

  it('une cible hors vagues tombe dans le fourre-tout', () => {
    const p = mk({ city: 'Bozouls (12, ZA Les Calsades)' });
    expect(waveOf(p, waves)?.rest).toBe(true);
  });

  it('producteurs : le pays affecte la vague (Éthiopie/Maroc/Madagascar)', () => {
    const pw = getWaves('producer', 1);
    expect(waveOf(mk({ kind: 'producer', country: 'Éthiopie', city: 'Addis-Abeba (Akaki Kaliti)' }), pw)?.label).toContain('Éthiopie');
    expect(waveOf(mk({ kind: 'producer', country: 'Maroc', city: 'Taliouine (RN10)' }), pw)?.label).toContain('Maroc');
    expect(waveOf(mk({ kind: 'producer', country: 'Madagascar', city: 'Sambava Centre' }), pw)?.label).toContain('Madagascar');
  });

  it('phase 2 acheteurs : la Belgique matche par pays même sans ville connue', () => {
    const w2 = getWaves('buyer', 2);
    expect(waveOf(mk({ phase: 2, country: 'Belgique', city: null }), w2)?.label).toContain('Belgique');
  });

  it('phase 1 : Brest/Tours/Caen en semaines 5-6 (incl. Epron→Caen)', () => {
    expect(waveOf(mk({ city: 'Brest (88 r. Jean Jaurès)' }), waves)?.label).toContain('Brest');
    expect(waveOf(mk({ city: 'Epron (2 r. Hubertine Auclert)' }), waves)?.label).toContain('Caen');
  });

  it('phase 2 : Paris 19e tombe dans Bordeaux & Paris, Lyon 8e dans le Sud, Lille dans Nord & Est', () => {
    const w2 = getWaves('buyer', 2);
    expect(waveOf(mk({ phase: 2, city: 'Paris 19e (r. Lally Tollendal)' }), w2)?.label).toBe('Bordeaux & Paris');
    expect(waveOf(mk({ phase: 2, city: 'Lyon 8e (13 bd Edmond Michelet)' }), w2)?.label).toContain('Lyon');
    expect(waveOf(mk({ phase: 2, city: 'Lille (3-5 pl. Général de Gaulle)' }), w2)?.label).toContain('Nord & Est');
  });

  it('isInWave : le fourre-tout matche tout mais waveOf le met en dernier', () => {
    const rest = waves.find(w => w.rest)!;
    expect(isInWave(mk({ city: 'Nantes' }), rest)).toBe(true);
    expect(waveOf(mk({ city: 'Nantes' }), waves)?.rest).toBeFalsy();
  });
});

describe('waveStats & distinctCities', () => {
  it('compte total/contactées/converties par vague', () => {
    const waves = getWaves('buyer', 1);
    const prospects = [
      mk({ city: 'Nantes', status: 'a_contacter' }),
      mk({ city: 'Nantes (Beaujoire)', status: 'contacte' }),
      mk({ city: 'Rezé', status: 'inscrit' }),
      mk({ city: 'Rennes (18 r. Papu)', status: 'a_contacter' }),
    ];
    const stats = waveStats(prospects, waves);
    const nantes = stats.find(s => s.wave.label === 'Nantes & agglo')!;
    expect(nantes.total).toBe(3);
    expect(nantes.contacted).toBe(2);
    expect(nantes.converted).toBe(1);
    expect(stats.find(s => s.wave.label === 'Rennes')!.total).toBe(1);
  });

  it('distinctCities normalise et trie', () => {
    const cities = distinctCities([
      mk({ city: 'Nantes (x)' }), mk({ city: 'Rezé' }), mk({ city: 'Angers (y)' }), mk({ city: null }),
    ]);
    expect(cities).toEqual(['Angers', 'Nantes & agglo', 'Non renseignée']);
  });
});
