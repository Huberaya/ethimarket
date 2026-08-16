// @vitest-environment node
import { it, expect } from 'vitest';
import { parseNaturalLanguageQuery, parseNaturalLanguageQueryWithFallback } from '../lib/naturalLanguageSearchService';
import { parsedQueryToFilters } from '../lib/productSearchEngine';

it('repro: "je cherche du café bio"', async () => {
  const p = await parseNaturalLanguageQueryWithFallback('je cherche du café bio');
  console.log('productType:', p.productType, '| canonical:', p.productTypeCanonical);
  console.log('certifications:', p.certifications);
  console.log('residualKeywords:', p.residualKeywords);
  const f = parsedQueryToFilters(p);
  console.log('filters.query envoyé à la RPC:', JSON.stringify(f.query));
  console.log('filters.product_types:', f.product_types);
  expect(true).toBe(true);
});
