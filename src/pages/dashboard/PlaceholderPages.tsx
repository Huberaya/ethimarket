import { useState, useEffect } from 'react';
import { ShoppingCart, MessageSquare, Settings, Loader2, Save, CheckCircle, AlertCircle, Download, Trash2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { COUNTRIES, getCountryFlag } from '../../lib/countries';
import { toIntOrNull, toFloatOrNull, toStringOrNull, sanitizeProducerPayload, saveProducerFields } from '../../lib/dbHelpers';
import { useI18n } from '../../lib/i18n';

export function Orders() {
  const { t } = useI18n();
  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-1">{t('dash.ordersTitle')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t('dash.ordersSubtitle')}</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <h3 className="font-bold text-gray-900 mb-2">{t('dash.noOrders')}</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">{t('dash.noOrdersDesc')}</p>
      </div>
    </div>
  );
}

export function Messages() {
  const { t } = useI18n();
  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-1">{t('dash.messages')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t('dash.noMessagesDesc')}</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <h3 className="font-bold text-gray-900 mb-2">{t('dash.noMessages')}</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">{t('dash.noMessagesDesc')}</p>
      </div>
    </div>
  );
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

export function SettingsPage() {
  const { tx } = useI18n();
  const { user, profile, producer, refresh } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [country, setCountry] = useState('France');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fullName = profile?.full_name ?? user?.user_metadata?.full_name ?? '';
    const [f, ...rest] = fullName.split(' ');
    setFirstName(profile?.first_name ?? user?.user_metadata?.first_name ?? f ?? '');
    setLastName(profile?.last_name ?? user?.user_metadata?.last_name ?? rest.join(' ') ?? '');
    setPhone(profile?.phone ?? user?.user_metadata?.phone ?? producer?.phone ?? '');
    setWhatsapp(profile?.whatsapp ?? user?.user_metadata?.whatsapp ?? producer?.whatsapp ?? '');
    setCountry(profile?.country ?? user?.user_metadata?.country ?? producer?.country ?? 'France');
    setCity(profile?.city ?? user?.user_metadata?.city ?? producer?.city ?? '');
  }, [profile, producer, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const flag = getCountryFlag(country);

      // 1. Update Auth user metadata
      const { error: authErr } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          phone: toStringOrNull(phone) || undefined,
          whatsapp: toStringOrNull(whatsapp) || undefined,
          country,
          city: toStringOrNull(city) || undefined,
        },
      });
      if (authErr) console.warn('Auth metadata update warning:', authErr.message);

      // 2. Upsert in profiles table
      const userRole = profile?.role || user.user_metadata?.role || 'producer';
      const { error: profErr } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email ?? '',
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        phone: toStringOrNull(phone),
        whatsapp: toStringOrNull(whatsapp),
        country,
        city: toStringOrNull(city),
        role: userRole,
      }, { onConflict: 'id' });

      if (profErr) {
        console.error('Profile upsert error:', profErr);
        throw new Error('Erreur profil: ' + profErr.message);
      }

      // 3. Upsert in producers table
      if (userRole === 'producer' || producer) {
        // Retrieve existing producer record
        const { data: existingProd } = await supabase
          .from('producers')
          .select('id, slug')
          .eq('user_id', user.id)
          .maybeSingle();

        const prodSlug = existingProd?.slug || slugify(`${fullName}-${user.id.slice(0, 8)}`);
        const colors = ['#15803d', '#92400e', '#b45309', '#7c2d12', '#451a03', '#0369a1'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const initials = ((firstName[0] || '') + (lastName[0] || '') || fullName.slice(0, 2)).toUpperCase();

        const producerPayload: Record<string, string | boolean | number | null | string[]> = {
          user_id: user.id,
          name: fullName,
          first_name: toStringOrNull(firstName),
          last_name: toStringOrNull(lastName),
          phone: toStringOrNull(phone),
          whatsapp: toStringOrNull(whatsapp),
          country,
          country_flag: flag,
          city: toStringOrNull(city),
        };

        if (existingProd?.id) {
          const { error: prodUpdateErr } = await saveProducerFields(supabase, existingProd.id, producerPayload);

          if (prodUpdateErr) {
            console.error('Producer update error:', prodUpdateErr);
            throw new Error('Erreur producteur: ' + prodUpdateErr.message);
          }
        } else {
          producerPayload.slug = prodSlug;
          producerPayload.avatar_initials = initials;
          producerPayload.avatar_color = color;
          producerPayload.banner_color = color;
          producerPayload.verified = false;
          producerPayload.top_seller = false;
          producerPayload.rating = toFloatOrNull(0);
          producerPayload.review_count = toIntOrNull(0);
          producerPayload.product_count = toIntOrNull(0);
          producerPayload.order_count = toIntOrNull(0);
          producerPayload.satisfaction_rate = toIntOrNull(100);
          producerPayload.response_time = '24h';
          producerPayload.certifications = [];
          producerPayload.profile_completion = toIntOrNull(10);

          const { error: prodUpsertErr } = await supabase
            .from('producers')
            .upsert(sanitizeProducerPayload(producerPayload), { onConflict: 'user_id' });

          if (prodUpsertErr) {
            console.error('Producer upsert error:', prodUpsertErr);
            throw new Error('Erreur producteur: ' + prodUpsertErr.message);
          }
        }
      }

      // 4. Refresh global Auth context so components reload new state
      await refresh();

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('handleSave exception:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-1">{tx('Paramètres')}</h1>
      <p className="text-gray-500 text-sm mb-6">{tx('Gérez vos informations de compte')}</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}
      {saved && (
        <div className="bg-brand-50 border border-brand-200 text-brand-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> Modifications enregistrées avec succès.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl space-y-5">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-400" /> Informations du compte
        </h3>

        <div>
          <label className={labelClass}>{tx('Email')}</label>
          <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-500 border border-gray-100">{user?.email}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{tx('Prénom')} <span className="text-red-500">*</span></label>
            <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass} placeholder={tx('Jean')} />
          </div>
          <div>
            <label className={labelClass}>{tx('Nom')} <span className="text-red-500">*</span></label>
            <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass} placeholder={tx('Dupont')} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{tx('Téléphone')}</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+33 6 ..." />
          </div>
          <div>
            <label className={labelClass}>{tx('WhatsApp')}</label>
            <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className={inputClass} placeholder="+33 6 ..." />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{tx('Pays')}</label>
            <select value={country} onChange={e => setCountry(e.target.value)} className={inputClass}>
              {COUNTRIES.map(c => <option key={c.code}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{tx('Ville')}</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} className={inputClass} placeholder={tx('Votre ville')} />
          </div>
        </div>

        <div>
          <label className={labelClass}>{tx('Rôle')}</label>
          <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-500 border border-gray-100 capitalize">{profile?.role ?? 'N/A'}</div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>

      <PrivacySection />
    </div>
  );
}

