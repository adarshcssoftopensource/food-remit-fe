"use client";

import { Filter, RotateCcw } from "lucide-react";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
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

      <Card className="rounded-xl border bg-white shadow-sm">
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Filter className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold">Filter Tickets</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end lg:flex-nowrap">
            <DateRangeFilter
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              wrapperClassName="flex flex-col sm:flex-row flex-1 gap-3"
              itemClassName="flex-1 space-y-1 min-w-0"
              pickerClassName="h-10 w-full"
              labelClassName="text-muted-foreground text-xs font-medium uppercase"
            />

            <Button onClick={applyFilters} className="h-10 w-full shrink-0 sm:w-auto">
              Apply
            </Button>
            <Button
              variant="destructive"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="h-10 w-full shrink-0 sm:w-auto"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

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
