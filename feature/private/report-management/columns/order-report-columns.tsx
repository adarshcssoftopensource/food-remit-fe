"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "../components/order-status-badge";

export interface OrderReportRow {
  sno: number;
  id: string;
  refrenceNumber: string;
  senderName: string;
  receiverName: string;
  storeName: string;
  orderStatus: number;
  statusLabel: string;
  handedOverBy: string;
  orderType: number;
  totalAmount: string;
  addedOn: string;
}

export function getOrderReportColumns(
  onViewDetails: (orderId: string) => void,
): ColumnDef<OrderReportRow>[] {
  return [
    {
      id: "sno",
      header: "S.no",
      cell: ({ row }) => (
        <span className="pl-2 font-mono text-xs text-slate-500">{row.original.sno}</span>
      ),
    },
    {
      accessorKey: "refrenceNumber",
      header: "Reference Number",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
          {row.original.refrenceNumber}
        </span>
      ),
    },
    {
      accessorKey: "senderName",
      header: "Sender Name",
      cell: ({ row }) => (
        <TruncatedTextCell
          text={row.original.senderName}
          maxWords={3}
          className="text-xs font-semibold text-slate-800 dark:text-slate-200"
        />
      ),
    },
    {
      accessorKey: "receiverName",
      header: "Receiver Name",
      cell: ({ row }) => (
        <TruncatedTextCell
          text={row.original.receiverName}
          maxWords={3}
          className="text-xs font-semibold text-slate-800 dark:text-slate-200"
        />
      ),
    },
    {
      accessorKey: "storeName",
      header: "Store Name",
      cell: ({ row }) => (
        <TruncatedTextCell
          text={row.original.storeName}
          maxWords={3}
          className="text-xs font-medium text-slate-700 dark:text-slate-300"
        />
      ),
    },
    {
      accessorKey: "statusLabel",
      header: "Status",
      cell: ({ row }) => (
        <OrderStatusBadge status={row.original.orderStatus} label={row.original.statusLabel} />
      ),
    },
    {
      accessorKey: "handedOverBy",
      header: "Handed Over By",
      cell: ({ row }) => (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {row.original.handedOverBy}
        </span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white">
          {row.original.totalAmount}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewDetails(row.original.id)}
          className="bg-primary/10 text-primary hover:bg-primary/20 h-8 gap-1.5 rounded-xl text-xs font-bold transition-colors"
        >
          <Eye className="size-3.5" />
          View Details
        </Button>
      ),
    },
  ];
}
