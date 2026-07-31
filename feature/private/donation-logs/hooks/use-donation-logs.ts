"use client";

import { MOCK_DONATION_LOGS, type DonationLog } from "@/constants/donation-logs";
import { useMemo, useState } from "react";

const DEFAULT_STATUS = "All";

export function useDonationLogs() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS);

  const filteredData = useMemo<DonationLog[]>(() => {
    return MOCK_DONATION_LOGS.filter((log) => {
      if (statusFilter !== DEFAULT_STATUS && log.status !== statusFilter) return false;
      const date = new Date(log.donatedAt);
      if (fromDate && date < fromDate) return false;
      if (toDate && date > toDate) return false;
      return true;
    });
  }, [fromDate, statusFilter, toDate]);

  const stats = useMemo(
    () => ({
      total: MOCK_DONATION_LOGS.length,
      completed: MOCK_DONATION_LOGS.filter((l) => l.status === "Completed").length,
      pending: MOCK_DONATION_LOGS.filter((l) => l.status === "Pending").length,
      totalAmount: MOCK_DONATION_LOGS.filter((l) => l.status === "Completed").reduce(
        (sum, l) => sum + l.amountDonated,
        0,
      ),
    }),
    [],
  );

  const hasFilters = Boolean(fromDate || toDate || statusFilter !== DEFAULT_STATUS);

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatusFilter(DEFAULT_STATUS);
  };

  return {
    filteredData,
    fromDate,
    toDate,
    statusFilter,
    stats,
    hasFilters,
    setFromDate,
    setToDate,
    setStatusFilter,
    clearFilters,
  };
}
