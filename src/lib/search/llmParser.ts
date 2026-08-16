// =============================================================
// EthiMarket Search V2 — Couche 2 : Parser LLM gratuit (optionnel)
// Fournisseurs : Groq (gratuit), Gemini Flash (gratuit), Ollama (local).
// Timeout 2500 ms → dégradation transparente vers le parser zéro-API.
// Le LLM ne génère JAMAIS de texte libre : uniquement du JSON contraint.
// =============================================================

import { ParsedQueryV2 } from './types';
import { parseQueryZeroApi } from './zeroApiParser';

const LLM_TIMEOUT_MS = 2500;

const SYSTEM_PROMPT = `Tu es le module de compréhension de requêtes d'EthiMarket, une marketplace de produits éthiques. Tu reçois une requête utilisateur en langage naturel (français, anglais ou espagnol) et tu réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans commentaire, conforme EXACTEMENT à ce schéma (omets les clés inconnues plutôt que d'inventer) :
{"intent":"standard_search"|"alternative_search"|"comparison_search","referenceSupplier":string,"referenceProduct":string,"productType":string,"gender":"homme"|"femme"|"enfant"|"bebe"|"unisexe","materials":string[],"certifications":string[],"originCountries":string[],"manufacturingCountries":string[],"rawMaterialCountries":string[],"regions":string[],"maxDistanceKm":number,"minPrice":number,"maxPrice":number,"currency":"EUR"|"USD"|"GBP","maxMoq":number,"maxCarbonKg":number,"maxDeliveryDays":number,"minRecycledPercent":number,"minTrustScore":number,"flags":{"vegan":bool,"recycled":bool,"fairTrade":bool,"livingWage":bool,"socialConditions":bool,"organicOnly":bool,"fullTraceability":bool,"plasticFreePackaging":bool,"compostablePackaging":bool,"recyclablePackaging":bool,"bulkPackaging":bool,"cooperative":bool},"priorities":{"cheaper":bool,"lowerCarbon":bool,"betterTraceability":bool,"fasterDelivery":bool,"higherTrust":bool},"freeTextKeywords":string[]}
RÈGLES : "moins cher"/"meilleure traçabilité"/"plus écolo" sont des PRIORITÉS de classement, pas des filtres. "bio" seul → certifications:["Bio"] ET flags.organicOnly:true. Distingue : "t-shirt du Portugal" → originCountries ; "fabriqué au Portugal" → manufacturingCountries ; "en coton d'Inde" → rawMaterialCountries. Convertis les nombres en chiffres. Ne devine jamais un critère absent.
EXEMPLE 1 — "T-shirt coton bio homme, moins de 15 €, Europe" → {"intent":"standard_search","productType":"t-shirt","gender":"homme","materials":["coton"],"certifications":["Bio"],"regions":["Europe"],"maxPrice":15,"currency":"EUR","flags":{"organicOnly":true},"freeTextKeywords":[]}
EXEMPLE 2 — "Trouve-moi une alternative au fournisseur X qui coûte moins cher mais avec une meilleure traçabilité." → {"intent":"alternative_search","referenceSupplier":"X","priorities":{"cheaper":true,"betterTraceability":true},"freeTextKeywords":[]}`;

interface LlmConfig {
  provider: 'groq' | 'gemini' | 'ollama' | 'none';
  apiKey?: string;
  ollamaUrl?: string;
}

function readEnv(key: string): string | undefined {
  try {
    // Vite
    const viteEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    if (viteEnv?.[key]) return viteEnv[key];
  } catch { /* not vite */ }
  const proc = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process;
  if (proc?.env?.[key]) return proc.env[key];
  return undefined;
}

