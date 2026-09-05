// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { messagesFor, mailtoHref, type ProspectLike } from '../lib/outreachTemplates';
import { BUYER_SEGMENTS, PRODUCER_SEGMENTS } from '../lib/strategyData';

const buyer: ProspectLike = {
  name: 'Kultivar Café', kind: 'buyer', segment: 'torrefacteur',
  city: 'Nantes', contact_name: null,
};
const producer: ProspectLike = {
  name: 'YCFCU', kind: 'producer', segment: 'cafe',
  city: 'Addis-Abeba', contact_name: 'Tsegaye',
};

describe('messagesFor — acheteurs', () => {
  it('fournit la séquence complète J0/J+4/J+10 + script d\u2019appel', () => {
    const ms = messagesFor(buyer);
    expect(ms.map(m => m.id)).toEqual(['buyer-j0', 'buyer-j4', 'buyer-j10', 'buyer-call']);
    expect(ms.filter(m => m.channel === 'email')).toHaveLength(3);
  });

  it('personnalise avec le nom de la cible et le métier', () => {
    const j0 = messagesFor(buyer)[0];
    expect(j0.body).toContain('Kultivar Café');
    expect(j0.body).toContain('torréfacteur');
  });

  it('insère les produits du segment (café pour un torréfacteur)', () => {
    const j0 = messagesFor(buyer)[0];
    expect(j0.body).toMatch(/Yirgacheffe|Sidama/);
  });

  it('utilise le prénom du contact quand il est connu', () => {
    const withContact = messagesFor({ ...buyer, contact_name: 'Marie' })[0];
    expect(withContact.body).toContain('Bonjour Marie,');
    const without = messagesFor(buyer)[0];
    expect(without.body).toContain('Bonjour,');
  });

  it('respecte la politique d\u2019honnêteté : pas de stats inventées ni de mots interdits', () => {
    const all = messagesFor(buyer).map(m => `${m.subject ?? ''} ${m.body}`).join(' ');
    for (const banned of ['escrow', '12 langues', 'sous 7 jours', '8 250', '4.9/5', 'Fatima Benali']) {
      expect(all.toLowerCase()).not.toContain(banned.toLowerCase());
    }
  });
});

describe('messagesFor — producteurs', () => {
  it('fournit FR + EN', () => {
    const ms = messagesFor(producer);
    expect(ms.map(m => m.id)).toEqual(['producer-fr', 'producer-en']);
  });

  it('contient l\u2019offre d\u2019amorçage réelle (vérification offerte, 0 % 6 mois)', () => {
    const fr = messagesFor(producer)[0];
    expect(fr.body).toContain('vérification est offerte');
    expect(fr.body).toContain('0 % de commission pendant 6 mois');
    const en = messagesFor(producer)[1];
    expect(en.body).toContain('0% commission for 6 months');
  });

  it('version EN salue avec le nom du contact', () => {
    expect(messagesFor(producer)[1].body).toContain('Dear Tsegaye,');
  });
});

describe('couverture des segments', () => {
  it('génère des messages non vides pour tous les segments du CRM', () => {
    for (const seg of [...BUYER_SEGMENTS, ...PRODUCER_SEGMENTS]) {
      const kind = (BUYER_SEGMENTS as readonly string[]).includes(seg) ? 'buyer' as const : 'producer' as const;
      const ms = messagesFor({ name: 'Test', kind, segment: seg, city: null, contact_name: null });
      expect(ms.length).toBeGreaterThan(0);
      for (const m of ms) expect(m.body.length).toBeGreaterThan(100);
    }
  });
});

describe('mailtoHref', () => {
  it('construit un mailto encodé avec sujet et corps', () => {
    const m = messagesFor(buyer)[0];
    const href = mailtoHref('contact@example.com', m);
    expect(href).toMatch(/^mailto:contact@example\.com\?subject=/);
    expect(href).toContain(encodeURIComponent('registres'));
  });
});
