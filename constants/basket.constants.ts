import type { LucideIcon } from "lucide-react";
import { CalendarHeart, Home, Package, PackagePlus, ShoppingBasket, Users } from "lucide-react";

import type {
  BasketStatus,
  BasketType,
} from "../feature/private/(store-admin)/basket-management/types/basket.types";

export interface BasketTypeOption {
  value: BasketType;
  /** Template name shown on the template card */
  label: string;
  tagline: string;
  /** Short card text */
  description: string;
  /** Prefilled (editable) basket name; empty for Custom */
  defaultName: string;
  /** Prefilled (editable) basket description; empty for Custom */
  defaultDescription: string;
  defaultHouseholdSize?: string;
  highlights: string[];
  icon: LucideIcon;
  badgeClassName: string;
}

export const BASKET_TYPE_OPTIONS: BasketTypeOption[] = [
  {
    value: "BASIC",
    label: "Basic Basket",
    tagline: "For 1–2 people",
    description: "Essential everyday items for individuals and small households.",
    defaultName: "Basic Basket",
    defaultDescription:
      "A selection of everyday essentials, perfect for individuals and small households. Great value and quality products.",
    defaultHouseholdSize: "1-2",
    highlights: ["Staple foods", "Basic toiletries", "Everyday essentials"],
    icon: ShoppingBasket,
    badgeClassName:
      "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900",
  },
  {
    value: "FAMILY",
    label: "Family Essentials",
    tagline: "For 3–5 people",
    description: "Great value staples for families.",
    defaultName: "Family Essentials",
    defaultDescription:
      "A balanced selection of staples and household essentials for the whole family, at great value.",
    defaultHouseholdSize: "3-5",
    highlights: ["Staple foods", "Household essentials", "Snacks & beverages"],
    icon: Users,
    badgeClassName:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
  },
  {
    value: "LARGE_FAMILY",
    label: "Large Family Basket",
    tagline: "For 6+ people",
    description: "More for bigger households at better value.",
    defaultName: "Large Family Basket",
    defaultDescription:
      "Larger quantities of everyday staples and essentials for bigger households, at better value.",
    defaultHouseholdSize: "6+",
    highlights: ["Bulk staple foods", "Household essentials", "Personal care items"],
    icon: Home,
    badgeClassName:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
  },
  {
    value: "MONTHLY_ESSENTIALS",
    label: "Monthly Essentials",
    tagline: "For extended use",
    description: "A complete selection of monthly household essentials.",
    defaultName: "Monthly Essentials",
    defaultDescription:
      "A complete selection of household essentials to cover your core needs for the month.",
    highlights: ["Bulk staple foods", "Household supplies", "Great value for monthly use"],
    icon: Package,
    badgeClassName:
      "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900",
  },
  {
    value: "SEASONAL",
    label: "Seasonal Basket",
    tagline: "For special occasions",
    description: "Fresh seasonal items for the current time of year.",
    defaultName: "Seasonal Basket",
    defaultDescription:
      "Fresh seasonal favourites and holiday treats, selected for the current time of year.",
    highlights: ["Holiday foods", "Specialty items", "Snacks & treats"],
    icon: CalendarHeart,
    badgeClassName:
      "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900",
  },
  {
    value: "CUSTOM",
    label: "Custom Basket",
    tagline: "Build your own",
    description: "Build your own basket with a custom selection of items.",
    defaultName: "",
    defaultDescription: "",
    highlights: ["Choose any items", "Set your own quantities", "Full flexibility"],
    icon: PackagePlus,
    badgeClassName:
      "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  },
];

export const BASKET_TYPE_MAP = Object.fromEntries(
  BASKET_TYPE_OPTIONS.map((option) => [option.value, option]),
) as Record<BasketType, BasketTypeOption>;

export const HOUSEHOLD_SIZE_OPTIONS = [
  { value: "1-2", label: "1–2 people" },
  { value: "3-5", label: "3–5 people" },
  { value: "6+", label: "6+ people" },
];

export function formatHouseholdSize(value?: string | null): string {
  return HOUSEHOLD_SIZE_OPTIONS.find((o) => o.value === value)?.label ?? value ?? "—";
}

export const BASKET_STATUS_META: Record<
  BasketStatus,
  {
    label: string;
    description: string;
    /** Customer visibility shown in the list "Availability" column */
    visibility: string;
    className: string;
    dotClassName: string;
  }
> = {
  ACTIVE: {
    label: "Active",
    description: "Published and visible to customers within its availability schedule.",
    visibility: "Visible to customers",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
    dotClassName: "bg-emerald-500",
  },
  DRAFT: {
    label: "Draft",
    description: "Saved but not published. Can be edited and published when complete.",
    visibility: "Not visible to customers",
    className:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
    dotClassName: "bg-amber-500",
  },
  INACTIVE: {
    label: "Inactive",
    description: "Hidden from customers manually or by schedule. Can be reactivated anytime.",
    visibility: "Hidden from customers",
    className:
      "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    dotClassName: "bg-slate-400",
  },
};

export const BASKET_NAME_MAX = 80;
export const BASKET_SHORT_DESCRIPTION_MAX = 100;
export const BASKET_DESCRIPTION_MAX = 500;
export const BASKET_ITEM_QUANTITY_MAX = 99;
export const BASKET_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const BASKET_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

export const BASKET_DISCOUNT_PERCENT_MAX = 90;

export type BasketWeekday = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export const BASKET_WEEKDAYS: { value: BasketWeekday; label: string }[] = [
  { value: "MON", label: "Mon" },
  { value: "TUE", label: "Tue" },
  { value: "WED", label: "Wed" },
  { value: "THU", label: "Thu" },
  { value: "FRI", label: "Fri" },
  { value: "SAT", label: "Sat" },
  { value: "SUN", label: "Sun" },
];

/** Food Remit basket image library (files in `public/images/baskets/library`) */
export const BASKET_LIBRARY_IMAGES = [
  { key: "basic", label: "Everyday Essentials" },
  { key: "family", label: "Family Staples" },
  { key: "large-family", label: "Large Family" },
  { key: "monthly-essentials", label: "Monthly Essentials" },
  { key: "seasonal", label: "Seasonal" },
  { key: "custom", label: "Mixed Groceries" },
  { key: "fresh-produce", label: "Fresh Produce" },
  { key: "pantry-staples", label: "Pantry Staples" },
] as const;

const TEMPLATE_IMAGE_KEYS: Record<BasketType, string> = {
  BASIC: "basic",
  FAMILY: "family",
  LARGE_FAMILY: "large-family",
  MONTHLY_ESSENTIALS: "monthly-essentials",
  SEASONAL: "seasonal",
  CUSTOM: "custom",
};

export function templateImageKey(type: BasketType): string {
  return TEMPLATE_IMAGE_KEYS[type];
}

export function getLibraryImage(key: string): string {
  return `/images/baskets/library/${key}.jpg`;
}

/** Artwork for the template cards on the first Create Basket step (`public/images/baskets/templates`) */
export function getTemplateImage(type: BasketType): string {
  return `/images/baskets/templates/${TEMPLATE_IMAGE_KEYS[type]}.jpg`;
}

export function getDefaultBasketImage(type: BasketType): string {
  return getLibraryImage(TEMPLATE_IMAGE_KEYS[type]);
}

/** Library image shown when no custom image is uploaded */
export function getBasketFallbackImage(basket: {
  libraryImage?: string | null;
  basketType: BasketType;
}): string {
  return basket.libraryImage
    ? getLibraryImage(basket.libraryImage)
    : getDefaultBasketImage(basket.basketType);
}

export function getBasketImage(basket: {
  image?: string | null;
  libraryImage?: string | null;
  basketType: BasketType;
}): string {
  return basket.image || getBasketFallbackImage(basket);
}
