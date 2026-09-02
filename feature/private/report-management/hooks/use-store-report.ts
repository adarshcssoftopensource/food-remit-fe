import { useFilterState } from "@/hooks/use-filter-state";
import { useReportDateFilters } from "./use-report-date-filters";
import { useGetStoreReports } from "./use-get-store-reports";

export function useStoreReport() {
  const dateFilters = useReportDateFilters();
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    country: "All",
    city: "All",
  });

  const queryParams = {
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
  };

  const applyFilters = () => {
    dateFilters.applyFilters();
    apply();
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
  };
}
