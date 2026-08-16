import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_LINKS = [
  { key: 'nav.catalogue', href: '/catalogue' },
  { key: 'nav.producers', href: '/producteurs' },
  { key: 'nav.howItWorks', href: '/comment-ca-marche' },
  { key: 'nav.blog', href: '/blog' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const isHome = location.pathname === '/';

  const isAdmin = profile?.is_admin === true || profile?.role === 'admin' || user?.email === 'bayahubert@yahoo.com';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent py-4'
          : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/80 py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
              transparent ? 'bg-white/20 backdrop-blur-sm' : 'bg-brand-500'
            } group-hover:bg-brand-500`}>
              <Leaf className="w-4.5 h-4.5 text-white" />
            </div>
            <span className={`font-bold text-lg tracking-tight transition-colors ${
              transparent ? 'text-white' : 'text-brand-800'
            }`}>
              EthiMarket
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ key, href }) => {
              const isActive = location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
              return (
                <Link
                  key={key}
                  to={href}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                    transparent
                      ? isActive
                        ? 'text-white font-bold bg-white/20'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                      : isActive
                      ? 'text-brand-600 font-bold bg-brand-50/80 border-b-2 border-brand-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          {/* Actions desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageSwitcher variant={transparent ? 'transparent' : 'default'} />
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    {t('nav.admin')}
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-colors shadow-sm"
                >
                  <User className="w-4 h-4" />
                  {t('nav.myspace')}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/connexion"
                  className={`px-4 py-2 text-sm font-semibold rounded-xl border-2 transition-all ${
                    transparent
                      ? 'border-white/60 text-white hover:bg-white/10'
                      : 'border-brand-500 text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/inscription"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-colors shadow-sm"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-1">
            <LanguageSwitcher variant={transparent ? 'transparent' : 'default'} />
            <button
              className={`p-2 rounded-lg transition-colors ${
                transparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={t('nav.menu')}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border-t border-gray-100 px-4 py-4 space-y-1.5 shadow-lg">
          {NAV_LINKS.map(({ key, href }) => {
            const isActive = location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
            return (
              <Link
                key={key}
                to={href}
                className={`flex items-center gap-2 px-3 py-3 text-sm rounded-xl transition-colors min-h-[44px] ${
                  isActive
                    ? 'font-bold text-brand-700 bg-brand-50 border-l-4 border-brand-500'
                    : 'font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50/50'
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
          <div className="flex flex-col gap-2 pt-3 border-t border-gray-100 mt-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-amber-600" /> {t('nav.administration')}
                  </Link>
                )}
                <Link to="/dashboard" className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-colors">
                  {t('nav.myspace')}
                </Link>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/connexion" className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-brand-600 border-2 border-brand-500 rounded-xl hover:bg-brand-50 transition-colors">
                  {t('nav.login')}
                </Link>
                <Link to="/inscription" className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-colors">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
