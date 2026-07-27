"use client";

import { useMemo, useState } from "react";
import { CalendarDays, RotateCcw, Users } from "lucide-react";

import { MOCK_USERS_DATA, USER_MANAGEMENT_SELECT_DATA } from "@/constants/users-management";
import { usersColumns } from "./components/users-columns";

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

export function UserManagement() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [status, setStatus] = useState("All Users");

  const filteredData = useMemo(
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

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatus("All Users");
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Users Management" description="Manage and monitor all registered users." />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Total Users", value: stats.total },
          { title: "Active Users", value: stats.active },
          { title: "Inactive Users", value: stats.inactive },
        ].map((item) => (
          <Card key={item.title} className="rounded-xl shadow-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-muted-foreground text-sm">{item.title}</p>
                <p className="mt-1 text-3xl font-bold">{item.value}</p>
              </div>

              <div className="bg-primary/10 text-primary rounded-xl p-3">
                <Users className="size-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Filter Users</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 lg:grid-cols-4">
          <div>
            <Label className="mb-2">From Date</Label>
            <DatePicker date={fromDate} setDate={setFromDate} placeholder="dd/mm/yyyy" />
          </div>

          <div>
            <Label className="mb-2">To Date</Label>
            <DatePicker date={toDate} setDate={setToDate} placeholder="dd/mm/yyyy" />
          </div>

          <div className="flex items-end gap-3">
            <Button className="flex-1">
              <CalendarDays className="mr-2 size-4" />
              Apply
            </Button>

            <Button variant="outline" onClick={clearFilters} className="flex-1">
              <RotateCcw className="mr-2 size-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle>Users</CardTitle>

            <p className="text-muted-foreground mt-1 text-sm">{filteredData.length} users found</p>
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v ?? "All")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {USER_MANAGEMENT_SELECT_DATA.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="pt-6">
          <DataTable columns={usersColumns} data={filteredData} searchKey="userName" />
        </CardContent>
      </Card>
    </div>
  );
}
