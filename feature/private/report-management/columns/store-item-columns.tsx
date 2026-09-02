"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Package, ZoomIn } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import type { StoreItemRow } from "../hooks/use-get-store-items";

interface GetStoreItemColumnsProps {
  storeId: string;
  page: number;
  limit: number;
  onImageClick: (url: string) => void;
}

export function getStoreItemColumns({
  storeId,
  page,
  limit,
  onImageClick,
}: GetStoreItemColumnsProps): ColumnDef<StoreItemRow>[] {
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
      id: "productName",
      accessorKey: "productName",
      header: "Item Details",
      enableSorting: true,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3 py-0.5">
            <div
              onClick={() => item.productImage && onImageClick(item.productImage)}
              className={`group relative size-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800 ${
                item.productImage ? "cursor-pointer" : ""
              }`}
            >
              {item.productImage ? (
                <>
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomIn className="size-3.5 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex size-full items-center justify-center text-slate-400">
                  <Package className="size-4" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {item.productName}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span>UPC: {item.upcCode || "N/A"}</span>
                <span>•</span>
                <span>Unit: {item.unit}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "category",
      header: "Category & Dept",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {row.original.categoryName}
          </span>
          <span className="text-[11px] text-slate-400">{row.original.departmentName}</span>
        </div>
      ),
    },
    {
      id: "price",
      accessorKey: "price",
      header: "Unit Price",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
          ${row.original.price.toFixed(2)} {row.original.currency}
        </span>
      ),
    },
    {
      id: "totalUnitsSold",
      accessorKey: "totalUnitsSold",
      header: "Units Sold",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-lg bg-orange-50 px-2 py-0.5 font-mono text-xs font-bold text-orange-700 dark:bg-orange-950/50 dark:text-orange-400">
          {row.original.totalUnitsSold} {row.original.unit}
        </span>
      ),
    },
    {
      id: "totalTransactionsCount",
      accessorKey: "totalTransactionsCount",
      header: "Transactions",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
          {row.original.totalTransactionsCount} orders
        </span>
      ),
    },
    {
      id: "totalSalesAmount",
      accessorKey: "totalSalesAmount",
      header: "Total Revenue",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
          {row.original.totalSalesAmount}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link
          href={ROUTES.ADMIN.REPORT_MANAGEMENT.STORE_REPORT_ITEM_TRANSACTIONS(
            storeId,
            row.original.id,
          )}
        >
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 rounded-lg border-orange-200 bg-orange-50 px-2.5 text-xs font-semibold text-orange-700 hover:bg-orange-100 hover:text-orange-800 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-400 dark:hover:bg-orange-900/60"
          >
            <Eye className="size-3.5" />
            View Transactions
          </Button>
        </Link>
      ),
    },
  ];
}
