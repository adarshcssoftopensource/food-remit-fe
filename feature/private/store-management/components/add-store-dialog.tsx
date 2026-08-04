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
import { Plus, Store } from "lucide-react";
import { useState } from "react";
import { type StoreFormValues } from "../schema/store.schema";
import { StoreForm } from "./store-form";

export function AddStoreDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: StoreFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Store Added:", values);
      successToast({ title: "Store added successfully!" });
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
        <Plus className="mr-1.5 size-4" />
        Add Store
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl p-0">
        <DialogHeader className="rounded-t-xl border-b border-slate-100 bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-5">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
              <Store size={22} />
            </div>

            <DialogTitle className="text-center text-2xl font-bold text-slate-800">
              Add Store
            </DialogTitle>
          </div>

          <p className="mt-2 text-center text-sm text-slate-500">
            Create a new store and manage your products easily
          </p>
        </DialogHeader>
        <StoreForm onSubmit={handleSubmit} submitLabel="Add" isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}
