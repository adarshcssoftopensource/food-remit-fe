"use client";

import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: number;
  orderType?: number;
  label?: string;
  className?: string;
}

export function OrderStatusBadge({
  status,
  orderType,
  label: customLabel,
  className,
}: OrderStatusBadgeProps) {
  const isRequested = orderType === 2;
  let label = customLabel || "Pending";
  let colorClass =
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
  let dotClass = "bg-slate-500";

  if (status === 0 || status === 7) {
    label = "Declined";
    colorClass =
      "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400";
    dotClass = "bg-red-500";
  } else if (status === 1) {
    label = isRequested ? "Requested" : "Pending";
    colorClass =
      "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400";
    dotClass = "bg-amber-500";
  } else if (status === 2) {
    label = "Preparing";
    colorClass =
      "border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400";
    dotClass = "bg-sky-500";
  } else if (status === 5) {
    label = isRequested ? "Accepted" : "Sent";
    colorClass =
      "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400";
    dotClass = "bg-blue-500";
  } else if (status === 6 || status === 8 || status === 3) {
    label = status === 8 ? "Paid" : "Completed";
    colorClass =
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400";
    dotClass = "bg-emerald-500";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        colorClass,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotClass)} />
      {label}
    </span>
  );
}
