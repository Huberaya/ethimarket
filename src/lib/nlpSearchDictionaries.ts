// src/lib/nlpSearchDictionaries.ts
// Multilingual NLP dictionaries (FR, EN, ES) for intelligent e-commerce and ethical search
// Supporting the 17 mandatory facets and 20+ ethical certifications

export interface DictionaryItem {
  id: string;
  canonical: string;
  synonyms: string[];
  category?: string;
}

export interface CountryDictionaryItem extends DictionaryItem {
  code: string;
  flag: string;
  region: string;
  continent: string;
  latitude?: number;
  longitude?: number;
}

// 1. PRODUCT CATEGORIES & SYNONYMS
export const SYNONYMS: Record<string, string[]> = {
  'café': ['coffee', 'cafe', 'cafes', 'cafés', 'moka', 'arabica', 'robusta', 'espresso'],
  'chocolat': ['chocolate', 'choco', 'chocolats', 'cacao', 'cocoa'],
  'chocolat noir': ['dark chocolate', 'cacao noir', 'chocolat pur', 'noir'],
  't-shirt': ['tshirt', 'tee-shirt', 't shirt', 't-shirts', 'teeshirt', 'top'],
  'chemise': ['shirt', 'shirts', 'chemises', 'camisa'],
  'sweat-shirt': ['hoodie', 'sweat', 'sweatshirt', 'pull', 'pullover'],
  'pantalon': ['pants', 'trousers', 'jeans', 'jean', 'pantalons'],
  'robe': ['dress', 'dresses', 'robes', 'vestido'],
  'bio': ['organic', 'biologique', 'eco', 'écologique', 'ab'],
  'miel': ['honey', 'miels', 'gelée royale', 'gelee royale'],
  'homme': ['hommes', 'man', 'men', 'masculin', 'male'],
  'femme': ['femmes', 'woman', 'women', 'feminin', 'female'],
  'enfant': ['enfants', 'kid', 'kids', 'child', 'children', 'garçon', 'fille'],
  'bébé': ['bebe', 'baby', 'babies', 'infant', 'toddler'],
  'thé': ['the', 'tea', 'teas', 'matcha', 'sencha', 'infusion', 'tisane'],
  'huile': ['oil', 'huiles', 'olive', 'argan', 'coco', 'jojoba'],
  'savon': ['soap', 'soaps', 'savons'],
  'safran': ['saffron', 'khorasan', 'epice'],
  'vanille': ['vanilla', 'bourbon', 'gousse'],
  'épices': ['epice', 'epices', 'spices', 'spice', 'curcuma', 'poivre', 'cannelle', 'gingembre'],
  'coton': ['cotton', 'algodon'],
  'laine': ['wool', 'merinos', 'mérinos', 'alpaga'],
  'lin': ['linen', 'flax', 'lino'],
  'chanvre': ['hemp', 'canamo'],
  'sucre': ['sugar', 'agave', 'sirop']
};

