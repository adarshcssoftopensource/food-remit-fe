import { Building2, ShieldCheck, Store, User } from "lucide-react";

export const BUSINESS_TYPES = [
  "Independent Grocery Store",
  "Supermarket",
  "Restaurant",
  "Convenience Store",
  "Specialty / Ethnic Grocery Store",
  "Wholesale Distributor",
  "Retail Chain",
  "Franchise",
  "Food Manufacturer",
  "Other",
] as const;

export const NUMBER_OF_LOCATIONS_OPTIONS = [
  "1 Location",
  "2–5 Locations",
  "6–20 Locations",
  "21–100 Locations",
  "100+ Locations",
] as const;

export const WORK_PREFERENCES_OPTIONS = [
  "Sell products through the Food Remit marketplace",
  "Receive customer orders for pickup",
  "Receive customer orders for delivery",
  "Add multiple store locations",
  "Integrate our existing product catalog or POS system",
  "Learn more about becoming a Food Remit partner",
  "Other",
] as const;

export const INVENTORY_MANAGEMENT_OPTIONS = [
  "Manually",
  "POS System",
  "E-commerce Platform",
  "ERP / Inventory System",
  "Spreadsheet / CSV",
  "API / Custom System",
  "Not Sure",
] as const;

export const STEPS = [
  { id: 1, title: "Business Info", icon: Building2 },
  { id: 2, title: "Your Info", icon: User },
  { id: 3, title: "Operations", icon: Store },
  { id: 4, title: "Complete", icon: ShieldCheck },
];
