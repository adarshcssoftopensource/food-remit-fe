"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { PageHeader } from "@/components/common/page-header";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDebounce } from "@/lib/debounce";
import { RowSelectionState, SortingState } from "@tanstack/react-table";
import { Handshake, Store } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { ModuleTabPicker } from "../components/module-tab-picker";
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
        <ModuleTabPicker tabs={ENTITY_TABS} activeTab={activeTab} onTabChange={handleTabChange} />
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
