"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Pencil, Plus } from "lucide-react";
import React, { useEffect, useEffectEvent, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useProfile } from "@/providers/profile-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { StoreData } from "@/feature/private/(super-admin)/store-management/types/store-management";
import { useControllableOpen } from "../hooks/use-controllable-open";
import { useCouponCurrency } from "../hooks/use-coupon-currency";
import { useCouponDurationText } from "../hooks/use-coupon-duration-text";
import { useCreateCoupon } from "../hooks/use-create-coupon";
import { useGenerateCouponCode } from "../hooks/use-generate-coupon-code";
import { useUpdateCoupon } from "../hooks/use-update-coupon";
import { couponSchema, type CouponFormValues } from "../schema/coupon.schema";
import type { CouponItem } from "../types/coupon.types";
import {
  CouponDialogDescriptionField,
  CouponDialogFooter,
  CouponDialogHeader,
  CouponDialogIdentitySection,
  CouponDialogLimitsSection,
  CouponDialogScheduleSection,
  CouponDialogScopeSection,
} from "./add-coupon-dialog-sections";
import { getAssignedStoreName, getStoreManagerInfo } from "./coupon-form-utils";

interface AddCouponDialogProps {
  coupon?: CouponItem; // When provided, works in Edit mode
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AddCouponDialog({
  coupon,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
  onSuccess,
}: AddCouponDialogProps) {
  const { isOpen, setIsOpen } = useControllableOpen(controlledOpen, setControlledOpen);

  const isEdit = Boolean(coupon);
  const { profile, isSuperAdmin } = useProfile();
  const [selectedStoreData, setSelectedStoreData] = useState<StoreData | null>(null);

  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const generateCodeMutation = useGenerateCouponCode();

  const { isStoreManager, managerAssignedStore } = getStoreManagerInfo(profile);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);
  const nextMonthStr = format(nextMonth, "yyyy-MM-dd");

