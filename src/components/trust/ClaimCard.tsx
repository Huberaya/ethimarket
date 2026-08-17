// =============================================================
// EthiMarket Trust Center — ClaimCard
// Affiche UNE allégation avec son statut calculé et ses sources,
// conforme à la maquette :
//
//   Coton biologique
//   ✅ Certifié
//   📄 Certification : GOTS-2024-08-1234
//   📅 Valide jusqu'au : 12/03/2027
//   🏢 Organisme : Ecocert Greenlife
//   🔗 Source : document officiel
//
// et pour une allégation non prouvée :
//   ⚠️ Déclaration fournisseur — preuve indépendante non trouvée.
// =============================================================

import { useState } from 'react';
import {
  ShieldCheck, AlertTriangle, Clock, XCircle, CalendarX,
  FileText, Calendar, Building2, Link as LinkIcon, ChevronDown, Info,
} from 'lucide-react';
import { ProductClaim, ClaimEvaluation, ClaimVerificationStatus, EVIDENCE_TYPE_LABELS, EVIDENCE_LEVEL } from '../../lib/trust/types';
import { formatDateFr, DECLARED_ONLY_MESSAGE } from '../../lib/trust/evaluateClaim';
import { useI18n } from '../../lib/i18n';

const STATUS_CONFIG: Record<ClaimVerificationStatus, {
  labelKey: string;
  icon: typeof ShieldCheck;
  chipClass: string;
  borderClass: string;
}> = {
  verified: {
    labelKey: 'trust.certified',
    icon: ShieldCheck,
    chipClass: 'bg-emerald-100 text-emerald-800',
    borderClass: 'border-emerald-200',
  },
  pending_verification: {
    labelKey: 'trust.pending',
    icon: Clock,
    chipClass: 'bg-blue-100 text-blue-800',
    borderClass: 'border-blue-200',
  },
  declared_only: {
    labelKey: 'trust.declaredOnly',
    icon: AlertTriangle,
    chipClass: 'bg-amber-100 text-amber-800',
    borderClass: 'border-amber-300',
  },
  expired: {
    labelKey: 'trust.expired',
    icon: CalendarX,
    chipClass: 'bg-orange-100 text-orange-800',
    borderClass: 'border-orange-300',
  },
  contradicted: {
    labelKey: 'trust.contradicted',
    icon: XCircle,
    chipClass: 'bg-red-100 text-red-800',
    borderClass: 'border-red-300',
  },
};

interface ClaimCardProps {
  claim: ProductClaim & { evaluation: ClaimEvaluation };
}

export default function ClaimCard({ claim }: ClaimCardProps) {
  const { t } = useI18n();
  const [showAllEvidence, setShowAllEvidence] = useState(false);
  const cfg = STATUS_CONFIG[claim.verification_status];
  const Icon = cfg.icon;
  const deciding = claim.evaluation.decidingEvidence;
  const isVerified = claim.verification_status === 'verified';
  const isDeclaredOnly = claim.verification_status === 'declared_only';

  return (
    <div className={`rounded-xl border ${cfg.borderClass} bg-white p-5 shadow-sm`}>
      {/* Titre de l'allégation */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-gray-900">{claim.claim_label}</h4>
          {claim.claim_value && (
            <p className="text-sm text-gray-600 mt-0.5">{claim.claim_value}</p>
          )}
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.chipClass}`}>
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {t(cfg.labelKey)}
        </span>
      </div>

      {/* ---- ÉTAT VÉRIFIÉ : la fiche source complète ---- */}
      {isVerified && deciding && (
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden />
            <dt className="sr-only">{t('trust.status')}</dt>
            <dd className="font-medium text-emerald-800">{t('trust.certified')}</dd>
          </div>
          {deciding.reference_number && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" aria-hidden />
              <dt className="text-gray-600">{t('trust.certification')}</dt>
              <dd className="font-medium text-gray-900">{deciding.reference_number}</dd>
            </div>
          )}
          {deciding.valid_until && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" aria-hidden />
              <dt className="text-gray-600">{t('trust.validUntil')}</dt>
              <dd className="font-medium text-gray-900">{formatDateFr(deciding.valid_until)}</dd>
            </div>
          )}
          {deciding.issuing_body_name && (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" aria-hidden />
              <dt className="text-gray-600">{t('trust.body')}</dt>
              <dd className="font-medium text-gray-900">{deciding.issuing_body_name}</dd>
            </div>
          )}
          {(deciding.source_url || deciding.document_path) && (
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-gray-500" aria-hidden />
              <dt className="text-gray-600">{t('trust.source')}</dt>
              <dd>
                {deciding.source_url && (
                  <a
                    href={deciding.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
                  >
                    {t('trust.officialDoc')}
                  </a>
                )}
                {deciding.source_url && deciding.document_path && <span className="text-gray-400"> · </span>}
                {deciding.document_path && (
                  <a
                    href={deciding.document_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
                  >
                    {t('trust.filedCert')}
                  </a>
                )}
              </dd>
            </div>
          )}
          <p className="pt-1 text-xs text-gray-500">{claim.evaluation.publicExplanation}</p>
        </dl>
      )}

      {/* ---- ÉTAT DÉCLARATIF : l'avertissement, texte exact ---- */}
      {isDeclaredOnly && (
        <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
          <p className="flex items-start gap-2 text-sm font-medium text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {DECLARED_ONLY_MESSAGE}
          </p>
          <p className="mt-2 flex items-start gap-2 text-xs text-amber-800">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            {t('trust.declaredInfo')}
          </p>
        </div>
      )}

      {/* ---- AUTRES ÉTATS : explication du moteur ---- */}
      {!isVerified && !isDeclaredOnly && (
        <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-3">
          <p className="text-sm text-gray-800">{claim.evaluation.publicExplanation}</p>
          {claim.verification_status === 'expired' && deciding?.reference_number && (
            <p className="mt-1 text-xs text-gray-500">
              {t('trust.oldCert')} {deciding.reference_number}
              {deciding.issuing_body_name ? ` (${deciding.issuing_body_name})` : ''}
            </p>
          )}
        </div>
      )}

      {/* ---- Toutes les preuves (dépliable) ---- */}
      {claim.evidence.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowAllEvidence(v => !v)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800"
            aria-expanded={showAllEvidence}
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAllEvidence ? 'rotate-180' : ''}`} aria-hidden />
            {claim.evidence.length} {t('trust.evidenceOnFile')}
          </button>
          {showAllEvidence && (
            <ul className="mt-2 space-y-1.5">
              {claim.evidence.map(e => (
                <li key={e.id} className="flex items-start gap-2 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-700">
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600">
                    {EVIDENCE_LEVEL[e.evidence_type]}
                  </span>
                  <span>
                    <span className="font-medium">{EVIDENCE_TYPE_LABELS[e.evidence_type]}</span>
                    {e.reference_number && <> — {e.reference_number}</>}
                    {e.checked_at && (
                      <span className="text-gray-500"> · contrôlé le {formatDateFr(e.checked_at)}{e.checked_by_name ? ` par ${e.checked_by_name}` : ''}</span>
                    )}
                    {e.check_result === 'rejected' && <span className="ml-1 font-semibold text-red-700">{t('trust.rejected')}</span>}
                    {e.source_url && (
                      <> · <a href={e.source_url} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">source</a></>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
