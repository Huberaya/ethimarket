import { Link } from 'react-router-dom';
import {
  Award, ShieldCheck, MapPin, Heart, Sprout, Star, X,
  CheckCircle, AlertTriangle, ChevronRight, TrendingUp,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useI18n } from '../lib/i18n';
import { SCORE_CONTENT } from '../lib/i18n/content/score';

const CAT_STYLE = [
  { icon: ShieldCheck, max: 40, color: 'text-brand-600', bg: 'bg-brand-50' },
  { icon: MapPin, max: 25, color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Heart, max: 20, color: 'text-rose-600', bg: 'bg-rose-50' },
  { icon: Sprout, max: 10, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Star, max: 5, color: 'text-amber-500', bg: 'bg-amber-50' },
];
const BADGE_COLORS = [
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-gray-100 text-gray-700 border-gray-300',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-gray-100 text-gray-500 border-gray-200',
];
const TIP_ICONS = [ShieldCheck, MapPin, MapPin, MapPin, Heart, Sprout, Star];

export default function ScoreEthiMarket() {
  const { locale } = useI18n();
  const c = SCORE_CONTENT[locale];
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <div className="pt-16 bg-gradient-to-br from-brand-50 via-white to-amber-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-100 mb-5">
            <Award className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">{c.heroTitle}</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {c.heroText}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* How it's calculated */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-gray-900 mb-2">{c.calcTitle}</h2>
          <p className="text-gray-500 mb-8">{c.calcIntro}</p>

          <div className="space-y-5">
            {c.categories.map((cat, ci) => {
              const style = CAT_STYLE[ci] ?? CAT_STYLE[0];
              const Icon = style.icon;
              return (
                <div key={cat.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.bg}`}>
                        <Icon className={`w-5 h-5 ${style.color}`} />
                      </div>
                      <h3 className="font-bold text-gray-900">{cat.name}</h3>
                    </div>
                    <span className="text-sm font-black text-gray-900">{style.max} {c.ptsLabel}</span>
                  </div>
                  <div className="p-5 space-y-2">
                    {cat.items.map(item => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-bold text-brand-600">+{item.points} {c.ptsLabel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Badges */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-gray-900 mb-2">{c.badgesTitle}</h2>
          <p className="text-gray-500 mb-8">{c.badgesIntro}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {c.badges.map((badge, bi) => (
              <div key={badge.label} className={`rounded-2xl border-2 p-5 ${BADGE_COLORS[bi] ?? BADGE_COLORS[3]}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{badge.icon}</span>
                  <div>
                    <p className="font-black">{badge.label}</p>
                    <p className="text-xs opacity-80">{c.scoreWord} {badge.range}</p>
                  </div>
                </div>
                <p className="text-sm opacity-90">{badge.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Penalties */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-gray-900 mb-2">{c.penaltiesTitle}</h2>
          <p className="text-gray-500 mb-8">{c.penaltiesIntro}</p>

          <div className="space-y-3">
            {c.penalties.map(p => {
              const Icon = p.suspend ? X : AlertTriangle;
              return (
                <div key={p.event} className={`flex items-center gap-3 p-4 rounded-xl border ${p.suspend ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                  <Icon className={`w-5 h-5 flex-shrink-0 ${p.suspend ? 'text-red-500' : 'text-amber-500'}`} />
                  <span className="flex-1 text-sm font-semibold text-gray-700">{p.event}</span>
                  <span className={`text-sm font-black ${p.suspend ? 'text-red-600' : 'text-amber-600'}`}>{p.points} {c.ptsLabel}</span>
                  {p.suspend && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{c.suspension}</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Automatic updates */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-gray-900 mb-2">{c.updateTitle}</h2>
          <p className="text-gray-500 mb-8">{c.updateIntro}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {c.updateItems.map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" /> {item}
              </div>
            ))}
          </div>
        </section>

        {/* Improvement tips */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-500" /> {c.tipsTitle}
          </h2>
          <p className="text-gray-500 mb-8">{c.tipsIntro}</p>
          <div className="bg-brand-50 rounded-2xl p-6 space-y-3">
            {c.tips.map((tip, i) => {
              const Icon = TIP_ICONS[i] ?? ShieldCheck;
              return (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <Icon className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" /> {tip}
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-gray-50 rounded-3xl p-8">
          <h2 className="text-xl font-black text-gray-900 mb-3">{c.ctaTitle}</h2>
          <p className="text-gray-500 mb-5">{c.ctaText}</p>
          <Link to="/catalogue" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
            {c.ctaButton} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
