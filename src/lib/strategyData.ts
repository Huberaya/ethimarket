/**
 * Données structurées du plan stratégique (docs/PLAN_STRATEGIQUE_ETHIMARKET.md).
 * Source de vérité UNIQUE pour la synthèse visuelle (/admin/strategie) et
 * l'angle produit du CRM (/admin/prospection). Toute modification du plan
 * doit être répercutée ici — et inversement.
 * Politique d'honnêteté : chaque chiffre vient du plan (lui-même sourcé) ;
 * les hypothèses non sourcées sont marquées comme telles dans le plan.
 */

// ------------------------------------------------------------------ produits

export interface ScoredProduct {
  rank: number;
  name: string;
  short: string;
  score: number;
  target: string;
  price: string;
  recurrence: string;
  active: boolean; // poussé activement au lancement (produits 1-6)
  why: string;
}

/** §6.2 — Vague 1, les 12 produits de lancement (décision ferme). */
export const WAVE1_PRODUCTS: ScoredProduct[] = [
  { rank: 1, name: 'Café vert Yirgacheffe G1/G2 lavé', short: 'Yirgacheffe', score: 92, target: 'Torréfacteurs', price: '9-14 €/kg', recurrence: 'Mensuelle', active: true, why: 'Cours haussiers → sécurisation ; FOB union 8-11 $/kg documenté ; EUDR prêt' },
  { rank: 2, name: 'Café vert Sidama G2 bio', short: 'Sidama', score: 90, target: 'Torréfacteurs', price: '8-12 €/kg', recurrence: 'Mensuelle', active: true, why: 'Volume du quotidien (espresso) ; SCFCU 10 000 t/an certifiée FLO' },
  { rank: 3, name: 'Vanille Bourbon gousses Grade A', short: 'Vanille Bourbon', score: 88, target: 'Pâtissiers, épiceries, restaurants', price: '250-450 €/kg', recurrence: 'Trimestrielle', active: true, why: 'Valeur/kg extrême = logistique triviale ; anti-fraude (n° lot) = notre force' },
  { rank: 4, name: 'Micro-lots café naturels (Guji/Yirga)', short: 'Micro-lots café', score: 85, target: 'Torréfacteurs premium', price: '14-25 €/kg', recurrence: 'Saisonnier', active: true, why: 'Storytelling maximal, marge torréfacteur élevée → fidélise' },
  { rank: 5, name: 'Huile d\u2019argane alimentaire IGP bio', short: 'Argane alimentaire', score: 84, target: 'Épiceries, restaurants', price: '28-45 €/L', recurrence: 'Trimestrielle', active: true, why: 'Coopératives féminines = histoire + UNESCO ; DLC longue' },
  { rank: 6, name: 'Café torréfié « origine » 250 g/1 kg', short: 'Café torréfié', score: 82, target: 'Épiceries bio', price: '18-30 €/kg', recurrence: 'Mensuelle', active: false, why: 'Boucle : le torréfacteur client devient fournisseur des épiceries' },
  { rank: 7, name: 'Cacao fèves Ghana bio-équitable', short: 'Cacao Ghana', score: 81, target: 'Bean-to-bar', price: '6-9 €/kg', recurrence: 'Bimestrielle', active: false, why: 'EUDR = notre aimant ; prix minimum 3 500 $/t + primes documentés' },
  { rank: 8, name: 'Huile d\u2019argane cosmétique pure', short: 'Argane cosmétique', score: 80, target: 'Épiceries, marques indie', price: '30-60 €/L', recurrence: 'Trimestrielle', active: true, why: 'Même filière, 2e débouché — rester INGRÉDIENT (pas de cosmétique fini)' },
  { rank: 9, name: 'Safran Taliouine AOP', short: 'Safran Taliouine', score: 79, target: 'Restaurants, épiceries fines', price: '8-15 €/g vrac', recurrence: 'Semestrielle', active: false, why: 'Valeur/g maximale ; ISO 3632 + COA = différenciation anti-fraude totale' },
  { rank: 10, name: 'Thé vert Sencha bio Japon', short: 'Sencha Japon', score: 74, target: 'Épiceries, salons de thé', price: '25-60 €/kg', recurrence: 'Trimestrielle', active: false, why: 'Diversifie l\u2019origine ; JAS déjà dans nos annuaires' },
  { rank: 11, name: 'Miel de thym Grèce', short: 'Miel de thym', score: 72, target: 'Épiceries', price: '12-20 €/kg', recurrence: 'Trimestrielle', active: false, why: 'UE = pas de douane ; certificat sanitaire géré par notre pipeline' },
  { rank: 12, name: 'Quinoa blanc/rouge bio Pérou', short: 'Quinoa Pérou', score: 70, target: 'Épiceries, restaurants', price: '4-7 €/kg', recurrence: 'Bimestrielle', active: false, why: 'Volume et panier ; BioLatina dans nos annuaires' },
];

