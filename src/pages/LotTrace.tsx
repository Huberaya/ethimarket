// =============================================================
// EthiMarket — Page publique de traçabilité d'un lot
// (Phase 3 du Product Trust Pipeline)
//
// Accessible via le QR code imprimable de la commande :
// /trace/:orderId → get_lot_trace() (SQL, anonymisée : ni
// acheteur, ni prix, ni numéros de documents — uniquement le
// parcours vérifiable du lot).
// =============================================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Loader2, PackageCheck, Truck, CheckCircle2, CircleDashed,
  FlaskConical, ShieldCheck, MapPin, FileCheck2,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { supabase } from '../lib/supabase';
import { useI18n } from '../lib/i18n';
import { LOT_DOC_META, type LotDocKey } from '../lib/lotDossier';
import { ANALYSIS_STATUS_META } from '../lib/labDirectory';
import type { AnalysisStatus } from '../lib/labDirectory';

interface LotTraceData {
  order_number: string;
  status: 'shipped' | 'delivered';
  product_name: string | null;
  product_type: string | null;
  quantity: number;
  unit: string;
  producer: { name: string | null; slug: string | null; country: string | null; country_flag: string | null };
  milestones: { confirmed_at: string | null; shipped_at: string | null; delivered_at: string | null };
  documents: { key: LotDocKey; provided: boolean }[];
  analyses: { label: string; status: AnalysisStatus }[];
  reception: { recorded: boolean; clean: boolean } | null;
  generated_at: string;
}

export default function LotTrace() {
  const { orderId } = useParams<{ orderId: string }>();
  const { tx } = useI18n();
  const [trace, setTrace] = useState<LotTraceData | null | 'not_found'>(null);

  useEffect(() => {
    if (!orderId) { setTrace('not_found'); return; }
    void supabase.rpc('get_lot_trace', { p_order_id: orderId })
      .then(({ data }) => setTrace((data as LotTraceData | null) ?? 'not_found'));
  }, [orderId]);

  if (trace === null) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
        <Footer />
      </div>
    );
  }

  if (trace === 'not_found') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <FileCheck2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-black text-gray-900">{tx('Lot introuvable')}</h1>
          <p className="text-sm text-gray-500 mt-2">
            {tx('Ce lien de traçabilité ne correspond à aucun lot expédié. Le lot est peut-être encore en préparation.')}
          </p>
          <Link to="/" className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-black">
            {tx('Retour à l\'accueil')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const m = trace.milestones;
  const steps = [
    { label: tx('Commande confirmée'), date: m.confirmed_at, icon: PackageCheck, done: Boolean(m.confirmed_at) },
    { label: tx('Lot expédié — dossier documentaire complet'), date: m.shipped_at, icon: Truck, done: Boolean(m.shipped_at) },
    { label: tx('Réception contrôlée par l\'acheteur'), date: m.delivered_at, icon: CheckCircle2, done: Boolean(m.delivered_at) },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead title={`${tx('Traçabilité du lot')} ${trace.order_number} | EthiMarket`} description="Parcours vérifiable du lot : origine, documents, analyses, réception." />
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
            <ShieldCheck className="w-3.5 h-3.5" /> {tx('Traçabilité EthiMarket — données vérifiées, page publique')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">{trace.product_name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tx('Lot de la commande')} <span className="font-bold">{trace.order_number}</span> · {trace.quantity.toLocaleString('fr-FR')} {trace.unit}
          </p>
        </div>

        {/* Origine */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-2">{tx('Origine')}</p>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-brand-600 shrink-0" />
            <div>
              <p className="font-bold text-gray-900">
                {trace.producer.country_flag} {trace.producer.name}
              </p>
              <p className="text-xs text-gray-500">{trace.producer.country}</p>
            </div>
            {trace.producer.slug && (
              <Link to={`/boutique/${trace.producer.slug}`} className="ml-auto text-xs font-black text-brand-700 hover:underline">
                {tx('Voir le producteur')} →
              </Link>
            )}
          </div>
        </div>

        {/* Parcours */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-3">{tx('Parcours du lot')}</p>
          <div className="space-y-3">
            {steps.map((s, i) => {
              const Icon = s.done ? s.icon : CircleDashed;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${s.done ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <p className={`text-sm font-bold ${s.done ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</p>
                    {s.date && <p className="text-[11px] text-gray-400">{new Date(s.date).toLocaleDateString('fr-FR')}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Documents du lot */}
        {trace.documents.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-3">{tx('Documents qui accompagnent ce lot')}</p>
            <div className="space-y-2">
              {trace.documents.map(d => (
                <div key={d.key} className="flex items-center gap-2.5">
                  {d.provided
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    : <CircleDashed className="w-4 h-4 text-gray-300 shrink-0" />}
                  <span className={`text-sm ${d.provided ? 'text-gray-800 font-semibold' : 'text-gray-400'}`}>
                    {tx(LOT_DOC_META[d.key]?.label ?? d.key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyses */}
        {trace.analyses.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-3">{tx('Analyses de laboratoire')}</p>
            <div className="space-y-2">
              {trace.analyses.map((a, i) => {
                const meta = ANALYSIS_STATUS_META[a.status];
                return (
                  <div key={i} className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-sm text-gray-800 flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-indigo-500 shrink-0" /> {a.label}
                    </span>
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${meta.cls}`}>
                      {meta.emoji} {tx(meta.labelFr)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Réception */}
        {trace.reception?.recorded && (
          <div className={`rounded-2xl border-2 p-5 ${trace.reception.clean ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
            <p className="text-sm font-black text-gray-900">
              {trace.reception.clean
                ? '✅ ' + tx('Réception contrôlée et conforme (4 points vérifiés par l\'acheteur)')
                : '⚠️ ' + tx('Réception contrôlée — une non-conformité a été signalée et traitée par notre équipe')}
            </p>
          </div>
        )}

        <p className="text-[11px] text-gray-400 text-center mt-6">
          {tx('Page générée en temps réel depuis les données EthiMarket — aucune information n\'est modifiable a posteriori.')}
        </p>
      </div>
      <Footer />
    </div>
  );
}
