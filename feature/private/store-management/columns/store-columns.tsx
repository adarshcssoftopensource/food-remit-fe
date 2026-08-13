"use client";

import { type StoreData, STORE_STATUS_STYLES } from "@/constants/store-management";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { StoreActionsCell } from "../components/store-actions-cell";

function StoreNameCell({ store }: { store: StoreData }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-1">
      <div className="relative size-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm">
        {store.storeImage ? (
          <Image
            src={store.storeImage}
            alt={store.storeName}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="from-primary/10 to-primary/15 text-primary flex size-full items-center justify-center bg-linear-to-br text-xs font-bold">
            {store.storeName
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
        )}
      </div>
      <span className="max-w-27.5 text-center text-xs leading-tight font-semibold text-slate-700">
        {store.storeName}
      </span>
    </div>
  );
}

function StoreStatusBadge({ status }: { status: StoreData["status"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${STORE_STATUS_STYLES[status]}`}
    >
      <span
        className={`size-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-red-500"}`}
      />
      {status}
    </span>
  );
}

function TaxCell({ value }: { value: number }) {
  return <span className="text-sm font-medium text-slate-700">{value.toFixed(2)}%</span>;
}

function CommissionCell({ value }: { value: number }) {
  return (
    <span className={`text-sm font-semibold ${value > 0 ? "text-primary" : "text-slate-400"}`}>
      {value.toFixed(2)}%
    </span>
  );
}

export const storeColumns: ColumnDef<StoreData>[] = [
  {
    accessorKey: "id",
    header: "S No.",
    cell: ({ row }) => (
      <span className="pl-2 font-mono text-xs font-medium text-slate-400">{row.index + 1}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "storeName",
    header: "Store Name",
    cell: ({ row }) => <StoreNameCell store={row.original} />,
    enableSorting: true,
  },
  {
    accessorKey: "storeAddress",
    header: "Store Address",
    cell: ({ row }) => (
      <span className="max-w-45 cursor-default text-sm">
        {row.original.storeAddress}
        {row.original.address2 ? `, ${row.original.address2}` : ""}
      </span>
    ),
  },
  {
    accessorKey: "storeCountry",
    header: "Country",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-blue-600">{row.original.storeCountry}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "storeCity",
    header: "City",
    cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.storeCity}</span>,
    enableSorting: true,
  },
  {
    accessorKey: "storeTax",
    header: "Store Tax",
    cell: ({ row }) => <TaxCell value={row.original.storeTax} />,
  },
  {
    accessorKey: "foodRemitCommission",
    header: "Food Remit Commission",
    cell: ({ row }) => <CommissionCell value={row.original.foodRemitCommission} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StoreStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <StoreActionsCell store={row.original} />,
    enableSorting: false,
  },
];
