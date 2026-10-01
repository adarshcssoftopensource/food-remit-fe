"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

export function CouponDetailsLoading() {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
        <p className="text-xs font-semibold text-slate-500">Loading coupon details...</p>
      </div>
    </div>
  );
}

type PageHeaderSectionProps = {
  isEdit: boolean;
  status?: string;
  isSubmitting: boolean;
  onPublish: () => void;
};

export function CouponPageHeader({
  isEdit,
  status,
  isSubmitting,
  onPublish,
}: PageHeaderSectionProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
      <div className="flex items-center gap-4">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="size-10 cursor-pointer rounded-xl border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
          title="Back to coupons"
        >
          <Link href={ROUTES.ADMIN.COUPONS_MANAGEMENT.ROOT}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              {isEdit ? "Edit Coupon Campaign" : "Create Promotional Coupon"}
            </h1>
            {isEdit && status && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {status}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {isEdit
              ? "Update promotional discount rules, store applicability, and schedule window."
              : "Configure discount rates, store scope applicability, and scheduling rules."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          asChild
          variant="outline"
          className="h-10 cursor-pointer rounded-xl border-slate-200 px-5 text-xs font-semibold dark:border-slate-800"
        >
          <Link href={ROUTES.ADMIN.COUPONS_MANAGEMENT.ROOT}>Cancel</Link>
        </Button>
        <Button
          type="button"
          onClick={onPublish}
          isLoading={isSubmitting}
          className="h-10 cursor-pointer rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700 active:scale-98"
        >
          {isEdit ? "Update Coupon" : "Publish Coupon"}
        </Button>
      </div>
    </div>
  );
}
