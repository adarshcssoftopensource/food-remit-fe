"use client";

import type { SortingState } from "@tanstack/react-table";
import { BadgeDollarSign, DollarSign, Globe2 } from "lucide-react";
import { useCallback, useState } from "react";

import { DataTable } from "@/components/common/data-table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDebounce } from "@/lib/debounce";
import { processingFeeColumns } from "../columns/processing-fee-columns";
import { useGetProcessingFees } from "../hooks/use-get-processing-fees";

export function ProcessingFee() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

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

  const sortBy = sorting[0]?.id;
  const sortOrder = sorting[0]?.desc ? "desc" : sorting[0] ? "asc" : undefined;

  const { data: response, isLoading } = useGetProcessingFees({
    search: debouncedSearch || undefined,
    page: currentPage,
    limit: rowsPerPage,
    sortBy,
    sortOrder,
  });

  const feesList = response?.data || [];
  const totalCount = response?.pagination?.total ?? feesList.length;
  const totalPages = response?.pagination?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-xs text-amber-700">
          Click the <span className="font-semibold">edit icon</span> next to any country to update
          its processing fee. Changes apply to future transactions only.
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between border-b bg-slate-50/70 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-xl">
              <BadgeDollarSign className="text-primary h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">Processing Fees</h2>
              <p className="text-sm text-slate-500">Configure processing fees for each country.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm">
            <Globe2 className="text-primary h-4 w-4" />
            <span className="text-sm font-medium text-slate-700">{totalCount} Countries</span>
          </div>
        </div>
        <CardContent className="p-4">
          <DataTable
            columns={processingFeeColumns}
            data={feesList}
            loading={isLoading}
            searchKey="countryName"
            searchValue={search}
            onSearchChange={handleSearchChange}
            currentPage={currentPage}
            totalPages={totalPages}
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
