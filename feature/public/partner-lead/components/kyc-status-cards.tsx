"use client";

import { CheckCircle2, AlertCircle, Camera, FileText, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function KycVerifiedBanner() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CheckCircle2 className="size-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-sm font-bold text-emerald-900">
            Identity Successfully Verified with Veriff!
          </h3>
          <p className="text-xs leading-relaxed text-emerald-800">
            Your government identity document and liveness selfie were approved by Veriff and
            securely stored in AWS S3.
          </p>
        </div>
      </div>
    </div>
  );
}

export function KycDeclinedBanner() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="size-5 shrink-0 text-rose-600" />
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-rose-900">Verification Declined</h3>
          <p className="text-xs leading-relaxed text-rose-800">
            Veriff could not verify the document. Please ensure your photo ID is clear, unblurred,
            and valid, then try again.
          </p>
        </div>
      </div>
    </div>
  );
}

export function KycFeatureBadges() {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
        <FileText className="size-4 shrink-0 text-emerald-600" />
        <div className="text-xs">
          <div className="font-semibold text-slate-800">Upload Photo ID</div>
          <div className="text-[11px] text-slate-500">Passport / License / ID</div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
        <Camera className="size-4 shrink-0 text-emerald-600" />
        <div className="text-xs">
          <div className="font-semibold text-slate-800">Live Selfie</div>
          <div className="text-[11px] text-slate-500">Biometric liveness check</div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
        <div className="text-xs">
          <div className="font-semibold text-slate-800">Veriff AI Validation</div>
          <div className="text-[11px] text-slate-500">Automated document check</div>
        </div>
      </div>
    </div>
  );
}

interface KycActiveSyncBannerProps {
  isCheckingStatus: boolean;
  onCheckStatus: () => void;
}

export function KycActiveSyncBanner({ isCheckingStatus, onCheckStatus }: KycActiveSyncBannerProps) {
  return (
    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
            <Clock className="size-4 text-emerald-700" />
            Veriff Verification Active
          </div>
          <p className="mt-0.5 text-[11px] text-emerald-800">
            Complete your document and selfie capture in the Veriff window, then check approval
            below.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={isCheckingStatus}
          onClick={onCheckStatus}
          className="h-9 shrink-0 rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white hover:bg-emerald-800"
        >
          <RefreshCw className={cn("mr-1.5 size-3.5", isCheckingStatus && "animate-spin")} />
          Check Approval Status
        </Button>
      </div>
    </div>
  );
}

interface KycAwaitingApprovalCardProps {
  applicantName: string;
}

export function KycAwaitingApprovalCard({ applicantName }: KycAwaitingApprovalCardProps) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-linear-to-b from-emerald-50/70 to-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4">
        {/* Status Badge & Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-emerald-600"></span>
            </span>
            <span className="text-xs font-bold tracking-wider text-emerald-900 uppercase">
              Verification In Review
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100/70 px-3 py-1 text-xs font-semibold text-emerald-900">
            <Clock className="size-3.5 text-emerald-700" />
            Awaiting Veriff Approval
          </span>
        </div>

        {/* Informative text */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            Documents Submitted for {applicantName}
          </h3>
          <p className="text-xs leading-relaxed text-slate-600">
            Your government ID and biometric selfie have been received by Veriff. Automated
            verification and liveness checks are running. We will automatically advance to the next
            step once approved.
          </p>
        </div>

        {/* 3-Step Progress Indicator */}
        <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-xs text-emerald-900">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">Photo ID &amp; Selfie Sent</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-100/50 p-2.5 text-xs text-emerald-950">
            <RefreshCw className="size-4 shrink-0 animate-spin text-emerald-700" />
            <span className="font-semibold">Veriff AI Reviewing</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-500">
            <Clock className="size-4 shrink-0 text-slate-400" />
            <span>Automatic Approval</span>
          </div>
        </div>
      </div>
    </div>
  );
}
