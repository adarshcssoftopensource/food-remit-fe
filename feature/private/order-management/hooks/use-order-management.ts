import type { OrderRow } from "@/constants/order-management";
import { useMemo, useState } from "react";

export function useOrderManagement() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [country, setCountry] = useState("All");
  const [appliedFromDate, setAppliedFromDate] = useState<Date>();
  const [appliedToDate, setAppliedToDate] = useState<Date>();

  const data = useMemo<OrderRow[]>(() => [], []);

  const filteredData = useMemo(() => {
    return data.filter((order) => {
      if (country !== "All" && order.country !== country) return false;
      if (appliedFromDate || appliedToDate) {
        const date = new Date(order.orderDate);
        if (appliedFromDate && date < appliedFromDate) return false;
        if (appliedToDate && date > appliedToDate) return false;
      }
      return true;
    });
  }, [appliedFromDate, appliedToDate, country, data]);

  const hasFilters = Boolean(fromDate || toDate || country !== "All");

  const applyFilters = () => {
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setAppliedFromDate(undefined);
    setAppliedToDate(undefined);
    setCountry("All");
  };

  return {
    applyFilters,
    clearFilters,
    country,
    filteredData,
    fromDate,
    hasFilters,
    setCountry,
    setFromDate,
    setToDate,
    toDate,
  };
}
