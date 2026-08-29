import { NextResponse } from "next/server";

/**
 * Every API route in this project serves local mock data (there is no real
 * backend). This artificial delay makes the network round-trip behave like a
 * real one, so loading skeletons on the client have something genuine to
 * show — instead of resolving before the browser can paint a frame.
 */
export function simulateLatency(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * JSON response with a short private Cache-Control window. The underlying
 * data only ever changes when this app's own code changes (it's static mock
 * data), so a short max-age lets the browser's HTTP cache skip a repeat
 * network round-trip for an identical request within that window — on top
 * of, not instead of, the in-memory cache in `useApi`.
 */
export function jsonWithCache<T>(data: T, maxAgeSeconds = 30) {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": `private, max-age=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds * 2}`,
    },
  });
}
