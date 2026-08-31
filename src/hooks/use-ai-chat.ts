"use client";

/**
 * useAIChat — custom hook for the AI chat widget and recommendation bar.
 *
 * Manages the conversation history and handles POST /api/ai/chat calls.
 * No streaming (proxy limitation) — shows a loading state while waiting.
 */

import { useState, useCallback } from "react";
import type { ChatMessage, AIMode, AIChatResponse, AIRecommendation } from "@/lib/ai/types";

export const MAX_MESSAGE_LENGTH = 2000;

export interface UseAIChatOptions {
  mode?: AIMode;
  /** Initial system-side greeting shown before the user types anything */
  initialMessage?: string;
}

export interface UseAIChatReturn {
  messages: ChatMessage[];
  recommendations: AIRecommendation[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export function useAIChat({
  mode = "chat",
  initialMessage,
}: UseAIChatOptions = {}): UseAIChatReturn {
  const seed: ChatMessage[] = initialMessage
    ? [{ role: "assistant", content: initialMessage }]
    : [];

  const [messages, setMessages] = useState<ChatMessage[]>(seed);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = { role: "user", content: trimmed };
      const next = [...messages, userMsg];
      setMessages(next);
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, messages: next }),
        });

        const data: AIChatResponse = await res.json();

        if (!res.ok || data.error) {
          // Keep the user's message in the transcript (it was already sent) —
          // only the error banner communicates failure, so nothing is lost.
          setError(data.error ?? "Something went wrong. Please try again.");
          return;
        }

        const assistantMsg: ChatMessage = { role: "assistant", content: data.reply };
        setMessages([...next, assistantMsg]);

        if (data.recommendations && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
        }
      } catch {
        setError("Network error — please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, mode]
  );

  const clearChat = useCallback(() => {
    setMessages(seed);
    setRecommendations([]);
    setError(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { messages, recommendations, isLoading, error, sendMessage, clearChat };
}
