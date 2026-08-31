import { NextResponse } from "next/server";
import { simulateLatency } from "@/lib/api";
import { PROCESS_STEPS } from "@/data/landing";
import { MapPin, Calendar, Car } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Map icon references to serialisable string names for the client to look up.
const ICON_MAP = new Map<LucideIcon, string>([
  [MapPin, "MapPin"],
  [Calendar, "Calendar"],
  [Car, "Car"],
]);

export async function GET() {
  await simulateLatency();
  const items = PROCESS_STEPS.map((step) => ({
    title: step.title,
    description: step.description,
    iconName: ICON_MAP.get(step.icon) ?? "MapPin",
  }));
  return NextResponse.json({ items });
}
