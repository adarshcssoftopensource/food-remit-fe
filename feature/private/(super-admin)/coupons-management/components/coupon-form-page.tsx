"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useProfile } from "@/components/providers/profile-provider";
import { ROUTES } from "@/config/routes";
import { useCouponDurationText } from "../hooks/use-coupon-duration-text";
import { useCreateCoupon } from "../hooks/use-create-coupon";
import { useGenerateCouponCode } from "../hooks/use-generate-coupon-code";
import { useGetCouponDetails } from "../hooks/use-get-coupon-details";
import { useUpdateCoupon } from "../hooks/use-update-coupon";
import { couponSchema, type CouponFormValues } from "../schema/coupon.schema";
import {
  CouponDetailsLoading,
  CouponPageDescriptionCard,
  CouponPageDetailsCard,
  CouponPageHeader,
  CouponPageLimitsCard,
  CouponPageScheduleCard,
  CouponPageScopeCard,
} from "./coupon-form-page-sections";
import { getAssignedStoreName, getStoreManagerInfo } from "./coupon-form-utils";

interface CouponFormPageProps {
  couponId?: string; // If present, edit mode
}

export function CouponFormPage({ couponId }: CouponFormPageProps) {
  const router = useRouter();
  const isEdit = Boolean(couponId);
  const { profile, isSuperAdmin } = useProfile();

  const { data: existingCoupon, isLoading: isDetailsLoading } = useGetCouponDetails(
    couponId,
    isEdit,
  );

  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const generateCodeMutation = useGenerateCouponCode();

  const { isStoreManager, managerAssignedStore } = getStoreManagerInfo(profile);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);
  const nextMonthStr = format(nextMonth, "yyyy-MM-dd");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema) as any,
    defaultValues: {
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
    },
    mode: "onChange",
  });

  const syncFormWithCoupon = useEffectEvent(() => {
    if (existingCoupon) {
      const sDate = existingCoupon.startDate ? new Date(existingCoupon.startDate) : new Date();
      const eDate = existingCoupon.endDate ? new Date(existingCoupon.endDate) : nextMonth;

      reset({
        couponName: existingCoupon.couponName || "",
        couponCode: existingCoupon.couponCode || "",
        discount: Number(existingCoupon.discount) || 10,
        description: existingCoupon.description || "",
        minOrderValue: Number(existingCoupon.minOrderValue || 0),
        maxUsers: existingCoupon.maxUsers ? Number(existingCoupon.maxUsers) : 100,
        scope: existingCoupon.storeId ? "store" : "global",
        storeId: existingCoupon.storeId || undefined,
        startDate: format(sDate, "yyyy-MM-dd"),
        startTime: format(sDate, "HH:mm"),
        endDate: format(eDate, "yyyy-MM-dd"),
        endTime: format(eDate, "HH:mm"),
      });
    } else if (!isEdit) {
      if (isStoreManager && managerAssignedStore?.id) {
        setValue("scope", "store");
        setValue("storeId", managerAssignedStore.id);
      } else if (isSuperAdmin) {
        setValue("scope", "global");
        setValue("storeId", undefined);
      }
    }
  });

  // Pre-fill form when editing
  useEffect(() => {
    syncFormWithCoupon();
  }, [existingCoupon, isEdit, isStoreManager, isSuperAdmin, managerAssignedStore, reset, setValue]);

  // Live form watchers for preview card
  const watchedName = useWatch({ control, name: "couponName" });
  const watchedCode = useWatch({ control, name: "couponCode" });
  const watchedDiscount = useWatch({ control, name: "discount" });
  const watchedMinOrder = useWatch({ control, name: "minOrderValue" });
  const watchedMaxUsers = useWatch({ control, name: "maxUsers" });
  const watchedScope = useWatch({ control, name: "scope" });
  const watchedStoreId = useWatch({ control, name: "storeId" });
  const watchedStartDate = useWatch({ control, name: "startDate" });
  const watchedEndDate = useWatch({ control, name: "endDate" });
  const watchedDescription = useWatch({ control, name: "description" });

  // Duration in days calculation
  const durationText = useCouponDurationText(watchedStartDate, watchedEndDate);

  // Generate unique coupon code from DB
  const handleGenerateCode = async () => {
    try {
      let prefix = "";
      if (watchedName && watchedName.trim().length >= 3) {
        prefix = watchedName
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

      if (isEdit && couponId) {
        await updateMutation.mutateAsync({ id: couponId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }

      router.push(ROUTES.ADMIN.COUPONS_MANAGEMENT.ROOT);
    } catch {
      // Handled by toast error
    }
  };

  if (isEdit && isDetailsLoading) {
    return <CouponDetailsLoading />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <CouponPageHeader
        isEdit={isEdit}
        status={existingCoupon?.status}
        isSubmitting={isSubmitting}
        onPublish={handleSubmit(onSubmit)}
      />

      {/* Main Grid: Left Form + Right Live Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Form Column */}
        <div className="space-y-6 lg:col-span-8">
          {/* Card 1: Applicability Scope */}
          <CouponPageScopeCard
            isStoreManager={isStoreManager}
            assignedStoreName={getAssignedStoreName(
              managerAssignedStore?.storeName,
              existingCoupon?.storeName,
            )}
            watchedScope={watchedScope}
            setValue={setValue}
            control={control}
            errors={errors}
            initialStoreName={existingCoupon?.storeName || undefined}
          />

          {/* Card 2: Promotion Identification */}
          <CouponPageDetailsCard
            control={control}
            errors={errors}
            isEdit={isEdit}
            isGenerating={generateCodeMutation.isPending}
            onGenerateCode={handleGenerateCode}
          />

          {/* Card 3: Discount & Redemption Limits */}
          <CouponPageLimitsCard control={control} errors={errors} />

          <CouponPageScheduleCard control={control} errors={errors} durationText={durationText} />

          <CouponPageDescriptionCard control={control} />
        </div>
      </div>
    </div>
  );
}
