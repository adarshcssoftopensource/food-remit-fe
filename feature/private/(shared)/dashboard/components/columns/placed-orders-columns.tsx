"use client";

import { formatDate } from "@/lib/date";
import { getInitials } from "@/lib/get-initials";
import { ColumnDef } from "@tanstack/react-table";
import { MapPin } from "lucide-react";
import type { DashboardRecentlyPlacedOrder } from "../../types/dashboard.types";
import { DashboardStatusBadge } from "../common/dashboard-status-badge";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";

import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { CopyButton } from "@/components/common/copy-button";

export const placedOrdersColumns: ColumnDef<DashboardRecentlyPlacedOrder>[] = [
  {
    accessorKey: "referenceNumber",
    header: "Order ID",
    enableSorting: false,
    cell: ({ row }) => {
      const ref = (row.getValue("referenceNumber") as string) || "";
      const fallback = row.original.id
        ? `#${String(row.original.id).replace(/^#/, "").slice(0, 8).toUpperCase()}`
        : "—";
      const displayRef = ref ? (ref.startsWith("#") ? ref : `#${ref}`) : fallback;
      const targetQuery = ref ? ref.replace(/^#/, "") : row.original.id;
      const copyVal = ref || (row.original.id ? String(row.original.id) : "");
      return (
        <div className="flex items-center gap-1.5">
          <Link
            href={`${ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT}?search=${encodeURIComponent(targetQuery)}`}
            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold whitespace-nowrap text-emerald-700 transition hover:bg-emerald-50 hover:underline dark:bg-slate-800 dark:text-emerald-400"
            title="View in Order Management"
          >
            {displayRef}
          </Link>
          {copyVal && (
            <CopyButton value={copyVal} label="Order ID" size="icon" className="h-6 w-6" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    enableSorting: false,
    cell: ({ row }) => {
      const name: string = row.getValue("customerName") || "Customer";
      const initials = getInitials(name);
      return (
        <div className="flex max-w-35 items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            {initials}
          </div>
          <TruncatedTextCell
            text={name}
            maxWords={2}
            className="text-xs font-semibold text-slate-800 dark:text-slate-200"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    enableSorting: false,
    cell: ({ row }) => {
      const location = (row.getValue("location") as string) || "—";
      const hasLocation = location && location !== "—";
      return (
        <div
          className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300"
          title={hasLocation ? location : undefined}
        >
          <MapPin className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="leading-relaxed font-medium break-words">{location}</span>
          {hasLocation && (
            <CopyButton value={location} label="Address" size="icon" className="h-5 w-5 shrink-0" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => <DashboardStatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "deliveredTime",
    header: "Delivered Time",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-xs font-medium whitespace-nowrap text-slate-500 dark:text-slate-400">
        {formatDate(row.original.createdAt, row.original.deliveredTime || "N/A")}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-xs font-bold whitespace-nowrap text-slate-900 dark:text-slate-100">
        {row.getValue("price")}
      </div>
    ),
  },
];
