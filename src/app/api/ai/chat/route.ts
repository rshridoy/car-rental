/**
 * POST /api/ai/chat
 *
 * Unified AI route handler for both chat and vehicle recommendation modes.
 * Calls the Vertex AI proxy (no streaming — proxy only exposes generateContent).
 *
 * Request body: AIChatRequest
 * Response body: AIChatResponse
 */

import { NextRequest, NextResponse } from "next/server";
import { chatWithAlex, recommendCars } from "@/lib/ai/gemini";
import { CAR_DEALS } from "@/data/deals";
import type { AIChatRequest, AIChatResponse, ChatMessage } from "@/lib/ai/types";

export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_LENGTH = 50;

function isValidMessage(m: unknown): m is ChatMessage {
  return (
    !!m &&
    typeof m === "object" &&
    ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
    typeof (m as ChatMessage).content === "string" &&
    (m as ChatMessage).content.length > 0 &&
    (m as ChatMessage).content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(request: NextRequest): Promise<NextResponse<AIChatResponse>> {
  try {
    const body: AIChatRequest = await request.json();

    if (!body?.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { reply: "", error: "messages array is required and must not be empty." },
        { status: 400 }
      );
    }

    if (body.messages.length > MAX_HISTORY_LENGTH || !body.messages.every(isValidMessage)) {
      return NextResponse.json(
        { reply: "", error: "Invalid message history." },
        { status: 400 }
      );
    }

    const mode = body.mode ?? "chat";

    if (mode === "recommend") {
      const { reply, recommendations } = await recommendCars(body.messages, CAR_DEALS);
      return NextResponse.json({ reply, recommendations });
    }

    // Default: plain chat
    const reply = await chatWithAlex(body.messages);
    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/ai/chat] Error:", message);
    return NextResponse.json(
      {
        reply: "",
        error: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
