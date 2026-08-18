"use client";

import { MOCK_DONATION_LOGS, type DonationLog } from "@/constants/donation-logs";
import { useMemo, useState } from "react";

const DEFAULT_STATUS = "All";

export function useDonationLogs() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS);
  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");

  const filteredData = useMemo<DonationLog[]>(() => {
    return MOCK_DONATION_LOGS.filter((log) => {
      if (statusFilter !== DEFAULT_STATUS && log.status !== statusFilter) return false;
      if (
        country !== "all" &&
        country !== "All" &&
        (log as any).countryId &&
        (log as any).countryId !== country
      )
        return false;
      if (city !== "all" && city !== "All" && (log as any).cityId && (log as any).cityId !== city)
        return false;
      const date = new Date(log.donatedAt);
      if (fromDate && date < fromDate) return false;
      if (toDate && date > toDate) return false;
      return true;
    });
  }, [country, city, fromDate, statusFilter, toDate]);

  const stats = useMemo(
    () => ({
      total: 0,
      completed: 0,
      pending: 0,
      totalAmount: 0,
    }),
    [],
  );

  const hasFilters = Boolean(
    fromDate ||
    toDate ||
    statusFilter !== DEFAULT_STATUS ||
    (country !== "all" && country !== "All") ||
    (city !== "all" && city !== "All"),
  );

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatusFilter(DEFAULT_STATUS);
    setCountry("all");
    setCity("all");
  };

  return {
    filteredData,
    fromDate,
    toDate,
    statusFilter,
    country,
    city,
    stats,
    hasFilters,
    setFromDate,
    setToDate,
    setStatusFilter,
    setCountry,
    setCity,
    clearFilters,
  };
}