// ------------------------------------------------------------------ marché

/** §4.1 — entonnoir marché (bornes basses/hautes en M€/an). */
export const MARKET_FUNNEL = [
  { label: 'TAM — tropicaux bio/équitables Europe', low: 10_000, high: 15_000, note: 'Hypothèse stratégique (Agence Bio 2025 : imports ~29 % du bio FR dont ¾ tropicaux → ~2,6 Mds € FR seule)' },
  { label: 'SAM — nos catégories × spécialisé/artisans FR+BE', low: 400, high: 700, note: 'Épicerie bio spécialisée FR 3,76 Mds € ; café de spécialité ~150 M€ ; cacao équitable 520 M€ (bornes larges assumées)' },
  { label: 'SOM 3 ans — 0,5-1 % du SAM', low: 2, high: 7, note: 'Objectif GMV Y3 réaliste' },
] as const;

/** Contexte marché sourcé (§3 + données Agence Bio / Max Havelaar 2025-2026). */
export const MARKET_STATS = [
  { label: 'Marché bio France 2025', value: '12,6 Mds €', trend: '+3,6 %', source: 'Agence Bio' },
  { label: 'Commerce équitable FR 2025', value: '1,5 Md €', trend: '+9 %', source: 'Max Havelaar' },
  { label: 'Torréfacteurs artisanaux FR', value: '~1 000', trend: '+15 %/an', source: 'Collectif Café / LSA' },
  { label: 'Imports dans le bio consommé FR', value: '28-29 %', trend: '¾ tropicaux', source: 'Agence Bio' },
] as const;

// ------------------------------------------------------------------ phases

export interface Phase {
  id: string;
  label: string;
  months: [number, number]; // bornes M inclusives (M1 = 1) ; 25+ = Y3+
  focus: string;
  exit: string;
  color: string;
}

/** §5 — pénétration par vagues. */
export const PHASES: Phase[] = [
  { id: 'p1', label: 'Phase 1 — Grand Ouest : la preuve', months: [1, 3], focus: 'Nantes/Grand Ouest, 3 filières héros, outbound fondateur', exit: '≥10 commandes conformes, ≥3 acheteurs récurrents, ≥2 témoignages', color: '#10b981' },
  { id: 'p2', label: 'Phase 2 — France + Belgique : la répétabilité', months: [4, 9], focus: 'Biocoop magasins, grossistes, chocolatiers EUDR, services M6', exit: 'GMV ≥25 k€/mois ×3, ≥25 acheteurs actifs, hub 3PL signé', color: '#0ea5e9' },
  { id: 'p3', label: 'Phase 3 — Europe N-O + B2C vitrine', months: [10, 24], focus: 'Hub actif, Allemagne, B2C vitrine, marque propre M12', exit: 'Régime de croisière piloté au KPI', color: '#8b5cf6' },
  { id: 'p4', label: 'Phase 4 — International', months: [25, 36], focus: 'Hors Europe (Y3+)', exit: '—', color: '#f59e0b' },
];

