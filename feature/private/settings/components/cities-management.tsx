"use client";

import { CountrySelect } from "@/components/common/country-select";
import { DataTable } from "@/components/common/data-table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/lib/debounce";
import type { SortingState } from "@tanstack/react-table";
import { Building2, Database } from "lucide-react";
import { useCallback, useState } from "react";
import { citiesColumns } from "../columns/cities-columns";
import { useGetCities } from "../hooks/use-get-cities";
import type { CityData, UseGetCitiesArgs } from "../types/settings.types";
import AddCityDialog from "./add-city-dialog";

export function CitiesManagement() {
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleCountryChange = useCallback((value: string) => {
    setSelectedCountry(value || "All");
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const queryArgs: UseGetCitiesArgs = {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
    countryId: selectedCountry !== "All" && selectedCountry !== "all" ? selectedCountry : undefined,
    sortBy: sorting[0]?.id || undefined,
    sortOrder: sorting[0]?.desc ? "desc" : sorting[0] ? "asc" : undefined,
  };

  const { data: res, isLoading } = useGetCities(queryArgs);
  const cities = (res?.data ?? []) as CityData[];
  const totalCount = res?.pagination?.total ?? cities.length;

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRowsPerPageChange = useCallback((limit: number) => {
    setRowsPerPage(limit);
    setCurrentPage(1);
  }, []);

  const handleSortingChange = useCallback((nextSorting: SortingState) => {
    setSorting(nextSorting);
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex flex-col gap-4 border-b bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900">Cities Management</h3>
              <p className="text-sm text-slate-500">Manage the cities available on the platform.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold whitespace-nowrap text-slate-500">
                Filter by Country:
              </span>
              <div className="w-56">
                <CountrySelect
                  value={selectedCountry}
                  onValueChange={handleCountryChange}
                  valueKey="id"
                  includeAll={true}
                  allLabel="All Countries"
                  placeholder="Select Country"
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2">
              <Database className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">{totalCount}</span>
              <span className="text-sm text-emerald-600">Cities</span>
            </div>

            <AddCityDialog
              defaultCountryId={
                selectedCountry !== "All" && selectedCountry !== "all" ? selectedCountry : ""
              }
            />
          </div>
        </div>

        <CardContent className="p-6">
          <DataTable
            columns={citiesColumns}
            data={cities}
            searchKey="cityName"
            loading={isLoading}
            searchValue={search}
            onSearchChange={handleSearchChange}
            currentPage={currentPage}
            totalPages={res?.pagination?.totalPages ?? 1}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSortingChange={handleSortingChange}
            manualSorting={true}
            manualFiltering={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
