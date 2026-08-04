import {
  MOCK_CITY_MANAGERS,
  type CityManagerData,
  type CityManagerStatus,
} from "@/constants/city-manager";
import { useMemo, useState } from "react";
import { type CityManagerFormValues } from "../schema/city-manager.schema";

const DEFAULT_STATUS_FILTER = "All";

export function useCityManagement() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);
  const [cityManagers, setCityManagers] = useState<CityManagerData[]>(MOCK_CITY_MANAGERS);

  const filteredData = useMemo<CityManagerData[]>(() => {
    return cityManagers.filter((manager) => {
      if (statusFilter !== DEFAULT_STATUS_FILTER && manager.status !== statusFilter) return false;
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

  const hasFilters = Boolean(fromDate || toDate || statusFilter !== DEFAULT_STATUS_FILTER);

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatusFilter(DEFAULT_STATUS_FILTER);
  };

  const addCityManager = (values: CityManagerFormValues) => {
    const newItem: CityManagerData = {
      id: `cym-${Date.now()}`,
      userId: String(cityManagers.length + 1),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phoneCode: values.phoneCode,
      phoneNumber: values.phoneNumber.trim(),
      address1: values.address1.trim(),
      address2: values.address2?.trim(),
      residentialCountry: values.residentialCountry,
      state: values.state,
      city: values.city,
      zipcode: values.zipcode?.trim() ?? "",
      country: values.country,
      assignedCities: values.assignedCities,
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      status: "Active",
      avatar: values.image?.[0] ? URL.createObjectURL(values.image[0]) : undefined,
    };
    setCityManagers((prev) => [newItem, ...prev]);
  };

  const updateCityManager = (id: string, values: CityManagerFormValues) => {
    setCityManagers((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          phoneCode: values.phoneCode,
          phoneNumber: values.phoneNumber.trim(),
          address1: values.address1.trim(),
          address2: values.address2?.trim(),
          residentialCountry: values.residentialCountry,
          state: values.state,
          city: values.city,
          zipcode: values.zipcode?.trim() ?? "",
          country: values.country,
          assignedCities: values.assignedCities,
          avatar: values.image?.[0] ? URL.createObjectURL(values.image[0]) : item.avatar,
        };
      }),
    );
  };

  const toggleManagerStatus = (id: string, checked: boolean) => {
    setCityManagers((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: (checked ? "Active" : "Inactive") as CityManagerStatus }
          : item,
      ),
    );
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
  };
}
