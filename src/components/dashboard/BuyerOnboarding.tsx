// =============================================================
// EthiMarket — Onboarding acheteur guidé (audit n°6)
// Checklist de démarrage calculée sur les données RÉELLES du
// compte : chaque étape se coche automatiquement dès qu'elle est
// accomplie. Disparaît quand tout est fait (ou masquée à la main).
// =============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, X, Rocket } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface OnboardingStep {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  to: string;
  done: boolean;
}

const DISMISS_KEY = 'ethimarket_onboarding_dismissed';

export default function BuyerOnboarding({ userId }: { userId: string }) {
  const [steps, setSteps] = useState<OnboardingStep[] | null>(null);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');

  useEffect(() => {
    if (dismissed) return;
    let cancelled = false;
    (async () => {
      // Chaque étape est vérifiée sur les données réelles du compte
      const [suppliers, products, prefs, quotes, events] = await Promise.all([
        supabase.from('buyer_suppliers').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('buyer_products').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('buyer_preferences').select('user_id').eq('user_id', userId).maybeSingle(),
        supabase.from('quote_requests').select('id', { count: 'exact', head: true }).eq('buyer_id', userId),
        supabase.from('buyer_events').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('event_type', 'comparison_run'),
      ]);

      const list: OnboardingStep[] = [
        {
          id: 'search', emoji: '🔎', title: 'Faire une première recherche',
          desc: 'Essayez « café bio » ou une demande en langage naturel dans le catalogue.',
          to: '/catalogue', done: (products.count ?? 0) > 0 || (quotes.count ?? 0) > 0 || (suppliers.count ?? 0) > 0,
        },
        {
          id: 'supplier', emoji: '🏭', title: 'Suivre un fournisseur',
          desc: 'Classez vos fournisseurs : actif, en évaluation, à risque, suspendu.',
          to: '/dashboard/mes-achats?tab=suppliers', done: (suppliers.count ?? 0) > 0,
        },
        {
          id: 'product', emoji: '📦', title: 'Suivre un produit',
          desc: 'Ajoutez un produit à votre pipeline : approuvé, en analyse ou rejeté.',
          to: '/dashboard/mes-achats?tab=products', done: (products.count ?? 0) > 0,
        },
        {
          id: 'compare', emoji: '⚖️', title: 'Comparer des produits',
          desc: 'Cochez 2-3 produits du catalogue et obtenez la matrice + recommandation.',
          to: '/catalogue', done: (events.count ?? 0) > 0,
        },
        {
          id: 'rules', emoji: '⚖️', title: 'Définir vos règles de décision',
          desc: 'Pondérez prix, environnement, social, traçabilité et certifications.',
          to: '/dashboard/mes-achats?tab=rules', done: !!prefs.data,
        },
        {
          id: 'quote', emoji: '📤', title: 'Envoyer une demande de devis',
          desc: 'Depuis une fiche produit, cliquez « Commander » — le producteur répond avec son offre.',
          to: '/catalogue', done: (quotes.count ?? 0) > 0,
        },
      ];
      if (!cancelled) setSteps(list);
    })();
    return () => { cancelled = true; };
  }, [userId, dismissed]);

  if (dismissed || !steps) return null;
  const doneCount = steps.filter(s => s.done).length;
  if (doneCount === steps.length) return null; // tout est fait → disparaît

  return (
    <div className="rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white p-5 relative">
      <button
        onClick={() => { localStorage.setItem(DISMISS_KEY, '1'); setDismissed(true); }}
        className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
        aria-label="Masquer le guide de démarrage"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-black text-gray-900">Bien démarrer sur EthiMarket</h3>
          <p className="text-xs text-gray-500">{doneCount}/{steps.length} étapes accomplies — chaque étape se coche automatiquement.</p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="h-1.5 rounded-full bg-brand-100 overflow-hidden my-3">
        <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {steps.map(step => (
          <li key={step.id}>
            <Link
              to={step.to}
              className={`flex items-start gap-2.5 rounded-xl border p-3 transition-colors ${
                step.done ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-white hover:border-brand-300'
              }`}
            >
              {step.done
                ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                : <Circle className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />}
              <span>
                <span className={`block text-sm font-bold ${step.done ? 'text-emerald-800 line-through decoration-emerald-300' : 'text-gray-900'}`}>
                  {step.emoji} {step.title}
                </span>
                {!step.done && <span className="block text-[11px] text-gray-500 mt-0.5">{step.desc}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
