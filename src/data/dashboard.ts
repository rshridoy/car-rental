import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  Badge as BadgeIcon,
  Barcode,
  ClipboardList,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  Megaphone,
  Package,
  PackageMinus,
  PackagePlus,
  PackageX,
  Percent,
  QrCode,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Store,
  Tag,
  Tags,
  RotateCcw,
  Warehouse,
} from "lucide-react";

export type SidebarItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  expandable?: boolean;
  active?: boolean;
};

export type SidebarGroup = {
  title: string;
  items: SidebarItem[];
};

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
      { label: "Super Admin", icon: ShieldCheck, href: "/dashboard/super-admin", expandable: true },
    ],
  },
  {
    title: "Inventory",
    items: [
      { label: "Products", icon: Package, href: "/dashboard/products" },
      { label: "Create Product", icon: PackagePlus, href: "/dashboard/products/create" },
      { label: "Expired Products", icon: PackageX, href: "/dashboard/products/expired" },
      { label: "Low Stocks", icon: PackageMinus, href: "/dashboard/products/low-stock" },
      { label: "Category", icon: Tags, href: "/dashboard/category" },
      { label: "Sub Category", icon: Tag, href: "/dashboard/sub-category" },
      { label: "Brands", icon: BadgeIcon, href: "/dashboard/brands" },
      { label: "Units", icon: Ruler, href: "/dashboard/units" },
      { label: "Variant Attributes", icon: SlidersHorizontal, href: "/dashboard/variant-attributes" },
      { label: "Warranties", icon: FileCheck2, href: "/dashboard/warranties" },
      { label: "Print Barcode", icon: Barcode, href: "/dashboard/print-barcode" },
      { label: "Print QR Code", icon: QrCode, href: "/dashboard/print-qr-code" },
    ],
  },
  {
    title: "Stock",
    items: [
      { label: "Manage Stock", icon: Warehouse, href: "/dashboard/stock" },
      { label: "Stock Adjustment", icon: ClipboardList, href: "/dashboard/stock/adjustment" },
      { label: "Stock Transfer", icon: ArrowLeftRight, href: "/dashboard/stock/transfer" },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Sales", icon: ShoppingCart, href: "/dashboard/sales", expandable: true },
      { label: "Invoices", icon: FileText, href: "/dashboard/invoices" },
      { label: "Sales Return", icon: RotateCcw, href: "/dashboard/sales-return" },
      { label: "Quotation", icon: FileSpreadsheet, href: "/dashboard/quotation" },
      { label: "POS", icon: Store, href: "/dashboard/pos", expandable: true },
    ],
  },
  {
    title: "Promo",
    items: [
      { label: "Promo Codes", icon: Megaphone, href: "/dashboard/promo/codes" },
      { label: "Offers", icon: Percent, href: "/dashboard/promo/offers" },
    ],
  },
];

export type StatCard = {
  id: string;
  label: string;
  value: string;
  deltaLabel?: string;
  tone: "surface" | "primary" | "navy";
};

export type DateRangeId = "this-week" | "last-week" | "this-month" | "last-month";

export const DATE_RANGES: { id: DateRangeId; label: string; dateLabel: string; maxDaysAgo: number; minDaysAgo: number }[] = [
  { id: "this-week", label: "This Week", dateLabel: "01 Jan 2024 - 07 Jan 2024", minDaysAgo: 0, maxDaysAgo: 7 },
  { id: "last-week", label: "Last Week", dateLabel: "25 Dec 2023 - 31 Dec 2023", minDaysAgo: 7, maxDaysAgo: 14 },
  { id: "this-month", label: "This Month", dateLabel: "01 Jan 2024 - 31 Jan 2024", minDaysAgo: 0, maxDaysAgo: 31 },
  { id: "last-month", label: "Last Month", dateLabel: "01 Dec 2023 - 31 Dec 2023", minDaysAgo: 31, maxDaysAgo: 62 },
];

export const STAT_CARDS_BY_RANGE: Record<DateRangeId, StatCard[]> = {
  "this-week": [
    { id: "weekly-earning", label: "Weekly Earning", value: "$95000.45", deltaLabel: "48% increase compare to last week", tone: "surface" },
    { id: "total-sales", label: "No of Total Sales", value: "10,000+", tone: "primary" },
    { id: "purchased-goods", label: "No of Purchased Goods", value: "800+", tone: "navy" },
  ],
  "last-week": [
    { id: "weekly-earning", label: "Weekly Earning", value: "$64230.10", deltaLabel: "12% decrease compare to the week before", tone: "surface" },
    { id: "total-sales", label: "No of Total Sales", value: "7,200+", tone: "primary" },
    { id: "purchased-goods", label: "No of Purchased Goods", value: "540+", tone: "navy" },
  ],
  "this-month": [
    { id: "monthly-earning", label: "Monthly Earning", value: "$412500.90", deltaLabel: "22% increase compare to last month", tone: "surface" },
    { id: "total-sales", label: "No of Total Sales", value: "38,500+", tone: "primary" },
    { id: "purchased-goods", label: "No of Purchased Goods", value: "3,100+", tone: "navy" },
  ],
  "last-month": [
    { id: "monthly-earning", label: "Monthly Earning", value: "$337800.20", deltaLabel: "6% increase compare to the month before", tone: "surface" },
    { id: "total-sales", label: "No of Total Sales", value: "31,900+", tone: "primary" },
    { id: "purchased-goods", label: "No of Purchased Goods", value: "2,640+", tone: "navy" },
  ],
};

