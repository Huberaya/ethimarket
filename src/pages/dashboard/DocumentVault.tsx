// =============================================================
// EthiMarket — Page « Coffre-fort documentaire » de l'acheteur
// Dépôt de documents → analyse automatique locale → extraction
// certification/date/organisme/périmètre/fournisseur/expiration
// → 🔴 « Information manquante » champ par champ.
// =============================================================

import { useEffect, useRef, useState } from 'react';
import { Vault, Upload, Loader2, FileWarning, CheckCircle2, ChevronDown } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import {
  saveVaultDocument, getVaultDocuments, VaultDocument, DOC_TYPE_LABELS,
} from '../../lib/documentVault';

export default function DocumentVault() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [docs, setDocs] = useState<VaultDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [openDoc, setOpenDoc] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    getVaultDocuments(user.id).then(d => { setDocs(d); setLoading(false); });
  }, [user]);

  const handleFiles = async (files: FileList | null) => {
    if (!user || !files || files.length === 0) return;
    setUploading(true);
    setError('');
    for (const file of Array.from(files)) {
      try {
        // 1. Extraire le texte (txt directement ; PDF : texte brut best-effort)
        let text = '';
        if (file.type === 'text/plain' || /\.(txt|csv|md)$/i.test(file.name)) {
          text = await file.text();
        } else {
          // Lecture brute : les PDF texte contiennent des chaînes lisibles.
          const raw = await file.text();
          text = raw.replace(/[^\x20-\x7EÀ-ÿ\n]/g, ' ').replace(/\s{3,}/g, '\n');
        }

        // 2. Stocker le fichier (bucket privé par utilisateur)
        let storagePath: string | undefined;
        const path = `${user.id}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from('buyer-documents').upload(path, file);
        if (!upErr) storagePath = path;

        // 3. Analyser + persister
        const { doc, error: saveErr } = await saveVaultDocument(user.id, {
          fileName: file.name, textContent: text, storagePath,
        });
        if (saveErr) setError(saveErr);
        else if (doc) setDocs(prev => [doc, ...prev]);
      } catch {
        setError(`Impossible d'analyser ${file.name}`);
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-black text-gray-900">
          <Vault className="w-7 h-7 text-brand-600" /> Coffre-fort documentaire
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Déposez certificats, audits, factures, rapports ESG… L'analyse automatique extrait les informations
          clés et signale ce qui manque. Vos documents restent privés.
        </p>
      </div>

      {/* Zone de dépôt */}
      <label className="block border-2 border-dashed border-brand-300 rounded-2xl p-8 text-center hover:bg-brand-50/40 transition-colors cursor-pointer">
        <input ref={fileRef} type="file" multiple accept=".pdf,.txt,.csv,.md,.doc,.docx" className="hidden" onChange={e => void handleFiles(e.target.files)} />
        {uploading ? (
          <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-700">
            <Loader2 className="w-5 h-5 animate-spin" /> Analyse en cours…
          </span>
        ) : (
          <>
            <Upload className="w-8 h-8 text-brand-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700">{t('dv.title')}</p>
            <p className="text-xs text-gray-500 mt-1">Certificats · Audits · Factures · Fiches techniques · Rapports ESG · Questionnaires · Analyses · Réglementaire</p>
          </>
        )}
      </label>
      {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}

      {/* Liste des documents */}
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-brand-500" /></div>
      ) : docs.length === 0 ? (
        <p className="text-sm text-gray-400 italic text-center py-6">{t('dv.empty')}</p>
      ) : (
        <div className="space-y-3">
          {docs.map(doc => {
            const meta = DOC_TYPE_LABELS[doc.doc_type];
            const isOpen = openDoc === doc.id;
            const hasMissing = doc.analysis.missingFields.length > 0;
            return (
              <div key={doc.id} className={`bg-white rounded-2xl border-2 ${hasMissing ? 'border-amber-200' : 'border-emerald-100'} overflow-hidden`}>
                <button
                  onClick={() => setOpenDoc(isOpen ? null : doc.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer text-left"
                >
                  <span className="text-xl">{meta.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{doc.file_name}</p>
                    <p className="text-[11px] text-gray-500">{meta.label} · déposé le {new Date(doc.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {hasMissing ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                        <FileWarning className="w-3 h-3" /> {doc.analysis.missingFields.length} info{doc.analysis.missingFields.length > 1 ? 's' : ''} manquante{doc.analysis.missingFields.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                        <CheckCircle2 className="w-3 h-3" /> Complet
                      </span>
                    )}
                    <span className="text-xs font-black text-gray-500">{doc.analysis.completenessPct}%</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 border-t border-gray-50 pt-3">
                    {/* Champs extraits */}
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {doc.analysis.fields.map(f => (
                        <div key={f.key} className="flex items-start justify-between gap-2 text-sm">
                          <dt className="text-gray-500">{f.label}</dt>
                          <dd className={`font-semibold text-right ${f.value ? 'text-gray-900' : 'text-red-600'}`}>
                            {f.value ?? '🔴 Information manquante'}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {/* Avertissements */}
                    {doc.analysis.warnings.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {doc.analysis.warnings.map((w, i) => (
                          <p key={i} className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">{w}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
