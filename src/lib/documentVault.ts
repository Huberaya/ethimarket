// =============================================================
// EthiMarket — Coffre-fort documentaire intelligent
//
// L'acheteur dépose : certificats, audits, factures, fiches
// techniques, rapports ESG, questionnaires, analyses, documents
// réglementaires. L'analyse LOCALE (règles + regex, zéro API)
// extrait : certification → date → organisme → périmètre →
// produit → fournisseur → expiration.
// Et surtout : 🔴 « Information manquante » champ par champ.
// =============================================================

import { supabase } from './supabase';

export type VaultDocType =
  | 'certificate' | 'audit' | 'invoice' | 'datasheet'
  | 'esg_report' | 'questionnaire' | 'analysis' | 'regulatory' | 'other';

export const DOC_TYPE_LABELS: Record<VaultDocType, { emoji: string; label: string }> = {
  certificate: { emoji: '🏷️', label: 'Certificat' },
  audit: { emoji: '🕵️', label: 'Rapport d\'audit' },
  invoice: { emoji: '🧾', label: 'Facture' },
  datasheet: { emoji: '📋', label: 'Fiche technique' },
  esg_report: { emoji: '🌱', label: 'Rapport ESG' },
  questionnaire: { emoji: '❓', label: 'Questionnaire fournisseur' },
  analysis: { emoji: '🔬', label: 'Analyse laboratoire' },
  regulatory: { emoji: '⚖️', label: 'Document réglementaire' },
  other: { emoji: '📄', label: 'Autre' },
};

export interface ExtractedField {
  key: 'certification_name' | 'reference_number' | 'issuing_body' | 'issue_date'
     | 'expiry_date' | 'scope' | 'product' | 'supplier';
  label: string;
  value: string | null;          // null = 🔴 Information manquante
  confidence: 'high' | 'medium' | 'low';
}

export interface DocumentAnalysis {
  docType: VaultDocType;
  detectedTypeConfidence: 'high' | 'medium' | 'low';
  fields: ExtractedField[];
  missingFields: string[];       // labels des champs manquants
  completenessPct: number;       // 0-100
  warnings: string[];            // dont expiration passée/proche
}

export interface VaultDocument {
  id: string;
  file_name: string;
  doc_type: VaultDocType;
  storage_path?: string;
  analysis: DocumentAnalysis;
  created_at: string;
}

// -------------------------------------------------------------
// Détection du type de document (fonction PURE)
// -------------------------------------------------------------

const TYPE_SIGNALS: [VaultDocType, RegExp][] = [
  ['certificate', /certificat|certificate|attestation\s+de\s+certification|scope\s+certificate/i],
  ['audit', /rapport\s+d.audit|audit\s+report|sa\s*8000|bsci|smeta|sedex/i],
  ['invoice', /facture|invoice|montant\s+ttc|total\s+ht|n°\s*de\s*facture/i],
  ['esg_report', /rapport\s+(?:esg|rse|d[ée]veloppement\s+durable)|esg\s+report|csrd|bilan\s+carbone/i],
  ['analysis', /rapport\s+d.analyse|bulletin\s+d.analyse|laboratoire|r[ée]sultats?\s+d.analyse/i],
  ['questionnaire', /questionnaire|auto-?[ée]valuation|self-?assessment/i],
  ['regulatory', /r[èe]glement|directive|d[ée]claration\s+douani[èe]re|conformit[ée]\s+r[ée]glementaire|reach|eudr/i],
  ['datasheet', /fiche\s+technique|technical\s+(?:data\s*)?sheet|sp[ée]cifications/i],
];

export function detectDocType(fileName: string, textContent: string): { type: VaultDocType; confidence: 'high' | 'medium' | 'low' } {
  const haystack = `${fileName} ${textContent.slice(0, 3000)}`;
  for (const [type, re] of TYPE_SIGNALS) {
    if (re.test(haystack)) {
      // confiance haute si trouvé dans le contenu, moyenne si seulement dans le nom
      return { type, confidence: re.test(textContent.slice(0, 3000)) ? 'high' : 'medium' };
    }
  }
  return { type: 'other', confidence: 'low' };
}

// -------------------------------------------------------------
// Extraction des champs (fonction PURE — règles + regex FR/EN)
// -------------------------------------------------------------

const KNOWN_BODIES = [
  'Ecocert', 'FLO-CERT', 'FLOCERT', 'Control Union', 'Bureau Veritas', 'AFNOR',
  'Rainforest Alliance', 'Fairtrade International', 'Kiwa BCS', 'Ceres', 'Demeter',
  'B Lab', 'Africert', 'Certimex', 'IMO Control', 'TÜV', 'SGS', 'Intertek',
  'Soil Association', 'Naturland', 'USDA', 'Lacon', 'Onecert', 'Letis',
];

