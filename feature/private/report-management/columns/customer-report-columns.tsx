"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { PhoneDisplay } from "@/components/ui/phone-display";
import { ROUTES } from "@/config/routes";
import type { CustomerReportRow } from "@/constants/report-management";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

export const customerReportColumns: ColumnDef<CustomerReportRow>[] = [
  {
    id: "sno",
    header: "S.no",
    enableSorting: false,
    cell: ({ row, table }) => (
      <span className="pl-2 font-mono text-xs text-slate-500">
        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
          row.index +
          1}
      </span>
    ),
  },
  {
    accessorKey: "firstName",
    id: "firstName",
    header: "First Name",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-slate-900 dark:text-white">
        {row.original.firstName}
      </span>
    ),
  },
  {
    accessorKey: "email",
    id: "email",
    header: "Email Address",
    enableSorting: true,
    cell: ({ row }) => (
      <TruncatedTextCell
        text={row.original.email}
        maxWords={3}
        className="text-xs text-slate-600 dark:text-slate-400"
      />
    ),
  },
  {
    accessorKey: "phoneNumber",
    id: "phoneNumber",
    header: "Phone Number",
    enableSorting: true,
    cell: ({ row }) => <PhoneDisplay value={row.original.phoneNumber} emptyLabel="—" />,
  },
  {
    accessorKey: "totalOrders",
    id: "totalOrders",
    header: "Total Orders",
    enableSorting: true,
    cell: ({ row }) => {
      const total =
        row.original.totalOrders ??
        (row.original.ordersSent || 0) + (row.original.ordersRequested || 0);
      return (
        <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          {total}
        </span>
      );
    },
  },
  {
    accessorKey: "ordersSent",
    id: "ordersSent",
    header: "No of orders Sent",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        {row.original.ordersSent}
      </span>
    ),
  },
  {
    accessorKey: "ordersRequested",
    id: "ordersRequested",
    header: "No of orders Requested",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
        {row.original.ordersRequested}
      </span>
    ),
  },
  {
    accessorKey: "country",
    id: "country",
    header: "Country",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-xs text-slate-700 dark:text-slate-300">{row.original.country}</span>
    ),
  },
  {
    accessorKey: "city",
    id: "city",
    header: "City",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-xs text-slate-700 dark:text-slate-300">{row.original.city}</span>
    ),
  },
  {
    id: "viewOrders",
    header: "View Orders",
    enableSorting: false,
    cell: ({ row }) => (
      <Link
        href={ROUTES.ADMIN.REPORT_MANAGEMENT.CUSTOMER_REPORT_DETAIL(row.original.id)}
        className={cn(buttonVariants({ variant: "link" }), "p-0")}
      >
        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
          <Eye size={14} />
        </Button>
      </Link>
    ),
  },
];
