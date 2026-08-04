"use client";

import { MOCK_STORES_DATA, type StoreData, type StoreStatus } from "@/constants/store-management";
import { useMemo, useState } from "react";

export function useStoreFilters() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [country, setCountry] = useState("All Countries");
  const [city, setCity] = useState("All Cities");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredData = useMemo<StoreData[]>(
    () =>
      MOCK_STORES_DATA.filter((store) => {
        if (country !== "All Countries" && store.storeCountry !== country) return false;
        if (city !== "All Cities" && store.storeCity !== city) return false;
        if (statusFilter !== "All" && store.status !== (statusFilter as StoreStatus)) return false;

        const date = new Date(store.createdAt);
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
        return true;
      }),
    [country, city, statusFilter, fromDate, toDate],
  );

  const stats = {
    total: MOCK_STORES_DATA.length,
    active: MOCK_STORES_DATA.filter((s) => s.status === "Active").length,
    inactive: MOCK_STORES_DATA.filter((s) => s.status === "Inactive").length,
    cities: new Set(MOCK_STORES_DATA.map((s) => s.storeCity)).size,
  };

  const hasFilters = !!(
    fromDate ||
    toDate ||
    country !== "All Countries" ||
    city !== "All Cities" ||
    statusFilter !== "All"
  );

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setCountry("All Countries");
    setCity("All Cities");
    setStatusFilter("All");
  };

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    country,
    setCountry,
    city,
    setCity,
    statusFilter,
    setStatusFilter,
    filteredData,
    stats,
    hasFilters,
    clearFilters,
  };
}
