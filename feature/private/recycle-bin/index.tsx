"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { PageHeader } from "@/components/common/page-header";
import { RowSelectionState, SortingState } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useBulkRestoreUsers } from "../users-management/hooks/use-bulk-restore-users";

import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDebounce } from "@/lib/debounce";
import { useGetRecycledUsers, UseGetUsersArgs } from "./hooks/use-get-recycled-users";

import { RecycleBinFilters } from "./components/recycle-bin-filters";
import { RecycleBinStats } from "./components/recycle-bin-stats";
import { RecycleBinTable } from "./components/recycle-bin-table";

export function RecycledUsersManagement() {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string | null>(null);
  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isBulkRestoreDialogOpen, setIsBulkRestoreDialogOpen] = useState(false);
  const bulkRestoreUsers = useBulkRestoreUsers();

  const queryArgs: UseGetUsersArgs = {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
    fromDate,
    toDate,
    status: status || undefined,
    sortBy: sorting[0]?.id || undefined,
    sortOrder: sorting[0]?.desc ? "desc" : sorting[0] ? "asc" : undefined,
  };

  const { data: res, isLoading } = useGetRecycledUsers(queryArgs);
  const rawData = (res?.data ?? []) as any[];

  const allData = useMemo(() => {
    return rawData.filter((user) => {
      if (country !== "all" && country !== "All" && user.countryId && user.countryId !== country) {
        return false;
      }
      if (city !== "all" && city !== "All" && user.cityId && user.cityId !== city) {
        return false;
      }
      return true;
    });
  }, [rawData, country, city]);

  const stats = {
    total: res?.stats?.total ?? 0,
    active: res?.stats?.active ?? 0,
    inactive: res?.stats?.inactive ?? 0,
  };

  const selectedUserIds = useMemo(() => {
    return Object.keys(rowSelection).filter(Boolean);
  }, [rowSelection]);

  const handleBulkRestore = () => {
    bulkRestoreUsers.mutate(
      { ids: selectedUserIds },
      {
        onSuccess: () => {
          toast.success(`${selectedUserIds.length} users have been restored successfully.`);
          setRowSelection({});
          setIsBulkRestoreDialogOpen(false);
        },
        onError: () => {
          toast.error("Failed to restore selected users.");
        },
      },
    );
  };

  const hasFilters = !!(
    fromDate ||
    toDate ||
    status ||
    (country !== "all" && country !== "All") ||
    (city !== "all" && city !== "All")
  );

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus(null);
    setCountry("all");
    setCity("all");
    setSearch("");
    setCurrentPage(1);
    setSorting([]);
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

  const handleSortingChange = useCallback(
    (nextSorting: import("@tanstack/react-table").SortingState) => {
      setSorting(nextSorting);
      setCurrentPage(1);
    },
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recycle Bin"
        description="Users who have been deleted but can be restored across countries and cities"
      />

      <RecycleBinStats stats={stats} isLoading={isLoading} />

      <RecycleBinFilters
        fromDate={fromDate}
        toDate={toDate}
        status={status}
        country={country}
        city={city}
        isLoading={isLoading}
        hasFilters={hasFilters}
        onCountryChange={setCountry}
        onCityChange={setCity}
        onFromDateChange={(d) => {
          setFromDate(d);
          setCurrentPage(1);
        }}
        onToDateChange={(d) => {
          setToDate(d);
          setCurrentPage(1);
        }}
        onStatusChange={(v) => {
          setStatus(v);
          setCurrentPage(1);
        }}
        onClearFilters={clearFilters}
      />

      <RecycleBinTable
        data={allData}
        isLoading={isLoading}
        searchValue={search}
        currentPage={currentPage}
        totalPages={res?.pagination?.totalPages ?? 1}
        rowsPerPage={rowsPerPage}
        rowSelection={rowSelection}
        selectedCount={selectedUserIds.length}
        onSearchChange={handleSearchChange}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSortingChange={handleSortingChange}
        onRowSelectionChange={setRowSelection}
        onBulkRestoreClick={() => setIsBulkRestoreDialogOpen(true)}
      />

      <ConfirmationDialog
        open={isBulkRestoreDialogOpen}
        onOpenChange={setIsBulkRestoreDialogOpen}
        title="Restore Selected Users"
        description={`Are you sure you want to restore ${selectedUserIds.length} selected users? They will be active in the system again.`}
        confirmLabel="Restore Users"
        onConfirm={handleBulkRestore}
        isLoading={bulkRestoreUsers.isPending}
      />
    </div>
  );
}
