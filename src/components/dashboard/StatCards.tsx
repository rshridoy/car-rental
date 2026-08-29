"use client";

import { PackageCheck, PiggyBank, RefreshCw, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { STAT_CARDS, type StatCard } from "@/data/dashboard";
import { useDelayedReady } from "@/hooks/use-delayed-ready";
import { cn } from "@/lib/utils";

const TONE_STYLES: Record<StatCard["tone"], string> = {
  surface: "bg-card text-foreground border border-border",
  primary: "bg-primary text-primary-foreground",
  navy: "bg-navy text-navy-foreground",
};

function StatCardView({ stat }: { stat: StatCard }) {
  return (
    <div className={cn("relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl p-5", TONE_STYLES[stat.tone])}>
      {stat.tone !== "surface" && (
        <button
          type="button"
          aria-label="Refresh"
          className="absolute top-4 right-4 text-current/80 hover:text-current"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      )}

      <p className={cn("text-sm font-medium", stat.tone === "surface" && "text-primary")}>{stat.label}</p>
      <p className="mt-2 text-[1.75rem] leading-none font-bold">{stat.value}</p>

      {stat.deltaLabel && (
        <p className="mt-3 flex items-center gap-1 text-xs font-medium text-success">
          <TrendingUp className="h-3.5 w-3.5" />
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

export function StatCards() {
  const ready = useDelayedReady(500);

  if (!ready) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Skeleton className="h-36 rounded-2xl sm:col-span-2" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
      <div className="sm:col-span-2">
        <StatCardView stat={STAT_CARDS[0]} />
      </div>
      <StatCardView stat={STAT_CARDS[1]} />
      <StatCardView stat={STAT_CARDS[2]} />
    </div>
  );
}
