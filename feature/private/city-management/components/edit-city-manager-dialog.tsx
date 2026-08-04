"use client";

import { successToast } from "@/components/toaster";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CityManagerData } from "@/constants/city-manager";
import { PencilLine, Sparkles } from "lucide-react";
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
            <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(ellipse_at_top,_rgba(96,165,250,0.35),_transparent_70%),linear-gradient(135deg,#0f172a_0%,#1e3a8a_55%,#4c1d95_100%)]" />
            <div className="absolute top-4 right-12 size-28 rounded-full bg-blue-400/25 blur-3xl" />
            <div className="absolute top-12 left-24 size-20 rounded-full bg-violet-400/20 blur-2xl" />

            <DialogHeader className="relative z-10 px-8 pt-8 pb-6 text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
                <Sparkles className="size-3.5 text-sky-300" />
                UPDATE PROFILE
              </div>
              <DialogTitle className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-white">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                  <PencilLine className="size-6 text-sky-300" />
                </span>
                Edit City Manager
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-xl text-sm text-slate-200/90">
                {manager
                  ? `Editing ${manager.firstName} ${manager.lastName} · refine details & city coverage.`
                  : "Update manager details and city assignments."}
              </DialogDescription>
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
