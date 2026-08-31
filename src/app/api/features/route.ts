import { NextResponse } from "next/server";
import { simulateLatency } from "@/lib/api";
import { FEATURES } from "@/data/landing";
import { Phone, Tag, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP = new Map<LucideIcon, string>([
  [Phone, "Phone"],
  [Tag, "Tag"],
  [MapPin, "MapPin"],
]);

export async function GET() {
  await simulateLatency();
  const items = FEATURES.map((feature) => ({
    title: feature.title,
    description: feature.description,
    iconName: ICON_MAP.get(feature.icon) ?? "Phone",
  }));
  return NextResponse.json({ items });
}
