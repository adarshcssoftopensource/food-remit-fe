import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* <div className="flex-1 text-sm text-slate-600">
        Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
        {Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          table.getFilteredRowModel().rows.length
        )}{" "}
        of {table.getFilteredRowModel().rows.length} results
      </div> */}
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-slate-700">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="h-8 px-2"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={20} />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            <Button
              variant="default"
              className="h-8 w-8 bg-blue-100 p-0 text-blue-700 shadow-none hover:bg-blue-200"
            >
              1
            </Button>
            <Button variant="ghost" className="h-8 w-8 p-0 font-medium text-slate-700">
              2
            </Button>
            <MoreHorizontal className="mx-1 h-4 w-4 text-slate-400" />
            <Button variant="ghost" className="h-8 w-8 p-0 font-medium text-slate-700">
              4
            </Button>
          </div>

          <Button
            variant="ghost"
            className="h-8 px-2 font-medium"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight size={20} />
          </Button>
        </div>

        <div className="flex items-center space-x-2 border-l border-slate-200 pl-6">
          <span className="text-sm text-slate-700">Jump to:</span>
          <input
            type="number"
            placeholder="No."
            className="focus-visible:ring-ring h-8 w-14 rounded-md border border-slate-300 bg-transparent px-2 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
          />
          <Button variant="outline" className="h-8 px-3">
            Go
          </Button>
        </div>
      </div>
    </div>
  );
}
