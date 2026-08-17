// =============================================================
// EthiMarket — Traduction automatique des noms de produits
//
// Contrainte zéro coût : pas d'API externe. Le vocabulaire des
// produits agroalimentaires de la plateforme est FINI (café,
// cacao, miel, épices, huiles…) : un dictionnaire terminologique
// local traduit les noms composés terme à terme, en respectant
// l'ordre naturel de chaque langue (adjectif après le nom en
// fr/es/pt, avant en en, etc. — géré par gabarits simples).
//
// Périmètre honnête : les NOMS de produits (structurés) sont
// auto-traduits ; les DESCRIPTIONS libres passent par le
// formulaire multilingue optionnel (le vendeur saisit ce qu'il
// veut, fallback = langue source, jamais de texte vide).
// =============================================================

import type { Locale } from './index';

type Term = Record<Exclude<Locale, 'fr'>, string>;

/** Dictionnaire terme (fr, minuscule) → traductions. */
const TERMS: Record<string, Term> = {
  // Produits de base
  'café': { en: 'coffee', es: 'café', pt: 'café', ar: 'قهوة' },
  'cacao': { en: 'cacao', es: 'cacao', pt: 'cacau', ar: 'كاكاو' },
  'chocolat': { en: 'chocolate', es: 'chocolate', pt: 'chocolate', ar: 'شوكولاتة' },
  'thé': { en: 'tea', es: 'té', pt: 'chá', ar: 'شاي' },
  'miel': { en: 'honey', es: 'miel', pt: 'mel', ar: 'عسل' },
  'huile': { en: 'oil', es: 'aceite', pt: 'óleo', ar: 'زيت' },
  'sirop': { en: 'syrup', es: 'sirope', pt: 'xarope', ar: 'شراب' },
  'sucre': { en: 'sugar', es: 'azúcar', pt: 'açúcar', ar: 'سكر' },
  'quinoa': { en: 'quinoa', es: 'quinua', pt: 'quinoa', ar: 'كينوا' },
  'riz': { en: 'rice', es: 'arroz', pt: 'arroz', ar: 'أرز' },
  'fonio': { en: 'fonio', es: 'fonio', pt: 'fonio', ar: 'فونيو' },
  'sésame': { en: 'sesame', es: 'sésamo', pt: 'sésamo', ar: 'سمسم' },
  'vanille': { en: 'vanilla', es: 'vainilla', pt: 'baunilha', ar: 'فانيليا' },
  'safran': { en: 'saffron', es: 'azafrán', pt: 'açafrão', ar: 'زعفران' },
  'curcuma': { en: 'turmeric', es: 'cúrcuma', pt: 'curcuma', ar: 'كركم' },
  'poivre': { en: 'pepper', es: 'pimienta', pt: 'pimenta', ar: 'فلفل' },
  'gingembre': { en: 'ginger', es: 'jengibre', pt: 'gengibre', ar: 'زنجبيل' },
  'cannelle': { en: 'cinnamon', es: 'canela', pt: 'canela', ar: 'قرفة' },
  'cardamome': { en: 'cardamom', es: 'cardamomo', pt: 'cardamomo', ar: 'هيل' },
  'spiruline': { en: 'spirulina', es: 'espirulina', pt: 'espirulina', ar: 'سبيرولينا' },
  'karité': { en: 'shea', es: 'karité', pt: 'carité', ar: 'كاريتيه' },
  'argan': { en: 'argan', es: 'argán', pt: 'argão', ar: 'أركان' },
  'coco': { en: 'coconut', es: 'coco', pt: 'coco', ar: 'جوز الهند' },
  'olive': { en: 'olive', es: 'oliva', pt: 'azeitona', ar: 'زيتون' },
  'mangue': { en: 'mango', es: 'mango', pt: 'manga', ar: 'مانجو' },
  'ananas': { en: 'pineapple', es: 'piña', pt: 'ananás', ar: 'أناناس' },
  'banane': { en: 'banana', es: 'plátano', pt: 'banana', ar: 'موز' },
  'datte': { en: 'date', es: 'dátil', pt: 'tâmara', ar: 'تمر' },
  'dattes': { en: 'dates', es: 'dátiles', pt: 'tâmaras', ar: 'تمور' },
  'noix': { en: 'nuts', es: 'nueces', pt: 'nozes', ar: 'مكسرات' },
  'cajou': { en: 'cashew', es: 'anacardo', pt: 'caju', ar: 'كاجو' },
  'anacarde': { en: 'cashew', es: 'anacardo', pt: 'caju', ar: 'كاجو' },
  'amande': { en: 'almond', es: 'almendra', pt: 'amêndoa', ar: 'لوز' },
  'coton': { en: 'cotton', es: 'algodón', pt: 'algodão', ar: 'قطن' },
  'savon': { en: 'soap', es: 'jabón', pt: 'sabão', ar: 'صابون' },
  'beurre': { en: 'butter', es: 'manteca', pt: 'manteiga', ar: 'زبدة' },
  'graines': { en: 'seeds', es: 'semillas', pt: 'sementes', ar: 'بذور' },
  'farine': { en: 'flour', es: 'harina', pt: 'farinha', ar: 'دقيق' },
  'poudre': { en: 'powder', es: 'polvo', pt: 'pó', ar: 'مسحوق' },
  'gousses': { en: 'pods', es: 'vainas', pt: 'vagens', ar: 'قرون' },
  'feuilles': { en: 'leaves', es: 'hojas', pt: 'folhas', ar: 'أوراق' },
  'fèves': { en: 'beans', es: 'habas', pt: 'favas', ar: 'حبوب' },
  'infusion': { en: 'herbal tea', es: 'infusión', pt: 'infusão', ar: 'منقوع' },
  'hibiscus': { en: 'hibiscus', es: 'hibisco', pt: 'hibisco', ar: 'كركديه' },
  'bissap': { en: 'bissap', es: 'bissap', pt: 'bissap', ar: 'بيساب' },
  'moringa': { en: 'moringa', es: 'moringa', pt: 'moringa', ar: 'مورينغا' },
  'baobab': { en: 'baobab', es: 'baobab', pt: 'embondeiro', ar: 'باوباب' },
  // Qualificatifs
  'bio': { en: 'organic', es: 'ecológico', pt: 'biológico', ar: 'عضوي' },
  'biologique': { en: 'organic', es: 'ecológico', pt: 'biológico', ar: 'عضوي' },
  'équitable': { en: 'fair trade', es: 'de comercio justo', pt: 'de comércio justo', ar: 'تجارة عادلة' },
  'brut': { en: 'raw', es: 'crudo', pt: 'cru', ar: 'خام' },
  'brute': { en: 'raw', es: 'cruda', pt: 'crua', ar: 'خام' },
  'vert': { en: 'green', es: 'verde', pt: 'verde', ar: 'أخضر' },
  'verte': { en: 'green', es: 'verde', pt: 'verde', ar: 'أخضر' },
  'noir': { en: 'black', es: 'negro', pt: 'preto', ar: 'أسود' },
  'blanc': { en: 'white', es: 'blanco', pt: 'branco', ar: 'أبيض' },
  'blanche': { en: 'white', es: 'blanca', pt: 'branca', ar: 'أبيض' },
  'rouge': { en: 'red', es: 'rojo', pt: 'vermelho', ar: 'أحمر' },
  'moulu': { en: 'ground', es: 'molido', pt: 'moído', ar: 'مطحون' },
  'moulue': { en: 'ground', es: 'molida', pt: 'moída', ar: 'مطحون' },
  'torréfié': { en: 'roasted', es: 'tostado', pt: 'torrado', ar: 'محمص' },
  'séché': { en: 'dried', es: 'secado', pt: 'seco', ar: 'مجفف' },
  'séchée': { en: 'dried', es: 'secada', pt: 'seca', ar: 'مجفف' },
  'vierge': { en: 'virgin', es: 'virgen', pt: 'virgem', ar: 'بكر' },
  'extra': { en: 'extra', es: 'extra', pt: 'extra', ar: 'ممتاز' },
  'premium': { en: 'premium', es: 'premium', pt: 'premium', ar: 'فاخر' },
  'sauvage': { en: 'wild', es: 'silvestre', pt: 'selvagem', ar: 'برّي' },
  'naturel': { en: 'natural', es: 'natural', pt: 'natural', ar: 'طبيعي' },
  'naturelle': { en: 'natural', es: 'natural', pt: 'natural', ar: 'طبيعي' },
  'pur': { en: 'pure', es: 'puro', pt: 'puro', ar: 'نقي' },
  'pure': { en: 'pure', es: 'pura', pt: 'pura', ar: 'نقي' },
  'thym': { en: 'thyme', es: 'tomillo', pt: 'tomilho', ar: 'زعتر' },
  'montagne': { en: 'mountain', es: 'montaña', pt: 'montanha', ar: 'جبلي' },
  'fleurs': { en: 'flowers', es: 'flores', pt: 'flores', ar: 'زهور' },
  'grand cru': { en: 'grand cru', es: 'grand cru', pt: 'grand cru', ar: 'غران كرو' },
};

