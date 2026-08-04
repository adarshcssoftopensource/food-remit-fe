"use client";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPinPlus, Plus, Sparkles } from "lucide-react";
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
            <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(ellipse_at_top,_rgba(251,146,60,0.35),_transparent_70%),linear-gradient(135deg,#0f172a_0%,#1e3a5f_50%,#0f766e_100%)]" />
            <div className="absolute top-6 right-16 size-24 rounded-full bg-orange-400/20 blur-2xl" />
            <div className="absolute top-10 left-20 size-16 rounded-full bg-teal-300/20 blur-xl" />

            <DialogHeader className="relative z-10 px-8 pt-8 pb-6 text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
                <Sparkles className="size-3.5 text-amber-300" />
                NEW ASSIGNMENT
              </div>
              <DialogTitle className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-white">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                  <MapPinPlus className="size-6 text-amber-300" />
                </span>
                Add City Manager
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-xl text-sm text-slate-200/90">
                Create a polished profile, upload a photo, and assign cities in one smooth flow.
              </DialogDescription>
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
