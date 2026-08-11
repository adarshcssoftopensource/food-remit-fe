"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePartnerLeads } from "./hooks/use-partner-leads";
import { getPartnerLeadColumns } from "./columns/partner-lead-columns";
import { Building2, Users, CheckCircle, MailOpen } from "lucide-react";
import { ComingSoonBadge } from "@/components/common/coming-soon-badge";

export function PartnerLeadsManagement() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  // We debounce the search value so the API doesn't spam on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sorting, setSorting] = useState<any[]>([]);

  // Update debounced search after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const { leads, stats, isLoading } = usePartnerLeads(debouncedSearch, sortBy, sortOrder);

  const handleViewDetails = (id: string) => {
    router.push(`/partner-leads/${id}`);
  };

  const columns = useMemo(() => getPartnerLeadColumns(handleViewDetails), []);

  const STATS_CONFIG = [
    { key: "total", label: "Total Leads", Icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    {
      key: "new",
      label: "New Leads",
      Icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      key: "contacted",
      label: "Contacted",
      Icon: MailOpen,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      key: "approved",
      label: "Approved",
      Icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Leads CRM"
        badge={
          <ComingSoonBadge
            label="New Feature"
            showIcon
            className="border-emerald-200 bg-emerald-50 text-emerald-700"
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
            trendLabel="in pipeline"
            trendValue=""
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
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
              onSearchChange={setSearchValue}
              onSortingChange={setSorting}
              manualSorting={true}
              manualFiltering={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
