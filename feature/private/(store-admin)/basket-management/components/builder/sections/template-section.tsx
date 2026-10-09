"use client";

import { Check, Hash, PencilLine, Plus, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";

import { QuantityStepper } from "@/components/common/quantity-stepper";
import { cn } from "@/lib/utils";

import {
  BASKET_TYPE_MAP,
  BASKET_TYPE_OPTIONS,
  formatHouseholdSize,
  getTemplateImage,
  HOUSEHOLD_SIZE_MAX,
  HOUSEHOLD_SIZE_OPTIONS,
} from "../../../../../../../constants/basket.constants";
import type { BasketFormValues } from "../../../schema/basket-form.schema";
import type { BasketType } from "../../../types/basket.types";
import { SectionCard } from "../section-card";
import { InformationFields } from "./information-section";

const EXACT_DEFAULT = 2;

/** People count for a Custom basket: a preset range or an exact number */
function HouseholdSizeField({ showError }: { showError?: boolean }) {
  const { control, setValue } = useFormContext<BasketFormValues>();
  const value = useWatch({ control, name: "householdSize" });
  const exact = /^\d+$/.test(value) ? Number(value) : null;
  const set = (next: string) => setValue("householdSize", next, { shouldDirty: true });
  const missing = showError && !value;

  const chipClass = (active: boolean) =>
    cn(
      "inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-semibold transition-all",
      active
        ? "border-primary bg-primary/10 text-primary shadow-sm"
        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
    );

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-top-2 mt-4 rounded-2xl border p-4 duration-300 sm:p-5",
        missing
          ? "border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/20"
          : "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20",
      )}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
            <Users className="text-primary size-4" />
            How many people is this basket for?
            <span className="text-rose-500">*</span>
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Shown to customers on the basket, like the people count on the other templates.
          </p>
        </div>
        {value && (
          <span className="bg-primary rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            For {formatHouseholdSize(value)}
          </span>
        )}
      </div>
      <div role="radiogroup" aria-label="Number of people" className="flex flex-wrap gap-2">
        {HOUSEHOLD_SIZE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => set(option.value)}
            className={cn(chipClass(value === option.value), "flex-1 sm:flex-none")}
          >
            <Users className="size-4" />
            {option.label}
          </button>
        ))}
        {exact === null ? (
          <button
            type="button"
            role="radio"
            aria-checked={false}
            onClick={() => set(String(EXACT_DEFAULT))}
            className={cn(chipClass(false), "w-full sm:w-auto")}
          >
            <Hash className="size-4" />
            Exact number
          </button>
        ) : (
          <div
            role="radio"
            aria-checked
            className={cn(chipClass(true), "w-full justify-between gap-3 pr-1.5 sm:w-auto")}
          >
            <span className="flex items-center gap-2">
              <Hash className="size-4" />
              Exact
            </span>
            <span className="flex items-center gap-2">
              <QuantityStepper
                size="sm"
                value={exact}
                min={1}
                max={HOUSEHOLD_SIZE_MAX}
                onChange={(n) => set(String(n))}
                aria-label="Number of people"
              />
              <span className="text-xs">{exact === 1 ? "person" : "people"}</span>
            </span>
          </div>
        )}
      </div>
      {missing && (
        <p className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
          Choose how many people the basket is for.
        </p>
      )}
    </div>
  );
}

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
      title="Template & Basket Details"
      description="Pick the template closest to your basket. We prefill the name and description, and you can edit both."
      hasIssue={hasIssue}
    >
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
        <span className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs">
          A
        </span>
        Choose a template
        <span className="text-muted-foreground text-xs font-medium">
          · only one can be selected
        </span>
      </p>
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
                  <span className="relative block aspect-4/3 w-full overflow-hidden bg-[#f3ece2]">
                    <Image
                      src={getTemplateImage(option.value)}
                      alt={option.label}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 220px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </span>
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
              {isSelected && (
                <span className="bg-primary absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow">
                  Selected
                </span>
              )}
              <div className="flex flex-1 flex-col gap-1.5 p-3">
                <p className="text-sm leading-tight font-bold text-slate-900 dark:text-white">
                  {option.label}
                </p>
                <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
                  {option.description}
                </p>
                <span
                  className={cn(
                    "mt-auto inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                  )}
                >
                  {isCustom ? <Sparkles className="size-3" /> : <Users className="size-3" />}
                  {option.tagline}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selected === "CUSTOM" && <HouseholdSizeField showError={hasIssue} />}

      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
            <span className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs">
              B
            </span>
            Basket details
          </p>
          {selected && (
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <PencilLine className="size-3.5" />
              {selected === "CUSTOM"
                ? "Custom basket: enter your own name and description"
                : `Prefilled from ${BASKET_TYPE_MAP[selected].label}. Edit freely.`}
            </span>
          )}
        </div>
        <InformationFields />
      </div>
    </SectionCard>
  );
}
