"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { cityManagerSchema, type CityManagerFormValues } from "../schema/city-manager.schema";
import { CityAssignmentSection } from "./city-assignment-section";
import { ManagerPersonalDetailsSection } from "./shared/manager-personal-details-section";
import { ManagerProfilePhotoSection } from "./shared/manager-profile-photo-section";
import { ManagerResidentialAddressSection } from "./shared/manager-residential-address-section";

type CityManagerFormProps = {
  initialValues?: Partial<CityManagerFormValues>;
  previewImageUrl?: string;
  onSubmit: (values: CityManagerFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  mode?: "add" | "edit";
  managerId?: string;
};

function getCityManagerDefaultValues(
  initialValues?: Partial<CityManagerFormValues>,
): CityManagerFormValues {
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
    country: initialValues?.country ?? "",
    assignedCities: initialValues?.assignedCities ?? [],
  };
}

export function CityManagerForm({
  initialValues,
  previewImageUrl,
  onSubmit,
  submitLabel = "Assign",
  isSubmitting = false,
  mode = "add",
  managerId,
}: CityManagerFormProps) {
  const form = useForm<CityManagerFormValues>({
    resolver: zodResolver(cityManagerSchema),
    defaultValues: getCityManagerDefaultValues(initialValues),
    mode: "onChange",
  });
  const {
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <CityAssignmentSection mode={mode} managerId={managerId} errors={errors} />

          <ManagerProfilePhotoSection
            subtitle="Upload a clear headshot for the city manager profile"
            previewImageUrl={previewImageUrl}
            errors={errors}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <ManagerPersonalDetailsSection mode={mode} errors={errors} />

            <ManagerResidentialAddressSection
              idPrefix="cityMgr"
              selectTriggerClassName="h-11! w-full rounded-xl border-slate-200 bg-slate-50/80"
              errors={errors}
            />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 flex justify-center border-t bg-white px-6 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="h-12 rounded-xl px-12 text-base font-semibold shadow-md transition-colors hover:scale-[1.02]"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
