import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Check, ArrowLeft, Loader2, Save } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { supabase, type Category, type Product } from '../../lib/supabase';
import ProductClaimsEditor, { DraftClaim, saveDraftClaims } from '../../components/trust/ProductClaimsEditor';
import { useI18n } from '../../lib/i18n';
import ImpactAssistant from '../../components/dashboard/ImpactAssistant';
import { estimateFootprints } from '../../lib/impactEstimator';
import { buildProductTranslations } from '../../lib/i18n/productAutoTranslate';
import DescriptionTranslations, { type DescriptionTranslationsValue } from '../../components/dashboard/DescriptionTranslations';

const COUNTRIES = [
  'France', 'Belgique', 'Suisse', 'Canada', 'Maroc', 'Éthiopie', 'Iran', 'Madagascar',
  'Pérou', 'Ghana', 'Grèce', 'Japon', 'Sri Lanka', 'Inde', 'Mexique', 'Brésil', 'Vietnam', 'Thaïlande',
];

const COUNTRY_FLAGS: Record<string, string> = {
  'France': '🇫🇷', 'Belgique': '🇧🇪', 'Suisse': '🇨🇭', 'Canada': '🇨🇦',
  'Maroc': '🇲🇦', 'Éthiopie': '🇪🇹', 'Iran': '🇮🇷', 'Madagascar': '🇲🇬',
  'Pérou': '🇵🇪', 'Ghana': '🇬🇭', 'Grèce': '🇬🇷', 'Japon': '🇯🇵',
  'Sri Lanka': '🇱🇰', 'Inde': '🇮🇳', 'Mexique': '🇲🇽', 'Brésil': '🇧🇷',
  'Vietnam': '🇻🇳', 'Thaïlande': '🇹🇭',
};

const CERT_OPTIONS = ['Bio', 'Fairtrade', 'Ecocert', 'Rainforest Alliance', 'GlobalGAP'];
const CURRENCIES = ['EUR', 'USD', 'MAD', 'XOF'];
const UNITS = ['kg', 'L', 'pièce', 'palette'];

