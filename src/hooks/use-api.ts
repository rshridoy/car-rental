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
 * Fetches one of this project's local mock API routes (src/app/api/**) and
 * tracks loading/error state. Re-fetches whenever the path or params change,
 * and aborts a stale in-flight request if a newer one starts first.
 */
export function useApi<T>(path: string, params?: Params) {
  const query = buildQuery(params);
  const url = `${path}${query}`;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackedUrl, setTrackedUrl] = useState(url);

  if (url !== trackedUrl) {
    setTrackedUrl(url);
    setLoading(true);
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
