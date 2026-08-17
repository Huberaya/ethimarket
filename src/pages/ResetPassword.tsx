// =============================================================
// EthiMarket — Nouveau mot de passe (cible du lien e-mail)
// Supabase ouvre une session de récupération via le hash du lien
// (event PASSWORD_RECOVERY). Sans session valide → invite à
// redemander un lien.
// =============================================================

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Lock, Eye, EyeOff, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { validateNewPassword, applyNewPassword, passwordStrength, MIN_PASSWORD_LENGTH } from '../lib/passwordReset';
import SEOHead from '../components/SEOHead';

export default function ResetPassword() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [ready, setReady] = useState<'checking' | 'ok' | 'invalid'>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // La session de récupération est créée par supabase-js à partir du
  // hash de l'URL (access_token de type recovery). On vérifie qu'une
  // session existe, sinon le lien est invalide/expiré.
  useEffect(() => {
    let cancelled = false;
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && !cancelled) setReady('ok');
    });
    // fallback : session déjà établie au montage
    const timer = setTimeout(async () => {
      if (cancelled) return;
      const { data } = await supabase.auth.getSession();
      setReady(prev => prev === 'checking' ? (data.session ? 'ok' : 'invalid') : prev);
    }, 1200);
    return () => { cancelled = true; clearTimeout(timer); sub.subscription.unsubscribe(); };
  }, []);

  const strength = passwordStrength(password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const issue = validateNewPassword(password, confirm);
    if (issue === 'too_short') { setError(t('fp.tooShort', { min: String(MIN_PASSWORD_LENGTH) })); return; }
    if (issue === 'mismatch') { setError(t('fp.mismatch')); return; }
    setError('');
    setSaving(true);
    const err = await applyNewPassword(password);
    setSaving(false);
    if (err) { setError(err); return; }
    setDone(true);
    setTimeout(() => navigate('/dashboard'), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <SEOHead title={`${t('fp.resetTitle')} | EthiMarket`} description={t('fp.resetSubtitle')} />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900">EthiMarket</span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">{t('fp.resetTitle')}</h1>
          <p className="text-sm text-gray-500 mt-2">{t('fp.resetSubtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {ready === 'checking' && (
            <div className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-brand-500 mx-auto" /></div>
          )}

          {ready === 'invalid' && (
            <div className="text-center py-4">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="font-bold text-gray-900 mb-2">{t('fp.invalidTitle')}</h2>
              <p className="text-sm text-gray-500 mb-4">{t('fp.invalidDesc')}</p>
              <Link to="/mot-de-passe-oublie" className="inline-block px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-xl transition-colors">
                {t('fp.requestNew')}
              </Link>
            </div>
          )}

          {ready === 'ok' && (done ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="font-bold text-gray-900 mb-2">{t('fp.doneTitle')}</h2>
              <p className="text-sm text-gray-500">{t('fp.doneDesc')}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('fp.newPassword')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPw ? 'text' : 'password'} required value={password}
                    onChange={e => setPassword(e.target.value)} autoComplete="new-password" autoFocus
                    placeholder="••••••••"
                    className="w-full ps-10 pe-12 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-brand-500 outline-none transition-colors bg-gray-50 focus:bg-white"
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Jauge de force */}
                {password.length > 0 && (
                  <div className="flex gap-1 mt-2" aria-hidden="true">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${strength >= i ? (strength === 1 ? 'bg-red-400' : strength === 2 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-gray-100'}`} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('fp.confirmPassword')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPw ? 'text' : 'password'} required value={confirm}
                    onChange={e => setConfirm(e.target.value)} autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full ps-10 pe-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-brand-500 outline-none transition-colors bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

              <button
                type="submit" disabled={saving}
                className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {t('fp.apply')}
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
