"use client";

import { useProfile } from "@/components/providers/profile-provider";
import { PlaidBankStep } from "@/feature/public/partner-lead/components/plaid-bank-step";
import { BankVerificationCard } from "@/feature/private/partner-leads/components/cards/bank-verification-card";
import { isBankStatusVerified, resolvePartnerBankStatus } from "@/lib/bank-verification-gate";
import { Landmark } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileBankVerification() {
  const { profile, needsBankVerification, refetchProfile } = useProfile();
  const partnerLead = profile?.partnerLead;
  const bankStatus = resolvePartnerBankStatus(partnerLead);

  if (!partnerLead) return null;

  if (isBankStatusVerified(bankStatus) && !needsBankVerification) {
    return <BankVerificationCard lead={partnerLead} />;
  }

  const bankData = partnerLead.bankData || partnerLead.bankVerifications?.[0] || {};

  return (
    <Card className="col-span-1 overflow-hidden rounded-2xl border-amber-200/80 shadow-xs md:col-span-2 dark:border-amber-500/20">
      <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50/60 px-6 py-4 dark:border-amber-500/20 dark:from-amber-950/40 dark:to-orange-950/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
              <Landmark className="size-4.5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Complete Bank Account Verification
              </CardTitle>
              <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                Required before you can create, edit, or delete store content
              </CardDescription>
            </div>
          </div>
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[11px] font-bold text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/50 dark:text-amber-300">
            Action Required
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        <PlaidBankStep
          applicant={{
            firstName: profile?.firstName || partnerLead.firstName || "Partner",
            lastName: profile?.lastName || partnerLead.lastName || "Manager",
            email: profile?.email || partnerLead.businessEmail,
            phoneNumber: profile?.phoneNumber || partnerLead.phoneNumber,
            country: partnerLead.country,
          }}
          currentBankStatus={bankStatus === "SKIPPED" ? "NOT_STARTED" : bankStatus}
          institutionName={bankData.institutionName}
          accountName={bankData.accountName}
          accountMask={bankData.accountMask}
          partnerLeadId={partnerLead.id}
          allowSkip={false}
          onBankUpdated={() => {
            refetchProfile();
          }}
          onContinue={() => {
            refetchProfile();
          }}
        />
      </CardContent>
    </Card>
  );
}
