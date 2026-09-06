/**
 * Growth loop des preuves (chantier #4) : badge « Producteur vérifié aux
 * registres » que le producteur intègre sur SON site, avec lien vers sa
 * boutique EthiMarket. Chaque visite via badge porte utm_source=badge →
 * mesurée par l'analytics maison (page /admin/croissance, sans cookie).
 * Politique d'honnêteté : le badge n'est proposé QUE si le producteur est
 * réellement vérifié (verification_status === 'verified').
 */

const BASE = 'https://ethimarket.vercel.app';

export type BadgeVariant = 'fr' | 'en' | 'fr-dark' | 'en-dark';

export const BADGE_VARIANTS: { id: BadgeVariant; label: string; file: string }[] = [
  { id: 'fr', label: 'Français — clair', file: 'verifie-fr.svg' },
  { id: 'fr-dark', label: 'Français — sombre', file: 'verifie-fr-dark.svg' },
  { id: 'en', label: 'English — light', file: 'verified-en.svg' },
  { id: 'en-dark', label: 'English — dark', file: 'verified-en-dark.svg' },
];

export function badgeImageUrl(variant: BadgeVariant): string {
  const v = BADGE_VARIANTS.find(b => b.id === variant) ?? BADGE_VARIANTS[0];
  return `${BASE}/badges/${v.file}`;
}

/** URL de la boutique, marquée pour l'attribution growth. */
export function badgeShopUrl(slug: string): string {
  return `${BASE}/boutique/${encodeURIComponent(slug)}?utm_source=badge`;
}

/** Alt text honnête (pas de superlatif inventé). */
function altText(variant: BadgeVariant): string {
  return variant.startsWith('en')
    ? 'Registry-verified producer on EthiMarket'
    : 'Producteur vérifié aux registres sur EthiMarket';
}

/** Snippet HTML à coller sur un site (Wix, WordPress, site coopérative…). */
export function badgeHtmlSnippet(slug: string, variant: BadgeVariant): string {
  return `<a href="${badgeShopUrl(slug)}" target="_blank" rel="noopener">
  <img src="${badgeImageUrl(variant)}" alt="${altText(variant)}" width="230" height="56" loading="lazy" />
</a>`;
}

/** Snippet Markdown (README, profils, forums pros). */
export function badgeMarkdownSnippet(slug: string, variant: BadgeVariant): string {
  return `[![${altText(variant)}](${badgeImageUrl(variant)})](${badgeShopUrl(slug)})`;
}

/** Texte de signature e-mail (fallback sans image). */
export function badgeEmailSignature(slug: string, variant: BadgeVariant): string {
  return variant.startsWith('en')
    ? `Registry-verified producer on EthiMarket → ${badgeShopUrl(slug)}`
    : `Producteur vérifié aux registres sur EthiMarket → ${badgeShopUrl(slug)}`;
}
