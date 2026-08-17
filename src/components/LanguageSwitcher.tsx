import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useI18n, LOCALES, type Locale } from '../lib/i18n';
import { supabase } from '../lib/supabase';

/**
 * Sélecteur de langue accessible (bouton + menu déroulant).
 * `variant="transparent"` : pour le header en mode hero (texte blanc).
 * `variant="footer"` : version sombre pour le pied de page.
 */
export default function LanguageSwitcher({
  variant = 'default',
}: {
  variant?: 'default' | 'transparent' | 'footer';
}) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  const current = LOCALES.find(l => l.code === locale) ?? LOCALES[0];

  const buttonClass =
    variant === 'transparent'
      ? 'text-white/90 hover:text-white hover:bg-white/10 border border-white/20'
      : variant === 'footer'
      ? 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200';

  const selectLocale = (code: Locale) => {
    setLocale(code);
    setOpen(false);
    // Persiste la langue préférée : les e-mails transactionnels
    // (triggers SQL) l'utilisent pour écrire dans la langue de
    // l'utilisateur. Silencieux et non bloquant si déconnecté.
    void (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          await supabase.from('profiles').update({ preferred_locale: code }).eq('id', data.user.id);
        }
      } catch { /* jamais bloquant */ }
    })();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('common.language')}
        className={`flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium rounded-lg transition-all ${buttonClass}`}
      >
        <Globe className="w-4 h-4" aria-hidden="true" />
        <span className="uppercase text-xs font-bold">{current.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t('common.language')}
          className="absolute end-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-[60] animate-fade-up"
        >
          {LOCALES.map(l => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === locale}
              onClick={() => selectLocale(l.code)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-start transition-colors ${
                l.code === locale
                  ? 'font-bold text-brand-700 bg-brand-50'
                  : 'font-medium text-gray-700 hover:bg-gray-50'
              }`}
              dir={l.dir}
            >
              <span aria-hidden="true">{l.flag}</span>
              <span className="flex-1">{l.label}</span>
              {l.code === locale && <Check className="w-4 h-4 text-brand-600" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
