"use client";

import { type Control, Controller, type FieldErrors } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CouponFormValues } from "../../schema/coupon.schema";

type LimitsCardProps = {
  control: Control<CouponFormValues>;
  errors: FieldErrors<CouponFormValues>;
};

export function CouponPageLimitsCard({ control, errors }: LimitsCardProps) {
  return (
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
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
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
  );
}
