import { useState, useEffect, useCallback } from 'react';
import {
  Loader2, Activity, Mail, Clock3, Radar, RefreshCw,
  CheckCircle2, XCircle, AlertTriangle,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../../components/AdminLayout';

/**
 * Santé de la plateforme : e-mails transactionnels, cron quotidien
 * (dégradation certifs + veille RASFF), files d'attente métier.
 * Lecture seule — tout vient de get_platform_health() (admin only).
 */

interface Health {
  emails: {
    by_status: Record<string, number>;
    recent: { recipient: string; kind: string | null; subject: string | null; status: string; error: string | null; created_at: string }[];
  };
  cron: { status: string; started_at: string; message: string }[];
  rasff: { alerts_total: number; last_alert_at: string | null; polls_pending: number };
  business: {
    producers: number; products_active: number; orders_30d: number;
    quotes_30d: number; incidents_open: number; analyses_awaiting: number;
    labs_pending: number;
  };
  generated_at: string;
}

const EMAIL_STATUS_CLS: Record<string, string> = {
  sent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  queued: 'bg-amber-50 text-amber-800 border-amber-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

function Tile({ label, value, warn }: { label: string; value: number | string; warn?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl border-2 p-4 ${warn ? 'border-amber-300' : 'border-gray-100'}`}>
      <p className="text-xl font-black text-gray-900 tabular-nums">{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function AdminHealth() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase.rpc('get_platform_health');
    if (err) setError(err.message);
    else setHealth(data as Health);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading && !health) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;
  if (error) return <div className="p-8 text-sm text-red-600 font-semibold">{error}</div>;
  if (!health) return null;

  const b = health.business;
  const emailStatuses = Object.entries(health.emails.by_status ?? {});
  const failedEmails = health.emails.by_status?.failed ?? 0;
  const lastCron = health.cron[0];

  return (
    <div>
      <AdminPageHeader
        title="Santé de la plateforme"
        subtitle="E-mails, automatismes nocturnes, files d'attente — tout ce qui doit tourner tout seul"
      />

      <div className="flex justify-end mb-4">
        <button onClick={() => void load()} disabled={loading}
          className="px-4 py-2 text-xs font-black rounded-xl border border-gray-200 text-gray-600 hover:border-brand-400 inline-flex items-center gap-1.5 cursor-pointer">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </button>
      </div>

      {/* Files d'attente à traiter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        <Tile label="Producteurs" value={b.producers} />
        <Tile label="Produits actifs" value={b.products_active} />
        <Tile label="Commandes (30 j)" value={b.orders_30d} />
        <Tile label="Devis (30 j)" value={b.quotes_30d} />
        <Tile label="Incidents ouverts" value={b.incidents_open} warn={b.incidents_open > 0} />
        <Tile label="COA à vérifier" value={b.analyses_awaiting} warn={b.analyses_awaiting > 0} />
        <Tile label="Labos à contre-vérifier" value={b.labs_pending} warn={b.labs_pending > 0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cron quotidien */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-black text-gray-900 flex items-center gap-2 mb-1">
            <Clock3 className="w-4 h-4 text-brand-600" /> Automatismes nocturnes (3h00)
          </h3>
          <p className="text-[11px] text-gray-400 mb-4">
            Dégradation des certifications expirées + veille RASFF. Dernier passage :{' '}
            {lastCron ? new Date(lastCron.started_at).toLocaleString('fr-FR') : '—'}
          </p>
          <div className="space-y-2">
            {health.cron.map((c, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs">
                {c.status === 'succeeded'
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                <span className="text-gray-500 tabular-nums">{new Date(c.started_at).toLocaleDateString('fr-FR')}</span>
                <span className={`font-bold ${c.status === 'succeeded' ? 'text-emerald-700' : 'text-red-700'}`}>{c.status}</span>
              </div>
            ))}
            {health.cron.length === 0 && <p className="text-xs text-gray-400">Aucune exécution enregistrée.</p>}
          </div>
        </div>

        {/* Veille RASFF */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-black text-gray-900 flex items-center gap-2 mb-1">
            <Radar className="w-4 h-4 text-brand-600" /> Veille RASFF
          </h3>
          <p className="text-[11px] text-gray-400 mb-4">Alertes sanitaires européennes filtrées sur nos filières.</p>
          <div className="grid grid-cols-3 gap-3">
            <Tile label="Alertes retenues" value={health.rasff.alerts_total} />
            <Tile label="Requêtes en attente" value={health.rasff.polls_pending} />
            <Tile label="Dernière alerte" value={health.rasff.last_alert_at ? new Date(health.rasff.last_alert_at).toLocaleDateString('fr-FR') : '—'} />
          </div>
        </div>
      </div>

      {/* E-mails */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-6">
        <h3 className="font-black text-gray-900 flex items-center gap-2 mb-1">
          <Mail className="w-4 h-4 text-brand-600" /> E-mails transactionnels (30 derniers jours)
        </h3>
        {failedEmails > 0 && (
          <p className="text-xs font-bold text-red-700 mt-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> {failedEmails} échec(s) — vérifier la clé Resend et le domaine expéditeur.
          </p>
        )}
        <div className="flex gap-2 flex-wrap mt-3 mb-4">
          {emailStatuses.length === 0 && <p className="text-xs text-gray-400">Aucun e-mail sur la période.</p>}
          {emailStatuses.map(([status, count]) => (
            <span key={status} className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${EMAIL_STATUS_CLS[status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
              {status} : {count}
            </span>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="py-2 pr-3 font-bold">Date</th>
                <th className="py-2 pr-3 font-bold">Destinataire</th>
                <th className="py-2 pr-3 font-bold">Type</th>
                <th className="py-2 pr-3 font-bold">Sujet</th>
                <th className="py-2 font-bold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {health.emails.recent.map((e, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2 pr-3 text-gray-400 whitespace-nowrap">{new Date(e.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="py-2 pr-3 text-gray-700 font-semibold">{e.recipient}</td>
                  <td className="py-2 pr-3 text-gray-500">{e.kind ?? '—'}</td>
                  <td className="py-2 pr-3 text-gray-500 max-w-56 truncate">{e.subject ?? '—'}</td>
                  <td className="py-2">
                    <span className={`font-black px-2 py-0.5 rounded-full border ${EMAIL_STATUS_CLS[e.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {e.status}
                    </span>
                    {e.error && <p className="text-red-600 mt-0.5 max-w-56 truncate">{e.error}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 mt-4 flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5" />
        Instantané généré le {new Date(health.generated_at).toLocaleString('fr-FR')}
      </p>
    </div>
  );
}
