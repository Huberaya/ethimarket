// =============================================================
// EthiMarket — Annuaire de laboratoires accrédités & moteur
// d'analyses par lot (couche 4 du Product Trust Pipeline, Phase 2)
//
// Zéro coût : données PUBLIQUES embarquées (réseaux de labos
// mondiaux, organismes nationaux d'accréditation signataires de
// l'ILAC MRA), moteur local déterministe. Les analyses elles-mêmes
// (100-400 €/échantillon) sont payées par le lot, jamais par
// EthiMarket.
//
// Trois briques :
//  1. hazard UE (règl. 2019/1793) → analyse de laboratoire précise
//  2. pays d'origine → labos internationaux présents sur place +
//     organisme d'accréditation national (pour vérifier le labo)
//  3. étapes guidées de vérification d'un COA par l'admin
//     (le COA se vérifie auprès du LABO ÉMETTEUR, jamais sur la
//     seule foi du PDF).
// =============================================================

import { assessEuRisk, type EuHazard } from './euRiskList';
import { normalizeCountry } from './registryDirectory';

// ─────────────────────────────────────────────────────────────
// 1. Danger réglementaire → analyse à commander
// ─────────────────────────────────────────────────────────────

export interface AnalysisMeta {
  /** Libellé FR de l'analyse telle qu'on la commande à un labo. */
  label: string;
  /** Méthode usuelle (pour parler le langage du labo). */
  method: string;
  /** Fourchette indicative en € par échantillon (tarifs publics 2026). */
  priceRange: [number, number];
}

export const ANALYSIS_FOR_HAZARD: Record<EuHazard, AnalysisMeta> = {
  aflatoxins: {
    label: 'Mycotoxines — aflatoxines B1/B2/G1/G2 (+ B1 seule)',
    method: 'HPLC-FLD ou LC-MS/MS',
    priceRange: [80, 180],
  },
  ochratoxin_a: {
    label: 'Ochratoxine A',
    method: 'HPLC-FLD',
    priceRange: [70, 150],
  },
  pesticide_residues: {
    label: 'Multi-résidus de pesticides (~500 molécules)',
    method: 'LC-MS/MS + GC-MS/MS',
    priceRange: [150, 350],
  },
  salmonella: {
    label: 'Microbiologie — Salmonella spp. (absence /25 g)',
    method: 'ISO 6579-1',
    priceRange: [30, 80],
  },
  sudan_dyes: {
    label: 'Colorants Soudan I-IV (interdits)',
    method: 'LC-MS/MS',
    priceRange: [90, 200],
  },
  pyrrolizidine_alkaloids: {
    label: 'Alcaloïdes pyrrolizidiniques (somme des 21/35 AP)',
    method: 'LC-MS/MS',
    priceRange: [150, 300],
  },
  ethylene_oxide: {
    label: 'Oxyde d\'éthylène + 2-chloroéthanol',
    method: 'GC-MS/MS',
    priceRange: [100, 220],
  },
};

/** Analyse de fond recommandée hors listes UE (surtout pour le bio). */
export const BASELINE_ORGANIC_ANALYSIS: AnalysisMeta = {
  label: 'Multi-résidus de pesticides — preuve de conduite bio',
  method: 'LC-MS/MS + GC-MS/MS',
  priceRange: [150, 350],
};

export interface RecommendedAnalysis extends AnalysisMeta {
  /** Pourquoi cette analyse (traçable jusqu'au règlement). */
  reason: string;
  /** true = exigée par le régime UE de la filière, false = conseillée. */
  mandatory: boolean;
}

/**
 * Quelles analyses commander pour CE produit de CETTE origine ?
 * Fonction PURE, pilotée par la même table de risque que le
 * dossier de lot (cohérence garantie avec coa_lot/official_certificate).
 */
