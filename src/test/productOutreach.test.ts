// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { productEmails, productBuyerEmail, PRODUCT_EMAIL_FACTS } from '../lib/productOutreach';
import { WAVE1_PRODUCTS } from '../lib/strategyData';

describe('PRODUCT_EMAIL_FACTS — couverture', () => {
  it('couvre les 12 produits de la vague 1', () => {
    for (const p of WAVE1_PRODUCTS) {
      expect(PRODUCT_EMAIL_FACTS[p.short], `facts manquants pour ${p.short}`).toBeDefined();
    }
  });

  it('chaque produit a 3-4 preuves substantielles et des accroches FR/EN', () => {
    for (const [short, f] of Object.entries(PRODUCT_EMAIL_FACTS)) {
      expect(f.proofs.length, short).toBeGreaterThanOrEqual(3);
      for (const proof of f.proofs) expect(proof.length, short).toBeGreaterThan(30);
      expect(f.producerHookFr.length, short).toBeGreaterThan(40);
      expect(f.producerHookEn.length, short).toBeGreaterThan(40);
      expect(f.sampleLine.toLowerCase(), short).toMatch(/échantillon|sample|carton|réserver/);
    }
  });
});

describe('productEmails', () => {
  it('génère 3 e-mails (acheteur + producteur FR + producteur EN) pour chaque produit', () => {
    for (const p of WAVE1_PRODUCTS) {
      const ms = productEmails(p.short);
      expect(ms, p.short).toHaveLength(3);
      expect(ms[0].id).toBe(`product-buyer-${p.short}`);
      expect(ms[1].id).toBe(`product-producer-fr-${p.short}`);
      expect(ms[2].id).toBe(`product-producer-en-${p.short}`);
    }
  });

  it('e-mail acheteur : nom complet du produit, prix du plan, preuves', () => {
    const m = productBuyerEmail('Yirgacheffe')!;
    expect(m.subject).toContain('Café vert Yirgacheffe');
    expect(m.body).toContain('9-14 €/kg');
    expect(m.body).toContain('FLO-CERT');
    expect(m.body).toContain('EUDR');
  });

  it('cacao : argument EUDR + prix minimum Fairtrade documenté', () => {
    const m = productBuyerEmail('Cacao Ghana')!;
    expect(m.body).toContain('2023/1115');
    expect(m.body).toContain('3 500 $/t');
  });

  it('safran : seuils ISO 3632 corrects (crocine ≥ 200 = catégorie I)', () => {
    const m = productBuyerEmail('Safran Taliouine')!;
    expect(m.body).toContain('ISO 3632');
    expect(m.body).toContain('crocine ≥ 200');
  });

  it('vanille : marqueurs anti-fraude mesurables (humidité, vanilline)', () => {
    const m = productBuyerEmail('Vanille Bourbon')!;
    expect(m.body).toMatch(/30-35 %/);
    expect(m.body).toMatch(/1,5-2 %/);
  });

  it('producteur FR/EN : offre d\u2019amorçage réelle présente', () => {
    const [, fr, en] = productEmails('Argane alimentaire');
    expect(fr.body).toContain('0 % de commission pendant 6 mois');
    expect(en.body).toContain('0% commission for 6 months');
  });

  it('politique d\u2019honnêteté : aucun mot interdit dans les 36 e-mails', () => {
    const banned = ['escrow', '12 langues', 'sous 7 jours', '8 250', '4.9/5', 'fatima benali', 'karim hosseini', 'ana rodriguez'];
    for (const p of WAVE1_PRODUCTS) {
      const all = productEmails(p.short).map(m => `${m.subject} ${m.body}`).join(' ').toLowerCase();
      for (const b of banned) expect(all, `${p.short} contient « ${b} »`).not.toContain(b);
    }
  });

  it('produit inconnu → aucun e-mail', () => {
    expect(productEmails('Inexistant')).toHaveLength(0);
  });
});
