// =============================================================
// EthiMarket — Modale de demande de devis (fiche produit)
// Pré-remplie avec la quantité et le prix du palier atteint.
// Crée une quote_request formelle (statut : Envoyée) + suivi
// dans /dashboard/commandes.
// =============================================================

import { useState } from 'react';
import { X, FileText, Loader2, CheckCircle2, Send } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { PRODUCT_PAGE_CONTENT } from '../../lib/i18n/content/productPage';
import { Link } from 'react-router-dom';
import { Product, Producer } from '../../lib/supabase';
import { createQuoteRequest } from '../../lib/quoteService';

const DELIVERY_COUNTRIES = ['France', 'Belgique', 'Suisse', 'Allemagne', 'Espagne', 'Italie', 'Pays-Bas', 'Canada', 'Autre'];

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  producer?: Producer | null;
  buyerId: string;
  initialQuantity: number;
  unitPriceAtRequest: number | null;   // prix du palier (null = sur devis)
}

export default function QuoteRequestModal({
  isOpen, onClose, product, producer, buyerId, initialQuantity, unitPriceAtRequest,
}: QuoteRequestModalProps) {
  const { locale } = useI18n();
  const qc = PRODUCT_PAGE_CONTENT[locale].quote;
  const [quantity, setQuantity] = useState(String(initialQuantity));
  const [message, setMessage] = useState('');
  const [deliveryCountry, setDeliveryCountry] = useState('France');
  const [neededBy, setNeededBy] = useState('');
  const [sending, setSending] = useState(false);
  const [sentId, setSentId] = useState<string | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const qty = parseFloat(quantity) || initialQuantity;
  const estimatedTotal = unitPriceAtRequest !== null ? Math.round(unitPriceAtRequest * qty * 100) / 100 : null;

  const submit = async () => {
    setSending(true);
    setError('');
    const { quoteId, error: err } = await createQuoteRequest({
      buyerId,
      product,
      producer,
      quantity: qty,
      unitPriceAtRequest,
      message,
      deliveryCountry,
      neededBy: neededBy || undefined,
    });
    setSending(false);
    if (err) setError(err);
    else setSentId(quoteId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} role="dialog" aria-label="Demande de devis">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h2 className="font-black text-gray-900">Demande de devis</h2>
              <p className="text-xs text-gray-500">{product.name} · {producer?.name ?? product.country}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl" aria-label="Fermer">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {sentId ? (
          /* ---- Confirmation ---- */
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="font-black text-gray-900 text-lg">{qc.sent}</h3>
            <p className="text-sm text-gray-600 mt-2">
              Le producteur a été notifié. Vous suivrez sa réponse (offre de prix, délai, validité)
              dans votre espace <strong>Devis & commandes</strong>.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link to="/dashboard/commandes" className="btn-primary px-5 py-2.5 text-sm font-bold rounded-xl">
                Suivre mes devis →
              </Link>
              <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700">
                Continuer ma visite
              </button>
            </div>
          </div>
        ) : (
          /* ---- Formulaire ---- */
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantité ({product.price_unit || product.moq_unit})</label>
                <input
                  type="number" min={product.moq_value || 1} value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-1">MOQ : {product.moq_value} {product.moq_unit}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{qc.deliveryTo}</label>
                <select value={deliveryCountry} onChange={e => setDeliveryCountry(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-brand-500 outline-none">
                  {DELIVERY_COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{qc.wishedDate}</label>
              <input type="date" value={neededBy} onChange={e => setNeededBy(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message au producteur (optionnel)</label>
              <textarea
                rows={3} value={message} onChange={e => setMessage(e.target.value)}
                placeholder={qc.detailsPlaceholder}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none"
              />
            </div>

            {/* Récapitulatif indicatif */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{qc.indicativePrice}</span>
                <span className="font-bold text-gray-900">
                  {unitPriceAtRequest !== null ? `${unitPriceAtRequest.toFixed(2)} ${product.currency || '€'}/${product.price_unit || product.moq_unit}` : 'Sur devis'}
                </span>
              </div>
              {estimatedTotal !== null && (
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600">{qc.estimatedTotal}</span>
                  <span className="font-black text-gray-900">{estimatedTotal.toLocaleString('fr-FR')} {product.currency || '€'}</span>
                </div>
              )}
              <p className="text-[11px] text-gray-500 mt-2">
                Indicatif : le producteur confirmera son prix, son délai et la durée de validité de son offre.
              </p>
            </div>

            {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}

            <button
              onClick={submit} disabled={sending || qty < (product.moq_value || 1)}
              className="w-full btn-primary py-3.5 text-sm font-black rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Envoyer la demande de devis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
