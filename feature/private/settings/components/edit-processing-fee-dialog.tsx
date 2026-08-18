"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Edit, Globe, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ProcessingFeeFormValues, processingFeeSchema } from "../schema/processing-fee.schema";

export function EditProcessingFeeDialog({
  countryId,
  countryName,
  currentFee,
}: {
  countryId: string;
  countryName: string;
  currentFee: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProcessingFeeFormValues>({
    resolver: zodResolver(processingFeeSchema),
    defaultValues: { processingFee: currentFee },
    mode: "onChange",
  });

  const onSubmit = async (data: ProcessingFeeFormValues) => {
    console.log("Update processing fee:", { countryId, countryName, newFee: data.processingFee });
    setIsOpen(false);
    reset();
    successToast({
      title: "Fee Updated",
      description: `Processing fee for ${countryName} updated to ${data.processingFee}.`,
    });
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
          className="h-8 w-8 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
        >
          <Edit size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-2">
        <DialogHeader className="pb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Edit Processing Fee</DialogTitle>
              <p className="mt-0.5 text-xs text-slate-500">Update fee for this country</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-white shadow-sm">
            <Globe className="h-4 w-4 text-slate-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Country</p>
            <p className="text-sm font-bold text-slate-800">{countryName}</p>
          </div>
          <div className="ml-auto">
            <p className="text-xs font-medium text-slate-500">Current Fee</p>
            <p className="text-sm font-bold text-amber-600">{currentFee}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <Controller
            name="processingFee"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="processingFee" className="text-sm font-semibold">
                  New Processing Fee <span className="text-red-500">*</span>
                </FieldLabel>
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    {...field}
                    id="processingFee"
                    placeholder="e.g. 2.50"
                    aria-invalid={!!errors.processingFee}
                    className="h-11 pl-9"
                  />
                </div>
                {errors.processingFee && (
                  <p className="text-xs font-medium text-red-500">{errors.processingFee.message}</p>
                )}
              </div>
            )}
          />
          <DialogFooter className="mt-8 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="flex-1"
            >
              <X size={20} />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="shadow-primary/20 flex-1 gap-2 shadow-md"
            >
              <DollarSign size={20} />
              Update Fee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
