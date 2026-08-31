/**
 * Vertex AI proxy client.
 *
 * Uses the shared Vertex proxy instead of the @google/generative-ai SDK.
 * The proxy is a pass-through: whatever JSON we POST goes verbatim to Vertex's
 * generateContent endpoint and the raw response comes back unchanged.
 *
 * Proxy docs: POST https://vertex-proxy-1065088246231.us-central1.run.app/generate
 *   Header: X-Proxy-Secret: <secret>
 *   Header: Content-Type: application/json
 *   Body: standard Vertex generateContent request
 *
 * NOTE: The proxy exposes only generateContent (no streaming). Responses block
 * until the full reply is ready — acceptable for a chat UI that shows a loading
 * spinner while waiting.
 */

import type { CarDeal } from "@/data/deals";
import type { ChatMessage, AIRecommendation } from "./types";

const PROXY_URL = "https://vertex-proxy-1065088246231.us-central1.run.app/generate";

// ---------------------------------------------------------------------------
// Compact car snapshot injected into the system prompt
// ---------------------------------------------------------------------------

function buildCatalogSnapshot(catalog: CarDeal[]): string {
  return catalog
    .map(
      (c) =>
        `{id:"${c.id}",name:"${c.name}",cat:"${c.category}",price:${c.pricePerDay},seats:${c.seats},fuel:"${c.fuel}",tx:"${c.transmission}",loc:"${c.location}"}`
    )
    .join("\n");
}

// ---------------------------------------------------------------------------
// System prompts
// ---------------------------------------------------------------------------

const BASE_SYSTEM = `You are Alex, the friendly AI assistant for Best Auto Car Rental UK.
You help customers find the right vehicle and answer rental questions.

Rules:
- Be concise, warm, and helpful.
- Never invent prices, features or policies not in the catalog.
- Free cancellation is available up to 24 hours before pick-up.
- Operating locations: London, Manchester, Birmingham, Leeds, Glasgow.
- If you cannot help, offer to connect the customer to a human agent via email: support@bestauto.co.uk`;

function buildChatSystemPrompt(): string {
  return BASE_SYSTEM;
}

function buildRecommendSystemPrompt(catalog: CarDeal[]): string {
  return `${BASE_SYSTEM}

Car catalog (compact — use these ids exactly when recommending):
${buildCatalogSnapshot(catalog)}

When making recommendations you MUST end your reply with a valid JSON block in exactly this format (no markdown fences, just the raw JSON on its own line):
{"recommendations":[{"carId":"<id>","reason":"<short reason>"}]}

Include 1–3 recommendations. Only reference car IDs that appear in the catalog above.
If you cannot make a confident recommendation, ask a clarifying question instead and omit the JSON block.`;
}

// ---------------------------------------------------------------------------
// Vertex proxy call
// ---------------------------------------------------------------------------

interface VertexPart {
  text: string;
}

interface VertexContent {
  role: string;
  parts: VertexPart[];
}

interface VertexResponse {
  candidates: Array<{
    content: { role: string; parts: VertexPart[] };
    finishReason: string;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

async function callProxy(
  systemInstruction: string,
  history: ChatMessage[]
): Promise<string> {
  const secret = process.env.PROXY_SECRET;
  if (!secret) {
    throw new Error("PROXY_SECRET environment variable is not set.");
  }

  // Convert our ChatMessage[] to Vertex contents[]
  const contents: VertexContent[] = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body = {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
  };

  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Proxy-Secret": secret,
    },
    body: JSON.stringify(body),
    // Next.js fetch cache: never cache AI responses
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown error");
    throw new Error(`Proxy returned ${res.status}: ${errText}`);
  }

  const data: VertexResponse = await res.json();
  const candidate = data.candidates?.[0];

  if (!candidate) {
    throw new Error("No candidates returned from proxy.");
  }

  if (candidate.finishReason === "MAX_TOKENS") {
    // Response was cut off — return what we have and note truncation
    console.warn("[ai/gemini] Response hit MAX_TOKENS limit.");
  }

  if (candidate.finishReason === "SAFETY") {
    throw new Error("Content blocked by safety filter.");
  }

  return candidate.content.parts[0]?.text ?? "";
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/**
 * Send a plain chat message and return the assistant reply.
 */
export async function chatWithAlex(history: ChatMessage[]): Promise<string> {
  return callProxy(buildChatSystemPrompt(), history);
}

/**
 * Locate the trailing `{"recommendations":[...]}' block in a model reply and
 * parse it. Uses brace-balancing rather than a fixed-format regex so it
 * tolerates whitespace variance and stray markdown fences the model may add
 * despite being told not to.
 */
function extractRecommendationsBlock(
  raw: string
): { recommendations: AIRecommendation[]; blockStart: number } | null {
  const keyIdx = raw.lastIndexOf('"recommendations"');
  if (keyIdx === -1) return null;

  const braceStart = raw.lastIndexOf("{", keyIdx);
  if (braceStart === -1) return null;

  let depth = 0;
  for (let i = braceStart; i < raw.length; i++) {
    if (raw[i] === "{") depth++;
    else if (raw[i] === "}") {
      depth--;
      if (depth === 0) {
        const candidate = raw.slice(braceStart, i + 1);
        try {
          const parsed = JSON.parse(candidate) as { recommendations?: AIRecommendation[] };
          return { recommendations: parsed.recommendations ?? [], blockStart: braceStart };
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

/**
 * Send a recommendation request. Returns the assistant reply text AND any
 * parsed recommendations extracted from the trailing JSON block.
 */
export async function recommendCars(
  history: ChatMessage[],
  catalog: CarDeal[]
): Promise<{ reply: string; recommendations: AIRecommendation[] }> {
  const raw = await callProxy(buildRecommendSystemPrompt(catalog), history);

  const extracted = extractRecommendationsBlock(raw);
  let recommendations: AIRecommendation[] = [];
  let reply = raw;

  if (extracted) {
    const catalogIds = new Set(catalog.map((c) => c.id));
    recommendations = extracted.recommendations.filter((r) => catalogIds.has(r.carId));

    if (recommendations.length !== extracted.recommendations.length) {
      console.warn("[ai/gemini] Dropped recommendation(s) referencing unknown car id(s).");
    }

    // Strip the JSON block (and any leading markdown fence) from the visible reply text
    reply = raw
      .slice(0, extracted.blockStart)
      .replace(/```(?:json)?\s*$/i, "")
      .trim();
  } else if (raw.includes('"recommendations"')) {
    console.warn("[ai/gemini] Found 'recommendations' key but failed to parse a JSON block.");
  }

  return { reply, recommendations };
}
