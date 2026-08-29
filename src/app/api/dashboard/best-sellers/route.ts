import { BEST_SELLERS } from "@/data/dashboard";
import { jsonWithCache, simulateLatency } from "@/lib/api";

export async function GET() {
  await simulateLatency();
  return jsonWithCache({ items: BEST_SELLERS });
}
