import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useTableFilters } from "@/hooks/use-table-filters";
import { OrderSectionKey } from "@/constants/order-management";
import { useState, useMemo } from "react";
import { useGetOrders } from "./use-get-orders";

export function useOrderManagement(section?: OrderSectionKey) {
  const {
    page,
    limit,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    resetBaseFilters,
    debouncedSearch,
    formattedFromDate,
    formattedToDate,
    sortBy,
    sortOrder,
    searchQuery,
    setSearchQuery,
    setSorting,
    setPage,
    setLimit,
  } = useTableFilters(DEFAULT_PAGE_SIZE);

  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");

  let status: string | undefined = undefined;
  let type: string | number | undefined = undefined;

  if (section === "sent-orders") {
    type = 1;
    status = "1"; // Only show pending sent orders
  } else if (section === "requested-orders") {
    type = 2;
    status = "1"; // Only show pending requested orders
  } else if (section === "partial-orders") {
    status = "5"; // Assuming 5 represents partial/accepted
  } else if (section === "completed-orders") {
    status = "6"; // 6 represents completed
  } else if (section === "history") {
    // Optionally leave undefined for all, or set a specific status if history implies past orders
    // Leaving undefined for now so it fetches everything (or could be 6 and 7)
  }

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetOrders({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
    status,
    type,
    fromDate: formattedFromDate,
    toDate: formattedToDate,
    country: country !== "all" && country !== "All" ? country : undefined,
    city: city !== "all" && city !== "All" ? city : undefined,
  });

  const hasFilters = Boolean(
    fromDate ||
    toDate ||
    (country !== "all" && country !== "All") ||
    (city !== "all" && city !== "All"),
  );

  const applyFilters = () => {
    refetch();
  };

  const clearFilters = () => {
    resetBaseFilters();
    setCountry("all");
    setCity("all");
  };

  return {
    applyFilters,
    clearFilters,
    country,
    city,
    filteredData: response?.data || [],
    pagination: response?.pagination,
    isLoading,
    fromDate,
    hasFilters,
    setCountry,
    setCity,
    setFromDate,
    setToDate,
    toDate,
    searchQuery,
    setSearchQuery,
    setSorting,
    page,
    setPage,
    limit,
    setLimit,
  };
}
