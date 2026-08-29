"use client";

import { PackageCheck, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { DateRangeId, StatCard } from "@/data/dashboard";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

const TONE_STYLES: Record<StatCard["tone"], string> = {
  surface: "bg-card text-foreground border border-border",
  primary: "bg-primary text-primary-foreground",
  navy: "bg-navy text-navy-foreground",
};

function StatCardView({ stat }: { stat: StatCard }) {
  const isDecrease = stat.deltaLabel?.includes("decrease");

  return (
    <div className={cn("relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl p-5", TONE_STYLES[stat.tone])}>
      <p className={cn("text-sm font-medium", stat.tone === "surface" && "text-primary")}>{stat.label}</p>
      <p className="mt-2 text-[1.75rem] leading-none font-bold">{stat.value}</p>

      {stat.deltaLabel && (
        <p className={cn("mt-3 flex items-center gap-1 text-xs font-medium", isDecrease ? "text-destructive" : "text-success")}>
          {isDecrease ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
          {stat.deltaLabel}
        </p>
      )}

      {stat.tone === "surface" && (
        <PiggyBank className="pointer-events-none absolute -right-2 -bottom-2 h-20 w-20 text-primary/10" aria-hidden="true" />
      )}
      {stat.tone === "primary" && (
        <TrendingUp className="pointer-events-none absolute -right-2 -bottom-2 h-16 w-16 text-primary-foreground/15" aria-hidden="true" />
      )}
      {stat.tone === "navy" && (
        <PackageCheck className="pointer-events-none absolute -right-2 -bottom-2 h-16 w-16 text-navy-foreground/15" aria-hidden="true" />
      )}
    </div>
  );
}

export function StatCards({ range, refreshKey }: { range: DateRangeId; refreshKey: number }) {
  const { data, loading } = useApi<{ stats: StatCard[] }>("/api/dashboard/stats", {
    range,
    _r: refreshKey || undefined,
  });

  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Skeleton className="h-36 rounded-2xl sm:col-span-2" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    );
  }

  const [earning, sales, goods] = data.stats;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
      <div className="sm:col-span-2">
        <StatCardView stat={earning} />
      </div>
      <StatCardView stat={sales} />
      <StatCardView stat={goods} />
    </div>
  );
}
