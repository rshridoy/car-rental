"use client";

import { useCallback, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TESTIMONIALS } from "@/data/landing";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const VISIBLE = 3;
const STOPS = TESTIMONIALS.length - VISIBLE + 1;

export function Testimonials() {
  const [start, setStart] = useState(0);

  const goTo = useCallback((index: number) => {
    setStart(Math.max(0, Math.min(index, STOPS - 1)));
  }, []);

  const visibleTestimonials = TESTIMONIALS.slice(start, start + VISIBLE);

  return (
    <section id="testimonials" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 text-center lg:px-10">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Thousands of
            <br />
            Happy Customer
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A high-performing web-based car rental system for any rent-a-car company and website
          </p>
        </Reveal>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") goTo(start + 1);
            if (e.key === "ArrowLeft") goTo(start - 1);
          }}
          className="mt-14 rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
            {visibleTestimonials.map((t) => (
              <div
                key={t.id}
                role="group"
                aria-roledescription="slide"
                className="rounded-2xl bg-surface-muted p-6"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.location}</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    {t.rating}
                  </span>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div role="tablist" aria-label="Testimonial pages" className="flex items-center gap-2">
            {Array.from({ length: STOPS }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === start}
                aria-label={`Go to testimonial slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === start ? "w-8 bg-foreground" : "w-2 bg-border"
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => goTo(start - 1)}
              disabled={start === 0}
              aria-label="Previous testimonials"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => goTo(start + 1)}
              disabled={start === STOPS - 1}
              aria-label="Next testimonials"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
