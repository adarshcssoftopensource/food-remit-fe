"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Controller, type Control, type UseFormSetValue } from "react-hook-form";

import { Label } from "@/components/ui/label";
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
    <>
      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-6">
        <Label className="text-sm font-semibold text-slate-700">
          Does your Store offer same-day delivery?
        </Label>
        <p className="text-xs text-slate-500">
          Let customers know if their orders can be prepared and delivered or picked up on the same
          day.
        </p>

        <Controller
          name="sameDayDelivery"
          control={control}
          render={({ field }) => (
            <div className="grid max-w-sm grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => field.onChange(true)}
                disabled={isNonCommissionDisabled}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all",
                  field.value === true
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm ring-2 ring-emerald-600/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                  isNonCommissionDisabled && "cursor-not-allowed opacity-60",
                )}
              >
                <CheckCircle2
                  className={cn(
                    "size-4",
                    field.value === true ? "text-emerald-600" : "text-slate-400",
                  )}
                />
                Yes
              </button>

              <button
                type="button"
                onClick={() => {
                  field.onChange(false);
                  setValue("orderProcessingTime", "");
                }}
                disabled={isNonCommissionDisabled}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all",
                  field.value === false
                    ? "border-rose-400 bg-rose-50 text-rose-950 shadow-sm ring-2 ring-rose-500/20 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
                  isNonCommissionDisabled && "cursor-not-allowed opacity-60",
                )}
              >
                <XCircle
                  className={cn(
                    "size-4",
                    field.value === false ? "text-rose-600 dark:text-rose-400" : "text-slate-400",
                  )}
                />
                No
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
              <div className="mt-1 flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                <Label
                  htmlFor="orderProcessingTime"
                  className="text-sm font-semibold text-slate-700"
                >
                  Estimated Order Processing Time
                </Label>
                <p className="text-xs text-slate-500">
                  Required preparation time before an order is ready for fulfillment.
                </p>
                <Controller
                  name="orderProcessingTime"
                  control={control}
                  render={({ field }) => (
                    <div className="max-w-md pt-1">
                      <Select
                        disabled={isNonCommissionDisabled}
                        value={field.value}
                        onValueChange={(val) => field.onChange(val ?? "")}
                      >
                        <SelectTrigger
                          id="orderProcessingTime"
                          className={cn(
                            "h-11! w-full rounded-xl border-slate-200 bg-white text-sm",
                          )}
                        >
                          <SelectValue placeholder="Select processing time" />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_PROCESSING_TIME_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              <div className="flex items-center gap-2">
                                <Clock className="size-3.5 text-emerald-600" />
                                <span>{opt}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
            )}
          </>
        )}
      />
    </>
  );
}
