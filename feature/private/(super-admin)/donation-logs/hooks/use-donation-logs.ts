"use client";

import { useFilterState } from "@/hooks/use-filter-state";
import { useMemo } from "react";

import { MOCK_DONATION_LOGS, type DonationLog } from "@/constants/donation-logs";

const DEFAULT_STATUS = "All";

export function useDonationLogs() {
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    statusFilter: DEFAULT_STATUS,
    country: "all",
    city: "all",
  });

  const filteredData = useMemo<DonationLog[]>(() => {
    return MOCK_DONATION_LOGS.filter((log) => {
      if (applied.statusFilter !== DEFAULT_STATUS && log.status !== applied.statusFilter)
        return false;
      if (
        applied.country !== "all" &&
        applied.country !== "All" &&
        (log as any).countryId &&
        (log as any).countryId !== applied.country
      )
        return false;
      if (
        applied.city !== "all" &&
        applied.city !== "All" &&
        (log as any).cityId &&
        (log as any).cityId !== applied.city
      )
        return false;
      const date = new Date(log.donatedAt);
      if (applied.fromDate && date < applied.fromDate) return false;
      if (applied.toDate && date > applied.toDate) return false;
      return true;
    });
  }, [applied.country, applied.city, applied.fromDate, applied.statusFilter, applied.toDate]);

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
    applied.fromDate ||
    applied.toDate ||
    applied.statusFilter !== DEFAULT_STATUS ||
    (applied.country !== "all" && applied.country !== "All") ||
    (applied.city !== "all" && applied.city !== "All"),
  );

  const clearFilters = () => {
    reset();
  };

  return {
    filteredData,
    fromDate: draft.fromDate,
    toDate: draft.toDate,
    statusFilter: draft.statusFilter,
    country: draft.country,
    city: draft.city,
    stats,
    hasFilters,
    setFromDate: (d: Date | undefined) => setDraft((p) => ({ ...p, fromDate: d })),
    setToDate: (d: Date | undefined) => setDraft((p) => ({ ...p, toDate: d })),
    setStatusFilter: (s: string) => setDraft((p) => ({ ...p, statusFilter: s })),
    setCountry: (c: string) => setDraft((p) => ({ ...p, country: c })),
    setCity: (c: string) => setDraft((p) => ({ ...p, city: c })),
    clearFilters,
    applyFilters: apply,
    cancelFilters: cancel,
  };
}
