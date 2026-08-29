"use client";

import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SALES_BY_COUNTRY } from "@/data/dashboard";
import { useDelayedReady } from "@/hooks/use-delayed-ready";

/**
 * A stylized, non-geographic world map (soft continent blobs on a grid),
 * used instead of react-simple-maps so the widget never depends on fetching
 * remote topojson data at runtime. See README.md for the rationale.
 */
const CONTINENTS = [
  { cx: 78, cy: 62, rx: 42, ry: 30, highlight: false }, // North America
  { cx: 120, cy: 145, rx: 24, ry: 40, highlight: false }, // South America
  { cx: 205, cy: 48, rx: 22, ry: 16, highlight: false }, // Europe
  { cx: 215, cy: 112, rx: 30, ry: 42, highlight: true }, // Africa
  { cx: 285, cy: 68, rx: 55, ry: 34, highlight: false }, // Asia
  { cx: 330, cy: 158, rx: 24, ry: 14, highlight: false }, // Australia
];

export function SalesByCountries() {
  const ready = useDelayedReady(1250);

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Sales by Countries</CardTitle>
        <span className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground">This Week</span>
      </CardHeader>
      <CardContent>
        {!ready ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-xl bg-[#0f1420] p-4">
              <svg viewBox="0 0 400 200" className="h-48 w-full" role="img" aria-label="World map highlighting sales in Africa">
                {Array.from({ length: 10 }).map((_, i) => (
                  <line key={`h${i}`} x1={0} y1={i * 20} x2={400} y2={i * 20} stroke="#ffffff" strokeOpacity={0.04} />
                ))}
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 20} y1={0} x2={i * 20} y2={200} stroke="#ffffff" strokeOpacity={0.04} />
                ))}
                {CONTINENTS.map((c, i) => (
                  <ellipse
                    key={i}
                    cx={c.cx}
                    cy={c.cy}
                    rx={c.rx}
                    ry={c.ry}
                    fill={c.highlight ? "var(--color-primary)" : "#3a4152"}
                  />
                ))}
              </svg>

              <div className="absolute top-[38%] left-[52%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
                <div className="rounded-lg bg-primary px-3 py-1.5 text-center text-xs font-medium text-primary-foreground shadow-lg">
                  {SALES_BY_COUNTRY.region}
                  <br />
                  {SALES_BY_COUNTRY.sales.toLocaleString()} Sales
                </div>
                <div className="h-2 w-2 rotate-45 bg-primary" />
              </div>
            </div>

            <p className="flex items-center gap-1.5 text-xs font-medium text-success">
              <TrendingUp className="h-3.5 w-3.5" />
              {SALES_BY_COUNTRY.deltaLabel}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
