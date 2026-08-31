import { jsonWithCache, simulateLatency } from "@/lib/api";
import { CAR_CATEGORIES, TOTAL_CAR_COUNT } from "@/data/deals";

export async function GET() {
  await simulateLatency(100);
  return jsonWithCache({ items: CAR_CATEGORIES, total: TOTAL_CAR_COUNT });
}