  const getInitialValues = (): CouponFormValues => {
    if (coupon) {
      const sDate = coupon.startDate ? new Date(coupon.startDate) : new Date();
      const eDate = coupon.endDate ? new Date(coupon.endDate) : nextMonth;

      return {
        couponName: coupon.couponName || "",
        couponCode: coupon.couponCode || "",
        discount: Number(coupon.discount) || 0,
        description: coupon.description || "",
        minOrderValue: Number(coupon.minOrderValue || 0),
        maxUsers: coupon.maxUsers ? Number(coupon.maxUsers) : 0,
        scope: coupon.isGlobal ? "global" : "store",
        storeId: coupon.storeId || undefined,
        startDate: format(sDate, "yyyy-MM-dd"),
        startTime: format(sDate, "HH:mm"),
        endDate: format(eDate, "yyyy-MM-dd"),
        endTime: format(eDate, "HH:mm"),
      };
    }

    return {
      couponName: "",
      couponCode: "",
      discount: 0,
      description: "",
      minOrderValue: 0,
      maxUsers: 0,
      scope: isStoreManager ? "store" : "global",
      storeId: isStoreManager ? managerAssignedStore?.id : undefined,
      startDate: todayStr,
      startTime: "00:00",
      endDate: nextMonthStr,
      endTime: "23:59",
    };
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema) as any,
    defaultValues: getInitialValues(),
    mode: "onBlur",
  });

  const selectedScope = useWatch({ control, name: "scope" });
  const selectedStoreId = useWatch({ control, name: "storeId" });
  const currentCouponName = useWatch({ control, name: "couponName" });
  const startDateValue = useWatch({ control, name: "startDate" });
  const endDateValue = useWatch({ control, name: "endDate" });

  // Dynamic currency resolution based on store's country
  const { symbol: currencySymbol, code: currencyCode } = useCouponCurrency({
    scope: selectedScope,
    storeId: selectedStoreId,
    isStoreManager,
    managerAssignedStore,
    selectedStore: selectedStoreData,
    initialStore: coupon?.store,
  });

  // Duration in days indicator
  const durationText = useCouponDurationText(startDateValue, endDateValue);

  // Generate unique code from backend
  const handleGenerateCode = async () => {
    try {
      let prefix = "";
      if (currentCouponName && currentCouponName.trim().length >= 3) {
        prefix = currentCouponName
          .trim()
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")
          .slice(0, 5);
      }
      const res = await generateCodeMutation.mutateAsync(prefix || undefined);
      if (res?.code) {
        setValue("couponCode", res.code, { shouldValidate: true, shouldDirty: true });
        return;
      }
    } catch {
      // Fallback
    }

    const prefixes = ["SAVE", "OFF", "PROMO", "DEAL", "FOOD", "MEGA", "SPECIAL", "HOT", "EXTRA"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setValue("couponCode", `${prefix}${randomNum}`, { shouldValidate: true, shouldDirty: true });
  };

  const resetFormForOpen = useEffectEvent(() => {
    reset(getInitialValues());
    if (!coupon) {
      const prefixes = ["SAVE", "OFF", "PROMO", "DEAL", "FOOD", "MEGA", "SPECIAL", "EXTRA"];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setValue("couponCode", `${prefix}${randomNum}`);

      if (isStoreManager && managerAssignedStore?.id) {
        setValue("scope", "store");
        setValue("storeId", managerAssignedStore.id);
      } else if (isSuperAdmin) {
        setValue("scope", "global");
        setValue("storeId", undefined);
      }
    }
  });

  // Reset form on open/change
  useEffect(() => {
    if (isOpen) {
      resetFormForOpen();
    }
  }, [isOpen]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: CouponFormValues) => {
    try {
      const startDateTime = new Date(`${values.startDate}T${values.startTime || "00:00"}:00`);
      const endDateTime = new Date(`${values.endDate}T${values.endTime || "23:59"}:00`);

      const payload = {
        couponName: values.couponName.trim(),
        ...(!isEdit && values.couponCode?.trim()
          ? { couponCode: values.couponCode.trim().toUpperCase() }
          : {}),
        discount: Number(values.discount),
        discountType: "percentage",
        description: values.description?.trim() || undefined,
        minOrderValue: Number(values.minOrderValue || 0),
        maxUsers: values.maxUsers ? Number(values.maxUsers) : undefined,
        storeId: values.scope === "store" ? values.storeId : undefined,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
      };

      if (isEdit && coupon?.id) {
        await updateMutation.mutateAsync({ id: coupon.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }

      setIsOpen(false);
      onSuccess?.();
    } catch {
      // Handled by toast error
    }
  };

  const defaultTrigger = isEdit ? (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 cursor-pointer rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      <Pencil className="size-4" />
      <span className="sr-only">Edit coupon</span>
    </Button>
  ) : (
    <Button className="h-10 cursor-pointer gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700">
      <Plus className="size-4" />
      <span>Create Coupon</span>
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={trigger ? (trigger as React.ReactElement) : defaultTrigger} />
      <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <CouponDialogHeader isEdit={isEdit} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 space-y-5 overflow-x-hidden overflow-y-auto p-6"
        >
          <CouponDialogScopeSection
            isStoreManager={isStoreManager}
            assignedStoreName={getAssignedStoreName(
              managerAssignedStore?.storeName,
              coupon?.storeName,
            )}
            selectedScope={selectedScope}
            setValue={setValue}
            control={control}
            errors={errors}
            initialStoreName={coupon?.storeName || undefined}
            onStoreSelect={(store) => setSelectedStoreData(store ?? null)}
          />

          <CouponDialogIdentitySection
            control={control}
            errors={errors}
            isEdit={isEdit}
            isGenerating={generateCodeMutation.isPending}
            onGenerateCode={handleGenerateCode}
          />

          <CouponDialogLimitsSection
            control={control}
            errors={errors}
            currencySymbol={currencySymbol}
            currencyCode={currencyCode}
          />

          <CouponDialogScheduleSection
            control={control}
            errors={errors}
            durationText={durationText}
          />

          <CouponDialogDescriptionField control={control} />

          <CouponDialogFooter
            isEdit={isEdit}
            isSubmitting={isSubmitting}
            onCancel={() => setIsOpen(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
