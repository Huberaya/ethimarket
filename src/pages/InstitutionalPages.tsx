// =============================================================
// EthiMarket — Pages institutionnelles multilingues (fr/en/es/pt/ar) :
// Tarifs, Équipe, Certifications, Presse, Partenaires, Centre d'aide.
// =============================================================

import { Link } from 'react-router-dom';
import {
  Check, ShieldCheck, HelpCircle, Newspaper, Handshake, Users,
  BadgeCheck, Mail, ArrowRight, Search, FileText, Scale,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { useI18n } from '../lib/i18n';
import { INSTITUTIONAL_CONTENT } from '../lib/i18n/content/institutional';

function PageShell({ title, subtitle, seoTitle, seoDesc, children }: {
  title: string; subtitle: string; seoTitle: string; seoDesc: string; children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead title={seoTitle} description={seoDesc} />
      <Header />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900">{title}</h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ================= TARIFS ================= */
export function Tarifs() {
  const { locale } = useI18n();
  const c = INSTITUTIONAL_CONTENT[locale].pricing;
  const planLinks = ['/inscription', '/devenir-vendeur', '/contact'];

  return (
    <PageShell title={c.title} subtitle={c.subtitle} seoTitle={c.seoTitle} seoDesc={c.seoDesc}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {c.plans.map((p, i) => {
          const highlight = i === 1;
          return (
            <div key={p.name} className={`rounded-3xl border-2 p-7 flex flex-col ${highlight ? 'border-brand-500 shadow-lg relative' : 'border-gray-200'}`}>
              {highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-black uppercase tracking-wide px-3 py-1 rounded-full">
                  {c.mostChosen}
                </span>
              )}
              <h2 className="font-black text-gray-900 text-lg">{p.name}</h2>
              <p className="mt-2"><span className="text-3xl font-black text-gray-900">{p.price}</span></p>
              <p className="text-xs text-gray-500">{p.period}</p>
              <p className="text-sm text-gray-600 mt-3">{p.desc}</p>
              <ul className="mt-5 space-y-2.5 flex-1">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to={planLinks[i]} className={`mt-6 text-center py-3 rounded-xl text-sm font-bold transition-colors ${highlight ? 'bg-brand-600 hover:bg-brand-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                {p.cta}
              </Link>
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-gray-500 mt-8">{c.footnote}</p>
    </PageShell>
  );
}

/* ================= ÉQUIPE ================= */
export function NotreEquipe() {
  const { locale } = useI18n();
  const c = INSTITUTIONAL_CONTENT[locale].team;
  const valueIcons = [ShieldCheck, Handshake, Scale];

  return (
    <PageShell title={c.title} subtitle={c.subtitle} seoTitle={c.seoTitle} seoDesc={c.seoDesc}>
      <div className="rounded-3xl bg-brand-50 border border-brand-100 p-8 mb-10">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-xl shrink-0">HB</div>
          <div>
            <h2 className="font-black text-gray-900">{c.founderTitle}</h2>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{c.founderBio}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-black text-gray-900 text-center mb-6">{c.guideTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {c.values.map((v, i) => {
          const Icon = valueIcons[i] ?? ShieldCheck;
          return (
            <div key={v.title} className="rounded-2xl border border-gray-200 p-6">
              <Icon className="w-6 h-6 text-brand-600 mb-3" />
              <h3 className="font-bold text-gray-900 text-sm">{v.title}</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{v.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="text-center rounded-2xl border-2 border-dashed border-brand-200 p-8">
        <Users className="w-8 h-8 text-brand-500 mx-auto mb-3" />
        <h3 className="font-black text-gray-900">{c.hiringTitle}</h3>
        <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto">{c.hiringText}</p>
        <Link to="/contact" className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-brand-700 hover:text-brand-900">
          <Mail className="w-4 h-4" /> {c.hiringCta} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </PageShell>
  );
}

/* ================= CERTIFICATIONS ================= */
export function CertificationsPage() {
  const { locale } = useI18n();
  const c = INSTITUTIONAL_CONTENT[locale].certifications;

  return (
    <PageShell title={c.title} subtitle={c.subtitle} seoTitle={c.seoTitle} seoDesc={c.seoDesc}>
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 mb-10">
        <h2 className="flex items-center gap-2 font-black text-emerald-900"><BadgeCheck className="w-5 h-5" /> {c.processTitle}</h2>
        <ol className="mt-3 space-y-1.5 text-sm text-emerald-900 list-decimal ps-5">
          {c.processSteps.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
        <Link to="/trust-center" className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-emerald-700 hover:text-emerald-900">
          {c.processLink} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {c.certs.map(cert => (
          <div key={cert.name} className="rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-brand-600 shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{cert.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{c.bodiesLabel} {cert.body}</p>
              <p className="text-sm text-gray-600 mt-1.5">{cert.covers}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center mt-8">{c.footnote}</p>
    </PageShell>
  );
}

/* ================= PRESSE ================= */
export function Presse() {
  const { locale } = useI18n();
  const c = INSTITUTIONAL_CONTENT[locale].press;

  return (
    <PageShell title={c.title} subtitle={c.subtitle} seoTitle={c.seoTitle} seoDesc={c.seoDesc}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 p-6">
          <Newspaper className="w-6 h-6 text-brand-600 mb-3" />
          <h2 className="font-black text-gray-900">{c.briefTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {c.briefItems.map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200 p-6">
          <Mail className="w-6 h-6 text-brand-600 mb-3" />
          <h2 className="font-black text-gray-900">{c.contactTitle}</h2>
          <p className="text-sm text-gray-600 mt-3">{c.contactText}</p>
          <p className="mt-3 text-sm font-bold text-gray-900">{c.contactEmail}</p>
          <p className="text-xs text-gray-500 mt-1">{c.contactNote}</p>
          <div className="mt-5 rounded-xl bg-gray-50 border border-gray-100 p-4">
            <p className="text-xs text-gray-500">{c.angle}</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

/* ================= PARTENAIRES ================= */
export function Partenaires() {
  const { locale } = useI18n();
  const c = INSTITUTIONAL_CONTENT[locale].partners;
  const typeIcons = [ShieldCheck, Handshake, FileText, Users];

  return (
    <PageShell title={c.title} subtitle={c.subtitle} seoTitle={c.seoTitle} seoDesc={c.seoDesc}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {c.types.map((t, i) => {
          const Icon = typeIcons[i] ?? ShieldCheck;
          return (
            <div key={t.title} className="rounded-2xl border border-gray-200 p-6">
              <Icon className="w-6 h-6 text-brand-600 mb-3" />
              <h2 className="font-bold text-gray-900">{t.title}</h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{t.desc}</p>
              {t.ctaLabel && t.ctaTo && (
                <Link to={t.ctaTo} className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-brand-700 hover:text-brand-900">
                  {t.ctaLabel} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

/* ================= CENTRE D'AIDE ================= */
export function CentreAide() {
  const { locale } = useI18n();
  const c = INSTITUTIONAL_CONTENT[locale].help;

  return (
    <PageShell title={c.title} subtitle={c.subtitle} seoTitle={c.seoTitle} seoDesc={c.seoDesc}>
      <div className="space-y-3 max-w-3xl mx-auto">
        {c.faqs.map((f, i) => (
          <details key={i} className="group rounded-2xl border border-gray-200 overflow-hidden">
            <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors list-none">
              <span className="flex items-center gap-2.5 font-bold text-gray-900 text-sm">
                <HelpCircle className="w-4 h-4 text-brand-600 shrink-0" /> {f.q}
              </span>
              <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
            </summary>
            <div className="px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50">{f.a}</div>
          </details>
        ))}
      </div>
      <div className="text-center mt-10">
        <p className="text-sm text-gray-500">{c.notFound}</p>
        <Link to="/contact" className="inline-flex items-center gap-2 mt-2 text-sm font-bold text-brand-700 hover:text-brand-900">
          <Search className="w-4 h-4" /> {c.contactSupport} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </PageShell>
  );
}
