"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, User, ZoomIn } from "lucide-react";

import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date";
import { cleanCurrencyDisplay } from "@/lib/utils/currency";
import { OrderStatusBadge } from "../components/order-status-badge";

export interface OrderReportRow {
  sno: number;
  id: string;
  refrenceNumber: string;
  senderName: string;
  senderImage?: string | null;
  receiverName: string;
  receiverImage?: string | null;
  storeName: string;
  storeImage?: string | null;
  storeAddress?: string | null;
  orderStatus: number;
  statusLabel: string;
  orderType: number;
  totalAmount: string;
  totalAmountVal?: number;
  itemTax?: string;
  itemTaxVal?: number;
  processingFee?: string;
  processingFeeVal?: number;
  commissionEarnings?: string;
  commissionEarningsVal?: number;
  markup?: string;
  markupVal?: number;
  refundedAmount?: string;
  refundedAmountVal?: number;
  addedOn: string;
  createdAt?: string;
}

export interface GetOrderReportColumnsOptions {
  onViewDetails: (orderId: string) => void;
  onImageClick?: (url: string) => void;
}

export function getOrderReportColumns(
  optionsOrHandler: ((orderId: string) => void) | GetOrderReportColumnsOptions,
): ColumnDef<OrderReportRow>[] {
  const onViewDetails =
    typeof optionsOrHandler === "function" ? optionsOrHandler : optionsOrHandler.onViewDetails;
  const onImageClick =
    typeof optionsOrHandler === "function" ? undefined : optionsOrHandler.onImageClick;

  return [
    {
      id: "sno",
      header: "S.No",
      cell: ({ row }) => (
        <span className="pl-2 font-mono text-xs text-slate-500">{row.original.sno}</span>
      ),
    },
    {
      accessorKey: "refrenceNumber",
      header: "Reference No",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
          {row.original.refrenceNumber || row.original.id.substring(0, 8)}
        </span>
      ),
    },

    {
      accessorKey: "senderName",
      header: "Sender",
      cell: ({ row }) => {
        const { senderName, senderImage } = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <div className="group relative size-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-2xs dark:border-slate-700 dark:bg-slate-800">
              {senderImage ? (
                <>
                  <Image
                    src={senderImage}
                    alt={senderName || "Sender"}
                    fill
                    className="object-cover"
                  />
                  {onImageClick && (
                    <button
                      type="button"
                      onClick={() => onImageClick(senderImage)}
                      className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                      title="Zoom Sender Image"
                    >
                      <ZoomIn className="size-3.5 text-white drop-shadow" />
                    </button>
                  )}
                </>
              ) : (
                <div className="flex size-full items-center justify-center text-slate-400">
                  <User className="size-3.5" />
                </div>
              )}
            </div>
            <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              {senderName || "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "receiverName",
      header: "Receiver",
      cell: ({ row }) => {
        const { receiverName, receiverImage } = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <div className="group relative size-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-2xs dark:border-slate-700 dark:bg-slate-800">
              {receiverImage ? (
                <>
                  <Image
                    src={receiverImage}
                    alt={receiverName || "Receiver"}
                    fill
                    className="object-cover"
                  />
                  {onImageClick && (
                    <button
                      type="button"
                      onClick={() => onImageClick(receiverImage)}
                      className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                      title="Zoom Receiver Image"
                    >
                      <ZoomIn className="size-3.5 text-white drop-shadow" />
                    </button>
                  )}
                </>
              ) : (
                <div className="flex size-full items-center justify-center text-slate-400">
                  <User className="size-3.5" />
                </div>
              )}
            </div>
            <TruncatedTextCell
              text={row.original.receiverName || "N/A"}
              maxWords={3}
              className="text-xs font-semibold text-slate-800 dark:text-slate-200"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "markup",
      header: "Markup",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">
          {cleanCurrencyDisplay(row.original.markup)}
        </span>
      ),
    },
    // {
    //   accessorKey: "processingFee",
    //   header: "Processing Fee",
    //   cell: ({ row }) => (
    //     <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
    //       {cleanCurrencyDisplay(row.original.processingFee)}
    //     </span>
    //   ),
    // },
    // {
    //   accessorKey: "commissionEarnings",
    //   header: "Commission",
    //   cell: ({ row }) => (
    //     <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
    //       {cleanCurrencyDisplay(row.original.commissionEarnings)}
    //     </span>
    //   ),
    // },
    // {
    //   accessorKey: "itemTax",
    //   header: "Item Tax",
    //   cell: ({ row }) => (
    //     <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
    //       {cleanCurrencyDisplay(row.original.itemTax)}
    //     </span>
    //   ),
    // },
    // {
    //   accessorKey: "refundedAmount",
    //   header: "Refunded",
    //   cell: ({ row }) => {
    //     const isRefunded = (row.original.refundedAmountVal ?? 0) > 0;
    //     return (
    //       <span
    //         className={`font-mono text-xs ${
    //           isRefunded
    //             ? "font-bold text-rose-500 dark:text-rose-400"
    //             : "text-slate-400 dark:text-slate-500"
    //         }`}
    //       >
    //         {isRefunded ? `-${cleanCurrencyDisplay(row.original.refundedAmount)}` : "₹0.00"}
    //       </span>
    //     );
    //   },
    // },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white">
          {cleanCurrencyDisplay(row.original.totalAmount)}
        </span>
      ),
    },
    {
      accessorKey: "orderStatus",
      header: "Status",
      cell: ({ row }) => (
        <OrderStatusBadge
          status={row.original.orderStatus}
          orderType={row.original.orderType}
          label={row.original.statusLabel}
        />
      ),
    },
    {
      accessorKey: "addedOn",
      header: "Order Date",
      cell: ({ row }) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {formatDate(row.original.addedOn)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Action",
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
