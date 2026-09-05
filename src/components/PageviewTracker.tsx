import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { track, pageKind } from '../lib/analytics';

/**
 * Compte les pages vues (mesure d'audience interne, sans cookie).
 * Une vue par changement de route ; les pages produit émettent
 * en plus un événement product_view.
 * Les zones privées (dashboard/admin) ne sont PAS suivies.
 */
export default function PageviewTracker() {
  const { pathname } = useLocation();
  const last = useRef('');

  useEffect(() => {
    if (pathname === last.current) return;
    last.current = pathname;
    const kind = pageKind(pathname);
    if (kind === 'app') return; // pas de tracking des espaces privés
    track('page_view', kind);
    if (kind === 'product') track('product_view', kind);
  }, [pathname]);

  return null;
}
