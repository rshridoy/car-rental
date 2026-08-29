"use client";

import { useEffect, useState } from "react";

/**
 * Simulates the latency of a real data fetch so data-driven regions have a
 * genuine loading -> loaded transition to show a skeleton for. There is no
 * backend in this project — every list ships as local mock data — so this
 * is purely a UI-state demonstration, re-armed whenever `key` changes.
 */
export function useDelayedReady(delayMs = 700, key?: unknown) {
  const [ready, setReady] = useState(false);
  const [trackedKey, setTrackedKey] = useState(key);

  if (key !== trackedKey) {
    setTrackedKey(key);
    setReady(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs, key]);

  return ready;
}
