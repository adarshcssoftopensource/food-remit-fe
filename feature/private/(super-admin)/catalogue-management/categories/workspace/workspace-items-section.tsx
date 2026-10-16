"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { StatusTabs } from "@/components/common/status-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ITEM_STAT_CONFIG } from "@/constants/catalogue-management";
import type { Row } from "@tanstack/react-table";
import { Package } from "lucide-react";
import { getItemColumns } from "../../items/columns/item-columns";
import type { ItemData } from "../../items/types/item.types";
import type { ItemStats, StatusTab } from "../hooks/use-category-workspace";

interface WorkspaceItemsSectionProps {
  categoryName: string;
  stats: ItemStats;
  statusTab: StatusTab;
  onStatusTabChange: (tab: StatusTab) => void;
  isStatusLoading: boolean;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  debouncedSearch: string;
  columns: ReturnType<typeof getItemColumns>;
  items: ItemData[];
  search: string;
  onSearchChange: (value: string) => void;
  isItemsLoading: boolean;
  isStoreScoped?: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
  getRowClassName: (row: Row<ItemData>) => string | undefined;
}

export function WorkspaceItemsSection({
  categoryName,
  stats,
  statusTab,
  onStatusTabChange,
  isStatusLoading,
  pagination,
  debouncedSearch,
  columns,
  items,
  search,
  onSearchChange,
  isItemsLoading,
  isStoreScoped,
  onPageChange,
  onRowsPerPageChange,
  getRowClassName,
}: WorkspaceItemsSectionProps) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {ITEM_STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={stats[key]}
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
          />
        ))}
      </div>

      <StatusTabs
        activeTab={statusTab}
        stats={stats}
        onChange={onStatusTabChange}
        isLoading={isStatusLoading}
      />

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 shrink-0 items-center justify-center rounded-xl ring-1">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Items in {categoryName}
              </CardTitle>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                {pagination.total.toLocaleString()} {pagination.total === 1 ? "item" : "items"}
                {debouncedSearch || statusTab !== "all" ? " match your filters" : ""}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={items}
            searchKey="itemDisplayName"
            searchPlaceholder={
              isStoreScoped
                ? "Search by product name, item number, or UPC..."
                : "Search by product name, store name, item number, or UPC..."
            }
            emptyMessage="No items match your filters"
            searchValue={search}
            onSearchChange={onSearchChange}
            loading={isItemsLoading}
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            rowsPerPage={pagination.limit}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            getRowClassName={getRowClassName}
          />
        </CardContent>
      </Card>
    </>
  );
}
