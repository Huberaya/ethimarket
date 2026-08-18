// =============================================================
// EthiMarket — Checklist à preuves (remplace la checklist cochable)
//
// Chaque critère affiche son état PROUVÉ / NON PROUVÉ, dérivé
// exclusivement des preuves enregistrées (immuables). L'auditeur
// ne coche plus : il ATTACHE une preuve (méthode + référence +
// constat + verdict). Le formulaire guide vers les méthodes
// recommandées et les registres publics officiels.
// =============================================================

import { useState } from 'react';
import {
  CheckCircle2, Circle, Plus, ExternalLink, Loader2,
  ShieldCheck, ShieldX, ShieldQuestion, ChevronDown, ChevronUp,
} from 'lucide-react';
import {
  VerificationEvidence, EvidenceCriterion, EvidenceType, EvidenceOutcome,
  EVIDENCE_TYPE_META, RECOMMENDED_EVIDENCE, PUBLIC_REGISTRIES,
  isCriterionProven, addEvidence,
} from '../../lib/verificationEvidence';

const CRITERIA: { key: EvidenceCriterion; label: string }[] = [
  { key: 'identityVerified', label: 'Identité vérifiée (CNI / Passeport officiel en cours de validité)' },
  { key: 'businessDocsCompliant', label: 'Documents entreprise conformes (Registre du commerce / Statuts)' },
  { key: 'certificationValid', label: 'Au moins 1 certification valide (Bio / Fairtrade / Rainforest)' },
  { key: 'farmPhotosCoherent', label: 'Photos exploitation et coordonnées GPS cohérentes' },
  { key: 'ethicalEngagementSatisfactory', label: 'Engagement éthique satisfaisant (Salaire min, absence travail des enfants)' },
  { key: 'charterSigned', label: 'Charte éthique EthiMarket signée' },
];

const OUTCOME_META: Record<EvidenceOutcome, { label: string; cls: string; icon: typeof ShieldCheck }> = {
  pass: { label: 'Conforme', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: ShieldCheck },
  fail: { label: 'Non conforme', cls: 'text-red-700 bg-red-50 border-red-200', icon: ShieldX },
  inconclusive: { label: 'Non concluant', cls: 'text-amber-700 bg-amber-50 border-amber-200', icon: ShieldQuestion },
};

