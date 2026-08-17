import { useState } from 'react';
import { ClipboardList, Package, FlaskConical, Thermometer } from 'lucide-react';
import type { Product } from '../../lib/supabase';
import { SectionTitle } from './GuaranteesSection';
import { useI18n } from '../../lib/i18n';
import { PRODUCT_PAGE_CONTENT } from '../../lib/i18n/content/productPage';

const TAB_IDS = ['specs', 'packaging', 'nutrition', 'storage'] as const;
const TAB_ICONS = { specs: ClipboardList, packaging: Package, nutrition: FlaskConical, storage: Thermometer } as const;

export default function TechnicalDetailsSection({ product }: { product: Product }) {
  const { locale } = useI18n();
  const c = PRODUCT_PAGE_CONTENT[locale].technical;
  const [active, setActive] = useState<typeof TAB_IDS[number]>('specs');

  const TABS = [
    { id: 'specs', label: c.characteristics, icon: TAB_ICONS.specs },
    { id: 'packaging', label: c.tabPackaging, icon: TAB_ICONS.packaging },
    { id: 'nutrition', label: c.tabNutrition, icon: TAB_ICONS.nutrition },
    { id: 'storage', label: c.tabStorage, icon: TAB_ICONS.storage },
  ] as const;

  const specs: [string, string][] = [
    [c.country, `${product.country_flag} ${product.country}`],
    [c.farmingMethod, product.farming_method ?? c.notProvided],
    [c.basePrice, `${product.price} €/${product.price_unit}`],
    [c.minQty, `${product.moq_value} ${product.moq_unit}`],
    [c.stockAvailable, `${product.stock_value.toLocaleString('fr-FR')} ${product.stock_unit}`],
    [c.monthlyCapacity, `${product.monthly_capacity.toLocaleString('fr-FR')} ${product.stock_unit}`],
    [c.deliveryTime, `${product.delivery_days} ${c.days}`],
    [c.certifications, product.certifications.length > 0 ? product.certifications.join(', ') : c.none],
  ];

  const packaging: [string, string][] = [
    [c.pkgType, c.pkgTypeVal],
    [c.pkgMaterial, c.pkgMaterialVal],
    [c.pkgLabeling, c.pkgLabelingVal],
    [c.pkgUnitWeight, `${product.moq_value} ${product.moq_unit}`],
  ];

  const nutrition: [string, string][] = [
    [c.humidity, '10.5%'],
    [c.density, '720 g/L'],
    [c.scaScore, '87'],
    [c.fullReport, c.downloadPdf],
  ];

  const storage: [string, string][] = [
    [c.temperature, '15-25°C'],
    [c.humidity, '< 65%'],
    [c.shelfLife, `12 ${c.months}`],
    [c.awayFrom, c.awayFromVal],
  ];

  const content: Record<string, [string, string][]> = {
    specs, packaging, nutrition, storage,
  };

  return (
    <section className="py-12 border-t border-gray-100">
      <SectionTitle icon={ClipboardList} title={c.sectionTitle} />

      <div className="mt-8 bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100 flex overflow-x-auto scrollbar-hide">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 flex-shrink-0 ${
                  active === tab.id ? 'border-brand-500 text-brand-700 bg-brand-50/50' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content[active].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <dt className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{k}</dt>
                <dd className="text-sm font-bold text-gray-900 text-right">{v}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
