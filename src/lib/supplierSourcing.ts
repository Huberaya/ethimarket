// =============================================================
// EthiMarket — IA acheteur : sourcing de fournisseurs sur mission
//
// « Trouve-moi 10 fournisseurs européens capables de fournir
//   5 000 unités par mois, avec un score responsable supérieur à 80
//   et un prix inférieur à 8 €. »
//
// L'IA locale : parse la mission → recherche → vérifie chaque
// critère → construit l'entonnoir « J'ai trouvé 23 fournisseurs.
// 8 répondent réellement à vos critères. Voici les 5 meilleurs. »
// avec les RAISONS d'exclusion de chacun. Zéro API payante.
// =============================================================

import { supabase, Product, Producer } from './supabase';
import { computeScorecards, fetchTrustSnapshots } from './procurementComparator';

export interface SourcingMission {
  rawQuery: string;
  maxSuppliers?: number;          // « 10 fournisseurs » → shortlist demandée
  region?: 'europe' | 'africa' | 'asia' | 'americas';
  minMonthlyCapacity?: number;    // « 5 000 unités par mois »
  minResponsibleScore?: number;   // « score responsable supérieur à 80 »
  maxUnitPrice?: number;          // « prix inférieur à 8 € »
  productKeywords: string[];      // « bouteilles réutilisables »
  deadline?: string;              // « avant le 15 octobre »
  requireVerified?: boolean;
}

export interface SupplierEvaluation {
  producer: Producer;
  products: Product[];
  bestProduct?: Product;
  avgResponsibleScore: number;
  minPrice: number;
  monthlyCapacity: number;
  matchesAll: boolean;
  failedCriteria: string[];       // raisons d'exclusion, en français
  rank: number;
}

export interface SourcingResult {
  mission: SourcingMission;
  foundCount: number;             // « J'ai trouvé 23 fournisseurs »
  qualifiedCount: number;         // « 8 répondent réellement à vos critères »
  shortlist: SupplierEvaluation[];// « Voici les 5 meilleurs »
  excluded: SupplierEvaluation[]; // avec raisons
  narrative: string;              // la phrase de synthèse
}

// -------------------------------------------------------------
// 1. Parsing de la mission (local, FR)
// -------------------------------------------------------------

const REGION_PATTERNS: [RegExp, SourcingMission['region']][] = [
  [/europ[ée]en|europe|ue\b/i, 'europe'],
  [/africain|afrique/i, 'africa'],
  [/asiatique|asie/i, 'asia'],
  [/am[ée]ricain|am[ée]rique/i, 'americas'],
];

const EUROPE = new Set(['france', 'allemagne', 'belgique', 'pays-bas', 'italie', 'espagne', 'portugal', 'grèce', 'grece', 'pologne', 'roumanie', 'royaume-uni', 'autriche', 'suisse', 'suède', 'suede', 'danemark', 'irlande', 'japon']);
const AFRICA = new Set(['maroc', 'tunisie', 'ghana', "côte d'ivoire", 'cote d\'ivoire', 'éthiopie', 'ethiopie', 'kenya', 'madagascar', 'ouganda', 'tanzanie', 'bénin', 'benin', 'sénégal', 'senegal']);
const ASIA = new Set(['inde', 'chine', 'vietnam', 'bangladesh', 'sri lanka', 'thaïlande', 'thailande', 'japon', 'indonésie', 'indonesie', 'iran']);
const AMERICAS = new Set(['pérou', 'perou', 'colombie', 'brésil', 'bresil', 'équateur', 'equateur', 'mexique', 'canada', 'états-unis', 'etats-unis']);

const REGION_SETS: Record<NonNullable<SourcingMission['region']>, Set<string>> = {
  europe: EUROPE, africa: AFRICA, asia: ASIA, americas: AMERICAS,
};

const STOP = new Set(['trouve', 'moi', 'des', 'les', 'un', 'une', 'de', 'du', 'la', 'le', 'avec', 'par', 'mois', 'unités', 'unites', 'capables', 'fournir', 'fournisseurs', 'producteurs', 'score', 'responsable', 'supérieur', 'superieur', 'inférieur', 'inferieur', 'prix', 'et', 'qui', 'pour', 'à', 'a', 'au', 'en', 'sur', 'livré', 'livre', 'livrés', 'livrées', 'budget', 'maximum', 'minimum', 'pièce', 'piece', 'avant', 'europeens', 'europeennes', 'europeen', 'europeenne', 'europe', 'africains', 'africain', 'afrique', 'asiatiques', 'asiatique', 'asie', 'americains', 'americain', 'amerique', 'besoin']);

