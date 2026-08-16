// =============================================================
// EthiMarket — Pages institutionnelles complètes
// Remplace les pages « Bientôt disponible » par du contenu réel :
// Tarifs, Équipe, Certifications, Presse, Partenaires, Centre d'aide.
// =============================================================

import { Link } from 'react-router-dom';
import {
  Check, ShieldCheck, HelpCircle, Newspaper, Handshake, Users,
  BadgeCheck, Mail, ArrowRight, Search, FileText, Scale,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

function PageShell({ title, subtitle, seoTitle, seoDesc, children }: {
  title: string; subtitle: string; seoTitle: string; seoDesc: string; children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead title={seoTitle} description={seoDesc} />
      <Header />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900">{title}</h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ================= TARIFS ================= */
export function Tarifs() {
  const plans = [
    {
      name: 'Acheteur', price: '0 €', period: 'pour toujours',
      desc: 'Pour les acheteurs professionnels et particuliers.',
      features: [
        'Recherche multicritères illimitée (17 facettes)',
        'Trust Center : preuves et certifications vérifiées',
        'Comparateur + fiche justificative d\'achat',
        'Espace « Mes achats » : fournisseurs, produits, analytics',
        'Alertes certifications, risques et opportunités',
        'Coffre-fort documentaire avec analyse automatique',
      ],
      cta: 'Créer un compte gratuit', to: '/inscription', highlight: false,
    },
    {
      name: 'Producteur', price: '0 €', period: 'commission uniquement à la vente',
      desc: 'Pour les coopératives et producteurs. Aucun frais fixe.',
      features: [
        'Boutique en ligne et fiches produits illimitées',
        'Vérification du profil (processus Bureau Veritas)',
        'Dépôt de certificats → statut « Vérifié » public',
        'Messagerie directe avec les acheteurs',
        'Score EthiMarket et badge de confiance',
        'Commission transparente prélevée uniquement sur les ventes conclues',
      ],
      cta: 'Devenir vendeur', to: '/devenir-vendeur', highlight: true,
    },
    {
      name: 'Entreprise', price: 'Sur devis', period: 'selon vos volumes',
      desc: 'Pour les directions achats avec besoins avancés.',
      features: [
        'Tout le plan Acheteur, plus :',
        'Comptes multi-utilisateurs et rôles',
        'Règles de pondération au niveau entreprise',
        'Export des fiches justificatives et rapports CSRD',
        'Accompagnement sourcing dédié',
        'Intégration à vos outils achats (sur demande)',
      ],
      cta: 'Nous contacter', to: '/contact', highlight: false,
    },
  ];

  return (
    <PageShell
      title="Tarifs simples et transparents"
      subtitle="La consultation, la recherche et la vérification des preuves sont gratuites pour tous. EthiMarket se rémunère uniquement par une commission sur les ventes conclues."
      seoTitle="Tarifs & abonnements"
      seoDesc="EthiMarket est gratuit pour les acheteurs et les producteurs. Commission transparente uniquement à la vente. Offre Entreprise sur devis."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(p => (
          <div key={p.name} className={`rounded-3xl border-2 p-7 flex flex-col ${p.highlight ? 'border-brand-500 shadow-lg relative' : 'border-gray-200'}`}>
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-black uppercase tracking-wide px-3 py-1 rounded-full">
                Le plus choisi
              </span>
            )}
            <h2 className="font-black text-gray-900 text-lg">{p.name}</h2>
            <p className="mt-2"><span className="text-3xl font-black text-gray-900">{p.price}</span></p>
            <p className="text-xs text-gray-500">{p.period}</p>
            <p className="text-sm text-gray-600 mt-3">{p.desc}</p>
            <ul className="mt-5 space-y-2.5 flex-1">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to={p.to} className={`mt-6 text-center py-3 rounded-xl text-sm font-bold transition-colors ${p.highlight ? 'bg-brand-600 hover:bg-brand-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 mt-8">
        Aucun frais caché. Le détail des commissions producteur est communiqué lors de la validation du dossier vendeur.
      </p>
    </PageShell>
  );
}

/* ================= ÉQUIPE ================= */
export function NotreEquipe() {
  const values = [
    { icon: ShieldCheck, title: 'La preuve avant la promesse', desc: 'Nous ne publions jamais une allégation éthique sans indiquer si elle est vérifiée, en cours de vérification ou simplement déclarée.' },
    { icon: Handshake, title: 'Le direct producteur', desc: 'Chaque intermédiaire retiré est de la valeur rendue au producteur. Nous connectons les acheteurs aux coopératives sans couche superflue.' },
    { icon: Scale, title: 'La transparence des scores', desc: 'Notre Responsibility Score est décomposé critère par critère, point par point. Tout est explicable, rien n\'est une boîte noire.' },
  ];
  return (
    <PageShell
      title="L'équipe EthiMarket"
      subtitle="Une équipe franco-africaine qui construit l'infrastructure de confiance du commerce responsable."
      seoTitle="Notre équipe"
      seoDesc="L'équipe EthiMarket construit la marketplace de confiance des achats responsables : traçabilité, certifications vérifiées et commerce direct producteur."
    >
      <div className="rounded-3xl bg-brand-50 border border-brand-100 p-8 mb-10">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-xl shrink-0">HB</div>
          <div>
            <h2 className="font-black text-gray-900">Hubert Baya — Fondateur</h2>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              Expert en environnement, Hubert a fondé EthiMarket après un constat simple : les producteurs
              bio et équitables des pays du Sud restent invisibles pour les acheteurs européens, et les
              acheteurs n'ont aucun moyen fiable de vérifier les promesses éthiques. EthiMarket répond aux
              deux problèmes à la fois : une vitrine mondiale pour les coopératives, et un système de preuves
              vérifiées pour les acheteurs.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-black text-gray-900 text-center mb-6">Ce qui nous guide</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {values.map(v => {
          const Icon = v.icon;
          return (
            <div key={v.title} className="rounded-2xl border border-gray-200 p-6">
              <Icon className="w-6 h-6 text-brand-600 mb-3" />
              <h3 className="font-bold text-gray-900 text-sm">{v.title}</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{v.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="text-center rounded-2xl border-2 border-dashed border-brand-200 p-8">
        <Users className="w-8 h-8 text-brand-500 mx-auto mb-3" />
        <h3 className="font-black text-gray-900">Nous recrutons</h3>
        <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto">
          Développement, qualité & certifications, relations producteurs Afrique/Amérique latine :
          si la mission vous parle, écrivez-nous.
        </p>
        <Link to="/contact" className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-brand-700 hover:text-brand-900">
          <Mail className="w-4 h-4" /> Candidature spontanée <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </PageShell>
  );
}

/* ================= CERTIFICATIONS ================= */
export function CertificationsPage() {
  const certs = [
    { name: 'Agriculture Biologique (Bio UE / AB)', body: 'Ecocert, Bureau Veritas, Control Union…', covers: 'Production sans intrants chimiques de synthèse, OGM interdits, contrôles annuels.' },
    { name: 'Fairtrade / Commerce Équitable', body: 'FLO-CERT (Fairtrade International), WFTO', covers: 'Prix minimum garanti au producteur, prime de développement, interdiction du travail des enfants.' },
    { name: 'GOTS (Global Organic Textile Standard)', body: 'Ecocert Greenlife, Control Union', covers: 'Textiles biologiques : fibres, teintures, conditions sociales de toute la chaîne.' },
    { name: 'Rainforest Alliance', body: 'Rainforest Alliance Cert.', covers: 'Agriculture durable, protection des forêts et des travailleurs agricoles.' },
    { name: 'Demeter (biodynamie)', body: 'Demeter International', covers: 'Agriculture biodynamique, cycles naturels, biodiversité renforcée.' },
    { name: 'SA8000 / BSCI (audits sociaux)', body: 'SAI, Amfori', covers: 'Conditions de travail, santé-sécurité, absence de travail forcé ou infantile.' },
  ];
  return (
    <PageShell
      title="Les certifications sur EthiMarket"
      subtitle="Ce que chaque label garantit, qui le contrôle, et comment nous vérifions les certificats déposés par les producteurs."
      seoTitle="Certifications reconnues"
      seoDesc="Bio UE, Fairtrade, GOTS, Rainforest Alliance, Demeter, SA8000 : ce que chaque certification garantit et comment EthiMarket vérifie les certificats."
    >
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 mb-10">
        <h2 className="flex items-center gap-2 font-black text-emerald-900"><BadgeCheck className="w-5 h-5" /> Notre processus de vérification</h2>
        <ol className="mt-3 space-y-1.5 text-sm text-emerald-900 list-decimal pl-5">
          <li>Le producteur dépose son certificat (numéro, organisme, dates de validité).</li>
          <li>EthiMarket contacte l'organisme émetteur (registres publics, API, e-mail) pour confirmer l'authenticité.</li>
          <li>L'allégation passe de « 🕓 Vérification en cours » à « ✅ Certifié » — ou est rejetée.</li>
          <li>À l'expiration du certificat, le statut est rétrogradé automatiquement.</li>
        </ol>
        <Link to="/trust-center" className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-emerald-700 hover:text-emerald-900">
          Lire la méthodologie complète du Trust Center <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {certs.map(c => (
          <div key={c.name} className="rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-brand-600 shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{c.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Organismes certificateurs : {c.body}</p>
              <p className="text-sm text-gray-600 mt-1.5">{c.covers}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center mt-8">
        Plus de 25 organismes certificateurs sont référencés dans notre annuaire interne avec leurs canaux de vérification officiels.
      </p>
    </PageShell>
  );
}

/* ================= PRESSE ================= */
export function Presse() {
  return (
    <PageShell
      title="Espace presse"
      subtitle="Ressources et informations pour les journalistes et médias."
      seoTitle="Presse"
      seoDesc="Espace presse EthiMarket : notre histoire, nos chiffres clés vérifiables et le contact médias."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 p-6">
          <Newspaper className="w-6 h-6 text-brand-600 mb-3" />
          <h2 className="font-black text-gray-900">EthiMarket en bref</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>• Marketplace B2B/B2C de produits biologiques et équitables en direct producteur.</li>
            <li>• Particularité : chaque allégation éthique affiche publiquement son statut de preuve — vérifiée, en cours, ou simple déclaration fournisseur.</li>
            <li>• Moteur de recherche en langage naturel à 17 critères responsables (origine, CO2, salaire décent, emballage…).</li>
            <li>• Score de responsabilité décomposé en 6 critères, entièrement explicable.</li>
            <li>• Plateforme lancée en 2026, en phase pilote avec 6 coopératives sur 4 continents.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200 p-6">
          <Mail className="w-6 h-6 text-brand-600 mb-3" />
          <h2 className="font-black text-gray-900">Contact médias</h2>
          <p className="text-sm text-gray-600 mt-3">
            Pour toute demande d'interview, de visuel ou d'information :
          </p>
          <p className="mt-3 text-sm font-bold text-gray-900">presse@ethimarket.com</p>
          <p className="text-xs text-gray-500 mt-1">Réponse sous 48 h ouvrées.</p>
          <div className="mt-5 rounded-xl bg-gray-50 border border-gray-100 p-4">
            <p className="text-xs text-gray-500">
              Angle éditorial suggéré : « Comment prouver qu'un produit est vraiment éthique ? » —
              notre Trust Center répond en publiant les certificats, leurs numéros, organismes et dates de validité,
              et en signalant honnêtement ce qui n'est pas encore vérifié.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

/* ================= PARTENAIRES ================= */
export function Partenaires() {
  const types = [
    { icon: ShieldCheck, title: 'Organismes certificateurs', desc: 'Ecocert, FLO-CERT, Control Union, Rainforest Alliance… 25+ organismes référencés dans notre annuaire de vérification avec leurs canaux officiels.', cta: null },
    { icon: Handshake, title: 'Coopératives productrices', desc: '6 coopératives pilotes au Maroc, en Éthiopie, au Ghana, à Madagascar, au Pérou et en Iran. Nous élargissons le réseau en continu.', cta: { label: 'Devenir producteur partenaire', to: '/devenir-vendeur' } },
    { icon: FileText, title: 'Référentiels de données', desc: 'Nos estimations d\'impact s\'appuient sur les ordres de grandeur publics (FAO, Poore & Nemecek 2018, Base Empreinte ADEME) et sont toujours étiquetées comme estimations.', cta: null },
    { icon: Users, title: 'Réseaux d\'acheteurs responsables', desc: 'Vous animez un réseau d\'acheteurs, une fédération ou un collectif RSE ? Construisons un accès pilote pour vos membres.', cta: { label: 'Proposer un partenariat', to: '/contact' } },
  ];
  return (
    <PageShell
      title="Nos partenaires"
      subtitle="EthiMarket s'appuie sur un écosystème d'organismes de certification, de coopératives et de référentiels publics."
      seoTitle="Partenaires"
      seoDesc="Organismes certificateurs, coopératives productrices et référentiels de données : l'écosystème EthiMarket."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {types.map(t => {
          const Icon = t.icon;
          return (
            <div key={t.title} className="rounded-2xl border border-gray-200 p-6">
              <Icon className="w-6 h-6 text-brand-600 mb-3" />
              <h2 className="font-bold text-gray-900">{t.title}</h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{t.desc}</p>
              {t.cta && (
                <Link to={t.cta.to} className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-brand-700 hover:text-brand-900">
                  {t.cta.label} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

/* ================= CENTRE D'AIDE ================= */
export function CentreAide() {
  const faqs: { q: string; a: React.ReactNode }[] = [
    {
      q: 'Comment savoir si une certification est authentique ?',
      a: <>Chaque allégation d'un produit affiche son statut sur la fiche : <strong>✅ Certifié</strong> (confirmé auprès de l'organisme émetteur, avec numéro, dates et lien source), <strong>🕓 Vérification en cours</strong>, ou <strong>⚠️ Déclaration fournisseur</strong> quand aucune preuve indépendante n'existe. La méthodologie complète est publiée dans le <Link to="/trust-center" className="text-brand-700 font-bold hover:underline">Trust Center</Link>.</>,
    },
    {
      q: 'Que signifie le Responsibility Score ?',
      a: <>C'est la moyenne pondérée de 6 critères (Environnement, Social, Traçabilité, Certifications, Logistique, Fournisseur), chacun décomposé point par point sur la fiche produit. Rien n'est une boîte noire : cliquez sur un critère pour voir exactement d'où viennent les points. Voir aussi la page <Link to="/score-ethimarket" className="text-brand-700 font-bold hover:underline">Score EthiMarket</Link>.</>,
    },
    {
      q: 'Comment commander ou demander un devis ?',
      a: <>Depuis une fiche produit, utilisez « Commander » pour une demande directe ou « Contacter le producteur » pour discuter quantités, échantillons et délais. La messagerie intégrée conserve l'historique de vos échanges.</>,
    },
    {
      q: 'Comment fonctionne le comparateur ?',
      a: <>Cochez jusqu'à 5 produits dans le catalogue puis cliquez « Comparer » : vous obtenez une matrice Prix / Responsabilité / Traçabilité / Certifications / Risque, une recommandation motivée et une fiche justificative imprimable pour votre direction.</>,
    },
    {
      q: 'Puis-je définir mes propres critères de décision ?',
      a: <>Oui. Dans votre espace acheteur (« Mes règles »), pondérez Prix / Environnement / Social / Traçabilité / Certifications selon votre politique achats. La plateforme peut aussi apprendre de vos décisions et affiner ces règles — c'est désactivable à tout moment.</>,
    },
    {
      q: 'Comment les producteurs sont-ils vérifiés ?',
      a: <>Chaque producteur constitue un dossier (identité, documents d'exploitation, certificats) examiné selon un processus inspiré des standards Bureau Veritas. Les certificats déposés sont confirmés directement auprès des organismes émetteurs avant d'afficher « Vérifié ».</>,
    },
    {
      q: 'Les estimations CO2 et eau sont-elles des mesures réelles ?',
      a: <>Non, et nous l'affichons clairement : ce sont des estimations basées sur des référentiels publics (FAO, littérature scientifique, Base Empreinte ADEME) tant qu'une analyse de cycle de vie spécifique n'a pas été fournie. Chaque chiffre porte son étiquette de source.</>,
    },
    {
      q: 'Que faire si je repère une information douteuse ?',
      a: <>Signalez-la via la page <Link to="/contact" className="text-brand-700 font-bold hover:underline">Contact</Link>. Chaque signalement déclenche un contrôle documenté ; si l'allégation est contredite, elle passe publiquement en « ❌ Non confirmé ».</>,
    },
  ];
  return (
    <PageShell
      title="Centre d'aide"
      subtitle="Les réponses aux questions les plus fréquentes des acheteurs et des producteurs."
      seoTitle="Centre d'aide & FAQ"
      seoDesc="FAQ EthiMarket : vérification des certifications, Responsibility Score, commandes, comparateur, règles de décision personnalisées."
    >
      <div className="space-y-3 max-w-3xl mx-auto">
        {faqs.map((f, i) => (
          <details key={i} className="group rounded-2xl border border-gray-200 overflow-hidden">
            <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors list-none">
              <span className="flex items-center gap-2.5 font-bold text-gray-900 text-sm">
                <HelpCircle className="w-4 h-4 text-brand-600 shrink-0" /> {f.q}
              </span>
              <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
            </summary>
            <div className="px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50">{f.a}</div>
          </details>
        ))}
      </div>
      <div className="text-center mt-10">
        <p className="text-sm text-gray-500">Vous n'avez pas trouvé votre réponse ?</p>
        <Link to="/contact" className="inline-flex items-center gap-2 mt-2 text-sm font-bold text-brand-700 hover:text-brand-900">
          <Search className="w-4 h-4" /> Contacter le support <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </PageShell>
  );
}
