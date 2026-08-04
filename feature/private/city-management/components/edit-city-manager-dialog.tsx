"use client";

import { successToast } from "@/components/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CityManagerData } from "@/constants/city-manager";
import { PencilLine } from "lucide-react";
import { useMemo, useState } from "react";
import { type CityManagerFormValues } from "../schema/city-manager.schema";
import { CityManagerForm } from "./city-manager-form";

type EditCityManagerDialogProps = {
  manager: CityManagerData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, values: CityManagerFormValues) => Promise<void> | void;
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
      await onSubmit(manager.id, values);
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
            <DialogHeader className="border-b bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 p-6 pb-5">
              <DialogTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-slate-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
                  <PencilLine size={20} />
                </div>
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
                previewImageUrl={manager.avatar}
                submitLabel="Save Changes"
                isSubmitting={isSubmitting}
              />
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
