"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardStatusBadgeProps {
  status: string;
  className?: string;
  showDot?: boolean;
}

const STATUS_CONFIG_MAP: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
    label: string;
  }
> = {
  // Order statuses
  completed: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200/80 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
    label: "Completed",
  },
  paid: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200/80 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
    label: "Paid",
  },
  requested: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200/80 dark:border-amber-800/60",
    dot: "bg-amber-500",
    label: "Requested",
  },
  "in progress": {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-200/80 dark:border-sky-800/60",
    dot: "bg-sky-500",
    label: "In Progress",
  },
  pending: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200/80 dark:border-amber-800/60",
    dot: "bg-amber-500",
    label: "Pending",
  },
  failed: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200/80 dark:border-rose-800/60",
    dot: "bg-rose-500",
    label: "Failed",
  },
  active: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200/80 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
    label: "Active",
  },
  inactive: {
    bg: "bg-slate-100 dark:bg-slate-800/60",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
    label: "Inactive",
  },
};

export function DashboardStatusBadge({
  status,
  className,
  showDot = true,
}: DashboardStatusBadgeProps) {
  const normalized = (status || "").toLowerCase().trim();
  const config = STATUS_CONFIG_MAP[normalized] || {
    bg: "bg-slate-50 dark:bg-slate-800/50",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
    label: status || "Unknown",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide shadow-2xs",
        config.bg,
        config.text,
        config.border,
        className,
      )}
    >
      {showDot && (
        <span className="relative flex h-1.5 w-1.5">
          {["completed", "paid", "in progress", "active"].includes(normalized) && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                config.dot,
              )}
            />
          )}
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", config.dot)} />
        </span>
      )}
      <span>{config.label}</span>
    </Badge>
  );
}
