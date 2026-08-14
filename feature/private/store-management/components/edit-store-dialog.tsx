"use client";

import { successToast, errorToast } from "@/components/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type StoreData } from "@/feature/private/store-management/types/store-management";
import { Pencil } from "lucide-react";
import { type StoreFormValues } from "../schema/store.schema";
import { StoreForm } from "./store-form";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateStore, useUpdateStoreManager } from "../hooks/use-update-store";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

interface EditStoreDialogProps {
  store: StoreData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditStoreDialog({ store, open, onOpenChange }: EditStoreDialogProps) {
  const initialValues: Partial<StoreFormValues> = {
    storeImage: store.storeImage,
    storeName: store.storeName,
    storePhoneCode: store.storePhoneCode,
    storePhoneNumber: store.storePhoneNumber,
    storeAddress: store.storeAddress,
    address2: store.address2,
    storeCountry: store.storeCountry,
    storeCity: store.storeCity,
    storeTax: store.storeTax,
    foodRemitCommission: store.foodRemitCommission,
    managerImage: store.managerImage,
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

  const queryClient = useQueryClient();
  const updateStoreManager = useUpdateStoreManager(store.managerId);
  const updateStore = useUpdateStore(store.id);

  const isSubmitting = updateStoreManager.isPending || updateStore.isPending;

  const handleSubmit = async (values: StoreFormValues) => {
    try {
      const managerFormData = new FormData();
      managerFormData.append("firstName", values.managerFirstName);
      managerFormData.append("lastName", values.managerLastName);
      managerFormData.append("email", values.managerEmail);
      managerFormData.append("countryCode", values.managerPhoneCode);
      managerFormData.append("phoneNumber", values.managerPhoneNumber);
      managerFormData.append("address", values.managerAddress);
      managerFormData.append("country", values.managerCountry);
      managerFormData.append("state", values.managerState);
      managerFormData.append("city", values.managerCity);
      if (values.managerZipCode) managerFormData.append("zipCode", values.managerZipCode);

      const managerImageFile = Array.isArray(values.managerImage)
        ? values.managerImage[0]
        : values.managerImage;
      if (managerImageFile instanceof File) {
        managerFormData.append("image", managerImageFile);
      } else if (typeof managerImageFile === "string" && managerImageFile !== store.storeImage) {
        managerFormData.append("image", managerImageFile);
      }

      // 1. Update Store Manager details
      await updateStoreManager.mutateAsync(managerFormData as any);

      const storeFormData = new FormData();
      storeFormData.append("storeName", values.storeName);
      storeFormData.append("storeCountryCode", values.storePhoneCode);
      storeFormData.append("storePhoneNumber", values.storePhoneNumber);
      storeFormData.append("storeAddress", values.storeAddress);
      if (values.address2) storeFormData.append("storeAddress2", values.address2);
      storeFormData.append("country", values.storeCountry);
      storeFormData.append("city", values.storeCity);
      if (values.storeTax !== undefined) storeFormData.append("storeTax", String(values.storeTax));
      if (values.foodRemitCommission !== undefined)
        storeFormData.append("foodRemitCommission", String(values.foodRemitCommission));

      const storeImageFile = Array.isArray(values.storeImage)
        ? values.storeImage[0]
        : values.storeImage;
      if (storeImageFile instanceof File) {
        storeFormData.append("storeImage", storeImageFile);
      } else if (typeof storeImageFile === "string" && storeImageFile !== store.storeImage) {
        storeFormData.append("storeImage", storeImageFile);
      }

      // 2. Update Store details
      await updateStore.mutateAsync(storeFormData as any);

      successToast({ title: "Store updated successfully!" });
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.STORES });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Failed to update store details.";
      errorToast({ title: message });
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
