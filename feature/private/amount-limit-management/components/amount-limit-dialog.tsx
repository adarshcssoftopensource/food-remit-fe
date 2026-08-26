"use client";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Save } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AmountLimitFormValues, amountLimitSchema } from "../schema/amount-limit.schema";

interface AmountLimitDialogProps {
  mode?: "add" | "edit";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialValues?: Partial<AmountLimitFormValues>;
}

export function AmountLimitDialog({
  mode = "add",
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialValues,
}: AmountLimitDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AmountLimitFormValues>({
    resolver: zodResolver(amountLimitSchema),
    defaultValues: {
      countryName: "",
      amount: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: AmountLimitFormValues) => {
    try {
      console.log("Amount Limit Data:", values);
      if (mode === "add") {
        successToast({ title: "Country amount limit added successfully" });
      } else {
        successToast({ title: "Country amount limit updated successfully" });
      }

      onOpenChange(false);
      reset();
    } catch (error) {
      console.error(error);
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
                {mode === "add" ? "Add Country Amount Limit" : "Edit Country Amount Limit"}
              </DialogTitle>

              {mode === "add" && (
                <DialogDescription className="mt-1 text-sm text-slate-600">
                  Set amount limits for different countries
                </DialogDescription>
              )}
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={cn(
                      "w-full rounded-xl border-gray-200 bg-gray-50",
                      "focus:bg-white focus-visible:border-[#1B3A8C]",
                      errors.countryName && "border-red-400",
                    )}
                  >
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                  type="text"
                  placeholder="Enter Amount"
                  className={cn("h-12 rounded-xl", errors.amount && "border-red-400")}
                />
                {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
              </div>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button type="submit" className="h-12 w-fit rounded-xl">
              <Save size={20} /> {mode === "add" ? "Add" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
