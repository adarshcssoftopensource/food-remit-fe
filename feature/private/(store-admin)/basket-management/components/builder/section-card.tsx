import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import type { BasketSectionId } from "../../schema/basket-form.schema";

interface SectionCardProps {
  id: BasketSectionId;
  step: number;
  title: string;
  description: string;
  action?: ReactNode;
  /** Highlights the section when it blocks publishing */
  hasIssue?: boolean;
  className?: string;
  children: ReactNode;
}

export const sectionDomId = (id: BasketSectionId) => `basket-section-${id}`;

/** Numbered step of the guided Create Basket page */
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
        "scroll-mt-24 rounded-3xl border bg-white p-4 shadow-sm transition-colors sm:p-6 dark:bg-slate-950",
        hasIssue
          ? "border-amber-300 ring-4 ring-amber-100 dark:border-amber-800 dark:ring-amber-950/40"
          : "border-slate-200/80 dark:border-slate-800",
        className,
      )}
    >
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="bg-primary flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white shadow-md shadow-emerald-600/25">
            {step}
          </span>
          <div className="min-w-0">
            <h2
              id={`${sectionDomId(id)}-title`}
              className="text-lg leading-tight font-bold text-slate-900 dark:text-white"
            >
              {title}
            </h2>
            <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
          </div>
        </div>
        {action && <div className="shrink-0 sm:pl-4">{action}</div>}
      </header>
      {children}
    </section>
  );
}
