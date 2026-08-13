import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Package } from "lucide-react";
import { ItemData } from "../types/item.types";
import {
  ItemActionsCell,
  ItemAvailabilityCell,
  ItemAdminShareCell,
  ItemDiscountAvailabilityCell,
} from "../components/item-actions-cell";
import { formatDate } from "@/lib/date";

function ItemNameCell({ row }: { row: { original: ItemData } }) {
  const { productName, productImageUrl } = row.original;
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border bg-slate-50">
        {productImageUrl ? (
          <Image src={productImageUrl} alt={productName} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-5 w-5 text-slate-300" />
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-800">{productName}</p>
      </div>
    </div>
  );
}

export function getItemColumns(
  onEdit: (item: ItemData) => void,
  onView: (item: ItemData) => void,
): ColumnDef<ItemData>[] {
  return [
    {
      id: "serial",
      header: "S.no",
      cell: ({ row }) => (
        <span className="pl-2 text-sm font-medium text-slate-500">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "productName",
      header: "Product Name",
      cell: ({ row }) => <ItemNameCell row={row} />,
    },
    {
      id: "storeName",
      header: "Store Name",
      cell: () => <span className="text-sm font-medium text-slate-700">Main Store</span>,
    },
    {
      id: "departmentName",
      header: "Department",
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">
          {row.original.department?.departmentName || "-"}
        </span>
      ),
    },
    {
      id: "categoryName",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">{row.original.category?.categoryName || "-"}</span>
      ),
    },
    {
      id: "createdBy",
      header: "Created/Edited by",
      cell: () => <span className="text-sm text-slate-600">Admin</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created/Edited On",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "availability",
      header: "Availability",
      cell: ({ row }) => <ItemAvailabilityCell item={row.original} />,
    },
    {
      id: "adminShare",
      header: "Admin Share",
      cell: ({ row }) => <ItemAdminShareCell item={row.original} />,
    },
    {
      id: "discountAvailability",
      header: "Discount Availability",
      cell: ({ row }) => <ItemDiscountAvailabilityCell item={row.original} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ItemActionsCell item={row.original} onEdit={onEdit} onView={onView} />,
    },
  ];
}
