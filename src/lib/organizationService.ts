// =============================================================
// EthiMarket — Service organisations (multi-utilisateurs entreprise)
// Rôles : owner (tout) > admin (gérer membres non-owner, code,
// pondérations) > member (consulte, utilise les règles entreprise).
// =============================================================

import { supabase } from './supabase';
import { BuyerWeights, BuyerPreferences, DEFAULT_WEIGHTS, effectiveWeights } from './buyerWorkspace';

export type OrgRole = 'owner' | 'admin' | 'member';

export interface Organization {
  id: string;
  name: string;
  invite_code: string;
  weight_price: number;
  weight_environment: number;
  weight_social: number;
  weight_traceability: number;
  weight_certifications: number;
  weights_enforced: boolean;
  created_at: string;
}

export interface OrgMember {
  id: string;
  user_id: string;
  role: OrgRole;
  joined_at: string;
  profile?: { full_name: string | null; email: string | null } | null;
}

export const ORG_ROLE_META: Record<OrgRole, { label: string; emoji: string; desc: string }> = {
  owner: { label: 'Propriétaire', emoji: '👑', desc: 'Contrôle total : rôles, règles, suppression' },
  admin: { label: 'Administrateur', emoji: '🛡️', desc: 'Gère les membres et les règles de décision' },
  member: { label: 'Membre', emoji: '👤', desc: 'Utilise la plateforme avec les règles de l\'entreprise' },
};

// -------------------- Lecture --------------------

export async function getMyOrganization(userId: string): Promise<{
  organization: Organization | null;
  members: OrgMember[];
  myRole: OrgRole | null;
}> {
  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id, role')
    .eq('user_id', userId)
    .maybeSingle();

  if (!membership) return { organization: null, members: [], myRole: null };

  const [{ data: org }, { data: members }] = await Promise.all([
    supabase.from('organizations').select('*').eq('id', membership.organization_id).maybeSingle(),
    supabase.from('organization_members')
      .select('id, user_id, role, joined_at')
      .eq('organization_id', membership.organization_id)
      .order('joined_at'),
  ]);

  // Profils des membres (noms/e-mails)
  const memberList = (members ?? []) as OrgMember[];
  if (memberList.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', memberList.map(m => m.user_id));
    const byId = new Map((profiles ?? []).map(p => [p.id, p]));
    memberList.forEach(m => {
      const p = byId.get(m.user_id);
      m.profile = p ? { full_name: p.full_name, email: p.email } : null;
    });
  }

  return {
    organization: (org ?? null) as Organization | null,
    members: memberList,
    myRole: membership.role as OrgRole,
  };
}

// -------------------- Actions --------------------

export async function createOrganization(name: string): Promise<{ orgId: string | null; error: string | null }> {
  const { data, error } = await supabase.rpc('create_organization', { p_name: name });
  return { orgId: (data as string) ?? null, error: error?.message ?? null };
}

export async function joinOrganization(inviteCode: string): Promise<{ orgId: string | null; error: string | null }> {
  const { data, error } = await supabase.rpc('join_organization', { p_invite_code: inviteCode });
  return { orgId: (data as string) ?? null, error: error?.message ?? null };
}

export async function rotateInviteCode(orgId: string): Promise<{ code: string | null; error: string | null }> {
  const { data, error } = await supabase.rpc('rotate_invite_code', { p_org: orgId });
  return { code: (data as string) ?? null, error: error?.message ?? null };
}

export async function removeMember(memberUserId: string): Promise<string | null> {
  const { error } = await supabase.rpc('remove_org_member', { p_member_user: memberUserId });
  return error?.message ?? null;
}

export async function setMemberRole(memberUserId: string, role: OrgRole): Promise<string | null> {
  const { error } = await supabase.rpc('set_org_member_role', { p_member_user: memberUserId, p_role: role });
  return error?.message ?? null;
}

export async function saveOrgWeights(
  orgId: string, weights: BuyerWeights, enforced: boolean,
): Promise<string | null> {
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  if (sum !== 100) return `La somme des pondérations doit faire 100% (actuellement ${sum}%).`;
  const { error } = await supabase.from('organizations').update({
    weight_price: weights.price,
    weight_environment: weights.environment,
    weight_social: weights.social,
    weight_traceability: weights.traceability,
    weight_certifications: weights.certifications,
    weights_enforced: enforced,
  }).eq('id', orgId);
  return error?.message ?? null;
}

// -------------------- Résolution des pondérations (fonction PURE) --------------------

export function orgWeights(org: Organization): BuyerWeights {
  return {
    price: org.weight_price,
    environment: org.weight_environment,
    social: org.weight_social,
    traceability: org.weight_traceability,
    certifications: org.weight_certifications,
  };
}

/**
 * Pondérations FINALES d'un utilisateur :
 *  - org.weights_enforced → les règles ENTREPRISE priment (politique achats).
 *  - sinon → les règles individuelles (+ apprentissage), avec les règles
 *    entreprise comme défaut si l'utilisateur n'a rien configuré.
 */
export function resolveUserWeights(
  personal: BuyerPreferences | null,
  org: Organization | null,
): { weights: BuyerWeights; source: 'organization_enforced' | 'personal' | 'organization_default' | 'platform_default' } {
  if (org?.weights_enforced) {
    return { weights: orgWeights(org), source: 'organization_enforced' };
  }
  if (personal) {
    const isDefault = JSON.stringify(personal.weights) === JSON.stringify(DEFAULT_WEIGHTS) && !personal.learned;
    if (!isDefault) {
      return { weights: effectiveWeights(personal), source: 'personal' };
    }
  }
  if (org) return { weights: orgWeights(org), source: 'organization_default' };
  return {
    weights: personal ? effectiveWeights(personal) : { ...DEFAULT_WEIGHTS },
    source: 'platform_default',
  };
}
