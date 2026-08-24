/* eslint-disable react-hooks/incompatible-library */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Percent, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useGetMarkup } from "../hooks/use-get-markup";
import { useUpdateMarkup } from "../hooks/use-update-markup";
import { MarkupFormValues, markupSchema } from "../schema/markup.schema";

export function MarkupManagement() {
  const { data: markupData, isLoading } = useGetMarkup();
  const { mutateAsync: updateMarkup, isPending } = useUpdateMarkup();

  const currentMarkup = markupData?.data?.markupPercentage || "10";

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<MarkupFormValues>({
    resolver: zodResolver(markupSchema),
    defaultValues: { markupPercentage: currentMarkup },
    mode: "onChange",
  });

  useEffect(() => {
    if (markupData?.data?.markupPercentage) {
      reset({ markupPercentage: markupData.data.markupPercentage });
    }
  }, [markupData, reset]);

  const liveValue = watch("markupPercentage") ?? "";
  const numericValue = parseFloat(liveValue);
  const isValid = !isNaN(numericValue) && numericValue >= 0 && numericValue <= 100;

  const onSubmit = async (data: MarkupFormValues) => {
    try {
      const res = await updateMarkup({ markupPercentage: data.markupPercentage });
      reset({ markupPercentage: data.markupPercentage });
      successToast({
        title: "Markup Updated",
        description: res?.message || `Commission markup set to ${data.markupPercentage}%.`,
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
            Current Markup
          </p>
          <div className="mt-1 flex items-end gap-1">
            <p className="text-3xl font-black text-slate-700">
              {isLoading ? "..." : isValid ? liveValue || currentMarkup : currentMarkup}
            </p>
            <p className="mb-1 text-lg font-bold text-slate-400">%</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
        <p className="text-xs text-rose-700">
          This markup commission is applied on top of all food remit transactions. Set between
          <span className="font-semibold"> 0% – 100%</span>. Changes take effect immediately.
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100">
            <TrendingUp className="h-4 w-4 text-rose-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Set Markup Commission</p>
            <p className="text-xs text-slate-500">Applied globally across all transactions</p>
          </div>
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
                      aria-invalid={!!errors.markupPercentage}
                      className="h-11 pr-12 pl-9"
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

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset({ markupPercentage: currentMarkup })}
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
                Save Markup
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
