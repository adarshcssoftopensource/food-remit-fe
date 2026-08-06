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

interface SubAdminDialogProps {
  mode?: "add" | "edit";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SubAdminDialog({
  mode = "add",
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: SubAdminDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const handleSubmit = async (values: SubAdminFormValues) => {
    setIsSubmitting(true);
    try {
      console.log(values);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (mode === "add") {
        successToast({ title: "Sub Admin added successfully" });
      } else {
        successToast({ title: "Sub Admin updated successfully" });
      }
      onOpenChange(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
    }
  };

  const initialValues: Partial<SubAdminFormValues> | undefined = undefined;

  const title = mode === "add" ? "Add Sub Admin" : "Edit Sub Admin";
  const submitLabel = mode === "add" ? "Add" : "Submit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {mode === "add" && (
        <DialogTrigger render={<Button />}>
          <Plus className="mr-2 h-4 w-4" />
          Add Sub-Admin
        </DialogTrigger>
      )}
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader className="rounded-t-3xl border-b px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                {title}
              </DialogTitle>

              {mode === "add" && (
                <DialogDescription className="mt-1 text-sm text-slate-600">
                  Create a new sub-admin account and assign permissions for dashboard access.
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        <SubAdminForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel={submitLabel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
