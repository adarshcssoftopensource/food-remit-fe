"use client";

import { useGetStores } from "./use-get-stores";
import { useTableFilters } from "@/hooks/use-table-filters";
import type { StoreData } from "@/feature/private/store-management/types/store-management";
import { useState } from "react";

export function useStoreFilters() {
  const [country, setCountry] = useState("All Countries");
  const [city, setCity] = useState("All Cities");

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
  } = useTableFilters(10);

  const {
    data: rawStores,
    isLoading,
    pagination,
  } = useGetStores({
    page,
    limit,
  });

  const stores: StoreData[] = rawStores || [];

  const filteredData = stores.filter((store: StoreData) => {
    if (country !== "All Countries" && store.storeCountry !== country) return false;
    if (city !== "All Cities" && store.storeCity !== city) return false;
    if (
      statusFilter !== "all" &&
      statusFilter !== "All" &&
      store.status?.toLowerCase() !== statusFilter.toLowerCase()
    )
      return false;

    const date = new Date(store.createdAt);
    if (fromDate && date < fromDate) return false;
    if (toDate && date > toDate) return false;
    return true;
  });

  const stats = {
    total: stores.length,
    active: stores.filter((s: StoreData) => s.status === "Active").length,
    inactive: stores.filter((s: StoreData) => s.status === "Inactive").length,
    cities: new Set(stores.map((s: StoreData) => s.storeCity)).size,
  };

  const hasFilters = !!(
    fromDate ||
    toDate ||
    country !== "All Countries" ||
    city !== "All Cities" ||
    (statusFilter !== "All" && statusFilter !== "all")
  );

  const clearFilters = () => {
    resetBaseFilters();
    setCountry("All Countries");
    setCity("All Cities");
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
    isLoading,
    pagination,
  };
}
