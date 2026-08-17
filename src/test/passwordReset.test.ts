// @vitest-environment node
// Tests du parcours mot de passe oublié (fonctions pures).

import { describe, it, expect } from 'vitest';
import { validateNewPassword, passwordStrength, MIN_PASSWORD_LENGTH } from '../lib/passwordReset';
import { DICTS, translate } from '../lib/i18n';

describe('validateNewPassword', () => {
  it('trop court → too_short', () => {
    expect(validateNewPassword('abc', 'abc')).toBe('too_short');
    expect(validateNewPassword('a'.repeat(MIN_PASSWORD_LENGTH - 1), 'x')).toBe('too_short');
  });
  it('non identiques → mismatch', () => {
    expect(validateNewPassword('longpassword1', 'longpassword2')).toBe('mismatch');
  });
  it('valide → null', () => {
    expect(validateNewPassword('MonMotDePasse1', 'MonMotDePasse1')).toBeNull();
  });
});

describe('passwordStrength', () => {
  it('0 pour vide, 3 pour long + casse mixte + chiffre', () => {
    expect(passwordStrength('')).toBe(0);
    expect(passwordStrength('abcdefgh')).toBe(1);
    expect(passwordStrength('Abcdefgh')).toBe(2);
    expect(passwordStrength('Abcdefg1')).toBe(3);
  });
});

describe('i18n du parcours', () => {
  const KEYS = ['fp.title', 'fp.subtitle', 'fp.send', 'fp.sentTitle', 'fp.sentDesc', 'fp.checkSpam',
    'fp.backToLogin', 'fp.rateLimited', 'fp.resetTitle', 'fp.resetSubtitle', 'fp.newPassword',
    'fp.confirmPassword', 'fp.apply', 'fp.tooShort', 'fp.mismatch', 'fp.doneTitle', 'fp.doneDesc',
    'fp.invalidTitle', 'fp.invalidDesc', 'fp.requestNew'];
  it('les 20 clés existent dans les 5 langues', () => {
    for (const loc of ['fr', 'en', 'es', 'pt', 'ar'] as const) {
      for (const k of KEYS) expect(DICTS[loc][k], `${loc}/${k}`).toBeTruthy();
    }
  });
  it('interpolation {email} et {min}', () => {
    expect(translate('fr', 'fp.sentDesc', { email: 'a@b.co' })).toContain('a@b.co');
    expect(translate('ar', 'fp.tooShort', { min: '8' })).toContain('8');
  });
});
