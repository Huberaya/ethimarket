// =============================================================
// EthiMarket — Page « Mon organisation » (plan Entreprise)
// Créer/rejoindre une organisation, gérer les membres et rôles,
// définir les pondérations de décision de l'entreprise.
// =============================================================

import { useEffect, useState } from 'react';
import {
  Building2, Users, Copy, RefreshCw, Loader2, Check, Crown,
  Shield, User as UserIcon, LogOut, SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import {
  getMyOrganization, createOrganization, joinOrganization, rotateInviteCode,
  removeMember, setMemberRole, saveOrgWeights, orgWeights,
  Organization, OrgMember, OrgRole, ORG_ROLE_META,
} from '../../lib/organizationService';
import { BuyerWeights } from '../../lib/buyerWorkspace';

const ROLE_ICONS: Record<OrgRole, typeof Crown> = { owner: Crown, admin: Shield, member: UserIcon };

const WEIGHT_LABELS: Record<keyof BuyerWeights, string> = {
  price: '💶 Prix', environment: '🌍 Environnement', social: '🤝 Social',
  traceability: '🔍 Traçabilité', certifications: '🏅 Certifications',
};

export default function OrganizationPage() {
  const { user } = useAuth();
  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [myRole, setMyRole] = useState<OrgRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const reload = async () => {
    if (!user) return;
    setLoading(true);
    const res = await getMyOrganization(user.id);
    setOrg(res.organization);
    setMembers(res.members);
    setMyRole(res.myRole);
    setLoading(false);
  };
  useEffect(() => { void reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user?.id]);

  if (!user) return null;
  if (loading) return <div className="flex justify-center py-20" role="status" aria-label="Chargement"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Mon organisation</h1>
        <p className="text-sm text-gray-500 mt-1">
          Travaillez en équipe : membres, rôles et règles de décision communes à toute l'entreprise.
        </p>
      </div>

      {msg && <p className="text-sm font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-xl px-4 py-2.5" role="status">{msg}</p>}

      {!org ? (
        <CreateOrJoin onDone={() => { setMsg('✓ Bienvenue dans votre organisation'); void reload(); }} />
      ) : (
        <>
          <OrgHeader org={org} myRole={myRole!} onRotated={code => { setMsg(`✓ Nouveau code d'invitation : ${code}`); void reload(); }} />
          <MembersList members={members} myRole={myRole!} myUserId={user.id} onChanged={() => void reload()} />
          {(myRole === 'owner' || myRole === 'admin') && (
            <OrgWeightsEditor org={org} onSaved={() => { setMsg('✓ Règles de l\'entreprise enregistrées'); void reload(); }} />
          )}
        </>
      )}
    </div>
  );
}

