// @vitest-environment node
// src/test/strictSearchPrecision.test.ts
import { describe, it, expect } from 'vitest';
import { Product } from '../lib/supabase';
import { executeIntelligentSearch, findSpellingCorrection } from '../lib/productSearchEngine';

// Realistic mock dataset representing diverse marketplace inventory
const MOCK_CATALOG: Product[] = [
  // 1. Cafés
  {
    id: 'prod-cafe-1',
    name: 'Café',
    slug: 'cafe-pur',
    description: 'Café pur origine Colombie torréfaction artisanale.',
    price: 15.00,
    country: 'Colombie',
    country_flag: '🇨🇴',
    emoji: '☕',
    product_type: 'café',
    certifications: ['Bio', 'Fairtrade']
  },
  {
    id: 'prod-cafe-2',
    name: 'Café Arabica',
    slug: 'cafe-arabica',
    description: 'Café Arabica d\'Éthiopie récolté en altitude.',
    price: 18.50,
    country: 'Éthiopie',
    country_flag: '🇪🇹',
    emoji: '☕',
    product_type: 'café',
    certifications: ['Bio']
  },
  {
    id: 'prod-cafe-3',
    name: 'Café Bio du Pérou',
    slug: 'cafe-bio-perou',
    description: 'Café bio équitable des hauts plateaux péruviens.',
    price: 22.00,
    country: 'Pérou',
    country_flag: '🇵🇪',
    emoji: '☕',
    product_type: 'café',
    certifications: ['Bio', 'Fairtrade']
  },

  // 2. Chocolats
  {
    id: 'prod-choco-1',
    name: 'Chocolat Noir 70% Bio',
    slug: 'chocolat-noir-70',
    description: 'Tablette de chocolat noir bio pur beurre de cacao.',
    price: 4.50,
    country: 'Équateur',
    country_flag: '🇪🇨',
    emoji: '🍫',
    product_type: 'chocolat',
    certifications: ['Bio', 'Fairtrade']
  },
  {
    id: 'prod-choco-2',
    name: 'Chocolat au Lait Équitable',
    slug: 'chocolat-lait',
    description: 'Tablette de chocolat au lait crémeux sans huile de palme.',
    price: 3.80,
    country: 'Ghana',
    country_flag: '🇬🇭',
    emoji: '🍫',
    product_type: 'chocolat',
    certifications: ['Fairtrade']
  },
  {
    id: 'prod-choco-3',
    name: 'Poudre de Cacao Brut',
    slug: 'cacao-brut',
    description: 'Poudre de cacao pur non sucrée pour pâtisserie.',
    price: 7.20,
    country: 'Pérou',
    country_flag: '🇵🇪',
    emoji: '🍫',
    product_type: 'cacao',
    certifications: ['Bio']
  },

  // 3. Textiles
  {
    id: 'prod-tshirt-1',
    name: 'T-shirt Coton Bio Homme',
    slug: 't-shirt-bio-homme',
    description: 'T-shirt col rond en coton biologique 180g pour homme.',
    price: 25.00,
    country: 'France',
    country_flag: '🇫🇷',
    emoji: '👕',
    product_type: 't-shirt',
    target_gender: 'homme',
    certifications: ['Bio', 'GOTS']
  },
  {
    id: 'prod-tshirt-2',
    name: 'T-shirt Coton Bio Femme',
    slug: 't-shirt-bio-femme',
    description: 'T-shirt cintré en coton biologique pour femme.',
    price: 25.00,
    country: 'France',
    country_flag: '🇫🇷',
    emoji: '👕',
    product_type: 't-shirt',
    target_gender: 'femme',
    certifications: ['Bio', 'GOTS']
  },
  {
    id: 'prod-tshirt-3',
    name: 'T-shirt Synthétique Homme',
    slug: 't-shirt-synthetique-homme',
    description: 'T-shirt sport en polyester recyclé.',
    price: 19.00,
    country: 'Portugal',
    country_flag: '🇵🇹',
    emoji: '👕',
    product_type: 't-shirt',
    target_gender: 'homme',
    certifications: []
  },
  {
    id: 'prod-pants-1',
    name: 'Pantalon Lin Bio Homme',
    slug: 'pantalon-lin-homme',
    description: 'Pantalon fluide en lin biologique pour homme.',
    price: 79.00,
    country: 'France',
    country_flag: '🇫🇷',
    emoji: '👖',
    product_type: 'pantalon',
    target_gender: 'homme',
    certifications: ['Bio']
  },

  // 4. Miels & Épicerie
  {
    id: 'prod-miel-1',
    name: 'Miel de Thym Bio',
    slug: 'miel-thym-bio',
    description: 'Miel de thym sauvage récolté en Grèce.',
    price: 14.00,
    country: 'Grèce',
    country_flag: '🇬🇷',
    emoji: '🍯',
    product_type: 'miel',
    certifications: ['Bio']
  },
  {
    id: 'prod-the-1',
    name: 'Thé Vert Sencha Bio',
    slug: 'the-vert-sencha',
    description: 'Thé vert japonais récolté au printemps.',
    price: 12.00,
    country: 'Japon',
    country_flag: '🇯🇵',
    emoji: '🍵',
    product_type: 'thé',
    certifications: ['Bio']
  },
  {
    id: 'prod-huile-1',
    name: 'Huile d\'Argan Pure Bio',
    slug: 'huile-argan-bio',
    description: 'Huile cosmétique et alimentaire 100% pure.',
    price: 28.00,
    country: 'Maroc',
    country_flag: '🇲🇦',
    emoji: '🫒',
    product_type: 'huile',
    certifications: ['Bio', 'Fairtrade']
  }
];

