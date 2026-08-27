import { useFilterState } from "@/hooks/use-filter-state";
import { useMemo } from "react";

export function useReportDateFilters() {
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
  });

  const hasFilters = Boolean(applied.fromDate || applied.toDate);

  const clearFilters = () => {
    reset();
  };

  const isWithinRange = useMemo(() => {
    return (dateValue: string) => {
      if (!applied.fromDate && !applied.toDate) return true;
      const date = new Date(dateValue);
      if (applied.fromDate && date < applied.fromDate) return false;
      if (applied.toDate && date > applied.toDate) return false;
      return true;
    };
  }, [applied.fromDate, applied.toDate]);

  return {
    applyFilters: apply,
    cancelFilters: cancel,
    clearFilters,
    fromDate: draft.fromDate,
    hasFilters,
    isWithinRange,
    setFromDate: (d: Date | undefined) => setDraft((p) => ({ ...p, fromDate: d })),
    setToDate: (d: Date | undefined) => setDraft((p) => ({ ...p, toDate: d })),
    toDate: draft.toDate,
  };
}
