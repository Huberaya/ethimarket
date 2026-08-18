// =============================================================
// EthiMarket — Notifications in-app
//
// Les notifications sont créées par des triggers SQL (jamais par
// le client). Ce service les lit, les marque lues, s'abonne au
// Realtime, et rend les libellés dans la langue de l'utilisateur
// (la base ne stocke que kind + payload, jamais de texte).
// =============================================================

import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type NotificationKind =
  | 'quote_received' | 'quote_offer' | 'quote_accepted' | 'quote_declined'
  | 'order_created' | 'order_confirmed' | 'order_shipped' | 'order_delivered'
  | 'order_disputed' | 'order_cancelled'
  | 'message_received'
  | 'photo_challenge';

export interface UserNotification {
  id: string;
  user_id: string;
  kind: NotificationKind;
  payload: Record<string, string | number | null>;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

/** Émoji par type — indépendant de la langue. */
export const NOTIFICATION_EMOJI: Record<NotificationKind, string> = {
  quote_received: '📤',
  quote_offer: '📩',
  quote_accepted: '✅',
  quote_declined: '❌',
  order_created: '🛒',
  order_confirmed: '📦',
  order_shipped: '🚚',
  order_delivered: '🤝',
  order_disputed: '⚠️',
  order_cancelled: '🚫',
  message_received: '💬',
  photo_challenge: '📸',
};

/**
 * Clé i18n du libellé (t(key, vars)) — les variables viennent du payload.
 * Fonction PURE : testable sans Supabase.
 */
export function notificationLabelKey(kind: NotificationKind): string {
  return `notif.${kind}`;
}

/** Variables d'interpolation extraites du payload (fonction pure). */
export function notificationVars(n: UserNotification): Record<string, string> {
  const p = n.payload ?? {};
  const s = (v: unknown) => (v === null || v === undefined ? '' : String(v));
  return {
    product: s(p.product_name),
    counterpart: s(p.counterpart_name) || '—',
    orderNumber: s(p.order_number),
    quantity: s(p.quantity),
    unit: s(p.unit),
    preview: s(p.preview),
    challenge_code: s(p.challenge_code),
  };
}

/** Groupage pour l'affichage : aujourd'hui / plus ancien (fonction pure). */
export function splitByRecency(list: UserNotification[], now: Date = new Date()): {
  today: UserNotification[]; earlier: UserNotification[];
} {
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
  const today: UserNotification[] = [];
  const earlier: UserNotification[] = [];
  for (const n of list) (new Date(n.created_at) >= startOfDay ? today : earlier).push(n);
  return { today, earlier };
}

export function countUnread(list: UserNotification[]): number {
  return list.filter(n => !n.read_at).length;
}

// -------------------- Lecture / écriture --------------------

export async function getNotifications(userId: string, limit = 30): Promise<UserNotification[]> {
  const { data } = await supabase
    .from('user_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as UserNotification[];
}

export async function markNotificationRead(id: string): Promise<void> {
  await supabase.from('user_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id).is('read_at', null);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await supabase.from('user_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId).is('read_at', null);
}

/**
 * Abonnement Realtime aux nouvelles notifications de l'utilisateur.
 * Retourne la fonction de désabonnement.
 */
export function subscribeToNotifications(
  userId: string,
  onNew: (n: UserNotification) => void,
): () => void {
  const channel: RealtimeChannel = supabase
    .channel(`notif_${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'user_notifications',
      filter: `user_id=eq.${userId}`,
    }, payload => {
      onNew(payload.new as UserNotification);
    })
    .subscribe();
  return () => { void supabase.removeChannel(channel); };
}
