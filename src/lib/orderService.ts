// =============================================================
// EthiMarket — Service de commandes B2B
//
// Circuit sans paiement en ligne (adapté au B2B international) :
//   devis accepté → commande « new » + bon de commande PDF
//   → processing (producteur confirme, conditions verrouillées)
//   → shipped    (n° de suivi) → delivered (acheteur confirme)
//   (+ cancelled avant expédition, disputed après)
//
// Les transitions sont garanties par le trigger SQL
// enforce_order_transitions ; ce service en est le miroir UI.
// Zéro coût : pas de PSP, le règlement se fait par virement
// (mention portée sur le bon de commande).
// =============================================================

import { supabase } from './supabase';
import type { QuoteRequest } from './quoteService';

export type B2BOrderStatus =
  | 'new' | 'processing' | 'shipped' | 'delivered'
  | 'disputed' | 'cancelled' | 'refunded';

export type PaymentStatus = 'unpaid' | 'invoiced' | 'paid' | 'refunded';

export interface B2BOrder {
  id: string;
  order_number: string;
  quote_id?: string | null;
  buyer_id: string | null;
  producer_id: string | null;
  product_id: string | null;
  product_name: string | null;
  quantity: number;
  unit: string;
  unit_price: number;
  currency: string;
  total_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: B2BOrderStatus;
  shipping_method: string | null;
  shipping_cost: number;
  delivery_country: string | null;
  expected_delivery_days: string | null;
  tracking_number: string | null;
  notes: string | null;
  payment_method?: 'bank_transfer' | 'stripe';
  payment_status?: PaymentStatus;
  payment_reference?: string | null;
  paid_at?: string | null;
  confirmed_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  cancel_reason?: string | null;
  created_at: string;
  updated_at: string;
  // jointures
  products?: { slug: string; emoji: string | null; image_url?: string | null } | null;
  producers?: { name: string; slug: string; country: string | null; country_flag: string | null; user_id?: string | null } | null;
}

