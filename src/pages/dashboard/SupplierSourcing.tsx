// =============================================================
// EthiMarket — Page « Sourcing IA » de l'acheteur
// Mission en langage naturel → entonnoir trouvés → conformes →
// shortlist top 5, avec raisons d'exclusion transparentes.
// =============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Search, Loader2, CheckCircle2, XCircle, Trophy, ChevronDown } from 'lucide-react';
import { runSourcingMission, SourcingResult } from '../../lib/supplierSourcing';
import { useI18n } from '../../lib/i18n';

const EXAMPLES = [
  'Trouve-moi 10 fournisseurs européens capables de fournir 5 000 unités par mois, avec un score responsable supérieur à 80 et un prix inférieur à 8 €',
  'Fournisseurs africains de cacao équitable, score responsable minimum 75',
  '5 producteurs de café vérifiés avec un prix inférieur à 20 €',
];

export default function SupplierSourcing() {
  const { tx } = useI18n();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SourcingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showExcluded, setShowExcluded] = useState(false);

  const run = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setResult(await runSourcingMission(q));
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-black text-gray-900">
          <Bot className="w-7 h-7 text-violet-600" /> Sourcing IA
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Donnez une mission à l'IA : elle recherche, compare, vérifie chaque critère et construit votre shortlist.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          rows={3}
          placeholder={EXAMPLES[0]}
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none"
        />
        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.slice(1).map((ex, i) => (
              <button
                key={i}
                onClick={() => { setQuery(ex); void run(ex); }}
                className="text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-100 cursor-pointer"
              >
                {ex.slice(0, 55)}…
              </button>
            ))}
          </div>
          <button
            onClick={() => void run(query)}
            disabled={loading || !query.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-black transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Lancer la mission
          </button>
        </div>
      </div>

      {result && (
        <>
          {/* Entonnoir + narration */}
          <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-5">
            <p className="text-base font-black text-gray-900">🤖 {result.narrative}</p>
            <div className="flex items-center gap-3 mt-3 text-xs font-bold">
              <span className="bg-white rounded-full px-3 py-1.5 border border-violet-200">🔎 {result.foundCount} trouvés</span>
              <span className="text-violet-300">→</span>
              <span className="bg-white rounded-full px-3 py-1.5 border border-violet-200">✅ {result.qualifiedCount} conformes</span>
              <span className="text-violet-300">→</span>
              <span className="bg-violet-600 text-white rounded-full px-3 py-1.5">🏆 {result.shortlist.length} shortlistés</span>
            </div>
            {/* Critères compris */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {result.mission.region && <span className="text-[10px] font-bold bg-white border border-violet-200 rounded-full px-2 py-0.5">📍 {result.mission.region === 'europe' ? 'Europe' : result.mission.region === 'africa' ? 'Afrique' : result.mission.region === 'asia' ? 'Asie' : 'Amériques'}</span>}
              {result.mission.minMonthlyCapacity && <span className="text-[10px] font-bold bg-white border border-violet-200 rounded-full px-2 py-0.5">🏭 ≥ {result.mission.minMonthlyCapacity.toLocaleString('fr-FR')} u/m</span>}
              {result.mission.minResponsibleScore && <span className="text-[10px] font-bold bg-white border border-violet-200 rounded-full px-2 py-0.5">🌱 score ≥ {result.mission.minResponsibleScore}</span>}
              {result.mission.maxUnitPrice !== undefined && <span className="text-[10px] font-bold bg-white border border-violet-200 rounded-full px-2 py-0.5">💶 ≤ {result.mission.maxUnitPrice} €</span>}
              {result.mission.requireVerified && <span className="text-[10px] font-bold bg-white border border-violet-200 rounded-full px-2 py-0.5">{tx('🛡️ vérifiés uniquement')}</span>}
            </div>
          </div>

          {/* Shortlist */}
          {result.shortlist.length > 0 && (
            <div className="space-y-3">
              {result.shortlist.map(ev => (
                <div key={ev.producer.id} className="bg-white rounded-2xl border-2 border-emerald-100 p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                        {ev.rank}
                      </span>
                      <div>
                        <Link to={`/boutique/${ev.producer.slug}`} className="font-black text-gray-900 hover:text-emerald-700">
                          {ev.producer.country_flag} {ev.producer.name}
                        </Link>
                        <p className="text-xs text-gray-500">{ev.producer.country} · {ev.products.length} produit{ev.products.length > 1 ? 's' : ''} pertinent{ev.products.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div><p className="text-lg font-black text-emerald-700">{ev.avgResponsibleScore}</p><p className="text-[9px] text-gray-500 font-bold uppercase">{tx('Score')}</p></div>
                      <div><p className="text-lg font-black text-gray-900">{ev.minPrice} €</p><p className="text-[9px] text-gray-500 font-bold uppercase">{tx('Dès')}</p></div>
                      {ev.monthlyCapacity > 0 && <div><p className="text-lg font-black text-gray-900">{ev.monthlyCapacity.toLocaleString('fr-FR')}</p><p className="text-[9px] text-gray-500 font-bold uppercase">u/m</p></div>}
                    </div>
                  </div>
                  {ev.bestProduct && (
                    <p className="mt-2 text-xs text-gray-500">
                      <Trophy className="w-3 h-3 inline text-amber-500" /> Meilleur produit :{' '}
                      <Link to={`/produits/${ev.bestProduct.slug}`} className="font-bold text-emerald-700 hover:underline">{ev.bestProduct.name}</Link>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Exclus avec raisons */}
          {result.excluded.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <button onClick={() => setShowExcluded(v => !v)} className="w-full flex items-center justify-between cursor-pointer">
                <span className="text-sm font-bold text-gray-700">
                  <XCircle className="w-4 h-4 inline text-gray-400 mr-1" />
                  {result.excluded.length} fournisseur{result.excluded.length > 1 ? 's' : ''} exclu{result.excluded.length > 1 ? 's' : ''} — voir pourquoi
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showExcluded ? 'rotate-180' : ''}`} />
              </button>
              {showExcluded && (
                <ul className="mt-3 space-y-2">
                  {result.excluded.map(ev => (
                    <li key={ev.producer.id} className="rounded-xl bg-gray-50 px-4 py-2.5 text-xs">
                      <span className="font-bold text-gray-800">{ev.producer.country_flag} {ev.producer.name}</span>
                      <ul className="mt-1 space-y-0.5">
                        {ev.failedCriteria.map((f, i) => (
                          <li key={i} className="text-gray-500">✗ {f}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <p className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> L'humain garde le dernier mot : cette shortlist est une aide à la décision, pas une décision.
          </p>
        </>
      )}
    </div>
  );
}
