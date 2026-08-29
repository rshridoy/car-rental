"use client";

import { Car, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RECENT_TRANSACTIONS, type TransactionStatus } from "@/data/dashboard";
import { useDelayedReady } from "@/hooks/use-delayed-ready";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<TransactionStatus, string> = {
  success: "Success",
  cancelled: "Cancelled",
  pending: "Pending",
};

const STATUS_CLASS: Record<TransactionStatus, string> = {
  success: "border-transparent bg-success/10 text-success",
  cancelled: "border-transparent bg-destructive/10 text-destructive",
  pending: "border-transparent bg-info/10 text-info",
};

export function RecentTransactions() {
  const ready = useDelayedReady(950);

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Button variant="outline" size="sm" className="rounded-lg">
          View All
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {!ready ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Order Details</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECENT_TRANSACTIONS.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-muted-foreground">{tx.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Car className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{tx.product}</p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {tx.timeLabel}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-foreground">{tx.payment}</p>
                    <p className="text-xs text-info">{tx.reference}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(STATUS_CLASS[tx.status])}>{STATUS_LABEL[tx.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    ${tx.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
