"use client";

import { Controller, UseFormSetValue } from "react-hook-form";
import { CheckCircle2, Clock, Package, Timer, Truck, XCircle, Zap } from "lucide-react";

import { FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ORDER_PROCESSING_TIME_OPTIONS } from "@/constants/become-a-partner";
import type { StoreInfoValues } from "../../schema/store-info.schema";
import type { StoreFieldsProps } from "./store-image-field";

const PROCESSING_TIME_META: Record<
  string,
  {
    badge: string;
    badgeColor: string;
    description: string;
    icon: typeof Zap;
  }
> = {
  "0–15 minutes": {
    badge: "Express",
    badgeColor:
      "border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300",
    description: "Fastest turnaround for quick grab-and-go or instant items",
    icon: Zap,
  },
  "15–30 minutes": {
    badge: "Popular",
    badgeColor:
      "border-sky-200/70 bg-sky-50 text-sky-700 dark:border-sky-800/60 dark:bg-sky-950/50 dark:text-sky-300",
    description: "Standard fresh food & beverage preparation duration",
    icon: Clock,
  },
  "30–45 minutes": {
    badge: "Standard",
    badgeColor:
      "border-indigo-200/70 bg-indigo-50 text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300",
    description: "Moderate prep for custom or cooked-to-order specialties",
    icon: Timer,
  },
  "45–60 minutes": {
    badge: "Extended",
    badgeColor:
      "border-amber-200/70 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300",
    description: "Ideal for bulk orders, catering or elaborate preparation",
    icon: Package,
  },
};

export interface StoreSameDayDeliveryFieldsProps extends StoreFieldsProps {
  setValue: UseFormSetValue<StoreInfoValues>;
}

export function StoreSameDayDeliveryFields({
  control,
  errors,
  setValue,
}: StoreSameDayDeliveryFieldsProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:gap-6 md:grid-cols-2">
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-linear-to-b from-white to-slate-50/50 p-4 shadow-xs transition-all sm:p-5 dark:border-slate-800 dark:from-slate-900/60 dark:to-slate-900/30">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Truck className="size-4" />
            </div>
            <FieldLabel className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Does your Store offer same-day delivery? <span className="text-red-500">*</span>
            </FieldLabel>
          </div>
          <p className="pl-9 text-xs text-slate-500">
            Let customers know if their orders can be prepared and delivered on the same day.
          </p>
        </div>

        <Controller
          name="sameDayDelivery"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  field.onChange(true);
                }}
                className={cn(
                  "group relative flex cursor-pointer items-center justify-between rounded-xl border p-3 text-sm font-semibold transition-all",
                  field.value === true
                    ? "border-emerald-600 bg-emerald-500/10 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-lg transition-colors",
                      field.value === true
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-400 dark:bg-slate-700",
                    )}
                  >
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold">Yes</span>
                    <span className="text-[10px] font-normal text-slate-400">Available</span>
                  </div>
                </div>
                {field.value === true && (
                  <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  field.onChange(false);
                  setValue("orderProcessingTime", "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                className={cn(
                  "group relative flex cursor-pointer items-center justify-between rounded-xl border p-3 text-sm font-semibold transition-all",
                  field.value === false
                    ? "border-rose-400 bg-rose-50 text-rose-950 shadow-xs ring-2 ring-rose-500/20 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-lg transition-colors",
                      field.value === false
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-400 dark:bg-slate-700",
                    )}
                  >
                    <XCircle className="size-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold">No</span>
                    <span className="text-[10px] font-normal text-slate-400">Disabled</span>
                  </div>
                </div>
              </button>
            </div>
          )}
        />
      </div>

      <Controller
        name="sameDayDelivery"
        control={control}
        render={({ field: sameDayField }) => (
          <>
            {sameDayField.value ? (
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-linear-to-b from-white to-slate-50/50 p-4 shadow-xs transition-all sm:p-5 dark:border-slate-800 dark:from-slate-900/60 dark:to-slate-900/30">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                      <Clock className="size-4" />
                    </div>
                    <FieldLabel
                      htmlFor="orderProcessingTime"
                      className="text-sm font-semibold text-slate-800 dark:text-slate-100"
                    >
                      Estimated Order Processing Time <span className="text-red-500">*</span>
                    </FieldLabel>
                  </div>
                  <p className="pl-9 text-xs text-slate-500">
                    Required preparation time before an order is ready for fulfillment.
                  </p>
                </div>

                <Controller
                  name="orderProcessingTime"
                  control={control}
                  render={({ field }) => (
                    <div className="pt-3">
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val ?? "");
                        }}
                      >
                        <SelectTrigger
                          id="orderProcessingTime"
                          aria-invalid={!!errors.orderProcessingTime}
                          className={cn(
                            "h-12 w-full rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm font-medium shadow-xs transition-all hover:border-slate-300 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800",
                            errors.orderProcessingTime && "border-red-400 bg-red-50/30",
                          )}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                              <Timer className="size-4" />
                            </div>
                            <SelectValue placeholder="Select processing time" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="max-w-105 p-1.5">
                          {ORDER_PROCESSING_TIME_OPTIONS.map((opt) => {
                            const meta = PROCESSING_TIME_META[opt] || {
                              badge: "Standard",
                              badgeColor: "border-slate-200 bg-slate-100 text-slate-700",
                              description: "Preparation window",
                              icon: Clock,
                            };
                            const OptIcon = meta.icon;
                            return (
                              <SelectItem
                                key={opt}
                                value={opt}
                                label={opt}
                                className="cursor-pointer rounded-xl px-3 py-2.5 transition-colors"
                              >
                                <div className="flex w-full items-start gap-2.5">
                                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    <OptIcon className="size-3.5" />
                                  </div>
                                  <div className="flex flex-col text-left">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                                        {opt}
                                      </span>
                                      <span
                                        className={cn(
                                          "rounded-md border px-1.5 py-0.5 text-[10px] leading-none font-semibold",
                                          meta.badgeColor,
                                        )}
                                      >
                                        {meta.badge}
                                      </span>
                                    </div>
                                    <span className="text-[11px] leading-tight font-normal text-slate-400 dark:text-slate-500">
                                      {meta.description}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.orderProcessingTime && (
                  <p className="pt-1 text-xs font-medium text-red-500">
                    {errors.orderProcessingTime.message as string}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col justify-between rounded-2xl border border-dashed border-slate-200/90 bg-slate-50/50 p-4 text-xs text-slate-500 sm:p-5 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      Processing Time Not Applicable
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                      Select &quot;Yes&quot; to configure estimated order preparation and
                      fulfillment duration.
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-slate-200/60 bg-white/60 px-3 py-2 text-center text-[11px] font-medium text-slate-400 dark:border-slate-800 dark:bg-slate-800/40">
                  Same-Day Delivery Off
                </div>
              </div>
            )}
          </>
        )}
      />
    </div>
  );
}
