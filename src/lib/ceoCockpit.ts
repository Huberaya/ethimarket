/**
 * Cockpit CEO — moteur de RÈGLES déterministe (plan stratégique §12).
 * Entrée : les faits de get_ceo_cockpit(). Sortie : une liste d'actions
 * priorisées qui répond à « Que dois-je faire maintenant ? ».
 * Hiérarchie décidée par le plan : sécurité/incidents > relances commerciales
 * dues > files de confiance (COA, vérifications) > hygiène pipeline > KPI vs plan.
 * Pas d'IA : chaque règle est lisible, chiffrée, et testée.
 */

export interface CockpitFacts {
  incidents_open: number;
  emails_failed_7d: number;
  client_errors_7d: number;
  cron_last_failed: boolean;
  prospect_actions_due: number;
  prospect_due_list: { name: string; kind: string; next_action: string | null; next_action_date: string; phone: string | null; status: string }[];
  prospects_no_next_action: number;
  coa_awaiting: number;
  verifications_pending: number;
  producer_verifs_pending: number;
  quotes_unanswered_48h: number;
  labs_pending: number;
  orders_delivered_total: number;
  orders_30d: number;
  gmv_30d: number;
  active_buyers_90d: number;
  repeat_buyers: number;
  producers_verified: number;
  prospects_signed: number;
  prospects_contacted: number;
  prospects_total: number;
  signups_7d: number;
  quotes_7d: number;
  generated_at: string;
}

export type ActionSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface CockpitAction {
  id: string;
  severity: ActionSeverity;
  title: string;
  detail: string;
  link: string;
  count?: number;
}

/** Cibles de sortie de phase 1 (plan §5, encodées — pas modifiables à la volée). */
export const PHASE1_TARGETS = {
  orders_delivered: 10,
  repeat_buyers: 3,
  producers_verified: 8,
} as const;

const SEVERITY_ORDER: Record<ActionSeverity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

