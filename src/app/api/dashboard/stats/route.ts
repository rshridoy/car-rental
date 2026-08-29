import { NextRequest } from "next/server";
import { DATE_RANGES, STAT_CARDS_BY_RANGE, type DateRangeId } from "@/data/dashboard";
import { jsonWithCache, simulateLatency } from "@/lib/api";

export async function GET(request: NextRequest) {
  await simulateLatency();

  const rangeParam = request.nextUrl.searchParams.get("range") as DateRangeId | null;
  const range: DateRangeId = rangeParam && rangeParam in STAT_CARDS_BY_RANGE ? rangeParam : "this-week";
  const meta = DATE_RANGES.find((r) => r.id === range)!;

  return jsonWithCache({
    range,
    dateLabel: meta.dateLabel,
    stats: STAT_CARDS_BY_RANGE[range],
  });
}
