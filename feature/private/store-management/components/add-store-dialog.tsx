"use client";

import { successToast, errorToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type StoreFormValues } from "../schema/store.schema";
import { StoreForm } from "./store-form";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateStore, useCreateStoreManager } from "../hooks/use-create-store";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

export function AddStoreDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const createManagerMutation = useCreateStoreManager();
  const createStoreMutation = useCreateStore();

  const isSubmitting = createManagerMutation.isPending || createStoreMutation.isPending;

  const handleSubmit = async (values: StoreFormValues) => {
    try {
      // 1. Create Store Manager
      const managerRes = await createManagerMutation.mutateAsync({
        firstName: values.managerFirstName,
        lastName: values.managerLastName,
        email: values.managerEmail,
        countryCode: values.managerPhoneCode,
        phoneNumber: values.managerPhoneNumber,
        address: values.managerAddress,
        country: values.managerCountry,
        state: values.managerState,
        city: values.managerCity,
        managerStatus: "ACTIVE",
      });

      // 2. Create Store (linking the new manager)
      await createStoreMutation.mutateAsync({
        storeName: values.storeName,
        storeCountryCode: values.storePhoneCode,
        storePhoneNumber: values.storePhoneNumber,
        storeAddress: values.storeAddress,
        storeAddress2: values.address2,
        country: values.storeCountry,
        city: values.storeCity,
        storeTax: values.storeTax,
        foodRemitCommission: values.foodRemitCommission,
        status: "ACTIVE",
        assignedStoreManager: managerRes.data?.id,
      });

      successToast({ title: "Store added successfully!" });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.STORES });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Something went wrong. Please try again.";
      errorToast({ title: message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-1.5 size-4" />
        Add Store
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl p-0">
        <DialogHeader className="shrink-0 border-b bg-linear-to-r from-slate-50 via-slate-100 to-slate-50 p-6 pb-5">
          <DialogTitle className="text-center text-2xl font-extrabold tracking-tight text-slate-800">
            Add Store
          </DialogTitle>
          <p className="mt-1 text-center text-sm font-medium text-slate-500">
            Create a new store and manage your products easily.
          </p>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
          <StoreForm onSubmit={handleSubmit} submitLabel="Add Store" isSubmitting={isSubmitting} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
