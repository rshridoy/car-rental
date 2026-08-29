"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import type { CarDeal } from "@/data/deals";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

export function CarCard({ car }: { car: CarDeal }) {
  const { isWishlisted, toggle } = useWishlist();
  const wished = isWishlisted(car.id);

  return (
    <div
      className={cn(
        "group flex flex-col rounded-2xl border bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5",
        car.featured ? "border-primary ring-1 ring-primary" : "border-border"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-foreground">{car.name}</p>
        <button
          type="button"
          onClick={() => toggle(car.id)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${car.name} from wishlist` : `Add ${car.name} to wishlist`}
          className="text-muted-foreground/60 transition-colors hover:text-destructive"
        >
          <Heart className={cn("h-5 w-5", wished && "fill-destructive text-destructive")} />
        </button>
      </div>

      <Link href={`/cars/${car.id}`} className="mt-4 block overflow-hidden rounded-2xl">
        <ImagePlaceholder
          className="h-32 w-full transition-transform duration-300 group-hover:scale-105"
          iconClassName="h-9 w-9"
          label={car.name}
        />
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>{car.location}</span>
        <span aria-hidden="true">•</span>
        <span>{car.seats} seats</span>
        <span aria-hidden="true">•</span>
        <span>{car.transmission}</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-foreground">
          <span className="font-semibold">${car.pricePerDay.toFixed(2)}</span>
          <span className="text-muted-foreground"> / day</span>
        </p>
        <Button asChild size="sm" variant="outline" className="rounded-lg">
          <Link href={`/cars/${car.id}`}>Rent Now</Link>
        </Button>
      </div>
    </div>
  );
}

export function CarCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
        <div className="h-5 w-5 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mt-4 h-32 w-full animate-pulse rounded-2xl bg-muted" />
      <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
