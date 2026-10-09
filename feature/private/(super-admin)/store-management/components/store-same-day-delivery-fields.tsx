"use client";

import { CheckCircle2, Clock, Truck, XCircle } from "lucide-react";
import { Controller, type Control, type UseFormSetValue } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_PROCESSING_TIME_OPTIONS } from "@/constants/become-a-partner";
import { cn } from "@/lib/utils";
import { type StoreFormValues } from "../schema/store.schema";

interface StoreSameDayDeliveryFieldsProps {
  control: Control<StoreFormValues>;
  setValue: UseFormSetValue<StoreFormValues>;
  isNonCommissionDisabled: boolean;
}

export function StoreSameDayDeliveryFields({
  control,
  setValue,
  isNonCommissionDisabled,
}: StoreSameDayDeliveryFieldsProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-linear-to-br from-slate-50/70 via-white to-emerald-50/20 p-4 transition-all sm:p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700 ring-4 ring-emerald-50/80">
            <Truck className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800 sm:text-base">
                Same-Day Delivery & Pickup
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 uppercase">
                Fulfillment
              </span>
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
              Allow customers to place orders for preparation and delivery or pickup on the same
              day.
            </p>
          </div>
        </div>

        <Controller
          name="sameDayDelivery"
          control={control}
          render={({ field }) => (
            <div className="inline-flex shrink-0 self-start rounded-xl border border-slate-200/70 bg-slate-100/90 p-1 sm:self-auto">
              <button
                type="button"
                onClick={() => field.onChange(true)}
                disabled={isNonCommissionDisabled}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60",
                  field.value === true
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900",
                )}
              >
                <CheckCircle2 className="size-3.5" />
                Yes, Offered
              </button>

              <button
                type="button"
                onClick={() => {
                  field.onChange(false);
                  setValue("orderProcessingTime", "");
                }}
                disabled={isNonCommissionDisabled}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60",
                  field.value === false
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-rose-700 dark:text-slate-400 dark:hover:text-rose-300",
                )}
              >
                <XCircle className="size-3.5" />
                Not Offered
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
            {sameDayField.value && (
              <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-t border-emerald-100 border-slate-200/70 bg-white/95 p-3 pt-4 shadow-2xs sm:flex-row sm:items-center sm:p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Estimated Order Processing Time
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Preparation duration before an order is ready for dispatch or customer pickup.
                    </p>
                  </div>
                </div>

                <div className="w-full shrink-0 sm:w-56">
                  <Controller
                    name="orderProcessingTime"
                    control={control}
                    render={({ field }) => (
                      <Select
                        disabled={isNonCommissionDisabled}
                        value={field.value}
                        onValueChange={(val) => field.onChange(val ?? "")}
                      >
                        <SelectTrigger
                          id="orderProcessingTime"
                          className="h-10 w-full rounded-xl border-slate-200 bg-white text-xs font-semibold shadow-2xs focus-visible:ring-emerald-500/20"
                        >
                          <SelectValue placeholder="Select processing time" />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_PROCESSING_TIME_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              <div className="flex items-center gap-2">
                                <Clock className="size-3.5 text-emerald-600" />
                                <span className="text-xs font-medium">{opt}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            )}
          </>
        )}
      />
    </div>
  );
}
