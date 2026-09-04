import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
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
  isStoreScoped?: boolean,
): ColumnDef<ItemData>[] {
  const columns: ColumnDef<ItemData>[] = [
    {
      id: "serial",
      header: "S.no",
      cell: ({ row, table }) => (
        <span className="pl-2 text-sm font-medium text-slate-500">
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
            row.index +
            1}
        </span>
      ),
    },
    {
      accessorKey: "productName",
      header: "Product Name",
      cell: ({ row }) => (
        <ImageNameCell
          name={row.original.productName}
          image={
            row.original.productImageUrls?.[0] ||
            row.original.productImageUrl ||
            (row.original.productImage?.startsWith("http")
              ? row.original.productImage.split(",")[0]?.trim()
              : null)
          }
          onImageClick={onImageClick}
          enableZoom={!!onImageClick}
        />
      ),
    },
    {
      id: "storeName",
      header: "Store Name",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-700">
          {row.original.storeName || row.original.store?.storeName || "-"}
        </span>
      ),
    },
    {
      id: "departmentName",
      header: "Department",
      cell: ({ row }) => (
        <div className="space-y-1">
          <TruncatedTextCell
            maxWords={2}
            className="text-sm text-slate-600"
            text={
              isStoreScoped
                ? row.original.department?.departmentName ||
                  row.original.departmentDisplayName ||
                  "-"
                : row.original.departmentDisplayName ||
                  row.original.department?.departmentName ||
                  "-"
            }
          />
          {!isStoreScoped && (row.original.scopeLabel || row.original.isGlobal !== undefined) && (
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
        <TruncatedTextCell
          maxWords={2}
          text={row.original.category?.categoryName || "-"}
          className="text-sm text-slate-600"
        />
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
            {first.currencySymbol || ""} {priceText}
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
      header: () => <div className="text-center">Availability</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ItemAvailabilityCell item={row.original} />
        </div>
      ),
    },
    {
      id: "adminShare",
      header: () => <div className="text-center">Food Remit Markup</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ItemAdminShareCell item={row.original} />
        </div>
      ),
    },
    {
      id: "discountAvailability",
      header: () => <div className="text-center">Discount Availability</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ItemDiscountAvailabilityCell item={row.original} />
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ItemActionsCell item={row.original} onEdit={onEdit} onView={onView} />,
    },
  ];

  return isStoreScoped
    ? columns.filter((col) => {
        const colId = col.id || (col as any).accessorKey;
        return colId !== "createdBy" && colId !== "storeName";
      })
    : columns;
}
