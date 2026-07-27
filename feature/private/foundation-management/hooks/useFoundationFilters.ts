"use client";

import { useMemo, useState } from "react";
import {
  MOCK_FOUNDATIONS_DATA,
  MOCK_FOUNDATION_REQUESTS,
  type FoundationData,
} from "@/constants/foundation-management";

export function useFoundationFilters() {
  const [activeTab, setActiveTab] = useState<"registered" | "requests">("registered");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [country, setCountry] = useState("All Countries");
  const [city, setCity] = useState("All Cities");

  const sourceData = activeTab === "registered" ? MOCK_FOUNDATIONS_DATA : MOCK_FOUNDATION_REQUESTS;

  const filteredData = useMemo<FoundationData[]>(
    () =>
      sourceData.filter((foundation) => {
        if (country !== "All Countries" && foundation.country !== country) return false;
        if (city !== "All Cities" && foundation.city !== city) return false;

        const date = new Date(foundation.registeredOn);
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
        return true;
      }),
    [country, city, fromDate, toDate, sourceData],
  );

  const stats = {
    total: MOCK_FOUNDATIONS_DATA.length,
    active: MOCK_FOUNDATIONS_DATA.filter((f) => f.status === "Active").length,
    pending: MOCK_FOUNDATION_REQUESTS.length,
  };

  const hasFilters = !!(fromDate || toDate || country !== "All Countries" || city !== "All Cities");

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setCountry("All Countries");
    setCity("All Cities");
  };

  return {
    activeTab,
    setActiveTab,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    country,
    setCountry,
    city,
    setCity,
    filteredData,
    stats,
    hasFilters,
    clearFilters,
    sourceData,
  };
}
