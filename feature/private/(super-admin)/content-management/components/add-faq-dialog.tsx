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
      <DialogTrigger
        render={
          <Button className="h-11 rounded-xl font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        }
      />
      <DialogContent className="max-w-2xl gap-0 overflow-hidden border-0 p-0 shadow-2xl sm:max-h-[90vh]">
        <div className="max-h-[90vh] overflow-y-auto overscroll-contain">
          <DialogHeader className="from-primary/10 border-b bg-linear-to-r via-emerald-50/60 to-transparent p-6 pb-5">
            <DialogTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-slate-900">
              <div className="bg-primary/15 text-primary flex size-12 items-center justify-center rounded-2xl shadow-sm">
                <CircleHelp size={20} />
              </div>
              <span>Add FAQ</span>
            </DialogTitle>
            <DialogDescription className="mt-2 text-center text-sm text-slate-500">
              Create a clear question and answer for your users.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-white">
            <FaqForm onSubmit={handleSubmit} submitLabel="Add" isSubmitting={isSubmitting} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
