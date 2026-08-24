import { successToast } from "@/components/toaster";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useMemo, useState } from "react";
import { useCreateCountryManager, useUpdateCountryManager } from "./use-create-country-manager";
import { useGetCountryManagers } from "./use-get-country-managers";

import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";

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
  } = useTableFilters(DEFAULT_PAGE_SIZE);

  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");

  const {
    data: countryManagers,
    isLoading,
    refetch,
    pagination,
  } = useGetCountryManagers({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
    status: statusFilter,
    fromDate: formattedFromDate,
    toDate: formattedToDate,
    countryId: country,
  });

  const createMutation = useCreateCountryManager();
  const updateMutation = useUpdateCountryManager();

  const filteredData = useMemo(() => {
    return countryManagers;
  }, [countryManagers]);

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
    fromDate ||
    toDate ||
    (statusFilter !== "All" && statusFilter !== "all") ||
    (country !== "all" && country !== "All") ||
    (city !== "all" && city !== "All"),
  );

  const clearFilters = () => {
    resetBaseFilters();
    setCountry("all");
    setCity("all");
  };

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
    country,
    setCountry,
    city,
    setCity,
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
