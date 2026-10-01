"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe2 } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { CountrySelect } from "@/components/common/country-select";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { FormFieldError } from "@/feature/private/(super-admin)/city-management/components/shared/form-field-error";
import { MANAGER_INPUT_CLASS } from "@/feature/private/(super-admin)/city-management/components/shared/manager-form.types";
import { ManagerPersonalDetailsSection } from "@/feature/private/(super-admin)/city-management/components/shared/manager-personal-details-section";
import { ManagerProfilePhotoSection } from "@/feature/private/(super-admin)/city-management/components/shared/manager-profile-photo-section";
import { ManagerResidentialAddressSection } from "@/feature/private/(super-admin)/city-management/components/shared/manager-residential-address-section";
import { SectionShell } from "@/feature/private/(super-admin)/city-management/components/shared/section-shell";
import {
  countryManagerSchema,
  type CountryManagerFormValues,
} from "../schema/country-manager.schema";

type CountryManagerFormProps = {
  initialValues?: Partial<CountryManagerFormValues>;
  previewImageUrl?: string;
  onSubmit: (values: CountryManagerFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  mode?: "add" | "edit";
};

function getCountryManagerDefaultValues(
  initialValues?: Partial<CountryManagerFormValues>,
): CountryManagerFormValues {
  return {
    image: initialValues?.image ?? [],
    firstName: initialValues?.firstName ?? "",
    lastName: initialValues?.lastName ?? "",
    email: initialValues?.email ?? "",
    phoneCode: initialValues?.phoneCode ?? "",
    phoneNumber: initialValues?.phoneNumber ?? "",
    address1: initialValues?.address1 ?? "",
    address2: initialValues?.address2 ?? "",
    residentialCountry: initialValues?.residentialCountry ?? "",
    state: initialValues?.state ?? "",
    city: initialValues?.city ?? "",
    zipcode: initialValues?.zipcode ?? "",
    assignedCountry: initialValues?.assignedCountry ?? "",
  };
}

export function CountryManagerForm({
  initialValues,
  previewImageUrl,
  onSubmit,
  submitLabel = "Assign Manager",
  isSubmitting = false,
  mode = "add",
}: CountryManagerFormProps) {
  const form = useForm<CountryManagerFormValues>({
    resolver: zodResolver(countryManagerSchema),
    defaultValues: getCountryManagerDefaultValues(initialValues),
    mode: "onChange",
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/30 p-6">
          <SectionShell
            icon={Globe2}
            title="Assignment"
            subtitle="Country this manager will handle"
            accent="bg-amber-100 text-amber-700"
          >
            <Controller
              name="assignedCountry"
              control={control}
              render={({ field }) => (
                <div className="max-w-md">
                  <FieldLabel className="mb-1.5 text-sm font-semibold">
                    Assign Country <span className="text-red-500">*</span>
                  </FieldLabel>
                  <CountrySelect
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={mode === "edit"}
                    invalid={!!errors.assignedCountry}
                    placeholder="Select country to assign"
                  />
                  <FormFieldError message={errors.assignedCountry?.message} />
                </div>
              )}
            />
          </SectionShell>

          <ManagerProfilePhotoSection
            subtitle="Upload a clear headshot for the country manager profile"
            previewImageUrl={previewImageUrl}
            errors={errors}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <ManagerPersonalDetailsSection mode={mode} errors={errors} />

            <ManagerResidentialAddressSection
              idPrefix="countryMgr"
              selectTriggerClassName={MANAGER_INPUT_CLASS}
              errors={errors}
            />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 flex justify-center border-t bg-white px-6 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="h-12 rounded-xl px-12 text-base font-semibold shadow-md transition-transform hover:scale-[1.02]"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
