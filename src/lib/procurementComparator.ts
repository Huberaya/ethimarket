// =============================================================
// EthiMarket — Comparateur Achats Responsables
//
// Calcule pour chaque produit comparé 4 scores (0-100) :
//   Prix (position relative), Responsabilité, Traçabilité,
//   Certifications — plus un niveau de RISQUE fournisseur 🔴🟠🟢.
//
// Produit une RECOMMANDATION avec justification rédigée en français
// (moteur local déterministe, zéro API payante) et une FICHE
// JUSTIFICATIVE imprimable destinée au responsable achats pour
// défendre sa décision auprès de sa direction.
// =============================================================

import { Product } from './supabase';
import { supabase } from './supabase';
import { carbonPerformance } from './impactEstimator';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface TrustSnapshot {
  productId: string;
  totalClaims: number;
  verifiedClaims: number;
  pendingClaims: number;
  declaredOnlyClaims: number;
  expiredClaims: number;
  contradictedClaims: number;
  verifiedCertificates: {
    label: string;
    referenceNumber?: string;
    issuingBody?: string;
    validUntil?: string;
    sourceUrl?: string;
  }[];
}

export interface ProductScorecard {
  product: Product;
  priceScore: number;          // 100 = le moins cher du panel
  responsibilityScore: number; // engagements éthiques & environnementaux
  traceabilityScore: number;   // lot, GPS, QR, origines, dates
  certificationScore: number;  // certifs + allégations vérifiées Trust Center
  riskLevel: RiskLevel;
  riskFactors: string[];       // explications du niveau de risque
  overallScore: number;        // pondéré pour la recommandation
  strengths: string[];
  weaknesses: string[];
}

export interface ProcurementRecommendation {
  recommended: ProductScorecard;
  runnerUp?: ProductScorecard;
  headline: string;            // « Produit B recommandé »
  justification: string[];     // paragraphes de justification
  buyerNote: string;           // phrase pour la direction
  generatedAt: string;
  engineVersion: string;
}

export interface ComparisonAnalysis {
  scorecards: ProductScorecard[];
  recommendation: ProcurementRecommendation | null;
}

// -------------------------------------------------------------
// Chargement des données Trust Center des produits comparés
// -------------------------------------------------------------
export async function fetchTrustSnapshots(productIds: string[]): Promise<Record<string, TrustSnapshot>> {
  const result: Record<string, TrustSnapshot> = {};
  if (productIds.length === 0) return result;

  try {
    const { data } = await supabase
      .from('product_claims')
      .select(`
        id, product_id, claim_label, verification_status,
        claim_evidence ( reference_number, source_url, valid_until,
          certification_bodies ( name ) )
      `)
      .in('product_id', productIds);

    for (const pid of productIds) {
      result[pid] = {
        productId: pid, totalClaims: 0, verifiedClaims: 0, pendingClaims: 0,
        declaredOnlyClaims: 0, expiredClaims: 0, contradictedClaims: 0,
        verifiedCertificates: [],
      };
    }

    interface ClaimRow {
      product_id: string;
      claim_label: string;
      verification_status: string;
      claim_evidence?: {
        reference_number: string | null;
        source_url: string | null;
        valid_until: string | null;
        certification_bodies?: { name: string } | null;
      }[] | null;
    }

    ((data ?? []) as unknown as ClaimRow[]).forEach(row => {
      const snap = result[row.product_id];
      if (!snap) return;
      snap.totalClaims++;
      switch (row.verification_status) {
        case 'verified': {
          snap.verifiedClaims++;
          const ev = (row.claim_evidence ?? []).find(e => e.reference_number);
          snap.verifiedCertificates.push({
            label: row.claim_label,
            referenceNumber: ev?.reference_number ?? undefined,
            issuingBody: ev?.certification_bodies?.name ?? undefined,
            validUntil: ev?.valid_until ?? undefined,
            sourceUrl: ev?.source_url ?? undefined,
          });
          break;
        }
        case 'pending_verification': snap.pendingClaims++; break;
        case 'expired': snap.expiredClaims++; break;
        case 'contradicted': snap.contradictedClaims++; break;
        default: snap.declaredOnlyClaims++;
      }
    });
  } catch {
    // hors-ligne / RLS : snapshots vides, le comparateur reste fonctionnel
  }
  return result;
}

// -------------------------------------------------------------
// Scoring
// -------------------------------------------------------------
const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

