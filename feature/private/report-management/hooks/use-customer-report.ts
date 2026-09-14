import { useState } from "react";
import { format } from "date-fns";
import { useFilterState } from "@/hooks/use-filter-state";
import { useDebounce } from "@/lib/debounce";
import { useReportDateFilters } from "./use-report-date-filters";
import { useGetCustomerReports } from "./use-get-customer-reports";

export function useCustomerReport() {
  const dateFilters = useReportDateFilters();
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    country: "All",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const debouncedSearch = useDebounce(search, 400);

  const fromDateStr = dateFilters.fromDate ? format(dateFilters.fromDate, "yyyy-MM-dd") : undefined;
  const toDateStr = dateFilters.toDate ? format(dateFilters.toDate, "yyyy-MM-dd") : undefined;

  const queryParams = {
    page,
    limit: pageSize,
    search: debouncedSearch.trim() || undefined,
    country: applied.country === "All" || applied.country === "all" ? undefined : applied.country,
    fromDate: fromDateStr,
    toDate: toDateStr,
    sortBy,
    sortOrder,
  };

  const {
    data: customerReportResponse,
    isLoading,
    isError,
    refetch,
  } = useGetCustomerReports(queryParams);

  const filteredData = customerReportResponse?.data || [];

  const hasFilters =
    dateFilters.hasFilters || (applied.country !== "All" && applied.country !== "all");

  const clearFilters = () => {
    dateFilters.clearFilters();
    reset();
    setPage(1);
  };

  const applyFilters = () => {
    dateFilters.applyFilters();
    apply();
    setPage(1);
  };

  const cancelFilters = () => {
    dateFilters.cancelFilters();
    cancel();
  };

  return {
    ...dateFilters,
    clearFilters,
    country: draft.country,
    filteredData,
    hasFilters,
    isLoading,
    isError,
    refetch,
    setCountry: (c: string) => setDraft((p) => ({ ...p, country: c })),
    applyFilters,
    cancelFilters,
    pagination: customerReportResponse?.pagination || {
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 1,
    },
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    queryParams,
  };
}
