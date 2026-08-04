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
import { Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import { type CountryManagerFormValues } from "../schema/country-manager.schema";
import { CountryManagerForm } from "./country-manager-form";

type AddCountryManagerDialogProps = {
  onSubmit: (values: CountryManagerFormValues) => Promise<void> | void;
};

export function AddCountryManagerDialog({ onSubmit }: AddCountryManagerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: CountryManagerFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      successToast({ title: "Country manager added successfully" });
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Add Country Manager
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto p-0">
        <DialogHeader className="border-b bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 p-6 pb-5">
          <DialogTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
              <UserPlus className="h-6 w-6" />
            </div>

            <span>Add Country Manager</span>
          </DialogTitle>

          <p className="mt-2 text-center text-sm text-slate-500">
            Create a new country manager and assign their details.
          </p>
        </DialogHeader>
        <CountryManagerForm
          onSubmit={handleSubmit}
          submitLabel="Assign"
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
