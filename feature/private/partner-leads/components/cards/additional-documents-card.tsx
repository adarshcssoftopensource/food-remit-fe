"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  FileImage,
  ExternalLink,
  Eye,
  X,
  FolderArchive,
  Download,
  ShieldCheck,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PartnerLeadData } from "../../types/partner-lead.types";

interface AdditionalDocumentsCardProps {
  lead: PartnerLeadData;
}

interface ActivePreview {
  url: string;
  name: string;
  isPdf: boolean;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return "File";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function AdditionalDocumentsCard({ lead }: AdditionalDocumentsCardProps) {
  const [activePreview, setActivePreview] = useState<ActivePreview | null>(null);

  const docs = lead.additionalDocuments || [];
  const hasDocs = docs.length > 0;

  return (
    <>
      <Card className="col-span-1 overflow-hidden rounded-2xl border-slate-200/80 shadow-xs md:col-span-2 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <FolderArchive className="size-4.5" />
              </div>
              Supporting Business Documents
            </CardTitle>

            <div className="flex items-center gap-2">
              {hasDocs ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  {docs.length} Document{docs.length > 1 ? "s" : ""} Stored
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
                  <Clock className="size-3.5 text-amber-600" />
                  No Documents Attached
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {!hasDocs ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <FileText className="size-6" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                No Supporting Documents Uploaded
              </h4>
              <p className="mx-auto mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
                This lead does not have any additional business registration or banking documents.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                  AWS S3 Encrypted Attachments
                </span>
                <span className="text-[11px] text-slate-400">Verified commercial documents</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {docs.map((doc, idx) => {
                  const isPdf =
                    doc.mimeType?.includes("pdf") ||
                    doc.name?.toLowerCase().endsWith(".pdf") ||
                    doc.url.toLowerCase().includes(".pdf");
                  const docName = doc.name || `Supporting Document #${idx + 1}`;

                  return (
                    <div
                      key={doc.url || idx}
                      className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all hover:border-emerald-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                            isPdf
                              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                              : "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                          }`}
                        >
                          {isPdf ? (
                            <FileText className="size-5" />
                          ) : (
                            <FileImage className="size-5" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
                            title={docName}
                          >
                            {docName}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                            <span className="font-medium text-slate-600 dark:text-slate-300">
                              {formatBytes(doc.size)}
                            </span>
                            <span>•</span>
                            <span className="text-[10px] font-semibold uppercase">
                              {isPdf ? "PDF" : "IMAGE"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setActivePreview({ url: doc.url, name: docName, isPdf })}
                          className="h-8 rounded-lg text-xs font-bold"
                        >
                          <Eye className="mr-1 size-3.5" />
                          Preview
                        </Button>

                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={docName}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                          title="Open original link in S3"
                        >
                          <span>Open</span>
                          <ExternalLink className="size-3 text-slate-400" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactive Modal Preview */}
      {activePreview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="min-w-0 pr-4">
                <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                  {activePreview.name}
                </h3>
                <span className="text-[11px] text-slate-400">Secure S3 Storage Attachment</span>
              </div>
              <button
                type="button"
                onClick={() => setActivePreview(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-xl bg-slate-50 p-2 dark:bg-slate-950/50">
              {activePreview.isPdf ? (
                <iframe
                  src={activePreview.url}
                  title={activePreview.name}
                  className="h-[65vh] w-full rounded-lg border border-slate-200 bg-white dark:border-slate-800"
                />
              ) : (
                <div className="flex max-h-[65vh] items-center justify-center overflow-auto">
                  <Image
                    src={activePreview.url}
                    alt={activePreview.name}
                    height={700}
                    width={900}
                    className="h-auto max-w-full rounded-lg object-contain shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <a
                href={activePreview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                <Download className="size-3.5" />
                Download Original S3 File
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
