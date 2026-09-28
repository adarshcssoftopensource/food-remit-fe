"use client";

import { Info } from "lucide-react";

interface OrderInfoBannerProps {
  variant?: "employee-start" | "manager-assign" | "processing" | "history" | "requested";
  message?: string;
}

const DEFAULTS: Record<NonNullable<OrderInfoBannerProps["variant"]>, string> = {
  requested:
    "Food requests are accepted or rejected on the mobile app. Here you only track status — Requested, Accepted (awaiting payment), or Rejected. After payment, Accepted orders move to Pending.",
  "employee-start":
    "Pending orders can be started by any employee. Orders assigned to you by a manager appear as Assigned — tap Start Order to move them to Processing. Your name will be recorded.",
  "manager-assign":
    "Once you assign an order to an employee, it moves to Assigned and appears in that employee's My Orders queue. It becomes Processing when the employee taps Start Order.",
  processing:
    "Orders in Processing have been started by an employee. Tap Mark as Completed when ready — status becomes Ready for Pickup / Delivery.",
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
