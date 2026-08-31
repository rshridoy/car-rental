export type CarCategoryId = "popular" | "large" | "small" | "exclusive";

export type CarCategory = {
  id: CarCategoryId;
  label: string;
};

export const CAR_CATEGORIES: CarCategory[] = [
  { id: "popular", label: "Popular" },
  { id: "large", label: "Large Car" },
  { id: "small", label: "Small Car" },
  { id: "exclusive", label: "Exclusive Car" },
];

export const LOCATIONS = ["London", "Manchester", "Birmingham", "Leeds", "Glasgow"] as const;

export type Transmission = "Automatic" | "Manual";
export type Fuel = "Petrol" | "Diesel" | "Electric" | "Hybrid";

export type CarDeal = {
  id: string;
  name: string;
  brand: string;
  pricePerDay: number;
  category: CarCategoryId;
  location: string;
  seats: number;
  transmission: Transmission;
  fuel: Fuel;
  rating: number;
  featured?: boolean;
  description: string;
  /** Admin-side inventory fields (used by /dashboard/products*). */
  stock: number;
  expired?: boolean;
  expiryDate?: string;
};

const LOW_STOCK_THRESHOLD = 5;

const BRAND_OVERRIDES: Record<string, string> = {
  "All New Rush": "Rush Motors",
  "VW Up!": "Volkswagen",
  "VW Golf": "Volkswagen",
};

function deriveBrand(name: string): string {
  return BRAND_OVERRIDES[name] ?? name.split(" ")[0];
}

function buildCar(
  id: string,
  name: string,
  category: CarCategoryId,
  pricePerDay: number,
  i: number,
  featured = false
): CarDeal {
  const seatsByCategory: Record<CarCategoryId, number> = {
    popular: 5,
    large: 7,
    small: 4,
    exclusive: 4,
  };
  const stock = (i * 3 + (name.length % 5)) % 24;
  const expired = i % 11 === 0 && i > 0;

  return {
    id,
    name,
    brand: deriveBrand(name),
    category,
    pricePerDay,
    location: LOCATIONS[i % LOCATIONS.length],
    seats: seatsByCategory[category],
    transmission: i % 3 === 0 ? "Manual" : "Automatic",
    fuel: (["Petrol", "Diesel", "Hybrid", "Electric"] as const)[i % 4],
    rating: Math.round((4 + ((i * 37) % 10) / 10) * 10) / 10,
    featured,
    description: `The ${name} is a well-maintained, recently serviced rental with GPS navigation, air conditioning and unlimited mileage included. Free cancellation up to 24 hours before pick-up.`,
    stock,
    expired,
    expiryDate: expired ? "2026-06-15" : undefined,
  };
}

export { LOW_STOCK_THRESHOLD };

function buildInitialCarDeals(): CarDeal[] {
  return [
    ...Array.from({ length: 8 }, (_, i) => buildCar(`popular-${i}`, "All New Rush", "popular", 72, i, i === 5)),
    ...[
      "Toyota Corolla",
      "Honda Civic",
      "Ford Focus",
      "Nissan Note",
      "Hyundai i20",
      "Kia Rio",
      "Vauxhall Corsa",
      "Skoda Fabia",
      "Renault Clio",
      "Peugeot 208",
      "SEAT Ibiza",
      "Mazda 2",
    ].map((name, i) => buildCar(`popular-extra-${i}`, name, "popular", 58 + (i % 5) * 6, i + 8)),
    ...["Range Rover Sport", "Audi Q7", "BMW X5", "Volvo XC90", "Land Rover Discovery", "Mercedes GLE", "Kia Sorento"].map(
      (name, i) => buildCar(`large-${i}`, name, "large", 96 + (i % 4) * 10, i)
    ),
    ...["Fiat 500", "Mini Cooper", "Smart ForTwo", "VW Up!", "Toyota Aygo", "Kia Picanto"].map((name, i) =>
      buildCar(`small-${i}`, name, "small", 42 + (i % 3) * 6, i)
    ),
  ];
}

declare global {
  var __bestAutoCarDeals: CarDeal[] | undefined;
}

/**
 * The first 8 "popular" entries reproduce the design exactly (identical "All
 * New Rush" placeholder cards, one featured) so the landing-page teaser is
 * unchanged. Everything after that — and all of "large"/"small" — is an
 * extended mock catalog added for the /cars listing page, with varied model
 * names, locations and specs so its filters and pagination have something
 * real to work with. "Exclusive Car" is still left empty on purpose to
 * exercise the empty-state UI (see README.md).
 *
 * Backed by `globalThis` rather than a plain module-level binding: Next.js
 * can bundle each route (API routes, pages) as a separate module instance in
 * production, which would otherwise give each one its own disconnected copy
 * of this array — mutations via `createCar` (POST /api/cars) would silently
 * not show up on pages that read `CAR_DEALS` directly. `globalThis` is the
 * one thing guaranteed to be a true singleton across the whole process.
 */
export const CAR_DEALS: CarDeal[] = globalThis.__bestAutoCarDeals ?? (globalThis.__bestAutoCarDeals = buildInitialCarDeals());

export const TOTAL_CAR_COUNT = 120;

export function getCarById(id: string) {
  return CAR_DEALS.find((car) => car.id === id);
}

/**
 * Appends a new car to the in-memory catalog (used by the "Create Product"
 * admin page and the topbar "Add New" dialog). This mutates the module-level
 * array directly — it's a real mutation for the lifetime of the server
 * process, not persisted to disk, and resets on restart.
 */
export function createCar(input: {
  name: string;
  category: CarCategoryId;
  pricePerDay: number;
  location?: string;
  seats?: number;
  transmission?: Transmission;
  fuel?: Fuel;
  stock?: number;
}): CarDeal {
  const id = `${input.category}-custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const seatsByCategory: Record<CarCategoryId, number> = {
    popular: 5,
    large: 7,
    small: 4,
    exclusive: 4,
  };

  const car: CarDeal = {
    id,
    name: input.name,
    brand: deriveBrand(input.name),
    category: input.category,
    pricePerDay: input.pricePerDay,
    location: input.location ?? LOCATIONS[0],
    seats: input.seats ?? seatsByCategory[input.category],
    transmission: input.transmission ?? "Automatic",
    fuel: input.fuel ?? "Petrol",
    rating: 4.5,
    stock: input.stock ?? 10,
    description: `The ${input.name} is a well-maintained, recently serviced rental with GPS navigation, air conditioning and unlimited mileage included. Free cancellation up to 24 hours before pick-up.`,
  };

  CAR_DEALS.push(car);
  return car;
}
