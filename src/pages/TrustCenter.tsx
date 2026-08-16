// =============================================================
// EthiMarket Trust Center — Page publique /trust-center
// Méthodologie transparente : hiérarchie des preuves, processus,
// limites reconnues. But : que l'acheteur comprenne EXACTEMENT
// ce que « vérifié » veut dire (et ce que ça ne veut pas dire).
// =============================================================

import { ShieldCheck, FileSearch, Building2, AlertTriangle, Scale, BookOpenCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

const EVIDENCE_LADDER = [
  {
    level: 5,
    title: 'Certificat vérifié auprès de l\'organisme',
    detail: 'Nous avons contacté l\'organisme certificateur (Ecocert, FLOCERT, Control Union, Africert…) qui a confirmé l\'authenticité et la validité du certificat. C\'est le seul niveau qui donne le statut « ✅ Certifié ».',
    color: 'bg-emerald-500',
  },
  {
    level: 4,
    title: 'Certificat déposé / rapport d\'audit indépendant',
    detail: 'Un certificat officiel ou un rapport d\'audit tiers (SA8000, BSCI, SMETA…) est au dossier. La confirmation auprès de l\'émetteur est en cours : statut « 🕓 Vérification en cours ».',
    color: 'bg-emerald-400',
  },
  {
    level: 3,
    title: 'Contrôle documentaire EthiMarket',
    detail: 'Notre équipe a examiné les documents (factures matières, contrats, photos d\'atelier, registres) sans confirmation externe. Ne suffit pas pour « Certifié ».',
    color: 'bg-blue-400',
  },
  {
    level: 2,
    title: 'Document fournisseur non contrôlé',
    detail: 'Le fournisseur a déposé un document que nous n\'avons pas encore examiné.',
    color: 'bg-amber-400',
  },
  {
    level: 1,
    title: 'Simple déclaration',
    detail: 'Le fournisseur affirme, sans document. Statut affiché : « ⚠️ Déclaration fournisseur — preuve indépendante non trouvée. »',
    color: 'bg-amber-500',
  },
];

export default function TrustCenter() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead
        title="Trust Center — Comment nous vérifions | EthiMarket"
        description="Pourquoi EthiMarket considère qu'un produit est responsable : hiérarchie des preuves, processus de vérification auprès des organismes certificateurs, et nos limites en toute transparence."
      />
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 flex-1">
      {/* En-tête */}
      <header className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
          <ShieldCheck className="h-7 w-7 text-emerald-700" aria-hidden />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Trust Center</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Pourquoi EthiMarket considère-t-il qu'un produit est responsable ?
          Voici exactement comment nous le décidons — et ce que nous ne pouvons pas garantir.
        </p>
      </header>

      {/* Principe fondateur */}
      <section className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-emerald-900">
          <Scale className="h-5 w-5" aria-hidden /> Notre règle n°1
        </h2>
        <p className="mt-3 text-emerald-900">
          <strong>Chaque information affichée a une source, et le statut de vérification est
          calculé par la plateforme — jamais déclaré par le fournisseur.</strong>
        </p>
        <p className="mt-2 text-sm text-emerald-800">
          Quand une allégation n'a pas de preuve indépendante, nous ne la cachons pas et nous
          ne l'embellissons pas : nous affichons
          « ⚠️ Déclaration fournisseur — preuve indépendante non trouvée. »
          EthiMarket refuse d'être un site qui répète les arguments marketing des fournisseurs.
        </p>
      </section>

      {/* Hiérarchie des preuves */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <FileSearch className="h-5 w-5" aria-hidden /> La hiérarchie des preuves
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Toutes les preuves ne se valent pas. Une allégation n'obtient le statut
          « Certifié » que si elle est appuyée par une preuve de niveau 4 ou 5, valide et non expirée.
        </p>
        <ol className="mt-6 space-y-3">
          {EVIDENCE_LADDER.map(step => (
            <li key={step.level} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${step.color} text-sm font-bold text-white`}>
                {step.level}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Processus de vérification */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Building2 className="h-5 w-5" aria-hidden /> Comment nous vérifions
        </h2>
        <div className="mt-4 space-y-4 text-sm text-gray-700">
          <p>
            Notre annuaire interne référence <strong>plus de 55 organismes certificateurs</strong> dans
            le monde (Europe, Afrique, Asie, Amérique latine), avec leurs canaux de vérification
            officiels : API, registres publics, e-mail, formulaires, téléphone.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Chaque certificat déposé est confronté à l'organisme émetteur (numéro, titulaire, périmètre, dates).</li>
            <li>Chaque vérification est <strong>horodatée et journalisée dans un registre immuable</strong> : personne, pas même un administrateur, ne peut effacer l'historique.</li>
            <li>À l'expiration d'un certificat, le statut de l'allégation est <strong>automatiquement rétrogradé</strong> — un produit ne reste jamais « certifié » avec un certificat périmé.</li>
            <li>Si un organisme infirme un certificat, l'allégation passe en « ❌ Non confirmé » et le fournisseur est notifié.</li>
          </ul>
        </div>
      </section>

      {/* Ce que ça ne garantit pas */}
      <section className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-amber-900">
          <AlertTriangle className="h-5 w-5" aria-hidden /> Nos limites, en toute transparence
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-900">
          <li>« Certifié » signifie que le certificat est authentique et valide — pas que nous avons visité l'usine nous-mêmes.</li>
          <li>Les estimations d'impact (CO2, eau) issues de modèles sectoriels sont toujours étiquetées comme telles, jamais présentées comme des mesures.</li>
          <li>Une « déclaration fournisseur » n'est pas nécessairement fausse — elle est simplement non prouvée à ce jour.</li>
          <li>La vérification auprès de certains organismes peut prendre plusieurs semaines ; le statut « vérification en cours » reflète ce délai réel.</li>
        </ul>
      </section>

      {/* Engagement */}
      <section className="mt-12 text-center">
        <h2 className="flex items-center justify-center gap-2 text-xl font-bold text-gray-900">
          <BookOpenCheck className="h-5 w-5" aria-hidden /> Notre engagement
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
          Si vous repérez une allégation douteuse, signalez-la : chaque signalement déclenche
          un contrôle documenté. La confiance ne se décrète pas, elle se prouve — source par source.
        </p>
      </section>
      </main>
      <Footer />
    </div>
  );
}
