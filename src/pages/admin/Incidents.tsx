import { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, Loader2, X, AlertOctagon, CheckCircle2,
  ShieldAlert, PackageX, MessageSquareWarning,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../../components/AdminLayout';

/**
 * Incidents qualité (couche 3.4 du Product Trust Pipeline).
 * Alimentée automatiquement par les triggers SQL :
 *   litige ouvert → incident 'dispute'
 *   réception non conforme → incident 'reception'
 * Deux issues :
 *   « Classer sans suite » : résolution simple (malentendu, geste commercial…)
 *   « Confirmer l'incident » : confirm_product_incident() dépose une preuve
 *     'fail' immuable sur le critère éthique du producteur → son niveau de
 *     confiance redescend automatiquement jusqu'à contre-preuve.
 */

interface Incident {
  id: string;
  producer_id: string | null;
  product_id: string | null;
  order_id: string | null;
  source: 'dispute' | 'reception' | 'admin' | 'analysis';
  note: string | null;
  status: 'open' | 'resolved';
  created_at: string;
  resolved_at: string | null;
  producers?: { name: string } | null;
  products?: { name: string } | null;
  orders?: { order_number: string | null } | null;
}

const SOURCE_META: Record<Incident['source'], { icon: typeof AlertOctagon; label: string; cls: string }> = {
  dispute: { icon: MessageSquareWarning, label: 'Litige acheteur', cls: 'bg-red-100 text-red-700' },
  reception: { icon: PackageX, label: 'Réception non conforme', cls: 'bg-amber-100 text-amber-700' },
  admin: { icon: ShieldAlert, label: 'Signalement interne', cls: 'bg-gray-100 text-gray-700' },
  analysis: { icon: ShieldAlert, label: 'COA rejeté', cls: 'bg-purple-100 text-purple-700' },
};

export default function AdminIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('open');
  const [selected, setSelected] = useState<Incident | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('product_incidents')
      .select('*, producers(name), products(name), orders(order_number)')
      .order('created_at', { ascending: false });
    setIncidents((data as Incident[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const closeModal = () => { setSelected(null); setAdminNote(''); setError(''); };

  /** Classement sans suite : résolution simple, AUCUNE dégradation. */
  const dismissIncident = async () => {
    if (!selected) return;
    setBusy(true); setError('');
    const { error: err } = await supabase.from('product_incidents').update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      note: `${selected.note ?? ''}\n[Classé sans suite] ${adminNote.trim() || 'Sans conséquence pour le producteur.'}`,
    }).eq('id', selected.id);
    if (err) { setError(err.message); setBusy(false); return; }
    await supabase.from('admin_audit_log').insert({
      action: 'incident_dismissed', target_type: 'product_incident', target_id: selected.id,
      details: { note: adminNote },
    });
    setBusy(false); closeModal(); load();
  };

  /** Confirmation : preuve 'fail' immuable → dégradation du niveau de confiance. */
  const confirmIncident = async () => {
    if (!selected) return;
    if (adminNote.trim().length < 10) {
      setError('Le constat est obligatoire (10 caractères minimum) : il devient une preuve immuable.');
      return;
    }
    setBusy(true); setError('');
    const { data, error: err } = await supabase.rpc('confirm_product_incident', {
      p_incident: selected.id, p_note: adminNote.trim(),
    });
    if (err) { setError(err.message); setBusy(false); return; }
    await supabase.from('admin_audit_log').insert({
      action: 'incident_confirmed', target_type: 'product_incident', target_id: selected.id,
      details: { note: adminNote, result: data },
    });
    setBusy(false); closeModal(); load();
  };

  const filtered = incidents.filter(i => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    if (search) {
      const hay = `${i.producers?.name ?? ''} ${i.products?.name ?? ''} ${i.orders?.order_number ?? ''} ${i.note ?? ''}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const openCount = incidents.filter(i => i.status === 'open').length;

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;

  return (
    <div>
      <AdminPageHeader
        title="Incidents qualité"
        subtitle="Litiges et réceptions non conformes — un incident confirmé dégrade le niveau de confiance du producteur"
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Producteur, produit, commande…" className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="pl-10 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white appearance-none cursor-pointer">
            <option value="open">Ouverts ({openCount})</option>
            <option value="resolved">Résolus</option>
            <option value="all">Tous</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="font-bold text-gray-700">Aucun incident {filterStatus === 'open' ? 'ouvert' : ''}</p>
          <p className="text-sm text-gray-400 mt-1">Les litiges et réceptions non conformes apparaissent ici automatiquement.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inc => {
            const meta = SOURCE_META[inc.source];
            const Icon = meta.icon;
            return (
              <button key={inc.id} onClick={() => inc.status === 'open' ? setSelected(inc) : undefined}
                className={`w-full text-left bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-4 ${inc.status === 'open' ? 'hover:border-brand-200 hover:shadow-sm cursor-pointer' : 'opacity-70 cursor-default'}`}>
                <span className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${meta.cls}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${meta.cls}`}>{meta.label}</span>
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${inc.status === 'open' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                      {inc.status === 'open' ? 'Ouvert' : 'Résolu'}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(inc.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mt-1 truncate">
                    {inc.producers?.name ?? 'Producteur supprimé'}
                    {inc.products?.name ? ` — ${inc.products.name}` : ''}
                    {inc.orders?.order_number ? ` (${inc.orders.order_number})` : ''}
                  </p>
                  {inc.note && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 whitespace-pre-line">{inc.note}</p>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Modal de traitement */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-black text-gray-900 text-lg">Traiter l'incident</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-bold text-gray-900">{selected.producers?.name ?? '—'}{selected.products?.name ? ` — ${selected.products.name}` : ''}</p>
              <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{selected.note}</p>
            </div>

            <label className="block text-xs font-bold text-gray-700 mb-1.5">Constat de l'équipe</label>
            <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} rows={3}
              placeholder="Ex : quantité manquante confirmée par photos de l'acheteur, le producteur reconnaît l'erreur de préparation…"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none resize-none" />

            {error && <p className="text-xs text-red-600 font-semibold mt-2">{error}</p>}

            <div className="mt-4 space-y-2">
              <button onClick={confirmIncident} disabled={busy}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-black disabled:opacity-50 flex items-center justify-center gap-2">
                <AlertOctagon className="w-4 h-4" />
                Confirmer l'incident (dégrade le niveau de confiance)
              </button>
              <p className="text-[11px] text-gray-400 text-center -mt-0.5">
                Dépose une preuve « fail » immuable sur le critère éthique — réhabilitation par contre-preuve après action corrective.
              </p>
              <button onClick={dismissIncident} disabled={busy}
                className="w-full py-2.5 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-black disabled:opacity-50 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Classer sans suite (aucune conséquence)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
