// =============================================================
// EthiMarket — Panneau « Vérification à la source » (admin)
//
// Affiché dans le dossier d'audit :
//  1. le registre du commerce DU PAYS du producteur (chantier 1)
//  2. pour chaque certification déclarée : l'autorité nationale
//     du label dans CE pays + les registres mondiaux (chantier 2)
//  3. le bouton WhatsApp prêt à appeler (chantier 3)
// =============================================================

import { ExternalLink, Landmark, Phone, MessageCircle, BadgeCheck } from 'lucide-react';
import {
  resolveBusinessRegistry, resolveLabelRegistry, buildWhatsAppLink,
  type RegistryEntry,
} from '../../lib/registryDirectory';

function RegistryLink({ entry, tag }: { entry: RegistryEntry; tag?: string }) {
  return (
    <a
      href={entry.url} target="_blank" rel="noreferrer"
      className="flex items-start gap-2.5 bg-white rounded-xl border border-gray-200 hover:border-brand-400 px-3.5 py-2.5 transition-colors group"
    >
      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-600 shrink-0 mt-0.5" />
      <span className="min-w-0">
        <span className="block text-xs font-bold text-gray-800 group-hover:text-brand-700">
          {entry.name}
          {tag && <span className="ms-2 text-[9px] font-black text-brand-700 bg-brand-50 border border-brand-200 px-1.5 py-0.5 rounded">{tag}</span>}
          {!entry.free && <span className="ms-2 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">payant</span>}
          <span className="ms-2 text-[9px] font-semibold text-gray-400">{entry.lang}</span>
        </span>
        <span className="block text-[11px] text-gray-500 mt-0.5 leading-snug">{entry.notes}</span>
      </span>
    </a>
  );
}

export function SourceVerificationPanel({
  country, phone, whatsapp, producerName, certLabels,
}: {
  country: string | null;
  phone: string | null;
  whatsapp: string | null;
  producerName: string;
  /** Libellés des certifications déclarées (ex. ['Bio', 'Fairtrade']) */
  certLabels: string[];
}) {
  const businessRegistry = resolveBusinessRegistry(country);

  // Concordance label × pays (dédupliquée par famille)
  const seen = new Set<string>();
  const labelResolutions = certLabels
    .map(label => ({ label, res: resolveLabelRegistry(label, country) }))
    .filter(({ res }) => {
      if (res.family === 'other') return false;
      if (seen.has(res.family)) return false;
      seen.add(res.family);
      return true;
    });

  const waMessage = `Bonjour ${producerName}, je suis l'équipe de vérification EthiMarket. Dans le cadre de l'audit de votre dossier, pouvons-nous convenir d'un court appel vidéo ?`;
  const waLink = buildWhatsAppLink(whatsapp || phone, country, waMessage);
  const telLink = (phone || whatsapp) ? `tel:${(phone || whatsapp)!.replace(/[^\d+]/g, '')}` : null;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Landmark className="w-4 h-4 text-brand-600" /> Vérification à la source — {country || 'pays non renseigné'}
        </h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Un PDF n'est jamais une preuve</span>
      </div>

      {/* 1. Registre du commerce du pays */}
      <div>
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-wide mb-2">🏢 Registre du commerce ({country || '—'})</p>
        {businessRegistry ? (
          <RegistryLink entry={businessRegistry} tag="officiel" />
        ) : (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
            Pas de registre en ligne référencé pour « {country || '—'} ». Plan B : demander un extrait récent
            du registre local au producteur, et vérifier l'ancrage dans une fédération/union nationale.
          </p>
        )}
      </div>

      {/* 2. Concordance label × pays */}
      {labelResolutions.length > 0 && (
        <div>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-wide mb-2">
            <BadgeCheck className="w-3 h-3 inline me-1" />
            Registres des labels déclarés — résolus pour {country || 'ce pays'}
          </p>
          <div className="space-y-3">
            {labelResolutions.map(({ label, res }) => (
              <div key={res.family} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 space-y-2">
                <p className="text-xs font-bold text-gray-700">« {label} »</p>
                {res.national && (
                  <RegistryLink entry={res.national} tag={`autorité nationale — ${country}`} />
                )}
                {res.global.map(g => <RegistryLink key={g.url} entry={g} />)}
                {!res.national && res.family === 'organic' && (
                  <p className="text-[10px] text-gray-400 italic">
                    Pas d'autorité bio nationale référencée pour ce pays — utilisez le registre du certificateur ci-dessus.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Contact direct */}
      <div>
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-wide mb-2">📞 Contacter le producteur</p>
        <div className="flex gap-2 flex-wrap">
          {waLink ? (
            <a href={waLink} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1fb355] text-white text-xs font-black rounded-xl transition-colors">
              <MessageCircle className="w-4 h-4" /> Appel / message WhatsApp
            </a>
          ) : (
            <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
              Numéro absent ou inexploitable ({whatsapp || phone || 'non renseigné'}) — demandez-le via la messagerie.
            </span>
          )}
          {telLink && (
            <a href={telLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors">
              <Phone className="w-4 h-4" /> Appel classique
            </a>
          )}
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5">
          Le lien WhatsApp normalise automatiquement le numéro au format international ({country || 'indicatif pays'}).
          Après l'appel, enregistrez la preuve « Vérification téléphonique » ou « Appel vidéo » sur le critère concerné.
        </p>
      </div>
    </div>
  );
}
