/* eslint-disable react-hooks/incompatible-library */
"use client";

import {
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { renderHeader } from "./data-table-column-header";
import { DataTablePagination } from "./data-table-pagination";

import { RowSelectionState } from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  loading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  currentPage?: number;
  totalPages?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
  onSortingChange?: (sorting: SortingState) => void;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (
    updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState),
  ) => void;
  getRowId?: (originalRow: TData, index: number, parent?: any) => string;
}

import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  loading = false,
  searchValue = "",
  onSearchChange,
  currentPage = 1,
  totalPages = 1,
  rowsPerPage = DEFAULT_PAGE_SIZE,
  onPageChange,
  onRowsPerPageChange,
  onSortingChange,
  manualSorting = false,
  manualFiltering = false,
  rowSelection = {},
  onRowSelectionChange,
  getRowId,
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
    manualSorting,
    manualFiltering,
    enableRowSelection: true,
    onRowSelectionChange,
    getRowId,
    state: {
      sorting,
      columnFilters,
      rowSelection,
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
        className="group hover:bg-primary/5 dark:hover:bg-primary/10 border-b border-slate-100/50 transition-all duration-200 last:border-0 hover:shadow-sm dark:border-slate-800/50"
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className="py-4 text-sm font-medium text-slate-600 transition-colors group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200"
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  }, [loading, rows, columns, table, rowSelection]);

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
      <div className="w-full overflow-x-auto rounded-2xl border border-white/40 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/50">
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/20 ring-inset dark:ring-white/5" />
        <Table>
          <TableHeader className="border-b border-slate-200/60 bg-slate-50/80 dark:border-slate-800/60 dark:bg-slate-900/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const renderedHeader = header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext());

                  return (
                    <TableHead
                      key={header.id}
                      className="h-12 text-[11px] font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400"
                    >
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
