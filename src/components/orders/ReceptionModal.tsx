// =============================================================
// EthiMarket — Réception structurée (couche 3.3)
//
// Remplace le simple « confirmer la réception » : 4 contrôles
// guidés (quantité, emballage, aspect, étiquetage). Le constat
// est IMMUABLE (pas de policy UPDATE) ; toute non-conformité
// ouvre automatiquement un incident qualité côté base — la
// boucle de retour qui resserre le contrôle sur la filière.
// =============================================================

import { useState } from 'react';
import { ClipboardCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { submitReception, isReceptionClean, type ReceptionChecks } from '../../lib/lotDossier';

const CHECKS: { key: keyof Omit<ReceptionChecks, 'comment'>; label: string; help: string }[] = [
  { key: 'quantity_ok', label: 'Quantité conforme', help: 'Le poids/nombre reçu correspond au bon de commande.' },
  { key: 'packaging_ok', label: 'Emballage intact', help: 'Pas de sacs déchirés, cartons écrasés, humidité.' },
  { key: 'aspect_ok', label: 'Aspect du produit conforme', help: 'Couleur, odeur, calibre conformes à la fiche technique.' },
  { key: 'labeling_ok', label: 'Étiquetage et lot corrects', help: 'Le n° de lot reçu correspond au dossier documentaire.' },
];

export default function ReceptionModal({
  orderId, buyerId, onClose, onDone,
}: {
  orderId: string;
  buyerId: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const { tx } = useI18n();
  const [checks, setChecks] = useState<ReceptionChecks>({
    quantity_ok: true, packaging_ok: true, aspect_ok: true, labeling_ok: true, comment: '',
  });
  const [busy, setBusy] = useState(false);
  const clean = isReceptionClean(checks);

  const submit = async () => {
    setBusy(true);
    const err = await submitReception(orderId, buyerId, checks);
    setBusy(false);
    if (err) alert(err); else onDone();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="font-black text-gray-900 text-lg mb-1 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-brand-600" /> {tx('Contrôle de réception')}
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          {tx('Vérifiez votre marchandise en 4 points — ces constats renforcent le contrôle qualité de toute la filière.')}
        </p>

        <div className="space-y-2.5">
          {CHECKS.map(c => (
            <label key={c.key} className={`flex items-start gap-3 rounded-xl border-2 p-3 cursor-pointer select-none transition-colors ${checks[c.key] ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'}`}>
              <input
                type="checkbox"
                checked={checks[c.key]}
                onChange={e => setChecks(prev => ({ ...prev, [c.key]: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>
                <span className="block text-sm font-bold text-gray-800">{tx(c.label)}</span>
                <span className="block text-[11px] text-gray-500 mt-0.5">{tx(c.help)}</span>
              </span>
            </label>
          ))}
        </div>

        {!clean && (
          <div className="mt-3">
            <label className="block text-xs font-bold text-gray-600 mb-1">
              {tx('Décrivez le problème constaté :')}
            </label>
            <textarea
              value={checks.comment}
              onChange={e => setChecks(prev => ({ ...prev, comment: e.target.value }))}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <p className="text-[11px] text-amber-700 font-semibold mt-1.5">
              {tx('Un incident qualité sera ouvert automatiquement et notre équipe suivra le dossier avec le producteur.')}
            </p>
          </div>
        )}

        <div className="mt-5 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-bold rounded-xl text-gray-500 cursor-pointer">
            {tx('Annuler')}
          </button>
          <button
            onClick={() => void submit()}
            disabled={busy || (!clean && !(checks.comment ?? '').trim())}
            className="px-5 py-2.5 text-sm font-black rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {tx('Valider la réception')}
          </button>
        </div>
      </div>
    </div>
  );
}
