"use client";

const STATUS_MAP: Record<number, { label: string; colorClass: string; dotClass: string }> = {
  0: {
    label: "Declined / Cancelled",
    colorClass:
      "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
    dotClass: "bg-red-500",
  },
  1: {
    label: "Pending",
    colorClass:
      "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
    dotClass: "bg-amber-500",
  },
  2: {
    label: "Preparing",
    colorClass:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
  3: {
    label: "Out for Delivery",
    colorClass:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300",
    dotClass: "bg-indigo-500",
  },
  4: {
    label: "Out for Delivery",
    colorClass:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300",
    dotClass: "bg-indigo-500",
  },
  5: {
    label: "Accepted / Sent",
    colorClass:
      "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
    dotClass: "bg-blue-500",
  },
  6: {
    label: "Completed",
    colorClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  7: {
    label: "Declined / Cancelled",
    colorClass:
      "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
    dotClass: "bg-red-500",
  },
  8: {
    label: "Paid",
    colorClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
};

const DEFAULT_STATUS = {
  label: "Unknown",
  colorClass:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  dotClass: "bg-slate-500",
};

interface OrderStatusBadgeProps {
  status: number;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { label, colorClass, dotClass } = STATUS_MAP[status] ?? DEFAULT_STATUS;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${colorClass}`}
    >
      <span className={`size-2 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}