/** Le moteur : faits → actions triées par priorité. */
export function computeActions(f: CockpitFacts): CockpitAction[] {
  const actions: CockpitAction[] = [];

  // ---- Règle 1 (critical) : incident qualité ouvert = tout s'arrête.
  if (f.incidents_open > 0) {
    actions.push({
      id: 'incidents', severity: 'critical', count: f.incidents_open,
      title: `${f.incidents_open} incident(s) qualité ouvert(s)`,
      detail: 'Un incident non traité détruit la promesse « prouvé, pas promis ». Traiter avant toute prospection.',
      link: '/admin/incidents',
    });
  }

  // ---- Règle 2 (critical) : le cron nocturne a échoué = la confiance ne tourne plus.
  if (f.cron_last_failed) {
    actions.push({
      id: 'cron', severity: 'critical',
      title: 'Le passage nocturne a échoué',
      detail: 'Dégradation des certifications et veille RASFF non exécutées — vérifier la Santé plateforme.',
      link: '/admin/sante',
    });
  }

  // ---- Règle 3 (high) : devis sans réponse >48 h = revenu qui s'évapore.
  if (f.quotes_unanswered_48h > 0) {
    actions.push({
      id: 'quotes', severity: 'high', count: f.quotes_unanswered_48h,
      title: `${f.quotes_unanswered_48h} devis sans réponse depuis 48 h`,
      detail: 'Relancer le producteur ou répondre soi-même : un devis qui traîne est une commande perdue.',
      link: '/admin/commandes',
    });
  }

  // ---- Règle 4 (high) : relances prospection dues aujourd'hui/en retard.
  if (f.prospect_actions_due > 0) {
    actions.push({
      id: 'prospect-due', severity: 'high', count: f.prospect_actions_due,
      title: `${f.prospect_actions_due} relance(s) de prospection due(s)`,
      detail: 'Les actions datées d\u2019aujourd\u2019hui ou en retard. En phase 1, le fondateur EST le canal : c\u2019est LE travail du jour.',
      link: '/admin/prospection',
    });
  }

  // ---- Règle 5 (high) : e-mails transactionnels en échec.
  if (f.emails_failed_7d > 0) {
    actions.push({
      id: 'emails', severity: 'high', count: f.emails_failed_7d,
      title: `${f.emails_failed_7d} e-mail(s) en échec (7 j)`,
      detail: 'Des utilisateurs n\u2019ont pas reçu leurs notifications — vérifier la clé Resend et le domaine.',
      link: '/admin/sante',
    });
  }

  // ---- Règle 6 (medium) : COA reçus à examiner.
  if (f.coa_awaiting > 0) {
    actions.push({
      id: 'coa', severity: 'medium', count: f.coa_awaiting,
      title: `${f.coa_awaiting} rapport(s) d\u2019analyse à examiner`,
      detail: 'Un COA reçu non examiné bloque la mise en vente du lot concerné.',
      link: '/admin/analyses',
    });
  }

  // ---- Règle 7 (medium) : vérifications producteurs/certifications en attente.
  const verifs = f.verifications_pending + f.producer_verifs_pending;
  if (verifs > 0) {
    actions.push({
      id: 'verifs', severity: 'medium', count: verifs,
      title: `${verifs} vérification(s) en attente`,
      detail: 'Producteurs ou certifications à vérifier aux registres — c\u2019est le cœur du produit.',
      link: '/admin/verifications',
    });
  }

  // ---- Règle 8 (medium) : erreurs front qui s'accumulent.
  if (f.client_errors_7d >= 10) {
    actions.push({
      id: 'client-errors', severity: 'medium', count: f.client_errors_7d,
      title: `${f.client_errors_7d} erreurs front sur 7 jours`,
      detail: 'Le site casse quelque part pour de vrais visiteurs — examiner les erreurs dédupliquées.',
      link: '/admin/sante',
    });
  }

  // ---- Règle 9 (medium) : prospects engagés sans prochaine action = pipeline qui pourrit.
  if (f.prospects_no_next_action > 0) {
    actions.push({
      id: 'no-next-action', severity: 'medium', count: f.prospects_no_next_action,
      title: `${f.prospects_no_next_action} prospect(s) engagé(s) sans prochaine action`,
      detail: 'Contactés ou en discussion, mais rien de planifié : un contact sans prochaine action est un contact perdu.',
      link: '/admin/prospection',
    });
  }

  // ---- Règle 10 (low) : labos à contre-vérifier (tâche de fond).
  if (f.labs_pending > 0) {
    actions.push({
      id: 'labs', severity: 'low', count: f.labs_pending,
      title: `${f.labs_pending} laboratoire(s) à contre-vérifier`,
      detail: 'Tâche de fond : valider l\u2019annuaire labos avant d\u2019y adosser des analyses.',
      link: '/admin/laboratoires',
    });
  }

  // ---- Règle 11 (low) : rien d'urgent → pousser la prospection froide.
  const notContacted = f.prospects_total - f.prospects_contacted;
  if (actions.filter(a => a.severity !== 'low').length === 0 && notContacted > 0) {
    actions.push({
      id: 'cold-outreach', severity: 'low', count: notContacted,
      title: `Rien d\u2019urgent — ${notContacted} cible(s) jamais contactée(s)`,
      detail: 'La meilleure heure creuse : 5 nouveaux contacts du CRM (max 30/semaine, règle du kit).',
      link: '/admin/prospection',
    });
  }

  return actions.sort((a, b) =>
    SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || (b.count ?? 0) - (a.count ?? 0)
  );
}

export interface KpiProgress {
  label: string;
  current: number;
  target: number;
  pct: number; // 0-100, borné
}

/** Progression vers les critères de sortie de phase 1 (plan §5.1). */
export function phase1Progress(f: CockpitFacts): KpiProgress[] {
  const mk = (label: string, current: number, target: number): KpiProgress => ({
    label, current, target, pct: Math.max(0, Math.min(100, Math.round((current / target) * 100))),
  });
  return [
    mk('Commandes livrées conformes', f.orders_delivered_total, PHASE1_TARGETS.orders_delivered),
    mk('Acheteurs récurrents', f.repeat_buyers, PHASE1_TARGETS.repeat_buyers),
    mk('Producteurs vérifiés', f.producers_verified, PHASE1_TARGETS.producers_verified),
  ];
}
