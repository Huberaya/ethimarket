// =============================================================
// EthiMarket Trust Center — Moteur d'évaluation (fonction pure)
//
// LE cœur du Trust Center. Dérive le statut public d'une allégation
// à partir de ses preuves. Aucune entrée fournisseur ne peut forcer
// un statut : seul ce moteur écrit verification_status.
//
// Règles (dans l'ordre de priorité) :
//   1. Une preuve REJETÉE (contrôle négatif) → contradicted (domine tout)
//   2. Une preuve niveau ≥4 CONFIRMÉE et VALIDE → verified
//   3. Une preuve niveau ≥4 confirmée mais EXPIRÉE → expired
//   4. Une preuve niveau ≥3 en cours de contrôle → pending_verification
//   5. Sinon (niveau ≤2 uniquement, ou rien) → declared_only
// =============================================================

import {
  ClaimEvidence, ClaimEvaluation, ClaimVerificationStatus,
  EVIDENCE_LEVEL, EVIDENCE_TYPE_LABELS, ProductClaim, ProductTrustSummary,
} from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

export function formatDateFr(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function isExpired(e: ClaimEvidence, now: Date): boolean {
  if (!e.valid_until) return false;
  const end = new Date(e.valid_until);
  if (Number.isNaN(end.getTime())) return false;
  // expiré si la date de fin est STRICTEMENT passée (valide jusqu'au soir du jour J)
  return end.getTime() + DAY_MS <= now.getTime();
}

function isNotYetValid(e: ClaimEvidence, now: Date): boolean {
  if (!e.valid_from) return false;
  const start = new Date(e.valid_from);
  if (Number.isNaN(start.getTime())) return false;
  return start.getTime() > now.getTime();
}

function level(e: ClaimEvidence): number {
  return EVIDENCE_LEVEL[e.evidence_type] ?? 0;
}

/** Message public standard pour une allégation non prouvée — texte EXACT demandé. */
export const DECLARED_ONLY_MESSAGE =
  'Déclaration fournisseur — preuve indépendante non trouvée.';

/**
 * Évalue une allégation. Fonction PURE : mêmes entrées → même sortie.
 * @param evidence preuves rattachées à l'allégation
 * @param now date d'évaluation (injectable pour les tests)
 */
export function evaluateClaim(
  evidence: ClaimEvidence[],
  now: Date = new Date(),
): ClaimEvaluation {
  const reasoning: string[] = [];

  if (!evidence || evidence.length === 0) {
    reasoning.push('Aucune preuve rattachée à cette allégation.');
    return {
      status: 'declared_only',
      publicExplanation: DECLARED_ONLY_MESSAGE,
      reasoning,
    };
  }

  // Tri par niveau décroissant, puis par date de contrôle la plus récente
  const sorted = [...evidence].sort((a, b) => {
    const dl = level(b) - level(a);
    if (dl !== 0) return dl;
    return (b.checked_at ?? '').localeCompare(a.checked_at ?? '');
  });

  // ---- RÈGLE 1 : contradiction domine tout ----
  const rejected = sorted.find(e => e.check_result === 'rejected');
  if (rejected) {
    reasoning.push(
      `Preuve rejetée : ${EVIDENCE_TYPE_LABELS[rejected.evidence_type]}` +
      (rejected.issuing_body_name ? ` (organisme : ${rejected.issuing_body_name})` : '') +
      (rejected.notes ? ` — ${rejected.notes}` : ''),
    );
    return {
      status: 'contradicted',
      decidingEvidence: rejected,
      publicExplanation:
        'Allégation contredite : une vérification indépendante n\'a pas confirmé cette information.' +
        (rejected.checked_at ? ` Contrôle du ${formatDateFr(rejected.checked_at)}.` : ''),
      reasoning,
    };
  }

  // ---- RÈGLE 2 : preuve forte confirmée et valide → verified ----
  const strongConfirmed = sorted.filter(
    e => level(e) >= 4 && e.check_result === 'confirmed',
  );
  const validStrong = strongConfirmed.find(e => !isExpired(e, now) && !isNotYetValid(e, now));
  if (validStrong) {
    reasoning.push(
      `Preuve indépendante valide : ${EVIDENCE_TYPE_LABELS[validStrong.evidence_type]} (niveau ${level(validStrong)}).`,
    );
    // Prochaine ré-évaluation = expiration la plus proche parmi les preuves décisives
    const expirations = strongConfirmed
      .filter(e => e.valid_until && !isExpired(e, now))
      .map(e => e.valid_until as string)
      .sort();
    return {
      status: 'verified',
      decidingEvidence: validStrong,
      publicExplanation:
        `Vérifié${validStrong.checked_at ? ` le ${formatDateFr(validStrong.checked_at)}` : ''}` +
        `${validStrong.checked_by_name ? ` par ${validStrong.checked_by_name}` : ' par EthiMarket'}` +
        `${validStrong.issuing_body_name ? ` auprès de ${validStrong.issuing_body_name}` : ''}.`,
      nextReviewAt: expirations[0],
      reasoning,
    };
  }

  // ---- RÈGLE 3 : preuve forte confirmée mais expirée → expired ----
  const expiredStrong = strongConfirmed.find(e => isExpired(e, now));
  if (expiredStrong) {
    reasoning.push(
      `La preuve la plus forte (${EVIDENCE_TYPE_LABELS[expiredStrong.evidence_type]}) a expiré le ${formatDateFr(expiredStrong.valid_until)}.`,
    );
    return {
      status: 'expired',
      decidingEvidence: expiredStrong,
      publicExplanation:
        `La certification qui appuyait cette allégation a expiré le ${formatDateFr(expiredStrong.valid_until)}. ` +
        'Elle n\'est plus considérée comme vérifiée tant qu\'un certificat renouvelé n\'a pas été contrôlé.',
      reasoning,
    };
  }

  // ---- RÈGLE 4 : preuve niveau ≥3 en cours de contrôle → pending ----
  const pending = sorted.find(
    e => level(e) >= 3 && (e.check_result === 'pending' || e.check_result === 'not_checked'),
  );
  if (pending) {
    reasoning.push(
      `Preuve en cours de contrôle : ${EVIDENCE_TYPE_LABELS[pending.evidence_type]} (niveau ${level(pending)}).`,
    );
    return {
      status: 'pending_verification',
      decidingEvidence: pending,
      publicExplanation:
        'Un document justificatif a été déposé. La vérification auprès de l\'organisme émetteur est en cours.',
      reasoning,
    };
  }

  // ---- RÈGLE 5 : rien de mieux que du déclaratif → declared_only ----
  reasoning.push(
    `Meilleure preuve disponible : ${EVIDENCE_TYPE_LABELS[sorted[0].evidence_type]} (niveau ${level(sorted[0])} ≤ 2).`,
  );
  return {
    status: 'declared_only',
    decidingEvidence: sorted[0],
    publicExplanation: DECLARED_ONLY_MESSAGE,
    reasoning,
  };
}

// =============================================================
// Agrégat produit
// =============================================================

/** Claims "majeures" : celles qui portent le positionnement éthique du produit. */
const MAJOR_CLAIM_TYPES = new Set([
  'organic_material', 'fair_trade', 'living_wage', 'social_conditions',
  'no_child_labor', 'recycled_content', 'carbon_footprint',
]);

export function summarizeProductTrust(
  productId: string,
  claims: ProductClaim[],
  now: Date = new Date(),
): ProductTrustSummary {
  const statuses = claims.map(c => evaluateClaim(c.evidence, now).status);
  const count = (s: ClaimVerificationStatus) => statuses.filter(x => x === s).length;

  const total = claims.length;
  const verified = count('verified');
  const contradicted = count('contradicted');

  // Ratio sur les claims majeures pour le badge global
  const majorClaims = claims.filter(c => MAJOR_CLAIM_TYPES.has(c.claim_type));
  const majorVerified = majorClaims.filter(
    c => evaluateClaim(c.evidence, now).status === 'verified',
  ).length;
  const majorRatio = majorClaims.length > 0 ? majorVerified / majorClaims.length : (total > 0 ? verified / total : 0);

  let overall: ProductTrustSummary['overall_badge'];
  if (total === 0) overall = 'no_claims';
  else if (contradicted > 0) overall = 'issues_found';
  else if (verified === 0) overall = 'declarations_only';
  else if (majorRatio >= 0.5) overall = 'verified_majority';
  else overall = 'partially_verified';

  return {
    product_id: productId,
    total_claims: total,
    verified_claims: verified,
    pending_claims: count('pending_verification'),
    declared_only_claims: count('declared_only'),
    expired_claims: count('expired'),
    contradicted_claims: contradicted,
    trust_ratio: total > 0 ? Number((verified / total).toFixed(2)) : 0,
    overall_badge: overall,
  };
}
