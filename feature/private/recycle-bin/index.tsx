"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDebounce } from "@/lib/debounce";
import { RowSelectionState, SortingState } from "@tanstack/react-table";
import { Building2, FolderTree, Globe, MapPin, Package, Store, Users } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { RecycleBinTable } from "./components/recycle-bin-table";
import { RecycleEntityType, useGetRecycledData } from "./hooks/use-get-recycled-data";
import {
  useBulkPermanentDeleteEntities,
  useBulkRestoreEntities,
} from "./hooks/use-recycle-bin-actions";

const ENTITY_TABS: {
  id: RecycleEntityType;
  label: string;
  icon: any;
}[] = [
  { id: "users", label: "Users", icon: Users },
  { id: "stores", label: "Stores", icon: Store },
  { id: "items", label: "Items", icon: Package },
  { id: "departments", label: "Departments", icon: Building2 },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "city-managers", label: "City Managers", icon: MapPin },
  { id: "country-managers", label: "Country Managers", icon: Globe },
];

export function RecycledUsersManagement() {
  const [activeTab, setActiveTab] = useState<RecycleEntityType>("users");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isBulkRestoreDialogOpen, setIsBulkRestoreDialogOpen] = useState(false);
  const [isBulkPermanentDeleteDialogOpen, setIsBulkPermanentDeleteDialogOpen] = useState(false);

  const bulkRestore = useBulkRestoreEntities(activeTab);
  const bulkPermanentDelete = useBulkPermanentDeleteEntities(activeTab);

  const queryArgs = {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
    sortBy: sorting[0]?.id || undefined,
    sortOrder: (sorting[0]?.desc ? "desc" : sorting[0] ? "asc" : undefined) as
      "asc" | "desc" | undefined,
  };

  const { formattedData, isLoading } = useGetRecycledData(activeTab, queryArgs);

  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection).filter((id) => rowSelection[id]);
  }, [rowSelection]);

  const handleTabChange = (tabId: RecycleEntityType) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSearch("");
    setRowSelection({});
    setSorting([]);
  };

  const handleBulkRestore = () => {
    bulkRestore.mutate(
      { ids: selectedIds },
      {
        onSuccess: () => {
          toast.success(`${selectedIds.length} records restored successfully.`);
          setRowSelection({});
          setIsBulkRestoreDialogOpen(false);
        },
        onError: () => {
          toast.error("Failed to restore selected records.");
        },
      },
    );
  };

  const handleBulkPermanentDelete = () => {
    bulkPermanentDelete.mutate(
      { ids: selectedIds },
      {
        onSuccess: () => {
          toast.success(`${selectedIds.length} records permanently deleted.`);
          setRowSelection({});
          setIsBulkPermanentDeleteDialogOpen(false);
        },
        onError: () => {
          toast.error("Failed to permanently delete selected records.");
        },
      },
    );
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRowsPerPageChange = useCallback((limit: number) => {
    setRowsPerPage(limit);
    setCurrentPage(1);
  }, []);

  const handleSortingChange = useCallback((nextSorting: SortingState) => {
    setSorting(nextSorting);
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recycle Bin"
        description="View, restore, or permanently delete soft-deleted records across all modules."
      />

      {/* Entity Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        {ENTITY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-md hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                  : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400"
              }`}
            >
              <Icon className="h-3.75 w-3.75" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      <RecycleBinTable
        entityType={activeTab}
        data={formattedData?.data || []}
        isLoading={isLoading}
        searchValue={search}
        currentPage={currentPage}
        totalPages={formattedData?.pagination?.totalPages ?? 1}
        rowsPerPage={rowsPerPage}
        rowSelection={rowSelection}
        selectedCount={selectedIds.length}
        onSearchChange={handleSearchChange}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSortingChange={handleSortingChange}
        onRowSelectionChange={setRowSelection}
        onBulkRestoreClick={() => setIsBulkRestoreDialogOpen(true)}
        onBulkPermanentDeleteClick={() => setIsBulkPermanentDeleteDialogOpen(true)}
      />

      <ConfirmationDialog
        open={isBulkRestoreDialogOpen}
        onOpenChange={setIsBulkRestoreDialogOpen}
        title="Restore Selected Records"
        description={`Are you sure you want to restore ${selectedIds.length} selected records? They will be active in the system again.`}
        confirmLabel="Restore Records"
        onConfirm={handleBulkRestore}
        isLoading={bulkRestore.isPending}
      />

      <ConfirmationDialog
        open={isBulkPermanentDeleteDialogOpen}
        onOpenChange={setIsBulkPermanentDeleteDialogOpen}
        title="Permanently Delete Selected Records"
        description={`Are you sure you want to permanently delete ${selectedIds.length} selected records? This action cannot be undone and all associated data will be erased forever.`}
        confirmLabel="Delete Permanently"
        variant="destructive"
        onConfirm={handleBulkPermanentDelete}
        isLoading={bulkPermanentDelete.isPending}
      />
    </div>
  );
}
