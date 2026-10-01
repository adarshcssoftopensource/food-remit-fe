"use client";

import { useMemo, useState } from "react";

import { Building2, Loader2, MapPin, Search, X } from "lucide-react";

import { CountrySelect } from "@/components/common/country-select";
import { ImageUpload } from "@/components/common/image-upload";
import { StoreSelect } from "@/components/common/store-select";
import { useProfile } from "@/components/providers/profile-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetCities } from "@/feature/private/(shared)/settings/hooks/use-get-cities";
import { cn } from "@/lib/utils";
import { FormDialogFooter } from "../../components/form-dialog-footer";
import { DepartmentFormValues, useDepartmentForm } from "../../hooks/useDepartmentForm";
import type { DepartmentData } from "../types/department.types";

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: DepartmentData | null;
  onSubmit?: (values: DepartmentFormValues) => void;
}

type DepartmentForm = ReturnType<typeof useDepartmentForm>["form"];

type CityOption = { id: string; name: string };

function getDepartmentRoleFlags(
  profile: ReturnType<typeof useProfile>["profile"],
  isSuperAdmin: boolean,
) {
  const role = profile?.role || "";
  const roleCode = profile?.roleCode || "";
  const isCityManager = role === "city_manager" || roleCode === "CITY_MANAGER";
  const isGlobalCreator =
    isSuperAdmin ||
    role === "sub_admin" ||
    role === "country_manager" ||
    roleCode === "SUB_ADMIN" ||
    roleCode === "COUNTRY_MANAGER";
  return { isCityManager, isGlobalCreator };
}