describe('Strict Search Precision Engine (Validation Tests)', () => {
  // TEST 1: Recherche "café"
  it('Test 1: Recherche "café" - Renvoie les cafés par priorité stricte et AUCUN autre produit', async () => {
    const res = await executeIntelligentSearch('café', {}, MOCK_CATALOG);

    // Only coffee products should be returned
    expect(res.results.length).toBe(3);

    // Exact match "Café" comes first
    expect(res.results[0].name).toBe('Café');
    expect(res.results[0].searchScore).toBeGreaterThanOrEqual(1000);

    // Prefix/Starts with match "Café Arabica" comes next
    expect(res.results[1].name).toBe('Café Arabica');

    // "Café Bio du Pérou" follows
    expect(res.results[2].name).toBe('Café Bio du Pérou');

    // STRICT ZERO-NOISE: No tea, chocolate, honey, oil, etc.
    const names = res.results.map(r => r.name);
    expect(names).not.toContain('Thé Vert Sencha Bio');
    expect(names).not.toContain('Chocolat Noir 70% Bio');
    expect(names).not.toContain('Miel de Thym Bio');
    expect(names).not.toContain('Huile d\'Argan Pure Bio');
  });

  // TEST 2: Recherche "chocolat noir"
  it('Test 2: Recherche "chocolat noir" - Uniquement les chocolats noirs, aucun chocolat au lait', async () => {
    const res = await executeIntelligentSearch('chocolat noir', {}, MOCK_CATALOG);

    expect(res.results.length).toBe(1);
    expect(res.results[0].name).toBe('Chocolat Noir 70% Bio');

    const names = res.results.map(r => r.name);
    expect(names).not.toContain('Chocolat au Lait Équitable');
    expect(names).not.toContain('Poudre de Cacao Brut');
  });

  // TEST 3: Recherche "t-shirt bio homme"
  it('Test 3: Recherche "t-shirt bio homme" - Uniquement le t-shirt bio pour homme', async () => {
    const res = await executeIntelligentSearch('t-shirt bio homme', {}, MOCK_CATALOG);

    expect(res.results.length).toBe(1);
    expect(res.results[0].name).toBe('T-shirt Coton Bio Homme');

    const names = res.results.map(r => r.name);
    expect(names).not.toContain('T-shirt Coton Bio Femme');
    expect(names).not.toContain('T-shirt Synthétique Homme');
    expect(names).not.toContain('Pantalon Lin Bio Homme');
  });

  // TEST 4: Recherche "cafee" (Faute d'orthographe)
  it('Test 4: Recherche "cafee" (faute) - Propose la suggestion "café" et trouve les produits pertinents', async () => {
    const suggestion = findSpellingCorrection('cafee', MOCK_CATALOG.map(p => p.name));
    expect(suggestion).toBe('café');

    const res = await executeIntelligentSearch('cafee', {}, MOCK_CATALOG);
    expect(res.didYouMean).toBe('café');
  });

  // TEST 5: Recherche "xyzabc" (Aucun résultat)
  it('Test 5: Recherche "xyzabc" - Renvoie 0 résultat et des suggestions d\'alternatives', async () => {
    const res = await executeIntelligentSearch('xyzabc', {}, MOCK_CATALOG);

    expect(res.results.length).toBe(0);
    expect(res.totalCount).toBe(0);
    expect(res.suggestedAlternatives).toBeDefined();
    expect(res.suggestedAlternatives!.length).toBeGreaterThan(0);
  });

  // TEST 6: Performance < 500ms
  it('Test 6: Performance - Chaque recherche s\'exécute en moins de 500ms', async () => {
    const start = performance.now();
    const res = await executeIntelligentSearch('Café Arabica', {}, MOCK_CATALOG);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(500);
    expect(res.executionTimeMs).toBeLessThan(500);
  });
});
