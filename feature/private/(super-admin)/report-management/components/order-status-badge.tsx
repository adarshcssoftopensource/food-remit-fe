"use client";

import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: number;
  orderType?: number;
  label?: string;
  className?: string;
}

type ToneKey = "red" | "amber" | "sky" | "blue" | "violet" | "emerald" | "slate";

const TONES = {
  red: [
    "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
    "bg-red-500",
  ],
  amber: [
    "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
    "bg-amber-500",
  ],
  sky: [
    "border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400",
    "bg-sky-500",
  ],
  blue: [
    "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
    "bg-blue-500",
  ],
  violet: [
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400",
    "bg-violet-500",
  ],
  emerald: [
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    "bg-emerald-500",
  ],
  slate: [
    "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300",
    "bg-slate-400",
  ],
} as const;

function getOrderStatusAppearance(status: number, orderType?: number, customLabel?: string) {
  const isRequested = orderType === 2;
  let label = customLabel || "Pending";
  let colorClass: string =
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
  let dotClass: string = "bg-slate-500";

  const tone = (colorKey: ToneKey) => {
    [colorClass, dotClass] = TONES[colorKey];
  };

  if (status === 0 || status === 7) {
    label = customLabel || "Declined";
    tone("red");
  } else if (status === 1) {
    label = customLabel || (isRequested ? "Requested" : "Pending");
    tone("amber");
  } else if (status === 10) {
    label = customLabel || "Accepted";
    tone("sky");
  } else if (status === 8) {
    label = customLabel || "Pending";
    tone(label === "Assigned" ? "violet" : "amber");
  } else if (status === 2 || status === 3 || status === 4 || status === 5) {
    label = customLabel || "Processing";
    tone("blue");
  } else if (status === 6) {
    label = customLabel || "Ready for Pickup";
    tone("emerald");
  } else if (status === 11) {
    label = customLabel || "Closed";
    tone(label === "Abandoned" ? "red" : "slate");
  }

  return { label, colorClass, dotClass };
}

export function OrderStatusBadge({
  status,
  orderType,
  label: customLabel,
  className,
}: OrderStatusBadgeProps) {
  const { label, colorClass, dotClass } = getOrderStatusAppearance(status, orderType, customLabel);

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
