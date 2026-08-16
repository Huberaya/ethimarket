// =============================================================
// EthiMarket — Devis & commandes
// Vue ACHETEUR : mes demandes (envoyée → offre reçue → décision)
// Vue PRODUCTEUR : demandes reçues (répondre avec prix/délai/validité
// ou décliner). Statuts et transitions garantis par le trigger SQL.
// =============================================================

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Loader2, Send, CheckCircle2, XCircle, Ban, Clock, Inbox,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import {
  getBuyerQuotes, getProducerQuotes, respondToQuote, declineQuoteAsProducer,
  acceptQuote, declineQuoteAsBuyer, cancelQuote, computeQuoteStats,
  QuoteRequest, QUOTE_STATUS_META,
} from '../../lib/quoteService';

export default function QuotesPage() {
  const { user, profile, producer } = useAuth();
  const isProducer = profile?.role === 'producer' || !!producer;
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<QuoteRequest | null>(null);

  const reload = async () => {
    if (!user) return;
    setLoading(true);
    const list = isProducer ? await getProducerQuotes(user.id) : await getBuyerQuotes(user.id);
    setQuotes(list);
    setLoading(false);
  };

  useEffect(() => { void reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user?.id, isProducer]);

  const stats = useMemo(() => computeQuoteStats(quotes), [quotes]);

  if (!user) return null;
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Devis & commandes</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isProducer
            ? 'Répondez aux demandes des acheteurs : votre prix, votre délai, la validité de votre offre.'
            : 'Suivez vos demandes de devis : envoyée → offre reçue → votre décision.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile emoji="📤" value={stats.awaitingResponse} label={isProducer ? 'à traiter' : 'en attente de réponse'} highlight={isProducer && stats.awaitingResponse > 0} />
        <StatTile emoji="📩" value={stats.offersToDecide} label={isProducer ? 'offres envoyées' : 'offres à décider'} highlight={!isProducer && stats.offersToDecide > 0} />
        <StatTile emoji="✅" value={stats.accepted} label={`acceptée${stats.accepted > 1 ? 's' : ''} · taux ${stats.acceptanceRatePct}%`} />
        <StatTile emoji="💰" value={`${stats.totalAcceptedValue.toLocaleString('fr-FR')} €`} label="valeur acceptée" />
      </div>

      {quotes.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Inbox className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 mb-2">{isProducer ? 'Aucune demande reçue' : 'Aucune demande de devis'}</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            {isProducer
              ? 'Les demandes de devis des acheteurs apparaîtront ici.'
              : 'Depuis une fiche produit, cliquez « Commander » pour envoyer votre première demande.'}
          </p>
          {!isProducer && <Link to="/catalogue" className="inline-block mt-4 text-sm font-bold text-brand-700 hover:underline">Parcourir le catalogue →</Link>}
        </div>
      )}

      {/* Liste */}
      <div className="space-y-3">
        {quotes.map(q => (
          <QuoteCard
            key={q.id} quote={q} isProducer={isProducer}
            onRespond={() => setRespondingTo(q)}
            onAction={reload}
          />
        ))}
      </div>

      {/* Modale de réponse producteur */}
      {respondingTo && (
        <RespondModal quote={respondingTo} onClose={() => setRespondingTo(null)} onDone={() => { setRespondingTo(null); void reload(); }} />
      )}
    </div>
  );
}