export const PRODUCT_TYPES_DICT: DictionaryItem[] = [
  // Textile & Mode
  { id: 'tshirt', canonical: 't-shirt', synonyms: ['t-shirt', 'tshirt', 'tee-shirt', 'tee shirt', 'teeshirt', 't shirts', 't-shirts', 'camiseta', 'camisetas', 'top'] },
  { id: 'shirt', canonical: 'chemise', synonyms: ['chemise', 'chemises', 'chemisette', 'shirt', 'shirts', 'camisa', 'camisas'] },
  { id: 'hoodie', canonical: 'sweat-shirt', synonyms: ['sweat', 'sweatshirt', 'sweat-shirt', 'hoodie', 'hoodies', 'pull', 'pullover', 'sudadera', 'sudaderas'] },
  { id: 'pants', canonical: 'pantalon', synonyms: ['pantalon', 'pantalons', 'jeans', 'jean', 'trousers', 'pants', 'pantalones'] },
  { id: 'dress', canonical: 'robe', synonyms: ['robe', 'robes', 'dress', 'dresses', 'vestido', 'vestidos'] },
  { id: 'shoes', canonical: 'chaussures', synonyms: ['chaussure', 'chaussures', 'sneakers', 'baskets', 'shoes', 'footwear', 'zapatos', 'zapatillas'] },
  { id: 'socks', canonical: 'chaussettes', synonyms: ['chaussette', 'chaussettes', 'socks', 'sock', 'calcetines'] },
  { id: 'clothing', canonical: 'vêtements', synonyms: ['vêtement', 'vêtements', 'vetement', 'vetements', 'habits', 'clothes', 'clothing', 'apparel', 'ropa'] },
  { id: 'bag', canonical: 'sac', synonyms: ['sac', 'sacs', 'sacoche', 'cabas', 'tote bag', 'totebag', 'bag', 'bags', 'bolso', 'bolsos'] },

  // Alimentation & Épicerie
  { id: 'coffee', canonical: 'café', synonyms: ['café', 'cafe', 'coffee', 'coffees', 'cafés', 'cafes', 'caffé', 'espresso', 'arabica', 'robusta'] },
  { id: 'tea', canonical: 'thé', synonyms: ['thé', 'the', 'tea', 'teas', 'tisane', 'infusion', 'matcha', 'sencha', 'té'] },
  { id: 'chocolate', canonical: 'chocolat', synonyms: ['chocolat', 'chocolats', 'cacao', 'cocoa', 'chocolate', 'chocolates'] },
  { id: 'honey', canonical: 'miel', synonyms: ['miel', 'miels', 'honey', 'honeys', 'mieles', 'gelée royale'] },
  { id: 'oil', canonical: 'huile', synonyms: ['huile', 'huiles', 'huile d\'olive', 'olive oil', 'oil', 'oils', 'aceite', 'aceites', 'huile d\'argan', 'huile végétale'] },
  { id: 'spice', canonical: 'épices', synonyms: ['épice', 'épices', 'epice', 'epices', 'spices', 'spice', 'poivre', 'sel', 'cannelle', 'curcuma', 'safran', 'especias'] },
  { id: 'wine', canonical: 'vin', synonyms: ['vin', 'vins', 'wine', 'wines', 'vino', 'vinos'] },
  { id: 'beer', canonical: 'bière', synonyms: ['bière', 'biere', 'bieres', 'bières', 'beer', 'beers', 'cerveza', 'cervezas'] },
  { id: 'flour', canonical: 'farine', synonyms: ['farine', 'farines', 'flour', 'flours', 'harina'] },
  { id: 'pasta', canonical: 'pâtes', synonyms: ['pâte', 'pâtes', 'pates', 'pasta', 'pastas'] },

  // Cosmétiques & Maison
  { id: 'soap', canonical: 'savon', synonyms: ['savon', 'savons', 'soap', 'soaps', 'jabón', 'jabon'] },
  { id: 'shampoo', canonical: 'shampoing', synonyms: ['shampoing', 'shampooing', 'shampoo', 'champú', 'champu'] },
  { id: 'cream', canonical: 'crème', synonyms: ['crème', 'creme', 'cream', 'crema', 'baume', 'balm'] },
  { id: 'candle', canonical: 'bougie', synonyms: ['bougie', 'bougies', 'candle', 'candles', 'vela', 'velas'] }
];

// 2. MATERIALS & INGREDIENTS
export const MATERIALS_DICT: DictionaryItem[] = [
  { id: 'cotton', canonical: 'coton', synonyms: ['coton', 'cotton', 'algodón', 'algodon', 'coton peigné', 'coton biologique'] },
  { id: 'wool', canonical: 'laine', synonyms: ['laine', 'wool', 'merinos', 'mérinos', 'alpaga', 'lana', 'mohair', 'cachemire', 'cashmere'] },
  { id: 'linen', canonical: 'lin', synonyms: ['lin', 'linen', 'flax', 'lino'] },
  { id: 'hemp', canonical: 'chanvre', synonyms: ['chanvre', 'hemp', 'cáñamo', 'canamo'] },
  { id: 'silk', canonical: 'soie', synonyms: ['soie', 'silk', 'seda'] },
  { id: 'bamboo', canonical: 'bambou', synonyms: ['bambou', 'bamboo', 'bambú'] },
  { id: 'jute', canonical: 'jute', synonyms: ['jute', 'toile de jute'] },
  { id: 'leather_veg', canonical: 'cuir végétal', synonyms: ['cuir végétal', 'cuir vegetal', 'vegan leather', 'apple leather', 'pinatex', 'cuero vegano'] },
  { id: 'wood', canonical: 'bois', synonyms: ['bois', 'wood', 'wooden', 'madera', 'chêne', 'hêtre', 'bambou'] },
  { id: 'glass', canonical: 'verre', synonyms: ['verre', 'glass', 'vidrio'] },
  { id: 'stainless_steel', canonical: 'inox', synonyms: ['inox', 'acier inoxydable', 'stainless steel'] },
  { id: 'cocoa', canonical: 'cacao', synonyms: ['cacao', 'cocoa', 'fèves de cacao'] },
  { id: 'coffee_beans', canonical: 'café', synonyms: ['grains de café', 'coffee beans'] }
];

