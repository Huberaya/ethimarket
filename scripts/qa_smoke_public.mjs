// =============================================================
// EthiMarket — Passe QA publique automatisée (plan de tests §1-2)
//
// Usage : node scripts/qa_smoke_public.mjs [https://ethimarket.vercel.app]
// Nécessite : npm i playwright-core && npx playwright-core install chromium
//
// Couvre la partie automatisable du plan de tests :
//  A. toutes les routes publiques répondent (pas de 404/écran blanc)
//  B. « mots interdits » : aucune promesse fausse résiduelle
//  C. i18n : les 5 langues rendent la home + devenir-vendeur, AR en RTL
//  D. catalogue → clic image → fiche produit
//  E. /dashboard et /admin redirigent bien vers la connexion
// Sort avec un code d'erreur si un test bloquant échoue.
// =============================================================

import { chromium } from 'playwright-core';

const BASE = process.argv[2] ?? 'https://ethimarket.vercel.app';

const PUBLIC_ROUTES = [
  '/', '/catalogue', '/producteurs', '/comment-ca-marche', '/blog',
  '/notre-mission', '/notre-logistique', '/notre-equipe', '/certifications',
  '/presse', '/partenaires', '/centre-aide', '/contact', '/tarifs',
  '/devenir-vendeur', '/trust-center', '/score-ethimarket',
  '/conditions-utilisation', '/confidentialite', '/cookies',
  '/connexion', '/inscription', '/mot-de-passe-oublie',
];

// Promesses supprimées lors de l'audit de contenu : ne doivent JAMAIS revenir.
const FORBIDDEN = [
  /escrow/i, /étiquettes auto/i, /12 langues/i, /12 languages/i,
  /sous 7 jours après/i, /8 250\s?€/, /4[.,]9\/5/,
  /Fatima Benali/, /Karim Hosseini/, /Ana Rodriguez/,
];

const LOCALES = ['fr', 'en', 'es', 'pt', 'ar'];

let failures = 0;
const ok = (name) => console.log(`OK   ${name}`);
const ko = (name, detail = '') => { console.log(`FAIL ${name} ${detail}`); failures++; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();
await page.addInitScript((l) => localStorage.setItem('ethimarket_locale', l), 'fr');

// ── A. Routes publiques ──
for (const route of PUBLIC_ROUTES) {
  try {
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1200);
    const body = (await page.textContent('body')) ?? '';
    const is404 = /Page introuvable|Page not found|404/.test(body) && route !== '/notfound';
    const isBlank = body.trim().length < 100;
    if ((resp?.status() ?? 0) >= 400 || is404 || isBlank) ko(`route ${route}`, `status=${resp?.status()} blank=${isBlank} 404=${is404}`);
    else ok(`route ${route}`);
  } catch (e) { ko(`route ${route}`, e.message); }
}

// ── B. Mots interdits sur les pages marketing ──
for (const route of ['/', '/devenir-vendeur', '/comment-ca-marche', '/tarifs', '/notre-logistique']) {
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1500);
  const body = (await page.textContent('body')) ?? '';
  const hits = FORBIDDEN.filter((re) => re.test(body));
  if (hits.length) ko(`mots interdits ${route}`, hits.map(String).join(','));
  else ok(`mots interdits ${route} : aucun`);
}

// ── C. i18n : 5 langues + RTL ──
for (const locale of LOCALES) {
  const lctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const lpage = await lctx.newPage();
  await lpage.addInitScript((l) => localStorage.setItem('ethimarket_locale', l), locale);
  await lpage.goto(BASE + '/devenir-vendeur', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await lpage.waitForTimeout(1800);
  const html = await lpage.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    body: document.body.innerText.slice(0, 4000),
  }));
  if (html.lang !== locale) ko(`i18n ${locale} : <html lang>`, `got ${html.lang}`);
  else ok(`i18n ${locale} : lang OK`);
  if (locale === 'ar' && html.dir !== 'rtl') ko('i18n ar : dir=rtl attendu', `got ${html.dir}`);
  if (locale === 'ar' && html.dir === 'rtl') ok('i18n ar : RTL actif');
  const markers = { en: /Create my shop|Benefits/i, es: /Crear mi tienda|Ventajas/i, pt: /Criar a minha loja|Vantagens/i, ar: /أنشئ متجري|المزايا/ };
  if (locale !== 'fr') {
    if (markers[locale].test(html.body)) ok(`i18n ${locale} : contenu traduit`);
    else ko(`i18n ${locale} : contenu traduit introuvable`);
  }
  await lctx.close();
}

// ── D. Catalogue → image → fiche produit ──
try {
  await page.goto(BASE + '/catalogue', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3500);
  const imgLink = page.locator('div[class*="aspect"] a, article a[href^="/produit"]').first();
  if (await imgLink.count()) {
    await imgLink.click();
    await page.waitForTimeout(2500);
    if (/\/produits?\//.test(page.url())) ok('catalogue : clic image → fiche produit');
    else ko('catalogue : clic image', `url=${page.url()}`);
  } else ko('catalogue : aucun lien image trouvé');
} catch (e) { ko('catalogue parcours', e.message); }

// ── E. Zones protégées → redirection connexion ──
for (const route of ['/dashboard', '/admin', '/dashboard/mes-produits']) {
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  const url = page.url();
  const body = (await page.textContent('body')) ?? '';
  const isProtected = /connexion|login/i.test(url) || /Se connecter|mot de passe/i.test(body);
  const leaked = /Vue d'ensemble|Tableau de bord|admin_notifications/i.test(body) && !isProtected;
  if (leaked) ko(`zone protégée ${route} : contenu visible sans session !`);
  else ok(`zone protégée ${route} : redirection OK`);
}

await browser.close();
console.log(failures ? `\nQA FAILED — ${failures} échec(s)` : '\nQA ALL GREEN');
process.exit(failures ? 1 : 0);
