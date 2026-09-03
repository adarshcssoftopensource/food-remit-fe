import { DataTable } from "@/components/common/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import { ColumnDef } from "@tanstack/react-table";
import { PackagePlus } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { useGetItems } from "../../catalogue-management/items/hooks/use-get-items";
import { ItemData } from "../../catalogue-management/items/types/item.types";

interface AddBoxItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (itemId: string) => void;
  isSubmitting?: boolean;
  existingItemIds: string[];
  onImageClick?: (image: string) => void;
}

export function AddBoxItemDialog({
  open,
  onOpenChange,
  onAdd,
  isSubmitting,
  existingItemIds,
  onImageClick,
}: AddBoxItemDialogProps) {
  const {
    page,
    setPage,
    limit,
    setLimit,
    searchQuery: search,
    setSearchQuery: setSearch,
    debouncedSearch,
    sortBy,
    sortOrder,
    sorting,
    setSorting,
  } = useDraftTableFilters();

  const { data: itemsData, isLoading } = useGetItems({
    page,
    limit,
    search: debouncedSearch,
    status: "ACTIVE",
    sortBy,
    sortOrder,
  });

  const columns: ColumnDef<ItemData>[] = useMemo(
    () => [
      {
        accessorKey: "productImage",
        header: "Product Image",
        cell: ({ row }) => {
          const item = row.original;
          let imgUrl = item.productImage || null;
          if (imgUrl) {
            try {
              const parsed = JSON.parse(imgUrl);
              if (Array.isArray(parsed) && parsed.length > 0) {
                imgUrl = parsed[0];
              }
            } catch (e) {
              // use as is
            }
          }
          return (
            <div className="bg-muted group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border">
              {imgUrl ? (
                <>
                  <Image
                    src={imgUrl}
                    alt={item.productName || "Product image"}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                  {onImageClick && (
                    <button
                      onClick={() => onImageClick(imgUrl!)}
                      className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/30 group-hover:opacity-100"
                      title="View full screen"
                    >
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground text-[10px]">No img</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "productName",
        header: "Product Name",
        cell: ({ row }) => <div className="font-medium">{row.original.productName}</div>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const isAdded = existingItemIds.includes(row.original.id);
          return (
            <Button
              size="sm"
              variant={isAdded ? "outline" : "default"}
              disabled={isAdded || isSubmitting}
              onClick={() => onAdd(row.original.id)}
              className={!isAdded ? "bg-primary hover:bg-primary/90 text-white" : ""}
            >
              {isAdded ? "Added" : "Add"}
            </Button>
          );
        },
      },
    ],
    [existingItemIds, isSubmitting, onAdd, onImageClick],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col p-4">
        <DialogHeader className="shrink-0 border-b bg-linear-to-r from-slate-50 via-slate-100 to-slate-50 px-6 py-5 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="flex items-center gap-4">
            <div className="from-primary to-primary/70 text-primary-foreground flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br shadow-md">
              <PackagePlus className="h-5 w-5" strokeWidth={2.2} />
            </div>

            <div className="min-w-0">
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Add Item to Box
              </DialogTitle>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Select an item and add it to this box.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto pt-4">
          <DataTable
            columns={columns}
            data={itemsData?.data || []}
            totalPages={itemsData?.pagination?.totalPages || 1}
            currentPage={page}
            rowsPerPage={limit}
            onPageChange={(p) => setPage(p)}
            onRowsPerPageChange={setLimit}
            onSearchChange={setSearch}
            searchValue={search}
            onSortingChange={setSorting}
            manualSorting={true}
            loading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
