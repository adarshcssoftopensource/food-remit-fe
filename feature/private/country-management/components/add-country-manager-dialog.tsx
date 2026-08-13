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
import { Plus } from "lucide-react";
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
      <DialogContent className="flex max-h-[90vh] max-w-5xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b bg-linear-to-r from-slate-50 via-slate-100 to-slate-50 p-6 pb-5">
          <DialogTitle className="text-center text-2xl font-extrabold tracking-tight text-slate-800">
            Add Country Manager
          </DialogTitle>
          <p className="mt-1 text-center text-sm font-medium text-slate-500">
            Create a new country manager and assign their details.
          </p>
        </DialogHeader>
        <CountryManagerForm
          onSubmit={handleSubmit}
          submitLabel="Assign Manager"
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
