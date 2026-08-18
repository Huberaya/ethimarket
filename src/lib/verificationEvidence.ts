// =============================================================
// EthiMarket — Vérification à preuves
//
// La checklist d'audit n'est plus déclarative : chaque critère
// exige au moins une preuve structurée (méthode + référence +
// constat + auteur + horodatage) avec verdict « pass » avant
// d'être cochable. Les preuves sont immuables en base (pas
// d'UPDATE/DELETE : on ajoute un contre-examen, on n'efface pas).
//
// + Défis photo géolocalisés : un code imprévisible que le
// producteur doit photographier sur site sous 72h — une photo
// fraîche avec un code secret ne peut pas être volée sur le web.
// =============================================================

import { supabase } from './supabase';
import type { VerificationChecklistState } from '../components/admin/VerificationChecklist';

export type EvidenceCriterion = keyof VerificationChecklistState;

export type EvidenceType =
  | 'registry_lookup' | 'issuer_confirmation' | 'video_call'
  | 'selfie_id_match' | 'phone_verification' | 'photo_challenge'
  | 'exif_analysis' | 'satellite_check' | 'reverse_image_search'
  | 'peer_attestation' | 'document_review' | 'other';

export type EvidenceOutcome = 'pass' | 'fail' | 'inconclusive';

export interface VerificationEvidence {
  id: string;
  producer_id: string;
  criterion: EvidenceCriterion;
  evidence_type: EvidenceType;
  reference: string | null;
  note: string;
  outcome: EvidenceOutcome;
  checked_by: string;
  created_at: string;
}

export interface PhotoChallenge {
  id: string;
  producer_id: string;
  challenge_code: string;
  instructions: string;
  expires_at: string;
  status: 'pending' | 'submitted' | 'passed' | 'failed' | 'expired';
  photo_url: string | null;
  submitted_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_at: string;
}

/** Libellés des méthodes de preuve (admin = FR volontairement). */
export const EVIDENCE_TYPE_META: Record<EvidenceType, { label: string; emoji: string; hint: string }> = {
  registry_lookup:      { label: 'Registre public consulté', emoji: '🏛️', hint: 'Ecocert/inputs.bio, FLOCERT Customer Search, USDA Organic Integrity, RCCM/OHADA… Collez l\'URL exacte de la fiche consultée.' },
  issuer_confirmation:  { label: 'Confirmation de l\'émetteur', emoji: '📧', hint: 'Réponse écrite de l\'organisme certificateur (e-mail via les templates de la plateforme, ou courrier).' },
  video_call:           { label: 'Appel vidéo en direct', emoji: '📹', hint: 'Pièce montrée en direct, visite d\'exploitation, questions métier. Notez la date, la durée et les points contrôlés.' },
  selfie_id_match:      { label: 'Selfie avec pièce d\'identité', emoji: '🤳', hint: 'Correspondance visage/pièce contrôlée. Référencez le document comparé.' },
  phone_verification:   { label: 'Vérification téléphonique', emoji: '📞', hint: 'Numéro appelé et confirmé, indicatif cohérent avec le pays déclaré.' },
  photo_challenge:      { label: 'Défi photo géolocalisé réussi', emoji: '📸', hint: 'Le producteur a photographié le code du défi sur site dans le délai. Référencez le défi.' },
  exif_analysis:        { label: 'Analyse EXIF des photos', emoji: '🔬', hint: 'Horodatage, GPS et appareil cohérents avec les déclarations. Notez les champs contrôlés.' },
  satellite_check:      { label: 'Contrôle satellite du GPS', emoji: '🛰️', hint: 'Parcelle vérifiée sur Sentinel/Google Earth : zone agricole, végétation cohérente avec la culture déclarée.' },
  reverse_image_search: { label: 'Recherche d\'image inversée', emoji: '🔎', hint: 'Photos passées dans Google Lens/Images : aucune correspondance suspecte sur le web.' },
  peer_attestation:     { label: 'Parrainage / référence', emoji: '🤝', hint: 'Attestation d\'un producteur vérifié de la même filière ou référence d\'un acheteur existant, contactée et confirmée.' },
  document_review:      { label: 'Examen approfondi du document', emoji: '📄', hint: 'Cachets, numéros, cohérence interne, signes de retouche. Décrivez ce qui a été contrôlé.' },
  other:                { label: 'Autre méthode', emoji: '🧩', hint: 'Décrivez précisément la méthode employée.' },
};

