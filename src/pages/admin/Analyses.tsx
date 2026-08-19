import { useState, useEffect, useCallback } from 'react';
import {
  Loader2, X, FlaskConical, CheckCircle2, Ban, ExternalLink, FileText,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../../components/AdminLayout';
import { ANALYSIS_STATUS_META, coaVerificationSteps } from '../../lib/labDirectory';
import { judgeAnalysis, explainAnalysisError, type LotAnalysis } from '../../lib/lotAnalyses';

/**
 * Vérification des COA (couche 4, Phase 2).
 * Principe : un PDF se falsifie en 5 minutes — le COA se vérifie
 * auprès du LABO ÉMETTEUR (accréditation ISO/IEC 17025 dans le
 * registre national + confirmation du n° de rapport par le canal
 * officiel du labo). Les étapes guidées sont générées par
 * coaVerificationSteps() avec les bons registres selon le pays.
 *
 * verdict « vérifié » → remplit automatiquement le document
 *   coa_lot du dossier de lot de la commande ;
 * verdict « rejeté » → ouvre un incident qualité (boucle de
 *   dégradation existante dans /admin/incidents).
 */

type Row = LotAnalysis & {
  producers?: { name: string } | null;
  products?: { name: string } | null;
  orders?: { order_number: string | null } | null;
  laboratories?: { name: string; trust_level: string; accreditation_body: string | null; accreditation_url: string | null } | null;
};

export default function AdminAnalyses() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'to_verify' | 'in_progress' | 'done'>('to_verify');
  const [selected, setSelected] = useState<Row | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('lot_analyses')
      .select('*, producers(name), products(name), orders(order_number), laboratories(name, trust_level, accreditation_body, accreditation_url)')
      .order('created_at', { ascending: false });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const closeModal = () => { setSelected(null); setNote(''); setError(''); };

  const verdict = async (v: 'verified' | 'rejected') => {
    if (!selected) return;
    if (note.trim().length < 10) {
      setError('Le constat de vérification est obligatoire (10 caractères minimum).');
      return;
    }
    setBusy(true); setError('');
    const err = await judgeAnalysis(selected.id, v, note);
    if (err) { setError(explainAnalysisError(err)); setBusy(false); return; }
    await supabase.from('admin_audit_log').insert({
      action: `analysis_${v}`, target_type: 'lot_analysis', target_id: selected.id,
      details: { note, report_number: selected.report_number, lab: selected.lab_name },
    });
    setBusy(false); closeModal(); load();
  };

  const filtered = rows.filter(r => {
    if (filter === 'to_verify') return r.status === 'report_received';
    if (filter === 'in_progress') return r.status === 'requested' || r.status === 'sample_sent';
    return r.status === 'verified' || r.status === 'rejected';
  });

  const toVerifyCount = rows.filter(r => r.status === 'report_received').length;

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;

  return (
    <div>
      <AdminPageHeader
        title="Analyses de laboratoire"
        subtitle="Un COA se vérifie auprès du labo émetteur — jamais sur la seule foi du PDF"
      />

      <div className="flex gap-2 mb-5 flex-wrap">
        {([
          ['to_verify', `À vérifier (${toVerifyCount})`],
          ['in_progress', 'En cours au labo'],
          ['done', 'Jugées'],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-2 text-xs font-black rounded-xl border-2 cursor-pointer ${filter === key ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FlaskConical className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-700">Aucune analyse dans cette vue</p>
          <p className="text-sm text-gray-400 mt-1">Les demandes d'analyses des commandes apparaissent ici automatiquement.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const meta = ANALYSIS_STATUS_META[r.status];
            const clickable = r.status === 'report_received';
            return (
              <button key={r.id} onClick={() => clickable ? setSelected(r) : undefined}
                className={`w-full text-left bg-white rounded-2xl border border-gray-100 p-4 ${clickable ? 'hover:border-brand-200 hover:shadow-sm cursor-pointer' : 'cursor-default'}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${meta.cls}`}>{meta.emoji} {meta.labelFr}</span>
                  <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('fr-FR')}</span>
                  {r.orders?.order_number && <span className="text-xs font-bold text-gray-400">{r.orders.order_number}</span>}
                </div>
                <p className="text-sm font-bold text-gray-900 mt-1.5">{r.analysis_label}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {r.producers?.name ?? '—'}{r.products?.name ? ` — ${r.products.name}` : ''}
                  {r.lab_name ? ` · Labo : ${r.lab_name}` : ''}
                  {r.report_number ? ` · Rapport ${r.report_number}` : ''}
                </p>
                {r.admin_note && (r.status === 'verified' || r.status === 'rejected') && (
                  <p className="text-xs text-gray-400 italic mt-1">{r.admin_note}</p>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Modal de vérification */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-black text-gray-900 text-lg">Vérifier le COA</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-bold text-gray-900">{selected.analysis_label}</p>
              <p className="text-xs text-gray-500 mt-1">
                {selected.producers?.name ?? '—'} · Labo : {selected.lab_name ?? '—'} · Rapport : {selected.report_number ?? '—'}
              </p>
              {selected.report_url && (
                <a href={selected.report_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline mt-2">
                  <FileText className="w-3.5 h-3.5" /> Ouvrir le rapport <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Le labo vient-il de notre annuaire contre-vérifié ? */}
            {selected.laboratories ? (
              <div className={`rounded-xl border p-3 mb-4 ${selected.laboratories.trust_level === 'verified' ? 'border-emerald-200 bg-emerald-50/50' : selected.laboratories.trust_level === 'caution' ? 'border-orange-200 bg-orange-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
                <p className="text-xs font-black text-gray-800">
                  {selected.laboratories.trust_level === 'verified' ? '✅ Labo de notre base — accréditation déjà contre-vérifiée au registre'
                    : selected.laboratories.trust_level === 'caution' ? '⚠️ Labo de notre base — marqué « vigilance », redoublez de contrôles'
                    : '⏳ Labo de notre base — accréditation PAS ENCORE contre-vérifiée'}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {selected.laboratories.name}{selected.laboratories.accreditation_body ? ` · ${selected.laboratories.accreditation_body}` : ''}
                  {selected.laboratories.accreditation_url && (
                    <a href={selected.laboratories.accreditation_url} target="_blank" rel="noopener noreferrer" className="ml-1.5 font-bold text-brand-700 hover:underline">registre ↗</a>
                  )}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 mb-4">
                <p className="text-xs font-black text-red-800">🔍 Labo HORS de notre base — vérification complète obligatoire</p>
                <p className="text-[11px] text-red-700/80 mt-0.5">Suivez les 4 étapes ci-dessous, puis ajoutez ce labo dans l'annuaire (page Laboratoires) pour capitaliser la vérification.</p>
              </div>
            )}

            <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 mb-4">
              <p className="text-xs font-black text-indigo-900 mb-2">🔎 Étapes de vérification</p>
              <ul className="space-y-1.5">
                {coaVerificationSteps(selected.lab_name, selected.lab_country, selected.report_number).map((s, i) => (
                  <li key={i} className="text-[11px] text-indigo-900/80 leading-relaxed">{s}</li>
                ))}
              </ul>
            </div>

            <label className="block text-xs font-bold text-gray-700 mb-1.5">Constat de vérification</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
              placeholder="Ex : labo confirmé au registre NABL, rapport n° confirmé par e-mail du labo le 19/08, résultats sous les LMR."
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none resize-none" />

            {error && <p className="text-xs text-red-600 font-semibold mt-2">{error}</p>}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => verdict('verified')} disabled={busy}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                <CheckCircle2 className="w-4 h-4" /> COA vérifié
              </button>
              <button onClick={() => verdict('rejected')} disabled={busy}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-black disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                <Ban className="w-4 h-4" /> Rejeter
              </button>
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-2">
              Vérifié → remplit le document « COA du lot » de la commande. Rejeté → ouvre un incident qualité.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
