"use client";

import { successToast } from "@/components/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type StoreData } from "@/constants/store-management";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { type StoreFormValues } from "../schema/store.schema";
import { StoreForm } from "./store-form";

interface EditStoreDialogProps {
  store: StoreData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditStoreDialog({ store, open, onOpenChange }: EditStoreDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: Partial<StoreFormValues> = {
    storeName: store.storeName,
    storePhoneCode: store.storePhoneCode,
    storePhoneNumber: store.storePhoneNumber,
    storeAddress: store.storeAddress,
    address2: store.address2,
    storeCountry: store.storeCountry,
    storeState: store.storeState,
    storeCity: store.storeCity,
    storeZipCode: store.storeZipCode,
    storeTax: store.storeTax,
    foodRemitCommission: store.foodRemitCommission,
    managerFirstName: store.managerFirstName,
    managerLastName: store.managerLastName,
    managerEmail: store.managerEmail,
    managerPhoneCode: store.managerPhoneCode,
    managerPhoneNumber: store.managerPhoneNumber,
    managerAddress: store.managerAddress,
    managerCountry: store.managerCountry,
    managerState: store.managerState,
    managerCity: store.managerCity,
    managerZipCode: store.managerZipCode,
  };

  const handleSubmit = async (values: StoreFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Store Updated:", values);
      successToast({ title: "Store updated successfully!" });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl p-0">
        <DialogHeader className="rounded-t-xl border-b border-slate-100 bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-5">
          <div className="flex items-center justify-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-500 text-white">
              <Pencil size={20} />
            </div>

            <DialogTitle className="text-center text-2xl font-bold text-slate-800">
              Edit Store
            </DialogTitle>
          </div>

          <p className="mt-2 text-center text-sm text-slate-500">
            Update details for{" "}
            <span className="font-semibold text-slate-700">{store.storeName}</span>
          </p>
        </DialogHeader>
        <StoreForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Update"
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
