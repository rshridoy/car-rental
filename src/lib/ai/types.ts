/** Shared TypeScript types for the AI chat / recommendation layer. */

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export type AIMode = "chat" | "recommend";

/** Shape posted to POST /api/ai/chat */
export interface AIChatRequest {
  mode: AIMode;
  messages: ChatMessage[];
}

/** Recommendation result embedded in assistant reply */
export interface AIRecommendation {
  carId: string;
  reason: string;
}

/** Shape returned by POST /api/ai/chat */
export interface AIChatResponse {
  reply: string;
  recommendations?: AIRecommendation[];
  error?: string;
}
