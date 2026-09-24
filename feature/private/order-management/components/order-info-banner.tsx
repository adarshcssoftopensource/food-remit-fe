"use client";

import { Info } from "lucide-react";

interface OrderInfoBannerProps {
  variant?: "employee-start" | "manager-assign" | "processing" | "history" | "requested";
  message?: string;
}

const DEFAULTS: Record<NonNullable<OrderInfoBannerProps["variant"]>, string> = {
  requested:
    "Accept or Reject food requests here. Accepted orders stay in Requested until payment, then move to Pending for assign/start. Rejected orders stay visible with Rejected status.",
  "employee-start":
    "Pending orders can be started by any employee. Once you start an order, it will be marked as Processing and your name will be recorded.",
  "manager-assign":
    "Once you assign an order to an employee, it moves to Processing and appears in that employee's My Orders queue.",
  processing:
    "Orders in Processing have already been started or assigned. Start Order and Assign are locked for other employees.",
  history:
    "Closed orders appear here after pickup verification or abandonment. Final Status shows the outcome; Order Status is always Closed.",
};

export function OrderInfoBanner({ variant = "employee-start", message }: OrderInfoBannerProps) {
  return (
    <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-200">
      <Info className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <p className="leading-relaxed">{message || DEFAULTS[variant]}</p>
    </div>
  );
}
