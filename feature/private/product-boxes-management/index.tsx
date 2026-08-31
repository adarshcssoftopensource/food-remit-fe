"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { DataTable } from "@/components/common/data-table/data-table";
import { useProfile } from "@/components/providers/profile-provider";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDraftTableFilters } from "@/hooks/use-table-filters";
import { CheckCircle2, Filter, Package, RotateCcw, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { getProductBoxColumns } from "./columns/product-box-columns";
import { useDeleteProductBox } from "./hooks/use-delete-product-box";
import { useGetProductBoxes } from "./hooks/use-get-product-boxes";
import { useUpdateProductBoxStatus } from "./hooks/use-update-product-box-status";
import { ProductBox } from "./types/product-box.types";

export function ProductBoxesManagement() {
  const router = useRouter();
  const { profile } = useProfile();

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

  const [boxToDelete, setBoxToDelete] = useState<ProductBox | null>(null);

  const updateStatusMutation = useUpdateProductBoxStatus();
  const deleteMutation = useDeleteProductBox();

  const handleEdit = useCallback(
    (box: ProductBox) => {
      // Navigate to edit page (if needed in future)
      router.push(`/product-boxes/${box.id}`);
    },
    [router],
  );

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

  // Fallback to true since Baskets is a generic concept, but checking role is fine.
  if (profile?.role === "employee") {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-lg">You do not have access to this page.</p>
      </div>
    );
  }

  const totalBaskets = boxesData?.totalRecords || 0;
  const activeBaskets = boxesData?.data?.filter((b) => b.status)?.length || 0;
  const inactiveBaskets = boxesData?.data?.filter((b) => !b.status)?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Baskets
          </h1>
          <p className="mt-1 text-sm text-slate-500">Manage all Baskets.</p>
        </div>
        <Button
          onClick={() => router.push("/product-boxes/add")}
          className="rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-700"
        >
          + Add Basket
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-start justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span> TOTAL BASKETS
            </p>
            <p className="mt-3 text-4xl font-black text-emerald-600">{totalBaskets}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600">
            <Package className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-start justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span> ACTIVE
            </p>
            <p className="mt-3 text-4xl font-black text-emerald-600">{activeBaskets}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-start justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
              <span className="h-2 w-2 rounded-full bg-red-500"></span> INACTIVE
            </p>
            <p className="mt-3 text-4xl font-black text-red-600">{inactiveBaskets}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-100/50 bg-emerald-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-slate-800">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Filter Baskets</p>
              <p className="text-xs text-slate-500">
                Refine baskets by date, country, city, department, category, and status
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex gap-2 text-slate-400 hover:text-slate-600"
          >
            <RotateCcw className="h-3 w-3" /> Reset Filters
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-7">
          <div className="space-y-1">
            <label className="pl-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Country
            </label>
            <Select>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="pl-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              City
            </label>
            <Select>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="pl-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Department
            </label>
            <Select>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="pl-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Category
            </label>
            <Select>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="pl-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              From Date
            </label>
            <Button
              variant="outline"
              className="w-full justify-start bg-white font-normal text-slate-400"
            >
              YYYY-MM-DD
            </Button>
          </div>
          <div className="space-y-1">
            <label className="pl-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              To Date
            </label>
            <Button
              variant="outline"
              className="w-full justify-start bg-white font-normal text-slate-400"
            >
              YYYY-MM-DD
            </Button>
          </div>
          <div className="space-y-1">
            <label className="pl-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Status
            </label>
            <Select defaultValue="all">
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-card text-card-foreground overflow-hidden rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-50 p-6 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg leading-none font-bold tracking-tight">All Baskets</h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                CATALOGUE
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">{totalBaskets} items found</p>
          </div>
        </div>
        <div className="p-6">
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
