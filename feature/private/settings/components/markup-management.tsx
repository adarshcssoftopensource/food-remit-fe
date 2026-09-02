/* eslint-disable react-hooks/incompatible-library */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Percent, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useGetMarkup } from "../hooks/use-get-markup";
import { useUpdateMarkup } from "../hooks/use-update-markup";
import { MarkupFormValues, markupSchema } from "../schema/markup.schema";

import { useProfile } from "@/components/providers/profile-provider";
import { Switch } from "@/components/ui/switch";

export function MarkupManagement() {
  const { profile, isSuperAdmin } = useProfile();
  const isStoreManager =
    profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager" || !isSuperAdmin;

  const { data: markupData, isLoading } = useGetMarkup();
  const { mutateAsync: updateMarkup, isPending } = useUpdateMarkup();

  const currentMarkup = markupData?.data?.markupPercentage || "10";
  const currentIsFeeRefundable = (markupData?.data as any)?.isFeeRefundable ?? true;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<MarkupFormValues>({
    resolver: zodResolver(markupSchema) as any,
    defaultValues: { markupPercentage: currentMarkup, isFeeRefundable: currentIsFeeRefundable },
    mode: "onChange",
  });

  useEffect(() => {
    if (markupData?.data) {
      reset({
        markupPercentage: markupData.data.markupPercentage || "10",
        isFeeRefundable: (markupData.data as any).isFeeRefundable ?? true,
      });
    }
  }, [markupData, reset]);

  const liveValue = watch("markupPercentage") ?? "";
  const numericValue = parseFloat(liveValue);
  const isValid = !isNaN(numericValue) && numericValue >= 0 && numericValue <= 100;

  const onSubmit: SubmitHandler<MarkupFormValues> = async (data) => {
    if (isStoreManager) return;
    try {
      const res = await updateMarkup({
        markupPercentage: data.markupPercentage,
        isFeeRefundable: data.isFeeRefundable,
      });
      reset({
        markupPercentage: data.markupPercentage,
        isFeeRefundable: data.isFeeRefundable,
      });
      successToast({
        title: "Settings Updated",
        description: res?.message || `Markup & Refund Policy updated successfully.`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-100 bg-linear-to-br from-slate-50 to-white p-4">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Current Tax (Markup)
          </p>
          <div className="mt-1 flex items-end gap-1">
            <p className="text-3xl font-black text-slate-700">
              {isLoading ? "..." : isValid ? liveValue || currentMarkup : currentMarkup}
            </p>
            <p className="mb-1 text-lg font-bold text-slate-400">%</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-linear-to-br from-slate-50 to-white p-4">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Cancellation Policy
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ${
                watch("isFeeRefundable")
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {watch("isFeeRefundable")
                ? "Option A: Fee Refundable"
                : "Option B: Fee Non-Refundable"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
        <p className="text-xs text-rose-700">
          This <span className="font-semibold">Tax</span> % (Set Markup) is an add-on — product base
          price does not change. Applied on every item in the country currency. Set between
          <span className="font-semibold"> 0% – 100%</span>.
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100">
              <TrendingUp className="h-4 w-4 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Set Tax (Markup) & Refund Policy</p>
              <p className="text-xs text-slate-500">
                Add-on tax % on every item & cancellation fee refundability toggle
              </p>
            </div>
          </div>
          {isStoreManager && (
            <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
              Read-Only
            </span>
          )}
        </div>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Controller
              name="markupPercentage"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="markupPercentage" className="text-sm font-semibold">
                    Markup Percentage <span className="text-red-500">*</span>
                  </FieldLabel>
                  <div className="relative">
                    <Percent className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      {...field}
                      id="markupPercentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="e.g. 12.5"
                      disabled={isStoreManager}
                      readOnly={isStoreManager}
                      aria-invalid={!!errors.markupPercentage}
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9.]/g, "");
                        const parts = val.split(".");
                        if (parts.length > 2) {
                          val = parts[0] + "." + parts.slice(1).join("");
                        }
                        if (parseFloat(val) > 100) {
                          val = "100";
                        }
                        field.onChange(val);
                      }}
                      className="h-11 pr-12 pl-9 disabled:bg-slate-100 disabled:opacity-80"
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2 text-sm font-semibold text-slate-400">
                      %
                    </span>
                  </div>
                  {errors.markupPercentage && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.markupPercentage.message}
                    </p>
                  )}
                </div>
              )}
            />

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
              <Controller
                name="isFeeRefundable"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <FieldLabel className="text-sm font-semibold text-slate-800">
                        Processing Fee Refundable (Cancellation Policy)
                      </FieldLabel>
                      <p className="text-xs text-slate-500">
                        {field.value
                          ? "Option A (Default): Processing fee is 100% refunded to customer on order cancellation."
                          : "Option B (Non-Refundable): Food Remit retains the processing fee, refunding item & tax total to customer card via Stripe."}
                      </p>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isStoreManager}
                    />
                  </div>
                )}
              />
            </div>

            {!isStoreManager && (
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    reset({
                      markupPercentage: currentMarkup,
                      isFeeRefundable: currentIsFeeRefundable,
                    })
                  }
                  className="px-6"
                  disabled={!isDirty}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || !isDirty}
                  className="shadow-primary/20 gap-2 px-6 shadow-md"
                >
                  <TrendingUp className="h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
