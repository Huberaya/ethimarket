// =============================================================
// EthiMarket — Traductions optionnelles de la description produit
//
// Les NOMS de produits sont auto-traduits (dictionnaire local) ;
// les DESCRIPTIONS libres ne peuvent pas l'être sans API payante.
// Ce panneau replié permet au vendeur qui parle plusieurs langues
// de saisir ses descriptions en/es/pt/ar. Vide = fallback vers la
// description française (jamais de texte vide côté acheteur).
// =============================================================

import { useState } from 'react';
import { Languages, ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

const TARGETS = [
  { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  { code: 'es' as const, label: 'Español', flag: '🇪🇸' },
  { code: 'pt' as const, label: 'Português', flag: '🇵🇹' },
  { code: 'ar' as const, label: 'العربية', flag: '🇸🇦' },
];

export type DescriptionTranslationsValue = Partial<Record<'en' | 'es' | 'pt' | 'ar', string>>;

export default function DescriptionTranslations({
  value, onChange, inputClass,
}: {
  value: DescriptionTranslationsValue;
  onChange: (next: DescriptionTranslationsValue) => void;
  inputClass: string;
}) {
  const { tx } = useI18n();
  const [open, setOpen] = useState(false);
  const filled = TARGETS.filter(t => (value[t.code] ?? '').trim().length > 0).length;

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/60 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <Languages className="w-4 h-4 text-brand-600" />
          {tx('Description dans d\'autres langues (optionnel)')}
          {filled > 0 && (
            <span className="text-[10px] font-black bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">{filled}/4</span>
          )}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="p-4 space-y-3 bg-white">
          <p className="text-[11px] text-gray-500">
            {tx('Si vous parlez ces langues, saisissez votre description : les acheteurs étrangers la verront dans leur langue. Sinon, la version française sera affichée.')}
          </p>
          {TARGETS.map(t => (
            <div key={t.code}>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                {t.flag} {t.label}
              </label>
              <textarea
                value={value[t.code] ?? ''}
                onChange={e => onChange({ ...value, [t.code]: e.target.value })}
                rows={2}
                dir={t.code === 'ar' ? 'rtl' : 'ltr'}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
