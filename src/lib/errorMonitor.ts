import { supabase } from './supabase';

/**
 * Monitoring d'erreurs front minimal, zéro coût, zéro tracker tiers.
 * Capte window.onerror + unhandledrejection et les envoie à la fonction
 * SQL log_client_error() (dédupliquée par fingerprint côté serveur).
 * Garde-fous côté client : max 10 envois par session, anti-doublon local,
 * jamais de query string (pas de PII), échecs silencieux.
 */

const MAX_PER_SESSION = 10;
let sent = 0;
const seen = new Set<string>();

function report(message: string, source: string | null) {
  if (sent >= MAX_PER_SESSION) return;
  const key = `${message}|${source ?? ''}`;
  if (seen.has(key)) return;
  seen.add(key);
  sent++;
  // fire-and-forget : le monitoring ne doit jamais casser l'app
  void supabase.rpc('log_client_error', {
    p_message: message.slice(0, 500),
    p_source: source?.slice(0, 300) ?? null,
    p_page: window.location.pathname.slice(0, 200),
    p_user_agent: navigator.userAgent.slice(0, 300),
  }).then(() => undefined, () => undefined);
}

/** À appeler une seule fois au démarrage de l'app. */
export function installErrorMonitor(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    // Erreurs de chargement de ressources (img, script) : ignorées (bruit).
    if (!(event.error instanceof Error) && !event.message) return;
    const msg = event.message || String(event.error);
    const src = event.filename ? `${event.filename}:${event.lineno ?? 0}:${event.colno ?? 0}` : null;
    report(msg, src);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason instanceof Error ? `${reason.name}: ${reason.message}` : String(reason ?? 'unhandledrejection');
    report(msg, 'unhandledrejection');
  });
}
