import { MOCK_STORE_REPORTS, type StoreReportRow } from "@/constants/report-management";
import { useFilterState } from "@/hooks/use-filter-state";
import { useMemo } from "react";
import { useReportDateFilters } from "./use-report-date-filters";

export function useStoreReport() {
  const dateFilters = useReportDateFilters();
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    country: "All",
    city: "All",
  });

  const filteredData = useMemo(() => {
    return MOCK_STORE_REPORTS.filter((store: StoreReportRow) => {
      if (applied.country !== "All" && store.country !== applied.country) return false;
      if (applied.city !== "All" && store.city !== applied.city) return false;
      return true;
    });
  }, [applied.city, applied.country]);

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
    setCity: (c: string) => setDraft((p) => ({ ...p, city: c })),
    setCountry: (c: string) => setDraft((p) => ({ ...p, country: c })),
    applyFilters,
    cancelFilters,
  };
}
