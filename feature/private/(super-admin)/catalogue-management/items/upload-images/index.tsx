"use client";

import { PageHeader } from "@/components/common/page-header";
import { errorToast, successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  FileArchive,
  ImageIcon,
  Info,
  Link2,
  MinusCircle,
  UploadCloud,
  X,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  type BulkImageResult,
  type BulkImageStatus,
  useBulkUploadItemImages,
} from "../hooks/use-bulk-upload-item-images";

const MAX_FILES = 20;
const MAX_IMAGE_MB = 5;
const MAX_ZIP_MB = 100;
const IMAGE_PATTERN = /\.(jpe?g|png|webp|gif)$/i;
const ZIP_PATTERN = /\.zip$/i;
const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,.zip,application/zip";

type Filter = "all" | BulkImageStatus;

const STATUS_STYLE: Record<
  BulkImageStatus,
  { label: string; Icon: typeof CheckCircle2; className: string }
> = {
  uploaded: {
    label: "Uploaded",
    Icon: CheckCircle2,
    className: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  skipped: {
    label: "Skipped",
    Icon: MinusCircle,
    className: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400",
  },
  failed: {
    label: "Failed",
    Icon: XCircle,
    className: "text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400",
  },
};

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Returns a reason when the file can't be uploaded, otherwise null. */
function validateFile(file: File): string | null {
  if (ZIP_PATTERN.test(file.name)) {
    return file.size > MAX_ZIP_MB * 1024 * 1024
      ? `${file.name} is ${formatSize(file.size)}. ZIP files can be up to ${MAX_ZIP_MB} MB.`
      : null;
  }
  if (!IMAGE_PATTERN.test(file.name)) {
    return `${file.name} isn't supported. Use JPG, PNG, WEBP, GIF or a ZIP of images.`;
  }
  return file.size > MAX_IMAGE_MB * 1024 * 1024
    ? `${file.name} is ${formatSize(file.size)}. Images can be up to ${MAX_IMAGE_MB} MB.`
    : null;
}

export function BulkImageUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BulkImageResult[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [copied, setCopied] = useState<string | null>(null);

  const uploadMutation = useBulkUploadItemImages();
  const isUploading = uploadMutation.isPending;

  const addFiles = (incoming: File[]) => {
    if (!incoming.length) return;
    const problems: string[] = [];
    const next = [...selectedFiles];
    const keys = new Set(next.map((f) => `${f.name}-${f.size}`));

    for (const file of incoming) {
      const problem = validateFile(file);
      if (problem) {
        problems.push(problem);
        continue;
      }
      const key = `${file.name}-${file.size}`;
      if (keys.has(key)) continue;
      if (next.length >= MAX_FILES) {
        problems.push(
          `Only ${MAX_FILES} files can be uploaded at once — put more images in a ZIP instead.`,
        );
        break;
      }
      keys.add(key);
      next.push(file);
    }
    setSelectedFiles(next);
    setRejected(problems);
  };

  const removeFile = (index: number) =>
    setSelectedFiles((files) => files.filter((_, i) => i !== index));

  const handleUpload = () => {
    if (!selectedFiles.length) return;
    setProgress(0);
    uploadMutation.mutate(
      { files: selectedFiles, onProgress: setProgress },
      {
        onSuccess: (res) => {
          const data = res.data;
          const list = data?.results ?? [];
          setResults(list);
          setFilter(data?.failedCount ? "failed" : "all");
          setSelectedFiles([]);
          setRejected([]);
          if (data?.uploadedCount && !data.failedCount) {
            successToast({ title: "Upload complete", description: res.message });
          } else if (data?.failedCount) {
            errorToast({
              title: data.uploadedCount ? "Some images were not uploaded" : "No images uploaded",
              description: res.message,
            });
          }
        },
      },
    );
  };

  const copyText = async (text: string, key: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      successToast({ description: message });
      setTimeout(() => setCopied(null), 2000);
    } catch {
      errorToast({ description: "Couldn't copy to the clipboard. Select the text and copy it." });
    }
  };

  const counts = {
    all: results?.length ?? 0,
    uploaded: results?.filter((r) => r.status === "uploaded").length ?? 0,
    skipped: results?.filter((r) => r.status === "skipped").length ?? 0,
    failed: results?.filter((r) => r.status === "failed").length ?? 0,
  };
  const usableNames = (results ?? []).flatMap((r) => (r.fileName && r.url ? [r.fileName] : []));
  const visible = (results ?? []).filter((r) => filter === "all" || r.status === filter);

  const summaryTone =
    counts.failed && !usableNames.length
      ? "error"
      : counts.failed || counts.skipped
        ? "partial"
        : "success";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bulk Image Upload"
        description="Upload product images — one by one or as a ZIP — then use their file names in your CSV."
        action={
          <Button
            onClick={() => router.push(ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS)}
            variant="outline"
            className="gap-2 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Items
          </Button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-lg shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/70 dark:shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="from-primary/20 to-primary/5 text-primary flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br shadow-inner">
                  <UploadCloud className="h-5 w-5" />
                </div>
                Upload images or a ZIP
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-500">
                Up to {MAX_FILES} files at once. Images: JPG, PNG, WEBP or GIF, max {MAX_IMAGE_MB}{" "}
                MB each. ZIP: up to {MAX_ZIP_MB} MB with up to 500 images (folders inside are fine).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (!isUploading) addFiles(Array.from(e.dataTransfer.files));
                }}
                className={cn(
                  "flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-primary/25 hover:border-primary hover:bg-primary/5",
                  isUploading && "cursor-not-allowed opacity-60",
                )}
              >
                <div className="flex items-center gap-2 text-slate-400">
                  <ImageIcon className="h-7 w-7" />
                  <FileArchive className="h-7 w-7" />
                </div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  Drop images or ZIP files here, or click to browse
                </p>
                <p className="text-xs text-slate-500">
                  File names become the names you use in the CSV (e.g. “Milk Bottle.png” →
                  milk-bottle.png)
                </p>
              </button>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={ACCEPT}
                className="hidden"
                onChange={(e) => {
                  addFiles(Array.from(e.target.files ?? []));
                  e.target.value = "";
                }}
              />

              {rejected.length > 0 && (
                <div className="space-y-1 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                  {rejected.map((message) => (
                    <p
                      key={message}
                      className="flex gap-2 text-xs leading-5 text-amber-800 dark:text-amber-200"
                    >
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                      {message}
                    </p>
                  ))}
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Ready to upload
                    </p>
                    <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-bold">
                      {selectedFiles.length} / {MAX_FILES} files
                    </span>
                  </div>
                  <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {selectedFiles.map((file, index) => {
                      const isZip = ZIP_PATTERN.test(file.name);
                      return (
                        <li
                          key={`${file.name}-${file.size}`}
                          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60"
                        >
                          {isZip ? (
                            <FileArchive className="h-5 w-5 shrink-0 text-violet-500" />
                          ) : (
                            <ImageIcon className="h-5 w-5 shrink-0 text-sky-500" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {isZip ? "ZIP archive" : "Image"} · {formatSize(file.size)}
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={isUploading}
                            onClick={() => removeFile(index)}
                            title="Remove"
                            className="h-7 w-7 rounded-full text-slate-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      );
                    })}
                  </ul>

                  {isUploading && (
                    <div className="space-y-1.5">
                      <Progress value={progress} />
                      <p className="text-xs text-slate-500">
                        {progress < 100
                          ? `Sending files… ${progress}%`
                          : "Processing images — large ZIPs can take a minute."}
                      </p>
                    </div>
                  )}

                  <Button
                    className="w-full rounded-2xl py-6 text-base font-semibold"
                    onClick={handleUpload}
                    disabled={isUploading}
                    isLoading={isUploading}
                  >
                    {isUploading ? "Uploading…" : `Upload ${selectedFiles.length} file(s)`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-slate-200/70 bg-white/60 dark:border-slate-800 dark:bg-slate-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="text-primary h-4 w-4" />
                Using images in your CSV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs leading-5 text-slate-600 dark:text-slate-400">
              <p>
                In <code className="font-mono">productImage</code>,{" "}
                <code className="font-mono">productInfoImage</code> and{" "}
                <code className="font-mono">nutritionInfoImage</code>, write the uploaded file name
                — for several product images separate them with commas, e.g.{" "}
                <code className="rounded bg-slate-100 px-1 font-mono dark:bg-slate-800">
                  milk-front.png, milk-back.png
                </code>
                .
              </p>
              <p className="flex gap-2">
                <Link2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  You can also paste public image links (https://…), mixed with file names. They are
                  downloaded and saved when you import the CSV. Google Drive and Dropbox share links
                  work if they are set to “Anyone with the link”.
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {results && (
          <Card className="animate-in fade-in zoom-in-95 h-fit overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-xl shadow-slate-200/40 duration-300 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
            <div
              className={cn(
                "bg-linear-to-br px-6 pt-6 pb-4",
                summaryTone === "success" && "from-emerald-500/15 via-teal-500/5 to-transparent",
                summaryTone === "partial" && "from-amber-500/15 via-orange-500/5 to-transparent",
                summaryTone === "error" && "from-red-500/15 via-rose-500/5 to-transparent",
              )}
            >
              <div className="flex items-start gap-3">
                {summaryTone === "success" ? (
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                ) : summaryTone === "partial" ? (
                  <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
                ) : (
                  <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
                )}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {summaryTone === "success"
                      ? "All images uploaded"
                      : summaryTone === "partial"
                        ? "Upload finished with some issues"
                        : "No images could be uploaded"}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {counts.uploaded} uploaded · {counts.skipped} skipped · {counts.failed} failed.{" "}
                    {usableNames.length > 0
                      ? "Copy the file names below into your CSV."
                      : "Fix the files listed below and upload them again."}
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="space-y-4 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                {(["all", "uploaded", "skipped", "failed"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold transition",
                      filter === key
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300",
                    )}
                  >
                    {key === "all" ? "All" : STATUS_STYLE[key].label} ({counts[key]})
                  </button>
                ))}
                {usableNames.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto gap-1.5 rounded-xl text-xs"
                    onClick={() =>
                      copyText(
                        usableNames.join(", "),
                        "__all__",
                        `${usableNames.length} file name(s) copied`,
                      )
                    }
                  >
                    {copied === "__all__" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Copy all names
                  </Button>
                )}
              </div>

              <ul className="max-h-130 space-y-2 overflow-y-auto pr-1">
                {visible.length === 0 && (
                  <li className="py-6 text-center text-sm text-slate-400">Nothing here.</li>
                )}
                {visible.map((result, index) => {
                  const style = STATUS_STYLE[result.status];
                  const key = `${result.source ?? ""}/${result.originalName}/${index}`;
                  return (
                    <li
                      key={key}
                      className="rounded-2xl border border-slate-100 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-900/50"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                            style.className,
                          )}
                          title={style.label}
                        >
                          <style.Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-x-2">
                            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {result.fileName ?? result.originalName}
                            </p>
                            {result.source && (
                              <span className="text-[11px] text-slate-400">
                                from {result.source}
                              </span>
                            )}
                          </div>
                          {result.fileName && result.fileName !== result.originalName && (
                            <p className="text-[11px] text-slate-400">
                              Original name: {result.originalName}
                            </p>
                          )}
                          {result.reason && (
                            <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">
                              {result.reason}
                            </p>
                          )}
                        </div>
                        {result.fileName && result.url && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 shrink-0 gap-1.5 rounded-xl px-2.5 text-xs"
                            onClick={() =>
                              copyText(result.fileName!, key, `Copied ${result.fileName}`)
                            }
                          >
                            {copied === key ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {copied === key ? "Copied" : "Copy"}
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
