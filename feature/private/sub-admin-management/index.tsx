"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { PageHeader } from "@/components/common/page-header";
import { MetricStatCard } from "@/components/common/stats/metric-stat-card";
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
import { SUB_ADMIN_STAT_CONFIG, SUB_ADMIN_STATUS_OPTIONS } from "@/constants/sub-admin-management";
import { Filter, RotateCcw } from "lucide-react";
import { subAdminColumns } from "./columns/sub-admin-columns";
import { SubAdminDialog } from "./components/sub-admin-dialog";

export function SubAdminManagement() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sub Admin Management"
        description="Manage sub administrators, their roles, and module permissions."
        action={<SubAdminDialog mode="add" />}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {SUB_ADMIN_STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <MetricStatCard
            key={key}
            label={label}
            value={0}
            trendLabel="vs last month"
            trendValue="+8%"
            icon={Icon}
            iconClassName={color}
            iconWrapperClassName={bg}
          />
        ))}
      </div>

      <Card className="rounded-xl border bg-white shadow-sm">
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Filter className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold">Filter Sub Admins</CardTitle>
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

            <div className="min-w-0 flex-1 space-y-1 sm:min-w-40">
              <Label className="text-muted-foreground text-xs font-medium uppercase">Status</Label>
              <Select value={""}>
                <SelectTrigger className="h-10! w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {SUB_ADMIN_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button variant="destructive" className="h-10 w-full shrink-0 sm:w-auto">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-xl font-semibold">All Sub Admins</CardTitle>
            <p className="text-muted-foreground mt-0.5 text-sm">0 sub admin found</p>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={subAdminColumns} data={[]} searchKey="userName" />
        </CardContent>
      </Card>
    </div>
  );
}
