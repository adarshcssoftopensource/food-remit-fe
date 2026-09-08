"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SortingState } from "@tanstack/react-table";
import { CheckCircle2, Search } from "lucide-react";
import { getEmployeeOrderColumns } from "../columns/employee-order-columns";

interface EmployeeOrdersTableProps {
  employeeName: string;
  data: any[];
  isLoading: boolean;
  totalOrders: number;
  currentPage: number;
  totalPages: number;
  search: string;
  isUnassigning: boolean;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onSortingChange: (sorting: SortingState) => void;
  onUnassign: (orderId: string) => void;
}

export function EmployeeOrdersTable({
  employeeName,
  data,
  isLoading,
  totalOrders,
  currentPage,
  totalPages,
  search,
  isUnassigning,
  onSearchChange,
  onPageChange,
  onSortingChange,
  onUnassign,
}: EmployeeOrdersTableProps) {
  const columns = getEmployeeOrderColumns({ onUnassign, isUnassigning });

  return (
    <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
      <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white">
          <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <CheckCircle2 className="size-4" />
          </div>
          Orders Assigned to {employeeName}
          <Badge
            variant="outline"
            className="ml-auto rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400"
          >
            {totalOrders} orders
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by order ID or sender / receiver name…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pr-4 pl-9 text-sm text-slate-800 placeholder-slate-400 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/30"
          />
        </div>

        <DataTable
          columns={columns}
          data={data}
          loading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={10}
          onPageChange={onPageChange}
          onRowsPerPageChange={() => {}}
          onSortingChange={onSortingChange}
          manualSorting
          manualFiltering
        />
      </CardContent>
    </Card>
  );
}
