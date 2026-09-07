// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { normName, normCity, dedupKey, crmKeySets, isInCrm } from '../lib/prospectDedup';

describe('normName / normCity', () => {
  it('retire accents, parenthèses et ponctuation', () => {
    expect(normName('Scopéli (supermarché coopératif de Nantes)')).toBe('scopeli');
    expect(normName("L'éléfàn (coopératif, Grenoble)")).toBe('l elefan');
    expect(normName('Les Torréfacteurs Normands (Rouen)')).toBe('les torrefacteurs normands');
    expect(normCity("Rezé (20 r. de l'Abbé Grégoire)")).toBe('reze');
    expect(normCity('Rennes (15 av. de Pologne, CC Ste-Élisabeth)')).toBe('rennes');
  });

  it('la clef tombe sur le nom seul quand la ville est absente', () => {
    expect(dedupKey('ANAPQUI', null)).toBe('anapqui');
    expect(dedupKey('ANAPQUI', 'Altiplano Sud')).toBe('anapqui|altiplano sud');
  });
});

describe('isInCrm — les cibles du pipeline ne réapparaissent pas dans le vivier', () => {
  const crm = [
    { name: 'Scopéli (supermarché coopératif de Nantes)', city: "Rezé (20 r. de l'Abbé Grégoire)" },
    { name: 'Les Torréfacteurs Normands (Rouen)', city: 'Rouen (21 pl. Saint-Marc)' },
    { name: 'Coopérative Marjana (argane, Essaouira)', city: 'Ounara, Essaouira (douar Aït Sraidi)' },
    { name: 'ANAPQUI (quinoa real, Bolivie — vague)', city: 'Altiplano Sud' },
    { name: 'Biocoop (centrale nationale)', city: 'Paris' },
    { name: 'Torréf. Promue', city: 'Caen', source: 'seed:x | promu:vivier | siren:123456789 | ext:FR-B2B-00042' },
  ];
  const sets = crmKeySets(crm);

  it('match malgré les différences de casse, accents et parenthèses', () => {
    expect(isInCrm({ name: 'Scopéli', city: 'Rezé' }, sets)).toBe(true);
    expect(isInCrm({ name: 'Les Torrefacteurs Normands', city: 'Rouen' }, sets)).toBe(true);
  });

  it('fiche vivier sans ville : match producteur sur le nom seul', () => {
    expect(isInCrm({ name: 'ANAPQUI', city: null }, sets)).toBe(true);
  });

  it('match par SIREN et external_id promus (notés dans source)', () => {
    expect(isInCrm({ name: 'Autre Nom', city: 'Ailleurs', siren: '123456789' }, sets)).toBe(true);
    expect(isInCrm({ name: 'Autre Nom', city: 'Ailleurs', external_id: 'FR-B2B-00042' }, sets)).toBe(true);
  });

  it('ne sur-filtre PAS : mêmes enseignes dans des villes différentes restent visibles', () => {
    // 13 magasins « Biocoop » parisiens ≠ « Biocoop (centrale nationale) » Paris :
    // même clef nom+ville → filtrés (assumé : la centrale couvre Paris),
    // mais Biocoop Agde/Lyon/etc. restent bien dans le vivier.
    expect(isInCrm({ name: 'Biocoop', city: 'Agde' }, sets)).toBe(false);
    expect(isInCrm({ name: 'Biocoop', city: 'Lyon' }, sets)).toBe(false);
    // nom différent, même ville → visible
    expect(isInCrm({ name: 'Avenir Bio Rennes', city: 'Rennes' }, sets)).toBe(false);
    // producteur homonyme partiel → visible (pas d'inclusion, égalité stricte seulement)
    expect(isInCrm({ name: 'ANAPQUI Trading Corp', city: null }, sets)).toBe(false);
  });
});
