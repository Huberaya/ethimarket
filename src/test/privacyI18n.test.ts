// @vitest-environment node
// Parité i18n de la section RGPD (export / suppression de compte).

import { describe, it, expect } from 'vitest';
import { DICTS } from '../lib/i18n';

const KEYS = [
  'privacy.title', 'privacy.exportTitle', 'privacy.exportDesc', 'privacy.exportBtn',
  'privacy.deleteTitle', 'privacy.deleteDesc', 'privacy.deleteBtn',
  'privacy.confirmPrompt', 'privacy.confirmBtn', 'privacy.note',
];

describe('i18n RGPD', () => {
  it('les 10 clés existent dans les 5 langues', () => {
    for (const loc of ['fr', 'en', 'es', 'pt', 'ar'] as const) {
      for (const k of KEYS) expect(DICTS[loc][k], `${loc}/${k}`).toBeTruthy();
    }
  });
  it('le mot de confirmation SUPPRIMER est cité dans toutes les langues (saisie exacte requise)', () => {
    for (const loc of ['fr', 'en', 'es', 'pt', 'ar'] as const) {
      expect(DICTS[loc]['privacy.confirmPrompt']).toContain('SUPPRIMER');
    }
  });
});
