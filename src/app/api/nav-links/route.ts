import { jsonWithCache, simulateLatency } from "@/lib/api";
import { NAV_LINKS } from "@/data/landing";

export async function GET() {
  await simulateLatency(100);
  return jsonWithCache({ items: NAV_LINKS });
}