// ------------------------------------------------------------------ économie

/** §8.3 — scénarios GMV mensuel au M12 (k€). Rampe illustrative vers la cible. */
export const GMV_SCENARIOS = [
  { label: 'Conservateur', m12: 15, color: '#94a3b8', note: '60 commandes → ~1 k€/mois : survie, pivot pricing' },
  { label: 'Réaliste', m12: 40, color: '#0ea5e9', note: '120 commandes, 35 acheteurs actifs → ~3-4 k€/mois' },
  { label: 'Ambitieux', m12: 90, color: '#10b981', note: 'Hub actif, Belgique ouverte → ~8-10 k€/mois' },
] as const;

/**
 * Rampe mensuelle illustrative (croissance composée M1→M12 vers la cible).
 * Ce ne sont PAS des prévisions engageantes — juste la trajectoire type.
 */
export function scenarioCurve(m12: number, months = 12): number[] {
  const m1 = Math.max(0.5, m12 * 0.02);
  const r = Math.pow(m12 / m1, 1 / (months - 1));
  return Array.from({ length: months }, (_, i) => m1 * Math.pow(r, i));
}

/** §8.2 — unit economics cibles année 1 (hypothèses à valider, cf. plan). */
export const UNIT_ECONOMICS = [
  { label: 'Panier moyen B2B', value: '600 €', detail: 'mix torréfacteurs 1 500 € / épiceries 250 €' },
  { label: 'Commission lancement', value: '5 %', detail: 'services dès M6, abonnement Verified+ M9' },
  { label: 'LTV brute', value: '600 €', detail: '600 € × 8 cmd/an × 5 % × 2,5 ans' },
  { label: 'CAC max acceptable', value: '150 €', detail: 'LTV/CAC ≥ 4 ; outbound fondateur ~30-60 €' },
  { label: 'Point mort opérationnel', value: '45-60 k€', detail: 'GMV/mois, commission seule (structure légère)' },
  { label: 'Coût vérification producteur', value: '80-150 €', detail: '2-4 h/dossier — amorti si ≥3 k€ GMV/an' },
] as const;

// ------------------------------------------------------------------ acquisition

/** §9.1 — canaux pour les 100 premiers clients (priorités décidées). */
export const ACQUISITION_CHANNELS = [
  { label: 'Outbound e-mail + appel (CRM 70 cibles)', potential: 4, speed: 'rapide', priority: 'P0', cost: 'temps' },
  { label: 'Visites physiques Nantes/Ouest', potential: 4, speed: 'rapide', priority: 'P0', cost: 'temps + essence' },
  { label: 'SEO (blog 5 langues, déjà posé)', potential: 4, speed: 'lent (12 mois)', priority: 'P1', cost: 'temps' },
  { label: 'Dégustations chez torréfacteurs', potential: 3, speed: 'moyen', priority: 'P1', cost: '~200 €/mois' },
  { label: 'LinkedIn fondateur (2 posts/sem.)', potential: 3, speed: 'lent', priority: 'P1', cost: 'temps' },
  { label: 'Salons (Natexpo, Salon du Chocolat)', potential: 3, speed: 'ponctuel', priority: 'P1', cost: '0 € visiteur' },
  { label: 'Publicité payante', potential: 1, speed: '—', priority: 'ÉCARTÉ avant M9', cost: '≥1 500 €/mois' },
] as const;

// ------------------------------------------------------------------ CRM : angle produit par segment

export interface SegmentPitch {
  products: string[]; // short names de WAVE1_PRODUCTS
  angle: string;
  hook: string; // l'accroche d'attaque en une phrase
}

