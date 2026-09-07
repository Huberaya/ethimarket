/**
 * Plan de tournée de la prospection : vagues de villes priorisées,
 * semaine par semaine, pour chaque pipeline × phase.
 * Source des priorités : PLAN_CONQUETE §2.1 (vagues A→D) et §3 (Europe).
 * Logique PURE et testée — l'UI ne fait qu'afficher et filtrer.
 */

export interface ProspectLite {
  kind: 'buyer' | 'producer';
  phase: number;
  city: string | null;
  country: string;
  status: string;
}

// ------------------------------------------------------------ normalisation

/** Communes de l'agglomération nantaise regroupées sous « Nantes & agglo ». */
const AGGLO_NANTES = [
  'nantes', 'rezé', 'reze', 'orvault', 'saint-herblain', 'st-herblain',
  'carquefou', 'vertou', 'bouguenais', 'la chapelle-sur-erdre',
  'vigneux-de-bretagne', 'sainte-luce', 'basse-goulaine',
];

/**
 * Extrait la ville « métropole » d'un champ city libre :
 * « Nantes (2 r. Sylvain Paris) » → Nantes ; « Nantes/Orvault » → Nantes & agglo ;
 * « Rezé (147 rte des Sorinières) » → Nantes & agglo.
 */
export function normalizeCity(city: string | null): string {
  if (!city || !city.trim()) return 'Non renseignée';
  let c = city.split('(')[0].split('/')[0].split('+')[0].trim();
  if (!c) c = city.trim();
  // arrondissements : « Paris 19e » → « Paris », « Marseille 13e » → « Marseille »
  c = c.replace(/\s+\d{1,2}e(r)?$/i, '');
  const lower = c.toLowerCase();
  if (AGGLO_NANTES.some(a => lower.startsWith(a))) return 'Nantes & agglo';
  if (lower.startsWith('epron')) return 'Caen';
  // capitale d'usage : première lettre en majuscule, reste préservé
  return c;
}

// ------------------------------------------------------------ vagues

export interface Wave {
  week: string;       // « Semaine 1 », « Semaines 3-4 »…
  label: string;      // « Nantes & agglo »
  rationale: string;  // pourquoi cette priorité
  /** Villes normalisées incluses (match exact sur normalizeCity). */
  cities?: string[];
  /** Pays inclus (pipeline producteurs : on raisonne par filière/pays). */
  countries?: string[];
  /** Vague fourre-tout : attrape ce qui n'est dans aucune autre. */
  rest?: boolean;
}

