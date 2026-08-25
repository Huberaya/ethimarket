import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Guide d'audit intégré (condensé de docs/FICHE_AUDIT_PRODUCTEUR.md).
 * Panneau dépliable en tête de la page d'audit : les 3 règles d'or,
 * le parcours en 7 étapes, l'aide-mémoire méthode par critère et la
 * matrice de décision — pour auditer sans quitter la page.
 * Page admin uniquement → texte FR (langue de travail de l'équipe).
 */

const STEPS: { step: string; title: string; how: string }[] = [
  { step: '0', title: 'Lire le dossier en entier (10 min)', how: 'Les fraudes se repèrent aux incohérences ENTRE les sections : un « caféiculteur » aux photos de palmiers, un certificat kenyan pour une adresse au Ghana. Lisez d\'abord, vérifiez ensuite. Lancez le défi photo immédiatement (72 h d\'attente) : vous ferez le reste pendant ce temps.' },
  { step: '1', title: 'Identité vérifiée', how: 'Pièce d\'identité : expiration, netteté, nom = compte. Puis appel (WhatsApp suffit) : nom, ville, production, une question dont la réponse est dans le dossier. Indicatif cohérent avec le pays (+233 Ghana, +251 Éthiopie…). Preuve : méthode « Vérification téléphonique », référence = numéro appelé, constat daté et factuel.' },
  { step: '2', title: 'Documents d\'entreprise', how: 'Registre du commerce À LA SOURCE : pays OHADA → rccm.ohada.org ; sinon le bloc « Registres publics officiels » de la page donne le lien du pays. Introuvable en ligne ? Attestation récente + ancrage réel (fédération, coopérative).' },
  { step: '3', title: 'Certification valide', how: 'JAMAIS le PDF seul : le registre de l\'organisme fait foi (Ecocert business-directory, FLOCERT customer-search, USDA OID, GGN…). Nom, produit, validité doivent correspondre. Absent du registre = e-mail à l\'organisme, et on attend sa réponse.' },
  { step: '4', title: 'Exploitation réelle', how: 'Défi photo géolocalisé (code EM-XXXX, 72 h) + bouton « Analyser les EXIF » (date, GPS <10 km, appareil). Photos incohérentes ou EXIF absent sur TOUTES les photos = demander un appel vidéo « visite d\'exploitation ».' },
  { step: '5', title: 'Engagements éthiques', how: 'Appel vidéo aux questions OUVERTES (scripts dans la fiche complète) : « Parlez-moi de votre équipe », « Comment fixez-vous les salaires ? ». Les réponses apprises par cœur se voient. Constat = citations concrètes.' },
  { step: '6', title: 'Charte signée', how: 'Examen du document : signature, date, nom du signataire = responsable vérifié à l\'étape 1.' },
  { step: '7', title: 'Décision finale', how: '6/6 prouvés → APPROUVER (viser ≥ Argent). Éléments manquants côté producteur → DEMANDER MODIFICATIONS en listant quoi fournir (cas le plus courant, pas un échec). Fraude caractérisée → REJETER avec constat factuel : vos preuves ❌ restent la trace opposable.' },
];

const METHODS: [string, string, string][] = [
  ['1. Identité', 'Téléphone + examen pièce', 'Selfie-pièce, appel vidéo'],
  ['2. Entreprise', 'Registre public (OHADA…)', 'Examen doc + ancrage fédération'],
  ['3. Certification', 'Registre de l\'organisme', 'E-mail à l\'organisme'],
  ['4. Exploitation', 'Défi photo + EXIF', 'Appel vidéo « visite », satellite'],
  ['5. Éthique', 'Appel vidéo questions ouvertes', 'Parrainage, référence acheteur'],
  ['6. Charte', 'Examen du document signé', '—'],
];

export default function AuditGuidePanel() {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  return (
    <div className="mb-6 rounded-2xl border-2 border-indigo-100 bg-indigo-50/40">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer"
        aria-expanded={open}>
        <span className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>
            <span className="block font-black text-gray-900 text-sm">Guide d'audit — comment vérifier ce dossier</span>
            <span className="block text-[11px] text-gray-500 mt-0.5">Les 3 règles d'or, les 7 étapes et l'aide-mémoire, sans quitter la page</span>
          </span>
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>

      {open && (
        <div className="px-5 pb-5">
          {/* Les 3 règles d'or */}
          <div className="grid sm:grid-cols-3 gap-2.5 mb-4">
            <div className="rounded-xl bg-white border border-indigo-100 p-3.5">
              <p className="text-xs font-black text-indigo-900">1. Un PDF n'est jamais une preuve</p>
              <p className="text-[11px] text-gray-500 mt-1">Seul le registre public de l'organisme émetteur fait foi. Vérifiez toujours à la source.</p>
            </div>
            <div className="rounded-xl bg-white border border-indigo-100 p-3.5">
              <p className="text-xs font-black text-indigo-900">2. On ne coche pas, on prouve</p>
              <p className="text-[11px] text-gray-500 mt-1">Chaque critère exige une preuve : comment, où, quand, résultat. Écrivez chaque constat comme si un juge devait le lire.</p>
            </div>
            <div className="rounded-xl bg-white border border-indigo-100 p-3.5">
              <p className="text-xs font-black text-indigo-900">3. Le doute ne se valide pas</p>
              <p className="text-[11px] text-gray-500 mt-1">Demander un élément de plus coûte 0 €. Valider une fraude coûte la confiance de toute la plateforme.</p>
            </div>
          </div>

          {/* Les 7 étapes (accordéon) */}
          <p className="text-[11px] font-black text-gray-600 uppercase tracking-wide mb-2">Le parcours (30-45 min par dossier)</p>
          <div className="space-y-1.5 mb-4">
            {STEPS.map(s => (
              <div key={s.step} className="rounded-lg bg-white border border-gray-100">
                <button onClick={() => setActiveStep(a => a === s.step ? null : s.step)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer"
                  aria-expanded={activeStep === s.step}>
                  <span className="w-6 h-6 shrink-0 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-black flex items-center justify-center">{s.step}</span>
                  <span className="text-xs font-bold text-gray-800 flex-1">{s.title}</span>
                  {activeStep === s.step ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                </button>
                {activeStep === s.step && (
                  <p className="px-3 pb-3 pl-11 text-[11px] text-gray-600 leading-relaxed">{s.how}</p>
                )}
              </div>
            ))}
          </div>

          {/* Aide-mémoire */}
          <p className="text-[11px] font-black text-gray-600 uppercase tracking-wide mb-2">Aide-mémoire : quelle méthode pour quel critère ?</p>
          <div className="rounded-xl bg-white border border-gray-100 overflow-hidden mb-3">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-3 py-1.5 font-bold">Critère</th>
                  <th className="px-3 py-1.5 font-bold">Méthode recommandée</th>
                  <th className="px-3 py-1.5 font-bold">Plan B</th>
                </tr>
              </thead>
              <tbody>
                {METHODS.map(([c, m, b]) => (
                  <tr key={c} className="border-t border-gray-50">
                    <td className="px-3 py-1.5 font-bold text-gray-800">{c}</td>
                    <td className="px-3 py-1.5 text-gray-600">{m}</td>
                    <td className="px-3 py-1.5 text-gray-400">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-gray-500">
            🥉 Bronze = documents + registres · 🥈 Argent = + une preuve de terrain (défi photo/EXIF/vidéo) · 🥇 Or = + une confirmation humaine.{' '}
            <span className="font-bold">Objectif : ne jamais approuver en dessous d'Argent.</span>{' '}
            Guide complet : <code className="bg-gray-100 px-1 rounded">docs/FICHE_AUDIT_PRODUCTEUR.md</code>
          </p>
        </div>
      )}
    </div>
  );
}
