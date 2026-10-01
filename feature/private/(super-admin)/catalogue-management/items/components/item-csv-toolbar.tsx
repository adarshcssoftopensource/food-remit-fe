"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import apiClient from "@/lib/api/client";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { FileSpreadsheet, Image as ImageIcon, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { type ItemCsvErrorPayload, uploadItemCsvFile } from "../hooks/use-upload-item-csv";
import { CsvFormatHelpDialog } from "./csv-format-help-dialog";
import { type CsvImportResult, CsvImportResultDialog } from "./csv-import-result-dialog";

const MAX_FILE_MB = 10;
const ACCEPTED = /\.(csv|xlsx|xls)$/i;

type ItemCsvToolbarProps = {
  /** Import into this category (rows without a categoryName land here). */
  category?: { id: string; categoryName: string } | null;
  className?: string;
};

function describeImport(created: number, updated: number) {
  const parts = [
    created ? `${created} new item${created === 1 ? "" : "s"} added` : "",
    updated ? `${updated} existing item${updated === 1 ? "" : "s"} updated` : "",
  ].filter(Boolean);
  return parts.length ? `${parts.join(" and ")}.` : "No changes were needed.";
}

export function ItemCsvToolbar({ category, className }: ItemCsvToolbarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formatOpen, setFormatOpen] = useState(false);
  const [result, setResult] = useState<CsvImportResult | null>(null);

  const pickFile = () => fileInputRef.current?.click();

  const downloadTemplate = async () => {
    try {
      const response = await apiClient.get(CATALOGUE_MANAGEMENT_ENDPOINTS.DOWNLOAD_ITEM_CSV, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "item_import_template.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Axios interceptor shows the error toast
    }
  };

  const fail = (title: string, description: string, errors: string[] = []) =>
    setResult({ title, description, errors, isError: true });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ACCEPTED.test(file.name)) {
      fail("Unsupported file type", `"${file.name}" isn't a CSV or Excel file.`, [
        "Save your sheet as .csv or .xlsx and try again.",
      ]);
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      fail("File is too large", `Files can be up to ${MAX_FILE_MB} MB.`, [
        "Split the file into smaller files and import them one at a time.",
      ]);
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadItemCsvFile(file, category?.id);
      const data = res?.data ?? {};
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ITEMS }),
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.CATEGORIES }),
        queryClient.invalidateQueries({ queryKey: ["category"] }),
      ]);
      setResult({
        title: "Import complete",
        description: describeImport(data.createdCount ?? 0, data.updatedCount ?? 0),
        createdCount: data.createdCount ?? data.successCount ?? 0,
        updatedCount: data.updatedCount ?? 0,
        categoriesCreated: data.categoriesCreated ?? 0,
        warnings: data.warnings ?? [],
      });
    } catch (err) {
      const axiosError = err as AxiosError<ItemCsvErrorPayload>;
      const payload = axiosError.response?.data;
      const message = Array.isArray(payload?.message) ? payload.message[0] : payload?.message;
      const errors = payload?.errors?.length
        ? payload.errors
        : payload?.data?.errors?.length
          ? payload.data.errors
          : [];

      if (!axiosError.response) {
        fail("Upload failed", "We couldn't reach the server. Check your connection and try again.");
      } else {
        setResult({
          title: "Nothing was imported",
          description: message || "Please check your file and try again.",
          errors,
          warnings: payload?.data?.warnings ?? [],
          isError: true,
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className ?? "flex flex-wrap items-center gap-2"}>
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFile}
      />
      <Button onClick={() => setFormatOpen(true)} variant="outline" className="gap-2 rounded-xl">
        <FileSpreadsheet className="h-4 w-4" />
        CSV format
      </Button>
      <Button
        onClick={pickFile}
        variant="outline"
        className="gap-2 rounded-xl"
        disabled={isUploading}
        isLoading={isUploading}
      >
        {!isUploading && <Upload className="h-4 w-4" />}
        {isUploading ? "Importing…" : "Import CSV"}
      </Button>
      <Button
        onClick={() => router.push(`${ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS}/upload-images`)}
        variant="outline"
        className="gap-2 rounded-xl"
      >
        <ImageIcon className="h-4 w-4" />
        Upload images
      </Button>

      <CsvFormatHelpDialog
        open={formatOpen}
        onOpenChange={setFormatOpen}
        onDownloadTemplate={downloadTemplate}
        categoryName={category?.categoryName}
      />
      <CsvImportResultDialog
        open={!!result}
        onOpenChange={(open) => !open && setResult(null)}
        result={result}
        onRetry={pickFile}
      />
    </div>
  );
}