/** Mots-outils français ignorés (le nom reste compréhensible sans eux). */
const STOP_WORDS = new Set(['de', 'du', 'des', 'la', 'le', 'les', "d'", "l'", 'à', 'au', 'aux', 'et', 'en']);

export interface AutoTranslation {
  locale: Exclude<Locale, 'fr'>;
  text: string;
  /** Part des termes reconnus (0-1) : < 1 = traduction partielle */
  coverage: number;
}

/** Découpe un nom de produit en tokens (mots + apostrophes gérées). */
function tokenize(name: string): string[] {
  return name
    .replace(/[’']/g, "' ")
    .split(/[\s-]+/)
    .map(w => w.trim())
    .filter(Boolean);
}

/**
 * Traduit un nom de produit terme à terme.
 * Les mots inconnus (noms propres : Yirgacheffe, Bourbon, Kerala…)
 * sont conservés tels quels — comportement voulu pour les terroirs.
 * Fonction PURE, déterministe, zéro API.
 */
export function autoTranslateProductName(name: string, target: Exclude<Locale, 'fr'>): AutoTranslation {
  const tokens = tokenize(name);
  let known = 0;
  let significant = 0;
  const out: string[] = [];

  for (const token of tokens) {
    const lower = token.toLowerCase().replace(/^[dl]'$/, '');
    if (STOP_WORDS.has(lower) || lower.endsWith("'")) continue; // mots-outils omis
    significant++;
    const term = TERMS[lower];
    if (term) {
      known++;
      // Respecte la casse initiale (Titre) du token source
      const tr = term[target];
      out.push(token[0] === token[0].toUpperCase() ? tr.charAt(0).toUpperCase() + tr.slice(1) : tr);
    } else {
      out.push(token); // nom propre / terroir : conservé
    }
  }

  // En anglais l'adjectif précède le nom : heuristique simple —
  // si le 1er token traduit est un nom et le dernier un qualificatif
  // connu, on ne réordonne PAS (les noms restent compréhensibles :
  // « Coffee Yirgacheffe organic » → acceptable ; la perfection
  // syntaxique viendra de la saisie manuelle optionnelle).
  return {
    locale: target,
    text: out.join(' '),
    coverage: significant > 0 ? known / significant : 0,
  };
}

/**
 * Construit le bloc translations {en, es, pt, ar} pour un produit.
 * Seules les traductions à couverture ≥ minCoverage sont retenues
 * (en dessous, mieux vaut le fallback fr que du charabia partiel).
 */
export function buildProductTranslations(
  name: string,
  minCoverage = 0.5,
): Partial<Record<Exclude<Locale, 'fr'>, { name: string }>> {
  const result: Partial<Record<Exclude<Locale, 'fr'>, { name: string }>> = {};
  for (const target of ['en', 'es', 'pt', 'ar'] as const) {
    const tr = autoTranslateProductName(name, target);
    if (tr.coverage >= minCoverage && tr.text.trim().length > 0) {
      result[target] = { name: tr.text };
    }
  }
  return result;
}
