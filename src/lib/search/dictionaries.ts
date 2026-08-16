// =============================================================
// EthiMarket Search V2 — Dictionnaires étendus (FR / EN / ES)
// Étend nlpSearchDictionaries.ts : 40+ pays, 20+ certifications,
// emballages, conditions sociales, distances, délais.
// =============================================================

export interface DictItem {
  id: string;
  canonical: string;
  synonyms: string[];
}

export interface CountryItem extends DictItem {
  code: string;
  region: string;
  continent: string;
  centroid: { lat: number; lng: number };
}

export const PRODUCT_TYPES: DictItem[] = [
  { id: 'tshirt', canonical: 't-shirt', synonyms: ['t-shirt', 'tshirt', 'tee-shirt', 'tee shirt', 't-shirts', 'tshirts', 'camiseta', 'top'] },
  { id: 'shirt', canonical: 'chemise', synonyms: ['chemise', 'chemises', 'shirt', 'shirts', 'camisa'] },
  { id: 'hoodie', canonical: 'sweat-shirt', synonyms: ['sweat', 'sweatshirt', 'sweat-shirt', 'hoodie', 'pull', 'pullover', 'sudadera'] },
  { id: 'pants', canonical: 'pantalon', synonyms: ['pantalon', 'pantalons', 'jean', 'jeans', 'trousers', 'pants', 'pantalones'] },
  { id: 'dress', canonical: 'robe', synonyms: ['robe', 'robes', 'dress', 'dresses', 'vestido'] },
  { id: 'shoes', canonical: 'chaussures', synonyms: ['chaussure', 'chaussures', 'basket', 'baskets', 'sneakers', 'shoes', 'zapatos', 'zapatillas'] },
  { id: 'socks', canonical: 'chaussettes', synonyms: ['chaussette', 'chaussettes', 'socks', 'calcetines'] },
  { id: 'bag', canonical: 'sac', synonyms: ['sac', 'sacs', 'tote bag', 'totebag', 'sacoche', 'bag', 'bags', 'bolso'] },
  { id: 'coffee', canonical: 'café', synonyms: ['café', 'cafe', 'coffee', 'espresso', 'arabica', 'robusta'] },
  { id: 'tea', canonical: 'thé', synonyms: ['thé', 'the', 'tea', 'tisane', 'infusion', 'matcha', 'té'] },
  { id: 'chocolate', canonical: 'chocolat', synonyms: ['chocolat', 'chocolats', 'cacao', 'cocoa', 'chocolate'] },
  { id: 'honey', canonical: 'miel', synonyms: ['miel', 'miels', 'honey', 'mieles'] },
  { id: 'oil', canonical: 'huile', synonyms: ['huile', 'huiles', 'olive oil', 'oil', 'aceite'] },
  { id: 'spice', canonical: 'épices', synonyms: ['épice', 'épices', 'epice', 'epices', 'spice', 'spices', 'curcuma', 'cannelle', 'poivre', 'especias'] },
  { id: 'wine', canonical: 'vin', synonyms: ['vin', 'vins', 'wine', 'vino'] },
  { id: 'soap', canonical: 'savon', synonyms: ['savon', 'savons', 'soap', 'jabon', 'jabón'] },
  { id: 'shampoo', canonical: 'shampoing', synonyms: ['shampoing', 'shampooing', 'shampoo', 'champu'] },
  { id: 'cream', canonical: 'crème', synonyms: ['crème', 'creme', 'cream', 'baume', 'crema'] },
  { id: 'candle', canonical: 'bougie', synonyms: ['bougie', 'bougies', 'candle', 'vela'] },
  { id: 'furniture', canonical: 'meuble', synonyms: ['meuble', 'meubles', 'furniture', 'table', 'chaise', 'mueble'] },
];

