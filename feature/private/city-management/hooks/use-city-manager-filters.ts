import { useMemo } from "react";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useGetCityManagers } from "./use-get-city-managers";
import { useCreateCityManager, useUpdateCityManager } from "./use-create-city-manager";
import { successToast } from "@/components/toaster";
import type { CityManagerData } from "../types/city-manager";

export function useCityManagerFilters() {
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
    data: cityManagers,
    isLoading,
    refetch,
  } = useGetCityManagers({
    page,
    limit,
  });

  const createMutation = useCreateCityManager();
  const updateMutation = useUpdateCityManager();

  const filteredData = useMemo<CityManagerData[]>(() => {
    return cityManagers.filter((manager) => {
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
  }, [cityManagers, fromDate, statusFilter, toDate]);

  const stats = useMemo(() => {
    const total = cityManagers.length;
    const active = cityManagers.filter((item) => item.status === "Active").length;
    const cities = new Set(cityManagers.flatMap((item) => item.assignedCities)).size;
    const countries = new Set(cityManagers.map((item) => item.country)).size;
    return { total, active, cities, countries };
  }, [cityManagers]);

  const hasFilters = Boolean(
    fromDate || toDate || (statusFilter !== "All" && statusFilter !== "all"),
  );

  const clearFilters = () => resetBaseFilters();

  const addCityManager = async (formData: FormData) => {
    await createMutation.mutateAsync(formData);
    refetch();
  };

  const updateCityManager = async (id: string, formData: FormData) => {
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
    addCityManager,
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
    updateCityManager,
    isLoading,
  };
}