/** Les vagues par pipeline × phase (décisions du plan de conquête §2.1/§3). */
export function getWaves(kind: 'buyer' | 'producer', phase: number): Wave[] {
  if (kind === 'buyer') {
    if (phase === 1) return [
      { week: 'Semaine 1', label: 'Nantes & agglo', cities: ['Nantes & agglo'], rationale: 'La preuve locale d\u2019abord : densité maximale, visites physiques possibles le jour même.' },
      { week: 'Semaine 2', label: 'Rennes & couronne', cities: ['Rennes', 'Pacé', 'Vern-sur-Seiche', 'Melesse', 'Mordelles', 'Domloup', 'La Bouëxière', 'Vitré', 'Bain-de-Bretagne'], rationale: 'Scarabée Biocoop + brûleries + LOBODIS (pionnier du café équitable FR, à Bain-de-Bretagne) et Les Cafés Félix (négoce café-cacao à Pacé) : le bassin rennais élargi.' },
      { week: 'Semaine 3', label: 'Bretagne Sud', cities: ['Lorient', 'Vannes', 'Louargat'], rationale: 'Lorient + Vannes en une tournée (1h30 de route) ; Caffè Cataldi sur le trajet retour.' },
      { week: 'Semaine 4', label: 'Angers, Le Mans & Vendée', cities: ['Angers', 'Le Mans', 'Sargé-lès-le-Mans', 'Allonnes', 'Sablé-sur-Sarthe', 'La Ferté-Bernard', 'Montval-sur-Loir', 'La Roche-sur-Yon', 'Olonne-sur-Mer', 'Challans', 'Les Achards', 'Saint-Gilles-Croix-de-Vie', 'Saint-Hilaire-de-Riez', 'Brem-sur-Mer', 'La Guérinière', 'Aizenay', 'Fontenay-le-Comte', 'Chantonnay', 'Pornic', 'Le Landreau', 'La Baule'], rationale: 'L\u2019axe Loire + la côte vendéenne : Angers/Le Mans en train (réseaux Le Fenouil et CABA), Challans/La Roche/Les Sables en voiture (1 journée, Léopold + Croq\u2019bio + torréfacteurs).' },
      { week: 'Semaines 5-6', label: 'Brest, Tours, Caen & Laval', cities: ['Brest', 'Tours', 'Caen', 'Colombelles', 'Bretteville-sur-Odon', 'Évrecy', 'Evrecy', 'Quimper', 'Concarneau', 'Carhaix-Plouguer', 'Pont-l\'Abbé', 'Plozévet', 'Douarnenez', 'Fouesnant', 'Landerneau', 'Le Faou', 'La Rochelle', 'Lagord', 'Puilboreau', 'Rochefort', 'Châtelaillon-Plage', 'Saintes', 'Royan', 'Breuillet', 'Dolus-d\'Oléron', 'Périgny', 'Dinard', 'Dol-de-Bretagne', 'Avranches', 'Laval', 'Saint-Fort', 'Saint-Brieuc', 'Plérin', 'Trégueux', 'Saint-Cast-le-Guildo', 'Fréhel', 'Pédernec', 'Guingamp', 'Plouha'], rationale: 'Le grand Ouest élargi : brûleries historiques (Léon, Coïc, El Cafecito), Kafeta (7 torréfactions d\u2019un coup), la Cornouaille (Lambour 1975, Plozévet, Poher), Laval (Mayenne Bio Soleil, 6 magasins), bassin briochin (La Gambille, 5 magasins), agglo caennaise (Céleste, Arbuste, Dauré) et arc rochelais Saintes-Royan — e-mail d\u2019abord, tournée si réponse.' },
      { week: 'Semaine 7', label: 'Normandie est (Rouen, Le Havre, Dieppe)', cities: ['Rouen', 'Buchy', 'Isneauville', 'Amfreville-la-Mi-Voie', 'Le Havre', 'Dieppe', 'Fécamp', 'Évreux', 'Evreux', 'Montivilliers'], rationale: 'Le bassin Rouen/Le Havre : Couleur Café (boutique + école de café + coffee shop), Anne Caron (Meilleure Torréfactrice de France G&M 2019), Bonkawa (fournisseur entreprises), Biocoop du Rouennais — 2h de train de Nantes, tournée e-mail puis présentiel.' },
      { week: 'En continu', label: 'À distance (e-shops…)', rest: true, rationale: 'E-commerçants et cibles hors tournée : e-mail J0/J+4/J+10, pas de déplacement.' },
    ];
    if (phase === 2) return [
      { week: 'Semaine 1', label: 'Réseaux & fédérations', cities: ['France', 'Clichy'], rationale: 'Collectif Café + SCA France : la crédibilité filière ouvre toutes les portes suivantes.' },
      { week: 'Semaines 2-3', label: 'Belgique francophone', cities: ['Bruxelles', 'Sombreffe', 'Liège', 'Namur'], countries: ['Belgique'], rationale: 'Zéro douane, zéro barrière de langue : Interbio d\u2019abord (un référencement = tout le canal wallon).' },
      { week: 'Semaines 4-5', label: 'Bordeaux & Paris', cities: ['Bordeaux', 'Paris', 'Versailles'], rationale: 'Torréfacteurs premium (Piha, L\u2019Alchimiste, Belleville, Lomi, Coutume), bean-to-bar (Plaq, Hasnaâ) puis Terres de Café avec le casebook régional.' },
      { week: 'Semaines 6-7', label: 'Lyon, Toulouse & Sud', cities: ['Lyon', 'Toulouse', 'Marseille', 'Nice', 'Grenoble', 'Montpellier'], rationale: 'Mokxa, Bacquié, Criollo, Luciani, Brûlerie des Alpes : les scènes café/chocolat régionales — e-mail puis visio.' },
      { week: 'Semaine 8', label: 'Nord & Est + grossistes', cities: ['Lille', 'Strasbourg', 'Carpentras', 'Île-de-France', 'Morlaix', 'Le Havre'], rationale: 'Méo et Reck (maisons historiques, approche dossier), Relais Vert/Vitafrais en clients-grossistes, Grain de Sail.' },
      { week: 'En continu', label: 'Autres cibles', rest: true, rationale: 'Cibles hors vagues : traiter au fil des réponses.' },
    ];
    if (phase === 3) return [
      { week: 'Mois 1-2', label: 'Allemagne — indépendants', cities: ['Berlin', 'Munich', 'Hambourg'], countries: ['Allemagne'], rationale: 'Le 1er marché bio UE importe par nécessité : Bioläden et torréfacteurs indépendants d\u2019abord (décision rapide), en anglais.' },
      { week: 'Mois 3', label: 'Pays-Bas — le dossier Udea', countries: ['Pays-Bas'], rationale: 'Distribution verrouillée : UN dossier de référencement Udea/Ekoplaza, présenté à Biofach — pas de porte-à-porte.' },
      { week: 'Mois 4-5', label: 'Suisse romande', cities: ['Genève', 'Lausanne'], countries: ['Suisse'], rationale: 'Record mondial de dépense bio/hab : uniquement les produits haute valeur (safran, vanille, micro-lots).' },
      { week: 'M18+', label: 'Chaînes DE (dossiers)', cities: ['Darmstadt', 'Töpen'], rationale: 'dennree/Alnatura SEULEMENT avec la preuve FR+BE (taux de service documentés).' },
      { week: 'En continu', label: 'Autres cibles', rest: true, rationale: 'Inbound et opportunités hors plan.' },
    ];
  }
  // ---------------- producteurs : on raisonne par filière/pays
  if (phase === 1) return [
    { week: 'Semaine 1', label: 'Éthiopie — café', countries: ['Éthiopie', 'Ethiopie'], rationale: 'La filière n°1 (produits scorés 92/90/85) : YCFCU, SCFCU, OCFCU ont des e-mails officiels — partir ici.' },
    { week: 'Semaine 2', label: 'Maroc — argane & safran', countries: ['Maroc'], rationale: 'Taitmatine, Marjana, Souktana : coopératives féminines/AOP joignables en français.' },
    { week: 'Semaine 3', label: 'Madagascar — vanille', countries: ['Madagascar'], rationale: 'Sahanala + Biovanilla (interlocuteur francophone) : la filière anti-fraude par excellence.' },
    { week: 'En continu', label: 'Autres filières', rest: true, rationale: 'Répondre à l\u2019inbound, préparer la vague 2.' },
  ];
  if (phase === 2) return [
    { week: 'Semaines 1-2', label: 'Pérou — café & quinoa', countries: ['Pérou', 'Perou'], rationale: 'Norandino (FLO 21943) et COOPAIN Cabana ont des contacts export directs — en espagnol/anglais.' },
    { week: 'Semaine 3', label: 'Ghana — cacao EUDR', countries: ['Ghana'], rationale: 'Kuapa Kokoo : le GPS parcelles devient l\u2019argument commercial de la vague chocolatiers.' },
    { week: 'Semaine 4', label: 'Inde & Sri Lanka — épices/thé', countries: ['Inde', 'Sri Lanka'], rationale: 'PDS Kerala (bio+Fairtrade+Demeter) et SOFA : la vague 2 du plan produits.' },
    { week: 'En continu', label: 'Autres filières', rest: true, rationale: 'Madagascar épices (Fanohana), miel Grèce… au fil des besoins acheteurs.' },
  ];
  return [
    { week: 'Mois 1', label: 'Réseaux continentaux', countries: ['El Salvador', 'Kenya'], rationale: 'CLAC et Fairtrade Africa : un webinaire = des centaines de coopératives touchées.' },
    { week: 'Mois 2', label: 'Agences & programmes', countries: ['Pays-Bas', 'Belgique'], rationale: 'CBI et TDC/Enabel : leurs cohortes « market-ready » sont notre vivier.' },
    { week: 'En continu', label: 'Autres réseaux', rest: true, rationale: 'NAPP et opportunités inbound.' },
  ];
}

