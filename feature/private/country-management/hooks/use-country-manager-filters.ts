import { useMemo } from "react";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useGetCountryManagers } from "./use-get-country-managers";
import { useCreateCountryManager, useUpdateCountryManager } from "./use-create-country-manager";
import { successToast } from "@/components/toaster";
import type { CountryManagerData } from "../types/country-manager";

export function useCountryManagerFilters() {
  const {
    page,
    limit,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    status: statusFilter,
    setStatus: setStatusFilter,
    resetBaseFilters,
  } = useTableFilters(10);

  const {
    data: countryManagers,
    isLoading,
    refetch,
  } = useGetCountryManagers({
    page,
    limit,
  });

  const createMutation = useCreateCountryManager();
  const updateMutation = useUpdateCountryManager();

  const filteredData = useMemo<CountryManagerData[]>(() => {
    return countryManagers.filter((manager) => {
      if (
        statusFilter !== "all" &&
        statusFilter !== "All" &&
        manager.status?.toLowerCase() !== statusFilter.toLowerCase()
      )
        return false;
      const date = new Date(manager.createdAt);
      if (fromDate && date < fromDate) return false;
      if (toDate && date > toDate) return false;
      return true;
    });
  }, [countryManagers, fromDate, statusFilter, toDate]);

  const stats = useMemo(() => {
    const total = countryManagers.length;
    const active = countryManagers.filter((item) => item.status === "Active").length;
    const countries = new Set(countryManagers.map((item) => item.assignedCountry)).size;
    const cities = total
      ? Math.round(
          countryManagers.reduce((sum, item) => sum + item.assignedCityManagers.length, 0) / total,
        )
      : 0;
    return { total, active, countries, cities };
  }, [countryManagers]);

  const hasFilters = Boolean(
    fromDate || toDate || (statusFilter !== "All" && statusFilter !== "all"),
  );

  const clearFilters = () => resetBaseFilters();

  const addCountryManager = async (formData: FormData) => {
    await createMutation.mutateAsync(formData);
    refetch();
  };

  const updateCountryManager = async (id: string, formData: FormData) => {
    formData.append("id", id);
    await updateMutation.mutateAsync(formData);
    refetch();
  };

  const toggleManagerStatus = async (id: string, checked: boolean) => {
    await updateMutation.mutateAsync({ id, managerStatus: checked ? "ACTIVE" : "INACTIVE" });
    successToast({ title: "Manager status updated successfully" });
    refetch();
  };

  return {
    addCountryManager,
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
    toggleManagerStatus,
    updateCountryManager,
    isLoading,
  };
}
