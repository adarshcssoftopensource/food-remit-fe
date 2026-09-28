"use client";

import { useFilterState } from "@/hooks/use-filter-state";
import { useMemo, useState } from "react";
import {
  MOCK_FOUNDATIONS_DATA,
  MOCK_FOUNDATION_REQUESTS,
  type FoundationData,
} from "@/constants/foundation-management";

export function useFoundationFilters() {
  const [activeTab, setActiveTab] = useState<"registered" | "requests">("registered");
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    country: "All Countries",
    city: "All Cities",
  });

  const sourceData = activeTab === "registered" ? MOCK_FOUNDATIONS_DATA : MOCK_FOUNDATION_REQUESTS;

  const filteredData = useMemo<FoundationData[]>(
    () =>
      sourceData.filter((foundation) => {
        if (applied.country !== "All Countries" && foundation.country !== applied.country)
          return false;
        if (applied.city !== "All Cities" && foundation.city !== applied.city) return false;

        const date = new Date(foundation.registeredOn);
        if (applied.fromDate && date < applied.fromDate) return false;
        if (applied.toDate && date > applied.toDate) return false;
        return true;
      }),
    [applied.country, applied.city, applied.fromDate, applied.toDate, sourceData],
  );

  const stats = {
    total: MOCK_FOUNDATIONS_DATA.length,
    active: MOCK_FOUNDATIONS_DATA.filter((f) => f.status === "Active").length,
    pending: MOCK_FOUNDATION_REQUESTS.length,
  };

  const hasFilters = !!(
    applied.fromDate ||
    applied.toDate ||
    applied.country !== "All Countries" ||
    applied.city !== "All Cities"
  );

  const clearFilters = () => {
    reset();
  };

  return {
    activeTab,
    setActiveTab,
    fromDate: draft.fromDate,
    setFromDate: (d: Date | undefined) => setDraft((p) => ({ ...p, fromDate: d })),
    toDate: draft.toDate,
    setToDate: (d: Date | undefined) => setDraft((p) => ({ ...p, toDate: d })),
    country: draft.country,
    setCountry: (c: string) => setDraft((p) => ({ ...p, country: c })),
    city: draft.city,
    setCity: (c: string) => setDraft((p) => ({ ...p, city: c })),
    applyFilters: apply,
    cancelFilters: cancel,
    filteredData,
    stats,
    hasFilters,
    clearFilters,
    sourceData,
  };
}
