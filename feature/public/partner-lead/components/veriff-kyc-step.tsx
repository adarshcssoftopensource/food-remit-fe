"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { successToast } from "@/components/toaster";
import { useGetKycConfig } from "../hooks/use-get-kyc-config";
import { useCreateKycSession } from "../hooks/use-create-kyc-session";
import { fetchKycStatus } from "../hooks/use-get-kyc-status";
import { VeriffApplicant } from "../types/kyc.types";
import {
  KycVerifiedBanner,
  KycDeclinedBanner,
  KycFeatureBadges,
  KycAwaitingApprovalCard,
} from "./kyc-status-cards";

interface VeriffKycStepProps {
  applicant: VeriffApplicant;
  sessionId?: string;
  currentKycStatus?: string;
  onSessionUpdated: (sessionId: string, status: string) => void;
  onContinue: () => void;
}

export function VeriffKycStep({
  applicant,
  sessionId: initialSessionId,
  currentKycStatus = "NOT_STARTED",
  onSessionUpdated,
}: VeriffKycStepProps) {
  const [createdSessionId, setCreatedSessionId] = useState<string | undefined>(undefined);
  const [localKycStatus, setLocalKycStatus] = useState<string | undefined>(undefined);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [_isCheckingStatus, setIsCheckingStatus] = useState(false);

  const sessionId = createdSessionId || initialSessionId;
  const kycStatus = localKycStatus || currentKycStatus || "NOT_STARTED";

  // Custom API hooks
  useGetKycConfig();
  const createKycSessionMutation = useCreateKycSession();

  const checkStatus = useCallback(
    async (showToast = true, targetId?: string) => {
      const idToUse = targetId || sessionId;
      if (!idToUse) return;
      try {
        setIsCheckingStatus(true);
        const res = await fetchKycStatus(idToUse, !showToast);
        const remoteStatus = (res.data?.status || "").toUpperCase();
        if (remoteStatus) {
          setLocalKycStatus(remoteStatus);
          onSessionUpdated(idToUse, remoteStatus);
          if (remoteStatus === "APPROVED" && showToast) {
            successToast({
              title: "Identity Verified!",
              description: "Your Veriff verification has been approved successfully.",
            });
          }
        }
      } catch {
        // Ignore transient polling errors
      } finally {
        setIsCheckingStatus(false);
      }
    },
    [sessionId, onSessionUpdated],
  );

  // Check status on mount if session exists and not yet approved
  useEffect(() => {
    const activeId = initialSessionId || sessionId;
    if (!activeId || kycStatus === "APPROVED" || kycStatus === "approved") {
      return;
    }

    const timer = setTimeout(() => {
      void checkStatus(false, activeId);
    }, 100);

    return () => clearTimeout(timer);
  }, [initialSessionId, sessionId, kycStatus, checkStatus]);

  // Poll status periodically (every 3s) while verification is in progress
  useEffect(() => {
    if (!sessionId || kycStatus === "APPROVED" || kycStatus === "approved") {
      return;
    }

    const interval = setInterval(() => {
      checkStatus(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId, kycStatus, checkStatus]);

  async function handleStartVerification() {
    try {
      const payload = {
        firstName: applicant.firstName || "Applicant",
        lastName: applicant.lastName || "Lead",
        email: applicant.email,
        phoneNumber: applicant.phoneNumber,
        country: applicant.country,
      };

      const res = await createKycSessionMutation.mutateAsync(payload);
      const data = res.data;

      if (!data?.sessionId) {
        return;
      }

      const newSessionId = data.sessionId;
      const sessionUrl = data.verificationUrl;

      setCreatedSessionId(newSessionId);
      setVerificationUrl(sessionUrl);
      setLocalKycStatus("STARTED");
      onSessionUpdated(newSessionId, "STARTED");

      // Dynamically import Veriff in-context SDK to render Veriff's official verification modal
      const veriffModule = await import("@veriff/incontext-sdk");
      const { createVeriffFrame, MESSAGES } = veriffModule;

      if (createVeriffFrame && sessionUrl) {
        createVeriffFrame({
          url: sessionUrl,
          onEvent: (msg: string) => {
            if (msg === MESSAGES.STARTED) {
              setLocalKycStatus("IN_PROGRESS");
              onSessionUpdated(newSessionId, "IN_PROGRESS");
            } else if (msg === MESSAGES.SUBMITTED || msg === MESSAGES.FINISHED) {
              setLocalKycStatus("SUBMITTED");
              onSessionUpdated(newSessionId, "SUBMITTED");
              checkStatus(true);
            }
          },
        });
      }
    } catch {
      // Backend error toast is automatically displayed by global axios response interceptor
    }
  }

  const normalizedStatus = (kycStatus || "").toUpperCase();
  const isVerified = normalizedStatus === "APPROVED";
  const isDeclined = [
    "DECLINED",
    "FAILED",
    "RESUBMISSION_REQUESTED",
    "EXPIRED",
    "ABANDONED",
  ].includes(normalizedStatus);
  const isAwaitingApproval =
    !isVerified && !isDeclined && Boolean(sessionId) && normalizedStatus !== "NOT_STARTED";

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Step 4: Identity Verification (KYC)
          </h2>
          <p className="text-xs text-slate-500">
            Powered by Veriff — upload your official ID and selfie for automated biometric
            verification
          </p>
        </div>
      </div>

      {isVerified && <KycVerifiedBanner />}
      {isDeclined && (
        <KycDeclinedBanner
          onRetry={handleStartVerification}
          isRetrying={createKycSessionMutation.isPending}
          verificationUrl={verificationUrl}
        />
      )}

      {/* Awaiting Approval / In-Review Card (Only if not verified and not declined) */}
      {isAwaitingApproval && (
        <KycAwaitingApprovalCard
          applicantName={`${applicant.firstName || "Applicant"} ${applicant.lastName || ""}`}
        />
      )}

      {/* Primary Verification Action Card (Show if not verified and not already waiting) */}
      {!isVerified && !isAwaitingApproval && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase">
                  Official Veriff Integration
                </span>
                <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                  {isDeclined ? "Retry Verification: " : "Verify "}
                  {applicant.firstName} {applicant.lastName}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                <Lock className="size-3" />
                256-bit Encrypted
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-600">
              {isDeclined
                ? "Please ensure you have a clear, valid government ID ready (Passport, Driver's License, or Identity Card) with no glare or blur. Veriff will re-open the official camera interface."
                : "When you click the button below, Veriff will open its official document upload interface. You will be prompted to choose your government ID (Passport, Driver's License, or Identity Card), capture the front & back using your camera, and take a quick selfie."}
            </p>

            <KycFeatureBadges />

            {/* Launch Veriff Button */}
            <div className="mt-2 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <Button
                type="button"
                onClick={handleStartVerification}
                isLoading={createKycSessionMutation.isPending}
                className="h-12 w-full rounded-xl bg-emerald-700 px-6 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-800 sm:w-auto"
              >
                <ShieldCheck className="mr-2 size-4.5" />
                {isDeclined
                  ? "Re-upload & Start Verification Again"
                  : "Start Identity Verification with Veriff"}
              </Button>

              {/* {verificationUrl && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open(verificationUrl, "_blank")}
                  className="h-12 w-full rounded-xl border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
                >
                  <ExternalLink className="mr-1.5 size-4" />
                  Direct Veriff Link
                </Button>
              )} */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
