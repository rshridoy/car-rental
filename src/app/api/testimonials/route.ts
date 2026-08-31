import { jsonWithCache, simulateLatency } from "@/lib/api";
import { TESTIMONIALS } from "@/data/landing";

export async function GET() {
  await simulateLatency();
  return jsonWithCache({ items: TESTIMONIALS });
}
