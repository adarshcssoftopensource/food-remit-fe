"use client";

import { successToast } from "@/components/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { FaqData } from "@/constants/content-management";
import { PencilLine } from "lucide-react";
import { useMemo, useState } from "react";
import { type FaqFormValues } from "../schema/content.schema";
import { FaqForm } from "./faq-form";

type EditFaqDialogProps = {
  faq: FaqData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, values: FaqFormValues) => Promise<void> | void;
};

export function EditFaqDialog({ faq, open, onOpenChange, onSubmit }: EditFaqDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = useMemo<Partial<FaqFormValues>>(() => {
    if (!faq) return {};
    return { question: faq.question, answer: faq.answer };
  }, [faq]);

  const handleSubmit = async (values: FaqFormValues) => {
    if (!faq) return;
    setIsSubmitting(true);
    try {
      await onSubmit(faq.id, values);
      successToast({ title: "FAQ updated successfully" });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden border-0 p-0 shadow-2xl sm:max-h-[90vh]">
        <div className="max-h-[90vh] overflow-y-auto overscroll-contain">
          <div className="relative overflow-hidden">
            <DialogHeader className="border-b bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 p-6 pb-5">
              <DialogTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-slate-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
                  <PencilLine size={20} />
                </div>
                <span>Edit FAQ</span>
              </DialogTitle>
              <p className="mt-2 text-center text-sm text-slate-500">
                Refine the question and answer content.
              </p>
            </DialogHeader>
          </div>
          <div className="relative -mt-2 rounded-t-3xl bg-white">
            {faq ? (
              <FaqForm
                key={faq.id}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                submitLabel="Update"
                isSubmitting={isSubmitting}
              />
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
