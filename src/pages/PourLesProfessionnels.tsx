// =============================================================
// EthiMarket — Landing d'acquisition B2B « Pour les professionnels »
// Cible : épiceries bio, restaurants, torréfacteurs, grossistes.
// Structure conversion : douleurs→réponses, preuves, 4 étapes,
// FAQ, double CTA. Contenu 5 langues (PROFESSIONALS_CONTENT).
// =============================================================

import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Store } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { useI18n } from '../lib/i18n';
import { PROFESSIONALS_CONTENT } from '../lib/i18n/content/professionals';

export default function PourLesProfessionnels() {
  const { locale } = useI18n();
  const c = PROFESSIONALS_CONTENT[locale];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead title={`${c.heroTitle} | EthiMarket`} description={c.heroText} />
      <Header />

      {/* HERO */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-800 via-brand-700 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-brand-200 font-semibold text-xs uppercase tracking-widest mb-4">{c.heroLabel}</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6">{c.heroTitle}</h1>
          <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-9">{c.heroText}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/inscription" className="px-7 py-3.5 rounded-xl bg-white text-brand-700 font-black text-sm inline-flex items-center gap-2 hover:bg-brand-50">
              {c.heroCta} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/catalogue" className="px-7 py-3.5 rounded-xl border-2 border-white/40 text-white font-black text-sm hover:bg-white/10">
              {c.heroCta2}
            </Link>
          </div>
        </div>
      </section>

      {/* DOULEURS → RÉPONSES */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-600 font-semibold text-xs uppercase tracking-widest mb-2">{c.painsLabel}</p>
            <h2 className="text-3xl font-black text-gray-900">{c.painsTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {c.pains.map((p, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-6 hover:border-brand-200 hover:shadow-sm transition">
                <p className="text-2xl mb-3">{p.emoji}</p>
                <p className="font-black text-gray-900 mb-2 italic">{p.pain}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{p.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREUVES */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-600 font-semibold text-xs uppercase tracking-widest mb-2">{c.proofLabel}</p>
            <h2 className="text-3xl font-black text-gray-900">{c.proofTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.proofs.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
                <span className="text-3xl">{p.emoji}</span>
                <h3 className="font-black text-gray-900 mt-3 mb-1.5 text-sm">{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 ÉTAPES */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-600 font-semibold text-xs uppercase tracking-widest mb-2">{c.stepsLabel}</p>
            <h2 className="text-3xl font-black text-gray-900">{c.stepsTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.steps.map((s, i) => (
              <div key={i} className="relative rounded-2xl border-2 border-brand-100 p-5">
                <span className="absolute -top-4 left-5 w-8 h-8 rounded-full bg-brand-500 text-white font-black text-sm flex items-center justify-center shadow">{i + 1}</span>
                <h3 className="font-black text-gray-900 text-sm mt-3 mb-1.5">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">{c.faqTitle}</h2>
          <div className="space-y-3">
            {c.faq.map((f, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <summary className="flex items-center justify-between gap-3 px-6 py-4 cursor-pointer font-bold text-gray-900 text-sm list-none">
                  {f.q}
                  <span className="text-brand-500 group-open:rotate-45 transition-transform text-xl leading-none shrink-0">+</span>
                </summary>
                <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-brand-700 to-teal-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Store className="w-10 h-10 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-4">{c.ctaTitle}</h2>
          <p className="text-white/90 leading-relaxed mb-8">{c.ctaText}</p>
          <Link to="/inscription" className="px-8 py-4 rounded-xl bg-white text-brand-700 font-black inline-flex items-center gap-2 hover:bg-brand-50">
            <ShieldCheck className="w-5 h-5" /> {c.ctaButton}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