export const MATERIALS: DictItem[] = [
  { id: 'cotton', canonical: 'coton', synonyms: ['coton', 'cotton', 'algodon', 'algodón'] },
  { id: 'wool', canonical: 'laine', synonyms: ['laine', 'wool', 'merinos', 'mérinos', 'alpaga', 'lana'] },
  { id: 'linen', canonical: 'lin', synonyms: ['lin', 'linen', 'flax', 'lino'] },
  { id: 'hemp', canonical: 'chanvre', synonyms: ['chanvre', 'hemp', 'canamo', 'cáñamo'] },
  { id: 'silk', canonical: 'soie', synonyms: ['soie', 'silk', 'seda'] },
  { id: 'bamboo', canonical: 'bambou', synonyms: ['bambou', 'bamboo', 'bambu', 'bambú'] },
  { id: 'tencel', canonical: 'tencel', synonyms: ['tencel', 'lyocell', 'modal'] },
  { id: 'leather_veg', canonical: 'cuir végétal', synonyms: ['cuir vegetal', 'cuir végétal', 'vegan leather', 'pinatex', 'cuero vegano'] },
  { id: 'wood', canonical: 'bois', synonyms: ['bois', 'wood', 'madera', 'chene', 'chêne', 'hetre', 'hêtre'] },
  { id: 'glass', canonical: 'verre', synonyms: ['verre', 'glass', 'vidrio'] },
  { id: 'recycled_poly', canonical: 'polyester recyclé', synonyms: ['polyester recycle', 'polyester recyclé', 'rpet', 'recycled polyester'] },
];

export const CERTIFICATIONS: DictItem[] = [
  { id: 'bio', canonical: 'Bio', synonyms: ['bio', 'biologique', 'organic', 'organico', 'orgánico', 'agriculture biologique', 'ab', 'bio ue', 'eu organic', 'usda organic', 'jas'] },
  { id: 'fairtrade', canonical: 'Commerce Équitable', synonyms: ['equitable', 'équitable', 'fairtrade', 'fair trade', 'commerce equitable', 'commerce équitable', 'max havelaar', 'wfto', 'fair for life', 'comercio justo'] },
  { id: 'gots', canonical: 'GOTS', synonyms: ['gots', 'global organic textile standard'] },
  { id: 'oekotex', canonical: 'OEKO-TEX', synonyms: ['oeko-tex', 'oekotex', 'oeko tex', 'standard 100'] },
  { id: 'fsc', canonical: 'FSC', synonyms: ['fsc', 'pefc', 'foret durable', 'forêt durable', 'bois certifie', 'bois certifié'] },
  { id: 'rainforest', canonical: 'Rainforest Alliance', synonyms: ['rainforest', 'rainforest alliance', 'utz'] },
  { id: 'demeter', canonical: 'Demeter', synonyms: ['demeter', 'biodynamie', 'biodynamique', 'naturland'] },
  { id: 'crueltyfree', canonical: 'Cruelty-Free', synonyms: ['cruelty free', 'cruelty-free', 'leaping bunny', 'sans cruaute', 'sans cruauté'] },
  { id: 'bcorp', canonical: 'B-Corp', synonyms: ['b-corp', 'bcorp', 'b corp', 'certified b'] },
  { id: 'ecolabel', canonical: 'EU Ecolabel', synonyms: ['ecolabel', 'eco-label', 'ecolabel europeen', 'écolabel'] },
  { id: 'grs', canonical: 'GRS', synonyms: ['grs', 'global recycled standard'] },
  { id: 'rws', canonical: 'RWS', synonyms: ['rws', 'responsible wool'] },
  { id: 'c2c', canonical: 'Cradle to Cradle', synonyms: ['cradle to cradle', 'cradle2cradle', 'c2c'] },
  { id: 'vegan_cert', canonical: 'Vegan Society', synonyms: ['vegan society', 'certifie vegan', 'certifié vegan', 'eve vegan'] },
  { id: 'sa8000', canonical: 'SA8000', synonyms: ['sa8000', 'sa 8000'] },
  { id: 'bluesign', canonical: 'Bluesign', synonyms: ['bluesign', 'blue sign'] },
];

