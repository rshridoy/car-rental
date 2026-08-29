import { NextRequest } from "next/server";
import { CAR_DEALS, type CarCategoryId } from "@/data/deals";
import { jsonWithCache, simulateLatency } from "@/lib/api";

export async function GET(request: NextRequest) {
  await simulateLatency();

  const params = request.nextUrl.searchParams;
  const category = (params.get("category") as CarCategoryId | null) ?? "popular";
  const location = params.get("location");
  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.max(1, Number(params.get("pageSize")) || 8);

  const items = CAR_DEALS.filter((car) => {
    if (car.category !== category) return false;
    if (location && car.location !== location) return false;
    return true;
  });

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return jsonWithCache({
    items: pageItems,
    total,
    page: safePage,
    pageSize,
    totalPages,
  });
}
