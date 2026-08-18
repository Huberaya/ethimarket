// =============================================================
// EthiMarket — Table de risque UE locale (couche 2 du
// Product Trust Pipeline)
//
// Réplication LOCALE et DÉTERMINISTE des annexes du règlement
// d'exécution (UE) 2019/1793 (contrôles renforcés aux frontières),
// dans sa rédaction issue du règlement (UE) 2026/1206 du 9 juin
// 2026 (révision semestrielle S2-2025, applicable en août 2026).
//
//   Annexe I  : couples produit × pays soumis à un renforcement
//               temporaire des contrôles (10-50 % des lots
//               contrôlés physiquement à la frontière UE).
//   Annexe II : couples soumis à des CONDITIONS SPÉCIALES —
//               chaque lot doit voyager avec un certificat
//               officiel + résultats d'analyses.
//
// Périmètre : uniquement les filières plausibles sur EthiMarket
// (produits bio/équitables de nos pays d'origine). Les entrées
// hors périmètre (gomme xanthane de Chine, huile d'acide
// arachidonique…) sont volontairement omises.
//
// Ces listes sont PUBLIQUES et révisées tous les 6 mois par la
// Commission — la constante EU_RISK_LIST_REVISION dit quelle
// révision est embarquée, à mettre à jour semestriellement.
// Zéro API payante : données embarquées, moteur pur.
// =============================================================

import { exportCategory } from './exportRoadmap';

/** Révision embarquée des annexes 2019/1793. */
export const EU_RISK_LIST_REVISION = {
  regulation: 'Règlement d\'exécution (UE) 2019/1793',
  amendedBy: 'Règlement (UE) 2026/1206 du 9 juin 2026 (révision S2-2025)',
  sourceUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=OJ:L_202601206',
  nextReviewHint: 'Révision semestrielle : vérifier EUR-Lex vers janvier puis juin.',
};

export type EuAnnex = 'I' | 'II';
export type EuHazard =
  | 'aflatoxins' | 'ochratoxin_a' | 'pesticide_residues' | 'salmonella'
  | 'sudan_dyes' | 'pyrrolizidine_alkaloids' | 'ethylene_oxide';

export const HAZARD_LABEL_FR: Record<EuHazard, string> = {
  aflatoxins: 'Aflatoxines (mycotoxines)',
  ochratoxin_a: 'Ochratoxine A (mycotoxine)',
  pesticide_residues: 'Résidus de pesticides',
  salmonella: 'Salmonelles',
  sudan_dyes: 'Colorants Soudan (interdits)',
  pyrrolizidine_alkaloids: 'Alcaloïdes pyrrolizidiniques',
  ethylene_oxide: 'Oxyde d\'éthylène',
};

export interface EuRiskEntry {
  /** Pays d'origine — noms FR normalisés comme dans nos données. */
  country: string;
  /** Regex (insensible casse/accents partiels) sur type/nom produit. */
  productPattern: RegExp;
  /** Libellé produit tel que listé au règlement. */
  productLabel: string;
  annex: EuAnnex;
  hazard: EuHazard;
  /** Fréquence des contrôles d'identité/physiques UE (%). */
  checkFrequency: number;
}

/**
 * Extrait pertinent des annexes I et II (règl. 2026/1206) pour les
 * filières EthiMarket. productPattern est testé contre
 * `${product_type} ${name}` en minuscules.
 */
