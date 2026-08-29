"use client";

import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BEST_SELLERS } from "@/data/dashboard";
import { useDelayedReady } from "@/hooks/use-delayed-ready";

export function BestSeller() {
  const ready = useDelayedReady(850);

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Best Seller</CardTitle>
        <Button variant="outline" size="sm" className="rounded-lg">
          View All
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {!ready
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-3.5 w-10" />
              </div>
            ))
          : BEST_SELLERS.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Car className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">${item.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Sales</p>
                  <p className="text-sm font-semibold text-foreground">{item.sales.toLocaleString()}</p>
                </div>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}
