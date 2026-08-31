"use client";

import { useRef, useEffect, type KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_MESSAGE_LENGTH } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isLoading,
  placeholder = "Type a message…",
  className,
}: ChatInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as content grows (max ~4 lines)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter; allow Shift+Enter for newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={cn("flex items-end gap-2 border-t border-border bg-background p-3", className)}>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        rows={1}
        maxLength={MAX_MESSAGE_LENGTH}
        aria-label="Chat message input"
        className={cn(
          "flex-1 resize-none rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm leading-relaxed",
          "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40",
          "disabled:opacity-50",
          "max-h-[120px] overflow-y-auto"
        )}
      />
      <Button
        type="button"
        size="icon"
        onClick={onSend}
        disabled={isLoading || !value.trim()}
        aria-label="Send message"
        className="shrink-0 rounded-xl"
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
