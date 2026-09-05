import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Compass, Rocket, PhoneCall, Truck, Boxes, ShieldCheck,
  ClipboardCheck, Wrench, CreditCard, FileText, Scale, BookOpen,
  ListTree, X, type LucideIcon,
} from 'lucide-react';
import { AdminPageHeader } from '../../components/AdminLayout';
import { renderMarkdown, extractHeadings } from '../../lib/markdown';

// Les documents sont embarqués dans le bundle au build : toujours à jour
// avec le repo, zéro appel réseau, zéro coût (politique du projet).
import planStrategique from '../../../docs/PLAN_STRATEGIQUE_ETHIMARKET.md?raw';
import goToMarket from '../../../docs/STRATEGIE_GO_TO_MARKET.md?raw';
import kitProspection from '../../../docs/KIT_PROSPECTION.md?raw';
import strategieLogistique from '../../../docs/STRATEGIE_LOGISTIQUE.md?raw';
import cahier3pl from '../../../docs/CAHIER_DES_CHARGES_3PL.md?raw';
import controleProduits from '../../../docs/STRATEGIE_CONTROLE_PRODUITS.md?raw';
import dossierConfiance from '../../../docs/DOSSIER_CONFIANCE.md?raw';
import ficheAudit from '../../../docs/FICHE_AUDIT_PRODUCTEUR.md?raw';
import planTests from '../../../docs/PLAN_DE_TESTS_LANCEMENT.md?raw';
import operations from '../../../docs/OPERATIONS.md?raw';
import stripeActivation from '../../../docs/STRIPE_ACTIVATION.md?raw';
import mentionsLegales from '../../../docs/legal/MENTIONS_LEGALES_GABARIT.md?raw';
import cgvGabarit from '../../../docs/legal/CGV_GABARIT.md?raw';
import registreTraitements from '../../../docs/legal/REGISTRE_TRAITEMENTS.md?raw';

interface Doc {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  content: string;
  authority?: string;
}

interface DocGroup {
  title: string;
  docs: Doc[];
}

const GROUPS: DocGroup[] = [
  {
    title: 'Stratégie',
    docs: [
      {
        slug: 'plan-strategique',
        title: 'Plan stratégique fondateur',
        description: 'Le document qui tranche tout : marché, produits, phases, modèle économique, plan 12 mois, pre-mortem.',
        icon: Compass,
        content: planStrategique,
        authority: 'Document de référence — en cas de conflit, ce plan prévaut',
      },
      {
        slug: 'go-to-market',
        title: 'Stratégie go-to-market',
        description: 'Les 3 phases de conquête avec critères de sortie — le mode d\u2019emploi du CRM Prospection.',
        icon: Rocket,
        content: goToMarket,
      },
      {
        slug: 'kit-prospection',
        title: 'Kit de prospection',
        description: 'Séquence e-mails J0/J+4/J+10, script d\u2019appel 90 s, e-mail producteur FR+EN, règles RGPD.',
        icon: PhoneCall,
        content: kitProspection,
      },
    ],
  },
  {
    title: 'Opérations',
    docs: [
      {
        slug: 'logistique',
        title: 'Stratégie logistique',
        description: 'Corridors, hub 3PL bio, phasage : direct d\u2019abord, hub après 10 commandes prouvées.',
        icon: Truck,
        content: strategieLogistique,
      },
      {
        slug: 'cahier-3pl',
        title: 'Cahier des charges 3PL',
        description: 'Prêt à envoyer aux prestataires logistiques (signature prévue M4-M6).',
        icon: Boxes,
        content: cahier3pl,
      },
      {
        slug: 'controle-produits',
        title: 'Contrôle produits',
        description: 'Le pipeline de confiance : 4 couches, risque UE 2019/1793, labos, RASFF.',
        icon: ShieldCheck,
        content: controleProduits,
      },
      {
        slug: 'dossier-confiance',
        title: 'Dossier confiance',
        description: 'Le protocole EthiMarket Verified expliqué de bout en bout.',
        icon: FileText,
        content: dossierConfiance,
      },
      {
        slug: 'fiche-audit',
        title: 'Fiche d\u2019audit producteur',
        description: 'La méthode pas à pas pour vérifier un producteur aux registres.',
        icon: ClipboardCheck,
        content: ficheAudit,
      },
      {
        slug: 'plan-tests',
        title: 'Plan de tests lancement',
        description: '~120 tests par rôle, checklist jour J, passe de non-régression 10 min.',
        icon: ClipboardCheck,
        content: planTests,
      },
      {
        slug: 'operations',
        title: 'Manuel d\u2019opérations',
        description: 'Cron quotidien, e-mails, routines d\u2019exploitation de la plateforme.',
        icon: Wrench,
        content: operations,
      },
      {
        slug: 'stripe-activation',
        title: 'Activation Stripe',
        description: 'Guide de bascule en mode live dès que la société et le SIRET existent.',
        icon: CreditCard,
        content: stripeActivation,
      },
    ],
  },
  {
    title: 'Juridique (gabarits)',
    docs: [
      {
        slug: 'mentions-legales',
        title: 'Mentions légales',
        description: 'Gabarit à faire valider par un juriste avant publication.',
        icon: Scale,
        content: mentionsLegales,
      },
      {
        slug: 'cgv',
        title: 'CGV',
        description: 'Gabarit de conditions générales de vente — validation juriste requise.',
        icon: Scale,
        content: cgvGabarit,
      },
      {
        slug: 'registre-traitements',
        title: 'Registre des traitements',
        description: 'Registre RGPD des traitements de données personnelles.',
        icon: BookOpen,
        content: registreTraitements,
      },
    ],
  },
];