export function computeScorecards(
  products: Product[],
  trust: Record<string, TrustSnapshot> = {},
): ProductScorecard[] {
  if (products.length === 0) return [];
  const minPrice = Math.min(...products.map(p => p.price || Infinity));

  return products.map(p => {
    const snap = trust[p.id];

    // ---- PRIX (relatif au panel : 100 = le moins cher) ----
    const priceScore = p.price && minPrice !== Infinity
      ? clamp(100 - ((p.price - minPrice) / minPrice) * 100)
      : 50;

    // ---- RESPONSABILITÉ ----
    let resp = 30;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    if (p.fair_trade) { resp += 14; strengths.push('Commerce équitable'); }
    if (p.living_wage_guaranteed) { resp += 14; strengths.push('Salaire décent garanti'); }
    if (p.social_audit_passed) { resp += 10; strengths.push('Audit social réalisé'); }
    if (p.is_cooperative) { resp += 6; strengths.push('Production en coopérative'); }
    if (p.is_recycled && (p.recycled_percentage ?? 0) > 0) { resp += 5; }
    // Performance carbone relative à la référence conventionnelle de la
    // catégorie ; si le producteur n'a pas fourni d'ACV, l'estimation
    // sectorielle sourcée est utilisée (jamais de pénalité pour donnée
    // manquante — voir impactEstimator.ts).
    const co2Perf = carbonPerformance(p);
    const co2Tag = co2Perf.source === 'producer' ? 'ACV producteur' : 'estimation sectorielle';
    if (co2Perf.tier === 'excellent') { resp += co2Perf.source === 'producer' ? 12 : 8; strengths.push(`Empreinte carbone très inférieure à sa catégorie (${co2Perf.value} kg CO2e/kg — ${co2Tag})`); }
    else if (co2Perf.tier === 'good') resp += co2Perf.source === 'producer' ? 7 : 5;
    else if (co2Perf.tier === 'high') { resp -= 8; weaknesses.push(`Empreinte carbone supérieure à sa catégorie (${co2Perf.value} kg CO2e/kg — ${co2Tag})`); }
    if ((p.packaging_types ?? []).some(t => ['plastic_free', 'compostable'].includes(t))) resp += 5;
    if (!p.fair_trade && !p.living_wage_guaranteed) weaknesses.push('Aucune garantie sociale (équitable / salaire décent)');
    const responsibilityScore = clamp(resp);

    // ---- TRAÇABILITÉ ----
    let trace = 10;
    if (p.batch_number) { trace += 18; } else { weaknesses.push('Numéro de lot absent'); }
    if (p.gps_coordinates) trace += 16;
    if (p.trace_qr_code) trace += 10;
    if (p.manufacturing_country) trace += 12;
    if (p.raw_materials_origin) trace += 12;
    if (p.harvest_date || p.planting_date) trace += 10;
    if (p.farming_method) trace += 8;
    if (snap && snap.verifiedClaims > 0) trace += Math.min(14, snap.verifiedClaims * 7);
    if (trace >= 76) strengths.push('Traçabilité complète (lot, GPS, origines)');
    const traceabilityScore = clamp(trace);

    // ---- CERTIFICATIONS ----
    let cert = 15;
    cert += Math.min(30, (p.certifications?.length ?? 0) * 12);
    if (snap) {
      cert += Math.min(45, snap.verifiedClaims * 15);              // allégations VÉRIFIÉES
      cert += Math.min(10, snap.pendingClaims * 4);                // en cours
      cert -= snap.contradictedClaims * 25;                        // contredites
      cert -= snap.expiredClaims * 10;                             // expirées
      if (snap.verifiedClaims > 0) {
        strengths.push(`${snap.verifiedClaims} allégation${snap.verifiedClaims > 1 ? 's' : ''} vérifiée${snap.verifiedClaims > 1 ? 's' : ''} par organisme certificateur`);
      }
      if (snap.contradictedClaims > 0) weaknesses.push(`${snap.contradictedClaims} allégation(s) contredite(s) lors du contrôle`);
      if (snap.expiredClaims > 0) weaknesses.push(`${snap.expiredClaims} certification(s) expirée(s)`);
      if (snap.totalClaims > 0 && snap.verifiedClaims === 0 && snap.pendingClaims === 0) {
        weaknesses.push('Allégations éthiques uniquement déclaratives (aucune preuve indépendante)');
      }
    }
    const certificationScore = clamp(cert);

    // ---- RISQUE FOURNISSEUR ----
    const riskFactors: string[] = [];
    let riskPoints = 0;
    if (snap?.contradictedClaims) { riskPoints += 3; riskFactors.push('Allégation contredite par un contrôle indépendant'); }
    if (snap?.expiredClaims) { riskPoints += 1.5; riskFactors.push('Certification expirée non renouvelée'); }
    if ((p.confidence_score ?? 0) < 60 && p.confidence_score !== undefined) { riskPoints += 1.5; riskFactors.push(`Score de confiance plateforme faible (${p.confidence_score}/100)`); }
    if (!snap || snap.verifiedClaims === 0) { riskPoints += 1.5; riskFactors.push('Aucune preuve vérifiée indépendamment'); }
    if (traceabilityScore < 50) { riskPoints += 1.5; riskFactors.push('Traçabilité insuffisante'); }
    if (!p.social_audit_passed && !p.fair_trade) { riskPoints += 1; riskFactors.push('Conditions sociales non auditées'); }
    if ((p.rating ?? 0) > 0 && (p.rating ?? 0) < 3.5) { riskPoints += 1; riskFactors.push(`Note acheteurs basse (${p.rating}/5)`); }
    const riskLevel: RiskLevel = riskPoints >= 4 ? 'high' : riskPoints >= 2 ? 'medium' : 'low';
    if (riskLevel === 'low') riskFactors.unshift('Aucun signal de risque majeur détecté');

    // ---- SCORE GLOBAL (pondération achats responsables) ----
    const overallScore = clamp(
      responsibilityScore * 0.28 +
      traceabilityScore * 0.27 +
      certificationScore * 0.25 +
      priceScore * 0.20 -
      (riskLevel === 'high' ? 15 : riskLevel === 'medium' ? 6 : 0),
    );

    return {
      product: p, priceScore, responsibilityScore, traceabilityScore,
      certificationScore, riskLevel, riskFactors, overallScore,
      strengths: Array.from(new Set(strengths)),
      weaknesses: Array.from(new Set(weaknesses)),
    };
  });
}

