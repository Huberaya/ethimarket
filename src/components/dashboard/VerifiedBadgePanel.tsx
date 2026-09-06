import { useState } from 'react';
import { ShieldCheck, Copy, Check, Lock } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import {
  BADGE_VARIANTS, badgeImageUrl, badgeHtmlSnippet,
  badgeMarkdownSnippet, badgeEmailSignature, badgeShopUrl, type BadgeVariant,
} from '../../lib/badgeEmbed';

/**
 * Panneau « Badge vérifié » de l'espace producteur (growth loop #4).
 * N'offre le code d'intégration QUE si le producteur est vérifié —
 * sinon il montre ce qui l'attend (incitation à finir la vérification).
 */

interface Props {
  slug: string;
  verified: boolean;
}

export default function VerifiedBadgePanel({ slug, verified }: Props) {
  const { tx } = useI18n();
  const [variant, setVariant] = useState<BadgeVariant>('fr');
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (id: string, text: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* indisponible */ }
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const snippets: { id: string; label: string; value: string }[] = [
    { id: 'html', label: tx('Code HTML (site web)'), value: badgeHtmlSnippet(slug, variant) },
    { id: 'md', label: 'Markdown', value: badgeMarkdownSnippet(slug, variant) },
    { id: 'sig', label: tx('Signature e-mail (texte)'), value: badgeEmailSignature(slug, variant) },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-1">
        <ShieldCheck className={`w-5 h-5 ${verified ? 'text-emerald-600' : 'text-gray-300'}`} />
        {tx('Votre badge « Producteur vérifié »')}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {verified
          ? tx('Affichez votre vérification sur votre site, vos e-mails, vos catalogues — le badge renvoie vers votre boutique et ses preuves.')
          : tx('Une fois votre vérification terminée, vous pourrez afficher ce badge sur votre site et vos e-mails, avec un lien vers vos preuves publiques.')}
      </p>

      {/* Aperçu */}
      <div className={`rounded-xl border border-gray-100 bg-gray-50 p-5 flex items-center justify-center mb-4 ${verified ? '' : 'opacity-50 grayscale'}`}>
        <img src={badgeImageUrl(variant).replace('https://ethimarket.vercel.app', '')} alt={tx('Aperçu du badge')} width={230} height={56} />
      </div>

      {!verified ? (
        <p className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          <Lock className="w-3.5 h-3.5" /> {tx('Disponible après vérification de votre boutique.')}
        </p>
      ) : (
        <>
          {/* Variantes */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {BADGE_VARIANTS.map(v => (
              <button key={v.id} type="button" onClick={() => setVariant(v.id)}
                className={`text-[11px] font-black px-3 py-1.5 rounded-lg border-2 cursor-pointer ${variant === v.id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 bg-white text-gray-500'}`}>
                {v.label}
              </button>
            ))}
          </div>

          {/* Snippets */}
          <div className="space-y-3">
            {snippets.map(s => (
              <div key={s.id}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] font-black text-gray-500 uppercase tracking-wide">{s.label}</p>
                  <button type="button" onClick={() => void copy(s.id, s.value)}
                    className="inline-flex items-center gap-1 text-[11px] font-black text-brand-700 cursor-pointer">
                    {copied === s.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === s.id ? tx('Copié !') : tx('Copier')}
                  </button>
                </div>
                <pre className="text-[10px] text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-2.5 overflow-x-auto whitespace-pre-wrap break-all">{s.value}</pre>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-gray-400 mt-3">
            {tx('Le lien contient utm_source=badge : les visites arrivant par votre badge sont mesurées (page Croissance).')}{' '}
            <a href={badgeShopUrl(slug)} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">{tx('Voir ma boutique')}</a>
          </p>
        </>
      )}
    </div>
  );
}
