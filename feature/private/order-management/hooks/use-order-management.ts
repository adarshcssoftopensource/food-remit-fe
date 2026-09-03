import { OrderSectionKey } from "@/constants/order-management";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import { useState } from "react";
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
    applied,
    applyFilters: applyBaseFilters,
    cancelFilters: cancelBaseFilters,
  } = useDraftTableFilters(DEFAULT_PAGE_SIZE);

  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");
  const [appliedCountry, setAppliedCountry] = useState("all");
  const [appliedCity, setAppliedCity] = useState("all");

  const applyAllFilters = () => {
    applyBaseFilters();
    setAppliedCountry(country);
    setAppliedCity(city);
    refetch(); // if refetch was previously used here
  };

  const cancelAllFilters = () => {
    cancelBaseFilters();
    setCountry(appliedCountry);
    setCity(appliedCity);
  };

  let status: string | undefined = undefined;
  let excludeStatus: string | undefined = undefined;
  let type: string | number | undefined = undefined;

  if (section === "sent-orders") {
    type = 1;
    excludeStatus = "6";
  } else if (section === "requested-orders") {
    type = 2;
  } else if (section === "partial-orders") {
    status = "5"; // 5 represents partial/accepted
  } else if (section === "completed-orders") {
    status = "6,8"; // 6 represents completed, 8 represents paid
  } else if (section === "fulfilment") {
    status = "2,3,4"; // 2 = Preparing, 3/4 = Out for Delivery / Picked
  } else if (section === "history") {
    // History shows all orders across statuses
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
    excludeStatus,
    type,
    fromDate: formattedFromDate,
    toDate: formattedToDate,
    country: appliedCountry !== "all" && appliedCountry !== "All" ? appliedCountry : undefined,
    city: appliedCity !== "all" && appliedCity !== "All" ? appliedCity : undefined,
  });

  const hasFilters = Boolean(
    applied.fromDate ||
    applied.toDate ||
    (appliedCountry !== "all" && appliedCountry !== "All") ||
    (appliedCity !== "all" && appliedCity !== "All"),
  );

  const clearFilters = () => {
    resetBaseFilters();
    setCountry("all");
    setCity("all");
    setAppliedCountry("all");
    setAppliedCity("all");
  };

  return {
    applyFilters: applyAllFilters,
    cancelFilters: cancelAllFilters,
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
