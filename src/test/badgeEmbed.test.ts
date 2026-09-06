// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  BADGE_VARIANTS, badgeImageUrl, badgeShopUrl,
  badgeHtmlSnippet, badgeMarkdownSnippet, badgeEmailSignature,
} from '../lib/badgeEmbed';

describe('badgeEmbed', () => {
  it('propose 4 variantes (FR/EN × clair/sombre)', () => {
    expect(BADGE_VARIANTS).toHaveLength(4);
    expect(BADGE_VARIANTS.map(v => v.id)).toEqual(['fr', 'fr-dark', 'en', 'en-dark']);
  });

  it('URL du badge pointe vers les SVG publics', () => {
    expect(badgeImageUrl('fr')).toBe('https://ethimarket.vercel.app/badges/verifie-fr.svg');
    expect(badgeImageUrl('en-dark')).toBe('https://ethimarket.vercel.app/badges/verified-en-dark.svg');
  });

  it('URL boutique porte utm_source=badge (attribution growth)', () => {
    const url = badgeShopUrl('jean-dupont-44b8c502');
    expect(url).toBe('https://ethimarket.vercel.app/boutique/jean-dupont-44b8c502?utm_source=badge');
  });

  it('encode les slugs exotiques', () => {
    expect(badgeShopUrl('coop café')).toContain('coop%20caf%C3%A9');
  });

  it('snippet HTML : lien + image + alt honnête + lazy loading', () => {
    const html = badgeHtmlSnippet('ma-coop', 'fr');
    expect(html).toContain('href="https://ethimarket.vercel.app/boutique/ma-coop?utm_source=badge"');
    expect(html).toContain('verifie-fr.svg');
    expect(html).toContain('alt="Producteur vérifié aux registres sur EthiMarket"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('rel="noopener"');
  });

  it('snippet Markdown bien formé', () => {
    const md = badgeMarkdownSnippet('ma-coop', 'en');
    expect(md).toMatch(/^\[!\[Registry-verified producer on EthiMarket\]\(.+\)\]\(.+\)$/);
  });

  it('signature e-mail dans la langue de la variante', () => {
    expect(badgeEmailSignature('ma-coop', 'fr')).toContain('Producteur vérifié aux registres');
    expect(badgeEmailSignature('ma-coop', 'en-dark')).toContain('Registry-verified producer');
  });

  it('honnêteté : aucun superlatif inventé dans les snippets', () => {
    const all = [
      badgeHtmlSnippet('x', 'fr'), badgeMarkdownSnippet('x', 'fr'), badgeEmailSignature('x', 'fr'),
    ].join(' ').toLowerCase();
    for (const banned of ['n°1', 'leader', 'meilleur', '4.9', 'escrow']) {
      expect(all).not.toContain(banned);
    }
  });
});
