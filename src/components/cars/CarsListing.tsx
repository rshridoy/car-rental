"use client";

import { useMemo, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CarFront } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { CarCard, CarCardSkeleton } from "@/components/cars/CarCard";
import type { CarCategoryId, CarDeal, CarCategory } from "@/data/deals";
import { useApi } from "@/hooks/use-api";
import { AIRecommendBar } from "@/components/ai/AIRecommendBar";

const PAGE_SIZE = 8;

export function CarsListing() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = (searchParams.get("category") as CarCategoryId) ?? "popular";
  const location = searchParams.get("location") ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const { data: catData, loading: catLoading } = useApi<{ items: CarCategory[] }>("/api/categories");
  const { data: locData, loading: locLoading } = useApi<{ items: string[] }>("/api/locations");
  const categories = catData?.items ?? [];
  const locations = locData?.items ?? [];

  const { data, loading } = useApi<{ items: CarDeal[]; total: number; totalPages: number; page: number }>(
    "/api/cars",
    { category, location, page, pageSize: PAGE_SIZE }
  );

  const updateParams = useMemo(
    () => (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      router.push(`${pathname}?${next.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // AI recommendation highlight state
  const [aiHighlightIds, setAiHighlightIds] = useState<string[]>([]);
  const handleRecommend = useCallback((ids: string[]) => setAiHighlightIds(ids), []);
  const handleClearRecommend = useCallback(() => setAiHighlightIds([]), []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div>
        <p className="text-sm font-medium text-primary">Best Auto</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {location ? `Cars in ${location}` : "Browse our fleet"}
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          {data ? `${data.total} car${data.total === 1 ? "" : "s"} available` : "Loading availability…"}
        </p>
      </div>

      {/* AI Vehicle Recommender — positioned above the filter tabs */}
      <AIRecommendBar
        activeIds={aiHighlightIds}
        onRecommend={handleRecommend}
        onClear={handleClearRecommend}
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {catLoading ? (
          <div className="flex gap-8 border-b border-border pb-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
        ) : (
          <Tabs value={category} onValueChange={(v) => updateParams({ category: v, page: null })}>
            <TabsList variant="line" className="h-auto flex-wrap justify-start gap-6 border-b border-border pb-0 group-data-horizontal/tabs:h-auto sm:gap-8">
              {categories.map((c) => (
                <TabsTrigger
                  key={c.id}
                  value={c.id}
                  className="rounded-none px-1 pb-3 text-sm font-medium data-active:bg-transparent data-active:text-foreground data-active:after:bg-primary"
                >
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {locLoading ? (
          <Skeleton className="h-9 w-full sm:w-48" />
        ) : (
          <Select value={location || "all"} onValueChange={(v) => updateParams({ location: v === "all" ? null : v, page: null })}>
            <SelectTrigger className="w-full sm:w-48" aria-label="Filter by location">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="mt-8">
        {loading || !data ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState
            icon={CarFront}
            title="No cars match these filters"
            description="Try a different category or location — or clear the location filter to see everything available."
            className="mt-4"
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                aiHighlighted={aiHighlightIds.includes(car.id)}
              />
            ))}
          </div>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  updateParams({ page: String(Math.max(1, page - 1)) });
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
                    updateParams({ page: String(i + 1) });
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
                  updateParams({ page: String(Math.min(data.totalPages, page + 1)) });
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
