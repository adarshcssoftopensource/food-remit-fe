import { useMemo } from "react";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { type CityManagerFormValues } from "../schema/city-manager.schema";
import { type CityManagerData } from "@/constants/city-manager";
import { buildUrl } from "@/lib/build-query-string";
import { CITY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/city-manager.endpoints";
import { useTableFilters } from "@/hooks/use-table-filters";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

// ── API payload types ─────────────────────────────────────────────────────────

interface CityManagerPayload {
  countryManagerId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  countryCode?: string;
  phoneNumber?: string;
  address?: string;
  address2?: string;
  residentialCountry?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  country?: string;
  assignCities?: string;
  managerStatus?: string;
}

interface UpdateCityManagerPayload extends CityManagerPayload {
  id: string;
}

// ── API response types ────────────────────────────────────────────────────────

interface RawCityManager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode?: string;
  phoneNumber?: string;
  address?: string;
  address2?: string;
  residentialCountry?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  country?: string;
  assignCities?: string;
  managerStatus?: string;
  addedOn?: string;
  image?: string;
}

interface CityManagerListResponse {
  data: RawCityManager[];
  message: string;
  status: boolean;
}

interface CityManagerMutationResponse {
  message: string;
  status: boolean;
  data: { id: string };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCityManagement() {
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
  } = useTableFilters(100);

  const queryString = buildUrl("", {
    page: page.toString(),
    limit: limit.toString(),
  }).replace("?", "");

  const queryKey = [...API_CACHE_KEYS.CITY_MANAGERS, queryString];
  const url = `${CITY_MANAGER_ENDPOINTS.GET_CITY_MANAGERS}?${queryString}`;

  // ── GET ────────────────────────────────────────────────────────────────────
  const { data: rawData, isLoading, refetch } = useApiQuery<CityManagerListResponse>(queryKey, url);

  // ── POST (create) ──────────────────────────────────────────────────────────
  const createMutation = useApiMutation<CityManagerMutationResponse, CityManagerPayload>(
    "post",
    CITY_MANAGER_ENDPOINTS.CREATE_CITY_MANAGER,
  );

  // ── PATCH (update) — URL factory extracts id, rest goes as body ────────────
  const updateMutation = useApiMutation<CityManagerMutationResponse, UpdateCityManagerPayload>(
    "patch",
    ({ id }: UpdateCityManagerPayload) => CITY_MANAGER_ENDPOINTS.UPDATE_CITY_MANAGER(id),
  );

  // ── Data normalisation ─────────────────────────────────────────────────────

  const cityManagers = useMemo<CityManagerData[]>(() => {
    if (!rawData?.data) return [];
    return rawData.data.map((item: RawCityManager) => ({
      id: item.id,
      userId: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phoneCode: item.countryCode ?? "",
      phoneNumber: item.phoneNumber ?? "",
      address1: item.address ?? "",
      address2: item.address2 ?? "",
      residentialCountry: item.residentialCountry ?? "",
      state: item.state ?? "",
      city: item.city ?? "",
      zipcode: item.zipcode ?? "",
      country: item.country ?? "",
      assignedCities: item.assignCities ? item.assignCities.split(",") : [],
      createdAt: item.addedOn ?? new Date().toISOString(),
      status: item.managerStatus === "ACTIVE" ? "Active" : "Inactive",
      avatar: item.image ?? undefined,
    }));
  }, [rawData]);

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

  // ── Payload builder ────────────────────────────────────────────────────────

  const buildPayload = (
    values: CityManagerFormValues,
  ): Omit<CityManagerPayload, "countryManagerId" | "managerStatus"> => ({
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    countryCode: values.phoneCode,
    phoneNumber: values.phoneNumber.trim(),
    address: values.address1.trim(),
    address2: values.address2?.trim(),
    residentialCountry: values.residentialCountry,
    state: values.state,
    city: values.city,
    zipcode: values.zipcode?.trim() ?? "",
    country: values.country,
    assignCities: values.assignedCities.join(","),
  });

  // ── Action helpers ─────────────────────────────────────────────────────────

  const addCityManager = async (values: CityManagerFormValues) => {
    await createMutation.mutateAsync({
      ...buildPayload(values),
      managerStatus: "ACTIVE",
    });
    refetch();
  };

  const updateCityManager = async (id: string, values: CityManagerFormValues) => {
    await updateMutation.mutateAsync({ id, ...buildPayload(values) });
    refetch();
  };

  const toggleManagerStatus = async (id: string, checked: boolean) => {
    await updateMutation.mutateAsync({ id, managerStatus: checked ? "ACTIVE" : "INACTIVE" });
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
