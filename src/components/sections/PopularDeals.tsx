"use client";

import { useState } from "react";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { CarCard, CarCardSkeleton } from "@/components/cars/CarCard";
import { Reveal } from "@/components/ui/Reveal";
import type { CarCategoryId, CarDeal, CarCategory } from "@/data/deals";
import { useApi } from "@/hooks/use-api";

export function PopularDeals() {
  const [activeTab, setActiveTab] = useState<CarCategoryId>("popular");

  const { data: catData, loading: catLoading } = useApi<{ items: CarCategory[]; total: number }>("/api/categories");
  const categories = catData?.items ?? [];
  const totalCarCount = catData?.total ?? 0;

  const { data, loading } = useApi<{ items: CarDeal[] }>("/api/cars", {
    category: activeTab,
    page: 1,
    pageSize: 8,
  });

  return (
    <section id="deals" className="bg-surface-muted py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Most popular car rental deals
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A high-performing web-based car rental system for any rent-a-car company and website
          </p>
        </Reveal>

        <div className="mt-14">
          {catLoading ? (
            <div className="flex gap-10 border-b border-border pb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as CarCategoryId)}
              className="items-center"
            >
              <TabsList variant="line" className="h-auto w-full justify-center gap-10 border-b border-border pb-0 group-data-horizontal/tabs:h-auto">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="rounded-none px-1 pb-4 text-sm font-medium data-active:bg-transparent data-active:text-foreground data-active:after:bg-primary"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>

        <div className="mt-10">
          {loading || !data ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          ) : data.items.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No cars in this category yet"
              description="We're still stocking this fleet — check back soon or browse the Popular tab."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.items.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>

        <div className="relative mt-12 flex items-center justify-center">
          <Button asChild variant="outline" className="rounded-xl px-7">
            <Link href={`/cars?category=${activeTab}`}>Show more car</Link>
          </Button>
          {totalCarCount > 0 && (
            <p className="absolute right-0 text-sm text-muted-foreground">{totalCarCount} Car</p>
          )}
        </div>
      </div>
    </section>
  );
}
