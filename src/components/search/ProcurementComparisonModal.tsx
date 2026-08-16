// =============================================================
// EthiMarket — Comparateur visuel Achats Responsables
// Matrice Produit A / B / C : Prix, Responsabilité, Traçabilité,
// Certifications, Risque 🔴🟠🟢 — meilleure valeur en GRAS souligné
// vert. Puis recommandation 🤖 (IA gratuite avec fallback local) et
// FICHE JUSTIFICATIVE imprimable pour le responsable achats.
// =============================================================

import { useEffect, useMemo, useState } from 'react';
import {
  X, Trophy, Bot, FileText, Printer, Loader2, ShieldCheck,
  TrendingUp, AlertTriangle, ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../lib/supabase';
import {
  analyzeComparison, fetchTrustSnapshots, buildJustificationSheetHtml,
  ComparisonAnalysis, ProductScorecard, RiskLevel, TrustSnapshot,
} from '../../lib/procurementComparator';
import { enhanceRecommendationWithFreeAi } from '../../lib/procurementLlm';
import { recordBuyerEvent } from '../../lib/buyerWorkspace';
import { useAuth } from '../../lib/auth';

const RISK_DISPLAY: Record<RiskLevel, { emoji: string; label: string; cls: string }> = {
  low: { emoji: '🟢', label: 'Faible', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  medium: { emoji: '🟠', label: 'Modéré', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  high: { emoji: '🔴', label: 'Élevé', cls: 'bg-red-50 text-red-700 border-red-200' },
};

function ScoreCell({ value, isBest }: { value: number; isBest: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className={`text-lg tabular-nums ${isBest ? 'font-black text-emerald-700' : 'font-semibold text-gray-700'}`}>
        {value}
      </span>
      <div className="w-full max-w-[90px] h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${isBest ? 'bg-emerald-500' : value >= 70 ? 'bg-emerald-300' : value >= 45 ? 'bg-amber-300' : 'bg-red-300'}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

interface ProcurementComparisonModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ProcurementComparisonModal({ products, isOpen, onClose }: ProcurementComparisonModalProps) {
  const [analysis, setAnalysis] = useState<ComparisonAnalysis | null>(null);
  const [trust, setTrust] = useState<Record<string, TrustSnapshot>>({});
  const [loading, setLoading] = useState(false);
  const [aiUsed, setAiUsed] = useState<string>('local');

  const { user } = useAuth();

  useEffect(() => {
    if (!isOpen || products.length < 2) return;
    if (user) void recordBuyerEvent(user.id, 'comparison_run', { extra: { productCount: products.length } });
    let cancelled = false;
    setLoading(true);
    (async () => {
      const snaps = await fetchTrustSnapshots(products.map(p => p.id));
      const base = await analyzeComparison(products);
      let final = base;
      if (base.recommendation) {
        const { recommendation, aiUsed: used } = await enhanceRecommendationWithFreeAi(base);
        final = { ...base, recommendation };
        if (!cancelled) setAiUsed(used);
      }
      if (!cancelled) {
        setTrust(snaps);
        setAnalysis(final);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isOpen, products]);

  const bestOf = useMemo(() => {
    if (!analysis) return {} as Record<string, string>;
    const byKey = (fn: (s: ProductScorecard) => number, lowest = false) => {
      const sorted = [...analysis.scorecards].sort((a, b) => lowest ? fn(a) - fn(b) : fn(b) - fn(a));
      return sorted[0]?.product.id ?? '';
    };
    return {
      price: byKey(s => s.product.price ?? Infinity, true),
      responsibility: byKey(s => s.responsibilityScore),
      traceability: byKey(s => s.traceabilityScore),
      certification: byKey(s => s.certificationScore),
    };
  }, [analysis]);

  if (!isOpen) return null;

  const openJustificationSheet = () => {
    if (!analysis) return;
    const html = buildJustificationSheetHtml(analysis, trust);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 400);
    }
  };

  const reco = analysis?.recommendation;
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4 md:p-8" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl my-4"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Comparateur achats responsables"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="font-black text-gray-900">Comparateur achats responsables</h2>
              <p className="text-xs text-gray-500">{products.length} produits · scores calculés à partir des preuves du Trust Center</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors" aria-label="Fermer">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {loading || !analysis ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm text-gray-500">Analyse des preuves et calcul des scores…</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* ======== MATRICE VISUELLE ======== */}
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide w-40">Critère</th>
                    {analysis.scorecards.map((s, i) => {
                      const isReco = reco?.recommended.product.id === s.product.id;
                      return (
                        <th key={s.product.id} className={`px-4 py-3 text-center ${isReco ? 'bg-emerald-50' : ''}`}>
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Produit {letters[i]}</span>
                            <Link to={`/produits/${s.product.slug}`} className="font-bold text-gray-900 hover:text-emerald-700 leading-tight max-w-[150px] truncate">
                              {s.product.country_flag} {s.product.name}
                            </Link>
                            {isReco && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                <Trophy className="w-3 h-3" /> RECOMMANDÉ
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-600">💶 Prix</td>
                    {analysis.scorecards.map(s => (
                      <td key={s.product.id} className={`px-4 py-3 text-center ${reco?.recommended.product.id === s.product.id ? 'bg-emerald-50/40' : ''}`}>
                        <span className={`text-lg tabular-nums ${bestOf.price === s.product.id ? 'font-black text-emerald-700 underline decoration-emerald-300 decoration-2 underline-offset-4' : 'font-semibold text-gray-700'}`}>
                          {s.product.price} {s.product.currency || '€'}
                        </span>
                        <span className="block text-[10px] text-gray-500">/{s.product.price_unit || s.product.moq_unit || 'unité'}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-600">🌍 Responsabilité</td>
                    {analysis.scorecards.map(s => (
                      <td key={s.product.id} className={`px-4 py-3 ${reco?.recommended.product.id === s.product.id ? 'bg-emerald-50/40' : ''}`}>
                        <ScoreCell value={s.responsibilityScore} isBest={bestOf.responsibility === s.product.id} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-600">🔍 Traçabilité</td>
                    {analysis.scorecards.map(s => (
                      <td key={s.product.id} className={`px-4 py-3 ${reco?.recommended.product.id === s.product.id ? 'bg-emerald-50/40' : ''}`}>
                        <ScoreCell value={s.traceabilityScore} isBest={bestOf.traceability === s.product.id} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-600">🏅 Certifications</td>
                    {analysis.scorecards.map(s => (
                      <td key={s.product.id} className={`px-4 py-3 ${reco?.recommended.product.id === s.product.id ? 'bg-emerald-50/40' : ''}`}>
                        <ScoreCell value={s.certificationScore} isBest={bestOf.certification === s.product.id} />
                        {(trust[s.product.id]?.verifiedClaims ?? 0) > 0 && (
                          <span className="mt-1 flex items-center justify-center gap-1 text-[10px] text-emerald-700 font-semibold">
                            <ShieldCheck className="w-3 h-3" /> {trust[s.product.id].verifiedClaims} vérifiée{trust[s.product.id].verifiedClaims > 1 ? 's' : ''}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-600">⚠️ Risque</td>
                    {analysis.scorecards.map(s => {
                      const r = RISK_DISPLAY[s.riskLevel];
                      return (
                        <td key={s.product.id} className={`px-4 py-3 text-center ${reco?.recommended.product.id === s.product.id ? 'bg-emerald-50/40' : ''}`}>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${r.cls}`} title={s.riskFactors.join(' · ')}>
                            <span className="text-base leading-none">{r.emoji}</span> {r.label}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="bg-gray-50/60">
                    <td className="px-4 py-3 font-black text-gray-800">Σ Score global</td>
                    {analysis.scorecards.map(s => (
                      <td key={s.product.id} className={`px-4 py-3 text-center ${reco?.recommended.product.id === s.product.id ? 'bg-emerald-100/60' : ''}`}>
                        <span className={`text-xl tabular-nums ${reco?.recommended.product.id === s.product.id ? 'font-black text-emerald-700' : 'font-bold text-gray-600'}`}>
                          {s.overallScore}
                        </span>
                        <span className="text-xs text-gray-500">/100</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ======== RECOMMANDATION IA ======== */}
            {reco && (
              <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center shrink-0">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                        🤖 Recommandation {aiUsed === 'local' ? '(moteur local — zéro API)' : `(IA gratuite ${aiUsed})`}
                      </p>
                      <h3 className="text-lg font-black text-gray-900">{reco.headline}</h3>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={openJustificationSheet}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                    >
                      <FileText className="w-4 h-4" /> Fiche justificative
                      <Printer className="w-3.5 h-3.5 opacity-70" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  {reco.justification.map((p, i) => (
                    <p key={i} className="text-sm text-gray-700 leading-relaxed flex gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{p}</span>
                    </p>
                  ))}
                </div>

                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                  <p className="text-xs text-amber-900 leading-relaxed">
                    <strong>💼 Note pour la direction :</strong> {reco.buyerNote}
                  </p>
                </div>

                {reco.recommended.weaknesses.length > 0 && (
                  <p className="mt-3 flex items-start gap-1.5 text-[11px] text-gray-500">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
                    Vigilance : {reco.recommended.weaknesses.slice(0, 2).join(' · ')}
                  </p>
                )}
              </div>
            )}

            {/* Lien méthodologie */}
            <p className="text-center">
              <Link to="/trust-center" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900">
                Comment ces scores sont-ils calculés ? Méthodologie du Trust Center
                <ExternalLink className="w-3 h-3" />
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
