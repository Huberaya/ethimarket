// =============================================================
// EthiMarket — Veille RASFF & score qualité dynamique
// (Phase 3 du Product Trust Pipeline)
//
// RASFF (Rapid Alert System for Food and Feed) est le système
// d'alerte européen PUBLIC : chaque refus frontière/rappel est
// notifié. La veille est faite PAR LA BASE (pg_net + cron
// quotidien, migration rasff_watch) ; ce module contient les
// fonctions PURES de matching et le score qualité, testables
// sans réseau. Zéro API payante.
// =============================================================

/** Pays RASFF (anglais) → nom FR normalisé comme dans nos données. */
export const RASFF_COUNTRY_FR: Record<string, string> = {
  'Ethiopia': 'Éthiopie', 'France': 'France', 'Ghana': 'Ghana',
  'Greece': 'Grèce', 'India': 'Inde', 'Iran': 'Iran',
  'Japan': 'Japon', 'Madagascar': 'Madagascar', 'Morocco': 'Maroc',
  'Mexico': 'Mexique', 'Peru': 'Pérou', 'Sri Lanka': 'Sri Lanka',
  'Turkey': 'Turquie', 'Türkiye': 'Turquie', 'Egypt': 'Égypte',
  'Kenya': 'Kenya', 'Pakistan': 'Pakistan', 'Brazil': 'Brésil',
  'Colombia': 'Colombie', 'Indonesia': 'Indonésie', 'Vietnam': 'Vietnam',
  'Thailand': 'Thaïlande', 'China': 'Chine', 'Tunisia': 'Tunisie',
  'Ivory Coast': 'Côte d\'Ivoire', 'Côte d\'Ivoire': 'Côte d\'Ivoire',
  'Burkina Faso': 'Burkina Faso', 'Rwanda': 'Rwanda', 'Georgia': 'Géorgie',
  'Argentina': 'Argentine', 'Chile': 'Chili', 'Ecuador': 'Équateur',
};

/**
 * Type de produit FR (nos données) → mots-clés anglais tels qu'ils
 * apparaissent dans les sujets RASFF. Utilisé par le matching SQL
 * (miroir : fonction rasff_product_keywords) et par ce module.
 */
export const PRODUCT_KEYWORDS_EN: Record<string, string[]> = {
  'café': ['coffee'],
  'cacao': ['cocoa', 'chocolate'],
  'thé': ['tea'],
  'miel': ['honey'],
  'sésame': ['sesame'],
  'vanille': ['vanilla'],
  'épices': ['spice', 'pepper', 'chilli', 'chili', 'capsicum', 'turmeric', 'curcuma', 'cumin', 'cinnamon', 'nutmeg', 'saffron', 'paprika', 'curry', 'ginger', 'cardamom', 'coriander', 'fenugreek', 'oregano'],
  'cumin': ['cumin'],
  'curcuma': ['turmeric', 'curcuma'],
  'safran': ['saffron'],
  'gingembre': ['ginger'],
  'huile': ['oil', 'olive oil', 'palm oil', 'argan', 'coconut oil'],
  'arachide': ['peanut', 'groundnut'],
  'noisette': ['hazelnut'],
  'riz': ['rice'],
  'quinoa': ['quinoa'],
  'spiruline': ['spirulina'],
  'sirop': ['syrup', 'agave'],
  'mangue': ['mango'],
  'banane': ['banana'],
  'avocat': ['avocado'],
  'haricot': ['bean'],
  'graines': ['seed', 'sesame'],
  'noix': ['nut', 'cashew', 'walnut'],
  'fruits secs': ['dried fruit', 'raisin', 'apricot', 'date', 'fig'],
  'karité': ['shea'],
  'coton': ['cotton'],
};

/** Mots-clés EN pour un type de produit FR (fonction PURE). */
export function productKeywordsEn(productType: string | null | undefined): string[] {
  if (!productType) return [];
  const t = productType.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const out = new Set<string>();
  for (const [fr, kws] of Object.entries(PRODUCT_KEYWORDS_EN)) {
    const frNorm = fr.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (t.includes(frNorm) || frNorm.includes(t)) kws.forEach(k => out.add(k));
  }
  return [...out];
}

export interface RasffNotificationLite {
  subject: string;
  originCountries: string[];   // noms EN du portail
}

/**
 * Une notification RASFF concerne-t-elle nos filières ?
 * Match = un de NOS pays d'origine ∈ origines de la notification
 * ET un mot-clé d'un de NOS types de produits ∈ sujet.
 * Fonction PURE (le SQL fait la même chose côté cron).
 */
