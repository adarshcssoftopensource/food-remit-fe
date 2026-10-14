"use client";

import { formatDate } from "@/lib/date";
import { getInitials } from "@/lib/get-initials";
import { ColumnDef } from "@tanstack/react-table";
import { MapPin } from "lucide-react";
import type { DashboardOrderRequested } from "../../types/dashboard.types";
import { DashboardStatusBadge } from "../common/dashboard-status-badge";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { CopyButton } from "@/components/common/copy-button";

export const requestedOrdersColumns: ColumnDef<DashboardOrderRequested>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    enableSorting: false,
    cell: ({ row }) => {
      const orderId = (row.getValue("orderId") as string) || "";
      const displayId = orderId ? (orderId.startsWith("#") ? orderId : `#${orderId}`) : "—";
      return (
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold whitespace-nowrap text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            {displayId}
          </span>
          {orderId && (
            <CopyButton value={orderId} label="Order ID" size="icon" className="h-6 w-6" />
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
          <div className="bg-primary/10 text-primary dark:bg-primary/20 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
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
          <span className="leading-relaxed font-medium wrap-break-word">{location}</span>
          {hasLocation && (
            <CopyButton value={location} label="Address" size="icon" className="h-5 w-5 shrink-0" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => <DashboardStatusBadge status={row.getValue("orderStatus")} />,
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
