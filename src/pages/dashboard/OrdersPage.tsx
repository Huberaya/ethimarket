// =============================================================
// EthiMarket — Commandes B2B
// Vue ACHETEUR : mes commandes (issues de mes devis acceptés),
//   réception à confirmer, bon de commande PDF.
// Vue PRODUCTEUR : commandes reçues (confirmer → expédier).
// Transitions garanties par le trigger SQL enforce_order_transitions.
// =============================================================

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2, PackageCheck, Truck, CheckCircle2, Ban, FileDown,
  AlertTriangle, Inbox, ShoppingCart,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useAuth } from '../../lib/auth';
import {
  getBuyerOrders, getProducerOrders, confirmOrder, shipOrder, markDelivered,
  cancelOrder, disputeOrder, computeOrderStats, B2BOrder, ORDER_STATUS_META,
  PAYMENT_STATUS_META, markOrderPaid, markOrderInvoiced, ONLINE_PAYMENT_ENABLED,
} from '../../lib/orderService';
import { printPurchaseOrder } from '../../lib/purchaseOrderGenerator';
import { addPurchase } from '../../lib/buyerWorkspace';
import { supabase } from '../../lib/supabase';

export default function OrdersPage() {
  const { t, tx } = useI18n();
  const { user, profile, producer } = useAuth();
  const isProducer = profile?.role === 'producer' || !!producer;
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    if (!user) return;
    setLoading(true);
    const list = isProducer && producer
      ? await getProducerOrders(producer.id)
      : await getBuyerOrders(user.id);
    setOrders(list);
    setLoading(false);
  };

  useEffect(() => { void reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user?.id, isProducer, producer?.id]);

  const stats = useMemo(() => computeOrderStats(orders, isProducer ? 'producer' : 'buyer'), [orders, isProducer]);

  if (!user) return null;
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">{t('ord.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isProducer ? t('ord.subtitleProducer') : t('ord.subtitleBuyer')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile emoji={isProducer ? '🆕' : '🚚'} value={stats.awaitingAction}
          label={isProducer ? t('ord.toConfirm') : t('ord.toReceive')} highlight={stats.awaitingAction > 0} />
        <StatTile emoji="📦" value={stats.inProgress} label={t('ord.inProgress')} />
        <StatTile emoji="✅" value={stats.delivered} label={t('ord.deliveredCount')} />
        <StatTile emoji="💰" value={`${stats.totalDeliveredValue.toLocaleString('fr-FR')} €`} label={t('ord.deliveredValue')} />
      </div>

      {orders.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Inbox className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 mb-2">{t('ord.emptyTitle')}</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            {isProducer ? t('ord.emptyProducer') : t('ord.emptyBuyer')}
          </p>
          <Link to="/dashboard/devis" className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-brand-700 hover:underline">
            <ShoppingCart className="w-4 h-4" /> {t('ord.goToQuotes')}
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {orders.map(o => (
          <OrderCard key={o.id} order={o} isProducer={isProducer} onAction={reload} buyerId={user.id} />
        ))}
      </div>

      {/* Note circuit */}
      {orders.length > 0 && (
        <p className="text-[11px] text-gray-400 text-center max-w-xl mx-auto">
          {tx('Le règlement se fait par virement entre l\'acheteur et le producteur, à réception de facture. EthiMarket n\'encaisse aucun paiement.')}
        </p>
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

function OrderCard({ order: o, isProducer, onAction, buyerId }: {
  order: B2BOrder; isProducer: boolean; onAction: () => void; buyerId: string;
}) {
  const { t, tx } = useI18n();
  const meta = ORDER_STATUS_META[o.status];
  const [busy, setBusy] = useState(false);
  const [shipModal, setShipModal] = useState(false);

  const act = async (fn: () => Promise<string | null>) => {
    setBusy(true);
    const err = await fn();
    setBusy(false);
    if (err) alert(err); else onAction();
  };

  /** Réception confirmée → enregistre aussi l'achat dans le Buyer Workspace. */
  const receive = () => act(async () => {
    const err = await markDelivered(o.id);
    if (err) return err;
    try {
      let product;
      if (o.product_id) {
        const { data } = await supabase.from('products').select('*').eq('id', o.product_id).maybeSingle();
        product = data ?? undefined;
      }
      await addPurchase(buyerId, {
        product,
        productName: o.product_name ?? 'Produit',
        quantity: o.quantity,
        unitPrice: o.unit_price,
      });
    } catch { /* le suivi d'achats ne doit jamais bloquer la réception */ }
    return null;
  });

  const cancelWithReason = () => {
    const reason = prompt(tx('Motif de l\'annulation ?'));
    if (reason === null) return;
    void act(() => cancelOrder(o.id, reason));
  };

  const openDispute = () => {
    const reason = prompt(tx('Décrivez le problème rencontré (produit non conforme, quantité, retard…) :'));
    if (reason === null || !reason.trim()) return;
    void act(() => disputeOrder(o.id, reason));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">{o.products?.emoji ?? '📦'}</span>
            {o.products?.slug
              ? <Link to={`/produits/${o.products.slug}`} className="font-black text-gray-900 hover:text-brand-700">{o.product_name}</Link>
              : <span className="font-black text-gray-900">{o.product_name}</span>}
            <span className="text-[11px] font-bold text-gray-400">{o.order_number}</span>
            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${meta.cls}`}>{meta.emoji} {t(meta.labelKey)}</span>
            {o.payment_status && (
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${PAYMENT_STATUS_META[o.payment_status].cls}`}>
                {PAYMENT_STATUS_META[o.payment_status].emoji} {t(PAYMENT_STATUS_META[o.payment_status].labelKey)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {o.quantity.toLocaleString('fr-FR')} {o.unit}
            {o.producers?.name ? <> · {o.producers.country_flag} {o.producers.name}</> : null}
            {o.delivery_country ? <> · {t('ord.deliveryTo')} {o.delivery_country}</> : null}
            {o.expected_delivery_days ? <> · {t('ord.delay')} {o.expected_delivery_days} {t('ord.days')}</> : null}
            <> · {new Date(o.created_at).toLocaleDateString('fr-FR')}</>
          </p>
          {o.tracking_number && (
            <p className="text-xs font-semibold text-violet-700 mt-1.5">
              <Truck className="w-3.5 h-3.5 inline mr-1" />{t('ord.tracking')} : {o.tracking_number}
              {o.shipping_method ? ` (${o.shipping_method})` : ''}
            </p>
          )}
          {o.cancel_reason && o.status === 'cancelled' && (
            <p className="text-xs text-gray-500 mt-1.5 italic">{t('ord.cancelReason')} : {o.cancel_reason}</p>
          )}
        </div>

        <div className="text-right shrink-0">
          <p className="text-lg font-black text-gray-900 tabular-nums">
            {o.total_amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {o.currency === 'EUR' ? '€' : o.currency}
          </p>
          <p className="text-[11px] text-gray-500">{o.unit_price.toFixed(2)} {o.currency === 'EUR' ? '€' : o.currency}/{o.unit}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2 flex-wrap items-center">
        <button onClick={() => printPurchaseOrder(o)} disabled={busy}
          className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 text-gray-700 hover:border-brand-400 inline-flex items-center gap-1.5 cursor-pointer">
          <FileDown className="w-3.5 h-3.5" /> {t('ord.downloadPO')}
        </button>

        {isProducer && o.status === 'new' && (
          <>
            <button onClick={() => act(() => confirmOrder(o.id))} disabled={busy}
              className="px-4 py-2 text-xs font-black rounded-xl bg-brand-600 text-white hover:bg-brand-700 inline-flex items-center gap-1.5 cursor-pointer">
              <PackageCheck className="w-3.5 h-3.5" /> {t('ord.confirm')}
            </button>
            <button onClick={cancelWithReason} disabled={busy}
              className="px-4 py-2 text-xs font-bold rounded-xl text-gray-500 hover:text-red-600 cursor-pointer">
              <Ban className="w-3.5 h-3.5 inline mr-1" /> {t('ord.decline')}
            </button>
          </>
        )}
        {isProducer && (o.payment_status === 'unpaid' || o.payment_status === 'invoiced') && ['processing', 'shipped', 'delivered'].includes(o.status) && (
          <>
            {o.payment_status === 'unpaid' && (
              <button onClick={() => act(() => markOrderInvoiced(o.id))} disabled={busy}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 cursor-pointer">
                🧾 {t('pay.markInvoiced')}
              </button>
            )}
            <button onClick={() => { const ref = prompt(tx('Référence du virement (optionnel) :')); if (ref !== null) void act(() => markOrderPaid(o.id, ref)); }} disabled={busy}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 cursor-pointer">
              💶 {t('pay.markPaid')}
            </button>
          </>
        )}
        {isProducer && o.status === 'processing' && (
          <button onClick={() => setShipModal(true)} disabled={busy}
            className="px-4 py-2 text-xs font-black rounded-xl bg-violet-600 text-white hover:bg-violet-700 inline-flex items-center gap-1.5 cursor-pointer">
            <Truck className="w-3.5 h-3.5" /> {t('ord.ship')}
          </button>
        )}

        {!isProducer && ONLINE_PAYMENT_ENABLED && o.payment_status !== 'paid' && o.payment_status !== 'refunded' && ['processing', 'shipped', 'delivered'].includes(o.status) && (
          <button onClick={async () => {
            setBusy(true);
            try {
              const { data: sess } = await supabase.auth.getSession();
              const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sess.session?.access_token ?? ''}` },
                body: JSON.stringify({ orderId: o.id }),
              });
              const data = await resp.json();
              if (data.url) { window.location.href = data.url; return; }
              alert(data.error ?? 'Paiement indisponible');
            } catch { alert('Paiement indisponible'); }
            setBusy(false);
          }} disabled={busy}
            className="px-4 py-2 text-xs font-black rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer disabled:opacity-60">
            💳 {t('pay.payOnline')}
          </button>
        )}
        {!isProducer && o.status === 'new' && (
          <button onClick={cancelWithReason} disabled={busy}
            className="px-4 py-2 text-xs font-bold rounded-xl text-gray-500 hover:text-red-600 cursor-pointer">
            <Ban className="w-3.5 h-3.5 inline mr-1" /> {t('ord.cancel')}
          </button>
        )}
        {!isProducer && o.status === 'shipped' && (
          <>
            <button onClick={receive} disabled={busy}
              className="px-4 py-2 text-xs font-black rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1.5 cursor-pointer">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t('ord.confirmReceipt')}
            </button>
            <button onClick={openDispute} disabled={busy}
              className="px-4 py-2 text-xs font-bold rounded-xl text-amber-700 hover:text-amber-800 cursor-pointer">
              <AlertTriangle className="w-3.5 h-3.5 inline mr-1" /> {t('ord.reportIssue')}
            </button>
          </>
        )}
        {!isProducer && o.status === 'delivered' && (
          <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {t('ord.deliveredOn')} {o.delivered_at ? new Date(o.delivered_at).toLocaleDateString('fr-FR') : ''}
          </p>
        )}
        {o.status === 'disputed' && (
          <p className="text-xs text-red-700 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> {t('ord.disputeOpen')}
          </p>
        )}
      </div>

      {shipModal && <ShipModal orderId={o.id} onClose={() => setShipModal(false)} onDone={() => { setShipModal(false); onAction(); }} />}
    </div>
  );
}

/* ---- Modale d'expédition (producteur) ---- */
function ShipModal({ orderId, onClose, onDone }: { orderId: string; onClose: () => void; onDone: () => void }) {
  const { t, tx } = useI18n();
  const [tracking, setTracking] = useState('');
  const [method, setMethod] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    const err = await shipOrder(orderId, { trackingNumber: tracking, shippingMethod: method });
    setBusy(false);
    if (err) alert(err); else onDone();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="font-black text-gray-900 text-lg mb-1">{t('ord.shipTitle')}</h3>
        <p className="text-xs text-gray-500 mb-4">{t('ord.shipSubtitle')}</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">{t('ord.trackingNumber')}</label>
            <input value={tracking} onChange={e => setTracking(e.target.value)}
              placeholder={tx('Ex: DHL-123456789')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">{t('ord.carrier')}</label>
            <input value={method} onChange={e => setMethod(e.target.value)}
              placeholder={tx('Ex: DHL, Maersk, transporteur local…')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
        </div>
        <div className="mt-5 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-bold rounded-xl text-gray-500 cursor-pointer">{t('q.cancel')}</button>
          <button onClick={submit} disabled={busy}
            className="px-5 py-2.5 text-sm font-black rounded-xl bg-violet-600 text-white hover:bg-violet-700 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />} {t('ord.shipConfirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
