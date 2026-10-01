"use client";

import { TicketPercent } from "lucide-react";

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function CouponDialogHeader({ isEdit }: { isEdit: boolean }) {
  return (
    <DialogHeader className="shrink-0 border-b border-slate-100 bg-linear-to-b from-slate-50/80 to-white px-6 py-5 dark:border-slate-800/80 dark:from-slate-900/90 dark:to-slate-900">
      <div className="flex items-center gap-3.5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25">
          <TicketPercent className="size-5.5" />
        </div>

        <div className="pr-8 text-left">
          <DialogTitle className="text-base font-bold tracking-tight text-slate-900 sm:text-lg dark:text-white">
            {isEdit ? "Edit Coupon" : "Create New Coupon"}
          </DialogTitle>
          <DialogDescription className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {isEdit
              ? "Update promotional discount details, target store, and schedule."
              : "Configure discount rates, store scope applicability, and scheduling rules."}
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>
  );
}
