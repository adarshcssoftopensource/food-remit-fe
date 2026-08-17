import { useState } from "react";
import { SortingState } from "@tanstack/react-table";
import { useDebounce } from "@/lib/debounce";
import { format } from "date-fns";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";

export function useTableFilters(defaultPageSize = DEFAULT_PAGE_SIZE) {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const formattedFromDate = fromDate ? format(fromDate, "yyyy-MM-dd") : undefined;
  const formattedToDate = toDate ? format(toDate, "yyyy-MM-dd") : undefined;

  const sortBy = sorting.length ? sorting[0].id : undefined;
  const sortOrder: "desc" | "asc" | undefined = sorting.length
    ? sorting[0].desc
      ? "desc"
      : "asc"
    : undefined;

  const resetBaseFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus("all");
    setSearchQuery("");
    setPage(1);
  };

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    status,
    setStatus,
    page,
    setPage,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    sorting,
    setSorting,
    debouncedSearch,
    formattedFromDate,
    formattedToDate,
    sortBy,
    sortOrder,
    resetBaseFilters,
    currentPage: page,
    setCurrentPage: setPage,
    pageSize: limit,
    setPageSize: setLimit,
  };
}
