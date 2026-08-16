// =============================================================
// EthiMarket — Rédaction IA GRATUITE de la recommandation d'achat
// (optionnelle). Fournisseurs gratuits : Groq, Gemini free tier,
// Ollama local. Sans clé configurée ou en cas d'échec : la
// justification LOCALE du moteur est conservée telle quelle.
// Coût de fonctionnement : 0 €.
// =============================================================

import { ComparisonAnalysis, ProcurementRecommendation } from './procurementComparator';

const TIMEOUT_MS = 4000;

function readEnv(key: string): string | undefined {
  try {
    const env = (import.meta as unknown as { env?: Record<string, string> }).env;
    if (env?.[key]) return env[key];
  } catch { /* non-vite */ }
  return undefined;
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function buildPrompt(analysis: ComparisonAnalysis): string {
  const lines = analysis.scorecards.map(s =>
    `- ${s.product.name} : prix ${s.product.price} ${s.product.currency || '€'}, responsabilité ${s.responsibilityScore}/100, traçabilité ${s.traceabilityScore}/100, certifications ${s.certificationScore}/100, risque ${s.riskLevel}, forces: ${s.strengths.join('; ') || 'aucune'}, faiblesses: ${s.weaknesses.join('; ') || 'aucune'}`,
  );
  return `Tu es l'assistant achats responsables d'EthiMarket. À partir de ce comparatif, rédige en français une justification d'achat destinée à un responsable achats qui doit défendre sa décision devant sa direction financière.
Produits comparés :
${lines.join('\n')}
Produit recommandé par le moteur : ${analysis.recommendation?.recommended.product.name}.
Réponds UNIQUEMENT en JSON valide, sans markdown : {"justification": ["paragraphe 1", "paragraphe 2", "paragraphe 3"], "buyerNote": "phrase synthétique pour la direction, mentionnant le surcoût éventuel comme prime d'assurance conformité"}.
Contraintes : factuel, chiffré (cite les scores et écarts de prix en %), professionnel, 3 paragraphes maximum, pas d'invention de données.`;
}

async function callGroq(prompt: string, apiKey: string): Promise<string> {
  const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant', temperature: 0.2, max_tokens: 700,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 700, responseMimeType: 'application/json' },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function callOllama(prompt: string, baseUrl: string): Promise<string> {
  const res = await fetchWithTimeout(`${baseUrl.replace(/\/$/, '')}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2:3b', stream: false, format: 'json',
      options: { temperature: 0.2 },
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Ollama ${res.status}`);
  const data = await res.json();
  return data.message?.content ?? '';
}

/**
 * Tente de raffiner la recommandation via une IA gratuite.
 * Retourne la recommandation ENRICHIE, ou l'originale si aucune clé /
 * échec / réponse invalide (dégradation transparente, jamais bloquant).
 */
export async function enhanceRecommendationWithFreeAi(
  analysis: ComparisonAnalysis,
): Promise<{ recommendation: ProcurementRecommendation; aiUsed: 'groq' | 'gemini' | 'ollama' | 'local' }> {
  const base = analysis.recommendation;
  if (!base) throw new Error('Aucune recommandation à enrichir');

  const groq = readEnv('VITE_GROQ_API_KEY');
  const gemini = readEnv('VITE_GEMINI_API_KEY');
  const ollama = readEnv('VITE_OLLAMA_URL');
  if (!groq && !gemini && !ollama) return { recommendation: base, aiUsed: 'local' };

  try {
    const prompt = buildPrompt(analysis);
    let raw = '';
    let aiUsed: 'groq' | 'gemini' | 'ollama' = 'groq';
    if (groq) { raw = await callGroq(prompt, groq); aiUsed = 'groq'; }
    else if (gemini) { raw = await callGemini(prompt, gemini); aiUsed = 'gemini'; }
    else if (ollama) { raw = await callOllama(prompt, ollama); aiUsed = 'ollama'; }

    const parsed = JSON.parse(raw.replace(/^```(?:json)?/m, '').replace(/```$/m, '').trim()) as {
      justification?: string[]; buyerNote?: string;
    };
    if (!Array.isArray(parsed.justification) || parsed.justification.length === 0) {
      return { recommendation: base, aiUsed: 'local' };
    }
    return {
      recommendation: {
        ...base,
        justification: parsed.justification.filter(p => typeof p === 'string' && p.length > 20),
        buyerNote: typeof parsed.buyerNote === 'string' && parsed.buyerNote.length > 20 ? parsed.buyerNote : base.buyerNote,
        engineVersion: `${base.engineVersion} + rédaction IA gratuite (${aiUsed})`,
      },
      aiUsed,
    };
  } catch {
    return { recommendation: base, aiUsed: 'local' };
  }
}
