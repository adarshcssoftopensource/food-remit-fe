"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/lib/debounce";
import { SortingState } from "@tanstack/react-table";
import { getTicketColumns } from "./columns/ticket-columns";
import { useGetTickets } from "./hooks/use-get-tickets";
import { TicketDetailDialog } from "./ticket-detail-dialog";

export function TicketManagement() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  // Sorting state for backend
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fromDateStr = fromDate ? fromDate.toISOString().split("T")[0] : undefined;
  const toDateStr = toDate ? toDate.toISOString().split("T")[0] : undefined;

  const { data: ticketsResponse, isLoading } = useGetTickets({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    fromDate: fromDateStr,
    toDate: toDateStr,
    sortBy,
    sortOrder,
  });

  const tickets = ticketsResponse?.data || [];
  const pagination = ticketsResponse?.pagination || {
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
  };

  const handleViewTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setIsDialogOpen(true);
  };

  const columns = useMemo(() => getTicketColumns(handleViewTicket), []);

  const hasFilters = Boolean(statusFilter !== "all" || fromDate || toDate || search.trim() !== "");

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
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
      <PageHeader
        title="Ticket Management"
        description="Unified management for active and closed customer support tickets."
      />

      <ModuleFilters
        title="Filter & Sort Tickets"
        description="Filter tickets by status, date range, or sort order"
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
        activeFilterCount={hasFilters ? 1 : 0}
      >
        <div className="w-full">
          <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Status Filter
          </label>
          <Select
            value={statusFilter}
            onValueChange={(val: string | null) => {
              if (val) setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-full rounded-lg text-xs capitalize">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="all" className="capitalize">
                All Requests
              </SelectItem>
              <SelectItem value="active" className="capitalize">
                Active Requests
              </SelectItem>
              <SelectItem value="closed" className="capitalize">
                Closed Requests
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full grid-cols-1 items-end gap-4 md:grid-cols-1">
          {/* Status Filter Dropdown */}

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

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b py-4">
          <div>
            <CardTitle className="text-lg font-semibold capitalize">
              {statusFilter === "active"
                ? "Active Ticket Requests"
                : statusFilter === "closed"
                  ? "Closed Ticket Requests"
                  : "All Ticket Requests"}
            </CardTitle>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Showing {tickets.length} of {pagination.total} total tickets (Default 50 per page)
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            data={tickets}
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

      <TicketDetailDialog
        ticketId={selectedTicketId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}

export function TicketManagementPage() {
  return <TicketManagement />;
}
