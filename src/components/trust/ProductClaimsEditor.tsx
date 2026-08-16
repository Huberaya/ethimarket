// =============================================================
// EthiMarket Trust Center — Éditeur d'allégations de la fiche produit
//
// Permet au vendeur, directement depuis l'ajout/édition de produit,
// de déclarer des allégations ("Coton biologique", "Salaire décent"…)
// et d'y JOINDRE un certificat : n° de certificat, organisme émetteur,
// dates de validité, lien source officiel.
//
// Règles Trust Center (inchangées, garanties par la base) :
//  - Avec certificat déposé  → 🕓 « Vérification en cours » (jamais
//    "Certifié" tant qu'EthiMarket n'a pas confirmé auprès de l'organisme)
//  - Sans preuve             → ⚠️ « Déclaration fournisseur — preuve
//    indépendante non trouvée. »
// =============================================================

import { useEffect, useState } from 'react';
import { Plus, Trash2, ShieldCheck, AlertTriangle, FileText, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export interface DraftEvidence {
  certificateNumber: string;
  issuingBodyId: string;
  issuingBodyName: string;
  validFrom: string;
  validUntil: string;
  sourceUrl: string;
}

export interface DraftClaim {
  claimType: string;
  claimLabel: string;
  claimValue: string;
  hasCertificate: boolean;
  evidence: DraftEvidence;
}

export const CLAIM_TYPE_OPTIONS: { value: string; label: string; example: string }[] = [
  { value: 'organic_material', label: '🌱 Matière / produit biologique', example: 'Ex : « Coton biologique », « Café biologique »' },
  { value: 'fair_trade', label: '🤝 Commerce équitable', example: 'Ex : « Commerce équitable certifié Fairtrade »' },
  { value: 'living_wage', label: '💰 Salaire décent', example: 'Ex : « Salaire décent garanti »' },
  { value: 'social_conditions', label: '👥 Conditions sociales', example: 'Ex : « Coopérative de femmes », « Audit social »' },
  { value: 'no_child_labor', label: '🚸 Sans travail des enfants', example: 'Ex : « Sans travail des enfants »' },
  { value: 'vegan', label: '🌿 Vegan', example: 'Ex : « 100% vegan »' },
  { value: 'recycled_content', label: '♻️ Matières recyclées', example: 'Ex : « 70% polyester recyclé »' },
  { value: 'carbon_footprint', label: '🌍 Empreinte carbone', example: 'Ex : « 1,2 kg CO2e par unité »' },
  { value: 'origin', label: '📍 Origine', example: 'Ex : « Récolte manuelle en Éthiopie »' },
  { value: 'manufacturing_location', label: '🏭 Lieu de fabrication', example: 'Ex : « Fabriqué au Portugal »' },
  { value: 'raw_material_origin', label: '🧵 Origine des matières premières', example: 'Ex : « Coton d\'Inde »' },
  { value: 'packaging', label: '📦 Emballage', example: 'Ex : « Emballage sans plastique »' },
  { value: 'animal_welfare', label: '🐄 Bien-être animal', example: 'Ex : « Élevage plein air »' },
  { value: 'water_usage', label: '💧 Consommation d\'eau', example: 'Ex : « Irrigation goutte-à-goutte »' },
  { value: 'other', label: '✨ Autre engagement', example: 'Ex : « Agriculture sous ombrage »' },
];

export function emptyDraftClaim(): DraftClaim {
  return {
    claimType: 'organic_material',
    claimLabel: '',
    claimValue: '',
    hasCertificate: false,
    evidence: {
      certificateNumber: '',
      issuingBodyId: '',
      issuingBodyName: '',
      validFrom: '',
      validUntil: '',
      sourceUrl: '',
    },
  };
}

interface CertBody { id: string; name: string }

interface ProductClaimsEditorProps {
  claims: DraftClaim[];
  onChange: (claims: DraftClaim[]) => void;
}

export default function ProductClaimsEditor({ claims, onChange }: ProductClaimsEditorProps) {
  const [bodies, setBodies] = useState<CertBody[]>([]);

  useEffect(() => {
    supabase
      .from('certification_bodies')
      .select('id, name')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => {
        if (data) setBodies(data as CertBody[]);
      });
  }, []);

  const inputClass = 'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

  const updateClaim = (index: number, patch: Partial<DraftClaim>) => {
    onChange(claims.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };
  const updateEvidence = (index: number, patch: Partial<DraftEvidence>) => {
    onChange(claims.map((c, i) => (i === index ? { ...c, evidence: { ...c.evidence, ...patch } } : c)));
  };
  const removeClaim = (index: number) => onChange(claims.filter((_, i) => i !== index));
  const addClaim = () => onChange([...claims, emptyDraftClaim()]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
      <div>
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-600" /> Allégations éthiques & preuves (Trust Center)
        </h2>
        <p className="text-xs text-gray-500 mt-2">
          Déclarez ici ce qui rend votre produit responsable (« Coton biologique », « Salaire décent »…)
          et joignez vos certificats. Chaque allégation apparaîtra publiquement sur la fiche produit avec
          son statut de vérification.
        </p>
      </div>

      {/* Explication des statuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-emerald-800">
          <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span><strong>Avec certificat joint :</strong> statut « 🕓 Vérification en cours », puis « ✅ Certifié » une fois
          l'authenticité confirmée par EthiMarket auprès de l'organisme.</span>
        </div>
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-800">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span><strong>Sans certificat :</strong> affichée « ⚠️ Déclaration fournisseur — preuve indépendante non trouvée. »</span>
        </div>
      </div>

      {claims.length === 0 && (
        <p className="text-sm text-gray-400 italic text-center py-2">
          Aucune allégation déclarée pour l'instant.
        </p>
      )}

      {claims.map((claim, i) => {
        const typeOption = CLAIM_TYPE_OPTIONS.find(o => o.value === claim.claimType);
        return (
          <div key={i} className="border-2 border-gray-100 rounded-2xl p-4 space-y-4 relative">
            <button
              type="button"
              onClick={() => removeClaim(i)}
              className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              aria-label="Supprimer cette allégation"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
              <div>
                <label className={labelClass}>Type d'allégation</label>
                <select
                  value={claim.claimType}
                  onChange={e => updateClaim(i, { claimType: e.target.value })}
                  className={inputClass}
                >
                  {CLAIM_TYPE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Libellé affiché publiquement *</label>
                <input
                  type="text"
                  value={claim.claimLabel}
                  onChange={e => updateClaim(i, { claimLabel: e.target.value })}
                  placeholder={typeOption?.example ?? 'Ex : Coton biologique'}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Précision (optionnel)</label>
              <input
                type="text"
                value={claim.claimValue}
                onChange={e => updateClaim(i, { claimValue: e.target.value })}
                placeholder="Ex : 95% coton bio certifié, filé et tissé localement"
                className={inputClass}
              />
            </div>

            {/* Certificat */}
            <div className={`rounded-xl border-2 p-4 transition-colors ${claim.hasCertificate ? 'border-emerald-200 bg-emerald-50/40' : 'border-dashed border-gray-200'}`}>
              <button
                type="button"
                onClick={() => updateClaim(i, { hasCertificate: !claim.hasCertificate })}
                className={`flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer ${claim.hasCertificate ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-800'}`}
              >
                <FileText className="w-4 h-4" />
                {claim.hasCertificate ? 'Certificat joint ✓ (cliquer pour retirer)' : '+ Joindre un certificat officiel'}
              </button>

              {!claim.hasCertificate && (
                <p className="text-[11px] text-amber-700 mt-2 flex items-start gap-1.5">
                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                  Sans certificat, cette allégation sera affichée : « Déclaration fournisseur — preuve indépendante non trouvée. »
                </p>
              )}

              {claim.hasCertificate && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>📄 N° de certification *</label>
                      <input
                        type="text"
                        value={claim.evidence.certificateNumber}
                        onChange={e => updateEvidence(i, { certificateNumber: e.target.value })}
                        placeholder="Ex : EC-BIO-2026-12345"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>🏢 Organisme certificateur *</label>
                      <select
                        value={claim.evidence.issuingBodyId}
                        onChange={e => {
                          const body = bodies.find(b => b.id === e.target.value);
                          updateEvidence(i, { issuingBodyId: e.target.value, issuingBodyName: body?.name ?? '' });
                        }}
                        className={inputClass}
                      >
                        <option value="">— Sélectionner —</option>
                        {bodies.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Émis le</label>
                      <input
                        type="date"
                        value={claim.evidence.validFrom}
                        onChange={e => updateEvidence(i, { validFrom: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>📅 Valide jusqu'au *</label>
                      <input
                        type="date"
                        value={claim.evidence.validUntil}
                        onChange={e => updateEvidence(i, { validUntil: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>🔗 Lien de vérification officiel</label>
                      <input
                        type="url"
                        value={claim.evidence.sourceUrl}
                        onChange={e => updateEvidence(i, { sourceUrl: e.target.value })}
                        placeholder="https://registre-de-l-organisme…"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 flex items-start gap-1.5">
                    <Info className="w-3 h-3 mt-0.5 shrink-0" />
                    EthiMarket contactera l'organisme pour confirmer l'authenticité du certificat.
                    Tant que la vérification est en cours, l'allégation affiche « 🕓 Vérification en cours ».
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addClaim}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-brand-300 text-brand-700 rounded-xl text-sm font-bold hover:bg-brand-50 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Ajouter une allégation
      </button>
    </div>
  );
}

/**
 * Persiste les allégations d'un produit : crée les claims + preuves.
 * Le statut public est calculé automatiquement par le moteur SQL
 * (trigger evaluate_claim_status) : jamais écrit ici.
 */
export async function saveDraftClaims(productId: string, claims: DraftClaim[]): Promise<string | null> {
  for (const claim of claims) {
    if (!claim.claimLabel.trim()) continue;

    const { data: claimRow, error: claimErr } = await supabase
      .from('product_claims')
      .insert({
        product_id: productId,
        claim_type: claim.claimType,
        claim_label: claim.claimLabel.trim(),
        claim_value: claim.claimValue.trim() || null,
        declared_by: 'supplier',
        verification_status: 'declared_only', // forcé par trigger de toute façon
      })
      .select('id')
      .maybeSingle();

    if (claimErr) {
      // Doublon (product_id, claim_type, claim_label) → ignorer silencieusement
      if (claimErr.code === '23505') continue;
      return claimErr.message;
    }
    if (!claimRow?.id) continue;

    if (claim.hasCertificate && claim.evidence.certificateNumber.trim()) {
      const { error: evErr } = await supabase.from('claim_evidence').insert({
        claim_id: claimRow.id,
        evidence_type: 'certificate_on_file',
        reference_number: claim.evidence.certificateNumber.trim(),
        issuing_body_id: claim.evidence.issuingBodyId || null,
        source_url: claim.evidence.sourceUrl.trim() || null,
        valid_from: claim.evidence.validFrom || null,
        valid_until: claim.evidence.validUntil || null,
        check_result: 'not_checked', // forcé par trigger de toute façon
      });
      if (evErr) return evErr.message;
    } else {
      const { error: evErr } = await supabase.from('claim_evidence').insert({
        claim_id: claimRow.id,
        evidence_type: 'supplier_declaration',
        check_result: 'not_checked',
      });
      if (evErr) return evErr.message;
    }
  }
  return null;
}
