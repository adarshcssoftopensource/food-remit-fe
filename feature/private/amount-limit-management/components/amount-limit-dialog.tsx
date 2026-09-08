"use client";

import { CountrySelect } from "@/components/common/country-select";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateAmountLimit } from "../hooks/use-create-amount-limit";
import { useUpdateAmountLimit } from "../hooks/use-update-amount-limit";
import { AmountLimitFormValues, amountLimitSchema } from "../schema/amount-limit.schema";

interface AmountLimitDialogProps {
  mode?: "add" | "edit";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  limitId?: string;
  initialValues?: Partial<AmountLimitFormValues>;
}

export function AmountLimitDialog({
  mode = "add",
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  limitId,
  initialValues,
}: AmountLimitDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const createMutation = useCreateAmountLimit();
  const updateMutation = useUpdateAmountLimit(limitId);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AmountLimitFormValues>({
    resolver: zodResolver(amountLimitSchema),
    defaultValues: {
      countryName: initialValues?.countryName ?? "",
      amount: initialValues?.amount ?? "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      reset({
        countryName: initialValues?.countryName ?? "",
        amount: initialValues?.amount ?? "",
      });
    }
  }, [open, initialValues, reset]);

  const onSubmit = async (values: AmountLimitFormValues) => {
    try {
      if (mode === "add") {
        await createMutation.mutateAsync({
          countryName: values.countryName,
          amount: values.amount,
        });
        successToast({ title: "Country amount limit added successfully" });
      } else {
        await updateMutation.mutateAsync({
          id: limitId,
          countryName: values.countryName,
          amount: values.amount,
        });
        successToast({ title: "Country amount limit updated successfully" });
      }

      onOpenChange(false);
      reset({ countryName: "", amount: "" });
    } catch (error) {
      // Backend error is intercepted and displayed via client.ts
      console.error("Amount Limit submit error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {mode === "add" && (
        <DialogTrigger render={<Button />}>
          <Globe className="mr-2 h-4 w-4" />
          Add Amount Limit
        </DialogTrigger>
      )}
      <DialogContent className="w-full max-w-md">
        <DialogHeader className="rounded-t-3xl border-b px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border">
              <Globe className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                {mode === "add" ? "Add Country Amount Limit" : "Edit Amount Limit"}
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm text-slate-600">
                {mode === "add"
                  ? "Set amount limits for different countries"
                  : "Update amount limit for the selected country"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <Controller
            name="countryName"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <FieldLabel className="text-sm font-semibold text-gray-700">
                  Country Name <span className="text-red-500">*</span>
                </FieldLabel>
                {mode === "edit" ? (
                  <Input
                    value={field.value}
                    disabled
                    readOnly
                    className="h-12 rounded-xl bg-gray-100 font-medium text-gray-600"
                  />
                ) : (
                  <CountrySelect
                    value={field.value}
                    valueKey="name"
                    onValueChange={(val) => field.onChange(val)}
                    disabled={isPending}
                    invalid={!!errors.countryName}
                    placeholder="Select Country"
                    className="h-12 rounded-xl"
                  />
                )}
                {errors.countryName && (
                  <p className="text-xs text-red-500">{errors.countryName.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <FieldLabel className="text-sm font-semibold text-gray-700">
                  Amount <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter Amount"
                  disabled={isPending}
                  className={cn("h-12 rounded-xl", errors.amount && "border-red-400")}
                />
                {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
              </div>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isPending} className="h-12 w-fit rounded-xl">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} /> {mode === "add" ? "Add" : "Update"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