export function EvidenceChecklist({
  producerId, evidences, onEvidenceAdded, disabled = false,
}: {
  producerId: string;
  evidences: VerificationEvidence[];
  onEvidenceAdded: () => void;
  disabled?: boolean;
}) {
  const [openCriterion, setOpenCriterion] = useState<EvidenceCriterion | null>(null);
  const [addingFor, setAddingFor] = useState<EvidenceCriterion | null>(null);

  const provenCount = CRITERIA.filter(c => isCriterionProven(evidences, c.key)).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <span>🔏</span> Checklist à preuves — EthiMarket Verified
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Un critère n'est validé que par une preuve enregistrée (méthode + référence + constat). Les preuves sont immuables et opposables.
          </p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          provenCount === CRITERIA.length ? 'bg-brand-100 text-brand-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {provenCount}/{CRITERIA.length} prouvés
        </span>
      </div>

      <div className="space-y-2.5">
        {CRITERIA.map(({ key, label }) => {
          const proven = isCriterionProven(evidences, key);
          const list = evidences.filter(e => e.criterion === key);
          const isOpen = openCriterion === key;
          return (
            <div key={key} className={`rounded-xl border ${proven ? 'border-emerald-200 bg-emerald-50/40' : 'border-gray-200 bg-gray-50/40'}`}>
              <button
                type="button"
                onClick={() => setOpenCriterion(isOpen ? null : key)}
                className="w-full flex items-center gap-3 px-4 py-3 text-start cursor-pointer"
              >
                {proven
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  : <Circle className="w-5 h-5 text-gray-300 shrink-0" />}
                <span className="flex-1 text-sm font-semibold text-gray-800">{label}</span>
                <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">
                  {list.length} preuve{list.length > 1 ? 's' : ''}
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Preuves existantes */}
                  {list.length === 0 && (
                    <p className="text-xs text-gray-500 italic">Aucune preuve enregistrée pour ce critère.</p>
                  )}
                  {list.map(e => {
                    const om = OUTCOME_META[e.outcome];
                    const tm = EVIDENCE_TYPE_META[e.evidence_type];
                    const OIcon = om.icon;
                    return (
                      <div key={e.id} className="bg-white rounded-lg border border-gray-100 p-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm">{tm.emoji}</span>
                          <span className="text-xs font-bold text-gray-800">{tm.label}</span>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${om.cls}`}>
                            <OIcon className="w-3 h-3" /> {om.label}
                          </span>
                          <span className="text-[10px] text-gray-400 ms-auto">
                            {new Date(e.created_at).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1.5">{e.note}</p>
                        {e.reference && (
                          e.reference.startsWith('http')
                            ? <a href={e.reference} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:underline mt-1">
                                <ExternalLink className="w-3 h-3" /> {e.reference.slice(0, 60)}{e.reference.length > 60 ? '…' : ''}
                              </a>
                            : <p className="text-[11px] text-gray-500 mt-1">Réf : {e.reference}</p>
                        )}
                      </div>
                    );
                  })}

                  {/* Ajout de preuve */}
                  {!disabled && (addingFor === key
                    ? <EvidenceForm
                        producerId={producerId}
                        criterion={key}
                        onDone={() => { setAddingFor(null); onEvidenceAdded(); }}
                        onCancel={() => setAddingFor(null)}
                      />
                    : <button
                        type="button"
                        onClick={() => setAddingFor(key)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-2 rounded-lg cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Attacher une preuve
                      </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Registres publics de référence */}
      <details className="pt-1">
        <summary className="text-[11px] font-bold text-gray-500 cursor-pointer hover:text-gray-700">
          🏛️ Registres publics officiels (vérification à la source)
        </summary>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {PUBLIC_REGISTRIES.map(r => (
            <a key={r.url} href={r.url} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-[11px] text-gray-600 hover:text-brand-700 bg-gray-50 hover:bg-brand-50 rounded-lg px-2.5 py-1.5">
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="font-semibold">{r.label}</span>
              <span className="text-gray-400 ms-auto">{r.scope}</span>
            </a>
          ))}
        </div>
      </details>
    </div>
  );
}

/* ---- Formulaire d'ajout de preuve ---- */
function EvidenceForm({
  producerId, criterion, onDone, onCancel,
}: {
  producerId: string;
  criterion: EvidenceCriterion;
  onDone: () => void;
  onCancel: () => void;
}) {
  const recommended = RECOMMENDED_EVIDENCE[criterion];
  const [evidenceType, setEvidenceType] = useState<EvidenceType>(recommended[0]);
  const [reference, setReference] = useState('');
  const [note, setNote] = useState('');
  const [outcome, setOutcome] = useState<EvidenceOutcome>('pass');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const allTypes = Object.keys(EVIDENCE_TYPE_META) as EvidenceType[];
  const ordered = [...recommended, ...allTypes.filter(t => !recommended.includes(t))];

  const submit = async () => {
    if (note.trim().length < 10) {
      setError('Le constat doit décrire ce qui a été vérifié (10 caractères minimum).');
      return;
    }
    setSaving(true);
    setError('');
    const err = await addEvidence({ producerId, criterion, evidenceType, reference, note, outcome });
    setSaving(false);
    if (err) { setError(err); return; }
    onDone();
  };

  return (
    <div className="bg-white rounded-xl border-2 border-brand-200 p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">Méthode de vérification</label>
          <select value={evidenceType} onChange={e => setEvidenceType(e.target.value as EvidenceType)}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white">
            {ordered.map(t => (
              <option key={t} value={t}>
                {EVIDENCE_TYPE_META[t].emoji} {EVIDENCE_TYPE_META[t].label}{recommended.includes(t) ? ' (recommandé)' : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">Verdict</label>
          <select value={outcome} onChange={e => setOutcome(e.target.value as EvidenceOutcome)}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white">
            <option value="pass">✅ Conforme</option>
            <option value="fail">❌ Non conforme</option>
            <option value="inconclusive">❓ Non concluant</option>
          </select>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5">
        💡 {EVIDENCE_TYPE_META[evidenceType].hint}
      </p>

      <div>
        <label className="block text-[11px] font-bold text-gray-600 mb-1">Référence vérifiable (URL du registre, n° confirmé…)</label>
        <input value={reference} onChange={e => setReference(e.target.value)}
          placeholder="https://… ou référence"
          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
      </div>
      <div>
        <label className="block text-[11px] font-bold text-gray-600 mb-1">Constat de l'auditeur (obligatoire)</label>
        <textarea rows={2} value={note} onChange={e => setNote(e.target.value)}
          placeholder="Ex : Certificat FLO ID 12345 retrouvé sur FLOCERT Customer Search, périmètre cacao, valide jusqu'au 12/03/2027 — cohérent avec le PDF fourni."
          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none resize-none" />
      </div>

      {error && <p className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">{error}</p>}

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-2 text-xs font-bold text-gray-500 cursor-pointer">Annuler</button>
        <button type="button" onClick={submit} disabled={saving}
          className="px-4 py-2 text-xs font-black rounded-lg bg-brand-600 text-white hover:bg-brand-700 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Enregistrer la preuve
        </button>
      </div>
    </div>
  );
}
