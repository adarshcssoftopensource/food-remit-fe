"use client";

import { FINAL_STATUS, getDisplayStatus, getFinalStatusLabel } from "../utils/order-workflow";

const TONE_STYLES: Record<string, { colorClass: string; dotClass: string }> = {
  pending: {
    colorClass:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
    dotClass: "bg-amber-500",
  },
  processing: {
    colorClass:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
    dotClass: "bg-blue-500",
  },
  completed: {
    colorClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  "picked-up": {
    colorClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  abandoned: {
    colorClass:
      "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
    dotClass: "bg-red-500",
  },
  closed: {
    colorClass:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300",
    dotClass: "bg-slate-400",
  },
  other: {
    colorClass:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dotClass: "bg-slate-500",
  },
};

interface OrderStatusBadgeProps {
  status: number;
  assignedEmployeeId?: string | null;
  finalStatus?: number | null;
  /** When true, show Final Status (Picked Up / Abandoned) instead of Closed */
  showFinal?: boolean;
}

export function OrderStatusBadge({
  status,
  assignedEmployeeId,
  finalStatus,
  showFinal = false,
}: OrderStatusBadgeProps) {
  if (showFinal) {
    const label = getFinalStatusLabel(finalStatus) || "—";
    const tone =
      finalStatus === FINAL_STATUS.PICKED_UP
        ? "picked-up"
        : finalStatus === FINAL_STATUS.ABANDONED
          ? "abandoned"
          : "other";
    const { colorClass, dotClass } = TONE_STYLES[tone];
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${colorClass}`}
      >
        <span className={`size-2 rounded-full ${dotClass}`} />
        {label}
      </span>
    );
  }

  const { label, tone } = getDisplayStatus({
    orderStatus: status,
    assignedEmployeeId,
    finalStatus,
  });
  const { colorClass, dotClass } = TONE_STYLES[tone] ?? TONE_STYLES.other;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${colorClass}`}
    >
      <span className={`size-2 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}
