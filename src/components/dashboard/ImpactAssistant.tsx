// =============================================================
// EthiMarket — Assistant d'impact (formulaires produit)
//
// Les agriculteurs ne connaissent pas leur empreinte CO2/eau :
// une ACV coûte plusieurs milliers d'euros. Cet encart remplace
// les champs numériques bruts par une ESTIMATION automatique
// calculée par le moteur local (Agribalyse 3.1, Poore & Nemecek
// 2018, Water Footprint Network) selon le type de produit et la
// méthode agricole — avec un mode expert « J'ai une ACV » pour
// les producteurs équipés.
// =============================================================

import { useMemo, useState } from 'react';
import { Leaf, Droplets, FileCheck2, Sparkles, X } from 'lucide-react';
import { estimateFootprints } from '../../lib/impactEstimator';
import { useI18n } from '../../lib/i18n';

export interface ImpactAssistantProps {
  /** Indices de catégorie (type produit saisi, nom catégorie, nom produit) */
  productType: string;
  categoryName?: string;
  productName?: string;
  farmingMethod?: string;
  certifications?: string[];
  /** Valeurs saisies manuellement (mode ACV) — chaînes des inputs */
  co2Value: string;
  waterValue: string;
  /** true si le producteur déclare disposer d'une ACV produit */
  hasAcv: boolean;
  onChange: (field: 'carbon_footprint_kg' | 'water_footprint_liters', value: string) => void;
  onToggleAcv: (hasAcv: boolean) => void;
  inputClass: string;
  labelClass: string;
}

export default function ImpactAssistant({
  productType, categoryName, productName, farmingMethod, certifications,
  co2Value, waterValue, hasAcv, onChange, onToggleAcv, inputClass, labelClass,
}: ImpactAssistantProps) {
  const { tx } = useI18n();
  const [showMethodology, setShowMethodology] = useState(false);

  const estimate = useMemo(() => estimateFootprints({
    product_type: productType || undefined,
    category_name: categoryName || undefined,
    name: productName || undefined,
    farming_method: farmingMethod || undefined,
    certifications: certifications ?? [],
  }), [productType, categoryName, productName, farmingMethod, certifications]);

  const nf = (n: number) => n.toLocaleString('fr-FR');

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-emerald-900 inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            {tx('Empreintes CO2 & eau — calculées pour vous')}
          </p>
          <p className="text-[11px] text-emerald-800/80 mt-1">
            {tx('Pas besoin de mesurer vous-même : EthiMarket estime vos empreintes à partir de références scientifiques (Agribalyse, Poore & Nemecek, Water Footprint Network) selon votre type de produit et votre méthode agricole.')}
          </p>
        </div>
      </div>

      {/* Estimation automatique */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-emerald-100 p-3">
          <p className="text-[11px] font-bold text-gray-500 inline-flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            {tx('Empreinte carbone estimée')}
          </p>
          <p className="text-lg font-black text-gray-900 mt-0.5">
            ~{nf(estimate.co2PerKg)} <span className="text-xs font-bold text-gray-500">kg CO2e/kg</span>
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {tx('Référence conventionnelle de la catégorie :')} {nf(estimate.co2ConventionalPerKg)} kg CO2e/kg (±{estimate.co2UncertaintyPct}%)
          </p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-100 p-3">
          <p className="text-[11px] font-bold text-gray-500 inline-flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            {tx('Empreinte eau estimée')}
          </p>
          <p className="text-lg font-black text-gray-900 mt-0.5">
            ~{nf(estimate.waterPerKg)} <span className="text-xs font-bold text-gray-500">L/kg</span>
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {tx('Référence conventionnelle de la catégorie :')} {nf(estimate.waterConventionalPerKg)} L/kg (±{estimate.waterUncertaintyPct}%)
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="inline-flex items-center gap-1 bg-white border border-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-lg">
          📊 {tx('Estimation sectorielle sourcée')}
        </span>
        {estimate.isBio && (
          <span className="inline-flex items-center gap-1 bg-white border border-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-lg">
            🌱 {tx('Réduction bio appliquée (méta-analyses scientifiques)')}
          </span>
        )}
        <button
          type="button"
          onClick={() => setShowMethodology(v => !v)}
          className="text-emerald-700 underline decoration-dotted font-semibold cursor-pointer"
        >
          {showMethodology ? tx('Masquer la méthodologie') : tx('Voir la méthodologie')}
        </button>
      </div>

      {showMethodology && (
        <div className="bg-white rounded-xl border border-emerald-100 p-3 text-[11px] text-gray-600 space-y-1">
          <p><span className="font-bold">CO2 :</span> {estimate.co2SourceLabel}</p>
          <p><span className="font-bold">{tx('Eau')} :</span> {estimate.waterSourceLabel}</p>
          <p>{tx('Ces valeurs sont des moyennes sectorielles mondiales, toujours affichées comme estimations dans le Trust Center. Elles sont remplacées par vos données dès que vous fournissez une ACV.')}</p>
        </div>
      )}

      {/* Mode expert : ACV produit */}
      {!hasAcv ? (
        <button
          type="button"
          onClick={() => onToggleAcv(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:border-emerald-400 px-3 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <FileCheck2 className="w-4 h-4 text-gray-400" />
          {tx('J\'ai une analyse de cycle de vie (ACV) : saisir mes valeurs mesurées')}
        </button>
      ) : (
        <div className="bg-white rounded-xl border border-emerald-200 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-gray-800 inline-flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              {tx('Valeurs mesurées (ACV produit)')}
            </p>
            <button
              type="button"
              onClick={() => { onToggleAcv(false); onChange('carbon_footprint_kg', ''); onChange('water_footprint_liters', ''); }}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-red-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              {tx('Revenir à l\'estimation automatique')}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{tx('Empreinte carbone mesurée (kg CO2e / kg)')}</label>
              <input
                type="number" step="0.1" min="0"
                value={co2Value}
                onChange={e => onChange('carbon_footprint_kg', e.target.value)}
                placeholder={`~${nf(estimate.co2PerKg)}`}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{tx('Empreinte eau mesurée (litres / kg)')}</label>
              <input
                type="number" step="1" min="0"
                value={waterValue}
                onChange={e => onChange('water_footprint_liters', e.target.value)}
                placeholder={`~${nf(estimate.waterPerKg)}`}
                className={inputClass}
              />
            </div>
          </div>
          <p className="text-[10px] text-gray-500">
            {tx('Ces valeurs seront affichées comme « ACV producteur » dans le Trust Center et rapporteront plus de points au Responsibility Score qu\'une estimation.')}
          </p>
        </div>
      )}
    </div>
  );
}
