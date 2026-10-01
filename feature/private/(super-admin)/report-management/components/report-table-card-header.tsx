"use client";

import type { ReactNode } from "react";
import { FileSpreadsheet, TableProperties } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

function ExportButton({ onClick, isLoading }: { onClick?: () => void; isLoading?: boolean }) {
  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      isLoading={isLoading}
      className="h-9 gap-2 rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
    >
      <FileSpreadsheet className="size-4" />
      <span>Export Excel</span>
    </Button>
  );
}

export function getEntriesFoundLabel(total: number) {
  return `${total} total ${total === 1 ? "entry" : "entries"} found`;
}

interface ReportTableCardHeaderProps {
  title: string;
  subtitle: ReactNode;
  onExport: () => void;
  isExporting: boolean;
}

export function ReportTableCardHeader({
  title,
  subtitle,
  onExport,
  isExporting,
}: ReportTableCardHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-xl ring-1">
          <TableProperties className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </CardTitle>
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        </div>
      </div>

      <ExportButton onClick={onExport} isLoading={isExporting} />
    </CardHeader>
  );
}
