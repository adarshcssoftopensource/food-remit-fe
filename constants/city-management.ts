import { Building2, MapPin, ShieldCheck, Users } from "lucide-react";

export const CITY_MANAGER_STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export const CITY_MANAGER_STATS_CONFIG = [
  {
    key: "total" as const,
    label: "Total Managers",
    Icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    key: "active" as const,
    label: "Active Managers",
    Icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "cities" as const,
    label: "Assigned Cities",
    Icon: MapPin,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    key: "countries" as const,
    label: "Countries Covered",
    Icon: Building2,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];
