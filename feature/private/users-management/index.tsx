"use client";

import { useMemo, useState } from "react";
import { Filter, RotateCcw } from "lucide-react";

import {
  MOCK_USERS_DATA,
  STAT_CONFIG,
  USER_STATUS_OPTIONS,
  type UserData,
} from "@/constants/users-management";
import { usersColumns } from "./columns/users-columns";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function UserManagement() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [status, setStatus] = useState("All Users");

  const filteredData = useMemo<UserData[]>(
    () =>
      MOCK_USERS_DATA.filter((user) => {
        if (status !== "All Users" && user.status !== status) return false;
        const date = new Date(user.registeredOn);
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
        return true;
      }),
    [status, fromDate, toDate],
  );

  const stats = {
    total: MOCK_USERS_DATA.length,
    active: MOCK_USERS_DATA.filter((u) => u.status === "Active").length,
    inactive: MOCK_USERS_DATA.filter((u) => u.status === "Inactive").length,
  };

  const hasFilters = !!(fromDate || toDate || status !== "All Users");

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus("All Users");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users Management"
        description="Manage and monitor all registered users in the platform."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <Card key={key} className="group overflow-hidden rounded-2xl">
            <CardContent className="relative p-6">
              <div className="bg-muted/30 absolute -top-8 -right-8 h-28 w-28 rounded-full transition-transform duration-300 group-hover:scale-110" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium tracking-wide">{label}</p>

                  <h2 className={`mt-2 text-4xl font-bold ${color}`}>{stats[key]}</h2>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                      +12%
                    </span>

                    <span className="text-muted-foreground text-xs">Compared to last month</span>
                  </div>
                </div>

                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${bg} `}>
                  <Icon className={`h-8 w-8 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl border bg-white shadow-sm">
        <CardHeader className="border-b py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Filter className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold">Filter Users</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="flex flex-wrap items-end gap-3 lg:flex-nowrap">
            <DateRangeFilter
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              wrapperClassName="min-w-[22.5rem] flex flex-1 gap-3"
              itemClassName="min-w-45 flex-1 space-y-1"
              pickerClassName="h-10 w-full"
              labelClassName="text-muted-foreground text-xs font-medium uppercase"
            />

            <div className="min-w-45 flex-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                User Status
              </Label>

              <Select value={status} onValueChange={(v) => setStatus(v ?? "All Users")}>
                <SelectTrigger className="h-10! w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {USER_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="destructive"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="h-10 shrink-0 px-5"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-xl font-semibold">All Users</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={usersColumns} data={filteredData} searchKey="fullName" />
        </CardContent>
      </Card>
    </div>
  );
}
