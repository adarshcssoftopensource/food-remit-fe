"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/components/providers/profile-provider";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { getProductBoxColumns } from "./columns/product-box-columns";
import { ProductBoxFormDialog } from "./components/product-box-form-dialog";
import { useCreateProductBox } from "./hooks/use-create-product-box";
import { useDeleteProductBox } from "./hooks/use-delete-product-box";
import { useGetProductBoxes } from "./hooks/use-get-product-boxes";
import { useUpdateProductBox } from "./hooks/use-update-product-box";
import { useUpdateProductBoxStatus } from "./hooks/use-update-product-box-status";
import { ProductBox } from "./types/product-box.types";

export function ProductBoxesManagement() {
  const router = useRouter();
  const { profile } = useProfile();
  const isStoreManager = profile?.role === "store_manager";

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

  const { data: boxesData, isLoading } = useGetProductBoxes({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState<ProductBox | null>(null);
  const [boxToDelete, setBoxToDelete] = useState<ProductBox | null>(null);

  const createMutation = useCreateProductBox();
  const updateMutation = useUpdateProductBox(selectedBox?.id || "");
  const updateStatusMutation = useUpdateProductBoxStatus();
  const deleteMutation = useDeleteProductBox();

  const handleEdit = useCallback((box: ProductBox) => {
    setSelectedBox(box);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((box: ProductBox) => {
    setBoxToDelete(box);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!boxToDelete) return;
    deleteMutation.mutate(boxToDelete.id, {
      onSuccess: () => {
        successToast({ description: "Box deleted successfully" });
        setBoxToDelete(null);
      },
    });
  }, [boxToDelete, deleteMutation]);

  const handleToggleStatus = useCallback(
    (box: ProductBox, checked: boolean) => {
      updateStatusMutation.mutate(
        { id: box.id, status: checked },
        {
          onSuccess: () => successToast({ description: "Box status updated successfully" }),
        },
      );
    },
    [updateStatusMutation],
  );

  const handleView = useCallback(
    (box: ProductBox) => {
      router.push(`/product-boxes/${box.id}`);
    },
    [router],
  );

  const columns = useMemo(
    () =>
      getProductBoxColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleStatus: handleToggleStatus,
        onView: handleView,
      }),
    [handleEdit, handleDelete, handleToggleStatus, handleView],
  );

  const handleFormSubmit = (data: FormData) => {
    if (selectedBox) {
      updateMutation.mutate(data, {
        onSuccess: () => {
          successToast({ description: "Box updated successfully" });
          setFormOpen(false);
        },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          successToast({ description: "Box created successfully" });
          setFormOpen(false);
        },
      });
    }
  };

  if (!isStoreManager) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-lg">You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Boxes Management"
        description="Manage product boxes and their items."
      />

      <div className="bg-card text-card-foreground overflow-hidden rounded-xl border shadow-sm">
        <div className="flex items-center justify-between p-6 pb-4">
          <h3 className="text-xl leading-none font-semibold tracking-tight">Boxes List</h3>
          <Button
            onClick={() => {
              setSelectedBox(null);
              setFormOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Add Box
          </Button>
        </div>
        <div className="px-6 pb-6">
          <DataTable
            columns={columns}
            data={boxesData?.data || []}
            totalPages={boxesData?.lastPage || 1}
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
      </div>

      <ProductBoxFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        initialData={selectedBox}
      />

      <ConfirmationDialog
        open={!!boxToDelete}
        onOpenChange={(open) => !open && setBoxToDelete(null)}
        title="Delete Product Box"
        description={`Are you sure you want to delete "${boxToDelete?.title}"? This action cannot be undone and all items inside this box will also be removed.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        variant="destructive"
      />
    </div>
  );
}
