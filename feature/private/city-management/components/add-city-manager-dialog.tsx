"use client";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPinPlus, Plus } from "lucide-react";
import { useState } from "react";
import { type CityManagerFormValues } from "../schema/city-manager.schema";
import { CityManagerForm } from "./city-manager-form";

type AddCityManagerDialogProps = {
  onSubmit: (values: CityManagerFormValues) => Promise<void> | void;
};

export function AddCityManagerDialog({ onSubmit }: AddCityManagerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: CityManagerFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      successToast({ title: "City manager added successfully" });
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Add City Manager
      </DialogTrigger>
      <DialogContent className="max-w-5xl gap-0 overflow-hidden border-0 p-0 shadow-2xl sm:max-h-[90vh]">
        <div className="max-h-[90vh] overflow-y-auto overscroll-contain">
          <div className="relative overflow-hidden">
            <DialogHeader className="border-b bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 p-6 pb-5">
              <DialogTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-slate-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
                  <MapPinPlus size={20} />
                </div>
                <span> Add City Manager</span>
              </DialogTitle>
              <p className="mt-2 text-center text-sm text-slate-500">
                Create a polished profile, upload a photo, and assign cities in one smooth flow.
              </p>
            </DialogHeader>
          </div>

          <div className="relative -mt-2 rounded-t-3xl bg-white">
            <CityManagerForm
              mode="add"
              onSubmit={handleSubmit}
              submitLabel="Assign Manager"
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