export const ORDER_STATUS_META: Record<B2BOrderStatus, { labelKey: string; emoji: string; cls: string }> = {
  new:        { labelKey: 'ord.stNew',        emoji: '🆕', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  processing: { labelKey: 'ord.stProcessing', emoji: '📦', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  shipped:    { labelKey: 'ord.stShipped',    emoji: '🚚', cls: 'bg-violet-100 text-violet-800 border-violet-200' },
  delivered:  { labelKey: 'ord.stDelivered',  emoji: '✅', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  disputed:   { labelKey: 'ord.stDisputed',   emoji: '⚠️', cls: 'bg-red-100 text-red-700 border-red-200' },
  cancelled:  { labelKey: 'ord.stCancelled',  emoji: '🚫', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  refunded:   { labelKey: 'ord.stRefunded',   emoji: '↩️', cls: 'bg-orange-100 text-orange-700 border-orange-200' },
};

/** Commission plateforme (5 % — alignée sur calculations.ts commissionRate). */
export const PLATFORM_COMMISSION_RATE = 0.05;

/**
 * Paiement en ligne Stripe actif sur la plateforme.
 * Les Edge Functions stripe-checkout/stripe-webhook sont déployées
 * et les secrets posés (mode test Stripe : cartes 4242…).
 * Le virement reste toujours proposé en parallèle.
 */
export const ONLINE_PAYMENT_ENABLED = true;

export const PAYMENT_STATUS_META: Record<PaymentStatus, { labelKey: string; emoji: string; cls: string }> = {
  unpaid:   { labelKey: 'pay.unpaid',   emoji: '⏳', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  invoiced: { labelKey: 'pay.invoiced', emoji: '🧾', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  paid:     { labelKey: 'pay.paid',     emoji: '💶', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  refunded: { labelKey: 'pay.refunded', emoji: '↩️', cls: 'bg-orange-100 text-orange-700 border-orange-200' },
};

/** Producteur : marque le virement reçu (référence facultative). */
export async function markOrderPaid(orderId: string, reference?: string): Promise<string | null> {
  const { error } = await supabase.from('orders').update({
    payment_status: 'paid',
    payment_reference: reference?.trim() || null,
  }).eq('id', orderId).in('payment_status', ['unpaid', 'invoiced']);
  return error?.message ?? null;
}

/** Producteur : indique que la facture a été émise. */
export async function markOrderInvoiced(orderId: string): Promise<string | null> {
  const { error } = await supabase.from('orders').update({ payment_status: 'invoiced' })
    .eq('id', orderId).eq('payment_status', 'unpaid');
  return error?.message ?? null;
}

// -------------------- Fonctions PURES (testables) --------------------

/**
 * Calcule les montants d'une commande à partir d'un devis accepté.
 * Le prix retenu est OBLIGATOIREMENT le prix de l'offre du producteur
 * (quoted_unit_price) — jamais le prix catalogue au moment T.
 */
export function computeOrderAmounts(quote: Pick<QuoteRequest,
  'quantity' | 'quoted_unit_price' | 'unit_price_at_request'>): {
  unitPrice: number; totalAmount: number; commissionAmount: number;
} {
  const unitPrice = quote.quoted_unit_price ?? quote.unit_price_at_request ?? 0;
  const totalAmount = Math.round(unitPrice * quote.quantity * 100) / 100;
  const commissionAmount = Math.round(totalAmount * PLATFORM_COMMISSION_RATE * 100) / 100;
  return { unitPrice, totalAmount, commissionAmount };
}

/** Un devis est convertible en commande ssi accepté + prix d'offre présent. */
export function isQuoteConvertible(quote: Pick<QuoteRequest, 'status' | 'quoted_unit_price' | 'unit_price_at_request'>): boolean {
  return quote.status === 'accepted' && (quote.quoted_unit_price ?? quote.unit_price_at_request ?? 0) > 0;
}

/** Transitions autorisées pour l'UI (miroir du trigger SQL). */
export function allowedOrderTransitions(status: B2BOrderStatus, role: 'buyer' | 'producer'): B2BOrderStatus[] {
  if (role === 'producer') {
    if (status === 'new')        return ['processing', 'cancelled'];
    if (status === 'processing') return ['shipped', 'cancelled'];
    return [];
  }
  // buyer
  if (status === 'new')       return ['cancelled'];
  if (status === 'shipped')   return ['delivered', 'disputed'];
  if (status === 'delivered') return ['disputed'];
  return [];
}

export interface OrderStats {
  total: number;
  inProgress: number;      // new + processing + shipped
  awaitingAction: number;  // producteur : new ; acheteur : shipped (à réceptionner)
  delivered: number;
  totalDeliveredValue: number;
  totalPipelineValue: number; // valeur des commandes non terminées
}

export function computeOrderStats(orders: B2BOrder[], role: 'buyer' | 'producer'): OrderStats {
  const by = (...s: B2BOrderStatus[]) => orders.filter(o => s.includes(o.status));
  const delivered = by('delivered');
  const inProgress = by('new', 'processing', 'shipped');
  return {
    total: orders.length,
    inProgress: inProgress.length,
    awaitingAction: role === 'producer' ? by('new').length : by('shipped').length,
    delivered: delivered.length,
    totalDeliveredValue: Math.round(delivered.reduce((s, o) => s + o.total_amount, 0) * 100) / 100,
    totalPipelineValue: Math.round(inProgress.reduce((s, o) => s + o.total_amount, 0) * 100) / 100,
  };
}

// -------------------- Création depuis un devis accepté --------------------

export async function createOrderFromQuote(quote: QuoteRequest, buyerId: string): Promise<{
  orderId: string | null; orderNumber: string | null; error: string | null;
}> {
  if (!isQuoteConvertible(quote)) {
    return { orderId: null, orderNumber: null, error: 'Ce devis ne peut pas être converti en commande (non accepté ou sans prix).' };
  }
  const { unitPrice, totalAmount, commissionAmount } = computeOrderAmounts(quote);
  const { data, error } = await supabase.from('orders').insert({
    quote_id: quote.id,
    buyer_id: buyerId,
    producer_id: quote.producer_id,
    product_id: quote.product_id ?? null,
    product_name: quote.product_name,
    quantity: quote.quantity,
    unit: quote.unit,
    unit_price: unitPrice,
    currency: quote.currency || 'EUR',
    total_amount: totalAmount,
    commission_rate: PLATFORM_COMMISSION_RATE,
    commission_amount: commissionAmount,
    escrow_amount: 0,
    status: 'new',
    delivery_country: quote.delivery_country ?? null,
    expected_delivery_days: quote.quoted_delivery_days ?? null,
    notes: quote.producer_message ?? null,
  }).select('id, order_number').maybeSingle();

  if (error) {
    // Index unique : un devis = une commande
    if (error.message.includes('idx_orders_unique_quote') || error.code === '23505') {
      return { orderId: null, orderNumber: null, error: 'Une commande existe déjà pour ce devis.' };
    }
    return { orderId: null, orderNumber: null, error: error.message };
  }
  return {
    orderId: (data as { id?: string } | null)?.id ?? null,
    orderNumber: (data as { order_number?: string } | null)?.order_number ?? null,
    error: null,
  };
}

// -------------------- Lecture --------------------

const ORDER_SELECT = '*, products(slug, emoji, image_url), producers(name, slug, country, country_flag, user_id)';

export async function getBuyerOrders(buyerId: string): Promise<B2BOrder[]> {
  const { data } = await supabase.from('orders').select(ORDER_SELECT)
    .eq('buyer_id', buyerId).order('created_at', { ascending: false });
  return (data ?? []) as B2BOrder[];
}

export async function getProducerOrders(producerId: string): Promise<B2BOrder[]> {
  const { data } = await supabase.from('orders').select(ORDER_SELECT)
    .eq('producer_id', producerId).order('created_at', { ascending: false });
  return (data ?? []) as B2BOrder[];
}

/** Retrouve la commande éventuellement déjà créée pour un devis. */
export async function getOrderForQuote(quoteId: string): Promise<B2BOrder | null> {
  const { data } = await supabase.from('orders').select('id, order_number, status, quote_id')
    .eq('quote_id', quoteId).maybeSingle();
  return (data as B2BOrder | null) ?? null;
}

// -------------------- Transitions --------------------

/** Producteur : confirme la commande (verrouille les conditions). */
export async function confirmOrder(orderId: string): Promise<string | null> {
  const { error } = await supabase.from('orders').update({ status: 'processing' })
    .eq('id', orderId).eq('status', 'new');
  return error?.message ?? null;
}

/** Producteur : expédie (n° de suivi + transporteur facultatifs). */
export async function shipOrder(orderId: string, input: { trackingNumber?: string; shippingMethod?: string }): Promise<string | null> {
  const { error } = await supabase.from('orders').update({
    status: 'shipped',
    tracking_number: input.trackingNumber?.trim() || null,
    shipping_method: input.shippingMethod?.trim() || null,
  }).eq('id', orderId).eq('status', 'processing');
  return error?.message ?? null;
}

/** Acheteur : confirme la réception. */
export async function markDelivered(orderId: string): Promise<string | null> {
  const { error } = await supabase.from('orders').update({ status: 'delivered' })
    .eq('id', orderId).eq('status', 'shipped');
  return error?.message ?? null;
}

/** Acheteur ou producteur : annule (uniquement avant expédition). */
export async function cancelOrder(orderId: string, reason: string): Promise<string | null> {
  const { error } = await supabase.from('orders').update({
    status: 'cancelled',
    cancel_reason: reason.trim() || 'Annulée',
  }).eq('id', orderId).in('status', ['new', 'processing']);
  return error?.message ?? null;
}

/** Acheteur : ouvre un litige (après expédition ou livraison). */
export async function disputeOrder(orderId: string, reason: string): Promise<string | null> {
  const { error } = await supabase.from('orders').update({
    status: 'disputed',
    notes: reason.trim() || null,
  }).eq('id', orderId).in('status', ['shipped', 'delivered']);
  return error?.message ?? null;
}
