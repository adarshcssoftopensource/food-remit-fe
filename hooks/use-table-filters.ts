import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDebounce } from "@/lib/debounce";
import { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";

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

export function useDraftTableFilters(defaultPageSize = DEFAULT_PAGE_SIZE) {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultPageSize);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [applied, setApplied] = useState({
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    status: "all",
    searchQuery: "",
  });

  const applyFilters = () => {
    setApplied({ fromDate, toDate, status, searchQuery });
    setPage(1);
  };

  const cancelFilters = () => {
    setFromDate(applied.fromDate);
    setToDate(applied.toDate);
    setStatus(applied.status);
    setSearchQuery(applied.searchQuery);
  };

  const resetBaseFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus("all");
    setSearchQuery("");
    setApplied({ fromDate: undefined, toDate: undefined, status: "all", searchQuery: "" });
    setPage(1);
  };

  const debouncedSearch = useDebounce(applied.searchQuery, 500);
  const formattedFromDate = applied.fromDate ? format(applied.fromDate, "yyyy-MM-dd") : undefined;
  const formattedToDate = applied.toDate ? format(applied.toDate, "yyyy-MM-dd") : undefined;

  const sortBy = sorting.length ? sorting[0].id : undefined;
  const sortOrder: "desc" | "asc" | undefined = sorting.length
    ? sorting[0].desc
      ? "desc"
      : "asc"
    : undefined;

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    status,
    setStatus,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    limit,
    setLimit,
    sorting,
    setSorting,
    applied,
    applyFilters,
    cancelFilters,
    resetBaseFilters,
    debouncedSearch,
    formattedFromDate,
    formattedToDate,
    sortBy,
    sortOrder,
    currentPage: page,
    setCurrentPage: setPage,
    pageSize: limit,
    setPageSize: setLimit,
  };
}
