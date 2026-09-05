import { useState } from 'react';
import {
  WAVE1_PRODUCTS, MARKET_FUNNEL, MARKET_STATS, PHASES,
  GMV_SCENARIOS, scenarioCurve, UNIT_ECONOMICS, ACQUISITION_CHANNELS,
} from '../lib/strategyData';

/**
 * Graphiques SVG maison pour la synthèse stratégique — déterministes,
 * sans dépendance (politique zéro coût). Chaque bloc = une décision du plan.
 */

const fmtK = (v: number) => v >= 1000 ? `${(v / 1000).toLocaleString('fr-FR')} Md€` : `${v.toLocaleString('fr-FR')} M€`;

// ------------------------------------------------- 1. Scores produits (barres)

export function ProductScoreChart() {
  const max = 100;
  return (
    <div className="space-y-1.5">
      {WAVE1_PRODUCTS.map(p => (
        <div key={p.rank} className="group relative flex items-center gap-2">
          <span className="w-40 sm:w-48 shrink-0 text-[11px] font-bold text-gray-700 truncate text-right" title={p.name}>
            {p.short}
          </span>
          <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
            <div
              className="h-full rounded-lg flex items-center justify-end pr-2 transition-all"
              style={{
                width: `${(p.score / max) * 100}%`,
                background: p.active
                  ? 'linear-gradient(90deg, #34d399, #10b981)'
                  : 'linear-gradient(90deg, #cbd5e1, #94a3b8)',
              }}
            >
              <span className="text-[10px] font-black text-white tabular-nums">{p.score}</span>
            </div>
          </div>
          <span className={`w-16 shrink-0 text-[9px] font-black uppercase ${p.active ? 'text-emerald-600' : 'text-gray-400'}`}>
            {p.active ? 'Poussé' : `M4+`}
          </span>
          {/* tooltip au survol */}
          <div className="pointer-events-none absolute left-48 -top-1 z-10 hidden group-hover:block bg-gray-900 text-white text-[10px] rounded-lg px-3 py-2 max-w-xs shadow-lg">
            <b>{p.name}</b> — {p.target} · {p.price} · {p.recurrence}<br />{p.why}
          </div>
        </div>
      ))}
      <p className="text-[10px] text-gray-400 pt-1">
        Scores /100 (Ethimarket Product Engine, §6.1-6.2 du plan). <b className="text-emerald-600">Vert</b> = poussé activement au lancement · <b className="text-gray-500">gris</b> = ouvert au fil des producteurs vérifiés, sans marketing avant M4.
      </p>
    </div>
  );
}

// ------------------------------------------------- 2. Entonnoir TAM/SAM/SOM

export function MarketFunnelChart() {
  // Échelle log implicite : largeurs fixes décroissantes pour la lisibilité.
  const widths = [100, 62, 30];
  const colors = ['#c7d2fe', '#93c5fd', '#34d399'];
  const text = ['#3730a3', '#1d4ed8', '#065f46'];
  return (
    <div className="space-y-2">
      {MARKET_FUNNEL.map((t, i) => (
        <div key={t.label} className="flex flex-col items-center">
          <div
            className="rounded-xl px-4 py-3 text-center transition-all"
            style={{ width: `${widths[i]}%`, background: colors[i] }}
          >
            <p className="text-[11px] font-black" style={{ color: text[i] }}>{t.label}</p>
            <p className="text-lg font-black tabular-nums" style={{ color: text[i] }}>
              {fmtK(t.low)} – {fmtK(t.high)}
            </p>
          </div>
          <p className="text-[9px] text-gray-400 mt-0.5 mb-1 text-center max-w-md leading-snug">{t.note}</p>
        </div>
      ))}
    </div>
  );
}

// ------------------------------------------------- 3. Courbes scénarios GMV

