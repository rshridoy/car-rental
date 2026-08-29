"use client";

import { useMemo, useState } from "react";
import { Heart, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { EmptyState } from "@/components/ui/EmptyState";
import { CAR_CATEGORIES, CAR_DEALS, TOTAL_CAR_COUNT, type CarCategoryId, type CarDeal } from "@/data/deals";
import { useDelayedReady } from "@/hooks/use-delayed-ready";
import { cn } from "@/lib/utils";

function CarCard({ car, wished, onToggleWish }: { car: CarDeal; wished: boolean; onToggleWish: () => void }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border bg-card p-4",
        car.featured ? "border-primary ring-1 ring-primary" : "border-border"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-foreground">{car.name}</p>
        <button
          type="button"
          onClick={onToggleWish}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${car.name} from wishlist` : `Add ${car.name} to wishlist`}
          className="text-muted-foreground/60 transition-colors hover:text-destructive"
        >
          <Heart className={cn("h-5 w-5", wished && "fill-destructive text-destructive")} />
        </button>
      </div>
      <ImagePlaceholder className="mt-4 h-32 w-full" iconClassName="h-9 w-9" label={car.name} />
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-foreground">
          <span className="font-semibold">${car.pricePerDay.toFixed(2)}</span>
          <span className="text-muted-foreground"> / day</span>
        </p>
        <Button size="sm" variant="outline" className="rounded-lg">
          Rent Now
        </Button>
      </div>
    </div>
  );
}

function CarCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-32 w-full rounded-2xl" />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function PopularDeals() {
  const [activeTab, setActiveTab] = useState<CarCategoryId>("popular");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const ready = useDelayedReady(600, activeTab);

  const cars = useMemo(() => CAR_DEALS.filter((car) => car.category === activeTab), [activeTab]);

  const toggleWish = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="deals" className="bg-surface-muted py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Most popular car rental deals
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A high-performing web-based car rental system for any rent-a-car company and website
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as CarCategoryId)}
          className="mt-14 items-center"
        >
          <TabsList
            variant="line"
            className="w-full justify-center gap-10 border-b border-border pb-0 group-data-horizontal/tabs:h-auto"
          >
            {CAR_CATEGORIES.map((category) => (
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

        <div className="mt-10">
          {!ready ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No cars in this category yet"
              description="We're still stocking this fleet — check back soon or browse the Popular tab."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} wished={wishlist.has(car.id)} onToggleWish={() => toggleWish(car.id)} />
              ))}
            </div>
          )}
        </div>

        <div className="relative mt-12 flex items-center justify-center">
          <Button variant="outline" className="rounded-xl px-7">
            Show more car
          </Button>
          <p className="absolute right-0 text-sm text-muted-foreground">{TOTAL_CAR_COUNT} Car</p>
        </div>
      </div>
    </section>
  );
}
