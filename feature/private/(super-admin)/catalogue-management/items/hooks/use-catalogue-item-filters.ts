import { useState, useMemo } from "react";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { useDebounce } from "@/lib/debounce";

export function useCatalogueItemFilters() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
  const debouncedSearch = useDebounce(search, 500);

  const [appliedCountry, setAppliedCountry] = useQueryState(
    "country",
    parseAsString.withDefault("all"),
  );
  const [appliedCity, setAppliedCity] = useQueryState("city", parseAsString.withDefault("all"));
  const [appliedCategory, setAppliedCategory] = useQueryState(
    "category",
    parseAsString.withDefault("all"),
  );
  const [appliedFromDate, setAppliedFromDate] = useQueryState("from", parseAsString);
  const [appliedToDate, setAppliedToDate] = useQueryState("to", parseAsString);
  const [statusTabStr, setStatusTabStr] = useQueryState("status", parseAsString.withDefault("all"));
  const statusTab = statusTabStr as "all" | "ACTIVE" | "INACTIVE";
  const setStatusTab = setStatusTabStr;

  const [country, setCountry] = useState(appliedCountry);
  const [city, setCity] = useState(appliedCity);
  const [category, setCategory] = useState(appliedCategory);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    appliedFromDate ? new Date(appliedFromDate) : undefined,
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    appliedToDate ? new Date(appliedToDate) : undefined,
  );

  const applyAllFilters = () => {
    setAppliedCountry(country === "all" ? null : country);
    setAppliedCity(city === "all" ? null : city);
    setAppliedCategory(category === "all" ? null : category);
    setAppliedFromDate(fromDate ? fromDate.toISOString() : null);
    setAppliedToDate(toDate ? toDate.toISOString() : null);
    setPage(1);
  };

  const cancelAllFilters = () => {
    setCountry(appliedCountry);
    setCity(appliedCity);
    setCategory(appliedCategory);
    setFromDate(appliedFromDate ? new Date(appliedFromDate) : undefined);
    setToDate(appliedToDate ? new Date(appliedToDate) : undefined);
  };

  const clearFilters = () => {
    setCountry("all");
    setCity("all");
    setCategory("all");
    setFromDate(undefined);
    setToDate(undefined);
    setAppliedCountry(null);
    setAppliedCity(null);
    setAppliedCategory(null);
    setAppliedFromDate(null);
    setAppliedToDate(null);
    setSearch(null);
    setPage(1);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFromDate || appliedToDate) count++;
    if (appliedCountry !== "all" && appliedCountry !== "All") count++;
    if (appliedCity !== "all" && appliedCity !== "All") count++;
    if (appliedCategory !== "all") count++;
    return count;
  }, [appliedFromDate, appliedToDate, appliedCountry, appliedCity, appliedCategory]);

  const hasFilters = !!(
    appliedFromDate ||
    appliedToDate ||
    appliedCountry !== "all" ||
    appliedCity !== "all" ||
    appliedCategory !== "all" ||
    debouncedSearch
  );

  return {
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    debouncedSearch,
    country,
    setCountry,
    city,
    setCity,
    category,
    setCategory,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    statusTab,
    setStatusTab,
    appliedCountry,
    appliedCity,
    appliedCategory,
    appliedFromDate,
    appliedToDate,
    applyAllFilters,
    cancelAllFilters,
    clearFilters,
    activeFilterCount,
    hasFilters,
  };
}
