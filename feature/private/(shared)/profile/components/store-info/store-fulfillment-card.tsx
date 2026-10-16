"use client";

import { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Truck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StoreInfoValues } from "../../schema/store-info.schema";
import { StoreSameDayDeliveryFields } from "./store-same-day-delivery-fields";
import { StoreProductScreeningFields } from "./store-product-screening-fields";

interface StoreFulfillmentCardProps {
  control: Control<StoreInfoValues>;
  errors: FieldErrors<StoreInfoValues>;
  setValue: UseFormSetValue<StoreInfoValues>;
  isEmployee: boolean;
}

export function StoreFulfillmentCard({
  control,
  errors,
  setValue,
  isEmployee,
}: StoreFulfillmentCardProps) {
  return (
    <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
      <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
            <Truck className="size-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
              Fulfillment & Product Preferences
            </CardTitle>
            <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
              Configure same-day delivery availability, preparation times, and product handling.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-4 sm:p-8">
        <StoreSameDayDeliveryFields control={control} errors={errors} setValue={setValue} />

        <StoreProductScreeningFields control={control} setValue={setValue} disabled={isEmployee} />
      </CardContent>
    </Card>
  );
}
