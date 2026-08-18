// =============================================================
// EthiMarket — Annuaire des registres officiels par pays
//
// Chantier 1 : registre du commerce du pays du producteur,
// directement dans le dossier d'audit (lien + instructions).
//
// Chantier 2 : concordance label × pays — « Bio » déclaré par un
// producteur chilien → l'autorité bio du Chili (SAG), pas un
// annuaire générique. Fallback : registres mondiaux du label.
//
// Données 100 % locales (zéro API), sources : portails officiels
// des États et des organismes. Chaque entrée est un point de
// vérification À LA SOURCE pour l'auditeur.
// =============================================================

export interface RegistryEntry {
  name: string;
  url: string;
  notes: string;          // instructions pratiques pour l'auditeur
  free: boolean;          // consultation de base gratuite ?
  lang: string;           // langue(s) de l'interface
}

// -------------------------------------------------------------
// 1. REGISTRES DU COMMERCE PAR PAYS
// -------------------------------------------------------------

/** 17 États membres OHADA : un registre fédéré unique. */
const OHADA: RegistryEntry = {
  name: 'RCCM — portail fédéré OHADA',
  url: 'https://rccm.ohada.org',
  notes: 'Recherche par dénomination ou n° RCCM. Compte gratuit (email). Couvre 17 États d\'Afrique de l\'Ouest et centrale.',
  free: true,
  lang: 'FR',
};

const OHADA_COUNTRIES = [
  'bénin', 'burkina faso', 'cameroun', 'centrafrique', 'république centrafricaine',
  'comores', 'congo', 'république du congo', 'rdc', 'république démocratique du congo',
  'côte d\'ivoire', 'gabon', 'guinée', 'guinée-bissau', 'guinée équatoriale',
  'mali', 'niger', 'sénégal', 'tchad', 'togo',
];

