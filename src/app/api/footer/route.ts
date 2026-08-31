import { jsonWithCache, simulateLatency } from "@/lib/api";
import { FOOTER_COLUMNS } from "@/data/landing";

export async function GET() {
  await simulateLatency(100);
  return jsonWithCache({ columns: FOOTER_COLUMNS });
}
