"use client";

import { useEffect, useMemo, useState } from "react";

type Params = Record<string, string | number | undefined | null>;

function buildQuery(params?: Params) {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Module-level, in-memory response cache shared by every useApi call. Keyed
 * by the full request URL. Not persisted (resets on full page reload) — it
 * only exists to make revisiting an already-fetched view (switching back to
 * a tab, paging back, re-opening a filter) instant instead of re-showing a
 * loading skeleton for data we already have.
 */
const cache = new Map<string, unknown>();

/**
 * Fetches one of this project's local mock API routes (src/app/api/**) and
 * tracks loading/error state. Stale-while-revalidate: a cache hit renders
 * immediately with no loading state, then a fresh request still runs in the
 * background and silently updates the result when it resolves. Re-fetches
 * whenever the path or params change, and aborts a stale in-flight request
 * if a newer one starts first.
 */
export function useApi<T>(path: string, params?: Params) {
  const query = buildQuery(params);
  const url = `${path}${query}`;
  const cached = cache.get(url) as T | undefined;

  const [data, setData] = useState<T | null>(cached ?? null);
  const [loading, setLoading] = useState(cached === undefined);
  const [error, setError] = useState<string | null>(null);
  const [trackedUrl, setTrackedUrl] = useState(url);

  if (url !== trackedUrl) {
    setTrackedUrl(url);
    const nextCached = cache.get(url) as T | undefined;
    setData(nextCached ?? null);
    setLoading(nextCached === undefined);
    setError(null);
  }

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return (await res.json()) as T;
      })
      .then((json) => {
        cache.set(url, json);
        setData(json);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong");
        setLoading(false);
      });

    return () => controller.abort();
  }, [url]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
}
