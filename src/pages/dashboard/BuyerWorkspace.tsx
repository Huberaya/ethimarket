// =============================================================
// EthiMarket — Espace Acheteur « Mes achats »
// 4 onglets : Fournisseurs (actifs/en évaluation/à risque/suspendus),
// Produits (approuvés/en analyse/rejetés + alternatives), Achats
// (économies, impact, évolution du score, dépenses responsables),
// Mes règles (pondérations personnalisées + profil appris).
// =============================================================

import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Factory, PackageSearch, TrendingUp, SlidersHorizontal, Star,
  Sparkles, PiggyBank, Leaf, BarChart3, Wallet, RefreshCw, Loader2,
  CheckCircle2, Clock, AlertTriangle, Ban, XCircle, Search, Brain,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { supabase, Product } from '../../lib/supabase';
import { useI18n } from '../../lib/i18n';
import {
  getTrackedSuppliers, setSupplierStatus, getTrackedProducts, setProductStatus,
  getPurchases, addPurchase, computePurchaseAnalytics, getBuyerPreferences,
  saveBuyerWeights, refreshLearnedProfile, effectiveWeights,
  TrackedSupplier, TrackedProduct, PurchaseRecord, BuyerPreferences, BuyerWeights,
  SupplierTrackStatus, ProductTrackStatus, DEFAULT_WEIGHTS,
} from '../../lib/buyerWorkspace';
import { findAlternativeProducts } from '../../lib/alternativeProductsEngine';
import { getMyOrganization, Organization } from '../../lib/organizationService';

type Tab = 'suppliers' | 'products' | 'purchases' | 'rules';

