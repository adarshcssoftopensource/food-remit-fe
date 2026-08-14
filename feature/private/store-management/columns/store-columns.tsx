"use client";

import {
  type StoreData,
  type StoreStatus,
} from "@/feature/private/store-management/types/store-management";
import { ColumnDef } from "@tanstack/react-table";
import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { StoreActionsCell } from "../components/store-actions-cell";

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

const STORE_STATUS_STYLES: Record<StoreStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Inactive: "bg-red-100 text-red-700 border-red-200",
};

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
    cell: ({ row }) => (
      <ImageNameCell name={row.original.storeName} image={row.original.storeImage} type="profile" />
    ),
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
      <span className="text-sm font-medium text-blue-600">{row.original.storeCountryName}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "storeCity",
    header: "City",
    cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.storeCityName}</span>,
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
