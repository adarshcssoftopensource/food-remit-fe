"use client";

import { OrderData } from "../types/order.types";
import { cn } from "@/lib/utils";
import { Check, CircleDot, Clock3 } from "lucide-react";
import { parseAbandonRemark } from "./abandon-remark";
import { SystemAbandonBadge } from "./abandon-remark-badge";
import {
  StepState,
  TimelineFlags,
  TimelineStep,
  buildTimelineSteps,
  getConnectorClass,
  getJourneyText,
  getStepLabelClass,
  getTimelineFlags,
  isAmberCurrentStep,
} from "./order-progress-steps";

interface OrderProgressTimelineProps {
  order: OrderData;
}

function JourneyOutcomeBadge({ abandoned, collected }: { abandoned: boolean; collected: boolean }) {
  return (
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
  );
}

function JourneyStatusBadge({ flags }: { flags: TimelineFlags }) {
  const { pureRequested, accepted, rejected, pickedUp, closed, abandoned, collected } = flags;
  if (pureRequested) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-sky-700 uppercase ring-1 ring-sky-200">
        <CircleDot className="size-3" />
        Awaiting response
      </span>
    );
  }
  if (accepted) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-amber-700 uppercase ring-1 ring-amber-200">
        <CircleDot className="size-3" />
        Awaiting payment
      </span>
    );
  }
  if (rejected) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-red-700 uppercase ring-1 ring-red-200">
        <CircleDot className="size-3" />
        Rejected
      </span>
    );
  }
  if (!(pickedUp || closed)) return null;
  return <JourneyOutcomeBadge abandoned={abandoned} collected={collected} />;
}

function StepCircle({ step, isAmberCurrent }: { step: TimelineStep; isAmberCurrent: boolean }) {
  return (
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
  );
}

function StepStamp({ stamp, state }: { stamp: TimelineStep["stamp"]; state: StepState }) {
  return (
    <div className="text-right">
      {stamp && state !== "upcoming" ? (
        <>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{stamp.date}</p>
          <p className="text-[11px] font-medium text-slate-500">{stamp.time}</p>
        </>
      ) : (
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
          <Clock3 className="size-3" />
          Pending
        </span>
      )}
    </div>
  );
}

function AbandonRemarkNote({ abandonRemark }: { abandonRemark: string }) {
  const { isSystem, remark } = parseAbandonRemark(abandonRemark);
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
}

interface TimelineStepItemProps {
  step: TimelineStep;
  nextStep: TimelineStep | undefined;
  isLast: boolean;
  pureRequested: boolean;
  abandoned: boolean;
  abandonRemark: string | null | undefined;
}

function TimelineStepItem({
  step,
  nextStep,
  isLast,
  pureRequested,
  abandoned,
  abandonRemark,
}: TimelineStepItemProps) {
  const isAmberCurrent = isAmberCurrentStep(step, pureRequested);

  return (
    <li className="relative flex gap-3.5 pb-6 last:pb-0">
      {!isLast && (
        <span
          className={cn(
            "absolute top-9 left-[15px] h-[calc(100%-24px)] w-0.5",
            getConnectorClass(step, nextStep, isAmberCurrent),
          )}
          aria-hidden
        />
      )}

      <StepCircle step={step} isAmberCurrent={isAmberCurrent} />

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className={cn("text-sm font-bold", getStepLabelClass(step.state, isAmberCurrent))}>
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

          <StepStamp stamp={step.stamp} state={step.state} />
        </div>

        {step.key === "abandoned" && abandoned && abandonRemark && (
          <AbandonRemarkNote abandonRemark={abandonRemark} />
        )}
      </div>
    </li>
  );
}

export function OrderProgressTimeline({ order }: OrderProgressTimelineProps) {
  const flags = getTimelineFlags(order);
  const steps = buildTimelineSteps(order, flags);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Order journey</p>
          <p className="text-[11px] text-slate-500">
            {getJourneyText(order, flags.managerAssigned)}
          </p>
        </div>
        <JourneyStatusBadge flags={flags} />
      </div>

      <div className="p-4 sm:p-5">
        <ol className="relative space-y-0">
          {steps.map((step, index) => (
            <TimelineStepItem
              key={step.key}
              step={step}
              nextStep={steps[index + 1]}
              isLast={index === steps.length - 1}
              pureRequested={flags.pureRequested}
              abandoned={flags.abandoned}
              abandonRemark={order.abandonRemark}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}
