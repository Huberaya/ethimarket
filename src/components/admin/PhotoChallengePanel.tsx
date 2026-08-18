// =============================================================
// EthiMarket — Panneau des défis photo géolocalisés (admin)
// Créer un défi (code imprévisible + délai 72h), voir les
// soumissions, juger. Un défi réussi crée automatiquement une
// preuve « photo_challenge » sur le critère farmPhotosCoherent.
// =============================================================

import { useState } from 'react';
import { Camera, Plus, Loader2, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import {
  PhotoChallenge, createPhotoChallenge, reviewPhotoChallenge, isChallengeExpired,
} from '../../lib/verificationEvidence';
import { parseExif, analyzeChallengePhoto, parseGpsString, type ExifSignal } from '../../lib/exifAnalyzer';

const STATUS_META: Record<PhotoChallenge['status'], { label: string; cls: string }> = {
  pending: { label: 'En attente du producteur', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  submitted: { label: 'Photo soumise — à juger', cls: 'bg-violet-100 text-violet-800 border-violet-200' },
  passed: { label: 'Réussi ✅', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  failed: { label: 'Échoué', cls: 'bg-red-100 text-red-700 border-red-200' },
  expired: { label: 'Expiré', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const DEFAULT_INSTRUCTIONS =
  "Photographiez votre parcelle principale avec ce code écrit en GRAND sur un papier/carton visible au premier plan. "
  + "La photo doit être prise avec un téléphone (GPS activé) et montrer l'environnement de l'exploitation.";

export function PhotoChallengePanel({
  producerId, challenges, onChanged, disabled = false, declaredGps,
}: {
  producerId: string;
  challenges: PhotoChallenge[];
  onChanged: () => void;
  disabled?: boolean;
  /** Coordonnées GPS déclarées par le producteur ("lat, lon") pour la contre-vérification EXIF */
  declaredGps?: string | null;
}) {
  const [exifResults, setExifResults] = useState<Record<string, ExifSignal[] | 'loading' | 'error'>>({});

  const runExif = async (c: PhotoChallenge) => {
    if (!c.photo_url) return;
    setExifResults(prev => ({ ...prev, [c.id]: 'loading' }));
    try {
      const resp = await fetch(c.photo_url);
      const buf = await resp.arrayBuffer();
      const exif = parseExif(buf);
      const signals = analyzeChallengePhoto(exif, new Date(c.created_at), parseGpsString(declaredGps));
      setExifResults(prev => ({ ...prev, [c.id]: signals }));
    } catch {
      setExifResults(prev => ({ ...prev, [c.id]: 'error' }));
    }
  };
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [instructions, setInstructions] = useState(DEFAULT_INSTRUCTIONS);
  const [judging, setJudging] = useState<string | null>(null);
  const [error, setError] = useState('');

  const create = async () => {
    setCreating(true);
    setError('');
    const err = await createPhotoChallenge(producerId, instructions);
    setCreating(false);
    if (err) { setError(err); return; }
    setShowForm(false);
    onChanged();
  };

  const judge = async (challenge: PhotoChallenge, passed: boolean) => {
    const note = prompt(passed
      ? 'Constat (code lisible, environnement cohérent, EXIF vérifiées ?) :'
      : 'Motif de l\'échec :');
    if (note === null) return;
    setJudging(challenge.id);
    const err = await reviewPhotoChallenge(challenge, passed, note);
    setJudging(null);
    if (err) { setError(err); return; }
    onChanged();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Camera className="w-4 h-4 text-brand-600" /> Défis photo géolocalisés
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Code imprévisible à photographier sur site sous 72 h — une photo fraîche avec ce code ne peut pas être volée sur le web.
          </p>
        </div>
        {!disabled && !showForm && (
          <button type="button" onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 text-xs font-black text-white bg-brand-600 hover:bg-brand-700 px-3.5 py-2 rounded-xl cursor-pointer shrink-0">
            <Plus className="w-3.5 h-3.5" /> Lancer un défi
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-brand-50/50 rounded-xl border border-brand-200 p-4 space-y-3">
          <label className="block text-[11px] font-bold text-gray-600">Instructions pour le producteur (envoyées avec le code)</label>
          <textarea rows={3} value={instructions} onChange={e => setInstructions(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none resize-none bg-white" />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-3 py-2 text-xs font-bold text-gray-500 cursor-pointer">Annuler</button>
            <button type="button" onClick={create} disabled={creating}
              className="px-4 py-2 text-xs font-black rounded-lg bg-brand-600 text-white hover:bg-brand-700 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60">
              {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              Générer le code et notifier
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">{error}</p>}

      {challenges.length === 0 && !showForm && (
        <p className="text-xs text-gray-400 italic">Aucun défi lancé pour ce producteur.</p>
      )}

      <div className="space-y-2.5">
        {challenges.map(c => {
          const expired = isChallengeExpired(c);
          const meta = STATUS_META[expired ? 'expired' : c.status];
          return (
            <div key={c.id} className="rounded-xl border border-gray-200 p-3.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-gray-900 text-sm tracking-widest bg-gray-100 px-2.5 py-0.5 rounded-lg">{c.challenge_code}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${meta.cls}`}>{meta.label}</span>
                <span className="text-[10px] text-gray-400 ms-auto inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {expired || c.status !== 'pending'
                    ? `créé le ${new Date(c.created_at).toLocaleDateString('fr-FR')}`
                    : `expire le ${new Date(c.expires_at).toLocaleString('fr-FR')}`}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5">{c.instructions}</p>

              {c.photo_url && (
                <div className="mt-2 flex items-center gap-3 flex-wrap">
                  <a href={c.photo_url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 hover:underline">
                    <ExternalLink className="w-3 h-3" /> Voir la photo soumise
                  </a>
                  <button type="button" onClick={() => void runExif(c)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-2.5 py-1 rounded-lg cursor-pointer">
                    🔬 Analyser les EXIF
                  </button>
                  {c.submitted_at && <span className="text-[10px] text-gray-400">soumise le {new Date(c.submitted_at).toLocaleString('fr-FR')}</span>}
                </div>
              )}

              {/* Signaux EXIF */}
              {exifResults[c.id] === 'loading' && (
                <p className="text-[11px] text-gray-400 mt-2 inline-flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Analyse en cours…</p>
              )}
              {exifResults[c.id] === 'error' && (
                <p className="text-[11px] text-red-600 mt-2">Impossible de lire la photo (CORS ou fichier inaccessible) — ouvrez-la et vérifiez manuellement.</p>
              )}
              {Array.isArray(exifResults[c.id]) && (
                <div className="mt-2 space-y-1">
                  {(exifResults[c.id] as ExifSignal[]).map((sig, i) => (
                    <p key={i} className={`text-[11px] rounded-lg px-2.5 py-1.5 border ${
                      sig.severity === 'good' ? 'text-emerald-800 bg-emerald-50 border-emerald-100'
                      : sig.severity === 'warning' ? 'text-red-700 bg-red-50 border-red-100'
                      : 'text-gray-600 bg-gray-50 border-gray-100'
                    }`}>
                      {sig.severity === 'good' ? '✅' : sig.severity === 'warning' ? '🚨' : 'ℹ️'} {sig.detail}
                    </p>
                  ))}
                  <p className="text-[10px] text-gray-400 italic">
                    Les signaux EXIF sont des indices, pas un verdict : l'absence de métadonnées est courante (WhatsApp les supprime).
                  </p>
                </div>
              )}

              {c.status === 'submitted' && !disabled && (
                <div className="mt-2.5 flex gap-2">
                  <button type="button" onClick={() => judge(c, true)} disabled={judging === c.id}
                    className="px-3 py-1.5 text-[11px] font-black rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1 cursor-pointer disabled:opacity-60">
                    {judging === c.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Valider (crée la preuve)
                  </button>
                  <button type="button" onClick={() => judge(c, false)} disabled={judging === c.id}
                    className="px-3 py-1.5 text-[11px] font-bold rounded-lg text-red-600 border border-red-200 hover:bg-red-50 inline-flex items-center gap-1 cursor-pointer disabled:opacity-60">
                    <XCircle className="w-3 h-3" /> Refuser
                  </button>
                </div>
              )}
              {c.review_note && (c.status === 'passed' || c.status === 'failed') && (
                <p className="text-[10px] text-gray-500 italic mt-1.5">Verdict : {c.review_note}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
