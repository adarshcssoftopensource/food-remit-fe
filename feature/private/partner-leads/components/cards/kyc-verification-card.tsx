"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  FileText,
  Copy,
  Check,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { PartnerLeadData } from "../../types/partner-lead.types";
import Image from "next/image";

function getDocTitle(m: { name?: string; type: string }, i: number) {
  const k = (m.name || m.type || "").toLowerCase();
  if (k.includes("face") || k.includes("portrait") || k.includes("selfie"))
    return "Selfie / Face Photo";
  if (k.includes("front")) return "ID Document (Front)";
  if (k.includes("back")) return "ID Document (Back)";
  return m.name || `Document #${i + 1}`;
}

export function KycVerificationCard({ lead }: { lead: PartnerLeadData }) {
  const [copiedSession, setCopiedSession] = useState(false);

  const kyc = lead.kycVerifications?.[0] || lead.kycData;
  const kycStatus = (lead.kycStatus || kyc?.status || "NOT_STARTED").toUpperCase();
  const sessionId = lead.veriffSessionId || kyc?.veriffSessionId;

  const person = kyc?.person;
  const document = kyc?.document;

  const mediaUrls = useMemo(() => {
    const raw = kyc?.mediaUrls;
    if (!Array.isArray(raw)) return [];
    return raw.filter((item) => {
      const id = (item.name || item.type || "").toLowerCase();
      if (id.endsWith("-pre")) {
        const base = id.replace(/-pre$/, "");
        return !raw.some((o) => (o.name || o.type || "").toLowerCase() === base);
      }
      return true;
    });
  }, [kyc?.mediaUrls]);

  const verifiedDate = lead.kycVerifiedAt || kyc?.createdAt;
  const decisionCode = kyc?.decisionCode;

  const isApproved = kycStatus === "APPROVED";
  const isSubmitted =
    kycStatus === "SUBMITTED" || kycStatus === "IN_PROGRESS" || kycStatus === "STARTED";
  const isDeclined = kycStatus === "DECLINED";

  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedSession(true);
    setTimeout(() => setCopiedSession(false), 2000);
  };

  return (
    <>
      <Card className="col-span-1 overflow-hidden rounded-2xl border-slate-200/80 shadow-xs md:col-span-2 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <ShieldCheck className="size-4.5" />
              </div>
              Identity Verification (Veriff KYC)
            </CardTitle>

            <div className="flex items-center gap-2">
              {isApproved && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  KYC Verified
                </span>
              )}
              {isSubmitted && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
                  <Clock className="size-3.5 text-amber-600" />
                  {kycStatus === "SUBMITTED" ? "Under Review" : "In Progress"}
                </span>
              )}
              {isDeclined && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400">
                  <AlertCircle className="size-3.5 text-rose-600" />
                  Declined
                </span>
              )}
              {!isApproved && !isSubmitted && !isDeclined && (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  Not Started
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {!sessionId && !person && !document && mediaUrls.length === 0 ? (
            <div className="py-8 text-center">
              <ShieldCheck className="mx-auto mb-2 size-10 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No KYC Verification Record
              </p>
              <p className="text-xs text-slate-500">
                The applicant has not completed a Veriff identity verification session yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Reference and Provider Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-900/40">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    Provider
                  </span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Veriff Automated Identity Verification
                  </div>
                </div>
                {sessionId && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      Session:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(sessionId)}
                      className="inline-flex items-center gap-1 rounded bg-slate-200/70 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200"
                      title="Click to copy Session ID"
                    >
                      <span>{sessionId}</span>
                      {copiedSession ? (
                        <Check className="size-3 text-emerald-600" />
                      ) : (
                        <Copy className="size-3 text-slate-400" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Person & Document Grids */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Person details */}
                <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold text-slate-800 uppercase dark:border-slate-800 dark:text-slate-200">
                    <User className="size-3.5 text-emerald-600" />
                    Verified Personal Data
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="text-slate-400">Full Name</dt>
                      <dd className="font-semibold text-slate-900 dark:text-white">
                        {person?.firstName || lead.firstName} {person?.lastName || lead.lastName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Date of Birth</dt>
                      <dd className="font-semibold text-slate-900 dark:text-white">
                        {person?.dateOfBirth || "N/A"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">ID / National Number</dt>
                      <dd className="font-mono font-semibold text-slate-900 dark:text-white">
                        {person?.idNumber || "N/A"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Nationality / Country</dt>
                      <dd className="font-semibold text-slate-900 dark:text-white">
                        {person?.nationality || person?.country || lead.country || "N/A"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Document details */}
                <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold text-slate-800 uppercase dark:border-slate-800 dark:text-slate-200">
                    <FileText className="size-3.5 text-emerald-600" />
                    Document Credentials
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="text-slate-400">Document Type</dt>
                      <dd className="font-semibold text-slate-900 capitalize dark:text-white">
                        {document?.type
                          ? String(document.type).replace(/_/g, " ")
                          : "Government ID"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Document Number</dt>
                      <dd className="font-mono font-semibold text-slate-900 dark:text-white">
                        {document?.number || "N/A"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Issuing Country</dt>
                      <dd className="font-semibold text-slate-900 dark:text-white">
                        {document?.country || "N/A"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Valid Until</dt>
                      <dd className="font-semibold text-slate-900 dark:text-white">
                        {document?.validUntil || "N/A"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Decision & Verification Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {decisionCode && (
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Decision Code: {decisionCode}
                    </span>
                  )}
                  {verifiedDate && (
                    <span>Verified: {format(new Date(verifiedDate), "MMM dd, yyyy, hh:mm a")}</span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Biometrics & Liveness Checked
                </span>
              </div>

              {/* S3 Captured Documents Gallery */}
              {mediaUrls.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                      Archived Credentials (S3 Encrypted Storage)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {mediaUrls.length} files securely stored
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {mediaUrls.map((media, idx) => {
                      const label = getDocTitle(media, idx);

                      return (
                        <div
                          key={media.s3Url || idx}
                          className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs transition-all hover:border-emerald-400 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
                        >
                          <a
                            href={media.s3Url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative flex w-full shrink-0 items-center justify-center overflow-hidden bg-slate-950"
                            style={{ height: 180, minHeight: 180 }}
                          >
                            <Image
                              src={media.s3Url}
                              alt={label}
                              fill
                              unoptimized
                              className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                              <span className="inline-flex h-7 items-center justify-center gap-1 rounded-md bg-white/95 px-2.5 text-xs font-semibold text-slate-800 shadow-sm">
                                <ExternalLink className="size-3" />
                                View Full
                              </span>
                            </div>
                          </a>
                          <div className="p-2.5">
                            <div
                              className="truncate text-xs font-bold text-slate-800 dark:text-slate-200"
                              title={label}
                            >
                              {label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
