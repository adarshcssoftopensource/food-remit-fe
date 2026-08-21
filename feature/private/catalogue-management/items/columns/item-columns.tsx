import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { ScopeBadge } from "@/components/common/scope-badge";
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
        <div className="space-y-1">
          <span className="text-sm text-slate-600">
            {row.original.departmentDisplayName || row.original.department?.departmentName || "-"}
          </span>
          {(row.original.scopeLabel || row.original.isGlobal !== undefined) && (
            <div>
              <ScopeBadge isGlobal={row.original.isGlobal} scopeLabel={row.original.scopeLabel} />
            </div>
          )}
        </div>
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
      id: "price",
      header: "Price",
      cell: ({ row }) => {
        const placements = Array.isArray(row.original.placements) ? row.original.placements : [];
        const first = placements[0];
        if (!first) {
          return <span className="text-sm text-slate-400">-</span>;
        }
        const amount = Number(first.price);
        const priceText = Number.isFinite(amount) ? amount.toLocaleString() : "-";
        const extra = placements.length > 1 ? ` +${placements.length - 1}` : "";
        return (
          <span className="text-sm font-medium text-slate-700">
            {first.currencySymbol || first.currency || ""} {priceText}
            {extra ? <span className="ml-1 text-xs text-slate-400">{extra}</span> : null}
          </span>
        );
      },
    },
    {
      id: "createdBy",
      header: "Created/Edited by",
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">{row.original.createdBy || "Admin"}</span>
      ),
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