export function GmvScenarioChart() {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560, H = 220, PAD = { l: 42, r: 14, t: 12, b: 26 };
  const months = 12;
  const maxY = 95;
  const x = (m: number) => PAD.l + (m / (months - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => H - PAD.b - (v / maxY) * (H - PAD.t - PAD.b);

  const curves = GMV_SCENARIOS.map(s => ({ ...s, pts: scenarioCurve(s.m12, months) }));

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Scénarios de GMV mensuel sur 12 mois">
        {/* grille horizontale */}
        {[0, 20, 40, 60, 80].map(v => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PAD.l - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="700">{v} k€</text>
          </g>
        ))}
        {/* zone point mort 45-60 k€ */}
        <rect x={PAD.l} width={W - PAD.l - PAD.r} y={y(60)} height={y(45) - y(60)} fill="#fef3c7" opacity="0.55" />
        <text x={W - PAD.r - 4} y={y(60) + 10} textAnchor="end" fontSize="8.5" fill="#b45309" fontWeight="800">Point mort 45-60 k€ (commission seule)</text>
        {/* mois */}
        {Array.from({ length: months }, (_, i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="8.5" fill="#94a3b8" fontWeight="700">M{i + 1}</text>
        ))}
        {/* courbes */}
        {curves.map((c, ci) => {
          const d = c.pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
          const dim = hover !== null && hover !== ci;
          return (
            <g key={c.label} opacity={dim ? 0.25 : 1} onMouseEnter={() => setHover(ci)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer' }}>
              <path d={d} fill="none" stroke={c.color} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={x(months - 1)} cy={y(c.m12)} r="4" fill={c.color} />
              <text x={x(months - 1) - 8} y={y(c.m12) - 8} textAnchor="end" fontSize="10" fill={c.color} fontWeight="900">
                {c.label} · {c.m12} k€
              </text>
            </g>
          );
        })}
      </svg>
      <div className="grid sm:grid-cols-3 gap-2 mt-2">
        {GMV_SCENARIOS.map(s => (
          <div key={s.label} className="rounded-xl border border-gray-100 px-3 py-2 bg-gray-50/60">
            <p className="text-[11px] font-black" style={{ color: s.color }}>{s.label} — {s.m12} k€/mois à M12</p>
            <p className="text-[10px] text-gray-500 leading-snug">{s.note}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-1.5">Trajectoires illustratives vers les cibles M12 du plan (§8.3) — pas des prévisions engageantes.</p>
    </div>
  );
}

// ------------------------------------------------- 4. Timeline des phases

export function PhaseTimeline() {
  const total = 36;
  return (
    <div>
      <div className="space-y-2.5">
        {PHASES.map(p => {
          const left = ((p.months[0] - 1) / total) * 100;
          const width = ((p.months[1] - p.months[0] + 1) / total) * 100;
          return (
            <div key={p.id}>
              <div className="relative h-9 bg-gray-50 rounded-lg border border-gray-100">
                <div
                  className="absolute top-1 bottom-1 rounded-md flex items-center px-2.5 overflow-hidden"
                  style={{ left: `${left}%`, width: `${width}%`, background: p.color }}
                >
                  <span className="text-[10px] font-black text-white whitespace-nowrap">{p.label}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 mt-0.5 px-1">
                <p className="text-[10px] text-gray-500"><b>Focus :</b> {p.focus}</p>
                {p.exit !== '—' && <p className="text-[10px] text-gray-400"><b>Sortie :</b> {p.exit}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1 px-0.5">
        {['M1', 'M6', 'M12', 'M18', 'M24', 'M30', 'Y3'].map(m => (
          <span key={m} className="text-[9px] font-black text-gray-300">{m}</span>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------- 5. Tuiles marché & économie

export function MarketStatTiles() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
      {MARKET_STATS.map(s => (
        <div key={s.label} className="rounded-xl border-2 border-gray-100 bg-white px-3.5 py-3">
          <p className="text-lg font-black text-gray-900 tabular-nums leading-tight">{s.value}</p>
          <p className="text-[10px] font-black text-emerald-600">{s.trend}</p>
          <p className="text-[10px] text-gray-500 leading-snug mt-0.5">{s.label}</p>
          <p className="text-[9px] text-gray-300 mt-0.5">{s.source}</p>
        </div>
      ))}
    </div>
  );
}

export function UnitEconomicsTiles() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
      {UNIT_ECONOMICS.map(u => (
        <div key={u.label} className="rounded-xl border-2 border-gray-100 bg-white px-3.5 py-3">
          <p className="text-lg font-black text-gray-900 tabular-nums leading-tight">{u.value}</p>
          <p className="text-[10px] font-bold text-gray-600 mt-0.5">{u.label}</p>
          <p className="text-[9px] text-gray-400 leading-snug mt-0.5">{u.detail}</p>
        </div>
      ))}
    </div>
  );
}

// ------------------------------------------------- 6. Canaux d'acquisition

export function AcquisitionChannelChart() {
  return (
    <div className="space-y-1.5">
      {ACQUISITION_CHANNELS.map(c => {
        const excluded = c.priority.startsWith('ÉCARTÉ');
        return (
          <div key={c.label} className="flex items-center gap-2.5">
            <span className={`w-14 shrink-0 text-[10px] font-black text-center px-1.5 py-0.5 rounded-full border ${
              c.priority === 'P0' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : excluded ? 'bg-red-50 text-red-600 border-red-200'
              : 'bg-sky-50 text-sky-700 border-sky-200'}`}>
              {excluded ? 'ÉCARTÉ' : c.priority}
            </span>
            <span className={`flex-1 text-[11px] font-bold truncate ${excluded ? 'text-gray-400 line-through' : 'text-gray-700'}`} title={c.label}>
              {c.label}
            </span>
            <span className="shrink-0 text-[11px] tracking-tight" aria-label={`potentiel ${c.potential}/4`}>
              {'★'.repeat(c.potential)}<span className="text-gray-200">{'★'.repeat(4 - c.potential)}</span>
            </span>
            <span className="w-20 shrink-0 text-[9px] text-gray-400 text-right">{c.speed}</span>
          </div>
        );
      })}
      <p className="text-[10px] text-gray-400 pt-1">Les 100 premiers clients (§9.1) : le fondateur EST le canal. La publicité payante est écartée avant M9 (CAC B2B inconnu).</p>
    </div>
  );
}
