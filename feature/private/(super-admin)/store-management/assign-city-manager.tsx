"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserCheck } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { PageHeader } from "@/components/common/page-header";
import { errorToast, successToast } from "@/components/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { useGetCountriesDropdown } from "@/feature/private/(shared)/settings/hooks/use-get-countries-dropdown";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { CITY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/city-manager.endpoints";
import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import {
  assignCityManagerSchema,
  type AssignCityManagerFormValues,
} from "./schema/assign-city-manager.schema";
import { AssignCityManagerDetails } from "./components/assign-city-manager-details";
import { AssignCityManagerSelectors } from "./components/assign-city-manager-selectors";
import { type RawCityManager, type RawStore } from "./types/assign-city-manager";

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
      .filter((m) => {
        const matchesCountry =
          (m.country || "").trim().toLowerCase() === selectedCountry.trim().toLowerCase();
        const isActive = (m.managerStatus || "").toUpperCase() !== "INACTIVE";
        return matchesCountry && isActive;
      })
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
      setValue("country", "");
      setValue("cityManagerId", "");
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
            <AssignCityManagerSelectors
              control={control}
              errors={errors}
              selectedCountry={selectedCountry}
              availableManagers={availableManagers}
            />

            {selectedCityManagerId && (
              <AssignCityManagerDetails
                control={control}
                errors={errors}
                selectedManager={selectedManager}
                managerAssignedCities={managerAssignedCities}
                managerAssignedStores={managerAssignedStores}
                selectedCountryName={selectedCountryName}
                storesInSelectedCountry={storesInSelectedCountry}
                unassignedStores={unassignedStores}
                onUnassignStore={handleUnassignStore}
                isSubmitting={isSubmitting}
                storesLoading={storesLoading}
                managersLoading={managersLoading}
              />
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
