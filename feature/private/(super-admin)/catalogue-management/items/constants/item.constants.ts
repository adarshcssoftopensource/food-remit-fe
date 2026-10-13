import { CheckCircle, Package, XCircle } from "lucide-react";

export const CATALOGUE_STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
] as const;

export const ITEM_STAT_CONFIG = [
  {
    key: "total" as const,
    label: "Total Items",
    Icon: Package,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    key: "active" as const,
    label: "Active",
    Icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    key: "inactive" as const,
    label: "Inactive",
    Icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
  },
];
