// =============================================================
// EthiMarket — Garde-fou global contre les crashs React
// Sans lui : une exception de rendu = écran blanc définitif.
// Avec lui : écran d'erreur propre + bouton recharger.
// Volontairement autonome (pas de useI18n : si l'i18n crashe,
// la page d'erreur doit quand même s'afficher) — libellés
// multilingues statiques inline.
// =============================================================

import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

const LABELS: Record<string, { title: string; desc: string; reload: string; home: string }> = {
  fr: { title: 'Une erreur est survenue', desc: 'Quelque chose s\'est mal passé de notre côté. Vos données ne sont pas perdues.', reload: 'Recharger la page', home: 'Retour à l\'accueil' },
  en: { title: 'Something went wrong', desc: 'An error occurred on our side. Your data is not lost.', reload: 'Reload the page', home: 'Back to home' },
  es: { title: 'Se ha producido un error', desc: 'Algo salió mal por nuestra parte. Sus datos no se han perdido.', reload: 'Recargar la página', home: 'Volver al inicio' },
  pt: { title: 'Ocorreu um erro', desc: 'Algo correu mal do nosso lado. Os seus dados não se perderam.', reload: 'Recarregar a página', home: 'Voltar ao início' },
  ar: { title: 'حدث خطأ ما', desc: 'حدث خطأ من جانبنا. بياناتك لم تُفقد.', reload: 'إعادة تحميل الصفحة', home: 'العودة إلى الرئيسية' },
};

function currentLabels() {
  try {
    const loc = window.localStorage.getItem('ethimarket_locale') ?? 'fr';
    return LABELS[loc] ?? LABELS.fr;
  } catch { return LABELS.fr; }
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown) {
    // Journal console uniquement — zéro dépendance externe.
    console.error('[ErrorBoundary]', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    const l = currentLabels();
    const isRtl = (() => { try { return (window.localStorage.getItem('ethimarket_locale') ?? '') === 'ar'; } catch { return false; } })();
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'system-ui, sans-serif', padding: 16 }}>
        <div style={{ maxWidth: 420, textAlign: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 20, padding: '40px 32px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>{l.title}</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6 }}>{l.desc}</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.location.reload()}
              style={{ padding: '10px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
              {l.reload}
            </button>
            <button onClick={() => { window.location.href = '/'; }}
              style={{ padding: '10px 20px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              {l.home}
            </button>
          </div>
          {this.state.message && (
            <p style={{ fontSize: 10, color: '#d1d5db', marginTop: 20, wordBreak: 'break-all' }}>{this.state.message.slice(0, 140)}</p>
          )}
        </div>
      </div>
    );
  }
}
