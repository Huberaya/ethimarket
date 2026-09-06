import type { Producer } from './supabase';

/**
 * Parcours de démarrage producteur (chantier #11 — états vides/guidage).
 * Logique PURE et testée : à partir des faits du compte, calcule les
 * étapes dans l'ordre du chemin critique vers la première vente.
 * Chaque étape se coche automatiquement sur les données réelles.
 */

export interface ProducerFacts {
  producer: Pick<Producer, 'name' | 'description' | 'country' | 'logo_url' | 'story' | 'verification_status' | 'verified'> | null;
  productCount: number;
  activeProductCount: number;
}

export interface ProducerStep {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  to: string;
  done: boolean;
}

/** Le profil boutique est-il assez complet pour être crédible ? */
export function isProfileComplete(p: ProducerFacts['producer']): boolean {
  if (!p) return false;
  return Boolean(p.name && p.name.trim().length >= 3 && p.description && p.description.trim().length >= 40 && p.country);
}

/** Le dossier de vérification a-t-il été soumis (ou mieux) ? */
export function isVerificationSubmitted(p: ProducerFacts['producer']): boolean {
  if (!p) return false;
  return p.verified === true || ['submitted', 'under_review', 'approved'].includes(p.verification_status ?? '');
}

export function isVerified(p: ProducerFacts['producer']): boolean {
  if (!p) return false;
  return p.verified === true || p.verification_status === 'approved';
}

/** La boutique a-t-elle une identité visuelle/narrative ? */
export function hasShopIdentity(p: ProducerFacts['producer']): boolean {
  if (!p) return false;
  return Boolean(p.logo_url || (p.story && p.story.trim().length >= 60));
}

/** Les 5 étapes du chemin critique producteur, cochées sur les faits. */
export function computeProducerSteps(f: ProducerFacts): ProducerStep[] {
  return [
    {
      id: 'profile', emoji: '🏷️',
      title: 'Complétez votre profil',
      desc: 'Nom, pays et une description d\u2019au moins quelques lignes — c\u2019est ce que les acheteurs lisent en premier.',
      to: '/dashboard/ma-boutique',
      done: isProfileComplete(f.producer),
    },
    {
      id: 'verification', emoji: '🛡️',
      title: 'Soumettez votre dossier de vérification',
      desc: 'C\u2019est le cœur d\u2019EthiMarket : vos certifications vérifiées AUX REGISTRES deviennent votre argument de vente.',
      to: '/dashboard/verification',
      done: isVerificationSubmitted(f.producer),
    },
    {
      id: 'product', emoji: '📦',
      title: 'Ajoutez votre premier produit',
      desc: 'Prix, conditionnements, photos : un produit complet reçoit plus de demandes de devis.',
      to: '/dashboard/ajouter-produit',
      done: f.productCount > 0,
    },
    {
      id: 'identity', emoji: '🎨',
      title: 'Donnez un visage à votre boutique',
      desc: 'Logo ou histoire de la coopérative : les acheteurs achètent une origine, pas une référence.',
      to: '/dashboard/ma-boutique',
      done: hasShopIdentity(f.producer),
    },
    {
      id: 'badge', emoji: '🎖️',
      title: 'Affichez votre badge vérifié',
      desc: 'Une fois vérifié, intégrez le badge sur votre site : il renvoie vers vos preuves publiques.',
      to: '/dashboard/ma-boutique',
      done: isVerified(f.producer),
    },
  ];
}

/** Progression 0-100 (pour la barre). */
export function onboardingProgress(steps: ProducerStep[]): number {
  if (steps.length === 0) return 0;
  return Math.round((steps.filter(s => s.done).length / steps.length) * 100);
}

/** La prochaine étape à faire (la première non faite). */
export function nextStep(steps: ProducerStep[]): ProducerStep | null {
  return steps.find(s => !s.done) ?? null;
}
