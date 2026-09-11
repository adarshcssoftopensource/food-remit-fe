"use client";

import React, { useRef, useState } from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  ExternalLink,
  FileImage,
  AlertCircle,
  Loader2,
  Shield,
} from "lucide-react";
import { errorToast, successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";

export interface UploadedDoc {
  rawFile?: File;
  file?: string;
  url?: string;
  name: string;
  size: number;
  mimeType: string;
}

interface AdditionalDocumentsSectionProps {
  documents: UploadedDoc[];
  onChange: (docs: UploadedDoc[]) => void;
  error?: string;
}

const MAX_DOCS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function AdditionalDocumentsSection({
  documents,
  onChange,
  error,
}: AdditionalDocumentsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const processFiles = (newFiles: File[]) => {
    const currentDocs = [...documents];
    let addedCount = 0;

    for (const file of newFiles) {
      if (currentDocs.length >= MAX_DOCS) {
        errorToast({
          title: "Maximum Files Reached",
          description: `You can upload a maximum of ${MAX_DOCS} supporting documents.`,
        });
        break;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        errorToast({
          title: "Unsupported File Format",
          description: `"${file.name}" is not supported (PDF, PNG, JPG, WEBP only).`,
        });
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        errorToast({
          title: "File Exceeds Limit",
          description: `File "${file.name}" is larger than 5MB.`,
        });
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      currentDocs.push({
        rawFile: file,
        url: previewUrl,
        name: file.name,
        size: file.size,
        mimeType: file.type,
      });
      addedCount++;
    }

    if (addedCount > 0) {
      onChange(currentDocs);
      successToast({
        title: "Document Attached",
        description: `${addedCount} document(s) ready to submit.`,
      });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(Array.from(e.target.files || []));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files || []));
  };

  const handleRemoveDoc = (indexToRemove: number) => {
    const doc = documents[indexToRemove];
    if (doc?.url?.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(doc.url);
      } catch {}
    }
    onChange(documents.filter((_, i) => i !== indexToRemove));
  };

  const isAtLimit = documents.length >= MAX_DOCS;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase">
              Required Verification
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              <Shield className="size-3" />
              S3 Encrypted
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            Supporting Business Documents <span className="text-red-500">*</span>
          </h3>
        </div>

        <div className="text-xs">
          <span
            className={`font-semibold ${documents.length >= 1 ? "text-emerald-700" : "font-bold text-amber-600"}`}
          >
            {documents.length} of {MAX_DOCS} attached
          </span>{" "}
          <span className="text-[11px] text-slate-400">(At least 1 required)</span>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-slate-600">
        Please attach <strong>at least 1 supporting document</strong> to verify your business (e.g.,
        Business Registration, Voided Cheque, Tax Certificate). Max <strong>5MB per file</strong>{" "}
        (PDF, PNG, JPG, WEBP).
      </p>

      {!isAtLimit && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
            isDragging
              ? "border-emerald-500 bg-emerald-50/50"
              : "border-slate-200 bg-slate-50/50 hover:border-emerald-400 hover:bg-slate-50"
          } ${isProcessing ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleFilesSelected}
            disabled={isProcessing || isAtLimit}
          />
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-8 animate-spin text-emerald-600" />
              <p className="text-xs font-bold text-slate-800">Reading attached document...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <UploadCloud className="size-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-800 sm:text-sm">
                  Click to browse or drag & drop documents here
                </p>
                <p className="text-[11px] text-slate-500">
                  PDF, PNG, JPG, or WEBP (Up to 5MB each, max 5 documents)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {documents.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Attached Documents ({documents.length})
          </span>
          <div className="grid grid-cols-1 gap-2.5">
            {documents.map((doc, idx) => {
              const isPdf =
                doc.mimeType?.includes("pdf") || doc.name?.toLowerCase().endsWith(".pdf");
              const previewSrc = doc.url || doc.file;

              return (
                <div
                  key={doc.name + idx}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs transition-all hover:border-slate-300"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${isPdf ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"}`}
                    >
                      {isPdf ? <FileText className="size-5" /> : <FileImage className="size-5" />}
                    </div>
                    <div className="min-w-0 overflow-hidden">
                      <p className="truncate text-xs font-bold text-slate-800 sm:text-sm">
                        {doc.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{formatBytes(doc.size)}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          Attached
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {previewSrc && (
                      <a
                        href={previewSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        title="Preview document"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDoc(idx)}
                      className="size-8 rounded-lg p-0 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      title="Remove document"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
