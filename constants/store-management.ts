import { Store, CheckCircle2, TrendingUp, MapPin } from "lucide-react";

export const STORE_STAT_CONFIG = [
  {
    key: "total" as const,
    label: "Total Stores",
    Icon: Store,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    key: "active" as const,
    label: "Active Stores",
    Icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "inactive" as const,
    label: "Inactive Stores",
    Icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    key: "cities" as const,
    label: "Cities Covered",
    Icon: MapPin,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
] as const;