/** Segments côté acheteurs vs côté producteurs (pipelines du CRM). */
export const BUYER_SEGMENTS = [
  'torrefacteur', 'epicerie_bio', 'biocoop', 'restaurant', 'epicerie_en_ligne',
  'chocolatier', 'cosmetique', 'grossiste', 'centrale', 'food_service', 'industriel',
] as const;
export const PRODUCER_SEGMENTS = [
  'cafe', 'vanille', 'argane', 'cacao', 'safran', 'epices', 'miel', 'quinoa', 'karite',
] as const;

/**
 * Matching produit → segments : pour chaque produit de la vague 1, quels
 * segments producteurs le fournissent et quels segments acheteurs l'achètent
 * (inversion de SEGMENT_PITCHES). C'est la base du « si un producteur café
 * s'inscrit, voici les acheteurs à activer ».
 */
export function productMatch(short: string): { buyerSegments: string[]; producerSegments: string[] } {
  const buyerSegments: string[] = [];
  const producerSegments: string[] = [];
  for (const [seg, pitch] of Object.entries(SEGMENT_PITCHES)) {
    if (!pitch.products.includes(short)) continue;
    if ((BUYER_SEGMENTS as readonly string[]).includes(seg)) buyerSegments.push(seg);
    else if ((PRODUCER_SEGMENTS as readonly string[]).includes(seg)) producerSegments.push(seg);
  }
  return { buyerSegments, producerSegments };
}

/**
 * Le pont CRM ↔ produits : pour chaque segment de prospection, quels
 * produits pousser et avec quel argument (dérivé des §4.2, 6.2 et 9.1).
 */
