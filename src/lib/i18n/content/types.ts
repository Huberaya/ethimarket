/** Types partagés des contenus éditoriaux multilingues. */
import type { Locale } from '../index';

export type PerLocale<T> = Record<Locale, T>;
