"use client";

import { type Control, Controller, type FieldErrors } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import type { CouponFormValues } from "../../schema/coupon.schema";
import { SmartNumberInput } from "../common/smart-number-input";

type LimitsCardProps = {
  control: Control<CouponFormValues>;
  errors: FieldErrors<CouponFormValues>;
  currencySymbol?: string;
  currencyCode?: string;
};

export function CouponPageLimitsCard({
  control,
  errors,
  currencySymbol = "$",
  currencyCode,
}: LimitsCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="border-b border-slate-100 px-6 py-4.5 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
            Discount Values &amp; Redemption Thresholds
          </CardTitle>
          {currencyCode && (
            <span className="text-xs font-medium text-slate-400">
              Country Currency:{" "}
              <strong className="text-slate-700 dark:text-slate-200">
                {currencyCode} ({currencySymbol})
              </strong>
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Controller
            name="discount"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <FieldLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Discount Rate (%) <span className="text-rose-500">*</span>
                </FieldLabel>
                <div className="relative flex items-center">
                  <SmartNumberInput
                    id="discount"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    min={1}
                    max={100}
                    placeholder="0"
                  />
                </div>
                {errors.discount && (
                  <p className="text-xs text-rose-500">{errors.discount.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="minOrderValue"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Min Order Amount ({currencySymbol}) <span className="text-rose-500">*</span>
                  </FieldLabel>
                  {currencyCode && (
                    <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {currencyCode}
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-3.5 z-10 text-xs font-bold text-slate-400">
                    {currencySymbol}
                  </span>
                  <SmartNumberInput
                    id="minOrderValue"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    min={1}
                    max={100000}
                    placeholder="0"
                    className="pl-8"
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
                  <SmartNumberInput
                    id="maxUsers"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    min={1}
                    max={1000000}
                    placeholder="0"
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
  );
}
