import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 2. Layer 2 NLP Parsing API endpoint
  app.post('/api/search/nlp-parse', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query string is required' });
      }

      const ai = getGenAI();
      if (!ai) {
        // Transparent fallback if no Gemini key
        return res.status(200).json({
          status: 'fallback_no_llm_key',
          message: 'Gemini API Key not set, using Layer 1 client engine'
        });
      }

      const prompt = `Tu es le module de compréhension de requêtes d'EthiMarket, une marketplace de
produits éthiques. Tu reçois une requête utilisateur en langage naturel (français,
anglais ou espagnol) et tu réponds UNIQUEMENT avec un objet JSON valide, sans
markdown, sans commentaire, conforme EXACTEMENT à ce schéma (omets les clés
inconnues plutôt que d'inventer) :

{
  "intent": "standard_search" | "alternative_search" | "comparison_search",
  "referenceSupplier": string,        // si "alternative au fournisseur X" → "X"
  "referenceProduct": string,         // si "alternative au miel Y" → "miel Y"
  "productType": string,              // canonique: "t-shirt", "café", "savon"...
  "gender": "homme"|"femme"|"enfant"|"bebe"|"unisexe",
  "materials": string[],              // ["coton", "lin"...]
  "certifications": string[],         // ["Bio","GOTS","Commerce Équitable"...]
  "originCountries": string[],        // pays du produit
  "manufacturingCountries": string[], // "fabriqué en/au X"
  "rawMaterialCountries": string[],   // "coton d'Inde" → ["Inde"]
  "regions": string[],                // ["Europe","Afrique","Local"...]
  "maxDistanceKm": number,            // "moins de 500 km" → 500
  "minPrice": number, "maxPrice": number, "currency": "EUR"|"USD"|"GBP",
  "maxMoq": number,
  "maxCarbonKg": number,              // "moins de 2 kg de CO2" → 2
  "maxDeliveryDays": number,          // "sous 7 jours" → 7
  "minRecycledPercent": number,       // "70% recyclé" → 70
  "minTrustScore": number,            // "score de confiance > 80" → 80
  "flags": {
    "vegan": bool, "recycled": bool, "fairTrade": bool, "livingWage": bool,
    "socialConditions": bool, "organicOnly": bool, "fullTraceability": bool,
    "plasticFreePackaging": bool, "compostablePackaging": bool,
    "recyclablePackaging": bool, "bulkPackaging": bool
  },
  "priorities": {                     // préférences de classement, PAS des filtres durs
    "cheaper": bool, "lowerCarbon": bool, "betterTraceability": bool,
    "fasterDelivery": bool, "higherTrust": bool
  },
  "freeTextKeywords": string[]        // mots résiduels utiles au matching texte
}

Requête à analyser :
"${query}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);

      return res.json(parsedData);
    } catch (err: unknown) {
      console.warn('[Server API] NLP Parsing Layer 2 error:', err);
      return res.status(500).json({ error: 'Layer 2 parsing failed, falling back to Layer 1' });
    }
  });

  // 3. Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EthiMarket fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
