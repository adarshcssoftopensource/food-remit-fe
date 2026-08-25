"use client";

import { useMemo, useState } from "react";

import { Building2, Globe2, Loader2, MapPin, Search, X } from "lucide-react";

import { CountrySelect } from "@/components/common/country-select";
import { ImageUpload } from "@/components/common/image-upload";
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
import { useGetCities } from "@/feature/private/settings/hooks/use-get-cities";
import { cn } from "@/lib/utils";
import { DepartmentFormValues, useDepartmentForm } from "../../hooks/useDepartmentForm";
import type { DepartmentData } from "../types/department.types";

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: DepartmentData | null;
  onSubmit?: (values: DepartmentFormValues) => void;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  onSubmit,
}: DepartmentFormDialogProps) {
  const isEditing = !!department;
  const { profile, isSuperAdmin } = useProfile();
  const role = profile?.role || "";
  const isCityManager = role === "city_manager";
  const isStoreScoped = role === "store_manager" || role === "employee";
  const isGlobalCreator = isSuperAdmin || role === "sub_admin" || role === "country_manager";

  const { form, isSubmitting, handleSubmit } = useDepartmentForm(
    open,
    department,
    onOpenChange,
    onSubmit,
  );

  const countryId = form.watch("countryId");
  const cityIds = form.watch("cityIds") || [];
  const [citySearchQuery, setCitySearchQuery] = useState("");

  const { data: citiesResponse, isLoading: isLoadingCities } = useGetCities({
    countryId: countryId && countryId !== "All" && countryId !== "all" ? countryId : undefined,
    limit: 1000,
  });

  const citiesList = useMemo(() => {
    const list = citiesResponse?.data ?? [];
    const unique = Array.from(new Map(list.map((c) => [c.id, c])).values());
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, [citiesResponse?.data]);

  const filteredCities = useMemo(() => {
    const query = citySearchQuery.trim().toLowerCase();
    if (!query) return citiesList;
    return citiesList.filter((c) => c.name.toLowerCase().includes(query));
  }, [citySearchQuery, citiesList]);

  const selectedCities = useMemo(() => {
    return citiesList.filter((c) => cityIds.includes(c.id));
  }, [citiesList, cityIds]);

  const filteredSelectedCities = useMemo(() => {
    const query = citySearchQuery.trim().toLowerCase();
    if (!query) return selectedCities;
    return selectedCities.filter((c) => c.name.toLowerCase().includes(query));
  }, [citySearchQuery, selectedCities]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-xl! overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-0 sm:w-full">
        <div className="from-primary/10 via-primary to-primary/10 absolute inset-x-0 top-0 z-20 h-0.5" />

        <DialogHeader className="border-b border-slate-100 bg-linear-to-br from-slate-50 via-white to-white px-6 py-6 sm:px-7 dark:border-slate-800 dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-950">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary ring-primary/10 relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1">
              <Building2 className="h-5.5 w-5.5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {isEditing ? "Edit Department" : "Create Department"}
                </DialogTitle>

                <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase">
                  {isEditing ? "Edit Record" : "New Record"}
                </span>
              </div>

              {/* <DialogDescription className="mt-1.5 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
                {isEditing
                  ? "Update the department information and keep your organization directory current."
                  : "Create a new department and add it to your organization directory."}
              </DialogDescription> */}

              <div className="mt-3">
                {isGlobalCreator ? (
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-500/20">
                    <Globe2 className="h-3 w-3" />
                    Creates as Global (All Cities) unless a city is selected
                  </p>
                ) : isStoreScoped ? (
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-500/20">
                    <MapPin className="h-3 w-3" />
                    Scoped to your store city — not global
                  </p>
                ) : isCityManager ? (
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-500/20">
                    <MapPin className="h-3 w-3" />
                    City scoped — select your assigned city
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex max-h-[calc(92vh-130px)] flex-col pb-4">
            <div className="overflow-y-auto px-6 py-6 sm:px-7">
              <div className="space-y-5">
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
                        }}
                        valueKey="id"
                        placeholder="Select country"
                        className="h-11 w-full rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium shadow-none transition-colors hover:bg-white focus:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(isCityManager || isGlobalCreator) && (
                  <FormField
                    control={form.control}
                    name="cityIds"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                          Cities {isCityManager && <span className="text-destructive">*</span>}
                          {isGlobalCreator && (
                            <span className="ml-1 font-medium text-slate-400 normal-case">
                              (optional — leave empty for Global)
                            </span>
                          )}
                        </FormLabel>

                        <div className="space-y-3">
                          <Popover>
                            <PopoverTrigger className={"w-full"}>
                              <Button
                                type="button"
                                variant="outline"
                                className="h-11 w-full justify-between rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium shadow-none transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                              >
                                <span className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-slate-400" />
                                  <span className="text-slate-500">
                                    {selectedCities.length > 0
                                      ? `${selectedCities.length} city${selectedCities.length > 1 ? "ies" : ""} selected`
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
                            <PopoverContent
                              align="start"
                              className="w-full gap-2 p-2"
                              side="bottom"
                            >
                              <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                  placeholder="Search cities..."
                                  value={citySearchQuery}
                                  onChange={(e) => setCitySearchQuery(e.target.value)}
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
                                    const isSelected = cityIds.includes(city.id);
                                    return (
                                      <Button
                                        key={city.id}
                                        type="button"
                                        variant="ghost"
                                        onClick={() => addCity(city.id)}
                                        disabled={isSelected}
                                        className={cn(
                                          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 capitalize transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                                          isSelected && "cursor-not-allowed opacity-50",
                                        )}
                                      >
                                        <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                                        <span className="flex-1 truncate capitalize">
                                          {city.name}
                                        </span>
                                        {isSelected && (
                                          <span className="text-xs text-slate-400">(Added)</span>
                                        )}
                                      </Button>
                                    );
                                  })
                                ) : (
                                  <p className="px-2 py-6 text-center text-sm text-slate-500">
                                    No cities found.
                                  </p>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>

                          {selectedCities.length > 0 && (
                            <div className="space-y-2">
                              <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                  placeholder="Search selected cities..."
                                  value={citySearchQuery}
                                  onChange={(e) => setCitySearchQuery(e.target.value)}
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
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                          {city.name}
                                        </span>
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeCity(city.id)}
                                        className="h-7 w-7 shrink-0 rounded-lg p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))
                                ) : (
                                  <p className="py-4 text-center text-sm text-slate-500">
                                    No matching cities found.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
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

                <FormField
                  control={form.control}
                  name="iconFile"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                          Department Icon <span className="text-destructive">*</span>
                        </FormLabel>

                        <span className="text-[10px] font-medium text-slate-400">
                          PNG / JPG / WEBP
                        </span>
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
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-7 dark:border-slate-800 dark:bg-slate-900/40">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="h-10 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-600 shadow-none hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 rounded-xl px-5 font-semibold shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Department" : "Create Department"}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
