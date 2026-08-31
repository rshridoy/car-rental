import { jsonWithCache, simulateLatency } from "@/lib/api";
import { LOCATIONS } from "@/data/deals";

export async function GET() {
  await simulateLatency(100);
  return jsonWithCache({ items: [...LOCATIONS] });
}