const ALL_DOCS = GROUPS.flatMap(g => g.docs);

export default function AdminStrategy() {
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = searchParams.get('doc') ?? 'plan-strategique';
  const doc = ALL_DOCS.find(d => d.slug === slug) ?? ALL_DOCS[0];
  const [tocOpen, setTocOpen] = useState(false);

  const headings = useMemo(() => extractHeadings(doc.content, 2), [doc]);
  const body = useMemo(() => renderMarkdown(doc.content), [doc]);

  useEffect(() => {
    // remonter en haut à chaque changement de document
    window.scrollTo({ top: 0 });
    setTocOpen(false);
  }, [slug]);

  const selectDoc = (s: string) => setSearchParams({ doc: s });

  return (
    <div>
      <AdminPageHeader
        title="Stratégie"
        subtitle="Tous les documents fondateurs, dans le produit — toujours synchronisés avec le dépôt"
        badgeText={`${ALL_DOCS.length} documents`}
      />

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
        {/* Bibliothèque */}
        <aside className="lg:sticky lg:top-20 space-y-5">
          {GROUPS.map(group => (
            <div key={group.title}>
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 px-1">{group.title}</p>
              <div className="space-y-1">
                {group.docs.map(d => {
                  const Icon = d.icon;
                  const active = d.slug === doc.slug;
                  return (
                    <button
                      key={d.slug}
                      onClick={() => selectDoc(d.slug)}
                      className={`w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-xl border-2 transition-colors cursor-pointer ${
                        active
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-transparent hover:border-gray-200 hover:bg-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${active ? 'text-brand-600' : 'text-gray-400'}`} />
                      <span className={`text-xs font-bold leading-snug ${active ? 'text-brand-800' : 'text-gray-700'}`}>{d.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* Document */}
        <div className="min-w-0">
          <div className="bg-white rounded-2xl border-2 border-gray-100 px-5 sm:px-8 py-6">
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4 mb-2">
              <div className="min-w-0">
                <h2 className="text-lg font-black text-gray-900">{doc.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>
                {doc.authority && (
                  <p className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    <Compass className="w-3 h-3" /> {doc.authority}
                  </p>
                )}
              </div>
              {headings.length > 3 && (
                <button
                  onClick={() => setTocOpen(v => !v)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl border-2 border-gray-200 bg-white text-gray-600 hover:border-brand-300 cursor-pointer"
                  aria-expanded={tocOpen}
                >
                  {tocOpen ? <X className="w-3.5 h-3.5" /> : <ListTree className="w-3.5 h-3.5" />}
                  Sommaire
                </button>
              )}
            </div>

            {tocOpen && (
              <nav aria-label="Sommaire du document" className="mb-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <ul className="space-y-1">
                  {headings.map(h => (
                    <li key={h.id} className={h.level === 1 ? '' : 'pl-4'}>
                      <a
                        href={`#${h.id}`}
                        onClick={() => setTocOpen(false)}
                        className={`text-xs hover:text-brand-700 hover:underline ${h.level === 1 ? 'font-black text-gray-800' : 'font-semibold text-gray-600'}`}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <article className="max-w-3xl">{body}</article>
          </div>
        </div>
      </div>
    </div>
  );
}
