"use client";

import { useState } from "react";
import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { PageHeader } from "@/components/common/page-header";
import { Globe, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { amountLimitColumns } from "./columns/amount-limit-columns";
import { AmountLimitDialog } from "./components/amount-limit-dialog";
import { useFilterState } from "@/hooks/use-filter-state";
import { useGetAmountLimits } from "./hooks/use-get-amount-limits";
import { useDebounce } from "@/lib/debounce";
import { SortingState } from "@tanstack/react-table";

export function AmountLimitManagement() {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Search state — debounced before sending to backend
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Sorting state
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Date filter state
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
  });

  const fromDateStr = applied.fromDate ? applied.fromDate.toISOString().split("T")[0] : undefined;
  const toDateStr = applied.toDate ? applied.toDate.toISOString().split("T")[0] : undefined;

  const {
    data: amountLimits,
    isLoading,
    pagination,
  } = useGetAmountLimits({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
    sortBy,
    sortOrder,
    fromDate: fromDateStr,
    toDate: toDateStr,
  });

  const totalCount = pagination?.total ?? amountLimits.length;
  const totalPages = pagination?.totalPages ?? 1;

  const hasFilters = Boolean(applied.fromDate || applied.toDate || search.trim());
  const activeFilterCount = [applied.fromDate, applied.toDate, search.trim()].filter(
    Boolean,
  ).length;

  const handleClearFilters = () => {
    setSearch("");
    reset();
    setPage(1);
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const handleSortingChange = (sorting: SortingState) => {
    if (sorting.length > 0) {
      setSortBy(sorting[0].id);
      setSortOrder(sorting[0].desc ? "desc" : "asc");
    } else {
      setSortBy("createdAt");
      setSortOrder("desc");
    }
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Amount Limit Management"
        description="Manage and configure amount limits for different countries."
        action={<AmountLimitDialog mode="add" />}
      />

      <ModuleFilters
        title="Filter Amount Limits"
        description="Filter records by date range"
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
        onApplyFilters={apply}
        onCancelFilters={cancel}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
          <DateRangeFilter
            fromDate={draft.fromDate}
            toDate={draft.toDate}
            onFromDateChange={(d) => {
              setDraft((p) => ({ ...p, fromDate: d ?? undefined }));
              setPage(1);
            }}
            onToDateChange={(d) => {
              setDraft((p) => ({ ...p, toDate: d ?? undefined }));
              setPage(1);
            }}
          />
        </div>
      </ModuleFilters>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Globe className="text-primary h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Country Amount Limits</CardTitle>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {isLoading ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin" /> Loading records...
                  </span>
                ) : (
                  `Showing ${amountLimits.length} of ${totalCount} amount limits`
                )}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={amountLimitColumns}
            data={amountLimits}
            loading={isLoading}
            searchValue={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            manualSorting={true}
            manualFiltering={true}
            onSortingChange={handleSortingChange}
            currentPage={page}
            totalPages={totalPages}
            rowsPerPage={limit}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
