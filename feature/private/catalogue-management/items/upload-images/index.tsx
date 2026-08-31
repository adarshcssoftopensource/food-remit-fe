"use client";

import { ImageUpload } from "@/components/common/image-upload";
import { PageHeader } from "@/components/common/page-header";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { ArrowLeft, Check, Copy, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBulkUploadItemImages } from "../hooks/use-bulk-upload-item-images";

export function BulkImageUpload() {
  const router = useRouter();
  const [uploadKey, setUploadKey] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const bulkUploadMutation = useBulkUploadItemImages();

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    bulkUploadMutation.mutate(formData, {
      onSuccess: (res: any) => {
        successToast({ description: "Images uploaded successfully" });
        setUploadedUrls(res.data);
        setSelectedFiles([]);
        setUploadKey((k) => k + 1);
      },
    });
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    successToast({ description: "URL copied to clipboard" });
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bulk Image Upload"
        description="Upload multiple images to get their paths for your CSV catalogue."
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

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="group relative overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-lg shadow-slate-200/50 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/70 dark:border-slate-800/50 dark:bg-slate-900/70 dark:shadow-none">
          <div className="from-primary/5 absolute inset-0 -z-10 bg-gradient-to-br via-transparent to-transparent opacity-50"></div>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="from-primary/20 to-primary/5 text-primary flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br shadow-inner">
                <UploadCloud className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                Upload Images
              </span>
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-500">
              Select up to 20 images. Supported formats: JPG, PNG, WEBP.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <ImageUpload
              key={uploadKey}
              onChange={(files) => setSelectedFiles(files)}
              maxFiles={20}
              multiple={true}
              accept="image/png,image/jpeg,image/webp"
              label="Click to browse"
              hint="or drag and drop files here (Max 20)"
              className="rounded-2xl bg-white/50 p-2 shadow-sm transition-colors hover:bg-white/80 dark:bg-slate-900/50 dark:hover:bg-slate-900/80"
            />

            {selectedFiles.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4 duration-500">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Ready to upload
                  </p>
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-bold">
                    {selectedFiles.length} files
                  </span>
                </div>
                <Button
                  className="from-primary to-primary/80 shadow-primary/25 hover:shadow-primary/40 w-full rounded-2xl bg-gradient-to-r py-6 text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.02]"
                  onClick={handleUpload}
                  disabled={bulkUploadMutation.isPending}
                >
                  {bulkUploadMutation.isPending ? "Uploading gracefully..." : "Upload All Images"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {uploadedUrls.length > 0 && (
          <Card className="animate-in fade-in zoom-in-95 overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 shadow-xl shadow-emerald-100/50 backdrop-blur-xl duration-500 dark:border-emerald-900/30 dark:from-emerald-950/40 dark:to-teal-950/20 dark:shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-emerald-800 dark:text-emerald-400">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner dark:bg-emerald-900/50 dark:text-emerald-400">
                  <Check className="h-5 w-5" />
                </div>
                Upload Successful!
              </CardTitle>
              <CardDescription className="text-emerald-600/80 dark:text-emerald-400/70">
                Copy these premium paths and paste them into your CSV template.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="custom-scrollbar max-h-[420px] space-y-3 overflow-y-auto pr-2">
                {uploadedUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative flex flex-col gap-2 rounded-2xl border border-white/60 bg-white/60 p-4 shadow-sm transition-all hover:bg-white/90 hover:shadow-md dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-700/70 uppercase dark:text-emerald-400/70">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-200/50 text-[10px] text-emerald-700 dark:bg-emerald-800/50 dark:text-emerald-300">
                          {idx + 1}
                        </span>
                        Image Path
                      </span>
                      <Button
                        variant={copiedUrl === url ? "default" : "ghost"}
                        size="sm"
                        className={`h-8 gap-2 rounded-xl px-3 text-xs font-medium transition-all ${
                          copiedUrl === url
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-200 hover:bg-emerald-600"
                            : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-800"
                        }`}
                        onClick={() => copyToClipboard(url)}
                      >
                        {copiedUrl === url ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <code className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5 text-xs break-all text-slate-700 shadow-inner dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
                      {url}
                    </code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
