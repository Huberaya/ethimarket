import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { useI18n } from '../lib/i18n';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEOHead
        title="Page introuvable - 404 | EthiMarket"
        description="La page que vous recherchez n'existe pas ou a été déplacée."
      />
      <Header />

      <main className="flex-1 flex items-center justify-center p-6 my-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 text-center shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-xs">
            404
          </div>

          <h1 className="text-2xl font-black text-gray-900 mb-2">{t('notfound.title')}</h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            {t('notfound.desc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 text-white font-bold text-sm rounded-xl hover:bg-brand-700 transition-colors shadow-xs"
            >
              <Home className="w-4 h-4" /> {t('notfound.home')}
            </Link>
            <Link
              to="/catalogue"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 text-gray-800 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-brand-600" /> {t('notfound.catalogue')}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
