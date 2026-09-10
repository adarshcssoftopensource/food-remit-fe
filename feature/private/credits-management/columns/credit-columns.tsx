"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, CreditCard, Eye, PackageX, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/date";
import { cleanCurrencyDisplay } from "@/lib/utils/currency";
import type { CreditColumnsOptions, CreditsData } from "../types/credits.types";

export function getCreditColumns({
  onViewDetails,
  onPayRefund,
  isSuperAdmin,
}: CreditColumnsOptions): ColumnDef<CreditsData>[] {
  return [
    {
      id: "sno",
      accessorKey: "date",
      header: "S.No",
      enableSorting: true,
      cell: ({ row, table }) => (
        <span className="pl-2 font-mono text-xs text-slate-500">
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
            row.index +
            1}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-xs whitespace-nowrap text-slate-700 dark:text-slate-300">
          {formatDate(row.original.date || row.original.orderDate)}
        </span>
      ),
    },
    {
      accessorKey: "referenceNumber",
      header: "Reference No",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          {row.original.referenceNumber}
        </span>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.original.customer;
        const displayName = customer?.name || row.original.receiverName || "Customer";
        return (
          <div className="flex items-center gap-2.5">
            {customer?.avatar ? (
              <Image
                src={customer.avatar}
                alt={displayName}
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
            ) : (
              <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="max-w-[150px] truncate">
              <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                {displayName}
              </p>
              {customer?.email && (
                <p className="truncate text-[11px] text-slate-400">{customer.email}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "store",
      header: "Store",
      cell: ({ row }) => {
        const store = row.original.store;
        const storeName = store?.name || row.original.storeName || "Store";
        const isUuid = (s?: string) =>
          Boolean(
            s && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s.trim()),
          );
        const cleanCity = !isUuid(store?.city) ? store?.city : "";
        const cleanCountry = !isUuid(store?.country || row.original.country)
          ? store?.country || row.original.country
          : "";
        const cityCountry = [cleanCity, cleanCountry].filter(Boolean).join(", ");
        const location =
          (store?.address && !isUuid(store.address) ? store.address : "") ||
          store?.fullAddress ||
          cityCountry;
        return (
          <div className="max-w-[180px]">
            <p
              className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200"
              title={storeName}
            >
              {storeName}
            </p>
            {location && (
              <p className="truncate text-[11px] text-slate-400" title={location}>
                {location}
              </p>
            )}
          </div>
        );
      },
    },
    {
      id: "unmarkedItems",
      accessorKey: "unmarkedItemsCount",
      header: "Unmarked Items",
      enableSorting: true,
      cell: ({ row }) => {
        const items = row.original.unmarkedItems || [];
        const count = row.original.unmarkedItemsCount || items.length;

        if (count === 0) {
          return <span className="text-xs text-slate-400">None</span>;
        }

        return (
          <Popover>
            <PopoverTrigger className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400">
              <PackageX className="size-3 text-rose-500" />
              <span>
                {count} {count === 1 ? "Item" : "Items"}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="start">
              <p className="mb-2 text-xs font-bold text-slate-900 dark:text-white">
                Unmarked Items ({count})
              </p>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="truncate pr-2 font-medium text-slate-700 dark:text-slate-300">
                      {it.itemName}
                    </span>
                    <span className="font-mono text-slate-500">x{it.quantity}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      accessorKey: "refundValue",
      header: "Refund Value",
      cell: ({ row }) => (
        <div>
          <span className="font-mono text-xs font-black text-rose-600 dark:text-rose-400">
            {cleanCurrencyDisplay(row.original.refundValue)}
          </span>
          {row.original.totalPaid && (
            <p className="text-[10px] text-slate-400">
              of {cleanCurrencyDisplay(row.original.totalPaid)}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isPending = row.original.status === "Pending";
        return isPending ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
            <span className="size-1.5 animate-pulse rounded-full bg-amber-500" />
            Pending
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Completed
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      enableSorting: false,
      cell: ({ row }) => {
        const orderId = row.original.orderId || row.original.id;
        const isPending = row.original.status === "Pending";

        return (
          <div className="flex items-center gap-2">
            {/* View Details Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(orderId)}
              className="size-8 rounded-full p-0 shadow-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              title="View Credit Details"
            >
              <Eye className="size-3.5 text-slate-600 dark:text-slate-300" />
            </Button>

            {/* Pay / Refund Button (Super Admin Only) */}
            {isPending ? (
              isSuperAdmin ? (
                <Button
                  size="sm"
                  onClick={() => onPayRefund(row.original)}
                  className="h-8 rounded-full bg-rose-600 px-3 text-xs font-semibold text-white shadow-xs hover:bg-rose-700"
                >
                  <CreditCard className="mr-1.5 size-3" />
                  Pay
                </Button>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      disabled
                      className="inline-flex h-8 cursor-not-allowed items-center rounded-full bg-slate-100 px-3 text-xs text-slate-400 dark:bg-slate-800"
                    >
                      <ShieldAlert className="mr-1.5 size-3" />
                      Pay
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Refund execution is restricted to Super Admin.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="size-3" />
                Paid
              </span>
            )}
          </div>
        );
      },
    },
  ];
}
