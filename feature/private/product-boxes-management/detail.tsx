"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/components/providers/profile-provider";
import { successToast } from "@/components/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import { ArrowLeft, Calendar, CheckCircle2, Hash, Package, Plus, Tag, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { getProductBoxItemColumns } from "./columns/product-box-item-columns";
import { AddBoxItemDialog } from "./components/add-box-item-dialog";
import { useAddProductBoxItem } from "./hooks/use-add-product-box-item";
import { useGetProductBox } from "./hooks/use-get-product-box";
import { useGetProductBoxItems } from "./hooks/use-get-product-box-items";
import { useRemoveProductBoxItem } from "./hooks/use-remove-product-box-item";
import { ProductBoxItem } from "./types/product-box.types";

interface ProductBoxDetailProps {
  boxId: string;
}

export function ProductBoxDetail({ boxId }: ProductBoxDetailProps) {
  const router = useRouter();
  const { profile } = useProfile();
  const isStoreManager = profile?.role === "store_manager";

  const { data: box, isLoading } = useGetProductBox(boxId);
  const addItemMutation = useAddProductBoxItem(boxId);
  const removeItemMutation = useRemoveProductBoxItem(boxId);

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

  const { data: itemsData, isLoading: itemsLoading } = useGetProductBoxItems(boxId, {
    page,
    limit,
    search: debouncedSearch,
    sortBy: sortBy,
    sortOrder: sortOrder,
  });

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<ProductBoxItem | null>(null);

  const handleRemoveItem = useCallback((item: ProductBoxItem) => {
    setItemToRemove(item);
  }, []);

  const handleConfirmRemoveItem = useCallback(() => {
    if (!itemToRemove) return;
    removeItemMutation.mutate(itemToRemove.itemId, {
      onSuccess: () => {
        successToast({ description: "Item removed successfully" });
        setItemToRemove(null);
      },
    });
  }, [itemToRemove, removeItemMutation]);

  const handleAddItem = useCallback(
    (itemId: string) => {
      addItemMutation.mutate(
        { itemId },
        {
          onSuccess: () => successToast({ description: "Item added successfully" }),
        },
      );
    },
    [addItemMutation],
  );

  const columns = useMemo(
    () => getProductBoxItemColumns({ onRemove: handleRemoveItem }),
    [handleRemoveItem],
  );

  const existingItemIds = useMemo(() => {
    return itemsData?.data?.map((bi: ProductBoxItem) => bi.itemId) || [];
  }, [itemsData?.data]);

  if (!isStoreManager) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-lg">You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="View Box Details"
          description="View box information and manage its items."
        />
      </div>

      {isLoading ? (
        <Card className="overflow-hidden rounded-2xl border-none shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </CardContent>
        </Card>
      ) : box ? (
        <div className="grid gap-6 md:grid-cols-[380px_1fr] lg:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-2xl border-none bg-white shadow-sm ring-1 ring-slate-100 dark:bg-slate-950 dark:ring-slate-800">
              <div className="relative h-64 w-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800">
                {box.image ? (
                  <Image
                    src={box.image}
                    alt={box.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                    <Package className="h-12 w-12 opacity-20" />
                    <span className="text-sm font-medium">No Image Uploaded</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-slate-900 shadow-sm backdrop-blur-md hover:bg-white"
                  >
                    Product Box
                  </Badge>
                  {box.status ? (
                    <Badge className="bg-emerald-500/90 text-white shadow-sm backdrop-blur-md hover:bg-emerald-500">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="bg-red-500/90 shadow-sm backdrop-blur-md"
                    >
                      <XCircle className="mr-1 h-3.5 w-3.5" /> Inactive
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {box.title}
                  </h2>
                  <div className="mt-2 flex items-center text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    <span className="mr-1 text-lg opacity-60">$</span>
                    {box.price}
                  </div>
                </div>

                <Separator className="my-5 opacity-50" />

                <div className="grid gap-4">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900/80">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-800 dark:ring-slate-700/50">
                      <Hash className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                        Box ID
                      </p>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {box.id.substring(0, 8)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900/80">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-800 dark:ring-slate-700/50">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                        Created On
                      </p>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {box.addedOn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900/80">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-800 dark:ring-slate-700/50">
                      <Tag className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                        Total Items
                      </p>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {itemsData?.total || 0} items included
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="flex flex-col overflow-hidden rounded-2xl border-none bg-white shadow-sm ring-1 ring-slate-100 dark:bg-slate-950 dark:ring-slate-800">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/20">
              <div className="flex flex-col">
                <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                  Items inside the Box
                </CardTitle>
                <p className="mt-1 text-sm text-slate-500">
                  Manage the products contained in this box
                </p>
              </div>
              <Button
                onClick={() => setAddDialogOpen(true)}
                className="bg-emerald-600 text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={itemsData?.data || []}
                totalPages={itemsData?.lastPage || 1}
                currentPage={page}
                rowsPerPage={limit}
                onPageChange={(p) => setPage(p)}
                onRowsPerPageChange={setLimit}
                onSearchChange={setSearch}
                searchValue={search}
                onSortingChange={setSorting}
                manualSorting={true}
                loading={itemsLoading}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
          <Package className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">Box not found</p>
          <p className="text-sm text-slate-400">
            The product box you are looking for does not exist or has been removed.
          </p>
        </Card>
      )}

      <AddBoxItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddItem}
        isSubmitting={addItemMutation.isPending}
        existingItemIds={existingItemIds}
      />

      <ConfirmationDialog
        open={!!itemToRemove}
        onOpenChange={(open) => !open && setItemToRemove(null)}
        title="Remove Item from Box"
        description={`Are you sure you want to remove "${itemToRemove?.item?.productName || "this item"}" from the box? This cannot be undone.`}
        confirmLabel="Remove"
        onConfirm={handleConfirmRemoveItem}
        isLoading={removeItemMutation.isPending}
        variant="destructive"
      />
    </div>
  );
}
