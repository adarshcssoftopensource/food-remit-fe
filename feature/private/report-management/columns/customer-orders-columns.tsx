"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Store, User, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "../components/order-status-badge";
import type { CustomerOrderRow } from "../hooks/use-get-customer-orders";

interface GetCustomerOrdersColumnsOptions {
  page: number;
  limit: number;
  onViewDetails: (orderId: string) => void;
}

export function getCustomerOrdersColumns({
  page,
  limit,
  onViewDetails,
}: GetCustomerOrdersColumnsOptions): ColumnDef<CustomerOrderRow>[] {
  const pageStartSno = (page - 1) * limit;

  return [
    {
      id: "sno",
      header: "S.no",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
          {pageStartSno + row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "refrenceNumber",
      id: "refrenceNumber",
      header: "Reference Number",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          {row.original.refrenceNumber || "—"}
        </span>
      ),
    },
    {
      accessorKey: "senderName",
      id: "senderName",
      header: "Sender Name",
      enableSorting: true,
      cell: ({ row }) => {
        const sender = row.original.senderName;
        return (
          <div className="flex items-center gap-2">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <User size={12} />
            </div>
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
              {sender || "—"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "storeName",
      id: "storeName",
      header: "Store Name",
      enableSorting: true,
      cell: ({ row }) => {
        const store = row.original.storeName;
        return (
          <div className="flex items-center gap-2">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Store size={12} />
            </div>
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
              {store || "—"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "statusLabel",
      id: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => (
        <OrderStatusBadge
          status={row.original.status}
          orderType={row.original.orderType}
          label={row.original.statusLabel}
        />
      ),
    },
    {
      accessorKey: "handedOverBy",
      id: "handedOverBy",
      header: "Handed over by",
      enableSorting: true,
      cell: ({ row }) => {
        const staff = row.original.handedOverBy;
        const isAssigned = staff && staff !== "N/A" && staff !== "—";

        return isAssigned ? (
          <div className="flex items-center gap-2">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
              <UserCheck size={12} />
            </div>
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{staff}</span>
          </div>
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            N/A
          </span>
        );
      },
    },
    {
      id: "viewDetails",
      header: "View Details",
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          size="icon"
          variant="outline"
          className="size-8 rounded-full transition-transform hover:scale-105"
          onClick={() => onViewDetails(row.original.id)}
          title="View Order Details"
        >
          <Eye size={14} className="text-slate-600 dark:text-slate-300" />
        </Button>
      ),
    },
  ];
}
