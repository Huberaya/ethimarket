// =============================================================
// EthiMarket Search V2 — Couche 1 : Parser zéro-API
// 100% local, < 5 ms, FR / EN / ES, insensible aux accents.
// Comprend les 17 facettes en langage naturel.
// =============================================================

import { ParsedQueryV2 } from './types';
import {
  PRODUCT_TYPES, MATERIALS, CERTIFICATIONS, GENDERS, COUNTRIES, REGIONS,
  FLAG_PATTERNS, INTENT_PATTERNS, PRIORITY_PATTERNS, STOP_WORDS,
} from './dictionaries';

export function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function emptyQuery(raw: string): ParsedQueryV2 {
  return {
    rawQuery: raw,
    intent: 'standard_search',
    materials: [],
    certifications: [],
    originCountries: [],
    manufacturingCountries: [],
    rawMaterialCountries: [],
    regions: [],
    currency: 'EUR',
    flags: {
      vegan: false, recycled: false, fairTrade: false, livingWage: false,
      socialConditions: false, organicOnly: false, fullTraceability: false,
      plasticFreePackaging: false, compostablePackaging: false,
      recyclablePackaging: false, bulkPackaging: false, cooperative: false,
    },
    priorities: {
      cheaper: false, lowerCarbon: false, betterTraceability: false,
      fasterDelivery: false, higherTrust: false,
    },
    freeTextKeywords: [],
    confidence: 0,
    parserSource: 'zero-api',
  };
}

function wordRegex(syn: string): RegExp {
  const escaped = normalize(syn).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, 'i');
}

const NUMBER_WORDS: Record<string, number> = {
  un: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9,
  dix: 10, quinze: 15, vingt: 20, trente: 30, quarante: 40, cinquante: 50,
  soixante: 60, cent: 100, mille: 1000,
};

function toNumber(raw: string): number {
  const cleaned = raw.replace(',', '.').trim();
  const parsed = parseFloat(cleaned);
  if (!Number.isNaN(parsed)) return parsed;
  return NUMBER_WORDS[normalize(cleaned)] ?? NaN;
}

const NUM = String.raw`(\d+(?:[.,]\d+)?|un|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|quinze|vingt|trente|quarante|cinquante|soixante|cent|mille)`;

/**
 * Parser principal — couche 1.
 */
