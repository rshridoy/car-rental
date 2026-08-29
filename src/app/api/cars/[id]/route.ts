import { NextResponse } from "next/server";
import { getCarById } from "@/data/deals";
import { jsonWithCache, simulateLatency } from "@/lib/api";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await simulateLatency();

  const { id } = await params;
  const car = getCarById(id);

  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  return jsonWithCache({ car }, 120);
}
