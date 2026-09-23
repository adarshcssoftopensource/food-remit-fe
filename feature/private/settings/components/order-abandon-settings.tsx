"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock3, Info, MessageSquareText, RotateCcw, Save } from "lucide-react";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import { useProfile } from "@/components/providers/profile-provider";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useGetStore } from "@/feature/private/store-management/hooks/use-get-stores";
import { useUpdateStore } from "@/feature/private/store-management/hooks/use-update-store";

const abandonSchema = z.object({
  autoAbandonDays: z
    .string()
    .min(1, "Days are required")
    .refine(
      (val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 1 && parseInt(val, 10) <= 365,
      {
        message: "Days must be between 1 and 365",
      },
    ),
  autoAbandonRemark: z
    .string()
    .min(5, "Remark must be at least 5 characters")
    .max(500, "Remark must be under 500 characters"),
});

type AbandonFormValues = z.infer<typeof abandonSchema>;

const DEFAULT_REMARK =
  "Order was automatically abandoned because it was not collected within the allowed pickup window.";

export function OrderAbandonSettings() {
  const { isSuperAdmin, profile } = useProfile();
  const isReadOnly = isSuperAdmin;

  const storeId = profile?.stores?.[0]?.id || "";
  const { data: storeData, isLoading } = useGetStore(storeId);
  const { mutateAsync: updateStore, isPending } = useUpdateStore(storeId);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<AbandonFormValues>({
    resolver: zodResolver(abandonSchema),
    defaultValues: {
      autoAbandonDays: "5",
      autoAbandonRemark: DEFAULT_REMARK,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (storeData) {
      reset({
        autoAbandonDays: String(storeData.autoAbandonDays ?? 5),
        autoAbandonRemark: storeData.autoAbandonRemark?.trim() || DEFAULT_REMARK,
      });
    }
  }, [storeData, reset]);

  const days = watch("autoAbandonDays");
  const remark = watch("autoAbandonRemark");

  const onSubmit: SubmitHandler<AbandonFormValues> = async (data) => {
    if (isReadOnly || !storeId) return;
    try {
      const formData = new FormData();
      formData.append("autoAbandonDays", data.autoAbandonDays);
      formData.append("autoAbandonRemark", data.autoAbandonRemark.trim());
      const res = await updateStore(formData as any);
      reset(data);
      successToast({
        title: "Auto-Abandon Settings Saved",
        description:
          res?.message ||
          `Uncollected Picked Up orders will auto-abandon after ${data.autoAbandonDays} day(s).`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <Card className="flex h-48 items-center justify-center rounded-3xl border border-slate-200">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      </Card>
    );
  }

  if (!storeId) {
    return (
      <Card className="rounded-3xl border border-amber-200 bg-amber-50/50 p-6">
        <p className="text-sm text-amber-800">No store is linked to your account.</p>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-amber-50/60 via-white to-white p-4 shadow-xs dark:border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Auto-Abandon After
            </p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Clock3 className="size-3.5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{days || "5"} days</p>
          <p className="mt-1 text-xs text-slate-500">From when the order becomes Picked Up</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-orange-50/60 via-white to-white p-4 shadow-xs dark:border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Remark Preview
            </p>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
              <MessageSquareText className="size-3.5" />
            </div>
          </div>
          <p className="mt-2 line-clamp-3 text-sm font-medium text-slate-800">
            {remark || DEFAULT_REMARK}
          </p>
        </div>
      </div>

      <Card className="rounded-3xl border border-slate-200/80 shadow-xs dark:border-slate-800">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3 dark:border-sky-900/40 dark:bg-sky-950/20">
            <Info className="mt-0.5 size-4 shrink-0 text-sky-600" />
            <p className="text-xs leading-relaxed text-sky-900 dark:text-sky-200">
              When an order is <strong>Marked Completed</strong> it becomes{" "}
              <strong>Picked Up</strong>. If nobody <strong>Closes</strong> it within your set days,
              the scheduler auto-
              <strong>Abandons</strong> it, stores this remark with a <code>[System]</code> tag, and
              emails sender &amp; receiver.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Controller
              name="autoAbandonDays"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <FieldLabel className="text-sm font-semibold">
                    Auto-Abandon Days <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    max={365}
                    disabled={isReadOnly || isPending}
                    className="h-11 rounded-xl"
                    placeholder="5"
                  />
                  {errors.autoAbandonDays && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.autoAbandonDays.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="autoAbandonRemark"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <FieldLabel className="text-sm font-semibold">
                    Auto-Abandon Remark <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    rows={4}
                    disabled={isReadOnly || isPending}
                    className="resize-none rounded-xl"
                    placeholder={DEFAULT_REMARK}
                  />
                  {errors.autoAbandonRemark && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.autoAbandonRemark.message}
                    </p>
                  )}
                </div>
              )}
            />

            {!isReadOnly && (
              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl"
                  disabled={isPending || !isDirty}
                  onClick={() =>
                    reset({
                      autoAbandonDays: String(storeData?.autoAbandonDays ?? 5),
                      autoAbandonRemark: storeData?.autoAbandonRemark?.trim() || DEFAULT_REMARK,
                    })
                  }
                >
                  <RotateCcw className="mr-2 size-4" />
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="h-11 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
                  disabled={isPending || !isDirty}
                >
                  <Save className="mr-2 size-4" />
                  {isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
