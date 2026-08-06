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
import { Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { type SubAdminFormValues } from "../schema/sub-admin.schema";
import { SubAdminForm } from "./sub-admin-form";

export function AddSubAdminDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: SubAdminFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Sub Admin Added:", values);
      successToast({ title: "Sub Admin added successfully" });
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Add Sub-Admin
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader className="rounded-t-3xl border-b px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                Add Sub Admin
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm text-slate-600">
                Create a new sub-admin account and assign permissions for dashboard access.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <SubAdminForm onSubmit={handleSubmit} submitLabel="Add" isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}