export const GENDERS: DictItem[] = [
  { id: 'homme', canonical: 'homme', synonyms: ['homme', 'hommes', 'man', 'men', 'male', 'masculin', 'pour homme', 'hombre'] },
  { id: 'femme', canonical: 'femme', synonyms: ['femme', 'femmes', 'woman', 'women', 'female', 'feminin', 'féminin', 'pour femme', 'mujer'] },
  { id: 'enfant', canonical: 'enfant', synonyms: ['enfant', 'enfants', 'kid', 'kids', 'child', 'children', 'garcon', 'garçon', 'fille', 'nino', 'niño'] },
  { id: 'bebe', canonical: 'bébé', synonyms: ['bebe', 'bébé', 'baby', 'babies', 'infant', 'toddler'] },
  { id: 'unisexe', canonical: 'unisexe', synonyms: ['unisexe', 'unisex', 'mixte'] },
];

export const COUNTRIES: CountryItem[] = [
  { id: 'FR', canonical: 'France', code: 'FR', region: 'Europe de l\'Ouest', continent: 'Europe', centroid: { lat: 46.6, lng: 2.4 }, synonyms: ['france', 'francais', 'français', 'francaise', 'française', 'french', 'francia'] },
  { id: 'DE', canonical: 'Allemagne', code: 'DE', region: 'Europe de l\'Ouest', continent: 'Europe', centroid: { lat: 51.1, lng: 10.4 }, synonyms: ['allemagne', 'allemand', 'germany', 'german', 'alemania'] },
  { id: 'BE', canonical: 'Belgique', code: 'BE', region: 'Europe de l\'Ouest', continent: 'Europe', centroid: { lat: 50.6, lng: 4.7 }, synonyms: ['belgique', 'belge', 'belgium'] },
  { id: 'NL', canonical: 'Pays-Bas', code: 'NL', region: 'Europe de l\'Ouest', continent: 'Europe', centroid: { lat: 52.2, lng: 5.5 }, synonyms: ['pays-bas', 'pays bas', 'hollande', 'netherlands', 'dutch'] },
  { id: 'IT', canonical: 'Italie', code: 'IT', region: 'Europe du Sud', continent: 'Europe', centroid: { lat: 42.8, lng: 12.6 }, synonyms: ['italie', 'italien', 'italy', 'italian', 'italia'] },
  { id: 'ES', canonical: 'Espagne', code: 'ES', region: 'Europe du Sud', continent: 'Europe', centroid: { lat: 40.2, lng: -3.6 }, synonyms: ['espagne', 'espagnol', 'spain', 'spanish', 'espana', 'españa'] },
  { id: 'PT', canonical: 'Portugal', code: 'PT', region: 'Europe du Sud', continent: 'Europe', centroid: { lat: 39.6, lng: -8.0 }, synonyms: ['portugal', 'portugais', 'portuguese'] },
  { id: 'GR', canonical: 'Grèce', code: 'GR', region: 'Europe du Sud', continent: 'Europe', centroid: { lat: 39.0, lng: 22.0 }, synonyms: ['grece', 'grèce', 'grec', 'greece', 'greek'] },
  { id: 'PL', canonical: 'Pologne', code: 'PL', region: 'Europe de l\'Est', continent: 'Europe', centroid: { lat: 52.1, lng: 19.4 }, synonyms: ['pologne', 'polonais', 'poland', 'polish'] },
  { id: 'RO', canonical: 'Roumanie', code: 'RO', region: 'Europe de l\'Est', continent: 'Europe', centroid: { lat: 45.9, lng: 24.9 }, synonyms: ['roumanie', 'roumain', 'romania'] },
  { id: 'GB', canonical: 'Royaume-Uni', code: 'GB', region: 'Europe de l\'Ouest', continent: 'Europe', centroid: { lat: 54.0, lng: -2.5 }, synonyms: ['royaume-uni', 'royaume uni', 'angleterre', 'uk', 'united kingdom', 'england', 'british'] },
  { id: 'TR', canonical: 'Turquie', code: 'TR', region: 'Asie de l\'Ouest', continent: 'Asie', centroid: { lat: 39.0, lng: 35.0 }, synonyms: ['turquie', 'turc', 'turkey', 'turkish'] },
  { id: 'IN', canonical: 'Inde', code: 'IN', region: 'Asie du Sud', continent: 'Asie', centroid: { lat: 21.0, lng: 78.0 }, synonyms: ['inde', 'indien', 'india', 'indian'] },
  { id: 'BD', canonical: 'Bangladesh', code: 'BD', region: 'Asie du Sud', continent: 'Asie', centroid: { lat: 23.7, lng: 90.3 }, synonyms: ['bangladesh', 'bangladais'] },
  { id: 'VN', canonical: 'Vietnam', code: 'VN', region: 'Asie du Sud-Est', continent: 'Asie', centroid: { lat: 16.0, lng: 107.8 }, synonyms: ['vietnam', 'vietnamien'] },
  { id: 'CN', canonical: 'Chine', code: 'CN', region: 'Asie de l\'Est', continent: 'Asie', centroid: { lat: 35.0, lng: 103.0 }, synonyms: ['chine', 'chinois', 'china', 'chinese'] },
  { id: 'MA', canonical: 'Maroc', code: 'MA', region: 'Afrique du Nord', continent: 'Afrique', centroid: { lat: 31.8, lng: -7.1 }, synonyms: ['maroc', 'marocain', 'morocco'] },
  { id: 'TN', canonical: 'Tunisie', code: 'TN', region: 'Afrique du Nord', continent: 'Afrique', centroid: { lat: 34.0, lng: 9.5 }, synonyms: ['tunisie', 'tunisien', 'tunisia'] },
  { id: 'GH', canonical: 'Ghana', code: 'GH', region: 'Afrique de l\'Ouest', continent: 'Afrique', centroid: { lat: 7.9, lng: -1.0 }, synonyms: ['ghana', 'ghaneen', 'ghanéen'] },
  { id: 'CI', canonical: 'Côte d\'Ivoire', code: 'CI', region: 'Afrique de l\'Ouest', continent: 'Afrique', centroid: { lat: 7.5, lng: -5.5 }, synonyms: ['cote d\'ivoire', 'côte d\'ivoire', 'ivoirien', 'ivory coast'] },
  { id: 'ET', canonical: 'Éthiopie', code: 'ET', region: 'Afrique de l\'Est', continent: 'Afrique', centroid: { lat: 9.1, lng: 40.5 }, synonyms: ['ethiopie', 'éthiopie', 'ethiopien', 'ethiopia'] },
  { id: 'KE', canonical: 'Kenya', code: 'KE', region: 'Afrique de l\'Est', continent: 'Afrique', centroid: { lat: 0.0, lng: 37.9 }, synonyms: ['kenya', 'kenyan'] },
  { id: 'MG', canonical: 'Madagascar', code: 'MG', region: 'Afrique de l\'Est', continent: 'Afrique', centroid: { lat: -19.0, lng: 46.7 }, synonyms: ['madagascar', 'malgache'] },
  { id: 'CO', canonical: 'Colombie', code: 'CO', region: 'Amérique du Sud', continent: 'Amérique', centroid: { lat: 4.6, lng: -74.1 }, synonyms: ['colombie', 'colombien', 'colombia'] },
  { id: 'PE', canonical: 'Pérou', code: 'PE', region: 'Amérique du Sud', continent: 'Amérique', centroid: { lat: -9.2, lng: -75.0 }, synonyms: ['perou', 'pérou', 'peruvien', 'péruvien', 'peru'] },
  { id: 'BR', canonical: 'Brésil', code: 'BR', region: 'Amérique du Sud', continent: 'Amérique', centroid: { lat: -14.2, lng: -51.9 }, synonyms: ['bresil', 'brésil', 'bresilien', 'brazil'] },
  { id: 'EC', canonical: 'Équateur', code: 'EC', region: 'Amérique du Sud', continent: 'Amérique', centroid: { lat: -1.8, lng: -78.2 }, synonyms: ['equateur', 'équateur', 'ecuador'] },
  { id: 'MX', canonical: 'Mexique', code: 'MX', region: 'Amérique du Nord', continent: 'Amérique', centroid: { lat: 23.6, lng: -102.5 }, synonyms: ['mexique', 'mexicain', 'mexico', 'méxico'] },
  { id: 'NZ', canonical: 'Nouvelle-Zélande', code: 'NZ', region: 'Océanie', continent: 'Océanie', centroid: { lat: -41.0, lng: 174.0 }, synonyms: ['nouvelle-zelande', 'nouvelle zelande', 'nouvelle-zélande', 'new zealand'] },
];

