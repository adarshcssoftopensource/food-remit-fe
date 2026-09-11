"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Eye,
  FileText,
  User,
  X,
} from "lucide-react";
import { PartnerLeadData } from "../../types/partner-lead.types";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function KycVerificationCard({ lead }: { lead: PartnerLeadData }) {
  const [activeImage, setActiveImage] = useState<{ title: string; url: string } | null>(null);

  const kyc = lead.kycVerifications?.[0] || lead.kycData;
  const kycStatus = (lead.kycStatus || kyc?.status || "NOT_STARTED").toUpperCase();
  const sessionId = lead.veriffSessionId || kyc?.veriffSessionId;

  const person = kyc?.person;
  const document = kyc?.document;
  const mediaUrls: Array<{ type: string; name?: string; s3Url: string }> = kyc?.mediaUrls || [];

  const isApproved = kycStatus === "APPROVED";
  const isSubmitted =
    kycStatus === "SUBMITTED" || kycStatus === "IN_PROGRESS" || kycStatus === "STARTED";
  const isDeclined = kycStatus === "DECLINED";

  return (
    <>
      <Card className="col-span-1 overflow-hidden rounded-2xl border-slate-200 shadow-sm md:col-span-2">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Identity Verification (KYC)
            </CardTitle>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              {isApproved && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  KYC Verified
                </span>
              )}
              {isSubmitted && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                  <Clock className="size-3.5 text-amber-600" />
                  {kycStatus === "SUBMITTED" ? "Under Review" : "In Progress"}
                </span>
              )}
              {isDeclined && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800">
                  <AlertCircle className="size-3.5 text-rose-600" />
                  Declined
                </span>
              )}
              {!isApproved && !isSubmitted && !isDeclined && (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Not Started
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {!sessionId && !person && !document && mediaUrls.length === 0 ? (
            <div className="py-6 text-center">
              <ShieldCheck className="mx-auto mb-2 size-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No KYC Verification Record</p>
              <p className="text-xs text-slate-500">
                The applicant did not complete a Veriff identity verification session.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Reference and Provider Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Provider</span>
                  <div className="font-semibold text-slate-800">
                    Veriff Automated Identity Verification
                  </div>
                </div>
                {sessionId && (
                  <div className="space-y-0.5 sm:text-right">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      Session Reference
                    </span>
                    <div className="font-mono font-semibold text-slate-900">{sessionId}</div>
                  </div>
                )}
              </div>

              {/* Person & Document Grids */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Person details */}
                <div className="rounded-xl border border-slate-100 p-4">
                  <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold text-slate-800 uppercase">
                    <User className="size-3.5 text-emerald-600" />
                    Verified Personal Data
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="text-slate-400">Full Name</dt>
                      <dd className="font-semibold text-slate-900">
                        {person?.firstName || lead.firstName} {person?.lastName || lead.lastName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Date of Birth</dt>
                      <dd className="font-semibold text-slate-900">
                        {person?.dateOfBirth || "N/A"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">ID / National Number</dt>
                      <dd className="font-mono font-semibold text-slate-900">
                        {person?.idNumber || "N/A"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Nationality / Country</dt>
                      <dd className="font-semibold text-slate-900">
                        {person?.nationality || person?.country || lead.country || "N/A"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Document details */}
                <div className="rounded-xl border border-slate-100 p-4">
                  <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold text-slate-800 uppercase">
                    <FileText className="size-3.5 text-emerald-600" />
                    Document Credentials
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="text-slate-400">Document Type</dt>
                      <dd className="font-semibold text-slate-900">
                        {document?.type
                          ? String(document.type).replace(/_/g, " ")
                          : "Government ID"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Document Number</dt>
                      <dd className="font-mono font-semibold text-slate-900">
                        {document?.number || "N/A"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Issuing Country</dt>
                      <dd className="font-semibold text-slate-900">{document?.country || "N/A"}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Valid Until</dt>
                      <dd className="font-semibold text-slate-900">
                        {document?.validUntil || "N/A"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* S3 Captured Documents Gallery */}
              {mediaUrls.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider text-slate-600 uppercase">
                      Archived Credentials (S3 Encrypted Storage)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {mediaUrls.length} file{mediaUrls.length > 1 ? "s" : ""} securely stored
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {mediaUrls.map((media, idx) => {
                      const label =
                        media.name ||
                        (media.type === "id_front"
                          ? "Front of ID"
                          : media.type === "id_back"
                            ? "Back of ID"
                            : media.type === "portrait"
                              ? "Selfie Liveness"
                              : `Document #${idx + 1}`);

                      return (
                        <div
                          key={media.s3Url || idx}
                          className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all hover:border-emerald-300 hover:shadow-md"
                        >
                          <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-900">
                            <Image
                              src={media.s3Url}
                              alt={label}
                              height={40}
                              width={40}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => setActiveImage({ title: label, url: media.s3Url })}
                                className="h-8 rounded-lg bg-white/90 text-xs font-bold text-slate-800 hover:bg-white"
                              >
                                <Eye className="mr-1 size-3.5" />
                                Preview
                              </Button>
                              <a
                                href={media.s3Url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 items-center justify-center rounded-lg bg-white/90 px-2.5 text-xs font-bold text-slate-800 hover:bg-white"
                              >
                                <ExternalLink className="size-3.5" />
                              </a>
                            </div>
                          </div>
                          <div className="p-2.5">
                            <div className="text-xs font-bold text-slate-800">{label}</div>
                            <div className="truncate font-mono text-[10px] text-slate-400">
                              {media.s3Url}
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

      {/* Full-Screen Preview Modal */}
      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">{activeImage.title}</h3>
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto">
              <Image
                src={activeImage.url}
                alt={activeImage.title}
                height={40}
                width={40}
                className="h-auto max-w-full rounded-lg object-contain"
              />
            </div>
            <div className="mt-3 flex justify-end">
              <a
                href={activeImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                <ExternalLink className="size-3.5" />
                Open Original in S3
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
