import { NextRequest } from "next/server";
import { RECENT_TRANSACTIONS, type TransactionStatus } from "@/data/dashboard";
import { jsonWithCache, simulateLatency } from "@/lib/api";

const SORTS = ["recent", "oldest", "amount_desc", "amount_asc"] as const;
type Sort = (typeof SORTS)[number];

export async function GET(request: NextRequest) {
  await simulateLatency();

  const params = request.nextUrl.searchParams;
  const status = params.get("status") as TransactionStatus | "all" | null;
  const q = (params.get("q") ?? "").trim().toLowerCase();
  const sortParam = params.get("sort") as Sort | null;
  const sort: Sort = sortParam && SORTS.includes(sortParam) ? sortParam : "recent";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.max(1, Number(params.get("pageSize")) || 5);

  let items = RECENT_TRANSACTIONS.filter((tx) => {
    if (status && status !== "all" && tx.status !== status) return false;
    if (q) {
      const haystack = `${tx.product} ${tx.reference} ${tx.payment}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  items = [...items].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return a.daysAgo - b.daysAgo;
      case "amount_desc":
        return b.amount - a.amount;
      case "amount_asc":
        return a.amount - b.amount;
      case "recent":
      default:
        return b.daysAgo - a.daysAgo;
    }
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
