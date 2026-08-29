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

export const STAT_CARDS: StatCard[] = [
  {
    id: "weekly-earning",
    label: "Weekly Earning",
    value: "$95000.45",
    deltaLabel: "48% increase compare to last week",
    tone: "surface",
  },
  {
    id: "total-sales",
    label: "No of Total Sales",
    value: "10,000+",
    tone: "primary",
  },
  {
    id: "purchased-goods",
    label: "No of Purchased Goods",
    value: "800+",
    tone: "navy",
  },
];

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
];

export type TransactionStatus = "success" | "cancelled" | "pending";

export type Transaction = {
  id: number;
  product: string;
  timeLabel: string;
  payment: string;
  reference: string;
  status: TransactionStatus;
  amount: number;
};

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    product: "Range Rover",
    timeLabel: "15 Mins",
    payment: "Paypal",
    reference: "#416645453773",
    status: "success",
    amount: 1099.0,
  },
  {
    id: 2,
    product: "Red Toyota",
    timeLabel: "15 Mins",
    payment: "Apple Pay",
    reference: "#147784454554",
    status: "cancelled",
    amount: 600.55,
  },
  {
    id: 3,
    product: "Blue Nissan",
    timeLabel: "15 Mins",
    payment: "Stripe",
    reference: "#147784454554",
    status: "pending",
    amount: 200.1,
  },
  {
    id: 4,
    product: "Toyota Corolla",
    timeLabel: "15 Mins",
    payment: "PayU",
    reference: "#147784454554",
    status: "success",
    amount: 1569.0,
  },
  {
    id: 5,
    product: "Range Rover",
    timeLabel: "15 Mins",
    payment: "Paytm",
    reference: "#147784454554",
    status: "success",
    amount: 1478.0,
  },
];

export type SalesAnalyticsPoint = {
  month: string;
  sales: number;
};

export const SALES_ANALYTICS: SalesAnalyticsPoint[] = [
  { month: "Jan", sales: 24 },
  { month: "Feb", sales: 19 },
  { month: "Mar", sales: 27 },
  { month: "Apr", sales: 21 },
  { month: "May", sales: 26 },
  { month: "Jun", sales: 34 },
  { month: "Jul", sales: 23 },
  { month: "Aug", sales: 20 },
  { month: "Sep", sales: 18 },
];

export const SALES_BY_COUNTRY = {
  region: "Africa",
  sales: 3455,
  deltaLabel: "48% increase compare to last week",
};
