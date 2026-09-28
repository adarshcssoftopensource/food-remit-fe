"use client";

import { ComingSoonBadge } from "@/components/common/coming-soon-badge";
import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { philanthropistColumns } from "./columns/philanthrophist-columns";
import { PhilanthrophistFilters } from "./components/philanthrophist-filters";
import { usePhilanthrophistFilters } from "./hooks/use-philanthrophist-filters";

export default function PhilanthrophistManagement() {
  const filters = usePhilanthrophistFilters();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Individual Philanthrophist Management"
        description="Manage and monitor all active philanthropists on the platform."
        badge={<ComingSoonBadge />}
      />
      <Card className="overflow-hidden rounded-xl">
        <PhilanthrophistFilters
          fromDate={filters.fromDate}
          toDate={filters.toDate}
          country={filters.country}
          city={filters.city}
          hasFilters={filters.hasFilters}
          onFromDateChange={filters.setFromDate}
          onToDateChange={filters.setToDate}
          onCountryChange={filters.setCountry}
          onCityChange={filters.setCity}
          onClearFilters={filters.clearFilters}
          onApplyFilters={filters.applyFilters}
          onCancelFilters={filters.cancelFilters}
        />
      </Card>
      <Card className="overflow-hidden rounded-xl">
        <CardHeader className="border-b px-6 py-5">
          <CardTitle className="text-xl font-semibold">Active Users</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable columns={philanthropistColumns} data={filters.data} searchKey="firstName" />
        </CardContent>
      </Card>
    </div>
  );
}
