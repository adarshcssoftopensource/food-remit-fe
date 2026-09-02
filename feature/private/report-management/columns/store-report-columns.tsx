"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { ROUTES } from "@/config/routes";
import type { StoreReportRow } from "@/constants/report-management";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

export const storeReportColumns: ColumnDef<StoreReportRow>[] = [
  {
    id: "sno",
    header: "S.no",
    cell: ({ row, table }) => (
      <span className="pl-2 font-mono text-xs text-slate-500">
        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
          row.index +
          1}
      </span>
    ),
  },
  { accessorKey: "storeName", header: "Store Name" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "state", header: "State/Province" },
  { accessorKey: "city", header: "City" },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <TruncatedTextCell
        text={row.original.address}
        maxWords={5}
        className="text-xs font-medium text-slate-600 dark:text-slate-400"
      />
    ),
  },
  { accessorKey: "totalOrder", header: "Total Order" },
  {
    id: "details",
    header: "Actions",
    cell: ({ row }) => (
      <Link
        href={ROUTES.ADMIN.REPORT_MANAGEMENT.STORE_REPORT_DETAIL(row.original.id)}
        className={cn(buttonVariants({ variant: "link" }), "")}
      >
        <Button size="icon" variant="outline" className="rounded-full">
          <Eye size={14} />
        </Button>
      </Link>
    ),
  },
];
