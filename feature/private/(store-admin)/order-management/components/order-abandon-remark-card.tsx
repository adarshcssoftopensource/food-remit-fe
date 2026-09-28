"use client";

import { FINAL_STATUS, ORDER_STATUS } from "../utils/order-workflow";
import { OrderData } from "../types/order.types";
import { Mail, PackageX } from "lucide-react";
import { parseAbandonRemark, SystemAbandonBadge } from "./abandon-remark-badge";

interface OrderAbandonRemarkCardProps {
  order: OrderData;
}

export function OrderAbandonRemarkCard({ order }: OrderAbandonRemarkCardProps) {
  const abandoned =
    order.orderStatus === ORDER_STATUS.CLOSED && order.finalStatus === FINAL_STATUS.ABANDONED;

  if (!abandoned) return null;

  const { isSystem, remark } = parseAbandonRemark(order.abandonRemark);
  const displayRemark = remark || "No remark was recorded.";
  const when = order.abandonedAt || order.closedAt;

  return (
    <div className="overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-orange-50/50 to-white shadow-xs dark:border-red-900/40 dark:from-red-950/30 dark:to-slate-900">
      <div className="flex items-start gap-3 border-b border-red-100 px-4 py-3.5 dark:border-red-900/30">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
          <PackageX className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-red-900 dark:text-red-100">Order Abandoned</p>
            <SystemAbandonBadge isSystem={isSystem} />
          </div>
          <p className="mt-0.5 text-xs text-red-700/80 dark:text-red-300/80">
            {isSystem
              ? "Automatically closed by store auto-abandon"
              : "Manually abandoned by store admin"}
            {when
              ? ` · ${new Date(when).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}`
              : ""}
          </p>
        </div>
      </div>

      <div className="space-y-3 px-4 py-3.5">
        <div>
          <p className="text-[10px] font-bold tracking-wider text-red-600 uppercase">
            Remark / Reason
          </p>
          <p className="mt-1 text-sm leading-relaxed font-medium text-red-950 dark:text-red-50">
            {displayRemark}
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-white/70 px-3 py-2.5 dark:border-red-900/30 dark:bg-slate-900/40">
          <Mail className="mt-0.5 size-3.5 shrink-0 text-red-500" />
          <p className="text-[11px] leading-relaxed text-red-800/90 dark:text-red-200/90">
            Notification email with this remark was sent to both the <strong>sender</strong> and{" "}
            <strong>receiver</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
