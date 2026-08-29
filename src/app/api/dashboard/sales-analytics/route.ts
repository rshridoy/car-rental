import { NextRequest, NextResponse } from "next/server";
import { SALES_ANALYTICS_BY_YEAR } from "@/data/dashboard";
import { simulateLatency } from "@/lib/api";

export async function GET(request: NextRequest) {
  await simulateLatency();

  const yearParam = request.nextUrl.searchParams.get("year");
  const year = yearParam && yearParam in SALES_ANALYTICS_BY_YEAR ? yearParam : "2024";

  return NextResponse.json({
    year,
    years: Object.keys(SALES_ANALYTICS_BY_YEAR).sort((a, b) => Number(b) - Number(a)),
    points: SALES_ANALYTICS_BY_YEAR[year],
  });
}
