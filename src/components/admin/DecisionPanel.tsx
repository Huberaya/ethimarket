import { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, ShieldAlert, Lock, Loader2, Award } from 'lucide-react';
import { type VerificationChecklistState } from './VerificationChecklist';
import { EvidenceChecklist } from './EvidenceChecklist';
import { PhotoChallengePanel } from './PhotoChallengePanel';
import {
  VerificationEvidence, PhotoChallenge,
  checklistFromEvidences, allCriteriaProven, trustLevel,
} from '../../lib/verificationEvidence';

interface DecisionPanelProps {
  producerId: string;
  currentStatus: string;
  evidences: VerificationEvidence[];
  challenges: PhotoChallenge[];
  onEvidenceChanged: () => void;
  onApprove: (internalNotes: string, producerComment: string, checklist: VerificationChecklistState) => Promise<void>;
  onReject: (internalNotes: string, producerComment: string, checklist: VerificationChecklistState) => Promise<void>;
  onRequestChanges: (internalNotes: string, producerComment: string, checklist: VerificationChecklistState) => Promise<void>;
  loading?: boolean;
}

const TRUST_LEVEL_META = {
  none:   { label: 'Insuffisant', emoji: '⛔', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  bronze: { label: 'Bronze — documents vérifiés à la source', emoji: '🥉', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  silver: { label: 'Argent — + preuve de terrain', emoji: '🥈', cls: 'bg-slate-100 text-slate-700 border-slate-300' },
  gold:   { label: 'Or — + triangulation humaine', emoji: '🥇', cls: 'bg-yellow-50 text-yellow-800 border-yellow-300' },
} as const;

export function DecisionPanel({
  producerId,
  evidences,
  challenges,
  onEvidenceChanged,
  onApprove,
  onReject,
  onRequestChanges,
  loading = false,
}: DecisionPanelProps) {
  const [internalNotes, setInternalNotes] = useState('');
  const [producerComment, setProducerComment] = useState('');

  // La checklist n'est plus cochable : elle est DÉRIVÉE des preuves.
  const checklist = checklistFromEvidences(evidences);
  const allProven = allCriteriaProven(evidences);
  const level = trustLevel(evidences);
  const levelMeta = TRUST_LEVEL_META[level];

  const handleAction = async (action: 'approve' | 'reject' | 'changes') => {
    if (action === 'approve') {
      await onApprove(internalNotes, producerComment, checklist);
    } else if (action === 'reject') {
      await onReject(internalNotes, producerComment, checklist);
    } else {
      await onRequestChanges(internalNotes, producerComment, checklist);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-lg space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
          ⚖️
        </div>
        <div className="flex-1">
          <h3 className="font-black text-gray-900 text-base">SECTION G : DÉCISION FINALE D'AUDIT</h3>
          <p className="text-xs text-gray-500">
            Validation selon le protocole « EthiMarket Verified » — chaque critère exige une preuve enregistrée.
          </p>
        </div>
        {/* Niveau de confiance atteint */}
        <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full border ${levelMeta.cls}`}>
          <Award className="w-3.5 h-3.5" /> {levelMeta.emoji} {levelMeta.label}
        </span>
      </div>

      {/* Checklist à preuves */}
      <EvidenceChecklist
        producerId={producerId}
        evidences={evidences}
        onEvidenceAdded={onEvidenceChanged}
        disabled={loading}
      />

      {/* Défis photo géolocalisés */}
      <PhotoChallengePanel
        producerId={producerId}
        challenges={challenges}
        onChanged={onEvidenceChanged}
        disabled={loading}
      />

      {/* Internal Notes */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-gray-400" />
          Notes d'audit internes (Confidentielles — Non visibles par le producteur)
        </label>
        <textarea
          rows={3}
          value={internalNotes}
          onChange={e => setInternalNotes(e.target.value)}
          placeholder="Remarques de synthèse de l'auditeur (les vérifications elles-mêmes sont documentées preuve par preuve ci-dessus)…"
          className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-gray-50/50 resize-none"
        />
      </div>

      {/* Comment for Producer */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-700">
          Commentaire pour le producteur (Inclus dans l'email & l'interface du producteur)
        </label>
        <textarea
          rows={3}
          value={producerComment}
          onChange={e => setProducerComment(e.target.value)}
          placeholder="Précisez les points forts ou les corrections nécessaires (ex: Merci de fournir une photo plus nette de votre CNI et le certificat Bio renouvelé)."
          className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white resize-none"
        />
      </div>

      {!allProven && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            L'approbation est verrouillée tant que chaque critère n'a pas au moins une preuve conforme enregistrée.
            Vous pouvez rejeter ou demander des modifications à tout moment.
          </span>
        </div>
      )}

      {/* Decision Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          type="button"
          disabled={loading || !allProven}
          onClick={() => handleAction('approve')}
          className="btn-primary py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed bg-brand-600 hover:bg-brand-700 text-white"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>APPROUVER DOSSIER</span>
        </button>

        <button
          type="button"
          disabled={loading || (!producerComment && !internalNotes)}
          onClick={() => handleAction('reject')}
          className="py-3.5 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 text-white shadow-sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
          <span>REJETER DOSSIER</span>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleAction('changes')}
          className="py-3.5 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>DEMANDER MODIFICATIONS</span>
        </button>
      </div>
    </div>
  );
}
