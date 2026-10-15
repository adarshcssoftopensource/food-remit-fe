"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Globe, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getCurrencySymbol } from "@/lib/utils/currency";

import { useUpdateProcessingFee } from "../hooks/use-update-processing-fee";
import { ProcessingFeeFormValues, processingFeeSchema } from "../schema/processing-fee.schema";

export function EditProcessingFeeDialog({
  countryId,
  countryName,
  currentFee,
  currencySymbol,
  currencyCode,
}: {
  countryId: string;
  countryName: string;
  currentFee: string;
  currencySymbol?: string;
  currencyCode?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: updateFee, isPending } = useUpdateProcessingFee(countryId);

  const symbol = getCurrencySymbol(currencySymbol, currencyCode);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProcessingFeeFormValues>({
    resolver: zodResolver(processingFeeSchema),
    defaultValues: { processingFee: currentFee },
    mode: "onChange",
  });

  const onSubmit = async (data: ProcessingFeeFormValues) => {
    try {
      const response = await updateFee({ processingFee: data.processingFee });
      setIsOpen(false);
      reset({ processingFee: data.processingFee });
      successToast({
        title: "Fee Updated",
        description:
          response?.message ||
          `Processing fee for ${countryName} updated to ${symbol} ${data.processingFee}.`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) reset({ processingFee: currentFee });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Edit processing fee"
          className="h-8 w-8 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
        >
          <Edit size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 font-bold text-amber-700">
              {symbol}
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Edit Processing Fee</DialogTitle>
              <p className="mt-0.5 text-xs text-slate-500">Update fee for this country</p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-white shadow-xs dark:border-slate-700 dark:bg-slate-800">
              <Globe className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Country</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{countryName}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs font-medium text-slate-500">Current Fee</p>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-500">
                {symbol} {currentFee}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-6 pt-2 pb-6">
          <Controller
            name="processingFee"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="processingFee" className="text-sm font-semibold">
                  New Processing Fee <span className="text-red-500">*</span>
                </FieldLabel>
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute top-1.5 bottom-1.5 left-1.5 z-10 flex items-center justify-center rounded-lg bg-slate-100 px-3 text-xs font-bold text-slate-700 select-none dark:bg-slate-800 dark:text-slate-200">
                    {symbol}
                  </div>
                  <Input
                    {...field}
                    type="number"
                    step="any"
                    id="processingFee"
                    placeholder="0.00"
                    aria-invalid={!!errors.processingFee}
                    style={{
                      paddingLeft: `${Math.max((symbol?.length || 1) * 9 + 40, 64)}px`,
                    }}
                    className="h-11 rounded-xl text-sm font-semibold"
                    onFocus={(e) => {
                      if (e.target.value === "0" || Number(e.target.value) === 0) {
                        field.onChange("");
                      }
                    }}
                  />
                </div>
                {errors.processingFee && (
                  <p className="text-xs font-medium text-red-500">{errors.processingFee.message}</p>
                )}
              </div>
            )}
          />
          <div className="flex items-center gap-2.5 pt-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="h-11 min-h-11 flex-1 rounded-xl px-3 text-sm font-semibold sm:px-4"
            >
              <X size={18} />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              isLoading={isPending}
              className="shadow-primary/20 h-11 min-h-11 flex-1 gap-2 rounded-xl px-3 text-sm font-semibold shadow-md sm:px-4"
            >
              <span className="font-bold">{symbol}</span>
              Update Fee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