export function rasffMatches(
  notif: RasffNotificationLite,
  ourCountriesFr: string[],
  ourProductTypes: string[],
): { country: string; keyword: string } | null {
  const subject = notif.subject.toLowerCase();
  const notifCountriesFr = notif.originCountries
    .map(c => RASFF_COUNTRY_FR[c])
    .filter(Boolean);
  const country = notifCountriesFr.find(c => ourCountriesFr.includes(c));
  if (!country) return null;
  for (const pt of ourProductTypes) {
    for (const kw of productKeywordsEn(pt)) {
      if (subject.includes(kw)) return { country, keyword: kw };
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// Score qualité dynamique (nourri par l'historique réel)
// ─────────────────────────────────────────────────────────────

export interface QualityHistory {
  receptionsTotal: number;      // réceptions structurées enregistrées
  receptionsClean: number;      // ... entièrement conformes
  incidentsConfirmed: number;   // incidents confirmés (dégradations)
  incidentsDismissed: number;   // incidents classés sans suite
  analysesVerified: number;     // COA vérifiés auprès du labo
  analysesRejected: number;     // COA rejetés
}

export interface QualityScore {
  /** 0-100 ; null si aucune donnée (pas de note sans historique). */
  score: number | null;
  grade: 'excellent' | 'good' | 'watch' | 'alert' | 'no_data';
  /** Explication ligne par ligne (transparence du calcul). */
  breakdown: string[];
}

/**
 * Score qualité 0-100 à partir de l'historique RÉEL — jamais
 * d'estimation. Fonction PURE, déterministe, expliquée :
 *   base 100
 *   − 25 par COA rejeté            (fraude documentaire = grave)
 *   − 15 par incident confirmé     (problème avéré)
 *   − taux de réceptions non conformes × 30 (récurrence terrain)
 *   + 5 par COA vérifié (plafonné à +15 : la preuve paie)
 * Un incident classé sans suite ne coûte RIEN (présomption de bonne foi).
 */
export function qualityScore(h: QualityHistory): QualityScore {
  const hasData = h.receptionsTotal > 0 || h.incidentsConfirmed > 0
    || h.incidentsDismissed > 0 || h.analysesVerified > 0 || h.analysesRejected > 0;
  if (!hasData) return { score: null, grade: 'no_data', breakdown: ['Aucun historique qualité : pas encore de note.'] };

  const breakdown: string[] = ['Base : 100'];
  let s = 100;

  if (h.analysesRejected > 0) {
    const p = 25 * h.analysesRejected;
    s -= p; breakdown.push(`− ${p} : ${h.analysesRejected} certificat(s) d'analyse rejeté(s)`);
  }
  if (h.incidentsConfirmed > 0) {
    const p = 15 * h.incidentsConfirmed;
    s -= p; breakdown.push(`− ${p} : ${h.incidentsConfirmed} incident(s) qualité confirmé(s)`);
  }
  if (h.receptionsTotal > 0) {
    const badRate = (h.receptionsTotal - h.receptionsClean) / h.receptionsTotal;
    if (badRate > 0) {
      const p = Math.round(badRate * 30);
      s -= p; breakdown.push(`− ${p} : ${Math.round(badRate * 100)}% de réceptions non conformes`);
    } else {
      breakdown.push(`✓ ${h.receptionsTotal} réception(s) 100% conforme(s)`);
    }
  }
  if (h.analysesVerified > 0) {
    const bonus = Math.min(15, 5 * h.analysesVerified);
    s += bonus; breakdown.push(`+ ${bonus} : ${h.analysesVerified} COA vérifié(s) auprès du labo`);
  }

  const score = Math.max(0, Math.min(100, s));
  const grade = score >= 90 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'watch' : 'alert';
  return { score, grade, breakdown };
}

export const QUALITY_GRADE_META: Record<QualityScore['grade'], { emoji: string; labelFr: string; cls: string }> = {
  excellent: { emoji: '🟢', labelFr: 'Historique qualité excellent', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  good: { emoji: '🟡', labelFr: 'Historique qualité bon', cls: 'bg-lime-50 text-lime-700 border-lime-200' },
  watch: { emoji: '🟠', labelFr: 'Historique qualité à surveiller', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  alert: { emoji: '🔴', labelFr: 'Historique qualité en alerte', cls: 'bg-red-50 text-red-700 border-red-200' },
  no_data: { emoji: '⚪', labelFr: 'Pas encore d\'historique qualité', cls: 'bg-gray-50 text-gray-500 border-gray-200' },
};
