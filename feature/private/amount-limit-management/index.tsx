"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockData } from "@/constants/amount-limit-management";
import { Filter, Globe, RotateCcw } from "lucide-react";
import { amountLimitColumns } from "./columns/amount-limit-columns";
import { AmountLimitDialog } from "./components/amount-limit-dialog";

export function AmountLimitManagement() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Amount Limit Management"
        description="Manage and configure amount limits for different countries."
        action={<AmountLimitDialog mode="add" />}
      />

      <Card className="rounded-xl border bg-white shadow-sm">
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Filter className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold">Filter Amount Limits</CardTitle>
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

            <Button variant="destructive" className="h-10 w-full shrink-0 sm:w-auto">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Globe className="text-primary h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Country Amount Limits</CardTitle>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {mockData.length} amount limits found
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={amountLimitColumns} data={mockData} searchKey="countryName" />
        </CardContent>
      </Card>
    </div>
  );
}
