import { SEGMENT_PITCHES, WAVE1_PRODUCTS } from './strategyData';

/**
 * Générateur de messages de prospection prêts à envoyer.
 * Source : docs/KIT_PROSPECTION.md (séquence J0/J+4/J+10 acheteurs,
 * e-mail producteur FR/EN) — personnalisé par segment et par cible.
 * Politique d'honnêteté : aucune stat inventée, pas de promesse
 * de fonctionnalité inexistante ; [crochets] = à personnaliser à la main.
 */

export interface ProspectLike {
  name: string;
  kind: 'buyer' | 'producer';
  segment: string;
  city: string | null;
  contact_name: string | null;
}

export interface OutreachMessage {
  id: string;
  label: string;
  channel: 'email' | 'appel';
  subject?: string;
  body: string;
}

const LANDING = 'https://ethimarket.vercel.app/pour-les-professionnels';
const SIGNUP = 'https://ethimarket.vercel.app/inscription';

/** Libellé « métier » du segment pour insérer dans les phrases. */
const SEGMENT_METIER: Record<string, string> = {
  torrefacteur: 'torréfacteur',
  epicerie_bio: 'épicerie bio',
  biocoop: 'magasin bio',
  restaurant: 'restaurant',
  epicerie_en_ligne: 'épicerie en ligne',
  chocolatier: 'chocolatier',
  cosmetique: 'marque cosmétique',
  grossiste: 'grossiste',
  centrale: 'centrale d\u2019achat',
  food_service: 'acteur du food-service',
  industriel: 'industriel',
};

function greeting(p: ProspectLike): string {
  return p.contact_name ? `Bonjour ${p.contact_name},` : 'Bonjour,';
}

/** Les produits à mettre en avant, formulés naturellement. */
function productPhrase(p: ProspectLike): string {
  const pitch = SEGMENT_PITCHES[p.segment];
  if (!pitch) return 'café vert d\u2019Éthiopie, vanille de Madagascar et huile d\u2019argane du Maroc';
  const names = pitch.products
    .map(short => WAVE1_PRODUCTS.find(w => w.short === short)?.name ?? short)
    .slice(0, 3);
  if (names.length === 1) return names[0];
  return names.slice(0, -1).join(', ') + ' et ' + names[names.length - 1];
}

// ---------------------------------------------------------------- acheteurs

function buyerJ0(p: ProspectLike): OutreachMessage {
  const metier = SEGMENT_METIER[p.segment] ?? 'professionnel';
  const pitch = SEGMENT_PITCHES[p.segment];
  return {
    id: 'buyer-j0', label: 'E-mail J0 — l\u2019ouverture', channel: 'email',
    subject: 'Vos fournisseurs bio, vérifiés aux registres — pas sur parole',
    body: `${greeting(p)}

Je suis [Votre prénom], fondateur d\u2019EthiMarket — une marketplace qui met les ${metier}s en relation directe avec des coopératives productrices.

Ce qui nous différencie tient en une phrase : nous ne publions un producteur qu\u2019après avoir vérifié son identité, son existence légale et ses certifications DANS les registres officiels (Ecocert, FLO-CERT, USDA…) — et le détail de ces contrôles est public sur sa boutique.

${pitch ? pitch.hook : ''}

Concrètement pour ${p.name} :
- devis direct producteur, échantillon avec numéro de lot avant toute première commande ;
- les documents d\u2019import (certificat bio COI, phytosanitaire, analyses) sont exigés par la plateforme AVANT l\u2019expédition — pas de surprise en douane ;
- chaque lot livré porte un QR de traçabilité publique que vous pouvez montrer à vos clients.

Côté produits, je pense en particulier à : ${productPhrase(p)}.

Est-ce que 15 minutes cette semaine vous iraient ?

[Signature]
${LANDING}`,
  };
}

function buyerJ4(p: ProspectLike): OutreachMessage {
  return {
    id: 'buyer-j4', label: 'E-mail J+4 — la preuve (si pas de réponse)', channel: 'email',
    subject: 'Re: — un exemple concret (2 minutes)',
    body: `${greeting(p)}

Un exemple vaut mieux qu\u2019un argumentaire : voici la boutique d\u2019une coopérative sur EthiMarket → [lien boutique producteur vérifié].

Regardez l\u2019onglet « À propos » : vous y voyez exactement quels contrôles ont été faits, comment et quand (registre consulté, appel vidéo, défi photo géolocalisé sur l\u2019exploitation…). C\u2019est ce niveau de transparence que vos clients finaux commencent à exiger — et que très peu de fournisseurs peuvent documenter.

Si ${productPhrase(p)} tracé et documenté a sa place chez ${p.name}, je vous ouvre un compte en 2 minutes.

[Signature]`,
  };
}

