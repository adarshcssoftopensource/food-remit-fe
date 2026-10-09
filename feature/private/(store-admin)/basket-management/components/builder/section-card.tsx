import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import type { BasketSectionId } from "../../schema/basket-form.schema";
import { BASKET_STEPS } from "./basket-stepper";

interface SectionCardProps {
  id: BasketSectionId;
  step: number;
  title: string;
  description: string;
  action?: ReactNode;
  hasIssue?: boolean;
  className?: string;
  children: ReactNode;
}

export const sectionDomId = (id: BasketSectionId) => `basket-section-${id}`;

export function SectionCard({
  id,
  step,
  title,
  description,
  action,
  hasIssue,
  className,
  children,
}: SectionCardProps) {
  return (
    <section
      id={sectionDomId(id)}
      aria-labelledby={`${sectionDomId(id)}-title`}
      className={cn(
        "scroll-mt-24 rounded-2xl border bg-white p-3.5 shadow-sm transition-colors sm:rounded-3xl sm:p-6 dark:bg-slate-950",
        hasIssue
          ? "border-amber-300 ring-4 ring-amber-100 dark:border-amber-800 dark:ring-amber-950/40"
          : "border-slate-200/80 dark:border-slate-800",
        className,
      )}
    >
      <header className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:mb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div className="flex items-start gap-3 sm:items-center sm:gap-3.5">
          <span className="bg-primary flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-lg shadow-emerald-600/25 sm:size-11 sm:rounded-2xl sm:text-base">
            {step}
          </span>
          <div className="min-w-0">
            <p className="text-primary text-[11px] font-bold tracking-wider uppercase">
              Step {step} of {BASKET_STEPS.length}
            </p>
            <h2
              id={`${sectionDomId(id)}-title`}
              className="text-lg leading-tight font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white"
            >
              {title}
            </h2>
            <p className="text-muted-foreground mt-0.5 text-[13px] sm:text-sm">{description}</p>
          </div>
        </div>
        {action && <div className="shrink-0 sm:pl-4">{action}</div>}
      </header>
      {children}
    </section>
  );
}
