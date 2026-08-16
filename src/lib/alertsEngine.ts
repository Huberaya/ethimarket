// =============================================================
// EthiMarket — Moteur d'alertes proactives de l'acheteur
//
// 🔴 ALERTE FOURNISSEUR : certification qui expire, fournisseur
//    suivi passé « à risque », allégation contredite
// 🟠 NOUVEAU RISQUE : information contradictoire détectée dans le
//    Trust Center d'un produit suivi/acheté
// 🟢 OPPORTUNITÉ : alternative moins chère à score supérieur
//    détectée pour un produit approuvé
// 🔵 RÉÉVALUATION : fournisseur non réévalué depuis 90 jours
//
// Les alertes sont CALCULÉES à la volée à partir des données réelles
// (zéro API payante), puis persistées dans buyer_alerts pour le
// suivi lu/non-lu. Ré-exécutable sans doublons (clé de dédup).
// =============================================================

import { supabase, Product } from './supabase';
import { computeScorecards } from './procurementComparator';

export type AlertKind = 'supplier' | 'risk' | 'opportunity' | 'reevaluation' | 'document';
export type AlertSeverity = 'red' | 'orange' | 'green' | 'blue';

export interface BuyerAlert {
  id?: string;
  dedupe_key: string;
  kind: AlertKind;
  severity: AlertSeverity;
  title: string;
  message: string;
  product_id?: string;
  producer_id?: string;
  action_url?: string;
  is_read?: boolean;
  created_at?: string;
}

const DAY_MS = 24 * 3600 * 1000;

