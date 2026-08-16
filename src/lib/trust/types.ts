// =============================================================
// EthiMarket Trust Center — Types
// Principe : chaque information a une source ; le statut est
// TOUJOURS calculé par la plateforme, jamais déclaré.
// =============================================================

/** Types d'allégations qu'un produit peut porter */
export type ClaimType =
  | 'organic_material'        // "Coton biologique"
  | 'fair_trade'              // "Commerce équitable"
  | 'living_wage'             // "Salaire décent"
  | 'social_conditions'       // "Conditions sociales contrôlées"
  | 'no_child_labor'          // "Sans travail des enfants"
  | 'vegan'                   // "100% vegan"
  | 'recycled_content'        // "70% recyclé"
  | 'carbon_footprint'        // "1,2 kg CO2e"
  | 'origin'                  // "Origine France"
  | 'manufacturing_location'  // "Fabriqué au Portugal"
  | 'raw_material_origin'     // "Coton d'Inde"
  | 'packaging'               // "Emballage sans plastique"
  | 'animal_welfare'          // "Bien-être animal"
  | 'water_usage'             // "Consommation d'eau réduite"
  | 'other';

/** Qui a déclaré l'allégation à l'origine */
export type DeclaredBy = 'supplier' | 'platform';

/**
 * Hiérarchie des preuves — le NIVEAU détermine ce qu'une preuve peut prouver.
 * Niveau 5 : certificat contrôlé auprès de l'organisme émetteur.
 * Niveau 4 : certificat déposé (vérification en cours) OU rapport d'audit indépendant.
 * Niveau 3 : contrôle documentaire réalisé par EthiMarket.
 * Niveau 2 : document fourni par le fournisseur, non contrôlé.
 * Niveau 1 : simple déclaration du fournisseur.
 */
export type EvidenceType =
  | 'certificate_verified'
  | 'certificate_on_file'
  | 'audit_report'
  | 'platform_check'
  | 'supplier_document'
  | 'supplier_declaration';

export const EVIDENCE_LEVEL: Record<EvidenceType, number> = {
  certificate_verified: 5,
  certificate_on_file: 4,
  audit_report: 4,
  platform_check: 3,
  supplier_document: 2,
  supplier_declaration: 1,
};

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  certificate_verified: 'Certificat vérifié auprès de l\'organisme',
  certificate_on_file: 'Certificat déposé — vérification en cours',
  audit_report: 'Rapport d\'audit indépendant',
  platform_check: 'Contrôle documentaire EthiMarket',
  supplier_document: 'Document fournisseur (non contrôlé)',
  supplier_declaration: 'Déclaration fournisseur',
};

/** Résultat d'un contrôle sur une preuve */
export type EvidenceCheckResult = 'confirmed' | 'pending' | 'not_checked' | 'rejected';

export interface ClaimEvidence {
  id: string;
  claim_id: string;
  evidence_type: EvidenceType;
  /** N° de certificat / référence du document */
  reference_number?: string;
  /** Organisme émetteur (FK certification_bodies) */
  issuing_body_id?: string;
  issuing_body_name?: string;
  /** Lien public vérifiable (registre de l'organisme, PDF officiel…) */
  source_url?: string;
  /** Chemin du document dans le storage EthiMarket */
  document_path?: string;
  valid_from?: string;   // ISO date
  valid_until?: string;  // ISO date
  check_result: EvidenceCheckResult;
  checked_by?: string;   // admin id
  checked_by_name?: string;
  checked_at?: string;   // ISO datetime
  /** Lien vers producer_certifications (module existant) */
  producer_certification_id?: string;
  notes?: string;
  created_at: string;
}

/**
 * Statut PUBLIC d'une allégation — TOUJOURS calculé par evaluateClaim(),
 * jamais écrit directement par un fournisseur.
 */
export type ClaimVerificationStatus =
  | 'verified'              // ✅ preuve indépendante valide
  | 'pending_verification'  // 🕓 preuve déposée, contrôle en cours
  | 'declared_only'         // ⚠️ déclaration fournisseur, aucune preuve indépendante
  | 'expired'               // ⌛ la preuve existait mais n'est plus valide
  | 'contradicted';         // ❌ preuve rejetée ou contrôle négatif

export interface ProductClaim {
  id: string;
  product_id: string;
  claim_type: ClaimType;
  /** Libellé affiché : "Coton biologique" */
  claim_label: string;
  /** Valeur précise éventuelle : "95% coton bio", "1,2 kg CO2e" */
  claim_value?: string;
  declared_by: DeclaredBy;
  verification_status: ClaimVerificationStatus;
  /** Date du dernier calcul du statut */
  evaluated_at?: string;
  /** Date de prochaine ré-évaluation (ex. : expiration du certificat) */
  next_review_at?: string;
  evidence: ClaimEvidence[];
  created_at: string;
}

/** Résultat du moteur d'évaluation */
export interface ClaimEvaluation {
  status: ClaimVerificationStatus;
  /** Preuve la plus forte ayant déterminé le statut */
  decidingEvidence?: ClaimEvidence;
  /** Explication en français, affichable telle quelle */
  publicExplanation: string;
  /** Prochaine date où le statut peut changer (expiration la plus proche) */
  nextReviewAt?: string;
  /** Trace du raisonnement (debug / journal d'audit) */
  reasoning: string[];
}

/** Agrégat de confiance d'un produit */
export interface ProductTrustSummary {
  product_id: string;
  total_claims: number;
  verified_claims: number;
  pending_claims: number;
  declared_only_claims: number;
  expired_claims: number;
  contradicted_claims: number;
  /** verified / total (0..1) — 0 si aucune claim */
  trust_ratio: number;
  /** Peut-on afficher un badge global "vérifié" ? (règle : ratio >= 0.5 et 0 contradiction) */
  overall_badge: 'verified_majority' | 'partially_verified' | 'declarations_only' | 'issues_found' | 'no_claims';
}

/** Entrée immuable du journal des changements de statut */
export interface ClaimStatusLogEntry {
  id: string;
  claim_id: string;
  previous_status: ClaimVerificationStatus | null;
  new_status: ClaimVerificationStatus;
  reason: string;
  triggered_by: 'evaluation_engine' | 'admin_action' | 'scheduled_review' | 'certificate_update';
  created_at: string;
}
