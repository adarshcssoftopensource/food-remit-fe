"use client";

import { successToast } from "@/components/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CountryManagerData } from "@/feature/private/country-management/types/country-manager";
import { useMemo, useState } from "react";
import { type CountryManagerFormValues } from "../schema/country-manager.schema";
import { CountryManagerForm } from "./country-manager-form";

type EditCountryManagerDialogProps = {
  manager: CountryManagerData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, formData: FormData) => Promise<void> | void;
};

export function EditCountryManagerDialog({
  manager,
  open,
  onOpenChange,
  onSubmit,
}: EditCountryManagerDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValues = useMemo<Partial<CountryManagerFormValues>>(() => {
    if (!manager) return {};
    return {
      image: [],
      firstName: manager.firstName,
      lastName: manager.lastName,
      email: manager.email,
      phoneCode: manager.phoneCode,
      phoneNumber: manager.phoneNumber,
      address1: manager.address1,
      address2: manager.address2 ?? "",
      residentialCountry: manager.residentialCountry,
      state: manager.state,
      city: manager.city,
      zipcode: manager.zipcode,
      assignedCountry: manager.assignedCountry || manager.assignCountryName || "",
    };
  }, [manager]);

  const handleSubmit = async (values: CountryManagerFormValues) => {
    if (!manager) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("countryCode", values.phoneCode);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("address", values.address1);
      if (values.address2) formData.append("address2", values.address2);
      formData.append("country", values.residentialCountry);
      formData.append("state", values.state);
      formData.append("city", values.city);
      formData.append("zipcode", values.zipcode);
      formData.append("assignCountries", values.assignedCountry);

      const imageFile =
        Array.isArray(values.image) && values.image.length > 0 ? values.image[0] : values.image;
      if (imageFile instanceof File) {
        formData.append("image", imageFile);
      } else if (typeof imageFile === "string" && imageFile !== manager.image) {
        formData.append("image", imageFile);
      }

      await onSubmit(manager.id, formData);
      successToast({ title: "Country manager updated successfully" });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto p-0">
        <DialogHeader className="border-b bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 p-6 pb-5">
          <DialogTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-slate-800">
            <span>Edit Country Manager</span>
          </DialogTitle>

          <p className="mt-2 text-center text-sm text-slate-500">
            Update the country manager&apos;s information and assigned details.
          </p>
        </DialogHeader>
        {manager ? (
          <CountryManagerForm
            mode="edit"
            onSubmit={handleSubmit}
            initialValues={initialValues}
            previewImageUrl={manager.image ?? undefined}
            submitLabel="Update"
            isSubmitting={isSubmitting}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