export default function EditProduct() {
  const { tx } = useI18n();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingClaims, setExistingClaims] = useState<{ id: string; claim_label: string; verification_status: string }[]>([]);
  const [newClaims, setNewClaims] = useState<DraftClaim[]>([]);
  // Assistant d'impact : true si les empreintes en base proviennent
  // d'une ACV producteur (et non de notre estimation sectorielle).
  const [hasAcv, setHasAcv] = useState(false);
  const [descTranslations, setDescTranslations] = useState<DescriptionTranslationsValue>({});

  const [form, setForm] = useState({
    name: '', short_description: '', description: '',
    category_id: '', price: '', currency: 'EUR',
    moq_value: '1', moq_unit: 'kg',
    stock_value: '0', stock_unit: 'kg',
    country: 'France', region: '',
    certifications: [] as string[],
    status: 'active',
    // --- Impact & Éthique ---
    product_type: '',
    manufacturing_country: '',
    raw_materials_origin: '',
    carbon_footprint_kg: '',
    water_footprint_liters: '',
    is_vegan: false,
    is_recycled: false,
    recycled_percentage: '',
    living_wage_guaranteed: false,
    fair_trade: false,
    social_audit_passed: false,
    is_cooperative: false,
    packaging_types: [] as string[],
    monthly_capacity: '',
    delivery_days: '5-7',
    max_volume_discount_pct: '20',
    quote_threshold_qty: '',
    tier2_min_qty: '',
    tier2_discount_pct: '',
    tier3_min_qty: '',
    tier3_discount_pct: '',
  });

  useEffect(() => {
    supabase.from('categories').select('*').order('name')
      .then(({ data }) => data && setCategories(data));

    if (!id || !user) return;
    supabase.from('products').select('*').eq('id', id).eq('user_id', user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          const p = data as Product;
          setProduct(p);
          setForm({
            name: p.name, short_description: p.short_description ?? '', description: p.description ?? '',
            category_id: p.category_id ?? '', price: p.price.toString(), currency: p.currency,
            moq_value: p.moq_value.toString(), moq_unit: p.moq_unit,
            stock_value: p.stock_value.toString(), stock_unit: p.stock_unit,
            country: p.country, region: p.region ?? '',
            certifications: p.certifications, status: p.status,
            product_type: (p as Record<string, unknown>).product_type as string ?? '',
            manufacturing_country: (p as Record<string, unknown>).manufacturing_country as string ?? '',
            raw_materials_origin: (p as Record<string, unknown>).raw_materials_origin as string ?? '',
            carbon_footprint_kg: ((p as Record<string, unknown>).carbon_footprint_kg ?? '').toString(),
            water_footprint_liters: ((p as Record<string, unknown>).water_footprint_liters ?? '').toString(),
            /* hasAcv est positionné plus bas (setHasAcv) selon carbon_footprint_source */
            is_vegan: Boolean((p as Record<string, unknown>).is_vegan),
            is_recycled: Boolean((p as Record<string, unknown>).is_recycled),
            recycled_percentage: ((p as Record<string, unknown>).recycled_percentage ?? '').toString(),
            living_wage_guaranteed: Boolean((p as Record<string, unknown>).living_wage_guaranteed),
            fair_trade: Boolean((p as Record<string, unknown>).fair_trade),
            social_audit_passed: Boolean((p as Record<string, unknown>).social_audit_passed),
            is_cooperative: Boolean((p as Record<string, unknown>).is_cooperative),
            packaging_types: ((p as Record<string, unknown>).packaging_types as string[]) ?? [],
            monthly_capacity: ((p as Record<string, unknown>).monthly_capacity ?? '').toString(),
            delivery_days: ((p as Record<string, unknown>).delivery_days as string) ?? '5-7',
            max_volume_discount_pct: ((p as Record<string, unknown>).max_volume_discount_pct ?? '20').toString(),
            quote_threshold_qty: ((p as Record<string, unknown>).quote_threshold_qty ?? '').toString(),
            tier2_min_qty: (((p as Record<string, unknown>).volume_tiers as { min_qty: number; discount_pct: number }[] | null)?.[0]?.min_qty ?? '').toString(),
            tier2_discount_pct: (((p as Record<string, unknown>).volume_tiers as { min_qty: number; discount_pct: number }[] | null)?.[0]?.discount_pct ?? '').toString(),
            tier3_min_qty: (((p as Record<string, unknown>).volume_tiers as { min_qty: number; discount_pct: number }[] | null)?.[1]?.min_qty ?? '').toString(),
            tier3_discount_pct: (((p as Record<string, unknown>).volume_tiers as { min_qty: number; discount_pct: number }[] | null)?.[1]?.discount_pct ?? '').toString(),
          });
          // Descriptions traduites existantes → panneau multilingue
          const exTr = (p.translations ?? {}) as Record<string, Record<string, string>>;
          setDescTranslations({
            en: exTr.en?.description ?? '', es: exTr.es?.description ?? '',
            pt: exTr.pt?.description ?? '', ar: exTr.ar?.description ?? '',
          });
          // ACV producteur = valeur présente ET non marquée 'estimated'
          const rawP = p as Record<string, unknown>;
          setHasAcv(
            Number(rawP.carbon_footprint_kg) > 0 && rawP.carbon_footprint_source !== 'estimated'
          );
          setImagePreview(p.image_url ?? null);
          supabase.from('product_claims')
            .select('id, claim_label, verification_status')
            .eq('product_id', p.id)
            .order('created_at')
            .then(({ data: claimRows }) => {
              if (claimRows) setExistingClaims(claimRows);
            });
        }
        setLoading(false);
      });
  }, [id, user]);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const togglePackaging = (pk: string) => {
    setForm(prev => ({
      ...prev,
      packaging_types: prev.packaging_types.includes(pk)
        ? prev.packaging_types.filter(x => x !== pk)
        : [...prev.packaging_types, pk],
    }));
  };

  const toggleBool = (field: 'is_vegan' | 'is_recycled' | 'living_wage_guaranteed' | 'fair_trade' | 'social_audit_passed' | 'is_cooperative') => {
    setForm(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const toggleCert = (cert: string) => {
    setForm(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;
    setSaving(true);
    setError('');

    let imageUrl = product.image_url;
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('products').upload(fileName, imageFile);
      if (!uploadErr) imageUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
    }

    const { error: updateErr } = await supabase.from('products').update({
      name: form.name,
      short_description: form.short_description || null,
      description: form.description || null,
      category_id: form.category_id || null,
      price: parseFloat(form.price) || 0,
      currency: form.currency,
      moq_value: parseInt(form.moq_value) || 1,
      moq_unit: form.moq_unit,
      stock_value: parseInt(form.stock_value) || 0,
      stock_unit: form.stock_unit,
      country: form.country,
      country_flag: COUNTRY_FLAGS[form.country] ?? '🌍',
      // Traductions : nom auto (si renommé) + descriptions du panneau
      // multilingue, fusionnées langue par langue sans perte.
      translations: (() => {
        const existing = (product?.translations ?? {}) as Record<string, Record<string, string>>;
        const auto = (product && form.name !== product.name
          ? buildProductTranslations(form.name)
          : {}) as Record<string, Record<string, string>>;
        const merged: Record<string, Record<string, string>> = {};
        for (const loc of ['en', 'es', 'pt', 'ar'] as const) {
          merged[loc] = { ...existing[loc], ...(auto[loc] ?? {}) };
          const desc = (descTranslations[loc] ?? '').trim();
          if (desc) merged[loc].description = desc;
          else delete merged[loc].description;
        }
        return merged;
      })(),
      region: form.region || null,
      certifications: form.certifications,
      status: form.status,
      image_url: imageUrl,
      product_type: form.product_type || null,
      manufacturing_country: form.manufacturing_country || form.country || null,
      raw_materials_origin: form.raw_materials_origin || form.country || null,
      // Assistant d'impact : ACV producteur si fournie, sinon estimation
      // sectorielle sourcée (marqueur 'estimated' pour l'honnêteté).
      ...(() => {
        const acvCo2 = hasAcv && form.carbon_footprint_kg ? parseFloat(form.carbon_footprint_kg) : null;
        const acvWater = hasAcv && form.water_footprint_liters ? parseFloat(form.water_footprint_liters) : null;
        const est = estimateFootprints({
          product_type: form.product_type || undefined,
          category_name: categories.find(c => c.id === form.category_id)?.name,
          name: form.name || undefined,
          farming_method: (product as Record<string, unknown> | null)?.farming_method as string | undefined,
          certifications: form.certifications,
        });
        return {
          carbon_footprint_kg: acvCo2 && !Number.isNaN(acvCo2) ? acvCo2 : est.co2PerKg,
          carbon_footprint_source: acvCo2 && !Number.isNaN(acvCo2) ? 'producer' : 'estimated',
          water_footprint_liters: acvWater && !Number.isNaN(acvWater) ? acvWater : est.waterPerKg,
          water_footprint_source: acvWater && !Number.isNaN(acvWater) ? 'producer' : 'estimated',
        };
      })(),
      is_vegan: form.is_vegan,
      is_recycled: form.is_recycled,
      recycled_percentage: form.is_recycled && form.recycled_percentage ? parseFloat(form.recycled_percentage) : null,
      living_wage_guaranteed: form.living_wage_guaranteed,
      fair_trade: form.fair_trade,
      social_audit_passed: form.social_audit_passed,
      is_cooperative: form.is_cooperative,
      packaging_types: form.packaging_types,
      monthly_capacity: form.monthly_capacity ? parseInt(form.monthly_capacity) : 0,
      delivery_days: form.delivery_days || '5-7',
      max_volume_discount_pct: form.max_volume_discount_pct ? parseFloat(form.max_volume_discount_pct) : 20,
      quote_threshold_qty: form.quote_threshold_qty ? parseInt(form.quote_threshold_qty) : null,
      volume_tiers: (() => {
        const tiers: { min_qty: number; discount_pct: number }[] = [];
        if (form.tier2_min_qty && form.tier2_discount_pct) tiers.push({ min_qty: parseInt(form.tier2_min_qty), discount_pct: parseFloat(form.tier2_discount_pct) });
        if (form.tier3_min_qty && form.tier3_discount_pct) tiers.push({ min_qty: parseInt(form.tier3_min_qty), discount_pct: parseFloat(form.tier3_discount_pct) });
        return tiers.length > 0 ? tiers : null;
      })(),
    }).eq('id', product.id).eq('user_id', user.id);

    if (updateErr) {
      setError(updateErr.message);
      setSaving(false);
      return;
    }

    // Enregistrer les nouvelles allégations Trust Center
    if (newClaims.length > 0) {
      const claimsErr = await saveDraftClaims(product.id, newClaims);
      if (claimsErr) console.warn('[TrustCenter] Erreur enregistrement des allégations:', claimsErr);
    }

    navigate('/dashboard/mes-produits?success=2');
    setSaving(false);
  };

  const inputClass = 'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>;

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">{tx('Produit introuvable ou vous n\'avez pas la permission de le modifier.')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => navigate('/dashboard/mes-produits')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" /> Retour aux produits
        </button>
        <h1 className="text-2xl font-black text-gray-900">{tx('Modifier le produit')}</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <label className={labelClass}>{tx('Photo du produit')}</label>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0">
              {imagePreview ? <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" /> : <Upload className="w-7 h-7 text-gray-300" />}
            </div>
            <div className="flex-1">
              <input type="file" accept="image/*" onChange={handleImageChange} id="edit-product-image" className="hidden" />
              <label htmlFor="edit-product-image" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl cursor-pointer transition-colors">
                <Upload className="w-4 h-4" /> {imageFile ? 'Changer l\'image' : 'Choisir une image'}
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div>
            <label className={labelClass}>{tx('Nom du produit *')}</label>
            <input type="text" required value={form.name} onChange={e => update('name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{tx('Description courte')}</label>
            <input type="text" value={form.short_description} onChange={e => update('short_description', e.target.value)} className={inputClass} maxLength={120} />
          </div>
          <div>
            <label className={labelClass}>{tx('Description longue')}</label>
            <textarea rows={4} value={form.description} onChange={e => update('description', e.target.value)} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>{tx('Catégorie')}</label>
            <select value={form.category_id} onChange={e => update('category_id', e.target.value)} className={inputClass}>
              <option value="">{tx('Sélectionner...')}</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{tx('Statut')}</label>
            <select value={form.status} onChange={e => update('status', e.target.value)} className={inputClass}>
              <option value="active">{tx('Actif (visible dans le catalogue)')}</option>
              <option value="draft">{tx('Brouillon (non visible)')}</option>
              <option value="archived">{tx('Archivé')}</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">{tx('Prix et quantité')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>{tx('Prix *')}</label>
              <input type="number" step="0.01" required value={form.price} onChange={e => update('price', e.target.value)} min="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{tx('Devise')}</label>
              <select value={form.currency} onChange={e => update('currency', e.target.value)} className={inputClass}>
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>{tx('Unité')}</label>
              <select value={form.moq_unit} onChange={e => { update('moq_unit', e.target.value); update('stock_unit', e.target.value); }} className={inputClass}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>MOQ *</label>
              <input type="number" required value={form.moq_value} onChange={e => update('moq_value', e.target.value)} min="1" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{tx('Stock')}</label>
              <input type="number" value={form.stock_value} onChange={e => update('stock_value', e.target.value)} min="0" className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">{tx('Origine')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{tx('Pays')}</label>
              <select value={form.country} onChange={e => update('country', e.target.value)} className={inputClass}>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>{tx('Région')}</label>
              <input type="text" value={form.region} onChange={e => update('region', e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <label className={labelClass}>{tx('Certifications')}</label>
          <div className="flex flex-wrap gap-2">
            {CERT_OPTIONS.map(cert => (
              <button key={cert} type="button" onClick={() => toggleCert(cert)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${form.certifications.includes(cert) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {form.certifications.includes(cert) && <Check className="w-3.5 h-3.5" />}
                {cert}
              </button>
            ))}
          </div>
        </div>


        {/* Conditions commerciales */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">💶 Conditions commerciales</h3>
            <p className="text-xs text-gray-500 mt-1">{tx('Génèrent la grille dégressive, les délais et la capacité affichés aux acheteurs.')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>{tx('Capacité mensuelle')}</label>
              <input type="number" min="0" value={form.monthly_capacity} onChange={e => update('monthly_capacity', e.target.value)} placeholder="Ex : 3000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{tx('Délai de livraison (jours)')}</label>
              <select value={form.delivery_days} onChange={e => update('delivery_days', e.target.value)} className={inputClass}>
                {['3-5', '5-7', '7-10', '7-14', '10-14', '14-21', '21-30'].map(d => <option key={d} value={d}>{d} jours</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>{tx('« Sur devis » à partir de')}</label>
              <input type="number" min="1" value={form.quote_threshold_qty} onChange={e => update('quote_threshold_qty', e.target.value)} placeholder="Ex : 1000" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">{tx('Palier 2 : dès (qté)')}</label>
              <input type="number" min="1" value={form.tier2_min_qty} onChange={e => update('tier2_min_qty', e.target.value)} placeholder="100" className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">{tx('Remise 2 (%)')}</label>
              <input type="number" min="0" max="60" value={form.tier2_discount_pct} onChange={e => update('tier2_discount_pct', e.target.value)} placeholder="11" className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">{tx('Palier 3 : dès (qté)')}</label>
              <input type="number" min="1" value={form.tier3_min_qty} onChange={e => update('tier3_min_qty', e.target.value)} placeholder="500" className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">{tx('Remise 3 (%)')}</label>
              <input type="number" min="0" max="60" value={form.tier3_discount_pct} onChange={e => update('tier3_discount_pct', e.target.value)} placeholder="21" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Allégations Trust Center déjà déclarées */}
        {existingClaims.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">{tx('🛡️ Allégations déjà déclarées')}</h3>
            <p className="text-xs text-gray-500">
              Statut calculé par EthiMarket à partir des preuves. Pour joindre un certificat à une
              allégation existante, contactez l'équipe ou déposez le document dans votre espace vérification.
            </p>
            <ul className="space-y-1.5">
              {existingClaims.map(c => (
                <li key={c.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg px-3 py-2 text-sm">
                  <span className="font-medium text-gray-800">{c.claim_label}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    c.verification_status === 'verified' ? 'bg-emerald-100 text-emerald-800'
                    : c.verification_status === 'pending_verification' ? 'bg-blue-100 text-blue-800'
                    : c.verification_status === 'expired' ? 'bg-orange-100 text-orange-800'
                    : c.verification_status === 'contradicted' ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.verification_status === 'verified' ? '✅ Certifié'
                      : c.verification_status === 'pending_verification' ? '🕓 Vérification en cours'
                      : c.verification_status === 'expired' ? '⌛ Expirée'
                      : c.verification_status === 'contradicted' ? '❌ Non confirmée'
                      : '⚠️ Déclaration fournisseur'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nouvelles allégations */}
        <ProductClaimsEditor claims={newClaims} onChange={setNewClaims} />

        {/* Impact & Éthique — facettes du moteur intelligent */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{tx('🌍 Impact & Éthique')}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Ces informations alimentent le moteur de recherche multicritères et le Trust Center.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>{tx('Type de produit')}</label>
              <input type="text" value={form.product_type} onChange={e => update('product_type', e.target.value)}
                placeholder={tx('Ex: café, miel, huile…')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{tx('Pays de fabrication')}</label>
              <input type="text" value={form.manufacturing_country} onChange={e => update('manufacturing_country', e.target.value)}
                placeholder={form.country} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{tx('Origine matières premières')}</label>
              <input type="text" value={form.raw_materials_origin} onChange={e => update('raw_materials_origin', e.target.value)}
                placeholder={form.country} className={inputClass} />
            </div>
          </div>

          <DescriptionTranslations value={descTranslations} onChange={setDescTranslations} inputClass={inputClass} />

          <ImpactAssistant
            productType={form.product_type}
            categoryName={categories.find(c => c.id === form.category_id)?.name}
            productName={form.name}
            farmingMethod={(product as Record<string, unknown> | null)?.farming_method as string | undefined}
            certifications={form.certifications}
            co2Value={form.carbon_footprint_kg}
            waterValue={form.water_footprint_liters}
            hasAcv={hasAcv}
            onChange={(field, value) => update(field, value)}
            onToggleAcv={setHasAcv}
            inputClass={inputClass}
            labelClass={labelClass}
          />

          <div>
            <label className={labelClass}>{tx('Engagements éthiques & sociaux')}</label>
            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
              ⚠️ Affichés comme « Déclaration fournisseur » dans le Trust Center tant que non vérifiés par certificat/audit.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {([
                ['is_vegan', '🌱 100% vegan'],
                ['is_recycled', '♻️ Matières recyclées'],
                ['living_wage_guaranteed', '💰 Salaire décent garanti'],
                ['fair_trade', '🤝 Commerce équitable'],
                ['social_audit_passed', '📋 Audit social réalisé'],
                ['is_cooperative', '👥 Coopérative'],
              ] as const).map(([field, label]) => (
                <button key={field} type="button" onClick={() => toggleBool(field)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all text-left ${form[field] ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {form[field] && <Check className="w-3.5 h-3.5 shrink-0" />}
                  {label}
                </button>
              ))}
            </div>
            {form.is_recycled && (
              <div className="mt-3 max-w-xs">
                <label className={labelClass}>{tx('% de matières recyclées')}</label>
                <input type="number" min="1" max="100" value={form.recycled_percentage}
                  onChange={e => update('recycled_percentage', e.target.value)} placeholder="Ex: 70" className={inputClass} />
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>{tx('Emballage')}</label>
            <div className="flex flex-wrap gap-2">
              {([
                ['plastic_free', '🚫 Sans plastique'],
                ['compostable', '🌿 Compostable'],
                ['recyclable', '♻️ Recyclable'],
                ['bulk', '🛍️ Vrac'],
                ['deposit', '🔄 Consigné'],
              ] as const).map(([pk, label]) => (
                <button key={pk} type="button" onClick={() => togglePackaging(pk)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${form.packaging_types.includes(pk) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {form.packaging_types.includes(pk) && <Check className="w-3.5 h-3.5" />}
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="btn-primary flex-1 py-3.5 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</> : <><Save className="w-4 h-4" /> Enregistrer les modifications</>}
          </button>
          <button type="button" onClick={() => navigate('/dashboard/mes-produits')}
            className="px-6 py-3.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
