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
  pricePerDay: number;
  category: CarCategoryId;
  location: string;
  seats: number;
  transmission: Transmission;
  fuel: Fuel;
  rating: number;
  featured?: boolean;
  description: string;
};

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
  return {
    id,
    name,
    category,
    pricePerDay,
    location: LOCATIONS[i % LOCATIONS.length],
    seats: seatsByCategory[category],
    transmission: i % 3 === 0 ? "Manual" : "Automatic",
    fuel: (["Petrol", "Diesel", "Hybrid", "Electric"] as const)[i % 4],
    rating: Math.round((4 + ((i * 37) % 10) / 10) * 10) / 10,
    featured,
    description: `The ${name} is a well-maintained, recently serviced rental with GPS navigation, air conditioning and unlimited mileage included. Free cancellation up to 24 hours before pick-up.`,
  };
}

/**
 * The first 8 "popular" entries reproduce the design exactly (identical "All
 * New Rush" placeholder cards, one featured) so the landing-page teaser is
 * unchanged. Everything after that — and all of "large"/"small" — is an
 * extended mock catalog added for the /cars listing page, with varied model
 * names, locations and specs so its filters and pagination have something
 * real to work with. "Exclusive Car" is still left empty on purpose to
 * exercise the empty-state UI (see README.md).
 */
export const CAR_DEALS: CarDeal[] = [
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

export const TOTAL_CAR_COUNT = 120;

export function getCarById(id: string) {
  return CAR_DEALS.find((car) => car.id === id);
}
