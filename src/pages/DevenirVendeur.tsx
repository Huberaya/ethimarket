import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown, ArrowRight, CheckCircle, Store, Package,
  Bell, Send, Wallet, DollarSign, Globe, Bot, Camera,
  BarChart3, ShieldCheck, Star,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useI18n } from '../lib/i18n';
import { VENDOR_CONTENT, type VendorContent } from '../lib/i18n/content/vendor';

const BENEFIT_ICONS = [DollarSign, Globe, Bot, Camera, BarChart3, ShieldCheck];
const STEP_ICONS = [Store, Package, Bell, Send, Wallet];

function VendorFaq({ faq }: { faq: VendorContent['faq'] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faq.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
            <span className="font-semibold text-gray-900 text-sm">{item.q}</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{item.a}</div>}
        </div>
      ))}
    </div>
  );
}

export default function DevenirVendeur() {
  const { locale } = useI18n();
  const c = VENDOR_CONTENT[locale];
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80"
          alt="Producteur" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 to-brand-900/60" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">{c.heroTitle}</h1>
          <p className="text-xl text-white/80 mb-8">{c.heroSubtitle}</p>
          <Link to="/inscription" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-lg text-sm">
            {c.heroCta} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {c.stats.map(({ emoji, value, label }) => (
              <div key={label} className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="text-2xl font-black text-brand-600 mb-1">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BÉNÉFICES */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-600 font-semibold text-xs uppercase tracking-widest mb-2">{c.benefitsLabel}</p>
            <h2 className="text-3xl font-black text-gray-900">{c.benefitsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.benefits.map(({ emoji, title, desc }, i) => {
              const Icon = BENEFIT_ICONS[i] ?? DollarSign;
              return (
                <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-brand-50 rounded-2xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-600" />
                    </div>
                    <span className="text-2xl">{emoji}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-600 font-semibold text-xs uppercase tracking-widest mb-2">{c.stepsLabel}</p>
            <h2 className="text-3xl font-black text-gray-900">{c.stepsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {c.steps.map((step, i) => {
              const StepIcon = STEP_ICONS[i] ?? Store;
              return (
              <div key={i} className="text-center">
                <div className="relative mx-auto mb-4">
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto">
                    <StepIcon className="w-6 h-6 text-brand-600" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-brand-500 text-white text-xs font-black rounded-full flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TARIFS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-50 border-2 border-brand-200 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-8">{c.pricingTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-8 max-w-md mx-auto text-left">
              {c.pricingPoints.map(point => (
                <div key={point} className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">{point}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-sm text-gray-500 mb-2">{c.pricingExampleLabel}</p>
              <p className="text-lg font-bold text-gray-900">{c.pricingExample}</p>
              <p className="text-xs text-gray-500 mt-1">{c.pricingExampleNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-600 font-semibold text-xs uppercase tracking-widest mb-2">{c.testimonialsLabel}</p>
            <h2 className="text-3xl font-black text-gray-900">{c.testimonialsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.testimonials.map(t => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ VENDEURS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-600 font-semibold text-xs uppercase tracking-widest mb-2">{c.faqLabel}</p>
            <h2 className="text-3xl font-black text-gray-900">{c.faqTitle}</h2>
          </div>
          <VendorFaq faq={c.faq} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-teal-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-3">{c.ctaTitle}</h2>
          <p className="text-white/70 mb-8">{c.ctaSubtitle}</p>
          <Link to="/inscription" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-lg text-sm">
            {c.ctaButton} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
