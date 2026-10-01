"use client";

import { type Control, Controller } from "react-hook-form";

import { FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { CouponFormValues } from "../../schema/coupon.schema";

type DescriptionFieldProps = {
  control: Control<CouponFormValues>;
};

export function CouponDialogDescriptionField({ control }: DescriptionFieldProps) {
  return (
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
  );
}
