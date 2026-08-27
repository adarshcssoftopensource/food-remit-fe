import type { TicketRow } from "@/constants/ticket-management";
import { useFilterState } from "@/hooks/use-filter-state";
import { useMemo } from "react";

export function useTicketManagement() {
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
  });

  const data = useMemo<TicketRow[]>(() => [], []);

  const filteredData = useMemo(() => {
    return data.filter((ticket) => {
      if (!applied.fromDate && !applied.toDate) return true;
      const date = new Date(ticket.date);
      if (applied.fromDate && date < applied.fromDate) return false;
      if (applied.toDate && date > applied.toDate) return false;
      return true;
    });
  }, [applied.fromDate, applied.toDate, data]);

  const hasFilters = Boolean(applied.fromDate || applied.toDate);

  const clearFilters = () => {
    reset();
  };

  return {
    applyFilters: apply,
    cancelFilters: cancel,
    clearFilters,
    filteredData,
    fromDate: draft.fromDate,
    hasFilters,
    setFromDate: (d: Date | undefined) => setDraft((p) => ({ ...p, fromDate: d })),
    setToDate: (d: Date | undefined) => setDraft((p) => ({ ...p, toDate: d })),
    toDate: draft.toDate,
  };
}
