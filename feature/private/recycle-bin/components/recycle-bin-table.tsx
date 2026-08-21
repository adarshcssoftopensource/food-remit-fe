"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Trash2, UsersRound } from "lucide-react";
import { usersColumns } from "../columns/recycled-users-columns";
import { RecycleBinTableProps } from "../types/recycle-bin.types";

export function RecycleBinTable({
  data,
  isLoading,
  searchValue,
  currentPage,
  totalPages,
  rowsPerPage,
  rowSelection,
  selectedCount,
  onSearchChange,
  onPageChange,
  onRowsPerPageChange,
  onSortingChange,
  onRowSelectionChange,
  onBulkRestoreClick,
  onBulkPermanentDeleteClick,
}: RecycleBinTableProps) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_35px_-15px_rgba(15,23,42,0.14)] dark:border-slate-800 dark:bg-slate-950">
      <div className="from-primary/20 via-primary to-primary/20 absolute inset-x-0 top-0 h-0.5 bg-gray-100" />

      <CardHeader className="border-b border-slate-100 px-5 py-5 sm:px-6 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="bg-primary/10 text-primary ring-primary/10 relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1">
              <UsersRound className="h-5.25 w-5.25" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                  Deleted Users
                </CardTitle>

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                  Directory
                </span>
              </div>

              <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm dark:text-slate-500">
                Manage and monitor deleted users
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-5 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary h-1.5 w-1.5 rounded-full" />
              <span className="text-[11px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                User Directory
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                Search, sort & manage users
              </span>
              {selectedCount > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                    onClick={onBulkRestoreClick}
                  >
                    <RotateCcw className="mr-2 h-3.5 w-3.5" />
                    Restore Selected ({selectedCount})
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 text-xs font-semibold"
                    onClick={onBulkPermanentDeleteClick}
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete Permanently ({selectedCount})
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-3 pt-2 pb-4 sm:px-4">
          <DataTable
            columns={usersColumns}
            data={data}
            searchKey="fullName"
            loading={isLoading}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            onSortingChange={onSortingChange}
            rowSelection={rowSelection}
            onRowSelectionChange={onRowSelectionChange}
            getRowId={(row: any) => row.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}
