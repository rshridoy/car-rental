"use client";

/**
 * MarkdownLite — renders the small subset of markdown the AI assistant
 * actually produces (bold text, bullet lists, paragraph breaks) instead of
 * dumping raw "**"/"*" characters into the chat bubble.
 *
 * Not a general markdown parser — just enough to make Gemini's replies
 * readable. Runs of 3+ asterisks (a common model quirk when it merges a
 * bullet marker with bold, e.g. "* ***Name**") are normalized to a clean
 * "**" bold delimiter before parsing.
 */

import type { ReactNode } from "react";

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={`${keyPrefix}-b${i++}`}>{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export function MarkdownLite({ text }: { text: string }) {
  const normalized = text.replace(/\*{3,}/g, "**");
  const lines = normalized.split("\n");

  const blocks: ReactNode[] = [];
  let listItems: string[] = [];
  let paragraphLines: string[] = [];
  let blockKey = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    const key = blockKey++;
    blocks.push(
      <ul key={`ul-${key}`} className="list-disc space-y-1 pl-4">
        {listItems.map((item, i) => (
          <li key={i}>{parseInline(item, `li-${key}-${i}`)}</li>
        ))}
      </ul>
    );
    listItems = [];
  };

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    const key = blockKey++;
    blocks.push(
      <p key={`p-${key}`}>
        {paragraphLines.flatMap((line, i) => {
          const nodes = parseInline(line, `p-${key}-${i}`);
          return i === 0 ? nodes : [<br key={`br-${key}-${i}`} />, ...nodes];
        })}
      </p>
    );
    paragraphLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const listMatch = /^\s*[-*]\s+(.*)$/.exec(line);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1]);
    } else if (line.trim() === "") {
      flushList();
      flushParagraph();
    } else {
      flushList();
      paragraphLines.push(line);
    }
  }
  flushList();
  flushParagraph();

  return <div className="space-y-2">{blocks}</div>;
}
