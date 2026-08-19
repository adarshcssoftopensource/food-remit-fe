"use client";

import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { StatusBadge } from "@/components/common/status-badge";
import { type StoreData } from "@/feature/private/store-management/types/store-management";
import { ColumnDef } from "@tanstack/react-table";
import { StoreActionsCell } from "../components/store-actions-cell";

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
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <StoreActionsCell store={row.original} />,
    enableSorting: false,
  },
];
