"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Landmark,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  CreditCard,
  Lock,
} from "lucide-react";
import { PartnerLeadData } from "../../types/partner-lead.types";

export function BankVerificationCard({ lead }: { lead: PartnerLeadData }) {
  const bank = lead.bankData || {};
  const bankStatus = (lead.bankStatus || bank.status || "NOT_STARTED").toUpperCase();
  const isVerified = bankStatus === "VERIFIED";
  const itemId = lead.plaidItemId || bank.itemId;

  const institutionName = bank.institutionName || "Commercial Bank";
  const accountName = bank.accountName || "Business Checking";
  const accountMask = bank.accountMask || "0000";
  const accountType = bank.accountType || "depository";
  const accountSubtype = bank.accountSubtype || "checking";

  return (
    <Card className="col-span-1 overflow-hidden rounded-2xl border-slate-200 shadow-sm md:col-span-2">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Landmark className="h-5 w-5 text-emerald-600" />
            Bank Account Verification (Plaid)
          </CardTitle>

          <div className="flex items-center gap-2">
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                Verified with Plaid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
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
            {/* Primary Verified Account Box */}
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
                  <Building2 className="size-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950 sm:text-base">
                    {institutionName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <span>{accountName}</span>
                    <span>•</span>
                    <span className="font-mono font-bold">•••• {accountMask}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-2.5 py-1 text-xs font-bold text-emerald-900">
                  <Lock className="size-3 text-emerald-700" />
                  ACH / Direct Deposit Ready
                </span>
              </div>
            </div>

            {/* Account Details Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <span className="text-[11px] font-medium text-slate-500">Institution</span>
                <p className="mt-0.5 text-xs font-bold text-slate-800">{institutionName}</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <span className="text-[11px] font-medium text-slate-500">Account Name</span>
                <p className="mt-0.5 text-xs font-bold text-slate-800">{accountName}</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <span className="text-[11px] font-medium text-slate-500">Account Mask</span>
                <p className="mt-0.5 font-mono text-xs font-bold text-slate-800">
                  •••• {accountMask}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <span className="text-[11px] font-medium text-slate-500">Type / Subtype</span>
                <p className="mt-0.5 text-xs font-bold text-slate-800 capitalize">
                  {accountType} / {accountSubtype}
                </p>
              </div>
            </div>

            {/* Technical Metadata */}
            {itemId && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span>Plaid Item ID:</span>
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-700">
                    {itemId}
                  </code>
                </div>
                {lead.bankVerifiedAt && (
                  <div>
                    Verified:{" "}
                    <span className="font-semibold text-slate-700">
                      {new Date(lead.bankVerifiedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Landmark className="size-5" />
            </div>
            <h4 className="mt-2 text-xs font-bold text-slate-700">No Bank Account Verified</h4>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
              The applicant has not yet connected a verified commercial bank account via Plaid.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
