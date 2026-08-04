"use client";

import { successToast } from "@/components/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CountryManagerData } from "@/constants/country-manager";
import { UserPen } from "lucide-react";
import { useMemo, useState } from "react";
import { type CountryManagerFormValues } from "../schema/country-manager.schema";
import { CountryManagerForm } from "./country-manager-form";

type EditCountryManagerDialogProps = {
  manager: CountryManagerData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, values: CountryManagerFormValues) => Promise<void> | void;
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
      assignedCountry: manager.assignedCountry,
    };
  }, [manager]);

  const handleSubmit = async (values: CountryManagerFormValues) => {
    if (!manager) return;
    setIsSubmitting(true);
    try {
      await onSubmit(manager.id, values);
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
              <UserPen className="h-6 w-6" />
            </div>

            <span>Edit Country Manager</span>
          </DialogTitle>

          <p className="mt-2 text-center text-sm text-slate-500">
            Update the country manager&apos;s information and assigned details.
          </p>
        </DialogHeader>
        {manager ? (
          <CountryManagerForm
            onSubmit={handleSubmit}
            initialValues={initialValues}
            previewImageUrl={manager.avatar}
            submitLabel="Update"
            isSubmitting={isSubmitting}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
