"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { STAT_CONFIG, USER_STATUS_OPTIONS } from "@/constants/users-management";
import { useDebounce } from "@/lib/debounce";
import { RowSelectionState, SortingState } from "@tanstack/react-table";
import { Trash2, UsersRound } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { usersColumns } from "./columns/users-columns";
import { useBulkDeleteUsers } from "./hooks/use-bulk-delete-users";
import { useGetUsers, UseGetUsersArgs } from "./hooks/use-get-users";

export function UserManagement() {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const bulkDeleteUsers = useBulkDeleteUsers();

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

  const { data: res, isLoading } = useGetUsers(queryArgs);
  const allData = (res?.data ?? []) as any[];

  const stats = {
    total: res?.stats?.total ?? 0,
    active: res?.stats?.active ?? 0,
    inactive: res?.stats?.inactive ?? 0,
  };

  const selectedUserIds = useMemo(() => {
    return Object.keys(rowSelection).filter(Boolean);
  }, [rowSelection]);

  const handleBulkDelete = () => {
    bulkDeleteUsers.mutate(
      { ids: selectedUserIds },
      {
        onSuccess: () => {
          toast.success(`${selectedUserIds.length} users have been deleted successfully.`);
          setRowSelection({});
          setIsBulkDeleteDialogOpen(false);
        },
        onError: () => {
          toast.error("Failed to delete selected users.");
        },
      },
    );
  };

  const hasFilters = !!(fromDate || toDate || status);

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus(null);
    setSearch("");
    setCurrentPage(1);
    setSorting([]);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (status) count++;
    return count;
  }, [fromDate, toDate, status]);

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

  const handleImageClick = useCallback((image: string) => {
    setLightboxSrc(image);
  }, []);

  const columns = useMemo(() => usersColumns(handleImageClick), [handleImageClick]);

  return (
    <div className="space-y-6">
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <PageHeader
        title="Users Management"
        description="Manage and monitor all registered users in the platform."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={stats[key]}
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
            loading={isLoading}
          />
        ))}
      </div>

      <ModuleFilters
        title="Filter Users"
        description="Refine users by date and status"
        hideCountryFilter
        hideCityFilter
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={(d) => {
              setFromDate(d ?? undefined);
              setCurrentPage(1);
            }}
            onToDateChange={(d) => {
              setToDate(d ?? undefined);
              setCurrentPage(1);
            }}
            maxDate={new Date()}
            loading={isLoading}
          />
        </div>

        <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
          <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            User Status
          </Label>

          <Select
            value={status ?? ""}
            onValueChange={(v) => {
              setStatus(v || null);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200/80 bg-white px-3 text-sm font-medium dark:border-slate-800 dark:bg-slate-900">
              <span
                className={
                  status ? "font-medium text-slate-700 dark:text-slate-200" : "text-slate-400"
                }
              >
                {USER_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
                  "All Users"}
              </span>
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {USER_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </ModuleFilters>

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 shrink-0 items-center justify-center rounded-xl ring-1">
                <UsersRound className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    All Users
                  </CardTitle>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                    Directory
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  {allData.length} user{allData.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {selectedUserIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="h-9 rounded-xl text-xs font-semibold"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete Selected ({selectedUserIds.length})
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={allData}
            searchKey="fullName"
            loading={isLoading}
            searchValue={search}
            onSearchChange={handleSearchChange}
            currentPage={currentPage}
            totalPages={res?.pagination?.totalPages ?? 1}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSortingChange={handleSortingChange}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getRowId={(row: any) => row.id}
          />
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
        title="Delete Selected Users"
        description={`Are you sure you want to delete ${selectedUserIds.length} selected users? This action cannot be undone.`}
        confirmLabel="Delete Users"
        onConfirm={handleBulkDelete}
        isLoading={bulkDeleteUsers.isPending}
      />
    </div>
  );
}