function fmtFr(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

// -------------------------------------------------------------
// Générateurs d'alertes (fonctions PURES, testables)
// -------------------------------------------------------------

export interface ClaimForAlert {
  product_id: string;
  product_name: string;
  product_slug?: string;
  claim_label: string;
  verification_status: string;
  valid_until?: string;
}

/** 🔴 Certifications qui expirent sous `windowDays` jours + expirées + contredites. */
export function alertsFromClaims(claims: ClaimForAlert[], windowDays = 30, now = new Date()): BuyerAlert[] {
  const out: BuyerAlert[] = [];
  for (const c of claims) {
    if (c.verification_status === 'verified' && c.valid_until) {
      const days = Math.floor((new Date(c.valid_until).getTime() - now.getTime()) / DAY_MS);
      if (days >= 0 && days <= windowDays) {
        out.push({
          dedupe_key: `cert-expiring:${c.product_id}:${c.claim_label}:${c.valid_until}`,
          kind: 'supplier', severity: 'red',
          title: '🔴 ALERTE FOURNISSEUR',
          message: `La certification « ${c.claim_label} » de ${c.product_name} arrive à expiration dans ${days} jour${days > 1 ? 's' : ''} (le ${fmtFr(c.valid_until)}).`,
          product_id: c.product_id,
          action_url: c.product_slug ? `/produits/${c.product_slug}` : undefined,
        });
      }
    }
    if (c.verification_status === 'expired') {
      out.push({
        dedupe_key: `cert-expired:${c.product_id}:${c.claim_label}`,
        kind: 'supplier', severity: 'red',
        title: '🔴 ALERTE FOURNISSEUR',
        message: `La certification « ${c.claim_label} » de ${c.product_name} a expiré et n'a pas été renouvelée.`,
        product_id: c.product_id,
        action_url: c.product_slug ? `/produits/${c.product_slug}` : undefined,
      });
    }
    if (c.verification_status === 'contradicted') {
      out.push({
        dedupe_key: `claim-contradicted:${c.product_id}:${c.claim_label}`,
        kind: 'risk', severity: 'orange',
        title: '🟠 NOUVEAU RISQUE',
        message: `Une information contradictoire concernant « ${c.claim_label} » (${c.product_name}) vient d'être détectée : l'allégation n'a pas été confirmée lors du contrôle indépendant.`,
        product_id: c.product_id,
        action_url: c.product_slug ? `/produits/${c.product_slug}` : undefined,
      });
    }
  }
  return out;
}

/** 🟢 Opportunités : alternative moins chère ET mieux scorée pour un produit approuvé. */
export function alertsFromOpportunities(
  approvedProducts: Product[],
  catalog: Product[],
): BuyerAlert[] {
  const out: BuyerAlert[] = [];
  for (const ref of approvedProducts) {
    const family = catalog.filter(p =>
      p.id !== ref.id &&
      (p.product_type && ref.product_type
        ? p.product_type.toLowerCase() === ref.product_type.toLowerCase()
        : p.category_id === ref.category_id));
    if (family.length === 0) continue;

    const cards = computeScorecards([ref, ...family]);
    const refCard = cards.find(c => c.product.id === ref.id);
    if (!refCard) continue;

    for (const cand of cards) {
      if (cand.product.id === ref.id) continue;
      const cheaperPct = ref.price > 0 ? Math.round(((ref.price - cand.product.price) / ref.price) * 100) : 0;
      if (cheaperPct >= 5 && cand.overallScore > refCard.overallScore) {
        out.push({
          dedupe_key: `opportunity:${ref.id}:${cand.product.id}`,
          kind: 'opportunity', severity: 'green',
          title: '🟢 OPPORTUNITÉ',
          message: `Une alternative ${cheaperPct}% moins chère avec un score responsable supérieur (${cand.overallScore}/100 contre ${refCard.overallScore}/100) vient d'être identifiée pour ${ref.name} : ${cand.product.name}.`,
          product_id: cand.product.id,
          action_url: cand.product.slug ? `/produits/${cand.product.slug}` : undefined,
        });
        break; // une opportunité max par produit approuvé
      }
    }
  }
  return out;
}

/** 🔵 Fournisseurs suivis non réévalués depuis `staleDays` jours, ou marqués à risque. */
export function alertsFromSuppliers(
  suppliers: { producer_id: string; status: string; updated_at: string; producer_name?: string }[],
  staleDays = 90,
  now = new Date(),
): BuyerAlert[] {
  const out: BuyerAlert[] = [];
  for (const s of suppliers) {
    if (s.status === 'at_risk') {
      out.push({
        dedupe_key: `supplier-at-risk:${s.producer_id}`,
        kind: 'risk', severity: 'orange',
        title: '🟠 NOUVEAU RISQUE',
        message: `Le fournisseur ${s.producer_name ?? ''} est classé « à risque » dans votre portefeuille. Une réévaluation est recommandée.`,
        producer_id: s.producer_id,
        action_url: '/dashboard/mes-achats?tab=suppliers',
      });
    }
    const ageDays = Math.floor((now.getTime() - new Date(s.updated_at).getTime()) / DAY_MS);
    if (['active', 'evaluating'].includes(s.status) && ageDays >= staleDays) {
      out.push({
        dedupe_key: `supplier-stale:${s.producer_id}:${Math.floor(ageDays / staleDays)}`,
        kind: 'reevaluation', severity: 'blue',
        title: '📊 RÉÉVALUATION REQUISE',
        message: `Le fournisseur ${s.producer_name ?? ''} n'a pas été réévalué depuis ${ageDays} jours.`,
        producer_id: s.producer_id,
        action_url: '/dashboard/mes-achats?tab=suppliers',
      });
    }
  }
  return out;
}

// -------------------------------------------------------------
// Orchestration : calcule, déduplique, persiste, retourne
// -------------------------------------------------------------

export async function refreshBuyerAlerts(userId: string): Promise<BuyerAlert[]> {
  try {
    // 1. Produits suivis (pour périmètre) + fournisseurs suivis
    const [{ data: trackedProducts }, { data: trackedSuppliers }] = await Promise.all([
      supabase.from('buyer_products').select('product_id, status, products(id, name, slug, product_type, category_id, price)').eq('user_id', userId),
      supabase.from('buyer_suppliers').select('producer_id, status, updated_at, producers(name)').eq('user_id', userId),
    ]);

    interface TP { product_id: string; status: string; products: Product | null }
    interface TS { producer_id: string; status: string; updated_at: string; producers: { name: string } | null }
    const tps = (trackedProducts ?? []) as unknown as TP[];
    const tss = (trackedSuppliers ?? []) as unknown as TS[];

    const scopedProductIds = tps.map(t => t.product_id);

    // 2. Claims du périmètre (ou de tous les produits si rien de suivi — découverte)
    let claimQuery = supabase
      .from('product_claims')
      .select('product_id, claim_label, verification_status, products(name, slug), claim_evidence(valid_until)');
    if (scopedProductIds.length > 0) claimQuery = claimQuery.in('product_id', scopedProductIds);
    const { data: claimRows } = await claimQuery;

    interface CR {
      product_id: string; claim_label: string; verification_status: string;
      products: { name: string; slug: string } | null;
      claim_evidence: { valid_until: string | null }[] | null;
    }
    const claims: ClaimForAlert[] = ((claimRows ?? []) as unknown as CR[]).map(r => ({
      product_id: r.product_id,
      product_name: r.products?.name ?? 'Produit',
      product_slug: r.products?.slug,
      claim_label: r.claim_label,
      verification_status: r.verification_status,
      valid_until: r.claim_evidence?.find(e => e.valid_until)?.valid_until ?? undefined,
    }));

    // 3. Opportunités sur les produits approuvés
    const approved = tps.filter(t => t.status === 'approved' && t.products).map(t => t.products as Product);
    let catalog: Product[] = [];
    if (approved.length > 0) {
      const { data: cat } = await supabase.from('products').select('*').eq('status', 'active').limit(100);
      catalog = (cat ?? []) as Product[];
    }

    // 4. Générer toutes les alertes
    const generated = [
      ...alertsFromClaims(claims),
      ...alertsFromOpportunities(approved, catalog),
      ...alertsFromSuppliers(tss.map(s => ({
        producer_id: s.producer_id, status: s.status, updated_at: s.updated_at,
        producer_name: s.producers?.name,
      }))),
    ];

    // 5. Persister sans doublons (upsert sur dedupe_key)
    if (generated.length > 0) {
      await supabase.from('buyer_alerts').upsert(
        generated.map(a => ({
          user_id: userId,
          dedupe_key: a.dedupe_key,
          kind: a.kind,
          severity: a.severity,
          title: a.title,
          message: a.message,
          product_id: a.product_id ?? null,
          producer_id: a.producer_id ?? null,
          action_url: a.action_url ?? null,
        })),
        { onConflict: 'user_id,dedupe_key', ignoreDuplicates: true },
      );
    }

    // 6. Retourner les alertes non lues
    const { data: alerts } = await supabase
      .from('buyer_alerts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(50);
    return (alerts ?? []) as BuyerAlert[];
  } catch {
    return [];
  }
}

export async function markAlertRead(alertId: string): Promise<void> {
  await supabase.from('buyer_alerts').update({ is_read: true }).eq('id', alertId);
}

export async function markAllAlertsRead(userId: string): Promise<void> {
  await supabase.from('buyer_alerts').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
}
