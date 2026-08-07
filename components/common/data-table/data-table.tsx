"use client";

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { NoDataFound } from "@/components/common/no-data-found";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Search } from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string; // e.g., 'name' to filter by name
  loading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  currentPage?: number;
  totalPages?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
  onSortingChange?: (sorting: SortingState) => void;
}

function renderHeader<TData, TValue>(
  column: Column<TData, TValue>,
  renderedHeader: React.ReactNode,
) {
  const headerLabel =
    typeof column.columnDef.header === "string" ? column.columnDef.header : renderedHeader;

  if (!column.getCanSort()) {
    return renderedHeader;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-0 font-semibold text-slate-700 hover:bg-transparent"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {headerLabel}
      <ArrowUpDown className="ml-2 size-3.5 text-slate-400" />
    </Button>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  loading = false,
  searchValue = "",
  onSearchChange,
  currentPage = 1,
  totalPages = 1,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  onSortingChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const handleSortingChange = React.useCallback(
    (updater: SortingState | ((prev: SortingState) => SortingState)) => {
      setSorting((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        onSortingChange?.(next);
        return next;
      });
    },
    [onSortingChange],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: handleSortingChange,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const rows = table.getRowModel().rows;

  const renderedBody = React.useMemo(() => {
    if (loading) {
      return Array.from({ length: Math.min(table.getState().pagination.pageSize || 5, 5) }).map(
        (_, rIdx) => (
          <TableRow key={`skeleton-${rIdx}`} className="animate-pulse">
            {columns.map((col, cIdx) => (
              <TableCell key={`s-${rIdx}-${cIdx}`} className="py-3">
                <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
              </TableCell>
            ))}
          </TableRow>
        ),
      );
    }

    if (!rows?.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24">
            <div className="p-2">
              <NoDataFound />
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return rows.map((row) => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        className="transition-colors hover:bg-slate-50/50"
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="py-3 text-slate-600">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  }, [loading, rows, columns, table]);

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="flex items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={
                onSearchChange
                  ? searchValue
                  : ((table.getColumn(searchKey)?.getFilterValue() as string) ?? "")
              }
              onChange={(event) => {
                if (onSearchChange) {
                  onSearchChange(event.target.value);
                } else {
                  table.getColumn(searchKey)?.setFilterValue(event.target.value);
                }
              }}
              className="pl-8 text-black"
            />
          </div>
        </div>
      )}
      <div className="w-full overflow-x-auto rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const renderedHeader = header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext());

                  return (
                    <TableHead key={header.id} className="font-semibold">
                      {header.isPlaceholder ? null : renderHeader(header.column, renderedHeader)}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{renderedBody}</TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        currentPage={onPageChange ? currentPage : undefined}
        totalPages={onPageChange ? totalPages : undefined}
        rowsPerPage={onRowsPerPageChange ? rowsPerPage : undefined}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </div>
  );
}
