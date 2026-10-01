"use client";

import { Building2, CheckCircle2, Layers, MapPin, Store, X } from "lucide-react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { type AssignCityManagerFormValues } from "../schema/assign-city-manager.schema";
import { type AvailableCityManager, type RawStore } from "../types/assign-city-manager";

interface AssignCityManagerDetailsProps {
  control: Control<AssignCityManagerFormValues>;
  errors: FieldErrors<AssignCityManagerFormValues>;
  selectedManager?: AvailableCityManager;
  managerAssignedCities: string[];
  managerAssignedStores: RawStore[];
  selectedCountryName: string;
  storesInSelectedCountry: RawStore[];
  unassignedStores: RawStore[];
  onUnassignStore: (storeId: string, storeName: string) => void;
  isSubmitting: boolean;
  storesLoading: boolean;
  managersLoading: boolean;
}

export function AssignCityManagerDetails({
  control,
  errors,
  selectedManager,
  managerAssignedCities,
  managerAssignedStores,
  selectedCountryName,
  storesInSelectedCountry,
  unassignedStores,
  onUnassignStore,
  isSubmitting,
  storesLoading,
  managersLoading,
}: AssignCityManagerDetailsProps) {
  return (
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
                  onClick={() => onUnassignStore(store.id, store.storeName)}
                  title="Unassign this store"
                  className="ml-1 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No stores assigned to this manager yet.</p>
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
                unassignedStores.length > 0 && field.value.length === unassignedStores.length;
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
                          {store.cityName || store.cityId || store.city || "No city specified"}
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
  );
}
