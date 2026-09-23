"use client";

import React, { useEffect, useState } from "react";
import { Landmark, Lock, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { successToast } from "@/components/toaster";
import { useCreatePlaidLinkToken } from "../hooks/use-create-plaid-link-token";
import { useExchangePlaidToken } from "../hooks/use-exchange-plaid-token";
import { useGetPlaidConfig } from "../hooks/use-get-plaid-config";
import { PlaidApplicant, VerifiedBankInfo } from "../types/plaid.types";
import { VerifiedBankCard, PlaidFeaturesGrid } from "./plaid-bank-cards";

declare global {
  interface Window {
    Plaid?: {
      create: (config: {
        token: string;
        onSuccess: (
          public_token: string,
          metadata: {
            accounts?: { id?: string; name?: string; mask?: string }[];
            institution?: { institution_id?: string; name?: string };
          },
        ) => void;
        onExit?: (err: unknown, metadata: Record<string, unknown>) => void;
        onEvent?: (eventName: string, metadata: Record<string, unknown>) => void;
      }) => {
        open: () => void;
        exit: () => void;
        destroy: () => void;
      };
    };
  }
}

interface PlaidBankStepProps {
  applicant: PlaidApplicant;
  initialItemId?: string;
  currentBankStatus?: string;
  institutionName?: string;
  accountName?: string;
  accountMask?: string;
  partnerLeadId?: string;
  allowSkip?: boolean;
  onBankUpdated: (data: {
    plaidItemId: string;
    plaidAccountId?: string;
    bankStatus: string;
    bankInstitutionName: string;
    bankAccountName: string;
    bankAccountMask: string;
  }) => void;
  onContinue: () => void;
  onSkip?: () => void;
}

export function PlaidBankStep({
  applicant,
  initialItemId,
  currentBankStatus = "NOT_STARTED",
  institutionName: initialInstitutionName,
  accountName: initialAccountName,
  accountMask: initialAccountMask,
  partnerLeadId,
  allowSkip = false,
  onBankUpdated,
  onSkip,
}: PlaidBankStepProps) {
  const [isOpeningPlaid, setIsOpeningPlaid] = useState(false);
  const [userResetBank, setUserResetBank] = useState(false);
  const [customBankInfo, setCustomBankInfo] = useState<VerifiedBankInfo | null>(null);

  const bankStatus = userResetBank
    ? "NOT_STARTED"
    : customBankInfo?.itemId
      ? "VERIFIED"
      : currentBankStatus || "NOT_STARTED";

  const verifiedBank: VerifiedBankInfo = customBankInfo || {
    itemId: initialItemId,
    institutionName: initialInstitutionName,
    accountName: initialAccountName,
    accountMask: initialAccountMask,
  };

  useGetPlaidConfig();
  const createLinkTokenMutation = useCreatePlaidLinkToken();
  const exchangeTokenMutation = useExchangePlaidToken();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!document.getElementById("plaid-link-script")) {
      const script = document.createElement("script");
      script.id = "plaid-link-script";
      script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  async function ensurePlaidScript(): Promise<void> {
    if (typeof window !== "undefined" && window.Plaid) {
      return;
    }

    return new Promise((resolve, reject) => {
      let script = document.getElementById("plaid-link-script") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "plaid-link-script";
        script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
        script.async = true;
        document.head.appendChild(script);
      }

      const timeout = setTimeout(() => {
        reject(
          new Error("Plaid SDK took too long to load. Please check your internet connection."),
        );
      }, 10000);

      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      script.onerror = () => {
        clearTimeout(timeout);
        reject(new Error("Failed to load Plaid SDK script."));
      };
    });
  }

  async function handleOpenPlaid() {
    try {
      setIsOpeningPlaid(true);

      await ensurePlaidScript();

      const res = await createLinkTokenMutation.mutateAsync({
        firstName: applicant.firstName || "Partner",
        lastName: applicant.lastName || "Applicant",
        email: applicant.email || "partner@foodremit.com",
        phoneNumber: applicant.phoneNumber,
        countryCode: "US",
      });

      const token = res.linkToken;
      if (!token) {
        return;
      }

      if (!window.Plaid) {
        return;
      }

      const handler = window.Plaid.create({
        token,
        onSuccess: async (
          publicToken: string,
          metadata: {
            accounts?: { id?: string; name?: string; mask?: string }[];
            institution?: { institution_id?: string; name?: string };
          },
        ) => {
          try {
            const primaryAccount = metadata.accounts?.[0];
            const institution = metadata.institution;

            const exchangeRes = await exchangeTokenMutation.mutateAsync({
              publicToken,
              institutionId: institution?.institution_id || "ins_default",
              institutionName: institution?.name || "Verified Bank",
              accounts: metadata.accounts,
              ...(partnerLeadId ? { partnerLeadId } : {}),
            });

            const bankData = exchangeRes.data;
            const verifiedInfo = {
              plaidItemId: bankData?.itemId || `item_${Date.now()}`,
              plaidAccountId: primaryAccount?.id || bankData?.accountMask,
              bankStatus: "VERIFIED",
              bankInstitutionName:
                bankData?.institutionName || institution?.name || "Verified Bank",
              bankAccountName: bankData?.accountName || primaryAccount?.name || "Business Checking",
              bankAccountMask: bankData?.accountMask || primaryAccount?.mask || "0000",
            };

            setUserResetBank(false);
            setCustomBankInfo({
              itemId: verifiedInfo.plaidItemId,
              institutionName: verifiedInfo.bankInstitutionName,
              accountName: verifiedInfo.bankAccountName,
              accountMask: verifiedInfo.bankAccountMask,
            });

            onBankUpdated(verifiedInfo);

            successToast({
              title: "Bank Account Verified!",
              description: `${verifiedInfo.bankInstitutionName} (•••• ${verifiedInfo.bankAccountMask}) verified successfully with Plaid.`,
            });
          } catch {
            // Global axios interceptor automatically displays backend error toast
          }
        },
        onExit: () => {
          // Modal closed
        },
      });

      handler.open();
    } catch {
      // Global axios interceptor automatically displays backend error toast
    } finally {
      setIsOpeningPlaid(false);
    }
  }

  const isVerified = bankStatus === "VERIFIED" || bankStatus === "verified";
  const isSkipped = (bankStatus || "").toUpperCase() === "SKIPPED";
  const isBusy =
    isOpeningPlaid || createLinkTokenMutation.isPending || exchangeTokenMutation.isPending;

  function handleSkip() {
    onBankUpdated({
      plaidItemId: "",
      plaidAccountId: "",
      bankStatus: "SKIPPED",
      bankInstitutionName: "",
      bankAccountName: "",
      bankAccountMask: "",
    });
    successToast({
      title: "Bank Verification Skipped",
      description:
        "You can complete bank account verification later from your profile after approval.",
    });
    onSkip?.();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Landmark className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Step 5: Bank Account Verification</h2>
          <p className="text-xs text-slate-500">
            Powered by Plaid — connect your commercial bank account for payout and settlement
            processing
          </p>
        </div>
      </div>

      {isVerified ? (
        <VerifiedBankCard
          verifiedBank={verifiedBank}
          onChangeBank={() => {
            setUserResetBank(true);
            setCustomBankInfo(null);
          }}
        />
      ) : isSkipped ? (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-amber-700 uppercase">
                Skipped for now
              </span>
              <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                Bank verification pending
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                You skipped bank account verification. After your application is approved, you must
                complete verification from your profile before creating or editing store content.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setUserResetBank(true);
                onBankUpdated({
                  plaidItemId: "",
                  plaidAccountId: "",
                  bankStatus: "NOT_STARTED",
                  bankInstitutionName: "",
                  bankAccountName: "",
                  bankAccountMask: "",
                });
              }}
              className="h-10 shrink-0 rounded-xl border-amber-300 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              Connect Bank Instead
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase">
                  Official Plaid Link Integration
                </span>
                <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                  Connect Commercial Bank Account
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                <Lock className="size-3" />
                256-Bit Encrypted
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-600">
              Food Remit uses <strong>Plaid</strong> to instantly and securely verify your bank
              account details. We never store your banking passwords or credentials.
            </p>

            <PlaidFeaturesGrid />

            <div className="flex flex-col gap-2.5 pt-2">
              <Button
                type="button"
                onClick={handleOpenPlaid}
                disabled={isBusy}
                isLoading={isBusy}
                className="h-12 w-full rounded-xl bg-emerald-700 px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-800"
              >
                <Landmark className="mr-2 size-4.5" />
                Connect Bank Account with Plaid
              </Button>

              {allowSkip && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={isBusy}
                  className="h-11 w-full rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  <SkipForward className="mr-2 size-4" />
                  Skip for now — verify later
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
