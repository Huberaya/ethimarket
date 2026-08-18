// =============================================================
// EthiMarket — Carte défi photo (côté PRODUCTEUR)
// Affiche les défis actifs : le code à photographier, le délai,
// et l'upload de la photo de réponse. Multilingue.
// =============================================================

import { useEffect, useRef, useState } from 'react';
import { Camera, Clock, Upload, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useI18n } from '../../lib/i18n';
import {
  PhotoChallenge, getPhotoChallenges, submitChallengePhoto, isChallengeExpired,
} from '../../lib/verificationEvidence';

export default function PhotoChallengeCard({ producerId }: { producerId: string }) {
  const { t } = useI18n();
  const [challenges, setChallenges] = useState<PhotoChallenge[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);

  const reload = async () => setChallenges(await getPhotoChallenges(producerId));
  useEffect(() => { void reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [producerId]);

  const visible = challenges.filter(c => ['pending', 'submitted', 'passed', 'failed'].includes(c.status));
  if (visible.length === 0) return null;

  const pickFile = (challengeId: string) => {
    setActiveChallenge(challengeId);
    fileRef.current?.click();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !activeChallenge) return;
    setUploading(activeChallenge);
    setError('');
    try {
      const path = `challenges/${producerId}/${activeChallenge}-${Date.now()}.${file.name.split('.').pop() || 'jpg'}`;
      const { error: upErr } = await supabase.storage.from('farm-photos').upload(path, file, { upsert: true });
      if (upErr) throw new Error(upErr.message);
      const { data: pub } = supabase.storage.from('farm-photos').getPublicUrl(path);
      const err = await submitChallengePhoto(activeChallenge, pub.publicUrl);
      if (err) throw new Error(err);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setUploading(null);
      setActiveChallenge(null);
    }
  };

  return (
    <div className="rounded-3xl border-2 border-violet-200 bg-violet-50/50 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
          <Camera className="w-6 h-6 text-violet-700" />
        </div>
        <div>
          <h2 className="font-black text-gray-900">{t('pc.title')}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{t('pc.subtitle')}</p>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />

      {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

      <div className="space-y-3">
        {visible.map(c => {
          const expired = isChallengeExpired(c);
          return (
            <div key={c.id} className="bg-white rounded-2xl border border-violet-100 p-4">
              {(c.status === 'pending' && !expired) && (
                <>
                  <p className="text-sm text-gray-700">{c.instructions}</p>
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    <span className="text-2xl font-black tracking-[0.3em] text-violet-800 bg-violet-100 px-4 py-2 rounded-xl border-2 border-dashed border-violet-300">
                      {c.challenge_code}
                    </span>
                    <span className="text-xs font-bold text-amber-700 inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {t('pc.deadline')} {new Date(c.expires_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <button
                    onClick={() => pickFile(c.id)}
                    disabled={uploading === c.id}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-black rounded-xl cursor-pointer disabled:opacity-60"
                  >
                    {uploading === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {t('pc.submit')}
                  </button>
                </>
              )}
              {c.status === 'pending' && expired && (
                <p className="text-sm text-gray-500 flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> {t('pc.expired')} ({c.challenge_code})</p>
              )}
              {c.status === 'submitted' && (
                <p className="text-sm text-violet-700 font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {t('pc.underReview')} ({c.challenge_code})
                </p>
              )}
              {c.status === 'passed' && (
                <p className="text-sm text-emerald-700 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {t('pc.passed')} ({c.challenge_code})
                </p>
              )}
              {c.status === 'failed' && (
                <div className="text-sm text-red-700 font-semibold flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{t('pc.failed')}{c.review_note ? ` — ${c.review_note}` : ''}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