export type BestSellerItem = {
  id: string;
  name: string;
  price: number;
  sales: number;
};

export const BEST_SELLERS: BestSellerItem[] = [
  { id: "range-rover", name: "Range Rover", price: 260, sales: 6547 },
  { id: "audi-s3", name: "Audi S3", price: 1474, sales: 3474 },
  { id: "blue-nissan", name: "Blue Nissan", price: 8784, sales: 1478 },
  { id: "toyota-corolla", name: "Toyota Corolla", price: 3240, sales: 987 },
  { id: "compact-car", name: "Compact car", price: 597, sales: 784 },
  { id: "vw-golf", name: "VW Golf", price: 1120, sales: 612 },
  { id: "mini-cooper", name: "Mini Cooper", price: 890, sales: 401 },
  { id: "bmw-3-series", name: "BMW 3 Series", price: 2650, sales: 355 },
];

export type TransactionStatus = "success" | "cancelled" | "pending";

export type Transaction = {
  id: number;
  product: string;
  timeLabel: string;
  daysAgo: number;
  payment: string;
  reference: string;
  status: TransactionStatus;
  amount: number;
};

const PAYMENTS = ["Paypal", "Apple Pay", "Stripe", "PayU", "Paytm", "Google Pay", "Bank Transfer"];
const PRODUCTS = [
  "Range Rover",
  "Red Toyota",
  "Blue Nissan",
  "Toyota Corolla",
  "Audi S3",
  "Mini Cooper",
  "VW Golf",
  "BMW 3 Series",
  "Fiat 500",
  "Ford Focus",
];
const STATUS_CYCLE: TransactionStatus[] = ["success", "success", "pending", "success", "cancelled"];

export const RECENT_TRANSACTIONS: Transaction[] = Array.from({ length: 24 }, (_, i) => {
  const daysAgo = [0, 0, 1, 2, 3, 5, 6, 8, 10, 13][i % 10] + Math.floor(i / 10) * 20;
  return {
    id: i + 1,
    product: PRODUCTS[i % PRODUCTS.length],
    timeLabel: daysAgo === 0 ? "15 Mins" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`,
    daysAgo,
    payment: PAYMENTS[i % PAYMENTS.length],
    reference: `#${147784454554 + i * 37}`,
    status: STATUS_CYCLE[i % STATUS_CYCLE.length],
    amount: Math.round((150 + ((i * 173) % 1400)) * 100) / 100,
  };
});

export type SalesAnalyticsPoint = {
  month: string;
  sales: number;
};

export const SALES_ANALYTICS_BY_YEAR: Record<string, SalesAnalyticsPoint[]> = {
  "2024": [
    { month: "Jan", sales: 24 }, { month: "Feb", sales: 19 }, { month: "Mar", sales: 27 },
    { month: "Apr", sales: 21 }, { month: "May", sales: 26 }, { month: "Jun", sales: 34 },
    { month: "Jul", sales: 23 }, { month: "Aug", sales: 20 }, { month: "Sep", sales: 18 },
  ],
  "2023": [
    { month: "Jan", sales: 18 }, { month: "Feb", sales: 22 }, { month: "Mar", sales: 20 },
    { month: "Apr", sales: 25 }, { month: "May", sales: 30 }, { month: "Jun", sales: 28 },
    { month: "Jul", sales: 33 }, { month: "Aug", sales: 29 }, { month: "Sep", sales: 24 },
  ],
  "2022": [
    { month: "Jan", sales: 12 }, { month: "Feb", sales: 14 }, { month: "Mar", sales: 16 },
    { month: "Apr", sales: 15 }, { month: "May", sales: 19 }, { month: "Jun", sales: 22 },
    { month: "Jul", sales: 20 }, { month: "Aug", sales: 18 }, { month: "Sep", sales: 21 },
  ],
  "2021": [
    { month: "Jan", sales: 10 }, { month: "Feb", sales: 11 }, { month: "Mar", sales: 13 },
    { month: "Apr", sales: 12 }, { month: "May", sales: 14 }, { month: "Jun", sales: 16 },
    { month: "Jul", sales: 15 }, { month: "Aug", sales: 17 }, { month: "Sep", sales: 19 },
  ],
};

export type CountryPeriodId = "this-week" | "this-month" | "this-year";

export const COUNTRY_PERIODS: { id: CountryPeriodId; label: string }[] = [
  { id: "this-week", label: "This Week" },
  { id: "this-month", label: "This Month" },
  { id: "this-year", label: "This Year" },
];

export const SALES_BY_COUNTRY_BY_PERIOD: Record<CountryPeriodId, { region: string; sales: number; deltaLabel: string }> = {
  "this-week": { region: "Africa", sales: 3455, deltaLabel: "48% increase compare to last week" },
  "this-month": { region: "Europe", sales: 15820, deltaLabel: "17% increase compare to last month" },
  "this-year": { region: "Asia", sales: 182300, deltaLabel: "34% increase compare to last year" },
};
