// =============================================================
// EthiMarket — Bon de commande B2B (purchase order) imprimable
//
// Génère un document HTML A4 autonome (styles inline, zéro
// dépendance) prêt pour impression / export PDF via
// window.print() — même pattern que postalLetterGenerator et
// buildJustificationSheetHtml. Le bon de commande est la pièce
// contractuelle du circuit B2B sans paiement en ligne :
// règlement par virement à réception de facture du producteur.
// =============================================================

import type { B2BOrder } from './orderService';

export interface PurchaseOrderParties {
  buyerName?: string;
  buyerCompany?: string;
  buyerEmail?: string;
  producerName?: string;
  producerCountry?: string;
}

const esc = (s: unknown): string =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const money = (n: number, currency: string) =>
  `${n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency === 'EUR' ? '€' : esc(currency)}`;

export function buildPurchaseOrderHtml(order: B2BOrder, parties: PurchaseOrderParties = {}): string {
  const date = new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const producerName = parties.producerName ?? order.producers?.name ?? '—';
  const producerCountry = parties.producerCountry ?? order.producers?.country ?? '';
  const statusLine = order.confirmed_at
    ? `Confirmée par le producteur le ${new Date(order.confirmed_at).toLocaleDateString('fr-FR')}`
    : 'En attente de confirmation par le producteur';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Bon de commande ${esc(order.order_number)}</title>
<style>
  @page { size: A4; margin: 18mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; margin: 0; font-size: 13px; line-height: 1.55; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #16a34a; padding-bottom: 14px; margin-bottom: 22px; }
  .brand { font-size: 22px; font-weight: 900; color: #16a34a; }
  .brand small { display: block; font-size: 10px; color: #6b7280; font-weight: 600; letter-spacing: .06em; }
  .doc-meta { text-align: right; }
  .doc-meta .num { font-size: 17px; font-weight: 800; }
  .doc-meta .date { color: #6b7280; font-size: 12px; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: .08em; color: #16a34a; margin: 22px 0 8px; }
  .parties { display: flex; gap: 16px; }
  .party { flex: 1; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 14px; }
  .party .role { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: #6b7280; font-weight: 700; margin-bottom: 4px; }
  .party .name { font-weight: 800; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th { background: #f0fdf4; color: #166534; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; padding: 8px 10px; border-bottom: 2px solid #bbf7d0; }
  td { padding: 9px 10px; border-bottom: 1px solid #f3f4f6; }
  td.r, th.r { text-align: right; }
  .totals { margin-top: 6px; margin-left: auto; width: 55%; }
  .totals td { padding: 6px 10px; }
  .totals .grand td { font-size: 15px; font-weight: 900; border-top: 2px solid #16a34a; border-bottom: none; }
  .status { margin-top: 14px; padding: 10px 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 12px; }
  .terms { margin-top: 22px; font-size: 11px; color: #4b5563; border-top: 1px solid #e5e7eb; padding-top: 12px; }
  .terms li { margin-bottom: 4px; }
  .foot { margin-top: 26px; font-size: 10px; color: #9ca3af; text-align: center; }
  .sign { display: flex; gap: 16px; margin-top: 26px; }
  .sign > div { flex: 1; border: 1px dashed #d1d5db; border-radius: 10px; min-height: 78px; padding: 10px 12px; font-size: 11px; color: #6b7280; }
</style>
</head>
<body>
  <div class="head">
    <div class="brand">🌿 EthiMarket<small>MARKETPLACE B2B BIO &amp; ÉQUITABLE</small></div>
    <div class="doc-meta">
      <div class="num">Bon de commande ${esc(order.order_number)}</div>
      <div class="date">Émis le ${esc(date)}</div>
      ${order.quote_id ? '<div class="date">Issu du devis accepté (référence interne)</div>' : ''}
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <div class="role">Acheteur (donneur d'ordre)</div>
      <div class="name">${esc(parties.buyerCompany || parties.buyerName || 'Acheteur EthiMarket')}</div>
      ${parties.buyerName && parties.buyerCompany ? `<div>${esc(parties.buyerName)}</div>` : ''}
      ${parties.buyerEmail ? `<div>${esc(parties.buyerEmail)}</div>` : ''}
    </div>
    <div class="party">
      <div class="role">Fournisseur (producteur)</div>
      <div class="name">${esc(producerName)}</div>
      ${producerCountry ? `<div>${esc(order.producers?.country_flag ?? '')} ${esc(producerCountry)}</div>` : ''}
    </div>
  </div>

  <h2>Détail de la commande</h2>
  <table>
    <thead>
      <tr><th>Produit</th><th class="r">Quantité</th><th class="r">Prix unitaire</th><th class="r">Montant</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${esc(order.product_name ?? 'Produit')}</strong></td>
        <td class="r">${esc(order.quantity.toLocaleString('fr-FR'))} ${esc(order.unit)}</td>
        <td class="r">${money(order.unit_price, order.currency)} / ${esc(order.unit)}</td>
        <td class="r"><strong>${money(order.total_amount, order.currency)}</strong></td>
      </tr>
    </tbody>
  </table>

  <table class="totals">
    <tr><td>Marchandise</td><td class="r">${money(order.total_amount, order.currency)}</td></tr>
    <tr><td>Frais de port</td><td class="r">${order.shipping_cost > 0 ? money(order.shipping_cost, order.currency) : 'À la charge convenue entre les parties'}</td></tr>
    <tr class="grand"><td>Total commande</td><td class="r">${money(order.total_amount + (order.shipping_cost || 0), order.currency)}</td></tr>
  </table>

  <div class="status">
    <strong>Conditions convenues :</strong>
    ${order.expected_delivery_days ? `délai de livraison ${esc(order.expected_delivery_days)} jours` : 'délai à convenir'}
    ${order.delivery_country ? ` — destination ${esc(order.delivery_country)}` : ''}
    ${order.tracking_number ? ` — suivi ${esc(order.tracking_number)}` : ''}
    <br><strong>Statut :</strong> ${esc(statusLine)}
  </div>

  <h2>Modalités</h2>
  <ul class="terms">
    <li><strong>Prix ferme</strong> : le prix unitaire ci-dessus est celui de l'offre acceptée du producteur ; il ne peut être modifié sans nouvel accord écrit des deux parties.</li>
    <li><strong>Règlement</strong> : par virement bancaire à réception de la facture émise par le fournisseur, sauf accord contraire écrit (aucun paiement ne transite par EthiMarket).</li>
    <li><strong>Livraison</strong> : le fournisseur communique le numéro de suivi dès expédition ; l'acheteur confirme la réception sur la plateforme.</li>
    <li><strong>Conformité</strong> : la marchandise doit être conforme à la fiche produit et aux certifications publiées dans le Trust Center EthiMarket à la date de la commande.</li>
    <li><strong>Litige</strong> : à défaut de résolution amiable via la messagerie EthiMarket, le litige peut être signalé sur la plateforme (statut « litige »).</li>
  </ul>

  <div class="sign">
    <div>Signature de l'acheteur<br><em>« Bon pour accord »</em></div>
    <div>Signature du fournisseur<br><em>« Bon pour acceptation »</em></div>
  </div>

  <div class="foot">
    Document généré par EthiMarket — ${esc(order.order_number)} — ce bon de commande matérialise l'accord issu du devis accepté sur la plateforme.<br>
    EthiMarket agit comme place de marché de mise en relation et n'est partie ni au contrat de vente ni au règlement.
  </div>

  <script>
    if (window.location.search.includes('print=true')) { window.print(); }
  </script>
</body>
</html>`;
}

/** Ouvre le bon de commande dans un nouvel onglet prêt à imprimer. */
export function printPurchaseOrder(order: B2BOrder, parties: PurchaseOrderParties = {}): void {
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(buildPurchaseOrderHtml(order, parties));
  w.document.close();
  setTimeout(() => { try { w.print(); } catch { /* l'utilisateur imprimera manuellement */ } }, 350);
}
