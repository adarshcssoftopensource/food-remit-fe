"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, UserCheck, MapPin, Store } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useMemo, useEffect } from "react";

import { PageHeader } from "@/components/common/page-header";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import { CITY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/city-manager.endpoints";
import { successToast, errorToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCountriesDropdown } from "@/feature/private/settings/hooks/use-get-countries-dropdown";
import {
  assignCityManagerSchema,
  type AssignCityManagerFormValues,
} from "./schema/assign-city-manager.schema";

interface RawCityManager {
  id: string;
  country: string;
  firstName: string;
  lastName: string;
  assignCities?: string;
}

interface RawStore {
  id: string;
  country: string;
  storeName: string;
  city: string;
  assignedCityManager?: string | null;
}

interface ApiListResponse<T> {
  data: T[];
}

export function AssignCityManagerToStore() {
  const { countries: countriesData } = useGetCountriesDropdown();

  const { data: rawCityManagers, isLoading: managersLoading } = useApiQuery<
    ApiListResponse<RawCityManager>
  >(["CITY_MANAGERS"], CITY_MANAGER_ENDPOINTS.GET_CITY_MANAGERS);

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
    reset,
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
    if (!rawCityManagers?.data) return [];
    return rawCityManagers.data
      .filter((m) => m.country === selectedCountry)
      .map((m) => ({ ...m, name: `${m.firstName} ${m.lastName}` }));
  }, [rawCityManagers, selectedCountry]);

  const selectedManager = useMemo(() => {
    return availableManagers.find((m) => m.id === selectedCityManagerId);
  }, [availableManagers, selectedCityManagerId]);

  const managerAssignedCities = useMemo(() => {
    if (!selectedManager || !selectedManager.assignCities) return [];
    try {
      const parsed = JSON.parse(selectedManager.assignCities);
      if (Array.isArray(parsed)) return parsed;
      return [selectedManager.assignCities];
    } catch {
      return selectedManager.assignCities.split(",").map((s) => s.trim());
    }
  }, [selectedManager]);

  const storesInSelectedCountry = useMemo(() => {
    if (!rawStores?.data || !selectedCountry) return [];
    return rawStores.data.filter(
      (s) => s.country?.trim().toLowerCase() === selectedCountry.trim().toLowerCase(),
    );
  }, [rawStores, selectedCountry]);

  const unassignedStores = useMemo(() => {
    return storesInSelectedCountry.filter((s) => {
      return !s.assignedCityManager || s.assignedCityManager === "null";
    });
  }, [storesInSelectedCountry]);

  // Reset dependent fields when country changes
  useEffect(() => {
    setValue("cityManagerId", "");
    setValue("storeIds", []);
  }, [selectedCountry, setValue]);

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

      successToast({ title: "City Manager assigned to stores successfully!" });
      reset();
      refetchStores();
    } catch {
      errorToast({ title: "Failed to assign city manager." });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assign City-Manager To Stores"
        description="Assign a city manager to oversee stores in a specific country."
      />

      <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
              <UserCheck className="text-primary size-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">
                Assign City Manager
              </CardTitle>
              <p className="text-sm text-slate-500">
                Select a country and a city manager to assign to unassigned stores
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
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {countriesData.map((c) => (
                            <SelectItem key={c.id} value={c.name}>
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
                        {/* We use field.value to explicitly display the name inside SelectValue by mapping it */}
                        <SelectValue
                          placeholder={
                            !selectedCountry
                              ? "Select a country first"
                              : availableManagers.length === 0
                                ? "No City Manager in this country"
                                : "Select a city manager"
                          }
                        >
                          {field.value && availableManagers.find((m) => m.id === field.value)?.name}
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
              <div className="animate-in fade-in slide-in-from-top-2 space-y-6 duration-300">
                {/* Display Manager's Assigned Cities */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <Label className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    <MapPin className="text-primary size-4" />
                    Assigned Cities for {selectedManager?.name}
                  </Label>
                  {managerAssignedCities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {managerAssignedCities.map((city, idx) => (
                        <Badge
                          key={idx}
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

                {/* Display Unassigned Stores */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    <Store className="text-primary size-4" />
                    Unassigned Stores in {selectedCountry}
                    <span className="text-red-500">*</span>
                  </Label>

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
                          {unassignedStores.map((store) => (
                            <label
                              key={store.id}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all hover:bg-slate-50 ${
                                field.value.includes(store.id)
                                  ? "border-primary bg-primary/5 ring-primary/20 ring-1"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <Checkbox
                                checked={field.value.includes(store.id)}
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
                                <p className="text-sm leading-none font-semibold text-slate-800">
                                  {store.storeName}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {store.city || "No city specified"}
                                </p>
                              </div>
                            </label>
                          ))}
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
                      className="h-12 w-full rounded-xl font-semibold shadow-sm sm:w-auto sm:min-w-40"
                    >
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
