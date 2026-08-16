// =============================================================
// EthiMarket — Cockpit Acheteur « Aujourd'hui »
// « Je veux que la plateforme me dise ce qui nécessite mon
//   attention, plutôt que de devoir chercher moi-même. »
// Compteurs temps réel + flux d'alertes 🔴🟠🟢🔵.
// =============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, BellRing, CheckCheck, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { refreshBuyerAlerts, markAlertRead, markAllAlertsRead, BuyerAlert } from '../../lib/alertsEngine';
import { computePurchaseAnalytics, getPurchases } from '../../lib/buyerWorkspace';

interface CockpitCounters {
  suppliersAtRisk: number;
  certsExpiring30d: number;
  docsToVerify: number;
  purchasesInProgress: number;   // €
  portfolioScore: number;        // /100
  newOpportunities: number;
  suppliersToReevaluate: number;
}

const SEVERITY_CLS: Record<string, string> = {
  red: 'border-red-200 bg-red-50',
  orange: 'border-amber-200 bg-amber-50',
  green: 'border-emerald-200 bg-emerald-50',
  blue: 'border-blue-200 bg-blue-50',
};

export default function BuyerCockpit({ userId }: { userId: string }) {
  const [counters, setCounters] = useState<CockpitCounters | null>(null);
  const [alerts, setAlerts] = useState<BuyerAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 1. Rafraîchit les alertes (calcule + persiste + retourne les non-lues)
      const alertList = await refreshBuyerAlerts(userId);

      // 2. Compteurs
      const [suppliersRes, docsRes, purchases] = await Promise.all([
        supabase.from('buyer_suppliers').select('status, updated_at').eq('user_id', userId),
        supabase.from('buyer_documents').select('id, missing_fields').eq('user_id', userId),
        getPurchases(userId),
      ]);

      const suppliers = (suppliersRes.data ?? []) as { status: string; updated_at: string }[];
      const docs = (docsRes.data ?? []) as { missing_fields: string[] }[];
      const analytics = computePurchaseAnalytics(purchases);
      const now = Date.now();
      const DAY = 24 * 3600 * 1000;

      const c: CockpitCounters = {
        suppliersAtRisk: suppliers.filter(s => s.status === 'at_risk').length,
        certsExpiring30d: alertList.filter(a => a.dedupe_key.startsWith('cert-expiring')).length,
        docsToVerify: docs.filter(d => (d.missing_fields ?? []).length > 0).length,
        purchasesInProgress: analytics.totalSpent,
        portfolioScore: analytics.avgEthicalScore,
        newOpportunities: alertList.filter(a => a.kind === 'opportunity').length,
        suppliersToReevaluate: suppliers.filter(s =>
          ['active', 'evaluating'].includes(s.status) &&
          (now - new Date(s.updated_at).getTime()) / DAY >= 90).length,
      };

      if (!cancelled) {
        setAlerts(alertList);
        setCounters(c);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  if (loading || !counters) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
        <span className="ml-2 text-sm text-gray-500">Analyse de votre portefeuille…</span>
      </div>
    );
  }

  const tiles: { emoji: string; value: string; label: string; to: string; accent?: string }[] = [
    { emoji: '🔴', value: String(counters.suppliersAtRisk), label: `fournisseur${counters.suppliersAtRisk > 1 ? 's' : ''} à risque`, to: '/dashboard/mes-achats?tab=suppliers', accent: counters.suppliersAtRisk > 0 ? 'border-red-200' : '' },
    { emoji: '⚠️', value: String(counters.certsExpiring30d), label: 'certifications expirent dans 30 jours', to: '/dashboard/mes-achats?tab=products', accent: counters.certsExpiring30d > 0 ? 'border-amber-200' : '' },
    { emoji: '📄', value: String(counters.docsToVerify), label: 'documents à vérifier', to: '/dashboard/documents', accent: counters.docsToVerify > 0 ? 'border-amber-200' : '' },
    { emoji: '💰', value: `${counters.purchasesInProgress.toLocaleString('fr-FR')} €`, label: "d'achats en cours", to: '/dashboard/mes-achats' },
    { emoji: '🌱', value: `${counters.portfolioScore}/100`, label: 'score moyen de mon portefeuille', to: '/dashboard/mes-achats' },
    { emoji: '🔎', value: String(counters.newOpportunities), label: 'nouvelles alternatives trouvées par l\'IA', to: '/dashboard/mes-achats?tab=products', accent: counters.newOpportunities > 0 ? 'border-emerald-200' : '' },
    { emoji: '📊', value: String(counters.suppliersToReevaluate), label: `fournisseur${counters.suppliersToReevaluate > 1 ? 's' : ''} nécessitent une réévaluation`, to: '/dashboard/mes-achats?tab=suppliers' },
  ];

  return (
    <div className="space-y-6">
      {/* Compteurs « Aujourd'hui » */}
      <div>
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-3">Aujourd'hui</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {tiles.map((t, i) => (
            <Link
              key={i}
              to={t.to}
              className={`bg-white rounded-2xl border-2 ${t.accent || 'border-gray-100'} p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-lg">{t.emoji}</span>
                <span className="text-xl font-black text-gray-900 tabular-nums">{t.value}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 leading-snug">{t.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Flux d'alertes */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 text-sm font-black text-gray-900">
            <BellRing className="w-4 h-4 text-brand-600" />
            Ce qui nécessite votre attention
            {alerts.length > 0 && (
              <span className="text-[10px] font-black bg-red-100 text-red-700 rounded-full px-2 py-0.5">{alerts.length}</span>
            )}
          </h3>
          {alerts.length > 0 && (
            <button
              onClick={async () => { await markAllAlertsRead(userId); setAlerts([]); }}
              className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Tout marquer lu
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <p className="text-sm text-gray-400 italic py-4 text-center">
            ✅ Rien ne nécessite votre attention pour le moment. La plateforme surveille en continu.
          </p>
        ) : (
          <ul className="space-y-2">
            {alerts.slice(0, 8).map(a => (
              <li key={a.id ?? a.dedupe_key} className={`rounded-xl border px-4 py-3 ${SEVERITY_CLS[a.severity] ?? 'border-gray-100 bg-gray-50'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black tracking-wide">{a.title}</p>
                    <p className="text-sm text-gray-800 mt-0.5">{a.message}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {a.action_url && (
                      <Link to={a.action_url} className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-900">
                        Voir <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                    {a.id && (
                      <button
                        onClick={async () => { await markAlertRead(a.id!); setAlerts(prev => prev.filter(x => x.id !== a.id)); }}
                        className="text-[10px] text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
                      >
                        ✓ Lu
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