export function recommendedAnalyses(
  productType: string | null | undefined,
  productName: string | null | undefined,
  originCountry: string | null | undefined,
  isOrganic = false,
): RecommendedAnalysis[] {
  const risk = assessEuRisk(productType, productName, originCountry);
  const out: RecommendedAnalysis[] = [];
  const seen = new Set<EuHazard>();
  for (const m of risk.matches) {
    if (seen.has(m.hazard)) continue;
    seen.add(m.hazard);
    out.push({
      ...ANALYSIS_FOR_HAZARD[m.hazard],
      reason: `${m.productLabel} — annexe ${m.annex} du règl. 2019/1793 (${m.checkFrequency}% de contrôles frontière)`,
      mandatory: m.annex === 'II',
    });
  }
  if (isOrganic && !seen.has('pesticide_residues')) {
    out.push({
      ...BASELINE_ORGANIC_ANALYSIS,
      reason: 'Produit vendu bio : un multi-résidus « non détecté » est la meilleure preuve de conduite biologique.',
      mandatory: false,
    });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
// 2. Labos présents par pays + accréditation nationale
// ─────────────────────────────────────────────────────────────

export interface LabNetwork {
  name: string;
  /** Annuaire public des implantations. */
  directoryUrl: string;
}

/** Réseaux mondiaux — présents dans la quasi-totalité de nos origines. */
export const GLOBAL_LAB_NETWORKS: LabNetwork[] = [
  { name: 'Eurofins', directoryUrl: 'https://www.eurofins.com/contact-us/worldwide-interactive-map/' },
  { name: 'SGS', directoryUrl: 'https://www.sgs.com/en/office-directory' },
  { name: 'Bureau Veritas', directoryUrl: 'https://group.bureauveritas.com/group/our-presence' },
  { name: 'Intertek', directoryUrl: 'https://www.intertek.com/contact/worldwide/' },
];

export interface AccreditationBody {
  /** Organisme national d'accréditation (signataire ILAC MRA). */
  name: string;
  url: string;
}

/**
 * Organismes nationaux d'accréditation (ILAC MRA) pour nos
 * origines : c'est LÀ qu'on vérifie qu'un labo est accrédité
 * ISO/IEC 17025 — pas sur le papier à en-tête du COA.
 */
export const ACCREDITATION_BODIES: Record<string, AccreditationBody> = {
  'France': { name: 'COFRAC', url: 'https://tools.cofrac.fr/annexes/sect1/1-0002.pdf' },
  'Éthiopie': { name: 'EAS (Ethiopian Accreditation Service)', url: 'https://eas.gov.et' },
  'Ghana': { name: 'GhaNAS (Ghana National Accreditation Service)', url: 'https://ghanas.gov.gh' },
  'Côte d\'Ivoire': { name: 'SOAC (Système Ouest-Africain d\'Accréditation)', url: 'https://soac-wa.org' },
  'Burkina Faso': { name: 'SOAC (Système Ouest-Africain d\'Accréditation)', url: 'https://soac-wa.org' },
  'Kenya': { name: 'KENAS (Kenya Accreditation Service)', url: 'https://kenas.go.ke' },
  'Madagascar': { name: 'via réseaux internationaux (COFRAC/UKAS)', url: 'https://ilac.org/signatory-search/' },
  'Maroc': { name: 'SEMAC (Service Marocain d\'Accréditation)', url: 'https://www.mcinet.gov.ma' },
  'Tunisie': { name: 'TUNAC (Conseil National d\'Accréditation)', url: 'https://tunac.tn' },
  'Égypte': { name: 'EGAC (Egyptian Accreditation Council)', url: 'https://egac.gov.eg' },
  'Inde': { name: 'NABL (National Accreditation Board for Testing and Calibration Laboratories)', url: 'https://nabl-india.org' },
  'Sri Lanka': { name: 'SLAB (Sri Lanka Accreditation Board)', url: 'https://slab.lk' },
  'Pérou': { name: 'INACAL (Instituto Nacional de Calidad)', url: 'https://www.gob.pe/inacal' },
  'Mexique': { name: 'EMA (Entidad Mexicana de Acreditación)', url: 'https://www.ema.org.mx' },
  'Brésil': { name: 'CGCRE/Inmetro', url: 'https://www.gov.br/inmetro' },
  'Colombie': { name: 'ONAC (Organismo Nacional de Acreditación)', url: 'https://onac.org.co' },
  'Turquie': { name: 'TÜRKAK', url: 'https://turkak.org.tr' },
};

/** Recherche mondiale de dernier recours : signataires de l'ILAC MRA. */
export const ILAC_SIGNATORY_SEARCH = 'https://ilac.org/signatory-search/';

/** Index par clé normalisée (normalizeCountry retourne minuscules sans accents). */
const ACCREDITATION_BY_NORMALIZED: Record<string, AccreditationBody> = Object.fromEntries(
  Object.entries(ACCREDITATION_BODIES).map(([k, v]) => [normalizeCountry(k), v]),
);

export interface LabResolution {
  /** Réseaux mondiaux à contacter (bureau local via leur annuaire). */
  networks: LabNetwork[];
  /** Organisme d'accréditation où vérifier le labo choisi. */
  accreditation: AccreditationBody;
  /** Le pays a-t-il un organisme national listé, ou fallback ILAC ? */
  nationalBodyKnown: boolean;
}

/** Labos + accréditation pour un pays d'origine. Fonction PURE. */
export function resolveLabs(originCountry: string | null | undefined): LabResolution {
  const country = normalizeCountry(originCountry);
  const body = ACCREDITATION_BY_NORMALIZED[country];
  return {
    networks: GLOBAL_LAB_NETWORKS,
    accreditation: body ?? { name: 'ILAC (recherche des signataires MRA)', url: ILAC_SIGNATORY_SEARCH },
    nationalBodyKnown: Boolean(body),
  };
}

// ─────────────────────────────────────────────────────────────
// 3. Circuit d'une demande d'analyse + vérification du COA
// ─────────────────────────────────────────────────────────────

export type AnalysisStatus =
  | 'requested'        // demande créée (producteur ou acheteur)
  | 'sample_sent'      // échantillon parti au labo
  | 'report_received'  // rapport (COA) reçu et déposé
  | 'verified'         // COA vérifié par l'admin auprès du labo émetteur
  | 'rejected';        // COA non conforme / invérifiable → incident

/** Transitions autorisées — miroir TS du garde SQL. Fonction PURE. */
export function canTransitionAnalysis(
  from: AnalysisStatus,
  to: AnalysisStatus,
  isAdmin: boolean,
): boolean {
  if (from === 'verified' || from === 'rejected') return false; // états finaux
  if (to === 'verified' || to === 'rejected') {
    return isAdmin && from === 'report_received'; // verdict admin, rapport en main
  }
  const order: AnalysisStatus[] = ['requested', 'sample_sent', 'report_received'];
  return order.indexOf(to) === order.indexOf(from) + 1; // avancée pas à pas
}

export const ANALYSIS_STATUS_META: Record<AnalysisStatus, { emoji: string; labelFr: string; cls: string }> = {
  requested: { emoji: '📋', labelFr: 'Analyse demandée', cls: 'bg-gray-100 text-gray-700 border-gray-200' },
  sample_sent: { emoji: '📦', labelFr: 'Échantillon envoyé au labo', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  report_received: { emoji: '🧪', labelFr: 'Rapport reçu — en attente de vérification', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  verified: { emoji: '✅', labelFr: 'COA vérifié auprès du labo', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { emoji: '⛔', labelFr: 'COA rejeté', cls: 'bg-red-50 text-red-700 border-red-200' },
};

/**
 * Étapes guidées de vérification d'un COA pour l'admin.
 * Principe : un PDF se falsifie en 5 minutes ; l'accréditation du
 * labo et le n° de rapport se vérifient à la source.
 */
export function coaVerificationSteps(
  labName: string | null | undefined,
  labCountry: string | null | undefined,
  reportNumber: string | null | undefined,
): string[] {
  const labs = resolveLabs(labCountry);
  const lab = labName?.trim() || 'le laboratoire émetteur';
  return [
    `1. Vérifier que ${lab} est accrédité ISO/IEC 17025 : registre ${labs.accreditation.name} (${labs.accreditation.url})${labs.nationalBodyKnown ? '' : ' — pays sans organisme national listé, passer par la recherche ILAC'}.`,
    `2. Contacter ${lab} par le canal OFFICIEL de son site (jamais les coordonnées imprimées sur le COA, qui peuvent être falsifiées) et demander confirmation du rapport n° ${reportNumber?.trim() || '(à renseigner)'}.`,
    '3. Comparer le COA au lot : numéro de lot identique au dossier, date de prélèvement plausible, produit et origine cohérents.',
    '4. Lire les résultats contre les limites UE : LMR pesticides (règl. 396/2005), aflatoxines (règl. 2023/915), Salmonella absence/25g. En cas de doute, rejeter et demander une contre-analyse.',
  ];
}
