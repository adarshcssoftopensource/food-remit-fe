"use client";

import { useFilterState } from "@/hooks/use-filter-state";
import { useMemo } from "react";

import { PHILANTHROPHISTS } from "@/constants/philanthrophist-management";

export function usePhilanthrophistFilters() {
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    country: "",
    city: "",
  });

  const data = useMemo(
    () =>
      PHILANTHROPHISTS.filter((person) => {
        const registeredOn = new Date(person.registeredOn);
        if (applied.fromDate && registeredOn < applied.fromDate) return false;
        if (applied.toDate && registeredOn > applied.toDate) return false;
        if (applied.country && person.country !== applied.country) return false;
        if (applied.city && person.city !== applied.city) return false;
        return true;
      }),
    [applied.fromDate, applied.toDate, applied.country, applied.city],
  );

  const clearFilters = () => {
    reset();
  };

  return {
    fromDate: draft.fromDate,
    setFromDate: (d: Date | undefined) => setDraft((p) => ({ ...p, fromDate: d })),
    toDate: draft.toDate,
    setToDate: (d: Date | undefined) => setDraft((p) => ({ ...p, toDate: d })),
    country: draft.country,
    setCountry: (c: string) => setDraft((p) => ({ ...p, country: c })),
    city: draft.city,
    setCity: (c: string) => setDraft((p) => ({ ...p, city: c })),
    data,
    hasFilters: Boolean(applied.fromDate || applied.toDate || applied.country || applied.city),
    clearFilters,
    applyFilters: apply,
    cancelFilters: cancel,
  };
}
