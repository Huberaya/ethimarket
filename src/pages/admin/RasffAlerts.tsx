import { useState, useEffect, useCallback } from 'react';
import { Loader2, Radar, ExternalLink, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../../components/AdminLayout';

/**
 * Veille RASFF (Phase 3). Chaque nuit, la base interroge le
 * portail public européen et retient les notifications qui
 * touchent NOS couples produit × origine (cron trust-daily-review).
 * Une alerte retenue = notification cloche + ligne ici.
 * Zéro action requise au quotidien : cette page est le journal.
 */

interface RasffAlert {
  id: string;
  reference: string;
  subject: string;
  origin_country_fr: string;
  matched_keyword: string;
  classification: string | null;
  risk: string | null;
  validation_date: string | null;
  created_at: string;
}

const RISK_CLS: Record<string, string> = {
  'serious': 'bg-red-100 text-red-700',
  'potentially serious': 'bg-amber-100 text-amber-700',
  'potential risk': 'bg-amber-50 text-amber-600',
  'not serious': 'bg-gray-100 text-gray-600',
};

export default function AdminRasffAlerts() {
  const [alerts, setAlerts] = useState<RasffAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [pollMsg, setPollMsg] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase.from('rasff_alerts')
      .select('id, reference, subject, origin_country_fr, matched_keyword, classification, risk, validation_date, created_at')
      .order('created_at', { ascending: false }).limit(200);
    setAlerts((data as RasffAlert[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  /** Force un cycle complet : dépouille les réponses en attente + lance une requête. */
  const pollNow = async () => {
    setPolling(true); setPollMsg('');
    const { data: matched, error: e1 } = await supabase.rpc('rasff_process_responses');
    const { error: e2 } = await supabase.rpc('rasff_poll_request');
    if (e1 || e2) setPollMsg((e1 ?? e2)?.message ?? 'Erreur');
    else setPollMsg(`Dépouillement : ${matched ?? 0} alerte(s) retenue(s). Nouvelle requête envoyée — les réponses seront dépouillées au prochain passage (ou re-cliquez dans une minute).`);
    setPolling(false);
    void load();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;

  return (
    <div>
      <AdminPageHeader
        title="Veille RASFF"
        subtitle="Alertes sanitaires européennes filtrées sur nos filières produit × origine — vérification automatique chaque nuit"
      />

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <button onClick={() => void pollNow()} disabled={polling}
          className="px-4 py-2 text-xs font-black rounded-xl bg-brand-600 text-white hover:bg-brand-700 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${polling ? 'animate-spin' : ''}`} /> Vérifier maintenant
        </button>
        <a href="https://webgate.ec.europa.eu/rasff-window/screen/search" target="_blank" rel="noopener noreferrer"
          className="text-xs font-bold text-brand-700 hover:underline inline-flex items-center gap-1">
          Portail RASFF officiel <ExternalLink className="w-3 h-3" />
        </a>
        {pollMsg && <p className="text-xs text-gray-500 w-full">{pollMsg}</p>}
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Radar className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="font-bold text-gray-700">Aucune alerte RASFF ne touche nos filières</p>
          <p className="text-sm text-gray-400 mt-1">
            La base vérifie chaque nuit les nouvelles notifications européennes contre nos couples produit × origine actifs.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  RASFF {a.reference}
                </span>
                {a.risk && (
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${RISK_CLS[a.risk] ?? 'bg-gray-100 text-gray-600'}`}>
                    {a.risk}
                  </span>
                )}
                {a.classification && <span className="text-[11px] text-gray-400">{a.classification}</span>}
                <span className="text-[11px] text-gray-400 ml-auto">{new Date(a.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <p className="text-sm font-bold text-gray-900 mt-1.5">{a.subject}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Filière EthiMarket concernée : <span className="font-bold">{a.matched_keyword}</span> × <span className="font-bold">{a.origin_country_fr}</span>
                {' '}— pensez à vérifier les producteurs de cette filière.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