/** Méthodes RECOMMANDÉES par critère (guidage de l'auditeur). */
export const RECOMMENDED_EVIDENCE: Record<EvidenceCriterion, EvidenceType[]> = {
  identityVerified:              ['selfie_id_match', 'video_call', 'document_review', 'phone_verification'],
  businessDocsCompliant:         ['registry_lookup', 'document_review', 'issuer_confirmation'],
  certificationValid:            ['registry_lookup', 'issuer_confirmation'],
  farmPhotosCoherent:            ['photo_challenge', 'exif_analysis', 'satellite_check', 'reverse_image_search', 'video_call'],
  ethicalEngagementSatisfactory: ['video_call', 'peer_attestation', 'document_review'],
  charterSigned:                 ['document_review'],
};

/** Registres publics de référence, proposés en un clic à l'auditeur. */
export const PUBLIC_REGISTRIES: { label: string; url: string; scope: string }[] = [
  { label: 'Ecocert — annuaire clients', url: 'https://www.ecocert.com/en/business-directory', scope: 'Bio UE / Ecocert' },
  { label: 'Ecocert — intrants (inputs.bio)', url: 'https://ap.ecocert.com/intrants', scope: 'Intrants agriculture bio' },
  { label: 'FLOCERT Customer Search', url: 'https://www.flocert.net/about-flocert/customer-search/', scope: 'Fairtrade' },
  { label: 'USDA Organic Integrity Database', url: 'https://organic.ams.usda.gov/integrity/', scope: 'Bio USA (NOP)' },
  { label: 'Rainforest Alliance — certificate search', url: 'https://www.rainforest-alliance.org/business/certification/', scope: 'Rainforest Alliance' },
  { label: 'RCCM / OHADA (16 pays d\'Afrique)', url: 'https://rccm.ohada.org', scope: 'Registre du commerce' },
];

// -------------------- Fonctions PURES (testables) --------------------

export const CRITERIA_KEYS: EvidenceCriterion[] = [
  'identityVerified', 'businessDocsCompliant', 'certificationValid',
  'farmPhotosCoherent', 'ethicalEngagementSatisfactory', 'charterSigned',
];

/**
 * Un critère est "prouvé" ssi il possède au moins une preuve 'pass'
 * ET aucune preuve 'fail' postérieure au dernier 'pass' (un échec
 * découvert après coup invalide le critère jusqu'à contre-preuve).
 */
export function isCriterionProven(evidences: VerificationEvidence[], criterion: EvidenceCriterion): boolean {
  const list = evidences
    .filter(e => e.criterion === criterion)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
  const lastPass = [...list].reverse().find(e => e.outcome === 'pass');
  if (!lastPass) return false;
  const failAfter = list.some(e => e.outcome === 'fail' && e.created_at > lastPass.created_at);
  return !failAfter;
}

/** Checklist dérivée des preuves — la seule source de vérité. */
export function checklistFromEvidences(evidences: VerificationEvidence[]): VerificationChecklistState {
  return {
    identityVerified: isCriterionProven(evidences, 'identityVerified'),
    businessDocsCompliant: isCriterionProven(evidences, 'businessDocsCompliant'),
    certificationValid: isCriterionProven(evidences, 'certificationValid'),
    farmPhotosCoherent: isCriterionProven(evidences, 'farmPhotosCoherent'),
    ethicalEngagementSatisfactory: isCriterionProven(evidences, 'ethicalEngagementSatisfactory'),
    charterSigned: isCriterionProven(evidences, 'charterSigned'),
  };
}

/** Tous les critères prouvés ? (condition d'approbation) */
export function allCriteriaProven(evidences: VerificationEvidence[]): boolean {
  return CRITERIA_KEYS.every(c => isCriterionProven(evidences, c));
}

/**
 * Niveau de confiance gradué, aligné sur les badges plateforme :
 *  - bronze : documents + identité + certification prouvés à la source
 *  - silver : + preuve de terrain (photo-défi / EXIF / satellite / vidéo)
 *  - gold   : + triangulation humaine (parrainage / référence / confirmation émetteur)
 */
