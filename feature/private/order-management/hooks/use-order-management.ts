import { useState } from "react";
import { useGetOrders } from "./use-get-orders";

export function useOrderManagement(status?: string) {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [country, setCountry] = useState("All");
  const [city, setCity] = useState("All");

  // Create ISO strings for API if dates are selected
  const fromDateString = fromDate ? fromDate.toISOString() : undefined;
  const toDateString = toDate ? toDate.toISOString() : undefined;

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetOrders({
    status,
    fromDate: fromDateString,
    toDate: toDateString,
    country: country !== "All" ? country : undefined,
    city: city !== "All" ? city : undefined,
  });

  const hasFilters = Boolean(
    fromDate ||
    toDate ||
    (country !== "All" && country !== "all") ||
    (city !== "All" && city !== "all"),
  );

  const applyFilters = () => {
    refetch();
  };

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setCountry("All");
    setCity("All");
  };

  return {
    applyFilters,
    clearFilters,
    country,
    city,
    filteredData: response?.data || [],
    isLoading,
    fromDate,
    hasFilters,
    setCountry,
    setCity,
    setFromDate,
    setToDate,
    toDate,
  };
}
