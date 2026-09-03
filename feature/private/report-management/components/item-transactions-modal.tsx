"use client";

import { useState } from "react";
import Image from "next/image";
import { CreditCard, ShoppingBag } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/common/data-table/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { useTableFilters } from "@/hooks/use-table-filters";
import { ColumnDef } from "@tanstack/react-table";
import {
  useGetItemTransactions,
  type ItemTransactionRow,
} from "../hooks/use-get-item-transactions";
import type { StoreItemRow } from "../hooks/use-get-store-items";

interface ItemTransactionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  item: StoreItemRow | null;
}

export function ItemTransactionsModal({
  open,
  onOpenChange,
  storeId,
  item,
}: ItemTransactionsModalProps) {
  const tableFilters = useTableFilters(10);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { data: response, isLoading } = useGetItemTransactions(
    storeId,
    item?.id || "",
    {
      page: tableFilters.page,
      limit: tableFilters.limit,
      search: tableFilters.debouncedSearch.trim() || undefined,
    },
    open && Boolean(item?.id),
  );

  const transactions = response?.data?.transactions || [];
  const pagination = response?.pagination;

  const columns: ColumnDef<ItemTransactionRow>[] = [
    {
      id: "sno",
      header: "S.No",
      cell: ({ row, table }) => (
        <span className="pl-2 font-mono text-xs font-semibold text-slate-500">
          {(tableFilters.page - 1) * tableFilters.limit + row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "referenceNumber",
      header: "Order / Ref No.",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
            #{row.original.referenceNumber}
          </span>
          <span className="max-w-[120px] truncate text-[11px] text-slate-400">
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
          <div className="flex items-center gap-2.5">
            <div
              onClick={() => cust.image && setLightboxImage(cust.image)}
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xs font-bold text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 ${
                cust.image ? "cursor-pointer transition hover:opacity-80" : ""
              }`}
            >
              {cust.image ? (
                <Image
                  src={cust.image}
                  alt={cust.name}
                  width={36}
                  height={36}
                  className="size-9 rounded-xl object-cover"
                />
              ) : (
                cust.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
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
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
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
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-900 dark:bg-slate-800 dark:text-slate-200">
          {row.original.quantity} {item?.unit || "pcs"}
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
      cell: ({ row }) => {
        const status = row.original.orderStatus;
        return (
          <StatusBadge
            status={status}
            className="rounded-full border-0 px-2.5 py-0.5 text-[11px]"
          />
        );
      },
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-0 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <DialogHeader className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  onClick={() => item?.productImage && setLightboxImage(item.productImage)}
                  className={`relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-800 ${
                    item?.productImage ? "cursor-pointer transition hover:opacity-85" : ""
                  }`}
                >
                  {item?.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-slate-400">
                      <ShoppingBag className="size-5" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                      {item?.productName || "Item Transactions"}
                    </DialogTitle>
                    <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-950/60 dark:text-orange-400">
                      UPC: {item?.upcCode || "N/A"}
                    </span>
                  </div>

                  <DialogDescription className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Customer transaction history for this item.
                  </DialogDescription>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/60">
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Units Sold
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {item?.totalUnitsSold || 0} {item?.unit || "pcs"}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/60">
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Total Sales
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {item?.totalSalesAmount || "$0.00"}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="p-5">
            <DataTable
              columns={columns}
              data={transactions}
              searchValue={tableFilters.searchQuery}
              onSearchChange={tableFilters.setSearchQuery}
              currentPage={tableFilters.page}
              totalPages={pagination?.totalPages || 1}
              rowsPerPage={tableFilters.limit}
              onPageChange={tableFilters.setPage}
              onRowsPerPageChange={tableFilters.setLimit}
              manualPagination={true}
              manualFiltering={true}
              loading={isLoading}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </>
  );
}
