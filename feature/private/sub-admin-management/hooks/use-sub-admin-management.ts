import { MOCK_SUB_ADMINS, type SubAdminData } from "@/constants/sub-admin-management";
import { useMemo, useState } from "react";

const DEFAULT_STATUS_FILTER = "All";

export function useSubAdminManagement() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);

  const filteredData = useMemo<SubAdminData[]>(() => {
    return MOCK_SUB_ADMINS.filter((admin) => {
      if (statusFilter !== DEFAULT_STATUS_FILTER && admin.status !== statusFilter) return false;
      const date = new Date(admin.createdAt);
      if (fromDate && date < fromDate) return false;
      if (toDate && date > toDate) return false;
      return true;
    });
  }, [fromDate, statusFilter, toDate]);

  const stats = useMemo(
    () => ({
      total: MOCK_SUB_ADMINS.length,
      active: MOCK_SUB_ADMINS.filter((admin) => admin.status === "Active").length,
      inactive: MOCK_SUB_ADMINS.filter((admin) => admin.status === "Inactive").length,
      permissions: Math.round(
        MOCK_SUB_ADMINS.reduce((sum, admin) => sum + admin.permissions.length, 0) /
          MOCK_SUB_ADMINS.length,
      ),
    }),
    [],
  );

  const hasFilters = Boolean(fromDate || toDate || statusFilter !== DEFAULT_STATUS_FILTER);

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatusFilter(DEFAULT_STATUS_FILTER);
  };

  return {
    clearFilters,
    filteredData,
    fromDate,
    hasFilters,
    setFromDate,
    setStatusFilter,
    setToDate,
    stats,
    statusFilter,
    toDate,
  };
}
