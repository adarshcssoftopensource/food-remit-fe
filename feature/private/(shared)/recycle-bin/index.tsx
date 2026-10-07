"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { PageHeader } from "@/components/common/page-header";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDebounce } from "@/lib/debounce";
import { RowSelectionState, SortingState } from "@tanstack/react-table";
import {
  Building2,
  FolderTree,
  Globe,
  Handshake,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBasket,
  Store,
  Users,
  UserCog,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { ModuleTabPicker } from "../components/module-tab-picker";
import { RecycleBinTable } from "./components/recycle-bin-table";
import { RecycleEntityType, useGetRecycledData } from "./hooks/use-get-recycled-data";
import {
  useBulkPermanentDeleteEntities,
  useBulkRestoreEntities,
} from "./hooks/use-recycle-bin-actions";
import { useProfile } from "@/components/providers/profile-provider";

const ALL_ENTITY_TABS: {
  id: RecycleEntityType;
  label: string;
  icon: any;
}[] = [
  { id: "users", label: "Users", icon: Users },
  { id: "sub-admins", label: "Sub/Co Admins", icon: ShieldCheck },
  { id: "stores", label: "Stores", icon: Store },
  { id: "items", label: "Items", icon: Package },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "city-managers", label: "City Managers", icon: MapPin },
  { id: "country-managers", label: "Country Managers", icon: Globe },
  { id: "employees", label: "Employees", icon: UserCog },
  { id: "partner-leads", label: "Partner Leads", icon: Handshake },
  { id: "baskets", label: "Baskets", icon: ShoppingBasket },
];

export function RecycledUsersManagement() {
  const { profile } = useProfile();
  const isStoreManager = profile?.roleCode === "STORE_MANAGER" || profile?.role === "store_manager";

  const ENTITY_TABS = useMemo(() => {
    if (isStoreManager) {
      return ALL_ENTITY_TABS.filter((tab) =>
        ["categories", "items", "employees", "baskets"].includes(tab.id),
      );
    }
    return ALL_ENTITY_TABS;
  }, [isStoreManager]);

  const [activeTab, setActiveTab] = useState<RecycleEntityType>(
    isStoreManager ? "categories" : "users",
  );
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

      <ModuleFilters
        title={ENTITY_TABS.find((t) => t.id === activeTab)?.label || "Filter Recycle Bin"}
        description="Select the module to view recycled records."
        hasFilters={true}
        // activeFilterCount={1}
      >
        <ModuleTabPicker tabs={ENTITY_TABS} activeTab={activeTab} onTabChange={handleTabChange} />
      </ModuleFilters>

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
        title={`Restore Selected ${ENTITY_TABS.find((t) => t.id === activeTab)?.label}`}
        description={`Are you sure you want to restore ${selectedIds.length} selected ${ENTITY_TABS.find((t) => t.id === activeTab)?.label.toLowerCase()}? They will be active in the system again.`}
        confirmLabel="Restore Records"
        onConfirm={handleBulkRestore}
        isLoading={bulkRestore.isPending}
      />

      <ConfirmationDialog
        open={isBulkPermanentDeleteDialogOpen}
        onOpenChange={setIsBulkPermanentDeleteDialogOpen}
        title={`Permanently Delete Selected ${ENTITY_TABS.find((t) => t.id === activeTab)?.label}`}
        description={`Are you sure you want to permanently delete ${selectedIds.length} selected ${ENTITY_TABS.find((t) => t.id === activeTab)?.label.toLowerCase()}? This action cannot be undone and all associated data will be erased forever.`}
        confirmLabel="Delete Permanently"
        variant="destructive"
        onConfirm={handleBulkPermanentDelete}
        isLoading={bulkPermanentDelete.isPending}
      />
    </div>
  );
}