export function detectLlmConfig(): LlmConfig {
  const groq = readEnv('VITE_GROQ_API_KEY');
  if (groq) return { provider: 'groq', apiKey: groq };
  const gemini = readEnv('VITE_GEMINI_API_KEY');
  if (gemini) return { provider: 'gemini', apiKey: gemini };
  const ollama = readEnv('VITE_OLLAMA_URL');
  if (ollama) return { provider: 'ollama', ollamaUrl: ollama };
  return { provider: 'none' };
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function callGroq(query: string, apiKey: string): Promise<string> {
  const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      temperature: 0,
      max_tokens: 600,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

async function callGemini(query: string, apiKey: string): Promise<string> {
  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: query }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 600, responseMimeType: 'application/json' },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function callOllama(query: string, baseUrl: string): Promise<string> {
  const res = await fetchWithTimeout(`${baseUrl.replace(/\/$/, '')}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2:3b',
      stream: false,
      format: 'json',
      options: { temperature: 0 },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
  const data = await res.json();
  return data.message?.content ?? '';
}

/** Fusionne la sortie LLM avec le parse zéro-API.
 * Règle : le zéro-API garde priorité sur les valeurs numériques qu'il a extraites
 * (déterministe), le LLM complète tout le reste. */
export function mergeParses(base: ParsedQueryV2, llmRaw: Partial<ParsedQueryV2>): ParsedQueryV2 {
  const merged: ParsedQueryV2 = {
    ...base,
    intent: base.intent !== 'standard_search' ? base.intent : (llmRaw.intent ?? base.intent),
    referenceSupplier: base.referenceSupplier ?? llmRaw.referenceSupplier,
    referenceProduct: base.referenceProduct ?? llmRaw.referenceProduct,
    productType: base.productType ?? llmRaw.productType,
    gender: base.gender ?? llmRaw.gender,
    materials: Array.from(new Set([...base.materials, ...(llmRaw.materials ?? [])])),
    certifications: Array.from(new Set([...base.certifications, ...(llmRaw.certifications ?? [])])),
    originCountries: Array.from(new Set([...base.originCountries, ...(llmRaw.originCountries ?? [])])),
    manufacturingCountries: Array.from(new Set([...base.manufacturingCountries, ...(llmRaw.manufacturingCountries ?? [])])),
    rawMaterialCountries: Array.from(new Set([...base.rawMaterialCountries, ...(llmRaw.rawMaterialCountries ?? [])])),
    regions: Array.from(new Set([...base.regions, ...(llmRaw.regions ?? [])])),
    maxDistanceKm: base.maxDistanceKm ?? llmRaw.maxDistanceKm,
    minPrice: base.minPrice ?? llmRaw.minPrice,
    maxPrice: base.maxPrice ?? llmRaw.maxPrice,
    maxMoq: base.maxMoq ?? llmRaw.maxMoq,
    maxCarbonKg: base.maxCarbonKg ?? llmRaw.maxCarbonKg,
    maxDeliveryDays: base.maxDeliveryDays ?? llmRaw.maxDeliveryDays,
    minRecycledPercent: base.minRecycledPercent ?? llmRaw.minRecycledPercent,
    minTrustScore: base.minTrustScore ?? llmRaw.minTrustScore,
    flags: { ...base.flags },
    priorities: { ...base.priorities },
    freeTextKeywords: base.freeTextKeywords.length ? base.freeTextKeywords : (llmRaw.freeTextKeywords ?? []),
    confidence: Math.max(base.confidence, 0.85),
    parserSource: 'merged',
  };
  if (llmRaw.flags) {
    (Object.keys(merged.flags) as (keyof ParsedQueryV2['flags'])[]).forEach(k => {
      if (llmRaw.flags?.[k]) merged.flags[k] = true;
    });
  }
  if (llmRaw.priorities) {
    (Object.keys(merged.priorities) as (keyof ParsedQueryV2['priorities'])[]).forEach(k => {
      if (llmRaw.priorities?.[k]) merged.priorities[k] = true;
    });
  }
  return merged;
}

/**
 * Point d'entrée couche 1 + 2 : parse toujours en zéro-API,
 * enrichit avec le LLM gratuit si configuré et disponible.
 */
export async function parseQuerySmart(query: string): Promise<ParsedQueryV2> {
  const base = parseQueryZeroApi(query);
  const config = detectLlmConfig();
  if (config.provider === 'none' || !query.trim()) return base;

  try {
    let raw = '';
    if (config.provider === 'groq' && config.apiKey) raw = await callGroq(query, config.apiKey);
    else if (config.provider === 'gemini' && config.apiKey) raw = await callGemini(query, config.apiKey);
    else if (config.provider === 'ollama' && config.ollamaUrl) raw = await callOllama(query, config.ollamaUrl);

    const jsonText = raw.replace(/^```(?:json)?/m, '').replace(/```$/m, '').trim();
    const parsed = JSON.parse(jsonText) as Partial<ParsedQueryV2>;
    return mergeParses(base, parsed);
  } catch (err) {
    console.warn('[EthiMarket Search] LLM indisponible → fallback zéro-API', err);
    return base; // dégradation transparente
  }
}
