import { WAVE1_PRODUCTS, type ScoredProduct } from './strategyData';
import type { OutreachMessage } from './outreachTemplates';

/**
 * E-mails prêts à envoyer PAR PRODUIT (les 12 de la vague 1).
 * Pour chaque produit : un e-mail acheteur (argumentaire spécifique,
 * faits sourcés du plan stratégique et des articles du blog) et un
 * e-mail producteur FR + EN (recrutement de la filière).
 * Politique d'honnêteté : uniquement des faits documentés dans
 * docs/PLAN_STRATEGIQUE_ETHIMARKET.md et les articles sourcés ;
 * [crochets] = à personnaliser à la main avant envoi.
 */

const LANDING = 'https://ethimarket.vercel.app/pour-les-professionnels';
const SIGNUP = 'https://ethimarket.vercel.app/inscription';

interface ProductEmailFacts {
  /** Arguments factuels côté acheteur (3-4 puces). */
  proofs: string[];
  /** La phrase d'accroche d'ouverture côté acheteur. */
  openerBuyer: string;
  /** Proposition concrète de premier pas. */
  sampleLine: string;
  /** Accroche côté producteur (FR). */
  producerHookFr: string;
  /** Accroche côté producteur (EN). */
  producerHookEn: string;
}

export const PRODUCT_EMAIL_FACTS: Record<string, ProductEmailFacts> = {
  'Yirgacheffe': {
    openerBuyer: 'Les cours de l\u2019arabica restent à des niveaux historiquement élevés — et la plupart des torréfacteurs subissent les prix d\u2019un seul négociant.',
    proofs: [
      'Café de jardin Yirgacheffe G1/G2 lavé, acheté en direct d\u2019unions de coopératives dont l\u2019identifiant FLO est vérifiable dans le registre public FLO-CERT',
      'Prix FOB documentés par les unions (8-11 $/kg sur la campagne 2025/26) : vous savez ce que touche le producteur',
      'Dossier EUDR prêt : géolocalisation des parcelles fournie AVANT l\u2019expédition',
      'Certificat bio UE + COI + phytosanitaire contrôlés par la plateforme avant départ',
    ],
    sampleLine: 'Je peux vous faire parvenir un green sample de 250 g avec son numéro de lot pour cupping — sans engagement.',
    producerHookFr: 'Les torréfacteurs français cherchent des arabicas lavés d\u2019Éthiopie en direct — votre certification FLO/bio vérifiée aux registres devient votre meilleur argument de vente.',
    producerHookEn: 'French artisan roasters are looking for direct washed Ethiopian arabicas — your FLO/organic certification, registry-verified, becomes your best sales argument.',
  },
  'Sidama': {
    openerBuyer: 'Pour l\u2019espresso du quotidien, la sécurité d\u2019approvisionnement compte autant que le profil de tasse.',
    proofs: [
      'Sidama G2 bio lavé — le café de volume des unions du Sud éthiopien (la SCFCU fédère des coopératives représentant ~10 000 t/an, certifiées FLO)',
      'Contrat annuel possible avec calendrier d\u2019expédition : vous lissez vos coûts sur la campagne',
      'Certifications vérifiées AUX REGISTRES (pas sur PDF) avant publication du producteur',
      'Documents d\u2019import (COI, phytosanitaire) exigés avant expédition',
    ],
    sampleLine: 'Un green sample de 250 g avec numéro de lot peut partir cette semaine pour votre cupping.',
    producerHookFr: 'Les torréfacteurs français cherchent un espresso éthiopien bio régulier en volume — votre union a exactement ce profil.',
    producerHookEn: 'French roasters need a consistent organic Ethiopian espresso in volume — your union has exactly that profile.',
  },
  'Vanille Bourbon': {
    openerBuyer: 'La vanille est l\u2019épice la plus fraudée du marché : gousses réhydratées, origines mélangées, extraits synthétiques vendus comme naturels.',
    proofs: [
      'Gousses Grade A (gourmet) de la région SAVA, avec numéro de lot et région de collecte documentés',
      'Certificat d\u2019analyse du lot : humidité (~30-35 % pour le gourmet) et taux de vanilline (1,5-2 %) mesurés, pas déclarés',
      'Traçabilité publique par QR code sur chaque lot — vos clients vérifient eux-mêmes',
      'Valeur au kg élevée = logistique simple, pas de palette imposée',
    ],
    sampleLine: 'Je vous propose une boîte échantillon avec le certificat d\u2019analyse du lot correspondant — jugez sur pièce.',
    producerHookFr: 'Les pâtissiers et épiceries fines françaises cherchent de la vanille dont l\u2019authenticité est PROUVÉE — votre traçabilité par lot devient votre prime de prix.',
    producerHookEn: 'French pastry chefs and fine grocers want vanilla with PROVEN authenticity — your per-lot traceability becomes your price premium.',
  },
  'Micro-lots café': {
    openerBuyer: 'Vos clients les plus fidèles viennent chercher ce que le supermarché n\u2019aura jamais : une récolte, une coopérative, une histoire vraie.',
    proofs: [
      'Micro-lots naturels Guji/Yirgacheffe en allocation saisonnière limitée',
      'Chaque lot arrive avec son dossier : coopérative vérifiée aux registres, process, altitude, documents d\u2019import',
      'QR de traçabilité publique à afficher en boutique — l\u2019histoire se prouve, elle ne se raconte pas',
      'Marge torréfacteur élevée sur le segment premium',
    ],
    sampleLine: 'Je peux vous réserver un green sample sur l\u2019allocation de la prochaine récolte.',
    producerHookFr: 'Vos plus beaux lots méritent mieux que le mélange anonyme d\u2019un négociant : en allocation directe, ils gardent leur nom et leur prime.',
    producerHookEn: 'Your finest lots deserve better than a trader\u2019s anonymous blend: sold in direct allocation, they keep their name and their premium.',
  },
  'Argane alimentaire': {
    openerBuyer: 'L\u2019huile d\u2019argane alimentaire est un produit d\u2019exception — à condition de pouvoir prouver qu\u2019elle est authentique et fraîche.',
    proofs: [
      'Huile IGP Argane pressée d\u2019amandons torréfiés par des coopératives féminines (régions d\u2019Agadir/Taroudant/Essaouira) — l\u2019arganeraie est réserve de biosphère UNESCO',
      'Analyses du lot fournies : indices d\u2019acidité et de peroxyde (les deux marqueurs d\u2019une huile fraîche et bien stockée)',
      'Certificat bio vérifié auprès de l\u2019organisme (Ecocert/ONSSA), pas sur PDF',
      'DLC longue, conditionnements du 25 cl au 5 L : idéal épicerie comme restaurant',
    ],
    sampleLine: 'Je vous envoie volontiers une bouteille échantillon avec les analyses du lot.',
    producerHookFr: 'Les épiceries et restaurants français veulent une argane dont l\u2019authenticité se prouve : votre IGP et vos analyses de lot deviennent visibles et vérifiables.',
    producerHookEn: 'French grocers and restaurants want argan oil whose authenticity can be proven: your PGI and lot analyses become visible and verifiable.',
  },
  'Argane cosmétique': {
    openerBuyer: 'Pour une marque, l\u2019argane n\u2019a de valeur que si les allégations tiennent : origine, pureté, conditions de production.',
    proofs: [
      'Huile cosmétique pressée d\u2019amandons CRUS (à distinguer de l\u2019alimentaire, pressée d\u2019amandons torréfiés) — coopératives féminines IGP',
      'Dossier par lot : certificat bio vérifié au registre, analyses physico-chimiques',
      'Nous restons fournisseur d\u2019INGRÉDIENT : nous ne lancerons pas de cosmétique fini concurrent',
      'Traçabilité publique par lot pour étayer vos allégations marketing',
    ],
    sampleLine: 'Un flacon échantillon avec le dossier du lot peut vous parvenir cette semaine.',
    producerHookFr: 'Les marques cosmétiques indépendantes européennes cherchent une argane pure documentée — votre coopérative peut fournir les deux débouchés (alimentaire + cosmétique) sur un même lot vérifié.',
    producerHookEn: 'European indie cosmetic brands want documented pure argan — your cooperative can serve both outlets (food + cosmetic) from one verified lot.',
  },
  'Café torréfié': {
    openerBuyer: 'Votre rayon café peut raconter une histoire complète : une coopérative vérifiée en Éthiopie, un torréfacteur artisanal de votre région.',
    proofs: [
      'Café torréfié « origine » en sachets 250 g/1 kg, torréfié par des artisans français à partir de vert acheté en direct de coopératives vérifiées',
      'Double histoire locale + origine : le nom du torréfacteur ET celui de la coopérative sur le sachet',
      'QR de traçabilité publique : du producteur au torréfacteur, tout est consultable',
      'Rotation mensuelle, DLUO confortable',
    ],
    sampleLine: 'Je peux vous faire livrer un carton découverte des premières références.',
    producerHookFr: 'Votre café vert, torréfié par des artisans français puis revendu en épicerie avec votre nom : la boucle qui multiplie vos débouchés.',
    producerHookEn: 'Your green coffee, roasted by French artisans and sold in groceries with your name on it: the loop that multiplies your outlets.',
  },
  'Cacao Ghana': {
    openerBuyer: 'Le règlement européen déforestation (EUDR, 2023/1115) vous impose la géolocalisation des parcelles — c\u2019est une contrainte, nous en faisons votre avantage.',
    proofs: [
      'Fèves Ghana bio-équitables avec coordonnées GPS des parcelles fournies : votre déclaration de diligence raisonnée est préparée, pas subie',
      'Filière équitable documentée : prix minimum Fairtrade cacao 3 500 $/t + prime de développement 240 $/t + différentiel bio (chiffres publics Fairtrade)',
      'Sacs de 25 à 62,5 kg — accessible à un atelier bean-to-bar sans engagement de conteneur',
      'Certificats vérifiés aux registres avant publication du producteur',
    ],
    sampleLine: 'Je vous envoie 2 kg de fèves échantillon avec le dossier EUDR type du lot.',
    producerHookFr: 'Les chocolatiers bean-to-bar européens doivent désormais géolocaliser chaque parcelle (EUDR) : vos données GPS deviennent un argument commercial décisif.',
    producerHookEn: 'European bean-to-bar makers must now geolocate every plot (EUDR): your GPS data becomes a decisive commercial argument.',
  },
  'Safran Taliouine': {
    openerBuyer: 'Le safran est l\u2019épice la plus chère du monde — donc la plus coupée. La seule défense sérieuse : le certificat d\u2019analyse ISO 3632.',
    proofs: [
      'Safran AOP de Taliouine (Maroc) en filaments entiers, récolte de la campagne en cours',
      'Certificat ISO 3632 DU LOT : pouvoir colorant (crocine ≥ 200 = catégorie I), picrocrocine, safranal — mesurés en laboratoire',
      'Conditionnements pro : pots 1-10 g pour la vente, vrac 100 g+ pour la cuisine',
      'Traçabilité publique par QR — votre carte peut le mentionner sans risque',
    ],
    sampleLine: 'Je vous fais parvenir 1 g échantillon accompagné du certificat ISO 3632 du lot.',
    producerHookFr: 'Le safran prouvé se vend mieux : vos certificats ISO 3632 affichés lot par lot justifient votre prix face au safran coupé.',
    producerHookEn: 'Proven saffron sells better: your ISO 3632 certificates displayed lot by lot justify your price against adulterated saffron.',
  },
  'Sencha Japon': {
    openerBuyer: 'Un sencha bio japonais authentique se documente : certification JAS, préfecture d\u2019origine, récolte.',
    proofs: [
      'Sencha bio certifié JAS (Japanese Agricultural Standard) — l\u2019équivalence bio UE est gérée documentairement par la plateforme',
      'Vrac 1-10 kg : adapté aux salons de thé comme au rayon vrac',
      'Fiche lot complète : préfecture, récolte, analyses',
      'Une origine qui diversifie votre rayon au-delà des filières « Sud »',
    ],
    sampleLine: 'Un sachet échantillon de 100 g peut vous parvenir avec sa fiche de lot.',
    producerHookFr: 'Les épiceries et salons de thé français cherchent un sencha bio dont la certification JAS est vérifiée — votre documentation devient votre distribution.',
    producerHookEn: 'French groceries and tea rooms look for organic sencha with verified JAS certification — your documentation becomes your distribution.',
  },
  'Miel de thym': {
    openerBuyer: 'Le miel est l\u2019un des produits les plus fraudés d\u2019Europe — un miel de thym grec documenté se distingue immédiatement.',
    proofs: [
      'Miel de thym de Grèce : origine UE, donc pas de droits de douane ni de COI — circuit simple',
      'Documents sanitaires et analyses gérés par le pipeline de la plateforme',
      'Producteur vérifié aux registres (existence légale + certification bio)',
      'Pots 250 g-1 kg pour le rayon, seaux pour la cuisine',
    ],
    sampleLine: 'Je vous envoie un pot échantillon avec sa fiche d\u2019analyses.',
    producerHookFr: 'Le marché français cherche des miels d\u2019origine UE documentés — votre miel de thym avec analyses par lot a une place immédiate en épicerie bio.',
    producerHookEn: 'The French market wants documented EU-origin honeys — your thyme honey with per-lot analyses has an immediate place in organic groceries.',
  },
  'Quinoa Pérou': {
    openerBuyer: 'Le quinoa reste une base du rayon — autant qu\u2019il finance directement les coopératives de l\u2019Altiplano plutôt que des intermédiaires.',
    proofs: [
      'Quinoa blanc/rouge bio de coopératives péruviennes (Puno/Arequipa), certifiées par des organismes présents dans nos annuaires (ex. BioLatina)',
      'Sacs 5-25 kg : adaptés au vrac comme au reconditionnement',
      'Certificats bio + documents d\u2019import contrôlés avant expédition',
      'Volume et panier : le produit qui complète naturellement une commande café/vanille',
    ],
    sampleLine: 'Un sachet échantillon de 500 g avec sa fiche lot peut partir cette semaine.',
    producerHookFr: 'Les épiceries bio françaises cherchent un quinoa dont la coopérative est identifiée et vérifiée — votre certification devient visible, pas enfouie dans un container.',
    producerHookEn: 'French organic groceries want quinoa from an identified, verified cooperative — your certification becomes visible, not buried in a container.',
  },
};

