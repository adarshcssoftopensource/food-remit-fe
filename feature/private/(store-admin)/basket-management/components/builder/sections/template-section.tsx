"use client";

import { Check, Plus } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";

import {
  BASKET_TYPE_MAP,
  BASKET_TYPE_OPTIONS,
} from "../../../../../../../constants/basket.constants";
import type { BasketFormValues } from "../../../schema/basket-form.schema";
import type { BasketType } from "../../../types/basket.types";
import { BasketImage } from "../../shared/basket-image";
import { SectionCard } from "../section-card";

export function TemplateSection({ hasIssue }: { hasIssue?: boolean }) {
  const { control, setValue, getValues } = useFormContext<BasketFormValues>();
  const selected = useWatch({ control, name: "basketType" });

  /** Prefill name & description from the template, keeping anything the vendor typed */
  const select = (type: BasketType) => {
    const previous = getValues("basketType");
    if (previous === type) return;
    const prevDefaults = previous ? BASKET_TYPE_MAP[previous] : null;
    const next = BASKET_TYPE_MAP[type];
    const name = getValues("name").trim();
    const description = getValues("description").trim();
    const opts = { shouldDirty: true, shouldValidate: true };

    setValue("basketType", type, opts);
    if (!name || name === prevDefaults?.defaultName) setValue("name", next.defaultName, opts);
    if (!description || description === prevDefaults?.defaultDescription) {
      setValue("description", next.defaultDescription, opts);
    }
    setValue("householdSize", next.defaultHouseholdSize ?? "", { shouldDirty: true });
  };

  return (
    <SectionCard
      id="template"
      step={1}
      title="Basket Type / Template"
      description="Choose a template to get started. You can customise the name and contents later."
      hasIssue={hasIssue}
    >
      <div
        role="radiogroup"
        aria-label="Basket template"
        className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"
      >
        {BASKET_TYPE_OPTIONS.map((option, index) => {
          const isSelected = selected === option.value;
          const isCustom = option.value === "CUSTOM";
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => select(option.value)}
              style={{ animationDelay: `${index * 40}ms` }}
              className={cn(
                "group animate-in fade-in slide-in-from-bottom-2 fill-mode-both relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-4 focus-visible:ring-emerald-500/30 focus-visible:outline-none dark:bg-slate-900",
                isSelected
                  ? "border-primary shadow-lg shadow-emerald-600/15"
                  : "border-slate-200/80 hover:border-emerald-300 dark:border-slate-800",
              )}
            >
              <div className="relative">
                {isCustom ? (
                  <div className="flex aspect-4/3 w-full items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-900">
                    <span className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-transform duration-300 group-hover:scale-110 dark:bg-emerald-900/50">
                      <Plus className="size-8" strokeWidth={2.5} />
                    </span>
                  </div>
                ) : (
                  <BasketImage
                    basketType={option.value}
                    alt={option.label}
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 220px"
                    className="aspect-4/3 w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                )}
                <span
                  className={cn(
                    "absolute top-2 left-2 flex size-5 items-center justify-center rounded-full border-2 shadow-sm transition-all",
                    isSelected ? "bg-primary border-white" : "border-slate-300 bg-white/90",
                  )}
                >
                  {isSelected && <Check className="size-3 text-white" strokeWidth={3.5} />}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <p className="text-sm leading-tight font-bold text-slate-900 dark:text-white">
                  {option.label}
                </p>
                <p className="text-muted-foreground line-clamp-3 text-xs leading-snug">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}