// 3. THE 20+ ETHICAL LABELS & CERTIFICATIONS
export const CERTIFICATIONS_DICT: DictionaryItem[] = [
  { id: 'bio', canonical: 'Bio', synonyms: ['bio', 'biologique', 'organic', 'orgánico', 'organico', 'ab', 'agriculture biologique', 'bio ue', 'usda organic', 'usda', 'jas'] },
  { id: 'gots', canonical: 'GOTS', synonyms: ['gots', 'global organic textile standard', 'coton gots'] },
  { id: 'fairtrade', canonical: 'Commerce Équitable', synonyms: ['fairtrade', 'fair trade', 'commerce équitable', 'commerce equitable', 'équitable', 'equitable', 'max havelaar', 'wfto', 'comercio justo'] },
  { id: 'oeko_tex', canonical: 'OEKO-TEX', synonyms: ['oeko-tex', 'oekotex', 'oeko tex', 'standard 100', 'oeko-tex standard 100'] },
  { id: 'fsc', canonical: 'FSC', synonyms: ['fsc', 'forest stewardship council', 'pefc', 'bois certifié', 'forêt durable'] },
  { id: 'bcorp', canonical: 'B-Corp', synonyms: ['b-corp', 'bcorp', 'b corp', 'certified b corp', 'certified b corporation'] },
  { id: 'demeter', canonical: 'Demeter', synonyms: ['demeter', 'biodynamie', 'biodynamique', 'naturland'] },
  { id: 'rainforest', canonical: 'Rainforest Alliance', synonyms: ['rainforest', 'rainforest alliance', 'utz', 'utz certified'] },
  { id: 'eu_ecolabel', canonical: 'EU Ecolabel', synonyms: ['eu ecolabel', 'ecolabel européen', 'écolabel européen', 'ecolabel'] },
  { id: 'cradle2cradle', canonical: 'Cradle to Cradle', synonyms: ['cradle to cradle', 'cradle2cradle', 'c2c'] },
  { id: 'rws', canonical: 'RWS', synonyms: ['rws', 'responsible wool standard', 'laine responsable'] },
  { id: 'grs', canonical: 'GRS', synonyms: ['grs', 'global recycled standard', 'standard recyclé'] },
  { id: 'cruelty_free', canonical: 'Cruelty-Free', synonyms: ['cruelty free', 'cruelty-free', 'leaping bunny', 'sans cruauté', 'peta'] },
  { id: 'slow_cosmetique', canonical: 'Slow Cosmétique', synonyms: ['slow cosmétique', 'slow cosmetique'] },
  { id: 'cosmebio', canonical: 'Cosmebio', synonyms: ['cosmebio', 'cosmébio', 'cosmos organic', 'cosmos natural', 'cosmos'] },
  { id: 'origine_france', canonical: 'Origine France Garantie', synonyms: ['origine france garantie', 'ofg', 'fabriqué en france garanti'] },
  { id: 'nature_progres', canonical: 'Nature & Progrès', synonyms: ['nature et progrès', 'nature & progres', 'nature et progres'] },
  { id: 'soil_association', canonical: 'Soil Association', synonyms: ['soil association'] },
  { id: 'ecocert', canonical: 'Ecocert', synonyms: ['ecocert', 'certifié ecocert'] },
  { id: 'pefc', canonical: 'PEFC', synonyms: ['pefc', 'programme de reconnaissance des certifications forestières'] }
];

