"use client";

import { useMemo } from "react";
import { Package } from "lucide-react";

import { DataTable } from "@/components/common/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderItemColumns, OrderItemRow } from "../columns/order-item-columns";

export type OrderItem = OrderItemRow;

export interface ItemStats {
  allCount: number;
  availableCount: number;
  deliveredCount: number;
}

interface OrderItemsTableProps {
  orderItems: OrderItem[];
  currency: string;
  itemStats?: ItemStats;
  itemFilter: "all" | "available" | "delivered";
  onItemFilterChange: (filter: "all" | "available" | "delivered") => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
  onSortingChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  loading?: boolean;
  onPreviewImage: (url: string) => void;
}

export function OrderItemsTable({
  orderItems = [],
  currency,
  itemStats = { allCount: 0, availableCount: 0, deliveredCount: 0 },
  itemFilter,
  onItemFilterChange,
  searchValue,
  onSearchChange,
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSortingChange,
  loading = false,
  onPreviewImage,
}: OrderItemsTableProps) {
  const columns = useMemo(
    () => getOrderItemColumns(currency, onPreviewImage),
    [currency, onPreviewImage],
  );

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center dark:border-slate-800">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-white">
            <Package className="text-primary size-5" />
            View Items in Order
          </CardTitle>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Comprehensive list of ordered items, quantities, pricing, and barcode references
          </p>
        </div>

        {/* Backend Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <Button
            variant={itemFilter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => onItemFilterChange("all")}
            className="h-7 rounded-lg px-3 text-xs font-semibold"
          >
            All ({itemStats.allCount})
          </Button>
          <Button
            variant={itemFilter === "available" ? "default" : "ghost"}
            size="sm"
            onClick={() => onItemFilterChange("available")}
            className="h-7 rounded-lg px-3 text-xs font-semibold"
          >
            Available ({itemStats.availableCount})
          </Button>
          <Button
            variant={itemFilter === "delivered" ? "default" : "ghost"}
            size="sm"
            onClick={() => onItemFilterChange("delivered")}
            className="h-7 rounded-lg px-3 text-xs font-semibold"
          >
            Delivered ({itemStats.deliveredCount})
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <DataTable
          columns={columns}
          data={orderItems}
          loading={loading}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          onSortingChange={(sortingState) => {
            if (sortingState.length > 0) {
              onSortingChange(sortingState[0].id, sortingState[0].desc ? "desc" : "asc");
            }
          }}
          manualSorting={true}
          manualFiltering={true}
          manualPagination={true}
        />
      </CardContent>
    </Card>
  );
}
