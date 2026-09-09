"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { QrCode, ZoomIn } from "lucide-react";

import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { Badge } from "@/components/ui/badge";
import { getCurrencySymbol } from "@/lib/utils/currency";

export interface OrderItemRow {
  id: string;
  itemId: string;
  productName: string;
  productIcon: string;
  baseQuantity: string;
  quantityUnit: string;
  quantity: number;
  price: number;
  barCode?: string;
  barcode?: string;
  qrCode?: string | null;
  qrCodeImage?: string | null;
  productQrCode?: string | null;
  productBarcode?: string | null;
  barcodeValue?: string | null;
  upcCode?: string | null;
  deliveredStatus: number;
}

export function getOrderItemColumns(
  currency: string,
  onPreviewImage: (url: string) => void,
): ColumnDef<OrderItemRow>[] {
  const symbol = getCurrencySymbol(currency);
  return [
    {
      id: "sno",
      header: "S.No",
      cell: ({ row, table }) => {
        const index = row.index;
        const pageIndex = table.getState().pagination.pageIndex || 0;
        const pageSize = table.getState().pagination.pageSize || 50;
        return (
          <span className="pl-2 font-mono text-xs text-slate-500">
            {pageIndex * pageSize + index + 1}
          </span>
        );
      },
    },
    {
      accessorKey: "productName",
      header: "Item Details",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => item.productIcon && onPreviewImage(item.productIcon)}
              className="group hover:ring-primary/40 relative size-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:ring-2 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
              title="Click to preview image"
            >
              {item.productIcon ? (
                <Image
                  src={item.productIcon}
                  alt={item.productName}
                  width={44}
                  height={44}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-slate-100 dark:bg-slate-800">
                  <span className="text-xs font-semibold text-slate-400">No Img</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="size-4 text-white drop-shadow-md" />
              </div>
            </button>
            <div>
              <TruncatedTextCell
                text={item.productName}
                maxWords={4}
                className="text-sm font-bold text-slate-900 dark:text-white"
              />
              <p className="text-muted-foreground text-xs">
                Base: {item.baseQuantity}{" "}
                {/^(INR|USD|PHP|EUR|GBP|CAD|AUD|₹|\$|€|£|Rs)$/i.test(item.quantityUnit)
                  ? "Pcs"
                  : item.quantityUnit}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => (
        <div className="text-start">
          <Badge
            variant="outline"
            className="rounded-lg bg-slate-100 px-2.5 py-0.5 font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            x{row.original.quantity}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Unit Price",
      cell: ({ row }) => (
        <div className="text-start font-medium text-slate-700 dark:text-slate-300">
          {symbol}
          {Number(row.original.price).toFixed(2)}
        </div>
      ),
    },
    {
      id: "totalPrice",
      header: "Total Price",
      cell: ({ row }) => {
        const total = Number(row.original.price) * row.original.quantity;
        return (
          <div className="text-start font-extrabold text-slate-900 dark:text-white">
            {symbol}
            {total.toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "deliveredStatus",
      header: "Delivery Status",
      cell: ({ row }) => (
        <div className="text-start">
          {row.original.deliveredStatus === 1 ? (
            <Badge className="rounded-full border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Delivered
            </Badge>
          ) : (
            <Badge className="rounded-full border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              Available
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: "qrCode",
      header: "QR Code",
      cell: ({ row }) => {
        const item = row.original;
        // Directly consume dynamic QR code generated and sent by the backend
        const qrCodeUrl = item.qrCode || item.qrCodeImage || item.productQrCode;

        if (!qrCodeUrl || (!qrCodeUrl.startsWith("http") && !qrCodeUrl.startsWith("data:"))) {
          return <div className="text-muted-foreground text-start text-xs">—</div>;
        }

        return (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onPreviewImage(qrCodeUrl)}
              className="group hover:ring-primary/40 relative size-11 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-1 transition-all hover:ring-2 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
              title="Click to preview QR Code"
            >
              <Image
                src={qrCodeUrl}
                alt="Item QR Code"
                width={40}
                height={40}
                unoptimized
                className="size-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="size-4 text-white drop-shadow-md" />
              </div>
            </button>
            <div className="hidden flex-col sm:flex">
              <div className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
                <QrCode className="size-3 shrink-0 text-emerald-500" />
                <span>QR Code</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Scan to Verify</span>
            </div>
          </div>
        );
      },
    },
  ];
}
