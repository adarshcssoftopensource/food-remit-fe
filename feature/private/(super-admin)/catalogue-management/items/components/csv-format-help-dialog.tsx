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
import { ITEM_LIMITS, WEIGHT_UNITS } from "@/lib/catalogue/item-rules";
import { Download, FileSpreadsheet, Layers, ShieldCheck } from "lucide-react";

type CsvColumn = {
  name: string;
  /** Other header names that are accepted for this column */
  aliases?: string;
  required: boolean | "category";
  note: string;
};

const CSV_COLUMNS: CsvColumn[] = [
  {
    name: "categoryName",
    required: "category",
    note: "Matched to your store's categories by name; created automatically if it doesn't exist.",
  },
  {
    name: "itemNumber",
    aliases: "sku, itemCode",
    required: false,
    note: "Your own code for the item. Rows with the same item number become one item with several packs. Re-importing a number updates that item.",
  },
  {
    name: "itemName",
    aliases: "productName",
    required: true,
    note: `${ITEM_LIMITS.productNameMin}–${ITEM_LIMITS.productNameMax} characters.`,
  },
  { name: "description", required: false, note: "Optional text." },
  {
    name: "upcEan",
    aliases: "upcCode, barcode",
    required: false,
    note: "8 to 14 digits. Format the column as Text in Excel so barcodes aren't turned into 4.8E+12.",
  },
  {
    name: "stockQuantity",
    aliases: "quantityOnHand",
    required: false,
    note: "Quantity on hand for the item. Whole number, 0 or more. Blank = 0 (saved as inactive).",
  },
  { name: "discountPercent", required: false, note: "0 to 100." },
  { name: "isPerishable", required: false, note: "yes / no (blank = no)." },
  {
    name: "productImage",
    required: false,
    note: `Optional — you can add images later. Up to ${ITEM_LIMITS.maxImages} filenames or URLs, separated by commas.`,
  },
  { name: "productInfo", required: false, note: "Optional text." },
  { name: "productInfoImage", required: false, note: "Optional. One filename or URL." },
  { name: "nutritionInfo", required: false, note: "Optional text." },
  { name: "nutritionInfoImage", required: false, note: "Optional. One filename or URL." },
  {
    name: "optionName",
    required: false,
    note: 'Pack / size name, e.g. "Single" or "6 Pack". Built from weight / quantity if blank.',
  },
  { name: "quantityPerPack", required: false, note: "Whole number, 1 or more." },
  { name: "netWeight", required: false, note: "Greater than 0. Needs a weightUnit." },
  {
    name: "weightUnit",
    required: false,
    note: `${WEIGHT_UNITS.join(", ")} (any case; litre, kgs, pieces… also work).`,
  },
  {
    name: "price",
    required: true,
    note: "Price of this pack. Greater than 0, up to 2 decimals. The item's first pack is its base price.",
  },
];

type CsvFormatHelpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownloadTemplate: () => void;
  /** When importing from a category workspace, categoryName becomes optional. */
  categoryName?: string | null;
};

const code = "rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-slate-800";

export function CsvFormatHelpDialog({
  open,
  onOpenChange,
  onDownloadTemplate,
  categoryName,
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
                  Import items from CSV or Excel
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {categoryName
                    ? `Rows without a categoryName are added to ${categoryName}.`
                    : "Download the template, fill one row per pack / size, then import it."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200/70 bg-white/80 px-3.5 py-3 text-xs leading-5 text-slate-600 dark:border-emerald-900/40 dark:bg-slate-950/40 dark:text-slate-300">
              <Layers className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <p>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  Several packs?
                </span>{" "}
                Add one row per pack with the same <code className={code}>itemNumber</code>. Item
                details (name, stock, description) are read from the first row.
              </p>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200/70 bg-white/80 px-3.5 py-3 text-xs leading-5 text-slate-600 dark:border-emerald-900/40 dark:bg-slate-950/40 dark:text-slate-300">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <p>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  Safe import.
                </span>{" "}
                If any row has a problem nothing is saved, and you get a list of rows to fix. Up to{" "}
                {ITEM_LIMITS.maxCsvRows.toLocaleString()} rows per file.
              </p>
            </div>
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
                {CSV_COLUMNS.map((col) => {
                  const required =
                    col.required === "category" ? !categoryName : (col.required as boolean);
                  return (
                    <tr
                      key={col.name}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="px-3 py-2 align-top">
                        <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200">
                          {col.name}
                        </span>
                        {col.aliases ? (
                          <span className="block text-[10px] text-slate-400">or {col.aliases}</span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={
                            required
                              ? "rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }
                        >
                          {required ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-3 py-2 leading-5 text-slate-500 dark:text-slate-400">
                        {col.note}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Extra columns in your spreadsheet are ignored, so you can keep your own sheet and just
            rename the columns above. Department is no longer used. Negative numbers are never
            accepted, and column names are not case-sensitive.
          </p>
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
            Download template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
