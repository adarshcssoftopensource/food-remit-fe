import { ColumnDef } from "@tanstack/react-table";

import {
  ItemActionsCell,
  ItemAdminShareCell,
  ItemAvailabilityCell,
  ItemDiscountAvailabilityCell,
} from "../components/shared/item-actions-cell";
import {
  ItemCategoryCell,
  ItemIdentityCell,
  ItemPacksPriceCell,
} from "../components/shared/item-table-cells";
import { StockIndicator } from "../components/shared/stock-indicator";
import { ItemData } from "../types/item.types";

export function getItemColumns(
  onEdit: (item: ItemData) => void,
  onView: (item: ItemData) => void,
  onImageClick?: (image: string) => void,
  isStoreScoped?: boolean,
  canManageMarkup?: boolean,
  options?: { hideCategory?: boolean },
): ColumnDef<ItemData>[] {
  const columns: ColumnDef<ItemData>[] = [
    {
      id: "serial",
      header: "#",
      cell: ({ row, table }) => (
        <span className="pl-1 text-xs font-medium text-slate-400 tabular-nums">
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
            row.index +
            1}
        </span>
      ),
    },
    {
      accessorKey: "productName",
      header: "Item",
      cell: ({ row }) => (
        <ItemIdentityCell item={row.original} onView={onView} onImageClick={onImageClick} />
      ),
    },
    {
      id: "categoryName",
      header: isStoreScoped ? "Category" : "Category / Store",
      cell: ({ row }) => (
        <ItemCategoryCell
          item={row.original}
          showScope={!isStoreScoped}
          showStore={!isStoreScoped}
        />
      ),
    },
    {
      id: "price",
      header: "Packs & price",
      cell: ({ row }) => <ItemPacksPriceCell item={row.original} />,
    },
    {
      id: "stockQuantity",
      header: "Quantity on hand",
      cell: ({ row }) => (
        <StockIndicator
          quantity={row.original.quantityOnHand ?? row.original.stockQuantity}
          lowStockThreshold={5}
        />
      ),
    },
    {
      id: "availability",
      header: () => <div className="text-center">Available</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ItemAvailabilityCell item={row.original} />
        </div>
      ),
    },
    {
      id: "adminShare",
      header: () => <div className="text-center">Automated markup</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ItemAdminShareCell item={row.original} isSuperAdmin={!!canManageMarkup} />
        </div>
      ),
    },
    {
      id: "discountAvailability",
      header: () => <div className="text-center">Discount</div>,
      cell: ({ row }) => {
        const pct = Number(row.original.discountPercentage) || 0;
        return (
          <div className="relative flex justify-center">
            <ItemDiscountAvailabilityCell item={row.original} />
            {pct > 0 ? (
              <span className="absolute top-full mt-0.5 text-[10px] font-semibold whitespace-nowrap text-emerald-600 tabular-nums dark:text-emerald-400">
                {pct}% off
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ItemActionsCell item={row.original} onEdit={onEdit} onView={onView} />,
    },
  ];

  return columns.filter((col) => {
    const colId = col.id || (col as { accessorKey?: string }).accessorKey;
    if (!canManageMarkup && colId === "adminShare") return false;
    if (options?.hideCategory && colId === "categoryName") return false;
    return true;
  });
}