// ------------------------------------------------------------ affectation

/** Une cible appartient-elle à cette vague ? */
export function isInWave(p: ProspectLite, wave: Wave): boolean {
  if (wave.rest) return true; // le fourre-tout matche tout — à n'utiliser qu'en dernier
  const metro = normalizeCity(p.city);
  if (wave.cities?.some(c => metro.toLowerCase() === c.toLowerCase())) return true;
  if (wave.countries?.some(c => p.country.toLowerCase() === c.toLowerCase())) return true;
  return false;
}

/** La vague d'une cible = la PREMIÈRE vague qui la contient (le reste en dernier). */
export function waveOf(p: ProspectLite, waves: Wave[]): Wave | null {
  for (const w of waves) {
    if (!w.rest && isInWave(p, w)) return w;
  }
  return waves.find(w => w.rest) ?? null;
}

export interface WaveStats {
  wave: Wave;
  total: number;
  contacted: number; // tout sauf a_contacter
  converted: number; // inscrit/actif
}

/** Statistiques par vague pour un ensemble de cibles (déjà filtré kind+phase). */
export function waveStats(prospects: ProspectLite[], waves: Wave[]): WaveStats[] {
  return waves.map(w => {
    const inWave = prospects.filter(p => waveOf(p, waves) === w);
    return {
      wave: w,
      total: inWave.length,
      contacted: inWave.filter(p => p.status !== 'a_contacter').length,
      converted: inWave.filter(p => ['inscrit', 'actif'].includes(p.status)).length,
    };
  });
}

/** Liste des villes normalisées distinctes (pour le filtre déroulant). */
export function distinctCities(prospects: ProspectLite[]): string[] {
  const set = new Set(prospects.map(p => normalizeCity(p.city)));
  return [...set].sort((a, b) => a.localeCompare(b, 'fr'));
}
