"use client";

/**
 * AIChatWidget — floating chat bubble available on every page.
 *
 * Features:
 * - Collapsible: click the bubble to open/close
 * - Multi-turn conversation using the useAIChat hook
 * - Shows typing indicator while waiting for the AI
 * - Displays error messages inline
 * - "Clear chat" resets the conversation
 * - Fully keyboard-accessible
 */

import { useState, useRef, useEffect } from "react";
import { Bot, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessageBubble, TypingIndicator } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useAIChat } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";

const INITIAL_MESSAGE =
  "Hi! I'm Alex, your Best Auto assistant 👋\n\nI can help you find the perfect rental car, answer questions about our fleet, or walk you through the booking process. What can I help you with?";

const QUICK_PROMPTS = [
  "Find me a car in London",
  "What's your cancellation policy?",
  "I need a large car for 6 people",
];

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat({
    mode: "chat",
    initialMessage: INITIAL_MESSAGE,
  });

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || isLoading) return;
    setInput("");
    await sendMessage(msg);
  };

  const handleQuickPrompt = async (prompt: string) => {
    setInput("");
    await sendMessage(prompt);
  };

  return (
    <>
      {/* Floating bubble button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200",
          "bg-primary text-primary-foreground hover:scale-105 hover:shadow-xl",
          open && "scale-90"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      <div
        role="dialog"
        aria-label="AI chat assistant"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "fixed bottom-24 right-6 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl",
          "transition-all duration-300 ease-out",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        )}
        style={{ height: "520px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-foreground">Alex</p>
              <p className="text-xs text-primary-foreground/70">Best Auto AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={clearChat}
              aria-label="Clear conversation"
              className="h-8 w-8 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="h-8 w-8 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <ChatMessageBubble key={i} message={msg} />
          ))}

          {isLoading && <TypingIndicator />}

          {error && (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          {/* Quick-prompt chips — only show after initial greeting with no user turns */}
          {messages.length === 1 && !isLoading && (
            <div className="mt-2 flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleQuickPrompt(prompt)}
                  className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          isLoading={isLoading}
          placeholder="Ask about cars, bookings, policies…"
        />
      </div>
    </>
  );
}
