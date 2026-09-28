"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare } from "lucide-react";
import { useDebounce } from "@/lib/debounce";
import { SortingState } from "@tanstack/react-table";
import { feedbackColumns } from "../columns/feedback-columns";
import { useGetFeedback } from "../hooks/use-get-feedback";

export function FeedbackList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [ratingFilter, setRatingFilter] = useState("all");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  // Sorting state for backend
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fromDateStr = fromDate ? fromDate.toISOString().split("T")[0] : undefined;
  const toDateStr = toDate ? toDate.toISOString().split("T")[0] : undefined;

  const { data: feedbackResponse, isLoading } = useGetFeedback({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
    rating: ratingFilter !== "all" ? ratingFilter : undefined,
    fromDate: fromDateStr,
    toDate: toDateStr,
    sortBy,
    sortOrder,
  });

  const feedbackData = feedbackResponse?.data || [];
  const pagination = feedbackResponse?.pagination || {
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
  };

  const hasFilters = Boolean(ratingFilter !== "all" || fromDate || toDate || search.trim() !== "");

  const activeFilterCount =
    (ratingFilter !== "all" ? 1 : 0) +
    (fromDate || toDate ? 1 : 0) +
    (search.trim() !== "" ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setRatingFilter("all");
    setFromDate(undefined);
    setToDate(undefined);
    setSortBy("date");
    setSortOrder("desc");
    setPage(1);
  };

  const handleSortingChange = (sorting: SortingState) => {
    if (sorting.length > 0) {
      const sort = sorting[0];
      setSortBy(sort.id);
      setSortOrder(sort.desc ? "desc" : "asc");
    } else {
      setSortBy("date");
      setSortOrder("desc");
    }
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <ModuleFilters
        title="Filter & Sort Feedback"
        description="Filter feedback by rating, date range, or sort order"
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      >
        <div className="grid w-full grid-cols-1 items-end gap-4 md:grid-cols-1">
          {/* Date Range Filter */}
          <div className="w-full">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Date Range
            </label>
            <DateRangeFilter
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={(d) => {
                setFromDate(d);
                setPage(1);
              }}
              onToDateChange={(d) => {
                setToDate(d);
                setPage(1);
              }}
            />
          </div>
        </div>
      </ModuleFilters>

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-xl ring-1">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-slate-900 capitalize dark:text-white">
                Feedback List
              </CardTitle>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Showing {feedbackData.length} of {pagination.total} total feedback items (Default 50
                per page)
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <DataTable
            columns={feedbackColumns}
            data={feedbackData}
            loading={isLoading}
            searchValue={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            manualSorting={true}
            onSortingChange={handleSortingChange}
            currentPage={page}
            totalPages={pagination.totalPages}
            rowsPerPage={limit}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
