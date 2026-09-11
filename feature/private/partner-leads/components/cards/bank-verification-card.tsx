"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Landmark,
  CheckCircle2,
  Clock,
  Building2,
  Lock,
  Copy,
  Check,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { format } from "date-fns";
import { PartnerLeadData } from "../../types/partner-lead.types";

interface BankVerificationCardProps {
  lead: PartnerLeadData;
}

export function BankVerificationCard({ lead }: BankVerificationCardProps) {
  const [copiedId, setCopiedId] = useState(false);

  const bankRecord = lead.bankVerifications?.[0];
  const bank = lead.bankData || bankRecord || {};
  const bankStatus = (
    lead.bankStatus ||
    bankRecord?.status ||
    bank.status ||
    "NOT_STARTED"
  ).toUpperCase();
  const isVerified = bankStatus === "VERIFIED";

  const institutionName = bank.institutionName || bankRecord?.institutionName || "Commercial Bank";
  const accountName = bank.accountName || bankRecord?.accountName || "Business Checking";
  const accountMask = bank.accountMask || bankRecord?.accountMask || "••••";
  const accountType = bank.accountType || bankRecord?.accountType || "depository";
  const accountSubtype = bank.accountSubtype || bankRecord?.accountSubtype || "checking";
  const itemId = lead.plaidItemId || bankRecord?.itemId || bank.itemId;
  const verifiedDate = lead.bankVerifiedAt || bankRecord?.createdAt || bank.createdAt;

  const handleCopyItemId = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <Card className="col-span-1 overflow-hidden rounded-2xl border-slate-200/80 shadow-xs md:col-span-2 dark:border-slate-800">
      <CardHeader className="border-b border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Landmark className="size-4.5" />
            </div>
            Bank Account Verification (Plaid)
          </CardTitle>

          <div className="flex items-center gap-2">
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                Verified with Plaid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                <Clock className="size-3.5 text-slate-400" />
                Not Verified
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isVerified ? (
          <div className="flex flex-col gap-6">
            {/* Primary Verified Account Banner */}
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50/90 to-emerald-100/40 p-4.5 sm:flex-row sm:items-center dark:border-emerald-500/30 dark:from-emerald-950/30 dark:to-emerald-900/10">
              <div className="flex items-center gap-3.5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm dark:bg-emerald-500">
                  <Building2 className="size-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {institutionName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                    <span>{accountName}</span>
                    <span>•</span>
                    <span className="font-mono font-bold">•••• {accountMask}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300/80 bg-white/90 px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-2xs dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <Lock className="size-3.5 text-emerald-600" />
                  ACH & Direct Deposit Ready
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-100/60 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  Plaid Link Authorized
                </span>
              </div>
            </div>

            {/* Account Details 4-Column Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Banking Institution
                </span>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {institutionName}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Account Name
                </span>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {accountName}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Masked Account
                </span>
                <p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white">
                  •••• {accountMask}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Account Classification
                </span>
                <p className="mt-1 text-sm font-bold text-slate-900 capitalize dark:text-white">
                  {accountType} / {accountSubtype}
                </p>
              </div>
            </div>

            {/* Technical Metadata & Verification Timestamp */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-900/30">
              <div className="flex items-center gap-2">
                <CreditCard className="size-3.5 text-slate-400" />
                <span className="text-slate-500">Plaid Item ID:</span>
                {itemId ? (
                  <button
                    type="button"
                    onClick={() => handleCopyItemId(itemId)}
                    className="inline-flex items-center gap-1 rounded bg-slate-200/70 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-800 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200"
                    title="Click to copy Plaid Item ID"
                  >
                    <span>{itemId}</span>
                    {copiedId ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3 text-slate-400" />
                    )}
                  </button>
                ) : (
                  <span className="font-mono text-slate-400">N/A</span>
                )}
              </div>

              {verifiedDate && (
                <div className="text-slate-500">
                  Verified on:{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {format(new Date(verifiedDate), "MMM dd, yyyy, hh:mm a")}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Landmark className="size-6" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
              No Bank Account Verified
            </h4>
            <p className="mx-auto mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
              The applicant has not connected a verified commercial bank account via Plaid yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
