import { useState } from 'react';
import {
  ShieldCheck, CheckCircle2, MapPin, FileText, FlaskConical,
  Download, ExternalLink, X, Award, Leaf, Package,
} from 'lucide-react';
import type { Product, Producer } from '../../lib/supabase';
import { LeafletMap } from '../LeafletMap';
import { useI18n } from '../../lib/i18n';
import { PRODUCT_PAGE_CONTENT } from '../../lib/i18n/content/productPage';

type Props = { product: Product; producer: Producer | null };

const CERT_COLORS: Record<string, string> = {
  Bio: 'bg-brand-100 text-brand-700',
  Fairtrade: 'bg-blue-100 text-blue-700',
  Ecocert: 'bg-amber-100 text-amber-700',
  'Rainforest Alliance': 'bg-emerald-100 text-emerald-700',
  GlobalGAP: 'bg-purple-100 text-purple-700',
};

export default function GuaranteesSection({ product }: Props) {
  const { locale } = useI18n();
  const c = PRODUCT_PAGE_CONTENT[locale].guarantees;
  const [showAllCerts, setShowAllCerts] = useState(false);

  return (
    <section className="py-12 border-t border-gray-100">
      <SectionTitle icon={ShieldCheck} title={c.sectionTitle} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        {/* Card 1: Certifications vérifiées */}
        <GuaranteeCard icon={Award} title={c.certsTitle}
          text={c.certsText}>
          <div className="space-y-2 mt-3">
            {product.certifications.map(cert => (
              <div key={cert} className="flex items-center justify-between gap-2 bg-white rounded-xl p-2.5 border border-gray-100">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CERT_COLORS[cert] ?? 'bg-gray-100 text-gray-700'}`}>
                  {cert}
                </span>
                <div className="flex gap-1.5">
                  <button className="text-[11px] font-semibold text-gray-600 hover:text-brand-600 inline-flex items-center gap-1">
                    <FileText className="w-3 h-3" /> PDF
                  </button>
                  <button className="text-[11px] font-semibold text-brand-600 hover:underline inline-flex items-center gap-1">
                    {c.verify} <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {product.certifications.length === 0 && (
              <p className="text-xs text-gray-500">{c.noCerts}</p>
            )}
          </div>
        </GuaranteeCard>

        {/* Card 2: Traçabilité complète */}
        <GuaranteeCard icon={MapPin} title={c.traceTitle}
          text={c.traceText}>
          <div className="space-y-1.5 mt-3 text-sm">
            <Row label={c.gpsParcel} value={product.gps_coordinates ?? c.notProvided} icon={MapPin} />
            <Row label={c.planting} value={product.planting_date ? formatDate(product.planting_date) : '—'} icon={Leaf} />
            <Row label={c.harvest} value={product.harvest_date ? formatDate(product.harvest_date) : '—'} icon={Leaf} />
            <Row label={c.packaging} value={product.packaging_date ? formatDate(product.packaging_date) : '—'} icon={Package} />
            <Row label={c.batchNo} value={`ETH-${product.id.slice(0, 8).toUpperCase()}`} icon={Package} mono />
          </div>
          {product.gps_coordinates && <MiniMap gps={product.gps_coordinates} />}
        </GuaranteeCard>

        {/* Card 3: Qualité contrôlée */}
        <GuaranteeCard icon={FlaskConical} title={c.qualityTitle}
          text={c.qualityText}>
          <div className="mt-3 space-y-1.5 text-sm">
            <Row label={c.lab} value="Bureau Veritas" icon={FlaskConical} />
            <Row label={c.analysisDate} value={product.harvest_date ? formatDate(product.harvest_date) : '—'} icon={FlaskConical} />
            <div className="pt-2 space-y-1">
              {c.qualityChecks.map(r => (
                <div key={r} className="flex items-center gap-2 text-xs text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" /> {r}
                </div>
              ))}
            </div>
            <button className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline">
              <Download className="w-3.5 h-3.5" /> {c.downloadReport}
            </button>
          </div>
        </GuaranteeCard>

        {/* Card 4: Conformité UE */}
        <GuaranteeCard icon={ShieldCheck} title={c.euTitle}
          text={c.euText}>
          <div className="mt-3 grid grid-cols-1 gap-1.5">
            {c.euDocs.map(doc => (
              <div key={doc} className="flex items-center gap-2 text-xs text-gray-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" /> {doc}
              </div>
            ))}
          </div>
        </GuaranteeCard>
      </div>

      {/* Verification in 1 click */}
      <div className="mt-6 text-center">
        <button onClick={() => setShowAllCerts(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-50 text-brand-700 text-sm font-bold rounded-xl hover:bg-brand-100 transition-colors">
          <ShieldCheck className="w-4 h-4" /> {c.oneClick}
        </button>
      </div>

      {showAllCerts && <AllCertsModal product={product} c={c} onClose={() => setShowAllCerts(false)} />}
    </section>
  );
}

function GuaranteeCard({ icon: Icon, title, text, children }: { icon: typeof ShieldCheck; title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{text}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, icon: Icon, mono }: { label: string; value: string; icon: typeof MapPin; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-gray-500 inline-flex items-center gap-1.5">
        <Icon className="w-3 h-3 text-gray-400" /> {label}
      </span>
      <span className={`font-semibold text-gray-900 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

function MiniMap({ gps }: { gps: string }) {
  const [lat, lng] = gps.split(',').map(s => parseFloat(s.trim()));
  if (isNaN(lat) || isNaN(lng)) return null;
  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
      <LeafletMap markers={[{ lat, lng, label: 'GPS' }]} height="160px" zoom={10} />
    </div>
  );
}

function AllCertsModal({ product, c, onClose }: { product: Product; c: typeof PRODUCT_PAGE_CONTENT['fr']['guarantees']; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" /> {c.allCertsTitle}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          {product.certifications.map(cert => (
            <div key={cert} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-bold text-sm text-gray-900">{cert}</p>
                <p className="text-xs text-gray-500">{c.verifiedWithBody}</p>
              </div>
              <button className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="font-bold text-sm text-gray-900">{c.labAnalysis}</p>
              <p className="text-xs text-gray-500">{c.labReport}</p>
            </div>
            <button className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="font-bold text-sm text-gray-900">{c.phytoCert}</p>
              <p className="text-xs text-gray-500">{c.forEuExport}</p>
            </div>
            <button className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof ShieldCheck; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-brand-600" />
      </div>
      <h2 className="text-xl sm:text-2xl font-black text-gray-900">{title}</h2>
    </div>
  );
}

function formatDate(d: string) { return new Date(d).toLocaleDateString('fr-FR'); }

export { SectionTitle, formatDate };
