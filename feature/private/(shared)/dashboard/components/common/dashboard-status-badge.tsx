"use client";

import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG_MAP } from "@/constants/dashboard";
import { cn } from "@/lib/utils";

interface DashboardStatusBadgeProps {
  status: string;
  className?: string;
  showDot?: boolean;
}

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