export function parseQueryZeroApi(query: string): ParsedQueryV2 {
  const q = emptyQuery(query?.trim() ?? '');
  if (!q.rawQuery) return q;

  let working = ` ${query} `; // padding pour les word boundaries
  const consumed: string[] = [];
  const consume = (matched: string) => {
    consumed.push(matched);
    working = working.replace(matched, ' ');
  };

  // ---------- 1. INTENTIONS ----------
  const REF_STOP = /\s+(qui|que|avec|mais|dont|moins|plus|et)\b.*$/i;
  for (const p of INTENT_PATTERNS.alternativeSupplier) {
    const m = query.match(p);
    if (m?.[1]) {
      q.intent = 'alternative_search';
      q.referenceSupplier = m[1].replace(REF_STOP, '').trim();
      consume(m[0]); // évite que le nom du fournisseur pollue pays/mots-clés
      break;
    }
  }
  if (q.intent === 'standard_search') {
    for (const p of INTENT_PATTERNS.alternativeProduct) {
      const m = query.match(p);
      if (m?.[1]) {
        q.intent = 'alternative_search';
        const target = m[1].replace(REF_STOP, '').trim();
        if (/fournisseur/i.test(target)) {
          q.referenceSupplier = target.replace(/fournisseur\s*/i, '').trim();
          consume(m[0]);
        } else {
          q.referenceProduct = target;
        }
        break;
      }
    }
  }
  if (q.intent === 'standard_search') {
    for (const p of INTENT_PATTERNS.comparison) {
      const m = query.match(p);
      if (m?.[1]) {
        q.intent = 'comparison_search';
        q.comparisonTargets = m.slice(1).filter(Boolean).map(s => s.trim());
        break;
      }
    }
  }
  // Mention simple de fournisseur ("du fournisseur EcoTex")
  if (!q.referenceSupplier) {
    for (const p of INTENT_PATTERNS.supplierMention) {
      const m = query.match(p);
      if (m?.[1]) {
        q.referenceSupplier = m[1].replace(/\s+(qui|que|avec|mais)\b.*$/i, '').trim();
        consume(m[0]);
        break;
      }
    }
  }

  // ---------- 2. PRIX ----------
  const rangePrice = working.match(new RegExp(String.raw`entre\s+${NUM}\s*(?:€|eur(?:os)?)?\s*et\s+${NUM}\s*(?:€|eur(?:os)?|\$|£)?`, 'i'));
  if (rangePrice) {
    q.minPrice = toNumber(rangePrice[1]);
    q.maxPrice = toNumber(rangePrice[2]);
    consume(rangePrice[0]);
  }
  const maxPrice = working.match(new RegExp(String.raw`(?:moins\s+de|<|max(?:imum)?|inf[ée]rieur\s+[àa]|jusqu.[àa]|pas\s+plus\s+de|budget\s+(?:de\s+)?)\s*${NUM}\s*(?:€|eur(?:os)?|euros?|\$|dollars?|£)`, 'i'));
  if (maxPrice && q.maxPrice === undefined) {
    q.maxPrice = toNumber(maxPrice[1]);
    consume(maxPrice[0]);
  }
  const minPrice = working.match(new RegExp(String.raw`(?:plus\s+de|>|min(?:imum)?|sup[ée]rieur\s+[àa]|[àa]\s+partir\s+de)\s*${NUM}\s*(?:€|eur(?:os)?|\$|£)`, 'i'));
  if (minPrice && q.minPrice === undefined) {
    q.minPrice = toNumber(minPrice[1]);
    consume(minPrice[0]);
  }
  if (q.maxPrice === undefined && q.minPrice === undefined) {
    const lone = working.match(new RegExp(String.raw`${NUM}\s*(?:€|euros?|eur)\b`, 'i'));
    if (lone) {
      q.maxPrice = toNumber(lone[1]);
      consume(lone[0]);
    }
  }
  if (/\$|dollar/i.test(query)) q.currency = 'USD';
  else if (/£|gbp|livre sterling/i.test(query)) q.currency = 'GBP';

  // ---------- 3. DISTANCE ----------
  const dist = working.match(new RegExp(String.raw`(?:moins\s+de|dans\s+un\s+rayon\s+de|[àa]\s+moins\s+de|max(?:imum)?)\s*${NUM}\s*(?:km|kilom[eè]tres?)`, 'i'));
  if (dist) {
    q.maxDistanceKm = toNumber(dist[1]);
    consume(dist[0]);
  }
  if (/pr[eè]s\s+de\s+(?:chez\s+)?moi|proximit[ée]|circuit\s+court/i.test(query) && q.maxDistanceKm === undefined) {
    q.maxDistanceKm = 300;
  }

  // ---------- 4. CARBONE ----------
  const co2 = working.match(new RegExp(String.raw`(?:moins\s+de|max(?:imum)?|<|inf[ée]rieur\s+[àa])\s*${NUM}\s*(?:kg)?\s*(?:de\s+)?co2`, 'i'));
  if (co2) {
    q.maxCarbonKg = toNumber(co2[1]);
    consume(co2[0]);
  }

  // ---------- 5. MOQ ----------
  const moq = working.match(new RegExp(String.raw`moq\s*(?:inf[ée]rieur\s*[àa]|<|max(?:imum)?|de\s+moins\s+de|de)?\s*${NUM}`, 'i'));
  if (moq) {
    q.maxMoq = toNumber(moq[1]);
    consume(moq[0]);
  }
  if (/petites?\s+quantit[ée]s?|small\s+quantit/i.test(query) && q.maxMoq === undefined) {
    q.maxMoq = 50;
  }

  // ---------- 6. DÉLAI ----------
  const delay = working.match(new RegExp(String.raw`(?:livraison|d[ée]lai|livr[ée]|exp[ée]di[ée])\s*(?:en|sous|de|d.ici|max(?:imum)?)?\s*${NUM}\s*(?:jours?|j\b|days?)`, 'i'));
  if (delay) {
    q.maxDeliveryDays = toNumber(delay[1]);
    consume(delay[0]);
  } else {
    const delay2 = working.match(new RegExp(String.raw`(?:sous|en\s+moins\s+de)\s*${NUM}\s*(?:jours?|days?)`, 'i'));
    if (delay2) {
      q.maxDeliveryDays = toNumber(delay2[1]);
      consume(delay2[0]);
    }
  }
  if (/express|urgent|livraison\s+rapide|d[ée]lai\s+court/i.test(query) && q.maxDeliveryDays === undefined) {
    q.maxDeliveryDays = 7;
  }

  // ---------- 7. % RECYCLÉ ----------
  const recycledPct = working.match(new RegExp(String.raw`${NUM}\s*%\s*(?:de\s+)?(?:recycl[ée]|recycled)`, 'i'));
  if (recycledPct) {
    q.minRecycledPercent = toNumber(recycledPct[1]);
    q.flags.recycled = true;
    consume(recycledPct[0]);
  }

  // ---------- 8. SCORE DE CONFIANCE ----------
  const trust = working.match(new RegExp(String.raw`(?:score\s+de\s+confiance|score\s+confiance|trust\s+score|note\s+de\s+confiance)\s*(?:>|sup[ée]rieur\s+[àa]|d.au\s+moins|min(?:imum)?|de)?\s*${NUM}`, 'i'));
  if (trust) {
    q.minTrustScore = toNumber(trust[1]);
    consume(trust[0]);
  }

  // ---------- 9. GÉOGRAPHIE (3 niveaux) ----------
  const workingNorm = () => normalize(working);

  // 9a. Pays des matières premières : "coton d'Inde", "cacao du Ghana", "laine du Pérou"
  for (const mat of MATERIALS) {
    for (const syn of mat.synonyms) {
      const m = working.match(new RegExp(String.raw`${syn}\s+(?:d['e]\s*|du\s+|de\s+la\s+|des\s+)([a-zA-Z\u00C0-\u017F-]+)`, 'i'));
      if (m?.[1]) {
        const target = normalize(m[1]);
        const country = COUNTRIES.find(c => target.length >= 4 && c.synonyms.some(s => normalize(s) === target || (normalize(s).startsWith(target) && target.length >= 5)));
        if (country) {
          q.rawMaterialCountries.push(country.canonical);
          if (!q.materials.includes(mat.canonical)) q.materials.push(mat.canonical);
          consume(m[0]);
        }
      }
    }
  }

  // 9b. Pays de fabrication : "fabriqué en X", "made in X", "confectionné au X"
  const madeIn = working.match(/(?:fabriqu[ée]e?s?\s+(?:en|au|aux|à)|made\s+in|confectionn[ée]e?s?\s+(?:en|au|aux)|produit\s+(?:en|au|aux)|assembl[ée]e?s?\s+(?:en|au|aux))\s+([a-zA-Z\u00C0-\u017F' -]+)/i);
  if (madeIn?.[1]) {
    const targetRaw = normalize(madeIn[1]);
    const country = COUNTRIES.find(c => c.synonyms.some(s => targetRaw.startsWith(normalize(s))));
    if (country) {
      q.manufacturingCountries.push(country.canonical);
      consume(madeIn[0]);
    } else {
      const region = REGIONS.find(r => r.synonyms.some(s => targetRaw.startsWith(normalize(s))));
      if (region) {
        q.regions.push(region.canonical);
        consume(madeIn[0]);
      }
    }
  }

  // 9c. Origine : "origine France", pays cité seul
  const origin = working.match(/origine\s+([a-zA-Z\u00C0-\u017F' -]+)/i);
  if (origin?.[1]) {
    const targetRaw = normalize(origin[1]);
    const country = COUNTRIES.find(c => c.synonyms.some(s => targetRaw.startsWith(normalize(s))));
    if (country) {
      q.originCountries.push(country.canonical);
      consume(origin[0]);
    }
  }
  for (const c of COUNTRIES) {
    if (q.originCountries.includes(c.canonical) || q.manufacturingCountries.includes(c.canonical) || q.rawMaterialCountries.includes(c.canonical)) continue;
    if (c.synonyms.some(s => wordRegex(s).test(workingNorm()))) {
      q.originCountries.push(c.canonical);
      const syn = c.synonyms.find(s => wordRegex(s).test(workingNorm()));
      if (syn) consume(syn);
    }
  }

  // 9d. Régions / continents
  for (const r of REGIONS) {
    if (r.synonyms.some(s => wordRegex(s).test(workingNorm())) && !q.regions.includes(r.canonical)) {
      q.regions.push(r.canonical);
    }
  }

  // ---------- 10. TYPE DE PRODUIT ----------
  for (const t of PRODUCT_TYPES) {
    const syn = t.synonyms.find(s => wordRegex(s).test(workingNorm()));
    if (syn) {
      q.productType = t.canonical;
      consume(syn);
      break;
    }
  }

  // ---------- 11. MATIÈRES ----------
  for (const mat of MATERIALS) {
    if (q.materials.includes(mat.canonical)) continue;
    const syn = mat.synonyms.find(s => wordRegex(s).test(workingNorm()));
    if (syn) {
      q.materials.push(mat.canonical);
      consume(syn);
    }
  }

  // ---------- 12. CERTIFICATIONS ----------
  for (const cert of CERTIFICATIONS) {
    const syn = cert.synonyms.find(s => wordRegex(s).test(normalize(query)));
    if (syn && !q.certifications.includes(cert.canonical)) {
      q.certifications.push(cert.canonical);
    }
  }

  // ---------- 13. GENRE ----------
  for (const g of GENDERS) {
    const syn = g.synonyms.find(s => wordRegex(s).test(workingNorm()));
    if (syn) {
      q.gender = g.id as ParsedQueryV2['gender'];
      consume(syn);
      break;
    }
  }

  // ---------- 14. FLAGS ÉTHIQUES / EMBALLAGE / SOCIAL ----------
  const nq = normalize(query);
  (Object.keys(FLAG_PATTERNS) as (keyof typeof q.flags)[]).forEach(flag => {
    if (FLAG_PATTERNS[flag]?.some(s => wordRegex(s).test(nq))) {
      q.flags[flag] = true;
    }
  });
  if (q.certifications.includes('Bio')) q.flags.organicOnly = true;
  if (q.certifications.includes('Commerce Équitable')) q.flags.fairTrade = true;

  // ---------- 15. PRIORITÉS DE CLASSEMENT ----------
  (Object.keys(PRIORITY_PATTERNS) as (keyof typeof q.priorities)[]).forEach(pr => {
    if (PRIORITY_PATTERNS[pr].some(p => p.test(query))) q.priorities[pr] = true;
  });
  // "meilleure traçabilité" est une priorité, pas un filtre dur
  if (q.priorities.betterTraceability) q.flags.fullTraceability = false;

  // ---------- 16. MOTS RÉSIDUELS ----------
  const consumedNorm = consumed.map(normalize).join(' ');
  q.freeTextKeywords = normalize(query)
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w) && !consumedNorm.includes(w))
    .filter(w => !q.certifications.some(c => normalize(c).includes(w)))
    .filter(w => !Object.values(FLAG_PATTERNS).flat().some(s => normalize(s).includes(w)));

  // ---------- 17. CONFIANCE ----------
  let crit = 0;
  if (q.productType) crit += 2;
  if (q.materials.length) crit += 1;
  if (q.certifications.length) crit += 1.5;
  if (q.gender) crit += 1;
  if (q.originCountries.length || q.regions.length || q.manufacturingCountries.length) crit += 1.5;
  if (q.maxPrice !== undefined || q.minPrice !== undefined) crit += 1.5;
  if (q.maxDistanceKm !== undefined || q.maxCarbonKg !== undefined) crit += 1;
  if (q.maxMoq !== undefined || q.maxDeliveryDays !== undefined) crit += 1;
  if (Object.values(q.flags).some(Boolean)) crit += 1;
  if (q.intent !== 'standard_search') crit += 2;
  if (Object.values(q.priorities).some(Boolean)) crit += 1;
  q.confidence = Number(Math.min(0.98, Math.max(0.3, 0.3 + crit * 0.07)).toFixed(2));

  return q;
}
