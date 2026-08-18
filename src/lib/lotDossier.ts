// =============================================================
// EthiMarket — Dossier documentaire par lot + réception
// structurée (couche 3 du Product Trust Pipeline)
//
// À la confirmation d'une commande (new → processing), le trigger
// SQL seed_order_lot_documents crée le paquet documentaire exigé
// pour CE lot (n° lot toujours ; COI bio, phyto, certificat
// sanitaire, COA selon produit × origine × listes UE 2019/1793).
// L'expédition (processing → shipped) est verrouillée par le
// trigger enforce_lot_dossier_gate tant que le paquet est
// incomplet — même pattern que les transitions de commandes.
//
// La réception structurée remplace le simple « confirmer la
// réception » : 4 contrôles guidés dont les échecs ouvrent
// automatiquement un incident (trigger open_incident_on_bad_reception).
// =============================================================

import { supabase } from './supabase';

export type LotDocKey =
  | 'lot_number' | 'phyto_certificate' | 'coi_reference'
  | 'sanitary_certificate' | 'coa_lot' | 'official_certificate';

export interface LotDocument {
  id: string;
  order_id: string;
  requirement_key: LotDocKey;
  required: boolean;
  status: 'missing' | 'provided';
  value_text: string | null;
  file_url: string | null;
  updated_at: string;
}

export interface LotDocMeta {
  key: LotDocKey;
  /** Libellés FR — passés dans tx() par l'UI. */
  label: string;
  help: string;
  input: 'text' | 'file' | 'text_or_file';
  placeholder?: string;
}

export const LOT_DOC_META: Record<LotDocKey, LotDocMeta> = {
  lot_number: {
    key: 'lot_number', input: 'text', placeholder: 'Ex : LOT-2026-014',
    label: 'Numéro de lot expédié',
    help: 'Le numéro de lot exact qui part chez l\'acheteur — la clé de toute la traçabilité.',
  },
  phyto_certificate: {
    key: 'phyto_certificate', input: 'text_or_file', placeholder: 'N° du certificat phytosanitaire',
    label: 'Certificat phytosanitaire (ONPV)',
    help: 'Délivré par le service phytosanitaire de votre pays après inspection du lot. Obligatoire pour les végétaux entrant dans l\'UE (règl. 2016/2031).',
  },
  coi_reference: {
    key: 'coi_reference', input: 'text', placeholder: 'Ex : COI.2026.0012345',
    label: 'Référence COI bio (TRACES)',
    help: 'Le certificat d\'inspection bio émis dans TRACES par votre certificateur AVANT le départ. Sans COI, le lot entre dans l\'UE mais PAS en bio (règl. 2018/848).',
  },
  sanitary_certificate: {
    key: 'sanitary_certificate', input: 'text_or_file', placeholder: 'N° du certificat sanitaire',
    label: 'Certificat sanitaire (produit animal)',
    help: 'Produit d\'origine animale (miel…) : certificat sanitaire officiel + entrée par un poste de contrôle frontalier avec préavis CHED-P.',
  },
  coa_lot: {
    key: 'coa_lot', input: 'file',
    label: 'Certificat d\'analyse (COA) du lot',
    help: 'Votre filière est sur les listes de contrôles renforcés UE (règl. 2019/1793) : un rapport d\'analyse de CE lot évite le rejet à la frontière.',
  },
  official_certificate: {
    key: 'official_certificate', input: 'text_or_file', placeholder: 'N° du certificat officiel',
    label: 'Certificat officiel (annexe II UE)',
    help: 'Votre couple produit × pays est à l\'annexe II du règl. 2019/1793 : chaque lot doit voyager avec un certificat officiel de votre autorité compétente attestant les résultats d\'analyses.',
  },
};

/** Ordre d'affichage stable. */
export const LOT_DOC_ORDER: LotDocKey[] = [
  'lot_number', 'phyto_certificate', 'coi_reference',
  'sanitary_certificate', 'coa_lot', 'official_certificate',
];

