"use client";

import { successToast } from "@/components/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type SubAdminData } from "@/constants/sub-admin-management";
import { useState } from "react";
import { type SubAdminFormValues } from "../schema/sub-admin.schema";
import { SubAdminForm } from "./sub-admin-form";

interface EditSubAdminDialogProps {
  admin: SubAdminData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSubAdminDialog({ admin, open, onOpenChange }: EditSubAdminDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: SubAdminFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Sub Admin Updated:", values);
      successToast({ title: "Sub Admin updated successfully" });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [phoneCode, ...phoneParts] = admin.contactNumber.split(" ");
  const phoneNumber = phoneParts.join(" ");

  const initialValues: Partial<SubAdminFormValues> = {
    name: admin.userName,
    email: admin.email,
    phoneCode: phoneCode || "91",
    phoneNumber: phoneNumber || admin.contactNumber,
    permissions: admin.permissions,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader className="border-b p-6 pb-4">
          <DialogTitle className="text-center text-xl font-bold">Edit Sub Admin</DialogTitle>
        </DialogHeader>
        <SubAdminForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Submit"
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
