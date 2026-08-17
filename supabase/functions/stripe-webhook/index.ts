// =============================================================
// EthiMarket — Webhook Stripe → mise à jour du paiement
//
// À configurer dans le Dashboard Stripe : endpoint
//   https://<project>.supabase.co/functions/v1/stripe-webhook
// événement : checkout.session.completed
// PRÉREQUIS :
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
//   (déployer avec --no-verify-jwt : Stripe n'a pas de JWT Supabase)
//
// Vérification de signature HMAC-SHA256 manuelle (format
// Stripe-Signature: t=...,v1=...) — zéro dépendance SDK.
// =============================================================
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function verifyStripeSignature(payload: string, header: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(header.split(",").map(p => p.split("=") as [string, string]));
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;
  // Tolérance 5 min contre le rejeu
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`));
  const expected = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, "0")).join("");
  // Comparaison temps constant
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) return new Response("Webhook non configuré", { status: 503 });

  const payload = await req.text();
  const sigHeader = req.headers.get("Stripe-Signature") ?? "";
  if (!(await verifyStripeSignature(payload, sigHeader, secret))) {
    return new Response("Signature invalide", { status: 400 });
  }

  const event = JSON.parse(payload);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.order_id ?? session.client_reference_id;
    if (orderId) {
      await admin.from("orders").update({
        payment_status: "paid",
        payment_reference: session.payment_intent ?? session.id,
      }).eq("id", orderId).neq("payment_status", "paid");
      // paid_at est posé automatiquement par le trigger trg_order_paid_at
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
