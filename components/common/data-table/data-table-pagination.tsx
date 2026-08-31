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
  currentPage?: number;
  totalPages?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
}

export function DataTablePagination<TData>({
  table,
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: DataTablePaginationProps<TData>) {
  const isBackendMode = currentPage !== undefined && totalPages !== undefined && onPageChange;

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  const activePage = isBackendMode ? currentPage : pageIndex + 1;
  const maxPages = isBackendMode ? totalPages : pageCount;
  const pageSize =
    isBackendMode && rowsPerPage ? rowsPerPage : table.getState().pagination.pageSize;

  const getPages = () => {
    const current = activePage;
    if (maxPages <= 5) {
      return Array.from({ length: maxPages }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, "ellipsis-end", maxPages];
    }
    if (current >= maxPages - 2) {
      return [1, "ellipsis-start", maxPages - 2, maxPages - 1, maxPages];
    }
    return [1, "ellipsis-start", current - 1, current, current + 1, "ellipsis-end", maxPages];
  };

  const handlePageChange = (page: number) => {
    if (isBackendMode && onPageChange) {
      onPageChange(page);
    } else {
      table.setPageIndex(page - 1);
    }
  };

  const handleRowsPerPageChange = (size: number) => {
    if (isBackendMode && onRowsPerPageChange) {
      onRowsPerPageChange(size);
      onPageChange(1);
    } else {
      table.setPageSize(size);
    }
  };

  const canPrevious = activePage > 1;
  const canNext = activePage < maxPages;

  return (
    <div className="flex flex-col gap-3 border-t px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2.5 whitespace-nowrap">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Rows per page
        </span>

        <Select
          value={`${pageSize}`}
          onValueChange={(value) => handleRowsPerPageChange(Number(value))}
        >
          <SelectTrigger className="h-9 w-auto min-w-18 px-3 text-xs font-semibold">
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

      <Pagination className="mx-0 w-auto justify-start sm:justify-center">
        <PaginationContent className="flex-wrap">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (canPrevious) handlePageChange(activePage - 1);
              }}
              className={!canPrevious ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {getPages().map((page) =>
            typeof page === "string" && page.startsWith("ellipsis") ? (
              <PaginationItem key={page}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={`page-${page}`}>
                <PaginationLink
                  href="#"
                  isActive={page === activePage}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(Number(page));
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
                if (canNext) handlePageChange(activePage + 1);
              }}
              className={!canNext ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="hidden items-center gap-2 whitespace-nowrap sm:flex">
        <span className="text-sm text-slate-700 dark:text-slate-300">Jump to:</span>

        <Input
          type="number"
          min={1}
          max={maxPages}
          placeholder="No."
          className="h-9 w-20 rounded-xl px-2.5 text-xs font-semibold"
          defaultValue={activePage}
          onKeyDown={(e) => {
            if (["-", "+", "e", "E", "."].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const page = Number(e.target.value);
            if (page >= 1 && page <= maxPages) {
              handlePageChange(page);
            }
          }}
        />
      </div>
    </div>
  );
}
