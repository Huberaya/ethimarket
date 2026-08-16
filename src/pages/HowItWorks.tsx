import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus, Search, MessageSquare, ShieldCheck, Truck,
  Store, Package, Bell, Send, Wallet, ChevronDown,
  ArrowRight,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { useI18n } from '../lib/i18n';
import { HOW_IT_WORKS_CONTENT, type HowItWorksContent } from '../lib/i18n/content/howItWorks';

const BUYER_ICONS = [UserPlus, Search, MessageSquare, ShieldCheck, Truck];
const PRODUCER_ICONS = [Store, Package, Bell, Send, Wallet];

function FaqAccordion({ items }: { items: HowItWorksContent['faq'] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900 text-sm">{item.q}</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HowItWorks() {
  const { t, locale } = useI18n();
  const c = HOW_IT_WORKS_CONTENT[locale];
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead
        title="Comment ça marche ? | EthiMarket B2B"
        description="Découvrez comment EthiMarket connecte directement les acheteurs bio et les producteurs certifiés : inscription, commande sécurisée, paiement escrow et livraison."
      />
      <Header />

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-teal-500">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">{t('how.title')}</h1>
          <p className="text-xl text-white/80">{t('how.subtitle')}</p>
        </div>
      </section>

      {/* ACHETEURS */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3">{t('how.buyersTitle')}</h2>
            <p className="text-gray-500 text-lg">{t('how.buyersSubtitle')}</p>
          </div>
          <div className="space-y-4">
            {c.buyerSteps.map((step, i) => {
              const StepIcon = BUYER_ICONS[i] ?? UserPlus;
              return (
              <div key={i} className="flex items-start gap-5 p-6 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center">
                  <StepIcon className="w-5 h-5 text-brand-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-black text-brand-500">{t('how.step')} {i + 1}</span>
                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCTEURS */}
      <section className="py-24 bg-brand-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3">{t('how.producersTitle')}</h2>
            <p className="text-gray-500 text-lg">{t('how.producersSubtitle')}</p>
          </div>
          <div className="space-y-4">
            {c.producerSteps.map((step, i) => {
              const StepIcon = PRODUCER_ICONS[i] ?? Store;
              return (
              <div key={i} className="flex items-start gap-5 p-6 rounded-2xl bg-white border border-brand-100 hover:shadow-md transition-all">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
                  <StepIcon className="w-5 h-5 text-brand-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-black text-brand-500">{t('how.step')} {i + 1}</span>
                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-600 font-semibold text-xs uppercase tracking-widest mb-2">{t('how.faq')}</p>
            <h2 className="text-3xl font-black text-gray-900">{t('how.faqTitle')}</h2>
          </div>
          <FaqAccordion items={c.faq} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-teal-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-8">{t('how.ctaTitle')}</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/inscription" className="px-8 py-3.5 bg-white text-brand-600 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-lg text-sm inline-flex items-center gap-2">
              {t('how.ctaCreate')} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/catalogue" className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/20 transition-colors text-sm inline-flex items-center gap-2">
              {t('how.ctaCatalogue')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
