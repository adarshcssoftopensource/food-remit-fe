"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { parseOrderNotification, parsePartnerLeadNotification } from "../utils/parse-notification";
import {
  OrderNotificationBanner,
  OrderNotificationFinancials,
  OrderNotificationItems,
  OrderNotificationPeople,
  PartnerLeadNotificationCard,
} from "./order-notification-sections";

interface OrderNotificationCardProps {
  message: string;
  isRead?: boolean;
}

export function OrderNotificationCard({ message, isRead }: OrderNotificationCardProps) {
  const parsed = useMemo(() => parseOrderNotification(message), [message]);
  const parsedLead = useMemo(() => parsePartnerLeadNotification(message), [message]);

  if (parsedLead.isLead) {
    return <PartnerLeadNotificationCard parsedLead={parsedLead} isRead={isRead} />;
  }

  if (!parsed.isOrder) {
    return (
      <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
        {message}
      </p>
    );
  }

  const cleanOrderRef = parsed.orderRef.replace(/^#/, "");
  const orderSearchLink = cleanOrderRef
    ? `${ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT}?search=${encodeURIComponent(cleanOrderRef)}`
    : ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT;

  return (
    <div
      className={cn(
        "mt-3 overflow-hidden rounded-2xl border transition-all duration-200",
        isRead
          ? "border-slate-200/80 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/30"
          : "border-emerald-200/90 bg-emerald-50/15 shadow-xs dark:border-emerald-900/50 dark:bg-emerald-950/10",
      )}
    >
      {/* Top Banner: Reference, Status, Store, and Country Date */}
      <OrderNotificationBanner parsed={parsed} />

      <div className="space-y-3.5 p-4">
        {/* Customer & Recipient Cards */}
        <OrderNotificationPeople parsed={parsed} />

        {/* Ordered Items Table */}
        <OrderNotificationItems parsed={parsed} />

        {/* Financial Breakdown: Customer Payment & Vendor Settlement */}
        <OrderNotificationFinancials parsed={parsed} />

        {/* Footer Actions */}
        <div className="flex items-center justify-end pt-1">
          <Link
            href={orderSearchLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span>View Order</span>
            <ArrowUpRight className="size-3.5 text-emerald-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}
