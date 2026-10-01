"use client";

import { Sparkles, Tag, TicketPercent } from "lucide-react";
import { type Control, Controller, type FieldErrors } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CouponFormValues } from "../../schema/coupon.schema";

type IdentitySectionProps = {
  control: Control<CouponFormValues>;
  errors: FieldErrors<CouponFormValues>;
  isEdit: boolean;
  isGenerating: boolean;
  onGenerateCode: () => void;
};

export function CouponDialogIdentitySection({
  control,
  errors,
  isEdit,
  isGenerating,
  onGenerateCode,
}: IdentitySectionProps) {
  return (
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
                  disabled={isGenerating}
                  onClick={onGenerateCode}
                  className="h-11 shrink-0 cursor-pointer rounded-xl border-emerald-300/80 bg-emerald-50/80 px-3.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-800 active:scale-95 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  title="Generate unique random code from database"
                >
                  <Sparkles className="mr-1.5 size-3.5 text-emerald-600 dark:text-emerald-400" />
                  {isGenerating ? "Generating..." : "Generate"}
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
  );
}
