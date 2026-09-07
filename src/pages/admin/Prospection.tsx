import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2, X, Target, Search, Plus, Phone, Mail, Globe as GlobeIcon,
  ChevronRight, BookOpen, ChevronDown, ChevronUp, CalendarClock,
  Package, Lightbulb, Compass, ArrowRight, MessageSquareText, Copy, Check, Send,
  MapPin, Building2, Linkedin, ExternalLink, Database,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../../components/AdminLayout';
import { SEGMENT_PITCHES, WAVE1_PRODUCTS, productMatch } from '../../lib/strategyData';
import { messagesFor, mailtoHref, type OutreachMessage } from '../../lib/outreachTemplates';
import { productEmails } from '../../lib/productOutreach';
import { getWaves, waveOf, waveStats, normalizeCity, distinctCities, type Wave } from '../../lib/prospectionWaves';

/**
 * CRM de prospection (docs/STRATEGIE_GO_TO_MARKET.md).
 * Deux pipelines (acheteurs / producteurs) × 3 phases, statuts,
 * prochaine action datée, journal de contacts immuable, playbook
 * de phase intégré. Page admin → FR (langue de travail).
 */

interface Prospect {
  id: string;
  kind: 'buyer' | 'producer';
  phase: 1 | 2 | 3;
  segment: string;
  name: string;
  city: string | null;
  country: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  source: string | null;
  status: string;
  next_action: string | null;
  next_action_date: string | null;
  notes: string | null;
  contacted_at: string | null;
  replied_at: string | null;
  external_id: string | null;
  legal_name: string | null;
  siren: string | null;
  siret: string | null;
  region: string | null;
  address: string | null;
  contact_role: string | null;
  linkedin_url: string | null;
  likely_products: string[] | null;
  legal_source_url: string | null;
  contact_source_url: string | null;
  verified_on: string | null;
  legal_status: string | null;
  data_origin: string | null;
  quality_score?: number | null;
  catalog_only?: boolean;
}

interface Touch { id: string; channel: string; note: string; created_at: string }

// Viviers en consultation, nettoyés des hors-sujet (décision du 7 sept. 2026) :
// phase 1 = France (BANCO/OSM + SIRENE : identités légales vérifiées),
// phase 2 = Europe, phase 3 = Monde (Overture Maps : e-mails déduits des
// domaines des sites — à VÉRIFIER avant tout envoi, avertissement affiché).
const CATALOGUE_URLS: Record<number, string> = {
  1: '/data/prospects-france-5000.json',
  2: '/data/prospects-europe-phase2.json',
  3: '/data/prospects-north-america-phase3.json',
};
const CATALOGUE_TOTALS: Record<number, number> = { 1: 4898, 2: 12798, 3: 12533 };
const CATALOGUE_LABELS: Record<number, string> = { 1: 'Vivier France', 2: 'Vivier Europe', 3: 'Vivier Monde' };
/** Les e-mails des viviers 2-3 sont déduits des domaines : jamais « vérifiés ». */
const CATALOGUE_EMAILS_DERIVED: Record<number, boolean> = { 1: false, 2: true, 3: true };

