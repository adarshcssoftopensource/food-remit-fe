"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Info, Landmark, Lock, Percent, Receipt, RotateCcw, Save } from "lucide-react";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import { useProfile } from "@/components/providers/profile-provider";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useGetMarkup } from "../hooks/use-get-markup";
import { useUpdateMarkup } from "../hooks/use-update-markup";

const govtTaxSchema = z.object({
  tax: z
    .string()
    .min(1, "Store Tax percentage is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100, {
      message: "Tax percentage must be between 0% and 100%",
    }),
});

type GovtTaxFormValues = z.infer<typeof govtTaxSchema>;

export function GovtTaxManagement() {
  const { isSuperAdmin } = useProfile();
  // Super Admin cannot edit Govt Tax (Read-Only for Super Admin)
  const isReadOnly = isSuperAdmin;

  const { data: markupData, isLoading } = useGetMarkup();
  const { mutateAsync: updateMarkup, isPending } = useUpdateMarkup();

  const currentTax = (markupData?.data as any)?.tax || "6.00";

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<GovtTaxFormValues>({
    resolver: zodResolver(govtTaxSchema),
    defaultValues: { tax: currentTax },
    mode: "onChange",
  });

  useEffect(() => {
    if (markupData?.data) {
      reset({
        tax: (markupData.data as any).tax || "6.00",
      });
    }
  }, [markupData, reset]);

  const liveTax = watch("tax") ?? "";
  const numericTax = parseFloat(liveTax);
  const isValidTax = !isNaN(numericTax) && numericTax >= 0 && numericTax <= 100;

  const rawDisplayValue = isValidTax ? liveTax || currentTax : currentTax;
  const formattedDisplayTax = rawDisplayValue
    ? (Math.round(parseFloat(rawDisplayValue) * 100) / 100).toString()
    : "0";

  const onSubmit: SubmitHandler<GovtTaxFormValues> = async (data) => {
    if (isReadOnly) return;
    try {
      const res = await updateMarkup({
        tax: data.tax,
      } as any);
      reset({ tax: data.tax });
      successToast({
        title: "Govt Tax Settings Saved",
        description: res?.message || `Government store tax rate updated to ${data.tax}%.`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* Stat Header Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-amber-50/50 via-white to-white p-4 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Active Store Tax Rate
            </p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/60">
              <Landmark className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-2 flex items-end gap-1">
            <p className="text-3xl font-black text-slate-800 dark:text-slate-100">
              {isLoading ? "..." : formattedDisplayTax}
            </p>
            <p className="mb-1 text-lg font-bold text-amber-600 dark:text-amber-400">%</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50/50 via-white to-white p-4 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Tax Application Scope
            </p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60">
              <Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100/80 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Building2 className="h-3.5 w-3.5" />
              Per Item Store Tax
            </span>
          </div>
        </div>
      </div>

      {/* Info Notice Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3.5 text-amber-900 shadow-xs dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-xs leading-relaxed font-medium">
          <span className="font-bold">Govt Tax</span> added here will directly impact the items of
          the store. Applied per item as{" "}
          <code className="font-semibold text-amber-800 dark:text-amber-300">itemTax</code> and
          dynamically aggregated in cart & order totals.
        </p>
      </div>

      {/* Main Form Card */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shadow-xs dark:bg-amber-950/60 dark:text-amber-400">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Govt Tax Added Here
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The tax added here will directly impact the items of the store
              </p>
            </div>
          </div>
          {isReadOnly && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <Lock className="h-3.5 w-3.5" />
              Read-Only
            </span>
          )}
        </div>

        <CardContent className="p-6 sm:p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="tax"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <FieldLabel
                    htmlFor="storeTax"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Store Tax Percentage <span className="text-red-500">*</span>
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="storeTax"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="6.00"
                      disabled={isReadOnly}
                      readOnly={isReadOnly}
                      aria-invalid={!!errors.tax}
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
                        if (parts[1] && parts[1].length > 2) {
                          val = parts[0] + "." + parts[1].slice(0, 2);
                        }
                        if (parseFloat(val) > 100) {
                          val = "100";
                        }
                        field.onChange(val);
                      }}
                      className="h-11 [appearance:textfield] rounded-xl border-slate-200 bg-white pr-14 pl-4 text-base font-semibold text-slate-800 shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-80 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <div className="pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-extrabold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      %
                    </div>
                  </div>
                  {errors.tax ? (
                    <p className="text-xs font-medium text-red-500">{errors.tax.message}</p>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enter percentage rate between 0.00% and 100.00%.
                    </p>
                  )}
                </div>
              )}
            />
            {!isReadOnly && (
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset({ tax: currentTax })}
                  className="h-10 gap-2 rounded-xl px-5 font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  disabled={!isDirty || isPending || isReadOnly}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || !isDirty || isReadOnly}
                  className="h-10 min-w-[140px] gap-2 rounded-xl bg-amber-500 font-semibold text-white shadow-md shadow-amber-500/20 transition-all hover:bg-amber-600 disabled:opacity-60 dark:bg-amber-600 dark:hover:bg-amber-700"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
