/**
 * Dédoublonnage pipeline CRM ↔ viviers de consultation.
 *
 * Le CRM et les viviers écrivent les mêmes entités différemment :
 *   CRM   « Scopéli (supermarché coopératif de Nantes) » / « Rezé (20 r. de l'Abbé Grégoire) »
 *   vivier « Scopéli » / « Rezé »
 * La clef exacte nom|ville ne suffit donc pas. On normalise : minuscules,
 * accents retirés, parenthèses (précisions d'adresse/description) ignorées,
 * ponctuation aplatie. La ville est réduite à sa base (avant parenthèse).
 * Logique PURE et testée — l'UI ne fait que l'appliquer au chargement.
 */

function fold(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Nom normalisé, sans les précisions entre parenthèses. */
export function normName(name: string | null | undefined): string {
  return fold((name ?? '').replace(/\([^)]*\)/g, ' '));
}

/** Ville de base normalisée : « Rezé (20 r. …) » → « reze ». */
export function normCity(city: string | null | undefined): string {
  return fold((city ?? '').split('(')[0]);
}

/** Clef de dédoublonnage nom+ville. Ville absente → nom seul (prudent). */
export function dedupKey(name: string | null | undefined, city: string | null | undefined): string {
  const n = normName(name);
  const c = normCity(city);
  return c ? `${n}|${c}` : n;
}

export interface DedupRow {
  name: string;
  city: string | null;
  siren?: string | null;
  external_id?: string | null;
  source?: string | null;
}

/**
 * Construit l'ensemble des clefs occupées par le pipeline CRM :
 * clefs nom+ville normalisées, nom seul (pour matcher les fiches vivier sans
 * ville, ex. producteurs FLOCERT), SIREN et external_id promus (notés dans source).
 */
export function crmKeySets(dbRows: DedupRow[]): {
  keys: Set<string>; namesOnly: Set<string>; sirens: Set<string>; extIds: Set<string>;
} {
  const keys = new Set<string>();
  const namesOnly = new Set<string>();
  const sirens = new Set<string>();
  const extIds = new Set<string>();
  for (const r of dbRows) {
    keys.add(dedupKey(r.name, r.city));
    const n = normName(r.name);
    if (n) namesOnly.add(n);
    if (r.siren) sirens.add(r.siren);
    const ms = r.source?.match(/siren:(\d{9})/);
    if (ms) sirens.add(ms[1]);
    const me = r.source?.match(/ext:([\w-]+)/);
    if (me) extIds.add(me[1]);
    if (r.external_id) extIds.add(r.external_id);
  }
  return { keys, namesOnly, sirens, extIds };
}

/** Une fiche de vivier est-elle déjà couverte par le pipeline CRM ? */
export function isInCrm(row: DedupRow, sets: ReturnType<typeof crmKeySets>): boolean {
  if (row.external_id && sets.extIds.has(row.external_id)) return true;
  if (row.siren && sets.sirens.has(row.siren)) return true;
  if (sets.keys.has(dedupKey(row.name, row.city))) return true;
  // fiche vivier SANS ville (producteurs internationaux) : match sur le nom seul
  if (!normCity(row.city) && sets.namesOnly.has(normName(row.name))) return true;
  return false;
}
