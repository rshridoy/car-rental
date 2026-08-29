import { NextResponse } from "next/server";
import { BEST_SELLERS } from "@/data/dashboard";
import { simulateLatency } from "@/lib/api";

export async function GET() {
  await simulateLatency();
  return NextResponse.json({ items: BEST_SELLERS });
}
