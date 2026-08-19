"use client";

import { successToast } from "@/components/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CityManagerData } from "@/feature/private/city-management/types/city-manager";
import { useMemo, useState } from "react";
import { type CityManagerFormValues } from "../schema/city-manager.schema";
import { CityManagerForm } from "./city-manager-form";

type EditCityManagerDialogProps = {
  manager: CityManagerData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, formData: FormData) => Promise<void> | void;
};

export function EditCityManagerDialog({
  manager,
  open,
  onOpenChange,
  onSubmit,
}: EditCityManagerDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = useMemo<Partial<CityManagerFormValues>>(() => {
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
      country: manager.country,
      assignedCities: manager.assignedCities,
    };
  }, [manager]);

  const handleSubmit = async (values: CityManagerFormValues) => {
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
      formData.append("residentialCountry", values.residentialCountry);
      formData.append("state", values.state);
      formData.append("city", values.city);
      formData.append("country", values.country);
      if (values.zipcode) formData.append("zipcode", values.zipcode);
      formData.append("assignCities", values.assignedCities.join(","));

      const imageFile =
        Array.isArray(values.image) && values.image.length > 0 ? values.image[0] : values.image;
      if (imageFile instanceof File) {
        formData.append("image", imageFile);
      } else if (typeof imageFile === "string" && imageFile !== manager.image) {
        formData.append("image", imageFile);
      }

      await onSubmit(manager.id, formData);
      successToast({ title: "City manager updated successfully" });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl gap-0 overflow-hidden border-0 p-0 shadow-2xl sm:max-h-[90vh]">
        <div className="max-h-[90vh] overflow-y-auto overscroll-contain">
          <div className="relative overflow-hidden">
            <DialogHeader className="border-b border-emerald-100/60 bg-linear-to-r from-emerald-50/70 via-teal-50/30 to-emerald-50/40 p-6 pb-5">
              <DialogTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-slate-800">
                <span>Edit City Manager</span>
              </DialogTitle>
              {manager ? (
                <p className="mt-2 text-center text-sm text-slate-500">
                  {`Editing ${manager.firstName} ${manager.lastName}. Update profile information and assigned cities.`}
                </p>
              ) : (
                <p className="mt-2 text-center text-sm text-slate-500">
                  Create a new city manager by providing profile details and assigning cities.
                </p>
              )}
            </DialogHeader>
          </div>

          <div className="relative -mt-2 rounded-t-3xl bg-white">
            {manager ? (
              <CityManagerForm
                key={manager.id}
                mode="edit"
                onSubmit={handleSubmit}
                initialValues={initialValues}
                previewImageUrl={manager.image ?? undefined}
                submitLabel="Save Changes"
                isSubmitting={isSubmitting}
                managerId={manager.id}
              />
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
