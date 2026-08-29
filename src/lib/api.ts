/**
 * Every API route in this project serves local mock data (there is no real
 * backend). This artificial delay makes the network round-trip behave like a
 * real one, so loading skeletons on the client have something genuine to
 * show — instead of resolving before the browser can paint a frame.
 */
export function simulateLatency(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
