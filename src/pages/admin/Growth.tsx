import { useState, useEffect, useCallback } from 'react';
import { Loader2, TrendingUp, RefreshCw, Users, FileText, ShoppingCart, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../../components/AdminLayout';

/**
 * Tableau de bord Croissance (fondateur) : funnel, GMV, sources,
 * série hebdomadaire — alimenté par get_growth_stats() (agrégats
 * de la mesure d'audience interne sans cookie + tables métier).
 */

interface GrowthStats {
  funnel: { sessions: number; page_views: number; product_views: number; signups: number; quotes: number; orders: number };
  business: { gmv: number; commission: number; aov: number; quote_to_order_pct: number };
  sources: { source: string; sessions: number }[];
  weekly: { week: string; signups: number; quotes: number; orders: number }[];
  period_days: number;
  generated_at: string;
}

const PERIODS = [7, 30, 90];

function Kpi({ icon: Icon, label, value, sub }: { icon: typeof Users; label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 text-gray-400 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-[11px] font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-black text-gray-900 tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminGrowth() {
  const [stats, setStats] = useState<GrowthStats | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase.rpc('get_growth_stats', { p_days: days });
    if (err) setError(err.message);
    else setStats(data as GrowthStats);
    setLoading(false);
  }, [days]);

  useEffect(() => { load(); }, [load]);

  if (loading && !stats) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;
  if (error) return <div className="p-8 text-sm text-red-600 font-semibold">{error}</div>;
  if (!stats) return null;

  const f = stats.funnel;
  const b = stats.business;
  const convSignup = f.sessions > 0 ? (100 * f.signups / f.sessions).toFixed(1) : '—';
  const maxWeekly = Math.max(1, ...stats.weekly.map(w => Math.max(w.signups, w.quotes, w.orders)));

  return (
    <div>
      <AdminPageHeader
        title="Croissance"
        subtitle="Funnel, GMV et sources — mesure d'audience interne sans cookie, agrégats uniquement"
      />

      <div className="flex items-center gap-2 mb-6">
        {PERIODS.map(p => (
          <button key={p} onClick={() => setDays(p)}
            className={`px-4 py-2 text-xs font-black rounded-xl border-2 cursor-pointer ${days === p ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 bg-white text-gray-600'}`}>
            {p} jours
          </button>
        ))}
        <button onClick={() => void load()} disabled={loading}
          className="ml-auto px-4 py-2 text-xs font-black rounded-xl border border-gray-200 text-gray-600 inline-flex items-center gap-1.5 cursor-pointer">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </button>
      </div>

      {/* KPI business */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi icon={TrendingUp} label="GMV" value={`${Number(b.gmv).toLocaleString('fr-FR')} €`} sub={`panier moyen ${Number(b.aov).toLocaleString('fr-FR')} €`} />
        <Kpi icon={TrendingUp} label="Commission (5%)" value={`${Number(b.commission).toLocaleString('fr-FR')} €`} />
        <Kpi icon={ShoppingCart} label="Commandes" value={f.orders} sub={`${b.quote_to_order_pct}% des devis acceptés`} />
        <Kpi icon={FileText} label="Devis demandés" value={f.quotes} />
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h3 className="font-black text-gray-900 mb-4">Funnel ({stats.period_days} jours)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Sessions', value: f.sessions, icon: Users },
            { label: 'Pages vues', value: f.page_views, icon: Eye },
            { label: 'Vues produit', value: f.product_views, icon: Eye },
            { label: 'Inscriptions', value: f.signups, icon: Users },
            { label: 'Devis', value: f.quotes, icon: FileText },
          ].map((s, i) => (
            <div key={i} className="rounded-xl bg-gray-50 border border-gray-100 p-3.5 text-center">
              <p className="text-xl font-black text-gray-900 tabular-nums">{s.value}</p>
              <p className="text-[11px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-3">
          Taux de conversion visite → inscription : <span className="font-bold text-gray-600">{convSignup}%</span>
          {f.sessions === 0 && ' — les sessions se comptent depuis l\'activation du tracker : les chiffres montent dès les premières visites.'}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Série hebdo */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-black text-gray-900 mb-4">8 dernières semaines</h3>
          <div className="space-y-2.5">
            {stats.weekly.map((w) => (
              <div key={w.week} className="flex items-center gap-3">
                <span className="text-[11px] text-gray-400 w-16 shrink-0 tabular-nums">S{w.week.split('-')[1]}</span>
                <div className="flex-1 space-y-1">
                  {[
                    { v: w.signups, cls: 'bg-blue-400', label: 'inscriptions' },
                    { v: w.quotes, cls: 'bg-amber-400', label: 'devis' },
                    { v: w.orders, cls: 'bg-emerald-500', label: 'commandes' },
                  ].map((bar, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${bar.cls}`} style={{ width: `${Math.min(100, 100 * bar.v / maxWeekly)}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 w-6 tabular-nums text-right">{bar.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-[10px] text-gray-400">
            <span><span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1" />Inscriptions</span>
            <span><span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1" />Devis</span>
            <span><span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1" />Commandes</span>
          </div>
        </div>

        {/* Sources */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-black text-gray-900 mb-4">Sources de trafic</h3>
          {stats.sources.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune session enregistrée sur la période. Les sources (utm_source des campagnes, domaines référents) apparaîtront ici.</p>
          ) : (
            <div className="space-y-2">
              {stats.sources.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-700">{s.source}</span>
                  <span className="text-gray-400 tabular-nums">{s.sessions} sessions</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-gray-400 mt-4">
            💡 Pour vos campagnes de prospection, ajoutez <code className="bg-gray-100 px-1 rounded">?utm_source=outbound-epiceries</code> aux liens du kit — les retombées se compteront ici.
          </p>
        </div>
      </div>
    </div>
  );
}
