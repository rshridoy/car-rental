"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Car, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { CAR_CATEGORIES, LOW_STOCK_THRESHOLD, type CarDeal } from "@/data/deals";
import { invalidateApiCache, useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

export function ProductsTable({
  stockFilter,
  emptyTitle,
  emptyDescription,
}: {
  stockFilter?: "low" | "expired";
  emptyTitle: string;
  emptyDescription?: string;
}) {
  const [category, setCategory] = useState("all");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(timer);
  }, [q]);

  const { data, loading } = useApi<{ items: CarDeal[]; total: number; totalPages: number; page: number }>(
    "/api/cars",
    {
      category: category === "all" ? undefined : category,
      stockFilter,
      q: debouncedQ,
      page,
      pageSize: PAGE_SIZE,
    }
  );

  const resetPage = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const handleDelete = (car: CarDeal) => {
    toast.error(`"${car.name}" would be deleted here — deletion isn't wired to a backend in this build.`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => resetPage(setQ)(e.target.value)}
              placeholder="Search products"
              className="w-48 pl-8"
              aria-label="Search products"
            />
          </div>
          <Select value={category} onValueChange={resetPage(setCategory)}>
            <SelectTrigger aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CAR_CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          onClick={() => invalidateApiCache("/api/cars")}
          className="rounded-lg"
          title="Refresh"
        >
          Refresh
        </Button>
      </div>

      {loading && !data ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price / day</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Car className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{car.name}</p>
                          <p className="text-xs text-muted-foreground">{car.brand}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">{car.category}</TableCell>
                    <TableCell className="text-muted-foreground">{car.location}</TableCell>
                    <TableCell className="font-medium text-foreground">${car.pricePerDay.toFixed(2)}</TableCell>
                    <TableCell>
                      {car.expired ? (
                        <Badge className="border-transparent bg-destructive/10 text-destructive">Expired</Badge>
                      ) : (
                        <Badge
                          className={cn(
                            "border-transparent",
                            car.stock <= LOW_STOCK_THRESHOLD ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                          )}
                        >
                          {car.stock} in stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${car.name}`}
                        onClick={() => handleDelete(car)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data.totalPages > 1 && (
            <Pagination className="justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={cn(page <= 1 && "pointer-events-none opacity-50")}
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
                    className={cn(page >= data.totalPages && "pointer-events-none opacity-50")}
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
    </div>
  );
}

export function AddProductLink() {
  return (
    <Button asChild className="rounded-lg">
      <Link href="/dashboard/products/create">
        <Plus className="h-4 w-4" />
        Add Product
      </Link>
    </Button>
  );
}
