"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Pencil, Plus } from "lucide-react";
import React, { useEffect, useEffectEvent } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useProfile } from "@/components/providers/profile-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useControllableOpen } from "../hooks/use-controllable-open";
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
        discount: Number(coupon.discount) || 10,
        description: coupon.description || "",
        minOrderValue: Number(coupon.minOrderValue || 0),
        maxUsers: coupon.maxUsers ? Number(coupon.maxUsers) : 100,
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
      discount: 10,
      description: "",
      minOrderValue: 0,
      maxUsers: 100,
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
    mode: "onChange",
  });

  const selectedScope = useWatch({ control, name: "scope" });
  const currentCouponName = useWatch({ control, name: "couponName" });
  const startDateValue = useWatch({ control, name: "startDate" });
  const endDateValue = useWatch({ control, name: "endDate" });

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
  }, [isOpen, coupon, isStoreManager, isSuperAdmin, managerAssignedStore]);

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

      reset();
      setIsOpen(false);
      onSuccess?.();
    } catch {
      // Handled by mutation toast error
    }
  };

  const defaultTrigger = renderDefaultCouponTrigger(isEdit);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={trigger ? (trigger as React.ReactElement) : defaultTrigger} />
      <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <CouponDialogHeader isEdit={isEdit} />

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 space-y-5 overflow-x-hidden overflow-y-auto p-6"
        >
          {/* Section 1: Scope Selection */}
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
          />

          {/* Section 2: Name & Promo Code */}
          <CouponDialogIdentitySection
            control={control}
            errors={errors}
            isEdit={isEdit}
            isGenerating={generateCodeMutation.isPending}
            onGenerateCode={handleGenerateCode}
          />

          {/* Section 3: Discount & Limits with High-Contrast Clear Icons */}
          <CouponDialogLimitsSection control={control} errors={errors} />

          {/* Section 4: Shadcn Date & Time Picker Scheduling Window */}
          <CouponDialogScheduleSection
            control={control}
            errors={errors}
            durationText={durationText}
          />

          {/* Section 5: Description & Terms */}
          <CouponDialogDescriptionField control={control} />

          {/* Pinned Footer */}
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

function renderDefaultCouponTrigger(isEdit: boolean) {
  return isEdit ? (
    <Button
      variant="outline"
      size="icon"
      className="size-8 rounded-lg text-slate-500 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30"
      title="Edit coupon"
    >
      <Pencil className="size-3.5" />
    </Button>
  ) : (
    <Button>
      <Plus className="mr-1.5 size-4" />
      Add Coupon
    </Button>
  );
}

export const CouponFormDialog = AddCouponDialog;