export const BUSINESS_REGISTRIES: Record<string, RegistryEntry> = {
  // --- Afrique (hors OHADA) ---
  'éthiopie': { name: 'Ministry of Trade — eTrade Registry', url: 'https://etrade.gov.et', notes: 'Recherche d\'entreprise par nom (Trade Name Search). Interface amharique/anglais.', free: true, lang: 'EN/AM' },
  'ghana': { name: 'Office of the Registrar of Companies (ORC)', url: 'https://orcghana.gov.gh', notes: 'Recherche par nom d\'entreprise (Entity Search). Numéro d\'immatriculation à croiser avec le document fourni.', free: true, lang: 'EN' },
  'maroc': { name: 'OMPIC — DirectInfo (Registre de Commerce)', url: 'https://www.directinfo.ma', notes: 'Recherche par dénomination ou n° RC. Fiche de base gratuite, extraits payants.', free: true, lang: 'FR/AR' },
  'madagascar': { name: 'EDBM — Registre du Commerce et des Sociétés', url: 'https://edbm.mg', notes: 'Recherche via le guichet unique EDBM ; à défaut, demander un extrait RCS récent (tribunal de commerce d\'Antananarivo).', free: true, lang: 'FR' },
  'kenya': { name: 'Business Registration Service (eCitizen)', url: 'https://brs.ecitizen.go.ke', notes: 'Business Name Search via compte eCitizen. Recherche officielle payante (~150 KES).', free: false, lang: 'EN' },
  'tanzanie': { name: 'BRELA — Online Registration System', url: 'https://ors.brela.go.tz', notes: 'Recherche de nom d\'entreprise en ligne (compte requis).', free: true, lang: 'EN/SW' },
  'ouganda': { name: 'Uganda Registration Services Bureau (URSB)', url: 'https://ursb.go.ug', notes: 'Recherche de dénomination via le portail URSB.', free: true, lang: 'EN' },
  'rwanda': { name: 'Rwanda Development Board — Business Registry', url: 'https://rdb.rw/business-registration/', notes: 'Recherche d\'entreprise en ligne, registre moderne et fiable.', free: true, lang: 'EN/FR' },
  'nigéria': { name: 'Corporate Affairs Commission (CAC)', url: 'https://search.cac.gov.ng', notes: 'Public Search par nom ou n° RC.', free: true, lang: 'EN' },
  'tunisie': { name: 'Registre National des Entreprises (RNE)', url: 'https://www.registre-entreprises.tn', notes: 'Recherche par identifiant unique ou raison sociale.', free: true, lang: 'FR/AR' },
  'égypte': { name: 'GAFI — General Authority for Investment', url: 'https://www.gafi.gov.eg', notes: 'Vérification via GAFI ; à défaut demander un extrait du registre commercial récent.', free: true, lang: 'EN/AR' },
  'afrique du sud': { name: 'CIPC — BizPortal', url: 'https://www.bizportal.gov.za', notes: 'Company search par nom ou n° d\'enregistrement.', free: true, lang: 'EN' },

  // --- Amérique latine ---
  'chili': { name: 'Registro de Empresas y Sociedades', url: 'https://www.registrodeempresasysociedades.cl', notes: 'Recherche par RUT ou raison sociale. Compléter avec le SII (situation fiscale).', free: true, lang: 'ES' },
  'pérou': { name: 'SUNARP — Consulta de registros', url: 'https://www.sunarp.gob.pe', notes: 'Consulta en línea (personne morale) ; croiser avec la consulta RUC de la SUNAT (gratuite).', free: true, lang: 'ES' },
  'mexique': { name: 'SIGER — Registro Público de Comercio', url: 'https://rpc.economia.gob.mx', notes: 'Consultas SIGER par dénomination ; croiser avec le RFC (SAT).', free: true, lang: 'ES' },
  'colombie': { name: 'RUES — Registro Único Empresarial', url: 'https://www.rues.org.co', notes: 'Recherche gratuite par NIT ou raison sociale, données des chambres de commerce.', free: true, lang: 'ES' },
  'brésil': { name: 'Receita Federal — consulta CNPJ', url: 'https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp', notes: 'Consultation gratuite de la fiche CNPJ (situation cadastrale).', free: true, lang: 'PT' },
  'équateur': { name: 'Superintendencia de Compañías', url: 'https://appscvsmovil.supercias.gob.ec/portalInformacion/index.zul', notes: 'Portal de información — recherche par nom ou RUC.', free: true, lang: 'ES' },
  'bolivie': { name: 'SEPREC — Registro de Comercio', url: 'https://www.seprec.gob.bo', notes: 'Vérification de matricule de commerce en ligne.', free: true, lang: 'ES' },

  // --- Asie / Moyen-Orient ---
  'inde': { name: 'Ministry of Corporate Affairs (MCA)', url: 'https://www.mca.gov.in/content/mca/global/en/mca/master-data/MDS.html', notes: 'Master Data Search par CIN/nom. Pour les coopératives agricoles : registre de l\'État concerné.', free: true, lang: 'EN' },
  'sri lanka': { name: 'Department of the Registrar of Companies (eROC)', url: 'https://eroc.drc.gov.lk', notes: 'Recherche de société en ligne.', free: true, lang: 'EN' },
  'vietnam': { name: 'National Business Registration Portal', url: 'https://dangkykinhdoanh.gov.vn', notes: 'Recherche par nom ou code entreprise (interface EN disponible).', free: true, lang: 'VI/EN' },
  'indonésie': { name: 'Ditjen AHU — Kemenkumham', url: 'https://ahu.go.id', notes: 'Recherche de personne morale (profil payant).', free: false, lang: 'ID' },
  'thaïlande': { name: 'DBD DataWarehouse', url: 'https://datawarehouse.dbd.go.th', notes: 'Recherche gratuite par nom ou n° d\'enregistrement.', free: true, lang: 'TH/EN' },
  'japon': { name: 'Houjin Bangou (NTA Corporate Number)', url: 'https://www.houjin-bangou.nta.go.jp', notes: 'Recherche par nom : numéro d\'entreprise à 13 chiffres, adresse officielle.', free: true, lang: 'JA/EN' },
  'iran': { name: 'Registre des sociétés (SSAA)', url: 'https://irsherkat.ssaa.ir', notes: 'Recherche par nom (interface persane). À défaut : demander le journal officiel d\'immatriculation (Rooznameh Rasmi).', free: true, lang: 'FA' },
  'turquie': { name: 'MERSIS / Registre du commerce turc', url: 'https://mersis.ticaret.gov.tr', notes: 'Vérification via numéro MERSIS.', free: true, lang: 'TR' },

  // --- Europe ---
  'france': { name: 'Annuaire des Entreprises (data INPI)', url: 'https://annuaire-entreprises.data.gouv.fr', notes: 'Recherche gratuite par SIREN/SIRET ou nom — données officielles INPI/INSEE.', free: true, lang: 'FR' },
  'belgique': { name: 'Banque-Carrefour des Entreprises (BCE)', url: 'https://kbopub.economie.fgov.be', notes: 'Public Search par n° BCE ou dénomination.', free: true, lang: 'FR/NL' },
  'grèce': { name: 'GEMI — Registre général du commerce', url: 'https://publicity.businessportal.gr', notes: 'Recherche par n° GEMI ou nom (interface EN disponible).', free: true, lang: 'EL/EN' },
  'espagne': { name: 'Registro Mercantil Central', url: 'https://www.rmc.es', notes: 'Consultation par dénomination sociale.', free: false, lang: 'ES' },
  'portugal': { name: 'Publicações do Ministério da Justiça', url: 'https://publicacoes.mj.pt', notes: 'Recherche gratuite des actes de sociétés par NIPC.', free: true, lang: 'PT' },
  'italie': { name: 'Registro Imprese', url: 'https://www.registroimprese.it', notes: 'Recherche par dénomination (fiche de base).', free: false, lang: 'IT/EN' },
  'allemagne': { name: 'Handelsregister', url: 'https://www.handelsregister.de', notes: 'Recherche gratuite (registre du tribunal).', free: true, lang: 'DE/EN' },
  'suisse': { name: 'Zefix — Registre central du commerce', url: 'https://www.zefix.ch', notes: 'Recherche gratuite par nom ou IDE.', free: true, lang: 'FR/DE/IT/EN' },
};

