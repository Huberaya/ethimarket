// =============================================================
// EthiMarket — Section fiche produit « Responsibility Score »
// LA réponse à : « Est-ce que je peux acheter en toute confiance ? »
// Score global + 6 critères détaillés + ⚠️ Points d'attention +
// bouton ✨ « Trouver mieux ».
// =============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, ChevronDown, AlertTriangle, AlertOctagon, Info,
  Sparkles, Loader2, Trophy,
} from 'lucide-react';
import { Product } from '../../lib/supabase';
import { getResponsibilityReport, ResponsibilityReport } from '../../lib/responsibilityScore';
import { runFindBetter, FindBetterResult, DIMENSION_LABELS } from '../../lib/findBetterEngine';
import { SectionTitle } from './GuaranteesSection';

const SEVERITY_META = {
  critical: { icon: AlertOctagon, cls: 'bg-red-50 border-red-200 text-red-800' },
  warning: { icon: AlertTriangle, cls: 'bg-amber-50 border-amber-200 text-amber-800' },
  info: { icon: Info, cls: 'bg-blue-50 border-blue-200 text-blue-800' },
} as const;

export default function ResponsibilityScoreSection({ product }: { product: Product }) {
  const [report, setReport] = useState<ResponsibilityReport | null>(null);
  const [openCriterion, setOpenCriterion] = useState<string | null>(null);
  const [better, setBetter] = useState<FindBetterResult | null>(null);
  const [findingBetter, setFindingBetter] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getResponsibilityReport(product).then(r => { if (!cancelled) setReport(r); });
    return () => { cancelled = true; };
  }, [product]);

  if (!report) return null;

  const scoreColor = report.overallScore >= 80 ? 'text-emerald-600' : report.overallScore >= 60 ? 'text-amber-600' : 'text-red-600';
  const ringColor = report.overallScore >= 80 ? 'stroke-emerald-500' : report.overallScore >= 60 ? 'stroke-amber-500' : 'stroke-red-500';
  const circumference = 2 * Math.PI * 42;

  return (
    <section className="py-12 border-t border-gray-100">
      <SectionTitle icon={ShieldCheck} title="Responsibility Score" />
      <p className="text-sm text-gray-500 mt-1 mb-8">
        « Est-ce que je peux acheter ce produit en toute confiance ? » — score transparent, chaque point est explicable.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score global + jauge */}
        <div className="flex flex-col items-center justify-start bg-white rounded-2xl border border-gray-100 p-6">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="9" className="stroke-gray-100" />
              <circle
                cx="50" cy="50" r="42" fill="none" strokeWidth="9" strokeLinecap="round"
                className={ringColor}
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - report.overallScore / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${scoreColor}`}>{report.overallScore}</span>
              <span className="text-[10px] text-gray-500 font-bold">/100</span>
            </div>
          </div>
          <p className="mt-3 text-sm font-bold text-gray-900">Responsibility Score</p>
          <p className="text-[11px] text-gray-500 text-center mt-1">
            Moyenne pondérée de 6 critères, calculée à partir des données produit et des preuves du Trust Center.
          </p>

          {/* Bouton Trouver mieux */}
          <button
            onClick={async () => {
              setFindingBetter(true);
              setBetter(await runFindBetter(product));
              setFindingBetter(false);
            }}
            disabled={findingBetter}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-black transition-colors shadow-sm cursor-pointer disabled:opacity-60"
          >
            {findingBetter ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Trouver mieux
          </button>
        </div>

        {/* 6 critères */}
        <div className="lg:col-span-2 space-y-2.5">
          {report.criteria.map(c => {
            const isOpen = openCriterion === c.key;
            const barColor = c.score >= 80 ? 'bg-emerald-500' : c.score >= 60 ? 'bg-amber-400' : 'bg-red-400';
            return (
              <div key={c.key} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenCriterion(isOpen ? null : c.key)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50/60 transition-colors cursor-pointer"
                >
                  <span className="text-lg w-7">{c.emoji}</span>
                  <span className="font-bold text-gray-800 text-sm w-32 text-left">{c.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${c.score}%` }} />
                  </div>
                  <span className="font-black text-gray-900 tabular-nums w-10 text-right">{c.score}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <ul className="px-5 pb-3 pt-1 border-t border-gray-50 space-y-1">
                    {c.details.map((d, i) => (
                      <li key={i} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{d.label}</span>
                        <span className={`font-bold tabular-nums ${d.points > 0 ? 'text-emerald-600' : d.points < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {d.points > 0 ? '+' : ''}{d.points}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ⚠️ Points d'attention */}
      {report.attentionPoints.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-black text-gray-900 mb-3">⚠️ Points d'attention</h3>
          <div className="space-y-2">
            {report.attentionPoints.map((a, i) => {
              const meta = SEVERITY_META[a.severity];
              const Icon = meta.icon;
              return (
                <div key={i} className={`flex items-start gap-2.5 rounded-xl border px-4 py-2.5 text-sm ${meta.cls}`}>
                  <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{a.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Résultat Trouver mieux */}
      {better && (
        <div className="mt-8 rounded-2xl border-2 border-violet-200 bg-violet-50/60 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <h3 className="font-black text-gray-900">{better.verdict}</h3>
          </div>
          <p className="text-[11px] text-gray-500 mb-4">{better.scannedCount} produit{better.scannedCount > 1 ? 's' : ''} de la même famille analysé{better.scannedCount > 1 ? 's' : ''} sur 7 dimensions (prix, responsabilité, localité, certifications, traçabilité, risque, disponibilité).</p>
          {better.alternatives.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {better.alternatives.map(alt => (
                <Link
                  key={alt.product.id}
                  to={`/produits/${alt.product.slug}`}
                  className="bg-white rounded-xl border border-violet-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm truncate">{alt.product.country_flag} {alt.product.name}</span>
                    <span className="text-xs font-black text-violet-700">{alt.scorecard.overallScore}/100</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{alt.product.price} {alt.product.currency || '€'}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {alt.winningDimensions.slice(0, 4).map(d => (
                      <span key={d} className="text-[10px] font-bold bg-violet-100 text-violet-800 rounded-full px-2 py-0.5">
                        {DIMENSION_LABELS[d].emoji} {DIMENSION_LABELS[d].label}
                      </span>
                    ))}
                  </div>
                  {alt.losingDimensions.length > 0 && (
                    <p className="text-[10px] text-gray-500 mt-1.5">
                      Moins bien : {alt.losingDimensions.slice(0, 2).map(d => DIMENSION_LABELS[d].label.toLowerCase()).join(', ')}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
          {better.alternatives.length === 0 && (
            <p className="flex items-center gap-2 text-sm text-emerald-700 font-semibold">
              <Trophy className="w-4 h-4" /> Ce produit est déjà le meilleur choix de sa catégorie.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
