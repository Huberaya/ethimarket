import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2, RefreshCw, AlertTriangle, AlertOctagon, Info, CheckCircle2,
  ArrowRight, Phone, Target, TrendingUp, Compass, CalendarClock,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../../components/AdminLayout';
import { computeActions, phase1Progress, type CockpitFacts, type CockpitAction } from '../../lib/ceoCockpit';

/**
 * Cockpit CEO — « Que dois-je faire maintenant ? » (plan stratégique §12).
 * Fusion opérationnelle de Prospection / Santé / Croissance : les faits
 * viennent de get_ceo_cockpit(), les priorités du moteur de règles
 * déterministe src/lib/ceoCockpit.ts.
 */

const SEV_META = {
  critical: { cls: 'border-red-300 bg-red-50', badge: 'bg-red-600 text-white', label: 'CRITIQUE', Icon: AlertOctagon, icon: 'text-red-600' },
  high: { cls: 'border-amber-300 bg-amber-50', badge: 'bg-amber-500 text-white', label: 'AUJOURD\u2019HUI', Icon: AlertTriangle, icon: 'text-amber-600' },
  medium: { cls: 'border-sky-200 bg-sky-50/60', badge: 'bg-sky-500 text-white', label: 'CETTE SEMAINE', Icon: Info, icon: 'text-sky-600' },
  low: { cls: 'border-gray-200 bg-white', badge: 'bg-gray-400 text-white', label: 'FOND DE TÂCHE', Icon: Info, icon: 'text-gray-400' },
} as const;

function ActionCard({ a }: { a: CockpitAction }) {
  const m = SEV_META[a.severity];
  return (
    <Link to={a.link} className={`block rounded-2xl border-2 ${m.cls} px-4 py-3.5 hover:shadow-sm transition-shadow`}>
      <div className="flex items-start gap-3">
        <m.Icon className={`w-5 h-5 mt-0.5 shrink-0 ${m.icon}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${m.badge}`}>{m.label}</span>
            <p className="text-sm font-black text-gray-900">{a.title}</p>
          </div>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{a.detail}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 mt-1" />
      </div>
    </Link>
  );
}

export default function AdminCockpit() {
  const [facts, setFacts] = useState<CockpitFacts | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase.rpc('get_ceo_cockpit');
    if (err) setError(err.message);
    else setFacts(data as CockpitFacts);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading && !facts) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;
  if (error) return <div className="p-8 text-sm text-red-600 font-semibold">{error}</div>;
  if (!facts) return null;

  const actions = computeActions(facts);
  const urgent = actions.filter(a => a.severity === 'critical' || a.severity === 'high');
  const rest = actions.filter(a => a.severity === 'medium' || a.severity === 'low');
  const kpis = phase1Progress(facts);
  const allClear = urgent.length === 0;

  return (
    <div>
      <AdminPageHeader
        title="Cockpit"
        subtitle="Que dois-je faire maintenant ? — priorités par règles, chiffres sans fard"
        actions={
          <button onClick={() => void load()} disabled={loading}
            className="px-4 py-2 text-xs font-black rounded-xl border border-gray-200 text-gray-600 hover:border-brand-400 inline-flex items-center gap-1.5 cursor-pointer">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualiser
          </button>
        }
      />

      {/* Verdict du jour */}
      <div className={`rounded-2xl px-5 py-4 mb-5 border-2 ${allClear ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-900 border-gray-900'}`}>
        {allClear ? (
          <p className="flex items-center gap-2.5 text-sm font-black text-emerald-800">
            <CheckCircle2 className="w-5 h-5" /> Rien de critique. La meilleure action : de la prospection — le fondateur est le canal.
          </p>
        ) : (
          <p className="flex items-center gap-2.5 text-sm font-black text-white">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            {urgent.length} action(s) à traiter aujourd’hui — dans l’ordre ci-dessous.
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Colonne actions */}
        <div className="space-y-2.5 min-w-0">
          {actions.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="font-bold text-gray-700">Tout est traité.</p>
            </div>
          )}
          {urgent.map(a => <ActionCard key={a.id} a={a} />)}
          {rest.length > 0 && urgent.length > 0 && (
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider pt-2 px-1">Ensuite</p>
          )}
          {rest.map(a => <ActionCard key={a.id} a={a} />)}

          {/* Relances dues : le détail appelable */}
          {facts.prospect_due_list.length > 0 && (
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 mt-4">
              <p className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wide mb-3">
                <CalendarClock className="w-4 h-4 text-amber-600" /> À appeler / relancer maintenant
              </p>
              <div className="space-y-1.5">
                {facts.prospect_due_list.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2">
                    <span className="text-xs">{p.kind === 'buyer' ? '🛒' : '🌾'}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{p.next_action ?? 'action non précisée'} · prévu le {new Date(p.next_action_date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    {p.phone && (
                      <a href={`tel:${p.phone}`} className="shrink-0 inline-flex items-center gap-1 text-[10px] font-black text-brand-700 bg-brand-50 border border-brand-100 px-2 py-1 rounded-lg hover:bg-brand-100">
                        <Phone className="w-3 h-3" /> {p.phone}
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <Link to="/admin/prospection" className="inline-flex items-center gap-1 mt-3 text-[11px] font-black text-brand-700 hover:underline">
                Ouvrir le CRM <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Colonne cap */}
        <div className="space-y-4">
          {/* Sortie de phase 1 */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-4">
            <p className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wide mb-3">
              <Target className="w-4 h-4 text-brand-600" /> Sortie de phase 1
            </p>
            <div className="space-y-3">
              {kpis.map(k => (
                <div key={k.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-gray-600">{k.label}</span>
                    <span className="text-[11px] font-black tabular-nums text-gray-900">{k.current}/{k.target}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${k.pct >= 100 ? 'bg-emerald-500' : 'bg-brand-500'}`} style={{ width: `${k.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-3">+ ≥2 témoignages publiables et 0 litige ouvert (plan §5.1).</p>
          </div>

          {/* Pouls 30 jours */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-4">
            <p className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wide mb-3">
              <TrendingUp className="w-4 h-4 text-brand-600" /> Pouls (30 jours)
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                <p className="text-lg font-black tabular-nums text-gray-900">{(facts.gmv_30d / 1).toLocaleString('fr-FR')} €</p>
                <p className="text-[10px] text-gray-500 font-bold">GMV</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                <p className="text-lg font-black tabular-nums text-gray-900">{facts.orders_30d}</p>
                <p className="text-[10px] text-gray-500 font-bold">Commandes</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                <p className="text-lg font-black tabular-nums text-gray-900">{facts.signups_7d}</p>
                <p className="text-[10px] text-gray-500 font-bold">Inscriptions (7 j)</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                <p className="text-lg font-black tabular-nums text-gray-900">{facts.quotes_7d}</p>
                <p className="text-[10px] text-gray-500 font-bold">Devis (7 j)</p>
              </div>
            </div>
            <Link to="/admin/croissance" className="inline-flex items-center gap-1 mt-3 text-[11px] font-black text-brand-700 hover:underline">
              Voir le funnel complet <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Prospection en un chiffre */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-4">
            <p className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wide mb-2">
              <Compass className="w-4 h-4 text-brand-600" /> Conquête
            </p>
            <p className="text-sm text-gray-700">
              <b className="tabular-nums">{facts.prospects_contacted}</b>/{facts.prospects_total} cibles contactées ·{' '}
              <b className="tabular-nums text-emerald-700">{facts.prospects_signed}</b> inscrites
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
