// =============================================================
// EthiMarket — Badge « historique qualité » du producteur
// (Phase 3 : score dynamique nourri par les données RÉELLES —
// réceptions structurées, incidents confirmés, COA vérifiés).
// Ne rend RIEN sans historique : pas de fausse note.
// =============================================================

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useI18n } from '../../lib/i18n';
import { qualityScore, QUALITY_GRADE_META, type QualityHistory } from '../../lib/rasffWatch';

interface RawHistory {
  receptions_total: number;
  receptions_clean: number;
  incidents_confirmed: number;
  incidents_dismissed: number;
  analyses_verified: number;
  analyses_rejected: number;
}

export default function ProducerQualityBadge({ producerId }: { producerId: string }) {
  const { tx } = useI18n();
  const [history, setHistory] = useState<QualityHistory | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void supabase.rpc('get_producer_quality_history', { p_producer_id: producerId })
      .then(({ data }) => {
        const d = data as RawHistory | null;
        if (!d) return;
        setHistory({
          receptionsTotal: d.receptions_total ?? 0,
          receptionsClean: d.receptions_clean ?? 0,
          incidentsConfirmed: d.incidents_confirmed ?? 0,
          incidentsDismissed: d.incidents_dismissed ?? 0,
          analysesVerified: d.analyses_verified ?? 0,
          analysesRejected: d.analyses_rejected ?? 0,
        });
      });
  }, [producerId]);

  if (!history) return null;
  const q = qualityScore(history);
  if (q.grade === 'no_data') return null; // pas de note sans historique réel

  const meta = QUALITY_GRADE_META[q.grade];

  return (
    <div className={`rounded-xl border px-4 py-3 mt-3 ${meta.cls}`}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-2 text-left cursor-pointer">
        <span className="flex items-center gap-2 text-xs font-black">
          <Activity className="w-4 h-4 shrink-0" />
          {meta.emoji} {tx(meta.labelFr)} — {q.score}/100
        </span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>
      {open && (
        <div className="mt-2 text-[11px] space-y-0.5 opacity-90">
          <p className="font-bold">{tx('Calculé uniquement sur des faits enregistrés :')}</p>
          {q.breakdown.map((line, i) => <p key={i}>• {line}</p>)}
        </div>
      )}
    </div>
  );
}
