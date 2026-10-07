import type { LucideIcon } from "lucide-react";
import { CalendarHeart, Home, Package, PackagePlus, ShoppingBasket, Users } from "lucide-react";

import type {
  BasketStatus,
  BasketType,
} from "../feature/private/(store-admin)/basket-management/types/basket.types";

export interface BasketTypeOption {
  value: BasketType;
  label: string;
  tagline: string;
  description: string;
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
    description: "Essential items for individuals or small households.",
    defaultHouseholdSize: "1-2",
    highlights: ["Staple foods", "Basic toiletries", "Everyday essentials"],
    icon: ShoppingBasket,
    badgeClassName:
      "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900",
  },
  {
    value: "FAMILY",
    label: "Family Basket",
    tagline: "For 3–5 people",
    description: "A balanced selection for medium-sized families.",
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
    description: "More items and larger quantities for bigger families.",
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
    description: "Larger quantities to cover core needs for several weeks.",
    highlights: ["Bulk staple foods", "Household supplies", "Great value for monthly use"],
    icon: Package,
    badgeClassName:
      "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900",
  },
  {
    value: "SEASONAL",
    label: "Seasonal / Holiday",
    tagline: "For special occasions",
    description: "Special items for holidays and seasonal needs.",
    highlights: ["Holiday foods", "Specialty items", "Snacks & treats"],
    icon: CalendarHeart,
    badgeClassName:
      "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900",
  },
  {
    value: "CUSTOM",
    label: "Custom Basket",
    tagline: "Build your own",
    description: "Create a unique basket with your own selection of items.",
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
  { label: string; description: string; className: string; dotClassName: string }
> = {
  ACTIVE: {
    label: "Active",
    description: "Live and available to customers",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
    dotClassName: "bg-emerald-500",
  },
  DRAFT: {
    label: "Draft",
    description: "Not published yet",
    className:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
    dotClassName: "bg-amber-500",
  },
  INACTIVE: {
    label: "Inactive",
    description: "Published but hidden from customers",
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

const DEFAULT_IMAGE_FILES: Record<BasketType, string> = {
  BASIC: "basic",
  FAMILY: "family",
  LARGE_FAMILY: "large-family",
  MONTHLY_ESSENTIALS: "monthly-essentials",
  SEASONAL: "seasonal",
  CUSTOM: "custom",
};

export function getDefaultBasketImage(type: BasketType): string {
  return `/images/baskets/${DEFAULT_IMAGE_FILES[type]}.jpg`;
}

export function getBasketImage(basket: { image?: string | null; basketType: BasketType }): string {
  return basket.image || getDefaultBasketImage(basket.basketType);
}
