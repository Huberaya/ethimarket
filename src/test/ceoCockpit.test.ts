// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { computeActions, phase1Progress, PHASE1_TARGETS, type CockpitFacts } from '../lib/ceoCockpit';

const base: CockpitFacts = {
  incidents_open: 0,
  emails_failed_7d: 0,
  client_errors_7d: 0,
  cron_last_failed: false,
  prospect_actions_due: 0,
  prospect_due_list: [],
  prospects_no_next_action: 0,
  coa_awaiting: 0,
  verifications_pending: 0,
  producer_verifs_pending: 0,
  quotes_unanswered_48h: 0,
  labs_pending: 0,
  orders_delivered_total: 0,
  orders_30d: 0,
  gmv_30d: 0,
  active_buyers_90d: 0,
  repeat_buyers: 0,
  producers_verified: 0,
  prospects_signed: 0,
  prospects_contacted: 0,
  prospects_total: 70,
  signups_7d: 0,
  quotes_7d: 0,
  generated_at: new Date().toISOString(),
};

describe('computeActions — hiérarchie des règles', () => {
  it('incident qualité = critique, toujours en premier', () => {
    const actions = computeActions({ ...base, incidents_open: 2, prospect_actions_due: 5, coa_awaiting: 3 });
    expect(actions[0].id).toBe('incidents');
    expect(actions[0].severity).toBe('critical');
  });

  it('cron en échec = critique', () => {
    const actions = computeActions({ ...base, cron_last_failed: true });
    expect(actions.find(a => a.id === 'cron')?.severity).toBe('critical');
  });

  it('relances dues et devis 48 h = high, au-dessus des files medium', () => {
    const actions = computeActions({
      ...base, prospect_actions_due: 3, quotes_unanswered_48h: 1, coa_awaiting: 5, labs_pending: 28,
    });
    const ids = actions.map(a => a.id);
    expect(ids.indexOf('quotes')).toBeLessThan(ids.indexOf('coa'));
    expect(ids.indexOf('prospect-due')).toBeLessThan(ids.indexOf('coa'));
    expect(ids.indexOf('coa')).toBeLessThan(ids.indexOf('labs'));
  });

  it('à sévérité égale, le plus gros compteur passe devant', () => {
    const actions = computeActions({ ...base, coa_awaiting: 2, prospects_no_next_action: 9 });
    const ids = actions.map(a => a.id);
    expect(ids.indexOf('no-next-action')).toBeLessThan(ids.indexOf('coa'));
  });

  it('erreurs front : seuil à 10 (9 = silence, 10 = action)', () => {
    expect(computeActions({ ...base, client_errors_7d: 9 }).find(a => a.id === 'client-errors')).toBeUndefined();
    expect(computeActions({ ...base, client_errors_7d: 10 }).find(a => a.id === 'client-errors')).toBeDefined();
  });

  it('rien d\u2019urgent → propose la prospection froide', () => {
    const actions = computeActions({ ...base, prospects_contacted: 20 });
    expect(actions).toHaveLength(1);
    expect(actions[0].id).toBe('cold-outreach');
    expect(actions[0].count).toBe(50);
  });

  it('la prospection froide ne s\u2019affiche PAS s\u2019il y a plus urgent', () => {
    const actions = computeActions({ ...base, incidents_open: 1 });
    expect(actions.find(a => a.id === 'cold-outreach')).toBeUndefined();
  });

  it('vérifications producteurs + certifications sont agrégées', () => {
    const a = computeActions({ ...base, verifications_pending: 2, producer_verifs_pending: 3 }).find(x => x.id === 'verifs');
    expect(a?.count).toBe(5);
  });

  it('tableau vide si tout est à zéro et tout contacté', () => {
    const actions = computeActions({ ...base, prospects_contacted: 70 });
    expect(actions).toHaveLength(0);
  });

  it('chaque action pointe vers une page admin existante', () => {
    const actions = computeActions({
      ...base, incidents_open: 1, cron_last_failed: true, quotes_unanswered_48h: 1,
      prospect_actions_due: 1, emails_failed_7d: 1, coa_awaiting: 1,
      verifications_pending: 1, client_errors_7d: 15, prospects_no_next_action: 1, labs_pending: 1,
    });
    for (const a of actions) expect(a.link).toMatch(/^\/admin/);
  });
});

describe('phase1Progress', () => {
  it('calcule la progression vers les cibles encodées du plan', () => {
    const p = phase1Progress({ ...base, orders_delivered_total: 5, repeat_buyers: 3, producers_verified: 2 });
    expect(p[0]).toMatchObject({ current: 5, target: PHASE1_TARGETS.orders_delivered, pct: 50 });
    expect(p[1].pct).toBe(100);
    expect(p[2].pct).toBe(25);
  });

  it('borne la progression à 100 %', () => {
    const p = phase1Progress({ ...base, orders_delivered_total: 99 });
    expect(p[0].pct).toBe(100);
  });
});
