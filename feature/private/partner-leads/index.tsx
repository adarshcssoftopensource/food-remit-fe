"use client";

import { ComingSoonBadge } from "@/components/common/coming-soon-badge";
import { DataTable } from "@/components/common/data-table/data-table";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { STATS_CONFIG } from "@/constants/partner.leads";
import { useDebounce } from "@/lib/debounce";
import { useFilterState } from "@/hooks/use-filter-state";
import { SortingState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { getPartnerLeadColumns } from "./columns/partner-lead-columns";
import { usePartnerLeads } from "./hooks/use-get-partner-leads";

export function PartnerLeadsManagement() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);

  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    country: "all",
    city: "all",
  });

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const { leads, stats, pagination, isLoading } = usePartnerLeads(
    debouncedSearch,
    sortBy,
    sortOrder,
    page,
    limit,
  );

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (
        applied.country !== "all" &&
        applied.country !== "All" &&
        (lead as any).countryId &&
        (lead as any).countryId !== applied.country
      ) {
        return false;
      }
      if (
        applied.city !== "all" &&
        applied.city !== "All" &&
        (lead as any).cityId &&
        (lead as any).cityId !== applied.city
      ) {
        return false;
      }
      return true;
    });
  }, [leads, applied.country, applied.city]);

  const hasFilters = Boolean(
    (applied.country !== "all" && applied.country !== "All") ||
    (applied.city !== "all" && applied.city !== "All") ||
    searchValue,
  );

  const handleClearFilters = () => {
    reset();
    setSearchValue("");
    setPage(1);
  };

  const activeFilterCount =
    (applied.country !== "all" && applied.country !== "All" ? 1 : 0) +
    (applied.city !== "all" && applied.city !== "All" ? 1 : 0) +
    (searchValue ? 1 : 0);

  const handleViewDetails = useCallback(
    (id: string) => {
      router.push(`${ROUTES.ADMIN.PARTNER_LEADS}/${id}`);
    },
    [router],
  );

  const columns = useMemo(() => getPartnerLeadColumns(handleViewDetails), [handleViewDetails]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Leads CRM"
        badge={
          <ComingSoonBadge
            label="New Feature"
            showIcon
            className="border-red-200 bg-red-50 text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-400"
          />
        }
        description="Manage incoming partnership requests. Move leads through the pipeline from NEW to APPROVED."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {STATS_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={stats[key as keyof typeof stats] || 0}
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
            loading={isLoading}
          />
        ))}
      </div>

      <ModuleFilters
        title="Filter Leads Pipeline"
        description="Filter partnership leads by country and city"
        countryId={draft.country}
        onCountryChange={(v) => setDraft((p) => ({ ...p, country: v }))}
        cityId={draft.city}
        onCityChange={(v) => setDraft((p) => ({ ...p, city: v }))}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
        onApplyFilters={apply}
        onCancelFilters={cancel}
        activeFilterCount={activeFilterCount}
      />

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div>
            <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Leads Pipeline
            </CardTitle>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""} in pipeline
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={filteredLeads}
            loading={isLoading}
            searchKey="businessName"
            searchValue={searchValue}
            onSearchChange={(val) => {
              setSearchValue(val);
              setPage(1);
            }}
            onSortingChange={setSorting}
            manualSorting={true}
            manualFiltering={true}
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            rowsPerPage={pagination.limit}
            onPageChange={setPage}
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
