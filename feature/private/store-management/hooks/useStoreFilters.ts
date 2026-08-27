"use client";

import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import type { StoreData } from "@/feature/private/store-management/types/store-management";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import { useState } from "react";
import { useGetStores } from "./use-get-stores";

export function useStoreFilters() {
  const [country, setCountry] = useState("All Countries");
  const [city, setCity] = useState("All Cities");
  const [appliedCountry, setAppliedCountry] = useState("All Countries");
  const [appliedCity, setAppliedCity] = useState("All Cities");

  const applyAllFilters = () => {
    applyFilters();
    setAppliedCountry(country);
    setAppliedCity(city);
  };

  const cancelAllFilters = () => {
    cancelFilters();
    setCountry(appliedCountry);
    setCity(appliedCity);
  };

  const {
    page,
    limit,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    status: statusFilter,
    setStatus: setStatusFilter,
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
    applyFilters,
    cancelFilters,
  } = useDraftTableFilters(DEFAULT_PAGE_SIZE);

  const {
    data: rawStores,
    stats: serverStats,
    isLoading,
    pagination,
  } = useGetStores({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
    status: applied.status,
    fromDate: formattedFromDate,
    toDate: formattedToDate,
    country: appliedCountry !== "All Countries" ? appliedCountry : undefined,
    city: appliedCity !== "All Cities" ? appliedCity : undefined,
  });

  const stores: StoreData[] = rawStores || [];

  const filteredData = stores;

  const stats = serverStats || {
    total: stores.length,
    active: stores.filter((s: StoreData) => s.status === "Active").length,
    inactive: stores.filter((s: StoreData) => s.status === "Inactive").length,
    cities: new Set(stores.map((s: StoreData) => s.storeCity)).size,
  };

  const hasFilters = !!(
    applied.fromDate ||
    applied.toDate ||
    appliedCountry !== "All Countries" ||
    appliedCity !== "All Cities" ||
    (applied.status !== "All" && applied.status !== "all")
  );

  const clearFilters = () => {
    resetBaseFilters();
    setCountry("All Countries");
    setCity("All Cities");
    setAppliedCountry("All Countries");
    setAppliedCity("All Cities");
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    setCity("All Cities");
  };

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    country,
    setCountry: handleCountryChange,
    city,
    setCity,
    statusFilter,
    setStatusFilter,
    filteredData,
    stats,
    hasFilters,
    clearFilters,
    applyFilters: applyAllFilters,
    cancelFilters: cancelAllFilters,
    isLoading,
    pagination,
    searchQuery,
    setSearchQuery,
    setSorting,
    page,
    setPage,
    limit,
    setLimit,
  };
}
