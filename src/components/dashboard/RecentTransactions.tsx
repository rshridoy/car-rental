"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown, Car, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Transaction, TransactionStatus } from "@/data/dashboard";
import { useApi } from "@/hooks/use-api";
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

type Sort = "recent" | "oldest" | "amount_desc" | "amount_asc";
type StatusFilter = "all" | TransactionStatus;

const PAGE_SIZE = 5;

export function RecentTransactions() {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [sort, setSort] = useState<Sort>("recent");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(timer);
  }, [q]);

  const { data, loading } = useApi<{ items: Transaction[]; totalPages: number; page: number }>(
    "/api/dashboard/transactions",
    { status, q: debouncedQ, sort, page, pageSize: PAGE_SIZE }
  );

  const resetToFirstPage = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const toggleAmountSort = () => {
    setSort((s) => (s === "amount_desc" ? "amount_asc" : "amount_desc"));
    setPage(1);
  };

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => resetToFirstPage(setQ)(e.target.value)}
              placeholder="Search transactions"
              className="h-8 w-40 pl-8 text-sm sm:w-48"
              aria-label="Search transactions"
            />
          </div>
          <Select value={status} onValueChange={resetToFirstPage<StatusFilter>(setStatus)}>
            <SelectTrigger size="sm" className="rounded-lg" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading && !data ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState title="No transactions match your filters" description="Try a different search term or status." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Order Details</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    <button
                      type="button"
                      onClick={toggleAmountSort}
                      className="ml-auto flex items-center gap-1 hover:text-foreground"
                    >
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((tx) => (
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

            {data.totalPages > 1 && (
              <Pagination className="mt-4 justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      aria-disabled={page <= 1}
                      className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: data.totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={data.page === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      aria-disabled={page >= data.totalPages}
                      className={page >= data.totalPages ? "pointer-events-none opacity-50" : ""}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(data.totalPages, p + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
