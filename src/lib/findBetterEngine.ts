// =============================================================
// EthiMarket — Bouton « Trouver mieux » ✨
//
// Depuis n'importe quel produit, l'IA locale cherche automatiquement
// des alternatives supérieures sur 7 dimensions :
//   moins cher · plus responsable · plus local · mieux certifié ·
//   mieux traçable · moins risqué · plus disponible
// Et revient avec : « 3 alternatives supérieures trouvées. »
// Zéro API payante : moteur déterministe basé sur les scorecards.
// =============================================================

import { Product } from './supabase';
import { supabase } from './supabase';
import { computeScorecards, fetchTrustSnapshots, ProductScorecard, RiskLevel } from './procurementComparator';

export type BetterDimension =
  | 'cheaper' | 'more_responsible' | 'more_local' | 'better_certified'
  | 'better_traced' | 'less_risky' | 'more_available';

export const DIMENSION_LABELS: Record<BetterDimension, { emoji: string; label: string }> = {
  cheaper: { emoji: '💶', label: 'Moins cher' },
  more_responsible: { emoji: '🌱', label: 'Plus responsable' },
  more_local: { emoji: '📍', label: 'Plus local' },
  better_certified: { emoji: '🏷️', label: 'Mieux certifié' },
  better_traced: { emoji: '🔗', label: 'Mieux traçable' },
  less_risky: { emoji: '🛡️', label: 'Moins risqué' },
  more_available: { emoji: '📦', label: 'Plus disponible' },
};

export interface BetterAlternative {
  product: Product;
  scorecard: ProductScorecard;
  /** Dimensions sur lesquelles l'alternative BAT la référence */
  winningDimensions: BetterDimension[];
  /** Dimensions où elle est moins bonne (transparence) */
  losingDimensions: BetterDimension[];
  summary: string;
}

export interface FindBetterResult {
  reference: Product;
  referenceCard: ProductScorecard;
  alternatives: BetterAlternative[];
  verdict: string;               // « 3 alternatives supérieures trouvées. »
  scannedCount: number;
}

const RISK_ORDER: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2 };

/** L'Europe pour la dimension « plus local » (marché cible EthiMarket). */
const EUROPEAN_COUNTRIES = new Set([
  'france', 'allemagne', 'belgique', 'pays-bas', 'italie', 'espagne', 'portugal',
  'grèce', 'grece', 'pologne', 'roumanie', 'royaume-uni', 'autriche', 'suisse',
  'suède', 'suede', 'danemark', 'finlande', 'irlande', 'bulgarie', 'croatie', 'hongrie',
]);

function isEuropean(country?: string | null): boolean {
  return country ? EUROPEAN_COUNTRIES.has(country.toLowerCase().trim()) : false;
}

/**
 * Compare une alternative à la référence sur les 7 dimensions.
 * (fonction PURE, testable)
 */
export function compareDimensions(
  ref: ProductScorecard,
  cand: ProductScorecard,
): { winning: BetterDimension[]; losing: BetterDimension[] } {
  const winning: BetterDimension[] = [];
  const losing: BetterDimension[] = [];
  const check = (dim: BetterDimension, better: boolean, worse: boolean) => {
    if (better) winning.push(dim);
    else if (worse) losing.push(dim);
  };

  check('cheaper', cand.product.price < ref.product.price, cand.product.price > ref.product.price);
  check('more_responsible', cand.responsibilityScore > ref.responsibilityScore + 3, cand.responsibilityScore < ref.responsibilityScore - 3);
  check('more_local',
    isEuropean(cand.product.manufacturing_country ?? cand.product.country) && !isEuropean(ref.product.manufacturing_country ?? ref.product.country),
    !isEuropean(cand.product.manufacturing_country ?? cand.product.country) && isEuropean(ref.product.manufacturing_country ?? ref.product.country));
  check('better_certified', cand.certificationScore > ref.certificationScore + 3, cand.certificationScore < ref.certificationScore - 3);
  check('better_traced', cand.traceabilityScore > ref.traceabilityScore + 3, cand.traceabilityScore < ref.traceabilityScore - 3);
  check('less_risky', RISK_ORDER[cand.riskLevel] < RISK_ORDER[ref.riskLevel], RISK_ORDER[cand.riskLevel] > RISK_ORDER[ref.riskLevel]);
  check('more_available',
    (cand.product.stock_value ?? 0) > 0 && (ref.product.stock_value ?? 0) <= 0,
    (cand.product.stock_value ?? 0) <= 0 && (ref.product.stock_value ?? 0) > 0);

  return { winning, losing };
}

