"use client";

import {
  FINAL_STATUS,
  ORDER_STATUS,
  isAcceptedRequest,
  isAssignedOrder,
  isAwaitingPayment,
  isPendingOrder,
  isProcessingOrder,
  isRejectedRequest,
  isRequestedOrder,
} from "../utils/order-workflow";
import { OrderData } from "../types/order.types";
import { cn } from "@/lib/utils";
import {
  Check,
  CircleDot,
  Clock3,
  CreditCard,
  HandPlatter,
  Lock,
  PackageCheck,
  PackageX,
  RefreshCw,
  ShoppingBag,
  ThumbsUp,
  UserCheck,
  X,
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
  const pureRequested = isRequestedOrder(order);
  const accepted = isAcceptedRequest(order);
  const rejected = isRejectedRequest(order);
  const awaitingPayment = isAwaitingPayment(order);
  const pending = isPendingOrder(order);
  const assigned = isAssignedOrder(order);
  const processing = isProcessingOrder(order);
  /** Manager assignment adds an extra step; self-started orders skip it */
  const managerAssigned = assigned || Boolean(order.assignedById);
  const pickedUp = order.orderStatus === ORDER_STATUS.COMPLETED;
  const closed = order.orderStatus === ORDER_STATUS.CLOSED;
  const abandoned = closed && order.finalStatus === FINAL_STATUS.ABANDONED;
  const collected = closed && order.finalStatus === FINAL_STATUS.PICKED_UP;
  const paymentDone = !awaitingPayment && !rejected && order.orderStatus !== ORDER_STATUS.CANCELLED;

  const createdStamp = formatFullStamp(order.createdAt);
  const pendingStamp = paymentDone ? createdStamp : null;
  const paymentStamp = awaitingPayment || paymentDone || rejected ? createdStamp : null;
  const assignedStamp = formatFullStamp(order.assignedAt);
  const processingStamp = formatFullStamp(order.startedAt);
  const readyStamp = formatFullStamp(order.completedAt);
  const pickedUpStamp = formatFullStamp(collected ? order.pickedUpAt || order.closedAt : null);
  const abandonedStamp = formatFullStamp(order.abandonedAt || order.closedAt);
  const handlerName = order.startedByName || order.assignedEmployeeName;
  const receiverName = order.recieverName || order.userName || "customer";
  const closedStamp = formatFullStamp(closed ? order.closedAt : null);

  const responseState: StepState = pureRequested
    ? "current"
    : accepted || paymentDone
      ? "done"
      : rejected
        ? "failed"
        : "upcoming";

  const paymentState: StepState = rejected
    ? "upcoming"
    : pureRequested
      ? "upcoming"
      : accepted
        ? "current"
        : paymentDone
          ? "done"
          : "upcoming";

  const baseSteps: {
    key: string;
    label: string;
    subtitle: string;
    stamp: ReturnType<typeof formatFullStamp>;
    state: StepState;
    Icon: any;
  }[] = [];

  if (order.orderType === 2) {
    baseSteps.push({
      key: "response",
      label: rejected ? "Rejected" : accepted || paymentDone ? "Accepted" : "Accept / Reject",
      subtitle: rejected
        ? "Rejected on mobile — remains in Requested tab"
        : pureRequested
          ? "Accept/Reject is done on the mobile app"
          : "Accepted on mobile — waiting for payment",
      stamp: createdStamp,
      state: responseState,
      Icon: rejected ? X : ThumbsUp,
    });
    baseSteps.push({
      key: "payment",
      label: accepted ? "Pending Payment" : paymentDone ? "Payment Received" : "Pending Payment",
      subtitle: rejected
        ? "Payment not applicable after rejection"
        : pureRequested
          ? "Available after the request is accepted"
          : accepted
            ? "Customer has not paid yet"
            : "Payment completed — order moved to Pending",
      stamp: paymentStamp,
      state: paymentState,
      Icon: CreditCard,
    });
  }

  const afterPending = assigned || processing || pickedUp || closed;
  const assignedSteps: typeof baseSteps = managerAssigned
    ? [
        {
          key: "assigned",
          label: "Assigned",
          subtitle: order.assignedEmployeeName
            ? assigned
              ? `Assigned to ${order.assignedEmployeeName} — waiting for Start Order`
              : `Assigned to ${order.assignedEmployeeName}`
            : "Assigned by store manager",
          stamp: assignedStamp,
          state: assigned ? "current" : processing || pickedUp || closed ? "done" : "upcoming",
          Icon: UserCheck,
        },
      ]
    : [];

  const steps: typeof baseSteps = [
    ...baseSteps,
    {
      key: "pending",
      label: "Order Pending",
      subtitle:
        order.orderType === 2 && (awaitingPayment || rejected)
          ? "Starts after payment is completed"
          : "Paid — waiting to be started or assigned",
      stamp: pendingStamp,
      state:
        order.orderType === 2 && (awaitingPayment || rejected)
          ? "upcoming"
          : pending
            ? "current"
            : paymentDone || afterPending
              ? "done"
              : "upcoming",
      Icon: ShoppingBag,
    },
    ...assignedSteps,
    {
      key: "processing",
      label: "Processing",
      subtitle: order.startedByName
        ? `Started by ${order.startedByName}`
        : "Starts when an employee taps Start Order",
      stamp: processingStamp,
      state: processing ? "current" : pickedUp || closed ? "done" : "upcoming",
      Icon: RefreshCw,
    },
    {
      key: "ready",
      label: "Ready for Pickup",
      subtitle:
        pickedUp || closed
          ? `Completed by ${handlerName || "store employee"}${
              pickedUp ? " — waiting for customer QR / reference" : ""
            }`
          : "Moves here after Mark as Completed",
      stamp: readyStamp,
      state: pickedUp ? "current" : closed ? "done" : "upcoming",
      Icon: PackageCheck,
    },
    abandoned
      ? {
          key: "abandoned",
          label: "Abandoned",
          subtitle: `Not collected by ${receiverName}`,
          stamp: abandonedStamp,
          state: "failed" as StepState,
          Icon: PackageX,
        }
      : {
          key: "pickedUp",
          label: "Picked Up",
          subtitle: collected
            ? `Picked up by ${receiverName}`
            : pickedUp
              ? `Waiting for ${receiverName} to collect`
              : "After QR / reference is verified",
          stamp: pickedUpStamp,
          state: (collected ? "done" : "upcoming") as StepState,
          Icon: HandPlatter,
        },
    {
      key: "closed",
      label: "Closed",
      subtitle: closed
        ? abandoned
          ? "Closed automatically after abandonment"
          : "Closed automatically after pickup verification"
        : "Closes automatically after pickup",
      stamp: closedStamp,
      state: closed ? "done" : "upcoming",
      Icon: Lock,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Order journey</p>
          <p className="text-[11px] text-slate-500">
            {order.orderType === 2
              ? `Mobile Accept/Reject → Payment → Pending${managerAssigned ? " → Assigned" : ""} → Processing → Ready for Pickup → Picked Up → Closed`
              : `Pending${managerAssigned ? " → Assigned" : ""} → Processing → Ready for Pickup → Picked Up → Closed`}
          </p>
        </div>
        {pureRequested ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-sky-700 uppercase ring-1 ring-sky-200">
            <CircleDot className="size-3" />
            Awaiting response
          </span>
        ) : accepted ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-amber-700 uppercase ring-1 ring-amber-200">
            <CircleDot className="size-3" />
            Awaiting payment
          </span>
        ) : rejected ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-red-700 uppercase ring-1 ring-red-200">
            <CircleDot className="size-3" />
            Rejected
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
              {abandoned ? "Abandoned" : collected ? "Closed" : "Awaiting pickup"}
            </span>
          )
        )}
      </div>

      <div className="p-4 sm:p-5">
        <ol className="relative space-y-0">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const isAmberCurrent =
              step.state === "current" &&
              (step.key === "payment" || (step.key === "response" && pureRequested));

            const nextStep = steps[index + 1];

            return (
              <li key={step.key} className="relative flex gap-3.5 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    className={cn(
                      "absolute top-9 left-[15px] h-[calc(100%-24px)] w-0.5",
                      nextStep?.state === "upcoming"
                        ? "bg-slate-200"
                        : nextStep?.state === "failed" || step.state === "failed"
                          ? "bg-red-300"
                          : isAmberCurrent
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
                      (isAmberCurrent
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
                              ? isAmberCurrent
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

                  {step.key === "abandoned" &&
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
