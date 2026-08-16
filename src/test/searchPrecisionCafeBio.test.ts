// @vitest-environment node
// =============================================================
// Anti-régression : bug de la capture d'écran du 16/08/2026.
// "je cherche du café bio" renvoyait TOUS les produits bio
// (huile de coco, quinoa, spiruline, cacao...) au lieu du café.
// Le type de produit détecté doit être un FILTRE DUR.
// =============================================================

import { describe, it, expect } from 'vitest';
import { parseNaturalLanguageQuery } from '../lib/naturalLanguageSearchService';
import { parsedQueryToFilters, passesStrictFilters, productMatchesType, executeClientSideSearch } from '../lib/productSearchEngine';
import type { Product } from '../lib/supabase';

// Catalogue reproduisant la capture d'écran
const P = (over: Partial<Product>): Product => ({
  id: Math.random().toString(36).slice(2),
  name: '', price: 0, certifications: [],
  ...over,
} as Product);

const catalog: Product[] = [
  P({ id: 'coco', name: 'Huile de Coco Bio', price: 8, country: 'Sri Lanka', certifications: ['Bio', 'Fairtrade'] }),
  P({ id: 'argan', name: "Huile d'Argan Bio", price: 28, country: 'Maroc', certifications: ['Bio', 'Fairtrade'] }),
  P({ id: 'cafe', name: 'Café Éthiopien Yirgacheffe', price: 18, country: 'Éthiopie', certifications: ['Bio', 'Rainforest Alliance'] }),
  P({ id: 'quinoa', name: 'Quinoa Bio', price: 6, country: 'Pérou', certifications: ['Bio', 'Fairtrade'] }),
  P({ id: 'spiruline', name: 'Spiruline Bio', price: 35, country: 'France', certifications: ['Bio', 'Ecocert'] }),
  P({ id: 'cacao', name: 'Cacao Brut', price: 12, country: 'Ghana', certifications: ['Bio', 'Fairtrade'] }),
];

describe('Bug capture d\'écran — "je cherche du café bio"', () => {
  const parsed = parseNaturalLanguageQuery('je cherche du café bio');
  const filters = parsedQueryToFilters(parsed);

  it('le parser détecte le type café ET la certification Bio', () => {
    expect(parsed.productTypeCanonical).toBe('café');
    expect(parsed.certifications).toContain('Bio');
  });

  it('les filtres transmettent le type comme filtre dur', () => {
    expect(filters.product_types).toEqual(['café']);
  });

  it('la query envoyée à la RPC n\'est plus un mot vide ("je")', () => {
    expect(filters.query).toContain('café');
    expect(filters.query).not.toBe('je');
  });

  it('SEUL le café passe les filtres stricts', () => {
    const passing = catalog.filter(p => passesStrictFilters(p, filters)).map(p => p.id);
    expect(passing).toEqual(['cafe']);
  });

  it('le moteur client complet renvoie uniquement le café', () => {
    const results = executeClientSideSearch(catalog, filters);
    expect(results.map(r => r.product.id)).toEqual(['cafe']);
  });
});

describe('productMatchesType — synonymes', () => {
  it('café matche coffee/espresso via dictionnaire', () => {
    expect(productMatchesType(P({ name: 'Premium Coffee Beans' }), 'café')).toBe(true);
    expect(productMatchesType(P({ name: 'Espresso Grand Cru' }), 'café')).toBe(true);
    expect(productMatchesType(P({ name: 'Huile de Coco Bio' }), 'café')).toBe(false);
    expect(productMatchesType(P({ name: 'Quinoa Bio' }), 'café')).toBe(false);
  });
  it('cacao ne matche PAS café (mais matche chocolat)', () => {
    expect(productMatchesType(P({ name: 'Cacao Brut' }), 'café')).toBe(false);
    expect(productMatchesType(P({ name: 'Cacao Brut' }), 'chocolat')).toBe(true);
  });
});

describe('Autres requêtes types de la même famille', () => {
  it('"miel bio de France" → uniquement les miels', () => {
    const parsed = parseNaturalLanguageQuery('miel bio de France');
    const filters = parsedQueryToFilters(parsed);
    const cat = [
      ...catalog,
      P({ id: 'miel', name: 'Miel de Lavande Bio', price: 9, country: 'France', certifications: ['Bio'] }),
    ];
    const results = executeClientSideSearch(cat, filters);
    expect(results.map(r => r.product.id)).toEqual(['miel']);
  });

  it('"produits bio" sans type précis → tous les produits bio (comportement inchangé)', () => {
    const parsed = parseNaturalLanguageQuery('produits bio');
    const filters = parsedQueryToFilters(parsed);
    const results = executeClientSideSearch(catalog, filters);
    expect(results.length).toBe(6); // tous certifiés Bio
  });

  it('"café bio moins de 20 euros" → café ET prix', () => {
    const parsed = parseNaturalLanguageQuery('café bio moins de 20 euros');
    const filters = parsedQueryToFilters(parsed);
    const results = executeClientSideSearch(catalog, filters);
    expect(results.map(r => r.product.id)).toEqual(['cafe']); // 18 € ≤ 20 €
  });
});
