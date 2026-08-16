// =============================================================
// EthiMarket Search V2 — Point d'entrée unique (100% GRATUIT)
//
// Aucune IA payante, aucune clé API, aucun appel réseau pour le
// parsing : le moteur intelligent est entièrement local
// (dictionnaires multilingues + règles + scoring pondéré).
//
// Usage :
//   import { intelligentSearchSync } from './lib/search';
//   const res = intelligentSearchSync(
//     "T-shirt coton bio homme, moins de 15 €, Europe",
//     catalogProducts,
//   );
//   res.results        → produits filtrés + classés + expliqués
//   res.alternatives   → si "alternative au fournisseur X..."
//   res.parsedQuery    → ce que le moteur a compris (chips UI)
// =============================================================

import { ProductV2, StructuredFiltersV2, SearchResponseV2 } from './types';
import { parseQueryZeroApi } from './zeroApiParser';
import { runSearch } from './searchEngine';
import { findAlternatives } from './alternativesEngine';

export * from './types';
export { parseQueryZeroApi, normalize } from './zeroApiParser';
export { runSearch, applyHardFilters, scoreProduct, haversineKm, diceSimilarity } from './searchEngine';
export { findAlternatives, resolveReference } from './alternativesEngine';

/**
 * Recherche intelligente complète, synchrone et 100% locale :
 * 1. Parse la requête en langage naturel (17 facettes, FR/EN/ES)
 * 2. Filtre (contraintes dures) + score (priorités de classement)
 * 3. Alternatives si l'intention le demande
 */
export function intelligentSearchSync(
  rawQuery: string,
  catalog: ProductV2[],
  filters: StructuredFiltersV2 = {},
): SearchResponseV2 {
  const parsed = parseQueryZeroApi(rawQuery);

  if (parsed.intent === 'alternative_search' && (parsed.referenceSupplier || parsed.referenceProduct)) {
    const alternatives = findAlternatives(catalog, parsed, filters);
    const base = runSearch(
      catalog,
      { ...parsed, referenceSupplier: undefined, referenceProduct: undefined },
      filters,
    );
    return {
      ...base,
      results: alternatives.map(a => a.product),
      totalCount: alternatives.length,
      alternatives,
      parsedQuery: parsed,
    };
  }

  return runSearch(catalog, parsed, filters);
}

/** Alias asynchrone pour compatibilité d'API — strictement identique, aucun réseau. */
export async function intelligentSearch(
  rawQuery: string,
  catalog: ProductV2[],
  filters: StructuredFiltersV2 = {},
): Promise<SearchResponseV2> {
  return intelligentSearchSync(rawQuery, catalog, filters);
}
