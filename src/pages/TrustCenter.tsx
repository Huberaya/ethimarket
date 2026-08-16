// =============================================================
// EthiMarket Trust Center — Page publique /trust-center
// Méthodologie transparente, multilingue (fr/en/es/pt/ar).
// =============================================================

import { ShieldCheck, FileSearch, Building2, AlertTriangle, Scale, BookOpenCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { useI18n } from '../lib/i18n';
import { TRUST_CENTER_CONTENT } from '../lib/i18n/content/trustCenter';

const LADDER_COLORS = ['bg-amber-500', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-400', 'bg-emerald-500'];

export default function TrustCenter() {
  const { locale } = useI18n();
  const c = TRUST_CENTER_CONTENT[locale];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead title={c.seoTitle} description={c.seoDesc} />
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 flex-1">
      {/* En-tête */}
      <header className="text-center pt-16">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
          <ShieldCheck className="h-7 w-7 text-emerald-700" aria-hidden />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{c.title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">{c.intro}</p>
      </header>

      {/* Principe fondateur */}
      <section className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-emerald-900">
          <Scale className="h-5 w-5" aria-hidden /> {c.rule1Title}
        </h2>
        <p className="mt-3 text-emerald-900">
          <strong>{c.rule1Strong}</strong>
        </p>
        <p className="mt-2 text-sm text-emerald-800">{c.rule1Text}</p>
      </section>

      {/* Hiérarchie des preuves */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <FileSearch className="h-5 w-5" aria-hidden /> {c.ladderTitle}
        </h2>
        <p className="mt-2 text-sm text-gray-600">{c.ladderIntro}</p>
        <ol className="mt-6 space-y-3">
          {c.ladder.map(step => (
            <li key={step.level} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${LADDER_COLORS[step.level - 1]} text-sm font-bold text-white`}>
                {step.level}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Processus de vérification */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Building2 className="h-5 w-5" aria-hidden /> {c.processTitle}
        </h2>
        <div className="mt-4 space-y-4 text-sm text-gray-700">
          <p>{c.processIntro1}</p>
          <ul className="list-disc space-y-2 ps-5">
            {c.processPoints.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      </section>

      {/* Ce que ça ne garantit pas */}
      <section className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-amber-900">
          <AlertTriangle className="h-5 w-5" aria-hidden /> {c.limitsTitle}
        </h2>
        <ul className="mt-3 list-disc space-y-2 ps-5 text-sm text-amber-900">
          {c.limits.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      </section>

      {/* Engagement */}
      <section className="mt-12 text-center">
        <h2 className="flex items-center justify-center gap-2 text-xl font-bold text-gray-900">
          <BookOpenCheck className="h-5 w-5" aria-hidden /> {c.engagementTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">{c.engagementText}</p>
      </section>
      </main>
      <Footer />
    </div>
  );
}
