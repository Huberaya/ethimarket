// =============================================================
// EthiMarket — Panneau « Analyses de laboratoire » sur une
// commande (couche 4, Phase 2).
//
//  - ACHETEUR ou PRODUCTEUR : demande une analyse en un clic
//    parmi celles recommandées par le moteur de risque UE
//    (ou une analyse libre).
//  - PRODUCTEUR : fait avancer le circuit (échantillon envoyé,
//    rapport reçu) avec l'annuaire de labos et le registre
//    d'accréditation du pays sous les yeux.
//  - Le verdict final (COA vérifié/rejeté) appartient à l'admin.
// =============================================================

import { useEffect, useState } from 'react';
import { FlaskConical, ExternalLink, Plus } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { supabase } from '../../lib/supabase';
import {
  recommendedAnalyses, resolveLabs, ANALYSIS_STATUS_META,
  type RecommendedAnalysis,
} from '../../lib/labDirectory';
import {
  getOrderAnalyses, requestAnalysis, markSampleSent, markReportReceived,
  explainAnalysisError, type LotAnalysis,
} from '../../lib/lotAnalyses';
import { FileUpload } from '../ui/FileUpload';

export default function LotAnalysisPanel({
  orderId, productId, producerId, productName, isProducer, userId,
}: {
  orderId: string;
  productId: string | null;
  producerId: string | null;
  productName: string | null | undefined;
  isProducer: boolean;
  userId: string;
}) {
  const { tx } = useI18n();
  const [analyses, setAnalyses] = useState<LotAnalysis[] | null>(null);
  const [productInfo, setProductInfo] = useState<{ product_type: string | null; country: string | null; certifications: string[] | null } | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, { lab: string; report: string; file: string }>>({});

  const originCountry = productInfo?.country ?? null;
  const isOrganic = (productInfo?.certifications ?? []).some(c => /bio|organic|ecocert/i.test(c));
  const recos = recommendedAnalyses(productInfo?.product_type, productName, originCountry, isOrganic);
  const labs = resolveLabs(originCountry);

  const reload = async () => setAnalyses(await getOrderAnalyses(orderId));
  useEffect(() => {
    void reload();
    if (productId) {
      void supabase.from('products').select('product_type, country, certifications')
        .eq('id', productId).maybeSingle()
        .then(({ data }) => setProductInfo(data ?? { product_type: null, country: null, certifications: null }));
    } else {
      setProductInfo({ product_type: null, country: null, certifications: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, productId]);

  if (analyses === null || productInfo === null) return null;
  // Rien à montrer si aucune analyse en cours ET aucune recommandation
  if (analyses.length === 0 && recos.length === 0) return null;

  const run = async (fn: () => Promise<string | null>) => {
    setBusy(true);
    const err = await fn();
    setBusy(false);
    if (err) alert(explainAnalysisError(err)); else void reload();
  };

  const request = (r: RecommendedAnalysis | { label: string; hazard?: null }) =>
    run(() => requestAnalysis({
      orderId, productId, producerId, requestedBy: userId,
      label: r.label, hazard: 'reason' in r ? null : undefined,
    }));

  const draft = (id: string) => drafts[id] ?? { lab: '', report: '', file: '' };
  const setDraft = (id: string, patch: Partial<{ lab: string; report: string; file: string }>) =>
    setDrafts(d => ({ ...d, [id]: { ...draft(id), ...patch } }));

  return (
    <div className="mt-4 rounded-xl border-2 border-indigo-100 bg-indigo-50/30 p-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-xs font-black text-gray-800 flex items-center gap-1.5">
          <FlaskConical className="w-4 h-4 text-indigo-600" />
          {tx('Analyses de laboratoire du lot')}
        </p>
        <button onClick={() => setShowPicker(s => !s)} disabled={busy}
          className="text-[11px] font-black text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> {tx('Commander une analyse')}
        </button>
      </div>
      <p className="text-[11px] text-gray-500 mt-1">
        {tx('L\'analyse est payée par le lot (100-400 € selon le panel) — EthiMarket vérifie ensuite le rapport auprès du laboratoire émetteur.')}
      </p>

      {/* Sélecteur d'analyses recommandées */}
      {showPicker && (
        <div className="mt-3 rounded-lg border border-indigo-200 bg-white p-3 space-y-2">
          {recos.length === 0 && (
            <p className="text-[11px] text-gray-500">{tx('Aucune analyse spécifique exigée par les listes UE pour cette filière.')}</p>
          )}
          {recos.map((r, i) => (
            <div key={i} className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-800">
                  {r.mandatory ? '🔴' : '🟠'} {r.label}
                  <span className="font-normal text-gray-400"> · {r.method} · {r.priceRange[0]}-{r.priceRange[1]} €</span>
                </p>
                <p className="text-[11px] text-gray-500">{r.reason}</p>
              </div>
              <button onClick={() => { void request(r); setShowPicker(false); }} disabled={busy}
                className="shrink-0 px-3 py-1.5 text-[11px] font-black rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer">
                {tx('Demander')}
              </button>
            </div>
          ))}
          {/* Où faire analyser : annuaire embarqué */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-600 mb-1">{tx('Laboratoires présents dans votre pays :')}</p>
            <div className="flex flex-wrap gap-2">
              {labs.networks.map(n => (
                <a key={n.name} href={n.directoryUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-indigo-700 hover:underline inline-flex items-center gap-0.5">
                  {n.name} <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {tx('Vérification de l\'accréditation :')}{' '}
              <a href={labs.accreditation.url} target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:underline">
                {labs.accreditation.name}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Analyses en cours */}
      {analyses.length > 0 && (
        <div className="mt-3 space-y-2.5">
          {analyses.map(a => {
            const meta = ANALYSIS_STATUS_META[a.status];
            const d = draft(a.id);
            return (
              <div key={a.id} className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-xs font-bold text-gray-800">{a.analysis_label}</p>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${meta.cls}`}>
                    {meta.emoji} {tx(meta.labelFr)}
                  </span>
                </div>
                {a.lab_name && <p className="text-[11px] text-gray-500 mt-1">{tx('Laboratoire :')} {a.lab_name}{a.report_number ? ` · ${tx('rapport')} ${a.report_number}` : ''}</p>}
                {a.admin_note && (a.status === 'verified' || a.status === 'rejected') && (
                  <p className="text-[11px] text-gray-500 mt-1 italic">{a.admin_note}</p>
                )}

                {/* Producteur : avancer le circuit */}
                {isProducer && a.status === 'requested' && (
                  <div className="mt-2 flex gap-2 flex-wrap items-center">
                    <input value={d.lab} onChange={e => setDraft(a.id, { lab: e.target.value })}
                      placeholder={tx('Nom du laboratoire choisi')}
                      className="flex-1 min-w-40 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-400" />
                    <button onClick={() => run(() => markSampleSent(a.id, d.lab, originCountry ?? ''))} disabled={busy}
                      className="px-3 py-1.5 text-[11px] font-black rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
                      📦 {tx('Échantillon envoyé')}
                    </button>
                  </div>
                )}
                {isProducer && a.status === 'sample_sent' && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2 flex-wrap items-center">
                      <input value={d.report} onChange={e => setDraft(a.id, { report: e.target.value })}
                        placeholder={tx('N° du rapport (COA)')}
                        className="flex-1 min-w-40 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-400" />
                      <button onClick={() => run(() => markReportReceived(a.id, d.report, d.file))} disabled={busy}
                        className="px-3 py-1.5 text-[11px] font-black rounded-lg bg-amber-600 text-white hover:bg-amber-700 cursor-pointer">
                        🧪 {tx('Rapport reçu')}
                      </button>
                    </div>
                    <FileUpload
                      bucket="lab-analyses"
                      folder={`analyses/${orderId}/${a.id}`}
                      currentFileUrl={d.file || undefined}
                      onUploadComplete={url => setDraft(a.id, { file: url })}
                      preview={false}
                    />
                  </div>
                )}
                {a.status === 'report_received' && (
                  <p className="text-[11px] text-amber-700 mt-1.5">
                    {tx('L\'équipe EthiMarket vérifie maintenant ce rapport auprès du laboratoire émetteur.')}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
