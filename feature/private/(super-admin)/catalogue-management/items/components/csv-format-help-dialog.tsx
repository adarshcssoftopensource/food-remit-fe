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
import { ITEM_LIMITS } from "@/lib/catalogue/item-rules";
import { Download, FileSpreadsheet, Layers, ShieldCheck } from "lucide-react";

import { CSV_COLUMNS } from "../columns/csv-format-columns";

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
      <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[95%] flex-col overflow-hidden rounded-2xl p-0 sm:w-full sm:max-w-2xl">
        <div className="shrink-0 bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent px-6 pt-6 pb-4">
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
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto px-6 pb-4">
          <div className="mb-4 grid gap-2 sm:grid-cols-2">
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200/70 bg-white/80 px-3.5 py-3 text-xs leading-5 text-slate-600 dark:border-emerald-900/40 dark:bg-slate-950/40 dark:text-slate-300">
              <Layers className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <p className="min-w-0 wrap-break-word">
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  Several packs?
                </span>{" "}
                Add one row per pack with the same <code className={code}>itemNumber</code>. Item
                details (name, stock, description) are read from the first row.
              </p>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200/70 bg-white/80 px-3.5 py-3 text-xs leading-5 text-slate-600 dark:border-emerald-900/40 dark:bg-slate-950/40 dark:text-slate-300">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <p className="min-w-0 wrap-break-word">
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  Safe import.
                </span>{" "}
                If any row has a problem nothing is saved, and you get a list of rows to fix. Up to{" "}
                {ITEM_LIMITS.maxCsvRows.toLocaleString()} rows per file.
              </p>
            </div>
          </div>

          <div className="w-full max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-150 text-left text-xs">
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

        <DialogFooter className="shrink-0 gap-2 border-t border-slate-100 px-6 py-4 sm:gap-2 dark:border-slate-800">
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