// ---------------------------------------------------------------- générateurs

function productOf(short: string): ScoredProduct | undefined {
  return WAVE1_PRODUCTS.find(w => w.short === short);
}

/** E-mail acheteur spécifique au produit — prêt à copier. */
export function productBuyerEmail(short: string): OutreachMessage | null {
  const p = productOf(short);
  const f = PRODUCT_EMAIL_FACTS[short];
  if (!p || !f) return null;
  return {
    id: `product-buyer-${short}`,
    label: `E-mail acheteur — ${p.name}`,
    channel: 'email',
    subject: `${p.name} : en direct d\u2019une coopérative vérifiée, documents inclus`,
    body: `Bonjour [Prénom],

${f.openerBuyer}

Je suis [Votre prénom], fondateur d\u2019EthiMarket. Nous proposons : ${p.name.toLowerCase()} (${p.price}), en direct de producteurs que nous ne publions qu\u2019après vérification de leur identité, de leur existence légale et de leurs certifications DANS les registres officiels.

Concrètement :
${f.proofs.map(x => `- ${x} ;`).join('\n')}

${f.sampleLine}

Est-ce que 15 minutes cette semaine vous iraient ?

[Signature]
${LANDING}`,
  };
}

/** E-mail producteur FR spécifique à la filière du produit. */
export function productProducerEmailFr(short: string): OutreachMessage | null {
  const p = productOf(short);
  const f = PRODUCT_EMAIL_FACTS[short];
  if (!p || !f) return null;
  return {
    id: `product-producer-fr-${short}`,
    label: `E-mail producteur (FR) — filière ${p.short}`,
    channel: 'email',
    subject: 'Vendre en direct aux acheteurs européens — avec vos preuves mises en avant',
    body: `Bonjour [Nom],

${f.producerHookFr}

EthiMarket est une marketplace européenne où les acheteurs voient vos preuves : nous vérifions votre certification au registre de l\u2019organisme, votre existence légale, votre exploitation — et nous affichons publiquement ces contrôles sur votre boutique.

Pour les premières coopératives partenaires :
- la vérification est offerte (nous faisons le travail documentaire avec vous) ;
- 0 % de commission pendant 6 mois ;
- vous fixez vos prix, vous parlez directement aux acheteurs.

Si cela vous intéresse, répondez simplement à ce message — ou créez votre boutique ici : ${SIGNUP}

[Signature]`,
  };
}

/** E-mail producteur EN spécifique à la filière du produit. */
export function productProducerEmailEn(short: string): OutreachMessage | null {
  const p = productOf(short);
  const f = PRODUCT_EMAIL_FACTS[short];
  if (!p || !f) return null;
  return {
    id: `product-producer-en-${short}`,
    label: `Producer e-mail (EN) — ${p.short}`,
    channel: 'email',
    subject: 'Sell directly to European buyers — with your proofs up front',
    body: `Dear [Name],

${f.producerHookEn}

EthiMarket is a European marketplace where buyers see your proofs: we verify your certification in the certifier\u2019s registry, your legal existence, your farm — and we publicly display those checks on your shop page.

For the first partner cooperatives:
- verification is free of charge (we do the documentary work with you);
- 0% commission for 6 months;
- you set your prices and talk directly to buyers.

If this sounds interesting, simply reply to this message — or create your shop here: ${SIGNUP}

[Signature]`,
  };
}

/** Les 3 e-mails d'un produit (acheteur, producteur FR, producteur EN). */
export function productEmails(short: string): OutreachMessage[] {
  return [
    productBuyerEmail(short),
    productProducerEmailFr(short),
    productProducerEmailEn(short),
  ].filter((m): m is OutreachMessage => m !== null);
}