/**
 * Cœur du moteur (fonction PURE).
 * Une alternative est « supérieure » si elle gagne sur ≥ 2 dimensions
 * ET n'est pas plus risquée ET son score global est ≥ référence - 5.
 */
export function findBetter(
  reference: Product,
  _catalog: Product[],
  cards: ProductScorecard[],
  maxResults = 3,
): FindBetterResult {
  const refCard = cards.find(c => c.product.id === reference.id);
  if (!refCard) {
    return {
      reference, referenceCard: cards[0],
      alternatives: [], verdict: 'Analyse impossible pour ce produit.', scannedCount: 0,
    };
  }

  const family = cards.filter(c => {
    if (c.product.id === reference.id) return false;
    if (reference.product_type && c.product.product_type) {
      return c.product.product_type.toLowerCase() === reference.product_type.toLowerCase();
    }
    return c.product.category_id != null && c.product.category_id === reference.category_id;
  });

  const alternatives: BetterAlternative[] = [];
  for (const cand of family) {
    const { winning, losing } = compareDimensions(refCard, cand);
    const notRiskier = RISK_ORDER[cand.riskLevel] <= RISK_ORDER[refCard.riskLevel];
    const globallyClose = cand.overallScore >= refCard.overallScore - 5;
    if (winning.length >= 2 && notRiskier && globallyClose) {
      const dims = winning.slice(0, 3).map(d => DIMENSION_LABELS[d].label.toLowerCase()).join(', ');
      alternatives.push({
        product: cand.product,
        scorecard: cand,
        winningDimensions: winning,
        losingDimensions: losing,
        summary: `${cand.product.name} : ${dims}${winning.length > 3 ? '…' : ''} (score global ${cand.overallScore}/100${cand.overallScore > refCard.overallScore ? `, +${cand.overallScore - refCard.overallScore} pts` : ''}).`,
      });
    }
  }

  // Tri : le plus de dimensions gagnées, puis le meilleur score global
  alternatives.sort((a, b) =>
    b.winningDimensions.length - a.winningDimensions.length ||
    b.scorecard.overallScore - a.scorecard.overallScore);

  const top = alternatives.slice(0, maxResults);
  const verdict = top.length === 0
    ? 'Aucune alternative supérieure trouvée : ce produit est déjà le meilleur choix de sa catégorie.'
    : `${top.length} alternative${top.length > 1 ? 's' : ''} supérieure${top.length > 1 ? 's' : ''} trouvée${top.length > 1 ? 's' : ''}.`;

  return { reference, referenceCard: refCard, alternatives: top, verdict, scannedCount: family.length };
}

/** Version connectée : charge le catalogue + les preuves Trust Center et exécute. */
export async function runFindBetter(reference: Product): Promise<FindBetterResult> {
  const { data } = await supabase.from('products').select('*, producers(*)').eq('status', 'active').limit(150);
  const catalog = [((data ?? []) as Product[]).find(p => p.id === reference.id) ?? reference,
    ...((data ?? []) as Product[]).filter(p => p.id !== reference.id)];
  const trust = await fetchTrustSnapshots(catalog.map(p => p.id));
  const cards = computeScorecards(catalog, trust);
  return findBetter(reference, catalog, cards);
}
