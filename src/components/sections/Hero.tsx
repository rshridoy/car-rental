import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { BookingSearchBar } from "@/components/sections/BookingSearchBar";

export function Hero() {
  return (
    <section className="relative bg-surface-muted pb-32 sm:pb-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pt-8 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pt-16">
        <div>
          <p className="text-sm text-muted-foreground">100% Trusted Car rental platform in the UK</p>
          <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight text-foreground uppercase sm:text-5xl lg:text-[3.4rem]">
            Fast and easy way to rent a car
          </h1>
          <p className="mt-6 max-w-md text-muted-foreground">
            Our Car Rental online booking system designed to meet the specific needs of car
            rental business owners. This easy-to-use car rental software will let you manage.
          </p>
          <div className="mt-8 flex items-center gap-8">
            <Button size="lg" className="rounded-xl px-7 py-6 text-sm">
              Booking Now
            </Button>
            <a
              href="#deals"
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              See all cars
            </a>
          </div>
        </div>

        <ImagePlaceholder className="h-72 w-full sm:h-96 lg:h-[26rem]" iconClassName="h-16 w-16" />
      </div>

      <div className="absolute inset-x-0 bottom-0 translate-y-1/2 px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <BookingSearchBar />
        </div>
      </div>
    </section>
  );
}
