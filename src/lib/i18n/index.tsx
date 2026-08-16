/* eslint-disable react-refresh/only-export-components */
/**
 * Système i18n EthiMarket — zéro dépendance, zéro coût.
 * 5 langues : français (référence), anglais, espagnol, portugais, arabe (RTL).
 * - Détection auto : localStorage > navigator.language > fr
 * - Fallback : clé manquante -> français -> clé brute
 * - RTL : bascule automatique de <html dir> pour l'arabe
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import fr from './locales/fr';
import en from './locales/en';
import es from './locales/es';
import pt from './locales/pt';
import ar from './locales/ar';

export type Locale = 'fr' | 'en' | 'es' | 'pt' | 'ar';

export const LOCALES: { code: Locale; label: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'fr', label: 'Français',   flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', label: 'English',    flag: '🇬🇧', dir: 'ltr' },
  { code: 'es', label: 'Español',    flag: '🇪🇸', dir: 'ltr' },
  { code: 'pt', label: 'Português',  flag: '🇵🇹', dir: 'ltr' },
  { code: 'ar', label: 'العربية',    flag: '🇸🇦', dir: 'rtl' },
];

export const DICTS: Record<Locale, Record<string, string>> = { fr, en, es, pt, ar };

const STORAGE_KEY = 'ethimarket_locale';

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && v in DICTS;
}

/** Pur et testable : résout une clé dans une locale avec fallback fr puis clé brute. */
export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>
): string {
  let s = DICTS[locale][key] ?? DICTS.fr[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.split(`{${k}}`).join(String(v));
    }
  }
  return s;
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'fr';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch { /* stockage indisponible */ }
  const nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
  return isLocale(nav) ? nav : 'fr';
}

export function dirFor(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

type I18nContextValue = {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue>({
  locale: 'fr',
  dir: 'ltr',
  setLocale: () => {},
  t: (key, vars) => translate('fr', key, vars),
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dirFor(locale);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    try { window.localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, dir: dirFor(locale), setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