/** Normalise un nom de pays (accents, casse, variantes courantes). */
export function normalizeCountry(raw: string | null | undefined): string {
  if (!raw) return '';
  const s = raw.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const aliases: Record<string, string> = {
    'ethiopia': 'ethiopie', 'morocco': 'maroc', 'peru': 'perou', 'mexico': 'mexique',
    'india': 'inde', 'greece': 'grece', 'japan': 'japon', 'chile': 'chili',
    'brazil': 'bresil', 'colombia': 'colombie', 'ecuador': 'equateur',
    'ivory coast': 'cote d\'ivoire', 'cote divoire': 'cote d\'ivoire',
    'burkina': 'burkina faso', 'drc': 'rdc', 'turkey': 'turquie',
    'germany': 'allemagne', 'spain': 'espagne', 'italy': 'italie',
    'switzerland': 'suisse', 'belgium': 'belgique',
  };
  return aliases[s] ?? s;
}

/** Résout le registre du commerce du pays (OHADA prioritaire). Fonction pure. */
export function resolveBusinessRegistry(country: string | null | undefined): RegistryEntry | null {
  const c = normalizeCountry(country);
  if (!c) return null;
  if (OHADA_COUNTRIES.some(o => normalizeCountry(o) === c)) return OHADA;
  // Recherche directe puis sans accents
  for (const [key, entry] of Object.entries(BUSINESS_REGISTRIES)) {
    if (normalizeCountry(key) === c) return entry;
  }
  return null;
}

// -------------------------------------------------------------
// 2. CONCORDANCE LABEL × PAYS
// -------------------------------------------------------------

export type LabelFamily = 'organic' | 'fairtrade' | 'rainforest' | 'globalgap' | 'gots' | 'other';

/** Classe un libellé de certification déclaré en famille. Fonction pure. */
export function classifyLabel(label: string | null | undefined): LabelFamily {
  const s = (label ?? '').toLowerCase();
  if (/rainforest|utz/.test(s)) return 'rainforest';
  if (/fair\s*trade|fairtrade|max havelaar|flo|equitable|équitable/.test(s)) return 'fairtrade';
  if (/global\s*g\.?a\.?p/.test(s)) return 'globalgap';
  if (/gots|textile/.test(s)) return 'gots';
  if (/bio|organic|orgánic|organik|ecológic|ecocert|ab\b|eu organic|usda|nop|jas|agriculture biologique/.test(s)) return 'organic';
  return 'other';
}