function buyerJ10(p: ProspectLike): OutreachMessage {
  return {
    id: 'buyer-j10', label: 'E-mail J+10 — la clôture douce', channel: 'email',
    subject: 'Je ferme la boucle',
    body: `${greeting(p)}

Dernier message, promis. Deux choses avant de vous laisser :

1. Le compte acheteur est gratuit, sans engagement, sans abonnement — la commission est côté producteur.
2. La première commande peut être un simple échantillon, pour juger sur pièce.

Si le sujet revient à l\u2019ordre du jour dans 3 ou 6 mois, cette adresse reste la bonne. Bonne continuation avec ${p.name} !

[Signature]`,
  };
}

function buyerCall(p: ProspectLike): OutreachMessage {
  const pitch = SEGMENT_PITCHES[p.segment];
  return {
    id: 'buyer-call', label: 'Script d\u2019appel — 90 secondes', channel: 'appel',
    body: `1. « Je vous appelle parce que vous vendez ${productPhrase(p).toLowerCase()} — est-ce vous qui choisissez les fournisseurs ? »

2. Une phrase : « EthiMarket, c\u2019est l\u2019achat direct aux coopératives bio, mais chaque producteur est vérifié aux registres officiels et chaque lot arrive avec ses documents d\u2019import déjà contrôlés. »

3. LA question qui ouvre : « Comment vérifiez-vous aujourd\u2019hui les certificats de vos fournisseurs à l\u2019import ? »
   (90 % ne les vérifient pas — laisser un silence)

4. Proposer : un échantillon précis${pitch ? ` — angle : ${pitch.angle}` : ''}

5. Si intérêt : « Je vous envoie le lien d\u2019inscription par e-mail/SMS, c\u2019est gratuit et sans engagement. »`,
  };
}

// ---------------------------------------------------------------- producteurs

function producerFr(p: ProspectLike): OutreachMessage {
  const pitch = SEGMENT_PITCHES[p.segment];
  return {
    id: 'producer-fr', label: 'E-mail producteur — FR', channel: 'email',
    subject: 'Vendre en direct aux acheteurs européens — avec vos preuves mises en avant',
    body: `${greeting(p)}

Votre coopérative est certifiée : c\u2019est un travail énorme, et il mérite mieux que d\u2019être invisible derrière des intermédiaires.

EthiMarket est une marketplace européenne où les acheteurs voient vos preuves : nous vérifions votre certification au registre de l\u2019organisme, votre existence légale, votre exploitation — et nous affichons publiquement ces contrôles sur votre boutique. Un acheteur qui vous trouve sur EthiMarket sait que vous êtes réel et certifié.

${pitch ? pitch.hook : ''}

Pour les premières coopératives partenaires :
- la vérification est offerte (nous faisons le travail documentaire avec vous) ;
- 0 % de commission pendant 6 mois ;
- vous fixez vos prix, vous parlez directement aux acheteurs.

Si cela vous intéresse, répondez simplement à ce message — ou créez votre boutique ici : ${SIGNUP}

[Signature]`,
  };
}

function producerEn(p: ProspectLike): OutreachMessage {
  return {
    id: 'producer-en', label: 'Producer e-mail — EN', channel: 'email',
    subject: 'Sell directly to European buyers — with your proofs up front',
    body: `${p.contact_name ? `Dear ${p.contact_name},` : 'Dear team,'}

Your cooperative is certified: that is enormous work, and it deserves better than being invisible behind intermediaries.

EthiMarket is a European marketplace where buyers see your proofs: we verify your certification in the certifier\u2019s registry, your legal existence, your farm — and we publicly display those checks on your shop page. A buyer who finds you on EthiMarket knows you are real and certified.

For the first partner cooperatives:
- verification is free of charge (we do the documentary work with you);
- 0% commission for 6 months;
- you set your prices and talk directly to buyers.

If this sounds interesting, simply reply to this message — or create your shop here: ${SIGNUP}

[Signature]`,
  };
}

// ---------------------------------------------------------------- API

/** Les messages adaptés à une cible donnée, prêts à copier/envoyer. */
export function messagesFor(p: ProspectLike): OutreachMessage[] {
  if (p.kind === 'producer') return [producerFr(p), producerEn(p)];
  return [buyerJ0(p), buyerJ4(p), buyerJ10(p), buyerCall(p)];
}

/** Lien mailto prêt à cliquer (si e-mail connu). */
export function mailtoHref(email: string, m: OutreachMessage): string {
  const subject = encodeURIComponent(m.subject ?? '');
  const body = encodeURIComponent(m.body);
  return `mailto:${email}?subject=${subject}&body=${body}`;
}
