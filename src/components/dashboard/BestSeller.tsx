"use client";

import { useState } from "react";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { BestSellerItem } from "@/data/dashboard";
import { useApi } from "@/hooks/use-api";

function Row({ item }: { item: BestSellerItem }) {
  return (
    <div className="flex items-center gap-3 py-2">
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
  );
}

export function BestSeller() {
  const { data, loading } = useApi<{ items: BestSellerItem[] }>("/api/dashboard/best-sellers");
  const [viewAllOpen, setViewAllOpen] = useState(false);

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Best Seller</CardTitle>
        <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setViewAllOpen(true)} disabled={!data}>
          View All
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {loading || !data
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
          : data.items.slice(0, 5).map((item) => <Row key={item.id} item={item} />)}
      </CardContent>

      <Dialog open={viewAllOpen} onOpenChange={setViewAllOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>All Best Sellers</DialogTitle>
          </DialogHeader>
          <div className="flex max-h-96 flex-col gap-1 overflow-y-auto">
            {data?.items.map((item) => <Row key={item.id} item={item} />)}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
