"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "best-auto:wishlist";
const EMPTY_SET: ReadonlySet<string> = new Set();

let cached: ReadonlySet<string> | null = null;
const listeners = new Set<() => void>();

function readStoredWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function getSnapshot(): ReadonlySet<string> {
  if (!cached) cached = new Set(readStoredWishlist());
  return cached;
}

function getServerSnapshot(): ReadonlySet<string> {
  return EMPTY_SET;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notify() {
  cached = null;
  for (const listener of listeners) listener();
}

/**
 * Wishlist state persisted per-browser in localStorage, read through
 * useSyncExternalStore so the server-rendered HTML (always "nothing
 * wishlisted") never mismatches the client's actual stored state — React
 * reconciles it automatically right after hydration.
 */
export function useWishlist() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((id: string) => {
    const next = new Set(readStoredWishlist());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // localStorage unavailable (private browsing, disabled storage) — the in-memory store still updates.
    }
    notify();
  }, []);

  return { ids, isWishlisted: (id: string) => ids.has(id), toggle };
}
