"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TICKET_SECTION_META, type TicketSectionKey } from "@/constants/ticket-management";
import { activeTicketColumns, closedTicketColumns } from "./columns/ticket-columns";
import { useTicketManagement } from "./hooks/use-ticket-management";

type TicketManagementPageProps = {
  section: TicketSectionKey;
};

export function TicketManagementPage({ section }: TicketManagementPageProps) {
  const meta = TICKET_SECTION_META[section];
  const {
    applyFilters,
    cancelFilters,
    clearFilters,
    filteredData,
    fromDate,
    hasFilters,
    setFromDate,
    setToDate,
    toDate,
  } = useTicketManagement();

  const columns = section === "active-requests" ? activeTicketColumns : closedTicketColumns;

  return (
    <div className="space-y-6">
      <PageHeader title="Tickets Requests" description={meta.description} />

      <ModuleFilters
        title="Filter Tickets"
        description="Filter tickets by date range"
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
        onApplyFilters={applyFilters}
        onCancelFilters={cancelFilters}
        activeFilterCount={hasFilters ? 1 : 0}
      >
        <div className="min-w-[280px] flex-1 sm:min-w-[320px]">
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />
        </div>
      </ModuleFilters>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">{meta.title}</CardTitle>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {filteredData.length} ticket{filteredData.length !== 1 ? "s" : ""} found
          </p>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredData} searchKey="ticketId" />
        </CardContent>
      </Card>
    </div>
  );
}