const KNOWN_STANDARDS = [
  'GOTS', 'OEKO-TEX', 'Bio UE', 'EU Organic', 'Agriculture Biologique', 'AB',
  'Fairtrade', 'Fair for Life', 'Rainforest Alliance', 'UTZ', 'Demeter', 'GRS',
  'RWS', 'FSC', 'PEFC', 'SA8000', 'BSCI', 'B Corp', 'Cradle to Cradle',
  'EU Ecolabel', 'Bio Suisse', 'JAS', 'USDA Organic', 'HVE', 'GlobalG.A.P',
];

const MONTHS_FR: Record<string, string> = {
  janvier: '01', février: '02', fevrier: '02', mars: '03', avril: '04', mai: '05',
  juin: '06', juillet: '07', août: '08', aout: '08', septembre: '09',
  octobre: '10', novembre: '11', décembre: '12', decembre: '12',
};

/** Normalise une date trouvée en ISO (yyyy-mm-dd) ou null. */
export function normalizeDate(raw: string): string | null {
  // 12/03/2027 ou 12-03-2027
  let m = raw.match(/(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  // 2027-03-12
  m = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  // 12 mars 2027
  m = raw.match(/(\d{1,2})(?:er)?\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)\s+(\d{4})/i);
  if (m) return `${m[3]}-${MONTHS_FR[m[2].toLowerCase()]}-${m[1].padStart(2, '0')}`;
  return null;
}

export function extractFields(textContent: string, fileName = ''): ExtractedField[] {
  const text = textContent.slice(0, 20000);
  const fields: ExtractedField[] = [];
  const push = (key: ExtractedField['key'], label: string, value: string | null, confidence: ExtractedField['confidence'] = 'medium') =>
    fields.push({ key, label, value, confidence });

  // Certification / standard
  const std = KNOWN_STANDARDS.find(s => new RegExp(`(?:^|[^A-Za-z])${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[^A-Za-z]|$)`, 'i').test(text) || fileName.toLowerCase().includes(s.toLowerCase()));
  push('certification_name', 'Certification / référentiel', std ?? null, std ? 'high' : 'low');

  // Numéro de certificat : motifs courants (XX-YYYY-NNNN, n° : ..., certificate no ...)
  const refMatch =
    text.match(/(?:certificat|certificate|licen[cs]e|cert)\.?\s*(?:n[°o]|no|number|#)\s*[:.]?\s*([A-Z0-9][A-Z0-9\-/.]{4,25})/i) ||
    text.match(/\b([A-Z]{2,6}-(?:BIO|ORG|ID|CERT)?-?\d{2,4}-\d{3,6})\b/) ||
    text.match(/\b([A-Z]{2,4}\d{5,10})\b/);
  push('reference_number', 'Numéro de certificat', refMatch ? refMatch[1] : null, refMatch ? 'high' : 'low');

  // Organisme émetteur
  const body = KNOWN_BODIES.find(b => text.toLowerCase().includes(b.toLowerCase()));
  push('issuing_body', 'Organisme émetteur', body ?? null, body ? 'high' : 'low');

  // Dates : émission & expiration
  const expiryMatch =
    text.match(/(?:valide?\s+jusqu.au|valid\s+until|expir(?:e|y|ation)\s*(?:date|le)?|date\s+d.expiration|jusqu.au)\s*[:.]?\s*([\d/\-. ]{6,20}|\d{1,2}(?:er)?\s+\w+\s+\d{4})/i);
  const expiry = expiryMatch ? normalizeDate(expiryMatch[1]) : null;
  push('expiry_date', 'Date d\'expiration', expiry, expiry ? 'high' : 'low');

  const issueMatch =
    text.match(/(?:d[ée]livr[ée]\s+le|issued?\s+(?:on|date)|date\s+d.[ée]mission|[ée]mis\s+le|fait\s+le)\s*[:.]?\s*([\d/\-. ]{6,20}|\d{1,2}(?:er)?\s+\w+\s+\d{4})/i);
  const issue = issueMatch ? normalizeDate(issueMatch[1]) : null;
  push('issue_date', 'Date d\'émission', issue, issue ? 'high' : 'low');

  // Périmètre / scope
  const scopeMatch = text.match(/(?:p[ée]rim[èe]tre|scope|champ\s+d.application|couvre|applies\s+to)\s*[:.]?\s*([^\n.;]{10,120})/i);
  push('scope', 'Périmètre couvert', scopeMatch ? scopeMatch[1].trim() : null, scopeMatch ? 'medium' : 'low');

  // Produit
  const productMatch = text.match(/(?:produits?\s*(?:concern[ée]s?|couverts?)?|products?\s*(?:covered)?)\s*[:.]\s*([^\n.;]{4,80})/i);
  push('product', 'Produit(s) concerné(s)', productMatch ? productMatch[1].trim() : null, productMatch ? 'medium' : 'low');

  // Fournisseur / titulaire
  const supplierMatch =
    text.match(/(?:titulaire|holder|b[ée]n[ée]ficiaire|d[ée]livr[ée]\s+[àa]|issued\s+to|op[ée]rateur|operator)\s*[:.]?\s*([A-ZÀ-Ý][^\n.;,]{3,60})/i);
  push('supplier', 'Fournisseur / titulaire', supplierMatch ? supplierMatch[1].trim() : null, supplierMatch ? 'medium' : 'low');

  return fields;
}

/** Analyse complète (fonction PURE). */
export function analyzeDocument(fileName: string, textContent: string, now = new Date()): DocumentAnalysis {
  const { type, confidence } = detectDocType(fileName, textContent);
  const fields = extractFields(textContent, fileName);

  // Champs requis selon le type
  const REQUIRED: Partial<Record<VaultDocType, ExtractedField['key'][]>> = {
    certificate: ['certification_name', 'reference_number', 'issuing_body', 'expiry_date', 'supplier'],
    audit: ['issuing_body', 'issue_date', 'supplier', 'scope'],
    analysis: ['issue_date', 'product'],
    esg_report: ['issue_date', 'supplier'],
  };
  const required = REQUIRED[type] ?? ['issue_date', 'supplier'];
  const missing = fields.filter(f => required.includes(f.key) && !f.value).map(f => f.label);
  const filled = required.filter(k => fields.find(f => f.key === k)?.value).length;
  const completeness = required.length > 0 ? Math.round((filled / required.length) * 100) : 100;

  const warnings: string[] = [];
  const expiry = fields.find(f => f.key === 'expiry_date')?.value;
  if (expiry) {
    const days = Math.floor((new Date(expiry).getTime() - now.getTime()) / (24 * 3600 * 1000));
    if (days < 0) warnings.push(`⚠️ Ce document a EXPIRÉ le ${expiry.split('-').reverse().join('/')}.`);
    else if (days <= 30) warnings.push(`⚠️ Ce document expire dans ${days} jour${days > 1 ? 's' : ''}.`);
  }
  missing.forEach(m => warnings.push(`🔴 Information manquante : ${m}.`));

  return {
    docType: type,
    detectedTypeConfidence: confidence,
    fields,
    missingFields: missing,
    completenessPct: completeness,
    warnings,
  };
}

// -------------------------------------------------------------
// Persistance
// -------------------------------------------------------------

export async function saveVaultDocument(
  userId: string,
  input: { fileName: string; textContent: string; storagePath?: string },
): Promise<{ doc: VaultDocument | null; error: string | null }> {
  const analysis = analyzeDocument(input.fileName, input.textContent);
  const { data, error } = await supabase.from('buyer_documents').insert({
    user_id: userId,
    file_name: input.fileName,
    doc_type: analysis.docType,
    storage_path: input.storagePath ?? null,
    extracted_fields: analysis.fields,
    missing_fields: analysis.missingFields,
    completeness_pct: analysis.completenessPct,
    warnings: analysis.warnings,
  }).select('id, created_at').maybeSingle();
  if (error) return { doc: null, error: error.message };
  return {
    doc: {
      id: data?.id ?? '', file_name: input.fileName, doc_type: analysis.docType,
      storage_path: input.storagePath, analysis, created_at: data?.created_at ?? new Date().toISOString(),
    },
    error: null,
  };
}

export async function getVaultDocuments(userId: string): Promise<VaultDocument[]> {
  const { data } = await supabase
    .from('buyer_documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  interface Row {
    id: string; file_name: string; doc_type: VaultDocType; storage_path: string | null;
    extracted_fields: ExtractedField[]; missing_fields: string[];
    completeness_pct: number; warnings: string[]; created_at: string;
  }
  return ((data ?? []) as Row[]).map(r => ({
    id: r.id, file_name: r.file_name, doc_type: r.doc_type,
    storage_path: r.storage_path ?? undefined,
    analysis: {
      docType: r.doc_type, detectedTypeConfidence: 'high',
      fields: r.extracted_fields ?? [], missingFields: r.missing_fields ?? [],
      completenessPct: r.completeness_pct ?? 0, warnings: r.warnings ?? [],
    },
    created_at: r.created_at,
  }));
}
