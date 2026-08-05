import type { TicketRow } from "@/constants/ticket-management";
import { useMemo, useState } from "react";

export function useTicketManagement() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [appliedFromDate, setAppliedFromDate] = useState<Date>();
  const [appliedToDate, setAppliedToDate] = useState<Date>();

  const data = useMemo<TicketRow[]>(() => [], []);

  const filteredData = useMemo(() => {
    return data.filter((ticket) => {
      if (!appliedFromDate && !appliedToDate) return true;
      const date = new Date(ticket.date);
      if (appliedFromDate && date < appliedFromDate) return false;
      if (appliedToDate && date > appliedToDate) return false;
      return true;
    });
  }, [appliedFromDate, appliedToDate, data]);

  const hasFilters = Boolean(fromDate || toDate);

  const applyFilters = () => {
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setAppliedFromDate(undefined);
    setAppliedToDate(undefined);
  };

  return {
    applyFilters,
    clearFilters,
    filteredData,
    fromDate,
    hasFilters,
    setFromDate,
    setToDate,
    toDate,
  };
}
