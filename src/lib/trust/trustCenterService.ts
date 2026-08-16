// =============================================================
// EthiMarket Trust Center — Service d'accès aux données
// Pont entre le module de certifications EXISTANT (producer_certifications,
// certification_bodies) et les nouvelles tables product_claims / claim_evidence.
// =============================================================

import { supabase } from '../supabase';
import {
  ProductClaim, ClaimEvidence, ClaimEvaluation, ProductTrustSummary,
  ClaimType, EvidenceType, EVIDENCE_LEVEL,
} from './types';
import { evaluateClaim, summarizeProductTrust } from './evaluateClaim';

// -------------------------------------------------------------
// Lecture publique
// -------------------------------------------------------------

/** Charge toutes les allégations d'un produit avec leurs preuves, statut recalculé. */
export async function getProductClaims(productId: string): Promise<{
  claims: (ProductClaim & { evaluation: ClaimEvaluation })[];
  summary: ProductTrustSummary;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('product_claims')
      .select(`
        *,
        claim_evidence (
          *,
          certification_bodies ( id, name ),
          producer_certifications ( id, status, certificate_number, expires_at, document_path )
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const now = new Date();
    interface ClaimRowDb {
      id: string; product_id: string; claim_type: string; claim_label: string;
      claim_value: string | null; declared_by: 'supplier' | 'platform';
      verification_status: ProductClaim['verification_status'];
      evaluated_at: string | null; next_review_at: string | null; created_at: string;
      claim_evidence: EvidenceRowDb[] | null;
    }
    const claims = ((data ?? []) as ClaimRowDb[]).map(row => {
      const evidence: ClaimEvidence[] = (row.claim_evidence ?? []).map(mapEvidenceRow);
      const claim: ProductClaim = {
        id: row.id,
        product_id: row.product_id,
        claim_type: row.claim_type as ClaimType,
        claim_label: row.claim_label,
        claim_value: row.claim_value ?? undefined,
        declared_by: row.declared_by,
        verification_status: row.verification_status,
        evaluated_at: row.evaluated_at ?? undefined,
        next_review_at: row.next_review_at ?? undefined,
        evidence,
        created_at: row.created_at,
      };
      // Le statut affiché est TOUJOURS recalculé au chargement —
      // jamais fait confiance à la valeur stockée seule.
      const evaluation = evaluateClaim(evidence, now);
      return { ...claim, verification_status: evaluation.status, evaluation };
    });

    const summary = summarizeProductTrust(productId, claims, now);
    return { claims, summary, error: null };
  } catch (err) {
    return {
      claims: [],
      summary: summarizeProductTrust(productId, []),
      error: err instanceof Error ? err.message : 'Erreur de chargement des allégations',
    };
  }
}

interface EvidenceRowDb {
  id: string;
  claim_id: string;
  evidence_type: EvidenceType;
  reference_number: string | null;
  issuing_body_id: string | null;
  source_url: string | null;
  document_path: string | null;
  valid_from: string | null;
  valid_until: string | null;
  check_result: ClaimEvidence['check_result'];
  checked_by: string | null;
  checked_by_name: string | null;
  checked_at: string | null;
  producer_certification_id: string | null;
  notes: string | null;
  created_at: string;
  certification_bodies?: { id: string; name: string } | null;
  producer_certifications?: {
    id: string; status: string; certificate_number: string | null;
    expires_at: string | null; document_path: string | null;
  } | null;
}

function mapEvidenceRow(row: EvidenceRowDb): ClaimEvidence {
  // Synchronisation avec le module de certifications existant :
  // si la preuve est liée à un producer_certification, son état actuel PRIME.
  let evidenceType = row.evidence_type;
  let checkResult = row.check_result;
  let validUntil = row.valid_until ?? undefined;
  let referenceNumber = row.reference_number ?? undefined;

  const pc = row.producer_certifications;
  if (pc) {
    referenceNumber = referenceNumber ?? pc.certificate_number ?? undefined;
    validUntil = validUntil ?? pc.expires_at ?? undefined;
    switch (pc.status) {
      case 'verified':
        evidenceType = 'certificate_verified';
        checkResult = 'confirmed';
        break;
      case 'rejected':
        checkResult = 'rejected';
        break;
      case 'expired':
        evidenceType = 'certificate_verified';
        checkResult = 'confirmed'; // l'expiration est gérée par valid_until dans le moteur
        break;
      case 'pending':
      case 'contact_sent':
      case 'manual_required':
        evidenceType = 'certificate_on_file';
        checkResult = 'pending';
        break;
      default: // unverified
        evidenceType = 'certificate_on_file';
        checkResult = 'not_checked';
    }
  }

  return {
    id: row.id,
    claim_id: row.claim_id,
    evidence_type: evidenceType,
    reference_number: referenceNumber,
    issuing_body_id: row.issuing_body_id ?? undefined,
    issuing_body_name: row.certification_bodies?.name ?? undefined,
    source_url: row.source_url ?? undefined,
    document_path: row.document_path ?? pc?.document_path ?? undefined,
    valid_from: row.valid_from ?? undefined,
    valid_until: validUntil,
    check_result: checkResult,
    checked_by: row.checked_by ?? undefined,
    checked_by_name: row.checked_by_name ?? undefined,
    checked_at: row.checked_at ?? undefined,
    producer_certification_id: row.producer_certification_id ?? undefined,
    notes: row.notes ?? undefined,
    created_at: row.created_at,
  };
}

// -------------------------------------------------------------
// Écriture (fournisseur : claims + preuves faibles uniquement)
// -------------------------------------------------------------

/** Un fournisseur déclare une allégation. Statut initial : declared_only, toujours. */
export async function declareClaim(input: {
  productId: string;
  claimType: ClaimType;
  claimLabel: string;
  claimValue?: string;
}): Promise<{ claimId: string | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('product_claims')
      .insert({
        product_id: input.productId,
        claim_type: input.claimType,
        claim_label: input.claimLabel,
        claim_value: input.claimValue ?? null,
        declared_by: 'supplier',
        // verification_status est forcé à 'declared_only' par trigger SQL
        // quel que soit ce qu'on envoie ici.
        verification_status: 'declared_only',
      })
      .select('id')
      .single();
    if (error) throw error;
    return { claimId: data.id, error: null };
  } catch (err) {
    return { claimId: null, error: err instanceof Error ? err.message : 'Erreur' };
  }
}

/** Un fournisseur attache une preuve (niveaux 1-2 uniquement — RLS bloque le reste). */
export async function attachSupplierEvidence(input: {
  claimId: string;
  evidenceType: Extract<EvidenceType, 'supplier_document' | 'supplier_declaration'>;
  documentPath?: string;
  sourceUrl?: string;
  notes?: string;
}): Promise<{ error: string | null }> {
  if (EVIDENCE_LEVEL[input.evidenceType] > 2) {
    return { error: 'Un fournisseur ne peut déposer que des preuves déclaratives (niveau ≤ 2).' };
  }
  const { error } = await supabase.from('claim_evidence').insert({
    claim_id: input.claimId,
    evidence_type: input.evidenceType,
    document_path: input.documentPath ?? null,
    source_url: input.sourceUrl ?? null,
    check_result: 'not_checked',
    notes: input.notes ?? null,
  });
  return { error: error?.message ?? null };
}

// -------------------------------------------------------------
// Écriture (admin : preuves fortes + liaison au module certifications)
// -------------------------------------------------------------

/**
 * Un admin lie une allégation à une certification producteur du module existant.
 * Le statut de la claim suivra automatiquement celui du certificat.
 */
export async function linkClaimToCertification(input: {
  claimId: string;
  producerCertificationId: string;
  issuingBodyId?: string;
  sourceUrl?: string;
  adminId: string;
  adminName: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from('claim_evidence').insert({
    claim_id: input.claimId,
    evidence_type: 'certificate_on_file', // sera promu par mapEvidenceRow selon le statut réel
    producer_certification_id: input.producerCertificationId,
    issuing_body_id: input.issuingBodyId ?? null,
    source_url: input.sourceUrl ?? null,
    check_result: 'pending',
    checked_by: input.adminId,
    checked_by_name: input.adminName,
    checked_at: new Date().toISOString(),
  });
  if (error) return { error: error.message };
  return refreshClaimStatus(input.claimId);
}

/** Un admin enregistre un contrôle documentaire EthiMarket (niveau 3). */
export async function recordPlatformCheck(input: {
  claimId: string;
  result: 'confirmed' | 'rejected';
  adminId: string;
  adminName: string;
  notes?: string;
  sourceUrl?: string;
  validUntil?: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from('claim_evidence').insert({
    claim_id: input.claimId,
    evidence_type: 'platform_check',
    check_result: input.result,
    checked_by: input.adminId,
    checked_by_name: input.adminName,
    checked_at: new Date().toISOString(),
    source_url: input.sourceUrl ?? null,
    valid_until: input.validUntil ?? null,
    notes: input.notes ?? null,
  });
  if (error) return { error: error.message };
  return refreshClaimStatus(input.claimId);
}

/**
 * Recalcule et persiste le statut d'une allégation (RPC côté serveur,
 * qui journalise aussi la transition dans claim_status_log).
 */
export async function refreshClaimStatus(claimId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.rpc('evaluate_claim_status', { p_claim_id: claimId });
  return { error: error?.message ?? null };
}

/** Ré-évalue toutes les claims arrivées à échéance (job quotidien / admin). */
export async function refreshDueClaims(): Promise<{ updated: number; error: string | null }> {
  const { data, error } = await supabase.rpc('evaluate_due_claims');
  return { updated: (data as number) ?? 0, error: error?.message ?? null };
}
