import { differenceInDays, parseISO } from "date-fns";
import { useMemo } from "react";

export function useCouponDurationText(startDateValue?: string, endDateValue?: string) {
  return useMemo(() => {
    try {
      if (!startDateValue || !endDateValue) return null;
      const start = parseISO(startDateValue);
      const end = parseISO(endDateValue);
      const days = differenceInDays(end, start);
      if (isNaN(days)) return null;
      if (days < 0) return "Invalid date range";
      if (days === 0) return "Active for 1 day";
      return `Active for ${days} days`;
    } catch {
      return null;
    }
  }, [startDateValue, endDateValue]);
}