function StatTile({ emoji, value, label, highlight }: { emoji: string; value: number | string; label: string; highlight?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl border-2 p-4 ${highlight ? 'border-brand-300' : 'border-gray-100'}`}>
      <div className="flex items-baseline gap-2">
        <span>{emoji}</span>
        <span className="text-xl font-black text-gray-900 tabular-nums">{value}</span>
      </div>
      <p className="text-[11px] text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function QuoteCard({ quote: q, isProducer, onRespond, onAction }: {
  quote: QuoteRequest; isProducer: boolean; onRespond: () => void; onAction: () => void;
}) {
  const meta = QUOTE_STATUS_META[q.status];
  const [busy, setBusy] = useState(false);
  const act = async (fn: () => Promise<string | null>) => {
    setBusy(true);
    const err = await fn();
    setBusy(false);
    if (err) alert(err); else onAction();
  };

  const totalQuoted = q.quoted_unit_price != null ? q.quoted_unit_price * q.quantity : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">{q.products?.emoji ?? '📦'}</span>
            {q.products?.slug
              ? <Link to={`/produits/${q.products.slug}`} className="font-black text-gray-900 hover:text-brand-700">{q.product_name}</Link>
              : <span className="font-black text-gray-900">{q.product_name}</span>}
            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${meta.cls}`}>{meta.emoji} {meta.label}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {q.quantity.toLocaleString('fr-FR')} {q.unit}
            {q.producers?.name ? <> · {q.producers.country_flag} {q.producers.name}</> : null}
            {q.delivery_country ? <> · livraison {q.delivery_country}</> : null}
            {q.needed_by ? <> · souhaité avant le {new Date(q.needed_by).toLocaleDateString('fr-FR')}</> : null}
            <> · demandé le {new Date(q.created_at).toLocaleDateString('fr-FR')}</>
          </p>
          {q.buyer_message && <p className="text-xs text-gray-600 mt-1.5 italic">« {q.buyer_message} »</p>}
        </div>

        {/* Montants */}
        <div className="text-right shrink-0">
          {q.status === 'responded' || q.status === 'accepted' ? (
            <>
              <p className="text-lg font-black text-gray-900 tabular-nums">
                {q.quoted_unit_price?.toFixed(2)} {q.currency}/{q.unit}
              </p>
              {totalQuoted !== null && <p className="text-xs text-gray-500">Total : <strong>{totalQuoted.toLocaleString('fr-FR')} {q.currency}</strong></p>}
              {q.quoted_delivery_days && <p className="text-[11px] text-gray-500">Délai : {q.quoted_delivery_days} jours</p>}
              {q.quoted_valid_until && q.status === 'responded' && (
                <p className="text-[11px] font-semibold text-amber-700">Offre valide jusqu'au {new Date(q.quoted_valid_until).toLocaleDateString('fr-FR')}</p>
              )}
            </>
          ) : q.unit_price_at_request != null ? (
            <>
              <p className="text-sm font-bold text-gray-500 tabular-nums">{q.unit_price_at_request.toFixed(2)} {q.currency}/{q.unit}</p>
              <p className="text-[11px] text-gray-500">prix indicatif à la demande</p>
            </>
          ) : (
            <p className="text-sm font-bold text-gray-400">Sur devis</p>
          )}
        </div>
      </div>

      {/* Message producteur */}
      {q.producer_message && (q.status === 'responded' || q.status === 'accepted') && (
        <p className="mt-3 text-xs text-gray-600 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">
          💬 Producteur : « {q.producer_message} »
        </p>
      )}
      {q.decline_reason && q.status === 'declined' && (
        <p className="mt-3 text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">Motif : {q.decline_reason}</p>
      )}

      {/* Actions selon rôle et statut */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {isProducer && q.status === 'sent' && (
          <>
            <button onClick={onRespond} disabled={busy} className="btn-primary px-4 py-2 text-xs font-bold rounded-xl inline-flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Faire une offre
            </button>
            <button onClick={() => act(() => declineQuoteAsProducer(q.id))} disabled={busy}
              className="px-4 py-2 text-xs font-bold rounded-xl border-2 border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600">
              <XCircle className="w-3.5 h-3.5 inline mr-1" /> Décliner
            </button>
          </>
        )}
        {!isProducer && q.status === 'responded' && (
          <>
            <button onClick={() => act(() => acceptQuote(q.id))} disabled={busy}
              className="px-4 py-2 text-xs font-black rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Accepter l'offre
            </button>
            <button onClick={() => act(() => declineQuoteAsBuyer(q.id))} disabled={busy}
              className="px-4 py-2 text-xs font-bold rounded-xl border-2 border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600">
              <XCircle className="w-3.5 h-3.5 inline mr-1" /> Refuser
            </button>
          </>
        )}
        {!isProducer && ['sent', 'responded'].includes(q.status) && (
          <button onClick={() => act(() => cancelQuote(q.id))} disabled={busy}
            className="px-4 py-2 text-xs font-bold rounded-xl text-gray-500 hover:text-gray-600">
            <Ban className="w-3.5 h-3.5 inline mr-1" /> Annuler
          </button>
        )}
        {q.status === 'accepted' && (
          <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Offre acceptée le {q.decided_at ? new Date(q.decided_at).toLocaleDateString('fr-FR') : ''} — finalisez la logistique via la messagerie.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---- Modale de réponse producteur ---- */
function RespondModal({ quote, onClose, onDone }: { quote: QuoteRequest; onClose: () => void; onDone: () => void }) {
  const defaultValidity = new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const [price, setPrice] = useState(quote.unit_price_at_request?.toString() ?? '');
  const [delay, setDelay] = useState('7-10');
  const [validUntil, setValidUntil] = useState(defaultValidity);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    const p = parseFloat(price);
    if (!p || p <= 0) { setError('Indiquez un prix unitaire valide.'); return; }
    setBusy(true);
    const err = await respondToQuote(quote.id, {
      quotedUnitPrice: p, quotedDeliveryDays: delay, quotedValidUntil: validUntil, message,
    });
    setBusy(false);
    if (err) setError(err); else onDone();
  };

  const total = (parseFloat(price) || 0) * quote.quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()} role="dialog" aria-label="Répondre au devis">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center"><FileText className="w-5 h-5 text-brand-700" /></div>
          <div>
            <h2 className="font-black text-gray-900">Votre offre</h2>
            <p className="text-xs text-gray-500">{quote.product_name} · {quote.quantity.toLocaleString('fr-FR')} {quote.unit}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Prix unitaire ({quote.currency}/{quote.unit}) *</label>
              <input type="number" step="0.01" min="0.01" value={price} onChange={e => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Délai (jours)</label>
              <select value={delay} onChange={e => setDelay(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-brand-500 outline-none">
                {['3-5', '5-7', '7-10', '10-14', '14-21', '21-30'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Offre valide jusqu'au *</label>
            <input type="date" value={validUntil} min={new Date().toISOString().slice(0, 10)} onChange={e => setValidUntil(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Message (optionnel)</label>
            <textarea rows={2} value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Conditions particulières, remise supplémentaire, échantillon offert…"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none" />
          </div>

          {total > 0 && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-2.5">
              Total offre : <strong className="text-gray-900">{total.toLocaleString('fr-FR')} {quote.currency}</strong> (hors livraison)
            </p>
          )}
          {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}

          <div className="flex gap-2">
            <button onClick={submit} disabled={busy} className="btn-primary flex-1 py-3 text-sm font-black rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-50">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Envoyer l'offre
            </button>
            <button onClick={onClose} className="px-5 py-3 text-sm font-bold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700">Annuler</button>
          </div>
          <p className="text-[11px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Passée la date de validité, l'offre expirera automatiquement.</p>
        </div>
      </div>
    </div>
  );
}
