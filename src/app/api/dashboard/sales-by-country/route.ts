import { NextRequest } from "next/server";
import { COUNTRY_PERIODS, SALES_BY_COUNTRY_BY_PERIOD, type CountryPeriodId } from "@/data/dashboard";
import { jsonWithCache, simulateLatency } from "@/lib/api";

export async function GET(request: NextRequest) {
  await simulateLatency();

  const periodParam = request.nextUrl.searchParams.get("period") as CountryPeriodId | null;
  const period: CountryPeriodId = periodParam && periodParam in SALES_BY_COUNTRY_BY_PERIOD ? periodParam : "this-week";

  return jsonWithCache({
    period,
    periods: COUNTRY_PERIODS,
    ...SALES_BY_COUNTRY_BY_PERIOD[period],
  });
}
