import { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { assessEuRisk, HAZARD_LABEL_FR, RISK_LEVEL_META } from '../../lib/euRiskList';
import { useI18n } from '../../lib/i18n';

/**
 * Transparence acheteur (couche 2 du Product Trust Pipeline) :
 * affiche sur la fiche produit publique le régime de contrôle UE
 * de la filière produit × origine — formulé comme une GARANTIE
 * (« un COA accompagne chaque lot »), jamais comme une pénalité.
 * Ne rend rien pour les filières standard : pas de bruit inutile.
 */
export default function EuControlTransparency({
  productType, productName, originCountry,
}: {
  productType: string | null | undefined;
  productName: string | null | undefined;
  originCountry: string | null | undefined;
}) {
  const { tx } = useI18n();
  const [open, setOpen] = useState(false);
  const risk = assessEuRisk(productType, productName, originCountry);

  if (risk.level === 'standard') return null;

  const meta = RISK_LEVEL_META[risk.level];
  const guarantee = risk.level === 'special_conditions'
    ? tx('Chaque lot expédié voyage avec un certificat officiel et un rapport d\'analyses, comme l\'exige la réglementation européenne.')
    : tx('Un certificat d\'analyse (COA) accompagne chaque lot expédié : les contrôles renforcés de l\'UE sont anticipés, pas subis.');

  return (
    <div className={`rounded-xl border px-4 py-3 mb-5 ${meta.cls}`}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-2 text-left">
        <span className="flex items-center gap-2 text-xs font-black">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          {meta.emoji} {tx(meta.labelFr)} — {tx('documents de lot garantis')}
        </span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>
      {open && (
        <div className="mt-2 text-[11px] space-y-1 opacity-90">
          <p>{guarantee}</p>
          {risk.matches.map((m, i) => (
            <p key={i}>
              • {m.productLabel} — {HAZARD_LABEL_FR[m.hazard]} ({tx('annexe')} {m.annex}, {m.checkFrequency}% {tx('des lots contrôlés à la frontière UE')})
            </p>
          ))}
          <p className="opacity-70">{risk.revision.regulation} — {risk.revision.amendedBy}</p>
        </div>
      )}
    </div>
  );
}
