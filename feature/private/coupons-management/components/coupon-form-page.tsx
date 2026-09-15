"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInDays, format, parseISO } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Coins,
  Copy,
  Globe,
  Percent,
  Sparkles,
  Store as StoreIcon,
  Tag,
  Ticket,
  TicketPercent,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { StoreSelect } from "@/components/common/store-select";
import { useProfile } from "@/components/providers/profile-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { ROUTES } from "@/config/routes";
import { useCreateCoupon } from "../hooks/use-create-coupon";
import { useGenerateCouponCode } from "../hooks/use-generate-coupon-code";
import { useGetCouponDetails } from "../hooks/use-get-coupon-details";
import { useUpdateCoupon } from "../hooks/use-update-coupon";
import { couponSchema, type CouponFormValues } from "../schema/coupon.schema";
import { Input } from "@/components/ui/input";

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

  const isStoreManager = profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";
  const managerAssignedStore = profile?.stores?.[0];

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

  // Pre-fill form when editing
  useEffect(() => {
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
  const durationText = useMemo(() => {
    try {
      if (!watchedStartDate || !watchedEndDate) return null;
      const start = parseISO(watchedStartDate);
      const end = parseISO(watchedEndDate);
      const days = differenceInDays(end, start);
      if (isNaN(days)) return null;
      if (days < 0) return "Invalid date range";
      if (days === 0) return "Active for 1 day";
      return `Active for ${days} days`;
    } catch {
      return null;
    }
  }, [watchedStartDate, watchedEndDate]);

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
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Loading coupon details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="size-10 cursor-pointer rounded-xl border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
            title="Back to coupons"
          >
            <Link href={ROUTES.ADMIN.COUPONS_MANAGEMENT.ROOT}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                {isEdit ? "Edit Coupon Campaign" : "Create Promotional Coupon"}
              </h1>
              {isEdit && existingCoupon?.status && (
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {existingCoupon.status}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {isEdit
                ? "Update promotional discount rules, store applicability, and schedule window."
                : "Configure discount rates, store scope applicability, and scheduling rules."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            variant="outline"
            className="h-10 cursor-pointer rounded-xl border-slate-200 px-5 text-xs font-semibold dark:border-slate-800"
          >
            <Link href={ROUTES.ADMIN.COUPONS_MANAGEMENT.ROOT}>Cancel</Link>
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            className="h-10 cursor-pointer rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:from-emerald-700 hover:to-teal-700 active:scale-98"
          >
            {isEdit ? "Update Coupon" : "Publish Coupon"}
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Form + Right Live Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Form Column */}
        <div className="space-y-6 lg:col-span-8">
          {/* Card 1: Applicability Scope */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 px-6 py-4.5 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Target Scope & Applicability
                </CardTitle>
                <span className="text-[11px] font-medium text-slate-400">
                  {isStoreManager ? "Store restricted" : "Global or store-specific"}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-6">
              {isStoreManager ? (
                <div className="flex items-center gap-3.5 rounded-2xl border border-blue-200/70 bg-linear-to-r from-blue-50/70 to-indigo-50/40 p-4.5 dark:border-blue-900/40 dark:bg-blue-950/20">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                    <StoreIcon className="size-5.5" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-blue-950 dark:text-blue-100">
                        Store-Specific Promotion
                      </p>
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/80 dark:text-blue-200">
                        Assigned Store
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-blue-800/80 dark:text-blue-300/80">
                      This promotion applies strictly to items from{" "}
                      <strong className="text-blue-950 dark:text-white">
                        {managerAssignedStore?.storeName ||
                          existingCoupon?.storeName ||
                          "your assigned store"}
                      </strong>
                      . It will not apply to any other store.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {/* Global Radio Card */}
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
                      className={`group relative flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4.5 text-left transition-all ${
                        watchedScope === "global"
                          ? "border-emerald-500 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/20"
                          : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/60"
                      }`}
                    >
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          watchedScope === "global"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        <Globe className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1 pr-6">
                        <p className="text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
                          All Stores (Global Promo)
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                          Valid for all products ordered across every active store in FoodRemit.
                        </p>
                      </div>
                      <div
                        className={`absolute top-4 right-4 flex size-5 items-center justify-center rounded-full border transition-all ${
                          watchedScope === "global"
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {watchedScope === "global" && <Check className="size-3 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Specific Store Radio Card */}
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
                      className={`group relative flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4.5 text-left transition-all ${
                        watchedScope === "store"
                          ? "border-emerald-500 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/20"
                          : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/60"
                      }`}
                    >
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          watchedScope === "store"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        <StoreIcon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1 pr-6">
                        <p className="text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
                          Specific Store Only
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                          Restricted exclusively to items from a single chosen store.
                        </p>
                      </div>
                      <div
                        className={`absolute top-4 right-4 flex size-5 items-center justify-center rounded-full border transition-all ${
                          watchedScope === "store"
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {watchedScope === "store" && <Check className="size-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>

                  {/* Target Store Selector with Search */}
                  {watchedScope === "store" && (
                    <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all dark:border-slate-800 dark:bg-slate-900/60">
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
                            placeholder="Search and choose store from database (100K+ stores)..."
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
            </CardContent>
          </Card>

          {/* Card 2: Promotion Identification */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 px-6 py-4.5 dark:border-slate-800">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                Promotion Details & Promo Code
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid gap-5 sm:grid-cols-2">
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
                          className="h-11 w-full rounded-xl text-xs font-medium"
                        />
                      </div>
                      {errors.couponName && (
                        <p className="text-xs text-rose-500">{errors.couponName.message}</p>
                      )}
                    </div>
                  )}
                />

                {/* Coupon Code */}
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
                          {isEdit
                            ? "Coupon code cannot be edited once created"
                            : "Database verified unique"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input
                            {...field}
                            disabled={isEdit}
                            readOnly={isEdit}
                            placeholder="e.g. SAVE20"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""),
                              )
                            }
                            className={`h-11 w-full rounded-xl font-mono text-xs font-bold tracking-wider uppercase ${
                              isEdit
                                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400"
                                : "text-slate-900 dark:text-slate-100"
                            }`}
                          />
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
            </CardContent>
          </Card>

          {/* Card 3: Discount & Redemption Limits */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 px-6 py-4.5 dark:border-slate-800">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                Discount Values & Redemption Thresholds
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Discount % */}
                <Controller
                  name="discount"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-1.5">
                      <FieldLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Discount Rate (%) <span className="text-rose-500">*</span>
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
                          className="h-11 w-full rounded-xl text-xs font-bold"
                        />
                      </div>
                      {errors.discount && (
                        <p className="text-xs text-rose-500">{errors.discount.message}</p>
                      )}
                    </div>
                  )}
                />

                {/* Min Order $ */}
                <Controller
                  name="minOrderValue"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-1.5">
                      <FieldLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Min Order Amount ($) <span className="text-rose-500">*</span>
                      </FieldLabel>
                      <div className="relative flex items-center">
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          placeholder="0"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : 0)
                          }
                          className="h-11 w-full rounded-xl text-xs font-bold"
                        />
                      </div>
                      {errors.minOrderValue && (
                        <p className="text-xs text-rose-500">{errors.minOrderValue.message}</p>
                      )}
                    </div>
                  )}
                />

                {/* Max Users */}
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
                          className="h-11 w-full rounded-xl text-xs font-bold"
                        />
                      </div>
                      {errors.maxUsers && (
                        <p className="text-xs text-rose-500">{errors.maxUsers.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 px-6 py-4.5 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <Calendar className="size-4" />
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    Validity Schedule & Activation
                  </CardTitle>
                </div>
                {durationText && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <Clock className="size-3.5" />
                    {durationText}
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Starts Applying From
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Live from
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2.5">
                    <div className="col-span-3">
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <span className="mb-1 block text-[10px] font-semibold text-slate-400">
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
                            <span className="mb-1 block text-[10px] font-semibold text-slate-400">
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

                <div className="space-y-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-rose-500" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Expires & Ends On
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                      Expires at
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2.5">
                    <div className="col-span-3">
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <span className="mb-1 block text-[10px] font-semibold text-slate-400">
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
                            <span className="mb-1 block text-[10px] font-semibold text-slate-400">
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
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 px-6 py-4.5 dark:border-slate-800">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                Customer Terms & Campaign Description (Optional)
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="Enter customer-facing terms or internal campaign notes (e.g. Valid on food and beverage items only. Cannot be combined with other store deals)..."
                    className="rounded-xl text-xs leading-relaxed"
                  />
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
