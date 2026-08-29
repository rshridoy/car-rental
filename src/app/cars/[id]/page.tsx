import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Fuel, Gauge, MapPin, Star, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Badge } from "@/components/ui/badge";
import { getCarById } from "@/data/deals";
import { BookingPanel } from "@/components/cars/BookingPanel";
import { WishlistButton } from "@/components/cars/WishlistButton";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const car = getCarById(id);
  return {
    title: car ? `${car.name} — Best Auto` : "Car not found — Best Auto",
    description: car?.description,
  };
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = getCarById(id);

  if (!car) notFound();

  return (
    <div className="flex flex-1 flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/cars" className="hover:text-foreground">
              Cars
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{car.name}</span>
          </nav>

          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{car.name}</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {car.location}
                    <span aria-hidden="true">•</span>
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    {car.rating}
                  </p>
                </div>
                <WishlistButton carId={car.id} carName={car.name} />
              </div>

              <ImagePlaceholder className="mt-6 h-72 w-full sm:h-96" iconClassName="h-16 w-16" label={car.name} />

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {car.seats} seats
                </Badge>
                <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                  <Gauge className="h-3.5 w-3.5" />
                  {car.transmission}
                </Badge>
                <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                  <Fuel className="h-3.5 w-3.5" />
                  {car.fuel}
                </Badge>
                <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Unlimited mileage
                </Badge>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-foreground">About this car</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{car.description}</p>
              </div>
            </div>

            <BookingPanel car={car} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
