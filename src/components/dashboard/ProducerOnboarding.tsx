import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, X, Rocket, ArrowRight } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useI18n } from '../../lib/i18n';
import { computeProducerSteps, onboardingProgress, nextStep } from '../../lib/producerOnboarding';

/**
 * Guide de démarrage producteur (chantier #11) — pendant du
 * BuyerOnboarding : checklist auto-cochée sur les données réelles,
 * barre de progression, prochaine étape mise en avant.
 * Disparaît quand tout est fait (ou masqué à la main).
 */

const DISMISS_KEY = 'ethimarket_producer_onboarding_dismissed';

export default function ProducerOnboarding({ productCount, activeProductCount }: { productCount: number; activeProductCount: number }) {
  const { producer } = useAuth();
  const { tx } = useI18n();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');

  const steps = useMemo(
    () => computeProducerSteps({ producer, productCount, activeProductCount }),
    [producer, productCount, activeProductCount],
  );
  const progress = onboardingProgress(steps);
  const next = nextStep(steps);

  if (dismissed || progress === 100) return null;

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-100 p-5 mb-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Rocket className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-sm">{tx('Votre chemin vers la première vente')}</h3>
            <p className="text-[11px] text-gray-500">{tx('Chaque étape se coche automatiquement dès qu\u2019elle est accomplie.')}</p>
          </div>
        </div>
        <button onClick={() => { localStorage.setItem(DISMISS_KEY, '1'); setDismissed(true); }}
          aria-label={tx('Masquer le guide')}
          className="text-gray-300 hover:text-gray-500 cursor-pointer shrink-0"><X className="w-4 h-4" /></button>
      </div>

      {/* Barre de progression */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-black text-brand-700 tabular-nums shrink-0">{progress}%</span>
      </div>

      {/* Étapes */}
      <div className="space-y-1.5">
        {steps.map(s => (
          <Link key={s.id} to={s.to}
            className={`flex items-start gap-2.5 rounded-xl px-3 py-2 transition-colors ${
              s.done ? 'opacity-55' : next?.id === s.id ? 'bg-brand-50 border border-brand-200' : 'hover:bg-gray-50'}`}>
            {s.done
              ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              : <Circle className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />}
            <span className="text-base leading-none mt-0.5">{s.emoji}</span>
            <span className="min-w-0 flex-1">
              <span className={`block text-xs font-bold ${s.done ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{tx(s.title)}</span>
              {!s.done && <span className="block text-[11px] text-gray-500 leading-snug mt-0.5">{tx(s.desc)}</span>}
            </span>
            {next?.id === s.id && (
              <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-black text-brand-700 mt-1">
                {tx('Commencer')} <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
