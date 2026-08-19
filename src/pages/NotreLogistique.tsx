// =============================================================
// EthiMarket — Page publique « Notre logistique »
// Présente la politique logistique (docs/STRATEGIE_LOGISTIQUE.md)
// de façon pédagogique : principe mer vs air, parcours en 6
// étapes, engagements, deux circuits, refus de principe.
// Multilingue via LOGISTICS_CONTENT (5 langues).
// =============================================================

import { Link } from 'react-router-dom';
import { ArrowRight, Ship, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { useI18n } from '../lib/i18n';
import { LOGISTICS_CONTENT } from '../lib/i18n/content/logistics';

export default function NotreLogistique() {
  const { locale } = useI18n();
  const c = LOGISTICS_CONTENT[locale];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead title={`${c.heroTitle} | EthiMarket`} description={c.heroText} />
      <Header />

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-teal-500">
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-brand-200 font-semibold text-xs uppercase tracking-widest mb-4">{c.heroLabel}</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-8">{c.heroTitle}</h1>
          <p className="text-xl sm:text-2xl text-white/90 leading-relaxed font-medium max-w-3xl mx-auto">
            {c.heroText}
          </p>
        </div>
      </section>

      {/* PRINCIPE FONDATEUR : mer vs air */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-600 font-semibold text-xs uppercase tracking-widest mb-2">{c.principleLabel}</p>
            <h2 className="text-3xl font-black text-gray-900 flex items-center justify-center gap-3">
              <Ship className="w-8 h-8 text-brand-600" /> {c.principleTitle}
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mt-4">{c.principleText}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-6">
              <p className="font-black text-gray-900 mb-4">{c.compareSea}</p>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-gray-500">{c.compareCostLabel}</span>
                  <span className="text-2xl font-black text-emerald-700 tabular-nums">{c.compareSeaCost}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-gray-500">{c.compareCo2Label}</span>
                  <span className="text-2xl font-black text-emerald-700 tabular-nums">{c.compareSeaCo2}</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-red-100 bg-red-50/40 p-6 opacity-80">
              <p className="font-black text-gray-900 mb-4">{c.compareAir}</p>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-gray-500">{c.compareCostLabel}</span>
                  <span className="text-2xl font-black text-red-600 tabular-nums line-through decoration-2">{c.compareAirCost}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-gray-500">{c.compareCo2Label}</span>
                  <span className="text-2xl font-black text-red-600 tabular-nums line-through decoration-2">{c.compareAirCo2}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">{c.compareCaption}</p>
        </div>
      </section>

      {/* PARCOURS EN 6 ÉTAPES */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-600 font-semibold text-xs uppercase tracking-widest mb-2">{c.journeyLabel}</p>
            <h2 className="text-3xl font-black text-gray-900">{c.journeyTitle}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-brand-100" />
            <div className="space-y-8">
              {c.journey.map((step, i) => (
                <div key={i} className="relative flex items-start gap-6">
                  <div className="relative z-10 w-12 h-12 shrink-0 rounded-2xl bg-white border-2 border-brand-200 flex items-center justify-center text-xl shadow-sm">
                    {step.emoji}
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex-1 shadow-sm">
                    <p className="text-[11px] font-black text-brand-500 mb-1">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="font-bold text-gray-900 mb-1.5">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ENGAGEMENTS */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-600 font-semibold text-xs uppercase tracking-widest mb-2">{c.commitLabel}</p>
            <h2 className="text-3xl font-black text-gray-900">{c.commitTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.commitments.map((com, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-6 hover:border-brand-200 hover:shadow-sm transition">
                <span className="text-3xl">{com.emoji}</span>
                <h3 className="font-black text-gray-900 mt-3 mb-1.5">{com.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{com.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEUX CIRCUITS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-600 font-semibold text-xs uppercase tracking-widest mb-2">{c.circuitsLabel}</p>
            <h2 className="text-3xl font-black text-gray-900">{c.circuitsTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border-2 border-brand-100 p-7">
              <h3 className="font-black text-gray-900 text-lg mb-3">{c.circuitB2cTitle}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{c.circuitB2cText}</p>
            </div>
            <div className="bg-white rounded-2xl border-2 border-brand-100 p-7">
              <h3 className="font-black text-gray-900 text-lg mb-3">{c.circuitB2bTitle}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{c.circuitB2bText}</p>
            </div>
          </div>

          {/* REFUS DE PRINCIPE */}
          <div className="mt-10 rounded-2xl bg-brand-950 text-white p-8">
            <h3 className="font-black text-lg mb-4">🚫 {c.refusalTitle}</h3>
            <ul className="space-y-2.5">
              {c.refusals.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/85 leading-relaxed">
                  <span className="text-red-400 font-black shrink-0 mt-0.5">✕</span> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-700 to-teal-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ShieldCheck className="w-10 h-10 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-4">{c.ctaTitle}</h2>
          <p className="text-white/90 leading-relaxed mb-8">{c.ctaText}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/catalogue" className="px-6 py-3 rounded-xl bg-white text-brand-700 font-black text-sm inline-flex items-center gap-2 hover:bg-brand-50">
              {c.ctaCatalogue} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/trust-center" className="px-6 py-3 rounded-xl border-2 border-white/40 text-white font-black text-sm hover:bg-white/10">
              {c.ctaTrust}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
