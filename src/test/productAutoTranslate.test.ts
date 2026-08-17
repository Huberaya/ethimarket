// @vitest-environment node
// Tests de la traduction automatique des noms de produits
// (dictionnaire terminologique local, zéro API).

import { describe, it, expect } from 'vitest';
import { autoTranslateProductName, buildProductTranslations } from '../lib/i18n/productAutoTranslate';

describe('autoTranslateProductName', () => {
  it('traduit les termes connus, conserve les terroirs', () => {
    const en = autoTranslateProductName('Café Yirgacheffe Bio', 'en');
    expect(en.text).toBe('Coffee Yirgacheffe Organic');
    expect(en.coverage).toBeCloseTo(2 / 3, 2);
  });

  it('ignore les mots-outils français', () => {
    const en = autoTranslateProductName('Huile de Coco', 'en');
    expect(en.text).toBe('Oil Coconut');
    expect(en.coverage).toBe(1);
  });

  it('arabe : produit du texte arabe', () => {
    const ar = autoTranslateProductName('Miel de Thym', 'ar');
    expect(ar.text).toContain('عسل');
    expect(ar.text).toContain('زعتر');
    expect(ar.coverage).toBe(1);
  });

  it('espagnol et portugais', () => {
    expect(autoTranslateProductName('Quinoa Bio', 'es').text).toBe('Quinua Ecológico');
    expect(autoTranslateProductName('Vanille Premium', 'pt').text).toBe('Baunilha Premium');
  });

  it('nom inconnu → couverture 0, texte inchangé', () => {
    const en = autoTranslateProductName('Xylophone Quantique', 'en');
    expect(en.coverage).toBe(0);
    expect(en.text).toBe('Xylophone Quantique');
  });

  it('respecte la casse initiale des tokens', () => {
    expect(autoTranslateProductName('café bio', 'en').text).toBe('coffee organic');
    expect(autoTranslateProductName('Café Bio', 'en').text).toBe('Coffee Organic');
  });
});

describe('buildProductTranslations', () => {
  it('4 langues pour un nom bien couvert', () => {
    const tr = buildProductTranslations('Curcuma Moulu Bio');
    expect(Object.keys(tr).sort()).toEqual(['ar', 'en', 'es', 'pt']);
    expect(tr.en!.name).toBe('Turmeric Ground Organic');
  });

  it('couverture < 50% → aucune traduction (fallback fr propre)', () => {
    const tr = buildProductTranslations('Zorglub Machin Truc');
    expect(Object.keys(tr)).toHaveLength(0);
  });

  it('couverture partielle ≥ 50% → traduction conservée avec terroir', () => {
    const tr = buildProductTranslations('Safran de Khorasan');
    // safran connu, Khorasan conservé → 1/2 = 50%
    expect(tr.en?.name).toBe('Saffron Khorasan');
  });

  it('compatible avec le fallback dbLocalized (jamais de champ vide)', () => {
    const tr = buildProductTranslations('Thé Vert Sencha');
    for (const loc of Object.keys(tr) as Array<keyof typeof tr>) {
      expect(tr[loc]!.name.trim().length).toBeGreaterThan(0);
    }
  });
});