// 4. GENDERS & AUDIENCES
export const GENDERS_DICT: DictionaryItem[] = [
  { id: 'homme', canonical: 'homme', synonyms: ['homme', 'hommes', 'man', 'men', 'male', 'masculin', 'pour homme', 'hombre', 'hombres', 'para hombre'] },
  { id: 'femme', canonical: 'femme', synonyms: ['femme', 'femmes', 'woman', 'women', 'female', 'féminin', 'pour femme', 'mujer', 'mujeres', 'para mujer'] },
  { id: 'enfant', canonical: 'enfant', synonyms: ['enfant', 'enfants', 'kid', 'kids', 'child', 'children', 'garçon', 'fille', 'niño', 'niños', 'para niños'] },
  { id: 'bebe', canonical: 'bébé', synonyms: ['bébé', 'bebe', 'bébés', 'baby', 'babies', 'infant', 'toddler', 'bebé', 'bebés'] },
  { id: 'unisexe', canonical: 'unisexe', synonyms: ['unisexe', 'unisex', 'mixte', 'tout genre'] }
];

// 5. COUNTRIES & REGIONS (With approximate coords for distance computation)
export const COUNTRIES_DICT: CountryDictionaryItem[] = [
  { id: 'FR', canonical: 'France', code: 'FR', flag: '🇫🇷', region: 'Europe de l\'Ouest', continent: 'Europe', latitude: 46.2276, longitude: 2.2137, synonyms: ['france', 'français', 'française', 'french', 'francia', 'made in france', 'fabriqué en france'] },
  { id: 'CO', canonical: 'Colombie', code: 'CO', flag: '🇨🇴', region: 'Amérique du Sud', continent: 'Amérique', latitude: 4.5709, longitude: -74.2973, synonyms: ['colombie', 'colombien', 'colombienne', 'colombia', 'colombian'] },
  { id: 'PE', canonical: 'Pérou', code: 'PE', flag: '🇵🇪', region: 'Amérique du Sud', continent: 'Amérique', latitude: -9.19, longitude: -75.0152, synonyms: ['pérou', 'perou', 'péruvien', 'peru', 'peruvian'] },
  { id: 'MG', canonical: 'Madagascar', code: 'MG', flag: '🇲🇬', region: 'Afrique de l\'Est', continent: 'Afrique', latitude: -18.7669, longitude: 46.8691, synonyms: ['madagascar', 'malgache'] },
  { id: 'IT', canonical: 'Italie', code: 'IT', flag: '🇮🇹', region: 'Europe du Sud', continent: 'Europe', latitude: 41.8719, longitude: 12.5674, synonyms: ['italie', 'italien', 'italienne', 'italy', 'italian', 'italia', 'fabriqué en italie', 'made in italy'] },
  { id: 'ES', canonical: 'Espagne', code: 'ES', flag: '🇪🇸', region: 'Europe du Sud', continent: 'Europe', latitude: 40.4637, longitude: -3.7492, synonyms: ['espagne', 'espagnol', 'spain', 'spanish', 'españa', 'fabriqué en espagne'] },
  { id: 'PT', canonical: 'Portugal', code: 'PT', flag: '🇵🇹', region: 'Europe du Sud', continent: 'Europe', latitude: 39.3999, longitude: -8.2245, synonyms: ['portugal', 'portugais', 'portuguese', 'fabriqué au portugal', 'made in portugal'] },
  { id: 'DE', canonical: 'Allemagne', code: 'DE', flag: '🇩🇪', region: 'Europe de l\'Ouest', continent: 'Europe', latitude: 51.1657, longitude: 10.4515, synonyms: ['allemagne', 'allemand', 'germany', 'german', 'alemania', 'fabriqué en allemagne'] },
  { id: 'BE', canonical: 'Belgique', code: 'BE', flag: '🇧🇪', region: 'Europe de l\'Ouest', continent: 'Europe', latitude: 50.5039, longitude: 4.4699, synonyms: ['belgique', 'belge', 'belgium'] },
  { id: 'ET', canonical: 'Éthiopie', code: 'ET', flag: '🇪🇹', region: 'Afrique de l\'Est', continent: 'Afrique', latitude: 9.145, longitude: 40.4897, synonyms: ['éthiopie', 'ethiopie', 'ethiopien', 'ethiopia', 'ethiopian'] },
  { id: 'GH', canonical: 'Ghana', code: 'GH', flag: '🇬🇭', region: 'Afrique de l\'Ouest', continent: 'Afrique', latitude: 7.9465, longitude: -1.0232, synonyms: ['ghana', 'ghanéen', 'ghaneen', 'ghanaian'] },
  { id: 'IN', canonical: 'Inde', code: 'IN', flag: '🇮🇳', region: 'Asie du Sud', continent: 'Asie', latitude: 20.5937, longitude: 78.9629, synonyms: ['inde', 'indien', 'india', 'indian', 'coton d\'inde'] },
  { id: 'NZ', canonical: 'Nouvelle-Zélande', code: 'NZ', flag: '🇳🇿', region: 'Océanie', continent: 'Océanie', latitude: -40.9006, longitude: 174.886, synonyms: ['nouvelle-zélande', 'nouvelle zelande', 'new zealand', 'manuka'] },
  { id: 'SN', canonical: 'Sénégal', code: 'SN', flag: '🇸🇳', region: 'Afrique de l\'Ouest', continent: 'Afrique', latitude: 14.4974, longitude: -14.4524, synonyms: ['sénégal', 'senegal', 'sénégalais', 'senegalais'] },
  { id: 'CI', canonical: 'Côte d\'Ivoire', code: 'CI', flag: '🇨🇮', region: 'Afrique de l\'Ouest', continent: 'Afrique', latitude: 7.54, longitude: -5.5471, synonyms: ['côte d\'ivoire', 'cote d\'ivoire', 'ivoirien'] },
  { id: 'MA', canonical: 'Maroc', code: 'MA', flag: '🇲🇦', region: 'Afrique du Nord', continent: 'Afrique', latitude: 31.7917, longitude: -7.0926, synonyms: ['maroc', 'marocain', 'morocco'] },
  { id: 'TN', canonical: 'Tunisie', code: 'TN', flag: '🇹🇳', region: 'Afrique du Nord', continent: 'Afrique', latitude: 33.8869, longitude: 9.5375, synonyms: ['tunisie', 'tunisien', 'tunisia'] },
  { id: 'BR', canonical: 'Brésil', code: 'BR', flag: '🇧🇷', region: 'Amérique du Sud', continent: 'Amérique', latitude: -14.235, longitude: -51.9253, synonyms: ['brésil', 'bresil', 'brazil', 'brésilien'] }
];

