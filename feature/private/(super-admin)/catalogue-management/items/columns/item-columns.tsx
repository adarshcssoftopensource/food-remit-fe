import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { ScopeBadge } from "@/components/common/scope-badge";
import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import {
  ItemActionsCell,
  ItemAdminShareCell,
  ItemAvailabilityCell,
  ItemDiscountAvailabilityCell,
} from "../components/item-actions-cell";
import { StockIndicator } from "../components/stock-indicator";
import { ItemData } from "../types/item.types";

export function getItemColumns(
  onEdit: (item: ItemData) => void,
  onView: (item: ItemData) => void,
  onImageClick?: (image: string) => void,
  isStoreScoped?: boolean,
  canManageMarkup?: boolean,
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
      cell: ({ row }) => {
        const options = Array.isArray(row.original.options) ? row.original.options : [];
        return (
          <div className="flex flex-col gap-1">
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
            {options.length > 1 && (
              <div className="pl-[3.25rem]">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20">
                  {options.length} Variants
                </span>
              </div>
            )}
          </div>
        );
      },
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
      id: "categoryName",
      header: "Category",
      cell: ({ row }) => (
        <div className="space-y-1">
          <TruncatedTextCell
            maxWords={2}
            text={row.original.category?.categoryName || "-"}
            className="text-sm text-slate-600"
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
      id: "price",
      header: "Price",
      cell: ({ row }) => {
        const options = Array.isArray(row.original.options) ? row.original.options : [];
        const placements = Array.isArray(row.original.placements) ? row.original.placements : [];
        const first = placements[0];
        const currencySymbol = first?.currencySymbol || "";

        if (options.length > 0) {
          const prices = options.map((o) => Number(o.price)).filter(Number.isFinite);
          if (prices.length > 0) {
            const min = Math.min(...prices);
            const max = Math.max(...prices);

            const priceDisplay =
              min === max
                ? `${currencySymbol}${min.toLocaleString()}`
                : `${currencySymbol}${min.toLocaleString()} - ${currencySymbol}${max.toLocaleString()}`;

            if (options.length === 1) {
              return <span className="text-sm font-medium text-slate-700">{priceDisplay}</span>;
            }

            return (
              <Popover>
                <PopoverTrigger>
                  <span className="cursor-help text-sm font-medium text-slate-700 underline decoration-slate-300 decoration-dashed underline-offset-4 hover:text-slate-900 dark:text-slate-300 dark:decoration-slate-600 dark:hover:text-white">
                    {priceDisplay}
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 text-sm" side="top">
                  <div className="mb-2 border-b border-slate-100 pb-1 font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
                    Variant Prices
                  </div>
                  <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto">
                    {options.map((opt) => (
                      <div key={opt.id} className="flex items-center justify-between text-xs">
                        <span
                          className="mr-2 truncate text-slate-600 dark:text-slate-400"
                          title={opt.optionName}
                        >
                          {opt.optionName}
                        </span>
                        <span className="shrink-0 font-medium text-slate-900 dark:text-slate-200">
                          {currencySymbol}
                          {Number(opt.price).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            );
          }
        }

        if (!first) {
          return <span className="text-sm text-slate-400">-</span>;
        }

        const amount = Number(first.price);
        const priceText = Number.isFinite(amount) ? amount.toLocaleString() : "-";
        const extra = placements.length > 1 ? ` +${placements.length - 1}` : "";
        return (
          <span className="text-sm font-medium text-slate-700">
            {currencySymbol} {priceText}
            {extra ? <span className="ml-1 text-xs text-slate-400">{extra}</span> : null}
          </span>
        );
      },
    },
    {
      id: "stockQuantity",
      header: "Stock Quantity",
      cell: ({ row }) => {
        const options = Array.isArray(row.original.options) ? row.original.options : [];
        if (options.length > 1) {
          const totalStock = options.reduce(
            (sum, opt) => sum + (Number(opt.stockQuantity) || 0),
            0,
          );
          return (
            <Popover>
              <PopoverTrigger>
                <div className="flex w-max cursor-help flex-col gap-0.5">
                  <StockIndicator quantity={totalStock} lowStockThreshold={5} />
                  <span className="text-[10px] font-medium text-slate-400 underline decoration-slate-300 decoration-dashed underline-offset-2 hover:text-slate-900 dark:hover:text-white">
                    Multiple variants
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 text-sm" side="top">
                <div className="mb-2 border-b border-slate-100 pb-1 font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
                  Variant Stock
                </div>
                <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto">
                  {options.map((opt) => (
                    <div key={opt.id} className="flex items-center justify-between text-xs">
                      <span
                        className="mr-2 truncate text-slate-600 dark:text-slate-400"
                        title={opt.optionName}
                      >
                        {opt.optionName}
                      </span>
                      <span className="shrink-0">
                        <StockIndicator quantity={opt.stockQuantity} lowStockThreshold={5} />
                      </span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          );
        }
        return <StockIndicator quantity={row.original.stockQuantity} lowStockThreshold={5} />;
      },
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
      header: () => <div className="text-center">Automated Markup</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ItemAdminShareCell item={row.original} isSuperAdmin={!!canManageMarkup} />
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

  return columns.filter((col) => {
    const colId = col.id || (col as any).accessorKey;
    if (!canManageMarkup && colId === "adminShare") return false;
    if (isStoreScoped && (colId === "createdBy" || colId === "storeName")) return false;
    return true;
  });
}
