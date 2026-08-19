import { useState, useEffect, useCallback } from 'react';
import {
  Loader2, X, FlaskConical, Search, Filter, ExternalLink, Plus,
  ShieldCheck, AlertTriangle, Pencil,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../../components/AdminLayout';

/**
 * Annuaire des laboratoires d'analyses (contre-vérification des tests).
 * Même philosophie que la base des organismes de certification :
 * chaque labo porte son accréditation ISO/IEC 17025 (organisme,
 * n°, LIEN vers le registre public) et un niveau de confiance
 * interne. « Vérifié » = notre équipe a contre-vérifié
 * l'accréditation AU REGISTRE (pas sur le site du labo).
 */

export interface Laboratory {
  id: string;
  name: string;
  network: string | null;
  country: string;
  city: string | null;
  region: string | null;
  website: string | null;
  email_contact: string | null;
  phone: string | null;
  languages: string[];
  iso17025: boolean;
  accreditation_body: string | null;
  accreditation_number: string | null;
  accreditation_url: string | null;
  analysis_scopes: string[];
  trust_level: 'verified' | 'pending' | 'caution' | 'blacklisted';
  is_active: boolean;
  internal_notes: string | null;
  price_note: string | null;
  last_verified_at: string | null;
}

export const SCOPE_LABELS: Record<string, string> = {
  pesticide_residues: 'Résidus de pesticides',
  aflatoxins: 'Aflatoxines',
  ochratoxin_a: 'Ochratoxine A',
  salmonella: 'Salmonella',
  heavy_metals: 'Métaux lourds',
  sudan_dyes: 'Colorants Soudan',
  ethylene_oxide: 'Oxyde d\'éthylène',
  pyrrolizidine_alkaloids: 'Alcaloïdes pyrrolizidiniques',
  water_activity: 'Activité de l\'eau / humidité',
  gmo: 'OGM',
  npop_organic: 'Panel bio (NPOP/UE)',
};

const TRUST_META: Record<Laboratory['trust_level'], { emoji: string; label: string; cls: string }> = {
  verified: { emoji: '✅', label: 'Accréditation contre-vérifiée', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending: { emoji: '⏳', label: 'À contre-vérifier', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  caution: { emoji: '⚠️', label: 'Vigilance', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  blacklisted: { emoji: '⛔', label: 'Liste noire', cls: 'bg-red-50 text-red-700 border-red-200' },
};

const EMPTY_FORM = {
  name: '', network: '', country: '', city: '', region: '', website: '',
  email_contact: '', phone: '', iso17025: true, accreditation_body: '',
  accreditation_number: '', accreditation_url: '', analysis_scopes: [] as string[],
  trust_level: 'pending' as Laboratory['trust_level'], internal_notes: '', price_note: '',
};

export default function AdminLaboratories() {
  const [labs, setLabs] = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('ALL');
  const [filterTrust, setFilterTrust] = useState('ALL');
  const [editing, setEditing] = useState<Laboratory | 'new' | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase.from('laboratories')
      .select('*').order('country').order('name');
    setLabs((data as Laboratory[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (lab: Laboratory | 'new') => {
    setEditing(lab);
    setError('');
    if (lab === 'new') { setForm(EMPTY_FORM); return; }
    setForm({
      name: lab.name, network: lab.network ?? '', country: lab.country,
      city: lab.city ?? '', region: lab.region ?? '', website: lab.website ?? '',
      email_contact: lab.email_contact ?? '', phone: lab.phone ?? '',
      iso17025: lab.iso17025, accreditation_body: lab.accreditation_body ?? '',
      accreditation_number: lab.accreditation_number ?? '',
      accreditation_url: lab.accreditation_url ?? '',
      analysis_scopes: lab.analysis_scopes ?? [],
      trust_level: lab.trust_level, internal_notes: lab.internal_notes ?? '',
      price_note: lab.price_note ?? '',
    });
  };

  const save = async () => {
    if (!form.name.trim() || !form.country.trim()) { setError('Nom et pays sont obligatoires.'); return; }
    setBusy(true); setError('');
    const payload = {
      name: form.name.trim(), network: form.network.trim() || null,
      country: form.country.trim(), city: form.city.trim() || null,
      region: form.region.trim() || null, website: form.website.trim() || null,
      email_contact: form.email_contact.trim() || null, phone: form.phone.trim() || null,
      iso17025: form.iso17025,
      accreditation_body: form.accreditation_body.trim() || null,
      accreditation_number: form.accreditation_number.trim() || null,
      accreditation_url: form.accreditation_url.trim() || null,
      analysis_scopes: form.analysis_scopes,
      trust_level: form.trust_level,
      internal_notes: form.internal_notes.trim() || null,
      price_note: form.price_note.trim() || null,
      ...(form.trust_level === 'verified' ? { last_verified_at: new Date().toISOString() } : {}),
    };
    const { error: err } = editing === 'new'
      ? await supabase.from('laboratories').insert(payload)
      : await supabase.from('laboratories').update(payload).eq('id', (editing as Laboratory).id);
    setBusy(false);
    if (err) { setError(err.message); return; }
    setEditing(null); load();
  };

  const countries = [...new Set(labs.map(l => l.country))].sort();
  const filtered = labs.filter(l => {
    if (filterCountry !== 'ALL' && l.country !== filterCountry) return false;
    if (filterTrust !== 'ALL' && l.trust_level !== filterTrust) return false;
    if (search) {
      const hay = `${l.name} ${l.network ?? ''} ${l.country} ${l.city ?? ''} ${l.accreditation_body ?? ''}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const verifiedCount = labs.filter(l => l.trust_level === 'verified').length;

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;

  return (
    <div>
      <AdminPageHeader
        title="Laboratoires d'analyses"
        subtitle={`Base de contre-vérification des tests — ${labs.length} labos, ${verifiedCount} accréditations contre-vérifiées au registre`}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, réseau, pays, accréditeur…"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)}
            className="pl-10 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-white appearance-none cursor-pointer">
            <option value="ALL">Tous pays</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <select value={filterTrust} onChange={e => setFilterTrust(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-white appearance-none cursor-pointer">
          <option value="ALL">Tous niveaux</option>
          <option value="verified">✅ Contre-vérifiés</option>
          <option value="pending">⏳ À contre-vérifier</option>
          <option value="caution">⚠️ Vigilance</option>
          <option value="blacklisted">⛔ Liste noire</option>
        </select>
        <button onClick={() => openEdit('new')}
          className="px-4 py-2.5 text-xs font-black rounded-xl bg-brand-600 text-white hover:bg-brand-700 inline-flex items-center gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> Ajouter un labo
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map(lab => {
          const trust = TRUST_META[lab.trust_level];
          return (
            <div key={lab.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-black text-gray-900 truncate">{lab.name}</p>
                  <p className="text-xs text-gray-500">
                    {lab.network ? `${lab.network} · ` : ''}{lab.city ? `${lab.city}, ` : ''}{lab.country}
                  </p>
                </div>
                <button onClick={() => openEdit(lab)} className="shrink-0 text-gray-400 hover:text-brand-600 cursor-pointer"><Pencil className="w-4 h-4" /></button>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${trust.cls}`}>{trust.emoji} {trust.label}</span>
                {lab.iso17025 && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">ISO/IEC 17025</span>}
              </div>

              {lab.accreditation_body && (
                <p className="text-[11px] text-gray-500 mt-2">
                  Accrédité par <span className="font-bold">{lab.accreditation_body}</span>
                  {lab.accreditation_number ? ` (n° ${lab.accreditation_number})` : ''}
                  {lab.accreditation_url && (
                    <a href={lab.accreditation_url} target="_blank" rel="noopener noreferrer"
                      className="ml-1.5 text-brand-700 font-bold hover:underline inline-flex items-center gap-0.5">
                      registre <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </p>
              )}

              <div className="flex flex-wrap gap-1 mt-2">
                {(lab.analysis_scopes ?? []).map(s => (
                  <span key={s} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                    {SCOPE_LABELS[s] ?? s}
                  </span>
                ))}
              </div>

              {lab.internal_notes && <p className="text-[11px] text-gray-400 italic mt-2 line-clamp-2">{lab.internal_notes}</p>}
              {lab.last_verified_at && (
                <p className="text-[10px] text-emerald-600 font-semibold mt-1.5">
                  <ShieldCheck className="w-3 h-3 inline mr-0.5" />
                  Contre-vérifié le {new Date(lab.last_verified_at).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FlaskConical className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-700">Aucun laboratoire dans cette vue</p>
        </div>
      )}

      {/* Modal ajout/édition */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-black text-gray-900 text-lg">{editing === 'new' ? 'Ajouter un laboratoire' : 'Modifier le laboratoire'}</h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block sm:col-span-2">
                <span className="text-xs font-bold text-gray-700">Nom *</span>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-700">Réseau (SGS, Eurofins…)</span>
                <input value={form.network} onChange={e => setForm(f => ({ ...f, network: e.target.value }))}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-700">Pays * (nom FR, ex. Éthiopie)</span>
                <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-700">Ville</span>
                <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-700">Site web</span>
                <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-700">E-mail officiel (confirmation de rapports)</span>
                <input value={form.email_contact} onChange={e => setForm(f => ({ ...f, email_contact: e.target.value }))}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-700">Téléphone</span>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
              </label>
            </div>

            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
              <p className="text-xs font-black text-blue-900 mb-2">Accréditation ISO/IEC 17025 — le cœur de la contre-vérification</p>
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="checkbox" checked={form.iso17025} onChange={e => setForm(f => ({ ...f, iso17025: e.target.checked }))} className="w-4 h-4 accent-brand-600" />
                <span className="text-xs font-bold text-gray-700">Labo accrédité ISO/IEC 17025</span>
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-[11px] font-bold text-gray-600">Organisme (COFRAC, NABL…)</span>
                  <input value={form.accreditation_body} onChange={e => setForm(f => ({ ...f, accreditation_body: e.target.value }))}
                    className="mt-1 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
                </label>
                <label className="block">
                  <span className="text-[11px] font-bold text-gray-600">N° d'accréditation</span>
                  <input value={form.accreditation_number} onChange={e => setForm(f => ({ ...f, accreditation_number: e.target.value }))}
                    className="mt-1 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
                </label>
                <label className="block">
                  <span className="text-[11px] font-bold text-gray-600">URL du registre public</span>
                  <input value={form.accreditation_url} onChange={e => setForm(f => ({ ...f, accreditation_url: e.target.value }))}
                    className="mt-1 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
                </label>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold text-gray-700 mb-1.5">Domaines d'analyses</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(SCOPE_LABELS).map(([key, label]) => {
                  const on = form.analysis_scopes.includes(key);
                  return (
                    <button key={key} onClick={() => setForm(f => ({
                      ...f,
                      analysis_scopes: on ? f.analysis_scopes.filter(s => s !== key) : [...f.analysis_scopes, key],
                    }))}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer ${on ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'}`}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <label className="block">
                <span className="text-xs font-bold text-gray-700">Niveau de confiance</span>
                <select value={form.trust_level} onChange={e => setForm(f => ({ ...f, trust_level: e.target.value as Laboratory['trust_level'] }))}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none bg-white cursor-pointer">
                  <option value="pending">⏳ À contre-vérifier</option>
                  <option value="verified">✅ Accréditation contre-vérifiée au registre</option>
                  <option value="caution">⚠️ Vigilance</option>
                  <option value="blacklisted">⛔ Liste noire</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-700">Note tarifaire (convention, fourchettes)</span>
                <input value={form.price_note} onChange={e => setForm(f => ({ ...f, price_note: e.target.value }))}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
              </label>
            </div>
            <label className="block mt-3">
              <span className="text-xs font-bold text-gray-700">Notes internes</span>
              <textarea value={form.internal_notes} onChange={e => setForm(f => ({ ...f, internal_notes: e.target.value }))} rows={2}
                className="mt-1 w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </label>

            {form.trust_level === 'verified' && (
              <p className="text-[11px] text-emerald-700 mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> En enregistrant, la date de contre-vérification sera mise à aujourd'hui.
              </p>
            )}
            {form.trust_level === 'blacklisted' && (
              <p className="text-[11px] text-red-700 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Les COA émis par un labo en liste noire doivent être rejetés.
              </p>
            )}
            {error && <p className="text-xs text-red-600 font-semibold mt-2">{error}</p>}

            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setEditing(null)} className="px-4 py-2.5 text-sm font-bold rounded-xl border border-gray-200 text-gray-600 cursor-pointer">Annuler</button>
              <button onClick={() => void save()} disabled={busy}
                className="px-5 py-2.5 text-sm font-black rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 cursor-pointer">
                {busy ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
