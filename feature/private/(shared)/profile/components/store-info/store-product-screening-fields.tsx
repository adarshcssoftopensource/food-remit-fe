"use client";

import { Control, Controller, FieldValues, UseFormSetValue } from "react-hook-form";
import { CheckCircle2, Leaf, Package, Snowflake, XCircle } from "lucide-react";

import { FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export const PRODUCT_SCREENING_ITEMS = [
  {
    name: "perishableProducts" as const,
    label: "Perishable Products",
    description: "Items subject to decay or spoilage, requiring prompt delivery or pickup.",
    icon: Leaf,
    badgeText: "Fresh Produce & Bakery",
    iconBg: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  },
  {
    name: "refrigeratedProducts" as const,
    label: "Refrigerated Products",
    description: "Items requiring cold storage conditions (2°C – 8°C) to maintain freshness.",
    icon: Snowflake,
    badgeText: "Cold Chain Dairy & Chilled",
    iconBg: "bg-sky-500/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400",
  },
  {
    name: "frozenProducts" as const,
    label: "Frozen Products",
    description: "Items requiring sub-zero freezing and frozen preservation.",
    icon: Package,
    badgeText: "Deep Freeze & Frozen Goods",
    iconBg: "bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400",
  },
];

export interface StoreProductScreeningFieldsProps<TFieldValues extends FieldValues = any> {
  control: Control<TFieldValues>;
  setValue?: UseFormSetValue<TFieldValues>;
  disabled?: boolean;
}

export function StoreProductScreeningFields<TFieldValues extends FieldValues = any>({
  control,
  setValue,
  disabled = false,
}: StoreProductScreeningFieldsProps<TFieldValues>) {
  return (
    <div className="flex flex-col gap-2.5">
      <div>
        <FieldLabel className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Product Screening Requirements
        </FieldLabel>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Indicate which fresh or temperature-controlled product types your store carries.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 pt-1 md:grid-cols-2 xl:grid-cols-3">
        {PRODUCT_SCREENING_ITEMS.map((item) => {
          const IconComponent = item.icon;
          return (
            <Controller
              key={item.name}
              name={item.name as any}
              control={control}
              render={({ field }) => {
                const isSelected = field.value === true;
                return (
                  <div
                    className={cn(
                      "flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 sm:p-4.5",
                      isSelected
                        ? "border-emerald-400/90 bg-linear-to-b from-emerald-50/50 via-white to-white shadow-xs ring-2 ring-emerald-600/15 dark:border-emerald-700 dark:bg-slate-900/60"
                        : "border-slate-200/90 bg-white shadow-2xs hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/30",
                    )}
                  >
                    <div>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div
                          className={cn(
                            "flex size-8.5 items-center justify-center rounded-xl ring-2 ring-black/5 dark:ring-white/5",
                            item.iconBg,
                          )}
                        >
                          <IconComponent className="size-4" />
                        </div>
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <CheckCircle2 className="size-3" /> Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-500/20 dark:bg-rose-950/40 dark:text-rose-300">
                            <XCircle className="size-3 text-rose-500 dark:text-rose-400" /> Not
                            Offered
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold tracking-wide text-slate-800 uppercase dark:text-slate-200">
                        {item.label}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                      <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                        Handling
                      </span>
                      <div className="inline-flex shrink-0 rounded-lg border border-slate-200/70 bg-slate-100/90 p-0.5 dark:border-slate-700 dark:bg-slate-800">
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => {
                            if (setValue) {
                              setValue(item.name as any, true as any, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            } else {
                              field.onChange(true);
                            }
                          }}
                          className={cn(
                            "flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60 sm:px-2.5",
                            isSelected
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-300",
                          )}
                        >
                          <CheckCircle2 className="size-3" /> Yes
                        </button>
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => {
                            if (setValue) {
                              setValue(item.name as any, false as any, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            } else {
                              field.onChange(false);
                            }
                          }}
                          className={cn(
                            "flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60 sm:px-2.5",
                            field.value === false
                              ? "bg-rose-600 text-white shadow-xs dark:bg-rose-600"
                              : "text-slate-600 hover:text-rose-700 dark:text-slate-400 dark:hover:text-rose-300",
                          )}
                        >
                          <XCircle className="size-3" /> No
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
