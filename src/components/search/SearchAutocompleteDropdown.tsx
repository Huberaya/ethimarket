// src/components/search/SearchAutocompleteDropdown.tsx
// Real-time intelligent search suggestions & autocomplete dropdown with highlighted matches & relevance badges

import React from 'react';
import { Search, Sparkles, History, ArrowUpRight, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { ParsedSearchQuery, normalizeText } from '../../lib/naturalLanguageSearchService';
import { SearchResultItem } from '../../lib/productSearchEngine';
import { useI18n } from '../../lib/i18n';

interface SearchAutocompleteDropdownProps {
  query: string;
  parsedQuery: ParsedSearchQuery;
  matchingProducts: SearchResultItem[];
  recentSearches: string[];
  didYouMean?: string;
  suggestedAlternatives?: string[];
  onSelectSuggestion: (text: string) => void;
  onClearHistory: () => void;
  isOpen: boolean;
}

const POPULAR_SEARCH_EXAMPLES = [
  'Café bio équitable colombien',
  'Chocolat noir 70% bio',
  'T-shirt coton bio homme',
  'Miel de thym pur',
  'Huile d\'argan bio pure'
];

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || !query.trim()) return <>{text}</>;
  const trimmed = query.trim();
  const tokens = trimmed.split(/\s+/).filter(t => t.length > 0);
  const regexPattern = `(${tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`;
  
  try {
    const parts = text.split(new RegExp(regexPattern, 'gi'));
    return (
      <span>
        {parts.map((part, i) => {
          const isMatch = tokens.some(t => normalizeText(t) === normalizeText(part));
          return isMatch ? (
            <mark key={i} className="bg-emerald-100 text-emerald-950 font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          );
        })}
      </span>
    );
  } catch {
    return <>{text}</>;
  }
}

