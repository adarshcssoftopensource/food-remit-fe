import { MOCK_STORE_REPORTS, type StoreReportRow } from "@/constants/report-management";
import { useMemo, useState } from "react";
import { useReportDateFilters } from "./use-report-date-filters";

export function useStoreReport() {
  const dateFilters = useReportDateFilters();
  const [country, setCountry] = useState("All");
  const [city, setCity] = useState("All");

  const filteredData = useMemo(() => {
    return MOCK_STORE_REPORTS.filter((store: StoreReportRow) => {
      if (country !== "All" && store.country !== country) return false;
      if (city !== "All" && store.city !== city) return false;
      return true;
    });
  }, [city, country]);

  const hasFilters = dateFilters.hasFilters || country !== "All" || city !== "All";

  const clearFilters = () => {
    dateFilters.clearFilters();
    setCountry("All");
    setCity("All");
  };

  return {
    ...dateFilters,
    city,
    clearFilters,
    country,
    filteredData,
    hasFilters,
    setCity,
    setCountry,
  };
}
