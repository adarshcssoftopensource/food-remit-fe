import { useMemo } from "react";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { type CountryManagerFormValues } from "../schema/country-manager.schema";
import { type CountryManagerData } from "@/constants/country-manager";
import { buildUrl } from "@/lib/build-query-string";
import { COUNTRY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/country-manager.endpoints";
import { useTableFilters } from "@/hooks/use-table-filters";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

// ── API payload types ─────────────────────────────────────────────────────────

interface CountryManagerPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  countryCode?: string;
  phoneNumber?: string;
  address?: string;
  address2?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  assignCountries?: string;
  managerStatus?: string;
}

interface UpdateCountryManagerPayload extends CountryManagerPayload {
  id: string;
}

// ── API response types ────────────────────────────────────────────────────────

interface RawCountryManager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode?: string;
  phoneNumber?: string;
  address?: string;
  address2?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  assignCountries?: string;
  managerStatus?: string;
  addedOn?: string;
  image?: string;
}

interface CountryManagerListResponse {
  data: RawCountryManager[];
  message: string;
  status: boolean;
}

interface CountryManagerMutationResponse {
  message: string;
  status: boolean;
  data: { id: string };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCountryManagement() {
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

  const queryString = buildUrl("", {
    page: page.toString(),
    limit: limit.toString(),
  }).replace("?", "");

  const queryKey = [...API_CACHE_KEYS.COUNTRY_MANAGERS, queryString];
  const url = `${COUNTRY_MANAGER_ENDPOINTS.GET_COUNTRY_MANAGERS}?${queryString}`;

  // ── GET ────────────────────────────────────────────────────────────────────
  const {
    data: rawData,
    isLoading,
    refetch,
  } = useApiQuery<CountryManagerListResponse>(queryKey, url);

  // ── POST (create) ──────────────────────────────────────────────────────────
  const createMutation = useApiMutation<CountryManagerMutationResponse, CountryManagerPayload>(
    "post",
    COUNTRY_MANAGER_ENDPOINTS.CREATE_COUNTRY_MANAGER,
  );

  // ── PATCH (update) — URL factory extracts id, rest goes as body ────────────
  const updateMutation = useApiMutation<
    CountryManagerMutationResponse,
    UpdateCountryManagerPayload
  >("patch", ({ id }: UpdateCountryManagerPayload) =>
    COUNTRY_MANAGER_ENDPOINTS.UPDATE_COUNTRY_MANAGER(id),
  );

  // ── Data normalisation ─────────────────────────────────────────────────────

  const countryManagers = useMemo<CountryManagerData[]>(() => {
    if (!rawData?.data) return [];
    return rawData.data.map((item: RawCountryManager) => ({
      id: item.id,
      userId: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phoneCode: item.countryCode ?? "",
      phoneNumber: item.phoneNumber ?? "",
      address1: item.address ?? "",
      address2: item.address2 ?? "",
      residentialCountry: item.country ?? "",
      state: item.state ?? "",
      city: item.city ?? "",
      zipcode: item.zipcode ?? "",
      assignedCountry: item.assignCountries ?? "",
      assignedCityManagers: [],
      createdAt: item.addedOn ?? new Date().toISOString(),
      status: item.managerStatus === "ACTIVE" ? "Active" : "Inactive",
      avatar: item.image ?? undefined,
    }));
  }, [rawData]);

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

  // ── Payload builder ────────────────────────────────────────────────────────

  const buildPayload = (values: CountryManagerFormValues): CountryManagerPayload => ({
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    countryCode: values.phoneCode,
    phoneNumber: values.phoneNumber.trim(),
    address: values.address1.trim(),
    address2: values.address2?.trim(),
    country: values.residentialCountry,
    state: values.state,
    city: values.city,
    zipcode: values.zipcode.trim(),
    assignCountries: values.assignedCountry,
  });

  // ── Action helpers ─────────────────────────────────────────────────────────

  const addCountryManager = async (values: CountryManagerFormValues) => {
    await createMutation.mutateAsync({ ...buildPayload(values), managerStatus: "ACTIVE" });
    refetch();
  };

  const updateCountryManager = async (id: string, values: CountryManagerFormValues) => {
    await updateMutation.mutateAsync({ id, ...buildPayload(values) });
    refetch();
  };

  const toggleManagerStatus = async (id: string, checked: boolean) => {
    await updateMutation.mutateAsync({ id, managerStatus: checked ? "ACTIVE" : "INACTIVE" });
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
