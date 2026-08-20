"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CheckCircle2, Globe, Layers, MapPin, Store, UserCheck, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { PageHeader } from "@/components/common/page-header";
import { errorToast, successToast } from "@/components/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCountriesDropdown } from "@/feature/private/settings/hooks/use-get-countries-dropdown";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { CITY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/city-manager.endpoints";
import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import {
  assignCityManagerSchema,
  type AssignCityManagerFormValues,
} from "./schema/assign-city-manager.schema";
import { ROUTES } from "@/config/routes";

interface RawCityManager {
  id: string;
  country: string;
  countryName?: string | null;
  firstName: string;
  lastName: string;
  assignCities?: string;
  assignCityNames?: string[];
  managerStatus?: string;
}

interface RawStore {
  id: string;
  storeName: string;
  country?: string;
  countryId?: string;
  countryName?: string | null;
  city?: string;
  cityId?: string;
  cityName?: string | null;
  assignedCityManager?: string | null;
  cityManager?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  storeAddress?: string;
  status?: string;
}

interface ApiListResponse<T> {
  data: T[];
}

export function AssignCityManagerToStore() {
  const { countries: countriesData } = useGetCountriesDropdown();

  const { data: rawCityManagers, isLoading: managersLoading } = useApiQuery<
    ApiListResponse<RawCityManager>
  >(["CITY_MANAGERS", "limit=1000"], `${CITY_MANAGER_ENDPOINTS.GET_CITY_MANAGERS}?limit=1000`);

  const {
    data: rawStores,
    isLoading: storesLoading,
    refetch: refetchStores,
  } = useApiQuery<ApiListResponse<RawStore>>(
    ["STORES", "limit=1000"],
    `${STORE_ENDPOINTS.GET_STORES}?limit=1000`,
  );

  const assignMutation = useApiMutation<unknown, { id: string; assignedCityManager: string }>(
    "patch",
    (body) => STORE_ENDPOINTS.UPDATE_STORE(body.id),
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AssignCityManagerFormValues>({
    resolver: zodResolver(assignCityManagerSchema),
    defaultValues: {
      country: "",
      cityManagerId: "",
      storeIds: [],
    },
    mode: "onSubmit",
  });

  const selectedCountry = useWatch({ control, name: "country" });
  const selectedCityManagerId = useWatch({ control, name: "cityManagerId" });

  const availableManagers = useMemo(() => {
    if (!rawCityManagers?.data || !selectedCountry) return [];
    return rawCityManagers.data
      .filter(
        (m) => (m.country || "").trim().toLowerCase() === selectedCountry.trim().toLowerCase(),
      )
      .map((m) => ({
        ...m,
        name: `${m.firstName || ""} ${m.lastName || ""}`.trim() || "City Manager",
      }));
  }, [rawCityManagers, selectedCountry]);

  const selectedManager = useMemo(() => {
    return availableManagers.find((m) => m.id === selectedCityManagerId);
  }, [availableManagers, selectedCityManagerId]);

  const managerAssignedCities = useMemo(() => {
    if (!selectedManager) return [];
    if (selectedManager.assignCityNames && selectedManager.assignCityNames.length > 0) {
      return selectedManager.assignCityNames;
    }
    if (!selectedManager.assignCities) return [];
    try {
      const parsed = JSON.parse(selectedManager.assignCities);
      if (Array.isArray(parsed)) return parsed;
      return [selectedManager.assignCities];
    } catch {
      return selectedManager.assignCities.split(",").map((s) => s.trim());
    }
  }, [selectedManager]);

  const managerAssignedCityIds = useMemo(() => {
    if (!selectedManager?.assignCities) return [];
    try {
      const parsed = JSON.parse(selectedManager.assignCities);
      if (Array.isArray(parsed)) return parsed.map((s: string) => s.trim().toLowerCase());
      return [selectedManager.assignCities.trim().toLowerCase()];
    } catch {
      return selectedManager.assignCities.split(",").map((s) => s.trim().toLowerCase());
    }
  }, [selectedManager]);

  const managerAssignedStores = useMemo(() => {
    if (!rawStores?.data || !selectedCityManagerId) return [];
    return rawStores.data.filter(
      (s) =>
        s.assignedCityManager === selectedCityManagerId ||
        s.cityManager?.id === selectedCityManagerId,
    );
  }, [rawStores, selectedCityManagerId]);

  const selectedCountryName = useMemo(() => {
    return countriesData.find((c) => c.id === selectedCountry)?.name || selectedCountry;
  }, [countriesData, selectedCountry]);

  const storesInSelectedCountry = useMemo(() => {
    if (!rawStores?.data || !selectedCountry) return [];
    return rawStores.data.filter((s) => {
      const storeCountry = s.countryId || s.country || "";
      return storeCountry.trim().toLowerCase() === selectedCountry.trim().toLowerCase();
    });
  }, [rawStores, selectedCountry]);

  const unassignedStores = useMemo(() => {
    return storesInSelectedCountry.filter((s) => {
      const hasAssignedManager =
        s.assignedCityManager &&
        s.assignedCityManager !== "null" &&
        s.assignedCityManager !== "" &&
        s.assignedCityManager !== "0";
      const hasCityManagerObj = Boolean(s.cityManager?.id);
      return !hasAssignedManager && !hasCityManagerObj;
    });
  }, [storesInSelectedCountry]);

  // Reset dependent fields when country changes
  useEffect(() => {
    setValue("cityManagerId", "");
    setValue("storeIds", []);
  }, [selectedCountry, setValue]);

  const handleUnassignStore = async (storeId: string, storeName: string) => {
    try {
      await assignMutation.mutateAsync({
        id: storeId,
        assignedCityManager: "null",
      });
      successToast({ title: `"${storeName}" successfully!` });
      await refetchStores();
    } catch {}
  };

  const onSubmit = async (data: AssignCityManagerFormValues) => {
    try {
      if (data.storeIds.length === 0) {
        errorToast({ title: "Please select at least one store." });
        return;
      }

      await Promise.all(
        data.storeIds.map((storeId) =>
          assignMutation.mutateAsync({
            id: storeId,
            assignedCityManager: data.cityManagerId,
          }),
        ),
      );

      successToast({
        title: `Assigned ${data.storeIds.length} store${data.storeIds.length > 1 ? "s" : ""} to ${selectedManager?.name || "City Manager"} successfully!`,
      });
      setValue("storeIds", []);
      await refetchStores();
    } catch {
      errorToast({ title: "Failed to assign stores. Please try again." });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Store Management", href: ROUTES.ADMIN.STORE_MANAGEMENT.ROOT },
          { label: "Assign City-Manager" },
        ]}
      />
      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
              <UserCheck className="text-primary size-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">
                Assign City Manager to Store
              </CardTitle>
              <p className="text-sm text-slate-500">
                Select a country and city manager to assign to unassigned stores
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
              {/* Country Selection */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <Globe className="size-3.5 text-slate-400" />
                  Select Country
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12! w-full rounded-xl border-slate-200 bg-slate-50">
                        <SelectValue placeholder="Select a country">
                          {field.value
                            ? countriesData.find((c) => c.id === field.value)?.name
                            : "Select a country"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {countriesData.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.country && (
                  <p className="text-xs font-medium text-red-500">{errors.country.message}</p>
                )}
              </div>

              {/* City Manager Selection */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <UserCheck className="size-3.5 text-slate-400" />
                  Select City Manager
                  <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="cityManagerId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedCountry}
                    >
                      <SelectTrigger className="h-12! w-full rounded-xl border-slate-200 bg-slate-50">
                        <SelectValue
                          placeholder={
                            !selectedCountry
                              ? "Select a country first"
                              : availableManagers.length === 0
                                ? "No City Manager in this country"
                                : "Select a city manager"
                          }
                        >
                          {field.value
                            ? availableManagers.find((m) => m.id === field.value)?.name
                            : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {availableManagers.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No City Manager in this country
                            </SelectItem>
                          ) : (
                            availableManagers.map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.cityManagerId && (
                  <p className="text-xs font-medium text-red-500">{errors.cityManagerId.message}</p>
                )}
              </div>
            </div>

            {selectedCityManagerId && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-6 transition-colors duration-300">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <Label className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    <MapPin className="text-primary size-4" />
                    Assigned Cities for {selectedManager?.name}
                  </Label>
                  {managerAssignedCities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {managerAssignedCities.map((city) => (
                        <Badge
                          key={city}
                          variant="secondary"
                          className="border-slate-200 bg-white text-slate-700 shadow-sm"
                        >
                          {city}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No cities assigned to this manager.</p>
                  )}
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <Label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <Store className="text-primary size-4" />
                      Assigned Stores for {selectedManager?.name} ({managerAssignedStores.length})
                    </Label>
                  </div>
                  {managerAssignedStores.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {managerAssignedStores.map((store) => (
                        <span
                          key={store.id}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white py-1.5 pr-2 pl-3 text-xs font-medium text-slate-700 shadow-xs"
                        >
                          <Building2 className="text-primary size-3.5" />
                          <span>{store.storeName}</span>
                          <span className="text-slate-400">
                            ({store.cityName || store.cityId || store.city || "N/A"})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUnassignStore(store.id, store.storeName)}
                            title="Unassign this store"
                            className="ml-1 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                          >
                            <X className="size-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No stores assigned to this manager yet.
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <Layers className="text-primary size-4" />
                      Unassigned Stores in {selectedCountryName} ({unassignedStores.length})
                      <span className="text-red-500">*</span>
                    </Label>

                    <Controller
                      name="storeIds"
                      control={control}
                      render={({ field }) => {
                        if (unassignedStores.length === 0) return <></>;
                        const allSelected =
                          unassignedStores.length > 0 &&
                          field.value.length === unassignedStores.length;
                        return (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (allSelected) {
                                field.onChange([]);
                              } else {
                                field.onChange(unassignedStores.map((s) => s.id));
                              }
                            }}
                            className="text-primary hover:text-primary/80 h-7 text-xs font-medium"
                          >
                            {allSelected ? "Deselect All" : "Select All"}
                          </Button>
                        );
                      }}
                    />
                  </div>

                  {unassignedStores.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                      <p className="text-sm font-medium text-slate-600">
                        {storesInSelectedCountry.length === 0
                          ? "There are no stores registered in this country yet."
                          : "All stores in this country already have a city manager assigned."}
                      </p>
                    </div>
                  ) : (
                    <Controller
                      name="storeIds"
                      control={control}
                      render={({ field }) => (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {unassignedStores.map((store) => {
                            const isChecked = field.value.includes(store.id);

                            return (
                              <label
                                key={store.id}
                                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-slate-50 ${
                                  isChecked
                                    ? "border-primary bg-primary/5 ring-primary/20 ring-1"
                                    : "border-slate-200 bg-white"
                                }`}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, store.id]);
                                    } else {
                                      field.onChange(field.value.filter((id) => id !== store.id));
                                    }
                                  }}
                                  className="mt-0.5"
                                />
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <p className="text-sm leading-none font-semibold text-slate-800">
                                      {store.storeName}
                                    </p>
                                  </div>
                                  <p className="text-xs text-slate-500">
                                    {store.cityName ||
                                      store.cityId ||
                                      store.city ||
                                      "No city specified"}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    />
                  )}
                  {errors.storeIds && (
                    <p className="text-xs font-medium text-red-500">{errors.storeIds.message}</p>
                  )}
                </div>

                {unassignedStores.length > 0 && (
                  <div className="border-t border-slate-100 pt-4">
                    <Button
                      type="submit"
                      isLoading={isSubmitting || storesLoading || managersLoading}
                      disabled={isSubmitting || storesLoading || managersLoading}
                      className="h-12 w-full rounded-xl font-semibold shadow-sm sm:w-auto sm:min-w-48"
                    >
                      <CheckCircle2 className="mr-2 size-4" />
                      Assign Selected Stores
                    </Button>
                  </div>
                )}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
