"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Filter, RotateCcw } from "lucide-react";
import { completedCreditsColumns } from "./columns/completed-credits-columns";

export function CompletedCredits() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed Credits"
        description="View and manage completed credit requests."
      />

      <Card className="rounded-xl border bg-white shadow-sm">
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Filter className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold">Filter Credits</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end lg:flex-nowrap">
            <DateRangeFilter
              wrapperClassName="flex flex-col sm:flex-row flex-1 gap-3"
              itemClassName="flex-1 space-y-1 min-w-0"
              pickerClassName="h-10 w-full"
              labelClassName="text-muted-foreground text-xs font-medium uppercase"
            />

            <div className="flex gap-2">
              <Button className="h-10 bg-orange-500 hover:bg-orange-600">Apply</Button>
              <Button variant="outline" className="h-10">
                <RotateCcw className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <CreditCard className="text-primary h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Completed Credits</CardTitle>
              <p className="text-muted-foreground mt-0.5 text-sm">0 completed credits found</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={completedCreditsColumns} data={[]} searchKey="receiverName" />
        </CardContent>
      </Card>
    </div>
  );
}
