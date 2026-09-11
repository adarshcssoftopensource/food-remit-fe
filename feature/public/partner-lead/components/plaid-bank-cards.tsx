"use client";

import { Building2, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerifiedBankInfo } from "../types/plaid.types";

interface VerifiedBankCardProps {
  verifiedBank: VerifiedBankInfo;
  onChangeBank: () => void;
}

export function VerifiedBankCard({ verifiedBank, onChangeBank }: VerifiedBankCardProps) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
          <CheckCircle2 className="size-6" />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-200/70 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900 uppercase">
              Verified with Plaid
            </span>
          </div>
          <h3 className="text-base font-bold text-emerald-950">
            {verifiedBank.institutionName || "Verified Commercial Bank"}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-800">
            <span>{verifiedBank.accountName || "Business Checking"}</span>
            <span>•</span>
            <span className="font-mono font-bold">•••• {verifiedBank.accountMask || "0000"}</span>
          </div>
          <p className="pt-1 text-xs leading-relaxed text-emerald-800/90">
            Your bank account has been confirmed and verified. Payouts and disbursements will be
            settled to this account.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-emerald-200/60 pt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onChangeBank}
          className="h-8 rounded-lg border-emerald-300 bg-white text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
        >
          Change Bank Account
        </Button>
      </div>
    </div>
  );
}

export function PlaidFeaturesGrid() {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs">
        <Building2 className="size-4.5 shrink-0 text-emerald-600" />
        <div>
          <div className="font-bold text-slate-800">12,000+ Banks</div>
          <div className="text-[11px] text-slate-500">Chase, BoA, Wells Fargo & more</div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs">
        <ShieldCheck className="size-4.5 shrink-0 text-emerald-600" />
        <div>
          <div className="font-bold text-slate-800">Instant Verification</div>
          <div className="text-[11px] text-slate-500">Zero micro-deposit delay</div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs">
        <CheckCircle2 className="size-4.5 shrink-0 text-emerald-600" />
        <div>
          <div className="font-bold text-slate-800">Automated Payouts</div>
          <div className="text-[11px] text-slate-500">Verified routing & account mask</div>
        </div>
      </div>
    </div>
  );
}
