// =============================================================
// EthiMarket — Service de demandes de devis
// Cycle : sent → responded → accepted / declined
//         (+ cancelled acheteur, expired auto à la date de validité)
// =============================================================

import { supabase, Product, Producer } from './supabase';

export type QuoteStatus = 'sent' | 'responded' | 'accepted' | 'declined' | 'cancelled' | 'expired';

export interface QuoteRequest {
  id: string;
  buyer_id: string;
  producer_id: string;
  producer_user_id?: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price_at_request?: number | null;
  currency: string;
  buyer_message?: string;
  delivery_country?: string;
  needed_by?: string;
  status: QuoteStatus;
  quoted_unit_price?: number | null;
  quoted_delivery_days?: string;
  quoted_valid_until?: string;
  producer_message?: string;
  responded_at?: string;
  decided_at?: string;
  decline_reason?: string;
  created_at: string;
  // jointures
  products?: { slug: string; emoji: string | null } | null;
  producers?: { name: string; slug: string; country_flag: string | null } | null;
}

export const QUOTE_STATUS_META: Record<QuoteStatus, { label: string; emoji: string; cls: string }> = {
  sent: { label: 'Envoyée', emoji: '📤', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  responded: { label: 'Offre reçue', emoji: '📩', cls: 'bg-violet-100 text-violet-800 border-violet-200' },
  accepted: { label: 'Acceptée', emoji: '✅', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  declined: { label: 'Refusée', emoji: '❌', cls: 'bg-red-100 text-red-700 border-red-200' },
  cancelled: { label: 'Annulée', emoji: '🚫', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  expired: { label: 'Expirée', emoji: '⌛', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
};

// -------------------- Création (acheteur) --------------------

export async function createQuoteRequest(input: {
  buyerId: string;
  product: Product;
  producer?: Producer | null;
  quantity: number;
  unitPriceAtRequest?: number | null;   // prix du palier au moment T (null = sur devis)
  message?: string;
  deliveryCountry?: string;
  neededBy?: string;
}): Promise<{ quoteId: string | null; error: string | null }> {
  if (!input.product.producer_id) {
    return { quoteId: null, error: 'Ce produit n\'a pas de producteur associé.' };
  }
  const { data, error } = await supabase.from('quote_requests').insert({
    buyer_id: input.buyerId,
    producer_id: input.product.producer_id,
    producer_user_id: input.producer?.user_id ?? null,
    product_id: input.product.id,
    product_name: input.product.name,
    quantity: input.quantity,
    unit: input.product.price_unit || input.product.moq_unit || 'kg',
    unit_price_at_request: input.unitPriceAtRequest ?? null,
    currency: input.product.currency || 'EUR',
    buyer_message: input.message?.trim() || null,
    delivery_country: input.deliveryCountry || null,
    needed_by: input.neededBy || null,
  }).select('id').maybeSingle();
  if (error) return { quoteId: null, error: error.message };
  return { quoteId: data?.id ?? null, error: null };
}

// -------------------- Lecture --------------------

export async function getBuyerQuotes(buyerId: string): Promise<QuoteRequest[]> {
  const { data } = await supabase
    .from('quote_requests')
    .select('*, products(slug, emoji), producers(name, slug, country_flag)')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });
  return await autoExpire((data ?? []) as QuoteRequest[]);
}

export async function getProducerQuotes(producerUserId: string): Promise<QuoteRequest[]> {
  const { data } = await supabase
    .from('quote_requests')
    .select('*, products(slug, emoji), producers(name, slug, country_flag)')
    .eq('producer_user_id', producerUserId)
    .order('created_at', { ascending: false });
  return await autoExpire((data ?? []) as QuoteRequest[]);
}

/** Expire côté lecture les offres dont la validité est dépassée. */
async function autoExpire(quotes: QuoteRequest[]): Promise<QuoteRequest[]> {
  const today = new Date().toISOString().slice(0, 10);
  const toExpire = quotes.filter(q =>
    q.status === 'responded' && q.quoted_valid_until && q.quoted_valid_until < today);
  for (const q of toExpire) {
    await supabase.from('quote_requests').update({ status: 'expired' }).eq('id', q.id);
    q.status = 'expired';
  }
  return quotes;
}

// -------------------- Transitions --------------------

/** Producteur : répond avec son offre. */
export async function respondToQuote(quoteId: string, offer: {
  quotedUnitPrice: number;
  quotedDeliveryDays: string;
  quotedValidUntil: string;      // date ISO
  message?: string;
}): Promise<string | null> {
  const { error } = await supabase.from('quote_requests').update({
    status: 'responded',
    quoted_unit_price: offer.quotedUnitPrice,
    quoted_delivery_days: offer.quotedDeliveryDays,
    quoted_valid_until: offer.quotedValidUntil,
    producer_message: offer.message?.trim() || null,
  }).eq('id', quoteId).eq('status', 'sent');
  return error?.message ?? null;
}

/** Producteur : décline la demande. */
export async function declineQuoteAsProducer(quoteId: string, reason?: string): Promise<string | null> {
  const { error } = await supabase.from('quote_requests').update({
    status: 'declined',
    decline_reason: reason?.trim() || 'Déclinée par le producteur',
  }).eq('id', quoteId).eq('status', 'sent');
  return error?.message ?? null;
}

/** Acheteur : accepte l'offre reçue. */
export async function acceptQuote(quoteId: string): Promise<string | null> {
  const { error } = await supabase.from('quote_requests').update({ status: 'accepted' })
    .eq('id', quoteId).eq('status', 'responded');
  return error?.message ?? null;
}

/** Acheteur : refuse l'offre reçue. */
export async function declineQuoteAsBuyer(quoteId: string, reason?: string): Promise<string | null> {
  const { error } = await supabase.from('quote_requests').update({
    status: 'declined',
    decline_reason: reason?.trim() || 'Offre refusée par l\'acheteur',
  }).eq('id', quoteId).eq('status', 'responded');
  return error?.message ?? null;
}

/** Acheteur : annule sa demande (avant ou après réponse). */
export async function cancelQuote(quoteId: string): Promise<string | null> {
  const { error } = await supabase.from('quote_requests').update({ status: 'cancelled' })
    .eq('id', quoteId).in('status', ['sent', 'responded']);
  return error?.message ?? null;
}

// -------------------- Statistiques (fonctions pures, testables) --------------------

export interface QuoteStats {
  total: number;
  awaitingResponse: number;    // sent (côté producteur : à traiter)
  offersToDecide: number;      // responded (côté acheteur : à décider)
  accepted: number;
  acceptanceRatePct: number;   // accepted / (accepted + declined)
  totalAcceptedValue: number;  // Σ quantité × prix accepté
}

export function computeQuoteStats(quotes: QuoteRequest[]): QuoteStats {
  const byStatus = (s: QuoteStatus) => quotes.filter(q => q.status === s);
  const accepted = byStatus('accepted');
  const declined = byStatus('declined');
  const decidedCount = accepted.length + declined.length;
  return {
    total: quotes.length,
    awaitingResponse: byStatus('sent').length,
    offersToDecide: byStatus('responded').length,
    accepted: accepted.length,
    acceptanceRatePct: decidedCount > 0 ? Math.round((accepted.length / decidedCount) * 100) : 0,
    totalAcceptedValue: Math.round(accepted.reduce(
      (sum, q) => sum + (q.quoted_unit_price ?? q.unit_price_at_request ?? 0) * q.quantity, 0) * 100) / 100,
  };
}

/** Transitions autorisées pour l'UI (miroir du trigger SQL). */
export function allowedTransitions(status: QuoteStatus, role: 'buyer' | 'producer'): QuoteStatus[] {
  if (role === 'producer') {
    if (status === 'sent') return ['responded', 'declined'];
    return [];
  }
  // buyer
  if (status === 'sent') return ['cancelled'];
  if (status === 'responded') return ['accepted', 'declined', 'cancelled'];
  return [];
}
