import { Link } from 'react-router-dom';
import { Leaf, Twitter, Linkedin, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

const FOOTER_SECTIONS = [
  {
    titleKey: 'footer.marketplace',
    links: [
      { key: 'footer.linkCatalogue', href: '/catalogue' },
      { key: 'footer.linkProducers', href: '/producteurs' },
      { key: 'footer.linkBecomeSeller', href: '/devenir-vendeur' },
      { key: 'footer.linkPricing', href: '/tarifs' },
      { key: 'footer.linkBlog', href: '/blog' },
    ],
  },
  {
    titleKey: 'footer.about',
    links: [
      { key: 'footer.linkMission', href: '/notre-mission' },
      { key: 'footer.linkTeam', href: '/notre-equipe' },
      { key: 'footer.linkCertifications', href: '/certifications' },
      { key: 'footer.linkPress', href: '/presse' },
      { key: 'footer.linkPartners', href: '/partenaires' },
    ],
  },
  {
    titleKey: 'footer.support',
    links: [
      { key: 'footer.linkHelp', href: '/centre-aide' },
      { key: 'footer.linkContact', href: '/contact' },
      { key: 'footer.linkTerms', href: '/conditions-utilisation' },
      { key: 'footer.linkPrivacy', href: '/confidentialite' },
      { key: 'footer.linkCookies', href: '/cookies' },
    ],
  },
];

const SOCIALS = [
  { Icon: Twitter,   label: 'Twitter' },
  { Icon: Linkedin,  label: 'LinkedIn' },
  { Icon: Instagram, label: 'Instagram' },
  { Icon: Facebook,  label: 'Facebook' },
];

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-brand-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-16 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">EthiMarket</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              {t('footer.tagline')}
            </p>

            {/* Contact */}
            <div className="space-y-2 mb-6">
              {[
                { Icon: Mail,  text: 'contact@ethimarket.com' },
                { Icon: Phone, text: '+33 1 23 45 67 89' },
                { Icon: MapPin, text: 'Paris, France' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-400">
                  <Icon className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 bg-white/5 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors group"
                >
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {FOOTER_SECTIONS.map(({ titleKey, links }) => (
            <div key={titleKey}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{t(titleKey)}</h4>
              <ul className="space-y-2.5">
                {links.map(({ key, href }) => (
                  <li key={key}>
                    <Link
                      to={href}
                      className="text-sm text-gray-400 hover:text-brand-300 transition-colors hover:translate-x-0.5 inline-block"
                    >
                      {t(key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="text-sm text-gray-500">{t('footer.rights')}</p>
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="footer" />
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse"></span>
              {t('footer.allSystems')}
            </span>
            <span className="text-gray-700">·</span>
            <span className="text-xs text-gray-500">v2.4.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
