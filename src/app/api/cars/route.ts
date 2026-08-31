import { NextRequest, NextResponse } from "next/server";
import { CAR_DEALS, LOW_STOCK_THRESHOLD, createCar, type CarCategoryId, type Fuel, type Transmission } from "@/data/deals";
import { jsonWithCache, simulateLatency } from "@/lib/api";

export async function GET(request: NextRequest) {
  await simulateLatency();

  const params = request.nextUrl.searchParams;
  const category = params.get("category") as CarCategoryId | null;
  const location = params.get("location");
  const stockFilter = params.get("stockFilter"); // "low" | "expired" | null
  const q = (params.get("q") ?? "").trim().toLowerCase();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.max(1, Number(params.get("pageSize")) || 8);

  const items = CAR_DEALS.filter((car) => {
    if (category && car.category !== category) return false;
    if (location && car.location !== location) return false;
    if (stockFilter === "low" && !(car.stock <= LOW_STOCK_THRESHOLD && !car.expired)) return false;
    if (stockFilter === "expired" && !car.expired) return false;
    if (q && !`${car.name} ${car.brand}`.toLowerCase().includes(q)) return false;
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

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Product name is required" }, { status: 400 });
  }

  const car = createCar({
    name: body.name.trim(),
    category: (body.category as CarCategoryId) ?? "popular",
    pricePerDay: Number(body.pricePerDay) || 72,
    location: typeof body.location === "string" ? body.location : undefined,
    seats: body.seats ? Number(body.seats) : undefined,
    transmission: body.transmission as Transmission | undefined,
    fuel: body.fuel as Fuel | undefined,
    stock: body.stock !== undefined ? Number(body.stock) : undefined,
  });

  return NextResponse.json({ car }, { status: 201 });
}
