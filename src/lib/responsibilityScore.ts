// =============================================================
// EthiMarket — Responsibility Score décomposé & explicable
//
// LA réponse à la question de l'acheteur :
// « Est-ce que je peux acheter ce produit en toute confiance ? »
//
// 6 critères notés 0-100, chacun EXPLICABLE (détail des points),
// plus des "Points d'attention" générés automatiquement
// (certificat qui expire, traçabilité incomplète, déclarations
// non prouvées…). Moteur 100% local et déterministe.
// =============================================================

import { Product } from './supabase';
import { supabase } from './supabase';

export interface CriterionScore {
  key: 'environment' | 'social' | 'traceability' | 'certifications' | 'logistics' | 'supplier';
  emoji: string;
  label: string;
  score: number;               // 0-100
  /** Chaque ligne explique des points gagnés ou perdus */
  details: { label: string; points: number }[];
}

export interface AttentionPoint {
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

export interface ResponsibilityReport {
  productId: string;
  overallScore: number;        // moyenne pondérée
  criteria: CriterionScore[];
  attentionPoints: AttentionPoint[];
  computedAt: string;
}

interface ClaimInfo {
  claim_label: string;
  verification_status: string;
  valid_until?: string;
  issuing_body?: string;
  reference_number?: string;
}

const CRITERIA_WEIGHTS: Record<CriterionScore['key'], number> = {
  environment: 0.20, social: 0.20, traceability: 0.20,
  certifications: 0.20, logistics: 0.10, supplier: 0.10,
};

const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
const DAY_MS = 24 * 3600 * 1000;

export function formatDateFr(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/**
 * Calcule le rapport complet (fonction PURE — les claims sont injectées).
 */
export function computeResponsibilityReport(
  product: Product,
  claims: ClaimInfo[] = [],
  producerInfo?: { rating?: number; verified?: boolean; delivery_days_avg?: number | string | null },
  now: Date = new Date(),
): ResponsibilityReport {
  const criteria: CriterionScore[] = [];
  const attention: AttentionPoint[] = [];
  const verifiedClaims = claims.filter(c => c.verification_status === 'verified');
  const declaredClaims = claims.filter(c => c.verification_status === 'declared_only');
  const contradictedClaims = claims.filter(c => c.verification_status === 'contradicted');
  const expiredClaims = claims.filter(c => c.verification_status === 'expired');

  // ---------- 🌱 ENVIRONNEMENT ----------
  {
    const d: CriterionScore['details'] = [{ label: 'Base', points: 30 }];
    const co2 = product.carbon_footprint_kg;
    if (co2 !== undefined && co2 !== null) {
      if (co2 <= 1) d.push({ label: `Empreinte carbone très faible (${co2} kg CO2e)`, points: 30 });
      else if (co2 <= 2) d.push({ label: `Empreinte carbone faible (${co2} kg CO2e)`, points: 20 });
      else if (co2 <= 4) d.push({ label: `Empreinte carbone modérée (${co2} kg CO2e)`, points: 8 });
      else d.push({ label: `Empreinte carbone élevée (${co2} kg CO2e)`, points: -10 });
    } else {
      d.push({ label: 'Empreinte carbone non renseignée', points: 0 });
      attention.push({ severity: 'warning', message: "L'empreinte carbone n'est pas renseignée : impossible d'évaluer précisément l'impact climatique." });
    }
    if ((product.water_footprint_liters ?? 0) > 0 && (product.water_footprint_liters ?? 0) <= 150) d.push({ label: 'Consommation d\'eau maîtrisée', points: 10 });
    const pkg = product.packaging_types ?? [];
    if (pkg.includes('plastic_free')) d.push({ label: 'Emballage sans plastique', points: 10 });
    if (pkg.includes('compostable')) d.push({ label: 'Emballage compostable', points: 8 });
    if (pkg.includes('bulk')) d.push({ label: 'Vrac disponible', points: 5 });
    if (product.is_recycled && (product.recycled_percentage ?? 0) > 0) d.push({ label: `${product.recycled_percentage}% de matières recyclées`, points: 10 });
    if (product.farming_method && /bio|agrofor|agroéco|regener/i.test(product.farming_method)) d.push({ label: product.farming_method, points: 8 });
    criteria.push({ key: 'environment', emoji: '🌱', label: 'Environnement', score: clamp(d.reduce((s, x) => s + x.points, 0)), details: d });
  }

  // ---------- 👷 SOCIAL ----------
  {
    const d: CriterionScore['details'] = [{ label: 'Base', points: 20 }];
    if (product.fair_trade) d.push({ label: 'Commerce équitable', points: 22 });
    if (product.living_wage_guaranteed) d.push({ label: 'Salaire décent garanti', points: 22 });
    if (product.social_audit_passed) d.push({ label: 'Audit social réalisé', points: 18 });
    if (product.is_cooperative) d.push({ label: 'Production en coopérative', points: 10 });
    const socialVerified = verifiedClaims.filter(c => /équitable|salaire|social|enfant|coopérat/i.test(c.claim_label));
    if (socialVerified.length > 0) d.push({ label: `${socialVerified.length} engagement(s) social(aux) vérifié(s) par organisme`, points: 12 });
    if (!product.fair_trade && !product.living_wage_guaranteed && !product.social_audit_passed) {
      attention.push({ severity: 'warning', message: 'Aucune garantie sociale (équitable, salaire décent ou audit) sur ce produit.' });
    }
    criteria.push({ key: 'social', emoji: '👷', label: 'Social', score: clamp(d.reduce((s, x) => s + x.points, 0)), details: d });
  }

  // ---------- 🔗 TRAÇABILITÉ ----------
  {
    const d: CriterionScore['details'] = [{ label: 'Base', points: 10 }];
    if (product.batch_number) d.push({ label: `Numéro de lot (${product.batch_number})`, points: 18 });
    else attention.push({ severity: 'warning', message: 'Pas de numéro de lot : le produit ne peut pas être rappelé ou suivi précisément.' });
    if (product.gps_coordinates) d.push({ label: 'Coordonnées GPS du site de production', points: 15 });
    if (product.trace_qr_code) d.push({ label: 'QR code de traçabilité', points: 8 });
    if (product.manufacturing_country) d.push({ label: `Pays de fabrication documenté (${product.manufacturing_country})`, points: 14 });
    if (product.raw_materials_origin) d.push({ label: `Origine des matières premières (${product.raw_materials_origin})`, points: 14 });
    if (product.harvest_date || product.planting_date) d.push({ label: 'Dates de récolte/plantation', points: 10 });
    if (product.farming_method) d.push({ label: 'Méthode de production documentée', points: 6 });
    // Chaîne documentée jusqu'où ?
    const hasFarm = Boolean(product.gps_coordinates && (product.harvest_date || product.planting_date));
    const hasManuf = Boolean(product.manufacturing_country);
    if (hasManuf && !hasFarm) {
      attention.push({ severity: 'info', message: `L'origine est documentée jusqu'au fabricant mais pas jusqu'à la ferme (GPS ou dates de récolte manquants).` });
    }
    criteria.push({ key: 'traceability', emoji: '🔗', label: 'Traçabilité', score: clamp(d.reduce((s, x) => s + x.points, 0)), details: d });
  }

  // ---------- 🏷️ CERTIFICATIONS ----------
  {
    const d: CriterionScore['details'] = [{ label: 'Base', points: 15 }];
    const nbCerts = product.certifications?.length ?? 0;
    if (nbCerts > 0) d.push({ label: `${nbCerts} certification(s) déclarée(s)`, points: Math.min(24, nbCerts * 10) });
    if (verifiedClaims.length > 0) {
      d.push({ label: `${verifiedClaims.length} allégation(s) VÉRIFIÉE(S) auprès des organismes`, points: Math.min(45, 25 + (verifiedClaims.length - 1) * 10 ) });
      d.push({ label: 'Preuves indépendantes présentes (bonus confiance)', points: 12 });
    }
    if (contradictedClaims.length > 0) {
      d.push({ label: `${contradictedClaims.length} allégation(s) contredite(s)`, points: -30 });
      attention.push({ severity: 'critical', message: `${contradictedClaims.length} allégation(s) ont été contredites lors d'un contrôle indépendant.` });
    }
    if (expiredClaims.length > 0) {
      d.push({ label: `${expiredClaims.length} certification(s) expirée(s)`, points: -15 });
      attention.push({ severity: 'critical', message: `${expiredClaims.length} certification(s) de ce produit ont expiré et n'ont pas été renouvelées.` });
    }
    if (declaredClaims.length > 0 && verifiedClaims.length === 0) {
      attention.push({ severity: 'warning', message: `${declaredClaims.length} allégation(s) reposent uniquement sur la déclaration du fournisseur (aucune preuve indépendante).` });
    }
    // Expirations à venir (< 60 jours)
    for (const c of verifiedClaims) {
      if (!c.valid_until) continue;
      const end = new Date(c.valid_until).getTime();
      const days = Math.floor((end - now.getTime()) / DAY_MS);
      if (days >= 0 && days <= 60) {
        attention.push({ severity: 'warning', message: `La certification « ${c.claim_label} » expire dans ${days} jour${days > 1 ? 's' : ''} (le ${formatDateFr(c.valid_until)}).` });
      } else if (days > 60) {
        attention.push({ severity: 'info', message: `La certification « ${c.claim_label} » est valide jusqu'au ${formatDateFr(c.valid_until)}.` });
      }
    }
    criteria.push({ key: 'certifications', emoji: '🏷️', label: 'Certifications', score: clamp(d.reduce((s, x) => s + x.points, 0)), details: d });
  }

  // ---------- 🚚 LOGISTIQUE ----------
  {
    const d: CriterionScore['details'] = [{ label: 'Base', points: 35 }];
    const delivery = typeof product.delivery_days === 'string'
      ? parseInt(product.delivery_days, 10)
      : (product.delivery_days as unknown as number);
    if (!Number.isNaN(delivery) && delivery) {
      if (delivery <= 7) d.push({ label: `Délai court (${product.delivery_days} jours)`, points: 25 });
      else if (delivery <= 15) d.push({ label: `Délai raisonnable (${product.delivery_days} jours)`, points: 15 });
      else d.push({ label: `Délai long (${product.delivery_days} jours)`, points: 0 });
    }
    if ((product.stock_value ?? 0) > 0) d.push({ label: `En stock (${product.stock_value} ${product.stock_unit ?? ''})`, points: 25 });
    else {
      d.push({ label: 'Rupture de stock', points: -15 });
      attention.push({ severity: 'warning', message: 'Produit actuellement en rupture de stock.' });
    }
    if ((product.moq_value ?? 1) <= 50) d.push({ label: `MOQ accessible (${product.moq_value ?? 1})`, points: 15 });
    criteria.push({ key: 'logistics', emoji: '🚚', label: 'Logistique', score: clamp(d.reduce((s, x) => s + x.points, 0)), details: d });
  }

  // ---------- 🏭 FOURNISSEUR ----------
  {
    const d: CriterionScore['details'] = [{ label: 'Base', points: 30 }];
    if (producerInfo?.verified) d.push({ label: 'Fournisseur vérifié par EthiMarket', points: 25 });
    else attention.push({ severity: 'info', message: 'Le fournisseur n\'a pas encore finalisé sa vérification Bureau Veritas.' });
    const rating = producerInfo?.rating ?? product.rating ?? 0;
    if (rating >= 4.5) d.push({ label: `Excellente note acheteurs (${rating}/5)`, points: 25 });
    else if (rating >= 4) d.push({ label: `Bonne note acheteurs (${rating}/5)`, points: 15 });
    else if (rating > 0 && rating < 3.5) {
      d.push({ label: `Note acheteurs faible (${rating}/5)`, points: -10 });
      attention.push({ severity: 'warning', message: `La note acheteurs du fournisseur est faible (${rating}/5).` });
    }
    if ((product.confidence_score ?? 0) >= 80) d.push({ label: `Score de confiance plateforme élevé (${product.confidence_score}/100)`, points: 20 });
    else if ((product.confidence_score ?? 0) >= 60) d.push({ label: `Score de confiance correct (${product.confidence_score}/100)`, points: 10 });
    criteria.push({ key: 'supplier', emoji: '🏭', label: 'Fournisseur', score: clamp(d.reduce((s, x) => s + x.points, 0)), details: d });
  }

  const overall = clamp(criteria.reduce((s, c) => s + c.score * CRITERIA_WEIGHTS[c.key], 0));

  // Tri des points d'attention : critical > warning > info
  const order = { critical: 0, warning: 1, info: 2 };
  attention.sort((a, b) => order[a.severity] - order[b.severity]);

  return {
    productId: product.id,
    overallScore: overall,
    criteria,
    attentionPoints: attention,
    computedAt: now.toISOString(),
  };
}

/** Charge les claims du produit puis calcule le rapport. */
export async function getResponsibilityReport(product: Product): Promise<ResponsibilityReport> {
  let claims: ClaimInfo[] = [];
  try {
    const { data } = await supabase
      .from('product_claims')
      .select('claim_label, verification_status, claim_evidence(valid_until, reference_number, certification_bodies(name))')
      .eq('product_id', product.id);
    interface Row {
      claim_label: string; verification_status: string;
      claim_evidence?: { valid_until: string | null; reference_number: string | null; certification_bodies?: { name: string } | null }[] | null;
    }
    claims = ((data ?? []) as unknown as Row[]).map(r => ({
      claim_label: r.claim_label,
      verification_status: r.verification_status,
      valid_until: r.claim_evidence?.find(e => e.valid_until)?.valid_until ?? undefined,
      issuing_body: r.claim_evidence?.find(e => e.certification_bodies)?.certification_bodies?.name,
      reference_number: r.claim_evidence?.find(e => e.reference_number)?.reference_number ?? undefined,
    }));
  } catch { /* offline → rapport sans claims */ }

  return computeResponsibilityReport(product, claims, {
    rating: product.producers?.rating,
    verified: product.producers?.verified,
  });
}
