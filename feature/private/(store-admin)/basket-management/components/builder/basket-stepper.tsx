"use client";

import {
  BadgePercent,
  CalendarClock,
  Check,
  ClipboardCheck,
  ImageIcon,
  LayoutGrid,
  ShoppingBasket,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import type { BasketSectionId } from "../../schema/basket-form.schema";

export interface BasketStep {
  id: BasketSectionId;
  label: string;
  hint: string;
  icon: LucideIcon;
}

/** Name and description live on the template step */
export const stepIdOf = (section: BasketSectionId): BasketSectionId =>
  section === "information" ? "template" : section;

export const BASKET_STEPS: readonly BasketStep[] = [
  {
    id: "template",
    label: "Template & Details",
    hint: "Template, name, description",
    icon: LayoutGrid,
  },
  { id: "contents", label: "Items", hint: "Add items and quantities", icon: ShoppingBasket },
  { id: "pricing", label: "Pricing", hint: "Discount or manual price", icon: BadgePercent },
  {
    id: "availability",
    label: "Availability",
    hint: "When customers can buy",
    icon: CalendarClock,
  },
  { id: "image", label: "Image", hint: "Library or upload", icon: ImageIcon },
  { id: "summary", label: "Review", hint: "Check and publish", icon: ClipboardCheck },
];

type StepState = "current" | "complete" | "issue" | "upcoming";

interface BasketStepperProps {
  current: number;
  /** Furthest step the vendor may jump to */
  maxReachable: number;
  sectionsWithIssues: ReadonlySet<BasketSectionId>;
  onSelect: (index: number) => void;
}

export function BasketStepper({
  current,
  maxReachable,
  sectionsWithIssues,
  onSelect,
}: BasketStepperProps) {
  const activeStep = BASKET_STEPS[current];
  const stateOf = (index: number, id: BasketSectionId): StepState => {
    if (index === current) return "current";
    if (index > maxReachable) return "upcoming";
    if (sectionsWithIssues.has(id)) return "issue";
    return "complete";
  };
  const progress = (current / (BASKET_STEPS.length - 1)) * 100;

  return (
    <nav
      aria-label="Create basket steps"
      className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:px-6 sm:py-5 dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mb-3 flex items-center justify-between gap-3 md:hidden">
        <div className="min-w-0">
          <p className="text-primary text-[11px] font-bold tracking-wide uppercase">
            Step {current + 1} of {BASKET_STEPS.length}
          </p>
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
            {activeStep?.label} ·{" "}
            <span className="font-medium text-slate-500">{activeStep?.hint}</span>
          </p>
        </div>
        <span className="text-primary shrink-0 text-xs font-bold tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>

      <ol className="relative flex items-start justify-between">
        <div
          aria-hidden
          className="absolute top-4.5 right-[calc(100%/12)] left-[calc(100%/12)] h-1 rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <div
            className="bg-primary h-full rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {BASKET_STEPS.map((step, index) => {
          const state = stateOf(index, step.id);
          const disabled = index > maxReachable;
          const Icon = step.icon;
          return (
            <li key={step.id} className="relative z-10 flex flex-1 flex-col items-center">
              <button
                type="button"
                onClick={() => onSelect(index)}
                disabled={disabled}
                aria-current={state === "current" ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${step.label}`}
                className="group flex flex-col items-center gap-2 rounded-xl px-1 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed"
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 text-sm font-black transition-all duration-300",
                    state === "current" &&
                      "border-primary bg-primary scale-110 text-white shadow-lg ring-4 shadow-emerald-600/30 ring-emerald-100 dark:ring-emerald-950",
                    state === "complete" &&
                      "border-primary text-primary bg-white group-hover:bg-emerald-50 dark:bg-slate-950",
                    state === "issue" &&
                      "border-amber-400 bg-amber-50 text-amber-600 group-hover:bg-amber-100 dark:bg-amber-950/40",
                    state === "upcoming" &&
                      "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-950",
                  )}
                >
                  {state === "complete" ? (
                    <Check className="size-5" strokeWidth={3} />
                  ) : state === "issue" ? (
                    <TriangleAlert className="size-4.5" />
                  ) : state === "current" ? (
                    <Icon className="size-4.5" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="hidden flex-col items-center md:flex">
                  <span
                    className={cn(
                      "text-xs font-bold whitespace-nowrap",
                      state === "current" && "text-primary",
                      state === "complete" && "text-slate-800 dark:text-slate-200",
                      state === "issue" && "text-amber-700 dark:text-amber-400",
                      state === "upcoming" && "text-slate-400",
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="hidden text-[11px] whitespace-nowrap text-slate-400 xl:block">
                    {step.hint}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
