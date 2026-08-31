"use client";

import { Phone, Tag, MapPin, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { useApi } from "@/hooks/use-api";
import { Reveal } from "@/components/ui/Reveal";

type FeatureItem = {
  title: string;
  description: string;
  iconName: string;
};

const ICON_MAP: Record<string, LucideIcon> = {
  Phone,
  Tag,
  MapPin,
};

export function WhyChooseUs() {
  const { data, loading } = useApi<{ items: FeatureItem[] }>("/api/features");
  const features = data?.items ?? [];

  return (
    <section id="why-choose-us" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-10">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why choose us
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A high-performing web-based car rental system for any rent-a-car company and website
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <ImagePlaceholder className="h-72 w-full sm:h-96" iconClassName="h-14 w-14" />
          </Reveal>

          <div className="flex flex-col gap-10">
            {loading || !data
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-5">
                    <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-8 w-full max-w-md" />
                    </div>
                  </div>
                ))
              : features.map((feature) => {
                  const Icon = ICON_MAP[feature.iconName] ?? Phone;
                  return (
                    <div key={feature.title} className="flex gap-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      <div className="bg-surface-muted py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:px-10">
          <ImagePlaceholder variant="subtle" className="h-56 w-full" label="Promo banner" />
          <ImagePlaceholder variant="subtle" className="h-56 w-full" label="Promo banner" />
        </div>
      </div>
    </section>
  );
}
