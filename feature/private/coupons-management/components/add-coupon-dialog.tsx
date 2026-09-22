"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInDays, format, parseISO } from "date-fns";
import {
  Calendar,
  Check,
  Clock,
  Coins,
  Globe,
  Pencil,
  Percent,
  Plus,
  Sparkles,
  Store as StoreIcon,
  Tag,
  TicketPercent,
  Users,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useProfile } from "@/components/providers/profile-provider";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { StoreSelect } from "@/components/common/store-select";
import type { StoreData } from "@/feature/private/store-management/types/store-management";
import { useCreateCoupon } from "../hooks/use-create-coupon";
import { useGenerateCouponCode } from "../hooks/use-generate-coupon-code";
import { useUpdateCoupon } from "../hooks/use-update-coupon";
import { couponSchema, type CouponFormValues } from "../schema/coupon.schema";
import type { CouponItem } from "../types/coupon.types";

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
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const setIsOpen = (val: boolean) => {
    if (isControlled) {
      setControlledOpen?.(val);
    } else {
      setUncontrolledOpen(val);
    }
  };

  const isEdit = Boolean(coupon);
  const { profile, isSuperAdmin } = useProfile();
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const generateCodeMutation = useGenerateCouponCode();

  const isStoreManager = profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";
  const managerAssignedStore = profile?.stores?.[0];

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
  const durationText = useMemo(() => {
    try {
      if (!startDateValue || !endDateValue) return null;
      const start = parseISO(startDateValue);
      const end = parseISO(endDateValue);
      const days = differenceInDays(end, start);
      if (isNaN(days)) return null;
      if (days < 0) return "Invalid date range";
      if (days === 0) return "Active for 1 day";
      return `Active for ${days} days`;
    } catch {
      return null;
    }
  }, [startDateValue, endDateValue]);

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

  // Reset form on open/change
  useEffect(() => {
    if (isOpen) {
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

  const defaultTrigger = isEdit ? (
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={trigger ? (trigger as React.ReactElement) : defaultTrigger} />
      <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-slate-100 bg-linear-to-b from-slate-50/80 to-white px-6 py-5 dark:border-slate-800/80 dark:from-slate-900/90 dark:to-slate-900">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25">
              <TicketPercent className="size-5.5" />
            </div>

            <div className="pr-8 text-left">
              <DialogTitle className="text-base font-bold tracking-tight text-slate-900 sm:text-lg dark:text-white">
                {isEdit ? "Edit Coupon" : "Create New Coupon"}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {isEdit
                  ? "Update promotional discount details, target store, and schedule."
                  : "Configure discount rates, store scope applicability, and scheduling rules."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 space-y-5 overflow-x-hidden overflow-y-auto p-6"
        >
          {/* Section 1: Scope Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <FieldLabel className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Applicability Scope <span className="text-rose-500">*</span>
              </FieldLabel>
              <span className="text-[11px] text-slate-400">
                {isStoreManager ? "Store restricted" : "Global or store-specific"}
              </span>
            </div>

            {isStoreManager ? (
              <div className="flex items-center gap-3.5 rounded-2xl border border-blue-200/70 bg-linear-to-r from-blue-50/70 to-indigo-50/40 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                  <StoreIcon className="size-5" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-blue-950 dark:text-blue-100">
                      Store-Specific Promotion
                    </p>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/80 dark:text-blue-200">
                      Assigned Store
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-blue-800/80 dark:text-blue-300/80">
                    Valid strictly for items at{" "}
                    <strong className="text-blue-950 dark:text-white">
                      {managerAssignedStore?.storeName ||
                        coupon?.storeName ||
                        "your assigned store"}
                    </strong>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Global Card */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setValue("scope", "global");
                      setValue("storeId", undefined);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setValue("scope", "global");
                        setValue("storeId", undefined);
                      }
                    }}
                    className={`group relative flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                      selectedScope === "global"
                        ? "border-emerald-500 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/20"
                        : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/60"
                    }`}
                  >
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        selectedScope === "global"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <Globe className="size-4.5" />
                    </div>
                    <div className="min-w-0 flex-1 pr-5">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          All Stores (Global)
                        </p>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                        Applies to all products across all stores in the network.
                      </p>
                    </div>
                    <div
                      className={`absolute top-3.5 right-3.5 flex size-4.5 items-center justify-center rounded-full border transition-all ${
                        selectedScope === "global"
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {selectedScope === "global" && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Specific Store Card */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setValue("scope", "store");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setValue("scope", "store");
                      }
                    }}
                    className={`group relative flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                      selectedScope === "store"
                        ? "border-emerald-500 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/20"
                        : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/60"
                    }`}
                  >
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        selectedScope === "store"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <StoreIcon className="size-4.5" />
                    </div>
                    <div className="min-w-0 flex-1 pr-5">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Specific Store
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                        Restricted strictly to products from one chosen store.
                      </p>
                    </div>
                    <div
                      className={`absolute top-3.5 right-3.5 flex size-4.5 items-center justify-center rounded-full border transition-all ${
                        selectedScope === "store"
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {selectedScope === "store" && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                {/* Target Store Dropdown if Store is selected */}
                {selectedScope === "store" && (
                  <div className="space-y-1.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition-all dark:border-slate-800 dark:bg-slate-900/60">
                    <FieldLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Choose Target Store <span className="text-rose-500">*</span>
                    </FieldLabel>
                    <Controller
                      name="storeId"
                      control={control}
                      render={({ field }) => (
                        <StoreSelect
                          value={field.value ?? ""}
                          onValueChange={(val) => field.onChange(val)}
                          placeholder="Search and choose target store..."
                          initialStoreName={coupon?.storeName || undefined}
                        />
                      )}
                    />
                    {errors.storeId && (
                      <p className="text-xs text-rose-500">{errors.storeId.message}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Name & Promo Code */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="couponName"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <FieldLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Promotion Name <span className="text-rose-500">*</span>
                  </FieldLabel>
                  <div className="relative flex items-center">
                    <Input
                      {...field}
                      placeholder="e.g. Summer Festival Special"
                      className="h-11 rounded-xl pl-10 text-xs font-medium"
                    />
                    <div className="pointer-events-none absolute top-1/2 left-3.5 z-10 flex -translate-y-1/2 items-center">
                      <TicketPercent className="size-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  {errors.couponName && (
                    <p className="text-xs text-rose-500">{errors.couponName.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="couponCode"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <FieldLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Coupon Code
                    </FieldLabel>
                    <span className="text-[10px] text-slate-400">
                      {isEdit ? "Coupon code cannot be edited once created" : "Unique Code"}
                    </span>
                  </div>

                  {/* Clean side-by-side layout with visible Tag icon & zero overlap */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        {...field}
                        disabled={isEdit}
                        readOnly={isEdit}
                        placeholder="e.g. SAVE20"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))
                        }
                        className={`h-11 rounded-xl pl-10 font-mono text-xs font-bold tracking-wider uppercase ${
                          isEdit
                            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400"
                            : "text-slate-800 dark:text-slate-100"
                        }`}
                      />
                      <div className="pointer-events-none absolute top-1/2 left-3.5 z-10 flex -translate-y-1/2 items-center">
                        <Tag className="size-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                    {!isEdit && (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={generateCodeMutation.isPending}
                        onClick={handleGenerateCode}
                        className="h-11 shrink-0 cursor-pointer rounded-xl border-emerald-300/80 bg-emerald-50/80 px-3.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800 active:scale-95 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        title="Generate unique random code from database"
                      >
                        <Sparkles className="mr-1.5 size-3.5 text-emerald-600 dark:text-emerald-400" />
                        {generateCodeMutation.isPending ? "Generating..." : "Generate"}
                      </Button>
                    )}
                  </div>
                  {errors.couponCode && (
                    <p className="text-xs text-rose-500">{errors.couponCode.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Section 3: Discount & Limits with High-Contrast Clear Icons */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Discount */}
            <Controller
              name="discount"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <FieldLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Discount (%) <span className="text-rose-500">*</span>
                  </FieldLabel>
                  <div className="relative flex items-center">
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      max={100}
                      placeholder="10"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="h-11 rounded-xl pl-10 text-xs font-semibold"
                    />
                    <div className="pointer-events-none absolute top-1/2 left-3.5 z-10 flex -translate-y-1/2 items-center">
                      <Percent className="size-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  {errors.discount && (
                    <p className="text-xs text-rose-500">{errors.discount.message}</p>
                  )}
                </div>
              )}
            />

            {/* Min Order */}
            <Controller
              name="minOrderValue"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <FieldLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Min Order ($) <span className="text-rose-500">*</span>
                  </FieldLabel>
                  <div className="relative flex items-center">
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      placeholder="0"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      className="h-11 rounded-xl pl-10 text-xs font-semibold"
                    />
                    <div className="pointer-events-none absolute top-1/2 left-3.5 z-10 flex -translate-y-1/2 items-center">
                      <Coins className="size-4 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  {errors.minOrderValue && (
                    <p className="text-xs text-rose-500">{errors.minOrderValue.message}</p>
                  )}
                </div>
              )}
            />

            {/* Max Redemptions */}
            <Controller
              name="maxUsers"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <FieldLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Max Redemptions <span className="text-rose-500">*</span>
                  </FieldLabel>
                  <div className="relative flex items-center">
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      placeholder="100"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="h-11 rounded-xl pl-10 text-xs font-semibold"
                    />
                    <div className="pointer-events-none absolute top-1/2 left-3.5 z-10 flex -translate-y-1/2 items-center">
                      <Users className="size-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  {errors.maxUsers && (
                    <p className="text-xs text-rose-500">{errors.maxUsers.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Section 4: Shadcn Date & Time Picker Scheduling Window */}
          <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <Calendar className="size-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Validity Period & Scheduling
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Enforces when the coupon automatically starts and expires
                  </p>
                </div>
              </div>

              {durationText && (
                <span className="hidden items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 sm:inline-flex dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <Clock className="size-3" />
                  {durationText}
                </span>
              )}
            </div>

            <div className="grid gap-3 pt-1 sm:grid-cols-2">
              {/* Start Window */}
              <div className="space-y-2 rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Starts Applying From
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    Live from
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3">
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <span className="mb-1 block text-[10px] font-medium text-slate-400">
                            Date
                          </span>
                          <DatePicker
                            date={field.value ? parseISO(field.value) : undefined}
                            setDate={(newDate) => {
                              if (newDate) {
                                field.onChange(format(newDate, "yyyy-MM-dd"));
                              }
                            }}
                            placeholder="Select date"
                            className="h-10 rounded-xl text-xs"
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <Controller
                      name="startTime"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <span className="mb-1 block text-[10px] font-medium text-slate-400">
                            Time
                          </span>
                          <TimePicker
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                            placeholder="Time"
                            className="h-10 rounded-xl text-xs"
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
                {errors.startDate && (
                  <p className="text-xs text-rose-500">{errors.startDate.message}</p>
                )}
              </div>

              {/* End Window */}
              <div className="space-y-2 rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Expires & Ends On
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-rose-600 dark:text-rose-400">
                    Expires at
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3">
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <span className="mb-1 block text-[10px] font-medium text-slate-400">
                            Date
                          </span>
                          <DatePicker
                            date={field.value ? parseISO(field.value) : undefined}
                            setDate={(newDate) => {
                              if (newDate) {
                                field.onChange(format(newDate, "yyyy-MM-dd"));
                              }
                            }}
                            placeholder="Select date"
                            className="h-10 rounded-xl text-xs"
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <Controller
                      name="endTime"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <span className="mb-1 block text-[10px] font-medium text-slate-400">
                            Time
                          </span>
                          <TimePicker
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                            placeholder="Time"
                            className="h-10 rounded-xl text-xs"
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
                {errors.endDate && (
                  <p className="text-xs text-rose-500">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Description & Terms */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Description & Terms (Optional)
                  </FieldLabel>
                  <span className="text-[10px] text-slate-400">Customer terms notes</span>
                </div>
                <Textarea
                  {...field}
                  rows={2}
                  placeholder="e.g. Valid on all grocery items. Cannot be combined with other offers."
                  className="rounded-xl text-xs"
                />
              </div>
            )}
          />

          {/* Pinned Footer */}
          <DialogFooter className="sticky -bottom-6 -mx-6 -mb-6 flex flex-row items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/90 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="h-10 cursor-pointer rounded-xl border-slate-200 px-5 text-xs font-semibold dark:border-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="h-10 cursor-pointer rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:from-emerald-700 hover:to-teal-700 active:scale-98"
            >
              {isEdit ? "Update Coupon" : "Create Coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const CouponFormDialog = AddCouponDialog;
