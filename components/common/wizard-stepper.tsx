"use client";

import { Check, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface WizardStep {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface WizardStepperProps {
  steps: WizardStep[];
  currentIndex: number;
  /** Highest step index the user may jump to (inclusive) */
  maxReachableIndex?: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

/**
 * Progress indicator for multi-step flows. Compact progress bar on small screens,
 * full step rail from `lg` up.
 */
export function WizardStepper({
  steps,
  currentIndex,
  maxReachableIndex = currentIndex,
  onStepClick,
  className,
}: WizardStepperProps) {
  const progress = steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 100;
  const current = steps[currentIndex];
  const CurrentIcon = current?.icon;

  return (
    <nav aria-label="Progress" className={className}>
      <div className="lg:hidden">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm font-bold">
            {CurrentIcon && (
              <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg">
                <CurrentIcon className="size-4" />
              </span>
            )}
            {current?.label}
          </span>
          <span className="text-muted-foreground text-xs font-semibold tabular-nums">
            {currentIndex + 1} / {steps.length}
          </span>
        </div>
        <div className="flex gap-1">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              aria-label={step.label}
              disabled={!onStepClick || index > maxReachableIndex}
              onClick={() => onStepClick?.(index)}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                index <= currentIndex
                  ? "bg-primary"
                  : index <= maxReachableIndex
                    ? "bg-primary/30"
                    : "bg-slate-200 dark:bg-slate-800",
              )}
            />
          ))}
        </div>
      </div>

      <div className="relative hidden lg:block">
        <div
          aria-hidden
          className="absolute top-5 right-[calc(100%/var(--steps)/2)] left-[calc(100%/var(--steps)/2)] h-1 rounded-full bg-slate-100 dark:bg-slate-800"
          style={{ ["--steps" as string]: steps.length }}
        >
          <div
            className="from-primary h-full rounded-full bg-linear-to-r to-teal-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ol className="relative flex">
          {steps.map((step, index) => {
            const isComplete = index < currentIndex;
            const isCurrent = index === currentIndex;
            const canNavigate = !!onStepClick && index <= maxReachableIndex && !isCurrent;
            const Icon = step.icon;

            return (
              <li key={step.id} className="flex flex-1 justify-center">
                <button
                  type="button"
                  disabled={!canNavigate}
                  onClick={() => canNavigate && onStepClick?.(index)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "group flex flex-col items-center gap-2 outline-none",
                    canNavigate ? "cursor-pointer" : "cursor-default",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                      isComplete && "border-primary bg-primary text-white",
                      isCurrent &&
                        "border-primary text-primary ring-primary/15 scale-110 bg-white shadow-lg ring-4 shadow-emerald-600/20 dark:bg-slate-950",
                      !isComplete &&
                        !isCurrent &&
                        "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-950",
                      canNavigate &&
                        "group-hover:ring-primary/20 group-hover:ring-4 group-focus-visible:ring-4",
                    )}
                  >
                    {isComplete ? (
                      <Check className="size-4.5" strokeWidth={3} />
                    ) : Icon ? (
                      <Icon className="size-4.5" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      "max-w-28 text-center text-xs leading-tight font-semibold transition-colors",
                      isCurrent
                        ? "text-primary"
                        : isComplete
                          ? "text-slate-700 dark:text-slate-200"
                          : "text-slate-400",
                    )}
                  >
                    {step.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
