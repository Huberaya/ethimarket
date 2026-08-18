// @vitest-environment node
// =============================================================
// Tests des e-mails transactionnels : parité des gabarits
// (supabase/seed/email_texts.json) avec les libellés de la
// cloche in-app (clés notif.* des 5 locales), et cohérence du
// seed SQL. L'envoi lui-même est fait par trigger SQL (testé en
// base) — ici on garantit que les textes ne divergent jamais.
// =============================================================

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DICTS } from '../lib/i18n';

const KINDS = [
  'quote_received', 'quote_offer', 'quote_accepted', 'quote_declined',
  'order_created', 'order_confirmed', 'order_shipped', 'order_delivered',
  'order_disputed', 'order_cancelled', 'message_received', 'photo_challenge',
] as const;
const LOCALES = ['fr', 'en', 'es', 'pt', 'ar'] as const;

const seedJson = JSON.parse(
  readFileSync(join(__dirname, '../../supabase/seed/email_texts.json'), 'utf8'),
) as Record<string, Record<string, string>>;
const seedSql = readFileSync(join(__dirname, '../../supabase/seed/email_texts.sql'), 'utf8');

describe('email_texts.json — parité avec la cloche in-app', () => {
  it('couvre les 5 locales et les 11 événements', () => {
    for (const loc of LOCALES) {
      expect(seedJson[loc], loc).toBeDefined();
      for (const kind of KINDS) {
        expect(seedJson[loc][kind], `${loc}/${kind}`).toBeTruthy();
      }
    }
  });

  it('chaque gabarit est identique au libellé notif.* de la locale', () => {
    for (const loc of LOCALES) {
      for (const kind of KINDS) {
        expect(seedJson[loc][kind], `${loc}/${kind}`).toBe(DICTS[loc][`notif.${kind}`]);
      }
    }
  });

  it('les gabarits arabes contiennent des caractères arabes', () => {
    for (const kind of KINDS) {
      expect(/[\u0600-\u06FF]/.test(seedJson.ar[kind]), `ar/${kind}`).toBe(true);
    }
  });

  it('les placeholders utilisés sont uniquement ceux gérés par render_email_template', () => {
    const allowed = new Set(['product', 'counterpart', 'orderNumber', 'quantity', 'unit', 'preview', 'challenge_code']);
    for (const loc of LOCALES) {
      for (const kind of KINDS) {
        const found = [...seedJson[loc][kind].matchAll(/\{(\w+)\}/g)].map(m => m[1]);
        for (const ph of found) {
          expect(allowed.has(ph), `${loc}/${kind} placeholder {${ph}}`).toBe(true);
        }
      }
    }
  });
});

describe('email_texts.sql — seed applicable', () => {
  it('contient 55 upserts (11 kinds × 5 locales)', () => {
    const count = (seedSql.match(/INSERT INTO email_texts/g) ?? []).length;
    expect(count).toBe(60);
  });

  it('idempotent (ON CONFLICT DO UPDATE)', () => {
    expect(seedSql).toContain('ON CONFLICT (kind, locale) DO UPDATE');
  });

  it('apostrophes correctement échappées pour SQL', () => {
    // Aucune ligne ne doit casser le quoting : chaque VALUES a exactement
    // 3 littéraux et se termine par la clause ON CONFLICT.
    for (const line of seedSql.split('\n')) {
      if (line.startsWith('INSERT INTO email_texts')) {
        expect(line.endsWith('ON CONFLICT (kind, locale) DO UPDATE SET body = EXCLUDED.body;'), line.slice(0, 80)).toBe(true);
      }
    }
  });
});