/** Autorités/registres BIO nationaux (pays producteurs). */
const ORGANIC_BY_COUNTRY: Record<string, RegistryEntry> = {
  'chili': { name: 'SAG — Sistema Nacional de Certificación Orgánica', url: 'https://www.sag.gob.cl/ambitos-de-accion/certificacion-de-productos-organicos-agricolas', notes: 'Le SAG publie la liste des opérateurs et organismes certificateurs bio agréés au Chili. Vérifier que le certificateur du producteur y figure, puis consulter le registre du certificateur.', free: true, lang: 'ES' },
  'pérou': { name: 'SENASA — Registro de operadores orgánicos', url: 'https://www.senasa.gob.pe', notes: 'Le SENASA tient le registre national des opérateurs organiques certifiés (production biologique).', free: true, lang: 'ES' },
  'mexique': { name: 'SENASICA — Padrón de operadores orgánicos (LPO)', url: 'https://www.gob.mx/senasica', notes: 'Registre des opérateurs certifiés sous la Ley de Productos Orgánicos.', free: true, lang: 'ES' },
  'inde': { name: 'APEDA — TraceNet (NPOP)', url: 'https://apeda.gov.in/apedawebsite/organic/Organic_Products.htm', notes: 'TraceNet liste les opérateurs certifiés NPOP et permet la vérification des Transaction Certificates.', free: true, lang: 'EN' },
  'maroc': { name: 'ONSSA — Production biologique', url: 'https://www.onssa.gov.ma', notes: 'L\'ONSSA agrée les organismes certificateurs bio au Maroc (loi 39-12) et publie la liste des opérateurs.', free: true, lang: 'FR/AR' },
  'tunisie': { name: 'Ministère de l\'Agriculture — Agriculture biologique (CTAB)', url: 'http://www.ctab.tn', notes: 'Le CTAB publie la liste des opérateurs et certificateurs bio agréés en Tunisie.', free: true, lang: 'FR/AR' },
  'france': { name: 'Agence Bio — Annuaire officiel des opérateurs', url: 'https://annuaire.agencebio.org', notes: 'Annuaire public : tout opérateur bio français y figure avec son certificat téléchargeable. Vérification en 30 secondes.', free: true, lang: 'FR' },
  'japon': { name: 'MAFF — Certification JAS', url: 'https://www.maff.go.jp/e/policies/standard/jas/', notes: 'Liste des opérateurs et organismes JAS agréés (bio Japon).', free: true, lang: 'JA/EN' },
  'états-unis': { name: 'USDA Organic Integrity Database', url: 'https://organic.ams.usda.gov/integrity/', notes: 'Recherche par nom/n° NOP — certificats téléchargeables, statuts révoqués visibles.', free: true, lang: 'EN' },
  'brésil': { name: 'MAPA — Cadastro Nacional de Produtores Orgânicos', url: 'https://www.gov.br/agricultura/pt-br/assuntos/sustentabilidade/organicos', notes: 'Cadastre national des producteurs organiques certifiés.', free: true, lang: 'PT' },
  'colombie': { name: 'MinAgricultura — Registro de operadores ecológicos', url: 'https://www.minagricultura.gov.co', notes: 'Registre des opérateurs écologiques ; croiser avec le certificateur agréé.', free: true, lang: 'ES' },
};