// -------------------------------------------------------------
// Recommandation & justification (moteur local, zéro API)
// -------------------------------------------------------------
const RISK_LABEL: Record<RiskLevel, string> = {
  low: 'faible', medium: 'modéré', high: 'élevé',
};

export function buildRecommendation(
  scorecards: ProductScorecard[],
  trust: Record<string, TrustSnapshot> = {},
): ProcurementRecommendation | null {
  if (scorecards.length < 2) return null;

  const ranked = [...scorecards].sort((a, b) => b.overallScore - a.overallScore);
  const winner = ranked[0];
  const runnerUp = ranked[1];
  const cheapest = [...scorecards].sort((a, b) => (a.product.price ?? 0) - (b.product.price ?? 0))[0];
  const w = winner.product;
  const snap = trust[w.id];

  const justification: string[] = [];

  // Paragraphe 1 : positionnement prix
  if (cheapest.product.id === w.id) {
    justification.push(
      `${w.name} est à la fois le produit le mieux noté du panel (score global ${winner.overallScore}/100) et le moins cher (${w.price} ${w.currency || '€'}). Le choix ne présente aucun surcoût.`,
    );
  } else {
    const diffPct = Math.round(((w.price - cheapest.product.price) / cheapest.product.price) * 100);
    justification.push(
      `${w.name} coûte ${diffPct}% de plus que l'option la moins chère (${cheapest.product.name}, ${cheapest.product.price} ${cheapest.product.currency || '€'}), mais présente un niveau de traçabilité ${winner.traceabilityScore >= cheapest.traceabilityScore + 20 ? 'nettement supérieur' : 'supérieur'} (${winner.traceabilityScore}/100 contre ${cheapest.traceabilityScore}/100) et un risque fournisseur ${winner.riskLevel === 'low' && cheapest.riskLevel !== 'low' ? 'significativement inférieur' : `${RISK_LABEL[winner.riskLevel]} contre ${RISK_LABEL[cheapest.riskLevel]}`}.`,
    );
  }

  // Paragraphe 2 : preuves vérifiées (l'argument massue pour la direction)
  if (snap && snap.verifiedCertificates.length > 0) {
    const certs = snap.verifiedCertificates
      .slice(0, 3)
      .map(c => `« ${c.label} »${c.referenceNumber ? ` (certificat ${c.referenceNumber}${c.issuingBody ? `, ${c.issuingBody}` : ''})` : ''}`)
      .join(', ');
    justification.push(
      `Ses engagements sont documentés et vérifiés auprès des organismes émetteurs : ${certs}. Ces preuves sont opposables en cas d'audit RSE ou de contrôle CSRD/devoir de vigilance.`,
    );
  } else {
    justification.push(
      `Attention : les allégations éthiques de ce produit ne sont pas encore toutes appuyées par des preuves vérifiées de manière indépendante. Il reste néanmoins le meilleur compromis du panel sur les critères mesurés.`,
    );
  }

  // Paragraphe 3 : comparaison avec le second
  if (runnerUp && runnerUp.overallScore >= winner.overallScore - 8) {
    justification.push(
      `L'alternative la plus proche est ${runnerUp.product.name} (score ${runnerUp.overallScore}/100). Elle reste pertinente en second choix ou en source de secours pour sécuriser l'approvisionnement.`,
    );
  } else if (runnerUp) {
    justification.push(
      `L'écart avec le deuxième produit (${runnerUp.product.name}, ${runnerUp.overallScore}/100) est significatif : la recommandation est robuste.`,
    );
  }

  // Paragraphe 4 : risques résiduels du gagnant
  if (winner.weaknesses.length > 0) {
    justification.push(`Points de vigilance à suivre : ${winner.weaknesses.slice(0, 3).join(' ; ')}.`);
  }

  const buyerNote =
    cheapest.product.id === w.id
      ? `Décision alignée coût/conformité : meilleure évaluation éthique du panel sans surcoût.`
      : `Le surcoût de ${(w.price - cheapest.product.price).toFixed(2)} ${w.currency || '€'}/unité s'analyse comme une prime d'assurance conformité : traçabilité documentée, preuves de certification opposables et risque fournisseur ${RISK_LABEL[winner.riskLevel]}. Ce différentiel protège l'entreprise contre les risques d'image, de non-conformité CSRD et de rupture d'approvisionnement.`;

  return {
    recommended: winner,
    runnerUp,
    headline: `${w.name} recommandé`,
    justification,
    buyerNote,
    generatedAt: new Date().toISOString(),
    engineVersion: 'EthiMarket Procurement Engine v1 (local, zéro API)',
  };
}

