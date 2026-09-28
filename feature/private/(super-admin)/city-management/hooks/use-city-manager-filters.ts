import { successToast } from "@/components/toaster";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import { useMemo, useState } from "react";
import { useCreateCityManager, useUpdateCityManager } from "./use-create-city-manager";
import { useGetCityManagers } from "./use-get-city-managers";

import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";

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
    applied,
    applyFilters,
    cancelFilters,
  } = useDraftTableFilters(DEFAULT_PAGE_SIZE);

  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");
  const [appliedCountry, setAppliedCountry] = useState("all");
  const [appliedCity, setAppliedCity] = useState("all");

  const applyAllFilters = () => {
    applyFilters();
    setAppliedCountry(country);
    setAppliedCity(city);
  };

  const cancelAllFilters = () => {
    cancelFilters();
    setCountry(appliedCountry);
    setCity(appliedCity);
  };

  const [statusTab, setStatusTab] = useState<"all" | "ACTIVE" | "INACTIVE">("all");

  const {
    data: cityManagers,
    stats: serverStats,
    isLoading,
    refetch,
    pagination,
  } = useGetCityManagers({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
    status: statusTab !== "all" ? statusTab : undefined,
    fromDate: formattedFromDate,
    toDate: formattedToDate,
    countryId: appliedCountry,
    cityId: appliedCity,
  });

  const createMutation = useCreateCityManager();
  const updateMutation = useUpdateCityManager();

  const filteredData = useMemo(() => {
    return cityManagers;
  }, [cityManagers]);

  const stats = useMemo(() => {
    const total = serverStats?.total ?? cityManagers.length;
    const active =
      serverStats?.active ?? cityManagers.filter((item) => item.status === "Active").length;
    const inactive =
      serverStats?.inactive ?? cityManagers.filter((item) => item.status !== "Active").length;
    const cities = new Set(cityManagers.flatMap((item) => item.assignedCities)).size;
    const countries = new Set(cityManagers.map((item) => item.country)).size;
    return { total, active, inactive, cities, countries };
  }, [cityManagers, serverStats]);

  const hasFilters = Boolean(
    applied.fromDate ||
    applied.toDate ||
    (appliedCountry !== "all" && appliedCountry !== "All") ||
    (appliedCity !== "all" && appliedCity !== "All"),
  );

  const clearFilters = () => {
    resetBaseFilters();
    setStatusTab("all");
    setCountry("all");
    setCity("all");
    setAppliedCountry("all");
    setAppliedCity("all");
  };

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
    applyFilters: applyAllFilters,
    cancelFilters: cancelAllFilters,
    country,
    setCountry,
    city,
    setCity,
    statusTab,
    setStatusTab,
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