const STATUS_META: Record<string, { label: string; cls: string }> = {
  a_contacter: { label: 'À contacter', cls: 'bg-gray-100 text-gray-700 border-gray-200' },
  contacte: { label: 'Contacté', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  relance: { label: 'Relancé', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  en_discussion: { label: 'En discussion', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  inscrit: { label: 'Inscrit ✓', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  actif: { label: 'Actif ★', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  refus: { label: 'Refus', cls: 'bg-red-50 text-red-600 border-red-200' },
  stop: { label: 'STOP (RGPD)', cls: 'bg-red-100 text-red-700 border-red-300' },
};

const SEGMENT_LABELS: Record<string, string> = {
  epicerie_bio: 'Épicerie bio', torrefacteur: 'Torréfacteur', restaurant: 'Restaurant',
  epicerie_en_ligne: 'Épicerie en ligne', biocoop: 'Magasin Biocoop', grossiste: 'Grossiste',
  chocolatier: 'Chocolatier', cosmetique: 'Cosmétique', centrale: 'Centrale d\'achat',
  food_service: 'Food-service', industriel: 'Industriel', concept_store: 'Concept store responsable',
  mode_responsable: 'Mode & accessoires responsables', entreprise_evenementiel: 'Entreprises, événementiel & associations',
  transformateur: 'Transformateur', maison_the: 'Maison de thé', bar_cocktail: 'Bar & mixologie',
  cafe: 'Café', vanille: 'Vanille', argane: 'Argane', safran: 'Safran', cacao: 'Cacao',
  epices: 'Épices', miel: 'Miel', quinoa: 'Quinoa', karite: 'Karité',
};

/** Playbook condensé par phase (miroir de la stratégie). */
const PHASE_PLAYBOOK: Record<number, { title: string; buyers: string; producers: string; exit: string }> = {
  1: {
    title: 'Phase 1 — Lancement : la preuve (M1-M3)',
    buyers: '20 épiceries bio indépendantes (Nantes puis Ouest) + 10 torréfacteurs + 8 restaurants + 5 épiceries en ligne. Canal : e-mails J0/J+4/J+10 du kit + appel. Max 30 nouveaux contacts/semaine. Objectif : 8-12 comptes, 5-10 commandes impeccables, 2 témoignages.',
    producers: '8 coopératives DÉJÀ certifiées sur 3 filières d\'ancrage : café Éthiopie (unions Yirgacheffe/Sidama/Oromia — FLO-ID vérifiables), vanille Madagascar (SAVA, registre Ecocert), argane Maroc (coopératives féminines IGP, Agadir/Essaouira). Amorçage : vérification offerte + 0% commission 6 mois.',
    exit: 'Sortie de phase : ≥10 commandes livrées conformes, ≥3 acheteurs récurrents, ≥2 témoignages publiables, 0 litige ouvert.',
  },
  2: {
    title: 'Phase 2 — Croissance : la répétabilité (M4-M9)',
    buyers: '30 magasins Biocoop (entrer par le magasin, pas la centrale) + 8 grossistes régionaux + 15 chocolatiers (argument EUDR cacao) + Belgique/Suisse romande + 8 marques cosmétiques indie. Levier nouveau : la preuve sociale de la phase 1 (témoignages sur /pour-les-professionnels).',
    producers: '+12 coopératives : cacao Ghana (GPS EUDR prêts), épices Inde/Sri Lanka (notre annuaire labos COA), miel Grèce, quinoa Pérou. Début de sélectivité : score qualité exigé.',
    exit: 'Sortie de phase : GMV ≥25 k€/mois ×3 mois, ≥25 acheteurs actifs, rétention M2 ≥40%, ≥20 producteurs vérifiés, hub 3PL signé.',
  },
  3: {
    title: 'Phase 3 — Échelle : la référence (M10+)',
    buyers: 'Centrales spécialisées (dossier référencement avec nos données de taux de service), Allemagne (1er marché bio UE, via hub Benelux), food-service, industriels bean-to-bar. Ouverture B2C réelle via le hub 3PL. Levier : casebook clients + presse (le QR de traçabilité est un sujet).',
    producers: 'Corridors de groupage actifs = recrutement massif (50+ producteurs). Extension Amérique latine (cacao fin, café Colombie) et Asie du Sud-Est. Programme ambassadeurs : les producteurs phase 1 parrainent.',
    exit: 'Ce n\'est plus une phase, c\'est le régime de croisière : on pilote au KPI (/admin/croissance).',
  },
};

const EMPTY_FORM = {
  kind: 'buyer' as 'buyer' | 'producer', phase: 1, segment: 'epicerie_bio', name: '',
  city: '', country: 'France', contact_name: '', email: '', phone: '', website: '',
  source: '', notes: '', next_action: '', next_action_date: '',
};

export default function AdminProspection() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [stats, setStats] = useState<{ due_today: number; reply_rate_pct: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState<'buyer' | 'producer' | 'products'>('buyer');
  const [view, setView] = useState<'crm' | 'catalogue'>('crm');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [phase, setPhase] = useState<number>(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterSegment, setFilterSegment] = useState('all');
  const [selectedWave, setSelectedWave] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [playbookOpen, setPlaybookOpen] = useState(false);
  const [selected, setSelected] = useState<Prospect | null>(null);
  const [touches, setTouches] = useState<Touch[]>([]);
  const [touchNote, setTouchNote] = useState('');
  const [touchChannel, setTouchChannel] = useState('email');
  const [openMessage, setOpenMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showAdd, setShowAdd] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [{ data }, { data: st }, catalogue] = await Promise.all([
      supabase.from('prospects').select('*').order('next_action_date', { ascending: true, nullsFirst: false }).order('name'),
      supabase.rpc('get_prospection_stats'),
      CATALOGUE_URLS[phase]
        ? fetch(CATALOGUE_URLS[phase]).then(r => r.ok ? r.json() as Promise<Prospect[]> : []).catch(() => [] as Prospect[])
        : Promise.resolve([] as Prospect[]),
    ]);
    const databaseProspects = (data as Prospect[]) ?? [];
    const databaseKeys = new Set(databaseProspects.flatMap(p => [p.external_id, p.siren ? `siren:${p.siren}` : null].filter(Boolean)));
    // Dédoublonnage aussi par SIREN promu (noté dans source) et par nom+ville,
    // car les colonnes external_id/siren n'existent pas encore en base.
    const promotedSirens = new Set(databaseProspects.map(p => (p.source?.match(/siren:(\d{9})/) ?? [])[1]).filter(Boolean));
    const promotedExtIds = new Set(databaseProspects.map(p => (p.source?.match(/ext:([\w-]+)/) ?? [])[1]).filter(Boolean));
    const dbNameCity = new Set(databaseProspects.map(p => `${p.name}|${p.city ?? ''}`.toLowerCase()));
    const missingFromDatabase = catalogue.filter(p =>
      !databaseKeys.has(p.external_id) && !databaseKeys.has(p.siren ? `siren:${p.siren}` : null)
      && !(p.siren && promotedSirens.has(p.siren))
      && !(p.external_id && promotedExtIds.has(p.external_id))
      && !dbNameCity.has(`${p.name}|${p.city ?? ''}`.toLowerCase()));
    const merged = [...databaseProspects, ...missingFromDatabase].sort((a, b) =>
      a.country.localeCompare(b.country, 'fr', { sensitivity: 'base' }) ||
      (a.city ?? 'ZZZZ').localeCompare(b.city ?? 'ZZZZ', 'fr', { sensitivity: 'base' }) || a.name.localeCompare(b.name, 'fr')
    );
    setProspects(merged);
    if (st) setStats(st as { due_today: number; reply_rate_pct: number });
    setLoading(false);
  }, [phase]);

  useEffect(() => { setLoading(true); void load(); }, [load]);

  const openProspect = async (p: Prospect) => {
    setSelected(p);
    if (p.catalog_only) { setTouches([]); return; }
    const { data } = await supabase.from('prospect_touches').select('*').eq('prospect_id', p.id).order('created_at', { ascending: false });
    setTouches((data as Touch[]) ?? []);
  };

  const setStatus = async (p: Prospect, status: string) => {
    if (p.catalog_only) return;
    setBusy(true);
    await supabase.from('prospects').update({ status }).eq('id', p.id);
    setBusy(false);
    setSelected(s => s ? { ...s, status } : s);
    load();
  };

  const saveNextAction = async (p: Prospect, action: string, date: string) => {
    if (p.catalog_only) return;
    await supabase.from('prospects').update({ next_action: action || null, next_action_date: date || null }).eq('id', p.id);
    load();
  };

  const addTouch = async () => {
    if (!selected || selected.catalog_only || touchNote.trim().length < 3) return;
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    await supabase.from('prospect_touches').insert({
      prospect_id: selected.id, channel: touchChannel, note: touchNote.trim(), created_by: u.user?.id ?? null,
    });
    setTouchNote('');
    setBusy(false);
    void openProspect(selected);
  };

  const copyMessage = async (m: OutreachMessage) => {
    const text = m.subject ? `Objet : ${m.subject}\n\n${m.body}` : m.body;
    try { await navigator.clipboard.writeText(text); } catch { /* clipboard indisponible */ }
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /** Journalise l'envoi dans le journal des contacts (immuable). */
  const logSend = async (m: OutreachMessage) => {
    if (!selected || selected.catalog_only) return;
    const { data: u } = await supabase.auth.getUser();
    await supabase.from('prospect_touches').insert({
      prospect_id: selected.id, channel: 'email',
      note: `Modèle « ${m.label} » ouvert dans la messagerie`,
      created_by: u.user?.id ?? null,
    });
    void openProspect(selected);
  };

  /** Bascule une fiche du vivier France (catalog_only) dans le pipeline CRM. */
  const promoteToPipeline = async (p: Prospect) => {
    setBusy(true);
    const { error } = await supabase.from('prospects').insert({
      kind: p.kind, phase: p.phase, segment: p.segment, name: p.name,
      city: p.city, country: p.country, contact_name: p.contact_name,
      email: p.email, phone: p.phone, website: p.website,
      source: `${p.source ?? 'catalogue'} | promu:vivier${p.siren ? ` | siren:${p.siren}` : ''}${p.external_id ? ` | ext:${p.external_id}` : ''}`,
      notes: [CATALOGUE_EMAILS_DERIVED[p.phase] && p.email ? '⚠️ E-MAIL DÉDUIT du domaine du site (vivier Overture) — À VÉRIFIER avant tout envoi.' : null,
        p.legal_name ? `Raison sociale : ${p.legal_name}.` : null,
        p.siret ? `SIRET ${p.siret}.` : null,
        p.address ? `Adresse : ${p.address}.` : null,
        p.legal_source_url ? `Source légale : ${p.legal_source_url}` : null,
        p.contact_source_url ? `Source contact : ${p.contact_source_url}` : null].filter(Boolean).join(' ') || null,
    });
    setBusy(false);
    if (!error) { setSelected(null); setView('crm'); await load(); }
  };

  const addProspect = async () => {
    if (!form.name.trim()) return;
    setBusy(true);
    await supabase.from('prospects').insert({
      kind: form.kind, phase: form.phase, segment: form.segment, name: form.name.trim(),
      city: form.city.trim() || null, country: form.country.trim() || 'France',
      contact_name: form.contact_name.trim() || null, email: form.email.trim() || null,
      phone: form.phone.trim() || null, website: form.website.trim() || null,
      source: form.source.trim() || null, notes: form.notes.trim() || null,
      next_action: form.next_action.trim() || null, next_action_date: form.next_action_date || null,
    });
    setBusy(false); setShowAdd(false); setForm(EMPTY_FORM); load();
  };

  // Vue CRM = pipeline actionnable (fiches en base) ; vue Catalogue = vivier
  // France en consultation (fiches catalog_only). Séparées pour que le travail
  // qualifié ne soit pas noyé dans les 4 900 fiches du vivier.
  const inView = useCallback((p: Prospect) => view === 'catalogue' ? !!p.catalog_only : !p.catalog_only, [view]);

  // Vagues du plan de tournée (kind='products' n'a pas de vagues)
  const waves = kind !== 'products' ? getWaves(kind, phase) : [];
  const phaseProspects = prospects.filter(p => p.kind === kind && p.phase === phase && inView(p));
  const wStats = kind !== 'products' ? waveStats(phaseProspects, waves) : [];
  const cities = kind !== 'products' ? distinctCities(phaseProspects) : [];
  const countries = [...new Set(phaseProspects.map(p => p.country))].sort((a, b) => a.localeCompare(b, 'fr'));
  const regions = [...new Set(phaseProspects.filter(p => filterCountry === 'all' || p.country === filterCountry).map(p => p.region).filter((v): v is string => Boolean(v)))].sort((a, b) => a.localeCompare(b, 'fr'));
  const segments = [...new Set(phaseProspects.map(p => p.segment))].sort((a, b) => (SEGMENT_LABELS[a] ?? a).localeCompare(SEGMENT_LABELS[b] ?? b, 'fr'));
  const activeWave: Wave | null = selectedWave ? waves.find(w => w.label === selectedWave) ?? null : null;

  const filtered = prospects.filter(p => {
    if (p.kind !== kind || p.phase !== phase) return false;
    if (!inView(p)) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterCountry !== 'all' && p.country !== filterCountry) return false;
    if (filterCity !== 'all' && normalizeCity(p.city) !== filterCity) return false;
    if (filterRegion !== 'all' && p.region !== filterRegion) return false;
    if (filterSegment !== 'all' && p.segment !== filterSegment) return false;
    if (activeWave && waveOf(p, waves) !== activeWave) return false;
    if (search) {
      const hay = `${p.name} ${p.legal_name ?? ''} ${p.siren ?? ''} ${p.siret ?? ''} ${p.city ?? ''} ${p.region ?? ''} ${p.segment} ${p.contact_name ?? ''} ${p.email ?? ''}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });
  const PAGE_SIZE = 100;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleProspects = filtered.slice((Math.min(page, pageCount) - 1) * PAGE_SIZE, Math.min(page, pageCount) * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [kind, phase, filterStatus, filterCountry, filterCity, filterRegion, filterSegment, selectedWave, search]);

  const phaseCounts = (ph: number) => prospects.filter(p => p.kind === kind && p.phase === ph && inView(p));
  const pb = PHASE_PLAYBOOK[phase];
  const today = new Date().toISOString().slice(0, 10);

  // Funnel du pipeline courant (kind, toutes phases confondues)
  const FUNNEL_STEPS: { key: string[]; label: string; color: string }[] = [
    { key: ['a_contacter'], label: 'À contacter', color: '#94a3b8' },
    { key: ['contacte', 'relance'], label: 'Contactés', color: '#38bdf8' },
    { key: ['en_discussion'], label: 'En discussion', color: '#f59e0b' },
    { key: ['inscrit'], label: 'Inscrits', color: '#34d399' },
    { key: ['actif'], label: 'Actifs', color: '#10b981' },
  ];
  // Le funnel ne compte QUE le pipeline CRM (jamais le catalogue en consultation)
  const kindProspects = prospects.filter(p => p.kind === kind && !p.catalog_only);
  const funnelMax = Math.max(1, ...FUNNEL_STEPS.map(s => kindProspects.filter(p => s.key.includes(p.status)).length));
  const catalogueCount = prospects.filter(p => p.catalog_only).length;

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;

  return (
    <div>
      <AdminPageHeader
        title="Prospection"
        subtitle="Le plan de conquête, cible par cible — acheteurs et producteurs, par phase"
        actions={
          <Link to="/admin/strategie" className="inline-flex items-center gap-1.5 text-[11px] font-black text-gray-600 bg-white border-2 border-gray-200 px-3 py-2 rounded-xl hover:border-brand-300">
            <Compass className="w-3.5 h-3.5" /> Stratégie <ArrowRight className="w-3 h-3" />
          </Link>
        }
      />

      {/* Sélecteur de vue : pipeline CRM actionnable vs vivier de la phase en consultation */}
      {kind === 'buyer' && catalogueCount > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden">
            <button onClick={() => { setView('crm'); setFilterCountry('all'); setFilterRegion('all'); setFilterCity('all'); setFilterSegment('all'); }}
              className={`px-4 py-2 text-xs font-black cursor-pointer ${view === 'crm' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              🎯 Mon pipeline ({prospects.filter(p => p.kind === 'buyer' && !p.catalog_only).length})
            </button>
            <button onClick={() => { setView('catalogue'); setSelectedWave(null); setFilterCountry('all'); setFilterRegion('all'); setFilterCity('all'); setFilterSegment('all'); }}
              className={`px-4 py-2 text-xs font-black cursor-pointer ${view === 'catalogue' ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <Database className="w-3 h-3 inline mr-1 -mt-0.5" />{CATALOGUE_LABELS[phase] ?? 'Vivier'} ({catalogueCount.toLocaleString('fr-FR')})
            </button>
          </div>
          {view === 'catalogue' && (
            <p className="text-[11px] text-gray-500 flex-1 min-w-60">
              {CATALOGUE_EMAILS_DERIVED[phase]
                ? <>Vivier en consultation (Overture Maps, nettoyé). <b className="text-amber-700">⚠️ E-mails déduits des domaines des sites — à vérifier avant tout envoi.</b> Repérez une cible, vérifiez ses coordonnées, puis ajoutez-la au pipeline.</>
                : <>Vivier en consultation (BANCO/OSM + SIRENE, nettoyé) — repérez une cible, vérifiez ses coordonnées, puis ajoutez-la au pipeline pour la travailler.</>}
            </p>
          )}
        </div>
      )}

      {/* Funnel du pipeline (CRM uniquement — masqué en vue vivier) */}
      {kind !== 'products' && view === 'crm' && (
      <div className="mb-5 bg-white rounded-2xl border-2 border-gray-100 p-4">
        <div className="flex items-end gap-2">
          {FUNNEL_STEPS.map((s, i) => {
            const n = kindProspects.filter(p => s.key.includes(p.status)).length;
            const h = 14 + (n / funnelMax) * 52;
            return (
              <div key={s.label} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                <span className="text-sm font-black tabular-nums" style={{ color: s.color }}>{n}</span>
                <div className="w-full rounded-t-lg transition-all" style={{ height: `${h}px`, background: s.color, opacity: 0.85 }} />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-wide truncate w-full text-center">{s.label}</span>
                {i < FUNNEL_STEPS.length - 1 && <span className="sr-only">→</span>}
              </div>
            );
          })}
          <div className="hidden sm:flex flex-col items-center justify-center pl-3 ml-1 border-l border-gray-100 self-stretch">
            <span className="text-lg font-black text-gray-900 tabular-nums">{stats?.reply_rate_pct ?? 0}%</span>
            <span className="text-[9px] font-black text-gray-400 uppercase">Taux de réponse</span>
          </div>
        </div>
      </div>
      )}

      {/* Bandeau actions du jour (CRM uniquement) */}
      {view === 'crm' && stats && stats.due_today > 0 && (
        <div className="mb-5 rounded-2xl border-2 border-amber-300 bg-amber-50 px-5 py-3.5 flex items-center gap-3">
          <CalendarClock className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm font-bold text-amber-900">
            {stats.due_today} action(s) prévue(s) aujourd'hui ou en retard — un contact sans prochaine action est un contact perdu.
          </p>
        </div>
      )}

      {/* Sélecteur pipeline + phase */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden">
          {(['buyer', 'producer', 'products'] as const).map(k => (
            <button key={k} onClick={() => { setKind(k); setSelectedWave(null); setFilterCountry('all'); setFilterRegion('all'); setFilterCity('all'); }}
              className={`px-5 py-2.5 text-sm font-black cursor-pointer ${kind === k ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {k === 'buyer' ? '🛒 Acheteurs' : k === 'producer' ? '🌾 Producteurs' : '📦 Produits cibles'}
            </button>
          ))}
        </div>
        {kind !== 'products' && (
        <div className="flex gap-2">
          {[1, 2, 3].map(ph => {
            const list = phaseCounts(ph);
            const conv = list.filter(p => ['inscrit', 'actif'].includes(p.status)).length;
            const total = view === 'catalogue' && kind === 'buyer' ? Math.max(list.length, CATALOGUE_TOTALS[ph] ?? 0) : list.length;
            return (
              <button key={ph} onClick={() => { setPhase(ph); setSelectedWave(null); setFilterCountry('all'); setFilterRegion('all'); setFilterCity('all'); }}
                className={`px-4 py-2 rounded-xl border-2 text-xs font-black cursor-pointer ${phase === ph ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 bg-white text-gray-600'}`}>
                Phase {ph}
                <span className="ml-1.5 font-bold text-gray-400">{conv}/{total}</span>
              </button>
            );
          })}
        </div>
        )}
        {stats && <span className="text-xs text-gray-400 ml-auto">Taux de réponse global : <b className="text-gray-600">{stats.reply_rate_pct}%</b></span>}
      </div>

      {/* ===================== Vue Produits cibles : matching offre ↔ demande */}
      {kind === 'products' && (
        <div className="space-y-2">
          <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/40 px-5 py-3.5 text-xs text-gray-700 leading-relaxed">
            <b>Le matching offre ↔ demande, produit par produit.</b> Pour chaque produit de la vague 1 : les producteurs qui peuvent le fournir et les acheteurs à activer dès qu'un producteur s'inscrit. Cliquez sur un produit pour voir les deux côtés du marché — puis sur une cible pour ouvrir sa fiche.
          </div>
          {WAVE1_PRODUCTS.map(w => {
            const { buyerSegments, producerSegments } = productMatch(w.short);
            const supply = prospects.filter(p => p.kind === 'producer' && producerSegments.includes(p.segment));
            const demand = prospects.filter(p => p.kind === 'buyer' && buyerSegments.includes(p.segment));
            const supplyOn = supply.filter(p => ['inscrit', 'actif'].includes(p.status));
            const demandOn = demand.filter(p => ['inscrit', 'actif'].includes(p.status));
            const open = selectedProduct === w.short;
            const matchReady = supplyOn.length > 0 && demand.length > 0;
            return (
              <div key={w.short} className={`bg-white rounded-2xl border-2 ${matchReady ? 'border-emerald-300' : 'border-gray-100'}`}>
                <button onClick={() => setSelectedProduct(open ? null : w.short)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 cursor-pointer">
                  <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black ${w.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {w.score}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-gray-900 text-sm">{w.name}</span>
                      {w.active
                        ? <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">POUSSÉ</span>
                        : <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">M4+</span>}
                      {matchReady && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">⚡ MATCH POSSIBLE</span>}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">{w.target} · {w.price} · {w.recurrence}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-4 text-center">
                    <div>
                      <p className={`text-sm font-black tabular-nums ${supplyOn.length ? 'text-emerald-600' : 'text-gray-800'}`}>{supplyOn.length}/{supply.length}</p>
                      <p className="text-[9px] font-black text-gray-400 uppercase">🌾 Offre</p>
                    </div>
                    <div>
                      <p className={`text-sm font-black tabular-nums ${demandOn.length ? 'text-emerald-600' : 'text-gray-800'}`}>{demandOn.length}/{demand.length}</p>
                      <p className="text-[9px] font-black text-gray-400 uppercase">🛒 Demande</p>
                    </div>
                  </div>
                  {open ? <ChevronUp className="w-4 h-4 text-gray-300 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-300 shrink-0" />}
                </button>
                {open && (
                  <>
                  <div className="px-4 pb-3 grid md:grid-cols-2 gap-3">
                    {([['🌾 Producteurs (offre)', supply], ['🛒 Acheteurs à activer (demande)', demand]] as const).map(([title, list]) => (
                      <div key={title} className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-2">{title} — {list.length}</p>
                        {list.length === 0 && <p className="text-xs text-gray-400">Aucune cible dans le CRM pour ce produit.</p>}
                        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                          {[...list].sort((a, b) => {
                            const rank = (s: string) => ['actif', 'inscrit', 'en_discussion', 'relance', 'contacte', 'a_contacter', 'refus', 'stop'].indexOf(s);
                            return rank(a.status) - rank(b.status);
                          }).map(p => {
                            const st = STATUS_META[p.status] ?? STATUS_META.a_contacter;
                            return (
                              <button key={p.id} onClick={() => void openProspect(p)}
                                className="w-full text-left flex items-center gap-2 bg-white rounded-lg border border-gray-100 px-2.5 py-1.5 hover:border-brand-200 cursor-pointer">
                                <span className="min-w-0 flex-1 text-[11px] font-bold text-gray-800 truncate">{p.name}</span>
                                {(p.phone || p.email) && <Phone className="w-3 h-3 text-emerald-500 shrink-0" />}
                                <span className={`shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-full border ${st.cls}`}>{st.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* E-mails prêts à envoyer pour CE produit */}
                  <div className="px-4 pb-4">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      <MessageSquareText className="w-3.5 h-3.5 text-brand-500" /> E-mails prêts à envoyer — {w.short}
                    </p>
                    <div className="space-y-1.5">
                      {productEmails(w.short).map(m => (
                        <div key={m.id} className="rounded-xl border border-gray-200 overflow-hidden">
                          <button onClick={() => setOpenMessage(o => o === m.id ? null : m.id)}
                            className="w-full flex items-center justify-between px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 cursor-pointer">
                            <span className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-brand-500" /> {m.label}
                            </span>
                            {openMessage === m.id ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                          </button>
                          {openMessage === m.id && (
                            <div className="p-3 bg-white">
                              {m.subject && <p className="text-[11px] text-gray-500 mb-1.5"><b>Objet :</b> {m.subject}</p>}
                              <pre className="text-[11px] text-gray-700 whitespace-pre-wrap font-sans leading-relaxed max-h-52 overflow-y-auto bg-gray-50 rounded-lg p-2.5 border border-gray-100">{m.body}</pre>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <button onClick={() => void copyMessage(m)}
                                  className="inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-lg bg-gray-900 text-white cursor-pointer">
                                  {copiedId === m.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  {copiedId === m.id ? 'Copié !' : 'Copier'}
                                </button>
                                <p className="text-[10px] text-gray-400 self-center">Personnalisez les [crochets] avant envoi.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {kind !== 'products' && (<>
      {/* Playbook de la phase */}
      <div className="mb-5 rounded-2xl border-2 border-indigo-100 bg-indigo-50/40">
        <button onClick={() => setPlaybookOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-3.5 text-left cursor-pointer">
          <span className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-black text-gray-900">{pb.title}</span>
          </span>
          {playbookOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {playbookOpen && (
          <div className="px-5 pb-4 space-y-2 text-xs text-gray-700 leading-relaxed">
            <p><b>🛒 Acheteurs :</b> {pb.buyers}</p>
            <p><b>🌾 Producteurs :</b> {pb.producers}</p>
            <p className="text-indigo-900 font-bold">🎯 {pb.exit}</p>
            <p className="text-gray-400">Stratégie complète : <code className="bg-white px-1 rounded">docs/STRATEGIE_GO_TO_MARKET.md</code> · Modèles d'e-mails : <code className="bg-white px-1 rounded">docs/KIT_PROSPECTION.md</code></p>
          </div>
        )}
      </div>

      {/* Plan de tournée (CRM uniquement — le vivier se filtre par ville/segment) */}
      {view === 'crm' && (
      <div className="mb-5">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 px-1">
          🗺️ Plan de tournée — {kind === 'buyer' ? 'où prospecter, dans quel ordre' : 'quelles filières, dans quel ordre'}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {wStats.map(ws => {
            const active = selectedWave === ws.wave.label;
            return (
              <button key={ws.wave.label}
                onClick={() => setSelectedWave(active ? null : ws.wave.label)}
                title={ws.wave.rationale}
                className={`text-left rounded-xl border-2 px-3 py-2.5 transition-colors cursor-pointer ${
                  active ? 'border-brand-500 bg-brand-50' : ws.wave.rest ? 'border-gray-100 bg-gray-50/60 hover:border-gray-200' : 'border-gray-200 bg-white hover:border-brand-300'}`}>
                <p className={`text-[9px] font-black uppercase tracking-wide ${active ? 'text-brand-700' : 'text-gray-400'}`}>{ws.wave.week}</p>
                <p className="text-xs font-black text-gray-900 truncate mt-0.5">{ws.wave.label}</p>
                <p className="text-[10px] text-gray-500 mt-1 tabular-nums">
                  {ws.contacted}/{ws.total} contactées{ws.converted > 0 ? ` · ${ws.converted} ✓` : ''}
                </p>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                  <div className={`h-full rounded-full ${ws.converted > 0 ? 'bg-emerald-500' : 'bg-brand-400'}`}
                    style={{ width: `${ws.total ? Math.round((ws.contacted / ws.total) * 100) : 0}%` }} />
                </div>
              </button>
            );
          })}
        </div>
        {activeWave && (
          <p className="text-[11px] text-gray-500 mt-2 px-1">
            <b className="text-brand-700">{activeWave.week} — {activeWave.label} :</b> {activeWave.rationale}
            <button onClick={() => setSelectedWave(null)} className="ml-2 font-black text-gray-400 hover:text-gray-600 cursor-pointer">× retirer le filtre</button>
          </p>
        )}
      </div>
      )}

      {/* Lecture opérationnelle de la base */}
      {kind === 'buyer' && phaseProspects.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Acheteurs dans la phase', value: phaseProspects.length, icon: Database, cls: 'text-brand-700 bg-brand-50' },
            { label: 'Avec e-mail public', value: phaseProspects.filter(p => p.email).length, icon: Mail, cls: 'text-sky-700 bg-sky-50' },
            { label: 'Avec téléphone', value: phaseProspects.filter(p => p.phone).length, icon: Phone, cls: 'text-emerald-700 bg-emerald-50' },
            { label: 'Avec LinkedIn', value: phaseProspects.filter(p => p.linkedin_url).length, icon: Linkedin, cls: 'text-indigo-700 bg-indigo-50' },
          ].map(k => <div key={k.label} className="rounded-xl border border-gray-100 bg-white p-3 flex items-center gap-3">
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${k.cls}`}><k.icon className="w-4 h-4" /></span>
            <div><p className="text-lg font-black tabular-nums text-gray-900">{k.value.toLocaleString('fr-FR')}</p><p className="text-[9px] font-black uppercase tracking-wide text-gray-400">{k.label}</p></div>
          </div>)}
        </div>
      )}

      {/* Filtres + ajout */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, ville, segment…"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
        </div>
        <select value={filterCountry} onChange={e => { setFilterCountry(e.target.value); setFilterRegion('all'); setFilterCity('all'); }}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white cursor-pointer max-w-44">
          <option value="all">Tous pays</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterSegment} onChange={e => setFilterSegment(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white cursor-pointer max-w-52">
          <option value="all">Tous segments</option>
          {segments.map(s => <option key={s} value={s}>{SEGMENT_LABELS[s] ?? s}</option>)}
        </select>
        <select value={filterRegion} onChange={e => { setFilterRegion(e.target.value); setFilterCity('all'); }}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white cursor-pointer max-w-52">
          <option value="all">Toutes régions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filterCity} onChange={e => setFilterCity(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white cursor-pointer max-w-44">
          <option value="all">Toutes villes</option>
          {cities.filter(c => phaseProspects.some(p => normalizeCity(p.city) === c && (filterCountry === 'all' || p.country === filterCountry) && (filterRegion === 'all' || p.region === filterRegion))).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white cursor-pointer">
          <option value="all">Tous statuts</option>
          {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button onClick={() => { setForm({ ...EMPTY_FORM, kind, phase: phase as 1 | 2 | 3 }); setShowAdd(true); }}
          className="px-4 py-2.5 text-xs font-black rounded-xl bg-brand-600 text-white hover:bg-brand-700 inline-flex items-center gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> Ajouter une cible
        </button>
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Target className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-700">Aucune cible dans cette vue</p>
          <p className="text-sm text-gray-400 mt-1">Ajoutez des cibles ou changez de phase/pipeline.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1 pb-1 text-[11px] text-gray-400">
            <span><b className="text-gray-700">{filtered.length.toLocaleString('fr-FR')}</b> résultat(s) · affichage par {PAGE_SIZE}</span>
            <span>Page {Math.min(page, pageCount)} / {pageCount}</span>
          </div>
          {visibleProspects.map(p => {
            const st = STATUS_META[p.status] ?? STATUS_META.a_contacter;
            const overdue = p.next_action_date && p.next_action_date <= today && !['refus', 'stop', 'actif'].includes(p.status);
            return (
              <button key={p.id} onClick={() => void openProspect(p)}
                className="w-full text-left bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3 hover:border-brand-200 hover:shadow-sm cursor-pointer">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-gray-900 text-sm truncate">{p.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{SEGMENT_LABELS[p.segment] ?? p.segment}</span>
                    {p.country !== 'France' && <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">{p.country}</span>}
                    {p.region && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">📍 {p.region}</span>}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${st.cls}`}>{st.label}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {[p.city, p.country !== 'France' ? p.country : null].filter(Boolean).join(', ')}
                    {p.contact_name ? ` · ${p.contact_name}` : ''}
                    {p.next_action ? ` · → ${p.next_action}` : ''}
                  </p>
                  {((p.likely_products?.length ?? 0) > 0 || SEGMENT_PITCHES[p.segment]) && (
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      <Package className="w-3 h-3 text-brand-400" />
                      {(p.likely_products?.length ? p.likely_products : SEGMENT_PITCHES[p.segment]?.products ?? []).slice(0, 3).map(pr => (
                        <span key={pr} className="text-[9px] font-black px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-100">{pr}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="shrink-0 hidden md:flex items-center gap-1.5 text-gray-300">
                  {p.phone && <Phone className="w-3.5 h-3.5 text-emerald-500" aria-label="téléphone connu" />}
                  {p.email && <Mail className="w-3.5 h-3.5 text-emerald-500" aria-label="e-mail connu" />}
                  {p.website && <GlobeIcon className="w-3.5 h-3.5 text-emerald-500" aria-label="site connu" />}
                </div>
                {overdue && <span className="shrink-0 text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">⏰ {p.next_action_date}</span>}
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </button>
            );
          })}
          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 pt-3">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-black text-gray-600 disabled:opacity-30">← Précédent</button>
              <span className="text-xs font-bold text-gray-500 tabular-nums">{Math.min(page, pageCount)} / {pageCount}</span>
              <button onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page >= pageCount}
                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-black text-gray-600 disabled:opacity-30">Suivant →</button>
            </div>
          )}
        </div>
      )}
      </>)}

      {/* Fiche prospect */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-black text-gray-900 text-lg">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              {SEGMENT_LABELS[selected.segment] ?? selected.segment} · Phase {selected.phase} · {[selected.city, selected.country].filter(Boolean).join(', ')}
              {selected.source ? ` · source : ${selected.source}` : ''}
            </p>
            {selected.catalog_only && (
              <div className="mb-4 flex flex-wrap items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <p className="text-[11px] font-bold text-amber-800 flex-1 min-w-52">
                  Fiche du {CATALOGUE_LABELS[selected.phase] ?? 'vivier'} (consultation).
                  {CATALOGUE_EMAILS_DERIVED[selected.phase] ? ' ⚠️ E-mail déduit du domaine du site — à vérifier avant envoi.' : ''}
                  {' '}Vérifiez les coordonnées puis basculez-la dans votre pipeline pour la travailler.
                </p>
                <button onClick={() => void promoteToPipeline(selected)} disabled={busy}
                  className="inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-lg bg-brand-600 text-white cursor-pointer disabled:opacity-40">
                  <Plus className="w-3 h-3" /> Ajouter au pipeline
                </button>
              </div>
            )}

            {/* Coordonnées */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selected.email && <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-lg hover:bg-brand-100"><Mail className="w-3.5 h-3.5" />{selected.email}</a>}
              {selected.phone && <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg"><Phone className="w-3.5 h-3.5" />{selected.phone}</a>}
              {selected.website && <a href={selected.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg"><GlobeIcon className="w-3.5 h-3.5" />site</a>}
              {!selected.email && !selected.phone && <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-bold">⚠️ Coordonnées à qualifier avant contact</span>}
            </div>

            {/* Identité légale et traçabilité de la donnée */}
            {(selected.legal_name || selected.siren || selected.region || selected.linkedin_url) && (
              <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50/70 p-3.5">
                <p className="flex items-center gap-1.5 text-[11px] font-black text-gray-600 uppercase tracking-wide mb-2"><Building2 className="w-3.5 h-3.5" /> Identité & qualification</p>
                <div className="grid sm:grid-cols-2 gap-x-5 gap-y-2 text-xs">
                  {selected.legal_name && <div><span className="text-gray-400">Raison sociale</span><p className="font-bold text-gray-800">{selected.legal_name}</p></div>}
                  {(selected.siren || selected.siret) && <div><span className="text-gray-400">SIREN / SIRET</span><p className="font-bold text-gray-800 tabular-nums">{selected.siren}{selected.siret ? ` / ${selected.siret}` : ''}</p></div>}
                  {selected.region && <div><span className="text-gray-400">Territoire</span><p className="font-bold text-gray-800 flex items-center gap-1"><MapPin className="w-3 h-3" />{[selected.city, selected.region].filter(Boolean).join(' · ')}</p></div>}
                  {selected.address && <div><span className="text-gray-400">Adresse professionnelle</span><p className="font-bold text-gray-800">{selected.address}</p></div>}
                  {selected.contact_name && <div><span className="text-gray-400">Décideur public</span><p className="font-bold text-gray-800">{selected.contact_name}{selected.contact_role ? ` · ${selected.contact_role}` : ''}</p></div>}
                  {selected.verified_on && <div><span className="text-gray-400">Vérification</span><p className="font-bold text-emerald-700">{selected.legal_status ?? 'Vérifié'} · {new Date(selected.verified_on).toLocaleDateString('fr-FR')}</p></div>}
                  {selected.quality_score != null && <div><span className="text-gray-400">Score de qualité source</span><p className="font-black text-brand-700">{selected.quality_score.toFixed(1)} / 100</p></div>}
                </div>
                <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-200">
                  {selected.linkedin_url && <a href={selected.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-700 hover:underline"><Linkedin className="w-3 h-3" /> LinkedIn <ExternalLink className="w-2.5 h-2.5" /></a>}
                  {selected.legal_source_url && <a href={selected.legal_source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-black text-gray-600 hover:underline">Source légale <ExternalLink className="w-2.5 h-2.5" /></a>}
                  {selected.contact_source_url && <a href={selected.contact_source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-black text-gray-600 hover:underline">Source coordonnées <ExternalLink className="w-2.5 h-2.5" /></a>}
                </div>
              </div>
            )}

            {/* Angle d'attaque produit (pont avec le plan stratégique) */}
            {(SEGMENT_PITCHES[selected.segment] || (selected.likely_products?.length ?? 0) > 0) && (
              <div className="mb-4 rounded-xl border-2 border-brand-100 bg-brand-50/40 p-3.5">
                <p className="flex items-center gap-1.5 text-[11px] font-black text-brand-800 uppercase tracking-wide mb-2">
                  <Lightbulb className="w-3.5 h-3.5" /> Quoi vendre, avec quel angle
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(selected.likely_products?.length ? selected.likely_products : SEGMENT_PITCHES[selected.segment]?.products ?? []).map(short => {
                    const prod = WAVE1_PRODUCTS.find(w => w.short === short);
                    return (
                      <span key={short} title={prod ? `${prod.name} — ${prod.price} · score ${prod.score}/100` : short}
                        className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white text-brand-800 border border-brand-200">
                        {short}{prod ? ` · ${prod.score}` : ''}
                      </span>
                    );
                  })}
                </div>
                {SEGMENT_PITCHES[selected.segment] ? <>
                  <p className="text-xs text-gray-700 leading-relaxed"><b>Angle :</b> {SEGMENT_PITCHES[selected.segment].angle}</p>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1.5 italic">« {SEGMENT_PITCHES[selected.segment].hook} »</p>
                </> : <p className="text-xs text-gray-600 leading-relaxed">Produits présélectionnés à partir de l’activité publique de l’acheteur. À valider pendant la qualification commerciale.</p>}
              </div>
            )}

            {/* Messages prêts à envoyer */}
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <MessageSquareText className="w-3.5 h-3.5" /> Messages prêts à envoyer
            </p>
            <div className="space-y-1.5 mb-4">
              {messagesFor(selected).map(m => (
                <div key={m.id} className="rounded-xl border border-gray-200 overflow-hidden">
                  <button onClick={() => setOpenMessage(o => o === m.id ? null : m.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 cursor-pointer">
                    <span className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                      {m.channel === 'email' ? <Mail className="w-3 h-3 text-brand-500" /> : <Phone className="w-3 h-3 text-brand-500" />}
                      {m.label}
                    </span>
                    {openMessage === m.id ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                  </button>
                  {openMessage === m.id && (
                    <div className="p-3 bg-white">
                      {m.subject && <p className="text-[11px] text-gray-500 mb-1.5"><b>Objet :</b> {m.subject}</p>}
                      <pre className="text-[11px] text-gray-700 whitespace-pre-wrap font-sans leading-relaxed max-h-52 overflow-y-auto bg-gray-50 rounded-lg p-2.5 border border-gray-100">{m.body}</pre>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <button onClick={() => void copyMessage(m)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-lg bg-gray-900 text-white cursor-pointer">
                          {copiedId === m.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedId === m.id ? 'Copié !' : 'Copier'}
                        </button>
                        {m.channel === 'email' && selected.email && (
                          <a href={mailtoHref(selected.email, m)} onClick={() => void logSend(m)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-lg bg-brand-600 text-white">
                            <Send className="w-3 h-3" /> Ouvrir dans ma messagerie
                          </a>
                        )}
                        <p className="text-[10px] text-gray-400 self-center">Personnalisez les [crochets] avant envoi.</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pipeline de statut */}
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-wide mb-1.5">Statut</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {Object.entries(STATUS_META).map(([k, v]) => (
                <button key={k} onClick={() => void setStatus(selected, k)} disabled={busy || selected.catalog_only}
                  className={`text-[11px] font-black px-2.5 py-1 rounded-full border cursor-pointer ${selected.status === k ? v.cls + ' ring-2 ring-offset-1 ring-brand-300' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>
                  {v.label}
                </button>
              ))}
            </div>

            {/* Prochaine action */}
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-wide mb-1.5">Prochaine action</p>
            <div className="flex gap-2 mb-4">
              <input defaultValue={selected.next_action ?? ''} id="na-text" placeholder="Ex : envoyer e-mail J+4"
                className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-400" />
              <input type="date" defaultValue={selected.next_action_date ?? ''} id="na-date"
                className="text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none" />
              <button onClick={() => {
                const t = (document.getElementById('na-text') as HTMLInputElement).value;
                const d = (document.getElementById('na-date') as HTMLInputElement).value;
                void saveNextAction(selected, t, d);
              }} disabled={selected.catalog_only} className="px-3 py-2 text-[11px] font-black rounded-lg bg-gray-900 text-white cursor-pointer disabled:opacity-30">OK</button>
            </div>

            {selected.notes && (
              <div className="mb-4 rounded-xl bg-gray-50 border border-gray-100 p-3">
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                <p className="text-xs text-gray-600 whitespace-pre-line">{selected.notes}</p>
              </div>
            )}

            {/* Journal */}
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-wide mb-1.5">Journal des contacts</p>
            <div className="flex gap-2 mb-2">
              <select value={touchChannel} onChange={e => setTouchChannel(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-2 bg-white cursor-pointer">
                {['email', 'appel', 'visite', 'salon', 'linkedin', 'autre'].map(c => <option key={c}>{c}</option>)}
              </select>
              <input value={touchNote} onChange={e => setTouchNote(e.target.value)} placeholder="Ex : e-mail J0 envoyé (objet certificats)"
                className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand-400" />
              <button onClick={() => void addTouch()} disabled={busy || selected.catalog_only || touchNote.trim().length < 3}
                className="px-3 py-2 text-[11px] font-black rounded-lg bg-brand-600 text-white disabled:opacity-40 cursor-pointer">+</button>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {touches.length === 0 && <p className="text-xs text-gray-400">Aucun contact enregistré.</p>}
              {touches.map(t => (
                <div key={t.id} className="text-xs text-gray-600 flex gap-2">
                  <span className="text-gray-400 shrink-0 tabular-nums">{new Date(t.created_at).toLocaleDateString('fr-FR')}</span>
                  <span className="font-bold shrink-0">{t.channel}</span>
                  <span>{t.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ajout */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-black text-gray-900 text-lg">Ajouter une cible</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <select value={form.kind} onChange={e => setForm(f => ({ ...f, kind: e.target.value as 'buyer' | 'producer' }))} className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white cursor-pointer">
                <option value="buyer">🛒 Acheteur</option><option value="producer">🌾 Producteur</option>
              </select>
              <select value={form.phase} onChange={e => setForm(f => ({ ...f, phase: Number(e.target.value) }))} className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white cursor-pointer">
                {[1, 2, 3].map(p => <option key={p} value={p}>Phase {p}</option>)}
              </select>
              <select value={form.segment} onChange={e => setForm(f => ({ ...f, segment: e.target.value }))} className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white cursor-pointer sm:col-span-2">
                {Object.entries(SEGMENT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nom (obligatoire)" className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 sm:col-span-2 outline-none focus:ring-2 focus:ring-brand-400" />
              <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Ville" className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none" />
              <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="Pays" className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none" />
              <input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} placeholder="Contact (gérant…)" className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none" />
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="E-mail" className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none" />
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Téléphone" className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none" />
              <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="Site web" className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none" />
              <input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="Source (annuaire, salon, reco…)" className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 sm:col-span-2 outline-none" />
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes" rows={2} className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 sm:col-span-2 outline-none resize-none" />
            </div>
            <button onClick={() => void addProspect()} disabled={busy || !form.name.trim()}
              className="mt-4 w-full py-3 rounded-xl bg-brand-600 text-white font-black text-sm disabled:opacity-40 cursor-pointer">
              Ajouter au pipeline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
