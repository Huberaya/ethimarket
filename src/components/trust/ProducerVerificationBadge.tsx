// =============================================================
// EthiMarket — Vitrine publique des vérifications producteur
//
// Affiche aux ACHETEURS ce que le protocole EthiMarket Verified
// a réellement contrôlé : quels critères sont prouvés, par
// quelles méthodes, à quelles dates — sans exposer les notes
// internes ni les références (fonction SQL anonymisée).
// Transparence = personne ne demande de nous croire sur parole.
// =============================================================

import { useEffect, useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useI18n } from '../../lib/i18n';

interface TrustSummary {
  criteria: Record<string, boolean>;
  checks: { criterion: string; method: string; checked_on: string }[];
  checks_count: number;
  last_check_at: string | null;
}

const CRITERION_LABEL_KEYS: Record<string, string> = {
  identityVerified: 'tv.critIdentity',
  businessDocsCompliant: 'tv.critBusiness',
  certificationValid: 'tv.critCertification',
  farmPhotosCoherent: 'tv.critFarm',
  ethicalEngagementSatisfactory: 'tv.critEthics',
  charterSigned: 'tv.critCharter',
};

const METHOD_LABEL_KEYS: Record<string, string> = {
  registry_lookup: 'tv.mRegistry',
  issuer_confirmation: 'tv.mIssuer',
  video_call: 'tv.mVideo',
  selfie_id_match: 'tv.mSelfie',
  phone_verification: 'tv.mPhone',
  photo_challenge: 'tv.mChallenge',
  exif_analysis: 'tv.mExif',
  satellite_check: 'tv.mSatellite',
  reverse_image_search: 'tv.mReverse',
  peer_attestation: 'tv.mPeer',
  document_review: 'tv.mDocument',
  other: 'tv.mOther',
};

const METHOD_EMOJI: Record<string, string> = {
  registry_lookup: '🏛️', issuer_confirmation: '📧', video_call: '📹',
  selfie_id_match: '🤳', phone_verification: '📞', photo_challenge: '📸',
  exif_analysis: '🔬', satellite_check: '🛰️', reverse_image_search: '🔎',
  peer_attestation: '🤝', document_review: '📄', other: '🧩',
};

export default function ProducerVerificationBadge({ producerId }: { producerId: string }) {
  const { t, locale } = useI18n();
  const [summary, setSummary] = useState<TrustSummary | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase.rpc('get_producer_trust_summary', { p_producer_id: producerId })
      .then(({ data }) => {
        if (!cancelled && data) setSummary(data as unknown as TrustSummary);
      });
    return () => { cancelled = true; };
  }, [producerId]);

  // Rien à montrer tant qu'aucun contrôle n'a été passé — pas de
  // badge vide qui ferait douter.
  if (!summary || summary.checks_count === 0) return null;

  const provenCriteria = Object.entries(summary.criteria ?? {}).filter(([, v]) => v).map(([k]) => k);
  const dateLocale = locale === 'fr' ? 'fr-FR' : locale;

  return (
    <div className="bg-white rounded-2xl border border-emerald-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-emerald-50/60 hover:bg-emerald-50 transition-colors cursor-pointer text-start"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-sm">{t('tv.title')}</p>
          <p className="text-xs text-gray-500">
            {t('tv.summary', { checks: String(summary.checks_count), criteria: String(provenCriteria.length) })}
          </p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>

      {open && (
        <div className="px-5 py-4 space-y-4">
          {/* Critères prouvés */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wide mb-2">{t('tv.criteriaTitle')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {provenCriteria.map(c => (
                <p key={c} className="text-xs text-gray-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {t(CRITERION_LABEL_KEYS[c] ?? c)}
                </p>
              ))}
            </div>
          </div>

          {/* Journal des contrôles */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wide mb-2">{t('tv.checksTitle')}</p>
            <div className="space-y-1">
              {summary.checks.slice(-8).reverse().map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5">
                  <span>{METHOD_EMOJI[c.method] ?? '🧩'}</span>
                  <span className="font-semibold">{t(METHOD_LABEL_KEYS[c.method] ?? 'tv.mOther')}</span>
                  <span className="text-gray-400 ms-auto">{new Date(c.checked_on).toLocaleDateString(dateLocale)}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-gray-400 leading-relaxed">
            {t('tv.disclaimer')}
          </p>
        </div>
      )}
    </div>
  );
}
