import { OrderSectionKey } from "@/constants/order-management";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import { useState } from "react";
import { useGetOrders } from "./use-get-orders";
import { HistorySubFilter } from "../utils/order-workflow";
import { FINAL_STATUS } from "../utils/order-workflow";

export function useOrderManagement(
  section?: OrderSectionKey,
  historyFilter: HistorySubFilter = "all",
) {
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
    refetch();
  };

  const cancelAllFilters = () => {
    cancelBaseFilters();
    setCountry(appliedCountry);
    setCity(appliedCity);
  };

  let workflow: string | undefined;
  let status: string | undefined;
  let excludeStatus: string | undefined;
  let type: string | number | undefined;
  let finalStatus: number | undefined;

  const normalized =
    section === "all-orders"
      ? "all"
      : section === "completed-orders"
        ? "completed"
        : section === "preparing"
          ? "processing"
          : section;

  if (normalized === "all") {
    workflow = "active";
  } else if (normalized === "pending") {
    workflow = "pending";
  } else if (normalized === "processing") {
    workflow = "processing";
  } else if (normalized === "completed") {
    workflow = "completed";
  } else if (normalized === "history") {
    workflow = "history";
    if (historyFilter === "picked-up") finalStatus = FINAL_STATUS.PICKED_UP;
    if (historyFilter === "abandoned") finalStatus = FINAL_STATUS.ABANDONED;
  } else if (section === "sent-orders") {
    type = 1;
    excludeStatus = "2,5,6,9,11";
  } else if (section === "requested-orders") {
    type = 2;
    excludeStatus = "2,5,6,9,11";
  } else if (section === "partial-orders") {
    status = "9";
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
    workflow,
    finalStatus,
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