export function trustLevel(evidences: VerificationEvidence[]): 'none' | 'bronze' | 'silver' | 'gold' {
  if (!allCriteriaProven(evidences)) return 'none';
  const passTypes = new Set(evidences.filter(e => e.outcome === 'pass').map(e => e.evidence_type));
  const fieldProof = ['photo_challenge', 'exif_analysis', 'satellite_check', 'video_call']
    .some(t => passTypes.has(t as EvidenceType));
  const humanProof = ['peer_attestation', 'issuer_confirmation']
    .some(t => passTypes.has(t as EvidenceType));
  if (fieldProof && humanProof) return 'gold';
  if (fieldProof) return 'silver';
  return 'bronze';
}

/** Génère un code de défi imprévisible et lisible (EM-XXXX). */
export function generateChallengeCode(rand: () => number = Math.random): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sans I/L/O/0/1 ambigus
  let code = '';
  for (let i = 0; i < 4; i++) code += alphabet[Math.floor(rand() * alphabet.length)];
  return `EM-${code}`;
}

/** Un défi est expiré ? (fonction pure, date injectable) */
export function isChallengeExpired(challenge: Pick<PhotoChallenge, 'expires_at' | 'status'>, now: Date = new Date()): boolean {
  return challenge.status === 'pending' && new Date(challenge.expires_at) < now;
}

// -------------------- Accès données --------------------

export async function getEvidences(producerId: string): Promise<VerificationEvidence[]> {
  const { data } = await supabase
    .from('verification_evidences')
    .select('*')
    .eq('producer_id', producerId)
    .order('created_at', { ascending: true });
  return (data ?? []) as VerificationEvidence[];
}

export async function addEvidence(input: {
  producerId: string;
  criterion: EvidenceCriterion;
  evidenceType: EvidenceType;
  reference?: string;
  note: string;
  outcome: EvidenceOutcome;
}): Promise<string | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return 'Non authentifié';
  const { error } = await supabase.from('verification_evidences').insert({
    producer_id: input.producerId,
    criterion: input.criterion,
    evidence_type: input.evidenceType,
    reference: input.reference?.trim() || null,
    note: input.note.trim(),
    outcome: input.outcome,
    checked_by: userData.user.id,
  });
  return error?.message ?? null;
}

export async function getPhotoChallenges(producerId: string): Promise<PhotoChallenge[]> {
  const { data } = await supabase
    .from('photo_challenges')
    .select('*')
    .eq('producer_id', producerId)
    .order('created_at', { ascending: false });
  return (data ?? []) as PhotoChallenge[];
}

export async function createPhotoChallenge(producerId: string, instructions: string, hoursValid = 72): Promise<string | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return 'Non authentifié';
  const { error } = await supabase.from('photo_challenges').insert({
    producer_id: producerId,
    challenge_code: generateChallengeCode(),
    instructions: instructions.trim(),
    expires_at: new Date(Date.now() + hoursValid * 3600 * 1000).toISOString(),
    created_by: userData.user.id,
  });
  return error?.message ?? null;
}

/** Producteur : soumet sa photo pour le défi. */
export async function submitChallengePhoto(challengeId: string, photoUrl: string): Promise<string | null> {
  const { error } = await supabase.from('photo_challenges').update({
    status: 'submitted',
    photo_url: photoUrl,
    submitted_at: new Date().toISOString(),
  }).eq('id', challengeId).eq('status', 'pending');
  return error?.message ?? null;
}

/** Admin : juge un défi soumis. En cas de succès, une preuve est créée automatiquement. */
export async function reviewPhotoChallenge(challenge: PhotoChallenge, passed: boolean, note: string): Promise<string | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return 'Non authentifié';
  const { error } = await supabase.from('photo_challenges').update({
    status: passed ? 'passed' : 'failed',
    reviewed_by: userData.user.id,
    reviewed_at: new Date().toISOString(),
    review_note: note.trim() || null,
  }).eq('id', challenge.id).eq('status', 'submitted');
  if (error) return error.message;

  if (passed) {
    return addEvidence({
      producerId: challenge.producer_id,
      criterion: 'farmPhotosCoherent',
      evidenceType: 'photo_challenge',
      reference: `Défi ${challenge.challenge_code} (${challenge.id.slice(0, 8)})`,
      note: note.trim() || `Défi photo ${challenge.challenge_code} réussi dans le délai imparti.`,
      outcome: 'pass',
    });
  }
  return null;
}
