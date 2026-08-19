// =============================================================
// EthiMarket — QR de traçabilité du lot (Phase 3).
// Sur une commande expédiée/livrée : génère le QR pointant vers
// la page publique /trace/:orderId — à imprimer sur les colis,
// les fiches produit ou les documents d'expédition.
// =============================================================

import { useState } from 'react';
import { QrCode, X, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { useI18n } from '../../lib/i18n';

export default function TraceQrButton({ orderId, orderNumber }: { orderId: string; orderNumber: string }) {
  const { tx } = useI18n();
  const [qrUrl, setQrUrl] = useState('');
  const [open, setOpen] = useState(false);

  const traceUrl = `${window.location.origin}/trace/${orderId}`;

  const show = async () => {
    if (!qrUrl) {
      const url = await QRCode.toDataURL(traceUrl, { width: 480, margin: 2, color: { dark: '#14532d' } });
      setQrUrl(url);
    }
    setOpen(true);
  };

  return (
    <>
      <button onClick={() => void show()}
        className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 text-gray-700 hover:border-brand-400 inline-flex items-center gap-1.5 cursor-pointer">
        <QrCode className="w-3.5 h-3.5" /> {tx('QR de traçabilité')}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-black text-gray-900">{tx('Traçabilité du lot')} {orderNumber}</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {tx('Quiconque scanne ce code voit le parcours public du lot : origine, documents, analyses, réception. À imprimer sur le colis ou les documents d\'expédition.')}
            </p>
            {qrUrl && <img src={qrUrl} alt="QR traçabilité" className="w-56 h-56 mx-auto rounded-xl border border-gray-100" />}
            <p className="text-[10px] text-gray-400 mt-2 break-all">{traceUrl}</p>
            {qrUrl && (
              <a href={qrUrl} download={`ethimarket-trace-${orderNumber}.png`}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-black">
                <Download className="w-3.5 h-3.5" /> {tx('Télécharger le QR')}
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
