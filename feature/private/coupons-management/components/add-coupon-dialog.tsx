"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, TicketPercent } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { couponSchema, type CouponFormValues } from "../schema/coupon.schema";

interface AddCouponDialogProps {
  onCreate: (values: CouponFormValues) => void;
}

export function AddCouponDialog({ onCreate }: AddCouponDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      couponName: "",
      discount: 0,
      description: "",
      minOrderValue: 0,
      maxUsers: 1,
    },
    mode: "onChange",
  });

  const handleAddCoupon = async (values: CouponFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      onCreate(values);
      successToast({ title: "Coupon added successfully" });
      reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 size-4" />
        Add Coupons
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl rounded-3xl p-0 shadow-xl">
        <DialogHeader className="rounded-t-3xl border-b border-slate-200 bg-linear-to-r from-orange-100 via-white to-amber-50 px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-200/70 shadow-sm">
              <TicketPercent className="size-6 text-orange-700" />
            </div>

            <div className="text-left">
              <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                Add Coupon
              </DialogTitle>

              <DialogDescription className="mt-1 max-w-lg text-sm leading-5 text-slate-600">
                Create a new coupon campaign with discount, limits, and expiry management.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleAddCoupon)} className="space-y-6 p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <Controller
              name="couponName"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <FieldLabel className="text-sm font-semibold text-slate-700">
                    Coupon Name <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="Enter coupon name"
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-[#1B3A8C] focus:bg-white"
                  />
                  {errors.couponName && (
                    <p className="text-xs text-red-500">{errors.couponName.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="discount"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <FieldLabel className="text-sm font-semibold text-slate-700">
                    Discount (%) <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    min={1}
                    max={100}
                    placeholder="Enter discount percentage"
                    value={field.value ?? ""}
                    onChange={(event) =>
                      field.onChange(event.target.value ? Number(event.target.value) : undefined)
                    }
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-[#1B3A8C] focus:bg-white"
                  />
                  {errors.discount && (
                    <p className="text-xs text-red-500">{errors.discount.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="space-y-2 lg:col-span-2">
                  <FieldLabel className="text-sm font-semibold text-slate-700">
                    Description <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="Enter coupon description"
                    className="rounded-xl border-gray-200 bg-gray-50 focus:border-[#1B3A8C] focus:bg-white"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500">{errors.description.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="minOrderValue"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <FieldLabel className="text-sm font-semibold text-slate-700">
                    Minimum Order Value <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    placeholder="Minimum order value"
                    value={field.value ?? ""}
                    onChange={(event) =>
                      field.onChange(event.target.value ? Number(event.target.value) : undefined)
                    }
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-[#1B3A8C] focus:bg-white"
                  />
                  {errors.minOrderValue && (
                    <p className="text-xs text-red-500">{errors.minOrderValue.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="maxUsers"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <FieldLabel className="text-sm font-semibold text-slate-700">
                    Maximum No of Users <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    placeholder="Enter maximum users"
                    value={field.value ?? ""}
                    onChange={(event) =>
                      field.onChange(event.target.value ? Number(event.target.value) : undefined)
                    }
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-[#1B3A8C] focus:bg-white"
                  />
                  {errors.maxUsers && (
                    <p className="text-xs text-red-500">{errors.maxUsers.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              className="h-12 rounded-xl px-8"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="h-12 rounded-xl px-8">
              Add Coupon
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