export const REGIONS_DICT: DictionaryItem[] = [
  { id: 'europe', canonical: 'Europe', synonyms: ['europe', 'européen', 'européenne', 'european', 'ue', 'eu', 'union européenne'] },
  { id: 'africa', canonical: 'Afrique', synonyms: ['afrique', 'africain', 'africa', 'african'] },
  { id: 'south_america', canonical: 'Amérique du Sud', synonyms: ['amérique du sud', 'amerique du sud', 'south america', 'latino', 'amérique latine'] },
  { id: 'asia', canonical: 'Asie', synonyms: ['asie', 'asiatique', 'asia', 'asian'] },
  { id: 'local', canonical: 'Local', synonyms: ['local', 'locale', 'circuit court', 'proximité', 'locales', 'proche de moi', 'près de moi', 'pres de moi'] }
];

// 6. PACKAGING TYPES
export const PACKAGING_TYPES_DICT: DictionaryItem[] = [
  { id: 'plastic_free', canonical: 'Sans plastique', synonyms: ['sans plastique', 'sans-plastique', 'zero plastique', 'zéro plastique', 'plastic free', 'plastic-free', 'sin plastico'] },
  { id: 'compostable', canonical: 'Compostable', synonyms: ['compostable', 'home compost', 'biodégradable', 'biodegradable'] },
  { id: 'recyclable', canonical: 'Recyclable', synonyms: ['emballage recyclable', 'recyclable', 'carton recyclable'] },
  { id: 'deposit', canonical: 'Consigné', synonyms: ['consigné', 'consignee', 'consigne', 'bouteille consignée', 'emballage consigné', 'deposit'] },
  { id: 'bulk', canonical: 'Vrac', synonyms: ['en vrac', 'vrac', 'bulk', 'sans emballage'] }
];