export const EU_RISK_ENTRIES: EuRiskEntry[] = [
  // ---------- Annexe I : contrôles renforcés ----------
  { country: 'Éthiopie', productPattern: /s[ée]same/, productLabel: 'Graines de sésame', annex: 'I', hazard: 'salmonella', checkFrequency: 50 },
  { country: 'Éthiopie', productPattern: /poivre|piment|capsicum|paprika/, productLabel: 'Poivres et piments séchés', annex: 'I', hazard: 'aflatoxins', checkFrequency: 30 },
  { country: 'Éthiopie', productPattern: /gingembre|safran|curcuma|thym|laurier|curry|[ée]pice/, productLabel: 'Gingembre, safran, curcuma, thym, laurier, curry et autres épices séchées', annex: 'I', hazard: 'aflatoxins', checkFrequency: 30 },
  { country: 'Ghana', productPattern: /arachide|cacahu[èe]te|peanut/, productLabel: 'Arachides et produits dérivés', annex: 'I', hazard: 'aflatoxins', checkFrequency: 50 },
  { country: 'Géorgie', productPattern: /noisette/, productLabel: 'Noisettes et produits dérivés', annex: 'I', hazard: 'aflatoxins', checkFrequency: 20 },
  { country: 'Chine', productPattern: /arachide|cacahu[èe]te|peanut/, productLabel: 'Arachides et produits dérivés', annex: 'I', hazard: 'aflatoxins', checkFrequency: 10 },
  { country: 'Chine', productPattern: /th[ée]/, productLabel: 'Thé, même aromatisé', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 20 },
  { country: 'Argentine', productPattern: /arachide|cacahu[èe]te|peanut/, productLabel: 'Arachides et produits dérivés', annex: 'I', hazard: 'aflatoxins', checkFrequency: 20 },
  { country: 'Inde', productPattern: /cumin/, productLabel: 'Graines de cumin', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 50 },
  { country: 'Inde', productPattern: /riz/, productLabel: 'Riz', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 10 },
  { country: 'Inde', productPattern: /cannelle/, productLabel: 'Cannelle et fleurs de cannelier', annex: 'I', hazard: 'ethylene_oxide', checkFrequency: 20 },
  { country: 'Inde', productPattern: /gombo|okra/, productLabel: 'Gombos frais/surgelés', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 30 },
  { country: 'Inde', productPattern: /goyave/, productLabel: 'Goyaves', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 30 },
  { country: 'Inde', productPattern: /poivre|piment|capsicum|pimenta/, productLabel: 'Poivres et piments séchés/broyés', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 20 },
  { country: 'Kenya', productPattern: /haricot/, productLabel: 'Haricots frais ou réfrigérés', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 10 },
  { country: 'Kenya', productPattern: /piment|capsicum/, productLabel: 'Piments Capsicum (autres que doux)', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 20 },
  { country: 'Sri Lanka', productPattern: /haricot.?kilom[èe]tre|yardlong|d[oô]lique/, productLabel: 'Haricots-kilomètres', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 50 },
  { country: 'Sri Lanka', productPattern: /piment|capsicum|paprika/, productLabel: 'Piments séchés/broyés', annex: 'I', hazard: 'aflatoxins', checkFrequency: 50 },
  { country: 'Madagascar', productPattern: /haricot|ni[ée]b[ée]|black.?eyed/, productLabel: 'Haricots à œil noir (Vigna unguiculata)', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 50 },
  { country: 'Mexique', productPattern: /papaye/, productLabel: 'Papaye verte fraîche', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 20 },
  { country: 'Pakistan', productPattern: /riz/, productLabel: 'Riz', annex: 'I', hazard: 'aflatoxins', checkFrequency: 10 },
  { country: 'Pakistan', productPattern: /m[ée]lange.*[ée]pice|[ée]pice.*m[ée]lange/, productLabel: 'Mélanges d\'épices', annex: 'I', hazard: 'aflatoxins', checkFrequency: 30 },
  { country: 'Rwanda', productPattern: /piment|capsicum/, productLabel: 'Piments Capsicum (autres que doux)', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 50 },
  { country: 'Thaïlande', productPattern: /piment|capsicum/, productLabel: 'Piments frais/surgelés', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 50 },
  { country: 'Turquie', productPattern: /citron/, productLabel: 'Citrons', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 20 },
  { country: 'Turquie', productPattern: /grenade/, productLabel: 'Grenades', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 30 },
  { country: 'Turquie', productPattern: /origan/, productLabel: 'Origan séché', annex: 'I', hazard: 'pyrrolizidine_alkaloids', checkFrequency: 30 },
  { country: 'Turquie', productPattern: /s[ée]same/, productLabel: 'Graines de sésame', annex: 'I', hazard: 'salmonella', checkFrequency: 20 },
  { country: 'Égypte', productPattern: /orange/, productLabel: 'Oranges', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 10 },
  { country: 'Égypte', productPattern: /mangue/, productLabel: 'Mangues', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 20 },
  { country: 'Égypte', productPattern: /fraise/, productLabel: 'Fraises', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 20 },
  { country: 'Égypte', productPattern: /poivron|piment|capsicum/, productLabel: 'Poivrons et piments', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 30 },
  { country: 'Burkina Faso', productPattern: /aubergine/, productLabel: 'Aubergines africaines (Solanum aethiopicum)', annex: 'I', hazard: 'pesticide_residues', checkFrequency: 30 },
  { country: 'Côte d\'Ivoire', productPattern: /huile de palme|palme/, productLabel: 'Huile de palme', annex: 'I', hazard: 'sudan_dyes', checkFrequency: 30 },

  // ---------- Annexe II : conditions spéciales (certificat officiel + analyses par lot) ----------
  { country: 'Brésil', productPattern: /poivre noir|poivre/, productLabel: 'Poivre noir (Piper nigrum) non broyé', annex: 'II', hazard: 'salmonella', checkFrequency: 30 },
  { country: 'Ghana', productPattern: /huile de palme|palme/, productLabel: 'Huile de palme', annex: 'II', hazard: 'sudan_dyes', checkFrequency: 50 },
  { country: 'Indonésie', productPattern: /muscade/, productLabel: 'Noix de muscade', annex: 'II', hazard: 'aflatoxins', checkFrequency: 30 },
  { country: 'Inde', productPattern: /s[ée]same/, productLabel: 'Graines de sésame', annex: 'II', hazard: 'salmonella', checkFrequency: 30 },
  { country: 'Inde', productPattern: /arachide|cacahu[èe]te|peanut/, productLabel: 'Arachides et produits dérivés', annex: 'II', hazard: 'aflatoxins', checkFrequency: 50 },
  { country: 'Inde', productPattern: /feuilles? de curry/, productLabel: 'Feuilles de curry', annex: 'II', hazard: 'pesticide_residues', checkFrequency: 50 },
  { country: 'Inde', productPattern: /muscade|macis|cardamome|coriandre|cumin|gingembre|safran|curcuma|curry|fenugrec|thym|anis|badiane|fenouil/, productLabel: 'Épices séchées (liste étendue)', annex: 'II', hazard: 'pesticide_residues', checkFrequency: 20 },
  { country: 'Égypte', productPattern: /arachide|cacahu[èe]te|peanut/, productLabel: 'Arachides et produits dérivés', annex: 'II', hazard: 'aflatoxins', checkFrequency: 30 },
];

