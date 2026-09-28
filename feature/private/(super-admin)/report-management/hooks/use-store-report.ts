import { useState } from "react";
import { useFilterState } from "@/hooks/use-filter-state";
import { useDebounce } from "@/lib/debounce";
import { useReportDateFilters } from "./use-report-date-filters";
import { useGetStoreReports } from "./use-get-store-reports";

export function useStoreReport() {
  const dateFilters = useReportDateFilters();
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    country: "All",
    city: "All",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const queryParams = {
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    country: applied.country === "All" ? undefined : applied.country,
    city: applied.city === "All" ? undefined : applied.city,
    fromDate: dateFilters.fromDate ? dateFilters.fromDate.toISOString() : undefined,
    toDate: dateFilters.toDate ? dateFilters.toDate.toISOString() : undefined,
  };

  const {
    data: storeReportResponse,
    isLoading,
    isError,
    refetch,
  } = useGetStoreReports(queryParams);

  const filteredData = storeReportResponse?.data || [];

  const hasFilters = dateFilters.hasFilters || applied.country !== "All" || applied.city !== "All";

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
    city: draft.city,
    clearFilters,
    country: draft.country,
    filteredData,
    hasFilters,
    isLoading,
    isError,
    refetch,
    setCity: (c: string) => setDraft((p) => ({ ...p, city: c })),
    setCountry: (c: string) => setDraft((p) => ({ ...p, country: c })),
    applyFilters,
    cancelFilters,
    pagination: storeReportResponse?.pagination || { total: 0, page: 1, limit: 50, totalPages: 1 },
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
  };
}
