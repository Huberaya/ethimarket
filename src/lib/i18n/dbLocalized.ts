// =============================================================
// EthiMarket — Localisation des contenus stockés en base
//
// Les tables products / articles / categories / producers portent
// une colonne JSONB `translations` :
//   { "en": { "name": "...", ... }, "es": {...}, "pt": {...}, "ar": {...} }
// Le français reste la langue source dans les colonnes d'origine.
//
// RÈGLE DE FALLBACK (jamais de texte vide) :
//   locale demandée → français (colonne source) → ''.
// Fonctions pures et testables, zéro dépendance.
// =============================================================

import type { Locale } from './index';

export type TranslationsBlob = Partial<Record<Locale, Record<string, string>>> | null | undefined;

/**
 * Toute ligne de base potentiellement traduite. Type volontairement
 * large (object) pour accepter Product, Article, Category, Producer…
 * sans exiger de signature d'index sur ces types.
 */
type LocalizableRow = object;

interface RowShape {
  translations?: TranslationsBlob;
  [key: string]: unknown;
}

/**
 * Retourne la valeur localisée d'un champ d'une ligne de base.
 * - locale 'fr' → colonne source directement ;
 * - sinon translations[locale][field], fallback colonne source.
 */
export function dbLocalized(
  row: LocalizableRow | null | undefined,
  field: string,
  locale: Locale,
): string {
  if (!row) return '';
  const r = row as RowShape;
  const source = typeof r[field] === 'string' ? (r[field] as string) : '';
  if (locale === 'fr') return source;
  const translated = r.translations?.[locale]?.[field];
  return (typeof translated === 'string' && translated.length > 0) ? translated : source;
}

/** Nom localisé d'un produit. */
export function productName(p: LocalizableRow | null | undefined, locale: Locale): string {
  return dbLocalized(p, 'name', locale);
}

/** Description localisée d'un produit. */
export function productDescription(p: LocalizableRow | null | undefined, locale: Locale): string {
  return dbLocalized(p, 'description', locale);
}

/** Description courte localisée (fallback description longue). */
export function productShortDescription(p: LocalizableRow | null | undefined, locale: Locale): string {
  return dbLocalized(p, 'short_description', locale) || productDescription(p, locale);
}

/** Nom localisé d'une catégorie. */
export function categoryName(c: LocalizableRow | null | undefined, locale: Locale): string {
  return dbLocalized(c, 'name', locale);
}

/** Champs localisés d'un article de blog. */
export function articleField(
  a: LocalizableRow | null | undefined,
  field: 'title' | 'excerpt' | 'category' | 'content',
  locale: Locale,
): string {
  return dbLocalized(a, field, locale);
}

/** Description localisée d'un producteur. */
export function producerDescription(p: LocalizableRow | null | undefined, locale: Locale): string {
  return dbLocalized(p, 'description', locale);
}
