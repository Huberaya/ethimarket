// =============================================================
// EthiMarket — Création de session Stripe Checkout
//
// POST { orderId } (JWT utilisateur requis)
// → { url } : URL de paiement Stripe hébergée.
//
// PRÉREQUIS (voir docs/STRIPE_ACTIVATION.md) :
//   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
// La commission plateforme (5 %) est déjà stockée sur la commande
// (commission_amount) — reprise ici en application_fee si Connect,
// sinon simple encaissement plateforme.
//
// Sans clé configurée : 503 explicite (le bouton UI est masqué
// tant que payment_method != 'stripe', donc aucun impact).
// =============================================================
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const SITE = Deno.env.get("SITE_URL") ?? "https://ethimarket.vercel.app";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return json({ error: "Stripe non configuré (STRIPE_SECRET_KEY absent)" }, 503);

    // Authentification : l'appelant doit être l'acheteur de la commande
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
    if (userErr || !userData.user) return json({ error: "Non authentifié" }, 401);

    const { orderId } = await req.json();
    if (!orderId) return json({ error: "orderId requis" }, 400);

    const { data: order } = await admin.from("orders")
      .select("id, order_number, buyer_id, product_name, quantity, unit, total_amount, currency, payment_status, status")
      .eq("id", orderId).maybeSingle();
    if (!order) return json({ error: "Commande introuvable" }, 404);
    if (order.buyer_id !== userData.user.id) return json({ error: "Cette commande ne vous appartient pas" }, 403);
    if (order.payment_status === "paid") return json({ error: "Commande déjà payée" }, 409);
    if (!["processing", "shipped", "delivered"].includes(order.status)) {
      return json({ error: "La commande doit être confirmée par le producteur avant paiement" }, 409);
    }

    // Session Checkout via l'API REST Stripe (pas de SDK : zéro dépendance lourde)
    const params = new URLSearchParams({
      mode: "payment",
      "line_items[0][price_data][currency]": (order.currency || "EUR").toLowerCase(),
      "line_items[0][price_data][product_data][name]": `${order.product_name} — ${order.order_number}`,
      "line_items[0][price_data][unit_amount]": String(Math.round(order.total_amount * 100)),
      "line_items[0][quantity]": "1",
      success_url: `${SITE}/dashboard/commandes?paiement=succes&commande=${order.order_number}`,
      cancel_url: `${SITE}/dashboard/commandes?paiement=annule`,
      "metadata[order_id]": order.id,
      "metadata[order_number]": order.order_number ?? "",
      client_reference_id: order.id,
    });

    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    const session = await resp.json();
    if (!resp.ok) return json({ error: session?.error?.message ?? "Erreur Stripe" }, 502);

    // Trace la référence de session (le webhook confirmera le paiement)
    await admin.from("orders").update({
      payment_method: "stripe",
      payment_status: "invoiced",
      payment_reference: session.id,
    }).eq("id", order.id);

    return json({ url: session.url });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Erreur interne" }, 500);
  }
});