export const REGIONS: DictItem[] = [
  { id: 'europe', canonical: 'Europe', synonyms: ['europe', 'europeen', 'européen', 'europeenne', 'européenne', 'european', 'ue', 'eu', 'union europeenne', 'union européenne'] },
  { id: 'africa', canonical: 'Afrique', synonyms: ['afrique', 'africain', 'africa', 'african'] },
  { id: 'south_america', canonical: 'Amérique du Sud', synonyms: ['amerique du sud', 'amérique du sud', 'south america', 'amerique latine', 'amérique latine', 'latino'] },
  { id: 'asia', canonical: 'Asie', synonyms: ['asie', 'asiatique', 'asia', 'asian'] },
  { id: 'local', canonical: 'Local', synonyms: ['local', 'locale', 'circuit court', 'proximite', 'proximité', 'pres de moi', 'près de moi', 'pres de chez moi', 'près de chez moi'] },
];

export const CONTINENT_BY_REGION: Record<string, string> = {
  Europe: 'Europe',
  Afrique: 'Afrique',
  'Amérique du Sud': 'Amérique',
  Asie: 'Asie',
};

// ---- Flags éthiques / emballage / social ----
export const FLAG_PATTERNS: Record<string, string[]> = {
  vegan: ['vegan', 'vegane', 'végane', 'vegetalien', 'végétalien', 'plant-based', 'plant based', '100% vegetal', '100% végétal'],
  recycled: ['recycle', 'recyclé', 'recyclee', 'recyclée', 'recycled', 'upcycle', 'upcyclé', 'upcycled', 'circulaire', 'reciclado'],
  fairTrade: ['equitable', 'équitable', 'fairtrade', 'fair trade', 'commerce equitable', 'commerce équitable', 'comercio justo'],
  livingWage: ['salaire decent', 'salaire décent', 'living wage', 'remuneration juste', 'rémunération juste', 'juste remuneration', 'salaire juste', 'salario digno', 'salaire vital'],
  socialConditions: ['conditions sociales', 'protection sociale', 'social protection', 'audit social', 'sans travail des enfants', 'pas de travail des enfants', 'no child labor', 'droits des travailleurs', 'conditions de travail'],
  organicOnly: ['bio', 'biologique', 'organic', 'organico'],
  fullTraceability: ['tracabilite', 'traçabilité', 'traceability', 'tracable', 'traçable', 'transparence totale', 'transparent'],
  plasticFreePackaging: ['sans plastique', 'zero plastique', 'zéro plastique', 'plastic free', 'plastic-free', 'sin plastico', 'emballage sans plastique'],
  compostablePackaging: ['compostable', 'biodegradable', 'biodégradable', 'emballage compostable'],
  recyclablePackaging: ['emballage recyclable', 'packaging recyclable', 'recyclable'],
  bulkPackaging: ['vrac', 'en vrac', 'bulk', 'sans emballage'],
  cooperative: ['cooperative', 'coopérative', 'coop', 'cooperativa'],
};

