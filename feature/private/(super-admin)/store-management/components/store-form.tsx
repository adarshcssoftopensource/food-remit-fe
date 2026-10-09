"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useProfile } from "@/components/providers/profile-provider";
import { useGetCountriesDropdown } from "@/feature/private/(shared)/settings/hooks/use-get-countries-dropdown";
import { getCountryPhoneInfo } from "@/lib/phone";
import { storeSchema, type StoreFormValues } from "../schema/store.schema";
import { StoreDetailsCard } from "./store-details-card";
import { StoreManagerDetailsCard } from "./store-manager-details-card";
import { StoreOperationalPreferencesCard } from "./store-operational-preferences-card";

interface StoreFormProps {
  initialValues?: Partial<StoreFormValues>;
  onSubmit: (values: StoreFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  mode?: "add" | "edit";
  onCancel?: () => void;
}

function getStoreFormDefaultValues(
  initialValues?: Partial<StoreFormValues>,
): DefaultValues<StoreFormValues> {
  return {
    storeImage: initialValues?.storeImage ?? undefined,
    storeName: initialValues?.storeName ?? "",
    storePhoneCode: initialValues?.storePhoneCode || "+91",
    storePhoneNumber: initialValues?.storePhoneNumber ?? "",
    storeAddress: initialValues?.storeAddress ?? "",
    address2: initialValues?.address2 ?? "",
    storeCountry: initialValues?.storeCountry ?? "",
    storeCity: initialValues?.storeCity ?? "",
    storeTax: initialValues?.storeTax !== null ? initialValues?.storeTax : undefined,
    foodRemitCommission:
      initialValues?.foodRemitCommission !== null ? initialValues?.foodRemitCommission : undefined,
    sameDayDelivery: initialValues?.sameDayDelivery ?? false,
    orderProcessingTime: initialValues?.orderProcessingTime ?? "",
    perishableProducts: initialValues?.perishableProducts ?? false,
    refrigeratedProducts: initialValues?.refrigeratedProducts ?? false,
    frozenProducts: initialValues?.frozenProducts ?? false,
    managerImage: initialValues?.managerImage ?? undefined,
    managerFirstName: initialValues?.managerFirstName ?? "",
    managerLastName: initialValues?.managerLastName ?? "",
    managerEmail: initialValues?.managerEmail ?? "",
    managerPhoneCode: initialValues?.managerPhoneCode || "+91",
    managerPhoneNumber: initialValues?.managerPhoneNumber ?? "",
    managerAddress: initialValues?.managerAddress ?? "",
    managerCountry: initialValues?.managerCountry ?? "",
    managerState: initialValues?.managerState ?? "",
    managerCity: initialValues?.managerCity ?? "",
    managerZipCode: initialValues?.managerZipCode ?? "",
  };
}

export function StoreForm({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting = false,
  mode = "add",
  onCancel,
}: StoreFormProps) {
  const { canViewPlatformFees, isSuperAdmin } = useProfile();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: getStoreFormDefaultValues(initialValues),
    mode: "onBlur",
  });

  const isNonCommissionDisabled = isSuperAdmin && mode === "edit";

  const { countries: apiCountries } = useGetCountriesDropdown();
  const currentStoreCountry = watch("storeCountry");
  const storePhoneInfo = useMemo(
    () => getCountryPhoneInfo(currentStoreCountry, apiCountries),
    [currentStoreCountry, apiCountries],
  );

  const currentManagerCountry = watch("managerCountry");
  const managerPhoneInfo = useMemo(
    () => getCountryPhoneInfo(currentManagerCountry, apiCountries),
    [currentManagerCountry, apiCountries],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden"
    >
      <div className="min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="grid w-full min-w-0 items-start gap-4 p-3.5 sm:gap-6 sm:p-6 lg:grid-cols-2">
          <StoreDetailsCard
            control={control}
            errors={errors}
            setValue={setValue}
            initialValues={initialValues}
            isNonCommissionDisabled={isNonCommissionDisabled}
            canViewPlatformFees={canViewPlatformFees}
            storePhoneInfo={storePhoneInfo}
            apiCountries={apiCountries}
          />

          <StoreManagerDetailsCard
            control={control}
            errors={errors}
            setValue={setValue}
            initialValues={initialValues}
            isNonCommissionDisabled={isNonCommissionDisabled}
            mode={mode}
            managerPhoneInfo={managerPhoneInfo}
            apiCountries={apiCountries}
          />

          <StoreOperationalPreferencesCard
            control={control}
            setValue={setValue}
            isNonCommissionDisabled={isNonCommissionDisabled}
          />
        </div>
      </div>

      <div className="flex w-full min-w-0 shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] sm:px-6 sm:py-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-11 rounded-xl border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!isDirty || isSubmitting}
          className="h-11 w-full rounded-xl bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-600 px-8 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] hover:from-emerald-700 hover:to-teal-700 sm:h-12 sm:w-auto sm:px-10 sm:text-base"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
