// =============================================================
// EthiMarket — Réinitialisation de mot de passe
// Helpers purs (testables) + appels Supabase Auth.
// L'e-mail de réinitialisation est envoyé par Supabase Auth
// (indépendant de Resend — fonctionne dès aujourd'hui).
// =============================================================

import { supabase } from './supabase';

export const MIN_PASSWORD_LENGTH = 8;

export type PasswordIssue = 'too_short' | 'mismatch' | null;

/** Valide un nouveau mot de passe + sa confirmation (fonction pure). */
export function validateNewPassword(password: string, confirm: string): PasswordIssue {
  if (password.length < MIN_PASSWORD_LENGTH) return 'too_short';
  if (password !== confirm) return 'mismatch';
  return null;
}

/** Force indicative 0-3 (longueur, casse mixte, chiffre/symbole) — fonction pure. */
export function passwordStrength(password: string): number {
  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[\d\W]/.test(password)) score++;
  return score;
}

/**
 * Demande l'e-mail de réinitialisation. Retourne toujours un succès
 * apparent côté UI (anti-énumération d'adresses) ; seule une erreur
 * technique (réseau, rate-limit) est remontée.
 */
export async function requestPasswordReset(email: string): Promise<string | null> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
  });
  if (error && /rate|too many/i.test(error.message)) return error.message;
  return null; // succès apparent même si l'adresse n'existe pas
}

/** Applique le nouveau mot de passe (nécessite la session de récupération). */
export async function applyNewPassword(password: string): Promise<string | null> {
  const { error } = await supabase.auth.updateUser({ password });
  return error?.message ?? null;
}
