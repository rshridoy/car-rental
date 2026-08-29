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

export type CarDeal = {
  id: string;
  name: string;
  pricePerDay: number;
  category: CarCategoryId;
  featured?: boolean;
};

/**
 * The design only shows content for the "Popular" tab (8x "All New Rush"
 * cards, one with a featured/highlighted border). "Large Car" and "Small Car"
 * reuse the same placeholder pattern so the tab filter has real data to
 * switch between. "Exclusive Car" is left empty on purpose to exercise the
 * empty-state requirement — see README.md.
 */
export const CAR_DEALS: CarDeal[] = [
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `popular-${i}`,
    name: "All New Rush",
    pricePerDay: 72,
    category: "popular" as const,
    featured: i === 5,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `large-${i}`,
    name: "All New Rush",
    pricePerDay: 96,
    category: "large" as const,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `small-${i}`,
    name: "All New Rush",
    pricePerDay: 54,
    category: "small" as const,
  })),
];

export const TOTAL_CAR_COUNT = 120;
