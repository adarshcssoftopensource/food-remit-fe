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
import { type CityManagerFormValues } from "../schema/city-manager.schema";
import { CityManagerForm } from "./city-manager-form";

type AddCityManagerDialogProps = {
  onSubmit: (formData: FormData) => Promise<void> | void;
};

export function AddCityManagerDialog({ onSubmit }: AddCityManagerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: CityManagerFormValues) => {
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
      formData.append("managerStatus", "ACTIVE");

      const imageFile =
        Array.isArray(values.image) && values.image.length > 0 ? values.image[0] : values.image;
      if (imageFile instanceof File) {
        formData.append("image", imageFile);
      }

      await onSubmit(formData);
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
      <DialogContent className="flex max-h-[90vh] max-w-5xl flex-col gap-0 overflow-hidden border-0 p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-linear-to-r from-slate-50 via-slate-100 to-slate-50 p-6 pb-5">
          <DialogTitle className="text-center text-2xl font-extrabold tracking-tight text-slate-800">
            Add City Manager
          </DialogTitle>
          <p className="mt-1 text-center text-sm font-medium text-slate-500">
            Create a new city manager and assign their details.
          </p>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden bg-white">
          <CityManagerForm
            mode="add"
            onSubmit={handleSubmit}
            submitLabel="Assign Manager"
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
