"use client";

import { Check } from "lucide-react";
import { OrderData } from "../types/order.types";
import {
  FINAL_STATUS,
  ORDER_STATUS,
  isPendingOrder,
  isProcessingOrder,
} from "../utils/order-workflow";
import { cn } from "@/lib/utils";

interface OrderProgressTimelineProps {
  order: OrderData;
}

type StepKey = "pending" | "processing" | "completed" | "pickedUp" | "closed";

function formatStamp(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getCurrentStep(order: OrderData): StepKey {
  if (isPendingOrder(order)) return "pending";
  if (isProcessingOrder(order)) return "processing";
  if (order.orderStatus === ORDER_STATUS.COMPLETED) return "completed";
  if (order.orderStatus === ORDER_STATUS.CLOSED) return "closed";
  return "pending";
}

export function OrderProgressTimeline({ order }: OrderProgressTimelineProps) {
  const current = getCurrentStep(order);
  const hasLeftPending =
    isProcessingOrder(order) ||
    order.orderStatus === ORDER_STATUS.COMPLETED ||
    order.orderStatus === ORDER_STATUS.CLOSED ||
    !!order.assignedEmployeeId ||
    !!order.startedAt;

  const processingDone =
    order.orderStatus === ORDER_STATUS.COMPLETED || order.orderStatus === ORDER_STATUS.CLOSED;
  const completedDone =
    order.orderStatus === ORDER_STATUS.COMPLETED || order.orderStatus === ORDER_STATUS.CLOSED;
  const pickedOrAbandoned = order.orderStatus === ORDER_STATUS.CLOSED;
  const closedDone = order.orderStatus === ORDER_STATUS.CLOSED;
  const pickupLabel = order.finalStatus === FINAL_STATUS.ABANDONED ? "Abandoned" : "Picked Up";

  const steps: {
    key: StepKey;
    label: string;
    done: boolean;
    current: boolean;
    detail: string;
  }[] = [
    {
      key: "pending",
      label: "Pending",
      done: hasLeftPending,
      current: current === "pending",
      detail: formatStamp(order.createdAt) || "Paid, awaiting start",
    },
    {
      key: "processing",
      label: "Processing",
      done: processingDone,
      current: current === "processing",
      detail: order.startedByName
        ? `Started by ${order.startedByName}${
            formatStamp(order.startedAt) ? `, ${formatStamp(order.startedAt)}` : ""
          }`
        : formatStamp(order.startedAt) || (current === "processing" ? "In progress" : "Waiting"),
    },
    {
      key: "completed",
      label: "Completed",
      done: completedDone,
      current: current === "completed",
      detail:
        formatStamp(order.completedAt) ||
        (current === "completed" ? "Ready for pickup" : "Waiting"),
    },
    {
      key: "pickedUp",
      label: pickupLabel,
      done: pickedOrAbandoned,
      current: false,
      detail: pickedOrAbandoned
        ? formatStamp(order.pickedUpAt || order.abandonedAt) || "Done"
        : "Waiting",
    },
    {
      key: "closed",
      label: "Closed",
      done: closedDone,
      current: current === "closed",
      detail: formatStamp(order.closedAt) || (closedDone ? "In history" : "Waiting"),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-[560px] items-start justify-between gap-2">
        {steps.map((step, index) => (
          <div key={step.key} className="flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              {index > 0 && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    steps[index - 1].done ? "bg-emerald-500" : "bg-slate-200",
                  )}
                />
              )}
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                  step.done || step.current
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-slate-200 bg-white text-slate-400",
                )}
              >
                {step.done && !step.current ? <Check className="size-4" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn("h-0.5 flex-1", step.done ? "bg-emerald-500" : "bg-slate-200")}
                />
              )}
            </div>
            <p
              className={cn(
                "mt-2 text-xs font-semibold",
                step.current ? "text-emerald-700" : "text-slate-700 dark:text-slate-300",
              )}
            >
              {step.label}
            </p>
            <p className="mt-0.5 max-w-[120px] text-[10px] leading-snug text-slate-500">
              {step.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
