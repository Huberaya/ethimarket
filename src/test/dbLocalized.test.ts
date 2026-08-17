// @vitest-environment node
// =============================================================
// Tests de la localisation des contenus en base (dbLocalized.ts)
// + cohérence des fichiers de seed de traduction.
// =============================================================

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  dbLocalized,
  productName,
  productDescription,
  productShortDescription,
  categoryName,
  articleField,
  producerDescription,
} from '../lib/i18n/dbLocalized';

const SEED_DIR = join(__dirname, '../../supabase/seed/translations');
const load = (f: string) => JSON.parse(readFileSync(join(SEED_DIR, f), 'utf8'));

// ------------------------------------------------------------
// 1. Logique de fallback
// ------------------------------------------------------------
describe('dbLocalized — fallback locale → fr → vide', () => {
  const row = {
    name: 'Café Éthiopien',
    description: 'Description française',
    translations: {
      en: { name: 'Ethiopian Coffee' },
      ar: { name: 'قهوة إثيوبية', description: 'وصف عربي' },
    },
  };

  it('fr → colonne source directement', () => {
    expect(dbLocalized(row, 'name', 'fr')).toBe('Café Éthiopien');
  });

  it('en → traduction disponible', () => {
    expect(dbLocalized(row, 'name', 'en')).toBe('Ethiopian Coffee');
  });

  it('en description absente → fallback fr (jamais vide)', () => {
    expect(dbLocalized(row, 'description', 'en')).toBe('Description française');
  });

  it('es entièrement absent → fallback fr', () => {
    expect(dbLocalized(row, 'name', 'es')).toBe('Café Éthiopien');
  });

  it('ar complet → traduction arabe', () => {
    expect(dbLocalized(row, 'description', 'ar')).toBe('وصف عربي');
  });

  it('ligne null / champ inexistant → chaîne vide, pas de crash', () => {
    expect(dbLocalized(null, 'name', 'en')).toBe('');
    expect(dbLocalized(undefined, 'name', 'fr')).toBe('');
    expect(dbLocalized({ translations: null }, 'name', 'en')).toBe('');
  });

  it('translations vide ou malformé → fallback fr', () => {
    expect(dbLocalized({ name: 'X', translations: {} }, 'name', 'pt')).toBe('X');
    expect(dbLocalized({ name: 'X', translations: { pt: {} } }, 'name', 'pt')).toBe('X');
  });
});

// ------------------------------------------------------------
// 2. Helpers spécialisés
// ------------------------------------------------------------
describe('Helpers spécialisés', () => {
  const product = {
    name: 'Miel de Thym',
    description: 'Miel du mont Hymette.',
    short_description: '',
    translations: { en: { name: 'Thyme Honey', description: 'Honey from Mount Hymettus.' } },
  };

  it('productName / productDescription', () => {
    expect(productName(product, 'en')).toBe('Thyme Honey');
    expect(productDescription(product, 'en')).toBe('Honey from Mount Hymettus.');
    expect(productName(product, 'fr')).toBe('Miel de Thym');
  });

  it('short_description vide → fallback description localisée', () => {
    expect(productShortDescription(product, 'en')).toBe('Honey from Mount Hymettus.');
  });

  it('categoryName / articleField / producerDescription', () => {
    expect(categoryName({ name: 'Épices & Herbes', translations: { en: { name: 'Spices & Herbs' } } }, 'en')).toBe('Spices & Herbs');
    expect(articleField({ title: 'T', translations: { es: { title: 'Título' } } }, 'title', 'es')).toBe('Título');
    expect(producerDescription({ description: 'Coopérative', translations: {} }, 'pt')).toBe('Coopérative');
  });
});

// ------------------------------------------------------------
// 3. Cohérence des fichiers de seed
// ------------------------------------------------------------
describe('Seeds de traduction — parité 4 langues', () => {
  const LOCALES = ['en', 'es', 'pt', 'ar'] as const;

  it('products.json : chaque produit a les 4 langues, avec name', () => {
    const products = load('products.json');
    expect(Object.keys(products).length).toBe(13);
    for (const [slug, blob] of Object.entries<Record<string, Record<string, string>>>(products)) {
      for (const loc of LOCALES) {
        expect(blob[loc], `${slug}.${loc}`).toBeDefined();
        expect(blob[loc].name, `${slug}.${loc}.name`).toBeTruthy();
      }
    }
  });

  it('categories.json : 8 catégories × 4 langues', () => {
    const categories = load('categories.json');
    expect(Object.keys(categories).length).toBe(8);
    for (const blob of Object.values<Record<string, Record<string, string>>>(categories)) {
      for (const loc of LOCALES) expect(blob[loc]?.name).toBeTruthy();
    }
  });

  it('producers.json : 13 producteurs × 4 langues', () => {
    const producers = load('producers.json');
    expect(Object.keys(producers).length).toBe(13);
    for (const blob of Object.values<Record<string, Record<string, string>>>(producers)) {
      for (const loc of LOCALES) expect(blob[loc]?.description).toBeTruthy();
    }
  });

  it('articles.{lang}.json : 10 articles complets (title, excerpt, category, content) par langue', () => {
    for (const loc of LOCALES) {
      const articles = load(`articles.${loc}.json`);
      expect(Object.keys(articles).length, `articles.${loc}`).toBe(10);
      for (const [slug, fields] of Object.entries<Record<string, string>>(articles)) {
        expect(fields.title, `${loc}/${slug}.title`).toBeTruthy();
        expect(fields.excerpt, `${loc}/${slug}.excerpt`).toBeTruthy();
        expect(fields.category, `${loc}/${slug}.category`).toBeTruthy();
        expect(fields.content && fields.content.length > 300, `${loc}/${slug}.content`).toBe(true);
      }
    }
  });

  it('le contenu arabe contient bien des caractères arabes', () => {
    const articles = load('articles.ar.json');
    for (const fields of Object.values<Record<string, string>>(articles)) {
      expect(/[\u0600-\u06FF]/.test(fields.title)).toBe(true);
      expect(/[\u0600-\u06FF]/.test(fields.content)).toBe(true);
    }
  });

  it('les slugs des 4 fichiers articles sont identiques', () => {
    const ref = Object.keys(load('articles.en.json')).sort();
    for (const loc of ['es', 'pt', 'ar']) {
      expect(Object.keys(load(`articles.${loc}.json`)).sort()).toEqual(ref);
    }
  });
});