// 7. ETHICAL, SOCIAL & ENVIRONMENTAL FLAGS
export const ETHICAL_FLAGS_DICT = {
  vegan: ['vegan', 'végane', 'vegetalien', 'végétalien', '100% végétal', '100% vegetal', 'plant-based', 'vegano', 'sans ingrédient animal'],
  recycled: ['recyclé', 'recycle', 'recycled', 'upcyclé', 'upcycled', 'circulaire', 'matière recyclée', 'reciclado'],
  living_wage: ['salaire décent', 'salaire decent', 'living wage', 'rémunération juste', 'juste rémunération', 'salario digno', 'salaires équitables'],
  social_conditions: ['protection sociale', 'social protection', 'sécurité sociale', 'couverture santé', 'audit social', 'sans travail des enfants', 'pas de travail des enfants', 'no child labor', 'conditions sociales', 'respect des travailleurs'],
  fair_trade: ['commerce équitable', 'commerce equitable', 'équitable', 'equitable', 'fairtrade', 'fair trade', 'max havelaar', 'comercio justo'],
  cooperative: ['coopérative', 'cooperative', 'coop', 'coopérative de producteurs', 'cooperativa'],
  low_carbon: ['bas carbone', 'faible empreinte carbone', 'faible émission', 'low carbon', 'neutre en carbone', 'climat positif'],
  full_traceability: ['traçabilité complète', 'tracabilite complete', 'meilleure traçabilité', 'plus traçable', 'transparence totale', 'qr code', 'gps certifié']
};

// 8. INTENT & COMPARATIVE PATTERNS
export const INTENT_PATTERNS = {
  alternative: [
    /(?:trouve(?:-moi)?|cherche|montre(?:-moi)?|quelle est|donne(?:-moi)?)\s+(?:une\s+)?alternative\s+(?:[a-zÀ-ÿ-]+\s+)*(?:à|au|aux|pour|de|du fournisseur)\s+([^,]+)/i,
    /alternative\s+(?:[a-zÀ-ÿ-]+\s+)*(?:à|au|aux|pour|de|du fournisseur)\s+([^,]+)/i,
    /remplacer\s+(?:le fournisseur\s+|le produit\s+)?([^,]+)/i,
    /équivalent\s+(?:[a-zÀ-ÿ-]+\s+)*(?:à|au|aux|pour|de)\s+([^,]+)/i,
    /substitut\s+(?:[a-zÀ-ÿ-]+\s+)*(?:à|au|aux|pour|de)\s+([^,]+)/i
  ],
  comparison: [
    /compare(?:r)?\s+(?:les|la|le)?\s*([^,]+)/i,
    /comparatif\s+(?:entre|de|des)?\s*([^,]+)/i,
    /versus|vs|par rapport à/i
  ],
  supplier: [
    /(?:du|de chez|chez le|par le)\s+fournisseur\s+([a-zA-Z0-9\s_-]+)/i,
    /(?:fournisseur|vendeur|marque|producteur)\s+([a-zA-Z0-9\s_-]+)/i
  ],
  better_traceability: [
    /meilleure?\s+tra[çc]abilit[ée]/i,
    /plus\s+tra[çc]able/i,
    /tra[çc]abilit[ée]\s+compl[èe]te/i,
    /transparence\s+totale/i
  ],
  cheaper: [
    /moins\s+ch[eè]re?/i,
    /plus\s+[ée]conomique/i,
    /meilleur\s+prix/i,
    /cheaper/i,
    /m[aá]s\s+barato/i,
    /co[uû]te\s+moins\s+ch[eè]re?/i,
    /co[uû]tent\s+moins\s+ch[eè]re?/i
  ],
  lower_carbon: [
    /moins\s+de\s+co2/i,
    /empreinte\s+carbone\s+inf[ée]rieure/i,
    /plus\s+[ée]colo/i,
    /bas\s+carbone/i,
    /low\s+carbon/i,
    /faible\s+empreinte/i
  ],
  fast_delivery: [
    /livraison\s+rapide/i,
    /d[ée]lai\s+court/i,
    /rapide/i,
    /express/i,
    /fast\s+delivery/i,
    /urgente?/i,
    /livraison\s+sous\s+\d+\s+jours?/i
  ]
};