/** Le paquet est-il complet (toutes les lignes required fournies) ? Fonction PURE. */
export function isDossierComplete(docs: Pick<LotDocument, 'required' | 'status'>[]): boolean {
  return docs.filter(d => d.required).every(d => d.status === 'provided');
}

/** Compte les documents fournis / requis. Fonction PURE. */
export function dossierProgress(docs: Pick<LotDocument, 'required' | 'status'>[]): { done: number; total: number } {
  const req = docs.filter(d => d.required);
  return { done: req.filter(d => d.status === 'provided').length, total: req.length };
}

/** Message d'erreur SQL LOT_DOSSIER_INCOMPLETE:a,b → liste de clés. */
export function parseLotDossierError(message: string): LotDocKey[] | null {
  const m = message.match(/LOT_DOSSIER_INCOMPLETE:([a-z_,]+)/);
  if (!m) return null;
  return m[1].split(',').filter(Boolean) as LotDocKey[];
}

export async function getLotDocuments(orderId: string): Promise<LotDocument[]> {
  const { data } = await supabase.from('order_lot_documents')
    .select('*').eq('order_id', orderId);
  const docs = (data ?? []) as LotDocument[];
  return docs.sort((a, b) => LOT_DOC_ORDER.indexOf(a.requirement_key) - LOT_DOC_ORDER.indexOf(b.requirement_key));
}

/** Producteur : fournit un document du lot (texte et/ou fichier). */
export async function provideLotDocument(
  docId: string,
  input: { valueText?: string; fileUrl?: string },
): Promise<string | null> {
  const value = input.valueText?.trim() || null;
  const file = input.fileUrl || null;
  if (!value && !file) return 'Renseignez une référence ou joignez un fichier.';
  const { error } = await supabase.from('order_lot_documents').update({
    value_text: value,
    file_url: file,
    status: 'provided',
  }).eq('id', docId);
  return error?.message ?? null;
}

// -------------------- Réception structurée --------------------

export interface ReceptionChecks {
  quantity_ok: boolean;
  packaging_ok: boolean;
  aspect_ok: boolean;
  labeling_ok: boolean;
  comment?: string;
}

/** La réception est-elle entièrement conforme ? Fonction PURE. */
export function isReceptionClean(r: Pick<ReceptionChecks, 'quantity_ok' | 'packaging_ok' | 'aspect_ok' | 'labeling_ok'>): boolean {
  return r.quantity_ok && r.packaging_ok && r.aspect_ok && r.labeling_ok;
}

/**
 * Acheteur : enregistre le constat de réception (immuable) puis
 * confirme la livraison. Un constat non conforme ouvre
 * automatiquement un incident côté base (trigger).
 */
export async function submitReception(
  orderId: string,
  buyerId: string,
  checks: ReceptionChecks,
): Promise<string | null> {
  const { error } = await supabase.from('order_receptions').insert({
    order_id: orderId,
    buyer_id: buyerId,
    quantity_ok: checks.quantity_ok,
    packaging_ok: checks.packaging_ok,
    aspect_ok: checks.aspect_ok,
    labeling_ok: checks.labeling_ok,
    comment: checks.comment?.trim() || null,
  });
  if (error && !error.message.includes('duplicate key')) return error.message;
  // Transition : shipped → delivered (le constat existe, la commande se clôt)
  const { error: e2 } = await supabase.from('orders').update({ status: 'delivered' })
    .eq('id', orderId).eq('status', 'shipped');
  return e2?.message ?? null;
}

export async function getReception(orderId: string): Promise<(ReceptionChecks & { created_at: string }) | null> {
  const { data } = await supabase.from('order_receptions')
    .select('quantity_ok, packaging_ok, aspect_ok, labeling_ok, comment, created_at')
    .eq('order_id', orderId).maybeSingle();
  return (data as (ReceptionChecks & { created_at: string }) | null) ?? null;
}