export function parseSourcingMission(query: string): SourcingMission {
  const mission: SourcingMission = { rawQuery: query, productKeywords: [] };
  let working = ` ${query} `;

  // Nombre de fournisseurs demandés : « 10 fournisseurs »
  const nSup = query.match(/(\d+)\s*(?:fournisseurs?|producteurs?)/i);
  if (nSup) { mission.maxSuppliers = parseInt(nSup[1], 10); working = working.replace(nSup[0], ' '); }

  // Région
  for (const [re, region] of REGION_PATTERNS) {
    if (re.test(query)) { mission.region = region; break; }
  }

  // Capacité mensuelle : « 5 000 unités par mois », « 5000 u/mois »
  const cap = query.match(/(\d[\d\s.,]*)\s*(?:unités?|u|pi[èe]ces?|kg|bouteilles?|articles?)\s*(?:\/|par)\s*mois/i);
  if (cap) {
    mission.minMonthlyCapacity = parseInt(cap[1].replace(/[\s.,]/g, ''), 10);
    working = working.replace(cap[0], ' ');
  }

  // Score responsable : « score responsable supérieur à 80 », « score min 85 », « 85/100 »
  const score = query.match(/score\s*(?:responsable)?\s*(?:minimum|min|sup[ée]rieur\s*[àa]|>|d'au moins)?\s*[:.]?\s*(\d{2,3})(?:\s*\/\s*100)?/i);
  if (score) {
    mission.minResponsibleScore = parseInt(score[1], 10);
    working = working.replace(score[0], ' ');
  }

  // Prix max : « prix inférieur à 8 € », « budget maximum 3,50 € pièce », « moins de 8€ »
  const price = query.match(/(?:prix\s+inf[ée]rieur\s+[àa]|budget\s+max(?:imum)?|moins\s+de|<)\s*(\d+(?:[.,]\d+)?)\s*€?/i);
  if (price) {
    mission.maxUnitPrice = parseFloat(price[1].replace(',', '.'));
    working = working.replace(price[0], ' ');
  }

  // Deadline : « avant le 15 octobre »
  const deadline = query.match(/avant\s+le\s+(\d{1,2}\s+\w+(?:\s+\d{4})?)/i);
  if (deadline) mission.deadline = deadline[1];

  // Vérification demandée ?
  mission.requireVerified = /v[ée]rifi[ée]s?|certifi[ée]s?\s+bureau/i.test(query);

  // Mots-clés produits : ce qui reste d'utile
  mission.productKeywords = working
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP.has(w) && !/^\d+$/.test(w));

  return mission;
}

// -------------------------------------------------------------
// 2. Évaluation des fournisseurs (fonction PURE)
// -------------------------------------------------------------

export function evaluateSuppliers(
  mission: SourcingMission,
  producers: Producer[],
  productsByProducer: Record<string, Product[]>,
  scoreByProduct: Record<string, number>,
): SourcingResult {
  const evaluations: SupplierEvaluation[] = [];

  for (const prod of producers) {
    const products = productsByProducer[prod.id] ?? [];
    const failed: string[] = [];

    // Filtrage par mots-clés produits (si mission ciblée)
    let relevant = products;
    if (mission.productKeywords.length > 0) {
      relevant = products.filter(p => {
        const hay = `${p.name} ${p.product_type ?? ''} ${(p.keywords ?? []).join(' ')} ${(p.category_tags ?? []).join(' ')}`
          .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        // Tolérance singulier/pluriel : « bouteilles » matche « bouteille inox »
        return mission.productKeywords.some(kw => {
          const stem = kw.endsWith('s') ? kw.slice(0, -1) : kw;
          return hay.includes(kw) || hay.includes(stem);
        });
      });
      if (relevant.length === 0) failed.push(`Aucun produit correspondant à « ${mission.productKeywords.join(' ')} »`);
    }
    if (relevant.length === 0 && failed.length === 0) failed.push('Aucun produit actif au catalogue');

    // Région
    if (mission.region) {
      const set = REGION_SETS[mission.region];
      const inRegion = set.has((prod.country ?? '').toLowerCase());
      if (!inRegion) failed.push(`Hors zone demandée (${prod.country ?? 'pays inconnu'})`);
    }

    // Capacité mensuelle (monthly_capacity du produit, sinon annual/12 du producteur)
    const monthlyCapacity = Math.max(
      ...relevant.map(p => (p as Product & { monthly_capacity?: number }).monthly_capacity ?? 0),
      prod.annual_capacity ? Math.round(Number(prod.annual_capacity) / 12) : 0,
      0,
    );
    if (mission.minMonthlyCapacity && monthlyCapacity < mission.minMonthlyCapacity) {
      failed.push(`Capacité insuffisante (${monthlyCapacity.toLocaleString('fr-FR')} u/mois < ${mission.minMonthlyCapacity.toLocaleString('fr-FR')} demandées)`);
    }

    // Score responsable moyen des produits pertinents
    const scores = relevant.map(p => scoreByProduct[p.id] ?? 0).filter(s => s > 0);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    if (mission.minResponsibleScore && avgScore < mission.minResponsibleScore) {
      failed.push(`Score responsable insuffisant (${avgScore}/100 < ${mission.minResponsibleScore} demandé)`);
    }

    // Prix
    const minPrice = relevant.length > 0 ? Math.min(...relevant.map(p => p.price)) : Infinity;
    if (mission.maxUnitPrice !== undefined && minPrice > mission.maxUnitPrice) {
      failed.push(`Prix minimum trop élevé (${minPrice === Infinity ? '—' : minPrice + ' €'} > ${mission.maxUnitPrice} € max)`);
    }

    // Vérification
    if (mission.requireVerified && !prod.verified) {
      failed.push('Fournisseur non vérifié par EthiMarket');
    }

    const bestProduct = relevant.sort((a, b) => (scoreByProduct[b.id] ?? 0) - (scoreByProduct[a.id] ?? 0))[0];
    evaluations.push({
      producer: prod,
      products: relevant,
      bestProduct,
      avgResponsibleScore: avgScore,
      minPrice: minPrice === Infinity ? 0 : minPrice,
      monthlyCapacity,
      matchesAll: failed.length === 0,
      failedCriteria: failed,
      rank: 0,
    });
  }

  const qualified = evaluations
    .filter(e => e.matchesAll)
    .sort((a, b) => b.avgResponsibleScore - a.avgResponsibleScore || a.minPrice - b.minPrice);
  qualified.forEach((e, i) => { e.rank = i + 1; });

  const shortlistSize = Math.min(mission.maxSuppliers ?? 5, 5, qualified.length);
  const shortlist = qualified.slice(0, shortlistSize);
  const excluded = evaluations.filter(e => !e.matchesAll);

  const narrative = evaluations.length === 0
    ? 'Aucun fournisseur trouvé dans la base pour cette recherche.'
    : `J'ai trouvé ${evaluations.length} fournisseur${evaluations.length > 1 ? 's' : ''}. ` +
      `${qualified.length} répond${qualified.length > 1 ? 'ent' : ''} réellement à vos critères. ` +
      (shortlist.length > 0
        ? `Voici ${shortlist.length === 1 ? 'le meilleur' : `les ${shortlist.length} meilleurs`}.`
        : 'Aucun ne peut être shortlisté — consultez les raisons d\'exclusion pour ajuster vos critères.');

  return {
    mission,
    foundCount: evaluations.length,
    qualifiedCount: qualified.length,
    shortlist,
    excluded,
    narrative,
  };
}

// -------------------------------------------------------------
// 3. Exécution connectée
// -------------------------------------------------------------

export async function runSourcingMission(query: string): Promise<SourcingResult> {
  const mission = parseSourcingMission(query);

  const [{ data: producers }, { data: products }] = await Promise.all([
    supabase.from('producers').select('*').limit(200),
    supabase.from('products').select('*, producers(*)').eq('status', 'active').limit(300),
  ]);

  const prods = (products ?? []) as Product[];
  const byProducer: Record<string, Product[]> = {};
  prods.forEach(p => {
    if (!p.producer_id) return;
    (byProducer[p.producer_id] ??= []).push(p);
  });

  // Score responsable de chaque produit via le moteur du comparateur
  const trust = await fetchTrustSnapshots(prods.map(p => p.id));
  const cards = computeScorecards(prods, trust);
  const scoreByProduct: Record<string, number> = {};
  cards.forEach(c => { scoreByProduct[c.product.id] = c.overallScore; });

  return evaluateSuppliers(mission, (producers ?? []) as Producer[], byProducer, scoreByProduct);
}
