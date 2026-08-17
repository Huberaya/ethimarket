// =============================================================
// EthiMarket — Mot de passe oublié (demande d'e-mail)
// Anti-énumération : le message de succès est identique que
// l'adresse existe ou non.
// =============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { requestPasswordReset } from '../lib/passwordReset';
import SEOHead from '../components/SEOHead';

export default function ForgotPassword() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const err = await requestPasswordReset(email);
    setLoading(false);
    if (err) { setError(t('fp.rateLimited')); return; }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <SEOHead title={`${t('fp.title')} | EthiMarket`} description={t('fp.subtitle')} />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900">EthiMarket</span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">{t('fp.title')}</h1>
          <p className="text-sm text-gray-500 mt-2">{t('fp.subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="font-bold text-gray-900 mb-2">{t('fp.sentTitle')}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{t('fp.sentDesc', { email })}</p>
              <p className="text-xs text-gray-400 mt-3">{t('fp.checkSpam')}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('login.email')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="vous@entreprise.com" autoComplete="email" autoFocus
                    className="w-full ps-10 pe-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-brand-500 outline-none transition-colors bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
              <button
                type="submit" disabled={loading || !email}
                className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {t('fp.send')}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-6">
          <Link to="/connexion" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-brand-700">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('fp.backToLogin')}
          </Link>
        </p>
      </div>
    </div>
  );
}
