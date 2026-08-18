// =============================================================
// EthiMarket — Moteur de conformité produit (couche 1 du
// Product Trust Pipeline)
//
// Miroir UI du socle SQL product_required_compliance_keys() :
// détermine, selon catégorie × origine × certifications, les
// éléments que le producteur doit fournir AVANT que son produit
// puisse être publié (status='active'). Le verrou réel est le
// trigger SQL enforce_product_compliance_gate — ce module ne
// fait qu'expliquer et pré-valider côté interface.
//
// Modèle : champs structurés obligatoires + blocage automatique
// (la pratique installée par le GPSR chez les grandes
// marketplaces), appliqué ici au B2B alimentaire.
// Moteur local, déterministe, zéro API.
// =============================================================

import { supabase } from './supabase';
import { assessEuRisk, isEudrProduct, type EuRiskAssessment } from './euRiskList';

export type ComplianceKey =
  | 'hs_code' | 'batch_dluo' | 'technical_sheet' | 'coa_recent'
  | 'labeling_check' | 'organic_certificate' | 'gps_parcels' | 'allergens';

export type ComplianceStatus = 'missing' | 'provided' | 'verified' | 'rejected';

export interface ComplianceItem {
  id?: string;
  product_id?: string;
  requirement_key: ComplianceKey;
  required: boolean;
  status: ComplianceStatus;
  value_text?: string | null;
  file_url?: string | null;
  note?: string | null;
  reviewed_at?: string | null;
}

export interface ComplianceRequirementMeta {
  key: ComplianceKey;
  /** Libellés FR — passés dans tx() par l'UI. */
  label: string;
  help: string;
  /** Saisie attendue : texte, fichier, ou case de confirmation. */
  input: 'text' | 'file' | 'confirm';
  placeholder?: string;
}

export const COMPLIANCE_META: Record<ComplianceKey, ComplianceRequirementMeta> = {
  hs_code: {
    key: 'hs_code', input: 'text', placeholder: 'Ex : 090111 (café vert)',
    label: 'Code douanier SH (6 chiffres)',
    help: 'Le code du Système Harmonisé identifie votre produit pour la douane. Cherchez-le gratuitement sur le site de l\'OMD ou demandez à votre transitaire.',
  },
  batch_dluo: {
    key: 'batch_dluo', input: 'text', placeholder: 'Ex : LOT-2026-014 / DDM 12/2027',
    label: 'N° de lot et DLUO/DDM',
    help: 'Le numéro de lot en cours et sa date de durabilité minimale. Indispensable pour la traçabilité et les rappels.',
  },
  technical_sheet: {
    key: 'technical_sheet', input: 'file',
    label: 'Fiche technique produit',
    help: 'Spécifications : origine, grade/calibre, humidité, procédé, conditionnement. C\'est le document de référence de l\'acheteur professionnel.',
  },
  coa_recent: {
    key: 'coa_recent', input: 'file',
    label: 'Certificat d\'analyse (COA) de moins de 12 mois',
    help: 'Rapport d\'un laboratoire (pesticides, mycotoxines, micro selon le produit). Un COA récent rassure l\'acheteur et anticipe les contrôles UE.',
  },
  labeling_check: {
    key: 'labeling_check', input: 'confirm',
    label: 'Étiquetage conforme (règl. UE 1169/2011)',
    help: 'Je confirme que l\'étiquette porte : dénomination, ingrédients, allergènes, quantité nette, DDM, lot, origine, coordonnées.',
  },
  organic_certificate: {
    key: 'organic_certificate', input: 'text', placeholder: 'Ex : Ecocert n° 123456',
    label: 'Certificat bio : n° + organisme certificateur',
    help: 'Exigé car le produit est vendu comme bio. Le numéro sera vérifié à la source par notre équipe (protocole EthiMarket Verified).',
  },
  gps_parcels: {
    key: 'gps_parcels', input: 'text', placeholder: 'Ex : 6.6885, -1.6244 ; 6.6890, -1.6210',
    label: 'Coordonnées GPS des parcelles (EUDR)',
    help: 'Café et cacao : le règlement UE déforestation 2023/1115 exige la géolocalisation des parcelles pour que votre acheteur puisse importer.',
  },
  allergens: {
    key: 'allergens', input: 'text', placeholder: 'Ex : arachide, sésame — ou « aucun »',
    label: 'Allergènes / composition',
    help: 'Produits transformés : liste des allergènes majeurs présents ou traces possibles (les 14 allergènes UE).',
  },
};

/** Une exigence est-elle satisfaite pour la publication ? */
export function isItemSatisfied(item: Pick<ComplianceItem, 'status'> | undefined): boolean {
  return item?.status === 'provided' || item?.status === 'verified';
}

export interface ComplianceInput {
  product_type?: string | null;
  name?: string | null;
  country?: string | null;
  certifications?: string[] | null;
}

/**
 * Socle d'exigences BLOQUANTES — miroir EXACT de la fonction SQL
 * product_required_compliance_keys(). Fonction PURE.
 */
