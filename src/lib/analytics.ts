// =============================================================
// EthiMarket — Mesure d'audience interne, RGPD-first
//
// PAS de cookie, PAS de tracker tiers, PAS de donnée personnelle :
//  - session anonyme éphémère en sessionStorage (meurt avec l'onglet)
//  - source = utm_source OU domaine du referrer (jamais l'URL entière)
//  - événements agrégés uniquement en lecture (get_growth_stats)
// Exempté de consentement (mesure d'audience sans recoupement,
// lignes directrices CNIL) — pas de bandeau requis pour ça.
// =============================================================

import { supabase } from './supabase';

type AnalyticsEvent = 'page_view' | 'signup' | 'quote_requested' | 'order_created' | 'product_view';

const SESSION_KEY = 'em_session';
const SOURCE_KEY = 'em_source';

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

/** Source d'acquisition : utm_source prioritaire, sinon domaine du referrer. */
function acquisitionSource(): string {
  try {
    const cached = sessionStorage.getItem(SOURCE_KEY);
    if (cached) return cached;
    const utm = new URLSearchParams(window.location.search).get('utm_source');
    let source = '';
    if (utm) source = utm.slice(0, 60);
    else if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (!host.includes(window.location.hostname)) source = host.slice(0, 60);
    }
    sessionStorage.setItem(SOURCE_KEY, source);
    return source;
  } catch {
    return '';
  }
}

/** Catégorie de page à partir du chemin (jamais l'URL complète). */
export function pageKind(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/catalogue')) return 'catalogue';
  if (pathname.startsWith('/produit')) return 'product';
  if (pathname.startsWith('/boutique')) return 'shop';
  if (pathname.startsWith('/blog')) return 'blog';
  if (pathname.startsWith('/pour-les-professionnels')) return 'pro';
  if (pathname.startsWith('/devenir-vendeur')) return 'vendor';
  if (pathname.startsWith('/inscription') || pathname.startsWith('/connexion')) return 'auth';
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) return 'app';
  return 'other';
}

/** Envoi fire-and-forget : ne bloque jamais l'UI, n'échoue jamais fort. */
export function track(event: AnalyticsEvent, kind?: string): void {
  try {
    const locale = localStorage.getItem('ethimarket_locale') ?? 'fr';
    void supabase.from('analytics_events').insert({
      event,
      session_id: sessionId(),
      page_kind: kind ?? pageKind(window.location.pathname),
      source: acquisitionSource(),
      locale,
    }).then(() => undefined);
  } catch { /* la mesure ne casse jamais le produit */ }
}
