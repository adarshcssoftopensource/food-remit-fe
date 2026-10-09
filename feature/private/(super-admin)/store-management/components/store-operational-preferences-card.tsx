"use client";

import { Store } from "lucide-react";
import { type Control, type UseFormSetValue } from "react-hook-form";

import { StoreProductScreeningFields } from "@/feature/private/(shared)/profile/components/store-information-fields";
import { type StoreFormValues } from "../schema/store.schema";
import { StoreFormCard } from "./store-form-card";
import { StoreSameDayDeliveryFields } from "./store-same-day-delivery-fields";

interface StoreOperationalPreferencesCardProps {
  control: Control<StoreFormValues>;
  setValue: UseFormSetValue<StoreFormValues>;
  isNonCommissionDisabled: boolean;
}

export function StoreOperationalPreferencesCard({
  control,
  setValue,
  isNonCommissionDisabled,
}: StoreOperationalPreferencesCardProps) {
  return (
    <div className="w-full min-w-0 lg:col-span-2">
      <StoreFormCard
        icon={Store}
        iconWrapperClassName="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500/15 to-teal-500/20 text-emerald-600"
        iconClassName="size-4.5 text-emerald-600"
        title="Operational Preferences"
        subtitle="Manage fulfillment capabilities and fresh product handling rules"
      >
        <StoreSameDayDeliveryFields
          control={control}
          setValue={setValue}
          isNonCommissionDisabled={isNonCommissionDisabled}
        />

        <div className="border-t border-slate-100 pt-5">
          <StoreProductScreeningFields
            control={control}
            setValue={setValue}
            disabled={isNonCommissionDisabled}
          />
        </div>
      </StoreFormCard>
    </div>
  );
}
