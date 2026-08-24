import { Shield, ShieldCheck, ShieldOff, UserCog } from "lucide-react";

export const SUB_ADMIN_STAT_CONFIG = [
  {
    key: "subAdmins" as const,
    label: "Total Sub Admins",
    Icon: UserCog,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    key: "coAdmins" as const,
    label: "Total Co Admins",
    Icon: UserCog,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    key: "active" as const,
    label: "Active",
    Icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "inactive" as const,
    label: "Inactive",
    Icon: ShieldOff,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    key: "permissions" as const,
    label: "Avg. Permissions",
    Icon: Shield,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

export const SUB_ADMIN_STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
] as const;

export const colorMap: Record<string, string> = {
  primary: "bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary/90",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
};
