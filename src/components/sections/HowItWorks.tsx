"use client";

import { MapPin, Calendar, Car, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { Reveal } from "@/components/ui/Reveal";

type StepItem = {
  title: string;
  description: string;
  iconName: string;
};

const ICON_MAP: Record<string, LucideIcon> = {
  MapPin,
  Calendar,
  Car,
};

export function HowItWorks() {
  const { data, loading } = useApi<{ items: StepItem[] }>("/api/how-it-works");
  const steps = data?.items ?? [];

  return (
    <section id="how-it-works" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A high-performing web-based car rental system for any rent-a-car company and website
          </p>
        </Reveal>

        <div className="relative mt-20">
          <svg
            viewBox="0 0 800 60"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-9 hidden h-16 w-full text-line-strong lg:block"
            aria-hidden="true"
          >
            <path
              d="M65 10 C 250 10, 250 55, 400 55 C 550 55, 550 10, 735 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>

          <div className="relative grid grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-8">
            {loading || !data
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-2xl" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-12 w-48" />
                  </div>
                ))
              : steps.map((step, i) => {
                  const Icon = ICON_MAP[step.iconName] ?? MapPin;
                  return (
                    <Reveal key={step.title} delay={i * 100} className="flex flex-col items-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                        <Icon className="h-8 w-8 text-foreground" />
                      </div>
                      <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-3 max-w-xs text-sm text-muted-foreground">{step.description}</p>
                    </Reveal>
                  );
                })}
          </div>
        </div>
      </div>
    </section>
  );
}
