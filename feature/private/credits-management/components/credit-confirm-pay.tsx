"use client";

import { CheckCircle2, CreditCard, Loader2, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { CreditConfirmPayProps } from "../types/credits.types";

export function CreditConfirmPay({
  open = true,
  onOpenChange,
  amount,
  customerName,
  referenceNumber,
  storeName,
  isPending,
  onConfirm,
  onCancel,
}: CreditConfirmPayProps) {
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
    if (!isOpen) {
      onCancel?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={true}
        className="max-w-[390px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-0 shadow-2xl sm:max-w-[400px] dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Sleek Top Header Bar */}
        <div className="relative border-b border-slate-100/80 bg-gradient-to-b from-slate-50/90 via-slate-50/40 to-white px-5 pt-5 pb-4 dark:border-slate-800 dark:from-slate-800/50 dark:to-slate-900">
          <div className="flex items-center gap-3 pr-8">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-xs ring-1 ring-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400">
              <CreditCard className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                Confirm Refund Execution
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Super Admin Payout Authorization
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-50/60 px-4 py-3 dark:border-emerald-500/30 dark:bg-emerald-950/20">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold tracking-wider text-emerald-700/90 uppercase dark:text-emerald-400">
                Refund Amount
              </p>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
                Direct to customer
              </p>
            </div>
            <div className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {amount}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-800/40">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <User className="size-3.5 text-slate-400" />
                  Customer
                </span>
                <span className="max-w-[180px] truncate font-bold text-slate-900 dark:text-slate-100">
                  {customerName}
                </span>
              </div>

              {storeName && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Store className="size-3.5 text-slate-400" />
                    Store
                  </span>
                  <span className="max-w-45 truncate font-medium text-slate-700 dark:text-slate-300">
                    {storeName}
                  </span>
                </div>
              )}

              {referenceNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Order Ref</span>
                  <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800 shadow-2xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    #{referenceNumber}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-200/60 pt-0.5 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">New Status</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Completed
                </span>
              </div>
            </div>
          </div>

          {/* Action Notice */}
          <p className="text-center text-[11px] leading-snug text-slate-400 dark:text-slate-500">
            This will mark the credit record as completed and update the order in Order Management.
          </p>

          {/* Compact Balanced 2-Column Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="h-10 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="h-10 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-1.5 size-3.5" />
                  Yes, Process Refund
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
