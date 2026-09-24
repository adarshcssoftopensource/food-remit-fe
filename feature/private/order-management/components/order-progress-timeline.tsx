"use client";

import {
  FINAL_STATUS,
  ORDER_STATUS,
  isPendingOrder,
  isProcessingOrder,
  isRequestedOrder,
} from "../utils/order-workflow";
import { OrderData } from "../types/order.types";
import { cn } from "@/lib/utils";
import {
  Check,
  CircleDot,
  Clock3,
  CreditCard,
  PackageCheck,
  PackageX,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { parseAbandonRemark, SystemAbandonBadge } from "./abandon-remark-badge";

interface OrderProgressTimelineProps {
  order: OrderData;
}

function formatFullStamp(iso?: string | Date | null) {
  if (!iso) return null;
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return null;
  return {
    date: d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    full: d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

type StepState = "done" | "current" | "upcoming" | "failed";

export function OrderProgressTimeline({ order }: OrderProgressTimelineProps) {
  const awaitingPayment = isRequestedOrder(order);
  const pending = isPendingOrder(order);
  const processing = isProcessingOrder(order);
  const pickedUp = order.orderStatus === ORDER_STATUS.COMPLETED;
  const closed = order.orderStatus === ORDER_STATUS.CLOSED;
  const abandoned = closed && order.finalStatus === FINAL_STATUS.ABANDONED;
  const collected = closed && order.finalStatus === FINAL_STATUS.PICKED_UP;
  const paymentDone = !awaitingPayment && order.orderStatus !== ORDER_STATUS.CANCELLED;

  const requestedStamp = formatFullStamp(order.createdAt);
  const pendingStamp = formatFullStamp(paymentDone && !awaitingPayment ? order.createdAt : null);
  // For paid orders, payment stamp ≈ when order became actionable (createdAt for direct paid;
  // requested orders keep createdAt as request time — payment time isn't stored separately here)
  const paymentStamp = awaitingPayment ? requestedStamp : formatFullStamp(order.createdAt);
  const processingStamp = formatFullStamp(order.startedAt || order.assignedAt);
  const pickedUpStamp = formatFullStamp(order.pickedUpAt || order.completedAt);
  const closedStamp = formatFullStamp(
    abandoned ? order.abandonedAt || order.closedAt : collected ? order.closedAt : null,
  );

  const steps: {
    key: string;
    label: string;
    subtitle: string;
    stamp: ReturnType<typeof formatFullStamp>;
    state: StepState;
    Icon: typeof ShoppingBag;
  }[] = [
    {
      key: "payment",
      label: awaitingPayment ? "Pending Payment" : "Payment Received",
      subtitle: awaitingPayment
        ? "Customer has not paid yet — order stays Requested"
        : "Payment completed — order moved to Pending",
      stamp: paymentStamp,
      state: awaitingPayment ? "current" : paymentDone ? "done" : "upcoming",
      Icon: CreditCard,
    },
    {
      key: "pending",
      label: "Order Pending",
      subtitle: awaitingPayment
        ? "Starts after payment is completed"
        : "Paid — waiting to be started or assigned",
      stamp: awaitingPayment ? null : pendingStamp,
      state: awaitingPayment ? "upcoming" : pending ? "current" : paymentDone ? "done" : "upcoming",
      Icon: ShoppingBag,
    },
    {
      key: "processing",
      label: "Processing",
      subtitle: order.startedByName
        ? `Started by ${order.startedByName}`
        : order.assignedEmployeeName
          ? `Assigned to ${order.assignedEmployeeName}`
          : "Being prepared at store",
      stamp: processingStamp,
      state: processing ? "current" : pickedUp || closed ? "done" : "upcoming",
      Icon: RefreshCw,
    },
    {
      key: "pickedUp",
      label: "Picked Up",
      subtitle: pickedUp
        ? "Ready at store — awaiting Close or Abandon"
        : closed
          ? "Was ready at store for collection"
          : "Will move here after Mark Completed",
      stamp: pickedUpStamp,
      state: pickedUp ? "current" : closed ? "done" : "upcoming",
      Icon: PackageCheck,
    },
    {
      key: "final",
      label: abandoned ? "Abandoned" : collected ? "Closed (Collected)" : "Close / Abandon",
      subtitle: abandoned
        ? parseAbandonRemark(order.abandonRemark).remark || "Not collected"
        : collected
          ? "Customer collected with reference"
          : "Final step after pickup",
      stamp: closedStamp,
      state: abandoned ? "failed" : collected ? "done" : "upcoming",
      Icon: abandoned ? PackageX : Check,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Order journey</p>
          <p className="text-[11px] text-slate-500">
            {awaitingPayment
              ? "Pending Payment → Pending → Processing → Picked Up → Close / Abandon"
              : "Payment → Pending → Processing → Picked Up → Close / Abandon"}
          </p>
        </div>
        {awaitingPayment ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-amber-700 uppercase ring-1 ring-amber-200">
            <CircleDot className="size-3" />
            Awaiting payment
          </span>
        ) : (
          (pickedUp || closed) && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase",
                abandoned
                  ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                  : collected
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
              )}
            >
              <CircleDot className="size-3" />
              {abandoned ? "Abandoned" : collected ? "Collected" : "Awaiting action"}
            </span>
          )
        )}
      </div>

      <div className="p-4 sm:p-5">
        <ol className="relative space-y-0">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;

            return (
              <li key={step.key} className="relative flex gap-3.5 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    className={cn(
                      "absolute top-9 left-[15px] h-[calc(100%-24px)] w-0.5",
                      steps[index + 1].state === "upcoming"
                        ? "bg-slate-200"
                        : steps[index + 1].state === "failed" || step.state === "failed"
                          ? "bg-red-300"
                          : step.state === "current" && awaitingPayment && step.key === "payment"
                            ? "bg-amber-300"
                            : "bg-emerald-400",
                    )}
                    aria-hidden
                  />
                )}

                <div
                  className={cn(
                    "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2",
                    step.state === "done" && "border-emerald-500 bg-emerald-500 text-white",
                    step.state === "current" &&
                      (awaitingPayment && step.key === "payment"
                        ? "border-amber-500 bg-white text-amber-600 shadow-[0_0_0_4px_rgba(245,158,11,0.15)]"
                        : "border-emerald-500 bg-white text-emerald-600 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"),
                    step.state === "failed" && "border-red-500 bg-red-500 text-white",
                    step.state === "upcoming" && "border-slate-200 bg-white text-slate-300",
                  )}
                >
                  {step.state === "done" ? (
                    <Check className="size-4" strokeWidth={2.5} />
                  ) : (
                    <step.Icon className="size-3.5" />
                  )}
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p
                        className={cn(
                          "text-sm font-bold",
                          step.state === "failed"
                            ? "text-red-700"
                            : step.state === "current"
                              ? awaitingPayment && step.key === "payment"
                                ? "text-amber-800"
                                : "text-emerald-800"
                              : step.state === "done"
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-400",
                        )}
                      >
                        {step.label}
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 text-xs leading-relaxed",
                          step.state === "upcoming" ? "text-slate-400" : "text-slate-600",
                        )}
                      >
                        {step.subtitle}
                      </p>
                    </div>

                    <div className="text-right">
                      {step.stamp && step.state !== "upcoming" ? (
                        <>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {step.stamp.date}
                          </p>
                          <p className="text-[11px] font-medium text-slate-500">
                            {step.stamp.time}
                          </p>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock3 className="size-3" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {step.key === "final" &&
                    abandoned &&
                    order.abandonRemark &&
                    (() => {
                      const { isSystem, remark } = parseAbandonRemark(order.abandonRemark);
                      return (
                        <div className="mt-2 rounded-xl border border-red-200 bg-red-50/80 px-3 py-2 dark:border-red-900/40 dark:bg-red-950/20">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[10px] font-bold tracking-wider text-red-600 uppercase">
                              Abandon remark
                            </p>
                            <SystemAbandonBadge isSystem={isSystem} />
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-red-900 dark:text-red-200">
                            {remark || "Not collected"}
                          </p>
                        </div>
                      );
                    })()}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
