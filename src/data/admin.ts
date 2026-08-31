import { CAR_CATEGORIES, CAR_DEALS, LOCATIONS, type CarCategoryId } from "@/data/deals";

const CUSTOMER_NAMES = [
  "Mike Witzel",
  "Viezh Robert",
  "Sarah Connor",
  "James Bond",
  "Alice Johnson",
  "Robert Chen",
  "Emma Wilson",
  "David Lee",
  "Olivia Brown",
  "Liam Davis",
];

function mockDate(i: number, monthOffset = 0) {
  const month = ((i + monthOffset) % 9) + 1;
  const day = (i % 27) + 1;
  return `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Live counts derived from CAR_DEALS, so newly created products show up immediately. */
export function getCategorySummary() {
  return CAR_CATEGORIES.map((cat) => ({
    ...cat,
    productCount: CAR_DEALS.filter((c) => c.category === cat.id).length,
  }));
}

export function getBrandSummary() {
  const counts = new Map<string, number>();
  for (const car of CAR_DEALS) counts.set(car.brand, (counts.get(car.brand) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, productCount]) => ({ id: name, name, productCount }))
    .sort((a, b) => b.productCount - a.productCount);
}

export type SubCategory = { id: string; name: string; parentCategory: string };

export const SUB_CATEGORIES: SubCategory[] = [
  { id: "sedan", name: "Sedan", parentCategory: "Popular" },
  { id: "hatchback", name: "Hatchback", parentCategory: "Popular" },
  { id: "suv", name: "SUV", parentCategory: "Large Car" },
  { id: "van", name: "Van", parentCategory: "Large Car" },
  { id: "city-car", name: "City Car", parentCategory: "Small Car" },
  { id: "convertible", name: "Convertible", parentCategory: "Exclusive Car" },
  { id: "coupe", name: "Coupe", parentCategory: "Exclusive Car" },
];

export const UNITS = [
  { id: "per-day", name: "Per Day", description: "Standard daily rental rate." },
  { id: "per-week", name: "Per Week", description: "Weekly rate, ~15% discount vs. daily." },
  { id: "per-month", name: "Per Month", description: "Monthly rate, ~30% discount vs. daily." },
  { id: "per-mile", name: "Per Mile", description: "Additional mileage charge beyond the included allowance." },
];

export const VARIANT_ATTRIBUTES = [
  { id: "transmission", name: "Transmission", values: ["Automatic", "Manual"] },
  { id: "fuel", name: "Fuel Type", values: ["Petrol", "Diesel", "Hybrid", "Electric"] },
  { id: "seats", name: "Seats", values: ["4", "5", "7"] },
];

export const WARRANTIES = [
  {
    id: "basic",
    name: "Basic Cover",
    price: 0,
    description: "Standard rental insurance included free with every booking.",
  },
  {
    id: "standard",
    name: "Standard Protection",
    price: 9.99,
    description: "Reduced excess and 24/7 roadside assistance.",
  },
  {
    id: "premium",
    name: "Premium Protection",
    price: 19.99,
    description: "Zero excess, roadside assistance, and a free upgrade when available.",
  },
];

export type InvoiceStatus = "paid" | "unpaid" | "overdue";

export const INVOICES = Array.from({ length: 18 }, (_, i) => ({
  id: `INV-${1000 + i}`,
  customer: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length],
  amount: Math.round((80 + ((i * 57) % 900)) * 100) / 100,
  status: (["paid", "paid", "unpaid", "overdue"] as const)[i % 4] as InvoiceStatus,
  date: mockDate(i),
}));

export type SalesReturnStatus = "pending" | "approved" | "rejected";

const RETURN_REASONS = ["Damaged on arrival", "Wrong vehicle delivered", "Customer changed mind", "Mechanical issue"];

export const SALES_RETURNS = Array.from({ length: 12 }, (_, i) => ({
  id: `RET-${500 + i}`,
  orderId: `#${147784454554 + i * 37}`,
  product: CAR_DEALS[i % CAR_DEALS.length].name,
  reason: RETURN_REASONS[i % RETURN_REASONS.length],
  status: (["pending", "approved", "rejected"] as const)[i % 3] as SalesReturnStatus,
  refundAmount: Math.round((50 + ((i * 83) % 500)) * 100) / 100,
  date: mockDate(i, 2),
}));

