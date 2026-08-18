// =============================================================
// EthiMarket — Panneau « Route vers l'Europe » (admin, replié)
// Feuille de route phytosanitaire + logistique dérivée du type
// de produit du producteur : les documents exigés à chaque phase
// (origine → transport → frontière UE → livraison) et les options
// de fret comparées. Sert à l'auditeur ET au conseil producteur.
// =============================================================

import { useState } from 'react';
import { Ship, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { buildExportRoadmap, groupStepsByStage } from '../../lib/exportRoadmap';

export function ExportRoadmapPanel({
  productTypes, isOrganic,
}: {
  /** Types de produits du producteur (ex. ['café', 'miel']) */
  productTypes: string[];
  isOrganic: boolean;
}) {
  const [open, setOpen] = useState(false);
  const mainType = productTypes[0] ?? 'produit';
  const roadmap = buildExportRoadmap(mainType, isOrganic);
  const grouped = groupStepsByStage(roadmap);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50/60 transition-colors cursor-pointer text-start"
      >
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Ship className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm">Route vers l'Europe — {mainType}</h3>
          <p className="text-xs text-gray-500">
            Exigences phytosanitaires, documents et logistique jusqu'à l'acheteur
            {roadmap.needsPhyto && ' · certificat phytosanitaire requis'}
            {roadmap.eudrConcerned && ' · EUDR (géolocalisation parcelles)'}
          </p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-5">
          {roadmap.eudrConcerned && (
            <p className="text-xs text-blue-900 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-2.5 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Règlement déforestation (EUDR)</strong> : café et cacao exigent les coordonnées GPS de chaque
                parcelle pour la déclaration de diligence de l'importateur. Les GPS collectés dans ce dossier
                (défi photo, exploitation) sont directement valorisables — vérifiez-les avec soin.
              </span>
            </p>
          )}

          {/* Étapes par phase */}
          {grouped.map(g => (
            <div key={g.stage}>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wide mb-2">{g.emoji} {g.label}</p>
              <div className="space-y-2">
                {g.steps.map((s, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/40 px-3.5 py-2.5">
                    <p className="text-xs font-bold text-gray-800">
                      {s.title}
                      {s.required === 'conditional' && (
                        <span className="ms-2 text-[9px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded">
                          si {s.condition}
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{s.detail}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Acteur : {s.actor}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Logistique comparée */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wide mb-2">🚚 Options logistiques comparées</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-start text-gray-500 border-b border-gray-100">
                    <th className="text-start py-2 pe-3 font-bold">Mode</th>
                    <th className="text-start py-2 pe-3 font-bold">Pour qui</th>
                    <th className="text-start py-2 pe-3 font-bold">Transit</th>
                    <th className="text-start py-2 pe-3 font-bold">Coût</th>
                    <th className="text-start py-2 font-bold">CO2</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {roadmap.logistics.map(l => (
                    <tr key={l.mode}>
                      <td className="py-2 pe-3 font-bold text-gray-800 whitespace-nowrap">{l.label}</td>
                      <td className="py-2 pe-3 text-gray-600">{l.bestFor}</td>
                      <td className="py-2 pe-3 text-gray-600 whitespace-nowrap">{l.transitDays[0]}–{l.transitDays[1]} j</td>
                      <td className="py-2 pe-3 text-gray-600">{l.costNote}</td>
                      <td className="py-2 text-gray-600">{l.co2Note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[11px] text-gray-600 bg-amber-50/60 border border-amber-100 rounded-xl px-3.5 py-2.5">
            💡 <strong>Incoterms</strong> : {roadmap.incotermsHint}
          </p>

          <p className="text-[10px] text-gray-400 italic">
            Feuille de route d'orientation fondée sur la réglementation UE (2016/2031 phytosanitaire, 2018/848 bio/COI,
            2023/1115 déforestation, 2017/625 contrôles). Ne remplace pas le conseil d'un transitaire ou d'un
            représentant en douane pour un envoi précis.
          </p>
        </div>
      )}
    </div>
  );
}
