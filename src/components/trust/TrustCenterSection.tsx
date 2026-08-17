// =============================================================
// EthiMarket Trust Center — Section publique de la page produit
// « Pourquoi ce produit est-il considéré comme responsable ? »
// Chaque allégation → une ClaimCard sourcée. Jamais de badge
// global sans détail.
// =============================================================

import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion, Scale, ExternalLink } from 'lucide-react';
import { getProductClaims } from '../../lib/trust/trustCenterService';
import { ProductClaim, ClaimEvaluation, ProductTrustSummary } from '../../lib/trust/types';
import ClaimCard from './ClaimCard';
import { useI18n } from '../../lib/i18n';

type LoadedClaim = ProductClaim & { evaluation: ClaimEvaluation };

const BADGE_CONFIG: Record<ProductTrustSummary['overall_badge'], {
  labelKey: string;
  icon: typeof ShieldCheck;
  className: string;
}> = {
  verified_majority: {
    labelKey: 'trust.badgeVerifiedMajority',
    icon: ShieldCheck,
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  partially_verified: {
    labelKey: 'trust.badgePartial',
    icon: Scale,
    className: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  declarations_only: {
    labelKey: 'trust.badgeDeclarations',
    icon: ShieldAlert,
    className: 'bg-amber-50 text-amber-900 border-amber-300',
  },
  issues_found: {
    labelKey: 'trust.badgeIssues',
    icon: ShieldAlert,
    className: 'bg-red-50 text-red-800 border-red-300',
  },
  no_claims: {
    labelKey: 'trust.badgeNoClaims',
    icon: ShieldQuestion,
    className: 'bg-gray-50 text-gray-700 border-gray-200',
  },
};

export function TrustSummaryBadge({ summary }: { summary: ProductTrustSummary }) {
  const { t } = useI18n();
  const cfg = BADGE_CONFIG[summary.overall_badge];
  const Icon = cfg.icon;
  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${cfg.className}`}>
      <Icon className="h-4 w-4" aria-hidden />
      <span>{t(cfg.labelKey)}</span>
      {summary.total_claims > 0 && (
        <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold">
          {summary.verified_claims}/{summary.total_claims} {t('trust.verifiedCount')}
        </span>
      )}
    </div>
  );
}

interface TrustCenterSectionProps {
  productId: string;
}

export default function TrustCenterSection({ productId }: TrustCenterSectionProps) {
  const { t } = useI18n();
  const [claims, setClaims] = useState<LoadedClaim[]>([]);
  const [summary, setSummary] = useState<ProductTrustSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProductClaims(productId).then(res => {
      if (cancelled) return;
      setClaims(res.claims);
      setSummary(res.summary);
      setError(res.error);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [productId]);

  if (loading) {
    return (
      <section aria-label="Centre de confiance" className="animate-pulse space-y-3">
        <div className="h-6 w-64 rounded bg-gray-200" />
        <div className="h-28 rounded-xl bg-gray-100" />
        <div className="h-28 rounded-xl bg-gray-100" />
      </section>
    );
  }

  return (
    <section aria-label="Centre de confiance" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {t('trust.whyResponsible')}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {t('trust.everySource')}
          </p>
        </div>
        {summary && <TrustSummaryBadge summary={summary} />}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {!error && claims.length === 0 && (
        <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          {t('trust.noClaimsText')}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {claims.map(claim => (
          <ClaimCard key={claim.id} claim={claim} />
        ))}
      </div>

      <a
        href="/trust-center"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-900"
      >
        {t('trust.methodology')}
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      </a>
    </section>
  );
}
