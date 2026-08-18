"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Filter, RotateCcw, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { pendingCreditsColumns } from "./columns/pending-credits-columns";

export function PendingCredits() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pending Credits" description="Manage and track pending credit requests." />

      <Collapsible className="group">
        <Card className="rounded-xl border bg-white shadow-sm">
          <CollapsibleTrigger render={<div />}>
            <CardHeader className="cursor-pointer border-b py-4 transition-colors hover:bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
                  <Filter className="text-primary h-4 w-4" />
                </div>
                <CardTitle className="text-lg font-semibold">Filter Credits</CardTitle>

                <div className="flex items-center gap-3">
                  <ChevronDown className="h-5 w-5 text-slate-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
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
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <CreditCard className="text-primary h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Pending Credits</CardTitle>
              <p className="text-muted-foreground mt-0.5 text-sm">0 pending credits found</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={pendingCreditsColumns} data={[]} searchKey="receiverName" />
        </CardContent>
      </Card>
    </div>
  );
}
