"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, PackageCheck, UserX } from "lucide-react";

interface OrderStatusBadgeProps {
  status: number;
  label: string;
  className?: string;
  showIcon?: boolean;
}

export function OrderStatusBadge({
  status,
  label,
  className,
  showIcon = true,
}: OrderStatusBadgeProps) {
  // Completed / Delivered / Paid
  if (status === 3 || status === 6) {
    return (
      <Badge
        className={cn(
          "gap-1.5 rounded-full border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 shadow-2xs dark:text-emerald-400",
          className,
        )}
      >
        {showIcon && <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />}
        <span>{label}</span>
      </Badge>
    );
  }

  // Pending / Placed / In Progress
  if (status === 1) {
    return (
      <Badge
        className={cn(
          "gap-1.5 rounded-full border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 shadow-2xs dark:text-amber-400",
          className,
        )}
      >
        {showIcon && <Clock className="size-3 text-amber-600 dark:text-amber-400" />}
        <span>{label}</span>
      </Badge>
    );
  }

  // Ready / Handed Over / Processing
  if (status === 2 || status === 5) {
    return (
      <Badge
        className={cn(
          "gap-1.5 rounded-full border-blue-500/25 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700 shadow-2xs dark:text-blue-400",
          className,
        )}
      >
        {showIcon && <PackageCheck className="size-3 text-blue-600 dark:text-blue-400" />}
        <span>{label}</span>
      </Badge>
    );
  }

  // Cancelled / Declined / Rejected
  return (
    <Badge
      className={cn(
        "gap-1.5 rounded-full border-rose-500/25 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-700 shadow-2xs dark:text-rose-400",
        className,
      )}
    >
      {showIcon && <UserX className="size-3 text-rose-600 dark:text-rose-400" />}
      <span>{label}</span>
    </Badge>
  );
}
