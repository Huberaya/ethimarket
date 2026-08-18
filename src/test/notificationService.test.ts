// @vitest-environment node
// =============================================================
// Tests des notifications in-app (fonctions pures uniquement —
// la création est garantie par triggers SQL, testés en base).
// =============================================================

import { describe, it, expect } from 'vitest';
import {
  notificationLabelKey, notificationVars, splitByRecency, countUnread,
  NOTIFICATION_EMOJI, type UserNotification, type NotificationKind,
} from '../lib/notificationService';
import { DICTS, translate } from '../lib/i18n';

const N = (over: Partial<UserNotification>): UserNotification => ({
  id: over.id ?? Math.random().toString(36).slice(2),
  user_id: 'u1',
  kind: 'quote_received',
  payload: {},
  link: null,
  read_at: null,
  created_at: '2026-08-17T10:00:00Z',
  ...over,
});

const ALL_KINDS: NotificationKind[] = [
  'quote_received', 'quote_offer', 'quote_accepted', 'quote_declined',
  'order_created', 'order_confirmed', 'order_shipped', 'order_delivered',
  'order_disputed', 'order_cancelled', 'message_received', 'photo_challenge',
];

describe('notificationLabelKey / emojis', () => {
  it('chaque kind a un emoji et une clé notif.*', () => {
    for (const k of ALL_KINDS) {
      expect(NOTIFICATION_EMOJI[k]).toBeTruthy();
      expect(notificationLabelKey(k)).toBe(`notif.${k}`);
    }
  });

  it('chaque clé notif.* existe dans les 5 dictionnaires de langue', () => {
    for (const locale of ['fr', 'en', 'es', 'pt', 'ar'] as const) {
      for (const k of ALL_KINDS) {
        const key = `notif.${k}`;
        expect(DICTS[locale][key], `${locale}/${key}`).toBeTruthy();
      }
    }
  });

  it('le rendu interpole les variables du payload', () => {
    const n = N({
      kind: 'order_created',
      payload: { product_name: 'Café Yirgacheffe', order_number: 'PO-2026-0001', counterpart_name: 'Diambo Resto' },
    });
    const vars = notificationVars(n);
    const fr = translate('fr', notificationLabelKey(n.kind), vars);
    expect(fr).toContain('PO-2026-0001');
    expect(fr).toContain('Diambo Resto');
    expect(fr).toContain('Café Yirgacheffe');
    const ar = translate('ar', notificationLabelKey(n.kind), vars);
    expect(ar).toContain('PO-2026-0001');
    expect(/[\u0600-\u06FF]/.test(ar)).toBe(true);
  });
});

describe('notificationVars — robustesse', () => {
  it('payload vide → valeurs sûres, jamais undefined', () => {
    const vars = notificationVars(N({ payload: {} }));
    expect(vars.product).toBe('');
    expect(vars.counterpart).toBe('—');
    expect(vars.orderNumber).toBe('');
  });
  it('valeurs numériques converties en chaînes', () => {
    const vars = notificationVars(N({ payload: { quantity: 50, unit: 'kg' } }));
    expect(vars.quantity).toBe('50');
    expect(vars.unit).toBe('kg');
  });
});

describe('splitByRecency / countUnread', () => {
  const now = new Date('2026-08-17T15:00:00Z');
  it('sépare aujourd\'hui / plus ancien', () => {
    const list = [
      N({ id: 'a', created_at: '2026-08-17T09:00:00Z' }),
      N({ id: 'b', created_at: '2026-08-16T23:00:00Z' }),
      N({ id: 'c', created_at: '2026-08-01T10:00:00Z' }),
    ];
    const { today, earlier } = splitByRecency(list, now);
    expect(today.map(n => n.id)).toEqual(['a']);
    expect(earlier.map(n => n.id)).toEqual(['b', 'c']);
  });
  it('compte uniquement les non-lues', () => {
    const list = [
      N({ read_at: null }),
      N({ read_at: '2026-08-17T11:00:00Z' }),
      N({ read_at: null }),
    ];
    expect(countUnread(list)).toBe(2);
  });
  it('listes vides → zéros, pas d\'erreur', () => {
    const { today, earlier } = splitByRecency([], now);
    expect(today).toEqual([]);
    expect(earlier).toEqual([]);
    expect(countUnread([])).toBe(0);
  });
});