export const SEGMENT_PITCHES: Record<string, SegmentPitch> = {
  torrefacteur: {
    products: ['Yirgacheffe', 'Sidama', 'Micro-lots café'],
    angle: 'Sécurisation d\u2019approvisionnement en direct, FOB coopérative documenté, dossier EUDR prêt.',
    hook: 'Les cours du café ont pris +70 % : sécurisez un approvisionnement direct union/coopérative, documents EUDR inclus.',
  },
  epicerie_bio: {
    products: ['Vanille Bourbon', 'Argane alimentaire', 'Café torréfié', 'Miel de thym', 'Quinoa Pérou'],
    angle: 'L\u2019histoire producteur vérifiée en rayon : QR de traçabilité publique sur chaque lot.',
    hook: 'Chaque produit arrive avec sa traçabilité publique scannable en rayon — l\u2019histoire du producteur, prouvée, pas racontée.',
  },
  biocoop: {
    products: ['Vanille Bourbon', 'Argane alimentaire', 'Café torréfié', 'Quinoa Pérou'],
    angle: 'Entrer par le magasin (décision locale possible), référencer la centrale en phase 3 avec nos taux de service.',
    hook: 'Des filières équitables vérifiées aux registres, compatibles avec l\u2019exigence Biocoop — décision magasin possible.',
  },
  restaurant: {
    products: ['Vanille Bourbon', 'Safran Taliouine', 'Argane alimentaire'],
    angle: 'Ingrédients signature à forte valeur, authenticité prouvée (ISO 3632, n° de lot).',
    hook: 'Vanille et safran authentifiés lot par lot — l\u2019histoire se raconte sur la carte.',
  },
  epicerie_en_ligne: {
    products: ['Vanille Bourbon', 'Safran Taliouine', 'Café torréfié', 'Sencha Japon'],
    angle: 'Le contenu de traçabilité enrichit la fiche produit — différenciation e-commerce immédiate.',
    hook: 'Chaque lot a une page de traçabilité publique à lier depuis vos fiches produits.',
  },
  chocolatier: {
    products: ['Cacao Ghana'],
    angle: 'EUDR = obligation légale : géolocalisation parcelles fournie, prix minimum + primes documentés.',
    hook: 'Le règlement déforestation (EUDR) vous impose la géolocalisation : notre cacao Ghana arrive dossier complet.',
  },
  cosmetique: {
    products: ['Argane cosmétique'],
    angle: 'Ingrédient tracé coopératives féminines — nous restons fournisseur d\u2019ingrédient, jamais concurrent.',
    hook: 'Argane pure de coopératives féminines IGP, traçabilité complète pour vos allégations.',
  },
  grossiste: {
    products: ['Yirgacheffe', 'Vanille Bourbon', 'Argane alimentaire', 'Quinoa Pérou'],
    angle: 'Multiplicateur phase 2 : dossier avec taux de service et conformité documentaire prouvés en phase 1.',
    hook: 'Un sourcing équitable vérifié, avec les données de taux de service pour votre référencement.',
  },
  centrale: {
    products: ['Vanille Bourbon', 'Argane alimentaire', 'Café torréfié'],
    angle: 'NE PAS approcher avant la phase 3 : dossier référencement avec historique taux de service.',
    hook: '(Phase 3 uniquement) Dossier de référencement adossé à nos données de taux de service.',
  },
  food_service: {
    products: ['Vanille Bourbon', 'Safran Taliouine', 'Quinoa Pérou'],
    angle: 'Volumes réguliers, conformité documentaire gérée par la plateforme.',
    hook: 'Ingrédients équitables tracés, documents sanitaires gérés automatiquement.',
  },
  industriel: {
    products: ['Cacao Ghana', 'Sidama'],
    angle: 'Phase 3 : volumes contractuels, conformité EUDR/bio industrialisée.',
    hook: '(Phase 3) Approvisionnement contractuel avec conformité EUDR native.',
  },
  // segments producteurs → la filière du plan à laquelle ils contribuent
  cafe: { products: ['Yirgacheffe', 'Sidama', 'Micro-lots café'], angle: 'Filière d\u2019ancrage n°1 — unions FLO-ID vérifiables, FOB 8-11 $/kg documenté.', hook: 'Accès direct aux torréfacteurs français, vérification aux registres offerte.' },
  vanille: { products: ['Vanille Bourbon'], angle: 'Filière d\u2019ancrage n°2 — SAVA, registre Ecocert, anti-fraude par n° de lot.', hook: 'Vendez en direct aux professionnels européens, authentification incluse.' },
  argane: { products: ['Argane alimentaire', 'Argane cosmétique'], angle: 'Filière d\u2019ancrage n°3 — coopératives féminines IGP Agadir/Essaouira.', hook: 'Deux débouchés (alimentaire + cosmétique) sur un même lot vérifié.' },
  cacao: { products: ['Cacao Ghana'], angle: 'Vague 2 — GPS parcelles EUDR = l\u2019argument qui ouvre les portes bean-to-bar.', hook: 'Vos parcelles géolocalisées deviennent un avantage commercial EUDR.' },
  safran: { products: ['Safran Taliouine'], angle: 'AOP Taliouine, ISO 3632 — l\u2019anti-fraude est l\u2019argument.', hook: 'Chaque gramme authentifié ISO 3632 : le safran prouvé se vend mieux.' },
  epices: { products: ['Sencha Japon', 'Safran Taliouine'], angle: 'Vague 2 (M4-M9) — COA EtO gérés par notre annuaire labos.', hook: 'Conformité UE 2019/1793 gérée par la plateforme.' },
  miel: { products: ['Miel de thym'], angle: 'Vague 1 étendue — UE, pas de douane, certificat sanitaire pipeline.', hook: 'Circuit court UE avec documents sanitaires automatisés.' },
  quinoa: { products: ['Quinoa Pérou'], angle: 'Vague 1 étendue — volume et panier épiceries.', hook: 'Accès au réseau d\u2019épiceries bio françaises vérifié BioLatina.' },
  karite: { products: ['Argane cosmétique'], angle: 'Vague 2 cosmétique ingrédient — même logique que l\u2019argane.', hook: 'Ingrédient tracé pour marques indie européennes.' },
};