export const SearchAutocompleteDropdown: React.FC<SearchAutocompleteDropdownProps> = ({
  query,
  parsedQuery,
  matchingProducts,
  recentSearches,
  didYouMean,
  suggestedAlternatives = POPULAR_SEARCH_EXAMPLES,
  onSelectSuggestion,
  onClearHistory,
  isOpen
}) => {
  const { t } = useI18n();
  if (!isOpen) return null;

  const hasExtractedEntities =
    parsedQuery.productType ||
    parsedQuery.certifications.length > 0 ||
    parsedQuery.materials.length > 0 ||
    parsedQuery.countries.length > 0 ||
    parsedQuery.maxPrice !== undefined;

  const isZeroResult = query.trim().length >= 2 && matchingProducts.length === 0;

  return (
    <div
      id="search-autocomplete-dropdown"
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-200 z-50 overflow-hidden divide-y divide-neutral-100 max-h-[75vh] overflow-y-auto"
    >
      {/* 1. Natural Language Extracted Understanding Preview */}
      {query.trim().length > 2 && hasExtractedEntities && (
        <div className="p-3 bg-emerald-50/80 border-b border-emerald-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t('search.extracted')}</span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-800 font-medium">
              Confiance {Math.round(parsedQuery.confidence * 100)}%
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {parsedQuery.productTypeCanonical && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-white text-emerald-800 border border-emerald-200 shadow-sm font-medium">
                📦 {parsedQuery.productTypeCanonical}
              </span>
            )}
            {parsedQuery.materials.map(m => (
              <span key={m} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-white text-emerald-800 border border-emerald-200 shadow-sm font-medium">
                🌿 {m}
              </span>
            ))}
            {parsedQuery.certifications.map(c => (
              <span key={c} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-emerald-700 text-white shadow-sm font-medium">
                ✓ {c}
              </span>
            ))}
            {parsedQuery.gender && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-white text-emerald-800 border border-emerald-200 shadow-sm font-medium">
                👤 {parsedQuery.gender}
              </span>
            )}
            {parsedQuery.countries.map(c => (
              <span key={c} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-white text-emerald-800 border border-emerald-200 shadow-sm font-medium">
                🌍 {c}
              </span>
            ))}
            {parsedQuery.maxPrice !== undefined && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-amber-100 text-amber-900 border border-amber-300 shadow-sm font-semibold">
                💰 ≤ {parsedQuery.maxPrice} €
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. Top Matching Products Instant Preview with Highlights & Relevance Badges */}
      {matchingProducts.length > 0 && (
        <div className="p-3">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2 mb-2">
            <span>Produits pertinents ({matchingProducts.length})</span>
            <span className="text-[10px] font-normal text-neutral-400">{t('search.priority')}</span>
          </div>
          <div className="space-y-1">
            {matchingProducts.slice(0, 5).map(prod => {
              const isExact = prod.matchType === 'exact' || normalizeText(prod.name) === normalizeText(query);
              const isPrefix = prod.matchType === 'prefix';

              return (
                <button
                  key={prod.id}
                  id={`autocomplete-item-${prod.id}`}
                  type="button"
                  onClick={() => onSelectSuggestion(prod.name)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 transition text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    {prod.image_url ? (
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
                        {prod.emoji || '📦'}
                      </div>
                    )}
                    <div className="min-w-0 truncate">
                      <div className="text-sm font-semibold text-neutral-900 group-hover:text-emerald-700 flex items-center gap-2 truncate">
                        <HighlightMatch text={prod.name} query={query} />
                        {prod.country_flag && <span className="text-xs">{prod.country_flag}</span>}
                      </div>
                      <div className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5 truncate">
                        <span className="truncate">{prod.producers?.name || prod.country}</span>
                        {prod.certifications && prod.certifications.length > 0 && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium shrink-0">
                            {prod.certifications[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <div className="text-sm font-bold text-neutral-900">
                      {prod.price} {prod.currency || '€'}
                    </div>
                    {isExact ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        Correspondance exacte
                      </span>
                    ) : isPrefix ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                        Début du nom
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                        Correspondance partielle
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. ZERO RESULTS DEDICATED STATE (No noise, with smart suggestions) */}
      {isZeroResult && (
        <div className="p-5 text-center space-y-3 bg-neutral-50/70">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-neutral-900">
              Aucun résultat pour "{query}"
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Aucun produit ne correspond exactement à ces termes dans le catalogue éthique.
            </p>
          </div>

          {/* Spelling Correction / Did you mean */}
          {didYouMean && (
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 inline-block text-left">
              <div className="text-xs text-emerald-900 flex items-center gap-1.5 font-medium">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Vouliez-vous dire : </span>
                <button
                  type="button"
                  onClick={() => onSelectSuggestion(didYouMean)}
                  className="font-bold underline text-emerald-700 hover:text-emerald-800"
                >
                  "{didYouMean}"
                </button>
                <span>?</span>
              </div>
            </div>
          )}

          {/* Alternative popular suggestions */}
          <div className="pt-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Essayez avec ces suggestions :
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {suggestedAlternatives.slice(0, 4).map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectSuggestion(item)}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 text-xs font-medium text-neutral-700 rounded-lg border border-neutral-200 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Popular / Complex Prompt Examples (When query is empty or initial) */}
      {!query && (
        <div className="p-3 bg-neutral-50/50">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2 mb-2 flex items-center justify-between">
            <span>Recherches populaires & langage naturel</span>
            <span className="text-[10px] font-normal text-neutral-400">Cliquez pour tester</span>
          </div>
          <div className="space-y-1">
            {POPULAR_SEARCH_EXAMPLES.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSuggestion(example)}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900 transition text-left group"
              >
                <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 shrink-0" />
                <span className="truncate">{example}</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-300 group-hover:text-emerald-600 ml-auto shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Recent Searches History */}
      {recentSearches.length > 0 && !query && (
        <div className="p-3">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2 mb-2">
            <span className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Recherches récentes
            </span>
            <button
              type="button"
              onClick={onClearHistory}
              className="text-[10px] text-neutral-400 hover:text-rose-600 font-normal lowercase"
            >
              Effacer
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 px-1">
            {recentSearches.slice(0, 6).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSuggestion(item)}
                className="px-2.5 py-1 rounded-lg text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition flex items-center gap-1"
              >
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
