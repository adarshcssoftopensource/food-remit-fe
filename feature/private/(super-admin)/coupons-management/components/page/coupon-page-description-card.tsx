"use client";

import { type Control, Controller } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { CouponFormValues } from "../../schema/coupon.schema";

type DescriptionCardProps = {
  control: Control<CouponFormValues>;
};

export function CouponPageDescriptionCard({ control }: DescriptionCardProps) {
  return (
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
  );
}
