import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import {
  ItemActionsCell,
  ItemAdminShareCell,
  ItemAvailabilityCell,
  ItemDiscountAvailabilityCell,
} from "../components/item-actions-cell";
import { ItemData } from "../types/item.types";

export function getItemColumns(
  onEdit: (item: ItemData) => void,
  onView: (item: ItemData) => void,
  onImageClick?: (image: string) => void,
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
      cell: ({ row }) => (
        <ImageNameCell
          name={row.original.productName}
          image={row.original.productImage?.split(",")[0]?.trim()}
          onImageClick={onImageClick}
          enableZoom={!!onImageClick}
        />
      ),
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
