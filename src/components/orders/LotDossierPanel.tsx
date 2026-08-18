// =============================================================
// EthiMarket — Panneau « Dossier du lot » (couche 3.1)
//
// Affiché sur une commande confirmée (processing) :
//  - PRODUCTEUR : fournit chaque document exigé pour CE lot
//    (n° lot, COI bio, phyto, COA…). L'expédition est bloquée
//    par le trigger SQL tant que le paquet est incomplet.
//  - ACHETEUR : voit l'avancement du paquet en lecture seule —
//    transparence sur ce qui accompagne sa marchandise.
// =============================================================

import { useEffect, useState } from 'react';
import { FileCheck2, Loader2, CheckCircle2, CircleDashed, ExternalLink } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import {
  getLotDocuments, provideLotDocument, dossierProgress,
  LOT_DOC_META, type LotDocument,
} from '../../lib/lotDossier';
import { FileUpload } from '../ui/FileUpload';

export default function LotDossierPanel({
  orderId, canEdit, onDossierComplete,
}: {
  orderId: string;
  canEdit: boolean;
  onDossierComplete?: (complete: boolean) => void;
}) {
  const { tx } = useI18n();
  const [docs, setDocs] = useState<LotDocument[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { text: string; file: string }>>({});

  const reload = async () => {
    const list = await getLotDocuments(orderId);
    setDocs(list);
    const req = list.filter(d => d.required);
    onDossierComplete?.(req.every(d => d.status === 'provided'));
  };

  useEffect(() => { void reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [orderId]);

  if (docs === null) {
    return <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-brand-500" /></div>;
  }
  if (docs.length === 0) return null; // commandes pré-pipeline : pas de paquet semé

  const { done, total } = dossierProgress(docs);
  const complete = done === total;

  const submit = async (doc: LotDocument) => {
    const d = drafts[doc.id] ?? { text: '', file: '' };
    setBusyId(doc.id);
    const err = await provideLotDocument(doc.id, { valueText: d.text, fileUrl: d.file });
    setBusyId(null);
    if (err) alert(err); else void reload();
  };

  return (
    <div className={`mt-4 rounded-xl border-2 p-4 ${complete ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40'}`}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-xs font-black text-gray-800 flex items-center gap-1.5">
          <FileCheck2 className="w-4 h-4 text-brand-600" />
          {tx('Dossier documentaire du lot')}
        </p>
        <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${complete ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
          {done}/{total} {complete ? '✅' : ''}
        </span>
      </div>
      <p className="text-[11px] text-gray-500 mt-1">
        {canEdit
          ? tx('L\'expédition ne peut être déclarée qu\'une fois ce paquet complet — c\'est la garantie EthiMarket donnée à l\'acheteur.')
          : tx('Documents qui accompagnent votre lot, fournis par le producteur avant l\'expédition.')}
      </p>

      <div className="mt-3 space-y-2.5">
        {docs.map(doc => {
          const meta = LOT_DOC_META[doc.requirement_key];
          const provided = doc.status === 'provided';
          const d = drafts[doc.id] ?? { text: '', file: '' };
          return (
            <div key={doc.id} className="bg-white rounded-lg border border-gray-200 px-3.5 py-2.5">
              <div className="flex items-start gap-2">
                {provided
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  : <CircleDashed className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-800">{tx(meta.label)}</p>
                  {provided ? (
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {doc.value_text && <span className="font-semibold">{doc.value_text}</span>}
                      {doc.file_url && (
                        <a href={doc.file_url} target="_blank" rel="noreferrer" className="ms-2 text-brand-700 font-bold hover:underline inline-flex items-center gap-0.5">
                          <ExternalLink className="w-3 h-3" /> {tx('fichier')}
                        </a>
                      )}
                    </p>
                  ) : (
                    <>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{tx(meta.help)}</p>
                      {canEdit && (
                        <div className="mt-2 space-y-2">
                          {(meta.input === 'text' || meta.input === 'text_or_file') && (
                            <input
                              value={d.text}
                              onChange={e => setDrafts(prev => ({ ...prev, [doc.id]: { ...d, text: e.target.value } }))}
                              placeholder={meta.placeholder ? tx(meta.placeholder) : undefined}
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                          )}
                          {(meta.input === 'file' || meta.input === 'text_or_file') && (
                            <FileUpload
                              bucket="lab-analyses"
                              folder={`lots/${orderId}/${doc.requirement_key}`}
                              currentFileUrl={d.file || undefined}
                              onUploadComplete={url => setDrafts(prev => ({ ...prev, [doc.id]: { ...d, file: url } }))}
                              preview={false}
                            />
                          )}
                          <button
                            onClick={() => void submit(doc)}
                            disabled={busyId === doc.id || (!d.text.trim() && !d.file)}
                            className="px-3.5 py-1.5 text-[11px] font-black rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40 cursor-pointer inline-flex items-center gap-1.5"
                          >
                            {busyId === doc.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                            {tx('Enregistrer ce document')}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
