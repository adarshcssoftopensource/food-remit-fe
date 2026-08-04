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
import { CircleHelp, Plus } from "lucide-react";
import { useState } from "react";
import { type FaqFormValues } from "../schema/content.schema";
import { FaqForm } from "./faq-form";

type AddFaqDialogProps = {
  onSubmit: (values: FaqFormValues) => Promise<void> | void;
};

export function AddFaqDialog({ onSubmit }: AddFaqDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: FaqFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      successToast({ title: "FAQ added successfully" });
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Add FAQ
      </DialogTrigger>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden border-0 p-0 shadow-2xl sm:max-h-[90vh]">
        <div className="max-h-[90vh] overflow-y-auto overscroll-contain">
          <div className="relative overflow-hidden">
            <DialogHeader className="border-b bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 p-6 pb-5">
              <DialogTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-slate-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
                  <CircleHelp size={20} />
                </div>
                <span>Add FAQ</span>
              </DialogTitle>
              <p className="mt-2 text-center text-sm text-slate-500">
                Create a clear question and answer for your users.
              </p>
            </DialogHeader>
          </div>
          <div className="relative -mt-2 rounded-t-3xl bg-white">
            <FaqForm onSubmit={handleSubmit} submitLabel="Add" isSubmitting={isSubmitting} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
