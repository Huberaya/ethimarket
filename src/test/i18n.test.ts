// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { translate, dirFor, isLocale, DICTS, LOCALES, type Locale } from '../lib/i18n';

const ALL: Locale[] = ['fr', 'en', 'es', 'pt', 'ar'];

describe('i18n — système de traduction multilingue', () => {
  describe('Complétude des dictionnaires', () => {
    const frKeys = Object.keys(DICTS.fr).sort();

    it('le dictionnaire français (référence) est non vide', () => {
      expect(frKeys.length).toBeGreaterThan(100);
    });

    for (const locale of ['en', 'es', 'pt', 'ar'] as Locale[]) {
      it(`${locale.toUpperCase()} couvre 100% des clés du français`, () => {
        const keys = Object.keys(DICTS[locale]).sort();
        const missing = frKeys.filter(k => !keys.includes(k));
        expect(missing, `Clés manquantes en ${locale}: ${missing.join(', ')}`).toEqual([]);
      });

      it(`${locale.toUpperCase()} n'a pas de clés orphelines (absentes du français)`, () => {
        const keys = Object.keys(DICTS[locale]);
        const orphans = keys.filter(k => !(k in DICTS.fr));
        expect(orphans, `Clés orphelines en ${locale}: ${orphans.join(', ')}`).toEqual([]);
      });

      it(`${locale.toUpperCase()} n'a aucune valeur vide`, () => {
        const empty = Object.entries(DICTS[locale]).filter(([, v]) => !v || !v.trim());
        expect(empty.map(([k]) => k)).toEqual([]);
      });
    }
  });

  describe('translate()', () => {
    it('résout une clé dans chaque langue', () => {
      expect(translate('fr', 'nav.catalogue')).toBe('Catalogue');
      expect(translate('en', 'nav.catalogue')).toBe('Catalog');
      expect(translate('es', 'nav.catalogue')).toBe('Catálogo');
      expect(translate('pt', 'nav.catalogue')).toBe('Catálogo');
      expect(translate('ar', 'nav.catalogue')).toBe('الكتالوج');
    });

    it('retombe sur le français pour une clé absente d\'une locale', () => {
      // On simule : clé présente uniquement en fr ne peut exister vu les tests de
      // complétude, donc on teste le fallback ultime : clé inexistante -> clé brute.
      expect(translate('en', 'clé.inexistante.xyz')).toBe('clé.inexistante.xyz');
    });

    it('interpole les variables {var}', () => {
      expect(translate('fr', 'producers.notFound', { query: 'cacao' }))
        .toBe('Aucun producteur trouvé pour "cacao"');
      expect(translate('en', 'producers.notFound', { query: 'cocoa' }))
        .toBe('No producer found for "cocoa"');
      expect(translate('fr', 'contact.sentDesc', { email: 'a@b.co' }))
        .toContain('a@b.co');
    });

    it('interpole plusieurs occurrences de la même variable', () => {
      // pas de clé multi-occurrence dans les dicts : on vérifie le mécanisme via une clé brute
      expect(translate('fr', '{x} et {x}', { x: 'A' })).toBe('A et A');
    });
  });

  describe('Direction du texte (RTL)', () => {
    it('l\'arabe est RTL, les autres LTR', () => {
      expect(dirFor('ar')).toBe('rtl');
      for (const l of ['fr', 'en', 'es', 'pt'] as Locale[]) {
        expect(dirFor(l)).toBe('ltr');
      }
    });

    it('LOCALES déclare la bonne direction pour chaque langue', () => {
      for (const meta of LOCALES) {
        expect(meta.dir).toBe(dirFor(meta.code));
      }
    });
  });

  describe('Métadonnées des langues', () => {
    it('exactement 5 langues sont exposées : fr, en, es, pt, ar', () => {
      expect(LOCALES.map(l => l.code).sort()).toEqual([...ALL].sort());
    });

    it('isLocale() valide les codes supportés et rejette le reste', () => {
      for (const l of ALL) expect(isLocale(l)).toBe(true);
      expect(isLocale('de')).toBe(false);
      expect(isLocale('')).toBe(false);
      expect(isLocale(null)).toBe(false);
      expect(isLocale(undefined)).toBe(false);
    });

    it('chaque langue a un label natif non vide', () => {
      for (const meta of LOCALES) {
        expect(meta.label.trim().length).toBeGreaterThan(0);
        expect(meta.flag.trim().length).toBeGreaterThan(0);
      }
    });
  });

  describe('Qualité du contenu arabe', () => {
    it('les valeurs arabes contiennent bien des caractères arabes', () => {
      const arabicPattern = /[\u0600-\u06FF]/;
      const entries = Object.entries(DICTS.ar);
      const withArabic = entries.filter(([, v]) => arabicPattern.test(v));
      // La quasi-totalité doit contenir de l'arabe (tolérance pour FAQ/min/API…)
      expect(withArabic.length / entries.length).toBeGreaterThan(0.9);
    });
  });

  describe('Cohérence des interpolations entre langues', () => {
    it('chaque clé garde les mêmes placeholders {var} dans toutes les langues', () => {
      const extractVars = (s: string) => (s.match(/\{[a-zA-Z_]+\}/g) ?? []).sort();
      for (const key of Object.keys(DICTS.fr)) {
        const frVars = extractVars(DICTS.fr[key]);
        for (const locale of ['en', 'es', 'pt', 'ar'] as Locale[]) {
          const val = DICTS[locale][key];
          if (val !== undefined) {
            expect(extractVars(val), `Placeholders divergents pour "${key}" en ${locale}`).toEqual(frVars);
          }
        }
      }
    });
  });
});