function getCitiesQueryCountryId(countryId: string | undefined) {
  return countryId && countryId !== "All" && countryId !== "all" ? countryId : undefined;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  onSubmit,
}: DepartmentFormDialogProps) {
  const isEditing = !!department;
  const { profile, isSuperAdmin } = useProfile();
  const { isCityManager, isGlobalCreator } = getDepartmentRoleFlags(profile, isSuperAdmin);

  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [selectedCitySearchQuery, setSelectedCitySearchQuery] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCitySearchQuery("");
      setSelectedCitySearchQuery("");
    }
    onOpenChange(nextOpen);
  };

  const { form, isSubmitting, handleSubmit, isStoreScoped } = useDepartmentForm(
    open,
    department,
    handleOpenChange,
    onSubmit,
    profile,
  );

  const countryId = form.watch("countryId");
  const rawCityIds = form.watch("cityIds");
  const cityIds = useMemo(() => rawCityIds || [], [rawCityIds]);

  const { data: citiesResponse, isLoading: isLoadingCities } = useGetCities({
    countryId: getCitiesQueryCountryId(countryId),
    limit: 1000,
  });

  const citiesList = useMemo(() => {
    const list = citiesResponse?.data ?? [];
    const unique = Array.from(new Map(list.map((c) => [c.id, c])).values());
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, [citiesResponse?.data]);

  const addCity = (cityId: string) => {
    const currentIds = form.getValues("cityIds") || [];
    if (!currentIds.includes(cityId)) {
      form.setValue("cityIds", [...currentIds, cityId]);
    }
  };

  const removeCity = (cityId: string) => {
    const currentIds = form.getValues("cityIds") || [];
    form.setValue(
      "cityIds",
      currentIds.filter((id) => id !== cityId),
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-xl! overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-0 sm:w-full">
        <div className="from-primary/10 via-primary to-primary/10 absolute inset-x-0 top-0 z-20 h-0.5" />

        <DialogHeader className="border-b border-slate-100 bg-linear-to-br from-slate-50 via-white to-white px-6 py-6 sm:px-7 dark:border-slate-800 dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-950">
          <div className="item-center flex items-start gap-4">
            <div className="bg-primary/10 text-primary ring-primary/10 relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1">
              <Building2 className="h-5.5 w-5.5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {isEditing ? "Edit Department" : "Create Department"}
                </DialogTitle>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex max-h-[calc(92vh-130px)] flex-col pb-4">
            <div className="overflow-y-auto px-6 py-6 sm:px-7">
              <div className="space-y-5">
                {!isStoreScoped && (
                  <DepartmentCountryField
                    form={form}
                    onCountryChange={() => {
                      setCitySearchQuery("");
                      setSelectedCitySearchQuery("");
                    }}
                  />
                )}

                {!isStoreScoped && (isCityManager || isGlobalCreator) && (
                  <DepartmentCitiesField
                    form={form}
                    countryId={countryId}
                    cityIds={cityIds}
                    citiesList={citiesList}
                    isLoadingCities={isLoadingCities}
                    citySearchQuery={citySearchQuery}
                    onCitySearchChange={setCitySearchQuery}
                    selectedCitySearchQuery={selectedCitySearchQuery}
                    onSelectedCitySearchChange={setSelectedCitySearchQuery}
                    onAddCity={addCity}
                    onRemoveCity={removeCity}
                    isCityManager={isCityManager}
                    isGlobalCreator={isGlobalCreator}
                    isStoreScoped={isStoreScoped}
                  />
                )}

                {!isStoreScoped && (
                  <DepartmentStoreField
                    form={form}
                    countryId={countryId}
                    cityIds={cityIds}
                    initialStoreName={department?.storeName}
                  />
                )}

                <FormField
                  control={form.control}
                  name="departmentName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                        Department Name <span className="text-destructive">*</span>
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="e.g. Fresh Produce"
                          className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium shadow-none transition-colors placeholder:text-slate-400 hover:bg-white focus:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DepartmentIconField form={form} department={department} />
              </div>
            </div>

            <FormDialogFooter
              onCancel={() => onOpenChange(false)}
              isSubmitting={isSubmitting}
              isEditing={isEditing}
              entityLabel="Department"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DepartmentCountryField({
  form,
  onCountryChange,
}: {
  form: DepartmentForm;
  onCountryChange: () => void;
}) {
  return (
    <FormField
      control={form.control}
      name="countryId"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
            Country <span className="text-destructive">*</span>
          </FormLabel>

          <CountrySelect
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              form.setValue("cityIds", []);
              form.setValue("storeId", "");
              onCountryChange();
            }}
            valueKey="id"
            placeholder="Select country"
            className="h-11 w-full rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium shadow-none transition-colors hover:bg-white focus:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-900"
          />

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface DepartmentCitiesFieldProps {
  form: DepartmentForm;
  countryId: string | undefined;
  cityIds: string[];
  citiesList: CityOption[];
  isLoadingCities: boolean;
  citySearchQuery: string;
  onCitySearchChange: (value: string) => void;
  selectedCitySearchQuery: string;
  onSelectedCitySearchChange: (value: string) => void;
  onAddCity: (cityId: string) => void;
  onRemoveCity: (cityId: string) => void;
  isCityManager: boolean;
  isGlobalCreator: boolean;
  isStoreScoped: boolean;
}

function DepartmentCitiesField({
  form,
  countryId,
  cityIds,
  citiesList,
  isLoadingCities,
  citySearchQuery,
  onCitySearchChange,
  selectedCitySearchQuery,
  onSelectedCitySearchChange,
  onAddCity,
  onRemoveCity,
  isCityManager,
  isGlobalCreator,
  isStoreScoped,
}: DepartmentCitiesFieldProps) {
  const filteredCities = useMemo(() => {
    const query = citySearchQuery.trim().toLowerCase();
    if (!query) return citiesList;
    return citiesList.filter((c) => c.name.toLowerCase().includes(query));
  }, [citySearchQuery, citiesList]);

  const selectedCities = useMemo(() => {
    const cityIdSet = new Set(cityIds);
    return citiesList.filter((c) => cityIdSet.has(c.id));
  }, [citiesList, cityIds]);

  const filteredSelectedCities = useMemo(() => {
    const query = selectedCitySearchQuery.trim().toLowerCase();
    if (!query) return selectedCities;
    return selectedCities.filter((c) => c.name.toLowerCase().includes(query));
  }, [selectedCitySearchQuery, selectedCities]);

  const isCountryUnselected = !countryId || countryId === "all" || countryId === "All";

  return (
    <FormField
      control={form.control}
      name="cityIds"
      render={() => (
        <FormItem className="space-y-2">
          <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
            Cities {isCityManager && <span className="text-destructive">*</span>}
            {isGlobalCreator && (
              <span className="ml-1 font-medium text-slate-400 normal-case">
                (optional — leave empty for Global)
              </span>
            )}
            {isStoreScoped && (
              <span className="ml-1 font-medium text-slate-400 normal-case">
                (optional — leave empty for your store&apos;s city)
              </span>
            )}
          </FormLabel>

          <div className="space-y-3">
            {isCountryUnselected ? (
              <Button
                type="button"
                variant="outline"
                disabled
                className="h-11 w-full justify-between rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium shadow-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/50"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-500">Select cities</span>
                </span>
              </Button>
            ) : (
              <CityPickerPopover
                cityIds={cityIds}
                selectedCount={selectedCities.length}
                filteredCities={filteredCities}
                isLoadingCities={isLoadingCities}
                citySearchQuery={citySearchQuery}
                onCitySearchChange={onCitySearchChange}
                onAddCity={onAddCity}
              />
            )}

            {selectedCities.length > 0 && (
              <SelectedCitiesList
                filteredSelectedCities={filteredSelectedCities}
                selectedCitySearchQuery={selectedCitySearchQuery}
                onSelectedCitySearchChange={onSelectedCitySearchChange}
                onRemoveCity={onRemoveCity}
              />
            )}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function CityPickerPopover({
  cityIds,
  selectedCount,
  filteredCities,
  isLoadingCities,
  citySearchQuery,
  onCitySearchChange,
  onAddCity,
}: {
  cityIds: string[];
  selectedCount: number;
  filteredCities: CityOption[];
  isLoadingCities: boolean;
  citySearchQuery: string;
  onCitySearchChange: (value: string) => void;
  onAddCity: (cityId: string) => void;
}) {
  const selectedCityIdSet = new Set(cityIds);

  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full justify-between rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium shadow-none transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-900"
        >
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">
              {selectedCount > 0
                ? `${selectedCount} ${selectedCount === 1 ? "city" : "cities"} selected`
                : "Select cities"}
            </span>
          </span>
          <Loader2
            className={cn(
              "h-4 w-4",
              isLoadingCities && "animate-spin",
              !isLoadingCities && "hidden",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full gap-2 p-2" side="bottom">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search cities..."
            value={citySearchQuery}
            onChange={(e) => onCitySearchChange(e.target.value)}
            className="h-9 border-slate-200 pl-9 text-sm dark:border-slate-800"
          />
        </div>

        <div className="max-h-60 overflow-y-auto rounded-md pt-1">
          {isLoadingCities ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading cities...
            </div>
          ) : filteredCities.length ? (
            filteredCities.map((city) => {
              const isSelected = selectedCityIdSet.has(city.id);
              return (
                <Button
                  key={city.id}
                  type="button"
                  variant="ghost"
                  onClick={() => onAddCity(city.id)}
                  disabled={isSelected}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 capitalize transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                    isSelected && "cursor-not-allowed opacity-50",
                  )}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="flex-1 truncate capitalize">{city.name}</span>
                  {isSelected && <span className="text-xs text-slate-400">(Added)</span>}
                </Button>
              );
            })
          ) : (
            <p className="px-2 py-6 text-center text-sm text-slate-500">No cities found.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SelectedCitiesList({
  filteredSelectedCities,
  selectedCitySearchQuery,
  onSelectedCitySearchChange,
  onRemoveCity,
}: {
  filteredSelectedCities: CityOption[];
  selectedCitySearchQuery: string;
  onSelectedCitySearchChange: (value: string) => void;
  onRemoveCity: (cityId: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search selected cities..."
          value={selectedCitySearchQuery}
          onChange={(e) => onSelectedCitySearchChange(e.target.value)}
          className="h-9 border-slate-200 pl-9 text-sm dark:border-slate-800"
        />
      </div>
      <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border border-slate-200 bg-slate-50/50 p-2 dark:border-slate-700 dark:bg-slate-900/30">
        {filteredSelectedCities.length > 0 ? (
          filteredSelectedCities.map((city) => (
            <div
              key={city.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <span className="flex items-center gap-2 truncate capitalize">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{city.name}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveCity(city.id)}
                className="h-7 w-7 shrink-0 rounded-lg p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-sm text-slate-500">No matching cities found.</p>
        )}
      </div>
    </div>
  );
}

function DepartmentStoreField({
  form,
  countryId,
  cityIds,
  initialStoreName,
}: {
  form: DepartmentForm;
  countryId: string | undefined;
  cityIds: string[];
  initialStoreName: string | null | undefined;
}) {
  return (
    <FormField
      control={form.control}
      name="storeId"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
            Store{" "}
            <span className="ml-1 font-medium text-slate-400 normal-case">
              (optional — select store for store-specific department)
            </span>
          </FormLabel>

          <StoreSelect
            value={field.value || ""}
            onValueChange={(val) => field.onChange(val)}
            countryId={countryId}
            cityId={cityIds.length > 0 ? cityIds[0] : undefined}
            includeAll={true}
            allLabel="All Stores (Location Wide)"
            placeholder="Select store..."
            initialStoreName={initialStoreName || undefined}
          />

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function DepartmentIconField({
  form,
  department,
}: {
  form: DepartmentForm;
  department?: DepartmentData | null;
}) {
  return (
    <FormField
      control={form.control}
      name="iconFile"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <div className="flex items-center justify-between">
            <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
              Department Icon <span className="text-destructive">*</span>
            </FormLabel>

            <span className="text-[10px] font-medium text-slate-400">PNG / JPG / WEBP</span>
          </div>

          <FormControl>
            <div className="hover:border-primary/40 hover:bg-primary/2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-2 transition-colors dark:border-slate-700 dark:bg-slate-900/40">
              <ImageUpload
                maxFiles={1}
                multiple={false}
                value={field.value}
                onChange={(files) => {
                  field.onChange(files);
                  if (files.length > 0) {
                    form.setValue("hasExistingIcon", false);
                  }
                }}
                onAllImagesChange={(all) => {
                  form.setValue("hasExistingIcon", all.length > 0);
                }}
                label="Upload department logo"
                hint="Click to browse or drag & drop"
                initialImages={
                  department?.departmentIconUrl || department?.departmentIcon
                    ? [department.departmentIconUrl || department.departmentIcon!]
                    : []
                }
              />
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
