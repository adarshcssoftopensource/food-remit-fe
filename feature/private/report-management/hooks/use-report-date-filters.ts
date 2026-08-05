import { useMemo, useState } from "react";

export function useReportDateFilters() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [appliedFromDate, setAppliedFromDate] = useState<Date>();
  const [appliedToDate, setAppliedToDate] = useState<Date>();

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

  const isWithinRange = useMemo(() => {
    return (dateValue: string) => {
      if (!appliedFromDate && !appliedToDate) return true;
      const date = new Date(dateValue);
      if (appliedFromDate && date < appliedFromDate) return false;
      if (appliedToDate && date > appliedToDate) return false;
      return true;
    };
  }, [appliedFromDate, appliedToDate]);

  return {
    applyFilters,
    clearFilters,
    fromDate,
    hasFilters,
    isWithinRange,
    setFromDate,
    setToDate,
    toDate,
  };
}
