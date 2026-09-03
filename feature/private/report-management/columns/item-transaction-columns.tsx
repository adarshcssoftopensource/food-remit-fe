"use client";

import Image from "next/image";
import { CreditCard } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { StatusBadge } from "@/components/common/status-badge";
import type { ItemTransactionRow } from "../hooks/use-get-item-transactions";

interface GetItemTransactionColumnsProps {
  page: number;
  limit: number;
  itemUnit?: string;
  onImageClick: (url: string) => void;
}

export function getItemTransactionColumns({
  page,
  limit,
  itemUnit = "pcs",
  onImageClick,
}: GetItemTransactionColumnsProps): ColumnDef<ItemTransactionRow>[] {
  return [
    {
      id: "sno",
      header: "S.No",
      cell: ({ row }) => (
        <span className="pl-2 font-mono text-xs font-semibold text-slate-500">
          {(page - 1) * limit + row.index + 1}
        </span>
      ),
    },
    {
      id: "referenceNumber",
      accessorKey: "referenceNumber",
      header: "Order / Ref No.",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
            #{row.original.referenceNumber}
          </span>
          <span className="max-w-[130px] truncate font-mono text-[11px] text-slate-400">
            {row.original.orderId}
          </span>
        </div>
      ),
    },
    {
      id: "customer",
      header: "Purchased By (Customer)",
      cell: ({ row }) => {
        const cust = row.original.customer;
        return (
          <div className="flex items-center gap-3">
            <div
              onClick={() => cust.image && onImageClick(cust.image)}
              className={`relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-100 text-xs font-bold text-orange-600 dark:bg-orange-950/50 dark:text-orange-400 ${
                cust.image ? "cursor-pointer transition hover:opacity-85" : ""
              }`}
            >
              {cust.image ? (
                <Image
                  src={cust.image}
                  alt={cust.name}
                  width={40}
                  height={40}
                  className="size-10 rounded-xl object-cover"
                />
              ) : (
                cust.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {cust.name}
              </span>
              <span className="text-[11px] text-slate-500">{cust.email}</span>
              {cust.phone && cust.phone !== "-" && (
                <span className="font-mono text-[10px] text-slate-400">{cust.phone}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "receiver",
      header: "Receiver",
      cell: ({ row }) => {
        const rec = row.original.receiver;
        if (!rec || rec.name === "-") {
          return <span className="text-xs text-slate-400">—</span>;
        }
        return (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {rec.name}
            </span>
            <span className="text-[11px] text-slate-400">
              {[rec.city, rec.country].filter((x) => x && x !== "-").join(", ")}
            </span>
          </div>
        );
      },
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: "Quantity",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-900 dark:bg-slate-800 dark:text-slate-200">
          {row.original.quantity} {itemUnit}
        </span>
      ),
    },
    {
      id: "price",
      header: "Unit / Total Price",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {row.original.totalAmountFormatted}
          </span>
          <span className="text-[10px] text-slate-400">
            (${row.original.unitPrice.toFixed(2)} / unit)
          </span>
        </div>
      ),
    },
    {
      id: "date",
      header: "Date & Time",
      cell: ({ row }) => {
        const d = new Date(row.original.date);
        const formattedDate = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const formattedTime = d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {formattedDate}
            </span>
            <span className="text-[10px] text-slate-400">{formattedTime}</span>
          </div>
        );
      },
    },
    {
      id: "orderStatus",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.orderStatus} className="rounded-full text-[11px]" />
      ),
    },
    {
      id: "payment",
      header: "Payment Method",
      cell: ({ row }) => {
        const pay = row.original.payment;
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <CreditCard className="size-3.5 text-slate-400" />
            <span>
              {pay.cardType} ({pay.lastFourDigit})
            </span>
          </div>
        );
      },
    },
  ];
}
