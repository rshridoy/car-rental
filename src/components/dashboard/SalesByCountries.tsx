"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { CountryPeriodId } from "@/data/dashboard";
import { useApi } from "@/hooks/use-api";

/**
 * A stylized, non-geographic world map (soft continent blobs on a grid),
 * used instead of react-simple-maps so the widget never depends on fetching
 * remote topojson data at runtime. See README.md for the rationale.
 */
const CONTINENTS: { name: string; cx: number; cy: number; rx: number; ry: number }[] = [
  { name: "North America", cx: 78, cy: 62, rx: 42, ry: 30 },
  { name: "South America", cx: 120, cy: 145, rx: 24, ry: 40 },
  { name: "Europe", cx: 205, cy: 48, rx: 22, ry: 16 },
  { name: "Africa", cx: 215, cy: 112, rx: 30, ry: 42 },
  { name: "Asia", cx: 285, cy: 68, rx: 55, ry: 34 },
  { name: "Australia", cx: 330, cy: 158, rx: 24, ry: 14 },
];

type CountryResponse = {
  region: string;
  sales: number;
  deltaLabel: string;
  periods: { id: CountryPeriodId; label: string }[];
};

export function SalesByCountries() {
  const [period, setPeriod] = useState<CountryPeriodId>("this-week");
  const { data, loading } = useApi<CountryResponse>("/api/dashboard/sales-by-country", { period });

  const highlighted = CONTINENTS.find((c) => c.name === data?.region) ?? CONTINENTS[3];

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Sales by Countries</CardTitle>
        <Select value={period} onValueChange={(v) => setPeriod(v as CountryPeriodId)}>
          <SelectTrigger size="sm" className="rounded-lg" aria-label="Select period">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(data?.periods ?? []).map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
            {!data && <SelectItem value={period}>{period}</SelectItem>}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading || !data ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-xl bg-[#0f1420] p-4">
              <svg viewBox="0 0 400 200" className="h-48 w-full" role="img" aria-label={`World map highlighting sales in ${data.region}`}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <line key={`h${i}`} x1={0} y1={i * 20} x2={400} y2={i * 20} stroke="#ffffff" strokeOpacity={0.04} />
                ))}
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 20} y1={0} x2={i * 20} y2={200} stroke="#ffffff" strokeOpacity={0.04} />
                ))}
                {CONTINENTS.map((c) => (
                  <ellipse
                    key={c.name}
                    cx={c.cx}
                    cy={c.cy}
                    rx={c.rx}
                    ry={c.ry}
                    fill={c.name === highlighted.name ? "var(--color-primary)" : "#3a4152"}
                  />
                ))}
              </svg>

              <div
                className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center transition-all"
                style={{ left: `${(highlighted.cx / 400) * 100}%`, top: `${(highlighted.cy / 200) * 100}%` }}
              >
                <div className="rounded-lg bg-primary px-3 py-1.5 text-center text-xs font-medium text-primary-foreground shadow-lg">
                  {data.region}
                  <br />
                  {data.sales.toLocaleString()} Sales
                </div>
                <div className="h-2 w-2 rotate-45 bg-primary" />
              </div>
            </div>

            <p className="flex items-center gap-1.5 text-xs font-medium text-success">
              <TrendingUp className="h-3.5 w-3.5" />
              {data.deltaLabel}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
