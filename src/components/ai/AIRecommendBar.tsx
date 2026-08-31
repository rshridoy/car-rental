"use client";

/**
 * AIRecommendBar — inline AI vehicle recommender on the /cars listing page.
 *
 * The user describes their trip in natural language; the AI returns a ranked
 * list of car IDs with reasons. Those IDs are then highlighted in the grid
 * below via the onRecommend / onClear callbacks.
 *
 * Uses mode: "recommend" on the shared POST /api/ai/chat route.
 */

import { useState, useRef, useEffect } from "react";
import { Sparkles, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypingIndicator } from "./ChatMessage";
import { MarkdownLite } from "./MarkdownLite";
import { useAIChat, MAX_MESSAGE_LENGTH } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";

interface AIRecommendBarProps {
  /** Called when the AI returns car recommendations */
  onRecommend: (ids: string[]) => void;
  /** Called when the user clears recommendations */
  onClear: () => void;
  /** IDs currently highlighted so the bar can show count */
  activeIds: string[];
}

const INITIAL_MESSAGE =
  "Hi! Tell me about your trip — where you're going, how many people, any preferences — and I'll pick the best cars from our fleet for you.";

const EXAMPLE_PROMPTS = [
  "Family of 5, road trip from London",
  "Budget car for 2 days in Birmingham",
  "Luxury automatic in Manchester",
];

export function AIRecommendBar({ onRecommend, onClear, activeIds }: AIRecommendBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const prevRecsKey = useRef<string>("");

  const { messages, recommendations, isLoading, error, sendMessage, clearChat } = useAIChat({
    mode: "recommend",
    initialMessage: INITIAL_MESSAGE,
  });

  // Propagate recommendations to parent whenever they change
  useEffect(() => {
    const key = recommendations.map((r) => r.carId).join(",");
    if (key && key !== prevRecsKey.current) {
      prevRecsKey.current = key;
      onRecommend(recommendations.map((r) => r.carId));
    }
  }, [recommendations, onRecommend]);

  const doSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;
    setInput("");
    setExpanded(true);
    await sendMessage(msg);
  };

  const handleClear = () => {
    clearChat();
    prevRecsKey.current = "";
    onClear();
    setExpanded(false);
    setInput("");
  };

  // Skip the initial greeting when rendering conversation history
  const conversationMessages = messages.slice(1);

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      {/* Header bar — always visible */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">AI Vehicle Recommender</p>
          <p className="truncate text-xs text-muted-foreground">
            {activeIds.length > 0
              ? `${activeIds.length} car${activeIds.length === 1 ? "" : "s"} recommended — highlighted below`
              : "Describe your trip and I'll find your perfect car"}
          </p>
        </div>
        {activeIds.length > 0 && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleClear}
            className="shrink-0 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </Button>
        )}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Collapse AI recommender" : "Expand AI recommender"}
          className="h-8 w-8 shrink-0"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Expandable body — uses CSS grid trick for smooth height animation */}
      <div
        className={cn(
          "grid transition-all duration-300",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          {/* Quick-prompt chips (only before first user message) */}
          {conversationMessages.length === 0 && (
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => doSend(prompt)}
                  disabled={isLoading}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Conversation history */}
          {conversationMessages.length > 0 && (
            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto px-4 pb-3">
              {conversationMessages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto rounded-tr-sm bg-primary text-primary-foreground"
                      : "rounded-tl-sm bg-muted text-foreground"
                  )}
                >
                  <MarkdownLite text={msg.content} />
                </div>
              ))}
              {isLoading && (
                <div className="max-w-[85%]">
                  <TypingIndicator />
                </div>
              )}
              {error && (
                <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Input row */}
          <div className="flex items-center gap-2 border-t border-border/60 px-4 py-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") doSend();
              }}
              placeholder="e.g. 4 people, automatic, London, 3 days…"
              disabled={isLoading}
              maxLength={MAX_MESSAGE_LENGTH}
              aria-label="Describe your trip to get AI car recommendations"
              className={cn(
                "flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm",
                "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40",
                "disabled:opacity-50"
              )}
            />
            <Button
              type="button"
              size="sm"
              onClick={() => doSend()}
              disabled={isLoading || !input.trim()}
              className="shrink-0 gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Ask AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
