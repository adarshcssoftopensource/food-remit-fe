"use client";

import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import type { StoreReportRow } from "@/constants/report-management";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const storeReportColumns: ColumnDef<StoreReportRow>[] = [
  {
    id: "sno",
    header: "S.no",
    cell: ({ row }) => (
      <span className="pl-2 font-mono text-xs text-slate-500">{row.index + 1}</span>
    ),
  },
  { accessorKey: "storeName", header: "Store Name" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "state", header: "State/Province" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "totalOrder", header: "Total Order" },
  {
    id: "details",
    header: "Details",
    cell: ({ row }) => (
      <Link
        href={ROUTES.ADMIN.REPORT_MANAGEMENT.STORE_REPORT_DETAIL(row.original.id)}
        className={cn(buttonVariants({ variant: "link" }), "h-auto px-0 font-semibold")}
      >
        View Details
      </Link>
    ),
  },
];
