import { useState, useEffect } from 'react';
import { ShoppingCart, MessageSquare, Settings, Loader2, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { COUNTRIES, getCountryFlag } from '../../lib/countries';

export function Orders() {
  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-1">Commandes</h1>
      <p className="text-gray-500 text-sm mb-6">Gérez vos commandes reçues</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <h3 className="font-bold text-gray-900 mb-2">Aucune commande pour l'instant</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">Vos commandes apparaîtront ici dès qu'un acheteur passera commande sur vos produits.</p>
      </div>
    </div>
  );
}

export function Messages() {
  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-1">Messages</h1>
      <p className="text-gray-500 text-sm mb-6">Vos conversations avec les acheteurs</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <h3 className="font-bold text-gray-900 mb-2">Aucun message</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">Les messages des acheteurs intéressés par vos produits s'afficheront ici.</p>
      </div>
    </div>
  );
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

export function SettingsPage() {
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
    const fullName = profile?.full_name ?? '';
    const [f, ...rest] = fullName.split(' ');
    setFirstName(profile?.first_name ?? f ?? '');
    setLastName(profile?.last_name ?? rest.join(' ') ?? '');
    setPhone(profile?.phone ?? '');
    setWhatsapp(profile?.whatsapp ?? producer?.whatsapp ?? '');
    setCountry(profile?.country ?? producer?.country ?? 'France');
    setCity(profile?.city ?? producer?.city ?? '');
  }, [profile, producer]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const fullName = `${firstName} ${lastName}`.trim();

      // 1. Update auth user metadata
      const { error: authErr } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          phone: phone || undefined,
          whatsapp: whatsapp || undefined,
          country,
          city,
        },
      });
      if (authErr) console.warn('Auth metadata update warning:', authErr.message);

      // 2. Update profiles table — check row count to detect silent RLS failure
      const { data: profData, error: profErr } = await supabase.from('profiles').update({
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        whatsapp: whatsapp || null,
        country,
        city: city || null,
      }).eq('id', user.id).select('id');
      if (profErr) throw new Error('Profil: ' + profErr.message);
      if (!profData || profData.length === 0) {
        // Profile row doesn't exist — create it
        const { error: insertErr } = await supabase.from('profiles').insert({
          id: user.id,
          email: user.email ?? '',
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          whatsapp: whatsapp || null,
          country,
          city: city || null,
          role: 'producer',
        });
        if (insertErr) throw new Error('Création profil: ' + insertErr.message);
      }

      // 3. Update producers table — fetch by user_id, create if missing
      const { data: prodRow } = await supabase.from('producers')
        .select('id').eq('user_id', user.id).maybeSingle();

      if (prodRow) {
        const { data: prodUpdateData, error: prodErr } = await supabase.from('producers').update({
          name: fullName,
          phone: phone || null,
          whatsapp: whatsapp || null,
          country,
          country_flag: getCountryFlag(country),
          city: city || null,
        }).eq('id', prodRow.id).select('id');
        if (prodErr) throw new Error('Producteur: ' + prodErr.message);
        if (!prodUpdateData || prodUpdateData.length === 0) {
          throw new Error('Impossible de mettre à jour le profil producteur (permission refusée).');
        }
      } else {
        // Auto-create producer if it doesn't exist
        const colors = ['#15803d', '#92400e', '#b45309', '#7c2d12', '#451a03', '#0369a1'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const initials = (firstName[0] ?? '') + (lastName[0] ?? '');
        const { error: prodCreateErr } = await supabase.from('producers').insert({
          user_id: user.id,
          name: fullName,
          slug: slugify(`${fullName}-${Date.now().toString().slice(-4)}`),
          country,
          country_flag: getCountryFlag(country),
          avatar_initials: initials.toUpperCase(),
          avatar_color: color,
          banner_color: color,
          phone: phone || null,
          whatsapp: whatsapp || null,
          city: city || null,
          verified: false,
          top_seller: false,
          rating: 0,
          review_count: 0,
          product_count: 0,
          order_count: 0,
          satisfaction_rate: 100,
          response_time: '24h',
          certifications: [],
          profile_status: 'incomplete',
        });
        if (prodCreateErr) throw new Error('Création producteur: ' + prodCreateErr.message);
      }

      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement.');
    }
    setSaving(false);
  };

  const inputClass = 'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-1">Paramètres</h1>
      <p className="text-gray-500 text-sm mb-6">Gérez vos informations de compte</p>

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
          <label className={labelClass}>Email</label>
          <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-500 border border-gray-100">{user?.email}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Prénom <span className="text-red-500">*</span></label>
            <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass} placeholder="Jean" />
          </div>
          <div>
            <label className={labelClass}>Nom <span className="text-red-500">*</span></label>
            <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass} placeholder="Dupont" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Téléphone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+33 6 ..." />
          </div>
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className={inputClass} placeholder="+33 6 ..." />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Pays</label>
            <select value={country} onChange={e => setCountry(e.target.value)} className={inputClass}>
              {COUNTRIES.map(c => <option key={c.code}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Ville</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} className={inputClass} placeholder="Votre ville" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Rôle</label>
          <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-500 border border-gray-100 capitalize">{profile?.role ?? 'N/A'}</div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}
