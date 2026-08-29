import { FEATURES } from "@/data/landing";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why choose us
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A high-performing web-based car rental system for any rent-a-car company and website
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <ImagePlaceholder className="h-72 w-full sm:h-96" iconClassName="h-14 w-14" />

          <div className="flex flex-col gap-10">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted">
                  <feature.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
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
