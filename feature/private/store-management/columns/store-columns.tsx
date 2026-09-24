"use client";

import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
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

function AdminBadge({
  admin,
  fallback = "—",
}: {
  admin?: StoreData["approvedByAdmin"];
  fallback?: string;
}) {
  if (!admin) return <span className="text-xs text-slate-400">{fallback}</span>;

  const name = admin.firstName ? `${admin.firstName} ${admin.lastName || ""}`.trim() : admin.name;
  let roleText = admin.userType;
  if (roleText === "SUPER_ADMIN") roleText = "Super Admin";
  if (roleText === "SUB_ADMIN") roleText = "Sub Admin";
  if (roleText === "CO_ADMIN") roleText = "Co Admin";

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{name}</span>
      <span className="inline-flex w-fit items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20">
        {roleText}
      </span>
    </div>
  );
}

export const storeColumns = (
  onImageClick?: (image: string) => void,
  options?: { showPlatformFees?: boolean },
): ColumnDef<StoreData>[] => {
  const showPlatformFees = !!options?.showPlatformFees;
  const columns: ColumnDef<StoreData>[] = [
    {
      accessorKey: "id",
      header: "S No.",
      cell: ({ row, table }) => (
        <span className="pl-2 font-mono text-xs font-medium text-slate-400">
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
            row.index +
            1}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "storeName",
      header: "Store Name",
      cell: ({ row }) => (
        <ImageNameCell
          name={row.original.storeName}
          image={row.original.storeImage || "/default-store.svg"}
          type="profile"
          onImageClick={onImageClick}
          enableZoom={!!onImageClick}
        />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "storeAddress",
      header: "Store Address",
      cell: ({ row }) => (
        <TruncatedTextCell
          maxWords={1}
          text={`${row.original.storeAddress}${row.original.address2 ? `, ${row.original.address2}` : ""}`}
          className="max-w-45 cursor-default text-sm"
        />
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
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">{row.original.storeCityName}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "storeTax",
      header: "Government Store Tax",
      cell: ({ row }) => <TaxCell value={row.original.storeTax} />,
    },
  ];

  if (showPlatformFees) {
    columns.push({
      accessorKey: "foodRemitCommission",
      header: "Food Remit Commission",
      cell: ({ row }) => <CommissionCell value={row.original.foodRemitCommission} />,
    });
  }

  columns.push(
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "approvedBy",
      header: "Approved By",
      cell: ({ row }) => <AdminBadge admin={row.original.approvedByAdmin} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <StoreActionsCell store={row.original} />,
      enableSorting: false,
    },
  );

  return columns;
};
