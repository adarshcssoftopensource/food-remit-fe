"use client";

import { Filter, RotateCcw, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ORDER_COUNTRY_OPTIONS,
  ORDER_SECTION_META,
  type OrderSectionKey,
} from "@/constants/order-management";
import { orderColumns } from "./columns/order-columns";
import { useOrderManagement } from "./hooks/use-order-management";

type OrdersManagementPageProps = {
  section: OrderSectionKey;
};

export function OrdersManagementPage({ section }: OrdersManagementPageProps) {
  const meta = ORDER_SECTION_META[section];
  const {
    applyFilters,
    clearFilters,
    country,
    filteredData,
    fromDate,
    hasFilters,
    setCountry,
    setFromDate,
    setToDate,
    toDate,
  } = useOrderManagement();

  return (
    <div className="space-y-6">
      <PageHeader title="Orders Management" description={meta.description} />

      <Collapsible className="group">
        <Card className="rounded-xl border bg-white shadow-sm">
          <CollapsibleTrigger render={<div />}>
            <CardHeader className="cursor-pointer border-b py-4 transition-colors hover:bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
                  <Filter className="text-primary h-4 w-4" />
                </div>
                <CardTitle className="text-lg font-semibold">Filter Orders</CardTitle>

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
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="space-y-4 border-b">
          <div>
            <CardTitle className="text-xl font-semibold">{meta.title}</CardTitle>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {filteredData.length} order{filteredData.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="max-w-xs space-y-1">
            <Label className="text-muted-foreground text-xs font-medium uppercase">Country</Label>
            <Select value={country} onValueChange={(v) => setCountry(v ?? "All")}>
              <SelectTrigger className="h-10! w-full">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ORDER_COUNTRY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={orderColumns} data={filteredData} searchKey="referenceNo" />
        </CardContent>
      </Card>
    </div>
  );
}
