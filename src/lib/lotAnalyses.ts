// =============================================================
// EthiMarket — Service des analyses de laboratoire par lot
// (couche 4, Phase 2). Circuit et gardes : voir labDirectory.ts
// (moteur pur) et la migration lab_analyses (gardes SQL).
// =============================================================

import { supabase } from './supabase';
import type { AnalysisStatus } from './labDirectory';

export interface LotAnalysis {
  id: string;
  order_id: string | null;
  product_id: string | null;
  producer_id: string | null;
  requested_by: string;
  analysis_label: string;
  hazard: string | null;
  status: AnalysisStatus;
  lab_name: string | null;
  lab_country: string | null;
  report_number: string | null;
  report_url: string | null;
  admin_note: string | null;
  verified_at: string | null;
  created_at: string;
}

export async function getOrderAnalyses(orderId: string): Promise<LotAnalysis[]> {
  const { data } = await supabase.from('lot_analyses')
    .select('*').eq('order_id', orderId).order('created_at', { ascending: true });
  return (data ?? []) as LotAnalysis[];
}

export async function requestAnalysis(input: {
  orderId: string;
  productId: string | null;
  producerId: string | null;
  requestedBy: string;
  label: string;
  hazard?: string | null;
}): Promise<string | null> {
  const { error } = await supabase.from('lot_analyses').insert({
    order_id: input.orderId,
    product_id: input.productId,
    producer_id: input.producerId,
    requested_by: input.requestedBy,
    analysis_label: input.label,
    hazard: input.hazard ?? null,
  });
  return error?.message ?? null;
}

/** Producteur : l'échantillon est parti chez le labo choisi. */
export async function markSampleSent(id: string, labName: string, labCountry: string): Promise<string | null> {
  if (!labName.trim()) return 'Indiquez le laboratoire choisi.';
  const { error } = await supabase.from('lot_analyses').update({
    status: 'sample_sent', lab_name: labName.trim(), lab_country: labCountry.trim() || null,
  }).eq('id', id);
  return error?.message ?? null;
}

/** Producteur : le rapport (COA) est arrivé. */
export async function markReportReceived(id: string, reportNumber: string, reportUrl: string): Promise<string | null> {
  if (!reportNumber.trim() && !reportUrl) return 'Renseignez le n° de rapport ou joignez le fichier.';
  const { error } = await supabase.from('lot_analyses').update({
    status: 'report_received',
    report_number: reportNumber.trim() || null,
    report_url: reportUrl || null,
  }).eq('id', id);
  return error?.message ?? null;
}

/** Admin : verdict après vérification auprès du labo émetteur. */
export async function judgeAnalysis(id: string, verdict: 'verified' | 'rejected', adminNote: string): Promise<string | null> {
  const { error } = await supabase.from('lot_analyses').update({
    status: verdict, admin_note: adminNote.trim(),
  }).eq('id', id);
  return error?.message ?? null;
}

/** Traduction des erreurs SQL du garde en messages pédagogiques FR. */
export function explainAnalysisError(message: string): string {
  if (message.includes('ANALYSIS_FINAL_STATE')) return 'Cette analyse est déjà jugée : son état ne peut plus changer.';
  if (message.includes('ANALYSIS_VERDICT_ADMIN_ONLY')) return 'Seule l\'équipe EthiMarket peut valider ou rejeter un COA (après vérification auprès du labo).';
  if (message.includes('ANALYSIS_REPORT_REQUIRED_FIRST')) return 'Le rapport doit d\'abord être déclaré reçu avant tout verdict.';
  if (message.includes('ANALYSIS_NOTE_TOO_SHORT')) return 'Le constat de vérification est obligatoire (10 caractères minimum).';
  if (message.includes('ANALYSIS_REPORT_REF_REQUIRED')) return 'Renseignez le n° de rapport ou joignez le fichier du COA.';
  if (message.includes('ANALYSIS_ILLEGAL_TRANSITION')) return 'Étape non autorisée : le circuit est demande → échantillon → rapport → verdict.';
  return message;
}

/** Toutes les analyses en attente de vérification (vue admin). */
export async function getPendingAnalyses(): Promise<LotAnalysis[]> {
  const { data } = await supabase.from('lot_analyses')
    .select('*')
    .in('status', ['requested', 'sample_sent', 'report_received'])
    .order('created_at', { ascending: false });
  return (data ?? []) as LotAnalysis[];
}
