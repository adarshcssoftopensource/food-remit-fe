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
      <DialogTrigger>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Sub-Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader className="border-b p-6 pb-4">
          <DialogTitle className="text-center text-xl font-bold">Add Sub Admin</DialogTitle>
        </DialogHeader>
        <SubAdminForm onSubmit={handleSubmit} submitLabel="Add" isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}