export async function analyzeComparison(products: Product[]): Promise<ComparisonAnalysis> {
  const trust = await fetchTrustSnapshots(products.map(p => p.id));
  const scorecards = computeScorecards(products, trust);
  return { scorecards, recommendation: buildRecommendation(scorecards, trust) };
}

// -------------------------------------------------------------
// Fiche justificative imprimable (HTML autonome → impression/PDF)
// -------------------------------------------------------------
export function buildJustificationSheetHtml(
  analysis: ComparisonAnalysis,
  trust: Record<string, TrustSnapshot> = {},
): string {
  const { scorecards, recommendation } = analysis;
  if (!recommendation) return '';
  const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const riskBadge = (r: RiskLevel) => r === 'low' ? '🟢 Faible' : r === 'medium' ? '🟠 Modéré' : '🔴 Élevé';
  const fmt = (iso?: string) => iso ? new Date(iso).toLocaleDateString('fr-FR') : '—';

  const rows = (label: string, get: (s: ProductScorecard) => string, highlight?: (s: ProductScorecard) => boolean) =>
    `<tr><td class="crit">${label}</td>${scorecards.map(s =>
      `<td class="${highlight?.(s) ? 'win' : ''}">${get(s)}</td>`).join('')}</tr>`;

  const best = (key: keyof Pick<ProductScorecard, 'responsibilityScore' | 'traceabilityScore' | 'certificationScore'>) => {
    const max = Math.max(...scorecards.map(s => s[key]));
    return (s: ProductScorecard) => s[key] === max;
  };
  const minPrice = Math.min(...scorecards.map(s => s.product.price ?? Infinity));

  const certsList = (pid: string) => {
    const snap = trust[pid];
    if (!snap || snap.verifiedCertificates.length === 0) return '<em>Aucune preuve vérifiée</em>';
    return snap.verifiedCertificates.map(c =>
      `${c.label}${c.referenceNumber ? ` — cert. ${c.referenceNumber}` : ''}${c.issuingBody ? ` (${c.issuingBody})` : ''}${c.validUntil ? `, valide jusqu'au ${fmt(c.validUntil)}` : ''}`,
    ).join('<br>');
  };

  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8">
<title>Fiche justificative d'achat — EthiMarket</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; margin: 40px; font-size: 13px; }
  h1 { font-size: 20px; color: #065f46; margin-bottom: 2px; }
  h2 { font-size: 15px; color: #065f46; border-bottom: 2px solid #d1fae5; padding-bottom: 4px; margin-top: 26px; }
  .meta { color: #6b7280; font-size: 11px; }
  table { border-collapse: collapse; width: 100%; margin-top: 10px; }
  th, td { border: 1px solid #e5e7eb; padding: 8px 10px; text-align: center; }
  th { background: #ecfdf5; color: #065f46; }
  td.crit { text-align: left; font-weight: 600; background: #f9fafb; }
  td.win { background: #d1fae5; font-weight: 700; }
  .reco { background: #ecfdf5; border: 2px solid #10b981; border-radius: 10px; padding: 16px; margin-top: 14px; }
  .reco h3 { margin: 0 0 8px; color: #065f46; font-size: 16px; }
  .note { background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 12px; margin-top: 12px; font-style: italic; }
  .sign { margin-top: 40px; display: flex; gap: 60px; }
  .sign div { border-top: 1px solid #9ca3af; padding-top: 6px; width: 220px; font-size: 11px; color: #6b7280; }
  ul { margin: 6px 0; padding-left: 18px; }
  @media print { body { margin: 15mm; } }
</style></head><body>
<h1>🛡️ Fiche justificative de décision d'achat</h1>
<p class="meta">Générée le ${date} par EthiMarket — ${recommendation.engineVersion}.<br>
Document destiné à documenter la décision auprès de la direction (achats responsables, conformité CSRD / devoir de vigilance).</p>

<h2>1. Produits comparés</h2>
<table>
<tr><th>Critère</th>${scorecards.map(s => `<th>${s.product.name}<br><span style="font-weight:400">${s.product.producers?.name ?? s.product.country ?? ''}</span></th>`).join('')}</tr>
${rows('Prix unitaire', s => `${s.product.price} ${s.product.currency || '€'}`, s => (s.product.price ?? Infinity) === minPrice)}
${rows('Responsabilité (/100)', s => String(s.responsibilityScore), best('responsibilityScore'))}
${rows('Traçabilité (/100)', s => String(s.traceabilityScore), best('traceabilityScore'))}
${rows('Certifications (/100)', s => String(s.certificationScore), best('certificationScore'))}
${rows('Risque fournisseur', s => riskBadge(s.riskLevel))}
${rows('Score global (/100)', s => String(s.overallScore), s => s.product.id === recommendation.recommended.product.id)}
</table>

<div class="reco">
<h3>✅ Recommandation : ${recommendation.headline}</h3>
${recommendation.justification.map(p => `<p>${p}</p>`).join('')}
</div>

<div class="note"><strong>Note pour la direction :</strong> ${recommendation.buyerNote}</div>

<h2>2. Preuves de certification vérifiées (opposables)</h2>
<table>
<tr><th>Produit</th><th>Certifications vérifiées auprès des organismes émetteurs</th></tr>
${scorecards.map(s => `<tr><td class="crit">${s.product.name}</td><td style="text-align:left">${certsList(s.product.id)}</td></tr>`).join('')}
</table>

<h2>3. Facteurs de risque détaillés</h2>
<table>
<tr><th>Produit</th><th>Niveau</th><th>Facteurs identifiés</th></tr>
${scorecards.map(s => `<tr><td class="crit">${s.product.name}</td><td>${riskBadge(s.riskLevel)}</td><td style="text-align:left"><ul>${s.riskFactors.map(f => `<li>${f}</li>`).join('')}</ul></td></tr>`).join('')}
</table>

<p class="meta" style="margin-top:20px">Méthodologie : scores calculés par le moteur EthiMarket à partir des données produit et des allégations du Trust Center
(statuts calculés à partir de preuves — jamais déclarés par les fournisseurs). Pondération : responsabilité 28%, traçabilité 27%,
certifications 25%, prix 20%, malus de risque. Détail public : ethimarket.vercel.app/trust-center</p>

<div class="sign">
  <div>Responsable achats — date & signature</div>
  <div>Direction — date & signature</div>
</div>
</body></html>`;
}
