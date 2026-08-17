import { successToast } from "@/components/toaster";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useMemo } from "react";
import { useCreateCityManager, useUpdateCityManager } from "./use-create-city-manager";
import { useGetCityManagers } from "./use-get-city-managers";

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
    debouncedSearch,
    formattedFromDate,
    formattedToDate,
    sortBy,
    sortOrder,
    searchQuery,
    setSearchQuery,
    setSorting,

    setPage,

    setLimit,
  } = useTableFilters(10);

  const {
    data: cityManagers,
    isLoading,
    refetch,
    pagination,
  } = useGetCityManagers({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
    status: statusFilter,
    fromDate: formattedFromDate,
    toDate: formattedToDate,
  });

  const createMutation = useCreateCityManager();
  const updateMutation = useUpdateCityManager();

  const filteredData = cityManagers;

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
    pagination,
    searchQuery,
    setSearchQuery,
    setSorting,
    page,
    setPage,
    limit,
    setLimit,
  };
}
