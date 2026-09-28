"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { PageHeader } from "@/components/common/page-header";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDebounce } from "@/lib/debounce";
import { RowSelectionState, SortingState } from "@tanstack/react-table";
import { Check, Handshake, Store } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { DrawerClose } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { HistoryTable } from "./components/history-table";
import { HistoryEntityType, useGetHistoryData } from "./hooks/use-get-history-data";
import { useBulkPermanentDeleteFromHistory } from "./hooks/use-history-actions";

const ENTITY_TABS: {
  id: HistoryEntityType;
  label: string;
  icon: any;
}[] = [
  { id: "partner-leads", label: "Partner Leads", icon: Handshake },
  { id: "stores", label: "Stores", icon: Store },
];

export function HistoryManagement() {
  const [activeTab, setActiveTab] = useState<HistoryEntityType>("partner-leads");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isBulkPermanentDeleteDialogOpen, setIsBulkPermanentDeleteDialogOpen] = useState(false);

  const bulkPermanentDelete = useBulkPermanentDeleteFromHistory(activeTab);

  const queryArgs = {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
    sortBy: sorting[0]?.id || undefined,
    sortOrder: (sorting[0]?.desc ? "desc" : sorting[0] ? "asc" : undefined) as
      "asc" | "desc" | undefined,
  };

  const { formattedData, isLoading } = useGetHistoryData(activeTab, queryArgs);

  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection).filter((id) => rowSelection[id]);
  }, [rowSelection]);

  const handleTabChange = (tabId: HistoryEntityType) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSearch("");
    setRowSelection({});
    setSorting([]);
  };

  const activeTabMeta = useMemo(() => {
    return ENTITY_TABS.find((t) => t.id === activeTab);
  }, [activeTab]);

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
        title="History"
        description="View records deleted from the Recycle Bin. These records are archived and cannot be restored."
      />

      <ModuleFilters
        title={activeTabMeta?.label || "Filter History"}
        description="Select the module to view history records."
        hasFilters={true}
      >
        <div className="min-w-44 flex-1 space-y-3">
          <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Module
          </Label>
          <div className="flex flex-col gap-2">
            {ENTITY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <DrawerClose key={tab.id}>
                  <button
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? "text-secondary bg-teal-900 shadow-md dark:bg-teal-50 dark:text-teal-900"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </div>
                    {isActive && <Check className="h-4 w-4" />}
                  </button>
                </DrawerClose>
              );
            })}
          </div>
        </div>
      </ModuleFilters>

      <HistoryTable
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
        onBulkPermanentDeleteClick={() => setIsBulkPermanentDeleteDialogOpen(true)}
      />

      <ConfirmationDialog
        open={isBulkPermanentDeleteDialogOpen}
        onOpenChange={setIsBulkPermanentDeleteDialogOpen}
        title={`Permanently Delete Selected ${activeTabMeta?.label}`}
        description={`Are you sure you want to permanently delete ${selectedIds.length} selected ${activeTabMeta?.label.toLowerCase()}? This action cannot be undone and all associated data will be erased forever.`}
        confirmLabel="Delete Permanently"
        variant="destructive"
        onConfirm={handleBulkPermanentDelete}
        isLoading={bulkPermanentDelete.isPending}
      />
    </div>
  );
}