export function requiredComplianceKeys(p: ComplianceInput): ComplianceKey[] {
  const keys: ComplianceKey[] = ['hs_code', 'batch_dluo', 'technical_sheet', 'coa_recent', 'labeling_check'];
  const isOrganic = (p.certifications ?? []).some(c => /bio|organic|ecocert/i.test(c));
  if (isOrganic) keys.push('organic_certificate');
  if (isEudrProduct(p.product_type) || /caf[eé]|coffee|cacao|cocoa/i.test(`${p.product_type ?? ''} ${p.name ?? ''}`)) {
    keys.push('gps_parcels');
  }
  return keys;
}

/**
 * Exigences RECOMMANDÉES (non bloquantes) selon le risque.
 * Ex : allergènes pour les produits transformés.
 */
export function recommendedComplianceKeys(p: ComplianceInput): ComplianceKey[] {
  const haystack = `${p.product_type ?? ''} ${p.name ?? ''}`.toLowerCase();
  const keys: ComplianceKey[] = [];
  if (/beurre|p[âa]te|poudre|transform|savon|cosm[ée]tique|confiture|chocolat|farine/.test(haystack)) {
    keys.push('allergens');
  }
  return keys;
}

export interface ComplianceDossier {
  required: ComplianceKey[];
  recommended: ComplianceKey[];
  items: Partial<Record<ComplianceKey, ComplianceItem>>;
  missing: ComplianceKey[];
  complete: boolean;
  risk: EuRiskAssessment;
}

/** Construit l'état du dossier à partir des items existants. Fonction PURE. */
export function buildComplianceDossier(
  p: ComplianceInput,
  items: ComplianceItem[],
): ComplianceDossier {
  const required = requiredComplianceKeys(p);
  const recommended = recommendedComplianceKeys(p);
  const byKey: Partial<Record<ComplianceKey, ComplianceItem>> = {};
  for (const it of items) byKey[it.requirement_key] = it;
  const missing = required.filter(k => !isItemSatisfied(byKey[k]));
  return {
    required, recommended, items: byKey, missing,
    complete: missing.length === 0,
    risk: assessEuRisk(p.product_type, p.name, p.country),
  };
}

/** Message d'erreur SQL COMPLIANCE_INCOMPLETE:a,b → liste de clés. */
export function parseComplianceError(message: string): ComplianceKey[] | null {
  const m = message.match(/COMPLIANCE_INCOMPLETE:([a-z_,]+)/);
  if (!m) return null;
  return m[1].split(',').filter(Boolean) as ComplianceKey[];
}

// -------------------- Accès données --------------------

export async function getComplianceItems(productId: string): Promise<ComplianceItem[]> {
  const { data } = await supabase.from('product_compliance_items')
    .select('*').eq('product_id', productId);
  return (data ?? []) as ComplianceItem[];
}

/** Valeurs saisies dans le formulaire produit (avant enregistrement). */
export interface DraftComplianceValues {
  key: ComplianceKey;
  value_text?: string;
  file_url?: string;
  confirmed?: boolean;
}

/** Un brouillon d'exigence est-il rempli ? Fonction PURE. */
export function isDraftFilled(meta: ComplianceRequirementMeta, v: DraftComplianceValues | undefined): boolean {
  if (!v) return false;
  if (meta.input === 'confirm') return v.confirmed === true;
  if (meta.input === 'file') return !!(v.file_url && v.file_url.length > 0);
  return !!(v.value_text && v.value_text.trim().length > 0);
}

/**
 * Enregistre (upsert) les items de conformité d'un produit à partir
 * des valeurs du formulaire, avec statut provided/missing dérivé.
 */
export async function saveComplianceItems(
  productId: string,
  p: ComplianceInput,
  values: DraftComplianceValues[],
): Promise<string | null> {
  const required = requiredComplianceKeys(p);
  const recommended = recommendedComplianceKeys(p);
  const byKey = new Map(values.map(v => [v.key, v]));
  const rows = [...required, ...recommended].map(key => {
    const meta = COMPLIANCE_META[key];
    const v = byKey.get(key);
    const filled = isDraftFilled(meta, v);
    return {
      product_id: productId,
      requirement_key: key,
      required: required.includes(key),
      status: filled ? 'provided' : 'missing',
      value_text: v?.value_text?.trim() || (meta.input === 'confirm' && v?.confirmed ? 'confirmé' : null),
      file_url: v?.file_url || null,
    };
  });
  const { error } = await supabase.from('product_compliance_items')
    .upsert(rows, { onConflict: 'product_id,requirement_key' });
  return error?.message ?? null;
}

/**
 * Tente de publier le produit (draft → active). Le verrou SQL fait foi.
 * Retourne { ok } ou la liste des exigences manquantes.
 */
export async function tryActivateProduct(productId: string): Promise<{
  ok: boolean; missing: ComplianceKey[]; error: string | null;
}> {
  const { error } = await supabase.from('products')
    .update({ status: 'active' }).eq('id', productId);
  if (!error) return { ok: true, missing: [], error: null };
  const missing = parseComplianceError(error.message);
  if (missing) return { ok: false, missing, error: null };
  return { ok: false, missing: [], error: error.message };
}