export type QuotationStatus = "draft" | "sent" | "accepted" | "expired";

export const QUOTATIONS = Array.from({ length: 10 }, (_, i) => ({
  id: `QUO-${2000 + i}`,
  customer: CUSTOMER_NAMES[(i + 3) % CUSTOMER_NAMES.length],
  carName: CAR_DEALS[(i * 5) % CAR_DEALS.length].name,
  total: Math.round((150 + ((i * 97) % 800)) * 100) / 100,
  status: (["draft", "sent", "accepted", "expired"] as const)[i % 4] as QuotationStatus,
  date: mockDate(i, 4),
}));

export type PromoCode = {
  id: string;
  code: string;
  discountPercent: number;
  expiresAt: string;
  usageCount: number;
  active: boolean;
};

export const INITIAL_PROMO_CODES: PromoCode[] = [
  { id: "promo-1", code: "WELCOME10", discountPercent: 10, expiresAt: "2026-12-31", usageCount: 342, active: true },
  { id: "promo-2", code: "SUMMER20", discountPercent: 20, expiresAt: "2026-09-01", usageCount: 118, active: true },
  { id: "promo-3", code: "WEEKEND15", discountPercent: 15, expiresAt: "2026-07-01", usageCount: 56, active: false },
  { id: "promo-4", code: "FIRSTRIDE", discountPercent: 25, expiresAt: "2026-12-31", usageCount: 890, active: true },
];

export type Offer = {
  id: string;
  title: string;
  discountPercent: number;
  validFrom: string;
  validTo: string;
  active: boolean;
};

export const OFFERS: Offer[] = [
  { id: "offer-1", title: "Long Weekend Getaway", discountPercent: 15, validFrom: "2026-08-01", validTo: "2026-08-31", active: true },
  { id: "offer-2", title: "Business Traveller Discount", discountPercent: 10, validFrom: "2026-01-01", validTo: "2026-12-31", active: true },
  { id: "offer-3", title: "Student Saver", discountPercent: 20, validFrom: "2026-09-01", validTo: "2027-06-30", active: false },
];

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Manager" | "Support" | "Finance";
  status: "active" | "invited";
};

export const ADMIN_USERS: AdminUser[] = [
  { id: "1", name: "Mike Witzel", email: "mike@bestauto.com", role: "Owner", status: "active" },
  { id: "2", name: "Priya Patel", email: "priya@bestauto.com", role: "Manager", status: "active" },
  { id: "3", name: "Tom Becker", email: "tom@bestauto.com", role: "Support", status: "active" },
  { id: "4", name: "Jenna Wu", email: "jenna@bestauto.com", role: "Finance", status: "invited" },
];

const ADJUSTMENT_REASONS = ["Restock", "Damaged unit", "Sold at auction", "Fleet expansion", "Maintenance write-off"];

export const STOCK_ADJUSTMENTS = Array.from({ length: 10 }, (_, i) => ({
  id: `ADJ-${i + 1}`,
  productName: CAR_DEALS[(i * 3) % CAR_DEALS.length].name,
  type: (i % 2 === 0 ? "add" : "remove") as "add" | "remove",
  quantity: (i % 5) + 1,
  reason: ADJUSTMENT_REASONS[i % ADJUSTMENT_REASONS.length],
  date: mockDate(i, 6),
}));

export type StockTransfer = {
  id: string;
  productName: string;
  from: string;
  to: string;
  quantity: number;
  date: string;
};

export const STOCK_TRANSFERS: StockTransfer[] = Array.from({ length: 8 }, (_, i) => ({
  id: `TRF-${i + 1}`,
  productName: CAR_DEALS[(i * 4) % CAR_DEALS.length].name,
  from: LOCATIONS[i % LOCATIONS.length],
  to: LOCATIONS[(i + 2) % LOCATIONS.length],
  quantity: (i % 4) + 1,
  date: mockDate(i, 1),
}));

export type { CarCategoryId };