/* ---------- Créer ou rejoindre ---------- */
function CreateOrJoin({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState<'create' | 'join' | null>(null);
  const [error, setError] = useState('');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="bg-white rounded-2xl border-2 border-brand-200 p-6">
        <Building2 className="w-6 h-6 text-brand-600 mb-3" aria-hidden="true" />
        <h2 className="font-black text-gray-900">Créer une organisation</h2>
        <p className="text-xs text-gray-500 mt-1 mb-4">Vous devenez propriétaire et invitez vos collègues avec un code.</p>
        <label htmlFor="org-name" className="block text-sm font-semibold text-gray-700 mb-1.5">Nom de l'entreprise</label>
        <input
          id="org-name" type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Ex : Acme Achats Responsables"
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
        />
        <button
          onClick={async () => {
            setBusy('create'); setError('');
            const { error: err } = await createOrganization(name);
            setBusy(null);
            if (err) setError(err); else onDone();
          }}
          disabled={busy !== null || name.trim().length < 2}
          className="mt-3 w-full btn-primary py-2.5 text-sm font-bold rounded-xl disabled:opacity-50"
        >
          {busy === 'create' ? <Loader2 className="w-4 h-4 animate-spin inline" aria-hidden="true" /> : 'Créer'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <Users className="w-6 h-6 text-gray-500 mb-3" aria-hidden="true" />
        <h2 className="font-black text-gray-900">Rejoindre une organisation</h2>
        <p className="text-xs text-gray-500 mt-1 mb-4">Entrez le code d'invitation transmis par votre administrateur.</p>
        <label htmlFor="org-code" className="block text-sm font-semibold text-gray-700 mb-1.5">Code d'invitation</label>
        <input
          id="org-code" type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="Ex : A0871DD0" maxLength={8}
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl font-mono tracking-widest focus:ring-2 focus:ring-brand-500 outline-none"
        />
        <button
          onClick={async () => {
            setBusy('join'); setError('');
            const { error: err } = await joinOrganization(code);
            setBusy(null);
            if (err) setError(err); else onDone();
          }}
          disabled={busy !== null || code.trim().length < 6}
          className="mt-3 w-full py-2.5 text-sm font-bold rounded-xl bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50"
        >
          {busy === 'join' ? <Loader2 className="w-4 h-4 animate-spin inline" aria-hidden="true" /> : 'Rejoindre'}
        </button>
      </div>

      {error && <p className="md:col-span-2 text-sm text-red-600 font-semibold" role="alert">{error}</p>}
    </div>
  );
}

/* ---------- En-tête organisation + code ---------- */
function OrgHeader({ org, myRole, onRotated }: { org: Organization; myRole: OrgRole; onRotated: (code: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [rotating, setRotating] = useState(false);
  const canManage = myRole === 'owner' || myRole === 'admin';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-lg" aria-hidden="true">
            {org.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-black text-gray-900">{org.name}</h2>
            <p className="text-xs text-gray-500">
              Votre rôle : {ORG_ROLE_META[myRole].emoji} {ORG_ROLE_META[myRole].label}
            </p>
          </div>
        </div>

        {canManage && (
          <div className="text-right">
            <p className="text-[11px] font-bold text-gray-500 uppercase">Code d'invitation</p>
            <div className="flex items-center gap-2 mt-1">
              <code className="font-mono font-black text-brand-700 bg-brand-50 border border-brand-200 rounded-lg px-3 py-1.5 tracking-widest">
                {org.invite_code}
              </code>
              <button
                onClick={async () => { await navigator.clipboard.writeText(org.invite_code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                aria-label="Copier le code d'invitation"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" /> : <Copy className="w-4 h-4 text-gray-500" aria-hidden="true" />}
              </button>
              <button
                onClick={async () => { setRotating(true); const { code } = await rotateInviteCode(org.id); setRotating(false); if (code) onRotated(code); }}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                aria-label="Régénérer le code d'invitation"
                title="Régénérer (invalide l'ancien code)"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 ${rotating ? 'animate-spin' : ''}`} aria-hidden="true" />
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Partagez ce code avec vos collègues pour qu'ils rejoignent l'organisation.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Liste des membres ---------- */
function MembersList({ members, myRole, myUserId, onChanged }: {
  members: OrgMember[]; myRole: OrgRole; myUserId: string; onChanged: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const canManage = myRole === 'owner' || myRole === 'admin';

  const act = async (key: string, fn: () => Promise<string | null>) => {
    setBusy(key);
    const err = await fn();
    setBusy(null);
    if (err) alert(err); else onChanged();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="flex items-center gap-2 font-black text-gray-900 mb-4">
        <Users className="w-4 h-4 text-brand-600" aria-hidden="true" /> Membres ({members.length})
      </h3>
      <ul className="divide-y divide-gray-50">
        {members.map(m => {
          const RoleIcon = ROLE_ICONS[m.role];
          const isMe = m.user_id === myUserId;
          return (
            <li key={m.id} className="py-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-black text-xs text-gray-600" aria-hidden="true">
                  {(m.profile?.full_name ?? m.profile?.email ?? '?').slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {m.profile?.full_name ?? m.profile?.email ?? 'Utilisateur'} {isMe && <span className="text-gray-400 font-medium">(vous)</span>}
                  </p>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                    <RoleIcon className="w-3 h-3" aria-hidden="true" /> {ORG_ROLE_META[m.role].label} · depuis le {new Date(m.joined_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {myRole === 'owner' && !isMe && (
                  <select
                    value={m.role}
                    onChange={e => void act(`role-${m.id}`, () => setMemberRole(m.user_id, e.target.value as OrgRole))}
                    disabled={busy !== null}
                    className="text-xs font-bold border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                    aria-label={`Rôle de ${m.profile?.full_name ?? 'ce membre'}`}
                  >
                    <option value="owner">👑 Propriétaire</option>
                    <option value="admin">🛡️ Administrateur</option>
                    <option value="member">👤 Membre</option>
                  </select>
                )}
                {((canManage && !isMe && m.role !== 'owner') || isMe) && (
                  <button
                    onClick={() => {
                      if (confirm(isMe ? 'Quitter l\'organisation ?' : `Retirer ${m.profile?.full_name ?? 'ce membre'} ?`)) {
                        void act(`rm-${m.id}`, () => removeMember(m.user_id));
                      }
                    }}
                    disabled={busy !== null}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                    aria-label={isMe ? 'Quitter l\'organisation' : `Retirer ${m.profile?.full_name ?? 'ce membre'}`}
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- Pondérations entreprise ---------- */
function OrgWeightsEditor({ org, onSaved }: { org: Organization; onSaved: () => void }) {
  const [weights, setWeights] = useState<BuyerWeights>(orgWeights(org));
  const [enforced, setEnforced] = useState(org.weights_enforced);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="flex items-center gap-2 font-black text-gray-900">
        <SlidersHorizontal className="w-4 h-4 text-brand-600" aria-hidden="true" /> Règles de décision de l'entreprise
      </h3>
      <p className="text-xs text-gray-500 mt-1 mb-5">
        Ces pondérations s'appliquent au classement des fournisseurs pour toute l'équipe —
        par défaut, ou de manière imposée (politique achats).
      </p>

      <div className="space-y-4">
        {(Object.keys(WEIGHT_LABELS) as (keyof BuyerWeights)[]).map(k => (
          <div key={k}>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor={`org-w-${k}`} className="text-sm font-semibold text-gray-700">{WEIGHT_LABELS[k]}</label>
              <span className="text-sm font-black text-gray-900 tabular-nums">{weights[k]}%</span>
            </div>
            <input
              id={`org-w-${k}`} type="range" min="0" max="100" step="5"
              value={weights[k]}
              onChange={e => setWeights(w => ({ ...w, [k]: parseInt(e.target.value, 10) }))}
              className="w-full accent-brand-600"
              aria-valuemin={0} aria-valuemax={100} aria-valuenow={weights[k]}
            />
          </div>
        ))}
      </div>

      <p className={`mt-4 text-sm font-bold ${sum === 100 ? 'text-emerald-700' : 'text-red-600'}`} role="status">
        Total : {sum}% {sum !== 100 && '(doit faire 100%)'}
      </p>

      <label className="mt-4 flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input type="checkbox" checked={enforced} onChange={e => setEnforced(e.target.checked)} className="accent-brand-600 w-4 h-4" />
        <span><strong>Imposer ces règles</strong> à tous les membres (elles remplacent leurs règles personnelles)</span>
      </label>

      {error && <p className="mt-2 text-sm text-red-600 font-semibold" role="alert">{error}</p>}

      <button
        onClick={async () => {
          setSaving(true); setError('');
          const err = await saveOrgWeights(org.id, weights, enforced);
          setSaving(false);
          if (err) setError(err); else onSaved();
        }}
        disabled={saving || sum !== 100}
        className="mt-4 btn-primary px-5 py-2.5 text-sm font-bold rounded-xl disabled:opacity-50"
      >
        {saving ? 'Enregistrement…' : 'Enregistrer les règles entreprise'}
      </button>
    </div>
  );
}
