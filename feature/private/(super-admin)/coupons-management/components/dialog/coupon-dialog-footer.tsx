"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

type DialogFooterSectionProps = {
  isEdit: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
};

export function CouponDialogFooter({ isEdit, isSubmitting, onCancel }: DialogFooterSectionProps) {
  return (
    <DialogFooter className="sticky -bottom-6 -mx-6 -mb-6 flex flex-row items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/90 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="h-10 cursor-pointer rounded-xl border-slate-200 px-5 text-xs font-semibold dark:border-slate-700"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        isLoading={isSubmitting}
        className="h-10 cursor-pointer rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700 active:scale-98"
      >
        {isEdit ? "Update Coupon" : "Create Coupon"}
      </Button>
    </DialogFooter>
  );
}