const SUPPLIER_STATUS_META: Record<SupplierTrackStatus, { labelKey: string; icon: typeof CheckCircle2; cls: string }> = {
  active: { labelKey: 'bw.active', icon: CheckCircle2, cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  evaluating: { labelKey: 'bw.evaluating', icon: Clock, cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  at_risk: { labelKey: 'bw.atRisk', icon: AlertTriangle, cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  suspended: { labelKey: 'bw.suspended', icon: Ban, cls: 'bg-red-100 text-red-800 border-red-200' },
};

const PRODUCT_STATUS_META: Record<ProductTrackStatus, { labelKey: string; icon: typeof CheckCircle2; cls: string }> = {
  approved: { labelKey: 'bw.approved', icon: CheckCircle2, cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  analyzing: { labelKey: 'bw.analyzing', icon: Search, cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  rejected: { labelKey: 'bw.rejected', icon: XCircle, cls: 'bg-red-100 text-red-800 border-red-200' },
};

const WEIGHT_LABELS: Record<keyof BuyerWeights, { labelKey: string; emoji: string }> = {
  price: { labelKey: 'bw.price', emoji: '💶' },
  environment: { labelKey: 'bw.environment', emoji: '🌍' },
  social: { labelKey: 'bw.social', emoji: '🤝' },
  traceability: { labelKey: 'bw.traceability', emoji: '🔍' },
  certifications: { labelKey: 'bw.certifications', emoji: '🏅' },
};

export default function BuyerWorkspace() {
  const { t, tx } = useI18n();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = (['suppliers', 'products', 'purchases', 'rules'] as Tab[]).includes(searchParams.get('tab') as Tab)
    ? (searchParams.get('tab') as Tab) : 'purchases';
  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    const t = searchParams.get('tab') as Tab | null;
    if (t && (['suppliers', 'products', 'purchases', 'rules'] as Tab[]).includes(t)) setTab(t);
  }, [searchParams]);
  const [suppliers, setSuppliers] = useState<TrackedSupplier[]>([]);
  const [products, setProducts] = useState<TrackedProduct[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [prefs, setPrefs] = useState<BuyerPreferences | null>(null);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRules, setSavingRules] = useState(false);
  const [rulesMsg, setRulesMsg] = useState('');
  const [draftWeights, setDraftWeights] = useState<BuyerWeights>({ ...DEFAULT_WEIGHTS });
  const [useLearned, setUseLearned] = useState(true);
  const [refreshingLearn, setRefreshingLearn] = useState(false);
  const [orgInfo, setOrgInfo] = useState<Organization | null>(null);

  const reload = async () => {
    if (!user) return;
    setLoading(true);
    const [s, p, pu, pr, cat] = await Promise.all([
      getTrackedSuppliers(user.id),
      getTrackedProducts(user.id),
      getPurchases(user.id),
      getBuyerPreferences(user.id),
      supabase.from('products').select('*, producers(*)').eq('status', 'active').limit(100).then(r => (r.data ?? []) as Product[]),
    ]);
    setSuppliers(s); setProducts(p); setPurchases(pu); setPrefs(pr); setCatalog(cat);
    void getMyOrganization(user.id).then(o => setOrgInfo(o.organization));
    setDraftWeights({ ...pr.weights });
    setUseLearned(pr.useLearnedAdjustments);
    setLoading(false);
  };

  useEffect(() => { void reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user?.id]);

  const analytics = useMemo(() => computePurchaseAnalytics(purchases), [purchases]);
  const effective = useMemo(() => prefs ? effectiveWeights({ ...prefs, weights: draftWeights, useLearnedAdjustments: useLearned }) : null, [prefs, draftWeights, useLearned]);
  const weightsSum = Object.values(draftWeights).reduce((a, b) => a + b, 0);

  const supplierGroups = useMemo(() => {
    const g: Record<SupplierTrackStatus, TrackedSupplier[]> = { active: [], evaluating: [], at_risk: [], suspended: [] };
    suppliers.forEach(s => g[s.status]?.push(s));
    return g;
  }, [suppliers]);

  const productGroups = useMemo(() => {
    const g: Record<ProductTrackStatus, TrackedProduct[]> = { approved: [], analyzing: [], rejected: [] };
    products.forEach(p => g[p.status]?.push(p));
    return g;
  }, [products]);

  // Alternatives pour les produits rejetés
  const alternativesForRejected = useMemo(() => {
    const out: Record<string, Product[]> = {};
    productGroups.rejected.forEach(tp => {
      if (!tp.product) return;
      out[tp.product_id] = findAlternativeProducts(tp.product, catalog).slice(0, 2).map(a => a.alternativeProduct);
    });
    return out;
  }, [productGroups.rejected, catalog]);

  if (!user) return null;
  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>;
  }

  const TABS: { id: Tab; label: string; icon: typeof Factory }[] = [
    { id: 'purchases', label: t('bw.tabPurchases'), icon: TrendingUp },
    { id: 'suppliers', label: t('bw.tabSuppliers'), icon: Factory },
    { id: 'products', label: t('bw.tabProducts'), icon: PackageSearch },
    { id: 'rules', label: t('bw.tabRules'), icon: SlidersHorizontal },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">{t('bw.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pilotez vos fournisseurs, vos produits et vos achats responsables — la plateforme apprend de vos décisions.
        </p>
      </div>

      {/* Insight appris (toujours visible) */}
      {prefs?.learned && prefs.learned.insights.length > 0 && prefs.learned.eventsAnalyzed >= 3 && (
        <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4 flex items-start gap-3">
          <Brain className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black text-violet-600 uppercase tracking-wide">{tx('Ce que la plateforme a appris de vous')}</p>
            {prefs.learned.insights.map((ins, i) => (
              <p key={i} className="text-sm text-violet-900 font-medium mt-0.5">« {ins} »</p>
            ))}
            <p className="text-[11px] text-violet-500 mt-1">{prefs.learned.eventsAnalyzed} décisions analysées · Vos recommandations sont ajustées en conséquence{useLearned ? '' : ' (ajustements désactivés dans Mes règles)'}.</p>
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tb => {
          const Icon = tb.icon;
          return (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer ${
                tab === tb.id ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {tb.label}
            </button>
          );
        })}
      </div>

      {/* ================= ONGLET ACHATS ================= */}
      {tab === 'purchases' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 text-emerald-600"><PiggyBank className="w-4 h-4" /><span className="text-xs font-bold uppercase">{tx('Économies')}</span></div>
              <p className="text-2xl font-black text-gray-900 mt-2">{analytics.savings.toLocaleString('fr-FR')} €</p>
              <p className="text-[11px] text-gray-500 mt-1">vs prix de référence marché{analytics.premiumPaid > 0 ? ` · prime conformité payée : ${analytics.premiumPaid.toLocaleString('fr-FR')} €` : ''}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 text-emerald-600"><Leaf className="w-4 h-4" /><span className="text-xs font-bold uppercase">{tx('Impact')}</span></div>
              <p className="text-2xl font-black text-gray-900 mt-2">{analytics.totalCarbonKg} kg</p>
              <p className="text-[11px] text-gray-500 mt-1">{t('bw.co2Total')}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 text-emerald-600"><BarChart3 className="w-4 h-4" /><span className="text-xs font-bold uppercase">{t('bw.avgScore')}</span></div>
              <p className="text-2xl font-black text-gray-900 mt-2">{analytics.avgEthicalScore}<span className="text-sm text-gray-400">/100</span></p>
              <p className="text-[11px] text-gray-500 mt-1">{analytics.purchaseCount} achat{analytics.purchaseCount > 1 ? 's' : ''} enregistré{analytics.purchaseCount > 1 ? 's' : ''}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 text-emerald-600"><Wallet className="w-4 h-4" /><span className="text-xs font-bold uppercase">{t('bw.spending')}</span></div>
              <p className="text-2xl font-black text-gray-900 mt-2">{analytics.responsibleSharePct}%</p>
              <p className="text-[11px] text-gray-500 mt-1">{analytics.responsibleSpent.toLocaleString('fr-FR')} € sur {analytics.totalSpent.toLocaleString('fr-FR')} €</p>
            </div>
          </div>

          {/* Évolution du score */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">{tx('📈 Évolution du score éthique de vos achats')}</h3>
            {analytics.scoreTrend.length === 0 ? (
              <p className="text-sm text-gray-400 italic">{t('bw.recordPurchases')}</p>
            ) : (
              <div className="flex items-end gap-2 h-32">
                {analytics.scoreTrend.slice(-12).map(pt => (
                  <div key={pt.month} className="flex-1 flex flex-col items-center gap-1" title={`${pt.month} : score ${pt.avgScore}/100 · ${pt.spent} €`}>
                    <span className="text-[10px] font-bold text-emerald-700">{pt.avgScore}</span>
                    <div className="w-full rounded-t-lg bg-emerald-400" style={{ height: `${Math.max(4, pt.avgScore)}%` }} />
                    <span className="text-[9px] text-gray-500">{pt.month.slice(5)}/{pt.month.slice(2, 4)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enregistrement rapide d'un achat */}
          <QuickPurchaseForm userId={user.id} catalog={catalog} onAdded={reload} />

          {/* Historique */}
          {purchases.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">{tx('Historique')}</h3>
              <ul className="divide-y divide-gray-50">
                {purchases.slice(0, 10).map(p => (
                  <li key={p.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-gray-800">{p.product_name} <span className="text-gray-400">× {p.quantity}</span></span>
                    <span className="flex items-center gap-3">
                      {p.ethical_score ? <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{p.ethical_score}/100</span> : null}
                      <span className="font-bold text-gray-900 tabular-nums">{(p.unit_price * p.quantity).toLocaleString('fr-FR')} €</span>
                      <span className="text-[11px] text-gray-500">{new Date(p.purchased_at).toLocaleDateString('fr-FR')}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ================= ONGLET FOURNISSEURS ================= */}
      {tab === 'suppliers' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(SUPPLIER_STATUS_META) as SupplierTrackStatus[]).map(st => {
              const meta = SUPPLIER_STATUS_META[st];
              const Icon = meta.icon;
              return (
                <div key={st} className={`rounded-2xl border-2 p-4 ${meta.cls}`}>
                  <div className="flex items-center gap-2"><Icon className="w-4 h-4" /><span className="text-xs font-black uppercase">{t(meta.labelKey)}</span></div>
                  <p className="text-2xl font-black mt-1">{supplierGroups[st].length}</p>
                </div>
              );
            })}
          </div>

          {suppliers.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <Factory className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">{tx('Vous ne suivez encore aucun fournisseur.')}</p>
              <Link to="/producteurs" className="inline-block mt-3 text-sm font-bold text-brand-700 hover:underline">{tx('Parcourir les producteurs →')}</Link>
            </div>
          )}

          {(Object.keys(SUPPLIER_STATUS_META) as SupplierTrackStatus[]).map(st =>
            supplierGroups[st].length > 0 && (
              <div key={st} className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">{t(SUPPLIER_STATUS_META[st].labelKey)}</h3>
                <ul className="divide-y divide-gray-50">
                  {supplierGroups[st].map(s => (
                    <li key={s.id} className="py-3 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{s.producer?.country_flag ?? '🏭'}</span>
                        <div>
                          <Link to={`/boutique/${s.producer?.slug}`} className="font-bold text-gray-900 hover:text-brand-700 text-sm">{s.producer?.name ?? 'Fournisseur'}</Link>
                          <p className="text-[11px] text-gray-500">{s.producer?.country} · <Star className="w-3 h-3 inline text-amber-400" /> {s.producer?.rating ?? '—'}</p>
                        </div>
                      </div>
                      <select
                        value={s.status}
                        onChange={async e => { await setSupplierStatus(user.id, s.producer_id, e.target.value as SupplierTrackStatus); void reload(); }}
                        className="text-xs font-bold border border-gray-200 rounded-lg px-2 py-1.5 bg-white cursor-pointer"
                      >
                        <option value="active">✅ Actif</option>
                        <option value="evaluating">{tx('🕓 En évaluation')}</option>
                        <option value="at_risk">{tx('⚠️ À risque')}</option>
                        <option value="suspended">🚫 Suspendu</option>
                      </select>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
      )}

      {/* ================= ONGLET PRODUITS ================= */}
      {tab === 'products' && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {(Object.keys(PRODUCT_STATUS_META) as ProductTrackStatus[]).map(st => {
              const meta = PRODUCT_STATUS_META[st];
              const Icon = meta.icon;
              return (
                <div key={st} className={`rounded-2xl border-2 p-4 ${meta.cls}`}>
                  <div className="flex items-center gap-2"><Icon className="w-4 h-4" /><span className="text-xs font-black uppercase">{t(meta.labelKey)}</span></div>
                  <p className="text-2xl font-black mt-1">{productGroups[st].length}</p>
                </div>
              );
            })}
          </div>

          {products.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <PackageSearch className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">{t('bw.noTracked')}</p>
              <Link to="/catalogue" className="inline-block mt-3 text-sm font-bold text-brand-700 hover:underline">{tx('Parcourir le catalogue →')}</Link>
            </div>
          )}

          {(Object.keys(PRODUCT_STATUS_META) as ProductTrackStatus[]).map(st =>
            productGroups[st].length > 0 && (
              <div key={st} className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">{t(PRODUCT_STATUS_META[st].labelKey)}</h3>
                <ul className="divide-y divide-gray-50">
                  {productGroups[st].map(tp => (
                    <li key={tp.id} className="py-3">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{tp.product?.emoji ?? '📦'}</span>
                          <div>
                            <Link to={`/produits/${tp.product?.slug}`} className="font-bold text-gray-900 hover:text-brand-700 text-sm">{tp.product?.name ?? 'Produit'}</Link>
                            <p className="text-[11px] text-gray-500">
                              {tp.product?.price} € · {tp.product?.country}
                              {tp.rejection_reason ? ` · Motif de rejet : ${tp.rejection_reason}` : ''}
                            </p>
                          </div>
                        </div>
                        <select
                          value={tp.status}
                          onChange={async e => { if (tp.product) { await setProductStatus(user.id, tp.product, e.target.value as ProductTrackStatus); void reload(); } }}
                          className="text-xs font-bold border border-gray-200 rounded-lg px-2 py-1.5 bg-white cursor-pointer"
                        >
                          <option value="approved">{tx('✅ Approuvé')}</option>
                          <option value="analyzing">🔍 En analyse</option>
                          <option value="rejected">{tx('❌ Rejeté')}</option>
                        </select>
                      </div>
                      {/* Alternatives pour les rejetés */}
                      {st === 'rejected' && (alternativesForRejected[tp.product_id]?.length ?? 0) > 0 && (
                        <div className="mt-2 ml-9 flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-violet-600 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Alternatives :</span>
                          {alternativesForRejected[tp.product_id].map(alt => (
                            <Link key={alt.id} to={`/produits/${alt.slug}`} className="text-[11px] font-semibold bg-violet-50 text-violet-800 border border-violet-200 rounded-full px-2.5 py-1 hover:bg-violet-100">
                              {alt.name} · {alt.price} €
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
      )}

      {/* ================= ONGLET MES RÈGLES ================= */}
      {tab === 'rules' && prefs && (
        <div className="space-y-5 max-w-2xl">
          {orgInfo?.weights_enforced && (
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4" role="status">
              <p className="text-sm font-bold text-amber-900">
                🏢 Les règles de décision de « {orgInfo.name} » sont imposées par votre organisation.
              </p>
              <p className="text-xs text-amber-800 mt-1">
                Prix {orgInfo.weight_price}% · Environnement {orgInfo.weight_environment}% · Social {orgInfo.weight_social}% ·
                Traçabilité {orgInfo.weight_traceability}% · Certifications {orgInfo.weight_certifications}%.
                Vos réglages personnels ci-dessous sont conservés mais inactifs.
              </p>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-900">{tx('⚖️ Mes pondérations de décision')}</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Définissez l'importance de chaque critère dans vos recommandations et comparaisons. La somme doit faire 100%.
            </p>
            <div className="space-y-4">
              {(Object.keys(WEIGHT_LABELS) as (keyof BuyerWeights)[]).map(k => (
                <div key={k}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-gray-700">{WEIGHT_LABELS[k].emoji} {t(WEIGHT_LABELS[k].labelKey)}</label>
                    <span className="text-sm font-black text-gray-900 tabular-nums">{draftWeights[k]}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" step="5"
                    value={draftWeights[k]}
                    onChange={e => setDraftWeights(w => ({ ...w, [k]: parseInt(e.target.value, 10) }))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <div className={`mt-4 text-sm font-bold ${weightsSum === 100 ? 'text-emerald-700' : 'text-red-600'}`}>
              Total : {weightsSum}% {weightsSum !== 100 && '(doit faire 100%)'}
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={useLearned} onChange={e => setUseLearned(e.target.checked)} className="accent-emerald-600 w-4 h-4" />
              Laisser la plateforme affiner ces règles à partir de mes décisions
            </label>

            {effective && useLearned && prefs.learned && Object.keys(prefs.learned.adjustments).length > 0 && (
              <div className="mt-3 rounded-xl bg-violet-50 border border-violet-200 p-3">
                <p className="text-[11px] font-bold text-violet-700 uppercase mb-1">{tx('Pondérations effectives (règles + apprentissage)')}</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(WEIGHT_LABELS) as (keyof BuyerWeights)[]).map(k => (
                    <span key={k} className="text-[11px] font-bold bg-white border border-violet-200 rounded-full px-2.5 py-1 text-violet-900">
                      {WEIGHT_LABELS[k].emoji} {effective[k]}%
                      {prefs.learned?.adjustments[k] ? <span className={prefs.learned.adjustments[k]! > 0 ? 'text-emerald-600' : 'text-red-500'}> ({prefs.learned.adjustments[k]! > 0 ? '+' : ''}{prefs.learned.adjustments[k]})</span> : null}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={async () => {
                  setSavingRules(true);
                  const err = await saveBuyerWeights(user.id, draftWeights, useLearned);
                  setRulesMsg(err ?? t('bw.rulesSaved'));
                  setSavingRules(false);
                }}
                disabled={savingRules || weightsSum !== 100}
                className="btn-primary px-5 py-2.5 text-sm font-bold rounded-xl disabled:opacity-50 cursor-pointer"
              >
                {savingRules ? t('bw.savingRules') : t('bw.saveRules')}
              </button>
              <button
                onClick={async () => {
                  setRefreshingLearn(true);
                  await refreshLearnedProfile(user.id);
                  await reload();
                  setRefreshingLearn(false);
                }}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-violet-700 hover:text-violet-900 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${refreshingLearn ? 'animate-spin' : ''}`} /> Recalculer le profil appris
              </button>
            </div>
            {rulesMsg && <p className="mt-2 text-xs font-semibold text-gray-600">{rulesMsg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Formulaire d'achat rapide ----------
function QuickPurchaseForm({ userId, catalog, onAdded }: { userId: string; catalog: Product[]; onAdded: () => void }) {
  const { t, tx } = useI18n();
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('1');
  const [baseline, setBaseline] = useState('');
  const [saving, setSaving] = useState(false);

  const selected = catalog.find(p => p.id === productId);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3">{tx('➕ Enregistrer un achat')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <select value={productId} onChange={e => setProductId(e.target.value)} className="sm:col-span-2 text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white">
          <option value="">{tx('— Choisir un produit du catalogue —')}</option>
          {catalog.map(p => <option key={p.id} value={p.id}>{p.name} · {p.price} €</option>)}
        </select>
        <input type="number" min="0.1" step="0.1" value={qty} onChange={e => setQty(e.target.value)} placeholder={tx('Quantité')} className="text-sm border border-gray-200 rounded-xl px-3 py-2.5" />
        <input type="number" min="0" step="0.01" value={baseline} onChange={e => setBaseline(e.target.value)} placeholder={tx('Prix marché réf. (€)')} title={tx('Prix unitaire de référence du marché conventionnel — sert au calcul de vos économies')} className="text-sm border border-gray-200 rounded-xl px-3 py-2.5" />
      </div>
      <button
        onClick={async () => {
          if (!selected) return;
          setSaving(true);
          await addPurchase(userId, {
            product: selected,
            productName: selected.name,
            quantity: parseFloat(qty) || 1,
            unitPrice: selected.price,
            baselineUnitPrice: baseline ? parseFloat(baseline) : undefined,
          });
          setProductId(''); setQty('1'); setBaseline('');
          setSaving(false);
          onAdded();
        }}
        disabled={!selected || saving}
        className="mt-3 btn-primary px-4 py-2 text-xs font-bold rounded-xl disabled:opacity-50 cursor-pointer"
      >
        {saving ? t('bw.savingRules') : t('bw.addPurchase')}
      </button>
    </div>
  );
}
