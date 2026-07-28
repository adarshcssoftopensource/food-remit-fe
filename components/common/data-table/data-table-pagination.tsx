import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  const getPages = () => {
    const current = pageIndex + 1;
    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, "ellipsis", pageCount];
    }
    if (current >= pageCount - 2) {
      return [1, "ellipsis", pageCount - 2, pageCount - 1, pageCount];
    }
    return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", pageCount];
  };

  return (
    <div className="flex flex-col gap-4 border-t px-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-sm font-medium text-slate-700">Rows per page</span>

        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-9 w-16">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                table.previousPage();
              }}
              className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {getPages().map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={page === pageIndex + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    table.setPageIndex(Number(page) - 1);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                table.nextPage();
              }}
              className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-sm text-slate-700">Jump to:</span>

        <Input
          type="number"
          placeholder="No."
          className="h-9 w-16"
          onChange={(e) => {
            const page = Number(e.target.value);

            if (page >= 1 && page <= pageCount) {
              table.setPageIndex(page - 1);
            }
          }}
        />
      </div>
    </div>
  );
}
