import {
  MOCK_COUNTRY_MANAGERS,
  type CountryManagerData,
  type CountryManagerStatus,
} from "@/constants/country-manager";
import { useMemo, useState } from "react";
import { type CountryManagerFormValues } from "../schema/country-manager.schema";

const DEFAULT_STATUS_FILTER = "All";

export function useCountryManagement() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState<string>(DEFAULT_STATUS_FILTER);
  const [countryManagers, setCountryManagers] =
    useState<CountryManagerData[]>(MOCK_COUNTRY_MANAGERS);

  const filteredData = useMemo<CountryManagerData[]>(() => {
    return countryManagers.filter((manager) => {
      if (statusFilter !== DEFAULT_STATUS_FILTER && manager.status !== statusFilter) return false;
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
    return {
      total,
      active,
      countries,
      cities,
    };
  }, [countryManagers]);

  const hasFilters = Boolean(fromDate || toDate || statusFilter !== DEFAULT_STATUS_FILTER);

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatusFilter(DEFAULT_STATUS_FILTER);
  };

  const addCountryManager = (values: CountryManagerFormValues) => {
    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();

    const newItem: CountryManagerData = {
      id: `cm-${Date.now()}`,
      userId: String(countryManagers.length + 1),
      firstName,
      lastName,
      email: values.email.trim(),
      phoneCode: values.phoneCode,
      phoneNumber: values.phoneNumber.trim(),
      address1: values.address1.trim(),
      address2: values.address2?.trim(),
      residentialCountry: values.residentialCountry,
      state: values.state,
      city: values.city,
      zipcode: values.zipcode.trim(),
      assignedCountry: values.assignedCountry,
      assignedCityManagers: [],
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      status: "Active",
      avatar: values.image?.[0] ? URL.createObjectURL(values.image[0]) : undefined,
    };

    setCountryManagers((prev) => [newItem, ...prev]);
  };

  const updateCountryManager = (id: string, values: CountryManagerFormValues) => {
    setCountryManagers((prev) =>
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
          zipcode: values.zipcode.trim(),
          assignedCountry: values.assignedCountry,
          avatar: values.image?.[0] ? URL.createObjectURL(values.image[0]) : item.avatar,
        };
      }),
    );
  };

  const toggleManagerStatus = (id: string, checked: boolean) => {
    setCountryManagers((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: (checked ? "Active" : "Inactive") as CountryManagerStatus }
          : item,
      ),
    );
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
  };
}
