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
import { cn } from "@/lib";

interface DataTablePaginationProps<TData> {
  table?: Table<TData>;
  currentPage?: number;
  totalPages?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
  showRowsPerPage?: boolean;
  showJumpTo?: boolean;
}

export function DataTablePagination<TData>({
  table,
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  showRowsPerPage = true,
  showJumpTo = true,
}: DataTablePaginationProps<TData>) {
  const isBackendMode = currentPage !== undefined && totalPages !== undefined && onPageChange;

  const pageIndex = table?.getState().pagination.pageIndex ?? 0;
  const pageCount = table?.getPageCount() ?? 1;

  const activePage = isBackendMode ? currentPage : pageIndex + 1;
  const maxPages = isBackendMode ? totalPages : pageCount;
  const pageSize =
    isBackendMode && rowsPerPage ? rowsPerPage : (table?.getState().pagination.pageSize ?? 10);

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
    } else if (table) {
      table.setPageIndex(page - 1);
    }
  };

  const handleRowsPerPageChange = (size: number) => {
    if (isBackendMode && onRowsPerPageChange) {
      onRowsPerPageChange(size);
      if (onPageChange) onPageChange(1);
    } else if (table) {
      table.setPageSize(size);
    }
  };

  const canPrevious = activePage > 1;
  const canNext = activePage < maxPages;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t px-3 py-3 sm:gap-3.5 lg:flex-row lg:items-center",
        showRowsPerPage || showJumpTo ? "lg:justify-between" : "justify-center",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-start">
        {showRowsPerPage && (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs font-medium text-slate-700 sm:text-sm dark:text-slate-300">
              Rows per page
            </span>

            <Select
              value={`${pageSize}`}
              onValueChange={(value) => handleRowsPerPageChange(Number(value))}
            >
              <SelectTrigger className="h-8.5 w-auto min-w-16 px-2.5 text-xs font-semibold sm:h-9 sm:min-w-18 sm:px-3">
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
        )}

        {showJumpTo && (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs font-medium text-slate-700 sm:text-sm dark:text-slate-300">
              Jump to:
            </span>

            <Input
              type="number"
              min={1}
              max={maxPages}
              placeholder="No."
              className="h-8.5 w-16 rounded-xl px-2 text-xs font-semibold sm:h-9 sm:w-20 sm:px-2.5"
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
        )}
      </div>

      <Pagination className="mx-0 w-auto justify-center">
        <PaginationContent className="flex-nowrap items-center gap-1">
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
    </div>
  );
}