/** Alias pays EN/variantes → nom FR normalisé de nos données. */
const COUNTRY_ALIASES: Record<string, string> = {
  'ethiopia': 'Éthiopie', 'ethiopie': 'Éthiopie',
  'ghana': 'Ghana', 'georgia': 'Géorgie', 'georgie': 'Géorgie',
  'china': 'Chine', 'chine': 'Chine', 'argentina': 'Argentine',
  'india': 'Inde', 'inde': 'Inde', 'kenya': 'Kenya',
  'sri lanka': 'Sri Lanka', 'madagascar': 'Madagascar',
  'mexico': 'Mexique', 'mexique': 'Mexique', 'pakistan': 'Pakistan',
  'rwanda': 'Rwanda', 'thailand': 'Thaïlande', 'thailande': 'Thaïlande',
  'turkey': 'Turquie', 'turquie': 'Turquie', 'türkiye': 'Turquie',
  'egypt': 'Égypte', 'egypte': 'Égypte',
  'burkina faso': 'Burkina Faso', 'burkina': 'Burkina Faso',
  "cote d'ivoire": 'Côte d\'Ivoire', 'ivory coast': 'Côte d\'Ivoire',
  'brazil': 'Brésil', 'bresil': 'Brésil', 'indonesia': 'Indonésie', 'indonesie': 'Indonésie',
};

function normalizeCountry(country: string | null | undefined): string {
  const raw = (country ?? '').trim();
  if (!raw) return '';
  const key = raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [alias, canonical] of Object.entries(COUNTRY_ALIASES)) {
    const aliasNorm = alias.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (key === aliasNorm) return canonical;
  }
  return raw;
}

export type EuRiskLevel = 'standard' | 'reinforced' | 'special_conditions';

export interface EuRiskAssessment {
  level: EuRiskLevel;
  /** Entrées du règlement qui matchent ce produit × origine. */
  matches: EuRiskEntry[];
  /** Fréquence de contrôle UE la plus haute parmi les matches (%). */
  maxCheckFrequency: number;
  /** Révision des annexes utilisée. */
  revision: typeof EU_RISK_LIST_REVISION;
}

/**
 * Évalue le niveau de risque réglementaire UE d'un produit.
 * Fonction PURE — même logique que les douanes européennes :
 *  - special_conditions : listé annexe II → certificat officiel
 *    + rapport d'analyses OBLIGATOIRES pour chaque lot entrant dans l'UE ;
 *  - reinforced : listé annexe I → contrôles renforcés à la frontière,
 *    un COA par lot est fortement conseillé pour éviter les rejets ;
 *  - standard : non listé → régime de contrôle standard.
 */
export function assessEuRisk(
  productType: string | null | undefined,
  productName: string | null | undefined,
  originCountry: string | null | undefined,
): EuRiskAssessment {
  const country = normalizeCountry(originCountry);
  const haystack = `${productType ?? ''} ${productName ?? ''}`.toLowerCase();
  const matches = country
    ? EU_RISK_ENTRIES.filter(e => e.country === country && e.productPattern.test(haystack))
    : [];
  const hasAnnexII = matches.some(m => m.annex === 'II');
  return {
    level: hasAnnexII ? 'special_conditions' : matches.length > 0 ? 'reinforced' : 'standard',
    matches,
    maxCheckFrequency: matches.reduce((mx, m) => Math.max(mx, m.checkFrequency), 0),
    revision: EU_RISK_LIST_REVISION,
  };
}

export const RISK_LEVEL_META: Record<EuRiskLevel, { emoji: string; cls: string; labelFr: string }> = {
  standard: { emoji: '🟢', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', labelFr: 'Filière standard' },
  reinforced: { emoji: '🟠', cls: 'bg-amber-50 text-amber-800 border-amber-200', labelFr: 'Filière sous contrôles UE renforcés' },
  special_conditions: { emoji: '🔴', cls: 'bg-red-50 text-red-700 border-red-200', labelFr: 'Filière sous conditions spéciales UE' },
};

/**
 * Le produit relève-t-il du règlement EUDR (déforestation) ?
 * Miroir de EUDR_CATEGORIES d'exportRoadmap, exposé ici pour le
 * moteur de conformité.
 */
export function isEudrProduct(productType: string | null | undefined): boolean {
  const cat = exportCategory(productType);
  return cat === 'coffee_green' || cat === 'coffee_roasted' || cat === 'cocoa';
}
