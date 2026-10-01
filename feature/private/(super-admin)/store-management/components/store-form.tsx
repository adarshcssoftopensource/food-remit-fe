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

interface StoreFormProps {
  initialValues?: Partial<StoreFormValues>;
  onSubmit: (values: StoreFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  mode?: "add" | "edit";
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="grid gap-6 p-6 lg:grid-cols-2">
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
        </div>
      </div>

      <div className="sticky bottom-0 z-10 flex justify-center border-t bg-white px-6 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!isDirty || isSubmitting}
          className="h-12 rounded-xl px-12 text-base font-semibold shadow-md transition-transform hover:scale-[1.02]"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
