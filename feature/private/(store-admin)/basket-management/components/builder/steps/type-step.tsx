"use client";

import { Check, LayoutGrid, Sparkles, Users } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";

import { BASKET_TYPE_OPTIONS } from "../../../constants/basket.constants";
import type { BasketFormValues } from "../../../schema/basket-form.schema";
import type { BasketType } from "../../../types/basket.types";
import { BasketImage } from "../../shared/basket-image";
import { StepHeader } from "../step-header";

export function TypeStep() {
  const { control, setValue, getValues, formState } = useFormContext<BasketFormValues>();
  const selected = useWatch({ control, name: "basketType" });

  const select = (type: BasketType) => {
    setValue("basketType", type, { shouldDirty: true, shouldValidate: true });
    const option = BASKET_TYPE_OPTIONS.find((o) => o.value === type);
    if (option?.defaultHouseholdSize && !getValues("householdSize")) {
      setValue("householdSize", option.defaultHouseholdSize, { shouldDirty: true });
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader
        step={1}
        icon={LayoutGrid}
        title="Choose a basket type"
        description="Pick the type that best fits who this basket is for. It sets a matching default image and household size."
      />

      <div
        role="radiogroup"
        aria-label="Basket type"
        className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3"
      >
        {BASKET_TYPE_OPTIONS.map((option, index) => {
          const isSelected = selected === option.value;
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => select(option.value)}
              style={{ animationDelay: `${index * 40}ms` }}
              className={cn(
                "group animate-in fade-in slide-in-from-bottom-2 fill-mode-both relative flex flex-col overflow-hidden rounded-3xl border-2 bg-white text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-emerald-500/30 focus-visible:outline-none dark:bg-slate-900",
                isSelected
                  ? "border-primary shadow-xl shadow-emerald-600/15"
                  : "border-slate-200/80 hover:border-emerald-300 dark:border-slate-800",
              )}
            >
              <div className="relative overflow-hidden">
                <BasketImage
                  basketType={option.value}
                  alt={option.label}
                  sizes="(max-width: 640px) 100vw, (max-width: 1536px) 50vw, 420px"
                  className="aspect-[16/9] w-full transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span
                  className={cn(
                    "absolute top-3 right-3 flex size-7 items-center justify-center rounded-full border-2 shadow-md transition-all",
                    isSelected
                      ? "bg-primary scale-110 border-white"
                      : "border-white bg-white/80 backdrop-blur",
                  )}
                >
                  {isSelected && <Check className="size-4 text-white" strokeWidth={3} />}
                </span>
                {option.value === "CUSTOM" && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
                    <Sparkles className="size-3 text-amber-500" /> Most flexible
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                      isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-base leading-tight font-bold text-slate-900 dark:text-white">
                      {option.label}
                    </p>
                    <p className="text-primary mt-1 inline-flex items-center gap-1 text-xs font-semibold">
                      <Users className="size-3.5" /> {option.tagline}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {option.description}
                </p>
                <div className="mt-auto border-t border-slate-100 pt-3 dark:border-slate-800">
                  <p className="mb-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                    Typically includes
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {option.highlights.map((h) => (
                      <span
                        key={h}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                          isSelected
                            ? "bg-primary/10 text-primary"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                        )}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {isSelected && (
                <span className="bg-primary absolute inset-x-0 bottom-0 h-1" aria-hidden />
              )}
            </button>
          );
        })}
      </div>

      {formState.errors.basketType && (
        <p className="text-destructive text-sm font-medium">
          {formState.errors.basketType.message}
        </p>
      )}
    </div>
  );
}
