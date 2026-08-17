import { Sprout, Globe, Users, Heart, Droplets, TreePine, GraduationCap, ShieldCheck, Scale, Award, Info } from 'lucide-react';
import type { Product } from '../../lib/supabase';
import { SectionTitle } from './GuaranteesSection';
import { useI18n } from '../../lib/i18n';
import { PRODUCT_PAGE_CONTENT } from '../../lib/i18n/content/productPage';
import {
  calculateCarbonFootprint,
  calculateWaterFootprint,
  calculateBiodiversity,
  calculateEconomicImpact,
  calculateSocialImpact,
} from '../../lib/calculations';

export default function ImpactSection({
  product,
  producer,
  quantity,
}: {
  product: Product;
  producer?: Record<string, unknown> | null;
  quantity: number;
}) {
  const { locale } = useI18n();
  const c = PRODUCT_PAGE_CONTENT[locale].impact;
  const qtyKg = Math.max(1, quantity);
  const orderAmount = (product.price || 0) * qtyKg;

  // Dynamic calculations based on scientific models
  const carbon = calculateCarbonFootprint(product, producer, qtyKg, 'France', 'maritime');
  const water = calculateWaterFootprint(product, producer, qtyKg);
  const bio = calculateBiodiversity(producer, qtyKg, product);
  const eco = calculateEconomicImpact(product, producer, qtyKg, orderAmount);
  const soc = calculateSocialImpact(producer, qtyKg, orderAmount);

  const producerSourceBadge = producer?.surface_value || producer?.farm_size || producer?.full_time_employees || producer?.families_impacted
    ? c.producerData
    : c.sectorEstimate;

  return (
    <section className="py-12 border-t border-gray-100">
      <SectionTitle icon={Sprout} title={c.sectionTitle} />

      <div className="bg-brand-50/60 rounded-2xl p-4 border border-brand-100 my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-700">
            {c.measuredFor} <span className="font-bold text-gray-900">{qtyKg.toLocaleString('fr-FR')} {product.price_unit || 'kg'}</span> {c.of} {product.name} ({orderAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €)
          </p>
          <p className="text-xs text-brand-700 font-medium mt-0.5">
            {c.realtime}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-white px-3 py-1.5 rounded-xl border border-brand-200 shadow-2xs whitespace-nowrap">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          {c.auditBadge}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Environmental */}
        <ImpactCard
          icon={TreePine}
          title={c.climateTitle}
          subtitle={c.climateSubtitle}
          color="emerald"
        >
          <ImpactRow
            label={c.carbonOrder}
            value={`${carbon.totalCO2e.toLocaleString('fr-FR')} kg CO2e`}
            sourceBadge={carbon.inputs?.dataSource ?? producerSourceBadge}
            subtext={`Production ${carbon.production.value.toLocaleString('fr-FR')} + transport ${carbon.transport.value.toLocaleString('fr-FR')} + emballage ${carbon.packaging.value.toLocaleString('fr-FR')} kg — ${carbon.methodologyScope ?? 'cradle-to-customer'}`}
            methodology={carbon.methodology}
            icon={Sprout}
          />
          <ImpactRow
            label={c.carbonSaved}
            value={`${carbon.savedCO2e.toLocaleString('fr-FR')} kg CO2e (−${carbon.savedPercentage}%)`}
            sourceBadge="📊 Clark & Tilman 2017"
            subtext="Écart bio/conventionnel par kg issu des méta-analyses scientifiques — même transport, même emballage"
            methodology={carbon.methodology}
            icon={Sprout}
          />
          <ImpactRow
            label={c.waterFootprint}
            value={`${water.bioWaterL.toLocaleString('fr-FR')} Litres`}
            sourceBadge={water.inputs?.dataSource ?? '📊 Water Footprint Network'}
            subtext={water.breakdown ? `Verte (pluie) ${water.breakdown.greenL.toLocaleString('fr-FR')} L · bleue (irrigation) ${water.breakdown.blueL.toLocaleString('fr-FR')} L · grise (dilution) ${water.breakdown.greyL.toLocaleString('fr-FR')} L` : 'Mekonnen & Hoekstra 2011'}
            methodology={water.methodology}
            icon={Droplets}
          />
          <ImpactRow
            label={c.waterSaved}
            value={`${water.savedWaterL.toLocaleString('fr-FR')} Litres`}
            sourceBadge="📊 WFN — Hoekstra 2011"
            subtext="Le bio réduit l'eau grise (dilution des intrants de synthèse) — l'eau de pluie dépend du climat, pas du label"
            methodology={water.methodology}
            icon={Droplets}
          />
          <ImpactRow
            label={c.treesPreserved}
            value={`${bio.treesPreserved.toLocaleString('fr-FR')} ${c.trees}`}
            sourceBadge={producerSourceBadge}
            subtext={c.basedOnFarm}
            methodology={bio.methodology}
            icon={TreePine}
          />
          <ImpactRow
            label={c.biodiversity}
            value={`${bio.speciesProtected} ${c.species}`}
            sourceBadge={producerSourceBadge}
            subtext={c.basedOnDensities}
            methodology={bio.methodology}
            icon={Award}
          />
        </ImpactCard>

        {/* 2. Economic */}
        <ImpactCard
          icon={Globe}
          title={c.ecoTitle}
          subtitle={c.ecoSubtitle}
          color="brand"
        >
          <ImpactRow
            label={c.producerRevenue}
            value={`${eco.producerRevenue.toLocaleString('fr-FR')} €`}
            sourceBadge={c.ethimarketModel}
            subtext={c.directPayment}
            methodology={eco.methodology}
            icon={Scale}
          />
          <ImpactRow
            label={c.families}
            value={`${eco.familiesBeneficiary} ${c.family}`}
            sourceBadge={eco.inputs.dataSource}
            subtext={c.basedOnImpact}
            methodology={eco.methodology}
            icon={Users}
          />
          <ImpactRow
            label={c.gainVsConv}
            value={`+${eco.revenueIncrease}%`}
            sourceBadge={c.ethimarketModel}
            subtext={c.guaranteedIncome}
            methodology={eco.methodology}
            icon={Globe}
          />
          <ImpactRow
            label={c.devPremium}
            value={`${eco.fairtradePremuim.toLocaleString('fr-FR')} €`}
            sourceBadge={c.ethimarketModel}
            subtext={c.coopFund}
            methodology={eco.methodology}
            icon={ShieldCheck}
          />
        </ImpactCard>

        {/* 3. Social */}
        <ImpactCard
          icon={Heart}
          title={c.socialTitle}
          subtitle={c.socialSubtitle}
          color="amber"
        >
          <ImpactRow
            label={c.jobsSupported}
            value={`${soc.jobsSupported} ${c.persons}`}
            sourceBadge={soc.inputs.dataSource}
            subtext={c.decentJobs}
            methodology={soc.methodology}
            icon={Users}
          />
          <ImpactRow
            label={c.training}
            value={`${soc.trainingHours} ${c.hours}`}
            sourceBadge={c.ethimarketModel}
            subtext={c.trainingBudget}
            methodology={soc.methodology}
            icon={GraduationCap}
          />
          <ImpactRow
            label={c.educationFund}
            value={`${soc.educationContribution.toLocaleString('fr-FR')} €`}
            sourceBadge={c.ethimarketModel}
            subtext={`${c.supportsChildren}${soc.childrenImpacted} ${c.children}`}
            methodology={soc.methodology}
            icon={Heart}
          />
          <ImpactRow
            label={c.socialGuarantees}
            value={soc.healthCoverage ? c.healthCoverage : c.basicGuarantees}
            sourceBadge={c.producerData}
            subtext={c.healthInsurance}
            methodology={soc.methodology}
            icon={ShieldCheck}
          />
        </ImpactCard>
      </div>

      {/* Global Disclaimer */}
      <div className="mt-8 bg-gray-50 rounded-2xl p-4 border border-gray-200 text-center text-xs text-gray-600 font-medium leading-relaxed">
        <p>
          ⚖️ <span className="font-bold text-gray-800">{c.disclaimerLabel}</span> {c.disclaimer}
        </p>
      </div>
    </section>
  );
}

function ImpactCard({
  icon: Icon,
  title,
  subtitle,
  color,
  children,
}: {
  icon: typeof Globe;
  title: string;
  subtitle: string;
  color: 'brand' | 'emerald' | 'amber';
  children: React.ReactNode;
}) {
  const colors = {
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm leading-tight">{title}</h3>
            <p className="text-[10px] text-gray-500 font-medium">{subtitle}</p>
          </div>
        </div>
        <div className="space-y-3 mt-4">{children}</div>
      </div>
    </div>
  );
}

function ImpactRow({
  label,
  value,
  sourceBadge,
  subtext,
  methodology,
  icon: Icon,
}: {
  label: string;
  value: string;
  sourceBadge?: string;
  subtext?: string;
  methodology?: string;
  icon?: typeof Sprout;
}) {
  return (
    <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-700 inline-flex items-center gap-1.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />}
          {label}
        </span>
        <span className="text-xs font-black text-gray-900 text-right">{value}</span>
      </div>

      <div className="flex items-center justify-between gap-2 pt-0.5">
        {subtext && <p className="text-[10px] text-gray-500">{subtext}</p>}
        {sourceBadge && (
          <span className="text-[9px] font-bold text-gray-600 bg-white px-1.5 py-0.5 rounded border border-gray-200 whitespace-nowrap ml-auto">
            {sourceBadge}
          </span>
        )}
      </div>

      {methodology && (
        <p className="text-[9px] text-gray-500 italic border-t border-gray-100 pt-1 mt-1 flex items-center gap-1">
          <Info className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
          <span>Méthode: {methodology}</span>
        </p>
      )}
    </div>
  );
}