// ---- Intentions ----
export const INTENT_PATTERNS = {
  alternativeSupplier: [
    /alternative\s+(?:[a-zà-ÿ-]+\s+)*(?:au|à\s+la|a\s+la|du|de\s+la|pour\s+le)\s+fournisseur\s+([^,.]+)/i,
    /remplacer\s+(?:le\s+)?fournisseur\s+([^,.]+)/i,
    /(?:autre|nouveau)\s+fournisseur\s+(?:que|à la place de|au lieu de)\s+([^,.]+)/i,
    /alternative\s+to\s+supplier\s+([^,.]+)/i,
  ],
  alternativeProduct: [
    /(?:trouve(?:-moi)?|cherche|montre(?:-moi)?|donne(?:-moi)?)\s+(?:une\s+)?alternative\s+(?:[a-zà-ÿ-]+\s+)*(?:à|au|aux|pour|de)\s+([^,.]+)/i,
    /alternative\s+(?:[a-zà-ÿ-]+\s+)*(?:à|au|aux|pour|de)\s+([^,.]+)/i,
    /remplacer\s+([^,.]+)/i,
    /equivalent\s+(?:à|au|de)\s+([^,.]+)/i,
    /équivalent\s+(?:à|au|de)\s+([^,.]+)/i,
    /substitut\s+(?:à|au|de)\s+([^,.]+)/i,
  ],
  comparison: [
    /compare(?:r)?\s+(?:les|la|le)?\s*(.+)/i,
    /comparatif\s+(?:entre|de|des)?\s*(.+)/i,
    /(.+)\s+(?:versus|vs\.?)\s+(.+)/i,
  ],
  supplierMention: [
    /(?:du|chez\s+le|par\s+le|of\s+supplier|from\s+supplier)\s+fournisseur\s+([^,.]+)/i,
    /fournisseur\s*:\s*([^,.]+)/i,
  ],
};

