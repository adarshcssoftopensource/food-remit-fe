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
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterChip } from "./components/filter-chip";

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

      <div className="grid gap-4 sm:grid-cols-3">
        {STAT_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <Card key={key} className="rounded-xl shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-muted-foreground text-sm">{label}</p>
                <p className={`mt-1 text-3xl font-bold ${color}`}>{stats[key]}</p>
              </div>
              <div className={`rounded-xl p-3 ${bg}`}>
                <Icon className={`size-6 ${color}`} />
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
            <div className="min-w-45 flex-1 space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                From Date
              </Label>
              <DatePicker
                date={fromDate}
                setDate={setFromDate}
                placeholder="dd/mm/yyyy"
                className="h-10 w-full"
              />
            </div>

            <div className="min-w-45 flex-1 space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">To Date</Label>
              <DatePicker
                date={toDate}
                setDate={setToDate}
                placeholder="dd/mm/yyyy"
                className="h-10 w-full"
              />
            </div>

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
              variant="outline"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="h-10 shrink-0 px-5"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          {hasFilters && (
            <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
              {status !== "All Users" && (
                <FilterChip label={`Status: ${status}`} onRemove={() => setStatus("All Users")} />
              )}

              {fromDate && (
                <FilterChip
                  label={`From: ${fromDate.toLocaleDateString("en-GB")}`}
                  onRemove={() => setFromDate(undefined)}
                />
              )}

              {toDate && (
                <FilterChip
                  label={`To: ${toDate.toLocaleDateString("en-GB")}`}
                  onRemove={() => setToDate(undefined)}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-base">All Users</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={usersColumns} data={filteredData} searchKey="fullName" />
        </CardContent>
      </Card>
    </div>
  );
}
