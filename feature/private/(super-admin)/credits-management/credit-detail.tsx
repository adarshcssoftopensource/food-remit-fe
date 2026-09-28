"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Loader2,
  Receipt,
  ShieldAlert,
} from "lucide-react";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { useProfile } from "@/components/providers/profile-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/date";
import { cleanCurrencyDisplay } from "@/lib/utils/currency";
import { CreditConfirmPay } from "./components/credit-confirm-pay";
import { CreditFinancialBreakdown } from "./components/credit-financial-breakdown";
import { CreditPartiesCard } from "./components/credit-parties-card";
import { CreditPaymentCard } from "./components/credit-payment-card";
import { CreditUnmarkedItems } from "./components/credit-unmarked-items";
import { useGetCreditDetail } from "./hooks/use-get-credit-detail";
import { usePayCreditRefund } from "./hooks/use-pay-credit-refund";

interface CreditDetailPageProps {
  id: string;
}

export function CreditDetailPage({ id }: CreditDetailPageProps) {
  const router = useRouter();
  const { isSuperAdmin } = useProfile();
  const { data: detail, isLoading, error } = useGetCreditDetail(id);
  const payMutation = usePayCreditRefund();

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showConfirmPay, setShowConfirmPay] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const handlePayRefund = async () => {
    if (!id) return;
    try {
      await payMutation.mutateAsync(id);
      setShowConfirmPay(false);
    } catch {
      // Handled by toast
    }
  };

  const handleCopyRef = () => {
    if (detail?.referenceNumber) {
      navigator.clipboard.writeText(detail.referenceNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleCopyOrderId = () => {
    if (detail?.orderId) {
      navigator.clipboard.writeText(detail.orderId);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    }
  };

  const isPending = detail?.status === "Pending";
  const formattedRefundAmount = detail
    ? cleanCurrencyDisplay(detail.financials.totalRefundCustomer)
    : "$0.00";

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-2xl shadow-inner">
          <Loader2 className="size-7 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Loading credit request details...
        </p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/credits-management")}
          className="gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to Credits
        </Button>
        <Card className="rounded-3xl border border-rose-200 bg-rose-50/50 p-10 text-center dark:border-rose-900/30 dark:bg-rose-950/20">
          <AlertCircle className="mx-auto mb-3 size-10 text-rose-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Credit Record Not Found
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            The requested order credit record could not be loaded. Please ensure the Order ID is
            correct or return to the credits list.
          </p>
          <Button
            className="mt-5 rounded-full px-6"
            onClick={() => router.push("/credits-management")}
          >
            Return to Credits
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <Card className="rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-xs backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => router.push("/credits-management")}
                className="inline-flex h-7 items-center gap-1.5 font-medium transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowLeft className="size-3.5" />
                <span>Credits Management</span>
              </Button>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Credit Request Details
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-primary/10 text-primary ring-primary/20 flex size-11 items-center justify-center rounded-2xl shadow-xs ring-1">
                <Receipt className="size-5.5" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                    Credit Request
                  </h1>

                  {/* Reference Pill with interactive copy */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleCopyRef}
                    onKeyDown={(e) => e.key === "Enter" && handleCopyRef()}
                    className="group inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-bold text-slate-800 shadow-2xs transition hover:border-slate-300 hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    title="Click to copy Reference Number"
                  >
                    <span>#{detail.referenceNumber}</span>
                    {copiedRef ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5 text-slate-400 transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                    )}
                  </div>

                  {/* Status Badge */}
                  {isPending ? (
                    <Badge
                      variant="outline"
                      className="gap-1.5 border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
                    >
                      <span className="size-1.5 animate-pulse rounded-full bg-amber-500" />
                      Pending Refund
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="gap-1.5 border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                    >
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      Refund Completed
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Metadata Tags Row */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100/80 px-2.5 py-1 font-medium text-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                <Calendar className="size-3.5 text-slate-400" />
                {formatDate(detail.orderDate)}
              </span>

              {/* Order ID Pill with Copy */}
              <div
                role="button"
                tabIndex={0}
                onClick={handleCopyOrderId}
                onKeyDown={(e) => e.key === "Enter" && handleCopyOrderId()}
                className="group inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200/80 bg-white px-2 py-1 font-mono text-[11px] text-slate-500 shadow-2xs transition hover:border-slate-300 hover:text-slate-800 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:hover:text-slate-200"
                title="Click to copy full Order ID"
              >
                <span>ID: {detail.orderId.slice(0, 8)}...</span>
                {copiedOrderId ? (
                  <Check className="size-3 text-emerald-600" />
                ) : (
                  <Copy className="size-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                )}
              </div>
            </div>
          </div>

          {/* Right Action: Single Primary Button */}
          <div className="flex items-center gap-3">
            {isPending ? (
              isSuperAdmin ? (
                <Button
                  onClick={() => setShowConfirmPay(true)}
                  className="h-11 rounded-full bg-rose-600 px-7 text-sm font-bold text-white shadow-lg shadow-rose-600/25 transition-all hover:bg-rose-700 hover:shadow-rose-600/35 active:scale-95"
                >
                  <CreditCard className="mr-2 size-4.5" />
                  Pay Refund ({formattedRefundAmount})
                </Button>
              ) : (
                <div className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 text-xs font-semibold text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400">
                  <ShieldAlert className="size-4 text-amber-500" />
                  Super Admin Payout Only
                </div>
              )
            ) : (
              <div className="inline-flex h-11 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 text-xs font-black text-emerald-700 shadow-xs dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400">
                <CheckCircle2 className="size-4 text-emerald-600" />
                Refund Completed ({formattedRefundAmount})
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Confirm Pay Dialog Modal Popup */}
      <CreditConfirmPay
        open={showConfirmPay}
        onOpenChange={setShowConfirmPay}
        amount={formattedRefundAmount}
        customerName={detail.customer.name}
        referenceNumber={detail.referenceNumber}
        storeName={detail.store.name}
        isPending={payMutation.isPending}
        onConfirm={handlePayRefund}
        onCancel={() => setShowConfirmPay(false)}
      />

      {/* Section 1: Customer & Store Information */}
      <CreditPartiesCard
        customer={detail.customer}
        store={detail.store}
        onImageClick={setLightboxImage}
      />

      {/* Section 2: Unmarked Items Requiring Refund (Full Width - No empty gaps) */}
      <CreditUnmarkedItems
        items={detail.unmarkedItems}
        currency={detail.currency}
        onImageClick={setLightboxImage}
      />

      {/* Section 3: Payment Method Card & Financial Calculation Breakdown (Balanced 2-Column) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CreditPaymentCard
          transaction={detail.transaction}
          customerName={detail.customer.name}
          currency={detail.currency}
        />

        <CreditFinancialBreakdown financials={detail.financials} />
      </div>

      {/* Global Image Lightbox Modal for All Zoomable Images */}
      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
