// =============================================================
// EthiMarket — Éditeur du dossier de conformité produit
// (couche 1 du Product Trust Pipeline)
//
// Inséré dans AddProduct/EditProduct : affiche les exigences
// applicables (catégorie × origine × certifications), collecte
// les valeurs, montre le niveau de risque UE de la filière.
// Le verrou réel est côté SQL — ce composant explique et guide.
// =============================================================

import { useMemo } from 'react';
import { ShieldCheck, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import {
  COMPLIANCE_META, requiredComplianceKeys, recommendedComplianceKeys,
  isDraftFilled, type ComplianceInput, type ComplianceKey, type DraftComplianceValues,
} from '../../lib/productCompliance';
import { assessEuRisk, HAZARD_LABEL_FR, RISK_LEVEL_META } from '../../lib/euRiskList';
import { FileUpload } from '../ui/FileUpload';

export type ComplianceDraftMap = Partial<Record<ComplianceKey, DraftComplianceValues>>;

export default function ComplianceDossierEditor({
  product, values, onChange,
}: {
  product: ComplianceInput;
  values: ComplianceDraftMap;
  onChange: (next: ComplianceDraftMap) => void;
}) {
  const { tx } = useI18n();
  const required = useMemo(() => requiredComplianceKeys(product), [product]);
  const recommended = useMemo(() => recommendedComplianceKeys(product), [product]);
  const risk = useMemo(
    () => assessEuRisk(product.product_type, product.name, product.country),
    [product],
  );
  const riskMeta = RISK_LEVEL_META[risk.level];

  const filledCount = required.filter(k => isDraftFilled(COMPLIANCE_META[k], values[k])).length;

  const set = (key: ComplianceKey, patch: Partial<DraftComplianceValues>) => {
    onChange({ ...values, [key]: { key, ...values[key], ...patch } });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-100 p-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <div>
            <h3 className="font-black text-gray-900">{tx('Dossier de conformité produit')}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {tx('Ces éléments sont exigés avant la publication — c\'est ce qui fait la valeur d\'EthiMarket pour les acheteurs.')}
            </p>
          </div>
        </div>
        <span className={`text-xs font-black px-3 py-1.5 rounded-full border ${filledCount === required.length ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
          {filledCount}/{required.length} {tx('fournis')}
        </span>
      </div>

      {/* Niveau de risque UE de la filière */}
      <div className={`mt-4 rounded-xl border px-4 py-3 ${riskMeta.cls}`}>
        <p className="text-xs font-black">{riskMeta.emoji} {tx(riskMeta.labelFr)}</p>
        {risk.level === 'standard' ? (
          <p className="text-[11px] mt-1 opacity-80">
            {tx('Votre couple produit × pays n\'est pas sur les listes de contrôles renforcés de l\'UE (règlement 2019/1793).')}
          </p>
        ) : (
          <div className="text-[11px] mt-1 space-y-0.5">
            {risk.matches.map((m, i) => (
              <p key={i}>
                • {m.productLabel} — {HAZARD_LABEL_FR[m.hazard]} — {tx('annexe')} {m.annex},{' '}
                {m.checkFrequency}% {tx('des lots contrôlés à la frontière UE')}
              </p>
            ))}
            <p className="opacity-80 mt-1">
              {risk.level === 'special_conditions'
                ? tx('Annexe II : chaque lot exporté vers l\'UE devra voyager avec un certificat officiel et des résultats d\'analyses. Ce sera demandé à chaque commande.')
                : tx('Un certificat d\'analyse (COA) sera demandé pour chaque lot expédié — il évite les rejets à la frontière.')}
            </p>
          </div>
        )}
      </div>

      {/* Exigences */}
      <div className="mt-5 space-y-4">
        {[...required, ...recommended].map(key => {
          const meta = COMPLIANCE_META[key];
          const isRequired = required.includes(key);
          const v = values[key];
          const filled = isDraftFilled(meta, v);
          return (
            <div key={key} className={`rounded-xl border p-4 ${filled ? 'border-emerald-200 bg-emerald-50/40' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between gap-2">
                <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  {filled
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    : isRequired
                      ? <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      : <Info className="w-4 h-4 text-gray-400 shrink-0" />}
                  {tx(meta.label)}
                  {!isRequired && (
                    <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{tx('recommandé')}</span>
                  )}
                </label>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 mb-2.5 leading-snug">{tx(meta.help)}</p>

              {meta.input === 'text' && (
                <input
                  value={v?.value_text ?? ''}
                  onChange={e => set(key, { value_text: e.target.value })}
                  placeholder={meta.placeholder ? tx(meta.placeholder) : undefined}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                />
              )}
              {meta.input === 'confirm' && (
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={v?.confirmed ?? false}
                    onChange={e => set(key, { confirmed: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs text-gray-700 font-semibold">
                    {tx('Je confirme sur l\'honneur — un étiquetage non conforme constaté à réception ouvre un incident qualité.')}
                  </span>
                </label>
              )}
              {meta.input === 'file' && (
                <FileUpload
                  bucket="lab-analyses"
                  folder={`compliance/${key}`}
                  currentFileUrl={v?.file_url}
                  onUploadComplete={url => set(key, { file_url: url })}
                  onDelete={() => set(key, { file_url: '' })}
                />
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-400 mt-4">
        {tx('Sans ces éléments, le produit est enregistré en brouillon : il n\'apparaît pas dans le catalogue tant que le dossier n\'est pas complet.')}
      </p>
    </div>
  );
}
