"use client";

import { Coins, Percent, Users } from "lucide-react";
import { type Control, Controller, type FieldErrors } from "react-hook-form";

import { FieldLabel } from "@/components/ui/field";
import type { CouponFormValues } from "../../schema/coupon.schema";
import { SmartNumberInput } from "../common/smart-number-input";

type LimitsSectionProps = {
  control: Control<CouponFormValues>;
  errors: FieldErrors<CouponFormValues>;
};

export function CouponDialogLimitsSection({ control, errors }: LimitsSectionProps) {
  return (
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
              <SmartNumberInput
                id="dialog-discount"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                min={1}
                max={100}
                placeholder="0"
                className="pl-10"
              />
              <div className="pointer-events-none absolute top-1/2 left-3.5 z-10 flex -translate-y-1/2 items-center">
                <Percent className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            {errors.discount && <p className="text-xs text-rose-500">{errors.discount.message}</p>}
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
              <SmartNumberInput
                id="dialog-minOrderValue"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                min={1}
                max={100000}
                placeholder="0"
                className="pl-10"
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
              <SmartNumberInput
                id="dialog-maxUsers"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                min={1}
                max={1000000}
                placeholder="0"
                className="pl-10"
              />
              <div className="pointer-events-none absolute top-1/2 left-3.5 z-10 flex -translate-y-1/2 items-center">
                <Users className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            {errors.maxUsers && <p className="text-xs text-rose-500">{errors.maxUsers.message}</p>}
          </div>
        )}
      />
    </div>
  );
}
