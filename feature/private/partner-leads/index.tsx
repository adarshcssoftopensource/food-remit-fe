"use client";

import { ComingSoonBadge } from "@/components/common/coming-soon-badge";
import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { STATS_CONFIG } from "@/constants/partner.leads";
import { useDebounce } from "@/lib/debounce";
import { SortingState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getPartnerLeadColumns } from "./columns/partner-lead-columns";
import { usePartnerLeads } from "./hooks/use-get-partner-leads";

export function PartnerLeadsManagement() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const { leads, stats, pagination, isLoading } = usePartnerLeads(
    debouncedSearch,
    sortBy,
    sortOrder,
    page,
    limit,
  );

  const handleViewDetails = (id: string) => {
    router.push(`${ROUTES.ADMIN.PARTNER_LEADS}/${id}`);
  };

  const columns = useMemo(() => getPartnerLeadColumns(handleViewDetails), []);

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

      <Card className="rounded-xl border bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b py-4">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-900">Leads Pipeline</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {leads.length} lead{leads.length !== 1 ? "s" : ""} in pipeline
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
