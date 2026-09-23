"use client";

import { useProfile } from "@/components/providers/profile-provider";
import { PlaidBankStep } from "@/feature/public/partner-lead/components/plaid-bank-step";
import { BankVerificationCard } from "@/feature/private/partner-leads/components/cards/bank-verification-card";
import { isBankStatusVerified, resolvePartnerBankStatus } from "@/lib/bank-verification-gate";
import { Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Plaid connect UI only — the sticky top banner already shows the
 * "complete bank verification" message (one message rule).
 */
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
    <Card className="col-span-1 overflow-hidden rounded-2xl border-slate-200/80 shadow-xs md:col-span-2 dark:border-slate-800">
      <CardHeader className="border-b border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Landmark className="size-4.5" />
          </div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
            Bank Account
          </CardTitle>
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
