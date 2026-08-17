import { useState } from 'react';
import {
  Sprout, Leaf, Calendar, Package, Truck, MapPin,
  ChevronRight, Coffee,
} from 'lucide-react';
import type { Product } from '../../lib/supabase';
import { LeafletMap } from '../LeafletMap';
import { SectionTitle, formatDate } from './GuaranteesSection';
import { useI18n } from '../../lib/i18n';
import { PRODUCT_PAGE_CONTENT } from '../../lib/i18n/content/productPage';

export default function TraceabilitySection({ product }: { product: Product }) {
  const { locale } = useI18n();
  const c = PRODUCT_PAGE_CONTENT[locale].traceability;
  const [openStep, setOpenStep] = useState<number | null>(0);

  const stepIcons = [Sprout, Leaf, Calendar, Coffee, Package, Truck];
  const steps = [
    {
      icon: stepIcons[0], title: c.steps[0].title,
      date: product.planting_date ? formatDate(product.planting_date) : '—',
      detail: `${c.locationWord}: ${product.country}. ${c.methodWord}: ${product.farming_method ?? '—'}.`,
      photo: product.image_url ?? null,
    },
    {
      icon: stepIcons[1], title: c.steps[1].title,
      date: c.growthDuration,
      detail: c.steps[1].detail,
      photo: null,
    },
    {
      icon: stepIcons[2], title: c.steps[2].title,
      date: product.harvest_date ? formatDate(product.harvest_date) : '—',
      detail: c.steps[2].detail,
      photo: product.image_url ?? null,
    },
    {
      icon: stepIcons[3], title: c.steps[3].title,
      date: product.harvest_date ? formatDate(product.harvest_date) : '—',
      detail: c.steps[3].detail,
      photo: null,
    },
    {
      icon: stepIcons[4], title: c.steps[4].title,
      date: product.packaging_date ? formatDate(product.packaging_date) : '—',
      detail: `${product.batch_number ? `${c.lotNo} : ${product.batch_number}. ` : ''}${product.packaging_types?.length ? `${c.packagingWord} : ${product.packaging_types.map((pk: string) => c.packagingLabels[pk] ?? pk).join(', ')}. ` : c.euLabeling + ' '}`,
      photo: null,
    },
    {
      icon: stepIcons[5], title: c.steps[5].title,
      date: c.availableNow,
      detail: `${c.volumeAvailable}: ${product.stock_value.toLocaleString('fr-FR')} ${product.stock_unit}.`,
      photo: null,
    },
  ];

  const [lat, lng] = product.gps_coordinates
    ? product.gps_coordinates.split(',').map(s => parseFloat(s.trim()))
    : [NaN, NaN];

  return (
    <section className="py-12 border-t border-gray-100">
      <SectionTitle icon={MapPin} title={c.sectionTitle} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="relative">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isOpen = openStep === i;
              return (
                <div key={i} className="flex gap-4 pb-4 relative">
                  {i < steps.length - 1 && (
                    <div className="absolute left-5 top-12 w-0.5 h-[calc(100%-1rem)] bg-gradient-to-b from-brand-200 to-brand-50" />
                  )}
                  <button
                    onClick={() => setOpenStep(isOpen ? null : i)}
                    className="w-10 h-10 rounded-xl bg-brand-50 border-2 border-brand-200 flex items-center justify-center flex-shrink-0 z-10 hover:bg-brand-100 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-brand-600" />
                  </button>
                  <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <button onClick={() => setOpenStep(isOpen ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 transition-colors">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{step.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{step.date}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                        <p className="text-sm text-gray-600 leading-relaxed">{step.detail}</p>
                        {step.photo && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
                            <img src={step.photo} alt={step.title} className="w-full h-40 object-cover" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-4 border-b border-gray-50">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500" /> {c.journeyTitle}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{c.journeySubtitle}</p>
            </div>
            {!isNaN(lat) && !isNaN(lng) ? (
              <LeafletMap
                markers={[
                  { lat, lng, label: `${c.origin} — ${product.country}` },
                  { lat: 48.8566, lng: 2.3522, label: c.yourDestination },
                ]}
                height="280px"
                zoom={2}
              />
            ) : (
              <div className="h-[280px] bg-gray-50 flex items-center justify-center text-sm text-gray-400">
                {c.noGps}
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                <span className="text-gray-600">{c.origin}: {product.country_flag} {product.country}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-gray-600">{c.destination}: {c.yourAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