/** Registres MONDIAUX par famille de label (fallback universel). */
const GLOBAL_LABEL_REGISTRIES: Record<LabelFamily, RegistryEntry[]> = {
  organic: [
    { name: 'Ecocert — annuaire des clients certifiés', url: 'https://www.ecocert.com/en/business-directory', notes: 'Si le certificateur est Ecocert : vérifier numéro, périmètre, validité.', free: true, lang: 'EN/FR' },
    { name: 'USDA Organic Integrity Database', url: 'https://organic.ams.usda.gov/integrity/', notes: 'Toute opération certifiée NOP (États-Unis), certificats téléchargeables.', free: true, lang: 'EN' },
    { name: 'Control Union — certificate check', url: 'https://certificates.controlunion.com', notes: 'Vérification en ligne des certificats émis par Control Union.', free: true, lang: 'EN' },
  ],
  fairtrade: [
    { name: 'FLOCERT — Customer Search', url: 'https://www.flocert.net/about-flocert/customer-search/', notes: 'LE registre Fairtrade mondial : chercher par nom ou FLO ID, vérifier statut et périmètre.', free: true, lang: 'EN' },
  ],
  rainforest: [
    { name: 'Rainforest Alliance — certificate search', url: 'https://www.rainforest-alliance.org/business/certification/', notes: 'Recherche des titulaires de certificats Rainforest Alliance (fusion UTZ incluse).', free: true, lang: 'EN' },
  ],
  globalgap: [
    { name: 'GLOBALG.A.P. — database validation', url: 'https://database.globalgap.org', notes: 'Vérifier le GGN (13 chiffres) : statut, périmètre produit, validité.', free: true, lang: 'EN' },
  ],
  gots: [
    { name: 'GOTS — supplier database', url: 'https://www.global-standard.org/find-suppliers-shops-and-inputs/certified-suppliers/database', notes: 'Base publique des opérateurs certifiés GOTS (nom, licence, périmètre).', free: true, lang: 'EN' },
  ],
  other: [],
};

export interface LabelResolution {
  family: LabelFamily;
  /** Autorité nationale du pays du producteur (si elle existe) */
  national: RegistryEntry | null;
  /** Registres mondiaux du label (toujours utilisables) */
  global: RegistryEntry[];
}

/**
 * Chantier 2 : « certifié bio » + « Chili » → SAG Chili + fallbacks mondiaux.
 * Fonction pure.
 */
export function resolveLabelRegistry(label: string | null | undefined, country: string | null | undefined): LabelResolution {
  const family = classifyLabel(label);
  const c = normalizeCountry(country);
  let national: RegistryEntry | null = null;
  if (family === 'organic' && c) {
    for (const [key, entry] of Object.entries(ORGANIC_BY_COUNTRY)) {
      if (normalizeCountry(key) === c) { national = entry; break; }
    }
  }
  return { family, national, global: GLOBAL_LABEL_REGISTRIES[family] };
}

// -------------------------------------------------------------
// 3. WHATSAPP (chantier 3)
// -------------------------------------------------------------

/** Indicatifs téléphoniques des pays de la plateforme. */
export const COUNTRY_DIAL: Record<string, string> = {
  'éthiopie': '251', 'ghana': '233', 'maroc': '212', 'madagascar': '261',
  'kenya': '254', 'tanzanie': '255', 'ouganda': '256', 'rwanda': '250',
  'sénégal': '221', 'côte d\'ivoire': '225', 'cameroun': '237', 'mali': '223',
  'togo': '228', 'bénin': '229', 'nigéria': '234', 'tunisie': '216', 'égypte': '20',
  'afrique du sud': '27', 'chili': '56', 'pérou': '51', 'mexique': '52',
  'colombie': '57', 'brésil': '55', 'équateur': '593', 'bolivie': '591',
  'inde': '91', 'sri lanka': '94', 'vietnam': '84', 'indonésie': '62',
  'thaïlande': '66', 'japon': '81', 'iran': '98', 'turquie': '90',
  'france': '33', 'belgique': '32', 'grèce': '30', 'espagne': '34',
  'portugal': '351', 'italie': '39', 'allemagne': '49', 'suisse': '41',
};

/**
 * Construit un lien WhatsApp (wa.me) à partir d'un numéro saisi librement.
 * - retire tout sauf les chiffres ;
 * - si le numéro commence par 00 → le retire ;
 * - si le numéro commence par 0 (format national) et que le pays est connu
 *   → remplace le 0 par l'indicatif pays ;
 * - message pré-rempli optionnel.
 * Retourne null si le numéro est inexploitable. Fonction pure.
 */
export function buildWhatsAppLink(
  rawPhone: string | null | undefined,
  country?: string | null,
  message?: string,
): string | null {
  if (!rawPhone) return null;
  let digits = rawPhone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) {
    const dial = COUNTRY_DIAL[normalizeCountry(country)];
    if (dial) digits = dial + digits.slice(1);
    else return null; // format national sans pays connu : inexploitable
  }
  if (digits.length < 8 || digits.length > 15) return null;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
