"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, FileSpreadsheet, ImageIcon } from "lucide-react";

const CSV_COLUMNS = [
  { name: "productName", required: true, note: "Item Name (min 2 characters)" },
  { name: "description", required: true, note: "Item description" },
  { name: "discountPercent", required: false, note: "0–100" },
  {
    name: "productImage",
    required: false,
    note: "Filename or full URL (max 5). Use Upload Images first, e.g. user1.jpg",
  },
  { name: "productInfo", required: true, note: "Product information" },
  {
    name: "productInfoImage",
    required: false,
    note: "Additional image filename/URL (shows under Additional Images)",
  },
  { name: "nutritionInfo", required: false, note: "Optional nutrition text" },
  {
    name: "nutritionInfoImage",
    required: false,
    note: "Nutrition image filename/URL (Additional Images)",
  },
  { name: "itemsPerPack", required: true, note: "Number ≥ 0; > 0 when stock > 0" },
  { name: "stockQuantity", required: true, note: "Whole number ≥ 0" },
  {
    name: "unit",
    required: true,
    note: "kg, g, mg, ltr, ml, pcs, dozen, box, pack, set, pair, bottle, can, bag",
  },
  { name: "netWeight", required: false, note: "Required > 0 when stock > 0" },
  { name: "weightUnit", required: false, note: "kg, g, lbs, oz" },
  { name: "upcCode", required: false, note: "8–12 digits (SKU / barcode)" },
  { name: "price", required: true, note: "Valid number ≥ 0" },
  {
    name: "departmentName",
    required: true,
    note: "Matched in your store; created if missing",
  },
  {
    name: "categoryName",
    required: true,
    note: "Created under the row department if missing",
  },
];

type CsvFormatHelpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownloadTemplate: () => void;
};

export function CsvFormatHelpDialog({
  open,
  onOpenChange,
  onDownloadTemplate,
}: CsvFormatHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-2xl p-0 sm:max-w-2xl">
        <div className="bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent px-6 pt-6 pb-4">
          <DialogHeader className="gap-3 text-left">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20">
                <FileSpreadsheet className="size-5" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  CSV Import Format
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Columns match the Add Item form. Upload images first, then paste the returned
                  filename or URL into the CSV.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-200/70 bg-white/80 px-3.5 py-3 text-xs text-slate-600 dark:border-emerald-900/40 dark:bg-slate-950/40 dark:text-slate-300">
            <ImageIcon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            <p>
              <span className="font-semibold text-slate-800 dark:text-slate-100">Images:</span>{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-slate-800">
                productImage
              </code>{" "}
              is the main gallery.{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-slate-800">
                productInfoImage
              </code>{" "}
              /{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-slate-800">
                nutritionInfoImage
              </code>{" "}
              appear under Additional Images.
            </p>
          </div>
        </div>

        <div className="px-6 pb-2">
          <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900">
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-200">
                    Column
                  </th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-200">
                    Required
                  </th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-200">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {CSV_COLUMNS.map((col) => (
                  <tr
                    key={col.name}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-3 py-2 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                      {col.name}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          col.required
                            ? "rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }
                      >
                        {col.required ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{col.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="gap-2 border-t border-slate-100 px-6 py-4 sm:gap-2 dark:border-slate-800">
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            className="gap-2 rounded-xl"
            onClick={() => {
              onDownloadTemplate();
              onOpenChange(false);
            }}
          >
            <Download className="size-4" />
            Download Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
