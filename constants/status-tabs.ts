import type { LucideIcon } from "lucide-react";
import { Layers, CheckCircle2, XCircle } from "lucide-react";

export type StatusTabValue = "all" | "ACTIVE" | "INACTIVE";

export interface StatusTabItem {
  label: string;
  value: StatusTabValue;
  icon: LucideIcon;
  dotColor: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
}

export const STATUS_TAB_ITEMS: readonly StatusTabItem[] = [
  {
    label: "All",
    value: "all",
    icon: Layers,
    dotColor: "bg-slate-400 dark:bg-slate-500",
    badgeVariant: "secondary",
  },
  {
    label: "Active",
    value: "ACTIVE",
    icon: CheckCircle2,
    dotColor: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    badgeVariant: "default",
  },
  {
    label: "Inactive",
    value: "INACTIVE",
    icon: XCircle,
    dotColor: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]",
    badgeVariant: "destructive",
  },
] as const;

export function getStatusTabCount(
  tab: StatusTabValue,
  stats?: { total?: number; active?: number; inactive?: number },
): number | undefined {
  if (!stats) return undefined;
  switch (tab) {
    case "all":
      return stats.total;
    case "ACTIVE":
      return stats.active;
    case "INACTIVE":
      return stats.inactive;
    default:
      return undefined;
  }
}
