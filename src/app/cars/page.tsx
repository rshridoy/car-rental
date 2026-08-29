import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CarsListing } from "@/components/cars/CarsListing";

export const metadata: Metadata = {
  title: "Browse Cars — Best Auto",
  description: "Browse and filter our full car rental fleet by category and location.",
};

function CarsListingFallback() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<CarsListingFallback />}>
          <CarsListing />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
