"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/lib/debounce";
import type { SortingState } from "@tanstack/react-table";
import { Database, Globe2 } from "lucide-react";
import { useCallback, useState } from "react";
import { countriesColumns } from "../columns/countries-columns";
import { useGetCountries } from "../hooks/use-get-countries";
import type { CountryData, UseGetCountriesArgs } from "../types/settings.types";
import AddCountriesDialog from "./add-countries-dialog";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";

export function CountriesManagement() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const queryArgs: UseGetCountriesArgs = {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
    sortBy: sorting[0]?.id || undefined,
    sortOrder: sorting[0]?.desc ? "desc" : sorting[0] ? "asc" : undefined,
  };

  const { data: res, isLoading } = useGetCountries(queryArgs);
  const countries = (res?.data ?? []) as CountryData[];
  const totalCount = res?.pagination?.total ?? countries.length;

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
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <Globe2 className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-900">Countries Management</h3>
              <p className="text-sm text-slate-500">
                Manage the list of available countries on the platform.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-2">
              <Database className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">{totalCount}</span>
              <span className="text-sm text-emerald-700">Countries</span>
            </div>
            <AddCountriesDialog />
          </div>
        </div>
        <CardContent className="p-6">
          <DataTable
            columns={countriesColumns}
            data={countries}
            searchKey="countryName"
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
