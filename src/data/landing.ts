import type { LucideIcon } from "lucide-react";
import { Calendar, Car, MapPin, Phone, Tag } from "lucide-react";

export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "How it Work", href: "#how-it-works" },
  { label: "Rental Details", href: "#deals" },
  { label: "Why Choose Us", href: "#why-choose-us" },
  { label: "Testimonial", href: "#testimonials" },
];

export type ProcessStep = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: MapPin,
    title: "Choose Location",
    description:
      "Aliquam erat volutpat. Integer malesuada turpis id fringilla suscipit. Maecenas ultrices, orci vitae convallis mattis.",
  },
  {
    icon: Calendar,
    title: "Pick-up Date",
    description:
      "Aliquam erat volutpat. Integer malesuada turpis id fringilla suscipit. Maecenas ultrices, orci vitae convallis mattis.",
  },
  {
    icon: Car,
    title: "Book your car",
    description:
      "Aliquam erat volutpat. Integer malesuada turpis id fringilla suscipit. Maecenas ultrices, orci vitae convallis mattis.",
  },
];

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

/** Copy kept verbatim from the design, typo ("Guarantted") included by request. */
export const FEATURES: Feature[] = [
  {
    icon: Phone,
    title: "Customer Support",
    description:
      "Extremely responsive customer support provided by the team at best car rental UK.",
  },
  {
    icon: Tag,
    title: "Best Price Guarantted",
    description:
      "Extremely best prices for all category people offered at the best car rental UK.",
  },
  {
    icon: MapPin,
    title: "Many Location",
    description:
      "Extremely the best location and available near the big cities. Just visit best car rental UK.",
  },
];

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
};

/**
 * The design shows one testimonial repeated across 3 visible cards plus 4
 * pagination dots. To make the carousel mechanically real (sliding window of
 * 3, 4 stop positions) we materialize 6 identical placeholder slides —
 * documented as an assumption in README.md.
 */
export const TESTIMONIALS: Testimonial[] = Array.from({ length: 6 }, (_, i) => ({
  id: `testimonial-${i}`,
  name: "Viezh Robert",
  location: "Warsaw, Poland",
  rating: 4.5,
  quote:
    "Wow... I am very happy to use this VPN. It turned out to be more than my expectations and so far there have been no problems. LaslesVPN always the best.",
}));

export type FooterColumn = {
  title: string;
  links: string[];
};

export const FOOTER_COLUMNS: FooterColumn[] = [
  { title: "About", links: ["How it works", "Featured", "Partnership"] },
  { title: "Community", links: ["Events", "Blog", "Podcast"] },
  { title: "Socials", links: ["Discord", "Instagram", "Twitter"] },
];