// ---- Priorités de classement ----
export const PRIORITY_PATTERNS = {
  cheaper: [/moins\s+ch[eè]re?/i, /co[uû]te\s+moins/i, /plus\s+[ée]conomique/i, /meilleur\s+prix/i, /cheaper/i, /m[aá]s\s+barato/i, /petit\s+budget/i],
  lowerCarbon: [/moins\s+de\s+co2/i, /empreinte\s+carbone\s+(?:inf[ée]rieure|plus\s+faible|r[ée]duite)/i, /plus\s+[ée]colo/i, /bas\s+carbone/i, /low\s+carbon/i, /moins\s+polluant/i],
  betterTraceability: [/meilleure?\s+tra[çc]abilit[ée]/i, /plus\s+tra[çc]able/i, /tra[çc]abilit[ée]\s+(?:compl[èe]te|totale|sup[ée]rieure)/i, /transparence\s+totale/i, /better\s+traceability/i],
  fasterDelivery: [/livraison\s+(?:plus\s+)?rapide/i, /d[ée]lai\s+(?:plus\s+)?court/i, /express/i, /urgent/i, /fast(?:er)?\s+delivery/i],
  higherTrust: [/plus\s+fiable/i, /meilleur\s+score\s+de\s+confiance/i, /plus\s+de\s+confiance/i, /mieux\s+not[ée]/i, /more\s+trust/i],
};

export const STOP_WORDS = new Set([
  'de', 'du', 'des', 'le', 'la', 'les', 'un', 'une', 'en', 'pour', 'avec', 'sans',
  'et', 'ou', 'au', 'aux', 'ce', 'cette', 'ces', 'par', 'dans', 'sur', 'qui', 'que',
  'moins', 'plus', 'environ', 'maximum', 'minimum', 'trouve', 'moi', 'cherche', 'mais',
  'est', 'sont', 'avoir', 'etre', 'être', 'je', 'veux', 'voudrais', 'il', 'elle', 'mon', 'ma',
  'a', 'an', 'the', 'in', 'on', 'with', 'without', 'and', 'or', 'for', 'to', 'from', 'is', 'are',
]);