/* ---- RGPD : export des données + suppression du compte ---- */
function PrivacySection() {
  const { t } = useI18n();
  const { user, signOut } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [err, setErr] = useState('');

  const exportData = async () => {
    setExporting(true);
    setErr('');
    const { data, error } = await supabase.rpc('export_my_data');
    setExporting(false);
    if (error) { setErr(error.message); return; }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ethimarket-donnees-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = async () => {
    if (confirmText !== 'SUPPRIMER') return;
    setDeleting(true);
    setErr('');
    const { error } = await supabase.rpc('delete_my_account');
    if (error) { setErr(error.message); setDeleting(false); return; }
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl mt-6 space-y-5">
      <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-gray-400" /> {t('privacy.title')}
      </h3>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800">{t('privacy.exportTitle')}</p>
          <p className="text-xs text-gray-500 mt-0.5">{t('privacy.exportDesc')}</p>
        </div>
        <button onClick={exportData} disabled={exporting}
          className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 text-gray-700 hover:border-brand-400 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shrink-0">
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          {t('privacy.exportBtn')}
        </button>
      </div>

      <div className="border-t border-red-100 pt-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-red-700">{t('privacy.deleteTitle')}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('privacy.deleteDesc')}</p>
          </div>
          {!showConfirm && (
            <button onClick={() => setShowConfirm(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center gap-1.5 cursor-pointer shrink-0">
              <Trash2 className="w-3.5 h-3.5" /> {t('privacy.deleteBtn')}
            </button>
          )}
        </div>
        {showConfirm && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
            <p className="text-xs text-red-800 font-semibold">{t('privacy.confirmPrompt')}</p>
            <input value={confirmText} onChange={e => setConfirmText(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full px-3 py-2 text-sm border-2 border-red-200 rounded-xl focus:border-red-400 outline-none bg-white" />
            <div className="flex gap-2">
              <button onClick={deleteAccount} disabled={confirmText !== 'SUPPRIMER' || deleting}
                className="px-4 py-2 text-xs font-black rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 inline-flex items-center gap-1.5 cursor-pointer">
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                {t('privacy.confirmBtn')}
              </button>
              <button onClick={() => { setShowConfirm(false); setConfirmText(''); }}
                className="px-4 py-2 text-xs font-bold rounded-xl text-gray-500 cursor-pointer">
                {t('q.cancel')}
              </button>
            </div>
          </div>
        )}
      </div>

      {err && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{err}</p>}
      {user && <p className="text-[10px] text-gray-400">{t('privacy.note')}</p>}
    </div>
  );
}
