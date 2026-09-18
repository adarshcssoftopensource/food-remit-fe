"use client";

import { ComingSoonBadge } from "@/components/common/coming-soon-badge";
import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ROUTES } from "@/config/routes";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { PARTNER_LEAD_PIPELINE_TABS, STATS_CONFIG } from "@/constants/partner.leads";
import { useDebounce } from "@/lib/debounce";
import { useFilterState } from "@/hooks/use-filter-state";
import { cn } from "@/lib/utils";
import { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { getPartnerLeadColumns } from "./columns/partner-lead-columns";
import { PartnerLeadPipeline, usePartnerLeads } from "./hooks/use-get-partner-leads";

const PIPELINE_META: Record<
  PartnerLeadPipeline,
  { title: string; subtitle: string; accent: string }
> = {
  pending: {
    title: "Pending inquiries",
    subtitle: "General partnership requests still in review",
    accent: "bg-amber-500",
  },
  approved: {
    title: "Approved partners",
    subtitle: "Leads converted into stores",
    accent: "bg-emerald-600",
  },
  rejected: {
    title: "Rejected requests",
    subtitle: "Declined leads — status locked",
    accent: "bg-rose-600",
  },
};

export function PartnerLeadsManagement() {
  const router = useRouter();
  const [pipeline, setPipeline] = useState<PartnerLeadPipeline>("pending");
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);

  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState<{
    fromDate?: Date;
    toDate?: Date;
    businessType?: string;
    status?: string;
    kycStatus?: string;
    bankStatus?: string;
  }>({
    fromDate: undefined,
    toDate: undefined,
    businessType: undefined,
    status: undefined,
    kycStatus: undefined,
    bankStatus: undefined,
  });

  const fromDateStr = applied.fromDate ? format(applied.fromDate, "yyyy-MM-dd") : undefined;
  const toDateStr = applied.toDate ? format(applied.toDate, "yyyy-MM-dd") : undefined;

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const { leads, stats, pagination, isLoading } = usePartnerLeads(
    debouncedSearch,
    sortBy,
    sortOrder,
    page,
    limit,
    fromDateStr,
    toDateStr,
    applied.businessType,
    applied.status,
    applied.kycStatus,
    applied.bankStatus,
    pipeline,
  );

  const hasFilters = Boolean(applied.fromDate || applied.toDate || searchValue || applied.status);

  const handleClearFilters = () => {
    reset();
    setSearchValue("");
    setPage(1);
  };

  const activeFilterCount =
    (applied.fromDate || applied.toDate ? 1 : 0) + (searchValue ? 1 : 0) + (applied.status ? 1 : 0);

  const handleViewDetails = useCallback(
    (id: string) => {
      router.push(`${ROUTES.ADMIN.PARTNER_LEADS}/${id}`);
    },
    [router],
  );

  const handlePipelineChange = (value: PartnerLeadPipeline) => {
    if (value === pipeline) return;
    setPipeline(value);
    reset();
    setSearchValue("");
    setPage(1);
  };

  const columns = useMemo(() => getPartnerLeadColumns(handleViewDetails), [handleViewDetails]);
  const meta = PIPELINE_META[pipeline];
  const activeTab = PARTNER_LEAD_PIPELINE_TABS.find((t) => t.value === pipeline)!;
  const ActiveIcon = activeTab.Icon;

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
        description="Move inquiries from Pending → Approved or Rejected. Soft-delete restores to the same bucket."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS_CONFIG.map((stat) => {
          const isClickable = "pipeline" in stat && !!stat.pipeline;
          const isActive = isClickable && stat.pipeline === pipeline;
          return (
            <button
              key={stat.key}
              type="button"
              disabled={!isClickable}
              onClick={() => {
                if (isClickable && stat.pipeline) handlePipelineChange(stat.pipeline);
              }}
              className={cn(
                "text-left transition-transform duration-200",
                isClickable && "cursor-pointer hover:-translate-y-0.5",
                !isClickable && "cursor-default",
              )}
            >
              <MetricStatCard
                label={stat.label}
                value={stats[stat.key as keyof typeof stats] || 0}
                icon={stat.Icon}
                iconClassName={stat.color}
                iconWrapperClassName={stat.bg}
                loading={isLoading}
                className={cn(
                  isActive && "ring-2 ring-offset-2",
                  isActive &&
                    stat.pipeline === "pending" &&
                    "ring-offset-background ring-amber-400/70",
                  isActive &&
                    stat.pipeline === "approved" &&
                    "ring-offset-background ring-emerald-400/70",
                  isActive &&
                    stat.pipeline === "rejected" &&
                    "ring-offset-background ring-rose-400/70",
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid w-full flex-1 grid-cols-1 gap-2.5 sm:grid-cols-3">
            {PARTNER_LEAD_PIPELINE_TABS.map((tab) => {
              const Icon = tab.Icon;
              const count = stats[tab.countKey] || 0;
              const selected = pipeline === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handlePipelineChange(tab.value)}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-200",
                    selected
                      ? tab.activePanel
                      : "border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900",
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-y-0 left-0 w-1 rounded-l-2xl transition-opacity",
                      tab.accent,
                      selected ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex items-start justify-between gap-3 pl-1.5">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
                          selected ? tab.iconWrap : "bg-white dark:bg-slate-800",
                        )}
                      >
                        <Icon
                          className={cn("size-4", selected ? tab.iconColor : "text-slate-400")}
                          strokeWidth={2.25}
                        />
                      </span>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "text-sm font-bold tracking-tight",
                            selected ? tab.iconColor : "text-slate-700 dark:text-slate-200",
                          )}
                        >
                          {tab.label}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug font-medium text-slate-500 dark:text-slate-400">
                          {tab.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "inline-flex min-w-7 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                        selected
                          ? tab.badge
                          : "bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                      )}
                    >
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <ModuleFilters
            title="Filter Leads Pipeline"
            description="Filter partnership leads by submission date range"
            hideCountryFilter={true}
            hideCityFilter={true}
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
            onApplyFilters={() => {
              apply();
              setPage(1);
            }}
            onCancelFilters={cancel}
            activeFilterCount={activeFilterCount}
          >
            <div className="flex w-full max-w-[320px] flex-col gap-5">
              {pipeline === "pending" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Lead Status
                  </label>
                  <Select
                    value={draft.status || "all"}
                    onValueChange={(val) =>
                      setDraft((p) => ({
                        ...p,
                        status: val === "all" ? undefined : (val ?? undefined),
                      }))
                    }
                  >
                    <SelectTrigger className="h-10 w-full bg-white dark:bg-slate-950">
                      <SelectValue placeholder="All Statuses">
                        {{
                          all: "All Statuses",
                          PENDING: "Pending",
                          NEW: "New",
                          CONTACTED: "Contacted",
                          REGISTRATION_INVITED: "Invited",
                          REGISTRATION_STARTED: "Started",
                          QUALIFIED: "Qualified",
                        }[draft.status || "all"] || "All Statuses"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="CONTACTED">Contacted</SelectItem>
                      <SelectItem value="REGISTRATION_INVITED">Invited</SelectItem>
                      <SelectItem value="REGISTRATION_STARTED">Started</SelectItem>
                      <SelectItem value="QUALIFIED">Qualified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Date Applied
                </label>
                <DateRangeFilter
                  fromDate={draft.fromDate}
                  toDate={draft.toDate}
                  onFromDateChange={(date) => setDraft((p) => ({ ...p, fromDate: date }))}
                  onToDateChange={(date) => setDraft((p) => ({ ...p, toDate: date }))}
                  fromLabel="From"
                  toLabel="To"
                  maxDate={undefined}
                />
              </div>
            </div>
          </ModuleFilters>
        </div>

        <Card className="rounded-2xl border border-slate-100 bg-slate-50/40 shadow-none dark:border-slate-800 dark:bg-slate-900/40">
          <CardHeader className="flex flex-row items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <span className={cn("h-8 w-1 shrink-0 rounded-full", meta.accent)} />
            <div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900 dark:text-white">
                <ActiveIcon className={cn("size-4", activeTab.iconColor)} />
                {meta.title}
              </CardTitle>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {pagination.total} lead{pagination.total !== 1 ? "s" : ""} · {meta.subtitle}
              </p>
            </div>
          </CardHeader>
          <CardContent className="bg-white p-4 dark:bg-slate-950">
            <DataTable
              columns={columns}
              data={leads}
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
    </div>
  );
}
